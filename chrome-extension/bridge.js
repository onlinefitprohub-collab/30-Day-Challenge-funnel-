// bridge.js v2.7.0 — Injected into the GHL page (MAIN world via content_scripts).
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

  /* ─── Blind-spot 3: o.off baseline onerror (MAIN world, document_start) ─ *
   * Installs window.onerror immediately — before GHL app code runs — so we  *
   * capture "o.off is not a function" errors at FunnelBuilderApp from the    *
   * first millisecond. Events are buffered in window.__cfOoffQueue until     *
   * content.js attaches its listener (document_end); content.js drains the  *
   * queue on startup so no early events are lost.                             */
  (function installOoffSniffer() {
    if (window.__cfOoffSnifferInstalled) return;
    window.__cfOoffSnifferInstalled = true;
    window.__cfOoffQueue = window.__cfOoffQueue || [];
    var origOnError = window.onerror;
    window.onerror = function(msg, src, line, col, err) {
      if (msg && (msg.indexOf("o.off") !== -1 || msg.indexOf("is not a function") !== -1) &&
          src && src.indexOf("FunnelBuilderApp") !== -1) {
        var event = {
          source: "cf-bridge",
          type:   "CF_OOFF_EVENT",
          msg:    String(msg).slice(0, 200),
          src:    String(src).slice(0, 120),
          line:   line,
          ts:     Date.now(),
        };
        /* Buffer and also postMessage (in case content.js is already attached) */
        window.__cfOoffQueue.push(event);
        window.postMessage(event, "*");
      }
      if (origOnError) return origOnError.apply(this, arguments);
      return false;
    };
  })();

})();
