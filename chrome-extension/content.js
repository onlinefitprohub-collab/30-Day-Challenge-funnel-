// content.js v2.49.4 — Challenge Funnel in a Box
// On app pages (*.replit.*): intercepts CF_SAVE_PAGE and CF_SAVE_URL_PAGE and saves
//   pageData to chrome.storage.session (cf_copied_page). CF_SAVE_PAGE also writes
//   chrome.storage.local (cfReady) for the popup.
// On GHL pages: shows a minimal orange FAB. Click it to paste the copied page
//   directly into the builder — no panel, no separate inject button.

(function () {
  "use strict";

  // Version-specific guard: when the extension updates, the new version string
  // doesn't match the old one, so the new content.js always replaces the old one
  // in already-open tabs (no manual page reload needed after extension update).
  if (window.__cfExtLoaded === "2.63.0") return;
  window.__cfExtLoaded = "2.63.0";

  var IS_GHL = window.location.hostname.endsWith("gohighlevel.com");

  /* ─── CF_SAVE_PAGE handler (runs on our app pages) ──────────────────────
   * The app sends page data via postMessage; we cache it for later pasting.
   * ─────────────────────────────────────────────────────────────────────── */
  window.addEventListener("message", function(evt) {
    // Accept CF_SAVE_PAGE from same window OR from child frames (e.g. when the app
    // is embedded inside a Replit project-preview iframe on replit.com/@user/...).
    // We validate by checking source/type fields instead of evt.source identity.
    if (!evt.data || evt.data.source !== "cf-app" || evt.data.type !== "CF_SAVE_PAGE") return;

    var _payload = evt.data.payload || {};
    var requestId = _payload.requestId;
    var projectId = _payload.projectId;
    var page = _payload.page;
    var pageData = _payload.pageData;
    var challengeConcept = _payload.challengeConcept;
    var appUrl = _payload.appUrl;
    if (!page || !pageData) return;

    var PAGE_NAMES = { landing: "Landing Page", optin: "Opt-In Form", thankyou: "Thank You Page", booking: "Booking Page" };

    var ready = {
      projectId: projectId || "",
      appUrl:    appUrl || window.location.origin,
      challengeConcept: challengeConcept || "Challenge Funnel",
      page: page,
      pageData: pageData,
      loadedAt: Date.now(),
    };

    var sessionCopy = {
      type:      "ai-inject",
      page: page,
      pageName:  PAGE_NAMES[page] || page || "AI Page",
      pageData: pageData,
      projectId: projectId || "",
      appUrl:    appUrl || window.location.origin,
      copiedAt:  Date.now(),
    };

    chrome.storage.local.set({ cfReady: ready }, function() {
      chrome.storage.session.set({ cf_copied_page: sessionCopy }, function() {
        window.postMessage(
          { source: "cf-ext", type: "CF_SAVE_ACK", payload: { requestId: requestId, page: page, success: true } },
          "*"
        );
      });
    });
  });

  /* ─── CF_GET_CAPTURED_GHL handler (runs on app pages) ───────────────────
   * App sends { source: "cf-app", type: "CF_GET_CAPTURED_GHL" }.
   * We forward to background, then postMessage the result back to the page.
   * ─────────────────────────────────────────────────────────────────────── */
  window.addEventListener("message", function(evt) {
    if (!evt.data || evt.data.source !== "cf-app") return;
    var t = evt.data.type;

    if (t === "CF_PING") {
      window.postMessage({ source: "cf-ext", type: "CF_PONG", version: "2.63.0" }, "*");
    }

    if (t === "CF_PERSIST_CAPTURED_GHL") {
      var capturedPage = evt.data.payload;
      if (capturedPage && typeof capturedPage === "object") {
        chrome.storage.local.set({ capturedGHLPage: capturedPage }, function() {
          window.postMessage(
            { source: "cf-ext", type: "CF_PERSIST_CAPTURED_GHL_ACK", payload: { ok: true } },
            "*"
          );
        });
      }
    }

    if (t === "CF_GET_CAPTURED_GHL") {
      chrome.runtime.sendMessage({ type: "CF_GET_CAPTURED_GHL" }, function(result) {
        window.postMessage(
          { source: "cf-ext", type: "CF_CAPTURED_GHL_DATA", payload: result || { ok: false, capturedGHLPage: null } },
          "*"
        );
      });
    }

    if (t === "CF_CLEAR_CAPTURED_GHL") {
      chrome.runtime.sendMessage({ type: "CF_CLEAR_CAPTURED_GHL" });
    }

    if (t === "CF_GET_CLONE_BASELINE") {
      chrome.runtime.sendMessage({ type: "CF_GET_CLONE_BASELINE" }, function(result) {
        window.postMessage(
          { source: "cf-ext", type: "CF_CLONE_BASELINE_DATA", payload: result || { ok: false, baseline: null } },
          "*"
        );
      });
    }

    if (t === "CF_CLEAR_CLONE_BASELINE") {
      chrome.runtime.sendMessage({ type: "CF_CLEAR_CLONE_BASELINE" });
    }

    if (t === "CF_FETCH_URL_PAGE") {
      chrome.runtime.sendMessage({ type: "CF_FETCH_URL_PAGE", url: evt.data.url }, function(result) {
        window.postMessage(
          { source: "cf-ext", type: "CF_URL_PAGE_DATA", payload: result || { ok: false, error: "no_response" } },
          "*"
        );
      });
    }

    if (t === "CF_SAVE_URL_PAGE") {
      var _p2 = evt.data.payload || {};
      var _pageData = _p2.pageData;
      var _pageName = _p2.pageName;
      var _funnelId = _p2.funnelId;
      var _locationId = _p2.locationId;
      var _requestId = _p2.requestId;
      if (!_pageData) return;
      var sessionCopy2 = {
        type:       "url-clone",
        pageName:   _pageName  || "Captured GHL Page",
        pageData: _pageData,
        funnelId:   _funnelId  || "",
        locationId: _locationId || "",
        copiedAt:   Date.now(),
      };
      chrome.storage.session.set({ cf_copied_page: sessionCopy2 }, function() {
        window.postMessage(
          { source: "cf-ext", type: "CF_URL_CLONE_ACK", payload: { requestId: _requestId, success: true } },
          "*"
        );
      });
    }
  });

  /* ─── Blind-spot 3: Two-phase o.off tracking ────────────────────────────
   * bridge.js (document_start, MAIN world) installs window.onerror BEFORE
   * any GHL code runs and buffers CF_OOFF_EVENT events in window.__cfOoffQueue.
   * We drain that queue on startup (catching errors that fired before we were
   * attached), then continue listening via postMessage for later ones.
   * CF_INJECT_DONE is postMessaged by background (via executeScript) once the
   * Firebase write succeeds. We use seenBeforeInject / seenAfterInject booleans
   * so overwriting a later event cannot corrupt an earlier pre-existing record.  */
  var _cfInjectDone      = false;
  var _cfOoffSeenBefore  = false; // any o.off before inject
  var _cfOoffSeenAfter   = false; // any o.off after inject
  var _cfOoffFirstSample = null;  // first event ever (for display)

  function _cfHandleOoffEvent(d) {
    if (!_cfOoffFirstSample) {
      _cfOoffFirstSample = { msg: d.msg, src: d.src, line: d.line };
    }
    if (!_cfInjectDone) {
      _cfOoffSeenBefore = true;
    } else {
      _cfOoffSeenAfter = true;
    }
    /* Send structured update every time so background has current booleans */
    try {
      chrome.runtime.sendMessage({
        type:            "CF_OOFF_ERROR",
        msg:             d.msg,
        src:             d.src,
        line:            d.line,
        seenBeforeInject: _cfOoffSeenBefore,
        seenAfterInject:  _cfOoffSeenAfter,
        /* preExisting: true if errors appeared ONLY before inject (not after) */
        preExisting:     _cfOoffSeenBefore && !_cfOoffSeenAfter,
      });
    } catch (_) {}
  }

  /* Drain buffer of events that fired at document_start (before we were attached) */
  try {
    var _cfQueue = window.__cfOoffQueue;
    if (Array.isArray(_cfQueue)) {
      for (var _cfQi = 0; _cfQi < _cfQueue.length; _cfQi++) _cfHandleOoffEvent(_cfQueue[_cfQi]);
      window.__cfOoffQueue = [];
    }
  } catch (_) {}

  /* ─── Network sniffer relay + bridge event relay ────────────────────────
   * bridge (source:"cf-bridge"):   CF_OOFF_EVENT, CF_INJECT_DONE
   * network sniffer (source:"cf-network-sniffer"): CF_GHL_BACKEND_ERROR     */
  window.addEventListener("message", function(evt) {
    if (!evt.data) return;
    var d = evt.data;

    /* ── bridge.js events ── */
    if (d.source === "cf-bridge") {
      if (d.type === "CF_OOFF_EVENT") _cfHandleOoffEvent(d);
      if (d.type === "CF_INJECT_DONE") _cfInjectDone = true;
      if (d.type === "CF_NATIVE_FIREBASE_RAW" && typeof d.raw === "string") {
        chrome.storage.local.set({ cfNativeFirebaseRaw: d.raw });
      }
      if (d.type === "CF_VUE_ERRORS" && Array.isArray(d.errors)) {
        try { chrome.runtime.sendMessage({ type: "CF_VUE_ERRORS", errors: d.errors }); } catch (_) {}
      }
      return;
    }

    /* ── network sniffer events (fetch interceptor injected post-reload) ── */
    if (d.source === "cf-network-sniffer") {
      if (d.type === "CF_GHL_BACKEND_ERROR") {
        try {
          chrome.runtime.sendMessage({ type: "CF_GHL_BACKEND_ERROR",
            status: d.status, url: d.url, body: d.body });
        } catch (_) {}
      }
    }
  });

  /* ─── GHL-only from here on ──────────────────────────────────────────── */
  if (!IS_GHL) return;

  /* ─── Inject bridge.js into main world ──────────────────────────────── */
  function injectBridge() {
    if (document.getElementById("cf-bridge-script")) return;
    var s = document.createElement("script");
    s.id  = "cf-bridge-script";
    s.src = chrome.runtime.getURL("bridge.js");
    (document.head || document.documentElement).appendChild(s);
  }

  /* ─── Post-reload fetch sniffer (injected into MAIN world via <script> tag) *
   * Same logic as _cf_injectFetchSniffer in background.js — used after a hard *
   * page reload where executeScript cannot reach the new document.            *
   * onerror is handled by bridge.js (document_start); only fetch is patched.  */
  var CF_SNIFF_CODE = `(function(){
    //# sourceURL=cf-sniff-inject.js
    if(window.__cfFetchSniffInstalled)return;
    window.__cfFetchSniffInstalled=true;
    var origFetch=window.fetch;
    function cleanup(){window.fetch=origFetch;window.__cfFetchSniffInstalled=false;}
    var sniffTimer=setTimeout(cleanup,20000);
    window.fetch=function(){
      var args=Array.prototype.slice.call(arguments);
      return origFetch.apply(this,args).then(function(response){
        var url=typeof args[0]==='string'?args[0]:(args[0]&&args[0].url?args[0].url:'');
        if((url.indexOf('backend.leadconnectorhq.com')!==-1||
            url.indexOf('leadconnecto')!==-1)&&response.status>=400){
          try{
            var clone=response.clone();
            clone.text().then(function(body){
              clearTimeout(sniffTimer);cleanup();
              window.postMessage({source:'cf-network-sniffer',type:'CF_GHL_BACKEND_ERROR',
                status:response.status,url:url.slice(0,120),body:body.slice(0,500)},'*');
            });
          }catch(e){}
        }
        return response;
      });
    };
  })();`;

  function injectSniff() {
    if (document.getElementById("cf-sniff-script")) return;
    var s = document.createElement("script");
    s.id = "cf-sniff-script";
    s.textContent = CF_SNIFF_CODE;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  }

  function checkAndInjectSniff() {
    try {
      /* Ask background whether THIS tab is the armed sniffer tab.
       * Background clears the flag on first successful claim, so only
       * the correct tab gets the sniffer even if multiple tabs load GHL. */
      chrome.runtime.sendMessage({ type: "CF_SNIFF_CLAIM" }, function(resp) {
        if (chrome.runtime.lastError) return;
        if (resp && resp.claimed) injectSniff();
      });
    } catch (_) {}
  }

  /* ─── Mount ─────────────────────────────────────────────────────────── */
  function mount() {
    injectBridge();
    checkAndInjectSniff();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

})();
