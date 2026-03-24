// bridge.js v2.5.5 — Injected into the HighLevel page (MAIN world).
// Detects the page-builder context from the URL / window globals,
// and executes the actual GHL injection using either:
//   A) "capture-replay": intercepts GHL's own save request (URL + auth headers)
//      then replays it via _origFetch — no revex guessing needed.
//   B) "revex path-only": path-only calls through GHL's authenticated axios
//      instance, trying all 12 endpoint candidates and continuing on ALL errors.
// Communicates with content.js (extension world) via window.postMessage.

(function cfBridge() {
  if (window.__cf_bridge_active) return;
  window.__cf_bridge_active = true;

  const GHL_API = "https://backend.leadconnectorhq.com"; // for diagnostics only

  // ── Captured from GHL's own network requests ───────────────────────────────
  let capturedPageApiUrl  = null; // GET path (page content endpoint)
  let capturedPutFullUrl  = null; // full URL of GHL's last save request
  let capturedPutHeaders  = {};   // auth headers from GHL's last write (PUT/PATCH/POST)
  let capturedAuthHeaders = {};   // auth headers from ANY authenticated GHL request (GET safe fallback)
  let capturedPutBody     = null; // body string from GHL's last save request
  let capturedPutMethod   = null; // PUT / PATCH / POST

  /* ─── URL parsing ─────────────────────────────────────────────────────── */
  function parseBuilderUrl(url) {
    try {
      const m = url.match(/\/location\/([^/?#]+)\/page-builder\/([^/?#]+)/i);
      if (m) return { locationId: m[1], pageBuilderId: m[2] };
    } catch {}
    return null;
  }

  function getLocationId() {
    const parsed = parseBuilderUrl(window.location.href);
    if (parsed?.locationId) return parsed.locationId;
    return window?.attribution?.locationId || null;
  }

  /* ─── Read Nuxt payload (GHL's frontend is Nuxt — page data is SSR'd) ── */
  function getPageDataFromNuxt() {
    try {
      const nuxt = window.__NUXT__;
      if (!nuxt) return null;
      const data = nuxt?.data ?? nuxt?.payload?.data ?? nuxt?.state;
      if (!data || typeof data !== "object") return null;
      let nuxtAppData = null;
      try {
        if (typeof useNuxtApp === "function") {
          const app = useNuxtApp();
          if (app?.payload?.data && typeof app.payload.data === "object") {
            nuxtAppData = app.payload.data;
          }
        }
      } catch {}
      const combined = nuxtAppData ?? data;
      for (const key of Object.keys(combined)) {
        const val = combined[key];
        if (!val || typeof val !== "object") continue;
        if (val.body !== undefined || val.elements !== undefined || val.sections !== undefined) {
          console.log("[CF] Found page data in __NUXT__ at key:", key, "keys:", Object.keys(val).slice(0, 8));
          return { nuxtKey: key, pageData: val };
        }
        const inner = val.page ?? val.pageData;
        if (inner && (inner.body !== undefined || inner.elements !== undefined || inner.sections !== undefined)) {
          console.log("[CF] Found page data in __NUXT__[" + key + "].page:", Object.keys(inner).slice(0, 8));
          return { nuxtKey: key, pageData: inner };
        }
      }
      console.log("[CF] __NUXT__ found but no page-like keys. Top-level keys:", Object.keys(combined).slice(0, 10));
      return null;
    } catch (e) {
      console.warn("[CF] __NUXT__ read failed:", e.message);
      return null;
    }
  }

  /* ─── Emit context to content.js ─────────────────────────────────────── */
  function emit(pageBuilderId, locationId, source) {
    window.postMessage({
      source:  "cf-bridge",
      type:    "CONTEXT_DETECTED",
      payload: { pageId: pageBuilderId, locationId, source },
    }, "*");
  }

  function checkUrl(url) {
    const parsed = parseBuilderUrl(url);
    if (parsed) {
      emit(parsed.pageBuilderId, parsed.locationId, "url");
      return;
    }
    const locId = window?.attribution?.locationId;
    if (locId) emit(null, locId, "attribution");
  }

  checkUrl(window.location.href);

  /* ─── Intercept fetch/XHR ──────────────────────────────────────────────── */
  const PAGE_BUILDER_RE   = /\/page-builder\/([^/?]+)/i;
  const LOCATION_RE       = /\/location\/([^/?]+)/i;
  const PAGE_CONTENT_KEYS = ["elements", "content", "pageContent", "sections", "body"];

  // URL patterns that are strong signals of page-builder API traffic.
  const INTERESTING_RE = /\/(funnels?\/page|funnel-pages|pages?|site-pages|sites?|v1\/page|v1\/funnel|services\/pages|prebuilt-section|page-builder|builder\/publish|builder\/save|elements?)[\/?]/i;

  // URL patterns that are definitely NOT page saves — analytics, session recording, CDN, etc.
  // Any URL matching NOISE_RE is silently skipped even if it's on the GHL backend domain.
  const NOISE_RE = /analytics|gtm\.|googletagmanager|segment\.io|mixpanel|amplitude|hotjar|intercom|sentry|datadog|getfinderlevel|session-recording|cdn\.|\.png|\.jpg|\.svg|\.woff|favicon/i;

  // Timestamp of the most recent click on GHL's native Save/Publish button.
  // We try to detect this via a capture click listener.
  let saveMarkTs = null;

  // ── GHL save-button click detector ────────────────────────────────────────
  // Bridge.js runs in MAIN world, so we can listen for clicks on the builder canvas.
  // GHL's "Publish"/"Save" button text differs by version; we cast a wide net.
  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;
    const el = e.target.closest("button, [role='button'], [class*='save'], [class*='publish']");
    if (!el) return;
    const txt = (el.textContent || el.getAttribute("aria-label") || "").trim().toLowerCase();
    if (txt === "save" || txt === "publish" || txt.includes("autosave") ||
        el.className.includes("save") || el.className.includes("publish")) {
      saveMarkTs = Date.now();
      console.log("[CF] GHL save/publish click detected — capture window open");
    }
  }, true);

  // ── URL classification helpers ─────────────────────────────────────────────
  function isGhlBackend(url) {
    try {
      const host = new URL(url).hostname;
      return host === "backend.leadconnectorhq.com" ||
             host === "services.leadconnectorhq.com" ||
             host === "api.gohighlevel.com";
    } catch {
      return url.startsWith("https://backend.leadconnectorhq.com") ||
             url.startsWith("https://services.leadconnectorhq.com");
    }
  }

  // Returns true if the request body looks like page structure data.
  // This is the key signal that separates a page-save from an analytics POST.
  function looksLikeStructure(body) {
    if (!body || typeof body !== "string") return false;
    if (body.length < 20) return false;
    try {
      const obj = JSON.parse(body);
      if (typeof obj !== "object" || obj === null) return false;
      return ["elements", "sections", "components", "blocks", "content",
              "rows", "columns", "pages", "steps", "nodes", "items",
              "children", "body", "funnel", "page"].some((k) => k in obj);
    } catch {
      return false;
    }
  }

  // Should we capture this write request?
  // Priority order: PUT/PATCH on GHL backend with any match → POST only if body looks structural.
  // Also: within 5 s of detected GHL save-button click, accept any GHL backend write.
  function shouldCaptureWrite(url, method, body) {
    if (!["PUT", "PATCH", "POST"].includes(method)) return false;
    if (!isGhlBackend(url)) return false;
    if (NOISE_RE.test(url)) return false;

    const isPutPatch = method === "PUT" || method === "PATCH";
    const nearSave   = saveMarkTs && (Date.now() - saveMarkTs < 5000);
    const interesting = INTERESTING_RE.test(url);
    const structural  = looksLikeStructure(body);

    // Always accept PUT/PATCH on the backend — page saves use PUT/PATCH.
    if (isPutPatch) return true;
    // POST: only capture if URL is interesting OR body looks like structure OR near a save click.
    return interesting || structural || nearSave;
  }

  // Legacy path filter — still used for GET sniffing (page content detection).
  const WRITE_PATH_RE = /\/(funnels\/page|funnel-pages|pages|site-pages|v1\/page)\/([^/?#]+)/i;
  // Also used for interesting-path GET sniffing.
  const INTERESTING_PATH_RE = INTERESTING_RE;

  // Capture headers from fetch init object into a plain object.
  function extractFetchHeaders(init) {
    const headers = {};
    const h = init?.headers;
    if (!h) return headers;
    if (typeof Headers !== "undefined" && h instanceof Headers) {
      h.forEach((v, k) => { headers[k] = v; });
    } else if (Array.isArray(h)) {
      h.forEach(([k, v]) => { headers[k] = v; });
    } else if (typeof h === "object") {
      Object.assign(headers, h);
    }
    return headers;
  }

  const _origFetch = window.fetch;
  window.fetch = async function (...args) {
    const url = typeof args[0] === "string" ? args[0]
              : args[0] instanceof URL      ? args[0].toString()
              : args[0] instanceof Request  ? args[0].url : "";
    const init   = args[1] ?? {};
    const method = (typeof init === "object" && init?.method)
      ? init.method.toUpperCase()
      : "GET";

    // Sniff write requests BEFORE calling _origFetch so we capture the auth headers.
    // Uses shouldCaptureWrite(): GHL backend + not NOISE + (PUT/PATCH or structural body or near save click).
    // PUT/PATCH always overwrites a prior POST capture; POST never overwrites a PUT/PATCH capture.
    const isPutPatch = method === "PUT" || method === "PATCH";
    const hasGoodCapture = capturedPutFullUrl && (capturedPutMethod === "PUT" || capturedPutMethod === "PATCH");
    const bodyStr = typeof init.body === "string" ? init.body : null;
    if (shouldCaptureWrite(url, method, bodyStr) && (isPutPatch || !hasGoodCapture)) {
      capturedPutFullUrl = url;
      capturedPutMethod  = method;
      capturedPutBody    = bodyStr;
      capturedPutHeaders = extractFetchHeaders(init);
      console.log("[CF] Captured save request (fetch):", method, url,
        "| headers:", Object.keys(capturedPutHeaders).join(", "));
    }

    // Merge auth headers from ANY authenticated GHL backend request (GET fallback for prebuilt flow).
    // Merges on every request so later requests can fill in keys the first request was missing.
    if (isGhlBackend(url) && !NOISE_RE.test(url)) {
      const allHeaders = extractFetchHeaders(init);
      const AUTH_KEYS = /^(authorization|token-id|channel|source|version|x-api-key|x-location-id)$/i;
      const authOnly = Object.fromEntries(Object.entries(allHeaders).filter(([k]) => AUTH_KEYS.test(k)));
      if (Object.keys(authOnly).length > 0) {
        const before = Object.keys(capturedAuthHeaders).length;
        Object.assign(capturedAuthHeaders, authOnly);
        const after = Object.keys(capturedAuthHeaders).length;
        if (after > before) {
          console.log("[CF] Merged auth headers (GET fallback):", Object.keys(capturedAuthHeaders).join(", "));
        }
      }
    }

    const response = await _origFetch.apply(this, args);

    if (INTERESTING_PATH_RE.test(url)) {
      if (method === "GET" && response.ok) {
        try {
          const json = await response.clone().json();
          if (json && PAGE_CONTENT_KEYS.some((k) => json[k] !== undefined)) {
            try {
              const pathname = new URL(url).pathname;
              capturedPageApiUrl = pathname;
              console.log("[CF] Captured page API URL (fetch):", pathname);
            } catch {}
          }
        } catch {}
      }
    }

    const pbMatch  = url.match(PAGE_BUILDER_RE);
    const locMatch = url.match(LOCATION_RE);
    if (pbMatch?.[1] || locMatch?.[1]) {
      emit(pbMatch?.[1] || null, locMatch?.[1] || getLocationId(), "fetch");
    }

    return response;
  };

  /* ─── Intercept XHR ───────────────────────────────────────────────────── */
  const _origOpen         = XMLHttpRequest.prototype.open;
  const _origSend         = XMLHttpRequest.prototype.send;
  const _origSetReqHeader = XMLHttpRequest.prototype.setRequestHeader;

  const XHR_AUTH_RE = /^(authorization|token-id|channel|source|version|x-api-key|x-location-id)$/i;

  // Capture headers from XHR via setRequestHeader.
  XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
    if (this._cfIsWriteReq) {
      this._cfHeaders = this._cfHeaders || {};
      this._cfHeaders[name] = value;
    }
    // Also merge auth headers from any GHL backend request as GET fallback for prebuilt flow.
    if (this._cfIsGhlReq && XHR_AUTH_RE.test(name)) {
      const had = capturedAuthHeaders[name];
      capturedAuthHeaders[name] = value;
      if (!had) console.log("[CF] Merged XHR auth header (GET fallback):", name);
    }
    return _origSetReqHeader.apply(this, [name, value]);
  };

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._cfMethod = method.toUpperCase();
    this._cfUrl    = String(url);
    this._cfHeaders = {};

    // Mark ALL non-noise GHL backend requests so we can sniff auth headers.
    if (isGhlBackend(this._cfUrl) && !NOISE_RE.test(this._cfUrl)) {
      this._cfIsGhlReq = true;
    }

    // Mark write requests so setRequestHeader captures their headers.
    // We use isGhlBackend() at open() time (no body yet). shouldCaptureWrite() is
    // called at send() time when we have the body for looksLikeStructure() check.
    if (this._cfIsGhlReq && ["PUT", "PATCH", "POST"].includes(this._cfMethod)) {
      this._cfIsWriteReq = true;
    }

    const pbMatch  = this._cfUrl.match(PAGE_BUILDER_RE);
    const locMatch = this._cfUrl.match(LOCATION_RE);
    if (pbMatch?.[1] || locMatch?.[1]) {
      emit(pbMatch?.[1] || null, locMatch?.[1] || getLocationId(), "xhr");
    }
    return _origOpen.apply(this, [method, url, ...rest]);
  };

  // GHL's revexBackendService is axios → uses XHR, not window.fetch.
  XMLHttpRequest.prototype.send = function (...args) {
    if (this._cfIsWriteReq) {
      const bodyStr = typeof args[0] === "string" ? args[0] : null;
      if (shouldCaptureWrite(this._cfUrl, this._cfMethod, bodyStr)) {
        const isPutPatch = this._cfMethod === "PUT" || this._cfMethod === "PATCH";
        const hasGoodCapture = capturedPutFullUrl && (capturedPutMethod === "PUT" || capturedPutMethod === "PATCH");
        if (isPutPatch || !hasGoodCapture) {
          capturedPutFullUrl = this._cfUrl;
          capturedPutMethod  = this._cfMethod;
          capturedPutHeaders = { ...this._cfHeaders };
          capturedPutBody    = bodyStr;
          console.log("[CF] Captured save request (XHR):", this._cfMethod, this._cfUrl,
            "| headers:", Object.keys(capturedPutHeaders).join(", "));
        }
      }
    }

    if (this._cfUrl && INTERESTING_PATH_RE.test(this._cfUrl)) {
      if (this._cfMethod === "GET") {
        this.addEventListener("load", function () {
          if (this.status >= 200 && this.status < 300) {
            try {
              const json = JSON.parse(this.responseText);
              if (json && PAGE_CONTENT_KEYS.some((k) => json[k] !== undefined)) {
                try {
                  capturedPageApiUrl = new URL(this._cfUrl).pathname;
                } catch {
                  capturedPageApiUrl = this._cfUrl;
                }
                console.log("[CF] Captured page API URL (XHR):", capturedPageApiUrl);
              }
            } catch {}
          }
        });
      }
    }
    return _origSend.apply(this, args);
  };

  // Watch SPA navigation
  const _origPushState = history.pushState;
  history.pushState = function (...args) {
    const result = _origPushState.apply(this, args);
    setTimeout(() => checkUrl(window.location.href), 50);
    return result;
  };
  window.addEventListener("popstate", () => {
    setTimeout(() => checkUrl(window.location.href), 50);
  });

  /* ─── GHL HTTP client helper ─────────────────────────────────────────── */
  // CRITICAL FINDING from v2.5.3 diagnostics:
  //   revexBackendService.defaults.baseURL = "https://backend.leadconnectorhq.com/phone-system"
  //   This is the PHONE SYSTEM service — page builder calls go to a different service.
  // Strategy: probe ALL Vue globalProperties for an axios instance whose baseURL is
  // "https://backend.leadconnectorhq.com" (no path suffix). That's the right service.
  function getRevex() {
    try {
      const gp = document.querySelector("#app")
        ?.__vue_app__?.config.globalProperties;
      if (!gp) return null;

      // Probe order: publicApi, saasService, isvService, then fall back to revexBackendService.
      // From diagnostics: devtools, productionTip, remoteConfig, firebaseApp, pythonBackend,
      // membershipBackend, dialogLoadEngagements, paymentService, publicApi, saasService,
      // isvService, revexBackendService, humanRollDverService, emailBackend
      const candidates = [
        "publicApi", "saasService", "isvService",
        "pythonBackend", "membershipBackend", "paymentService",
        "revexBackendService",  // known to be /phone-system — last resort
      ];

      let bestMatch = null;
      for (const name of candidates) {
        const svc = gp[name];
        if (!svc || typeof svc.get !== "function") continue;
        const base = svc.defaults?.baseURL ?? "";
        // Find the service whose baseURL ends at the domain (no extra path segment).
        // /phone-system suffix means wrong service.
        if (base === "https://backend.leadconnectorhq.com" ||
            base === "https://services.leadconnectorhq.com" ||
            base === "https://backend.leadconnectorhq.com/") {
          console.log("[CF] Using service:", name, "| baseURL:", base);
          return svc;
        }
        // Keep first available as fallback even if baseURL looks wrong.
        if (!bestMatch) bestMatch = { name, svc, base };
      }

      if (bestMatch) {
        console.warn("[CF] No service with clean baseURL found. Using:", bestMatch.name,
          "| baseURL:", bestMatch.base);
        return bestMatch.svc;
      }
      return null;
    } catch {
      return null;
    }
  }

  async function waitForRevex(maxMs = 5000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const r = getRevex();
      if (r) return r;
      await new Promise((res) => setTimeout(res, 200));
    }
    return null;
  }

  /* ─── Deep diagnostics — logged 3 s after page load ──────────────────── */
  setTimeout(() => {
    const r = getRevex();
    console.log("[CF-DIAG] revex (best service) available:", !!r);
    if (r) {
      console.log("[CF-DIAG] revex.defaults.baseURL:", r.defaults?.baseURL ?? "n/a");
      console.log("[CF-DIAG] revex.defaults.headers:", JSON.stringify(r.defaults?.headers ?? {}));
      const reqH = r.interceptors?.request?.handlers?.filter(Boolean).length ?? 0;
      const resH = r.interceptors?.response?.handlers?.filter(Boolean).length ?? 0;
      console.log("[CF-DIAG] revex interceptors: req=" + reqH + " resp=" + resH);
    }

    // Log ALL Vue service baseURLs so we can identify the right one.
    try {
      const gp = document.querySelector("#app")?.__vue_app__?.config.globalProperties;
      if (gp) {
        const svcNames = ["publicApi","saasService","isvService","pythonBackend",
          "membershipBackend","paymentService","revexBackendService","emailBackend","humanRollDverService"];
        for (const name of svcNames) {
          const svc = gp[name];
          if (svc && typeof svc.get === "function") {
            console.log("[CF-DIAG] service", name, "| baseURL:", svc.defaults?.baseURL ?? "n/a");
          }
        }
      }
    } catch {}

    const nuxt = window.__NUXT__;
    console.log("[CF-DIAG] window.__NUXT__ exists:", !!nuxt);
    if (nuxt) {
      console.log("[CF-DIAG] __NUXT__ top-level keys:", Object.keys(nuxt).join(", "));
      const data = nuxt?.data ?? nuxt?.payload?.data ?? nuxt?.state ?? {};
      console.log("[CF-DIAG] __NUXT__.data keys:", Object.keys(data).slice(0, 20).join(", "));
      for (const [k, v] of Object.entries(data)) {
        if (v && typeof v === "object") {
          console.log("[CF-DIAG]   __NUXT__.data." + k + ":", Object.keys(v).slice(0, 12).join(", "));
        }
      }
    }

    const vueApp = document.querySelector("#app")?.__vue_app__;
    if (vueApp) {
      const gp = vueApp.config.globalProperties;
      const nonDollarKeys = Object.keys(gp).filter(k => !k.startsWith("$")).slice(0, 20);
      console.log("[CF-DIAG] Vue globalProperties (non-$):", nonDollarKeys.join(", "));
      const store = gp.$pinia ?? gp.$store;
      if (store?.state?.value) {
        console.log("[CF-DIAG] Pinia state keys:", Object.keys(store.state.value).slice(0, 15).join(", "));
      }
    }

    console.log("[CF-DIAG] capturedPutFullUrl:", capturedPutFullUrl ?? "none — save once in GHL to enable capture-replay");
    console.log("[CF-DIAG] capturedPutHeaders count:", Object.keys(capturedPutHeaders).length,
      "| capturedAuthHeaders count:", Object.keys(capturedAuthHeaders).length);
    console.log("[CF-DIAG] saveMarkTs:", saveMarkTs ? new Date(saveMarkTs).toISOString() : "none");
  }, 3000);

  /* ─── revex: path-only GET (fallback when no capture available) ───────── */
  // v2.5.0 confirmed: path-only reaches backend.leadconnectorhq.com (returns 404 = server found).
  // Full URL (GHL_API + path) triggers revex interceptors to fail with Network Error.
  async function revexGet(path) {
    const revex = await waitForRevex(4000);
    if (!revex) throw new Error("GHL service not ready");
    console.log("[CF] revex GET (path-only):", path, "| baseURL:", revex.defaults?.baseURL ?? "n/a");
    const res = await revex.get(path);
    if (res?.status >= 200 && res?.status < 300 && res?.data) return res.data;
    const err = new Error(`GHL GET ${res?.status ?? "?"}: ${path}`);
    err.status = res?.status;
    throw err;
  }

  async function revexPut(path, body) {
    const revex = await waitForRevex(4000);
    if (!revex) throw new Error("GHL service not ready");
    console.log("[CF] revex PUT (path-only):", path);
    const res = await revex.put(path, body);
    if (res?.status >= 200 && res?.status < 300) return { ok: true, data: res.data };
    const err = new Error(`GHL PUT ${res?.status ?? "?"}: ${path}`);
    err.status = res?.status;
    throw err;
  }

  /* ─── Handle CF_DO_INJECT from content.js ─────────────────────────────── */
  window.addEventListener("message", async (evt) => {
    if (evt.source !== window) return;
    if (!evt.data || evt.data.source !== "cf-content" || evt.data.type !== "CF_DO_INJECT") return;

    const { pageBuilderId, locationId, pageData } = evt.data.payload || {};

    function reply(success, error) {
      window.postMessage({
        source:  "cf-bridge",
        type:    "INJECT_RESULT",
        payload: { success, error: error || null },
      }, "*");
    }

    if (!pageBuilderId || !pageData) {
      return reply(false, "Missing pageBuilderId or pageData");
    }

    try {
      // Read page structure from Nuxt SSR payload.
      const nuxtResult = getPageDataFromNuxt();
      if (nuxtResult) {
        console.log("[CF] Nuxt page data available — key:", nuxtResult.nuxtKey,
          "| fields:", Object.keys(nuxtResult.pageData).slice(0, 8));
      }

      // Build ordered list of GET endpoint candidates (path-only for revex).
      // New-builder (GHL Sites/website pages) uses /sites/... paths.
      // Legacy funnel builder uses /funnels/page/... paths.
      // We try both since we don't know which the user is on until one works.
      const candidates = [
        capturedPageApiUrl,
        // New-builder (GHL Sites) candidates
        `/sites/pages/${pageBuilderId}`,
        locationId && `/sites/locations/${locationId}/pages/${pageBuilderId}`,
        `/sites/page/${pageBuilderId}`,
        // Legacy funnel builder — CloneLevel proven
        `/funnels/page/${pageBuilderId}`,
        locationId && `/locations/${locationId}/pages/${pageBuilderId}`,
        locationId && `/locations/${locationId}/site-pages/${pageBuilderId}`,
        `/v1/pages/${pageBuilderId}`,
        `/v1/page/${pageBuilderId}`,
        `/websites/pages/${pageBuilderId}`,
        `/v2/pages/${pageBuilderId}`,
        `/pages/${pageBuilderId}`,
        `/site-pages/${pageBuilderId}`,
        `/funnel-pages/${pageBuilderId}`,
        `/funnels/funnel-step/${pageBuilderId}`,
      ].filter(Boolean);

      let pageContext = null;
      let workingPath = null;
      const triedGetPaths = [];

      // Try all GET candidates — continue on ALL errors (not just 404).
      for (const path of candidates) {
        triedGetPaths.push(path);
        try {
          pageContext = await revexGet(path);
          workingPath = path;
          console.log("[CF] GET succeeded at:", path);
          break;
        } catch (e) {
          // Always continue — Network Error, 404, auth error — all are non-fatal here.
          console.warn("[CF] GET failed on", path, "—", e.message);
          continue;
        }
      }

      if (!workingPath) {
        console.warn("[CF] No GET candidate succeeded — will attempt PUT anyway");
      }

      // Merge: API response → Nuxt SSR payload → empty object.
      const baseContext = pageContext ?? nuxtResult?.pageData ?? {};
      if (!pageContext && nuxtResult?.pageData) {
        console.log("[CF] Using Nuxt SSR payload as merge base (no API GET succeeded)");
      }
      const putPayload = { ...baseContext, ...pageData };

      // ── STRATEGY A: Capture-replay (CloneLevel "learned-mutation-replay") ──
      // Use GHL's own save URL + auth headers captured from the XHR/fetch interceptor.
      // This bypasses revex entirely — uses window.fetch() directly with real auth.
      const hasCapture = capturedPutFullUrl && Object.keys(capturedPutHeaders).length > 0;

      if (hasCapture) {
        console.log("[CF] Strategy A: capture-replay →", capturedPutMethod, capturedPutFullUrl);
        try {
          const resp = await _origFetch(capturedPutFullUrl, {
            method: capturedPutMethod ?? "PUT",
            headers: {
              ...capturedPutHeaders,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(putPayload),
          });
          if (resp.ok) {
            console.log("[CF] Capture-replay PUT succeeded:", resp.status);
            const iframe = document.querySelector('[name="funnel-builder"]');
            if (iframe) iframe.src = iframe.src;
            return reply(true);
          }
          console.warn("[CF] Capture-replay PUT returned", resp.status, "— falling through to Strategy B");
        } catch (fetchErr) {
          console.warn("[CF] Capture-replay PUT threw:", fetchErr.message, "— falling through to Strategy B");
        }
      } else {
        console.log("[CF] No captured save request yet (capturedPutFullUrl:", capturedPutFullUrl,
          "| headers:", Object.keys(capturedPutHeaders).length, ") — using Strategy B (revex path-only)");
      }

      // ── STRATEGY B: revex path-only PUT loop ─────────────────────────────
      // Try all PUT path candidates; continue on ALL errors, never throw early.
      const putCandidates = [
        capturedPutFullUrl ? (() => { try { return new URL(capturedPutFullUrl).pathname; } catch { return null; } })() : null,
        workingPath,
        ...candidates.filter((p) => p !== workingPath),
      ].filter(Boolean).filter((p, i, arr) => arr.indexOf(p) === i);

      const triedPutPaths = [];
      let putSucceeded = false;

      for (const putPath of putCandidates) {
        triedPutPaths.push(putPath);
        try {
          await revexPut(putPath, putPayload);
          console.log("[CF] revex PUT succeeded at:", putPath);
          putSucceeded = true;
          break;
        } catch (putErr) {
          // Continue on ALL errors — Network Error, 404, auth, timeout.
          console.warn("[CF] revex PUT failed on", putPath, "—", putErr.message);
          continue;
        }
      }

      if (!putSucceeded) {
        const hint = !hasCapture
          ? " TIP: Click Save in GHL once to enable the capture-replay strategy (more reliable)."
          : "";
        const allTried = [
          "GET: " + triedGetPaths.join(", "),
          "PUT: " + triedPutPaths.join(", "),
          "sniffed: " + (capturedPageApiUrl ?? "none"),
        ].join(" | ");
        throw new Error(`Injection failed — all endpoints exhausted.${hint} Tried: ${allTried}`);
      }

      // Reload the builder iframe so the new content is visible.
      const iframe = document.querySelector('[name="funnel-builder"]');
      if (iframe) iframe.src = iframe.src;

      reply(true);
    } catch (e) {
      reply(false, e.message);
    }
  });

  /* ─── Handle CF_DO_PREBUILT from content.js (Track A) ─────────────────── */
  // POSTs each page section to GHL's /prebuilt-section API so they appear in
  // the "Prebuilt Sections" sidebar panel without touching the current page.
  window.addEventListener("message", async (evt) => {
    if (evt.source !== window) return;
    if (!evt.data || evt.data.source !== "cf-content" || evt.data.type !== "CF_DO_PREBUILT") return;

    const { locationId, challengeName, pageData } = evt.data.payload || {};

    function replyPrebuilt(result) {
      window.postMessage({ source: "cf-bridge", type: "PREBUILT_RESULT", payload: result }, "*");
    }

    if (!pageData || !Array.isArray(pageData.sections) || pageData.sections.length === 0) {
      return replyPrebuilt({ ok: false, error: "No sections in page data." });
    }

    // Prefer full write-request headers; fall back to auth-only headers captured from GETs.
    const headersToUse = Object.keys(capturedPutHeaders).length > 0
      ? capturedPutHeaders
      : capturedAuthHeaders;

    if (!headersToUse || Object.keys(headersToUse).length === 0) {
      return replyPrebuilt({
        ok: false,
        error: "No GHL auth headers captured yet — navigate to any GHL page (e.g. Contacts or Dashboard) and wait a moment, then try again.",
      });
    }

    const group  = `CF Funnel \u2014 ${challengeName || "Challenge"}`;
    const locId  = locationId || "";

    // Candidate prebuilt-section endpoints (tried in order; first 2xx wins per section).
    const PREBUILT_URLS = [
      "https://backend.leadconnectorhq.com/v1/prebuilt-section",
      "https://backend.leadconnectorhq.com/prebuilt-section",
    ];

    let succeeded = 0;
    let failed    = 0;
    const failedNames = [];

    for (let i = 0; i < pageData.sections.length; i++) {
      const section = pageData.sections[i];
      const sectionId = section.id;

      // Collect all rows / columns / elements that belong to this section.
      const sectionRows = {};
      const sectionCols = {};
      const sectionEls  = {};

      const rowIds = Array.isArray(section.metaData?.child) ? section.metaData.child : [];
      for (const rowId of rowIds) {
        const row = (pageData.rows || {})[rowId];
        if (!row) continue;
        sectionRows[rowId] = row;
        const colIds = Array.isArray(row.metaData?.child) ? row.metaData.child : [];
        for (const colId of colIds) {
          const col = (pageData.columns || {})[colId];
          if (!col) continue;
          sectionCols[colId] = col;
          const elIds = Array.isArray(col.metaData?.child) ? col.metaData.child : [];
          for (const elId of elIds) {
            const elem = (pageData.elements || {})[elId];
            if (elem) sectionEls[elId] = elem;
          }
        }
      }

      const sectionName = `${group} \u2014 Section ${i + 1}`;
      const body = JSON.stringify({
        name:       sectionName,
        group,
        locationId: locId,
        data: {
          sections: [section],
          rows:     sectionRows,
          columns:  sectionCols,
          elements: sectionEls,
        },
      });

      let posted = false;
      for (const url of PREBUILT_URLS) {
        try {
          // Normalize header keys: remove any case-variant of content-type before adding ours.
          const mergedHeaders = Object.fromEntries(
            Object.entries(headersToUse).filter(([k]) => k.toLowerCase() !== "content-type")
          );
          mergedHeaders["Content-Type"] = "application/json";

          const resp = await _origFetch(url, {
            method: "POST",
            headers: mergedHeaders,
            body,
          });
          if (resp.ok || resp.status === 200 || resp.status === 201) {
            console.log("[CF] Prebuilt POST ok:", sectionName, "→", resp.status);
            succeeded++;
            posted = true;
            break;
          }
          const text = await resp.text().catch(() => "");
          console.warn("[CF] Prebuilt POST", url, "returned", resp.status, text.slice(0, 200));
        } catch (e) {
          console.warn("[CF] Prebuilt POST", url, "threw:", e.message);
        }
      }

      if (!posted) {
        failed++;
        failedNames.push(`Section ${i + 1}`);
      }
    }

    replyPrebuilt({
      ok:          succeeded > 0,
      succeeded,
      failed,
      total:       pageData.sections.length,
      group,
      failedNames,
    });
  });

})();
