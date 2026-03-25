// content.js v2.7.0 — Challenge Funnel in a Box
// Runs on GHL pages (app.gohighlevel.com) — shows a floating panel
// with "Inject AI Page" (revex PUT) and "Paste GHL Page" (clone-funnel-step) buttons.
// Also runs on our app pages (*.replit.*) to handle CF_SAVE_PAGE.

(function () {
  "use strict";

  if (window.__cfExtLoaded) return;
  window.__cfExtLoaded = true;

  const IS_GHL = window.location.hostname.endsWith("gohighlevel.com");

  /* ─── CF_SAVE_PAGE handler (runs on our app pages) ──────────────────────
   * The app sends page data via postMessage; we cache it for later loading.
   * ─────────────────────────────────────────────────────────────────────── */
  window.addEventListener("message", (evt) => {
    if (evt.source !== window) return;
    if (!evt.data || evt.data.source !== "cf-app" || evt.data.type !== "CF_SAVE_PAGE") return;

    const { requestId, projectId, page, pageData, challengeConcept, appUrl } = evt.data.payload || {};
    if (!page || !pageData) return;

    const ready = {
      projectId: projectId || "",
      appUrl:    appUrl || window.location.origin,
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

  /* ─── Inject bridge.js into main world ──────────────────────────────── */
  function injectBridge() {
    if (document.getElementById("cf-bridge-script")) return;
    const s = document.createElement("script");
    s.id  = "cf-bridge-script";
    s.src = chrome.runtime.getURL("bridge.js");
    (document.head || document.documentElement).appendChild(s);
  }

  const HOST_ID  = "cf-funnel-host";
  let   shadow   = null;
  let   isBuilder = false;  // true if current URL is a page-builder URL

  /* ─── Listen for bridge.js → CONTEXT_DETECTED ──────────────────────── */
  window.addEventListener("message", (evt) => {
    if (!evt.data || evt.data.source !== "cf-bridge") return;
    if (evt.data.type === "CONTEXT_DETECTED") {
      const { pageId, locationId } = evt.data.payload || {};
      isBuilder = !!(pageId || locationId);
      updatePanel();
    }
  });

  /* ─── Detect builder URL on load ───────────────────────────────────── */
  function checkBuilderUrl() {
    isBuilder = /\/page-builder\//.test(window.location.href);
  }

  /* ────────────────────────────────────────────────────────────────────────
     CSS (shadow DOM — fully isolated from GHL styles)
     ──────────────────────────────────────────────────────────────────────── */
  const CSS = `
    :host { all: initial; }
    *, *::before, *::after {
      box-sizing: border-box; margin: 0; padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    #panel {
      position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
      width: 290px;
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
      color: rgba(255,255,255,.7); padding: 2px 7px; cursor: pointer;
      font-size: 14px; line-height: 1;
    }
    .close:hover { background: rgba(255,255,255,.22); }

    .body { padding: 13px 14px; display: flex; flex-direction: column; gap: 8px; }

    /* Copied page card */
    .copied-card {
      font-size: 11px; border-radius: 8px; padding: 8px 10px; line-height: 1.55;
    }
    .copied-card.has-copy {
      background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;
    }
    .copied-card.no-copy {
      background: #fff7ed; border: 1px solid #fed7aa; color: #92400e;
    }
    .copied-card strong { font-weight: 700; display: block; margin-bottom: 2px; }

    /* Buttons */
    .btn {
      width: 100%; border: none; border-radius: 9px;
      padding: 10px 14px; font-size: 13px; font-weight: 800; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 7px;
      transition: background 0.15s, opacity 0.15s; letter-spacing: -0.01em;
    }
    .btn:disabled { opacity: 0.45; cursor: not-allowed; }

    .btn-copy  { background: #0ea5e9; color: #fff; }
    .btn-copy:hover:not(:disabled)  { background: #0284c7; }

    .btn-inject { background: #16a34a; color: #fff; }
    .btn-inject:hover:not(:disabled) { background: #15803d; }
    .btn-inject.ok  { background: #0e7490; }
    .btn-inject.err { background: #dc2626; }

    .btn-paste { background: #f97316; color: #fff; }
    .btn-paste:hover:not(:disabled) { background: #ea580c; }
    .btn-paste.ok  { background: #16a34a; }
    .btn-paste.err { background: #dc2626; }

    .btn-clear {
      background: transparent; color: #94a3b8; border: 1px solid #e2e8f0;
      border-radius: 8px; padding: 5px 10px; font-size: 10px; font-weight: 600;
      cursor: pointer;
    }
    .btn-clear:hover { color: #dc2626; border-color: #fecaca; }

    /* Status */
    .status {
      border-radius: 8px; padding: 8px 10px;
      font-size: 10px; line-height: 1.55; display: none;
    }
    .status.info { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; display: block; }
    .status.err  { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; display: block; }
    .status.warn { background: #fffbeb; border: 1px solid #fde68a; color: #78350f; display: block; }

    /* AI inject card */
    .ai-card {
      font-size: 11px; border-radius: 8px; padding: 8px 10px; line-height: 1.55;
    }
    .ai-card.has-ai {
      background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;
    }
    .ai-card strong { font-weight: 700; display: block; margin-bottom: 2px; }

    /* Separator */
    .sep {
      border: none; border-top: 1px solid #e2e8f0; margin: 4px 0;
    }

    /* No-builder warning */
    .no-builder {
      font-size: 11px; color: #78350f; background: #fffbeb;
      border: 1px solid #fde68a; border-radius: 8px; padding: 8px 10px; line-height: 1.5;
    }

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

  /* ─── Build shadow DOM panel ─────────────────────────────────────────── */
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
              <div class="sub">Clone any GHL page into your builder</div>
            </div>
          </div>
          <button class="close" id="close-btn">−</button>
        </div>
        <div class="body" id="body-content">
          <div class="no-builder">Loading…</div>
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

  /* ─── Render panel body ──────────────────────────────────────────────── */
  function updatePanel() {
    if (!shadow) return;

    // Read both storage areas in parallel via nested callbacks
    chrome.storage.local.get(["cfReady"], (ls) => {
      chrome.storage.session.get(["cf_copied_page"], (ss) => {
        const ready  = ls.cfReady      ?? null;
        const copied = ss.cf_copied_page ?? null;
        const body   = shadow.getElementById("body-content");
        if (!body) return;

        // ── AI inject section ───────────────────────────────────────────
        const hasAI    = !!(ready?.pageData);
        const canInject = hasAI && isBuilder;

        const PAGE_LABELS = { landing: "Landing Page", optin: "Opt-In Page", thankyou: "Thank You Page", booking: "Booking Page" };
        const aiLabel = hasAI ? (PAGE_LABELS[ready.page] || ready.page || "AI Page") : "";

        let aiHtml = "";
        if (hasAI) {
          aiHtml = `
            <div class="ai-card has-ai">
              <strong>AI Page Loaded: ${esc(aiLabel)}</strong>
              "${esc(ready.challengeConcept || "Challenge Funnel")}"
            </div>
            <button class="btn btn-inject" id="inject-btn" ${!canInject ? "disabled" : ""}>
              ${canInject ? "✦ Inject AI Page" : "✦ Inject AI Page (need builder tab)"}
            </button>
          `;
        }

        // ── Clone/paste section ─────────────────────────────────────────
        const hasCopy  = !!(copied?.funnelId && copied?.stepId);
        const canPaste = hasCopy && isBuilder;

        let copyHtml = "";
        if (hasCopy) {
          const ago  = timeSince(copied.copiedAt);
          const name = copied.pageName || "GHL Page";
          copyHtml = `
            <div class="copied-card has-copy">
              <strong>Copied: ${esc(name)}</strong>
              Copied ${ago} — ready to paste.
            </div>
            <button class="btn btn-paste" id="paste-btn" ${!canPaste ? "disabled" : ""}>
              Paste GHL Page
            </button>
            <button class="btn-clear" id="clear-btn">Clear copied</button>
          `;
        } else if (!hasAI) {
          copyHtml = `
            <div class="copied-card no-copy">
              <strong>No page loaded</strong>
              Open the extension popup to load an AI page or copy a GHL page.
            </div>
          `;
        }

        // ── Builder warning ─────────────────────────────────────────────
        const builderNote = !isBuilder && (hasAI || hasCopy)
          ? `<div class="no-builder">Navigate to a <strong>/page-builder/</strong> URL to enable injection.</div>`
          : "";

        // ── Separator ───────────────────────────────────────────────────
        const sep = (hasAI && hasCopy) ? `<hr class="sep">` : "";

        body.innerHTML = `
          ${aiHtml}
          ${sep}
          ${copyHtml}
          ${builderNote}
          <div class="status" id="status"></div>
        `;

        if (canInject) {
          shadow.getElementById("inject-btn").addEventListener("click", doInject);
        }
        if (canPaste) {
          shadow.getElementById("paste-btn").addEventListener("click", doPaste);
        }
        const clearBtn = shadow.getElementById("clear-btn");
        if (clearBtn) {
          clearBtn.addEventListener("click", () => {
            chrome.storage.session.remove("cf_copied_page", updatePanel);
          });
        }
      });
    });
  }

  /* ─── Inject AI page action ─────────────────────────────────────────── */
  let injecting = false;

  async function doInject() {
    if (injecting) return;
    injecting = true;

    const btn = shadow.getElementById("inject-btn");
    if (btn) { btn.disabled = true; btn.textContent = "Injecting…"; }
    clearStatus();

    try {
      const result = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "CF_INJECT_AI_PAGE" }, resolve);
      });

      if (result?.ok) {
        if (btn) { btn.textContent = "Injected!"; btn.classList.add("ok"); }
        showStatus("info", "AI page injected! The builder is reloading — your native GHL elements will appear in a few seconds.");
      } else {
        const err = result?.error ?? "Unknown error";
        if (btn) { btn.textContent = "Failed"; btn.classList.add("err"); }
        showStatus("err", err.slice(0, 300));
      }
    } catch(e) {
      if (btn) { btn.textContent = "Error"; btn.classList.add("err"); }
      showStatus("err", `Error: ${e.message.slice(0, 200)}`);
    } finally {
      injecting = false;
      setTimeout(updatePanel, 6000);
    }
  }

  /* ─── Paste action ──────────────────────────────────────────────────── */
  let pasting = false;

  async function doPaste() {
    if (pasting) return;
    pasting = true;

    const btn = shadow.getElementById("paste-btn");
    if (btn) { btn.disabled = true; btn.textContent = "Cloning…"; }
    clearStatus();

    try {
      const result = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "CF_PASTE_PAGE" }, resolve);
      });

      if (result?.ok) {
        if (btn) { btn.textContent = "Pasted!"; btn.classList.add("ok"); }
        showStatus("info", "Page cloned successfully! The builder is reloading — it may take a few seconds.");
      } else {
        const err = result?.error ?? "Unknown error";
        if (btn) { btn.textContent = "Failed"; btn.classList.add("err"); }
        showStatus("err", err.slice(0, 300));
      }
    } catch(e) {
      if (btn) { btn.textContent = "Error"; btn.classList.add("err"); }
      showStatus("err", `Error: ${e.message.slice(0, 200)}`);
    } finally {
      pasting = false;
      setTimeout(updatePanel, 5000);
    }
  }

  /* ─── Helpers ───────────────────────────────────────────────────────── */
  function showStatus(type, msg) {
    const el = shadow && shadow.getElementById("status");
    if (el) { el.textContent = msg; el.className = `status ${type}`; }
  }

  function clearStatus() {
    const el = shadow && shadow.getElementById("status");
    if (el) { el.textContent = ""; el.className = "status"; }
  }

  function esc(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function timeSince(ts) {
    if (!ts) return "";
    const secs = Math.floor((Date.now() - ts) / 1000);
    if (secs < 60)    return "just now";
    if (secs < 3600)  return `${Math.floor(secs/60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs/3600)}h ago`;
    return `${Math.floor(secs/86400)}d ago`;
  }

  /* ─── Listen for storage changes (real-time status updates) ─────── */
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "session" && changes.cf_copied_page) updatePanel();
    if (area === "local"   && changes.cfReady)        updatePanel();
  });

  /* ─── Mount ─────────────────────────────────────────────────────────── */
  function mount() {
    if (document.getElementById(HOST_ID)) return;
    checkBuilderUrl();
    injectBridge();
    buildPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

})();
