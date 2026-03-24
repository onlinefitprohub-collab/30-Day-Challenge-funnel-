// bridge.js — Injected into the HighLevel page (MAIN world).
// Detects the page-builder context from the URL / window globals,
// and executes the actual GHL injection using the page's own
// authenticated HTTP service (revexBackendService) — no API key needed.
// Communicates with content.js (extension world) via window.postMessage.

(function cfBridge() {
  if (window.__cf_bridge_active) return;
  window.__cf_bridge_active = true;

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

  /* ─── Intercept fetch to sniff GHL's own page-load endpoint ───────────── */
  const PAGE_BUILDER_RE = /\/page-builder\/([^/?]+)/i;
  const LOCATION_RE     = /\/location\/([^/?]+)/i;

  // Fields that indicate a response is the page's content object.
  const PAGE_CONTENT_KEYS = ["elements", "content", "pageContent", "sections", "body"];

  // Patterns that indicate a write request is a page-save call.
  const WRITE_PATH_RE = /\/(funnels\/page|funnel-pages|pages|site-pages)\/([^/?#]+)/i;

  const _origFetch = window.fetch;
  window.fetch = async function (...args) {
    const url = typeof args[0] === "string" ? args[0]
              : args[0] instanceof URL      ? args[0].toString()
              : args[0] instanceof Request  ? args[0].url : "";
    const method = (typeof args[1] === "object" && args[1]?.method)
      ? args[1].method.toUpperCase()
      : "GET";

    const response = await _origFetch.apply(this, args);

    if (url.includes("leadconnectorhq.com")) {
      // Sniff GHL's own GET requests to learn the real page API endpoint.
      if (method === "GET" && response.ok) {
        try {
          const json = await response.clone().json();
          if (json && PAGE_CONTENT_KEYS.some((k) => json[k] !== undefined)) {
            const pathname = new URL(url).pathname;
            capturedPageApiUrl = pathname;
            console.log("[CF] Captured page API URL:", pathname);
          }
        } catch {}
      }

      // Sniff GHL's own PUT/PATCH/POST save requests to learn the write endpoint.
      if (["PUT", "PATCH", "POST"].includes(method)) {
        try {
          const pathname = new URL(url).pathname;
          if (WRITE_PATH_RE.test(pathname)) {
            capturedPagePutUrl = pathname;
            console.log("[CF] Captured page PUT URL:", pathname);
          }
        } catch {}
      }
    }

    // Context detection (unchanged)
    const pbMatch  = url.match(PAGE_BUILDER_RE);
    const locMatch = url.match(LOCATION_RE);
    if (pbMatch?.[1] || locMatch?.[1]) {
      emit(pbMatch?.[1] || null, locMatch?.[1] || getLocationId(), "fetch");
    }

    return response;
  };

  /* ─── Intercept XHR to catch context clues + sniff page API URL ───────── */
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
  // We wrap send() so we can read GET responses and capture the real page API URL,
  // and also capture write endpoints from PUT/PATCH/POST requests.
  XMLHttpRequest.prototype.send = function (...args) {
    if (this._cfUrl && this._cfUrl.includes("leadconnectorhq.com")) {
      if (this._cfMethod === "GET") {
        this.addEventListener("load", function () {
          if (this.status >= 200 && this.status < 300) {
            try {
              const json = JSON.parse(this.responseText);
              if (json && PAGE_CONTENT_KEYS.some((k) => json[k] !== undefined)) {
                capturedPageApiUrl = new URL(this._cfUrl).pathname;
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
            console.log("[CF] Captured page PUT URL (XHR):", pathname);
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

  async function ghlGet(path) {
    const revex = getRevex();
    if (revex) {
      const res = await revex.get(`${GHL_API}${path}`);
      if (res?.status >= 200 && res?.status < 300 && res?.data) return res.data;
      throw new Error(`GHL GET ${res?.status}: ${path}`);
    }
    const res = await fetch(`${GHL_API}${path}`, {
      method:      "GET",
      credentials: "include",
      headers:     { "Content-Type": "application/json" },
    });
    if (res.ok) return res.json();
    const text = await res.text().catch(() => "");
    throw new Error(`GHL GET ${res.status}: ${path}${text ? " — " + text.slice(0, 80) : ""}`);
  }

  // ghlPut returns { ok: true } on success, or throws with the status.
  // Callers use the status code to decide whether to retry.
  async function ghlPut(path, body) {
    const revex = getRevex();
    if (revex) {
      const res = await revex.put(`${GHL_API}${path}`, body);
      if (res?.status >= 200 && res?.status < 300) return { ok: true };
      const err = new Error(`GHL PUT ${res?.status}: ${path}`);
      err.status = res?.status;
      throw err;
    }
    const res = await fetch(`${GHL_API}${path}`, {
      method:      "PUT",
      credentials: "include",
      headers:     { "Content-Type": "application/json" },
      body:        JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    const text = await res.text().catch(() => "");
    const err = new Error(`GHL PUT ${res.status}: ${path}${text ? " — " + text.slice(0, 80) : ""}`);
    err.status = res.status;
    throw err;
  }

  /* ─── Handle CF_DO_INJECT from content.js ─────────────────────────────── */
  window.addEventListener("message", async (evt) => {
    if (evt.source !== window) return;
    if (!evt.data || evt.data.source !== "cf-content" || evt.data.type !== "CF_DO_INJECT") return;

    const { pageBuilderId, pageData } = evt.data.payload || {};

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
      // Build ordered list of endpoint candidates to try.
      // The sniffed URL (if captured) is most reliable; hardcoded fallbacks cover
      // common GHL page types: funnel steps, funnel-pages, website pages, site pages.
      const candidates = [
        capturedPageApiUrl,
        `/funnels/page/${pageBuilderId}`,
        `/funnel-pages/${pageBuilderId}`,
        `/pages/${pageBuilderId}`,
        `/site-pages/${pageBuilderId}`,
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
          // Only skip on 404; other errors (auth, network) are fatal.
          if (e.message.includes("404") || e.message.includes("GHL GET 404")) {
            console.warn("[CF] 404 on", path, "— trying next candidate");
            continue;
          }
          throw e;
        }
      }

      // If no GET succeeded, still attempt PUT with best available path.
      // This handles pages that exist but return 404 on GET yet accept PUT.
      if (!workingPath) {
        workingPath = candidates[0];
        console.warn("[CF] No endpoint responded to GET — attempting PUT at", workingPath);
      }

      const putPayload = pageContext
        ? { ...pageContext, ...pageData }
        : pageData;

      // Build ordered list of PUT candidates.
      // Prefer the sniffed write endpoint, then the GET-derived working path,
      // then all remaining GET candidates as fallbacks.
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
          // Non-404 error is fatal — include all paths tried in the message.
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
