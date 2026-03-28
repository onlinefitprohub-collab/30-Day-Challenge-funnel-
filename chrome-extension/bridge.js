// bridge.js v2.8.0 — Injected into the GHL page (MAIN world via content_scripts).
// Detects the page-builder URL context and emits CONTEXT_DETECTED to content.js.
// Copy/paste is now handled by background.js via chrome.scripting.executeScript().
// v2.8.0: GHL API interceptor captures fetch/XHR responses including 500 error bodies.

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

  /* ─── GHL API interceptor (v2.8.0) ──────────────────────────────────────── *
   * Captures GHL backend API calls (fetch + XHR) at MAIN world level.         *
   * Stores last 20 entries in window.__cfApiLog.                               *
   * Filter: *.leadconnectorhq.com/funnels/* only (skip Firebase storage).     *
   * Used by CF_GET_API_LOG (background.js) to surface 500 error bodies,       *
   * page-save API format, and clone API endpoints in the popup.               */
  (function installApiInterceptor() {
    if (window.__cfApiInterceptorInstalled) return;
    window.__cfApiInterceptorInstalled = true;
    window.__cfApiLog = window.__cfApiLog || [];

    function shouldCapture(url) {
      if (!url) return false;
      var s = String(url);
      if (s.indexOf("firebasestorage.googleapis.com") !== -1) return false;
      return s.indexOf("leadconnectorhq.com") !== -1 && s.indexOf("/funnels") !== -1;
    }

    function pushLog(entry) {
      window.__cfApiLog.push(entry);
      if (window.__cfApiLog.length > 20) window.__cfApiLog.shift();
    }

    /* ── Fetch interceptor ── */
    var origFetch = window.fetch;
    window.fetch = function(input, init) {
      var url = (input && typeof input === "object" && input.url) ? input.url : String(input);
      var method = (init && init.method) ? init.method.toUpperCase() : "GET";
      var reqBody = (init && init.body) ? String(init.body).slice(0, 400) : "";
      if (!shouldCapture(url)) return origFetch.apply(this, arguments);
      var ts = Date.now();
      return origFetch.apply(this, arguments).then(function(resp) {
        var cloned = resp.clone();
        cloned.text().then(function(body) {
          pushLog({ ts: ts, method: method, url: url.slice(0, 200), req: reqBody, status: resp.status, body: body.slice(0, 500) });
        }).catch(function() {
          pushLog({ ts: ts, method: method, url: url.slice(0, 200), req: reqBody, status: resp.status, body: "(read-err)" });
        });
        return resp;
      }).catch(function(err) {
        pushLog({ ts: ts, method: method, url: url.slice(0, 200), req: reqBody, status: "net-err", body: String(err).slice(0, 200) });
        throw err;
      });
    };

    /* ── XHR interceptor ── */
    var OrigXHR = window.XMLHttpRequest;
    function PatchedXHR() {
      var xhr = new OrigXHR();
      var _method = "GET", _url = "";
      var _origOpen = xhr.open.bind(xhr);
      var _origSend = xhr.send.bind(xhr);
      xhr.open = function(method, url) {
        _method = (method || "GET").toUpperCase();
        _url    = String(url || "");
        return _origOpen.apply(xhr, arguments);
      };
      xhr.send = function(body) {
        if (shouldCapture(_url)) {
          var _ts = Date.now();
          var _req = body ? String(body).slice(0, 400) : "";
          xhr.addEventListener("loadend", function() {
            pushLog({ ts: _ts, method: _method, url: _url.slice(0, 200), req: _req, status: xhr.status, body: String(xhr.responseText || "").slice(0, 500) });
          });
        }
        return _origSend.apply(xhr, arguments);
      };
      return xhr;
    }
    PatchedXHR.prototype = OrigXHR.prototype;
    window.XMLHttpRequest = PatchedXHR;
  })();

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
