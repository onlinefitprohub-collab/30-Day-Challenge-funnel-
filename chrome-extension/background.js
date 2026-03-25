// background.js — Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    console.log("[CF Funnel] Installed v2.7.0 — inject AI pages directly via revex, no API key needed.");
  }
  if (reason === "update") {
    console.log("[CF Funnel] Updated to v2.7.0 — inject AI pages + clone-funnel-step copy/paste.");
  }

  if (reason === "install" || reason === "update") {
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (!tab.url) continue;
        const isGHL    = tab.url.startsWith("https://app.gohighlevel.com/");
        const isReplit =
          tab.url.startsWith("https://replit.com/") ||
          /https:\/\/[^/]+\.replit\.(dev|app|com)\//.test(tab.url);
        if (!isGHL && !isReplit) continue;
        chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          files: ["content.js"],
        }).catch(() => {});
      }
    });
  }
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
   Uses PUT /funnels/funnel/page/{builderId} — same endpoint GHL uses internally.
   No API key required — runs with the user's own authenticated session. */
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

    const payload = {
      pageData,
      locationId,
      pageId:      builderId,
      isPublished: false,
    };

    console.log("[CF] _cf_injectPageData: PUT to", builderId,
      "sections:", pageData?.sections?.length ?? 0,
      "rows:", Object.keys(pageData?.rows ?? {}).length,
      "elements:", Object.keys(pageData?.elements ?? {}).length);

    const response = await revex.put(
      `https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`,
      payload
    );

    const data   = response?.data ?? response;
    const status = typeof response?.status === "number" ? response.status
                 : typeof data?.status     === "number" ? data.status : 200;

    if (status >= 400) {
      return JSON.stringify({
        ok:    false,
        error: `HTTP ${status}: ${data?.message ?? data?.error ?? "server error"}`,
        status,
        raw:   JSON.stringify(data).slice(0, 300),
      });
    }

    return JSON.stringify({ ok: true, status, raw: JSON.stringify(data).slice(0, 200) });
  } catch(e) {
    const status = e?.response?.status;
    const errMsg = e?.response?.data?.message ?? String(e).slice(0, 140);
    return JSON.stringify({ ok: false, error: `inject threw: ${errMsg}`, status });
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
        if (!src?.funnelId || !src?.stepId) {
          sendResponse({ ok: false, error: "Nothing copied yet — navigate to a GHL page and click Copy Page first" });
          return;
        }

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
        const s     = await chrome.storage.local.get("cfReady");
        const ready = s.cfReady;
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

  /* ── CF_CLEAR_COPIED ── */
  if (type === "CF_CLEAR_COPIED") {
    chrome.storage.session.remove("cf_copied_page", () => {
      sendResponse({ ok: true });
    });
    return true;
  }

  return false;
});
