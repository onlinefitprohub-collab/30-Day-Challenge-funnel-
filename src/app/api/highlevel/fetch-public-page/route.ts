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
 * SSRF protection:
 *  - Only https: allowed
 *  - Private/reserved IPs and internal hostnames blocked before any request
 *  - Each redirect hop is individually validated against the same blocklist
 *  - Firebase Storage secondary fetch is domain-allowlisted
 */

/* ── SSRF helpers ────────────────────────────────────────────────────────── */

function isPrivateIPv4(parts: number[]): boolean {
  const [a, b] = parts;
  return (
    a === 10 ||                                    // 10.0.0.0/8
    a === 127 ||                                   // 127.0.0.0/8 (loopback)
    a === 0 ||                                     // 0.0.0.0/8
    (a === 172 && b >= 16 && b <= 31) ||           // 172.16.0.0/12
    (a === 192 && b === 168) ||                    // 192.168.0.0/16
    (a === 169 && b === 254) ||                    // 169.254.0.0/16 (link-local / IMDS)
    (a === 100 && b >= 64 && b <= 127)             // 100.64.0.0/10 (CGNAT)
  );
}

function isPrivateIPv6(addr: string): boolean {
  const a = addr.toLowerCase();
  return (
    a === "::1" ||
    a.startsWith("fc") ||    // fc00::/7 (unique local)
    a.startsWith("fd") ||    // fc00::/7 (unique local)
    a.startsWith("fe80") ||  // fe80::/10 (link-local)
    a.startsWith("::")       // loopback / unspecified family
  );
}

const BLOCKED_EXACT = new Set([
  "localhost",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
  "169.254.169.254",  // AWS / GCP / Azure IMDS
  "100.100.100.200",  // Alibaba Cloud metadata
]);

const BLOCKED_TLDS = [
  ".local", ".internal", ".intranet", ".lan",
  ".test", ".example", ".invalid", ".localhost",
];

async function validateHostSsrf(hostname: string): Promise<string | null> {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, ""); // strip IPv6 brackets

  if (BLOCKED_EXACT.has(h)) return "Blocked host";
  if (BLOCKED_TLDS.some(tld => h.endsWith(tld))) return "Blocked internal domain";

  // If already a bare IPv4, validate directly without DNS
  const ipv4Parts = h.split(".").map(Number);
  if (ipv4Parts.length === 4 && ipv4Parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
    if (isPrivateIPv4(ipv4Parts)) return "Private IPv4 address not allowed";
    return null;
  }

  // Resolve hostname and check all returned IPs
  const [v4, v6] = await Promise.all([
    dns.resolve4(h).catch(() => [] as string[]),
    dns.resolve6(h).catch(() => [] as string[]),
  ]);
  for (const addr of v4) {
    const parts = addr.split(".").map(Number);
    if (isPrivateIPv4(parts)) return `Hostname resolves to private IP (${addr})`;
  }
  for (const addr of v6) {
    if (isPrivateIPv6(addr)) return `Hostname resolves to private IPv6 (${addr})`;
  }
  return null;
}

/*
 * safeFetch — follows redirects manually with per-hop SSRF re-validation.
 * Only https: is allowed. Max 5 hops.
 */
async function safeFetch(
  startUrl: URL,
  headers: Record<string, string>,
  maxHops = 5,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  let current = startUrl;

  for (let hop = 0; hop < maxHops; hop++) {
    let res: Response;
    try {
      res = await fetch(current.toString(), {
        redirect: "manual",
        headers,
        signal: AbortSignal.timeout(12000),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isTimeout = err instanceof Error && err.name === "TimeoutError";
      return { ok: false, error: isTimeout ? "Request timed out." : `Fetch error: ${msg.slice(0, 100)}` };
    }

    // Success
    if (res.status >= 200 && res.status < 300) {
      const text = await res.text();
      return { ok: true, text };
    }

    // Redirect — validate the target before following
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) {
        return { ok: false, error: `HTTP ${res.status} redirect with no Location header.` };
      }

      let next: URL;
      try {
        next = new URL(location, current); // handles relative redirects
      } catch {
        return { ok: false, error: "Redirect contained an invalid URL." };
      }

      // Only allow https: after redirects
      if (next.protocol !== "https:") {
        return { ok: false, error: "Redirect to a non-https URL was blocked for security." };
      }

      // SSRF-check the redirect destination before following
      const ssrfErr = await validateHostSsrf(next.hostname);
      if (ssrfErr) {
        return { ok: false, error: "Redirect to a disallowed host was blocked." };
      }

      current = next;
      continue;
    }

    return { ok: false, error: `Page returned HTTP ${res.status}. Make sure the URL is published and publicly accessible.` };
  }

  return { ok: false, error: "Too many redirects." };
}

/* ── HTML extraction helpers ─────────────────────────────────────────────── */

function extractDownloadUrl(html: string): string | null {
  /*
   * GHL pages are Nuxt 2 SSR apps. The server-side state is embedded as:
   *   <script>window.__NUXT__={...json...}</script>
   *
   * We try three progressively looser patterns to handle any escaping.
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

  // Only allow https:
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
    return NextResponse.json(
      { ok: false, error: "Invalid URL — must be a valid https:// address." },
      { status: 400 }
    );
  }

  // SSRF: validate the initial hostname before any network request
  const ssrfError = await validateHostSsrf(pageUrl.hostname);
  if (ssrfError) {
    return NextResponse.json(
      { ok: false, error: "That URL is not allowed. Please enter a public GHL funnel page URL." },
      { status: 400 }
    );
  }

  // 1. Fetch the page HTML with manual redirect handling (each hop re-validated)
  const pageResult = await safeFetch(pageUrl, {
    "Accept": "text/html,application/xhtml+xml",
    "User-Agent": "Mozilla/5.0 (compatible; ChallengeInspector/1.0)",
  });

  if (!pageResult.ok) {
    return NextResponse.json({ ok: false, error: pageResult.error }, { status: 200 });
  }

  const html = pageResult.text;

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

  // Validate the Firebase Storage URL (must be a known safe domain)
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
    return NextResponse.json(
      { ok: false, error: "Invalid page data URL found in page." },
      { status: 200 }
    );
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
