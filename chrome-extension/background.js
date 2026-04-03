// background.js — Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    console.log("[CF Funnel] Installed v2.60.0 — POST pageData to GHL sync endpoint after inject. Press F5.");
  }
  if (reason === "update") {
    console.log("[CF Funnel] Updated to v2.60.0 — POST pageData to GHL sync endpoint after inject.");
  }

  // On install/update: re-inject content.js into already-open GHL and Replit tabs.
  // The manifest <all_urls> match handles new navigations; this handles open tabs.
  if (reason === "install" || reason === "update") {
    var re = /^https:\/\/(app\.gohighlevel\.com|[^/]*\.replit\.(dev|app|com))\//;
    chrome.tabs.query({}, (tabs) => {
      for (var tab of tabs) {
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
var CF_INJECT_RE = /^https:\/\/(app\.gohighlevel\.com|[^/]*\.replit\.(dev|app|com))\//;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  var url = tab.url ?? "";
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
  var w = window;
  var log = [];

  function extractIds(str, source) {
    var fm = str.match(/"funnelId"\s*:\s*"([A-Za-z0-9_\-]{8,}?)"/);
    var sm = str.match(/"stepId"\s*:\s*"([A-Za-z0-9_\-]{8,}?)"/);
    if (fm && sm) {
      var lm  = str.match(/"locationId"\s*:\s*"([A-Za-z0-9_\-]{8,}?)"/);
      var pnm = str.match(/"(?:pageName|page_name)"\s*:\s*"([^"]{1,80})"/);
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
    var locationId = w.attribution?.locationId ?? "";
    log.push(`attr.locationId=${locationId || "(none)"}`);

    // 1. Nuxt app (GHL builder / funnel pages use Nuxt)
    if (typeof w.useNuxtApp === "function") {
      log.push("useNuxtApp=ok");
      try {
        var nuxt = w.useNuxtApp();
        var payload = nuxt?.payload?.data ?? nuxt?._data ?? {};
        var keys = Object.keys(payload);
        for (var k of keys) {
          var v = payload[k];
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
        var hit = extractIds(JSON.stringify(payload), "nuxt.payload-serialized");
        if (hit) return hit;
      } catch(e) { log.push(`nuxt threw: ${String(e).slice(0, 60)}`); }
    }

    // 2. __NUXT__ global
    if (w.__NUXT__) {
      log.push("__NUXT__=found");
      var hit = extractIds(JSON.stringify(w.__NUXT__), "__NUXT__");
      if (hit) return hit;
    }

    // 3. Common window globals
    for (var key of ["pageData","funnel","funnelData","pageInfo","stepData","__GHL__","__HL__","ghlPage","attribution"]) {
      var val = w[key];
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
      var hit = extractIds(JSON.stringify(val), `window.${key}`);
      if (hit) return hit;
    }

    // 4. Inline script tags containing funnelId
    for (var el of Array.from(document.querySelectorAll("script:not([src])"))) {
      var t = el.textContent ?? "";
      if (!t.includes("funnelId")) continue;
      var hit = extractIds(t, `dom-script[id=${el.id || "?"}]`);
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
    var appMap = window.app ?? {};
    var revex = null;

    // Try window.app entries (how GHL's Nuxt app exposes it)
    for (var ai of Object.values(appMap)) {
      var r = ai?.appContext?.config?.globalProperties?.revexBackendService;
      if (r && (typeof r.get === "function" || typeof r.post === "function")) {
        revex = r;
        break;
      }
    }

    // Fallback: #app.__vue_app__
    if (!revex) {
      var appEl = document.querySelector("#app");
      revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    }

    if (!revex) {
      return JSON.stringify({ ok: false, error: "revexBackendService not found — make sure you are on the GHL builder tab" });
    }

    var resp = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
    var data = resp?.data ?? resp;
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
    var appMap = window.app ?? {};
    var revex = null;

    for (var ai of Object.values(appMap)) {
      var r = ai?.appContext?.config?.globalProperties?.revexBackendService;
      if (r && typeof r.get === "function") { revex = r; break; }
    }
    if (!revex) {
      var appEl = document.querySelector("#app");
      revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    }
    if (!revex) {
      return JSON.stringify({ ok: false, error: "revexBackendService not found" });
    }

    // Step 1: GET page metadata (contains pageDataDownloadUrl → Firebase Storage)
    var metadata = null;
    try {
      var r1 = await revex.get(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`);
      metadata = r1?.data ?? r1;
    } catch (e1) {
      try {
        var r2 = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
        metadata = r2?.data ?? r2;
      } catch (e2) {
        return JSON.stringify({ ok: false, error: `both endpoints failed — primary: ${String(e1).slice(0, 80)}` });
      }
    }

    if (!metadata) return JSON.stringify({ ok: false, error: "empty response from GHL" });

    // Step 2: Follow pageDataDownloadUrl to get the REAL element tree from Firebase Storage.
    // The GHL API only returns page metadata; the actual sections/rows/columns/elements
    // are stored in Firebase Storage and downloaded via this public URL.
    var downloadUrl = metadata.pageDataDownloadUrl ?? metadata.data?.pageDataDownloadUrl ?? null;
    if (downloadUrl && typeof downloadUrl === "string") {
      try {
        var fbRes = await fetch(downloadUrl);
        if (fbRes.ok) {
          var elementTree = await fbRes.json();
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
    var appEl  = document.querySelector("#app");
    var vueApp = appEl?.__vue_app__ ?? null;
    var revex  = vueApp?.config?.globalProperties?.revexBackendService ?? null;

    if (!revex) {
      for (var ai of Object.values(window.app ?? {})) {
        var r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && (typeof r.post === "function")) { revex = r; break; }
      }
    }

    if (!revex) {
      return JSON.stringify({ ok: false, error: "revexBackendService not found — must be on the GHL builder tab" });
    }

    // Get userId from Vuex store (preferred) then AppUtils fallback
    var userId = "";
    try {
      var store = vueApp?.config?.globalProperties?.$store;
      if (!store) {
        for (var ai2 of Object.values(window.app ?? {})) {
          var s = ai2?.appContext?.config?.globalProperties?.$store;
          if (s) { store = s; break; }
        }
      }
      userId = store?.state?.auth?.user?.id || store?.state?.user?.id || "";
    } catch(_ue) {}
    if (!userId) {
      try {
        if (typeof window.AppUtils !== "undefined" && window.AppUtils?.Utilities?.getCurrentUser) {
          var u = await window.AppUtils.Utilities.getCurrentUser();
          userId = u?.id ?? u?.userId ?? "";
        }
      } catch(_au) {}
    }

    var funnelId   = req.funnelId || req.destFunnelId;
    var pageId     = req.pageId;
    var locationId = req.locationId;

    // Resolve stepId via GET /funnels/funnel/fetch/{funnelId}
    // stepId = UUID of the funnel STEP that contains this page (not the page ID itself)
    var stepId = null;
    try {
      var fetchResp  = await revex.get("https://backend.leadconnectorhq.com/funnels/funnel/fetch/" + funnelId);
      var fetchData  = (fetchResp && fetchResp.data) ? fetchResp.data : {};
      var fetchSteps = (fetchData.steps || (fetchData.data && fetchData.data.steps)) || [];
      for (var i = 0; i < fetchSteps.length; i++) {
        var stp   = fetchSteps[i];
        var pages = stp.pages || [];
        for (var j = 0; j < pages.length; j++) {
          var pg   = pages[j];
          var pgId = (typeof pg === "string") ? pg : (pg._id || pg.id || null);
          if (pgId === pageId) { stepId = stp.id; break; }
        }
        if (stepId) break;
      }
    } catch(_fe) {}

    if (!stepId) {
      return JSON.stringify({ ok: false, error: "Could not resolve stepId — pageId=" + pageId + " funnelId=" + funnelId });
    }

    var payload = {
      stepId:     stepId,
      funnelId:   funnelId,
      funnels:    [funnelId],
      locationId: locationId,
      userId:     userId,
    };

    console.log("[CF] clone-funnel-step payload:", JSON.stringify(payload).slice(0, 300));

    var response = await revex.post(
      "https://backend.leadconnectorhq.com/funnels/funnel/clone-funnel-step/",
      payload
    );
    var data   = response?.data ?? response;
    var status = typeof response?.status === "number" ? response.status
                 : typeof data?.status     === "number" ? data.status : 0;

    if (status >= 400) {
      return JSON.stringify({
        ok:      false,
        error:   "HTTP " + status + ": " + (data?.message ?? data?.response ?? "server error"),
        raw:     JSON.stringify(data).slice(0, 300),
        payload: JSON.stringify(payload).slice(0, 300),
      });
    }

    // Extract newStepId from response and re-fetch funnel to find the new page ID
    var newStepId = null;
    try { newStepId = (data?.data?.stepIds ?? data?.stepIds ?? [])[0] ?? null; } catch(_) {}

    var newPageId = null;
    if (newStepId) {
      try {
        var fetchResp2  = await revex.get("https://backend.leadconnectorhq.com/funnels/funnel/fetch/" + funnelId);
        var fetchData2  = (fetchResp2 && fetchResp2.data) ? fetchResp2.data : {};
        var fetchSteps2 = (fetchData2.steps || (fetchData2.data && fetchData2.data.steps)) || [];
        for (var i2 = 0; i2 < fetchSteps2.length; i2++) {
          var stp2 = fetchSteps2[i2];
          if (stp2.id === newStepId) {
            var npg = stp2.pages && stp2.pages[0];
            if (npg) newPageId = (typeof npg === "string") ? npg : (npg._id || npg.id || null);
            break;
          }
        }
      } catch(_fe2) {}
    }

    var ok = !data?.status || data?.status === "ok" || status < 300 || status === 0;
    return JSON.stringify({ ok, status, raw: JSON.stringify(data).slice(0, 400), resolvedStepId: stepId, newStepId, newPageId });
  } catch(e) {
    var status = e?.response?.status;
    var data   = e?.response?.data;
    return JSON.stringify({
      ok:    false,
      error: "clone-funnel-step threw: " + (data?.message ?? String(e).slice(0, 120)),
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
    var revex = null;

    // Try #app.__vue_app__ first
    var appEl = document.querySelector("#app");
    revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;

    // Fallback: window.app entries
    if (!revex) {
      for (var ai of Object.values(window.app ?? {})) {
        var r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && typeof r.put === "function") { revex = r; break; }
      }
    }

    if (!revex) {
      return JSON.stringify({ ok: false, error: "revexBackendService not found — make sure the GHL builder is fully loaded" });
    }

    // Step 1: fetch page metadata so we can include name/funnelId/stepId in the PUT
    var pageMeta = {};
    var metaStatus = null;
    try {
      var metaResp = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
      pageMeta = metaResp?.data ?? metaResp ?? {};
      metaStatus = metaResp?.status ?? 200;
      console.log("[CF] _cf_injectPageData: meta fetched", JSON.stringify(pageMeta).slice(0, 200));
    } catch(metaErr) {
      console.warn("[CF] _cf_injectPageData: could not fetch page metadata:", metaErr?.message ?? String(metaErr).slice(0, 80));
    }

    var payload = {
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
    var tryPut = async (url) => {
      try {
        var resp = await revex.put(url, payload);
        var data   = resp?.data ?? resp;
        var status = typeof resp?.status === "number" ? resp.status
                     : typeof data?.status === "number" ? data.status : 200;
        return { data, status };
      } catch(e) {
        var status = e?.response?.status ?? null;
        var data   = e?.response?.data ?? { message: String(e).slice(0, 200) };
        return { data, status, threw: true };
      }
    };

    var r = await tryPut(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`);
    var method = "funnel-page";

    // Step 3: if primary fails (4xx or threw), try alternative endpoint
    if (r.threw || (r.status !== null && r.status >= 400)) {
      console.warn("[CF] _cf_injectPageData: primary endpoint failed (status", r.status, "), trying /funnels/page/");
      var r2 = await tryPut(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
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
  var diag = { approach0: null, approach1: null, approach2: null, approach2b: null, approach3: null, approach4b: null, approach4c: null };
  try {
    /* ════════════════════════════════════════════════════════════════════════
       APPROACH 0: Write AI content to every likely GHL clipboard localStorage key.
       GHL builder copy-paste stores section JSON in localStorage — we don't know
       which key, so we write to all candidates.  Zero risk: writes are reversible.
       If any key matches, pressing Ctrl+V in the GHL builder will paste the content
       using GHL's OWN paste mechanism (no Firebase write needed from our side).
       ════════════════════════════════════════════════════════════════════════ */
    {
      var clipKeys = [
        "hl-copy-element",   "hl_copy_element",   "builder-clipboard",
        "ghl-clipboard",     "funnel-clipboard",   "section-clipboard",
        "hl-page-clipboard", "highlevel_clipboard","page-builder-clipboard",
        "hl-section-copy",   "hl_section_copy",    "hl-builder-copy",
      ];
      var clipPayload = JSON.stringify({
        type:     "section",
        sections: pageData.sections,
        rows:     pageData.rows,
        columns:  pageData.columns ?? pageData.cols ?? {},
        elements: pageData.elements,
      });
      var attempts = [];
      for (var k of clipKeys) {
        try { localStorage.setItem(k, clipPayload); attempts.push(k + ":ok"); }
        catch (e)  { attempts.push(k + ":err"); }
      }
      diag.approach0 = { keys: attempts, hint: "Try Ctrl+V in the GHL builder — if GHL reads from any of these keys it will paste natively." };
    }

    /* ── Find revex for metadata fetch (used by approaches 1 and 2) ─────── */
    var revex = null;
    var appEl = document.querySelector("#app");
    revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    if (!revex) {
      for (var ai of Object.values(window.app ?? {})) {
        var r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && typeof r.get === "function") { revex = r; break; }
      }
    }

    /* ── 1. Fetch GHL page metadata (needed for approaches 1 and 2) ─────── */
    var metadata = null;
    if (revex) {
      try {
        var r = await revex.get(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`);
        metadata = r?.data ?? r ?? null;
      } catch (_) {
        try {
          var r2 = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
          metadata = r2?.data ?? r2 ?? null;
        } catch (_2) {}
      }
    }
    var downloadUrl = metadata?.pageDataDownloadUrl ?? null;
    var uploadUrl   = metadata?.pageDataUploadUrl   ?? null;
    diag.metaOk = !!metadata;
    /* Blank page: metadata exists but GHL never created a Firebase file for this page */
    if (!downloadUrl && !uploadUrl && metadata) diag.blankPage = true;

    /* ════════════════════════════════════════════════════════════════════════
       APPROACH 1: GHL-signed upload URL
       If GHL returns pageDataUploadUrl (a pre-signed PUT URL), write directly.
       No auth headers required — GHL has already signed the URL.
       ════════════════════════════════════════════════════════════════════════ */
    if (uploadUrl && typeof uploadUrl === "string") {
      try {
        var res = await fetch(uploadUrl, {
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
      var fbMatch = downloadUrl.match(
        /firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?]+)/
      );
      if (fbMatch) {
        var bucket      = decodeURIComponent(fbMatch[1]);
        var encodedPath = fbMatch[2]; // keep URL-encoded; decode for name param
        var objectPath  = decodeURIComponent(encodedPath);
        var   idToken     = null;
        var tokenDiag   = [];

        /* Try Firebase v8 compat global */
        try {
          if (typeof firebase !== "undefined" && firebase.apps?.length) {
            var user = firebase.auth().currentUser;
            if (user) { idToken = await user.getIdToken(true); tokenDiag.push("v8-global"); }
          }
        } catch (te1) { tokenDiag.push(`v8-err:${String(te1).slice(0, 40)}`); }

        /* Try Firebase apps attached to window properties */
        if (!idToken) {
          try {
            for (var val of Object.values(window)) {
              if (!val || typeof val !== "object") continue;
              if (typeof val.auth === "function") {
                var auth = val.auth();
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
            var globals = appEl?.__vue_app__?.config?.globalProperties ?? {};
            var authObj = globals.$auth ?? globals.firebaseAuth ?? globals.auth ?? null;
            if (authObj?.currentUser) {
              idToken = await authObj.currentUser.getIdToken(true);
              tokenDiag.push("vue-globals");
            }
          } catch (te3) { tokenDiag.push(`vue-err:${String(te3).slice(0, 40)}`); }
        }

        /* Try window.__firebaseAuthUser__ or similar GHL-specific globals */
        if (!idToken) {
          try {
            var authUser = window.__firebaseAuthUser__
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
              var req = indexedDB.open("firebaseLocalStorageDb");
              req.onerror = () => resolve(null);
              req.onsuccess = (evt) => {
                var db = evt.target.result;
                if (!db.objectStoreNames.contains("firebaseLocalStorage")) {
                  db.close(); resolve(null); return;
                }
                var tx     = db.transaction("firebaseLocalStorage", "readonly");
                var store  = tx.objectStore("firebaseLocalStorage");
                var getAll = store.getAll();
                getAll.onerror   = () => { db.close(); resolve(null); };
                getAll.onsuccess = (e2) => {
                  db.close();
                  var records = e2.target.result ?? [];
                  for (var rec of records) {
                    var token = rec?.value?.stsTokenManager?.accessToken;
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
            var storageFormat  = "skipped";
            var existElemCount = 0;
            try {
              var existRes = await fetch(downloadUrl, {
                headers: { "Authorization": `Firebase ${idToken}` },
                signal:  AbortSignal.timeout(5000),
              });
              if (existRes.ok) {
                var existing = await existRes.json();
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
                  var firstRowVal = existing.rows && Object.values(existing.rows)[0];
                  diag.approach2.firstRowKeys = firstRowVal
                    ? Object.keys(firstRowVal).slice(0, 12)
                    : "rows-empty";
                  diag.approach2.firstExistRowMetaKeys = firstRowVal?.metaData
                    ? Object.keys(firstRowVal.metaData).slice(0, 14)
                    : "no-metaData";
                  /* Confirm rows are keyed by the row's own .id, not by section ID */
                  var firstRowDictKey = existing.rows ? Object.keys(existing.rows)[0] : null;
                  diag.approach2.firstExistRowDictKey = firstRowDictKey ?? "none";
                  diag.approach2.firstExistRowIdMatch  = firstRowDictKey !== null
                    ? (firstRowDictKey === (firstRowVal?.id ?? firstRowVal?.metaData?.id ?? "__no-id__"))
                    : null;
                  /* Peek at first section's top-level keys and metaData keys */
                  var sec0 = Array.isArray(existing.sections) && existing.sections[0];
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

            /* ── Step 1: Build structured-dict payload — v2.46.0 combined format ────────── *
             * v2.45.0 confirmed: populated rows/cols/elems dicts are correct (rows=7 ✓).
             * v2.46.0 adds: section.elements flat array (GHL renderer requires BOTH):
             *   1. rows/columns/elements dicts in { id, metaData:{...} } wrapper format ✓
             *   2. section.elements — flat array of ALL nodes (metaData spread to top level)
             * Debug confirmed: sec0 hasElements:false after v2.45.0 → page hang.
             * Clone baseline: sec0 elementsLen=14, keys=["extra","meta","styles","child",
             *   "id","tagName","wrapper","class","title","type",...] — flat, no metaData.
             * Build flat array by traversing section.metaData.child → row.metaData.child
             * → col.metaData.child (AI generator always populates these child arrays).    */

            var pd = pageData;

            /* Pre-write diagnostics — sample from raw pd.rows (wrapped format).
             * v2.45.0: preWriteRowHasMeta should be TRUE ({ id, metaData:{} } wrapper). */
            var _firstRawRow = Object.values(pd.rows ?? {})[0];
            diag.approach2.preWriteRowKeys    = _firstRawRow
              ? Object.keys(_firstRawRow).slice(0, 10) : "rows-empty";
            diag.approach2.preWriteRowHasMeta = _firstRawRow
              ? ("metaData" in _firstRawRow) : null;
            diag.approach2.preWriteSectionChildId =
              pd.sections?.[0]?.metaData?.child?.[0]
              ?? pd.sections?.[0]?.child?.[0]
              ?? "none";

            /* v2.46.0: sections carry BOTH metaData (with child refs) AND a flat elements array.
             * elements array: every node in the section in flat format (metaData spread to top level).
             * Traversal: section.metaData.child → row.metaData.child → col.metaData.child */
            var funnelIdFromPath = objectPath.split("/")[1] ?? "";
            /* v2.39.0: extract locationId from the GHL tab URL for metaUpdate patterns.
             * Tab URL format: https://app.gohighlevel.com/location/{locationId}/page-builder/{pageId} */
            var tabLocationId = (window.location.href.match(/\/location\/([^/]+)\//) ?? [])[1] ?? "";
            var sectionsWithContext = (pd.sections ?? []).map((sec, i) => {
              /* Build flat elements array for this section.
               * v2.54.0: AI generator's finalize() already populates sec.elements via DFS.
               * GhlPageData type has no rows/columns/elements dicts — use sec.elements first.
               * Fall back to pd.rows traversal for URL-captured pages that do have dicts. */
              var flatNodes = [];
              var childRowIds = Array.isArray(sec.metaData?.child) ? sec.metaData.child : [];

              if (Array.isArray(sec.elements) && sec.elements.length > 0) {
                /* Primary v2.54.0: elements already flattened by finalize() in AI generator */
                flatNodes = sec.elements.filter(function(n) { return n && typeof n === 'object'; });
              } else if (childRowIds.length > 0) {
                /* Secondary: traverse child chains via pd.rows (URL-captured pages) */
                for (var rowId of childRowIds) {
                  var row = pd.rows?.[rowId];
                  if (!row) continue;
                  var rowMeta = row.metaData ?? row;
                  flatNodes.push({ ...rowMeta, id: rowId });
                  var colIds = Array.isArray(rowMeta.child) ? rowMeta.child : [];
                  for (var colId of colIds) {
                    var col = pd.columns?.[colId];
                    if (!col) continue;
                    var colMeta = col.metaData ?? col;
                    flatNodes.push({ ...colMeta, id: colId });
                    var elemIds = Array.isArray(colMeta.child) ? colMeta.child : [];
                    for (var elemId of elemIds) {
                      var elem = pd.elements?.[elemId];
                      if (!elem) continue;
                      var elemMeta = elem.metaData ?? elem;
                      flatNodes.push({ ...elemMeta, id: elemId });
                    }
                  }
                }
              }

              /* Last-resort fallback: collect ALL nodes from flat dicts */
              if (flatNodes.length === 0) {
                for (var [nrId, nrRow] of Object.entries(pd.rows ?? {})) {
                  flatNodes.push({ ...(nrRow.metaData ?? nrRow), id: nrId });
                }
                for (var [ncId, ncCol] of Object.entries(pd.columns ?? {})) {
                  flatNodes.push({ ...(ncCol.metaData ?? ncCol), id: ncId });
                }
                for (var [neId, neElem] of Object.entries(pd.elements ?? {})) {
                  flatNodes.push({ ...(neElem.metaData ?? neElem), id: neId });
                }
              }

              return {
                id:         sec.id,
                metaData:   { ...sec.metaData },
                elements:   flatNodes,
                sequence:   i,
                pageId:     builderId,
                funnelId:   funnelIdFromPath,
                locationId: "",
              };
            });

            console.log("[CF v2.46.0] sec0 elements array length:", sectionsWithContext[0]?.elements?.length ?? "MISSING");
            console.log("[CF v2.46.0] sec0 first elem keys:", sectionsWithContext[0]?.elements?.[0] ? Object.keys(sectionsWithContext[0].elements[0]).join(",") : "none");

            /* Diagnostics: full flat tree written into section[0].elements.
             * v2.37.0: firstSecElemCount should be >> 1 (rows+cols+leaves).
             * rowRefOk = first row's first child col IS in the elements array.
             * colRefOk = that col's first child elem IS in the elements array.  */
            var _sec0El0 = sectionsWithContext[0]?.elements?.[0] ?? null;
            diag.approach2.firstSecElemCount  = sectionsWithContext[0]?.elements?.length ?? 0;
            diag.approach2.firstSecEl0HasMeta    = _sec0El0 ? ("metaData" in _sec0El0) : null;
            diag.approach2.firstSecEl0HasElement = _sec0El0 ? ("element" in _sec0El0) : null;
            diag.approach2.firstSecEl0Keys       = _sec0El0 ? Object.keys(_sec0El0).slice(0, 14) : "empty";
            diag.approach2.firstSecElemFormat  = "child-traversal-flat-v2.46.0";
            diag.approach2.sec0MetaChildLen = (pd.sections?.[0]?.metaData?.child ?? []).length;
            /* rowRefOk / colRefOk: verify child IDs resolve in section.elements */
            (() => {
              var sec0Elems = sectionsWithContext[0]?.elements ?? [];
              var sec0ElemIds = new Set(sec0Elems.map(e => e.id));
              var firstRow = sec0Elems[0];
              var firstColId = firstRow && Array.isArray(firstRow.child) ? firstRow.child[0] : null;
              var rowRefOk = firstColId ? sec0ElemIds.has(firstColId) : null;
              var firstCol = firstColId ? sec0Elems.find(e => e.id === firstColId) : null;
              var firstElemId = firstCol && Array.isArray(firstCol.child) ? firstCol.child[0] : null;
              var colRefOk = firstElemId ? sec0ElemIds.has(firstElemId) : null;
              diag.approach2.rowRefOk  = rowRefOk;
              diag.approach2.colRefOk  = colRefOk;
              diag.approach2.firstColId = firstColId ?? "none";
              diag.approach2.firstElemId = firstElemId ?? "none";
            })();

            /* v2.46.0: write BOTH section.elements (flat array) AND populated dicts.
             * rows/columns/elements dicts: { id, metaData:{...} } wrapper format (v2.45.0 ✓).
             * sections: include flat elements array built above (v2.46.0 addition).
             * v2.36.0: spread full pd so no fields are silently omitted (settings, trackingCode, popupsList).
             * Bug 3 fix (v2.41.0): id:builderId is LAST so ...pd can never overwrite it. */
            var writePayload = {
              ...pd,
              sections: sectionsWithContext,
              id:       builderId,
            };
            /* v2.49.1: Remove rows/columns/elements from writePayload.
             * Native GHL Firebase confirmed: NO top-level rows/cols/elems keys in real pages.
             * ...pd spread already includes sections, settings, general, pageStyles,
             * trackingCode, fontsForPreview, popups, popupsList. id overrides any in pd. */
            delete writePayload.rows;
            delete writePayload.columns;
            delete writePayload.elements;

            diag.approach2.writePayloadTopKeys = Object.keys(writePayload);
            diag.approach2.storageFormat       = storageFormat;
            diag.approach2.writeFormat         = "populated-dicts-plus-flat-elements-v2.46.0";
            diag.approach2.writeEmptyDicts     = false;
            diag.approach2.existElemCount      = existElemCount;
            diag.approach2.writePayloadFormat  = "sections-only-v2.49.1";

            /* v2.48.0: Store built sections for A5 executeScript pickup by background.js. */
            window.__cfLastSectionsWithContext = sectionsWithContext;

            /* ── v2.58.0: Write AI sections directly to Firebase ────────────────────── *
             * Deep-clone pd.sections (full GHL-native structure: rows, cols, elements) *
             * patch per-section metadata (pageId, funnelId, locationId, sequence),    *
             * then POST back to the same Firebase path using the existing top-level   *
             * envelope (general, pageStyles, fonts, settings, trackingCode).          *
             * No text replacement, no template overlay, no clone API calls.           */
            try {
              /* Step 1: Use probe-fetched native data, or re-fetch if probe failed */
              var wipPayload = (existing && existing.sections) ? existing : null;
              diag.approach2.wipUsedExisting = !!(existing && existing.sections);
              if (!wipPayload) {
                try {
                  var wipReadRes = await fetch(downloadUrl, {
                    headers: { 'Authorization': 'Firebase ' + idToken },
                    signal:  AbortSignal.timeout(6000),
                  });
                  diag.approach2.wipReadStatus = wipReadRes.status;
                  if (wipReadRes.ok) {
                    wipPayload = await wipReadRes.json();
                  }
                } catch(_wipRe) {
                  diag.approach2.wipReadErr = String(_wipRe).slice(0, 80);
                }
              }
              diag.approach2.writeInPlace = true;

              if (!wipPayload || !Array.isArray(wipPayload.sections)) {
                diag.approach2.writeInPlaceError = 'no-native-payload';
                return JSON.stringify({ ok: false, error: 'write-in-place: no native Firebase payload', diag: diag });
              }

              /* Step 2: Deep-clone AI sections and patch target page metadata fields */
              if (!pd || !Array.isArray(pd.sections) || pd.sections.length === 0) {
                diag.approach2.writeInPlaceError = 'no-ai-sections';
                return JSON.stringify({ ok: false, error: 'write-in-place: pd.sections missing or empty', diag: diag });
              }
              var aiSections     = JSON.parse(JSON.stringify(pd.sections));
              var targetPageId   = (wipPayload && wipPayload.id) ? wipPayload.id : builderId;
              var targetFunnelId = objectPath.split('/')[1] || '';
              var targetLocId    = (wipPayload && wipPayload.sections && wipPayload.sections[0]
                                   && wipPayload.sections[0].locationId)
                                   ? wipPayload.sections[0].locationId : '';
              for (var si = 0; si < aiSections.length; si++) {
                aiSections[si].pageId   = targetPageId;
                aiSections[si].funnelId = targetFunnelId;
                if (targetLocId) aiSections[si].locationId = targetLocId;
                aiSections[si].sequence = si;
              }
              diag.approach2.aiSectionsDirectWrite = true;
              diag.approach2.aiSectionCount   = aiSections.length;
              diag.approach2.aiSec0ElemCount  = aiSections[0] ? (aiSections[0].elements || []).length : 0;
              diag.approach2.targetPageId     = targetPageId;
              diag.approach2.targetFunnelId   = targetFunnelId;
              diag.approach2.targetLocationId = targetLocId;

              /* Step 3: Build write payload — existing top-level envelope + AI sections */
              var wipWritePayload = JSON.parse(JSON.stringify(wipPayload));
              wipWritePayload.sections = aiSections;

              /* Step 5: Construct Firebase upload endpoint (same objectPath already in scope) */
              var wipEncodedPath = encodeURIComponent(objectPath);
              var wipUploadEp    = 'https://firebasestorage.googleapis.com/v0/b/'
                + encodeURIComponent(bucket)
                + '/o?uploadType=media&name=' + encodeURIComponent(objectPath);

              /* Step 6: POST write to Firebase — overwrites the same file in-place */
              var wipWriteRes = await fetch(wipUploadEp, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Firebase ' + idToken },
                body:    JSON.stringify(wipWritePayload),
              });
              diag.approach2.cloneWriteStatus = wipWriteRes.status;
              if (!wipWriteRes.ok) {
                var wipWriteErrTxt = await wipWriteRes.text().catch(function() { return ''; });
                diag.approach2.wipWriteError = wipWriteErrTxt.slice(0, 120);
                return JSON.stringify({ ok: false, error: 'write-in-place: Firebase write failed HTTP ' + wipWriteRes.status, diag: diag });
              }

              /* Step 7: Patch old download token back so GHL's cached URL stays valid */
              var wipOldTok = (downloadUrl.match(/[?&]token=([^&]+)/) || [])[1] || '';
              diag.approach2.cloneOldToken = wipOldTok ? wipOldTok.slice(0, 20) + '\u2026' : 'none-in-url';
              if (wipOldTok) {
                var wipMetaEp  = 'https://firebasestorage.googleapis.com/v0/b/'
                  + encodeURIComponent(bucket) + '/o/' + wipEncodedPath;
                var wipPatchOk = false;
                /* Format 1: nested metadata.downloadTokens */
                try {
                  var _wp1 = await fetch(wipMetaEp, {
                    method:  'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Firebase ' + idToken },
                    body:    JSON.stringify({ metadata: { downloadTokens: wipOldTok } }),
                  });
                  diag.approach2.clonePatchStatus1 = _wp1.status;
                  if (_wp1.ok) {
                    var _wp1b   = await _wp1.json().catch(function() { return {}; });
                    var _wp1Tok = (_wp1b.metadata && _wp1b.metadata.downloadTokens)
                      ? _wp1b.metadata.downloadTokens : (_wp1b.downloadTokens || null);
                    if (_wp1Tok === wipOldTok) {
                      wipPatchOk = true;
                      diag.approach2.clonePatchToken = 'ok-format1';
                    } else {
                      diag.approach2.clonePatchToken = 'accepted-not-verified';
                    }
                  }
                } catch(_wp1e) { diag.approach2.clonePatchStatus1 = 'err'; }
                /* Format 2: top-level downloadTokens if format 1 failed */
                if (!wipPatchOk) {
                  try {
                    var _wp2 = await fetch(wipMetaEp, {
                      method:  'PATCH',
                      headers: { 'Content-Type': 'application/json', 'Authorization': 'Firebase ' + idToken },
                      body:    JSON.stringify({ downloadTokens: wipOldTok }),
                    });
                    diag.approach2.clonePatchStatus2 = _wp2.status;
                    if (_wp2.ok) {
                      var _wp2b   = await _wp2.json().catch(function() { return {}; });
                      var _wp2Tok = (_wp2b.metadata && _wp2b.metadata.downloadTokens)
                        ? _wp2b.metadata.downloadTokens : (_wp2b.downloadTokens || null);
                      if (_wp2Tok === wipOldTok) {
                        wipPatchOk = true;
                        diag.approach2.clonePatchToken = 'ok-format2';
                      } else {
                        diag.approach2.clonePatchToken = 'accepted-not-verified-f2';
                      }
                    }
                  } catch(_wp2e) { diag.approach2.clonePatchStatus2 = 'err'; }
                }
                if (!wipPatchOk && !diag.approach2.clonePatchToken) {
                  diag.approach2.clonePatchToken = 'failed';
                }
              } else {
                diag.approach2.clonePatchToken = 'no-old-token';
              }

              /* ── APPROACH 4B: POST pageData to GHL sync endpoint ─────────────────── *
               * GHL Publish calls POST /prebuilt-section/sync/changes with pageData.    *
               * Our Firebase write updates the visual rendering but NOT GHL's backend   *
               * copy of pageData, so Publish 422s ("pageData should not be empty").     *
               * Fix: call the same endpoint directly using revexBackendService so        *
               * GHL's backend stores our data and Publish works.                        */
              try {
                var syncEndpoint4b = 'https://backend.leadconnectorhq.com/funnels/builder/prebuilt-section/sync/changes';
                var tabLocId4b = (window.location.href.match(/\/location\/([^/]+)\//) || [])[1] || locationId || targetLocId || '';
                var funnelId4b = objectPath.split('/')[1] || (wipPayload && wipPayload.funnelId) || '';
                if (revex && typeof revex.post === 'function') {
                  var a4bPayload = {
                    pageData:   wipWritePayload,
                    locationId: tabLocId4b,
                    pageId:     builderId,
                    funnelId:   funnelId4b,
                  };
                  var a4bResp   = await revex.post(syncEndpoint4b, a4bPayload);
                  var a4bStatus = (typeof a4bResp?.status === 'number') ? a4bResp.status : 200;
                  diag.approach4b = { status: a4bStatus, ok: true };
                } else {
                  /* Fallback: direct fetch with session cookies when revex is absent */
                  var a4bFetchRes = await fetch(syncEndpoint4b, {
                    method:      'POST',
                    headers:     { 'Content-Type': 'application/json' },
                    body:        JSON.stringify({ pageData: wipWritePayload, locationId: tabLocId4b, pageId: builderId, funnelId: funnelId4b }),
                    credentials: 'include',
                    signal:      AbortSignal.timeout(10000),
                  });
                  diag.approach4b = { status: a4bFetchRes.status, ok: a4bFetchRes.ok, result: a4bFetchRes.ok ? 'fetch-sync-ok' : 'fetch-sync-err' };
                  if (!a4bFetchRes.ok) {
                    diag.approach4b.skip = 'revex-null-or-no-post';
                  }
                }
              } catch (a4bErr) {
                var a4bErrStatus = a4bErr?.response?.status ?? null;
                var a4bErrMsg    = a4bErr?.response?.data?.message ?? String(a4bErr).slice(0, 120);
                diag.approach4b = { status: a4bErrStatus, error: a4bErrMsg };
                /* If 422 (field-shape mismatch), retry with only core page data fields */
                if (a4bErrStatus === 422 && revex && typeof revex.post === 'function') {
                  try {
                    var a4bPayload2 = {
                      pageData: {
                        sections:   wipWritePayload.sections,
                        settings:   wipWritePayload.settings,
                        general:    wipWritePayload.general,
                        pageStyles: wipWritePayload.pageStyles,
                      },
                      locationId: tabLocId4b,
                      pageId:     builderId,
                    };
                    var a4bResp2   = await revex.post(syncEndpoint4b, a4bPayload2);
                    var a4bStatus2 = (typeof a4bResp2?.status === 'number') ? a4bResp2.status : 200;
                    diag.approach4b.retry422 = { status: a4bStatus2, ok: true };
                  } catch (a4bErr2) {
                    diag.approach4b.retry422 = {
                      status: a4bErr2?.response?.status ?? null,
                      error:  String(a4bErr2).slice(0, 80),
                    };
                  }
                }
              }

              /* ── APPROACH 4C: Ctrl+S synthetic keydown fallback ──────────────────── *
               * If approach 4B returned a non-200, dispatch a synthetic Ctrl+S         *
               * keydown to the active document element. This triggers GHL's native     *
               * save handler which serializes Vuex sections into pageData and calls     *
               * the sync endpoint itself.                                               */
              var reloadDelay = 400;
              if (!diag.approach4b || !diag.approach4b.ok) {
                try {
                  var ctrlSTarget = document.activeElement || document.body || document.documentElement;
                  var ctrlSEvent = new KeyboardEvent('keydown', {
                    key:        's',
                    code:       'KeyS',
                    keyCode:    83,
                    which:      83,
                    ctrlKey:    true,
                    metaKey:    false,
                    bubbles:    true,
                    cancelable: true,
                  });
                  ctrlSTarget.dispatchEvent(ctrlSEvent);
                  diag.approach4c = { ok: true, result: 'ctrlS-dispatched', target: ctrlSTarget.tagName || 'unknown' };
                  /* Give GHL's native save handler time to complete before reload */
                  reloadDelay = 1500;
                } catch (_a4c) {
                  diag.approach4c = { ok: false, result: 'ctrlS-err', error: String(_a4c).slice(0, 80) };
                }
              } else {
                diag.approach4c = { ok: false, result: 'skipped-4b-succeeded' };
              }

              setTimeout(function() { window.location.reload(); }, reloadDelay);
              return JSON.stringify({ ok: true, method: 'write-in-place', diag: diag });
            } catch(_wipErr) {
              diag.approach2.wipErr = String(_wipErr).slice(0, 120);
              return JSON.stringify({ ok: false, error: 'write-in-place exception: ' + String(_wipErr).slice(0, 80), diag: diag });
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
      var a2b = { source: "constructed-path" };
      try {
        var funnelId2B  = metadata?.funnelId ?? metadata?.funnel_id ?? null;
        a2b.funnelId      = funnelId2B ?? "missing";
        a2b.metaFunnelId  = funnelId2B ?? null;
        a2b.metadataKeys  = Object.keys(metadata ?? {}).slice(0, 15);

        if (funnelId2B) {
          /* ── Get Firebase auth token (same IDB logic as approach 2) ──── */
          var idToken2B = null;
          var tokDiag2B = [];
          try {
            if (typeof firebase !== "undefined" && firebase.apps?.length) {
              var u = firebase.auth().currentUser;
              if (u) { idToken2B = await u.getIdToken(true); tokDiag2B.push("v8"); }
            }
          } catch (_t1) {}
          if (!idToken2B) {
            try {
              for (var val of Object.values(window)) {
                if (!val || typeof val !== "object") continue;
                if (typeof val.auth === "function") {
                  var auth = val.auth();
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
                var req = indexedDB.open("firebaseLocalStorageDb");
                req.onerror = () => resolve(null);
                req.onsuccess = (evt) => {
                  var db = evt.target.result;
                  if (!db.objectStoreNames.contains("firebaseLocalStorage")) { db.close(); resolve(null); return; }
                  var tx     = db.transaction("firebaseLocalStorage", "readonly");
                  var store  = tx.objectStore("firebaseLocalStorage");
                  var getAll = store.getAll();
                  getAll.onerror   = () => { db.close(); resolve(null); };
                  getAll.onsuccess = (e2) => {
                    db.close();
                    for (var rec of (e2.target.result ?? [])) {
                      var token = rec?.value?.stsTokenManager?.accessToken;
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
          var bucketFinal = cachedBucket ?? null;
          var bucketDiag = [];
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
              var fa = window.__FIREBASE_APP__ ?? window._firebaseApp ?? null;
              bucketFinal = fa?.options?.storageBucket ?? null;
              if (bucketFinal) bucketDiag.push("window-fb-app");
            } catch (_b2) {}
          }
          if (!bucketFinal) {
            try {
              var globs = appEl?.__vue_app__?.config?.globalProperties ?? {};
              var fbApp = globs.$firebase ?? globs.firebase ?? globs.firebaseApp ?? null;
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
            var pd2B = pageData;
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
            var wrappedRows2B = Object.fromEntries(
              Object.entries(pd2B.rows    ?? {}).map(([k, v]) => [k, flattenForFirebase2B(k, v)])
            );
            var wrappedCols2B = Object.fromEntries(
              Object.entries(pd2B.columns ?? {}).map(([k, v]) => [k, flattenForFirebase2B(k, v)])
            );
            var wrappedEls2B = Object.fromEntries(
              Object.entries(pd2B.elements ?? {}).map(([k, v]) => [k, flattenForFirebase2B(k, v)])
            );
            /* v2.37.0: full flat element tree — mirrors approach 2 sectionsWithContext fix.
             * Push row + its cols + each col's leaf elements into one flat section.elements. */
            var sectionsCtx2B = (pd2B.sections ?? []).map((sec, i) => {
              var childRowIds2B = Array.isArray(sec.metaData?.child) ? sec.metaData.child : [];
              var flatEls2B = [];
              for (var rowId of childRowIds2B) {
                var row = wrappedRows2B[rowId];
                if (!row) continue;
                flatEls2B.push(row);
                var colIds = Array.isArray(row.child) ? row.child : [];
                for (var colId of colIds) {
                  var col = wrappedCols2B[colId];
                  if (!col) continue;
                  flatEls2B.push(col);
                  var elemIds = Array.isArray(col.child) ? col.child : [];
                  for (var elemId of elemIds) {
                    var elem = wrappedEls2B[elemId];
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
            var writePayload2B = {
              fontsForPreview: pd2B.fontsForPreview,
              general:         pd2B.general,
              id:              builderId,
              pageStyles:      pd2B.pageStyles,
              popups:          pd2B.popups ?? [],
              sections:        sectionsCtx2B,
            };
            /* v2.49.1: No rows/columns/elements in writePayload2B either.
             * Matches native GHL Firebase format (sections-only). */
            a2b.writeFormat       = "sections-only-v2.49.1";
            a2b.writePayloadFormat = "sections-only-v2.49.1";

            /* ── POST to Firebase Storage REST API ───────────────────── */
            var constructedPath = `funnels/${funnelId2B}/${builderId}.json`;
            a2b.path = constructedPath;
            var uploadEp2B =
              `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketFinal)}` +
              `/o?uploadType=media&name=${encodeURIComponent(constructedPath)}`;
            var res2B = await fetch(uploadEp2B, {
              method:  "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Firebase ${idToken2B}` },
              body:    JSON.stringify(writePayload2B),
              signal:  AbortSignal.timeout(12000),
            });
            a2b.httpStatus = res2B.status;
            if (res2B.ok) {
              a2b.result = "success";
              /* ── Extract download token from POST response (fresh, no old-token PATCH needed) */
              var fbData2B = await res2B.json().catch(() => ({}));
              var newTok2B = fbData2B.downloadTokens ?? "";
              a2b.tokenSource = "fresh-post-response";
              var encPath2B = encodeURIComponent(constructedPath);
              var newUrl2B  =
                `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketFinal)}` +
                `/o/${encPath2B}?alt=media&token=${newTok2B}`;
              a2b.newDownloadUrl = newUrl2B.slice(0, 160);
              /* v2.39.0: declare patchOk2B BEFORE the revex block so it's in scope
               * for the success gate check below (outside if/else). */
              var patchOk2B = false;
              if (revex) {
                /* v2.39.0: same 6-pattern PATCH→PUT retry as approach 2.
                 * locationId extracted from window.location.href (same tab URL). */
                var tabLocId2B = (window.location.href.match(/\/location\/([^/]+)\//) ?? [])[1] ?? "";
                a2b.tabLocationId = tabLocId2B || "(not-found)";
                var metaUrls2B = tabLocId2B ? [
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
                var patchAttempts2B = [];
                outer2B: for (var mu of metaUrls2B) {
                  for (var verb of ["patch", "put"]) {
                    try {
                      await revex[verb](mu, { pageDataDownloadUrl: newUrl2B });
                      patchAttempts2B.push({ url: mu.slice(50), verb, status: 200, ok: true });
                      patchOk2B = true;
                      a2b.metaPatch = `ok-verb:${verb} url:${mu.slice(50, 90)}`;
                      break outer2B;
                    } catch (_pe) {
                      var st = _pe?.response?.status ?? "err";
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
                setTimeout(function() { window.location.reload(); }, 400);
              } else {
                a2b.result = `firebase-write-ok-but-meta-patch-${a2b.metaPatch ?? "failed"}`;
              }
            } else {
              var errTxt2B = await res2B.text().catch(() => "");
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
      var method = diag.approach2?.fallThrough ? "firebase-write" : "firebase-write-constructed";
      return JSON.stringify({ ok: true, method, diag });
    }

    /* All direct approaches failed — A3 (Pinia) will be attempted frame-targeted
       from the service worker. Return all-failed; SW will elevate to ok if A3 wins. */
    return JSON.stringify({ ok: false, method: "all-failed", diag });
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
  var tryEls = [
    document.querySelector("#app"),
    document.documentElement,
  ].concat(Array.from(document.querySelectorAll("[data-v-app]")).slice(0, 3)).filter(Boolean);
  for (var _pi = 0; _pi < tryEls.length; _pi++) {
    var el = tryEls[_pi];
    var va = el.__vue_app__;
    if (!va) continue;
    var provides = (va._context && va._context.provides) ? va._context.provides : {};
    var p = provides[Symbol.for("pinia")]
      || (Object.values(provides).find(function(v) { return v && v._s instanceof Map; }))
      || null;
    if (p && p._s instanceof Map && p._s.size > 0) return true;
  }
  return false;
}

/* ─── _cf_approach4VuexInFrame ────────────────────────────────────────────────
   Approach 4: Vuex direct state mutation — Vue 3 lookup (v2.49.0).
   GHL uses vuex.esm-bundler.js with Vue 3. Store is found via
   vueApp.config.globalProperties.$store. Falls back to window.$store and
   vueApp._instance.proxy.$store, then Vue 2 patterns as last resort.
   Uses var throughout (no const/let) for safe executeScript serialization.    */
function _cf_approach4VuexInFrame(builderId, locationId, pageData) {
  var diag4 = { source: "vuex-frame-targeted", storeFound: false };
  try {
    /* ── 1. Locate the Vuex store — Vue 3 pattern first ─────────────────── */
    var mountEl = document.querySelector('#__nuxt') ||
                  document.querySelector('[data-v-app]') ||
                  document.querySelector('#app');
    var vueApp = mountEl && mountEl.__vue_app__;
    var vuexStore = (vueApp &&
                     vueApp.config &&
                     vueApp.config.globalProperties &&
                     vueApp.config.globalProperties.$store) || null;

    if (!vuexStore) vuexStore = window.$store || null;

    if (!vuexStore && vueApp) {
      try {
        var rootInstance = vueApp._instance;
        if (rootInstance && rootInstance.proxy && rootInstance.proxy.$store) {
          vuexStore = rootInstance.proxy.$store;
        }
      } catch(_vri) {}
    }

    /* Vue 2 fallbacks */
    if (!vuexStore) {
      vuexStore = (window.__nuxt__ && window.__nuxt__.$store) || window.__vue_store__ || null;
    }
    if (!vuexStore) {
      var rootEl = document.querySelector('#app');
      var rootVue = rootEl && rootEl.__vue__;
      if (rootVue) vuexStore = rootVue.$store || (rootVue.$root && rootVue.$root.$store) || null;
    }

    if (!vuexStore) {
      diag4.result = 'no-vuex-store-found';
      return JSON.stringify({ ok: false, method: 'vuex-direct', diag: { approach4: diag4 } });
    }
    diag4.storeFound = true;

    /* ── 2. Find module with sections array ──────────────────────────────── */
    var stateKeys = Object.keys(vuexStore.state || {});
    diag4.topStateKeys = stateKeys.slice(0, 30);
    var sectionsModuleKey = null;

    /* Primary: look for a module with Array.isArray(sections) */
    stateKeys.forEach(function(key) {
      var mod = vuexStore.state[key];
      if (mod && Array.isArray(mod.sections)) {
        sectionsModuleKey = key;
      }
    });

    /* Fallback: look for rows/elements in any module */
    if (!sectionsModuleKey) {
      stateKeys.forEach(function(key) {
        var mod = vuexStore.state[key];
        if (mod && typeof mod === 'object' && !Array.isArray(mod)) {
          var mk = Object.keys(mod);
          if (mk.indexOf('rows') !== -1 || mk.indexOf('elements') !== -1) {
            if (!sectionsModuleKey) sectionsModuleKey = key;
          }
        }
      });
    }

    /* Fallback: check root state directly */
    if (!sectionsModuleKey) {
      if (Array.isArray(vuexStore.state.sections) ||
          vuexStore.state.rows !== undefined) {
        sectionsModuleKey = '__root__';
      }
    }

    if (!sectionsModuleKey) {
      diag4.result = 'vuex-found stateKeys=' + stateKeys.join(',') + ' no-sections-module';
      return JSON.stringify({ ok: false, method: 'vuex-direct', diag: { approach4: diag4 } });
    }
    diag4.moduleKey = sectionsModuleKey;

    var modState = sectionsModuleKey === '__root__' ? vuexStore.state : vuexStore.state[sectionsModuleKey];
    var ourSections = pageData.sections || [];
    var before = Array.isArray(modState.sections) ? modState.sections.length : 0;

    /* ── 3. Commit via mutation, fall back to direct state patch ─────────── */
    var commitOk = false;
    try {
      vuexStore.commit(sectionsModuleKey + '/SET_SECTIONS', ourSections);
      commitOk = true;
    } catch(_ce) {
      try {
        vuexStore.commit(sectionsModuleKey + '/setSections', ourSections);
        commitOk = true;
      } catch(_ce2) {}
    }
    if (!commitOk) {
      modState.sections = ourSections;
    }
    diag4.commitOk = commitOk;

    /* Also patch rows/columns/elements for completeness */
    var rows     = pageData.rows     || {};
    var columns  = pageData.columns  || {};
    var elements = pageData.elements || {};
    var patched  = {};
    if ('rows'     in modState) { modState.rows     = rows;     patched.rows     = Object.keys(rows).length; }
    if ('columns'  in modState) { modState.columns  = columns;  patched.columns  = Object.keys(columns).length; }
    if ('elements' in modState) { modState.elements = elements; patched.elements = Object.keys(elements).length; }
    diag4.patched = patched;

    /* ── 4. Log available mutations ──────────────────────────────────────── */
    var mutKeys = Object.keys(vuexStore._mutations || {});
    diag4.mutKeySample = mutKeys.filter(function(k) {
      return /row|col|elem|section|page|node|builder/i.test(k);
    }).slice(0, 20);

    var after = Array.isArray(modState.sections) ? modState.sections.length : 0;
    diag4.result = 'vuex-found module=' + sectionsModuleKey + ' before=' + before + ' after=' + after;

    return JSON.stringify({ ok: true, method: 'vuex-direct', diag: { approach4: diag4 } });
  } catch(e) {
    diag4.result = 'threw: ' + String(e && e.message ? e.message : e).slice(0, 120);
    return JSON.stringify({ ok: false, method: 'vuex-direct', diag: { approach4: diag4 } });
  }
}

/* ─── _cf_approach5PiniaWithStoredSections ────────────────────────────────────
   A5: Reads window.__cfLastSectionsWithContext (stored by _cf_injectViaBuilderSave
   just after building the flat-elements array) and replaces the Pinia sections
   store directly. Runs in a separate chrome.scripting.executeScript call so it
   can be targeted at any frame (top or builder iframe). Returns a result string
   that background.js stores in r.diag.approach2.a5VueResult.                  */
function _cf_approach5PiniaWithStoredSections(sectionsJsonArg) {
  try {
    var sections = null;
    if (sectionsJsonArg && sectionsJsonArg !== "null") {
      try { sections = JSON.parse(sectionsJsonArg); } catch(_) { sections = null; }
    }
    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return "no-sections-arg";
    }
    var mountEl = document.querySelector("#__nuxt") || document.querySelector("[data-v-app]");
    var vueApp  = mountEl && mountEl.__vue_app__;
    if (!vueApp) return "no-vue-app";
    var pinia = vueApp.config && vueApp.config.globalProperties && vueApp.config.globalProperties.$pinia;
    if (!pinia || !pinia._s) return "no-pinia";
    var storeIds = [];
    var secStore = null;
    var secStoreId = null;
    pinia._s.forEach(function(store, id) {
      storeIds.push(id);
      var secs = store.sections !== undefined ? store.sections : (store.$state && store.$state.sections);
      if (Array.isArray(secs)) {
        secStore   = store;
        secStoreId = id;
      }
    });
    if (!secStore) return "no-store-with-sections storeIds=" + storeIds.join(",");
    var stateRef = secStore.sections !== undefined ? secStore : secStore.$state;
    var before   = stateRef.sections.length;
    stateRef.sections = sections;
    var after = stateRef.sections.length;
    return "found-store=" + secStoreId + " before=" + before + " after=" + after;
  } catch (e) {
    return "error: " + String(e && e.message ? e.message : e).slice(0, 100);
  }
}

/* ─── _cf_approach3PiniaInFrame ───────────────────────────────────────────────
   Self-contained Approach 3 execution — injected into the DETECTED BUILDER
   FRAME (top frame or builder iframe, as determined by the SW frame probe).
   Finds the Pinia instance, patches the page-data store, and triggers a native
   save. Returns a JSON-serialised result + diag.approach3 object.              */
async function _cf_approach3PiniaInFrame(builderId, locationId, pageData) {
  var diag3 = {
    piniaSource:    "frame-targeted",
    frameFound:     false,
    piniaFound:     false,
    storeCount:     0,
    storeIds:       [],
    candidates:     [],
    clipboardStores: [],
  };
  try {
    /* ── Find Pinia in THIS frame ─────────────────────────────────────────── */
    var pinia = null;
    try {
      var wp = window._pinia || window.pinia || window.__pinia || null;
      if (wp && wp._s instanceof Map) {
        pinia = wp;
        diag3.frameFound  = true;
        diag3.piniaFound  = true;
        diag3.piniaSource = "window-global";
      }
    } catch (_wp) {}

    if (!pinia) {
      var tryEls = [
        document.querySelector("#app"),
        document.documentElement,
      ].concat(Array.from(document.querySelectorAll("[data-v-app]")).slice(0, 3)).filter(Boolean);
      for (var _ti = 0; _ti < tryEls.length; _ti++) {
        var el = tryEls[_ti];
        var va = el.__vue_app__;
        if (!va) continue;
        diag3.frameFound = true;
        var provides = (va._context && va._context.provides) ? va._context.provides : {};
        var p = provides[Symbol.for("pinia")]
          || (Object.values(provides).find(function(v) { return v && v._s instanceof Map; }))
          || null;
        if (p && p._s instanceof Map) { pinia = p; diag3.piniaFound = true; break; }
      }
    }

    if (!pinia || !(pinia._s instanceof Map)) {
      diag3.result = "Pinia not found in frame";
      return JSON.stringify({ ok: false, diag: { approach3: diag3 } });
    }

    var storeIds = Array.from(pinia._s.keys());
    diag3.storeCount  = storeIds.length;
    diag3.storeIds    = storeIds.slice(0, 20);
    diag3.allStoreIds = storeIds.slice(0, 30);

    /* ── Probe clipboard stores ──────────────────────────────────────────── */
    var clipStoreDiag = [];
    pinia._s.forEach(function(store, storeId) {
      var state    = store.$state || {};
      var clipKeys = Object.keys(state).filter(function(k) { return /clipboard|copy|paste|buffer/i.test(k); });
      if (clipKeys.length === 0) return;
      var entry = { storeId: storeId, clipboardKeys: clipKeys, patched: false, pasteAttempted: false };
      try {
        var patch = {};
        for (var _cki = 0; _cki < clipKeys.length; _cki++) patch[clipKeys[_cki]] = pageData;
        store.$patch(patch);
        entry.patched = true;
        var _pas = ["paste", "pasteSection", "applyClipboard", "doPaste", "pasteElement"];
        for (var _pai = 0; _pai < _pas.length; _pai++) {
          var pa = _pas[_pai];
          if (typeof store[pa] === "function") {
            try { store[pa](); entry.pasteAttempted = pa; break; } catch(_) {}
          }
        }
      } catch (ce) { entry.error = String(ce).slice(0, 60); }
      clipStoreDiag.push(entry);
    });
    diag3.clipboardStores = clipStoreDiag;

    /* ── Identify candidate page-data stores ────────────────────────────── */
    var candidates = [];
    pinia._s.forEach(function(store, storeId) {
      var state = store.$state || {};
      var keys  = Object.keys(state);
      var hasSections = keys.indexOf("sections") !== -1;
      var hasRows     = keys.indexOf("rows")     !== -1;
      var hasElements = keys.indexOf("elements") !== -1;
      var hasColumns  = keys.indexOf("columns")  !== -1;
      var hasPageData = keys.indexOf("pageData") !== -1;
      var score = (hasSections ? 3 : 0) + (hasRows ? 2 : 0) + (hasElements ? 2 : 0)
                + (hasColumns ? 1 : 0) + (hasPageData ? 1 : 0);
      if (score > 0) candidates.push({ storeId: storeId, store: store, keys: keys, score: score, hasPageData: hasPageData, hasSections: hasSections });
    });
    candidates.sort(function(a, b) { return b.score - a.score; });
    diag3.candidates = candidates.map(function(c) { return { storeId: c.storeId, score: c.score }; }).slice(0, 10);

    if (candidates.length === 0) {
      diag3.result = "no store with GHL page structure found";
      return JSON.stringify({ ok: false, diag: { approach3: diag3 } });
    }

    /* ── Patch each candidate + try save actions ─────────────────────────── */
    var SAVE_ACTIONS = ["savePage", "savePageData", "save", "autoSave",
                        "updatePage", "saveCurrentPage", "persistPage"];
    var successResult = null;
    var candidateDiag = [];

    for (var _ci = 0; _ci < candidates.length; _ci++) {
      var cand = candidates[_ci];
      var storeId2 = cand.storeId;
      var store2   = cand.store;
      var keys2    = cand.keys;
      var hasPageData2  = cand.hasPageData;
      var hasSections2  = cand.hasSections;
      var cd = { storeId: storeId2, stateKeys: keys2.slice(0, 20), patched: false, savedVia: null, errors: [] };
      try {
        if (hasPageData2 && !hasSections2) {
          store2.$patch({ pageData: pageData });
          cd.patchShape = "nested-pageData";
        } else {
          store2.$patch(pageData);
          cd.patchShape = "root";
        }
        cd.patched = true;
      } catch (pe) {
        cd.patchError = String(pe).slice(0, 80);
        candidateDiag.push(cd);
        continue;
      }
      for (var _ai = 0; _ai < SAVE_ACTIONS.length; _ai++) {
        var action = SAVE_ACTIONS[_ai];
        if (typeof store2[action] === "function") {
          try {
            await store2[action]();
            cd.savedVia = action;
            break;
          } catch (se) {
            cd.errors.push(action + ":" + String(se).slice(0, 50));
          }
        }
      }
      candidateDiag.push(cd);
      if (cd.savedVia) {
        successResult = { storeId: storeId2, savedVia: cd.savedVia, patchShape: cd.patchShape };
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
    } else if (candidateDiag.some(function(c) { return c.patched; })) {
      var patchedStore = candidateDiag.find(function(c) { return c.patched; });
      diag3.result = "patched-no-save";
      return JSON.stringify({
        ok:      true,
        method:  "pinia-patched",
        storeId: patchedStore ? patchedStore.storeId : null,
        savedVia: null,
        diag:    { approach3: diag3 },
        warning: "Content injected into builder (visible now). Click Save in GHL to persist permanently.",
      });
    }

    diag3.result = "no candidate saved";
    return JSON.stringify({ ok: false, diag: { approach3: diag3 } });

  } catch (e) {
    diag3.result = "threw: " + String(e).slice(0, 180);
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
    var cacheCleared = 0;
    if (typeof caches !== "undefined") {
      try {
        var cacheNames = await caches.keys();
        for (var _cn = 0; _cn < cacheNames.length; _cn++) {
          var c    = await caches.open(cacheNames[_cn]);
          var keys = await c.keys();
          for (var _rq = 0; _rq < keys.length; _rq++) {
            if (keys[_rq].url.indexOf("firebasestorage.googleapis.com") !== -1) {
              await c.delete(keys[_rq]);
              cacheCleared++;
            }
          }
        }
      } catch(_) {}
    }

    /* ── Step 2: reload the builder ─────────────────────────────────────── */
    var iframe = document.querySelector('iframe[name="funnel-builder"]');
    if (!iframe) {
      window.location.reload();
      return JSON.stringify({ ok: true, method: "cache-bust+page-reload", cacheCleared: cacheCleared });
    }
    iframe.src = iframe.src;
    return JSON.stringify({ ok: true, method: "cache-bust+iframe-reload", cacheCleared: cacheCleared, src: iframe.src.slice(0, 80) });
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
  var diag = {};
  try {
    var appEl = document.querySelector("#app");
    var revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    if (!revex) {
      for (var ai of Object.values(window.app ?? {})) {
        var r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && typeof r.get === "function") { revex = r; break; }
      }
    }
    if (!revex) return JSON.stringify({ ok: false, error: "revex not found — builder must be fully loaded" });

    var metadata = null;
    try { var r = await revex.get(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`); metadata = r?.data ?? r ?? null; } catch (_) {}
    if (!metadata) { try { var r2 = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`); metadata = r2?.data ?? r2 ?? null; } catch (_) {} }
    var downloadUrl = metadata?.pageDataDownloadUrl ?? null;
    if (!downloadUrl) return JSON.stringify({ ok: false, error: "no downloadUrl in GHL metadata", diag });

    var fbMatch = downloadUrl.match(/firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?]+)/);
    if (!fbMatch) return JSON.stringify({ ok: false, error: "could not parse Firebase URL", diag });
    var bucket = decodeURIComponent(fbMatch[1]);
    diag.bucket = bucket.slice(0, 60);

    var idToken = null;
    try { if (typeof firebase !== "undefined" && firebase.apps?.length) { var u = firebase.auth().currentUser; if (u) idToken = await u.getIdToken(true); } } catch (_) {}
    if (!idToken) {
      try {
        for (var val of Object.values(window)) {
          if (!val || typeof val !== "object") continue;
          if (typeof val.auth === "function") { var a = val.auth(); if (a?.currentUser) { idToken = await a.currentUser.getIdToken(true); break; } }
        }
      } catch (_) {}
    }
    if (!idToken) {
      idToken = await new Promise(resolve => {
        try {
          var req = indexedDB.open("firebaseLocalStorageDb");
          req.onerror = () => resolve(null);
          req.onsuccess = evt => {
            var db = evt.target.result;
            if (!db.objectStoreNames.contains("firebaseLocalStorage")) { db.close(); resolve(null); return; }
            var getAll = db.transaction("firebaseLocalStorage","readonly").objectStore("firebaseLocalStorage").getAll();
            getAll.onerror   = () => { db.close(); resolve(null); };
            getAll.onsuccess = e2 => { db.close(); for (var rec of (e2.target.result ?? [])) { var t = rec?.value?.stsTokenManager?.accessToken; if (t) { resolve(t); return; } } resolve(null); };
          };
        } catch (_) { resolve(null); }
      });
    }
    if (!idToken) return JSON.stringify({ ok: false, error: "no auth token", diag });

    var readRes = await fetch(downloadUrl, { headers: { "Authorization": `Firebase ${idToken}` }, signal: AbortSignal.timeout(8000) });
    if (!readRes.ok) return JSON.stringify({ ok: false, error: `read failed HTTP ${readRes.status}`, diag });
    var fullData = await readRes.json();

    /* Build structural summary for popup display */
    var secs = Array.isArray(fullData.sections) ? fullData.sections : [];
    diag.topLevelKeys       = Object.keys(fullData);
    diag.sectionCount       = secs.length;
    diag.rowCount           = fullData.rows     ? Object.keys(fullData.rows).length     : 0;
    diag.colCount           = fullData.columns  ? Object.keys(fullData.columns).length  : 0;
    diag.elemCount          = fullData.elements ? Object.keys(fullData.elements).length : 0;
    diag.sectionElemCounts  = secs.map(s => Array.isArray(s.elements) ? s.elements.length : 0);
    diag.sectionMetaChildLengths = secs.map(s => Array.isArray(s.metaData?.child) ? s.metaData.child.length : 0);

    var sec0      = secs[0] ?? null;
    diag.sec0Keys   = sec0 ? Object.keys(sec0) : [];
    var sec0Elems = sec0 && Array.isArray(sec0.elements) ? sec0.elements : [];
    diag.sec0ElemCount      = sec0Elems.length;
    diag.sec0ElemFieldKeys  = sec0Elems.length > 0 ? [...new Set(sec0Elems.flatMap(e => Object.keys(e)))] : [];
    diag.sec0MetaChildLen   = Array.isArray(sec0?.metaData?.child) ? sec0.metaData.child.length : 0;

    var row0 = fullData.rows ? Object.values(fullData.rows)[0] : null;
    diag.row0Keys    = row0 ? Object.keys(row0).slice(0, 12)       : [];
    diag.row0MetaKeys= row0?.metaData ? Object.keys(row0.metaData).slice(0, 12) : [];

    var col0 = fullData.columns ? Object.values(fullData.columns)[0] : null;
    diag.col0Keys    = col0 ? Object.keys(col0).slice(0, 12)       : [];
    diag.col0MetaKeys= col0?.metaData ? Object.keys(col0.metaData).slice(0, 12) : [];

    var elem0 = fullData.elements ? Object.values(fullData.elements)[0] : null;
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
  var diag = {};
  try {
    var appEl = document.querySelector("#app");
    var revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    if (!revex) {
      for (var ai of Object.values(window.app ?? {})) {
        var r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && typeof r.get === "function") { revex = r; break; }
      }
    }
    if (!revex) return JSON.stringify({ ok: false, error: "revex not found", diag });

    var metadata = null;
    try { var r = await revex.get(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`); metadata = r?.data ?? r ?? null; } catch (_) {}
    if (!metadata) { try { var r2 = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`); metadata = r2?.data ?? r2 ?? null; } catch (_) {} }
    var downloadUrl = metadata?.pageDataDownloadUrl ?? null;
    diag.hasDownloadUrl = !!downloadUrl;
    if (!downloadUrl) return JSON.stringify({ ok: false, error: "no downloadUrl in GHL metadata", diag });

    var fbMatch = downloadUrl.match(/firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?]+)/);
    if (!fbMatch) return JSON.stringify({ ok: false, error: "could not parse Firebase URL", diag });
    var bucket = decodeURIComponent(fbMatch[1]);
    diag.bucket = bucket.slice(0, 60);

    var idToken = null;
    try { if (typeof firebase !== "undefined" && firebase.apps?.length) { var u = firebase.auth().currentUser; if (u) idToken = await u.getIdToken(true); } } catch (_) {}
    if (!idToken) {
      try {
        for (var val of Object.values(window)) {
          if (!val || typeof val !== "object") continue;
          if (typeof val.auth === "function") { var a = val.auth(); if (a?.currentUser) { idToken = await a.currentUser.getIdToken(true); break; } }
        }
      } catch (_) {}
    }
    if (!idToken) {
      idToken = await new Promise(resolve => {
        try {
          var req = indexedDB.open("firebaseLocalStorageDb");
          req.onerror = () => resolve(null);
          req.onsuccess = evt => {
            var db = evt.target.result;
            if (!db.objectStoreNames.contains("firebaseLocalStorage")) { db.close(); resolve(null); return; }
            var getAll = db.transaction("firebaseLocalStorage","readonly").objectStore("firebaseLocalStorage").getAll();
            getAll.onerror   = () => { db.close(); resolve(null); };
            getAll.onsuccess = e2 => { db.close(); for (var rec of (e2.target.result ?? [])) { var t = rec?.value?.stsTokenManager?.accessToken; if (t) { resolve(t); return; } } resolve(null); };
          };
        } catch (_) { resolve(null); }
      });
    }
    if (!idToken) return JSON.stringify({ ok: false, error: "no auth token", diag });

    var readRes = await fetch(downloadUrl, { headers: { "Authorization": `Firebase ${idToken}` }, signal: AbortSignal.timeout(8000) });
    if (!readRes.ok) return JSON.stringify({ ok: false, error: `read failed HTTP ${readRes.status}`, diag });
    var existing = await readRes.json();
    diag.readOk = true;

    diag.topLevelKeys  = Object.keys(existing).slice(0, 20);
    diag.sectionCount  = Array.isArray(existing.sections) ? existing.sections.length : 0;
    diag.rowCount      = existing.rows     ? Object.keys(existing.rows).length     : 0;
    diag.colCount      = existing.columns  ? Object.keys(existing.columns).length  : 0;
    diag.elemCount     = existing.elements ? Object.keys(existing.elements).length : 0;

    var sec0 = Array.isArray(existing.sections) ? existing.sections[0] : null;
    diag.sec0Keys        = sec0 ? Object.keys(sec0).slice(0, 14) : "none";
    diag.sec0HasElements = sec0 ? ("elements" in sec0) : null;
    var _sArr = sec0 && Array.isArray(sec0.elements) ? sec0.elements : null;
    diag.sec0ElementsLen = _sArr ? _sArr.length : (sec0 && "elements" in sec0 ? "non-array" : "key-missing");
    var _s0e0 = _sArr?.[0] ?? null;
    diag.sec0El0Keys        = _s0e0 ? Object.keys(_s0e0).slice(0, 10) : (_sArr?.length === 0 ? "empty-array" : "n/a");
    diag.sec0El0HasMeta     = _s0e0 ? ("metaData" in _s0e0) : false;
    diag.sec0El0HasElements = _s0e0 ? ("elements" in _s0e0) : false;

    var row0 = existing.rows ? Object.values(existing.rows)[0] : null;
    diag.row0Keys        = row0 ? Object.keys(row0).slice(0, 10)    : "none";
    diag.row0HasElements = row0 ? ("elements" in row0)               : false;
    diag.row0MetaKeys    = row0?.metaData ? Object.keys(row0.metaData).slice(0, 10) : "none";

    var col0 = existing.columns ? Object.values(existing.columns)[0] : null;
    diag.col0Keys        = col0 ? Object.keys(col0).slice(0, 10)    : "none";
    diag.col0HasElements = col0 ? ("elements" in col0)               : false;

    var elem0 = existing.elements ? Object.values(existing.elements)[0] : null;
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
  var diag = {};
  try {
    /* 1. Find revexBackendService */
    var appEl = document.querySelector("#app");
    var revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    if (!revex) {
      for (var ai of Object.values(window.app ?? {})) {
        var r = ai?.appContext?.config?.globalProperties?.revexBackendService;
        if (r && typeof r.get === "function") { revex = r; break; }
      }
    }
    if (!revex) return JSON.stringify({ ok: false, error: "revex not found — builder must be fully loaded", diag });

    /* 2. Fetch GHL page metadata → downloadUrl */
    var metadata = null;
    try {
      var r = await revex.get(`https://backend.leadconnectorhq.com/funnels/funnel/page/${builderId}`);
      metadata = r?.data ?? r ?? null;
    } catch (_) {
      try {
        var r2 = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
        metadata = r2?.data ?? r2 ?? null;
      } catch (_2) {}
    }
    var downloadUrl = metadata?.pageDataDownloadUrl ?? null;
    diag.metaOk       = !!metadata;
    diag.hasDownloadUrl = !!downloadUrl;
    if (!downloadUrl) return JSON.stringify({ ok: false, error: "no downloadUrl in GHL metadata", diag });

    /* 3. Parse Firebase bucket + objectPath */
    var fbMatch = downloadUrl.match(
      /firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?]+)/
    );
    if (!fbMatch) return JSON.stringify({ ok: false, error: "could not parse Firebase URL", diag });
    var bucket     = decodeURIComponent(fbMatch[1]);
    var objectPath = decodeURIComponent(fbMatch[2]);
    diag.bucket = bucket.slice(0, 60);

    /* 4. Get Firebase auth token (same v8/IDB logic as Approach 2) */
    var idToken = null;
    var tokenDiag = [];
    try {
      if (typeof firebase !== "undefined" && firebase.apps?.length) {
        var user = firebase.auth().currentUser;
        if (user) { idToken = await user.getIdToken(true); tokenDiag.push("v8"); }
      }
    } catch (te1) { tokenDiag.push(`v8-err:${String(te1).slice(0, 30)}`); }
    if (!idToken) {
      try {
        for (var val of Object.values(window)) {
          if (!val || typeof val !== "object") continue;
          if (typeof val.auth === "function") {
            var auth = val.auth();
            if (auth?.currentUser) { idToken = await auth.currentUser.getIdToken(true); tokenDiag.push("win-prop"); break; }
          }
        }
      } catch (te2) { tokenDiag.push(`win-err:${String(te2).slice(0, 30)}`); }
    }
    if (!idToken) {
      try {
        idToken = await new Promise((resolve) => {
          var req = indexedDB.open("firebaseLocalStorageDb");
          req.onerror = () => resolve(null);
          req.onsuccess = (evt) => {
            var db = evt.target.result;
            if (!db.objectStoreNames.contains("firebaseLocalStorage")) { db.close(); resolve(null); return; }
            var tx    = db.transaction("firebaseLocalStorage", "readonly");
            var store = tx.objectStore("firebaseLocalStorage");
            var getAll = store.getAll();
            getAll.onerror   = () => { db.close(); resolve(null); };
            getAll.onsuccess = (e2) => {
              db.close();
              for (var rec of (e2.target.result ?? [])) {
                var token = rec?.value?.stsTokenManager?.accessToken;
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
    var readRes = await fetch(downloadUrl, {
      headers: { "Authorization": `Firebase ${idToken}` },
      signal:  AbortSignal.timeout(8000),
    });
    if (!readRes.ok) return JSON.stringify({ ok: false, error: `read failed HTTP ${readRes.status}`, diag });
    var existing = await readRes.json();
    diag.readOk = true;

    /* 6. DEEP structural probes — capture GHL's own exact schema ─────────── */
    diag.topLevelKeys   = Object.keys(existing).slice(0, 20);
    diag.payloadId      = existing.id ?? "missing";
    diag.sectionCount   = Array.isArray(existing.sections) ? existing.sections.length : "not-array";
    diag.rowCount       = existing.rows     ? Object.keys(existing.rows).length     : 0;
    diag.colCount       = existing.columns  ? Object.keys(existing.columns).length  : 0;
    diag.elemCount      = existing.elements ? Object.keys(existing.elements).length : 0;

    /* First section */
    var firstSec = Array.isArray(existing.sections) && existing.sections[0];
    diag.firstSecTopKeys      = firstSec ? Object.keys(firstSec).slice(0, 14) : "none";
    diag.firstSecMetaKeys     = firstSec?.metaData ? Object.keys(firstSec.metaData).slice(0, 14) : "none";
    /* KEY diagnostic: does a REAL GHL section in Firebase carry an `elements` array?
     * true  → sections store pre-built tree (elements arrays are expected in Firebase)
     * false → sections store only metaData + child refs (GHL builds tree from flat dicts) */
    diag.firstSecHasElements  = firstSec ? ("elements" in firstSec) : null;
    /* v2.34.0: capture native sec0.metaData.child — is it empty or populated?
     * If empty [], it confirms GHL uses elements array only and child refs are not needed.
     * If populated, it tells us what IDs are expected (even though rows dict is empty).  */
    var _sec0Child = Array.isArray(firstSec?.metaData?.child) ? firstSec.metaData.child : null;
    diag.sec0MetaChildLen    = _sec0Child !== null ? _sec0Child.length : "no-array";
    diag.sec0MetaChildSample = _sec0Child ? _sec0Child.slice(0, 2) : "none";

    /* Deep probe: what does section[0].elements[0] actually look like?
     * Critical for deciding whether elements are shallow rows, deep trees, or IDs.
     * Only meaningful on pages with real content (non-empty sections).             */
    var _sec0ElArr = firstSec && Array.isArray(firstSec.elements) ? firstSec.elements : null;
    var _sec0El0   = _sec0ElArr?.[0] ?? null;
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
    var firstRow = existing.rows ? Object.values(existing.rows)[0] : null;
    diag.firstRowTopKeys      = firstRow ? Object.keys(firstRow).slice(0, 14)                         : "none";
    diag.firstRowMetaKeys     = firstRow?.metaData ? Object.keys(firstRow.metaData).slice(0, 14)     : "none";
    diag.firstRowHasElements  = firstRow ? ("elements" in firstRow)                                   : false;

    /* First column — CRITICAL: does GHL put `elements` at top level on cols? */
    var firstCol = existing.columns ? Object.values(existing.columns)[0] : null;
    diag.firstColTopKeys          = firstCol ? Object.keys(firstCol).slice(0, 14)                       : "none";
    diag.firstColMetaKeys         = firstCol?.metaData ? Object.keys(firstCol.metaData).slice(0, 14)   : "none";
    diag.firstColHasElements      = firstCol ? ("elements" in firstCol)                                 : false;
    diag.firstColElemCopyKeys     = firstCol?.metaData?.element
      ? Object.keys(firstCol.metaData.element).slice(0, 14) : "none";

    /* First element — CRITICAL: does GHL's own element have top-level `elements`? */
    var firstElem = existing.elements ? Object.values(existing.elements)[0] : null;
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
      var pubBefore = await fetch(downloadUrl, {
        signal: AbortSignal.timeout(4000),
      });
      diag.publicReadBefore = { status: pubBefore.status, ok: pubBefore.ok };
    } catch (_pb) { diag.publicReadBefore = { error: "timeout-or-cors" }; }

    /* 7. Write the EXACT SAME DATA BACK — no modifications whatsoever ──────── */
    /* encodedPath: single encodeURIComponent of full path → uses %2F between
     * path components, which is what Firebase Storage REST API requires.
     * NOTE: The old approach of .split("/").map(encodeURIComponent).join("/")
     * was WRONG — it kept literal "/" separators → Firebase returned 400.     */
    var encodedPath = encodeURIComponent(objectPath);
    var uploadEp =
      `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}` +
      `/o?uploadType=media&name=${encodeURIComponent(objectPath)}`;
    var writeRes = await fetch(uploadEp, {
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
      var errText = await writeRes.text().catch(() => "");
      diag.writeError = errText.slice(0, 100);
      return JSON.stringify({ ok: false, error: `write failed HTTP ${writeRes.status}`, diag });
    }

    /* 7b. Parse upload response → check if new download token was generated */
    var newFirebaseToken = null;
    try {
      var uploadRespJson = await writeRes.clone().json().catch(() => ({}));
      newFirebaseToken     = uploadRespJson.downloadTokens ?? null;
      var oldTokenCheck  = (downloadUrl.match(/[?&]token=([^&]+)/) ?? [])[1] ?? "";
      diag.oldToken     = oldTokenCheck ? oldTokenCheck.slice(0, 20) + "…" : "none-in-url";
      diag.newToken     = newFirebaseToken ? newFirebaseToken.slice(0, 20) + "…" : "none-in-resp";
      diag.tokenChanged = newFirebaseToken ? (newFirebaseToken !== oldTokenCheck) : false;
    } catch (_te) { diag.newToken = "parse-err"; }

    /* 7c. PATCH Firebase metadata to restore original download token ──────────
     * v2.26.0 FIX: After the upload, Firebase has a NEW downloadToken. GHL's
     * cached pageDataDownloadUrl still has the OLD token → reads return 400.
     * We PATCH the object metadata to restore the OLD token so GHL's cached
     * URL stays valid — no GHL backend update needed.                          */
    var oldTokenForPatch = (downloadUrl.match(/[?&]token=([^&]+)/) ?? [])[1] ?? "";
    var metaEpR =
      `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o/${encodedPath}`;
    var patchSucceededR = false;
    if (oldTokenForPatch) {
      /* Format 1: nested metadata field — verify returned token matches */
      try {
        var pr1 = await fetch(metaEpR, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Firebase ${idToken}` },
          body:    JSON.stringify({ metadata: { downloadTokens: oldTokenForPatch } }),
        });
        diag.patchStatus1 = pr1.status;
        if (pr1.ok) {
          var pr1Body        = await pr1.json().catch(() => ({}));
          var returnedTokenR = pr1Body.metadata?.downloadTokens ?? pr1Body.downloadTokens ?? null;
          var tokenVerifiedR = returnedTokenR === oldTokenForPatch;
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
          var pr2 = await fetch(metaEpR, {
            method:  "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Firebase ${idToken}` },
            body:    JSON.stringify({ downloadTokens: oldTokenForPatch }),
          });
          diag.patchStatus2 = pr2.status;
          if (pr2.ok) {
            var pr2Body         = await pr2.json().catch(() => ({}));
            var returnedToken2R = pr2Body.metadata?.downloadTokens ?? pr2Body.downloadTokens ?? null;
            var tokenVerified2R = returnedToken2R === oldTokenForPatch;
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
          var funnelIdFromPath = objectPath.split("/")[1] ?? "";
          var newPublicUrl = downloadUrl.replace(/\?.*$/, "") + `?alt=media&token=${newFirebaseToken}`;
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
      var pubAfter = await fetch(downloadUrl, { signal: AbortSignal.timeout(4000) });
      diag.publicReadAfterPatch = { status: pubAfter.status, ok: pubAfter.ok };
    } catch (_pa) { diag.publicReadAfterPatch = { error: "timeout-or-cors" }; }

    /* 8. Verify auth-read after write */
    await new Promise(r => setTimeout(r, 600));
    var vrRes = await fetch(downloadUrl, {
      cache:   "no-store",
      headers: { "Authorization": `Firebase ${idToken}` },
      signal:  AbortSignal.timeout(5000),
    });
    diag.verifyStatus = vrRes.status;
    if (vrRes.ok) {
      var vd = await vrRes.json();
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
  var type = msg.type ?? msg.action;

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
        var tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        // Strategy 1: Nuxt / window globals extraction (works on any GHL page)
        var info = {};
        try {
          var res = await chrome.scripting.executeScript({
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
          var tab = await chrome.tabs.get(tabId);
          var url = tab.url ?? "";
          var m   = url.match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
          if (m) {
            var [, locationId, , builderId] = m;
            try {
              var res2 = await chrome.scripting.executeScript({
                target: { tabId, allFrames: false },
                world:  "MAIN",
                func:   _cf_getBuilderInfo,
                args:   [builderId],
              });
              var info2 = JSON.parse(res2?.[0]?.result ?? "{}");
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
          var record = {
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
            var tab2 = await chrome.tabs.get(tabId);
            var bm   = (tab2.url ?? "").match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
            if (bm) {
              var [, , , builderId] = bm;
              var pdRes = await chrome.scripting.executeScript({
                target: { tabId, allFrames: false },
                world:  "MAIN",
                func:   _cf_fetchFullPageData,
                args:   [builderId],
              });
              var pdResult = JSON.parse(pdRes?.[0]?.result ?? "{}");
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
              var bm2 = (await chrome.tabs.get(tabId).catch(() => ({ url: "" }))).url
                .match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
              if (bm2) {
                var [, , , builderId2] = bm2;
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
   * Uses revexBackendService.post('https://backend.leadconnectorhq.com/funnels/funnel/clone-funnel-step/').
   * The active tab MUST be app.gohighlevel.com/.../page-builder/... OR .../funnel-builder/...
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_PASTE_PAGE") {
    (async () => {
      try {
        // 1. Read what was copied
        var stored = await chrome.storage.session.get("cf_copied_page");
        var src    = stored.cf_copied_page;

        // ── Helper: run builder injection on the active GHL builder tab ──
        var doAIInject = async (pageData, debugLabel) => {
          /* Use sender.tab.id (the tab that clicked the FAB) — more reliable
             than chrome.tabs.query which can return the wrong window/tab. */
          var tabId2 = sender.tab?.id ?? msg.tabId
            ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
          if (!tabId2) { sendResponse({ ok: false, error: "Could not identify the GHL builder tab. Make sure you clicked the orange CF button inside the GHL builder." }); return; }
          var tab2 = await chrome.tabs.get(tabId2);
          var m2   = (tab2.url ?? "").match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
          if (!m2) {
            sendResponse({ ok: false, error: `This tab is not a GHL builder page (URL: ${(tab2.url ?? "").slice(0, 80)}). Open a funnel page in the GHL builder, then click the orange CF button.` });
            return;
          }
          var [, locId2, , builderId2] = m2;
          console.log("[CF] CF_PASTE_PAGE:", debugLabel, "→ builder", builderId2);
          /* ── Step A: Probe all frames to find which one has Pinia ──────── */
          var iframeFrameId2 = 0;
          try {
            var probeRes2 = await chrome.scripting.executeScript({
              target: { tabId: tabId2, allFrames: true },
              world:  "MAIN",
              func:   _cf_probePinia,
            });
            var builderFrame2 = probeRes2.find(r2 => r2.result === true && r2.frameId !== 0)
              ?? probeRes2.find(r2 => r2.result === true);
            if (builderFrame2) iframeFrameId2 = builderFrame2.frameId ?? 0;
          } catch (_probeErr2) {}

          /* ── Step B: Run approaches 0/1/2/2B in top frame ──────────── */
          var { cf_cached_bucket: cachedBkt = null } = await chrome.storage.local.get("cf_cached_bucket");
          var r = {};
          try {
            var res2 = await chrome.scripting.executeScript({
              target: { tabId: tabId2, allFrames: false },
              world:  "MAIN",
              func:   _cf_injectViaBuilderSave,
              args:   [builderId2, locId2, pageData, cachedBkt],
            });
            r = JSON.parse(res2?.[0]?.result ?? "{}");
            /* v2.49.0: If clone-first succeeded, navigate to the new page URL */
            if (r && r.diag && r.diag.approach2 && r.diag.approach2.navigatedTo) {
              chrome.tabs.update(tabId2, { url: r.diag.approach2.navigatedTo });
            }
          } catch(e) { r = { ok: false, error: `scripting failed: ${String(e).slice(0, 80)}` }; }

          /* ── Step C: Run Approach 3 (Pinia patch) in detected frame — ALWAYS ─ */
          try {
            var a3Script2Promise = chrome.scripting.executeScript({
              target: { tabId: tabId2, frameIds: [iframeFrameId2] },
              world:  "MAIN",
              func:   _cf_approach3PiniaInFrame,
              args:   [builderId2, locId2, pageData],
            });
            var a3Timeout2Promise = new Promise(function(resolve) {
              setTimeout(function() { resolve(null); }, 3000);
            });
            var a3Race2Result = await Promise.race([a3Script2Promise, a3Timeout2Promise]);
            if (!r.diag) r.diag = {};
            if (a3Race2Result === null) {
              r.diag.approach3 = { ...(r.diag.approach3 ?? {}), iframeFrameId: iframeFrameId2, status: "timeout" };
            } else {
              var a3b = JSON.parse(a3Race2Result?.[0]?.result ?? "{}");
              r.diag.approach3 = { ...(a3b.diag?.approach3 ?? {}), iframeFrameId: iframeFrameId2 };
              var a2Wrote2 = r.ok && (r.method ?? "").includes("firebase");
              if (a3b.ok) {
                var a3Base2 = a3b.method ?? "pinia";
                if (a2Wrote2) {
                  r.method = a3Base2 === "pinia-patched" ? "firebase+pinia-patched" : "firebase+pinia";
                } else if (!r.ok) {
                  r.ok = true; r.method = a3Base2;
                  r.storeId = a3b.storeId; r.savedVia = a3b.savedVia; r.warning = a3b.warning;
                }
                delete r._a3pending;
              }
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
            var a4Res2 = await chrome.scripting.executeScript({
              target: { tabId: tabId2, frameIds: [iframeFrameId2] },
              world:  "MAIN",
              func:   _cf_approach4VuexInFrame,
              args:   [builderId2, locId2, pageData],
            });
            var a4b = JSON.parse(a4Res2?.[0]?.result ?? "{}");
            if (!r.diag) r.diag = {};
            r.diag.approach4 = { ...(a4b.diag?.approach4 ?? {}), iframeFrameId: iframeFrameId2 };
            if (a4b.ok) {
              var a2Wrote2 = r.ok && (r.method ?? "").includes("firebase");
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

          /* ── Step E: A5 — Vue/Pinia mutation using built sectionsWithContext ─── *
           * Step 1: Read window.__cfLastSectionsWithContext from the TOP frame    *
           *   (where _cf_injectViaBuilderSave stored it).                        *
           * Step 2: Pass the sections JSON as an arg to _cf_approach5Pinia in    *
           *   the BUILDER frame (iframeFrameId2). This avoids the top/iframe    *
           *   window isolation problem: sections cross the frame boundary via    *
           *   args, not window globals.                                           *
           * Wrapped in callback-style Promise per spec requirement.              */
          try {
            /* Step E1: Read stored sections from top frame */
            var a5SectionsJson = await new Promise((resolve) => {
              chrome.scripting.executeScript(
                {
                  target: { tabId: tabId2, frameIds: [0] },
                  world:  "MAIN",
                  func:   function() {
                    try {
                      var s = window.__cfLastSectionsWithContext;
                      return s && Array.isArray(s) && s.length > 0 ? JSON.stringify(s) : null;
                    } catch(_) { return null; }
                  },
                },
                function(results) {
                  resolve((results && results[0] && results[0].result) ? results[0].result : null);
                }
              );
            });

            /* Step E2: Inject sections into builder frame Pinia store */
            var a5FrameIds = iframeFrameId2 !== 0 ? [iframeFrameId2] : [0];
            var a5Result = await new Promise((resolve) => {
              chrome.scripting.executeScript(
                {
                  target: { tabId: tabId2, frameIds: a5FrameIds },
                  world:  "MAIN",
                  func:   _cf_approach5PiniaWithStoredSections,
                  args:   [a5SectionsJson ?? "null"],
                },
                function(results) {
                  resolve((results && results[0]) ? (results[0].result ?? "no-result") : "no-result");
                }
              );
            });

            if (!r.diag) r.diag = {};
            if (!r.diag.approach2) r.diag.approach2 = {};
            r.diag.approach2.a5VueResult    = a5Result;
            r.diag.approach2.a5FrameId      = iframeFrameId2;
            r.diag.approach2.a5SectionsRead = a5SectionsJson ? "ok" : "null";
            if (typeof a5Result === "string" && a5Result.startsWith("found-store=")
                && r.ok && (r.method ?? "").includes("firebase")) {
              r.method = (r.method ?? "firebase") + "+pinia-a5";
            }
          } catch (a5Err2) {
            if (!r.diag) r.diag = {};
            if (!r.diag.approach2) r.diag.approach2 = {};
            r.diag.approach2.a5VueResult = "scripting-err: " + String(a5Err2).slice(0, 80);
            r.diag.approach2.a5FrameId   = iframeFrameId2;
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
            var method = r.method ?? "injected";
            var toast = r.warning
              ? `Content injected (${method}) — ${r.warning}. Hard-reload the builder tab with F5 (NOT Ctrl+Shift+R) to see your content.`
              : `Content injected via ${method}. Hard-reload the builder tab with F5 (NOT Ctrl+Shift+R) to see your AI content.`;
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
          var lsData = await chrome.storage.local.get("cfReady");
          var ready  = lsData.cfReady;
          if (ready?.pageData) {
            await doAIInject(ready.pageData, "cfReady-fallback");
            return;
          }
          sendResponse({ ok: false, error: "Nothing copied yet — open the app, click 'Clone to GHL' on a funnel page, then try again" });
          return;
        }

        // ── Route C: Real GHL clone (clone-funnel-step) ───────────────────

        // 2. Get the active tab (must be GHL builder)
        var tabId = sender.tab?.id ?? msg.tabId
          ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        var tab = await chrome.tabs.get(tabId);
        var url = tab.url ?? "";
        var m   = url.match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: `This tab is not a GHL builder page (URL: ${url.slice(0, 80)}). Open a funnel page in the GHL builder, then try again.` });
          return;
        }
        var [, locationId, , builderId] = m;

        // 3. Get destination funnelId + stepId via revex
        var destInfo = {};
        try {
          var res = await chrome.scripting.executeScript({
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
        var req = {
          funnelId:   destInfo.funnelId,
          pageId:     destInfo.pageId || builderId,
          locationId: destInfo.locationId || locationId,
        };

        console.log("[CF] CF_PASTE_PAGE: cloning into funnelId=" + req.funnelId + " pageId=" + req.pageId);

        var cloneResult = {};
        try {
          var res = await chrome.scripting.executeScript({
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
        var tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        var tab = await chrome.tabs.get(tabId);
        var m   = (tab.url ?? "").match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: `Not a GHL builder tab: ${(tab.url ?? "").slice(0, 80)}` });
          return;
        }
        var [, , , builderId] = m;

        var res = await chrome.scripting.executeScript({
          target: { tabId, allFrames: false },
          world:  "MAIN",
          func:   _cf_roundtripFirebaseWrite,
          args:   [builderId],
        });
        var result = JSON.parse(res?.[0]?.result ?? "{}");
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
        var tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        var tab = await chrome.tabs.get(tabId);
        var m   = (tab.url ?? "").match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: `Not a GHL builder tab: ${(tab.url ?? "").slice(0, 80)}` });
          return;
        }
        var [, , , builderId] = m;

        /* Read GHL native schema from Firebase (no write) */
        var execRes = await chrome.scripting.executeScript({
          target: { tabId, allFrames: false },
          world:  "MAIN",
          func:   _cf_readFirebaseSchema,
          args:   [builderId],
        });
        var nativeResult = JSON.parse(execRes?.[0]?.result ?? "{}");

        /* Simulate our inject payload using the EXACT same transformation pipeline
         * as the real CF_INJECT_AI_PAGE handler. Inline flattenForFirebase and sectionsWithContext
         * construction so the diff reflects what we actually write to Firebase.           */
        var stored = await chrome.storage.local.get(["cfReady"]);
        var pd     = stored?.cfReady?.pageData ?? null;

        var injectSim = null;
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
          var wrappedRows = Object.fromEntries(
            Object.entries(pd.rows    ?? {}).map(([k, v]) => [k, _diff_flattenForFirebase(k, v)])
          );
          var wrappedCols = Object.fromEntries(
            Object.entries(pd.columns ?? {}).map(([k, v]) => [k, _diff_flattenForFirebase(k, v)])
          );
          var wrappedEls = Object.fromEntries(
            Object.entries(pd.elements ?? {}).map(([k, v]) => [k, _diff_flattenForFirebase(k, v)])
          );

          /* ── Same sectionsWithContext as inject pipeline (v2.38.0 full flat tree + element field) ── */
          var sectionsWithContext = (pd.sections ?? []).map((sec, i) => {
            var childRowIds = Array.isArray(sec.metaData?.child) ? sec.metaData.child : [];
            var flatElements = [];
            for (var rowId of childRowIds) {
              var row = wrappedRows[rowId];
              if (!row) continue;
              flatElements.push(row);
              var colIds = Array.isArray(row.child) ? row.child : [];
              for (var colId of colIds) {
                var col = wrappedCols[colId];
                if (!col) continue;
                flatElements.push(col);
                var elemIds = Array.isArray(col.child) ? col.child : [];
                for (var elemId of elemIds) {
                  var elem = wrappedEls[elemId];
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
            };
          });

          /* ── Build the schema summary from real pipeline output ── */
          var sec0        = sectionsWithContext[0] ?? null;
          var shallowEls  = sec0?.elements ?? [];
          var row0        = Object.values(wrappedRows)[0] ?? null;
          var col0        = Object.values(wrappedCols)[0] ?? null;

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
        var s     = await chrome.storage.local.get(["cfReady", "cfProject"]);
        var   ready = s.cfReady;
        if (!ready?.pageData) {
          sendResponse({ ok: false, error: "No AI page loaded — open the extension popup, pick a page from the AI library and click Load, then try again." });
          return;
        }

        // 2. Get the active tab (must be GHL builder)
        var tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        var tab = await chrome.tabs.get(tabId);
        var url = tab.url ?? "";
        var m   = url.match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: `This tab is not a GHL builder page (URL: ${url.slice(0, 80)}). Open a funnel page in the GHL builder, then try again.` });
          return;
        }
        var [, locationId, , builderId] = m;

        // 2b. Re-fetch fresh pageData from the server (avoids stale cached data)
        //     Uses the projectId + page stored in cfReady so we always inject latest AI output.
        if (ready.projectId && ready.page) {
          try {
            var apiOrigin = ready.appUrl ?? s.cfProject?.apiOrigin ?? "https://challenge-funnel.replit.app";
            var freshResp = await fetch(
              `${apiOrigin}/api/highlevel/page-data?projectId=${encodeURIComponent(ready.projectId)}&page=${encodeURIComponent(ready.page)}`
            );
            if (freshResp.ok) {
              var freshJson = await freshResp.json();
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
        var iframeFrameId = 0;
        try {
          var probeRes = await chrome.scripting.executeScript({
            target: { tabId, allFrames: true },
            world:  "MAIN",
            func:   _cf_probePinia,
          });
          /* Prefer a non-zero frameId (builder iframe) over the top frame (0) */
          var builderFrame = probeRes.find(r => r.result === true && r.frameId !== 0)
            ?? probeRes.find(r => r.result === true);
          if (builderFrame) iframeFrameId = builderFrame.frameId ?? 0;
        } catch (_probeErr) {}

        /* ── Step B: Run approaches 0/1/2 in top frame ───────────────────── */
        var { cf_cached_bucket: aiBkt = null } = await chrome.storage.local.get("cf_cached_bucket");
        var injectResult = {};
        try {
          var res = await chrome.scripting.executeScript({
            target: { tabId, allFrames: false },
            world:  "MAIN",
            func:   _cf_injectViaBuilderSave,
            args:   [builderId, locationId, ready.pageData, aiBkt],
          });
          injectResult = JSON.parse(res?.[0]?.result ?? "{}");
          /* v2.49.0: If clone-first succeeded, navigate to the new page URL */
          if (injectResult && injectResult.diag && injectResult.diag.approach2 && injectResult.diag.approach2.navigatedTo) {
            chrome.tabs.update(tabId, { url: injectResult.diag.approach2.navigatedTo });
          }
        } catch(e) {
          injectResult = { ok: false, error: `scripting failed: ${String(e).slice(0, 80)}` };
        }

        /* ── Step C: Run Approach 3 (Pinia patch) in detected frame — ALWAYS ── *
         * Must run even when A2 succeeded so method can become firebase+pinia.  *
         * 3-second timeout prevents hanging when the builder frame is slow.     */
        try {
          var a3ScriptPromise = chrome.scripting.executeScript({
            target: { tabId, frameIds: [iframeFrameId] },
            world:  "MAIN",
            func:   _cf_approach3PiniaInFrame,
            args:   [builderId, locationId, ready.pageData],
          });
          var a3TimeoutPromise = new Promise(function(resolve) {
            setTimeout(function() { resolve(null); }, 3000);
          });
          var a3RaceResult = await Promise.race([a3ScriptPromise, a3TimeoutPromise]);
          if (!injectResult.diag) injectResult.diag = {};
          if (a3RaceResult === null) {
            /* Timeout — A3 did not respond within 3 s */
            injectResult.diag.approach3 = {
              ...(injectResult.diag.approach3 ?? {}),
              iframeFrameId,
              status: "timeout",
            };
          } else {
            var a3 = JSON.parse(a3RaceResult?.[0]?.result ?? "{}");
            /* Merge A3 diag (with iframeFrameId) */
            injectResult.diag.approach3 = { ...(a3.diag?.approach3 ?? {}), iframeFrameId };
            /* Compose combined method from A2 + A3 outcomes */
            var a2Wrote = injectResult.ok && (injectResult.method ?? "").includes("firebase");
            if (a3.ok) {
              var a3Base = a3.method ?? "pinia"; /* "pinia" or "pinia-patched" */
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
          var a4Res = await chrome.scripting.executeScript({
            target: { tabId, frameIds: [iframeFrameId] },
            world:  "MAIN",
            func:   _cf_approach4VuexInFrame,
            args:   [builderId, locationId, ready.pageData],
          });
          var a4 = JSON.parse(a4Res?.[0]?.result ?? "{}");
          if (!injectResult.diag) injectResult.diag = {};
          injectResult.diag.approach4 = { ...(a4.diag?.approach4 ?? {}), iframeFrameId };
          if (a4.ok) {
            var a2Wrote = injectResult.ok && (injectResult.method ?? "").includes("firebase");
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
          var method = injectResult.method ?? "injected";
          var toast  = injectResult.warning
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
        var pageUrl = msg.url;
        if (!pageUrl || typeof pageUrl !== "string") {
          sendResponse({ ok: false, error: "No URL provided" });
          return;
        }

        // 1. Fetch the page HTML
        var html;
        try {
          var res = await fetch(pageUrl, {
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
        var rawMatch = html.match(/"pageDataDownloadUrl"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (!rawMatch) {
          sendResponse({
            ok: false,
            error: "Could not find page data in this URL. Make sure it is a published GHL funnel/website page with content. (Tip: the page must be published, not just saved as draft.)",
          });
          return;
        }

        // Unescape the JSON string value to get the real URL
        var downloadUrl;
        try {
          downloadUrl = JSON.parse('"' + rawMatch[1] + '"');
        } catch {
          downloadUrl = rawMatch[1].replace(/\\/g, "");
        }

        // Also try to extract page name from the HTML
        var nameMatch = html.match(/"name"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        var pageName = "";
        try {
          pageName = nameMatch ? JSON.parse('"' + nameMatch[1] + '"') : "";
        } catch { pageName = nameMatch?.[1] ?? ""; }

        // 3. Fetch the actual element tree from Firebase Storage
        var elementTree;
        try {
          var fbRes = await fetch(downloadUrl);
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
    var senderTabId = sender?.tab?.id;
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
    var senderTabId = sender?.tab?.id;
    if (!senderTabId) return false;
    var { status, url, body } = msg;
    /* Stored per-tab; no cf_sniff_tab gate needed — sender.tab.id already
     * ensures this is from the correct GHL tab. A 60s cleanup is scheduled
     * by the CF_OOFF_ERROR handler; add a fallback here too.               */
    var storeKey = `cf_ghl_err_${senderTabId}`;
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
        var tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }

        var tab = await chrome.tabs.get(tabId);
        var m   = (tab.url ?? "").match(/\/location\/([^/]+)\/(page-builder|funnel-builder)\/([^/]+)/);
        if (!m) {
          sendResponse({ ok: false, error: `Not a GHL builder tab: ${(tab.url ?? "").slice(0, 80)}` });
          return;
        }
        var [, , , builderId] = m;

        var execRes = await chrome.scripting.executeScript({
          target: { tabId, allFrames: false },
          world:  "MAIN",
          func:   _cf_captureCloneBaseline,
          args:   [builderId],
        });
        var result = JSON.parse(execRes?.[0]?.result ?? "{}");

        if (result.ok && result.fullData) {
          var baseline = {
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
        var tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }
        var res = await chrome.scripting.executeScript({
          target: { tabId, allFrames: false },
          world:  "MAIN",
          func:   () => JSON.stringify(window.__cfApiLog ?? []),
        });
        var log = JSON.parse(res?.[0]?.result ?? "[]");
        sendResponse({ ok: true, log });
      } catch(err) {
        sendResponse({ ok: false, error: String(err).slice(0, 200) });
      }
    })();
    return true;
  }

  /* ── CF_GET_NATIVE_FIREBASE_PAYLOAD ──────────────────────────────────────
   * Returns window.__cfNativeFirebasePayload and __cfNativeFirebaseRaw
   * captured by bridge.js v2.11.0 when GHL reads a page from Firebase Storage.
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_GET_NATIVE_FIREBASE_PAYLOAD") {
    (async () => {
      try {
        var tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }
        var res = await chrome.scripting.executeScript({
          target: { tabId, allFrames: false },
          world:  "MAIN",
          func:   () => JSON.stringify({
            payload: window.__cfNativeFirebasePayload ?? null,
            raw:     window.__cfNativeFirebaseRaw ?? null,
          }),
        });
        var data = JSON.parse(res?.[0]?.result ?? "{}");
        sendResponse({ ok: true, payload: data.payload, raw: data.raw });
      } catch(err) {
        sendResponse({ ok: false, error: String(err).slice(0, 200) });
      }
    })();
    return true;
  }

  /* ── CF_GET_FULL_NATIVE_JSON ──────────────────────────────────────────────
   * Returns the full, untruncated cfNativeFirebaseRaw string from
   * chrome.storage.local — written by content.js whenever bridge.js fires
   * CF_NATIVE_FIREBASE_RAW.  No page reload or executeScript needed.
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_GET_FULL_NATIVE_JSON") {
    chrome.storage.local.get(["cfNativeFirebaseRaw"], function(result) {
      var raw = result.cfNativeFirebaseRaw ?? null;
      if (raw) {
        sendResponse({ ok: true, raw: raw, length: raw.length });
      } else {
        sendResponse({ ok: false, error: "No Firebase payload in storage yet. Load a GHL page in the builder first." });
      }
    });
    return true;
  }

  /* ── CF_GET_PAGE_META ─────────────────────────────────────────────────────
   * Returns window.__cfPageMetaParsed captured by bridge.js v2.12.0.
   * Contains GHL backend page meta: pageDataDownloadUrl, funnelId, locationId.
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_GET_PAGE_META") {
    (async () => {
      try {
        var tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }
        var res = await chrome.scripting.executeScript({
          target: { tabId, allFrames: false },
          world:  "MAIN",
          func:   () => JSON.stringify({
            meta:           window.__cfPageMetaParsed ?? null,
            firestoreLog:   window.__cfFirestoreStreamLog ?? [],
          }),
        });
        var { meta, firestoreLog } = JSON.parse(res?.[0]?.result ?? '{"meta":null,"firestoreLog":[]}');
        sendResponse({ ok: true, meta, firestoreLog });
      } catch(err) {
        sendResponse({ ok: false, error: String(err).slice(0, 200) });
      }
    })();
    return true;
  }

  /* ── CF_GET_PAGE_LOAD_ERRORS ──────────────────────────────────────────────
   * Returns window.__cfPageLoadErrors captured by bridge.js v2.11.0 error trap.
   * ─────────────────────────────────────────────────────────────────────── */
  if (type === "CF_GET_PAGE_LOAD_ERRORS") {
    (async () => {
      try {
        var tabId = msg.tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
        if (!tabId) { sendResponse({ ok: false, error: "no_active_tab" }); return; }
        var res = await chrome.scripting.executeScript({
          target: { tabId, allFrames: false },
          world:  "MAIN",
          func:   () => JSON.stringify(window.__cfPageLoadErrors ?? []),
        });
        var errors = JSON.parse(res?.[0]?.result ?? "[]");
        sendResponse({ ok: true, errors });
      } catch(err) {
        sendResponse({ ok: false, error: String(err).slice(0, 200) });
      }
    })();
    return true;
  }

  if (type === "CF_OOFF_ERROR") {
    var senderTabId = sender?.tab?.id;
    if (!senderTabId) return false;
    var { msg: errMsg, src, line, seenBeforeInject, seenAfterInject, preExisting } = msg;
    var storeKey = `cf_ooff_err_${senderTabId}`;
    /* Merge with existing to accumulate both boolean flags across multiple calls */
    chrome.storage.local.get([storeKey], (existing) => {
      var prev = existing[storeKey] ?? {};
      var merged = {
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
