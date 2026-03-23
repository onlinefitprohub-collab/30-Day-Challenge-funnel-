// content.js — Challenge Funnel in a Box
// Runs in the content-script (extension) world on both:
//   1. Our app pages (*.replit.dev / *.replit.app / *.replit.com) — receives CF_SAVE_PAGE
//   2. GHL page builder (app.gohighlevel.com) — injects native elements

(function () {
  "use strict";

  const IS_GHL = window.location.hostname.endsWith("gohighlevel.com");

  /* ─── CF_SAVE_PAGE handler (runs on our app pages) ──────────────────────
   * The app POSTs the GHL element JSON via postMessage.
   * We save it to chrome.storage.local and ACK so the app can show success.
   * ─────────────────────────────────────────────────────────────────────── */
  window.addEventListener("message", (evt) => {
    if (evt.source !== window) return;
    if (!evt.data || evt.data.source !== "cf-app" || evt.data.type !== "CF_SAVE_PAGE") return;

    const { requestId, projectId, page, pageData, challengeConcept, appUrl } = evt.data.payload || {};
    if (!page || !pageData) return;

    const ready = {
      projectId: projectId || "",
      appUrl: appUrl || window.location.origin,
      challengeConcept: challengeConcept || "Challenge Funnel",
      page,
      pageData,
      loadedAt: Date.now(),
    };

    chrome.storage.local.set({ cfReady: ready }, () => {
      window.postMessage(
        { source: "cf-ext", type: "CF_SAVE_ACK", payload: { requestId, page, success: true } },
        "*"
      );
    });
  });

  /* ─── GHL-only from here on ──────────────────────────────────────────── */
  if (!IS_GHL) return;

  const HOST_ID = "cf-funnel-host";

  let hlContext = { pageId: null, locationId: null };
  let injecting = false;

  /* ─── Inject bridge.js into main world ──────────────────────────────── */
  function injectBridge() {
    if (document.getElementById("cf-bridge-script")) return;
    const s = document.createElement("script");
    s.id  = "cf-bridge-script";
    s.src = chrome.runtime.getURL("bridge.js");
    (document.head || document.documentElement).appendChild(s);
  }

  /* ─── Listen for bridge.js → CONTEXT_DETECTED ──────────────────────── */
  window.addEventListener("message", (evt) => {
    if (!evt.data || evt.data.source !== "cf-bridge") return;
    if (evt.data.type === "CONTEXT_DETECTED") {
      const { pageId, locationId } = evt.data.payload || {};
      if (pageId)     hlContext.pageId     = pageId;
      if (locationId) hlContext.locationId = locationId;
      updatePanel();
    }
  });

  /* ─── URL extraction ────────────────────────────────────────────────── */
  function extractFromUrl(url) {
    try {
      const m = url.match(/\/location\/([^/?#]+)\/page-builder\/([^/?#]+)/i);
      if (m) {
        hlContext.locationId = m[1];
        hlContext.pageId     = m[2];
      }
    } catch {}
  }

  /* ─── CSS ───────────────────────────────────────────────────────────── */
  const CSS = `
    :host { all: initial; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }

    #panel {
      position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
      width: 280px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.07);
      overflow: hidden;
    }

    .head {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      padding: 11px 15px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .brand { display: flex; align-items: center; gap: 9px; }
    .logo {
      width: 28px; height: 28px; border-radius: 7px; background: #f97316;
      color: #fff; font-weight: 900; font-size: 11px;
      display: flex; align-items: center; justify-content: center;
    }
    .title { color: #fff; font-size: 12px; font-weight: 700; }
    .sub   { color: rgba(255,255,255,.45); font-size: 10px; }
    .close {
      background: rgba(255,255,255,.12); border: none; border-radius: 4px;
      color: rgba(255,255,255,.7); padding: 2px 7px; cursor: pointer; font-size: 14px; line-height: 1;
    }
    .close:hover { background: rgba(255,255,255,.22); }

    .body { padding: 13px 14px; }

    .no-project {
      font-size: 11px; color: #92400e; background: #fff7ed;
      border: 1px solid #fed7aa; border-radius: 8px; padding: 9px 11px;
      line-height: 1.55;
    }

    .ready-page {
      font-size: 11px; color: #1e40af; background: #eff6ff;
      border: 1px solid #bfdbfe; border-radius: 8px; padding: 8px 11px;
      line-height: 1.55; margin-bottom: 10px;
    }
    .ready-page strong { font-weight: 700; }

    .no-context {
      font-size: 11px; color: #92400e; background: #fff7ed;
      border: 1px solid #fed7aa; border-radius: 8px; padding: 8px 11px;
      line-height: 1.55; margin-bottom: 10px;
    }

    .inject-btn {
      width: 100%; background: #f97316; color: #fff; border: none; border-radius: 9px;
      padding: 10px 14px; font-size: 13px; font-weight: 800; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 7px;
      transition: background 0.15s; letter-spacing: -0.01em;
    }
    .inject-btn:hover:not(:disabled) { background: #ea580c; }
    .inject-btn:disabled { background: #cbd5e1; cursor: not-allowed; }
    .inject-btn.ok  { background: #16a34a; }
    .inject-btn.err { background: #dc2626; }

    .inject-icon { font-size: 14px; }

    .status {
      margin-top: 9px; border-radius: 8px; padding: 8px 10px;
      font-size: 10px; line-height: 1.55; display: none;
    }
    .status.info { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; display: block; }
    .status.err  { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; display: block; }
    .status.warn { background: #fffbeb; border: 1px solid #fde68a; color: #78350f; display: block; }

    #fab {
      position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff; font-weight: 900; font-size: 11px;
      border: none; cursor: pointer;
      box-shadow: 0 4px 18px rgba(249,115,22,.55);
      display: flex; align-items: center; justify-content: center;
    }
    #fab:hover { box-shadow: 0 6px 26px rgba(249,115,22,.75); }
    .hidden { display: none !important; }
  `;

  /* ─── Build panel ───────────────────────────────────────────────────── */
  let shadow = null;

  function buildPanel() {
    const host = document.createElement("div");
    host.id    = HOST_ID;
    document.body.appendChild(host);
    shadow = host.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>${CSS}</style>
      <div id="panel">
        <div class="head">
          <div class="brand">
            <div class="logo">CF</div>
            <div>
              <div class="title">CF Funnel</div>
              <div class="sub" id="head-sub">Challenge Funnel in a Box</div>
            </div>
          </div>
          <button class="close" id="close-btn">−</button>
        </div>
        <div class="body" id="body-content">
          <div class="no-project">
            Open your Challenge Funnel results page and click <strong>Clone to GHL</strong> for the page you want — then come back here and click Paste.
          </div>
        </div>
      </div>
      <button id="fab" class="hidden" title="CF Funnel">CF</button>
    `;

    shadow.getElementById("close-btn").addEventListener("click", () => {
      shadow.getElementById("panel").classList.add("hidden");
      shadow.getElementById("fab").classList.remove("hidden");
    });
    shadow.getElementById("fab").addEventListener("click", () => {
      shadow.getElementById("panel").classList.remove("hidden");
      shadow.getElementById("fab").classList.add("hidden");
    });

    updatePanel();
  }

  const PAGE_LABELS = {
    landing:  "Landing Page",
    optin:    "Opt-In Page",
    thankyou: "Thank You Page",
    booking:  "Booking Page",
  };

  /* ─── Update panel state ────────────────────────────────────────────── */
  function updatePanel() {
    if (!shadow) return;

    chrome.storage.local.get(["cfReady"], (s) => {
      const ready = s.cfReady || null;
      const body  = shadow.getElementById("body-content");
      if (!body) return;

      if (!ready || !ready.projectId) {
        body.innerHTML = `<div class="no-project">Open your Challenge Funnel results page and click <strong>Clone to GHL</strong> for the page you want — then come back here and click Paste.</div>`;
        return;
      }

      const pageLabel = PAGE_LABELS[ready.page] || ready.page;
      const hasCtx    = !!(hlContext.pageId && hlContext.locationId);
      const hasData   = !!ready.pageData;

      let html = `
        <div class="ready-page">
          <strong>${pageLabel}</strong> is loaded and ready to inject into this builder page.
        </div>
      `;

      if (!hasCtx) {
        html += `
          <div class="no-context">
            HighLevel page builder not detected yet — make sure you are on a page builder URL (/page-builder/…).
          </div>
        `;
      } else if (!hasData) {
        html += `
          <div class="no-context">
            Page data not cached — go back to the app and click <strong>Clone to GHL</strong> again.
          </div>
        `;
      }

      const canInject = hasCtx && hasData;

      html += `
        <button class="inject-btn" id="inject-btn" ${!canInject ? "disabled" : ""}>
          <span class="inject-icon">⬇</span>
          Paste into Page Builder
        </button>
        <div class="status" id="status"></div>
      `;

      body.innerHTML = html;

      const sub = shadow.getElementById("head-sub");
      if (sub) sub.textContent = ready.challengeConcept || "Challenge Funnel in a Box";

      const injectBtn = shadow.getElementById("inject-btn");
      if (injectBtn && canInject) {
        injectBtn.addEventListener("click", () => doInject(ready, injectBtn));
      }
    });
  }

  /* ─── Request bridge.js to perform the injection ────────────────────── */
  function requestBridgeInject(pageBuilderId, pageData) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        window.removeEventListener("message", handler);
        reject(new Error("Injection timed out — the page builder may not be fully loaded yet."));
      }, 30000);

      function handler(evt) {
        if (evt.source !== window) return;
        if (!evt.data || evt.data.source !== "cf-bridge" || evt.data.type !== "INJECT_RESULT") return;
        clearTimeout(timeout);
        window.removeEventListener("message", handler);
        resolve(evt.data.payload || { success: false, error: "No payload returned" });
      }

      window.addEventListener("message", handler);
      window.postMessage({
        source:  "cf-content",
        type:    "CF_DO_INJECT",
        payload: { pageBuilderId, pageData },
      }, "*");
    });
  }

  /* ─── Perform injection ─────────────────────────────────────────────── */
  async function doInject(ready, btn) {
    if (injecting) return;
    injecting = true;

    btn.disabled = true;
    btn.innerHTML = '<span class="inject-icon">⏳</span> Injecting…';
    clearStatus();

    try {
      if (!ready.pageData) {
        showStatus("err", "Page data not cached — go back to the app and click Clone to GHL again.");
        btn.innerHTML = '<span class="inject-icon">✗</span> No page data';
        btn.classList.add("err");
        return;
      }

      if (!hlContext.pageId || !hlContext.locationId) {
        showStatus("err", "Page builder not detected — make sure you are on the builder URL.");
        btn.innerHTML = '<span class="inject-icon">✗</span> No page detected';
        btn.classList.add("err");
        return;
      }

      const result = await requestBridgeInject(hlContext.pageId, ready.pageData);

      if (result.success) {
        btn.innerHTML = '<span class="inject-icon">✓</span> Injected!';
        btn.classList.add("ok");
        showStatus("info", "Done! The builder is reloading with your content — it may take a few seconds.");
      } else {
        const msg = result.error || "Unknown error";
        btn.innerHTML = '<span class="inject-icon">✗</span> Failed';
        btn.classList.add("err");
        showStatus("err", `Injection failed: ${msg}`);
      }
    } catch (e) {
      btn.innerHTML = '<span class="inject-icon">✗</span> Error';
      btn.classList.add("err");
      showStatus("err", `Error: ${e.message}`);
    } finally {
      injecting = false;
      setTimeout(() => {
        if (!shadow) return;
        btn.innerHTML = '<span class="inject-icon">⬇</span> Paste into Page Builder';
        btn.classList.remove("ok", "err");
        btn.disabled = false;
        updatePanel();
      }, 6000);
    }
  }

  function showStatus(type, msg) {
    const el = shadow && shadow.getElementById("status");
    if (el) { el.textContent = msg; el.className = `status ${type}`; }
  }

  function clearStatus() {
    const el = shadow && shadow.getElementById("status");
    if (el) { el.textContent = ""; el.className = "status"; }
  }

  /* ─── Mount ─────────────────────────────────────────────────────────── */
  function mount() {
    if (document.getElementById(HOST_ID)) return;
    injectBridge();
    extractFromUrl(window.location.href);
    buildPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  const _origPushState = history.pushState;
  history.pushState = function (...args) {
    const result = _origPushState.apply(this, args);
    setTimeout(() => { extractFromUrl(window.location.href); updatePanel(); }, 100);
    return result;
  };
  window.addEventListener("popstate", () => {
    setTimeout(() => { extractFromUrl(window.location.href); updatePanel(); }, 100);
  });

})();
