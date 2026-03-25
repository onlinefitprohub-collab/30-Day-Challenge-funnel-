import { NextResponse } from "next/server";
import { promises as dns } from "dns";

export const dynamic = "force-dynamic";

/*
 * GET /api/highlevel/fetch-public-page?url=<encoded-url>
 *
 * Fetches a published GHL funnel/website page and extracts its element tree.
 *
 * GHL publishes pages in two formats:
 *  1. Nuxt 3 SSR (current): The full element tree is embedded in the page HTML
 *     inside a <script id="__NUXT_DATA__"> tag using unjs/devalue serialization.
 *  2. Nuxt 2 SSR (older): A `pageDataDownloadUrl` appears in window.__NUXT__ and
 *     points to Firebase Storage where the element tree is stored.
 *
 * This route tries format 1 first, then falls back to format 2.
 *
 * SSRF protection:
 *  - Only https: allowed
 *  - Private/reserved IPs and internal hostnames blocked before any request
 *  - Each redirect hop individually re-validated
 *  - Firebase secondary fetch is domain-allowlisted
 */

/* ── SSRF guard ──────────────────────────────────────────────────────────── */

function isPrivateIPv4(parts: number[]): boolean {
  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) ||
    (a === 100 && b >= 64 && b <= 127)
  );
}

function isPrivateIPv6(addr: string): boolean {
  const a = addr.toLowerCase();
  return a === "::1" || a.startsWith("fc") || a.startsWith("fd") || a.startsWith("fe80") || a.startsWith("::");
}

const BLOCKED_EXACT = new Set([
  "localhost", "0.0.0.0", "::1",
  "metadata.google.internal", "169.254.169.254", "100.100.100.200",
]);
const BLOCKED_TLDS = [".local", ".internal", ".intranet", ".lan", ".test", ".example", ".invalid", ".localhost"];

async function validateHostSsrf(hostname: string): Promise<string | null> {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (BLOCKED_EXACT.has(h)) return "Blocked host";
  if (BLOCKED_TLDS.some(tld => h.endsWith(tld))) return "Blocked internal domain";
  if (isPrivateIPv6(h)) return "Private IPv6 address not allowed";
  const ipv4Parts = h.split(".").map(Number);
  if (ipv4Parts.length === 4 && ipv4Parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
    if (isPrivateIPv4(ipv4Parts)) return "Private IPv4 address not allowed";
    return null;
  }
  const [v4, v6] = await Promise.all([
    dns.resolve4(h).catch(() => [] as string[]),
    dns.resolve6(h).catch(() => [] as string[]),
  ]);
  for (const addr of v4) {
    if (isPrivateIPv4(addr.split(".").map(Number))) return `Hostname resolves to private IP (${addr})`;
  }
  for (const addr of v6) {
    if (isPrivateIPv6(addr)) return `Hostname resolves to private IPv6 (${addr})`;
  }
  return null;
}

/* Manual redirect follower with per-hop SSRF revalidation */
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
      const isTimeout = err instanceof Error && err.name === "TimeoutError";
      return { ok: false, error: isTimeout ? "Request timed out." : `Fetch error: ${String(err).slice(0, 100)}` };
    }
    if (res.status >= 200 && res.status < 300) {
      return { ok: true, text: await res.text() };
    }
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return { ok: false, error: `HTTP ${res.status} redirect with no Location header.` };
      let next: URL;
      try { next = new URL(loc, current); } catch { return { ok: false, error: "Redirect contained an invalid URL." }; }
      if (next.protocol !== "https:") return { ok: false, error: "Redirect to non-https URL blocked." };
      const ssrfErr = await validateHostSsrf(next.hostname);
      if (ssrfErr) return { ok: false, error: "Redirect to a disallowed host was blocked." };
      current = next;
      continue;
    }
    return { ok: false, error: `Page returned HTTP ${res.status}. Make sure the URL is published and publicly accessible.` };
  }
  return { ok: false, error: "Too many redirects." };
}

/* ── Nuxt 3 devalue parser ───────────────────────────────────────────────── */

const DEVALUE_WRAPPERS = new Set(["ShallowReactive", "Ref", "Reactive", "ShallowRef"]);

function resolveDevalue(arr: unknown[], index: number, seen = new Map<number, unknown>()): unknown {
  if (index < 0) return undefined;
  if (seen.has(index)) return seen.get(index);
  const val = arr[index];
  if (val === null || typeof val !== "object") return val;
  if (Array.isArray(val)) {
    // Nuxt devalue special forms: ["ShallowReactive", idx]
    if (val.length === 2 && typeof val[0] === "string" && DEVALUE_WRAPPERS.has(val[0])) {
      return resolveDevalue(arr, val[1] as number, seen);
    }
    const result: unknown[] = [];
    seen.set(index, result);
    for (const v of val) {
      result.push(typeof v === "number" ? resolveDevalue(arr, v, seen) : v);
    }
    return result;
  }
  const result: Record<string, unknown> = {};
  seen.set(index, result);
  for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
    result[k] = typeof v === "number" ? resolveDevalue(arr, v, seen) : v;
  }
  return result;
}

interface GhlElement {
  id: string;
  _id?: string;
  meta?: string;
  type?: string;
  tagName?: string;
  child?: string[];
  [key: string]: unknown;
}

interface CapturedGhlPageData {
  sections: Array<{ id: string; metaData: GhlElement }>;
  rows: Record<string, { id: string; metaData: GhlElement }>;
  columns: Record<string, { id: string; metaData: GhlElement }>;
  elements: Record<string, { id: string; metaData: GhlElement }>;
}

interface FullCapturedPageData extends CapturedGhlPageData {
  fontsForPreview: string[];
  general: Record<string, unknown>;
  id: string;
  pageStyles: string;
  popups: unknown[];
}

interface Nuxt3ParseResult {
  pageData: FullCapturedPageData;
  pageName: string;
  funnelId: string;
  stepId: string;
  locationId: string;
}

function wrapWithMetaData(el: GhlElement): { id: string; metaData: GhlElement } {
  return { id: el.id, metaData: { ...el, element: { ...el } } as GhlElement };
}

function buildPageDataFromElements(rawElements: unknown[]): CapturedGhlPageData {
  const result: CapturedGhlPageData = { sections: [], rows: {}, columns: {}, elements: {} };
  for (const raw of rawElements) {
    const el = raw as GhlElement;
    if (!el || typeof el.id !== "string") continue;
    const meta = el.meta ?? el.type ?? "";
    const wrapped = wrapWithMetaData(el);
    if (meta === "section") {
      result.sections.push(wrapped);
    } else if (meta === "row") {
      result.rows[el.id] = wrapped;
    } else if (meta === "column" || meta === "col") {
      result.columns[el.id] = wrapped;
    } else {
      result.elements[el.id] = wrapped;
    }
  }
  return result;
}

function strFromDevalue(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function looksLikeGhlPageData(obj: unknown): obj is Record<string, unknown> {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  const o = obj as Record<string, unknown>;
  if (!Array.isArray(o.elements) || o.elements.length === 0) return false;
  return (o.elements as unknown[]).some(el => {
    if (!el || typeof el !== "object" || Array.isArray(el)) return false;
    const e = el as Record<string, unknown>;
    const meta = e.meta ?? e.type ?? "";
    return meta === "section";
  });
}

function deepFindGhlPageData(obj: unknown, depth = 0): Record<string, unknown> | null {
  if (depth > 6 || !obj || typeof obj !== "object") return null;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = deepFindGhlPageData(item, depth + 1);
      if (found) return found;
    }
    return null;
  }
  if (looksLikeGhlPageData(obj)) return obj as Record<string, unknown>;
  for (const val of Object.values(obj as Record<string, unknown>)) {
    if (val && typeof val === "object") {
      const found = deepFindGhlPageData(val, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

function tryParseNuxt3(html: string): Nuxt3ParseResult | null {
  // Look for <script id="__NUXT_DATA__" ...>
  const m = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;

  let arr: unknown[];
  try { arr = JSON.parse(m[1]); } catch { return null; }
  if (!Array.isArray(arr) || arr.length < 5) return null;

  // Strategy 1: resolve from the Nuxt state root (arr[0]) and deep-search the
  // resolved object tree for an object with an `elements` array of GHL nodes.
  let pageData: Record<string, unknown> | null = null;
  try {
    const root = resolveDevalue(arr, 0);
    pageData = deepFindGhlPageData(root);
  } catch { /* ignore */ }

  // Strategy 2: fallback — scan ALL entries in the raw array for a node that
  // has an `elements` key (before devalue resolution) then resolve it.
  if (!pageData) {
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      if (val && typeof val === "object" && !Array.isArray(val) && "elements" in (val as object)) {
        try {
          const resolved = resolveDevalue(arr, i) as Record<string, unknown>;
          if (looksLikeGhlPageData(resolved)) { pageData = resolved; break; }
        } catch { /* continue */ }
      }
    }
  }

  if (!pageData) return null;

  const rawElements = pageData.elements as unknown[];

  const pageName   = strFromDevalue(pageData.pageName)   || strFromDevalue(pageData.domainName);
  const funnelId   = strFromDevalue(pageData.funnelId);
  const locationId = strFromDevalue(pageData.locationId);
  const rawStepId  = pageData.stepId;
  const stepId     = rawStepId != null ? String(rawStepId) : "";

  // Build envelope from whatever font/popup data the devalue tree exposed,
  // falling back to GHL defaults so the pageData is always a complete record.
  const STANDARD_FONTS = ["Arial","Lato","Roboto","Open Sans","Oxygen","Oswald","Montserrat","Manrope","Poppins","Bebas Neue"];
  const PREVIEW_FONTS  = ["Roboto","Montserrat","Bebas Neue","Poppins"];

  const rawFonts    = pageData.fontsToLoad;
  const fontsToLoad = Array.isArray(rawFonts)
    ? (rawFonts as unknown[]).filter(f => typeof f === "string") as string[]
    : STANDARD_FONTS;

  const rawPopup = pageData.popup;
  const popups   = Array.isArray(pageData.popups)
    ? pageData.popups
    : rawPopup != null ? [rawPopup] : [];

  const fontsForPreview = PREVIEW_FONTS.map(f => `'${f}'`);

  const general: Record<string, unknown> = {
    general: {
      colors: [
        { label: "Primary",     value: "#37ca37" },
        { label: "Secondary",   value: "#188bf6" },
        { label: "White",       value: "#ffffff"  },
        { label: "Gray",        value: "#cbd5e0"  },
        { label: "Black",       value: "#000000"  },
        { label: "Transparent", value: "transparent" },
      ],
      customFonts: [],
      fontsToLoad: fontsToLoad.length ? fontsToLoad : STANDARD_FONTS,
      fontsToLoadForPreview: PREVIEW_FONTS,
      pageStyles: strFromDevalue(pageData.pageStyles) ||
        `body { font-family: var(--contentfont, 'Roboto', sans-serif); }`,
    },
  };

  const pageStyles = strFromDevalue(pageData.pageStyles) ||
    `:root{ --primary: #37ca37;\n--secondary: #188bf6;\n--white: #ffffff;\n--gray: #cbd5e0;\n--black: #000000;\n--transparent: transparent;\n}`;

  const id = strFromDevalue(pageData.id) || Math.random().toString(36).slice(2, 14);

  const elementTree = buildPageDataFromElements(rawElements as GhlElement[]);

  const fullPageData: FullCapturedPageData = {
    ...elementTree,
    fontsForPreview,
    general,
    id,
    pageStyles,
    popups,
  };

  return { pageData: fullPageData, pageName, funnelId, stepId, locationId };
}

/* ── Nuxt 2 / Firebase fallback ─────────────────────────────────────────── */

function extractDownloadUrl(html: string): string | null {
  const m1 = html.match(/"pageDataDownloadUrl"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (m1) {
    try { return JSON.parse('"' + m1[1] + '"'); } catch { return m1[1].replace(/\\/g, ""); }
  }
  const m2 = html.match(/pageDataDownloadUrl["']?\s*:\s*["'](https?:\/\/[^"']+)["']/);
  if (m2) return m2[1];
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

  let pageUrl: URL;
  try {
    pageUrl = new URL(rawUrl);
    if (pageUrl.protocol !== "https:") {
      return NextResponse.json({ ok: false, error: "Only https:// URLs are supported." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid URL — must be a valid https:// address." }, { status: 400 });
  }

  const ssrfError = await validateHostSsrf(pageUrl.hostname);
  if (ssrfError) {
    return NextResponse.json(
      { ok: false, error: "That URL is not allowed. Please enter a public GHL funnel page URL." },
      { status: 400 }
    );
  }

  // 1. Fetch page HTML with manual redirect handling (per-hop SSRF revalidation)
  const pageResult = await safeFetch(pageUrl, {
    "Accept": "text/html,application/xhtml+xml",
    "User-Agent": "Mozilla/5.0 (compatible; ChallengeInspector/1.0)",
  });

  if (!pageResult.ok) {
    return NextResponse.json({ ok: false, error: pageResult.error }, { status: 200 });
  }

  const html = pageResult.text;

  // 2a. Try Nuxt 3 devalue format (current GHL format — element tree embedded in HTML)
  const nuxt3Result = tryParseNuxt3(html);
  if (nuxt3Result) {
    return NextResponse.json({
      ok:          true,
      elementTree: nuxt3Result.pageData,
      pageName:    nuxt3Result.pageName,
      funnelId:    nuxt3Result.funnelId,
      stepId:      nuxt3Result.stepId,
      locationId:  nuxt3Result.locationId,
      source:      "url-parse-nuxt3",
    });
  }

  // 2b. Fallback: try Nuxt 2 format (older GHL pages with pageDataDownloadUrl)
  const downloadUrl = extractDownloadUrl(html);
  if (!downloadUrl) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not extract page data from this URL. Make sure it is a published GHL funnel or website page. " +
          "The page must be published (not saved as draft) and must be a GHL-built page.",
      },
      { status: 200 }
    );
  }

  // Validate Firebase Storage URL
  let fbUrl: URL;
  try {
    fbUrl = new URL(downloadUrl);
    const allowedFbHost =
      fbUrl.hostname.endsWith(".googleapis.com") || fbUrl.hostname.endsWith(".firebasestorage.app");
    if (fbUrl.protocol !== "https:" || !allowedFbHost) {
      return NextResponse.json(
        { ok: false, error: "Unexpected page data URL format." },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid page data URL found in page." }, { status: 200 });
  }

  // Fetch element tree from Firebase Storage
  let elementTree: unknown;
  try {
    const fbRes = await fetch(fbUrl.toString(), { signal: AbortSignal.timeout(10000) });
    if (!fbRes.ok) {
      return NextResponse.json(
        { ok: false, error: `Firebase Storage returned HTTP ${fbRes.status}.` },
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

  return NextResponse.json({
    ok: true,
    elementTree,
    pageName: extractPageName(html),
    source: "url-parse",
  });
}
