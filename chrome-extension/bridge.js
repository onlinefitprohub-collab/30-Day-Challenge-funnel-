// bridge.js v2.6.0 — Injected into the GHL page (MAIN world via content_scripts).
// Detects the page-builder URL context and emits CONTEXT_DETECTED to content.js.
// Copy/paste is now handled by background.js via chrome.scripting.executeScript().

(function cfBridge() {
  if (window.__cf_bridge_active) return;
  window.__cf_bridge_active = true;

  /* ─── URL parsing ──────────────────────────────────────────────────────── */
  function parseBuilderUrl(url) {
    try {
      const m = url.match(/\/location\/([^/?#]+)\/page-builder\/([^/?#]+)/i);
      if (m) return { locationId: m[1], pageBuilderId: m[2] };
    } catch {}
    return null;
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

  /* ─── Navigation observer (GHL is a SPA) ─────────────────────────────── */
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      checkUrl(lastUrl);
    }
  });
  observer.observe(document, { subtree: true, childList: true });

  window.addEventListener("popstate",  () => checkUrl(window.location.href));
  window.addEventListener("hashchange", () => checkUrl(window.location.href));

})();
