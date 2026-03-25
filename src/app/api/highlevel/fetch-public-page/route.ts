import { NextResponse } from "next/server";

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
 */

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

  // Pattern 3: just find a Firebase Storage URL near the keyword
  const idx = html.indexOf("pageDataDownloadUrl");
  if (idx !== -1) {
    const slice = html.slice(idx, idx + 500);
    const m3 = slice.match(/(https?:\/\/firebasestorage\.googleapis\.com\/[^\s"'<>]+)/);
    if (m3) return m3[1];
  }

  return null;
}

function extractPageName(html: string): string {
  // GHL embeds "name":"<page name>" in the SSR state
  const m = html.match(/"name"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (!m) return "";
  try { return JSON.parse('"' + m[1] + '"'); } catch { return m[1]; }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ ok: false, error: "Missing url parameter" }, { status: 400 });
  }

  // Basic URL validation
  let pageUrl: URL;
  try {
    pageUrl = new URL(rawUrl);
    if (!["http:", "https:"].includes(pageUrl.protocol)) throw new Error("bad protocol");
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid URL — must start with https://" }, { status: 400 });
  }

  // 1. Fetch the public page HTML
  let html: string;
  try {
    const res = await fetch(pageUrl.toString(), {
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
    const isTimeout = msg.includes("timeout") || msg.includes("AbortError");
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

  // 3. Fetch element tree from Firebase Storage
  let elementTree: unknown;
  try {
    const fbRes = await fetch(downloadUrl, { signal: AbortSignal.timeout(10000) });
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
