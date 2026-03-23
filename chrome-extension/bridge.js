// bridge.js — Injected into the HighLevel page (MAIN world).
// Detects the page-builder context from the URL / window globals,
// and executes the actual GHL injection using the page's own
// authenticated HTTP service (revexBackendService) — no API key needed.
// Communicates with content.js (extension world) via window.postMessage.

(function cfBridge() {
  if (window.__cf_bridge_active) return;
  window.__cf_bridge_active = true;

  const GHL_API = "https://backend.leadconnectorhq.com";

  /* ─── URL parsing ─────────────────────────────────────────────────────── */
  // GHL page builder URL: /location/{locationId}/page-builder/{pageBuilderId}
  function parseBuilderUrl(url) {
    try {
      const m = url.match(/\/location\/([^/]+)\/page-builder\/([^/]+)/i);
      if (m) return { locationId: m[1], pageBuilderId: m[2] };
    } catch {}
    return null;
  }

  function getLocationId() {
    // Prefer URL, fall back to GHL's own window.attribution global
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
    // Not a page-builder URL — try window.attribution as last resort
    const locId = window?.attribution?.locationId;
    if (locId) emit(null, locId, "attribution");
  }

  // Run immediately on load
  checkUrl(window.location.href);

  /* ─── Intercept fetch/XHR to catch late context clues ─────────────────── */
  // GHL loads page data via its own axios calls; we watch for any response
  // that reveals the pageBuilderId so content.js can show the inject button.
  const PAGE_BUILDER_RE = /\/page-builder\/([^/?]+)/i;
  const LOCATION_RE     = /\/location\/([^/?]+)/i;

  const _origFetch = window.fetch;
  window.fetch = async function (...args) {
    const url = typeof args[0] === "string" ? args[0]
              : args[0] instanceof URL      ? args[0].toString()
              : args[0] instanceof Request  ? args[0].url : "";

    const response = await _origFetch.apply(this, args);

    const pbMatch  = url.match(PAGE_BUILDER_RE);
    const locMatch = url.match(LOCATION_RE);
    if (pbMatch?.[1] || locMatch?.[1]) {
      emit(pbMatch?.[1] || null, locMatch?.[1] || getLocationId(), "fetch");
    }

    return response;
  };

  const _origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    const urlStr   = String(url);
    const pbMatch  = urlStr.match(PAGE_BUILDER_RE);
    const locMatch = urlStr.match(LOCATION_RE);
    if (pbMatch?.[1] || locMatch?.[1]) {
      emit(pbMatch?.[1] || null, locMatch?.[1] || getLocationId(), "xhr");
    }
    return _origOpen.apply(this, [method, url, ...rest]);
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
  // GHL's Vue app exposes its own authenticated axios instance.
  // Using it means no API key — the session is already there.
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
      throw new Error(`GHL GET: HTTP ${res?.status}`);
    }
    const res = await fetch(`${GHL_API}${path}`, {
      method:      "GET",
      credentials: "include",
      headers:     { "Content-Type": "application/json" },
    });
    if (res.ok) return res.json();
    const text = await res.text().catch(() => "");
    throw new Error(`GHL GET: HTTP ${res.status}${text ? " — " + text.slice(0, 120) : ""}`);
  }

  async function ghlPut(path, body) {
    const revex = getRevex();
    if (revex) {
      const res = await revex.put(`${GHL_API}${path}`, body);
      if (res?.status >= 200 && res?.status < 300) return { ok: true };
      throw new Error(`GHL PUT: HTTP ${res?.status}`);
    }
    const res = await fetch(`${GHL_API}${path}`, {
      method:      "PUT",
      credentials: "include",
      headers:     { "Content-Type": "application/json" },
      body:        JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    const text = await res.text().catch(() => "");
    throw new Error(`GHL PUT: HTTP ${res.status}${text ? " — " + text.slice(0, 120) : ""}`);
  }

  /* ─── Handle CF_DO_INJECT from content.js ─────────────────────────────── */
  window.addEventListener("message", async (evt) => {
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
      // Step 1: GET current page context (funnelId, stepId, existing shape)
      // so we can confirm the endpoint works and include context if GHL needs it.
      let pageContext = null;
      try {
        pageContext = await ghlGet(`/funnels/page/${pageBuilderId}`);
      } catch (getErr) {
        // Non-fatal: if GET fails (e.g. different GHL version), log and continue.
        // We still attempt the PUT with the pageData we have.
        console.warn("[CF] GET page context failed:", getErr.message);
      }

      // Step 2: Build the PUT payload — include context fields GHL expects
      // alongside our generated content structure.
      const putPayload = pageContext
        ? { ...pageContext, ...pageData }
        : pageData;

      // Step 3: PUT the updated page content
      await ghlPut(`/funnels/page/${pageBuilderId}`, putPayload);

      // Step 4: Reload the builder iframe so the new content is visible
      const iframe = document.querySelector('[name="funnel-builder"]');
      if (iframe) iframe.src = iframe.src;

      reply(true);
    } catch (e) {
      reply(false, e.message);
    }
  });

})();
