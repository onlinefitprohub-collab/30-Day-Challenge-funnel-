// bridge.js — Injected into the HighLevel page (MAIN world).
// Detects the page-builder context from the URL / window globals,
// and executes the actual GHL injection using the page's own
// authenticated HTTP service (revexBackendService) — no API key needed.
// Communicates with content.js (extension world) via window.postMessage.

(function cfBridge() {
  if (window.__cf_bridge_active) return;
  window.__cf_bridge_active = true;

  // GHL's authenticated backend — revex uses its own baseURL which is NOT this.
  // We must always pass the full URL to revex, exactly like CloneLevel does:
  //   revex.get("https://backend.leadconnectorhq.com/funnels/page/${id}")
  const GHL_API = "https://backend.leadconnectorhq.com";

  // Best-known API path for the current page — sniffed from GHL's own requests.
  // Starts null; updated whenever GHL makes a GET that looks like page content.
  let capturedPageApiUrl = null;

  // Best-known write path — sniffed from GHL's own PUT/PATCH/POST save requests.
  let capturedPagePutUrl = null;

  /* ─── URL parsing ─────────────────────────────────────────────────────── */
  // GHL page builder URL: /location/{locationId}/page-builder/{pageBuilderId}
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
  // GHL's page-builder does NOT fetch page data via XHR — it's server-rendered
  // into window.__NUXT__ by Nuxt.js. This is why `sniffed: none`.
  // We read it directly here to get page structure and any API URLs embedded.
  function getPageDataFromNuxt() {
    try {
      const nuxt = window.__NUXT__;
      if (!nuxt) return null;
      // Nuxt 3 stores data in nuxt.data or nuxt.payload.data
      const data = nuxt?.data ?? nuxt?.payload?.data ?? nuxt?.state;
      if (!data || typeof data !== "object") return null;
      // Also try useNuxtApp() if available (CloneLevel approach)
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
      // GHL page objects have body/elements/sections/content at top level,
      // or nested under .page / .pageData
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

  /* ─── Intercept fetch/XHR to sniff GHL's own page-load endpoint ──────── */
  // We watch ALL traffic now (not just leadconnectorhq.com) because GHL may
  // use same-origin API calls (app.gohighlevel.com/api/...) that we'd miss.
  const PAGE_BUILDER_RE = /\/page-builder\/([^/?]+)/i;
  const LOCATION_RE     = /\/location\/([^/?]+)/i;

  // Patterns that indicate a request carries page content.
  const PAGE_CONTENT_KEYS = ["elements", "content", "pageContent", "sections", "body"];

  // Interesting URL patterns (same approach as CloneLevel's INTERESTING array).
  const INTERESTING_PATH_RE = /\/(funnels?\/page|funnel-pages|pages?|site-pages|v1\/page|services\/pages|prebuilt-section|page-builder)\//i;

  // Patterns that indicate a write request is a page-save call.
  const WRITE_PATH_RE = /\/(funnels\/page|funnel-pages|pages|site-pages|v1\/page)\/([^/?#]+)/i;

  const _origFetch = window.fetch;
  window.fetch = async function (...args) {
    const url = typeof args[0] === "string" ? args[0]
              : args[0] instanceof URL      ? args[0].toString()
              : args[0] instanceof Request  ? args[0].url : "";
    const method = (typeof args[1] === "object" && args[1]?.method)
      ? args[1].method.toUpperCase()
      : "GET";

    const response = await _origFetch.apply(this, args);

    if (INTERESTING_PATH_RE.test(url)) {
      // Sniff GHL's own GET requests to learn the real page API endpoint.
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

      // Sniff GHL's own PUT/PATCH/POST save requests to learn the write endpoint.
      if (["PUT", "PATCH", "POST"].includes(method)) {
        try {
          const pathname = new URL(url).pathname;
          if (WRITE_PATH_RE.test(pathname)) {
            capturedPagePutUrl = pathname;
            console.log("[CF] Captured page PUT URL (fetch):", pathname);
          }
        } catch {}
      }
    }

    // Context detection
    const pbMatch  = url.match(PAGE_BUILDER_RE);
    const locMatch = url.match(LOCATION_RE);
    if (pbMatch?.[1] || locMatch?.[1]) {
      emit(pbMatch?.[1] || null, locMatch?.[1] || getLocationId(), "fetch");
    }

    return response;
  };

  /* ─── Intercept XHR ───────────────────────────────────────────────────── */
  const _origOpen = XMLHttpRequest.prototype.open;
  const _origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._cfMethod = method.toUpperCase();
    this._cfUrl    = String(url);
    const pbMatch  = this._cfUrl.match(PAGE_BUILDER_RE);
    const locMatch = this._cfUrl.match(LOCATION_RE);
    if (pbMatch?.[1] || locMatch?.[1]) {
      emit(pbMatch?.[1] || null, locMatch?.[1] || getLocationId(), "xhr");
    }
    return _origOpen.apply(this, [method, url, ...rest]);
  };

  // GHL's revexBackendService is axios → uses XHR, not window.fetch.
  XMLHttpRequest.prototype.send = function (...args) {
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

      if (["PUT", "PATCH", "POST"].includes(this._cfMethod)) {
        try {
          const pathname = new URL(this._cfUrl).pathname;
          if (WRITE_PATH_RE.test(pathname)) {
            capturedPagePutUrl = pathname;
            console.log("[CF] Captured page PUT URL (XHR):", capturedPagePutUrl);
          }
        } catch {}
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

  /* ─── GHL HTTP client helper ──────────────────────────────────────────── */
  function getRevex() {
    try {
      return document.querySelector("#app")
        ?.__vue_app__?.config.globalProperties?.revexBackendService ?? null;
    } catch {
      return null;
    }
  }

  // Poll until GHL's authenticated axios instance is available on the Vue app.
  // Needed because bridge.js runs at document_start — before Vue mounts.
  // Raw window.fetch() is NOT used as a fallback: it lacks GHL's auth tokens.
  async function waitForRevex(maxMs = 5000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const r = getRevex();
      if (r) return r;
      await new Promise((res) => setTimeout(res, 200));
    }
    return null;
  }

  // Log revex availability + baseURL 2 s after page load for debugging.
  // Also attempt Nuxt payload read so we can log page structure early.
  setTimeout(() => {
    const r = getRevex();
    console.log(
      "[CF] revex at 2 s:", !!r,
      "| baseURL:", r?.defaults?.baseURL ?? "n/a",
      "| will call:", GHL_API + "/funnels/page/TEST"
    );
    const nuxt = getPageDataFromNuxt();
    if (nuxt) {
      console.log("[CF] Nuxt page data at 2 s — key:", nuxt.nuxtKey, "| fields:", Object.keys(nuxt.pageData).slice(0, 10));
    } else {
      console.log("[CF] No Nuxt page data at 2 s — __NUXT__:", !!window.__NUXT__);
    }
  }, 2000);

  // IMPORTANT: Always prefix with GHL_API — revex's own baseURL is not
  // backend.leadconnectorhq.com, so path-only calls hit the wrong server.
  // CloneLevel confirms: revex.get("https://backend.leadconnectorhq.com/funnels/page/...")
  async function ghlGet(path) {
    const revex = await waitForRevex();
    if (!revex) {
      throw new Error(
        "GHL service not ready — wait for the page builder to fully load, then try again"
      );
    }
    const fullUrl = GHL_API + path;
    console.log("[CF] GET", fullUrl, "via revex (baseURL:", revex.defaults?.baseURL, ")");
    const res = await revex.get(fullUrl);
    if (res?.status >= 200 && res?.status < 300 && res?.data) return res.data;
    const err = new Error(`GHL GET ${res?.status}: ${path}`);
    err.status = res?.status;
    throw err;
  }

  // ghlPut returns { ok: true } on success, or throws with err.status set.
  async function ghlPut(path, body) {
    const revex = await waitForRevex();
    if (!revex) {
      throw new Error(
        "GHL service not ready — wait for the page builder to fully load, then try again"
      );
    }
    const fullUrl = GHL_API + path;
    console.log("[CF] PUT", fullUrl, "via revex");
    const res = await revex.put(fullUrl, body);
    if (res?.status >= 200 && res?.status < 300) return { ok: true, data: res.data };
    const err = new Error(`GHL PUT ${res?.status}: ${path}`);
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
      // Try to get current page structure from Nuxt SSR payload first.
      const nuxtResult = getPageDataFromNuxt();
      if (nuxtResult) {
        console.log("[CF] Nuxt page data available for merge — key:", nuxtResult.nuxtKey);
      }

      // Build ordered list of endpoint candidates.
      // Order: CloneLevel's proven funnel path first, then location-scoped,
      // then CloneLevel-inspired paths (/v1/page/, /services/pages/), then generic.
      const candidates = [
        capturedPageApiUrl,
        `/funnels/page/${pageBuilderId}`,
        locationId && `/locations/${locationId}/pages/${pageBuilderId}`,
        locationId && `/locations/${locationId}/site-pages/${pageBuilderId}`,
        `/v1/pages/${pageBuilderId}`,
        `/v1/page/${pageBuilderId}`,
        `/v2/pages/${pageBuilderId}`,
        `/websites/pages/${pageBuilderId}`,
        `/pages/${pageBuilderId}`,
        `/site-pages/${pageBuilderId}`,
        `/funnel-pages/${pageBuilderId}`,
        `/funnels/funnel-step/${pageBuilderId}`,
      ].filter(Boolean);

      let pageContext = null;
      let workingPath = null;
      const triedGetPaths = [];

      for (const path of candidates) {
        triedGetPaths.push(path);
        try {
          pageContext = await ghlGet(path);
          workingPath = path;
          console.log("[CF] Working endpoint:", path);
          break;
        } catch (e) {
          if (e.message.includes("404") || e.message.includes("GHL GET 404") || e.status === 404) {
            console.warn("[CF] 404 on", path, "— trying next candidate");
            continue;
          }
          throw e;
        }
      }

      // If no GET succeeded, still attempt PUT with best available path.
      if (!workingPath) {
        workingPath = candidates[0];
        console.warn("[CF] No endpoint responded to GET — attempting PUT at", workingPath);
      }

      // Merge: use Nuxt data as base if available (most complete), then API data,
      // then spread our template on top.
      const baseContext = pageContext ?? nuxtResult?.pageData ?? {};
      const putPayload = { ...baseContext, ...pageData };

      // Build PUT candidates: sniffed write URL first, then GET path, then rest.
      const putCandidates = [
        capturedPagePutUrl,
        workingPath,
        ...candidates.filter((p) => p !== workingPath),
      ].filter(Boolean).filter((p, i, arr) => arr.indexOf(p) === i);

      const triedPutPaths = [];
      let putSucceeded = false;

      for (const putPath of putCandidates) {
        triedPutPaths.push(putPath);
        try {
          await ghlPut(putPath, putPayload);
          console.log("[CF] PUT succeeded at:", putPath);
          putSucceeded = true;
          break;
        } catch (putErr) {
          const is404 = putErr.status === 404 ||
            putErr.message.includes("404") ||
            putErr.message.includes("GHL PUT 404");
          if (is404) {
            console.warn("[CF] PUT 404 on", putPath, "— trying next candidate");
            continue;
          }
          const allTried = [
            "GET: " + triedGetPaths.join(", "),
            "PUT: " + triedPutPaths.join(", "),
            "sniffed: " + (capturedPageApiUrl ?? "none"),
          ].join(" | ");
          throw new Error(`${putErr.message} — endpoints tried: ${allTried}`);
        }
      }

      if (!putSucceeded) {
        const allTried = [
          "GET: " + triedGetPaths.join(", "),
          "PUT: " + triedPutPaths.join(", "),
          "sniffed: " + (capturedPageApiUrl ?? "none"),
        ].join(" | ");
        throw new Error(`All PUT candidates returned 404 — endpoints tried: ${allTried}`);
      }

      // Reload the builder iframe so the new content is visible
      const iframe = document.querySelector('[name="funnel-builder"]');
      if (iframe) iframe.src = iframe.src;

      reply(true);
    } catch (e) {
      reply(false, e.message);
    }
  });

})();
