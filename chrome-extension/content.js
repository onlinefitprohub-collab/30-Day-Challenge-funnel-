// content.js — Challenge Funnel: inject native HL elements into GHL page builder
// Runs in the content-script world; communicates with bridge.js via postMessage.

(function () {
  "use strict";

  const HOST_ID = "cf-funnel-host";

  // Detected GHL context from bridge.js
  let hlContext = { pageId: null, funnelId: null, locationId: null };
  let injecting = false;

  /* ─── Inject bridge.js into main world ──────────────────────────────────── */
  function injectBridge() {
    if (document.getElementById("cf-bridge-script")) return;
    const s = document.createElement("script");
    s.id  = "cf-bridge-script";
    s.src = chrome.runtime.getURL("bridge.js");
    (document.head || document.documentElement).appendChild(s);
  }

  /* ─── Listen for bridge.js messages ─────────────────────────────────────── */
  window.addEventListener("message", (evt) => {
    if (!evt.data || evt.data.source !== "cf-bridge") return;
    if (evt.data.type !== "CONTEXT_DETECTED") return;
    const { pageId, funnelId, locationId } = evt.data.payload || {};
    if (pageId)     hlContext.pageId     = pageId;
    if (funnelId)   hlContext.funnelId   = funnelId;
    if (locationId) hlContext.locationId = locationId;
    updatePanel();
  });

  /* ─── Also extract from URL directly ────────────────────────────────────── */
  function extractFromUrl(url) {
    try {
      const u = new URL(url);
      const locMatch    = u.pathname.match(/\/location\/([A-Za-z0-9]+)/i);
      const builderMatch = u.pathname.match(/\/funnels\/builder\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)/i);
      if (locMatch?.[1])      hlContext.locationId = locMatch[1];
      if (builderMatch?.[2])  hlContext.funnelId   = builderMatch[1];
      if (builderMatch?.[2])  hlContext.pageId      = builderMatch[2];
    } catch {}
  }

  /* ─── CSS ────────────────────────────────────────────────────────────────── */
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

    /* No project state */
    .no-project {
      font-size: 11px; color: #92400e; background: #fff7ed;
      border: 1px solid #fed7aa; border-radius: 8px; padding: 9px 11px;
      line-height: 1.55;
    }

    /* Ready state */
    .ready-page {
      font-size: 11px; color: #1e40af; background: #eff6ff;
      border: 1px solid #bfdbfe; border-radius: 8px; padding: 8px 11px;
      line-height: 1.55; margin-bottom: 10px;
    }
    .ready-page strong { font-weight: 700; }

    /* No context warning */
    .no-context {
      font-size: 11px; color: #92400e; background: #fff7ed;
      border: 1px solid #fed7aa; border-radius: 8px; padding: 8px 11px;
      line-height: 1.55; margin-bottom: 10px;
    }

    /* Inject button */
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

    /* Status */
    .status {
      margin-top: 9px; border-radius: 8px; padding: 8px 10px;
      font-size: 10px; line-height: 1.55; display: none;
    }
    .status.info { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; display: block; }
    .status.err  { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; display: block; }
    .status.warn { background: #fffbeb; border: 1px solid #fde68a; color: #78350f; display: block; }

    /* FAB */
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

  /* ─── Build / update panel ───────────────────────────────────────────────── */
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
          <div class="no-project" id="no-project">
            Open your Challenge Funnel results page, click the extension icon, and select a page to load — then come back here.
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

  function updatePanel() {
    if (!shadow) return;

    chrome.storage.local.get(["cfReady"], (s) => {
      const ready = s.cfReady || null;
      const body  = shadow.getElementById("body-content");
      if (!body) return;

      if (!ready || !ready.projectId) {
        body.innerHTML = `<div class="no-project">Open your Challenge Funnel results page, click the extension icon, and select a page to load — then come back here.</div>`;
        return;
      }

      const pageLabel = PAGE_LABELS[ready.page] || ready.page;
      const hasCtx    = !!(hlContext.pageId && hlContext.locationId);

      let html = `
        <div class="ready-page">
          <strong>${pageLabel}</strong> is loaded and ready to inject into this builder page.
        </div>
      `;

      if (!hasCtx) {
        html += `
          <div class="no-context">
            HighLevel page ID not detected yet — try navigating to the builder page first, or open the page in the builder and wait a moment.
          </div>
        `;
      }

      html += `
        <button class="inject-btn" id="inject-btn" ${!hasCtx ? "disabled" : ""}>
          <span class="inject-icon">⬇</span>
          Paste into Page Builder
        </button>
        <div class="status" id="status"></div>
      `;

      body.innerHTML = html;

      // Update subtitle
      const sub = shadow.getElementById("head-sub");
      if (sub) sub.textContent = ready.challengeConcept || "Challenge Funnel in a Box";

      const injectBtn = shadow.getElementById("inject-btn");
      if (injectBtn && hasCtx) {
        injectBtn.addEventListener("click", () => doInject(ready, injectBtn));
      }
    });
  }

  /* ─── Perform the inject API call ───────────────────────────────────────── */
  async function doInject(ready, btn) {
    if (injecting) return;
    injecting = true;

    btn.disabled    = true;
    btn.textContent = "Injecting…";
    clearStatus();

    try {
      // Get HL API key from storage
      const hlApiKey = await new Promise((resolve) => {
        chrome.storage.sync.get(["cfHlApiKey"], (s) => resolve(s.cfHlApiKey || null));
      });

      if (!hlApiKey) {
        showStatus("err", "No HighLevel API key saved. Click the extension icon → enter your HL Private Integration key → Save.");
        btn.innerHTML = '<span class="inject-icon">✗</span> No API Key';
        btn.classList.add("err");
        return;
      }

      if (!hlContext.pageId || !hlContext.locationId) {
        showStatus("err", "Could not detect the HighLevel page ID. Navigate to the builder page first.");
        btn.innerHTML = '<span class="inject-icon">✗</span> No page detected';
        btn.classList.add("err");
        return;
      }

      const payload = {
        projectId:    ready.projectId,
        projectToken: ready.projectToken,
        page:         ready.page,
        hlApiKey,
        locationId:   hlContext.locationId,
        pageId:       hlContext.pageId,
        funnelId:     hlContext.funnelId || undefined,
      };

      const res = await fetch(`${ready.appUrl}/api/highlevel/inject`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success) {
        btn.innerHTML = '<span class="inject-icon">✓</span> Injected!';
        btn.classList.add("ok");
        showStatus("info", "Page injected! Refresh the HighLevel builder to see your content.");
      } else {
        const errMsg = json.error || `HTTP ${res.status}`;
        btn.innerHTML = '<span class="inject-icon">✗</span> Failed';
        btn.classList.add("err");
        showStatus("err", `Injection failed: ${errMsg}`);
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
        btn.disabled  = false;
      }, 5000);
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

  /* ─── Mount ──────────────────────────────────────────────────────────────── */
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

  // Re-check URL on SPA navigation
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
