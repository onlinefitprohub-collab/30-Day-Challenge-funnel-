"use strict";
(() => {
  // clonelevel/src/content/bridge/page-bridge-runtime.ts
  (function pageBridgeRuntime() {
    if (window.__clonelevel_bridge_active) return;
    window.__clonelevel_bridge_active = true;
    const BRIDGE_SOURCE = "clonelevel-page-bridge";
    const CONTENT_SOURCE = "clonelevel-content";
    const MAX_BODY_SIZE = 10 * 1024;
    const MAX_RAW_LOG = 10;
    let inspectorEnabled = false;
    let debugMode = false;
    let interceptCount = 0;
    let sentCount = 0;
    let rawFetchSeen = 0;
    let rawXhrSeen = 0;
    let rawBeaconSeen = 0;
    let rawWsSeen = 0;
    let filteredOutCount = 0;
    let saveMarkTs = null;
    let _origFetch = window.fetch;
    let _origXhrOpen = XMLHttpRequest.prototype.open;
    let _origXhrSend = XMLHttpRequest.prototype.send;
    let _origBeacon = navigator.sendBeacon ? navigator.sendBeacon.bind(navigator) : null;
    const patchStatus = {
      fetch: false,
      fetchError: "",
      xhr: false,
      xhrError: "",
      beacon: false,
      beaconError: "",
      ws: false,
      wsError: "",
      attempted: false,
      completedAt: ""
    };
    const ds = document.documentElement.dataset;
    function syncDom() {
      ds.clFetchPatched = patchStatus.fetch ? "1" : "0";
      ds.clXhrPatched = patchStatus.xhr ? "1" : "0";
      ds.clBeaconPatched = patchStatus.beacon ? "1" : "0";
      ds.clWsPatched = patchStatus.ws ? "1" : "0";
      ds.clPatchAttempted = patchStatus.attempted ? "1" : "0";
      if (patchStatus.fetchError) ds.clFetchErr = patchStatus.fetchError.slice(0, 80);
      if (patchStatus.xhrError) ds.clXhrErr = patchStatus.xhrError.slice(0, 80);
      if (patchStatus.beaconError) ds.clBeaconErr = patchStatus.beaconError.slice(0, 80);
      if (patchStatus.wsError) ds.clWsErr = patchStatus.wsError.slice(0, 80);
    }
    ds.clBridgeActive = "1";
    ds.clBridgeEnabled = "0";
    ds.clDebugMode = "0";
    ds.clInterceptCount = "0";
    ds.clSentCount = "0";
    ds.clRawFetch = "0";
    ds.clRawXhr = "0";
    ds.clRawBeacon = "0";
    ds.clRawWs = "0";
    ds.clFiltered = "0";
    ds.clBridgeMsgLog = "";
    ds.clRawLog = "[]";
    ds.clSaveMark = "";
    syncDom();
    const rawLog = [];
    function pushRaw(e) {
      rawLog.push(e);
      if (rawLog.length > MAX_RAW_LOG) rawLog.shift();
      try {
        ds.clRawLog = JSON.stringify(rawLog);
      } catch {
      }
    }
    const recentMsgTypes = [];
    function recordMsgType(t) {
      recentMsgTypes.push(t);
      if (recentMsgTypes.length > 5) recentMsgTypes.shift();
      ds.clBridgeMsgLog = recentMsgTypes.join(",");
    }
    function sendToBridge(type, payload) {
      window.postMessage({ source: BRIDGE_SOURCE, type, payload }, "*");
    }
    function nowHMS() {
      const d = /* @__PURE__ */ new Date();
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}.${String(d.getMilliseconds()).padStart(3, "0")}`;
    }
    function isSaveMarkNear() {
      return saveMarkTs ? Date.now() - new Date(saveMarkTs).getTime() < 5e3 : false;
    }
    function truncUrl(u) {
      return u.length > 90 ? u.slice(0, 90) + "\u2026" : u;
    }
    function truncBody(s) {
      return s.length > MAX_BODY_SIZE ? s.slice(0, MAX_BODY_SIZE) + "\u2026[truncated]" : s;
    }
    function generateId() {
      return `snap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }
    const INTERESTING = [
      /\/sites\/.*\/builder/i,
      /\/page(?:s)?\/save/i,
      /\/page(?:s)?\/load/i,
      /\/page(?:s)?\/publish/i,
      /\/funnel.*\/save/i,
      /\/funnel.*\/load/i,
      /\/builder\/.*\/publish/i,
      /\/api\/v\d+\/pages?\//i,
      /\/api\/v\d+\/funnel/i,
      /\/api\/v\d+\/sites/i,
      /\/v1\/page\//i,
      /\/v1\/funnel\//i,
      /services\/pages/i,
      /services\/funnel/i,
      /\/element(?:s)?(?:\/|$)/i,
      /\/page-builder\//i,
      /\/funnels\//i,
      /graphql/i
    ];
    const NOISE = [
      /analytics/i,
      /gtm\./i,
      /google-analytics/i,
      /segment\.io/i,
      /mixpanel/i,
      /amplitude/i,
      /hotjar/i,
      /intercom/i,
      /sentry/i,
      /datadog/i,
      /\.(png|jpg|jpeg|gif|svg|woff2?|css)(\?|$)/i,
      /favicon/i
    ];
    function filterDecision(url) {
      if (debugMode) {
        const isHL = INTERESTING.some((p) => p.test(url));
        const isNoise = NOISE.some((p) => p.test(url));
        return { pass: true, label: isHL ? "hl-match" : isNoise ? "likely-noise" : "unknown" };
      }
      const pass = INTERESTING.some((p) => p.test(url));
      return { pass, label: pass ? "hl-match" : "no-pattern-match" };
    }
    function looksLikeStructure(body) {
      try {
        const obj = JSON.parse(body);
        if (typeof obj !== "object" || obj === null) return false;
        return ["elements", "sections", "components", "blocks", "content", "rows", "columns", "pages", "steps", "nodes", "items", "children", "data", "body"].some((k) => k in obj);
      } catch {
        return false;
      }
    }
    function detectBuilderFamily() {
      const cls = /* @__PURE__ */ new Set();
      document.querySelectorAll("[class]").forEach((el) => el.classList.forEach((c) => cls.add(c)));
      if (cls.has("hl-page-builder") || cls.has("hl-builder-canvas") || document.querySelector("[data-page-builder]")) return "new-builder";
      if (cls.has("elFont") || cls.has("containerWrapper") || document.getElementById("sections")) return "legacy-builder";
      return "highlevel";
    }
    function emitPayload(info) {
      if (!inspectorEnabled) return;
      interceptCount++;
      sentCount++;
      ds.clInterceptCount = String(interceptCount);
      ds.clSentCount = String(sentCount);
      const snap = {
        id: generateId(),
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        tabUrl: window.location.href,
        builderFamily: detectBuilderFamily(),
        requestUrl: info.requestUrl,
        method: info.method.toUpperCase(),
        statusCode: info.statusCode,
        payloadSize: info.body.length,
        looksLikeStructure: looksLikeStructure(info.body),
        rawBody: truncBody(info.body),
        contentType: info.contentType,
        transport: info.transport,
        nearSaveMark: isSaveMarkNear()
      };
      console.log(`[CloneLevel] \u2714 EMIT ${info.transport} ${info.method} ${info.requestUrl.slice(0, 70)} sz=${info.body.length}`);
      sendToBridge("PAYLOAD_CAPTURED", snap);
    }
    function tryAssign(doAssign, verify) {
      try {
        doAssign();
        if (verify()) return { ok: true, error: "" };
      } catch (e1) {
        try {
          doAssign();
          if (verify()) return { ok: true, error: "" };
        } catch {
        }
        return { ok: false, error: String(e1).slice(0, 120) };
      }
      return { ok: false, error: "assignment succeeded but reference unchanged (non-writable)" };
    }
    function installNetworkInterceptors() {
      patchStatus.attempted = true;
      console.log("[CloneLevel] installNetworkInterceptors() \u2014 called. patchStatus before:", JSON.stringify(patchStatus));
      if (!patchStatus.fetch) {
        const orig = _origFetch ?? window.fetch;
        if (!orig) {
          console.warn("[CloneLevel] window.fetch not available \u2014 skipping fetch patch");
        } else {
          _origFetch = orig;
        }
        if (orig) {
          const patchedFetch = async function(...args) {
            const req = args[0];
            const init = args[1];
            let url = "";
            let method = "GET";
            let reqBody = "";
            if (typeof req === "string") url = req;
            else if (req instanceof URL) url = req.toString();
            else if (req instanceof Request) {
              url = req.url;
              method = req.method;
            }
            if (init?.method) method = init.method;
            if (init?.body) {
              try {
                reqBody = typeof init.body === "string" ? init.body : JSON.stringify(init.body);
              } catch {
              }
            }
            rawFetchSeen++;
            ds.clRawFetch = String(rawFetchSeen);
            const ts = nowHMS();
            const sm = isSaveMarkNear();
            console.log(`[CloneLevel] FETCH #${rawFetchSeen}: ${method} ${url.slice(0, 80)}`);
            const response = await orig.apply(this, args);
            if (url.includes("prebuilt-section") && reqBody) {
              try {
                window.postMessage({
                  source: "clonelevel-page-bridge",
                  type: "PREBUILT_REQUEST_CAPTURED",
                  payload: {
                    url,
                    method,
                    reqBody,
                    statusCode: response.status,
                    ts: Date.now()
                  }
                }, "*");
                console.log(
                  `[CloneLevel] PREBUILT_REQUEST_CAPTURED HTTP ${response.status} bodyLen=${reqBody.length} url=${url.slice(0, 80)}`
                );
              } catch (_e) {
              }
            }
            const { pass, label } = filterDecision(url);
            if (!pass) {
              filteredOutCount++;
              ds.clFiltered = String(filteredOutCount);
              pushRaw({ t: "fetch", m: method, u: truncUrl(url), b: !!reqBody, f: true, r: label, ts, sm });
              return response;
            }
            pushRaw({ t: "fetch", m: method, u: truncUrl(url), b: !!reqBody, f: false, r: label, ts, sm });
            if (inspectorEnabled) {
              try {
                const text = await response.clone().text().catch(() => "");
                emitPayload({ requestUrl: url, method, statusCode: response.status, body: text || reqBody, contentType: response.headers.get("content-type") || "", transport: "fetch" });
              } catch (err) {
                console.warn("[CloneLevel] fetch body read error", err);
              }
            }
            return response;
          };
          let fetchOk = false;
          try {
            window.fetch = patchedFetch;
            fetchOk = window.fetch === patchedFetch;
            if (!fetchOk) {
              Object.defineProperty(window, "fetch", { value: patchedFetch, writable: true, configurable: true });
              fetchOk = window.fetch === patchedFetch;
            }
          } catch (e1) {
            try {
              Object.defineProperty(window, "fetch", { value: patchedFetch, writable: true, configurable: true });
              fetchOk = window.fetch === patchedFetch;
            } catch (e2) {
              patchStatus.fetchError = `assign:${String(e1).slice(0, 60)} define:${String(e2).slice(0, 60)}`;
            }
          }
          patchStatus.fetch = fetchOk;
          if (fetchOk) console.log("[CloneLevel] \u2714 fetch patched (verified by ref)");
          else console.error("[CloneLevel] \u2717 fetch patch FAILED. error:", patchStatus.fetchError);
        }
      }
      if (!patchStatus.xhr) {
        const origOpen = _origXhrOpen ?? XMLHttpRequest.prototype.open;
        const origSend = _origXhrSend ?? XMLHttpRequest.prototype.send;
        _origXhrOpen = origOpen;
        _origXhrSend = origSend;
        try {
          XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this.__cl_url = url.toString();
            this.__cl_method = method;
            return origOpen.apply(this, [method, url, ...rest]);
          };
          XMLHttpRequest.prototype.send = function(body) {
            const xhr = this;
            const url = xhr.__cl_url || "";
            const method = xhr.__cl_method || "GET";
            rawXhrSeen++;
            ds.clRawXhr = String(rawXhrSeen);
            const ts = nowHMS();
            console.log(`[CloneLevel] XHR #${rawXhrSeen}: ${method} ${url.slice(0, 80)}`);
            const { pass, label } = filterDecision(url);
            xhr.addEventListener("loadend", function() {
              const sm = isSaveMarkNear();
              if (!pass) {
                filteredOutCount++;
                ds.clFiltered = String(filteredOutCount);
                pushRaw({ t: "xhr", m: method, u: truncUrl(url), b: !!body, f: true, r: label, ts, sm });
                return;
              }
              pushRaw({ t: "xhr", m: method, u: truncUrl(url), b: !!body, f: false, r: label, ts, sm });
              if (inspectorEnabled) {
                try {
                  const combined = xhr.responseText || (body && typeof body === "string" ? body : "");
                  emitPayload({ requestUrl: url, method, statusCode: xhr.status || null, body: combined, contentType: xhr.getResponseHeader("content-type") || "", transport: "xhr" });
                } catch (err) {
                  console.warn("[CloneLevel] XHR body read error", err);
                }
              }
            });
            return origSend.apply(this, [body]);
          };
          const xhrOk = XMLHttpRequest.prototype.send !== origSend;
          patchStatus.xhr = xhrOk;
          if (xhrOk) console.log("[CloneLevel] \u2714 XHR patched (verified by ref)");
          else console.error("[CloneLevel] \u2717 XHR send ref unchanged after assignment");
        } catch (err) {
          patchStatus.xhrError = String(err).slice(0, 120);
          console.error("[CloneLevel] \u2717 XHR patch FAILED:", err);
        }
      }
      if (!patchStatus.beacon) {
        const origBeacon = _origBeacon ?? (navigator.sendBeacon ? navigator.sendBeacon.bind(navigator) : null);
        if (!origBeacon) {
          console.warn("[CloneLevel] navigator.sendBeacon not available \u2014 skipping beacon patch");
        } else {
          _origBeacon = origBeacon;
        }
        if (origBeacon) try {
          const patchedBeacon = function(url, data) {
            rawBeaconSeen++;
            ds.clRawBeacon = String(rawBeaconSeen);
            const ts = nowHMS();
            const sm = isSaveMarkNear();
            console.log(`[CloneLevel] BEACON #${rawBeaconSeen}: ${url.slice(0, 80)}`);
            const { pass, label } = filterDecision(url);
            if (!pass) {
              filteredOutCount++;
              ds.clFiltered = String(filteredOutCount);
              pushRaw({ t: "beacon", m: "POST", u: truncUrl(url), b: !!data, f: true, r: label, ts, sm });
            } else {
              pushRaw({ t: "beacon", m: "POST", u: truncUrl(url), b: !!data, f: false, r: label, ts, sm });
              if (inspectorEnabled) {
                const bodyStr = data ? typeof data === "string" ? data : "(binary)" : "";
                emitPayload({ requestUrl: url, method: "POST", statusCode: null, body: bodyStr, contentType: "application/beacon", transport: "beacon" });
              }
            }
            return origBeacon(url, data);
          };
          let beaconOk = false;
          try {
            navigator.sendBeacon = patchedBeacon;
            beaconOk = navigator.sendBeacon === patchedBeacon;
            if (!beaconOk) {
              Object.defineProperty(navigator, "sendBeacon", { value: patchedBeacon, writable: true, configurable: true });
              beaconOk = navigator.sendBeacon === patchedBeacon;
            }
          } catch (e1) {
            try {
              Object.defineProperty(navigator, "sendBeacon", { value: patchedBeacon, writable: true, configurable: true });
              beaconOk = navigator.sendBeacon === patchedBeacon;
            } catch (e2) {
              patchStatus.beaconError = String(e2).slice(0, 120);
            }
          }
          patchStatus.beacon = beaconOk;
          if (beaconOk) console.log("[CloneLevel] \u2714 sendBeacon patched");
          else console.error("[CloneLevel] \u2717 sendBeacon patch failed. err:", patchStatus.beaconError);
        } catch (err) {
          patchStatus.beaconError = String(err).slice(0, 120);
          console.error("[CloneLevel] \u2717 sendBeacon outer error:", err);
        }
      }
      if (!patchStatus.ws) {
        try {
          const WS = window.WebSocket;
          if (WS && WS.prototype && typeof WS.prototype.send === "function") {
            const _origWsSend = WS.prototype.send;
            WS.prototype.send = function(data) {
              rawWsSeen++;
              ds.clRawWs = String(rawWsSeen);
              const wsUrl = this.url ?? "";
              console.log(`[CloneLevel] WS.send #${rawWsSeen} on ${String(wsUrl).slice(0, 60)}`);
              if (inspectorEnabled) {
                const ts = nowHMS();
                const sm = isSaveMarkNear();
                pushRaw({ t: "ws", m: "SEND", u: truncUrl(String(wsUrl)), b: !!data, f: false, r: "ws-send", ts, sm });
              }
              return _origWsSend.apply(this, arguments);
            };
            const wsOk = WS.prototype.send !== _origWsSend;
            patchStatus.ws = wsOk;
            if (wsOk) console.log("[CloneLevel] \u2714 WebSocket.prototype.send patched");
            else console.error("[CloneLevel] \u2717 WS.prototype.send ref unchanged");
          }
        } catch (err) {
          patchStatus.wsError = String(err).slice(0, 120);
          console.error("[CloneLevel] \u2717 WebSocket patch FAILED:", err);
        }
      }
      patchStatus.completedAt = (/* @__PURE__ */ new Date()).toISOString();
      syncDom();
      console.log("[CloneLevel] installNetworkInterceptors() COMPLETE:", JSON.stringify(patchStatus));
      sendToBridge("PATCHES_INSTALLED", {
        patchStatus: { ...patchStatus },
        fetchVerified: window.fetch !== _origFetch,
        xhrVerified: XMLHttpRequest.prototype.send !== _origXhrSend
      });
    }
    const bootTs = (/* @__PURE__ */ new Date()).toISOString();
    ds.clBridgeBootTs = bootTs;
    console.log("[CloneLevel] \u2714 Bridge BOOTED on", window.location.href);
    sendToBridge("BRIDGE_BOOTED", { ts: bootTs, tabUrl: window.location.href });
    window.addEventListener("message", (event) => {
      if (event.data && typeof event.data.type === "string") recordMsgType(event.data.type);
      if (event.data?.source !== CONTENT_SOURCE) return;
      const { type } = event.data;
      console.log(`[CloneLevel Bridge] msg received: ${type}`);
      if (type === "ENABLE_INSPECTOR") {
        const wasEnabled = inspectorEnabled;
        inspectorEnabled = true;
        ds.clBridgeEnabled = "1";
        console.log("[CloneLevel] ENABLE_INSPECTOR \u2014 calling installNetworkInterceptors()");
        installNetworkInterceptors();
        sendToBridge("BRIDGE_ACK", { activated: true, alreadyEnabled: wasEnabled, patchStatus: { ...patchStatus }, interceptCount, sentCount, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
        sendToBridge("INSPECTOR_ENABLED", { inspectorEnabled: true, patchStatus: { ...patchStatus } });
      } else if (type === "DISABLE_INSPECTOR") {
        inspectorEnabled = false;
        ds.clBridgeEnabled = "0";
        sendToBridge("INSPECTOR_DISABLED", { inspectorEnabled: false });
      } else if (type === "PING_BRIDGE") {
        const nonce = event.data.nonce ?? null;
        sendToBridge("PING_BRIDGE_ACK", { nonce, ts: (/* @__PURE__ */ new Date()).toISOString(), inspectorEnabled, interceptCount, patchStatus: { ...patchStatus } });
      } else if (type === "PING_BRIDGE_LEGACY") {
        sendToBridge("PONG_BRIDGE", { inspectorEnabled, interceptCount, sentCount });
      } else if (type === "ENABLE_DEBUG_INTERCEPT") {
        debugMode = true;
        ds.clDebugMode = "1";
        installNetworkInterceptors();
        sendToBridge("DEBUG_INTERCEPT_ACK", { debugMode: true, patchStatus: { ...patchStatus }, ts: (/* @__PURE__ */ new Date()).toISOString() });
      } else if (type === "DISABLE_DEBUG_INTERCEPT") {
        debugMode = false;
        ds.clDebugMode = "0";
        sendToBridge("DEBUG_INTERCEPT_ACK", { debugMode: false, ts: (/* @__PURE__ */ new Date()).toISOString() });
      } else if (type === "MARK_SAVE_EVENT") {
        saveMarkTs = (/* @__PURE__ */ new Date()).toISOString();
        ds.clSaveMark = saveMarkTs;
        sendToBridge("SAVE_MARK_ACK", { ts: saveMarkTs });
      } else if (type === "GET_BRIDGE_RAW_LOG") {
        sendToBridge("BRIDGE_RAW_LOG", {
          rawLog,
          rawFetchSeen,
          rawXhrSeen,
          rawBeaconSeen,
          rawWsSeen,
          filteredOutCount,
          payloadsEmitted: interceptCount,
          saveMarkTs,
          debugMode,
          patchStatus: { ...patchStatus }
        });
      } else if (type === "VERIFY_PATCHES") {
        installNetworkInterceptors();
        sendToBridge("PATCH_VERIFY_RESULT", {
          patchStatus: { ...patchStatus },
          fetchVerified: window.fetch !== _origFetch,
          xhrVerified: XMLHttpRequest.prototype.send !== _origXhrSend,
          ts: (/* @__PURE__ */ new Date()).toISOString()
        });
      } else if (type === "INJECT_CLONE") {
        let walkFiber2 = function(fiber, depth) {
          if (!fiber || depth > 80) return null;
          const ms = fiber.memoizedState;
          if (ms) {
            let hook = ms;
            while (hook) {
              if (hook.memoizedState && typeof hook.memoizedState === "object" && !Array.isArray(hook.memoizedState)) {
                const keys = Object.keys(hook.memoizedState);
                if (keys.some((k) => ["sections", "rows", "elements", "columns", "blocks", "steps"].includes(k))) {
                  return { fiber, hookState: hook.memoizedState };
                }
              }
              hook = hook.next;
            }
          }
          if (fiber.stateNode?.state) {
            const s = fiber.stateNode.state;
            if (typeof s === "object" && Object.keys(s).some((k) => ["sections", "rows", "elements", "columns"].includes(k))) {
              return { fiber, classState: s };
            }
          }
          return walkFiber2(fiber.child, depth + 1) || walkFiber2(fiber.sibling, depth + 1);
        }, getFiberKey2 = function(el) {
          return Object.keys(el).find((k) => k.startsWith("__reactFiber") || k.startsWith("__reactInternals") || k.startsWith("__reactContainer")) ?? null;
        }, buildHLSection2 = function(sec, idx) {
          return {
            id: `cl_${Date.now()}_${idx}`,
            type: "section",
            label: sec.sectionHint || `Imported Section ${idx + 1}`,
            props: { cloneLevel: true, sourceHint: sec.sectionHint, elementCount: sec.elementCount },
            rows: []
          };
        };
        var walkFiber = walkFiber2, getFiberKey = getFiberKey2, buildHLSection = buildHLSection2;
        const payload = event.data.payload ?? {};
        const strategies = [];
        let injected = false;
        const ourSections = (payload.sections ?? []).map(buildHLSection2);
        const w = window;
        const storeKeys = [
          "__redux_store",
          "store",
          "__store",
          "pageStore",
          "builderStore",
          "funnelStore",
          "__builderStore",
          "__pageStore",
          "__funnelStore",
          "appStore",
          "rootStore"
        ];
        for (const k of storeKeys) {
          if (w[k]?.dispatch) {
            try {
              for (const actionType of ["ADD_SECTIONS", "INSERT_SECTIONS", "PASTE_SECTIONS", "IMPORT_SECTIONS", "ADD_ELEMENTS"]) {
                try {
                  w[k].dispatch({ type: actionType, sections: ourSections, payload: { sections: ourSections } });
                } catch {
                }
              }
              strategies.push(`redux:${k}`);
              injected = true;
            } catch (e) {
              strategies.push(`redux:${k}:err:${String(e).slice(0, 40)}`);
            }
            break;
          }
        }
        if (!injected) {
          const dataKeys = ["__builderData", "__pageData", "__funnelData", "__editorData", "builderData", "pageData"];
          for (const k of dataKeys) {
            if (w[k]?.sections && Array.isArray(w[k].sections)) {
              try {
                w[k].sections.push(...ourSections);
                if (typeof w[k].onUpdate === "function") w[k].onUpdate(w[k]);
                if (typeof w[k].refresh === "function") w[k].refresh();
                strategies.push(`builderData:${k}`);
                injected = true;
              } catch (e) {
                strategies.push(`builderData:${k}:err:${String(e).slice(0, 40)}`);
              }
              break;
            }
          }
        }
        if (!injected) {
          const selectors = [
            "[data-page-builder]",
            "[data-builder]",
            "[data-funnel-builder]",
            "#builder",
            "#page-builder",
            "#funnel-builder",
            ".builder-canvas",
            ".page-builder",
            ".funnel-builder",
            "[class*='builder-canvas']",
            "[class*='pageBuilder']",
            "[class*='funnelBuilder']",
            "[class*='editor-canvas']",
            "[class*='EditorCanvas']",
            "main",
            "#app",
            "#root",
            "[data-reactroot]"
          ];
          for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (!el) continue;
            const fk = getFiberKey2(el);
            if (!fk) continue;
            try {
              const found = walkFiber2(el[fk], 0);
              if (found) {
                const stateHolder = found.hookState ?? found.classState;
                const sKey = Object.keys(stateHolder).find((k) => ["sections", "rows", "elements", "columns"].includes(k));
                if (sKey && Array.isArray(stateHolder[sKey])) {
                  stateHolder[sKey].push(...ourSections);
                  const instance = found.fiber.stateNode;
                  if (instance?.setState) instance.setState({ [sKey]: [...stateHolder[sKey]] });
                  if (instance?.forceUpdate) instance.forceUpdate();
                  strategies.push(`reactFiber:${sel}:${sKey}`);
                  injected = true;
                  break;
                }
              }
            } catch (e) {
              strategies.push(`reactFiber:${sel}:err:${String(e).slice(0, 40)}`);
            }
          }
        }
        if (!injected) {
          try {
            const frames = document.querySelectorAll("iframe");
            for (let i = 0; i < frames.length && !injected; i++) {
              try {
                const fw = frames[i].contentWindow;
                if (!fw) continue;
                for (const k of storeKeys) {
                  if (fw[k]?.dispatch) {
                    for (const actionType of ["ADD_SECTIONS", "INSERT_SECTIONS", "PASTE_SECTIONS", "IMPORT_SECTIONS"]) {
                      try {
                        fw[k].dispatch({ type: actionType, sections: ourSections, payload: { sections: ourSections } });
                      } catch {
                      }
                    }
                    strategies.push(`iframe[${i}]:redux:${k}`);
                    injected = true;
                    break;
                  }
                }
              } catch {
              }
            }
          } catch (e) {
            strategies.push(`iframe:err:${String(e).slice(0, 40)}`);
          }
        }
        const eventNames = [
          "builder:addSections",
          "builder:importSections",
          "builder:paste",
          "hl:sections:add",
          "hl:import",
          "hl:builder:paste",
          "funnel:importSections",
          "page:importSections",
          "clonelevel:inject"
        ];
        for (const evtName of eventNames) {
          try {
            window.dispatchEvent(new CustomEvent(evtName, { detail: { sections: ourSections, source: "clonelevel" } }));
            document.dispatchEvent(new CustomEvent(evtName, { detail: { sections: ourSections, source: "clonelevel" } }));
          } catch {
          }
        }
        strategies.push(`customEvents:${eventNames.length}`);
        try {
          const clipData = JSON.stringify({
            type: "clonelevel-sections",
            version: 1,
            source: payload.domain ?? "clonelevel",
            title: payload.title ?? "Imported Page",
            pageType: payload.pageType ?? "landing",
            sections: ourSections,
            assets: payload.assets ?? []
          });
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(clipData).then(() => {
              const target = document.activeElement ?? document.body;
              target.dispatchEvent(new ClipboardEvent("paste", {
                bubbles: true,
                cancelable: true,
                clipboardData: new DataTransfer()
              }));
              document.dispatchEvent(new ClipboardEvent("paste", { bubbles: true }));
            }).catch(() => {
            });
            strategies.push("clipboard:async");
          } else {
            const ta = document.createElement("textarea");
            ta.value = clipData;
            ta.style.position = "fixed";
            ta.style.top = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
            strategies.push("clipboard:execCommand");
          }
        } catch (e) {
          strategies.push(`clipboard:err:${String(e).slice(0, 40)}`);
        }
        const globals = {};
        const probeKeys = [
          ...storeKeys,
          "React",
          "ReactDOM",
          "__REACT_DEVTOOLS_GLOBAL_HOOK__",
          "__builderData",
          "__pageData",
          "window.__store",
          "angular",
          "Vue",
          "$",
          "jQuery"
        ];
        for (const k of probeKeys) {
          try {
            globals[k] = typeof w[k];
          } catch {
          }
        }
        console.log("[CloneLevel] INJECT_CLONE result:", { injected, strategies, globals });
        sendToBridge("INJECT_CLONE_RESULT", {
          success: injected,
          strategies,
          globals,
          sectionCount: ourSections.length,
          assetCount: (payload.assets ?? []).length,
          title: payload.title,
          ts: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    document.addEventListener("clonelevel:bridge", (e) => {
      const detail = e.detail;
      if (!detail) return;
      const type = detail.type;
      recordMsgType("CE:" + type);
      if (type === "ENABLE_INSPECTOR") {
        inspectorEnabled = true;
        ds.clBridgeEnabled = "1";
        installNetworkInterceptors();
        sendToBridge("BRIDGE_ACK", { activated: true, via: "customEvent", patchStatus: { ...patchStatus }, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
        document.dispatchEvent(new CustomEvent("clonelevel:bridge:reply", { detail: { source: BRIDGE_SOURCE, type: "BRIDGE_ACK", activated: true, via: "customEvent" } }));
      } else if (type === "PING_BRIDGE") {
        const nonce = detail.nonce ?? null;
        const reply = { source: BRIDGE_SOURCE, type: "PING_BRIDGE_ACK", nonce, ts: (/* @__PURE__ */ new Date()).toISOString(), via: "customEvent", patchStatus: { ...patchStatus } };
        sendToBridge("PING_BRIDGE_ACK", reply);
        document.dispatchEvent(new CustomEvent("clonelevel:bridge:reply", { detail: reply }));
      } else if (type === "ENABLE_DEBUG_INTERCEPT") {
        debugMode = true;
        ds.clDebugMode = "1";
        installNetworkInterceptors();
        sendToBridge("DEBUG_INTERCEPT_ACK", { debugMode: true, via: "customEvent", patchStatus: { ...patchStatus }, ts: (/* @__PURE__ */ new Date()).toISOString() });
      } else if (type === "MARK_SAVE_EVENT") {
        saveMarkTs = (/* @__PURE__ */ new Date()).toISOString();
        ds.clSaveMark = saveMarkTs;
        sendToBridge("SAVE_MARK_ACK", { ts: saveMarkTs, via: "customEvent" });
      }
    });
    let fallbackChecks = 0;
    const fallbackPollId = setInterval(() => {
      fallbackChecks++;
      if (fallbackChecks > 30 || inspectorEnabled) {
        clearInterval(fallbackPollId);
        return;
      }
      if (window.__CLONELEVEL_BRIDGE_ENABLE__ === true || ds.clBridgeFallback === "1") {
        inspectorEnabled = true;
        ds.clBridgeEnabled = "1";
        ds.clBridgeFallback = "0";
        installNetworkInterceptors();
        console.log("[CloneLevel] \u2714 Bridge enabled via fallback poll");
        sendToBridge("BRIDGE_ACK", { activated: true, via: "fallback-poll", patchStatus: { ...patchStatus }, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
        clearInterval(fallbackPollId);
      }
    }, 1e3);
    window.__clonelevel_bridge = {
      send: sendToBridge,
      isEnabled: () => inspectorEnabled,
      isDebug: () => debugMode,
      patchStatus: () => ({ ...patchStatus }),
      getRawCounts: () => ({ rawFetchSeen, rawXhrSeen, rawBeaconSeen, rawWsSeen, filteredOutCount }),
      installNetworkInterceptors,
      // Quick manual test: call window.__clonelevel_bridge.testFetch()
      testFetch: () => {
        rawFetchSeen++;
        ds.clRawFetch = String(rawFetchSeen);
        console.log("[CloneLevel] testFetch hit #" + rawFetchSeen);
      }
    };
    console.log("[CloneLevel] \u2714 Page bridge fully initialised on", window.location.href);
    sendToBridge("BRIDGE_READY", { inspectorEnabled, tabUrl: window.location.href, bootTs });
  })();
})();
//# sourceMappingURL=page-bridge-runtime.js.map
