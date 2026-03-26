// background.js — Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    console.log("[CF Funnel] Installed v2.17.0 — wrapped dict entries, Approach 3 always runs, post-write verify, section probe diag.");
  }
  if (reason === "update") {
    console.log("[CF Funnel] Updated to v2.17.0 — wrapped dict entries, Approach 3 always runs, post-write verify, section probe diag.");
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
async function _cf_injectViaBuilderSave(builderId, locationId, pageData) {
  const diag = { approach0: null, approach1: null, approach2: null, approach3: null };
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
             * We always write structured-dict format with flat dict entries.          */
            let storageFormat  = "skipped";
            let existElemCount = 0;
            try {
              const existRes = await fetch(downloadUrl, {
                headers: { "Authorization": `Firebase ${idToken}` },
                signal:  AbortSignal.timeout(5000),
              });
              if (existRes.ok) {
                const existing = await existRes.json();
                if (Array.isArray(existing.elements)) {
                  storageFormat  = "flat-array";
                  existElemCount = existing.elements.length;
                } else if (existing.elements && typeof existing.elements === "object") {
                  storageFormat  = "structured-dict";
                  existElemCount = Object.keys(existing.elements).length;
                  /* Peek at first row entry's top-level keys (confirm wrapped vs flat) */
                  const firstRowVal = existing.rows && Object.values(existing.rows)[0];
                  diag.approach2.firstRowKeys = firstRowVal
                    ? Object.keys(firstRowVal).slice(0, 12)
                    : "rows-empty";
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

            /* ── Step 1: Build structured-dict payload — wrapped dict entries ────────── *
             * GHL's own builder stores rows/columns/elements as { id, metaData:{} }
             * wrapped nodes (confirmed: firstRowKeys=["id","metaData"]).
             * We write pd.rows/pd.columns/pd.elements directly — no unwrapping.
             * Sections stay as-is (array of { id, metaData:{} } — already working).  */
            const pd = pageData;
            const writePayload = {
              fontsForPreview: pd.fontsForPreview,
              general:         pd.general,
              id:              pd.id,
              pageStyles:      pd.pageStyles,
              popups:          pd.popups ?? [],
              sections:        pd.sections,
              rows:            pd.rows     ?? {},
              columns:         pd.columns  ?? {},
              elements:        pd.elements ?? {},
            };

            diag.approach2.storageFormat  = storageFormat;
            diag.approach2.existElemCount = existElemCount;
            diag.approach2.nodeCount      = Object.keys(pd.rows    ?? {}).length
              + Object.keys(pd.columns  ?? {}).length
              + Object.keys(pd.elements ?? {}).length;

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

              /* ── Post-write verification: re-read what we wrote ────────────────── *
               * Confirms the new file is readable and has our sections/rows counts.  */
              try {
                const vrRes = await fetch(downloadUrl, {
                  headers: { "Authorization": `Firebase ${idToken}` },
                  signal:  AbortSignal.timeout(5000),
                });
                if (vrRes.ok) {
                  const vr = await vrRes.json();
                  const sec0 = Array.isArray(vr.sections) && vr.sections[0];
                  diag.approach2.postWrite = {
                    sectionCount:          Array.isArray(vr.sections) ? vr.sections.length : 0,
                    firstSectionChildCount: Array.isArray(sec0?.metaData?.child)
                      ? sec0.metaData.child.length
                      : (Array.isArray(sec0?.child) ? sec0.child.length : 0),
                    firstRowKeys: (() => {
                      const rv = vr.rows && Object.values(vr.rows)[0];
                      return rv ? Object.keys(rv).slice(0, 8) : "rows-empty";
                    })(),
                  };
                } else {
                  diag.approach2.postWrite = { error: `re-read ${vrRes.status}` };
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
       APPROACH 3: Vue/Pinia builder state mutation + trigger native save
       GHL builder is Vue 3 + Pinia. Find the store holding page data, patch it,
       then call the store's save action so GHL writes to Firebase via its own path.
       ════════════════════════════════════════════════════════════════════════ */
    const vueApp = appEl?.__vue_app__;
    let pinia = null;
    if (vueApp) {
      const provides = vueApp._context?.provides ?? {};
      /* Pinia symbol can be Symbol.for('pinia') or an internal symbol */
      pinia = provides[Symbol.for("pinia")] ?? null;
      if (!pinia || !(pinia._s instanceof Map)) {
        /* Iterate provides looking for the Pinia instance (_s is a Map of stores) */
        pinia = Object.values(provides).find(v => v && v._s instanceof Map) ?? null;
      }
    }

    if (!pinia || !(pinia._s instanceof Map)) {
      diag.approach3 = { result: "Pinia not found — GHL builder may not be fully loaded" };
    } else {
      const storeIds = [...pinia._s.keys()];
      diag.approach3 = { storeCount: storeIds.length, storeIds: storeIds.slice(0, 20), candidates: [] };

      /* ── Also probe Pinia stores for clipboard state ──────────────────────
         GHL's builder "copy section" stores data in a Pinia clipboard store.
         Writing to that store means GHL's own Ctrl+V paste will load our content
         using its native mechanism — no Firebase write needed from our side.   */
      const clipStoreDiag = [];
      for (const [storeId, store] of pinia._s) {
        const state    = store.$state ?? {};
        const clipKeys = Object.keys(state).filter(k => /clipboard|copy|paste|buffer/i.test(k));
        if (clipKeys.length === 0) continue;
        const entry = { storeId, clipboardKeys: clipKeys, patched: false, pasteAttempted: false };
        try {
          /* Write our pageData to every clipboard-like key in this store */
          const patch = {};
          for (const ck of clipKeys) patch[ck] = pageData;
          store.$patch(patch);
          entry.patched = true;
          /* Try common paste action names */
          for (const pa of ["paste", "pasteSection", "applyClipboard", "doPaste", "pasteElement"]) {
            if (typeof store[pa] === "function") {
              try { await store[pa](); entry.pasteAttempted = pa; break; } catch(_) {}
            }
          }
        } catch (ce) { entry.error = String(ce).slice(0, 60); }
        clipStoreDiag.push(entry);
      }
      diag.approach3.clipboardStores = clipStoreDiag;

      /* ── Identify all candidate stores with GHL page data structure ─────── */
      const candidates = [];
      for (const [storeId, store] of pinia._s) {
        const state = store.$state ?? {};
        const keys  = Object.keys(state);
        /* Score by how many GHL page keys are present (more = better match) */
        const hasSections  = keys.includes("sections");
        const hasRows      = keys.includes("rows");
        const hasElements  = keys.includes("elements");
        const hasColumns   = keys.includes("columns");
        const hasPageData  = keys.includes("pageData");
        const score = (hasSections ? 3 : 0) + (hasRows ? 2 : 0) + (hasElements ? 2 : 0)
                    + (hasColumns ? 1 : 0) + (hasPageData ? 1 : 0);
        if (score > 0) candidates.push({ storeId, store, keys, score, hasPageData, hasSections });
      }
      /* Sort by score descending so best matches are tried first */
      candidates.sort((a, b) => b.score - a.score);
      diag.approach3.candidates = candidates.map(c => ({ storeId: c.storeId, score: c.score })).slice(0, 10);

      if (candidates.length === 0) {
        diag.approach3.result = "no store with GHL page structure (sections/rows/elements/pageData) found";
      } else {
        const SAVE_ACTIONS = ["savePage", "savePageData", "save", "autoSave",
                              "updatePage", "saveCurrentPage", "persistPage"];
        let successResult = null;
        const candidateDiag = [];

        /* Try each candidate until one both patches and saves successfully */
        for (const { storeId, store, keys, hasPageData, hasSections } of candidates) {
          const cd = { storeId, stateKeys: keys.slice(0, 20), patched: false, savedVia: null, errors: [] };

          /* Apply patch — try both root-level and nested shapes */
          try {
            if (hasPageData && !hasSections) {
              /* Store uses { pageData: { sections, rows, elements } } nesting */
              store.$patch({ pageData });
              cd.patchShape = "nested-pageData";
            } else {
              /* Store holds sections/rows/elements at root level */
              store.$patch(pageData);
              cd.patchShape = "root";
            }
            cd.patched = true;
          } catch (pe) {
            cd.patchError = String(pe).slice(0, 80);
            candidateDiag.push(cd);
            continue; // try next candidate
          }

          /* Try save actions */
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
            /* Success — store patched and native save triggered */
            successResult = { storeId, savedVia: cd.savedVia, patchShape: cd.patchShape };
            break;
          }
          /* No save action found on this store — continue to next candidate */
        }

        diag.approach3.candidateDiag = candidateDiag;

        const fbWroteOk = diag.approach2?.fallThrough === true;
        if (successResult) {
          diag.approach3.result = "success";
          return JSON.stringify({
            ok:       true,
            method:   fbWroteOk ? "firebase+pinia" : "pinia",
            storeId:  successResult.storeId,
            savedVia: successResult.savedVia,
            patchShape: successResult.patchShape,
            diag,
          });
        } else if (candidateDiag.some(c => c.patched)) {
          /* Patched at least one store but no save action found.
             Content is visible in the builder NOW (reactive state updated).
             If Firebase also wrote (fallThrough=true), a reload will re-read
             our stored data. Either way treat as success → trigger reload. */
          const patchedStore = candidateDiag.find(c => c.patched);
          diag.approach3.result = "patched-no-save";
          return JSON.stringify({
            ok:      true,
            method:  fbWroteOk ? "firebase+pinia-patched" : "pinia-patched",
            storeId: patchedStore?.storeId,
            savedVia: null,
            diag,
            warning: `Content injected into builder (visible now). Firebase wrote=${fbWroteOk}. Click Save in GHL to persist permanently.`,
          });
        }
      }
    }

    /* ── Approach 2 succeeded but Approach 3 found no Pinia store ─────────── *
     * Firebase Storage is written correctly. GHL will read it on next reload.  */
    if (diag.approach2?.fallThrough === true) {
      return JSON.stringify({ ok: true, method: "firebase-write", diag });
    }

    /* All direct approaches failed — but Approach 0 (clipboard) may still work.
       Tell the user to try Ctrl+V in the builder — if GHL reads from any of the
       localStorage clipboard keys we wrote, the content will paste natively. */
    const a1 = JSON.stringify(diag.approach1).slice(0, 80);
    const a2 = JSON.stringify(diag.approach2?.result ?? diag.approach2).slice(0, 120);
    const a3 = JSON.stringify(diag.approach3?.result ?? diag.approach3?.savedVia ?? "not reached").slice(0, 120);
    const clipStores = (diag.approach3?.clipboardStores ?? []).map(s => s.storeId).join(",") || "none";
    return JSON.stringify({
      ok:      false,
      method:  "clipboard-ready",
      warning: true,
      error:   `Direct injection not confirmed, but content has been written to GHL's clipboard storage (${(diag.approach0?.keys ?? []).filter(k => k.includes(":ok")).length} localStorage keys + ${clipStores !== "none" ? "Pinia clipboard stores: " + clipStores : "no Pinia clipboard stores found"}). Press Ctrl+V in the GHL builder — GHL's own paste may load your content. Diag: A1=${a1} | A2=${a2} | A3=${a3}.`,
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
          let r = {};
          try {
            // Try Firebase / Vue-builder injection approaches first
            const res2 = await chrome.scripting.executeScript({
              target: { tabId: tabId2, allFrames: false },
              world:  "MAIN",
              func:   _cf_injectViaBuilderSave,
              args:   [builderId2, locId2, pageData],
            });
            r = JSON.parse(res2?.[0]?.result ?? "{}");
          } catch(e) { r = { ok: false, error: `scripting failed: ${String(e).slice(0, 80)}` }; }
          // Store full inject result so popup can show debug details
          await chrome.storage.local.set({ cf_last_inject: { ...r, builderId: builderId2, ts: Date.now() } });
          if (r.ok) {
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

        let injectResult = {};
        try {
          const res = await chrome.scripting.executeScript({
            target: { tabId, allFrames: false },
            world:  "MAIN",
            func:   _cf_injectViaBuilderSave,
            args:   [builderId, locationId, ready.pageData],
          });
          injectResult = JSON.parse(res?.[0]?.result ?? "{}");
        } catch(e) {
          injectResult = { ok: false, error: `scripting failed: ${String(e).slice(0, 80)}` };
        }

        // Store full inject result for popup debug display
        await chrome.storage.local.set({ cf_last_inject: { ...injectResult, builderId, ts: Date.now() } });

        if (injectResult.ok) {
          console.log("[CF] inject ok method:", injectResult.method);
          // 4. Refresh the builder iframe so new content renders
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

  return false;
});
