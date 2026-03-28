// bridge.js v2.11.0 — Injected into the GHL page (MAIN world via content_scripts).
// Detects the page-builder URL context and emits CONTEXT_DETECTED to content.js.
// Copy/paste is now handled by background.js via chrome.scripting.executeScript().
// v2.8.0: GHL API interceptor captures fetch/XHR responses including 500 error bodies.
// v2.9.0: Capture full request body for 201 responses.
// v2.10.0: Capture ALL POST/PUT/PATCH (any domain) so same-origin gohighlevel.com saves are caught.
// v2.11.0: Firebase Storage payload capture (alt=media reads). Page load error trap.

(function cfBridge() {
  if (window.__cf_bridge_active) return;
  window.__cf_bridge_active = true;

  /* ─── Page load error trap (v2.11.0) ──────────────────────────────────── *
   * Installed at document_start so we catch errors from GHL's app code.    *
   * Errors accumulate in window.__cfPageLoadErrors (array).                 */
  window.__cfPageLoadErrors = window.__cfPageLoadErrors || [];
  window.addEventListener("error", function(e) {
    window.__cfPageLoadErrors.push({
      msg:   e.message ? String(e.message).slice(0, 300) : "?",
      file:  e.filename ? String(e.filename).slice(0, 120) : "",
      line:  e.lineno,
      col:   e.colno,
      stack: e.error && e.error.stack ? String(e.error.stack).slice(0, 600) : "",
    });
    if (window.__cfPageLoadErrors.length > 50) window.__cfPageLoadErrors.shift();
  });
  window.addEventListener("unhandledrejection", function(e) {
    window.__cfPageLoadErrors.push({
      msg:   String(e.reason).slice(0, 300),
      stack: e.reason && e.reason.stack ? String(e.reason.stack).slice(0, 600) : "",
    });
    if (window.__cfPageLoadErrors.length > 50) window.__cfPageLoadErrors.shift();
  });

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

  /* ─── GHL API interceptor (v2.10.0) ─────────────────────────────────────── *
   * Captures GHL backend API calls (fetch + XHR) at MAIN world level.         *
   * Stores last 30 entries in window.__cfApiLog.                               *
   * v2.10.0 WIDENED FILTER:                                                   *
   *   POST/PUT/PATCH: captured from ANY domain (catches same-origin            *
   *     app.gohighlevel.com saves which our v2.9.0 filter missed).             *
   *   GET/HEAD: still restricted to leadconnectorhq.com to avoid log noise.   *
   * 201 responses: full req body (6000 chars), resp body (1200 chars).        *
   * Each entry: { ts, method, url, req, status, body, is201? }                */
  (function installApiInterceptor() {
    if (window.__cfApiInterceptorInstalled) return;
    window.__cfApiInterceptorInstalled = true;
    window.__cfApiLog = window.__cfApiLog || [];

    /* Noise-list: domains we never want even for POST/PUT/PATCH */
    var SKIP_DOMAINS = [
      "firebasestorage.googleapis.com",
      "analytics.google.com", "googletagmanager.com",
      "segment.io", "cdn.segment.com",
      "mixpanel.com", "sentry.io", "ingest.sentry.io",
      "hotjar.com", "intercom.io", "intercomcdn.com",
      "doubleclick.net", "facebook.com", "fbcdn.net",
    ];

    function shouldCapture(url, method) {
      if (!url) return false;
      var s = String(url);
      for (var i = 0; i < SKIP_DOMAINS.length; i++) {
        if (s.indexOf(SKIP_DOMAINS[i]) !== -1) return false;
      }
      var m = (method || "GET").toUpperCase();
      /* For GET/HEAD: only capture leadconnectorhq.com calls (low noise) */
      if (m === "GET" || m === "HEAD") {
        return s.indexOf("leadconnectorhq.com") !== -1;
      }
      /* For POST/PUT/PATCH/DELETE: capture all non-noise domains.
         This catches same-origin gohighlevel.com save calls that v2.9.0 missed. */
      return true;
    }

    function pushLog(entry) {
      window.__cfApiLog.push(entry);
      if (window.__cfApiLog.length > 30) window.__cfApiLog.shift();
    }

    /* ── Fetch interceptor ── */
    var origFetch = window.fetch;
    window.fetch = function(input, init) {
      var url = (input && typeof input === "object" && input.url) ? input.url : String(input);
      var method = (init && init.method) ? init.method.toUpperCase()
                 : (input && typeof input === "object" && input.method) ? input.method.toUpperCase()
                 : "GET";
      /* Capture full reqBody string now — we'll slice to appropriate length after
         we know the response status code (201 gets full body, others get 400 chars). */
      var reqBodyFull = (init && init.body) ? String(init.body) : "";

      /* v2.11.0: Firebase Storage payload capture — intercept alt=media reads so we
       * can inspect exactly what format GHL uses for its own pages.
       * These are excluded from shouldCapture (Firebase is in SKIP_DOMAINS) so we
       * handle them separately before the early-return below.                        */
      var isFbPayload = url.indexOf("firebasestorage.googleapis.com") !== -1 && url.indexOf("alt=media") !== -1;
      if (isFbPayload) {
        var fbProm = origFetch.apply(this, arguments);
        fbProm.then(function(resp) {
          var fbClone = resp.clone();
          fbClone.text().then(function(body) {
            try {
              var parsed = JSON.parse(body);
              window.__cfNativeFirebasePayload = {
                raw:            body.substring(0, 5000),
                sectionCount:   parsed.sections ? parsed.sections.length : 0,
                sec0HasElements: !!(parsed.sections && parsed.sections[0] && parsed.sections[0].elements),
                sec0ElementsLen: parsed.sections && parsed.sections[0] && parsed.sections[0].elements
                                   ? parsed.sections[0].elements.length : 0,
                sec0ElemKeys:   parsed.sections && parsed.sections[0] && parsed.sections[0].elements && parsed.sections[0].elements[0]
                                   ? Object.keys(parsed.sections[0].elements[0]).join(",") : "none",
                rowDictFormat:  parsed.rows ? JSON.stringify(Object.values(parsed.rows)[0]).substring(0, 200) : "no rows",
                rowCount:       parsed.rows    ? Object.keys(parsed.rows).length    : 0,
                colCount:       parsed.columns ? Object.keys(parsed.columns).length : 0,
                elemCount:      parsed.elements? Object.keys(parsed.elements).length: 0,
                capturedAt:     Date.now(),
              };
              window.__cfNativeFirebaseRaw = body.substring(0, 8000);
            } catch(fbErr) {
              window.__cfNativeFirebasePayload = { error: String(fbErr.message).slice(0, 200), raw: body.substring(0, 500) };
            }
          });
        }).catch(function() {});
        return fbProm;
      }

      if (!shouldCapture(url, method)) return origFetch.apply(this, arguments);
      var ts = Date.now();
      return origFetch.apply(this, arguments).then(function(resp) {
        var is201 = resp.status === 201;
        var reqSlice = is201 ? reqBodyFull.slice(0, 6000) : reqBodyFull.slice(0, 400);
        var bodyLimit = is201 ? 1200 : 500;
        var cloned = resp.clone();
        cloned.text().then(function(body) {
          var entry = { ts: ts, method: method, url: url.slice(0, 200), req: reqSlice, status: resp.status, body: body.slice(0, bodyLimit) };
          if (is201) entry.is201 = true;
          pushLog(entry);
        }).catch(function() {
          pushLog({ ts: ts, method: method, url: url.slice(0, 200), req: reqSlice, status: resp.status, body: "(read-err)" });
        });
        return resp;
      }).catch(function(err) {
        pushLog({ ts: ts, method: method, url: url.slice(0, 200), req: reqBodyFull.slice(0, 400), status: "net-err", body: String(err).slice(0, 200) });
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
        if (shouldCapture(_url, _method)) {
          var _ts = Date.now();
          /* Store full body string — slice after response */
          var _reqFull = body ? String(body) : "";
          xhr.addEventListener("loadend", function() {
            var is201 = xhr.status === 201;
            var _reqSlice = is201 ? _reqFull.slice(0, 6000) : _reqFull.slice(0, 400);
            var _bodyLimit = is201 ? 1200 : 500;
            var entry = { ts: _ts, method: _method, url: _url.slice(0, 200), req: _reqSlice, status: xhr.status, body: String(xhr.responseText || "").slice(0, _bodyLimit) };
            if (is201) entry.is201 = true;
            pushLog(entry);
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
