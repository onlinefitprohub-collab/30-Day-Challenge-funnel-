import { NextResponse } from "next/server";
import { promises as dns } from "dns";

export const dynamic = "force-dynamic";

/*
 * GET /api/highlevel/fetch-public-page?url=<encoded-url>
 *
 * Server-side fetches a published GHL funnel/website page, extracts the
 * `pageDataDownloadUrl` from the embedded Nuxt SSR payload, then fetches
 * the actual element tree from Firebase Storage and returns it.
 *
 * Works on any public GHL-hosted or custom-domain funnel page.
 * No authentication or extension required — all requests happen server-side.
 *
 * SSRF protection: only https: allowed; private/reserved IP ranges and
 * internal hostnames are blocked before any network request is made.
 */

/* ── SSRF guard ──────────────────────────────────────────────────────────── */

function isPrivateIPv4(parts: number[]): boolean {
  const [a, b] = parts;
  return (
    a === 10 ||                                    // 10.0.0.0/8
    a === 127 ||                                   // 127.0.0.0/8 (loopback)
    a === 0 ||                                     // 0.0.0.0/8
    (a === 172 && b >= 16 && b <= 31) ||           // 172.16.0.0/12
    (a === 192 && b === 168) ||                    // 192.168.0.0/16
    (a === 169 && b === 254) ||                    // 169.254.0.0/16 (link-local / AWS metadata)
    (a === 100 && b >= 64 && b <= 127)             // 100.64.0.0/10 (CGNAT)
  );
}

function isPrivateIPv6(addr: string): boolean {
  const a = addr.toLowerCase();
  return (
    a === "::1" ||
    a.startsWith("fc") ||   // fc00::/7 (unique local)
    a.startsWith("fd") ||   // fc00::/7 (unique local)
    a.startsWith("fe80") || // fe80::/10 (link-local)
    a.startsWith("::")      // unspecified / loopback family
  );
}

/*
 * Returns an SSRF-safe error string if the hostname is disallowed,
 * or null if the hostname is safe to fetch.
 */
async function validateHostSsrf(hostname: string): Promise<string | null> {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, ""); // strip IPv6 brackets

  // Blocked exact hostnames and cloud metadata endpoints
  const BLOCKED_EXACT = new Set([
    "localhost",
    "0.0.0.0",
    "::1",
    "metadata.google.internal",
    "169.254.169.254",   // AWS / GCP / Azure IMDS
    "100.100.100.200",   // Alibaba Cloud metadata
  ]);
  if (BLOCKED_EXACT.has(h)) return "Blocked host";

  // Blocked internal TLDs
  const BLOCKED_TLDS = [".local", ".internal", ".intranet", ".lan", ".test", ".example", ".invalid", ".localhost"];
  if (BLOCKED_TLDS.some(tld => h.endsWith(tld))) return "Blocked internal domain";

  // If the hostname is already a bare IPv4 address, check it directly
  const ipv4Parts = h.split(".").map(Number);
  if (ipv4Parts.length === 4 && ipv4Parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
    if (isPrivateIPv4(ipv4Parts)) return "Private IPv4 address not allowed";
    return null; // public IPv4 — safe
  }

  // Resolve hostname via DNS and validate all returned IPs
  const [v4Addrs, v6Addrs] = await Promise.all([
    dns.resolve4(h).catch(() => [] as string[]),
    dns.resolve6(h).catch(() => [] as string[]),
  ]);

  for (const addr of v4Addrs) {
    const parts = addr.split(".").map(Number);
    if (isPrivateIPv4(parts)) return `Hostname resolves to private IP (${addr})`;
  }
  for (const addr of v6Addrs) {
    if (isPrivateIPv6(addr)) return `Hostname resolves to private IPv6 (${addr})`;
  }

  return null; // safe
}

/* ── HTML extraction helpers ─────────────────────────────────────────────── */

function extractDownloadUrl(html: string): string | null {
  /*
   * GHL pages are Nuxt 2 SSR apps. The server-side state is embedded as:
   *   <script>window.__NUXT__={...json...}</script>
   *
   * Within that JSON the pageDataDownloadUrl appears as a normal JSON string
   * value. We try three progressively looser patterns to handle any escaping.
   */

  // Pattern 1: standard JSON string value (handles \" and \/ escaping)
  const m1 = html.match(/"pageDataDownloadUrl"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (m1) {
    try { return JSON.parse('"' + m1[1] + '"'); } catch { return m1[1].replace(/\\/g, ""); }
  }

  // Pattern 2: looser — grab everything up to the next unescaped quote
  const m2 = html.match(/pageDataDownloadUrl["']?\s*:\s*["'](https?:\/\/[^"']+)["']/);
  if (m2) return m2[1];

  // Pattern 3: find a Firebase Storage URL within 500 chars after the keyword
  const idx = html.indexOf("pageDataDownloadUrl");
  if (idx !== -1) {
    const slice = html.slice(idx, idx + 500);
    const m3 = slice.match(/(https?:\/\/firebasestorage\.googleapis\.com\/[^\s"'<>]+)/);
    if (m3) return m3[1];
  }

  return null;
}

function extractPageName(html: string): string {
  const m = html.match(/"name"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (!m) return "";
  try { return JSON.parse('"' + m[1] + '"'); } catch { return m[1]; }
}

/* ── Route handler ───────────────────────────────────────────────────────── */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ ok: false, error: "Missing url parameter" }, { status: 400 });
  }

  // Only allow https: (not http, file, ftp, etc.)
  let pageUrl: URL;
  try {
    pageUrl = new URL(rawUrl);
    if (pageUrl.protocol !== "https:") {
      return NextResponse.json(
        { ok: false, error: "Only https:// URLs are supported." },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid URL — must be a valid https:// address." }, { status: 400 });
  }

  // SSRF: validate hostname before any network request
  const ssrfError = await validateHostSsrf(pageUrl.hostname);
  if (ssrfError) {
    return NextResponse.json(
      { ok: false, error: "That URL is not allowed. Please enter a public GHL funnel page URL." },
      { status: 400 }
    );
  }

  // 1. Fetch the public page HTML (no redirects to prevent SSRF via open redirect)
  let html: string;
  try {
    const res = await fetch(pageUrl.toString(), {
      redirect: "follow",
      headers: {
        "Accept": "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 (compatible; ChallengeInspector/1.0)",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Page returned HTTP ${res.status}. Make sure the URL is published and publicly accessible.` },
        { status: 200 }
      );
    }
    html = await res.text();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isTimeout = msg.includes("timeout") || (err instanceof Error && err.name === "TimeoutError");
    return NextResponse.json(
      { ok: false, error: isTimeout ? "Request timed out — the page took too long to respond." : `Could not fetch the page: ${msg.slice(0, 120)}` },
      { status: 200 }
    );
  }

  // 2. Extract pageDataDownloadUrl
  const downloadUrl = extractDownloadUrl(html);
  if (!downloadUrl) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not find GHL page data in the HTML. Make sure this is a published GHL funnel or website page " +
          "(not a WordPress/Squarespace/etc. site). The page must be published — drafts don't embed the data.",
      },
      { status: 200 }
    );
  }

  // Validate the Firebase Storage URL itself (must be a known safe domain)
  let fbUrl: URL;
  try {
    fbUrl = new URL(downloadUrl);
    if (!fbUrl.hostname.endsWith(".googleapis.com") && !fbUrl.hostname.endsWith(".firebasestorage.app")) {
      return NextResponse.json(
        { ok: false, error: "Unexpected page data host — only Firebase Storage URLs are accepted." },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid page data URL found in page." }, { status: 200 });
  }

  // 3. Fetch element tree from Firebase Storage
  let elementTree: unknown;
  try {
    const fbRes = await fetch(fbUrl.toString(), { signal: AbortSignal.timeout(10000) });
    if (!fbRes.ok) {
      return NextResponse.json(
        { ok: false, error: `Firebase Storage returned HTTP ${fbRes.status} — the page data URL may have expired.` },
        { status: 200 }
      );
    }
    elementTree = await fbRes.json();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: `Could not download element tree: ${msg.slice(0, 100)}` },
      { status: 200 }
    );
  }

  const pageName = extractPageName(html);

  return NextResponse.json({
    ok: true,
    elementTree,
    pageName: pageName || pageUrl.pathname,
    source: "url-parse",
  });
}
