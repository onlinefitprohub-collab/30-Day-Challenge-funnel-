// background.js — Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    console.log("[CF Funnel] Installed v2.10.0 — CF_COPY_PAGE metadata fallback + friendly FAB error messages.");
  }
  if (reason === "update") {
    console.log("[CF Funnel] Updated to v2.10.0 — CF_COPY_PAGE metadata fallback + friendly FAB error messages.");
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

/* Inject AI-generated pageData directly into a GHL builder page via revex (MAIN world).
   Strategy:
   1. GET /funnels/page/{id} to retrieve page metadata (name, funnelId, stepId, etc.)
   2. PUT with full GHL-required fields: pageData + name + funnelId + stepId + locationId
   3. Try /funnels/funnel/page/{id} first, then /funnels/page/{id} as fallback
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

/* Reload the GHL builder iframe to reflect cloned content. */
function _cf_refreshBuilderIframe() {
  try {
    const iframe = document.querySelector('iframe[name="funnel-builder"]');
    if (!iframe) {
      // Fallback: reload the whole page
      window.location.reload();
      return JSON.stringify({ ok: true, method: "page-reload" });
    }
    iframe.src = iframe.src;
    return JSON.stringify({ ok: true, method: "iframe-reload", src: iframe.src.slice(0, 80) });
  } catch(e) {
    return JSON.stringify({ ok: false, error: String(e).slice(0, 100) });
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   MESSAGE ROUTER
   ════════════════════════════════════════════════════════════════════════════ */

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
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
          const m   = url.match(/\/location\/([^/]+)\/page-builder\/([^/]+)/);
          if (m) {
            const [, locationId, builderId] = m;
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
            info.urlNote = "Not a /page-builder/ URL — funnelId/stepId must be in page JS";
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
          // Only works when the tab is a /page-builder/ URL (revex is accessible).
          try {
            const tab2 = await chrome.tabs.get(tabId);
            const bm   = (tab2.url ?? "").match(/\/location\/([^/]+)\/page-builder\/([^/]+)/);
            if (bm) {
              const [, , builderId] = bm;
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
                .match(/\/location\/([^/]+)\/page-builder\/([^/]+)/);
              if (bm2) {
                const [, , builderId2] = bm2;
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
   * The active tab MUST be app.gohighlevel.com/.../page-builder/...
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_PASTE_PAGE") {
    (async () => {
      try {
        // 1. Read what was copied
        const stored = await chrome.storage.session.get("cf_copied_page");
        const src    = stored.cf_copied_page;

        // ── Helper: run revex inject on the active builder tab ────────────
        const doAIInject = async (pageData, debugLabel) => {
          const tabId2 = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
          if (!tabId2) { sendResponse({ ok: false, error: "no_active_tab" }); return; }
          const tab2 = await chrome.tabs.get(tabId2);
          const m2   = (tab2.url ?? "").match(/\/location\/([^/]+)\/page-builder\/([^/]+)/);
          if (!m2) {
            sendResponse({ ok: false, error: "Active tab is not a GHL page builder URL — navigate to the page you want to paste into, then try again" });
            return;
          }
          const [, locId2, builderId2] = m2;
          console.log("[CF] CF_PASTE_PAGE:", debugLabel, "→ builder", builderId2);
          let r = {};
          try {
            const res2 = await chrome.scripting.executeScript({
              target: { tabId: tabId2, allFrames: false },
              world:  "MAIN",
              func:   _cf_injectPageData,
              args:   [builderId2, locId2, pageData],
            });
            r = JSON.parse(res2?.[0]?.result ?? "{}");
          } catch(e) { r = { ok: false, error: `scripting failed: ${String(e).slice(0, 80)}` }; }
          // Store full inject result so popup can show debug details
          await chrome.storage.local.set({ cf_last_inject: { ...r, builderId: builderId2, ts: Date.now() } });
          if (r.ok) {
            try { await chrome.scripting.executeScript({ target: { tabId: tabId2, allFrames: false }, world: "MAIN", func: _cf_refreshBuilderIframe }); } catch(_) {}
            sendResponse({ ok: true, builderId: builderId2, injectResult: r });
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
        const tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        const tab = await chrome.tabs.get(tabId);
        const url = tab.url ?? "";
        const m   = url.match(/\/location\/([^/]+)\/page-builder\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: "Active tab is not a GHL page builder URL — navigate to the page you want to paste into, then try again" });
          return;
        }
        const [, locationId, builderId] = m;

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

  /* ── CF_INJECT_AI_PAGE ───────────────────────────────────────────────────
   * Injects AI-generated GHL-native pageData into the active builder page.
   * Reads cfReady.pageData from local storage, then calls revex.put() via
   * _cf_injectPageData() injected into MAIN world. No API key required.
   * The active tab MUST be app.gohighlevel.com/.../page-builder/...
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
        const m   = url.match(/\/location\/([^/]+)\/page-builder\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: "Active tab is not a GHL page builder URL — navigate to the funnel page you want to inject into, then try again." });
          return;
        }
        const [, locationId, builderId] = m;

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

        // 3. Inject AI pageData via revex in MAIN world
        console.log("[CF] CF_INJECT_AI_PAGE: injecting page=", ready.page, "→ builder=", builderId);

        let injectResult = {};
        try {
          const res = await chrome.scripting.executeScript({
            target: { tabId, allFrames: false },
            world:  "MAIN",
            func:   _cf_injectPageData,
            args:   [builderId, locationId, ready.pageData],
          });
          injectResult = JSON.parse(res?.[0]?.result ?? "{}");
        } catch(e) {
          injectResult = { ok: false, error: `scripting failed: ${String(e).slice(0, 80)}` };
        }

        // Store full inject result for popup debug display
        await chrome.storage.local.set({ cf_last_inject: { ...injectResult, builderId, ts: Date.now() } });

        if (injectResult.ok) {
          console.log("[CF] inject ok:", injectResult.status ?? 200);
          // 4. Refresh the builder iframe so new content renders
          try {
            await chrome.scripting.executeScript({
              target: { tabId, allFrames: false },
              world:  "MAIN",
              func:   _cf_refreshBuilderIframe,
            });
          } catch(_) {}
          sendResponse({ ok: true, page: ready.page, builderId, injectResult });
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

  return false;
});
