// bridge.js — Injected into the HighLevel page (MAIN world) to intercept network
// and detect the current page/funnel IDs being edited.
// Communicates back to the content script via window.postMessage.

(function cfBridge() {
  if (window.__cf_bridge_active) return;
  window.__cf_bridge_active = true;

  // Patterns that reveal a funnel page ID in the URL
  const PAGE_ID_PATTERNS = [
    /\/funnels\/funnel\/page\/([a-zA-Z0-9]+)/i,
    /\/funnels\/[^/]+\/pages\/([a-zA-Z0-9]+)/i,
    /\/page-builder\/([a-zA-Z0-9]+)/i,
    /\/pages\/([a-zA-Z0-9]+)/i,
    /pageId=([a-zA-Z0-9]+)/i,
  ];

  const FUNNEL_ID_PATTERNS = [
    /\/funnels\/([a-zA-Z0-9]+)(?:\/|$)/i,
    /funnelId=([a-zA-Z0-9]+)/i,
  ];

  const LOCATION_ID_PATTERNS = [
    /\/location\/([a-zA-Z0-9]+)/i,
    /locationId=([a-zA-Z0-9]+)/i,
  ];

  function extract(url, patterns) {
    for (const p of patterns) {
      const m = url.match(p);
      if (m && m[1]) return m[1];
    }
    return null;
  }

  function emit(pageId, funnelId, locationId, source) {
    window.postMessage({
      source: "cf-bridge",
      type: "CONTEXT_DETECTED",
      payload: { pageId, funnelId, locationId, source },
    }, "*");
  }

  // Also try from the current URL immediately
  function checkUrl(url) {
    const pageId    = extract(url, PAGE_ID_PATTERNS);
    const funnelId  = extract(url, FUNNEL_ID_PATTERNS);
    const locationId = extract(url, LOCATION_ID_PATTERNS);
    if (pageId || locationId) {
      emit(pageId, funnelId, locationId, "url");
    }
  }

  checkUrl(window.location.href);

  // Intercept fetch
  const _origFetch = window.fetch;
  window.fetch = async function(...args) {
    const url = typeof args[0] === "string" ? args[0]
              : args[0] instanceof URL ? args[0].toString()
              : args[0] instanceof Request ? args[0].url : "";

    const response = await _origFetch.apply(this, args);

    // Check if this is a funnel page call
    const pageId    = extract(url, PAGE_ID_PATTERNS);
    const funnelId  = extract(url, FUNNEL_ID_PATTERNS);
    const locationId = extract(url, LOCATION_ID_PATTERNS);

    if (pageId || (funnelId && locationId)) {
      emit(pageId, funnelId, locationId, "fetch");
    }

    return response;
  };

  // Intercept XHR
  const _origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    const urlStr = String(url);
    const pageId    = extract(urlStr, PAGE_ID_PATTERNS);
    const funnelId  = extract(urlStr, FUNNEL_ID_PATTERNS);
    const locationId = extract(urlStr, LOCATION_ID_PATTERNS);
    if (pageId || (funnelId && locationId)) {
      emit(pageId, funnelId, locationId, "xhr");
    }
    return _origOpen.apply(this, [method, url, ...rest]);
  };

  // Watch for SPA URL changes
  const _origPushState = history.pushState;
  history.pushState = function(...args) {
    const result = _origPushState.apply(this, args);
    setTimeout(() => checkUrl(window.location.href), 50);
    return result;
  };

  window.addEventListener("popstate", () => {
    setTimeout(() => checkUrl(window.location.href), 50);
  });
})();
