// background.js — Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    console.log("[CF Funnel] Installed v2.38.0 — fix GHL hang: keep `element` snapshot field in flat nodes (native GHL format); prior versions stripped it causing GHL renderer to stall.");
  }
  if (reason === "update") {
    console.log("[CF Funnel] Updated to v2.38.0 — fix GHL hang: keep `element` snapshot field in flat nodes (native GHL format); prior versions stripped it causing GHL renderer to stall.");
  }

  // On install/update: re-inject content.js into already-open GHL and Replit tabs.
  // The manifest <all_urls> match handles new navigations; this handles open tabs.
  if (reason === "install" || reason === "update") {
    const re = /^https:\/\/(app\.gohighlevel\.com|[^/]*\.replit\.(dev|app|com))\//;
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (!tab.url || !re.test(tab.url)) continue;
        chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          files: ["content.js"],
        }).catch(() => {});
      }
    });
  }
});

// Dynamic injection fallback for GHL and Replit tabs.
// The manifest <all_urls> match handles any-domain app pages declaratively;
// this listener re-injects into tabs that were already open before install/update.
const CF_INJECT_RE = /^https:\/\/(app\.gohighlevel\.com|[^/]*\.replit\.(dev|app|com))\//;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  const url = tab.url ?? "";
  if (!CF_INJECT_RE.test(url)) return;
  chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    files: ["content.js"],
  }).catch(() => {});
});

/* ════════════════════════════════════════════════════════════════════════════
   MAIN-WORLD INLINE FUNCTIONS
   These are injected into GHL pages via chrome.scripting.executeScript().
   They run in MAIN world and can access window globals + revexBackendService.
   ════════════════════════════════════════════════════════════════════════════ */

/* Extract funnelId + stepId from any GHL page (public funnel or builder).
   Searches Nuxt payload, window.attribution, window globals, and inline scripts. */
function _cf_extractGhlMetadata() {
  const w = window;
  const log = [];

  function extractIds(str, source) {
    const fm = str.match(/"funnelId"\s*:\s*"([A-Za-z0-9_\-]{8,}?)"/);
    const sm = str.match(/"stepId"\s*:\s*"([A-Za-z0-9_\-]{8,}?)"/);
    if (fm && sm) {
      const lm  = str.match(/"locationId"\s*:\s*"([A-Za-z0-9_\-]{8,}?)"/);
      const pnm = str.match(/"(?:pageName|page_name)"\s*:\s*"([^"]{1,80})"/);
      return JSON.stringify({
        ok: true,
        funnelId:   fm[1],
        stepId:     sm[1],
        locationId: lm?.[1]  ?? w.attribution?.locationId ?? "",
        pageName:   pnm?.[1] ?? "",
        source,
        log: log.join(" | "),
      });
    }
    return null;
  }

  try {
    const locationId = w.attribution?.locationId ?? "";
    log.push(`attr.locationId=${locationId || "(none)"}`);

    // 1. Nuxt app (GHL builder / funnel pages use Nuxt)
    if (typeof w.useNuxtApp === "function") {
      log.push("useNuxtApp=ok");
      try {
        const nuxt = w.useNuxtApp();
        const payload = nuxt?.payload?.data ?? nuxt?._data ?? {};
        const keys = Object.keys(payload);
        for (const k of keys) {
          const v = payload[k];
          if (v && typeof v === "object" && (v.funnelId || v.funnel_id)) {
            return JSON.stringify({
              ok: true,
              funnelId:   v.funnelId   ?? v.funnel_id,
              stepId:     v.stepId     ?? v.step_id     ?? "",
              locationId: locationId   || v.locationId  || v.location_id || "",
              pageName:   v.pageName   ?? v.page_name   ?? v.name ?? "",
              source: `nuxt.payload.${k}`,
              log: log.join(" | "),
            });
          }
        }
        const hit = extractIds(JSON.stringify(payload), "nuxt.payload-serialized");
        if (hit) return hit;
      } catch(e) { log.push(`nuxt threw: ${String(e).slice(0, 60)}`); }
    }

    // 2. __NUXT__ global
    if (w.__NUXT__) {
      log.push("__NUXT__=found");
      const hit = extractIds(JSON.stringify(w.__NUXT__), "__NUXT__");
      if (hit) return hit;
    }

    // 3. Common window globals
    for (const key of ["pageData","funnel","funnelData","pageInfo","stepData","__GHL__","__HL__","ghlPage","attribution"]) {
      const val = w[key];
      if (!val || typeof val !== "object") continue;
      if (val.funnelId && val.stepId) {
        return JSON.stringify({
          ok: true,
          funnelId:   val.funnelId,
          stepId:     val.stepId,
          locationId: locationId || val.locationId || "",
          pageName:   val.pageName ?? val.name ?? "",
          source:     `window.${key}`,
          log: log.join(" | "),
        });
      }
      const hit = extractIds(JSON.stringify(val), `window.${key}`);
      if (hit) return hit;
    }

    // 4. Inline script tags containing funnelId
    for (const el of Array.from(document.querySelectorAll("script:not([src])"))) {
      const t = el.textContent ?? "";
      if (!t.includes("funnelId")) continue;
      const hit = extractIds(t, `dom-script[id=${el.id || "?"}]`);
      if (hit) return hit;
    }

    log.push("not-found");
    return JSON.stringify({ ok: false, error: "funnelId/stepId not found in page", log: log.join(" | ") });
  } catch(e) {
    return JSON.stringify({ ok: false, error: String(e).slice(0, 100), log: log.join(" | ") });
  }
}

/* Get destination page info from GHL builder using revex (MAIN world). */
async function _cf_getBuilderInfo(builderId) {
  try {
    const appMap = window.app ?? {};
    let revex = null;

    // Try window.app entries (how GHL's Nuxt app exposes it)
    for (const ai of Object.values(appMap)) {
      const r = ai?.appContext?.config?.globalProperties?.revexBackendService;
      if (r && (typeof r.get === "function" || typeof r.post === "function")) {
        revex = r;
        break;
      }
    }

    // Fallback: #app.__vue_app__
    if (!revex) {
      const appEl = document.querySelector("#app");
      revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    }

    if (!revex) {
      return JSON.stringify({ ok: false, error: "revexBackendService not found — make sure you are on the GHL builder tab" });
    }

    const resp = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
    const data = resp?.data ?? resp;
    return JSON.stringify({
      ok:         true,
      funnelId:   data?.funnelId   ?? data?.funnel_id   ?? "",
      stepId:     data?.stepId     ?? data?.step_id     ?? "",
      locationId: data?.locationId ?? data?.location_id ?? "",
      pageId:     data?.pageId     ?? data?.page_id     ?? "",
      raw:        JSON.stringify(data).slice(0, 300),
    });
  } catch(e) {
    return JSON.stringify({ ok: false, error: `_cf_getBuilderInfo: ${String(e).slice(0, 140)}` });
  }
}

/* Fetch full pageData from GHL builder for schema inspection (MAIN world).
 * Tries GET /funnels/funnel/page/{builderId} first (same path used by inject PUT).
 * Falls back to GET /funnels/page/{builderId} if that errors.
 * Returns { ok, data } serialised as JSON string. */
async function _cf_fetchFullPageData(builderId) {
  try {
    const appMap = window.app ?? {};
    let revex = null;

    for (const ai of Object.values(appMap)) {
      const r = ai?.appContext?.config?.globalProperties?.revexBackendService;
      if (r && typeof r.get === "function") { revex = r; break; }
    }
    if (!revex) {
      const appEl = document.querySelector("#app");
      revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    }
    if (!revex) {
      return JSON.stringify({ ok: false, error: "revexBackendService not found" });
    }

    // Step 1: GET page metadata (contains pageDataDownloadUrl → Firebase Storage)
    let metadata = null;
    try {
      const r1 = await revex.get(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`);
      metadata = r1?.data ?? r1;
    } catch (e1) {
      try {
        const r2 = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
        metadata = r2?.data ?? r2;
      } catch (e2) {
        return JSON.stringify({ ok: false, error: `both endpoints failed — primary: ${String(e1).slice(0, 80)}` });
      }
    }

    if (!metadata) return JSON.stringify({ ok: false, error: "empty response from GHL" });

    // Step 2: Follow pageDataDownloadUrl to get the REAL element tree from Firebase Storage.
    // The GHL API only returns page metadata; the actual sections/rows/columns/elements
    // are stored in Firebase Storage and downloaded via this public URL.
    const downloadUrl = metadata.pageDataDownloadUrl ?? metadata.data?.pageDataDownloadUrl ?? null;
    if (downloadUrl && typeof downloadUrl === "string") {
      try {
        const fbRes = await fetch(downloadUrl);
        if (fbRes.ok) {
          const elementTree = await fbRes.json();
          return JSON.stringify({
            ok:       true,
            data:     JSON.parse(JSON.stringify(elementTree)),
            source:   "firebase",
            pageName: metadata.name ?? "",
          });
        }
        // Firebase fetch failed (non-2xx) — fall through to metadata fallback
      } catch (_fbErr) {
        // Network error — fall through to metadata fallback
      }
    }

    // Fallback: return metadata with a warning so the inspector can explain the situation
    return JSON.stringify({
      ok:      true,
      data:    JSON.parse(JSON.stringify(metadata)),
      source:  "metadata",
      warning: downloadUrl
        ? "Firebase download failed — showing page metadata instead of the element tree"
        : "pageDataDownloadUrl not found in GHL response — showing page metadata instead of the element tree",
    });
  } catch (e) {
    return JSON.stringify({ ok: false, error: `_cf_fetchFullPageData: ${String(e).slice(0, 140)}` });
  }
}

/* Clone source GHL step into destination step using revex (MAIN world). */
async function _cf_cloneFunnelStep(req) {
  try {
    const appEl = document.querySelector("#app");
    let revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;

    if (!revex) {
      for (const ai of Object.values(window.app ?? {})) {
        const r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && (typeof r.post === "function")) { revex = r; break; }
      }
    }

    if (!revex) {
      return JSON.stringify({ ok: false, error: "revexBackendService not found — must be on the GHL builder tab" });
    }

    // Try to get userId (optional, CloneLevel includes it)
    let userId = "";
    try {
      if (typeof window.AppUtils !== "undefined" && window.AppUtils?.Utilities?.getCurrentUser) {
        const u = await window.AppUtils.Utilities.getCurrentUser();
        userId = u?.id ?? u?.userId ?? "";
      }
    } catch(_) {}

    const payload = {
      funnelId:              req.destFunnelId,
      funnelIdToImport:      req.sourceFunnelId,
      funnels:               [req.destFunnelId],
      locationId:            req.locationId,
      pageIndexToImport:     "0",
      pageIndexToImportInto: "0",
      stepId:                req.sourceStepId,
      stepIdToImportInto:    req.destStepId,
    };
    if (userId) payload.userId = userId;

    console.log("[CF] clone-funnel-step payload:", JSON.stringify(payload).slice(0, 300));

    const response = await revex.post(
      "https://backend.leadconnectorhq.com/funnels/funnel/clone-funnel-step/",
      payload
    );
    const data   = response?.data ?? response;
    const status = typeof response?.status === "number" ? response.status
                 : typeof data?.status     === "number" ? data.status : 0;

    if (status >= 400) {
      return JSON.stringify({
        ok:      false,
        error:   `HTTP ${status}: ${data?.message ?? data?.response ?? "server error"}`,
        raw:     JSON.stringify(data).slice(0, 300),
        payload: JSON.stringify(payload).slice(0, 300),
      });
    }

    const ok = !data?.status || data?.status === "ok" || status < 300 || status === 0;
    return JSON.stringify({ ok, status, raw: JSON.stringify(data).slice(0, 400) });
  } catch(e) {
    const status = e?.response?.status;
    const data   = e?.response?.data;
    return JSON.stringify({
      ok:    false,
      error: `clone-funnel-step threw: ${data?.message ?? String(e).slice(0, 120)}`,
      status,
    });
  }
}

/* LEGACY: Inject via revex.put() — kept for reference only.
   This approach silently fails: GHL's PUT endpoint returns 200 but only updates
   metadata; the element tree lives in Firebase Storage and is never written.
   New injections use _cf_injectViaBuilderSave (below) instead.
   Returns { ok, status, raw, method, error?, metaStatus? } serialised as JSON. */
async function _cf_injectPageData(builderId, locationId, pageData) {
  try {
    let revex = null;

    // Try #app.__vue_app__ first
    const appEl = document.querySelector("#app");
    revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;

    // Fallback: window.app entries
    if (!revex) {
      for (const ai of Object.values(window.app ?? {})) {
        const r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && typeof r.put === "function") { revex = r; break; }
      }
    }

    if (!revex) {
      return JSON.stringify({ ok: false, error: "revexBackendService not found — make sure the GHL builder is fully loaded" });
    }

    // Step 1: fetch page metadata so we can include name/funnelId/stepId in the PUT
    let pageMeta = {};
    let metaStatus = null;
    try {
      const metaResp = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
      pageMeta = metaResp?.data ?? metaResp ?? {};
      metaStatus = metaResp?.status ?? 200;
      console.log("[CF] _cf_injectPageData: meta fetched", JSON.stringify(pageMeta).slice(0, 200));
    } catch(metaErr) {
      console.warn("[CF] _cf_injectPageData: could not fetch page metadata:", metaErr?.message ?? String(metaErr).slice(0, 80));
    }

    const payload = {
      pageData,
      locationId,
      pageId:      builderId,
      isPublished: pageMeta.isPublished ?? false,
      // Include metadata fields GHL may require for a valid PUT
      ...(pageMeta.name     ? { name:     pageMeta.name     } : {}),
      ...(pageMeta.funnelId ? { funnelId: pageMeta.funnelId } : {}),
      ...(pageMeta.stepId   ? { stepId:   pageMeta.stepId   } : {}),
    };

    console.log("[CF] _cf_injectPageData: PUT to", builderId,
      "sections:", pageData?.sections?.length ?? 0,
      "rows:", Object.keys(pageData?.rows ?? {}).length,
      "elements:", Object.keys(pageData?.elements ?? {}).length,
      "meta:", pageMeta.name, pageMeta.funnelId);

    // Step 2: try primary endpoint /funnels/funnel/page/{id}
    const tryPut = async (url) => {
      try {
        const resp = await revex.put(url, payload);
        const data   = resp?.data ?? resp;
        const status = typeof resp?.status === "number" ? resp.status
                     : typeof data?.status === "number" ? data.status : 200;
        return { data, status };
      } catch(e) {
        const status = e?.response?.status ?? null;
        const data   = e?.response?.data ?? { message: String(e).slice(0, 200) };
        return { data, status, threw: true };
      }
    };

    let r = await tryPut(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`);
    let method = "funnel-page";

    // Step 3: if primary fails (4xx or threw), try alternative endpoint
    if (r.threw || (r.status !== null && r.status >= 400)) {
      console.warn("[CF] _cf_injectPageData: primary endpoint failed (status", r.status, "), trying /funnels/page/");
      const r2 = await tryPut(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
      if (!r2.threw && (r2.status === null || r2.status < 400)) {
        r = r2;
        method = "page";
      } else {
        // Both failed — return a clear, user-friendly explanation of the GHL limitation
        return JSON.stringify({
          ok:         false,
          error:      "GHL doesn't support direct content injection via its API — the page element tree is stored in Firebase Storage and can't be written this way. To get your AI content into GHL, use the URL Inspector tab: paste your GHL page builder URL, click Fetch, then use 'Clone to GHL' with a real GHL page open.",
          status:     r.status,
          metaStatus,
          raw:        JSON.stringify({ primary: r.data, alt: r2.data }).slice(0, 500),
          method:     "both-failed",
        });
      }
    }

    if (r.status !== null && r.status >= 400) {
      return JSON.stringify({
        ok:         false,
        error:      "GHL doesn't support direct content injection via its API — the page element tree is stored in Firebase Storage and can't be written this way. To get your AI content into GHL, use the URL Inspector tab: paste your GHL page builder URL, click Fetch, then use 'Clone to GHL' with a real GHL page open.",
        status:     r.status,
        metaStatus,
        raw:        JSON.stringify(r.data).slice(0, 400),
        method,
      });
    }

    return JSON.stringify({ ok: true, status: r.status ?? 200, metaStatus, raw: JSON.stringify(r.data).slice(0, 300), method });
  } catch(e) {
    return JSON.stringify({ ok: false, error: `_cf_injectPageData threw: ${String(e).slice(0, 180)}` });
  }
}

/* ─── _cf_injectViaBuilderSave ──────────────────────────────────────────────
 * Tries three escalating approaches to write pageData into GHL's page store.
 * Approach 1 — GHL-signed upload URL (pageDataUploadUrl in metadata)
 * Approach 2 — Firebase Storage REST write with Firebase ID token
 * Approach 3 — Vue/Pinia builder state mutation + trigger native save
 * Each attempt is wrapped in try/catch and collects diagnostic info.
 * Returns { ok, method, diag, error? } serialised as JSON.
 * ─────────────────────────────────────────────────────────────────────────── */
async function _cf_injectViaBuilderSave(builderId, locationId, pageData, cachedBucket) {
  const diag = { approach0: null, approach1: null, approach2: null, approach2b: null, approach3: null, approach5: null };
  try {
    /* ════════════════════════════════════════════════════════════════════════
       APPROACH 0: Write AI content to every likely GHL clipboard localStorage key.
       GHL builder copy-paste stores section JSON in localStorage — we don't know
       which key, so we write to all candidates.  Zero risk: writes are reversible.
       If any key matches, pressing Ctrl+V in the GHL builder will paste the content
       using GHL's OWN paste mechanism (no Firebase write needed from our side).
       ════════════════════════════════════════════════════════════════════════ */
    {
      const clipKeys = [
        "hl-copy-element",   "hl_copy_element",   "builder-clipboard",
        "ghl-clipboard",     "funnel-clipboard",   "section-clipboard",
        "hl-page-clipboard", "highlevel_clipboard","page-builder-clipboard",
        "hl-section-copy",   "hl_section_copy",    "hl-builder-copy",
      ];
      const clipPayload = JSON.stringify({
        type:     "section",
        sections: pageData.sections,
        rows:     pageData.rows,
        columns:  pageData.columns ?? pageData.cols ?? {},
        elements: pageData.elements,
      });
      const attempts = [];
      for (const k of clipKeys) {
        try { localStorage.setItem(k, clipPayload); attempts.push(k + ":ok"); }
        catch (e)  { attempts.push(k + ":err"); }
      }
      diag.approach0 = { keys: attempts, hint: "Try Ctrl+V in the GHL builder — if GHL reads from any of these keys it will paste natively." };
    }

    /* ── Find revex for metadata fetch (used by approaches 1 and 2) ─────── */
    let revex = null;
    const appEl = document.querySelector("#app");
    revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    if (!revex) {
      for (const ai of Object.values(window.app ?? {})) {
        const r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && typeof r.get === "function") { revex = r; break; }
      }
    }

    /* ── 1. Fetch GHL page metadata (needed for approaches 1 and 2) ─────── */
    let metadata = null;
    if (revex) {
      try {
        const r = await revex.get(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`);
        metadata = r?.data ?? r ?? null;
      } catch (_) {
        try {
          const r2 = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
          metadata = r2?.data ?? r2 ?? null;
        } catch (_2) {}
      }
    }
    const downloadUrl = metadata?.pageDataDownloadUrl ?? null;
    const uploadUrl   = metadata?.pageDataUploadUrl   ?? null;
    diag.metaOk = !!metadata;

    /* ════════════════════════════════════════════════════════════════════════
       APPROACH 5: GHL native sync endpoint (discovered via network capture)
       POST /funnels/builder/prebuilt-section/sync/changes
       This is the EXACT endpoint GHL's own builder calls when saving a page.
       Captured by intercepting live network traffic (v2.40.0 research).
       Payload: { pageData, locationId, pageId, write: false, isPublished: false }
       Success = HTTP 201 { prebuiltSectionTemplates: [], traceId: "..." }
       Use write: false to match GHL's native behavior (read-only sync).
       Firebase write (A2) still runs for persistence; this notifies GHL backend.
       ════════════════════════════════════════════════════════════════════════ */
    {
      const a5 = {};
      try {
        const a5LocId = (window.location.href.match(/\/location\/([^/]+)\//) ?? [])[1] ?? locationId ?? "";
        a5.locationId = a5LocId;

        if (!revex) {
          a5.result = "skipped-no-revex";
        } else {
          /* Build flat sections payload (same flattenForFirebase logic as Approach 2).
           * Sections keep metaData wrapper; rows/cols/elements are flat top-level objects. */
          const _a5flat = (key, v) => {
            if (!v || typeof v !== "object") return v;
            if (v.metaData && typeof v.metaData === "object") {
              return { wrapper: {}, class: {}, customCss: "", tag: "", mobileWrapper: {}, mobileExtra: {}, id: v.id ?? key, ...v.metaData };
            }
            return v;
          };
          const pd5 = pageData;
          const rows5 = Object.fromEntries(Object.entries(pd5.rows    ?? {}).map(([k, v]) => [k, _a5flat(k, v)]));
          const cols5 = Object.fromEntries(Object.entries(pd5.columns ?? {}).map(([k, v]) => [k, _a5flat(k, v)]));
          const els5  = Object.fromEntries(Object.entries(pd5.elements ?? {}).map(([k, v]) => [k, _a5flat(k, v)]));
          const fId5  = metadata?.funnelId ?? "";
          const secs5 = (pd5.sections ?? []).map((sec, si) => {
            const childRowIds5 = Array.isArray(sec.metaData?.child) ? sec.metaData.child : [];
            const flatEls5 = [];
            for (const rowId of childRowIds5) {
              const row = rows5[rowId]; if (!row) continue; flatEls5.push(row);
              for (const colId of (Array.isArray(row.child) ? row.child : [])) {
                const col = cols5[colId]; if (!col) continue; flatEls5.push(col);
                for (const elmId of (Array.isArray(col.child) ? col.child : [])) {
                  const elm = els5[elmId]; if (elm) flatEls5.push(elm);
                }
              }
            }
            return { id: sec.id, metaData: { ...sec.metaData }, elements: flatEls5,
                     sequence: si, pageId: builderId, funnelId: fId5,
                     locationId: a5LocId, general: {} };
          });
          const syncPageData = { ...pd5, id: builderId, sections: secs5, rows: {}, columns: {}, elements: {} };
          const syncBody = { pageData: syncPageData, locationId: a5LocId, pageId: builderId, write: false, isPublished: metadata?.isPublished ?? false };
          const syncUrl  = "https://backend.leadconnectorhq.com/funnels/builder/prebuilt-section/sync/changes";
          const extraHdr = { channel: "APP", source: "WEB_USER", version: "2021-07-28" };
          a5.sectionCount = secs5.length;
          a5.sec0ElemCount = secs5[0]?.elements?.length ?? 0;

          /* Primary: use revex (auto-adds Authorization) + extra GHL headers */
          try {
            const r5 = await revex.post(syncUrl, syncBody, { headers: extraHdr });
            const d5 = r5?.data ?? {};
            a5.http        = r5?.status ?? 200;
            a5.ok          = a5.http === 201 || a5.http === 200;
            a5.traceId     = d5?.traceId ?? null;
            a5.prebuiltCnt = (d5?.prebuiltSectionTemplates ?? []).length;
            a5.result      = `ok-revex http=${a5.http}${a5.traceId ? " traceId=" + a5.traceId.slice(0, 12) : ""}`;
          } catch (_r5) {
            const st5 = _r5?.response?.status ?? "err";
            a5.revexError = `${st5}: ${String(_r5?.message ?? _r5).slice(0, 60)}`;
            /* Fallback: extract Bearer token from revex defaults and use raw fetch */
            const bearerTok = revex?.defaults?.headers?.common?.Authorization
              ?? revex?.defaults?.headers?.Authorization
              ?? null;
            a5.hasBearerTok = !!bearerTok;
            if (bearerTok) {
              try {
                const authVal = typeof bearerTok === "string" ? bearerTok : `Bearer ${bearerTok}`;
                const rawR5 = await fetch(syncUrl, {
                  method:  "POST",
                  headers: { "Content-Type": "application/json", "Authorization": authVal, ...extraHdr },
                  body:    JSON.stringify(syncBody),
                  signal:  AbortSignal.timeout(10000),
                });
                const rawD5 = await rawR5.json().catch(() => ({}));
                a5.rawHttp     = rawR5.status;
                a5.ok          = rawR5.ok;
                a5.traceId     = rawD5?.traceId ?? null;
                a5.prebuiltCnt = (rawD5?.prebuiltSectionTemplates ?? []).length;
                a5.result      = `${rawR5.ok ? "ok" : "fail"}-rawfetch http=${rawR5.status}`;
              } catch (_rf5) {
                a5.rawFetchError = String(_rf5).slice(0, 60);
                a5.result        = `rawfetch-threw`;
              }
            } else {
              a5.result = `revex-failed-${st5} no-bearer-tok-available`;
            }
          }
        }
      } catch (e5) {
        a5.result = `threw: ${String(e5).slice(0, 80)}`;
      }
      diag.approach5 = a5;
    }

    /* ════════════════════════════════════════════════════════════════════════
       APPROACH 1: GHL-signed upload URL
       If GHL returns pageDataUploadUrl (a pre-signed PUT URL), write directly.
       No auth headers required — GHL has already signed the URL.
       ════════════════════════════════════════════════════════════════════════ */
    if (uploadUrl && typeof uploadUrl === "string") {
      try {
        const res = await fetch(uploadUrl, {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(pageData),
        });
        if (res.ok) {
          diag.approach1 = "success";
          return JSON.stringify({ ok: true, method: "signed-upload-url", diag });
        }
        diag.approach1 = `HTTP ${res.status}`;
      } catch (e1) {
        diag.approach1 = `threw: ${String(e1).slice(0, 80)}`;
      }
    } else {
      diag.approach1 = uploadUrl ? "uploadUrl invalid" : "no pageDataUploadUrl in metadata";
    }

    /* ════════════════════════════════════════════════════════════════════════
       APPROACH 2: Firebase Storage REST write + Firebase ID token
       Parse bucket + object path from pageDataDownloadUrl.
       Extract the Firebase ID token from the Firebase app running in the page.
       POST to firebase storage upload endpoint with Authorization: Firebase {token}.
       ════════════════════════════════════════════════════════════════════════ */
    if (downloadUrl && typeof downloadUrl === "string") {
      const fbMatch = downloadUrl.match(
        /firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?]+)/
      );
      if (fbMatch) {
        const bucket      = decodeURIComponent(fbMatch[1]);
        const encodedPath = fbMatch[2]; // keep URL-encoded; decode for name param
        const objectPath  = decodeURIComponent(encodedPath);
        let   idToken     = null;
        const tokenDiag   = [];

        /* Try Firebase v8 compat global */
        try {
          if (typeof firebase !== "undefined" && firebase.apps?.length) {
            const user = firebase.auth().currentUser;
            if (user) { idToken = await user.getIdToken(true); tokenDiag.push("v8-global"); }
          }
        } catch (te1) { tokenDiag.push(`v8-err:${String(te1).slice(0, 40)}`); }

        /* Try Firebase apps attached to window properties */
        if (!idToken) {
          try {
            for (const val of Object.values(window)) {
              if (!val || typeof val !== "object") continue;
              if (typeof val.auth === "function") {
                const auth = val.auth();
                if (auth?.currentUser) {
                  idToken = await auth.currentUser.getIdToken(true);
                  tokenDiag.push("window-prop-auth");
                  break;
                }
              }
            }
          } catch (te2) { tokenDiag.push(`win-err:${String(te2).slice(0, 40)}`); }
        }

        /* Try Vue global properties ($auth, firebaseAuth, auth) */
        if (!idToken) {
          try {
            const globals = appEl?.__vue_app__?.config?.globalProperties ?? {};
            const authObj = globals.$auth ?? globals.firebaseAuth ?? globals.auth ?? null;
            if (authObj?.currentUser) {
              idToken = await authObj.currentUser.getIdToken(true);
              tokenDiag.push("vue-globals");
            }
          } catch (te3) { tokenDiag.push(`vue-err:${String(te3).slice(0, 40)}`); }
        }

        /* Try window.__firebaseAuthUser__ or similar GHL-specific globals */
        if (!idToken) {
          try {
            const authUser = window.__firebaseAuthUser__
              ?? window._firebaseUser
              ?? window.currentFirebaseUser
              ?? null;
            if (authUser?.getIdToken) {
              idToken = await authUser.getIdToken(true);
              tokenDiag.push("window-auth-user");
            }
          } catch (te4) { tokenDiag.push(`user-err:${String(te4).slice(0, 40)}`); }
        }

        /* Try Firebase SDK v9 — reads from IndexedDB firebaseLocalStorageDb.
           Firebase v9 modular SDK does NOT store auth on window; it keeps the
           auth record in IDB under a key matching /^firebase:authUser:/ with
           shape: { stsTokenManager: { accessToken: "eyJh…" } }.
           This is the correct source when all window-based probes return nothing. */
        if (!idToken) {
          try {
            idToken = await new Promise((resolve) => {
              const req = indexedDB.open("firebaseLocalStorageDb");
              req.onerror = () => resolve(null);
              req.onsuccess = (evt) => {
                const db = evt.target.result;
                if (!db.objectStoreNames.contains("firebaseLocalStorage")) {
                  db.close(); resolve(null); return;
                }
                const tx     = db.transaction("firebaseLocalStorage", "readonly");
                const store  = tx.objectStore("firebaseLocalStorage");
                const getAll = store.getAll();
                getAll.onerror   = () => { db.close(); resolve(null); };
                getAll.onsuccess = (e2) => {
                  db.close();
                  const records = e2.target.result ?? [];
                  for (const rec of records) {
                    const token = rec?.value?.stsTokenManager?.accessToken;
                    if (token) { resolve(token); return; }
                  }
                  resolve(null);
                };
              };
            });
            if (idToken) tokenDiag.push("indexeddb-v9");
          } catch (te5) { tokenDiag.push(`idb-err:${String(te5).slice(0, 40)}`); }
        }

        diag.approach2 = { bucket, objectPath, tokenDiag, hasToken: !!idToken };

        if (idToken) {
          try {
            /* ── Step 0: Probe existing page format (diagnostic only, with auth) ── *
             * We probe with the Firebase token so GHL's Security Rules allow the read.
             * The probe reveals the storage format and logs the first row's top-level
             * keys (firstRowKeys) so we can verify flat vs metaData-wrapped entries.
             * We always write structured-dict format with wrapped { id, metaData:{} } entries. */
            let storageFormat  = "skipped";
            let existElemCount = 0;
            try {
              const existRes = await fetch(downloadUrl, {
                headers: { "Authorization": `Firebase ${idToken}` },
                signal:  AbortSignal.timeout(5000),
              });
              if (existRes.ok) {
                const existing = await existRes.json();
                /* Capture the top-level id GHL uses in its own saved data */
                diag.approach2.existingPayloadId = existing.id ?? "none";
                if (Array.isArray(existing.elements)) {
                  storageFormat  = "flat-array";
                  existElemCount = existing.elements.length;
                } else if (existing.elements && typeof existing.elements === "object") {
                  storageFormat  = "structured-dict";
                  existElemCount = Object.keys(existing.elements).length;
                  /* Peek at first row entry's top-level keys (confirm wrapped vs flat)
                   * AND the inner metaData keys so we can compare GHL's own row
                   * structure against what buildNode() generates.                       */
                  const firstRowVal = existing.rows && Object.values(existing.rows)[0];
                  diag.approach2.firstRowKeys = firstRowVal
                    ? Object.keys(firstRowVal).slice(0, 12)
                    : "rows-empty";
                  diag.approach2.firstExistRowMetaKeys = firstRowVal?.metaData
                    ? Object.keys(firstRowVal.metaData).slice(0, 14)
                    : "no-metaData";
                  /* Confirm rows are keyed by the row's own .id, not by section ID */
                  const firstRowDictKey = existing.rows ? Object.keys(existing.rows)[0] : null;
                  diag.approach2.firstExistRowDictKey = firstRowDictKey ?? "none";
                  diag.approach2.firstExistRowIdMatch  = firstRowDictKey !== null
                    ? (firstRowDictKey === (firstRowVal?.id ?? firstRowVal?.metaData?.id ?? "__no-id__"))
                    : null;
                  /* Peek at first section's top-level keys and metaData keys */
                  const sec0 = Array.isArray(existing.sections) && existing.sections[0];
                  if (sec0) {
                    diag.approach2.firstSectionKeys     = Object.keys(sec0).slice(0, 8);
                    diag.approach2.firstSectionMetaKeys = sec0.metaData
                      ? Object.keys(sec0.metaData).slice(0, 14)
                      : "no-metaData";
                    diag.approach2.firstSectionChildCount = Array.isArray(sec0.metaData?.child)
                      ? sec0.metaData.child.length
                      : (Array.isArray(sec0.child) ? sec0.child.length : 0);
                    /* Does existing GHL section have an elements key? Confirms real GHL format. */
                    diag.approach2.existSecHasElements = "elements" in sec0;
                  }
                } else if (Array.isArray(existing.sections)) {
                  storageFormat = "structured-only";
                } else {
                  storageFormat = "keys:" + Object.keys(existing).join(",").slice(0, 50);
                }
              } else {
                storageFormat = "probe-" + existRes.status;
              }
            } catch (_fErr) {
              storageFormat = "probe-err";
            }

            /* ── Step 1: Build structured-dict payload — flat top-level format ────────── *
             * v2.32.0 FIX: Schema Diff (v2.31.0) confirmed native GHL Firebase stores
             * rows/columns/elements as FLAT top-level objects (NO metaData wrapper).
             * Native sec0.elements[0] keys: ["extra","meta","styles","child","id","tagName",
             * "wrapper","class","title","type"] — flat, NO "metaData" key.
             * Our v2.31.0 inject used { id, metaData:{} } wrapper format → MISMATCH.
             * Fix: flattenForFirebase spreads metaData content to top-level, strips
             * the self-referential `element` key, and sets id at top level.
             * Sections keep their { id, metaData } wrapper (confirmed by roundtrip).  */

            /* Flattens a dict value from { id, metaData:{...} } to top-level flat format.
             * If the value is already flat (no metaData key), it is passed through as-is.
             * Result: { id, _id, type, tagName, child, extra, styles, mobileStyles, class,
             *           meta, title, wrapper, customCss, tag, mobileWrapper, mobileExtra,
             *           element }
             * — matches native GHL Firebase element field keys (incl. `element`).
             * v2.37.0: defaults for native fields not produced by AI generator are injected
             *   before the metaData spread so AI values always win if present.
             * v2.38.0 ROOT CAUSE FIX: keep `element` field from buildNode() snapshot.
             *   Clone-baseline analysis shows native GHL flat elements have `element` key.
             *   buildNode() sets base.element = { ...base } (snapshot, NOT circular) before
             *   returning, so it is safe to JSON-serialize. GHL's renderer accesses
             *   flatEl.element to get component data; stripping it caused GHL to hang.   */
            function flattenForFirebase(key, v) {
              if (!v || typeof v !== "object") return v;
              if (v.metaData && typeof v.metaData === "object") {
                /* v2.38.0: spread ALL of metaData including `element` snapshot.
                 * Defaults for native GHL fields come first; metaData values override. */
                return {
                  wrapper: {}, class: {}, customCss: "", tag: "", mobileWrapper: {}, mobileExtra: {},
                  id: v.id ?? key,
                  ...v.metaData,
                };
              }
              /* Already flat — pass through (no metaData wrapper present) */
              return v;
            }

            const pd = pageData;

            /* Flatten rows/columns/elements from { id, metaData:{} } to top-level format.
             * Sections keep their { id, metaData:{}, elements, ... } wrapper — leave as-is. */
            const wrappedRows = Object.fromEntries(
              Object.entries(pd.rows    ?? {}).map(([k, v]) => [k, flattenForFirebase(k, v)])
            );
            const wrappedCols = Object.fromEntries(
              Object.entries(pd.columns ?? {}).map(([k, v]) => [k, flattenForFirebase(k, v)])
            );
            const wrappedEls = Object.fromEntries(
              Object.entries(pd.elements ?? {}).map(([k, v]) => [k, flattenForFirebase(k, v)])
            );

            /* Pre-write diagnostics — captured AFTER flattening, BEFORE the fetch.
             * v2.32.0: preWriteRowHasMeta should be FALSE (flat = correct format). */
            const _firstFlatRow = Object.values(wrappedRows)[0];
            diag.approach2.preWriteRowKeys    = _firstFlatRow
              ? Object.keys(_firstFlatRow).slice(0, 10) : "rows-empty";
            diag.approach2.preWriteRowHasMeta = _firstFlatRow
              ? ("metaData" in _firstFlatRow) : null;
            diag.approach2.preWriteSectionChildId =
              pd.sections?.[0]?.metaData?.child?.[0]
              ?? pd.sections?.[0]?.child?.[0]
              ?? "none";

            /* GHL section top-level keys (confirmed by roundtrip v2.26.0 + v2.30.0):
             * ["id","metaData","elements","sequence","pageId","funnelId","locationId","general"]
             * v2.37.0 ROOT CAUSE FIX: section.elements must be a FULLY FLAT array of ALL
             * nodes in the row→col→element tree. Every node's `child` array must reference
             * other entries in the SAME section.elements array. Prior versions only wrote
             * the top-level rows — each row's child cols were dead references → GHL hangs.
             * Native GHL sec[0] with 2 rows has 14 elements: 2 rows + cols + leaf elements.
             * Fix: traverse wrappedRows → wrappedCols → wrappedEls and push ALL nodes.    */
            const funnelIdFromPath = objectPath.split("/")[1] ?? "";
            /* v2.39.0: extract locationId from the GHL tab URL for metaUpdate patterns.
             * Tab URL format: https://app.gohighlevel.com/location/{locationId}/page-builder/{pageId} */
            const tabLocationId = (window.location.href.match(/\/location\/([^/]+)\//) ?? [])[1] ?? "";
            const sectionsWithContext = (pd.sections ?? []).map((sec, i) => {
              const childRowIds = Array.isArray(sec.metaData?.child) ? sec.metaData.child : [];
              /* v2.37.0: build full flat element tree for this section.
               * Push: row, then each of its cols, then each col's leaf elements.
               * All child references resolve within this same array → GHL renders OK. */
              const flatElements = [];
              for (const rowId of childRowIds) {
                const row = wrappedRows[rowId];
                if (!row) continue;
                flatElements.push(row);
                const colIds = Array.isArray(row.child) ? row.child : [];
                for (const colId of colIds) {
                  const col = wrappedCols[colId];
                  if (!col) continue;
                  flatElements.push(col);
                  const elemIds = Array.isArray(col.child) ? col.child : [];
                  for (const elemId of elemIds) {
                    const elem = wrappedEls[elemId];
                    if (elem) flatElements.push(elem);
                  }
                }
              }
              return {
                id:         sec.id,
                metaData:   { ...sec.metaData },
                elements:   flatElements,
                sequence:   i,
                pageId:     builderId,
                funnelId:   funnelIdFromPath,
                locationId: "",
                general:    {},
              };
            });

            /* Diagnostics: full flat tree written into section[0].elements.
             * v2.37.0: firstSecElemCount should be >> 1 (rows+cols+leaves).
             * rowRefOk = first row's first child col IS in the elements array.
             * colRefOk = that col's first child elem IS in the elements array.  */
            const _sec0El0 = sectionsWithContext[0]?.elements?.[0] ?? null;
            diag.approach2.firstSecElemCount  = sectionsWithContext[0]?.elements?.length ?? 0;
            diag.approach2.firstSecEl0HasMeta    = _sec0El0 ? ("metaData" in _sec0El0) : null;
            diag.approach2.firstSecEl0HasElement = _sec0El0 ? ("element" in _sec0El0) : null;
            diag.approach2.firstSecEl0Keys       = _sec0El0 ? Object.keys(_sec0El0).slice(0, 14) : "empty";
            diag.approach2.firstSecElemFormat  = "full-flat-tree-v2.38.0";
            diag.approach2.sec0MetaChildLen = (pd.sections?.[0]?.metaData?.child ?? []).length;
            /* rowRefOk / colRefOk: verify child IDs resolve in section.elements */
            (() => {
              const sec0Elems = sectionsWithContext[0]?.elements ?? [];
              const sec0ElemIds = new Set(sec0Elems.map(e => e.id));
              const firstRow = sec0Elems[0];
              const firstColId = firstRow && Array.isArray(firstRow.child) ? firstRow.child[0] : null;
              const rowRefOk = firstColId ? sec0ElemIds.has(firstColId) : null;
              const firstCol = firstColId ? sec0Elems.find(e => e.id === firstColId) : null;
              const firstElemId = firstCol && Array.isArray(firstCol.child) ? firstCol.child[0] : null;
              const colRefOk = firstElemId ? sec0ElemIds.has(firstElemId) : null;
              diag.approach2.rowRefOk  = rowRefOk;
              diag.approach2.colRefOk  = colRefOk;
              diag.approach2.firstColId = firstColId ?? "none";
              diag.approach2.firstElemId = firstElemId ?? "none";
            })();

            /* v2.33.0: Write EMPTY flat dicts to match native GHL Firebase format.
             * Critical new finding (v2.33.0): native GHL page roundtrip shows
             * secs=11 rows=0 cols=0 elems=0 — the NATIVE page has NO flat dict entries.
             * All row/col/elem data lives inside section.elements (the shallow flat rows).
             * Our v2.29.1 failure (500) was caused by missing section.elements, NOT by
             * missing flat dicts. We never tested: sections WITH elements + empty dicts.
             * This combination matches native format exactly.                             */
            /* v2.36.0: spread full pd so no fields are silently omitted.
             * pd now includes settings:{}, trackingCode:"", popupsList:[]
             * (generated by AI generator buildEnvelope). Override id and
             * structural arrays so the correct live values win.             */
            const writePayload = {
              ...pd,
              id:       builderId,
              sections: sectionsWithContext,
              rows:     {},
              columns:  {},
              elements: {},
            };

            diag.approach2.writePayloadTopKeys = Object.keys(writePayload);
            diag.approach2.storageFormat   = storageFormat;
            diag.approach2.writeFormat     = "spread-pd-v2.38.0";
            diag.approach2.writeEmptyDicts = true;
            diag.approach2.existElemCount  = existElemCount;
            diag.approach2.nodeCount       = Object.keys(wrappedRows).length
              + Object.keys(wrappedCols).length
              + Object.keys(wrappedEls).length;

            /* Firebase Storage upload endpoint (creates/overwrites object) */
            const uploadEp =
              `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}` +
              `/o?uploadType=media&name=${encodeURIComponent(objectPath)}`;
            const res = await fetch(uploadEp, {
              method:  "POST",
              headers: {
                "Content-Type":  "application/json",
                "Authorization": `Firebase ${idToken}`,
              },
              body: JSON.stringify(writePayload),
            });
            diag.approach2.httpStatus = res.status;
            if (res.ok) {
              diag.approach2.result = `success (HTTP ${res.status})`;

              /* ── Extract new Firebase download token from upload response ────────── *
               * Firebase Storage REST API returns { downloadTokens: "…" } on upload.
               * If it generated a NEW token, GHL's cached pageDataDownloadUrl (stored
               * in its backend) is now STALE — GHL tries to GET from the old URL, gets
               * 403/empty, and loadFunnelPage throws "TypeError: o1.elements is not
               * iterable" on the empty data.  We fix this by updating GHL's metadata
               * with the new public download URL so GHL can actually read our file.   */
              let newFirebaseToken = null;
              try {
                const uploadResp = await res.clone().json().catch(() => ({}));
                newFirebaseToken = uploadResp.downloadTokens ?? null;
                const oldToken   = (downloadUrl.match(/[?&]token=([^&]+)/) ?? [])[1] ?? "";
                diag.approach2.newFirebaseToken = newFirebaseToken
                  ? newFirebaseToken.slice(0, 20) + "…" : "none-in-resp";
                diag.approach2.tokenChanged = newFirebaseToken
                  ? (newFirebaseToken !== oldToken) : false;
              } catch (_tre) {
                diag.approach2.newFirebaseToken = "parse-err";
              }

              /* ── v2.32.0: metaUpdate is PRIMARY path ────────────────────────────── *
               * ROOT CAUSE 2 FIX: patchToken restores the old Firebase download URL *
               * so GHL backend serves its CACHED original data — inject invisible.  *
               * metaUpdate instead calls the GHL backend PUT endpoint with the NEW  *
               * download URL, forcing GHL to re-fetch our newly written file.       *
               * Strategy: (A) always try metaUpdate first; (B) attempt patchToken   *
               * only as a fallback for environments where metaUpdate is unavailable.*
               * Result after inject + GHL reload: our AI page content is visible.   */
              const oldToken = (downloadUrl.match(/[?&]token=([^&]+)/) ?? [])[1] ?? "";
              const metaEp   =
                `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}` +
                `/o/${encodedPath}`;

              /* ── (A) PRIMARY: metaUpdate — tell GHL backend about the new URL ──── */
              let metaUpdateSucceeded = false;
              if (revex) {
                /* Determine the active Firebase token for the new URL:
                 * Prefer the token from the upload response (newFirebaseToken).
                 * If upload response didn't include a token, fall back to a metadata
                 * GET to obtain the current token for the object we just wrote.    */
                let activeToken = newFirebaseToken;
                if (!activeToken) {
                  try {
                    const metaGetRes = await fetch(metaEp, {
                      headers: { "Authorization": `Firebase ${idToken}` },
                      signal:  AbortSignal.timeout(4000),
                    });
                    if (metaGetRes.ok) {
                      const metaBody = await metaGetRes.json().catch(() => ({}));
                      activeToken = metaBody.metadata?.downloadTokens ?? metaBody.downloadTokens ?? null;
                      diag.approach2.metaGetTokenFallback = activeToken
                        ? activeToken.slice(0, 20) + "…" : "none";
                    } else {
                      diag.approach2.metaGetTokenFallback = `http-${metaGetRes.status}`;
                    }
                  } catch (_metaGetErr) {
                    diag.approach2.metaGetTokenFallback = "err";
                  }
                }
                if (activeToken) {
                  const baseUrl      = downloadUrl.replace(/\?.*$/, "");
                  const newPublicUrl = baseUrl + `?alt=media&token=${activeToken}`;
                  diag.approach2.newPublicUrl = newPublicUrl.slice(0, 120);
                  const updateBody = { ...metadata, pageDataDownloadUrl: newPublicUrl };
                  /* v2.35.0: try PATCH first (then PUT fallback) on each URL pattern.
                   * v2.34.0 tried PUT on all 3 URLs — all returned 404.
                   * GHL's axios API commonly uses PATCH for partial updates.
                   * Try order: /funnels/page/{pid} → /funnels/funnel/page/{pid} → /funnels/funnel/{fid}/page/{pid}
                   * Verb order per URL: PATCH → PUT (PUT as fallback on 404/405)
                   * Log all attempts as metaUpdateAttempts for debugging.              */
                  diag.approach2.tabLocationId = tabLocationId || "(not-found-in-url)";
                  /* v2.39.0: 6 URL patterns — location-ID patterns first (most specific),
                   * then existing patterns as fallback. Each tried PATCH→PUT.
                   * locationId extracted from window.location.href (tab URL).              */
                  const metaUpdateUrls = tabLocationId ? [
                    /* Location-ID patterns (new in v2.39.0) */
                    `https://backend.leadconnectorhq.com/locations/${tabLocationId}/funnels/page/${builderId}`,
                    `https://backend.leadconnectorhq.com/funnels/page/${builderId}?locationId=${tabLocationId}`,
                    `https://backend.leadconnectorhq.com/funnels/${funnelIdFromPath}/page/${builderId}?locationId=${tabLocationId}`,
                    /* Existing patterns (fallback) */
                    `https://backend.leadconnectorhq.com/funnels/page/${builderId}`,
                    `https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`,
                    `https://backend.leadconnectorhq.com/funnels/funnel/${funnelIdFromPath}/page/${builderId}`,
                  ] : [
                    /* No locationId — use existing 3 patterns only */
                    `https://backend.leadconnectorhq.com/funnels/page/${builderId}`,
                    `https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`,
                    `https://backend.leadconnectorhq.com/funnels/funnel/${funnelIdFromPath}/page/${builderId}`,
                  ];
                  const metaUpdateAttempts = [];
                  diag.approach2.metaUpdateAttempts = metaUpdateAttempts;
                  outer: for (const metaUpdateUrl of metaUpdateUrls) {
                    for (const verb of ["patch", "put"]) {
                      try {
                        await revex[verb](metaUpdateUrl, updateBody);
                        metaUpdateAttempts.push({ url: metaUpdateUrl.slice(50), verb, status: 200, ok: true });
                        metaUpdateSucceeded = true;
                        diag.approach2.metaUpdateStatus = `ok-primary-verb:${verb} url:${metaUpdateUrl.slice(50, 90)}`;
                        diag.approach2.metaUpdateEndpoint = metaUpdateUrl.slice(0, 120);
                        break outer;
                      } catch (_uN) {
                        const st = _uN?.response?.status ?? "err";
                        metaUpdateAttempts.push({ url: metaUpdateUrl.slice(50), verb, status: st, ok: false });
                        /* Only fall through to PUT if PATCH got a routing error (404/405).
                         * Any other status (400, 422, 500) means the URL was reached —
                         * trying PUT would be redundant and mask the real error. */
                        if (verb === "patch" && st !== 404 && st !== 405) break;
                      }
                    }
                  }
                  if (!metaUpdateSucceeded) {
                    diag.approach2.metaUpdateStatus =
                      `all-failed: ${metaUpdateAttempts.map(a => `${a.verb} ${a.url.slice(-30)}→${a.status}`).join(" | ")}`;
                  }
                } else {
                  diag.approach2.metaUpdateStatus = "skipped-no-token-after-fallback";
                }
              } else {
                diag.approach2.metaUpdateStatus = "skipped-no-revex";
              }

              /* ── (B) FALLBACK: patchToken — restore old Firebase token ───────── *
               * Only run if metaUpdate failed (revex unavailable). When patchToken  *
               * succeeds GHL's cached URL still works but serves CACHED data —      *
               * inject may not be visible until Firebase CDN cache expires.         *
               * Keep as fallback so at least the page doesn't 403-crash on reload. */
              let patchSucceeded = false;
              if (!metaUpdateSucceeded && oldToken) {
                /* Format 1: nested metadata field */
                try {
                  const pr1 = await fetch(metaEp, {
                    method:  "PATCH",
                    headers: { "Content-Type": "application/json", "Authorization": `Firebase ${idToken}` },
                    body:    JSON.stringify({ metadata: { downloadTokens: oldToken } }),
                  });
                  diag.approach2.patchStatus1 = pr1.status;
                  if (pr1.ok) {
                    const pr1Body       = await pr1.json().catch(() => ({}));
                    const returnedToken = pr1Body.metadata?.downloadTokens ?? pr1Body.downloadTokens ?? null;
                    const tokenVerified = returnedToken === oldToken;
                    diag.approach2.patchTokenOk = tokenVerified;
                    if (tokenVerified) {
                      patchSucceeded = true;
                      diag.approach2.patchToken = "ok-format1-fallback";
                    } else {
                      diag.approach2.patchToken = `accepted-not-verified`;
                      diag.approach2.patchReturnedToken = returnedToken ? returnedToken.slice(0, 20) + "…" : "null";
                    }
                  }
                } catch (_p1) { diag.approach2.patchStatus1 = "err"; }

                /* Format 2: top-level field, if format 1 failed/unverified */
                if (!patchSucceeded) {
                  try {
                    const pr2 = await fetch(metaEp, {
                      method:  "PATCH",
                      headers: { "Content-Type": "application/json", "Authorization": `Firebase ${idToken}` },
                      body:    JSON.stringify({ downloadTokens: oldToken }),
                    });
                    diag.approach2.patchStatus2 = pr2.status;
                    if (pr2.ok) {
                      const pr2Body        = await pr2.json().catch(() => ({}));
                      const returnedToken2 = pr2Body.metadata?.downloadTokens ?? pr2Body.downloadTokens ?? null;
                      const tokenVerified2 = returnedToken2 === oldToken;
                      diag.approach2.patchTokenOk = tokenVerified2;
                      if (tokenVerified2) {
                        patchSucceeded = true;
                        diag.approach2.patchToken = "ok-format2-fallback";
                      } else {
                        diag.approach2.patchToken = `accepted-not-verified-f2`;
                        diag.approach2.patchReturnedToken = returnedToken2 ? returnedToken2.slice(0, 20) + "…" : "null";
                      }
                    }
                  } catch (_p2) { diag.approach2.patchStatus2 = "err"; }
                }

                if (!patchSucceeded) {
                  diag.approach2.patchToken = "failed";
                }
              } else if (metaUpdateSucceeded) {
                diag.approach2.patchToken = "skipped-metaUpdate-primary-ok";
              } else {
                diag.approach2.patchToken = "skipped-no-old-token";
              }

              /* ── Post-write verification: re-read what we wrote ────────────────── *
               * Confirms the new file is readable and has our sections/rows counts.  */
              try {
                const vrRes = await fetch(downloadUrl, {
                  cache:   "no-store",
                  headers: { "Authorization": `Firebase ${idToken}` },
                  signal:  AbortSignal.timeout(5000),
                });
                if (vrRes.ok) {
                  const vr = await vrRes.json();
                  const sec0 = Array.isArray(vr.sections) && vr.sections[0];
                  /* Cross-reference: does the row referenced by section[0].child[0] exist? */
                  const sec0ChildRowId = sec0?.metaData?.child?.[0] ?? sec0?.child?.[0] ?? null;
                  const referencedRow  = sec0ChildRowId ? (vr.rows?.[sec0ChildRowId] ?? null) : null;
                  const firstColId     = referencedRow?.metaData?.child?.[0] ?? null;
                  const referencedCol  = firstColId ? (vr.columns?.[firstColId] ?? null) : null;
                  /* v2.32.0 post-write checks:
                   * - sec0El0HasMeta: should be FALSE (flat format = no metaData key)
                   * - firstRowHasMeta: should be FALSE (flat format)                  */
                  const sec0El0 = Array.isArray(sec0?.elements) ? sec0.elements[0] : null;
                  const firstRow = vr.rows && Object.values(vr.rows)[0];
                  /* col ref: flat rows don't have metaData wrapper, so child is at top-level */
                  const firstColIdFlat = referencedRow?.child?.[0] ?? referencedRow?.metaData?.child?.[0] ?? null;
                  const referencedColFlat = firstColIdFlat ? (vr.columns?.[firstColIdFlat] ?? null) : null;
                  diag.approach2.postWrite = {
                    readOk:          true,
                    httpStatus:      vrRes.status,
                    payloadId:       vr.id ?? "missing",
                    sectionCount:    Array.isArray(vr.sections) ? vr.sections.length : 0,
                    rowCount:        vr.rows    ? Object.keys(vr.rows).length    : 0,
                    colCount:        vr.columns ? Object.keys(vr.columns).length : 0,
                    elemCount:       vr.elements? Object.keys(vr.elements).length: 0,
                    firstSectionChildCount: Array.isArray(sec0?.metaData?.child)
                      ? sec0.metaData.child.length
                      : (Array.isArray(sec0?.child) ? sec0.child.length : 0),
                    writtenSecHasElements: sec0 ? ("elements" in sec0) : null,
                    /* v2.32.0: sec0El0HasMeta should be FALSE (flat format) */
                    sec0El0HasMeta:  sec0El0 ? ("metaData" in sec0El0) : null,
                    sec0El0Keys:     sec0El0 ? Object.keys(sec0El0).slice(0, 10) : "no-el0",
                    sec0ChildRowId:  sec0ChildRowId ?? "none",
                    rowRefOk:        !!referencedRow,
                    /* v2.32.0: flat row has no metaData wrapper */
                    firstRowHasMeta: firstRow ? ("metaData" in firstRow) : null,
                    firstRowKeys:    firstRow ? Object.keys(firstRow).slice(0, 10) : "rows-empty",
                    firstColId:      firstColIdFlat ?? "none",
                    colRefOk:        !!referencedColFlat,
                  };
                } else {
                  diag.approach2.postWrite = { readOk: false, httpStatus: vrRes.status, error: `re-read ${vrRes.status}` };
                }
              } catch (_vrErr) {
                diag.approach2.postWrite = { error: "re-read threw" };
              }

              /* ── DO NOT return early — fall through to Approach 3 ──────────────── *
               * Approach 3 (Pinia state mutation) patches the live Vue reactive state
               * so the builder immediately shows our content, even if the Firebase
               * Storage re-read by GHL after reload has caching issues.              */
              diag.approach2.fallThrough = true;
            } else {
              const errText = await res.text().catch(() => "");
              diag.approach2.result = `HTTP ${res.status}: ${errText.slice(0, 100)}`;
            }
          } catch (e2) {
            diag.approach2.result = `threw: ${String(e2).slice(0, 80)}`;
          }
        } else {
          diag.approach2.result = "no Firebase auth token found";
        }
      } else {
        diag.approach2 = "could not parse Firebase URL from downloadUrl";
      }
    } else {
      diag.approach2 = "no pageDataDownloadUrl in metadata";
    }

    /* ════════════════════════════════════════════════════════════════════════
       APPROACH 2B: Construct Firebase path when pageDataDownloadUrl is missing
       GHL does not create a Firebase Storage file for blank/new pages until
       the user saves real content for the first time. When metadata exists
       but lacks pageDataDownloadUrl, we construct the known GHL path format
       (funnels/{funnelId}/{builderId}.json), write our AI page data to it,
       then PATCH GHL's metadata to register the new file URL so the builder
       can reload with the injected content.
       ════════════════════════════════════════════════════════════════════════ */
    if (!diag.approach2?.fallThrough && !downloadUrl && metadata) {
      const a2b = { source: "constructed-path" };
      try {
        const funnelId2B  = metadata?.funnelId ?? metadata?.funnel_id ?? null;
        a2b.funnelId      = funnelId2B ?? "missing";
        a2b.metaFunnelId  = funnelId2B ?? null;
        a2b.metadataKeys  = Object.keys(metadata ?? {}).slice(0, 15);

        if (funnelId2B) {
          /* ── Get Firebase auth token (same IDB logic as approach 2) ──── */
          let idToken2B = null;
          const tokDiag2B = [];
          try {
            if (typeof firebase !== "undefined" && firebase.apps?.length) {
              const u = firebase.auth().currentUser;
              if (u) { idToken2B = await u.getIdToken(true); tokDiag2B.push("v8"); }
            }
          } catch (_t1) {}
          if (!idToken2B) {
            try {
              for (const val of Object.values(window)) {
                if (!val || typeof val !== "object") continue;
                if (typeof val.auth === "function") {
                  const auth = val.auth();
                  if (auth?.currentUser) {
                    idToken2B = await auth.currentUser.getIdToken(true);
                    tokDiag2B.push("win-prop"); break;
                  }
                }
              }
            } catch (te2b) { tokDiag2B.push(`win-err:${String(te2b).slice(0, 30)}`); }
          }
          if (!idToken2B) {
            try {
              idToken2B = await new Promise((resolve) => {
                const req = indexedDB.open("firebaseLocalStorageDb");
                req.onerror = () => resolve(null);
                req.onsuccess = (evt) => {
                  const db = evt.target.result;
                  if (!db.objectStoreNames.contains("firebaseLocalStorage")) { db.close(); resolve(null); return; }
                  const tx     = db.transaction("firebaseLocalStorage", "readonly");
                  const store  = tx.objectStore("firebaseLocalStorage");
                  const getAll = store.getAll();
                  getAll.onerror   = () => { db.close(); resolve(null); };
                  getAll.onsuccess = (e2) => {
                    db.close();
                    for (const rec of (e2.target.result ?? [])) {
                      const token = rec?.value?.stsTokenManager?.accessToken;
                      if (token) { resolve(token); return; }
                    }
                    resolve(null);
                  };
                };
              });
              if (idToken2B) tokDiag2B.push("idb-v9");
            } catch (te2c) { tokDiag2B.push(`idb-err:${String(te2c).slice(0, 30)}`); }
          }
          a2b.tokDiag = tokDiag2B;
          a2b.hasToken = !!idToken2B;

          /* ── Probe for Firebase storage bucket ──────────────────────── */
          let bucketFinal = cachedBucket ?? null;
          const bucketDiag = [];
          if (bucketFinal) bucketDiag.push("sw-cached");
          if (!bucketFinal) {
            try {
              if (typeof firebase !== "undefined" && firebase.apps?.length) {
                bucketFinal = firebase.app().options?.storageBucket ?? null;
                if (bucketFinal) bucketDiag.push("fb-v8-config");
              }
            } catch (_b1) {}
          }
          if (!bucketFinal) {
            try {
              const fa = window.__FIREBASE_APP__ ?? window._firebaseApp ?? null;
              bucketFinal = fa?.options?.storageBucket ?? null;
              if (bucketFinal) bucketDiag.push("window-fb-app");
            } catch (_b2) {}
          }
          if (!bucketFinal) {
            try {
              const globs = appEl?.__vue_app__?.config?.globalProperties ?? {};
              const fbApp = globs.$firebase ?? globs.firebase ?? globs.firebaseApp ?? null;
              bucketFinal = fbApp?.options?.storageBucket ?? null;
              if (bucketFinal) bucketDiag.push("vue-globals-fb");
            } catch (_b3) {}
          }
          if (!bucketFinal) {
            bucketFinal = "highlevel-backend.appspot.com";
            bucketDiag.push("fallback-known");
          }
          a2b.bucket     = bucketFinal;
          a2b.bucketDiag = bucketDiag;

          if (idToken2B) {
            /* ── Build write payload (mirrors approach 2 writePayload) ── *
             * v2.32.0: use flattenForFirebase (same as approach 2).       */
            const pd2B = pageData;
            /* v2.38.0: same flattenForFirebase fix as approach 2 — keep `element` snapshot field.
             * (This was missed in v2.37.0 — only approach 2 was fixed then.) */
            function flattenForFirebase2B(key, v) {
              if (!v || typeof v !== "object") return v;
              if (v.metaData && typeof v.metaData === "object") {
                return {
                  wrapper: {}, class: {}, customCss: "", tag: "", mobileWrapper: {}, mobileExtra: {},
                  id: v.id ?? key,
                  ...v.metaData,
                };
              }
              return v;
            }
            const wrappedRows2B = Object.fromEntries(
              Object.entries(pd2B.rows    ?? {}).map(([k, v]) => [k, flattenForFirebase2B(k, v)])
            );
            const wrappedCols2B = Object.fromEntries(
              Object.entries(pd2B.columns ?? {}).map(([k, v]) => [k, flattenForFirebase2B(k, v)])
            );
            const wrappedEls2B = Object.fromEntries(
              Object.entries(pd2B.elements ?? {}).map(([k, v]) => [k, flattenForFirebase2B(k, v)])
            );
            /* v2.37.0: full flat element tree — mirrors approach 2 sectionsWithContext fix.
             * Push row + its cols + each col's leaf elements into one flat section.elements. */
            const sectionsCtx2B = (pd2B.sections ?? []).map((sec, i) => {
              const childRowIds2B = Array.isArray(sec.metaData?.child) ? sec.metaData.child : [];
              const flatEls2B = [];
              for (const rowId of childRowIds2B) {
                const row = wrappedRows2B[rowId];
                if (!row) continue;
                flatEls2B.push(row);
                const colIds = Array.isArray(row.child) ? row.child : [];
                for (const colId of colIds) {
                  const col = wrappedCols2B[colId];
                  if (!col) continue;
                  flatEls2B.push(col);
                  const elemIds = Array.isArray(col.child) ? col.child : [];
                  for (const elemId of elemIds) {
                    const elem = wrappedEls2B[elemId];
                    if (elem) flatEls2B.push(elem);
                  }
                }
              }
              return {
                id:         sec.id,
                metaData:   { ...sec.metaData },
                elements:   flatEls2B,
                sequence:   i,
                pageId:     builderId,
                funnelId:   funnelId2B,
                locationId: locationId ?? "",
                general:    {},
              };
            });
            /* v2.33.0: Empty flat dicts — mirrors native GHL Firebase format.
             * Native roundtrip shows rows=0 cols=0 elems=0. All element data lives in
             * section.elements (shallow flat rows). Empty dicts match native format.   */
            const writePayload2B = {
              fontsForPreview: pd2B.fontsForPreview,
              general:         pd2B.general,
              id:              builderId,
              pageStyles:      pd2B.pageStyles,
              popups:          pd2B.popups ?? [],
              sections:        sectionsCtx2B,
              rows:            {},
              columns:         {},
              elements:        {},
            };
            a2b.writeFormat     = "sections-with-empty-dicts-v2.33.0";
            a2b.writeEmptyDicts = true;

            /* ── POST to Firebase Storage REST API ───────────────────── */
            const constructedPath = `funnels/${funnelId2B}/${builderId}.json`;
            a2b.path = constructedPath;
            const uploadEp2B =
              `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketFinal)}` +
              `/o?uploadType=media&name=${encodeURIComponent(constructedPath)}`;
            const res2B = await fetch(uploadEp2B, {
              method:  "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Firebase ${idToken2B}` },
              body:    JSON.stringify(writePayload2B),
              signal:  AbortSignal.timeout(12000),
            });
            a2b.httpStatus = res2B.status;
            if (res2B.ok) {
              a2b.result = "success";
              /* ── Extract download token + patch GHL metadata ──────── */
              const fbData2B = await res2B.json().catch(() => ({}));
              const newTok2B = fbData2B.downloadTokens ?? "";
              const encPath2B = encodeURIComponent(constructedPath);
              const newUrl2B  =
                `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketFinal)}` +
                `/o/${encPath2B}?alt=media&token=${newTok2B}`;
              a2b.newDownloadUrl = newUrl2B.slice(0, 160);
              /* v2.39.0: declare patchOk2B BEFORE the revex block so it's in scope
               * for the success gate check below (outside if/else). */
              let patchOk2B = false;
              if (revex) {
                /* v2.39.0: same 6-pattern PATCH→PUT retry as approach 2.
                 * locationId extracted from window.location.href (same tab URL). */
                const tabLocId2B = (window.location.href.match(/\/location\/([^/]+)\//) ?? [])[1] ?? "";
                a2b.tabLocationId = tabLocId2B || "(not-found)";
                const metaUrls2B = tabLocId2B ? [
                  `https://backend.leadconnectorhq.com/locations/${tabLocId2B}/funnels/page/${builderId}`,
                  `https://backend.leadconnectorhq.com/funnels/page/${builderId}?locationId=${tabLocId2B}`,
                  `https://backend.leadconnectorhq.com/funnels/${funnelId2B}/page/${builderId}?locationId=${tabLocId2B}`,
                  `https://backend.leadconnectorhq.com/funnels/page/${builderId}`,
                  `https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`,
                  `https://backend.leadconnectorhq.com/funnels/funnel/${funnelId2B}/page/${builderId}`,
                ] : [
                  `https://backend.leadconnectorhq.com/funnels/page/${builderId}`,
                  `https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`,
                  `https://backend.leadconnectorhq.com/funnels/funnel/${funnelId2B}/page/${builderId}`,
                ];
                const patchAttempts2B = [];
                outer2B: for (const mu of metaUrls2B) {
                  for (const verb of ["patch", "put"]) {
                    try {
                      await revex[verb](mu, { ...metadata, pageDataDownloadUrl: newUrl2B });
                      patchAttempts2B.push({ url: mu.slice(50), verb, status: 200, ok: true });
                      patchOk2B = true;
                      a2b.metaPatch = `ok-verb:${verb} url:${mu.slice(50, 90)}`;
                      break outer2B;
                    } catch (_pe) {
                      const st = _pe?.response?.status ?? "err";
                      patchAttempts2B.push({ url: mu.slice(50), verb, status: st, ok: false });
                      if (verb === "patch" && st !== 404 && st !== 405) break;
                    }
                  }
                }
                a2b.patchAttempts = patchAttempts2B;
                if (!patchOk2B) {
                  a2b.metaPatch = `all-failed: ${patchAttempts2B.map(a => `${a.verb}→${a.status}`).join(" | ")}`;
                }
              } else {
                a2b.metaPatch = "skipped-no-revex";
              }
              /* Gate success on metadata patch — without registering the new URL
                 in GHL metadata the builder cannot load the injected content.    */
              if (patchOk2B) {
                diag.approach2b_ok = true;
              } else {
                a2b.result = `firebase-write-ok-but-meta-patch-${a2b.metaPatch ?? "failed"}`;
              }
            } else {
              const errTxt2B = await res2B.text().catch(() => "");
              a2b.result = `HTTP ${res2B.status}: ${errTxt2B.slice(0, 80)}`;
            }
          } else {
            a2b.result = "no-firebase-token";
          }
        } else {
          a2b.result = "no-funnelId-in-metadata";
        }
      } catch (e2B) {
        a2b.result = `threw:${String(e2B).slice(0, 80)}`;
      }
      diag.approach2b = a2b;
    }

    /* ════════════════════════════════════════════════════════════════════════
       APPROACH 3: Pinia state mutation is handled frame-targeted from the
       background SW (_cf_approach3PiniaInFrame runs in the detected builder
       frame). A placeholder diag entry is set here; the SW merges the real
       A3 result (including iframeFrameId) into diag.approach3 after this
       function returns.
       ════════════════════════════════════════════════════════════════════════ */
    diag.approach3 = { result: "pending-frame-targeted-run" };

    /* ── Approach 2 or 2B succeeded — Firebase write confirmed ───────────── *
     * GHL will read the new page data on next reload.                         */
    if (diag.approach2?.fallThrough === true || diag.approach2b_ok === true) {
      const method = diag.approach2?.fallThrough ? "firebase-write" : "firebase-write-constructed";
      return JSON.stringify({ ok: true, method, diag });
    }

    /* All direct approaches failed — but Approach 0 (clipboard) may still work.
       Tell the user to try Ctrl+V in the builder — if GHL reads from any of the
       localStorage clipboard keys we wrote, the content will paste natively. */
    const a1  = JSON.stringify(diag.approach1).slice(0, 80);
    const a2  = JSON.stringify(diag.approach2?.result ?? diag.approach2).slice(0, 80);
    const a2b = diag.approach2b ? `A2b=${diag.approach2b.result ?? "?"} http=${diag.approach2b.httpStatus ?? "?"}` : "A2b=skipped";
    const a3  = "frame-targeted-pending";
    return JSON.stringify({
      ok:      false,
      method:  "clipboard-ready",
      _a3pending: true,
      warning: true,
      error:   `Approaches 0/1/2/2B incomplete; Approach 3 (Pinia) running in builder frame. Diag: A1=${a1} | A2=${a2} | ${a2b} | A3=${a3}.`,
      diag,
    });
  } catch (e) {
    return JSON.stringify({
      ok:    false,
      error: `_cf_injectViaBuilderSave threw: ${String(e).slice(0, 180)}`,
      diag,
    });
  }
}

/* ─── _cf_probePinia ──────────────────────────────────────────────────────────
   Probe injected into ALL frames with allFrames:true. Returns true if a live
   Pinia instance with ≥1 store exists in this frame's Vue app.                */
function _cf_probePinia() {
  const tryEls = [
    document.querySelector("#app"),
    document.documentElement,
    ...Array.from(document.querySelectorAll("[data-v-app]")).slice(0, 3),
  ].filter(Boolean);
  for (const el of tryEls) {
    const va = el.__vue_app__;
    if (!va) continue;
    const provides = va._context?.provides ?? {};
    const p = provides[Symbol.for("pinia")]
      ?? Object.values(provides).find(v => v && v._s instanceof Map)
      ?? null;
    if (p && p._s instanceof Map && p._s.size > 0) return true;
  }
  return false;
}

/* ─── _cf_approach4VuexInFrame ────────────────────────────────────────────────
   Approach 4: Vue 2 / Nuxt 2 Vuex direct state mutation.
   GHL's older builder (Nuxt 2) exposes its store via window.__nuxt__.$store.
   We find the module containing rows/columns/elements and directly patch it,
   then trigger a re-render. This bypasses the Firebase read path entirely so
   the builder immediately shows our content without needing an iframe reload. */
function _cf_approach4VuexInFrame(builderId, locationId, pageData) {
  const diag4 = { source: "vuex-frame-targeted", storeFound: false };
  try {
    /* ── 1. Locate the Vuex store ────────────────────────────────────────── */
    let store =
      window.__nuxt__?.$store
      ?? window.__vue_store__
      ?? null;

    /* Fallback: walk Vue 2 component tree from #app */
    if (!store) {
      const root = document.querySelector("#app")?.__vue__;
      if (root) store = root.$store ?? root.$root?.$store ?? null;
    }
    /* Fallback: scan all Vue roots in DOM */
    if (!store) {
      for (const el of document.querySelectorAll("*")) {
        const v = el.__vue__;
        if (v && v.$store) { store = v.$store; break; }
      }
    }

    if (!store) {
      diag4.result = "no vuex store found";
      return JSON.stringify({ ok: false, method: "vuex-direct", diag: { approach4: diag4 } });
    }
    diag4.storeFound = true;

    /* ── 2. Identify state module containing builder data ───────────────── */
    const state = store.state ?? {};
    const topStateKeys = Object.keys(state).slice(0, 30);
    diag4.topStateKeys = topStateKeys;

    let moduleKey = null;
    let mod = null;
    for (const k of topStateKeys) {
      const m = state[k];
      if (m && typeof m === "object" && !Array.isArray(m)) {
        const mk = Object.keys(m);
        if (mk.includes("rows") || mk.includes("sections") || mk.includes("elements")) {
          moduleKey = k;
          mod = m;
          break;
        }
      }
    }

    /* Fallback: look at root state directly */
    if (!mod) {
      const rootKeys = Object.keys(state);
      if (rootKeys.includes("rows") || rootKeys.includes("sections")) {
        moduleKey = "__root__";
        mod = state;
      }
    }

    if (!mod) {
      diag4.result = "no state module with rows/sections/elements";
      diag4.topStateKeys = topStateKeys;
      return JSON.stringify({ ok: false, method: "vuex-direct", diag: { approach4: diag4 } });
    }
    diag4.moduleKey     = moduleKey;
    diag4.moduleDataKeys = Object.keys(mod).slice(0, 20);

    /* ── 3. Log available mutations for diagnosis ───────────────────────── */
    const mutKeys = Object.keys(store._mutations ?? {});
    diag4.mutKeySample = mutKeys.filter(k =>
      /row|col|elem|section|page|node|builder/i.test(k)
    ).slice(0, 20);

    /* ── 4. Directly patch the state ─────────────────────────────────────── */
    const rows     = pageData.rows     ?? {};
    const columns  = pageData.columns  ?? {};
    const elements = pageData.elements ?? {};
    const sections = pageData.sections ?? [];

    let patched = {};
    if ("rows"     in mod) { mod.rows     = rows;     patched.rows     = Object.keys(rows).length; }
    if ("columns"  in mod) { mod.columns  = columns;  patched.columns  = Object.keys(columns).length; }
    if ("elements" in mod) { mod.elements = elements; patched.elements = Object.keys(elements).length; }
    if ("sections" in mod && sections.length) {
      mod.sections = sections;
      patched.sections = sections.length;
    }
    diag4.patched = patched;

    /* ── 5. Force Vue 2 re-render ────────────────────────────────────────── */
    /* Try $forceUpdate on root Vue instance */
    const tryRoots = [
      window.__nuxt__,
      document.querySelector("#app")?.__vue__,
    ].filter(Boolean);
    let forced = false;
    for (const r of tryRoots) {
      const root = r.$root ?? r;
      if (root.$forceUpdate) { root.$forceUpdate(); forced = true; break; }
    }
    diag4.forced = forced;

    /* ── 6. Also try committing known GHL mutations ──────────────────────── */
    const tryCommit = (name, payload) => {
      try { store.commit(name, payload); return true; } catch (_) { return false; }
    };
    const commitResults = {};
    for (const mk of mutKeys) {
      if (/setRows|SET_ROWS|setPageRows|setBuilderRows/i.test(mk)) {
        commitResults[mk] = tryCommit(mk, rows);
      }
      if (/setElements|SET_ELEMENTS|setPageElements/i.test(mk)) {
        commitResults[mk] = tryCommit(mk, elements);
      }
    }
    diag4.commitResults = commitResults;

    diag4.result = "patched";
    return JSON.stringify({
      ok:     true,
      method: "vuex-direct",
      diag:   { approach4: diag4 },
    });
  } catch (e) {
    diag4.result = `threw: ${String(e).slice(0, 120)}`;
    return JSON.stringify({ ok: false, method: "vuex-direct", diag: { approach4: diag4 } });
  }
}

/* ─── _cf_approach3PiniaInFrame ───────────────────────────────────────────────
   Self-contained Approach 3 execution — injected into the DETECTED BUILDER
   FRAME (top frame or builder iframe, as determined by the SW frame probe).
   Finds the Pinia instance, patches the page-data store, and triggers a native
   save. Returns a JSON-serialised result + diag.approach3 object.              */
async function _cf_approach3PiniaInFrame(builderId, locationId, pageData) {
  const diag3 = {
    piniaSource:    "frame-targeted",
    storeCount:     0,
    storeIds:       [],
    candidates:     [],
    clipboardStores: [],
  };
  try {
    /* ── Find Pinia in THIS frame ─────────────────────────────────────────── */
    /* Try window-level pinia first (sometimes GHL exposes it directly) */
    let pinia = null;
    try {
      const wp = window._pinia ?? window.pinia ?? window.__pinia ?? null;
      if (wp && wp._s instanceof Map) { pinia = wp; diag3.piniaSource = "window-global"; }
    } catch (_wp) {}

    if (!pinia) {
      const tryEls = [
        document.querySelector("#app"),
        document.documentElement,
        ...Array.from(document.querySelectorAll("[data-v-app]")).slice(0, 3),
      ].filter(Boolean);
      for (const el of tryEls) {
        const va = el.__vue_app__;
        if (!va) continue;
        const provides = va._context?.provides ?? {};
        const p = provides[Symbol.for("pinia")]
          ?? Object.values(provides).find(v => v && v._s instanceof Map)
          ?? null;
        if (p && p._s instanceof Map) { pinia = p; break; }
      }
    }

    if (!pinia || !(pinia._s instanceof Map)) {
      diag3.result = "Pinia not found in frame";
      return JSON.stringify({ ok: false, diag: { approach3: diag3 } });
    }

    const storeIds = [...pinia._s.keys()];
    diag3.storeCount = storeIds.length;
    diag3.storeIds   = storeIds.slice(0, 20);
    diag3.allStoreIds = storeIds.slice(0, 30);

    /* ── Probe clipboard stores ──────────────────────────────────────────── */
    const clipStoreDiag = [];
    for (const [storeId, store] of pinia._s) {
      const state    = store.$state ?? {};
      const clipKeys = Object.keys(state).filter(k => /clipboard|copy|paste|buffer/i.test(k));
      if (clipKeys.length === 0) continue;
      const entry = { storeId, clipboardKeys: clipKeys, patched: false, pasteAttempted: false };
      try {
        const patch = {};
        for (const ck of clipKeys) patch[ck] = pageData;
        store.$patch(patch);
        entry.patched = true;
        for (const pa of ["paste", "pasteSection", "applyClipboard", "doPaste", "pasteElement"]) {
          if (typeof store[pa] === "function") {
            try { await store[pa](); entry.pasteAttempted = pa; break; } catch(_) {}
          }
        }
      } catch (ce) { entry.error = String(ce).slice(0, 60); }
      clipStoreDiag.push(entry);
    }
    diag3.clipboardStores = clipStoreDiag;

    /* ── Identify candidate page-data stores ────────────────────────────── */
    const candidates = [];
    for (const [storeId, store] of pinia._s) {
      const state = store.$state ?? {};
      const keys  = Object.keys(state);
      const hasSections = keys.includes("sections");
      const hasRows     = keys.includes("rows");
      const hasElements = keys.includes("elements");
      const hasColumns  = keys.includes("columns");
      const hasPageData = keys.includes("pageData");
      const score = (hasSections ? 3 : 0) + (hasRows ? 2 : 0) + (hasElements ? 2 : 0)
                  + (hasColumns ? 1 : 0) + (hasPageData ? 1 : 0);
      if (score > 0) candidates.push({ storeId, store, keys, score, hasPageData, hasSections });
    }
    candidates.sort((a, b) => b.score - a.score);
    diag3.candidates = candidates.map(c => ({ storeId: c.storeId, score: c.score })).slice(0, 10);

    if (candidates.length === 0) {
      diag3.result = "no store with GHL page structure found";
      return JSON.stringify({ ok: false, diag: { approach3: diag3 } });
    }

    /* ── Patch each candidate + try save actions ─────────────────────────── */
    const SAVE_ACTIONS = ["savePage", "savePageData", "save", "autoSave",
                          "updatePage", "saveCurrentPage", "persistPage"];
    let successResult = null;
    const candidateDiag = [];

    for (const { storeId, store, keys, hasPageData, hasSections } of candidates) {
      const cd = { storeId, stateKeys: keys.slice(0, 20), patched: false, savedVia: null, errors: [] };
      try {
        if (hasPageData && !hasSections) {
          store.$patch({ pageData });
          cd.patchShape = "nested-pageData";
        } else {
          store.$patch(pageData);
          cd.patchShape = "root";
        }
        cd.patched = true;
      } catch (pe) {
        cd.patchError = String(pe).slice(0, 80);
        candidateDiag.push(cd);
        continue;
      }
      for (const action of SAVE_ACTIONS) {
        if (typeof store[action] === "function") {
          try {
            await store[action]();
            cd.savedVia = action;
            break;
          } catch (se) {
            cd.errors.push(`${action}:${String(se).slice(0, 50)}`);
          }
        }
      }
      candidateDiag.push(cd);
      if (cd.savedVia) {
        successResult = { storeId, savedVia: cd.savedVia, patchShape: cd.patchShape };
        break;
      }
    }

    diag3.candidateDiag = candidateDiag;

    if (successResult) {
      diag3.result = "success";
      return JSON.stringify({
        ok:         true,
        method:     "pinia",
        storeId:    successResult.storeId,
        savedVia:   successResult.savedVia,
        patchShape: successResult.patchShape,
        diag:       { approach3: diag3 },
      });
    } else if (candidateDiag.some(c => c.patched)) {
      const patchedStore = candidateDiag.find(c => c.patched);
      diag3.result = "patched-no-save";
      return JSON.stringify({
        ok:      true,
        method:  "pinia-patched",
        storeId: patchedStore?.storeId,
        savedVia: null,
        diag:    { approach3: diag3 },
        warning: "Content injected into builder (visible now). Click Save in GHL to persist permanently.",
      });
    }

    diag3.result = "no candidate saved";
    return JSON.stringify({ ok: false, diag: { approach3: diag3 } });

  } catch (e) {
    diag3.result = `threw: ${String(e).slice(0, 180)}`;
    return JSON.stringify({ ok: false, diag: { approach3: diag3 } });
  }
}

/* Inject a short-lived fetch interceptor into the GHL MAIN world.
 * Captures 4xx/5xx responses from backend.leadconnectorhq.com, reads the
 * body, then postMessages CF_GHL_BACKEND_ERROR for content.js to relay.
 * Auto-removes after 20 seconds. This function is passed to executeScript
 * so it must be self-contained.                                           */
function _cf_injectFetchSniffer() {
  if (window.__cfFetchSniffInstalled) return;
  window.__cfFetchSniffInstalled = true;
  var origFetch = window.fetch;
  function cleanup() { window.fetch = origFetch; window.__cfFetchSniffInstalled = false; }
  var sniffTimer = setTimeout(cleanup, 20000);
  window.fetch = function() {
    var args = Array.prototype.slice.call(arguments);
    return origFetch.apply(this, args).then(function(response) {
      var url = typeof args[0] === "string" ? args[0] : (args[0] && args[0].url ? args[0].url : "");
      if ((url.indexOf("backend.leadconnectorhq.com") !== -1 || url.indexOf("leadconnecto") !== -1) &&
          response.status >= 400) {
        try {
          var clone = response.clone();
          clone.text().then(function(body) {
            clearTimeout(sniffTimer); cleanup();
            window.postMessage({ source: "cf-network-sniffer", type: "CF_GHL_BACKEND_ERROR",
              status: response.status, url: url.slice(0, 120), body: body.slice(0, 500) }, "*");
          });
        } catch(_) {}
      }
      return response;
    });
  };
}

/* Reload the GHL builder iframe to reflect cloned content. */
async function _cf_refreshBuilderIframe() {
  try {
    /* ── Step 1: bust GHL's service-worker cache for Firebase Storage ──────
     * GHL registers a SW that caches Firebase Storage responses with a
     * cache-first strategy.  A plain window.location.reload() makes the SW
     * serve the old cached pageData, so our write is never seen by the
     * builder.  We enumerate every SW cache and delete any entry whose URL
     * contains "firebasestorage.googleapis.com" before reloading.          */
    let cacheCleared = 0;
    if (typeof caches !== "undefined") {
      try {
        const cacheNames = await caches.keys();
        for (const name of cacheNames) {
          const c    = await caches.open(name);
          const keys = await c.keys();
          for (const req of keys) {
            if (req.url.includes("firebasestorage.googleapis.com")) {
              await c.delete(req);
              cacheCleared++;
            }
          }
        }
      } catch(_) {}
    }

    /* ── Step 2: reload the builder ─────────────────────────────────────── */
    const iframe = document.querySelector('iframe[name="funnel-builder"]');
    if (!iframe) {
      window.location.reload();
      return JSON.stringify({ ok: true, method: "cache-bust+page-reload", cacheCleared });
    }
    iframe.src = iframe.src;
    return JSON.stringify({ ok: true, method: "cache-bust+iframe-reload", cacheCleared, src: iframe.src.slice(0, 80) });
  } catch(e) {
    return JSON.stringify({ ok: false, error: String(e).slice(0, 100) });
  }
}

/* ─── _cf_captureCloneBaseline ───────────────────────────────────────────────
 * Reads the FULL Firebase page data for the current GHL builder page and
 * returns it verbatim along with structural summary stats.
 * Used by CF_CAPTURE_CLONE_BASELINE to store a "gold-standard" clone so we can
 * deep-diff it against our AI-generated output and find every schema mismatch.
 * ─────────────────────────────────────────────────────────────────────────── */
async function _cf_captureCloneBaseline(builderId) {
  const diag = {};
  try {
    const appEl = document.querySelector("#app");
    let revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    if (!revex) {
      for (const ai of Object.values(window.app ?? {})) {
        const r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && typeof r.get === "function") { revex = r; break; }
      }
    }
    if (!revex) return JSON.stringify({ ok: false, error: "revex not found — builder must be fully loaded" });

    let metadata = null;
    try { const r = await revex.get(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`); metadata = r?.data ?? r ?? null; } catch (_) {}
    if (!metadata) { try { const r2 = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`); metadata = r2?.data ?? r2 ?? null; } catch (_) {} }
    const downloadUrl = metadata?.pageDataDownloadUrl ?? null;
    if (!downloadUrl) return JSON.stringify({ ok: false, error: "no downloadUrl in GHL metadata", diag });

    const fbMatch = downloadUrl.match(/firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?]+)/);
    if (!fbMatch) return JSON.stringify({ ok: false, error: "could not parse Firebase URL", diag });
    const bucket = decodeURIComponent(fbMatch[1]);
    diag.bucket = bucket.slice(0, 60);

    let idToken = null;
    try { if (typeof firebase !== "undefined" && firebase.apps?.length) { const u = firebase.auth().currentUser; if (u) idToken = await u.getIdToken(true); } } catch (_) {}
    if (!idToken) {
      try {
        for (const val of Object.values(window)) {
          if (!val || typeof val !== "object") continue;
          if (typeof val.auth === "function") { const a = val.auth(); if (a?.currentUser) { idToken = await a.currentUser.getIdToken(true); break; } }
        }
      } catch (_) {}
    }
    if (!idToken) {
      idToken = await new Promise(resolve => {
        try {
          const req = indexedDB.open("firebaseLocalStorageDb");
          req.onerror = () => resolve(null);
          req.onsuccess = evt => {
            const db = evt.target.result;
            if (!db.objectStoreNames.contains("firebaseLocalStorage")) { db.close(); resolve(null); return; }
            const getAll = db.transaction("firebaseLocalStorage","readonly").objectStore("firebaseLocalStorage").getAll();
            getAll.onerror   = () => { db.close(); resolve(null); };
            getAll.onsuccess = e2 => { db.close(); for (const rec of (e2.target.result ?? [])) { const t = rec?.value?.stsTokenManager?.accessToken; if (t) { resolve(t); return; } } resolve(null); };
          };
        } catch (_) { resolve(null); }
      });
    }
    if (!idToken) return JSON.stringify({ ok: false, error: "no auth token", diag });

    const readRes = await fetch(downloadUrl, { headers: { "Authorization": `Firebase ${idToken}` }, signal: AbortSignal.timeout(8000) });
    if (!readRes.ok) return JSON.stringify({ ok: false, error: `read failed HTTP ${readRes.status}`, diag });
    const fullData = await readRes.json();

    /* Build structural summary for popup display */
    const secs = Array.isArray(fullData.sections) ? fullData.sections : [];
    diag.topLevelKeys       = Object.keys(fullData);
    diag.sectionCount       = secs.length;
    diag.rowCount           = fullData.rows     ? Object.keys(fullData.rows).length     : 0;
    diag.colCount           = fullData.columns  ? Object.keys(fullData.columns).length  : 0;
    diag.elemCount          = fullData.elements ? Object.keys(fullData.elements).length : 0;
    diag.sectionElemCounts  = secs.map(s => Array.isArray(s.elements) ? s.elements.length : 0);
    diag.sectionMetaChildLengths = secs.map(s => Array.isArray(s.metaData?.child) ? s.metaData.child.length : 0);

    const sec0      = secs[0] ?? null;
    diag.sec0Keys   = sec0 ? Object.keys(sec0) : [];
    const sec0Elems = sec0 && Array.isArray(sec0.elements) ? sec0.elements : [];
    diag.sec0ElemCount      = sec0Elems.length;
    diag.sec0ElemFieldKeys  = sec0Elems.length > 0 ? [...new Set(sec0Elems.flatMap(e => Object.keys(e)))] : [];
    diag.sec0MetaChildLen   = Array.isArray(sec0?.metaData?.child) ? sec0.metaData.child.length : 0;

    const row0 = fullData.rows ? Object.values(fullData.rows)[0] : null;
    diag.row0Keys    = row0 ? Object.keys(row0).slice(0, 12)       : [];
    diag.row0MetaKeys= row0?.metaData ? Object.keys(row0.metaData).slice(0, 12) : [];

    const col0 = fullData.columns ? Object.values(fullData.columns)[0] : null;
    diag.col0Keys    = col0 ? Object.keys(col0).slice(0, 12)       : [];
    diag.col0MetaKeys= col0?.metaData ? Object.keys(col0.metaData).slice(0, 12) : [];

    const elem0 = fullData.elements ? Object.values(fullData.elements)[0] : null;
    diag.elem0Keys   = elem0 ? Object.keys(elem0).slice(0, 12)     : [];
    diag.elem0MetaKeys = elem0?.metaData ? Object.keys(elem0.metaData).slice(0, 12) : [];

    return JSON.stringify({ ok: true, fullData, diag, capturedAt: Date.now(), builderId });
  } catch (err) {
    return JSON.stringify({ ok: false, error: String(err).slice(0, 200), diag });
  }
}

/* ─── _cf_readFirebaseSchema ─────────────────────────────────────────────────
 * Lightweight read-only Firebase schema probe (no write).
 * Used by CF_SCHEMA_DIFF to capture the GHL native data shape for comparison
 * with what our inject pipeline would produce.
 * ─────────────────────────────────────────────────────────────────────────── */
async function _cf_readFirebaseSchema(builderId) {
  const diag = {};
  try {
    const appEl = document.querySelector("#app");
    let revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    if (!revex) {
      for (const ai of Object.values(window.app ?? {})) {
        const r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && typeof r.get === "function") { revex = r; break; }
      }
    }
    if (!revex) return JSON.stringify({ ok: false, error: "revex not found", diag });

    let metadata = null;
    try { const r = await revex.get(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`); metadata = r?.data ?? r ?? null; } catch (_) {}
    if (!metadata) { try { const r2 = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`); metadata = r2?.data ?? r2 ?? null; } catch (_) {} }
    const downloadUrl = metadata?.pageDataDownloadUrl ?? null;
    diag.hasDownloadUrl = !!downloadUrl;
    if (!downloadUrl) return JSON.stringify({ ok: false, error: "no downloadUrl in GHL metadata", diag });

    const fbMatch = downloadUrl.match(/firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?]+)/);
    if (!fbMatch) return JSON.stringify({ ok: false, error: "could not parse Firebase URL", diag });
    const bucket = decodeURIComponent(fbMatch[1]);
    diag.bucket = bucket.slice(0, 60);

    let idToken = null;
    try { if (typeof firebase !== "undefined" && firebase.apps?.length) { const u = firebase.auth().currentUser; if (u) idToken = await u.getIdToken(true); } } catch (_) {}
    if (!idToken) {
      try {
        for (const val of Object.values(window)) {
          if (!val || typeof val !== "object") continue;
          if (typeof val.auth === "function") { const a = val.auth(); if (a?.currentUser) { idToken = await a.currentUser.getIdToken(true); break; } }
        }
      } catch (_) {}
    }
    if (!idToken) {
      idToken = await new Promise(resolve => {
        try {
          const req = indexedDB.open("firebaseLocalStorageDb");
          req.onerror = () => resolve(null);
          req.onsuccess = evt => {
            const db = evt.target.result;
            if (!db.objectStoreNames.contains("firebaseLocalStorage")) { db.close(); resolve(null); return; }
            const getAll = db.transaction("firebaseLocalStorage","readonly").objectStore("firebaseLocalStorage").getAll();
            getAll.onerror   = () => { db.close(); resolve(null); };
            getAll.onsuccess = e2 => { db.close(); for (const rec of (e2.target.result ?? [])) { const t = rec?.value?.stsTokenManager?.accessToken; if (t) { resolve(t); return; } } resolve(null); };
          };
        } catch (_) { resolve(null); }
      });
    }
    if (!idToken) return JSON.stringify({ ok: false, error: "no auth token", diag });

    const readRes = await fetch(downloadUrl, { headers: { "Authorization": `Firebase ${idToken}` }, signal: AbortSignal.timeout(8000) });
    if (!readRes.ok) return JSON.stringify({ ok: false, error: `read failed HTTP ${readRes.status}`, diag });
    const existing = await readRes.json();
    diag.readOk = true;

    diag.topLevelKeys  = Object.keys(existing).slice(0, 20);
    diag.sectionCount  = Array.isArray(existing.sections) ? existing.sections.length : 0;
    diag.rowCount      = existing.rows     ? Object.keys(existing.rows).length     : 0;
    diag.colCount      = existing.columns  ? Object.keys(existing.columns).length  : 0;
    diag.elemCount     = existing.elements ? Object.keys(existing.elements).length : 0;

    const sec0 = Array.isArray(existing.sections) ? existing.sections[0] : null;
    diag.sec0Keys        = sec0 ? Object.keys(sec0).slice(0, 14) : "none";
    diag.sec0HasElements = sec0 ? ("elements" in sec0) : null;
    const _sArr = sec0 && Array.isArray(sec0.elements) ? sec0.elements : null;
    diag.sec0ElementsLen = _sArr ? _sArr.length : (sec0 && "elements" in sec0 ? "non-array" : "key-missing");
    const _s0e0 = _sArr?.[0] ?? null;
    diag.sec0El0Keys        = _s0e0 ? Object.keys(_s0e0).slice(0, 10) : (_sArr?.length === 0 ? "empty-array" : "n/a");
    diag.sec0El0HasMeta     = _s0e0 ? ("metaData" in _s0e0) : false;
    diag.sec0El0HasElements = _s0e0 ? ("elements" in _s0e0) : false;

    const row0 = existing.rows ? Object.values(existing.rows)[0] : null;
    diag.row0Keys        = row0 ? Object.keys(row0).slice(0, 10)    : "none";
    diag.row0HasElements = row0 ? ("elements" in row0)               : false;
    diag.row0MetaKeys    = row0?.metaData ? Object.keys(row0.metaData).slice(0, 10) : "none";

    const col0 = existing.columns ? Object.values(existing.columns)[0] : null;
    diag.col0Keys        = col0 ? Object.keys(col0).slice(0, 10)    : "none";
    diag.col0HasElements = col0 ? ("elements" in col0)               : false;

    const elem0 = existing.elements ? Object.values(existing.elements)[0] : null;
    diag.elem0Keys        = elem0 ? Object.keys(elem0).slice(0, 10)  : "none";
    diag.elem0HasElements = elem0 ? ("elements" in elem0)            : false;

    diag.anyRowHasElements  = existing.rows     ? Object.values(existing.rows).some(r    => "elements" in r)    : false;
    diag.anyColHasElements  = existing.columns  ? Object.values(existing.columns).some(c => "elements" in c)    : false;
    diag.anyElemHasElements = existing.elements ? Object.values(existing.elements).some(e => "elements" in e)   : false;

    return JSON.stringify({ ok: true, diag });
  } catch (err) {
    return JSON.stringify({ ok: false, error: String(err).slice(0, 160), diag });
  }
}

/* ─── _cf_roundtripFirebaseWrite ────────────────────────────────────────────
 * Roundtrip diagnostic: read existing Firebase page data → deep probe its
 * structure → write it BACK UNCHANGED → verify the re-read.
 *
 * Used to pinpoint whether "TypeError: o1.elements is not iterable" comes from:
 *   A) our AI-generated data format, or
 *   B) the Firebase write/reload mechanism itself
 *
 * If the error appears after roundtripping ORIGINAL data → cause is (B).
 * If the error disappears → cause is (A) and we need to match the exact format.
 * Also captures firstElemTopKeys/firstColTopKeys so we know GHL's exact schema.
 *
 * Returns { ok, diag } serialised as JSON.
 * ─────────────────────────────────────────────────────────────────────────── */
async function _cf_roundtripFirebaseWrite(builderId) {
  const diag = {};
  try {
    /* 1. Find revexBackendService */
    const appEl = document.querySelector("#app");
    let revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    if (!revex) {
      for (const ai of Object.values(window.app ?? {})) {
        const r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && typeof r.get === "function") { revex = r; break; }
      }
    }
    if (!revex) return JSON.stringify({ ok: false, error: "revex not found — builder must be fully loaded", diag });

    /* 2. Fetch GHL page metadata → downloadUrl */
    let metadata = null;
    try {
      const r = await revex.get(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`);
      metadata = r?.data ?? r ?? null;
    } catch (_) {
      try {
        const r2 = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
        metadata = r2?.data ?? r2 ?? null;
      } catch (_2) {}
    }
    const downloadUrl = metadata?.pageDataDownloadUrl ?? null;
    diag.metaOk       = !!metadata;
    diag.hasDownloadUrl = !!downloadUrl;
    if (!downloadUrl) return JSON.stringify({ ok: false, error: "no downloadUrl in GHL metadata", diag });

    /* 3. Parse Firebase bucket + objectPath */
    const fbMatch = downloadUrl.match(
      /firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?]+)/
    );
    if (!fbMatch) return JSON.stringify({ ok: false, error: "could not parse Firebase URL", diag });
    const bucket     = decodeURIComponent(fbMatch[1]);
    const objectPath = decodeURIComponent(fbMatch[2]);
    diag.bucket = bucket.slice(0, 60);

    /* 4. Get Firebase auth token (same v8/IDB logic as Approach 2) */
    let idToken = null;
    const tokenDiag = [];
    try {
      if (typeof firebase !== "undefined" && firebase.apps?.length) {
        const user = firebase.auth().currentUser;
        if (user) { idToken = await user.getIdToken(true); tokenDiag.push("v8"); }
      }
    } catch (te1) { tokenDiag.push(`v8-err:${String(te1).slice(0, 30)}`); }
    if (!idToken) {
      try {
        for (const val of Object.values(window)) {
          if (!val || typeof val !== "object") continue;
          if (typeof val.auth === "function") {
            const auth = val.auth();
            if (auth?.currentUser) { idToken = await auth.currentUser.getIdToken(true); tokenDiag.push("win-prop"); break; }
          }
        }
      } catch (te2) { tokenDiag.push(`win-err:${String(te2).slice(0, 30)}`); }
    }
    if (!idToken) {
      try {
        idToken = await new Promise((resolve) => {
          const req = indexedDB.open("firebaseLocalStorageDb");
          req.onerror = () => resolve(null);
          req.onsuccess = (evt) => {
            const db = evt.target.result;
            if (!db.objectStoreNames.contains("firebaseLocalStorage")) { db.close(); resolve(null); return; }
            const tx    = db.transaction("firebaseLocalStorage", "readonly");
            const store = tx.objectStore("firebaseLocalStorage");
            const getAll = store.getAll();
            getAll.onerror   = () => { db.close(); resolve(null); };
            getAll.onsuccess = (e2) => {
              db.close();
              for (const rec of (e2.target.result ?? [])) {
                const token = rec?.value?.stsTokenManager?.accessToken;
                if (token) { resolve(token); return; }
              }
              resolve(null);
            };
          };
        });
        if (idToken) tokenDiag.push("idb-v9");
      } catch (te5) { tokenDiag.push(`idb-err:${String(te5).slice(0, 30)}`); }
    }
    diag.tokenDiag = tokenDiag;
    if (!idToken) return JSON.stringify({ ok: false, error: "no Firebase auth token found", diag });

    /* 5. Read EXISTING Firebase page data */
    const readRes = await fetch(downloadUrl, {
      headers: { "Authorization": `Firebase ${idToken}` },
      signal:  AbortSignal.timeout(8000),
    });
    if (!readRes.ok) return JSON.stringify({ ok: false, error: `read failed HTTP ${readRes.status}`, diag });
    const existing = await readRes.json();
    diag.readOk = true;

    /* 6. DEEP structural probes — capture GHL's own exact schema ─────────── */
    diag.topLevelKeys   = Object.keys(existing).slice(0, 20);
    diag.payloadId      = existing.id ?? "missing";
    diag.sectionCount   = Array.isArray(existing.sections) ? existing.sections.length : "not-array";
    diag.rowCount       = existing.rows     ? Object.keys(existing.rows).length     : 0;
    diag.colCount       = existing.columns  ? Object.keys(existing.columns).length  : 0;
    diag.elemCount      = existing.elements ? Object.keys(existing.elements).length : 0;

    /* First section */
    const firstSec = Array.isArray(existing.sections) && existing.sections[0];
    diag.firstSecTopKeys      = firstSec ? Object.keys(firstSec).slice(0, 14) : "none";
    diag.firstSecMetaKeys     = firstSec?.metaData ? Object.keys(firstSec.metaData).slice(0, 14) : "none";
    /* KEY diagnostic: does a REAL GHL section in Firebase carry an `elements` array?
     * true  → sections store pre-built tree (elements arrays are expected in Firebase)
     * false → sections store only metaData + child refs (GHL builds tree from flat dicts) */
    diag.firstSecHasElements  = firstSec ? ("elements" in firstSec) : null;
    /* v2.34.0: capture native sec0.metaData.child — is it empty or populated?
     * If empty [], it confirms GHL uses elements array only and child refs are not needed.
     * If populated, it tells us what IDs are expected (even though rows dict is empty).  */
    const _sec0Child = Array.isArray(firstSec?.metaData?.child) ? firstSec.metaData.child : null;
    diag.sec0MetaChildLen    = _sec0Child !== null ? _sec0Child.length : "no-array";
    diag.sec0MetaChildSample = _sec0Child ? _sec0Child.slice(0, 2) : "none";

    /* Deep probe: what does section[0].elements[0] actually look like?
     * Critical for deciding whether elements are shallow rows, deep trees, or IDs.
     * Only meaningful on pages with real content (non-empty sections).             */
    const _sec0ElArr = firstSec && Array.isArray(firstSec.elements) ? firstSec.elements : null;
    const _sec0El0   = _sec0ElArr?.[0] ?? null;
    diag.sec0ElementsLength       = _sec0ElArr
      ? _sec0ElArr.length
      : (firstSec && "elements" in firstSec ? "non-array" : "key-missing");
    diag.sec0Elements0Keys        = _sec0El0
      ? Object.keys(_sec0El0).slice(0, 10)
      : (_sec0ElArr?.length === 0 ? "empty-array" : "n/a");
    diag.sec0Elements0HasMeta     = _sec0El0 ? ("metaData" in _sec0El0)   : false;
    diag.sec0Elements0HasElements = _sec0El0 ? ("elements" in _sec0El0)   : false;
    diag.sec0Elements0ChildType   = _sec0El0
      ? (Array.isArray(_sec0El0?.metaData?.child)
          ? `array[${_sec0El0.metaData.child.length}]`
          : typeof (_sec0El0?.metaData?.child ?? null))
      : "n/a";

    /* First row */
    const firstRow = existing.rows ? Object.values(existing.rows)[0] : null;
    diag.firstRowTopKeys      = firstRow ? Object.keys(firstRow).slice(0, 14)                         : "none";
    diag.firstRowMetaKeys     = firstRow?.metaData ? Object.keys(firstRow.metaData).slice(0, 14)     : "none";
    diag.firstRowHasElements  = firstRow ? ("elements" in firstRow)                                   : false;

    /* First column — CRITICAL: does GHL put `elements` at top level on cols? */
    const firstCol = existing.columns ? Object.values(existing.columns)[0] : null;
    diag.firstColTopKeys          = firstCol ? Object.keys(firstCol).slice(0, 14)                       : "none";
    diag.firstColMetaKeys         = firstCol?.metaData ? Object.keys(firstCol.metaData).slice(0, 14)   : "none";
    diag.firstColHasElements      = firstCol ? ("elements" in firstCol)                                 : false;
    diag.firstColElemCopyKeys     = firstCol?.metaData?.element
      ? Object.keys(firstCol.metaData.element).slice(0, 14) : "none";

    /* First element — CRITICAL: does GHL's own element have top-level `elements`? */
    const firstElem = existing.elements ? Object.values(existing.elements)[0] : null;
    diag.firstElemTopKeys          = firstElem ? Object.keys(firstElem).slice(0, 14)                       : "none";
    diag.firstElemMetaKeys         = firstElem?.metaData ? Object.keys(firstElem.metaData).slice(0, 14)   : "none";
    diag.firstElemHasElements      = firstElem ? ("elements" in firstElem)                                 : false;
    diag.firstElemMetaHasElements  = firstElem?.metaData ? ("elements" in firstElem.metaData)             : false;
    /* What's inside the .element nested copy in metaData? */
    diag.firstElemElemCopyKeys     = firstElem?.metaData?.element
      ? Object.keys(firstElem.metaData.element).slice(0, 14) : "none";
    diag.firstElemElemCopyHasElems = firstElem?.metaData?.element
      ? ("elements" in firstElem.metaData.element) : false;

    /* Breadth check — do ANY rows/cols/elems have top-level `elements`? */
    diag.anyRowHasElements  = existing.rows
      ? Object.values(existing.rows).some(r => "elements" in r) : false;
    diag.anyColHasElements  = existing.columns
      ? Object.values(existing.columns).some(c => "elements" in c) : false;
    diag.anyElemHasElements = existing.elements
      ? Object.values(existing.elements).some(e => "elements" in e) : false;
    diag.sectionsWithTopLevelElements = Array.isArray(existing.sections)
      ? existing.sections.filter(s => "elements" in s).length : 0;

    /* 6b. Test if download URL is publicly accessible WITHOUT auth (as GHL reads it) */
    try {
      const pubBefore = await fetch(downloadUrl, {
        signal: AbortSignal.timeout(4000),
      });
      diag.publicReadBefore = { status: pubBefore.status, ok: pubBefore.ok };
    } catch (_pb) { diag.publicReadBefore = { error: "timeout-or-cors" }; }

    /* 7. Write the EXACT SAME DATA BACK — no modifications whatsoever ──────── */
    /* encodedPath: single encodeURIComponent of full path → uses %2F between
     * path components, which is what Firebase Storage REST API requires.
     * NOTE: The old approach of .split("/").map(encodeURIComponent).join("/")
     * was WRONG — it kept literal "/" separators → Firebase returned 400.     */
    const encodedPath = encodeURIComponent(objectPath);
    const uploadEp =
      `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}` +
      `/o?uploadType=media&name=${encodeURIComponent(objectPath)}`;
    const writeRes = await fetch(uploadEp, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Firebase ${idToken}`,
      },
      body: JSON.stringify(existing),
    });
    diag.writeStatus = writeRes.status;
    diag.writeOk     = writeRes.ok;
    if (!writeRes.ok) {
      const errText = await writeRes.text().catch(() => "");
      diag.writeError = errText.slice(0, 100);
      return JSON.stringify({ ok: false, error: `write failed HTTP ${writeRes.status}`, diag });
    }

    /* 7b. Parse upload response → check if new download token was generated */
    let newFirebaseToken = null;
    try {
      const uploadRespJson = await writeRes.clone().json().catch(() => ({}));
      newFirebaseToken     = uploadRespJson.downloadTokens ?? null;
      const oldTokenCheck  = (downloadUrl.match(/[?&]token=([^&]+)/) ?? [])[1] ?? "";
      diag.oldToken     = oldTokenCheck ? oldTokenCheck.slice(0, 20) + "…" : "none-in-url";
      diag.newToken     = newFirebaseToken ? newFirebaseToken.slice(0, 20) + "…" : "none-in-resp";
      diag.tokenChanged = newFirebaseToken ? (newFirebaseToken !== oldTokenCheck) : false;
    } catch (_te) { diag.newToken = "parse-err"; }

    /* 7c. PATCH Firebase metadata to restore original download token ──────────
     * v2.26.0 FIX: After the upload, Firebase has a NEW downloadToken. GHL's
     * cached pageDataDownloadUrl still has the OLD token → reads return 400.
     * We PATCH the object metadata to restore the OLD token so GHL's cached
     * URL stays valid — no GHL backend update needed.                          */
    const oldTokenForPatch = (downloadUrl.match(/[?&]token=([^&]+)/) ?? [])[1] ?? "";
    const metaEpR =
      `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o/${encodedPath}`;
    let patchSucceededR = false;
    if (oldTokenForPatch) {
      /* Format 1: nested metadata field — verify returned token matches */
      try {
        const pr1 = await fetch(metaEpR, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Firebase ${idToken}` },
          body:    JSON.stringify({ metadata: { downloadTokens: oldTokenForPatch } }),
        });
        diag.patchStatus1 = pr1.status;
        if (pr1.ok) {
          const pr1Body        = await pr1.json().catch(() => ({}));
          const returnedTokenR = pr1Body.metadata?.downloadTokens ?? pr1Body.downloadTokens ?? null;
          const tokenVerifiedR = returnedTokenR === oldTokenForPatch;
          diag.patchTokenOk    = tokenVerifiedR;
          if (tokenVerifiedR) {
            patchSucceededR = true;
            diag.patchToken = "ok-format1";
          } else {
            diag.patchToken         = "accepted-not-verified";
            diag.patchReturnedToken = returnedTokenR ? returnedTokenR.slice(0, 20) + "…" : "null";
          }
        }
      } catch (_rp1) { diag.patchStatus1 = "err"; }

      /* Format 2: top-level field, if format 1 failed/unverified */
      if (!patchSucceededR) {
        try {
          const pr2 = await fetch(metaEpR, {
            method:  "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Firebase ${idToken}` },
            body:    JSON.stringify({ downloadTokens: oldTokenForPatch }),
          });
          diag.patchStatus2 = pr2.status;
          if (pr2.ok) {
            const pr2Body         = await pr2.json().catch(() => ({}));
            const returnedToken2R = pr2Body.metadata?.downloadTokens ?? pr2Body.downloadTokens ?? null;
            const tokenVerified2R = returnedToken2R === oldTokenForPatch;
            diag.patchTokenOk     = tokenVerified2R;
            if (tokenVerified2R) {
              patchSucceededR = true;
              diag.patchToken = "ok-format2";
            } else {
              diag.patchToken         = "accepted-not-verified-f2";
              diag.patchReturnedToken = returnedToken2R ? returnedToken2R.slice(0, 20) + "…" : "null";
            }
          }
        } catch (_rp2) { diag.patchStatus2 = "err"; }
      }

      if (!patchSucceededR) {
        diag.patchToken = "failed";
        /* Fallback: revex.put with funnelId from Firebase path */
        if (revex && newFirebaseToken) {
          const funnelIdFromPath = objectPath.split("/")[1] ?? "";
          const newPublicUrl = downloadUrl.replace(/\?.*$/, "") + `?alt=media&token=${newFirebaseToken}`;
          diag.newPublicUrl = newPublicUrl.slice(0, 120);
          try {
            await revex.put(
              `https://backend.leadconnectorhq.com/funnels/funnel/${funnelIdFromPath}/page/${builderId}`,
              { ...existing, pageDataDownloadUrl: newPublicUrl }
            );
            diag.metaUpdate = `ok-funnelId:${funnelIdFromPath.slice(0, 16)}`;
          } catch (_ru) {
            diag.metaUpdate = `failed: ${String(_ru).slice(0, 60)}`;
          }
        } else {
          diag.metaUpdate = "skipped";
        }
      }
    } else {
      diag.patchToken = "no-old-token";
    }

    /* 7d. Test if old download URL is now accessible again (after PATCH) */
    try {
      const pubAfter = await fetch(downloadUrl, { signal: AbortSignal.timeout(4000) });
      diag.publicReadAfterPatch = { status: pubAfter.status, ok: pubAfter.ok };
    } catch (_pa) { diag.publicReadAfterPatch = { error: "timeout-or-cors" }; }

    /* 8. Verify auth-read after write */
    await new Promise(r => setTimeout(r, 600));
    const vrRes = await fetch(downloadUrl, {
      cache:   "no-store",
      headers: { "Authorization": `Firebase ${idToken}` },
      signal:  AbortSignal.timeout(5000),
    });
    diag.verifyStatus = vrRes.status;
    if (vrRes.ok) {
      const vd = await vrRes.json();
      diag.verifyElemCount = vd.elements ? Object.keys(vd.elements).length : 0;
      diag.verifySecCount  = Array.isArray(vd.sections) ? vd.sections.length : 0;
      diag.verifyId        = vd.id ?? "missing";
    }

    return JSON.stringify({ ok: true, diag });
  } catch (err) {
    return JSON.stringify({ ok: false, error: String(err).slice(0, 160), diag });
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   MESSAGE ROUTER
   ════════════════════════════════════════════════════════════════════════════ */

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const type = msg.type ?? msg.action;

  /* ── ping ── */
  if (type === "ping") {
    sendResponse({ alive: true });
    return false;
  }

  /* ── saveApiKey (legacy) ── */
  if (type === "saveApiKey" && msg.hlApiKey) {
    chrome.storage.local.set({ hlApiKey: msg.hlApiKey }, () => sendResponse({ ok: true }));
    return true;
  }

  /* ── CF_COPY_PAGE ─────────────────────────────────────────────────────────
   * Extracts funnelId + stepId from the active (or specified) tab.
   * Stores result in chrome.storage.local as "cf_copied_page".
   * Works on any GHL page — public funnel, builder, or custom domain.
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_COPY_PAGE") {
    (async () => {
      try {
        const tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        // Strategy 1: Nuxt / window globals extraction (works on any GHL page)
        let info = {};
        try {
          const res = await chrome.scripting.executeScript({
            target: { tabId, allFrames: false },
            world:  "MAIN",
            func:   _cf_extractGhlMetadata,
          });
          info = JSON.parse(res?.[0]?.result ?? "{}");
        } catch(e) {
          info = { ok: false, error: `scripting failed: ${String(e).slice(0, 80)}` };
        }

        // Strategy 2: Builder URL + revex (for GHL builder tabs where Nuxt may not expose the data)
        if (!info.ok) {
          const tab = await chrome.tabs.get(tabId);
          const url = tab.url ?? "";
          const m   = url.match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
          if (m) {
            const [, locationId, , builderId] = m;
            try {
              const res2 = await chrome.scripting.executeScript({
                target: { tabId, allFrames: false },
                world:  "MAIN",
                func:   _cf_getBuilderInfo,
                args:   [builderId],
              });
              const info2 = JSON.parse(res2?.[0]?.result ?? "{}");
              if (info2.ok) {
                info = { ok: true, funnelId: info2.funnelId, stepId: info2.stepId,
                         locationId: info2.locationId || locationId, pageName: "(builder page)",
                         source: "revex-builder" };
              } else {
                info = { ok: false, error: info2.error, fallback: "revex-builder failed" };
              }
            } catch(e2) {
              info.error = (info.error ?? "") + ` | revex: ${String(e2).slice(0, 60)}`;
            }
          } else {
            info.urlNote = "Not a GHL builder URL — funnelId/stepId must be in page JS";
          }
        }

        if (info.ok && info.funnelId && info.stepId) {
          const record = {
            funnelId:   info.funnelId,
            stepId:     info.stepId,
            locationId: info.locationId ?? "",
            pageName:   info.pageName   ?? "",
            source:     info.source     ?? "",
            copiedAt:   Date.now(),
          };
          await chrome.storage.session.set({ cf_copied_page: record });
          console.log("[CF] CF_COPY_PAGE: copied", record.funnelId, "/", record.stepId);
          sendResponse({ ok: true, record });

          // ── Also capture full pageData for schema inspection (non-blocking) ──
          // Only works when the tab is a /page-builder/ or /funnel-builder/ URL (revex is accessible).
          try {
            const tab2 = await chrome.tabs.get(tabId);
            const bm   = (tab2.url ?? "").match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
            if (bm) {
              const [, , , builderId] = bm;
              const pdRes = await chrome.scripting.executeScript({
                target: { tabId, allFrames: false },
                world:  "MAIN",
                func:   _cf_fetchFullPageData,
                args:   [builderId],
              });
              const pdResult = JSON.parse(pdRes?.[0]?.result ?? "{}");
              if (pdResult.ok && pdResult.data) {
                await chrome.storage.local.set({
                  capturedGHLPage: {
                    builderId,
                    funnelId:   record.funnelId,
                    stepId:     record.stepId,
                    locationId: record.locationId,
                    pageName:   pdResult.pageName || record.pageName,
                    // Only store full element tree when source is firebase (real page data).
                    // Metadata-source results contain IDs only — treat as metadata fallback.
                    pageData:   pdResult.source === "firebase" ? pdResult.data : null,
                    dataSource: pdResult.source  ?? "unknown",
                    warning:    pdResult.source !== "firebase"
                                  ? "Only page IDs available (element tree not from Firebase). Use the URL Inspector to capture full schema."
                                  : (pdResult.warning ?? null),
                    capturedAt: Date.now(),
                  },
                });
                console.log("[CF] CF_COPY_PAGE: pageData captured for inspector (source:", pdResult.source, ") builderId:", builderId);
              } else {
                // Metadata fallback: always write capturedGHLPage even when element tree fetch fails.
                // Inspector "Load Captured GHL Page" will show page name/IDs with a "metadata only" warning.
                console.warn("[CF] CF_COPY_PAGE: pageData capture failed, writing metadata-only fallback:", pdResult.error);
                await chrome.storage.local.set({
                  capturedGHLPage: {
                    builderId,
                    funnelId:   record.funnelId,
                    stepId:     record.stepId,
                    locationId: record.locationId,
                    pageName:   record.pageName || "(GHL builder page)",
                    pageData:   null,
                    dataSource: "metadata",
                    warning:    "Element tree could not be fetched (Firebase/revex unavailable). Only page IDs are available. Use the URL Inspector to capture full schema.",
                    capturedAt: Date.now(),
                  },
                });
              }
            }
          } catch (pdErr) {
            console.warn("[CF] CF_COPY_PAGE: pageData capture threw:", String(pdErr).slice(0, 80));
            // Still persist metadata-only fallback so "Load Captured GHL Page" has something to show
            try {
              const bm2 = (await chrome.tabs.get(tabId).catch(() => ({ url: "" }))).url
                .match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
              if (bm2) {
                const [, , , builderId2] = bm2;
                await chrome.storage.local.set({
                  capturedGHLPage: {
                    builderId:  builderId2,
                    funnelId:   record.funnelId,
                    stepId:     record.stepId,
                    locationId: record.locationId,
                    pageName:   record.pageName || "(GHL builder page)",
                    pageData:   null,
                    dataSource: "metadata",
                    warning:    "Element tree fetch threw an error. Only page IDs are available. Use the URL Inspector to capture full schema.",
                    capturedAt: Date.now(),
                  },
                });
              }
            } catch (_) { /* ignore secondary fallback errors */ }
          }
        } else {
          console.warn("[CF] CF_COPY_PAGE: failed", info.error ?? info.log);
          sendResponse({ ok: false, error: info.error ?? "Could not find funnelId/stepId on this page", log: info.log });
        }
      } catch(err) {
        console.error("[CF] CF_COPY_PAGE threw:", err);
        sendResponse({ ok: false, error: String(err) });
      }
    })();
    return true; // async
  }

  /* ── CF_PASTE_PAGE ────────────────────────────────────────────────────────
   * Clones the copied GHL page into the active builder tab.
   * Uses revexBackendService.post('/funnels/funnel/clone-funnel-step/').
   * The active tab MUST be app.gohighlevel.com/.../page-builder/... OR .../funnel-builder/...
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_PASTE_PAGE") {
    (async () => {
      try {
        // 1. Read what was copied
        const stored = await chrome.storage.session.get("cf_copied_page");
        const src    = stored.cf_copied_page;

        // ── Helper: run builder injection on the active GHL builder tab ──
        const doAIInject = async (pageData, debugLabel) => {
          /* Use sender.tab.id (the tab that clicked the FAB) — more reliable
             than chrome.tabs.query which can return the wrong window/tab. */
          const tabId2 = sender.tab?.id ?? msg.tabId
            ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
          if (!tabId2) { sendResponse({ ok: false, error: "Could not identify the GHL builder tab. Make sure you clicked the orange CF button inside the GHL builder." }); return; }
          const tab2 = await chrome.tabs.get(tabId2);
          const m2   = (tab2.url ?? "").match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
          if (!m2) {
            sendResponse({ ok: false, error: `This tab is not a GHL builder page (URL: ${(tab2.url ?? "").slice(0, 80)}). Open a funnel page in the GHL builder, then click the orange CF button.` });
            return;
          }
          const [, locId2, , builderId2] = m2;
          console.log("[CF] CF_PASTE_PAGE:", debugLabel, "→ builder", builderId2);
          /* ── Step A: Probe all frames to find which one has Pinia ──────── */
          let iframeFrameId2 = 0;
          try {
            const probeRes2 = await chrome.scripting.executeScript({
              target: { tabId: tabId2, allFrames: true },
              world:  "MAIN",
              func:   _cf_probePinia,
            });
            const builderFrame2 = probeRes2.find(r2 => r2.result === true && r2.frameId !== 0)
              ?? probeRes2.find(r2 => r2.result === true);
            if (builderFrame2) iframeFrameId2 = builderFrame2.frameId ?? 0;
          } catch (_probeErr2) {}

          /* ── Step B: Run approaches 0/1/2/2B in top frame ──────────── */
          const { cf_cached_bucket: cachedBkt = null } = await chrome.storage.local.get("cf_cached_bucket");
          let r = {};
          try {
            const res2 = await chrome.scripting.executeScript({
              target: { tabId: tabId2, allFrames: false },
              world:  "MAIN",
              func:   _cf_injectViaBuilderSave,
              args:   [builderId2, locId2, pageData, cachedBkt],
            });
            r = JSON.parse(res2?.[0]?.result ?? "{}");
          } catch(e) { r = { ok: false, error: `scripting failed: ${String(e).slice(0, 80)}` }; }

          /* ── Step C: Run Approach 3 (Pinia patch) in detected frame — ALWAYS ─ */
          try {
            const a3Res2 = await chrome.scripting.executeScript({
              target: { tabId: tabId2, frameIds: [iframeFrameId2] },
              world:  "MAIN",
              func:   _cf_approach3PiniaInFrame,
              args:   [builderId2, locId2, pageData],
            });
            const a3b = JSON.parse(a3Res2?.[0]?.result ?? "{}");
            if (!r.diag) r.diag = {};
            r.diag.approach3 = { ...(a3b.diag?.approach3 ?? {}), iframeFrameId: iframeFrameId2 };
            const a2Wrote2 = r.ok && (r.method ?? "").includes("firebase");
            if (a3b.ok) {
              const a3Base2 = a3b.method ?? "pinia";
              if (a2Wrote2) {
                r.method = a3Base2 === "pinia-patched" ? "firebase+pinia-patched" : "firebase+pinia";
              } else if (!r.ok) {
                r.ok = true; r.method = a3Base2;
                r.storeId = a3b.storeId; r.savedVia = a3b.savedVia; r.warning = a3b.warning;
              }
              delete r._a3pending;
            }
          } catch (a3Err2) {
            if (!r.diag) r.diag = {};
            r.diag.approach3 = {
              ...(r.diag.approach3 ?? {}),
              iframeFrameId: iframeFrameId2,
              iframeA3Error: String(a3Err2).slice(0, 80),
            };
          }

          /* ── Step D: Approach 4 — Vuex 2 / Nuxt 2 direct store mutation ─ */
          try {
            const a4Res2 = await chrome.scripting.executeScript({
              target: { tabId: tabId2, frameIds: [iframeFrameId2] },
              world:  "MAIN",
              func:   _cf_approach4VuexInFrame,
              args:   [builderId2, locId2, pageData],
            });
            const a4b = JSON.parse(a4Res2?.[0]?.result ?? "{}");
            if (!r.diag) r.diag = {};
            r.diag.approach4 = { ...(a4b.diag?.approach4 ?? {}), iframeFrameId: iframeFrameId2 };
            if (a4b.ok) {
              const a2Wrote2 = r.ok && (r.method ?? "").includes("firebase");
              if (a2Wrote2) {
                r.method = (r.method ?? "firebase") + "+vuex";
              } else if (!r.ok) {
                r.ok = true; r.method = "vuex-direct";
              }
            }
          } catch (a4Err2) {
            if (!r.diag) r.diag = {};
            r.diag.approach4 = {
              ...(r.diag.approach4 ?? {}),
              iframeFrameId: iframeFrameId2,
              iframeA4Error: String(a4Err2).slice(0, 80),
            };
          }

          // Store full inject result so popup can show debug details
          await chrome.storage.local.set({ cf_last_inject: { ...r, builderId: builderId2, ts: Date.now() } });
          if (r.ok) {
            /* ── Diagnostic: signal inject-done to content script for o.off tracking ──
             * Content.js tracks CF_INJECT_DONE to know when phase 1 (pre-inject) ends.
             * This postMessage via executeScript crosses the MAIN→isolated boundary. */
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tabId2, allFrames: false },
                world:  "MAIN",
                func:   function() { window.postMessage({ source: "cf-bridge", type: "CF_INJECT_DONE" }, "*"); },
              });
            } catch(_) {}

            /* ── Diagnostic: fetch interceptor via executeScript BEFORE reload ──────
             * Catches any immediate GHL backend fetch on the current SPA page.
             * For post-hard-reload fetches, cf_sniff_pending arms the content script. */
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tabId2, allFrames: false },
                world:  "MAIN",
                func:   _cf_injectFetchSniffer,
              });
            } catch(_) {}

            /* Arm sniffer for NEXT page load (post-hard-reload fetches) */
            try { await chrome.storage.local.set({ cf_sniff_pending: true, cf_sniff_tab: tabId2 }); } catch(_) {}
            try { await chrome.scripting.executeScript({ target: { tabId: tabId2, allFrames: false }, world: "MAIN", func: _cf_refreshBuilderIframe }); } catch(_) {}
            const method = r.method ?? "injected";
            const toast = r.warning
              ? `Content injected (${method}) — ${r.warning}`
              : `Content injected via ${method} — builder is saving, allow a few seconds.`;
            sendResponse({ ok: true, builderId: builderId2, injectResult: r, toast });
          } else {
            sendResponse({ ok: false, error: r.error ?? "inject failed", injectResult: r });
          }
        };

        // ── Route A: AI-inject or URL-clone via session storage ──────────
        if ((src?.type === "ai-inject" || src?.type === "url-clone") && src?.pageData) {
          await doAIInject(src.pageData, src.type);
          return;
        }

        // ── Route B: No real GHL clone — try cfReady fallback (popup-loaded) ─
        if (!src?.funnelId || !src?.stepId) {
          const lsData = await chrome.storage.local.get("cfReady");
          const ready  = lsData.cfReady;
          if (ready?.pageData) {
            await doAIInject(ready.pageData, "cfReady-fallback");
            return;
          }
          sendResponse({ ok: false, error: "Nothing copied yet — open the app, click 'Clone to GHL' on a funnel page, then try again" });
          return;
        }

        // ── Route C: Real GHL clone (clone-funnel-step) ───────────────────

        // 2. Get the active tab (must be GHL builder)
        const tabId = sender.tab?.id ?? msg.tabId
          ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        const tab = await chrome.tabs.get(tabId);
        const url = tab.url ?? "";
        const m   = url.match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: `This tab is not a GHL builder page (URL: ${url.slice(0, 80)}). Open a funnel page in the GHL builder, then try again.` });
          return;
        }
        const [, locationId, , builderId] = m;

        // 3. Get destination funnelId + stepId via revex
        let destInfo = {};
        try {
          const res = await chrome.scripting.executeScript({
            target: { tabId, allFrames: false },
            world:  "MAIN",
            func:   _cf_getBuilderInfo,
            args:   [builderId],
          });
          destInfo = JSON.parse(res?.[0]?.result ?? "{}");
        } catch(e) {
          destInfo = { ok: false, error: `scripting failed: ${String(e).slice(0, 80)}` };
        }

        if (!destInfo.ok || !destInfo.funnelId || !destInfo.stepId) {
          sendResponse({ ok: false, error: `Could not read destination page: ${destInfo.error ?? "unknown"}. Make sure GHL builder is fully loaded.` });
          return;
        }

        // 4. Clone!
        const req = {
          sourceFunnelId: src.funnelId,
          sourceStepId:   src.stepId,
          destFunnelId:   destInfo.funnelId,
          destStepId:     destInfo.stepId,
          locationId:     destInfo.locationId || locationId,
        };

        console.log("[CF] CF_PASTE_PAGE: cloning", req.sourceFunnelId + "/" + req.sourceStepId,
          "→", req.destFunnelId + "/" + req.destStepId);

        let cloneResult = {};
        try {
          const res = await chrome.scripting.executeScript({
            target: { tabId, allFrames: false },
            world:  "MAIN",
            func:   _cf_cloneFunnelStep,
            args:   [req],
          });
          cloneResult = JSON.parse(res?.[0]?.result ?? "{}");
        } catch(e) {
          cloneResult = { ok: false, error: `scripting failed: ${String(e).slice(0, 80)}` };
        }

        if (cloneResult.ok) {
          console.log("[CF] clone-funnel-step ok:", cloneResult.status ?? 200);
          // 5. Refresh the builder iframe
          try {
            await chrome.scripting.executeScript({
              target: { tabId, allFrames: false },
              world:  "MAIN",
              func:   _cf_refreshBuilderIframe,
            });
          } catch(_) {}
          console.log("[CF] CF_PASTE_PAGE: success", cloneResult.raw?.slice(0, 80));
          sendResponse({ ok: true, req, cloneResult });
        } else {
          console.warn("[CF] CF_PASTE_PAGE: clone failed", cloneResult.error);
          sendResponse({ ok: false, error: cloneResult.error ?? "clone-funnel-step failed", req, cloneResult });
        }
      } catch(err) {
        console.error("[CF] CF_PASTE_PAGE threw:", err);
        sendResponse({ ok: false, error: String(err) });
      }
    })();
    return true; // async
  }

  /* ── CF_ROUNDTRIP_TEST ────────────────────────────────────────────────────
   * Diagnostic: read existing Firebase data, deep-probe its structure, write
   * it back UNCHANGED, verify re-read.  Tells us whether the TypeError comes
   * from our data format vs the write/reload mechanism.
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_ROUNDTRIP_TEST") {
    (async () => {
      try {
        const tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        const tab = await chrome.tabs.get(tabId);
        const m   = (tab.url ?? "").match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: `Not a GHL builder tab: ${(tab.url ?? "").slice(0, 80)}` });
          return;
        }
        const [, , , builderId] = m;

        const res = await chrome.scripting.executeScript({
          target: { tabId, allFrames: false },
          world:  "MAIN",
          func:   _cf_roundtripFirebaseWrite,
          args:   [builderId],
        });
        const result = JSON.parse(res?.[0]?.result ?? "{}");
        /* Cache bucket for future blank-page inject attempts (Approach 2B) */
        if (result.diag?.bucket) {
          chrome.storage.local.set({ cf_cached_bucket: result.diag.bucket }).catch(() => {});
        }
        sendResponse(result);
      } catch(err) {
        sendResponse({ ok: false, error: String(err).slice(0, 200) });
      }
    })();
    return true;
  }

  /* ── CF_SCHEMA_DIFF ───────────────────────────────────────────────────────
   * Dry-run comparison: reads GHL native Firebase schema THEN builds a
   * simulation of our inject output — shows both side-by-side without
   * writing anything. Helps pinpoint any remaining key/format mismatches.
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_SCHEMA_DIFF") {
    (async () => {
      try {
        const tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        const tab = await chrome.tabs.get(tabId);
        const m   = (tab.url ?? "").match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: `Not a GHL builder tab: ${(tab.url ?? "").slice(0, 80)}` });
          return;
        }
        const [, , , builderId] = m;

        /* Read GHL native schema from Firebase (no write) */
        const execRes = await chrome.scripting.executeScript({
          target: { tabId, allFrames: false },
          world:  "MAIN",
          func:   _cf_readFirebaseSchema,
          args:   [builderId],
        });
        const nativeResult = JSON.parse(execRes?.[0]?.result ?? "{}");

        /* Simulate our inject payload using the EXACT same transformation pipeline
         * as the real CF_INJECT_AI_PAGE handler. Inline flattenForFirebase and sectionsWithContext
         * construction so the diff reflects what we actually write to Firebase.           */
        const stored = await chrome.storage.local.get(["cfReady"]);
        const pd     = stored?.cfReady?.pageData ?? null;

        let injectSim = null;
        if (pd) {
          /* ── Same flattenForFirebase as inject pipeline (v2.38.0) ── *
           * v2.38.0: keep `element` snapshot field (matches native GHL  *
           * flat format); no longer stripping it as circular self-ref.  */
          function _diff_flattenForFirebase(key, v) {
            if (!v || typeof v !== "object") return v;
            if (v.metaData && typeof v.metaData === "object") {
              return {
                wrapper: {}, class: {}, customCss: "", tag: "", mobileWrapper: {}, mobileExtra: {},
                id: v.id ?? key,
                ...v.metaData,
              };
            }
            return v;
          }
          const wrappedRows = Object.fromEntries(
            Object.entries(pd.rows    ?? {}).map(([k, v]) => [k, _diff_flattenForFirebase(k, v)])
          );
          const wrappedCols = Object.fromEntries(
            Object.entries(pd.columns ?? {}).map(([k, v]) => [k, _diff_flattenForFirebase(k, v)])
          );
          const wrappedEls = Object.fromEntries(
            Object.entries(pd.elements ?? {}).map(([k, v]) => [k, _diff_flattenForFirebase(k, v)])
          );

          /* ── Same sectionsWithContext as inject pipeline (v2.38.0 full flat tree + element field) ── */
          const sectionsWithContext = (pd.sections ?? []).map((sec, i) => {
            const childRowIds = Array.isArray(sec.metaData?.child) ? sec.metaData.child : [];
            const flatElements = [];
            for (const rowId of childRowIds) {
              const row = wrappedRows[rowId];
              if (!row) continue;
              flatElements.push(row);
              const colIds = Array.isArray(row.child) ? row.child : [];
              for (const colId of colIds) {
                const col = wrappedCols[colId];
                if (!col) continue;
                flatElements.push(col);
                const elemIds = Array.isArray(col.child) ? col.child : [];
                for (const elemId of elemIds) {
                  const elem = wrappedEls[elemId];
                  if (elem) flatElements.push(elem);
                }
              }
            }
            return {
              id:         sec.id,
              metaData:   { ...sec.metaData },
              elements:   flatElements,
              sequence:   i,
              pageId:     "(builder-target)",
              funnelId:   "(from-path)",
              locationId: "",
              general:    {},
            };
          });

          /* ── Build the schema summary from real pipeline output ── */
          const sec0        = sectionsWithContext[0] ?? null;
          const shallowEls  = sec0?.elements ?? [];
          const row0        = Object.values(wrappedRows)[0] ?? null;
          const col0        = Object.values(wrappedCols)[0] ?? null;

          injectSim = {
            sec0Keys:            sec0 ? Object.keys(sec0)                                      : "none",
            sec0HasElements:     sec0 ? ("elements" in sec0)                                   : false,
            sec0ElementsLen:     shallowEls.length,
            sec0El0Keys:         shallowEls[0] ? Object.keys(shallowEls[0]).slice(0, 10)       : "empty-array",
            sec0El0HasMeta:      shallowEls[0] ? ("metaData" in shallowEls[0])                 : false,
            sec0El0HasElements:  shallowEls[0] ? ("elements" in shallowEls[0])                 : false,
            row0Keys:            row0 ? Object.keys(row0).slice(0, 10)                         : "none",
            row0HasElements:     row0 ? ("elements" in row0)                                   : false,
            /* v2.32.0: flat format — row0 should have NO metaData key */
            row0HasMeta:         row0 ? ("metaData" in row0)                                   : false,
            row0MetaKeys:        row0?.metaData ? Object.keys(row0.metaData).slice(0, 10)      : "none",
            col0Keys:            col0 ? Object.keys(col0).slice(0, 10)                         : "none",
            col0HasElements:     col0 ? ("elements" in col0)                                   : false,
            sectionCount:        sectionsWithContext.length,
            /* v2.33.0+: inject writes empty dicts — report 0 to match native GHL format */
            rowCount:            0,
            colCount:            0,
            elemCount:           0,
            /* v2.35.0: report actual child length (child restored, should be non-zero) */
            sec0MetaChildLen:    sec0?.metaData?.child?.length ?? 0,
          };
        }

        sendResponse({
          ok:          nativeResult.ok,
          error:       nativeResult.error,
          native:      nativeResult.diag ?? {},
          inject:      injectSim,
          hasPageData: !!pd,
        });
      } catch(err) {
        sendResponse({ ok: false, error: String(err).slice(0, 200) });
      }
    })();
    return true;
  }

  /* ── CF_INJECT_AI_PAGE ───────────────────────────────────────────────────
   * Injects AI-generated GHL-native pageData into the active builder page.
   * Reads cfReady.pageData from local storage, then calls revex.put() via
   * _cf_injectPageData() injected into MAIN world. No API key required.
   * The active tab MUST be app.gohighlevel.com/.../page-builder/... OR .../funnel-builder/...
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_INJECT_AI_PAGE") {
    (async () => {
      try {
        // 1. Read the loaded AI page from local storage
        const s     = await chrome.storage.local.get(["cfReady", "cfProject"]);
        let   ready = s.cfReady;
        if (!ready?.pageData) {
          sendResponse({ ok: false, error: "No AI page loaded — open the extension popup, pick a page from the AI library and click Load, then try again." });
          return;
        }

        // 2. Get the active tab (must be GHL builder)
        const tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        const tab = await chrome.tabs.get(tabId);
        const url = tab.url ?? "";
        const m   = url.match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: `This tab is not a GHL builder page (URL: ${url.slice(0, 80)}). Open a funnel page in the GHL builder, then try again.` });
          return;
        }
        const [, locationId, , builderId] = m;

        // 2b. Re-fetch fresh pageData from the server (avoids stale cached data)
        //     Uses the projectId + page stored in cfReady so we always inject latest AI output.
        if (ready.projectId && ready.page) {
          try {
            const apiOrigin = ready.appUrl ?? s.cfProject?.apiOrigin ?? "https://challenge-funnel.replit.app";
            const freshResp = await fetch(
              `${apiOrigin}/api/highlevel/page-data?projectId=${encodeURIComponent(ready.projectId)}&page=${encodeURIComponent(ready.page)}`
            );
            if (freshResp.ok) {
              const freshJson = await freshResp.json();
              if (freshJson?.pageData) {
                ready = { ...ready, pageData: freshJson.pageData };
                await chrome.storage.local.set({ cfReady: ready });
                console.log("[CF] CF_INJECT_AI_PAGE: refreshed pageData from server");
              }
            } else {
              console.warn("[CF] CF_INJECT_AI_PAGE: could not refresh pageData (status", freshResp.status, "), using cached version");
            }
          } catch(fetchErr) {
            console.warn("[CF] CF_INJECT_AI_PAGE: refresh fetch failed, using cached version:", fetchErr.message);
          }
        }

        // 3. Inject AI pageData via Firebase / Vue-builder state approaches
        console.log("[CF] CF_INJECT_AI_PAGE: injecting page=", ready.page, "→ builder=", builderId);

        /* ── Step A: Probe all frames to find which one has Pinia ────────────── */
        let iframeFrameId = 0;
        try {
          const probeRes = await chrome.scripting.executeScript({
            target: { tabId, allFrames: true },
            world:  "MAIN",
            func:   _cf_probePinia,
          });
          /* Prefer a non-zero frameId (builder iframe) over the top frame (0) */
          const builderFrame = probeRes.find(r => r.result === true && r.frameId !== 0)
            ?? probeRes.find(r => r.result === true);
          if (builderFrame) iframeFrameId = builderFrame.frameId ?? 0;
        } catch (_probeErr) {}

        /* ── Step B: Run approaches 0/1/2 in top frame ───────────────────── */
        const { cf_cached_bucket: aiBkt = null } = await chrome.storage.local.get("cf_cached_bucket");
        let injectResult = {};
        try {
          const res = await chrome.scripting.executeScript({
            target: { tabId, allFrames: false },
            world:  "MAIN",
            func:   _cf_injectViaBuilderSave,
            args:   [builderId, locationId, ready.pageData, aiBkt],
          });
          injectResult = JSON.parse(res?.[0]?.result ?? "{}");
        } catch(e) {
          injectResult = { ok: false, error: `scripting failed: ${String(e).slice(0, 80)}` };
        }

        /* ── Step C: Run Approach 3 (Pinia patch) in detected frame — ALWAYS ── *
         * Must run even when A2 succeeded so method can become firebase+pinia.  */
        try {
          const a3Res = await chrome.scripting.executeScript({
            target: { tabId, frameIds: [iframeFrameId] },
            world:  "MAIN",
            func:   _cf_approach3PiniaInFrame,
            args:   [builderId, locationId, ready.pageData],
          });
          const a3 = JSON.parse(a3Res?.[0]?.result ?? "{}");
          /* Merge A3 diag (with iframeFrameId) */
          if (!injectResult.diag) injectResult.diag = {};
          injectResult.diag.approach3 = { ...(a3.diag?.approach3 ?? {}), iframeFrameId };
          /* Compose combined method from A2 + A3 outcomes */
          const a2Wrote = injectResult.ok && (injectResult.method ?? "").includes("firebase");
          if (a3.ok) {
            const a3Base = a3.method ?? "pinia"; /* "pinia" or "pinia-patched" */
            if (a2Wrote) {
              /* Both Firebase write AND Pinia patch succeeded */
              injectResult.method = a3Base === "pinia-patched"
                ? "firebase+pinia-patched"
                : "firebase+pinia";
            } else if (!injectResult.ok) {
              /* Only Pinia succeeded — elevate result */
              injectResult.ok      = true;
              injectResult.method  = a3Base;
              injectResult.storeId = a3.storeId;
              injectResult.savedVia = a3.savedVia;
              injectResult.warning  = a3.warning;
            }
            delete injectResult._a3pending;
          }
        } catch (a3Err) {
          if (!injectResult.diag) injectResult.diag = {};
          injectResult.diag.approach3 = {
            ...(injectResult.diag.approach3 ?? {}),
            iframeFrameId,
            iframeA3Error: String(a3Err).slice(0, 80),
          };
        }

        /* ── Step D: Approach 4 — Vuex 2 / Nuxt 2 direct store mutation ──────── *
         * Targets the builder iframe directly. If GHL uses Vuex (Vue 2/Nuxt 2)   *
         * we find the state module with rows/sections and patch it, bypassing the *
         * Firebase re-read entirely. No reload needed — content appears live.     */
        try {
          const a4Res = await chrome.scripting.executeScript({
            target: { tabId, frameIds: [iframeFrameId] },
            world:  "MAIN",
            func:   _cf_approach4VuexInFrame,
            args:   [builderId, locationId, ready.pageData],
          });
          const a4 = JSON.parse(a4Res?.[0]?.result ?? "{}");
          if (!injectResult.diag) injectResult.diag = {};
          injectResult.diag.approach4 = { ...(a4.diag?.approach4 ?? {}), iframeFrameId };
          if (a4.ok) {
            const a2Wrote = injectResult.ok && (injectResult.method ?? "").includes("firebase");
            if (a2Wrote) {
              injectResult.method = (injectResult.method ?? "firebase") + "+vuex";
            } else if (!injectResult.ok) {
              injectResult.ok     = true;
              injectResult.method = "vuex-direct";
            }
          }
        } catch (a4Err) {
          if (!injectResult.diag) injectResult.diag = {};
          injectResult.diag.approach4 = {
            ...(injectResult.diag.approach4 ?? {}),
            iframeFrameId,
            iframeA4Error: String(a4Err).slice(0, 80),
          };
        }

        // Store full inject result for popup debug display
        await chrome.storage.local.set({ cf_last_inject: { ...injectResult, builderId, ts: Date.now() } });

        if (injectResult.ok) {
          console.log("[CF] inject ok method:", injectResult.method);
          // Refresh the builder iframe so new content renders
          try {
            await chrome.scripting.executeScript({
              target: { tabId, allFrames: false },
              world:  "MAIN",
              func:   _cf_refreshBuilderIframe,
            });
          } catch(_) {}
          const method = injectResult.method ?? "injected";
          const toast  = injectResult.warning
            ? `Injected (${method}) — ${injectResult.warning}`
            : `Injected via ${method} — builder is saving, allow a few seconds.`;
          sendResponse({ ok: true, page: ready.page, builderId, injectResult, toast });
        } else {
          console.warn("[CF] CF_INJECT_AI_PAGE: failed", injectResult.error);
          sendResponse({ ok: false, error: injectResult.error ?? "inject failed", injectResult });
        }
      } catch(err) {
        console.error("[CF] CF_INJECT_AI_PAGE threw:", err);
        sendResponse({ ok: false, error: String(err) });
      }
    })();
    return true; // async
  }

  /* ── CF_GET_COPIED ── return what's currently copied ── */
  if (type === "CF_GET_COPIED") {
    chrome.storage.session.get("cf_copied_page", (s) => {
      sendResponse({ ok: true, data: s.cf_copied_page ?? null });
    });
    return true;
  }

  /* ── CF_GET_CAPTURED_GHL ── return pageData captured from a GHL builder page ── */
  if (type === "CF_GET_CAPTURED_GHL") {
    chrome.storage.local.get("capturedGHLPage", (s) => {
      sendResponse({ ok: true, capturedGHLPage: s.capturedGHLPage ?? null });
    });
    return true;
  }

  /* ── CF_CLEAR_CAPTURED_GHL ── clear the captured schema data ── */
  if (type === "CF_CLEAR_CAPTURED_GHL") {
    chrome.storage.local.remove("capturedGHLPage", () => sendResponse({ ok: true }));
    return true;
  }

  /* ── CF_CLEAR_COPIED ── */
  if (type === "CF_CLEAR_COPIED") {
    chrome.storage.session.remove("cf_copied_page", () => {
      sendResponse({ ok: true });
    });
    return true;
  }

  /* ── CF_FETCH_URL_PAGE ────────────────────────────────────────────────────
   * Fetches a public GHL page URL, extracts pageDataDownloadUrl from the
   * embedded HTML, then fetches the actual element tree from Firebase.
   * Works on published funnel pages (any domain) without needing revex.
   * The background service worker has <all_urls> host_permissions so it can
   * fetch any origin without CORS restrictions.
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_FETCH_URL_PAGE") {
    (async () => {
      try {
        const pageUrl = msg.url;
        if (!pageUrl || typeof pageUrl !== "string") {
          sendResponse({ ok: false, error: "No URL provided" });
          return;
        }

        // 1. Fetch the page HTML
        let html;
        try {
          const res = await fetch(pageUrl, {
            credentials: "omit",
            headers: { "Accept": "text/html,application/xhtml+xml" },
          });
          if (!res.ok) {
            sendResponse({ ok: false, error: `Page returned HTTP ${res.status}. Make sure the URL is a published GHL funnel page.` });
            return;
          }
          html = await res.text();
        } catch (fetchErr) {
          sendResponse({ ok: false, error: `Could not fetch the page: ${String(fetchErr).slice(0, 120)}` });
          return;
        }

        // 2. Search HTML for pageDataDownloadUrl (handles JSON string escaping like \/)
        // GHL SSR pages embed the page metadata in the Nuxt payload JSON inside a <script> tag.
        const rawMatch = html.match(/"pageDataDownloadUrl"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (!rawMatch) {
          sendResponse({
            ok: false,
            error: "Could not find page data in this URL. Make sure it is a published GHL funnel/website page with content. (Tip: the page must be published, not just saved as draft.)",
          });
          return;
        }

        // Unescape the JSON string value to get the real URL
        let downloadUrl;
        try {
          downloadUrl = JSON.parse('"' + rawMatch[1] + '"');
        } catch {
          downloadUrl = rawMatch[1].replace(/\\/g, "");
        }

        // Also try to extract page name from the HTML
        const nameMatch = html.match(/"name"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        let pageName = "";
        try {
          pageName = nameMatch ? JSON.parse('"' + nameMatch[1] + '"') : "";
        } catch { pageName = nameMatch?.[1] ?? ""; }

        // 3. Fetch the actual element tree from Firebase Storage
        let elementTree;
        try {
          const fbRes = await fetch(downloadUrl);
          if (!fbRes.ok) {
            sendResponse({ ok: false, error: `Firebase Storage returned HTTP ${fbRes.status} — the page data may have expired or moved.` });
            return;
          }
          elementTree = await fbRes.json();
        } catch (fbErr) {
          sendResponse({ ok: false, error: `Could not download element tree from Firebase: ${String(fbErr).slice(0, 100)}` });
          return;
        }

        // 4. Store it in chrome.storage.local so CF_GET_CAPTURED_GHL returns it too
        await chrome.storage.local.set({
          capturedGHLPage: {
            builderId:  "",
            funnelId:   "",
            stepId:     "",
            locationId: "",
            pageName:   pageName || new URL(pageUrl).pathname,
            pageData:   elementTree,
            dataSource: "url-parse",
            warning:    null,
            capturedAt: Date.now(),
          },
        });

        sendResponse({ ok: true, elementTree, pageName, source: "url-parse" });
      } catch (err) {
        sendResponse({ ok: false, error: `CF_FETCH_URL_PAGE: ${String(err).slice(0, 200)}` });
      }
    })();
    return true;
  }

  /* ── CF_SNIFF_CLAIM — content script claims the sniffer for its tab ───────
   * Returns {claimed: true} only if cf_sniff_pending is set AND sender.tab.id
   * matches cf_sniff_tab. Clears the pending flag immediately to prevent a
   * second tab from stealing the same sniffer session.                       */
  if (type === "CF_SNIFF_CLAIM") {
    const senderTabId = sender?.tab?.id;
    chrome.storage.local.get(["cf_sniff_pending", "cf_sniff_tab"], (d) => {
      if (d.cf_sniff_pending && senderTabId && d.cf_sniff_tab === senderTabId) {
        chrome.storage.local.remove(["cf_sniff_pending"], () => {
          sendResponse({ claimed: true });
        });
      } else {
        sendResponse({ claimed: false });
      }
    });
    return true; // async
  }

  /* ── CF_GHL_BACKEND_ERROR — forwarded from content script network sniffer ──
   * Only stored when the sender tab matches the tab we armed the sniffer for.
   * After 60 s the record is stale; popup truncates display accordingly.    */
  if (type === "CF_GHL_BACKEND_ERROR") {
    const senderTabId = sender?.tab?.id;
    if (!senderTabId) return false;
    const { status, url, body } = msg;
    /* Stored per-tab; no cf_sniff_tab gate needed — sender.tab.id already
     * ensures this is from the correct GHL tab. A 60s cleanup is scheduled
     * by the CF_OOFF_ERROR handler; add a fallback here too.               */
    const storeKey = `cf_ghl_err_${senderTabId}`;
    chrome.storage.local.set({ [storeKey]: { status, url, body, tabId: senderTabId, ts: Date.now() } });
    setTimeout(() => chrome.storage.local.remove(storeKey), 60000);
    return false;
  }

  /* ── CF_OOFF_ERROR — forwarded from content script two-phase onerror ──────
   * seenBeforeInject / seenAfterInject are boolean flags set by content.js
   * tracking which phase each error belongs to. preExisting is computed by
   * content.js: true only if errors appeared before inject AND none after.
   * The record is merged (using spread) so a later "seenAfterInject: true"
   * update does not clobber the earlier "seenBeforeInject: true" entry.
   * Stored per-tab. A 60s cleanup timer removes stale records.             */
  /* ── CF_CAPTURE_CLONE_BASELINE ────────────────────────────────────────────
   * Reads the FULL Firebase data from the currently open GHL builder tab and
   * stores it as cf_clone_baseline in chrome.storage.local.
   * The web app (GHL Inspector) can then load it via CF_GET_CLONE_BASELINE and
   * deep-diff it against our AI-generated page to pinpoint every mismatch.
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_CAPTURE_CLONE_BASELINE") {
    (async () => {
      try {
        const tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        const tab = await chrome.tabs.get(tabId);
        const m   = (tab.url ?? "").match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: `Not a GHL builder tab: ${(tab.url ?? "").slice(0, 80)}` });
          return;
        }
        const [, , , builderId] = m;

        const execRes = await chrome.scripting.executeScript({
          target: { tabId, allFrames: false },
          world:  "MAIN",
          func:   _cf_captureCloneBaseline,
          args:   [builderId],
        });
        const result = JSON.parse(execRes?.[0]?.result ?? "{}");

        if (result.ok && result.fullData) {
          const baseline = {
            builderId,
            tabUrl:     (tab.url ?? "").slice(0, 120),
            fullData:   result.fullData,
            diag:       result.diag,
            capturedAt: result.capturedAt ?? Date.now(),
          };
          await chrome.storage.local.set({ cf_clone_baseline: baseline });
          sendResponse({ ok: true, diag: result.diag });
        } else {
          sendResponse({ ok: false, error: result.error ?? "unknown", diag: result.diag ?? {} });
        }
      } catch (err) {
        sendResponse({ ok: false, error: String(err).slice(0, 200) });
      }
    })();
    return true;
  }

  /* ── CF_GET_CLONE_BASELINE ────────────────────────────────────────────────
   * Returns the stored clone baseline (fullData + diag + metadata).
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_GET_CLONE_BASELINE") {
    chrome.storage.local.get("cf_clone_baseline", (s) => {
      sendResponse({ ok: true, baseline: s.cf_clone_baseline ?? null });
    });
    return true;
  }

  /* ── CF_CLEAR_CLONE_BASELINE ─────────────────────────────────────────────
   * Clears the stored clone baseline.
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_CLEAR_CLONE_BASELINE") {
    chrome.storage.local.remove("cf_clone_baseline", () => sendResponse({ ok: true }));
    return true;
  }

  /* ── CF_GET_API_LOG ───────────────────────────────────────────────────────
   * Returns window.__cfApiLog from the active GHL tab (captured by bridge.js).
   * Shows GHL API calls including the 500 fetchPageData response body.
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_GET_API_LOG") {
    (async () => {
      try {
        const tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }
        const res = await chrome.scripting.executeScript({
          target: { tabId, allFrames: false },
          world:  "MAIN",
          func:   () => JSON.stringify(window.__cfApiLog ?? []),
        });
        const log = JSON.parse(res?.[0]?.result ?? "[]");
        sendResponse({ ok: true, log });
      } catch(err) {
        sendResponse({ ok: false, error: String(err).slice(0, 200) });
      }
    })();
    return true;
  }

  if (type === "CF_OOFF_ERROR") {
    const senderTabId = sender?.tab?.id;
    if (!senderTabId) return false;
    const { msg: errMsg, src, line, seenBeforeInject, seenAfterInject, preExisting } = msg;
    const storeKey = `cf_ooff_err_${senderTabId}`;
    /* Merge with existing to accumulate both boolean flags across multiple calls */
    chrome.storage.local.get([storeKey], (existing) => {
      const prev = existing[storeKey] ?? {};
      const merged = {
        ...prev,
        errMsg: errMsg ?? prev.errMsg,
        src:    src    ?? prev.src,
        line:   line   ?? prev.line,
        seenBeforeInject: !!(seenBeforeInject || prev.seenBeforeInject),
        seenAfterInject:  !!(seenAfterInject  || prev.seenAfterInject),
        tabId:  senderTabId,
        ts:     prev.ts ?? Date.now(),
      };
      merged.preExisting = merged.seenBeforeInject && !merged.seenAfterInject;
      chrome.storage.local.set({ [storeKey]: merged });
    });
    /* 60s TTL: remove stale diagnostic keys to avoid showing old data */
    setTimeout(() => {
      chrome.storage.local.remove([storeKey, `cf_ghl_err_${senderTabId}`]);
    }, 60000);
    return false;
  }

  return false;
});
