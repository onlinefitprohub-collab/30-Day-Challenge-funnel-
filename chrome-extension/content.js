// content.js — Full floating inject panel for HighLevel page builder
// Uses Shadow DOM so HL's styles never bleed in.

(function () {
  "use strict";

  const PANEL_ID = "cf-funnel-panel-host";

  // ── URL context detection ──────────────────────────────────────────────────
  function detectContext() {
    const url = window.location.href;
    return {
      locationId: (url.match(/\/location\/([a-zA-Z0-9]+)/) || [])[1] || null,
      funnelId:   (url.match(/\/funnels\/([a-zA-Z0-9]+)/)  || [])[1] || null,
      pageId:     (url.match(/\/(?:page-builder|pages)\/([a-zA-Z0-9]+)/) || [])[1] || null,
      url,
    };
  }

  // Store context on every URL change (HL is a SPA)
  function storeContext() {
    chrome.storage.local.set({ hlContext: detectContext() });
  }
  storeContext();

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) { lastUrl = location.href; storeContext(); }
  }).observe(document.body, { childList: true, subtree: true });

  // ── Panel HTML & CSS ───────────────────────────────────────────────────────
  const PANEL_CSS = `
    :host { all: initial; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }

    #root {
      position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
      width: 300px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06);
      overflow: hidden;
      transition: opacity 0.2s;
    }
    #root.hidden { opacity: 0; pointer-events: none; }

    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 10px 14px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .brand { display: flex; align-items: center; gap: 8px; }
    .logo {
      width: 26px; height: 26px; border-radius: 6px;
      background: #f97316; color: #fff;
      font-weight: 900; font-size: 11px;
      display: flex; align-items: center; justify-content: center;
    }
    .title { color: #fff; font-weight: 700; font-size: 13px; }
    .sub   { color: rgba(255,255,255,0.5); font-size: 10px; margin-top: 1px; }
    .close-btn {
      background: rgba(255,255,255,0.1); border: none; border-radius: 4px;
      padding: 3px 7px; cursor: pointer; color: rgba(255,255,255,0.7); font-size: 14px;
    }
    .close-btn:hover { background: rgba(255,255,255,0.2); }

    .body { padding: 12px 14px; }

    .ctx-row {
      display: flex; align-items: center; justify-content: space-between;
      font-size: 11px; padding: 4px 0; border-bottom: 1px solid #f1f5f9;
    }
    .ctx-row:last-child { border-bottom: none; }
    .ctx-key   { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.06em; }
    .ctx-val   { font-family: monospace; font-size: 10px; max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ok   { color: #16a34a; }
    .warn { color: #d97706; }
    .bad  { color: #dc2626; }

    .ctx-box {
      background: #f8fafc; border-radius: 8px; padding: 8px 10px; margin-bottom: 10px;
    }

    .page-id-wrap { margin-bottom: 10px; }
    .inp-label { font-size: 10px; font-weight: 700; color: #475569; margin-bottom: 4px; display: block; }
    .inp {
      width: 100%; padding: 6px 8px; border: 1px solid #e2e8f0; border-radius: 6px;
      font-size: 11px; font-family: monospace; outline: none; color: #0f172a;
    }
    .inp:focus { border-color: #f97316; box-shadow: 0 0 0 2px rgba(249,115,22,0.15); }
    .inp-note { font-size: 10px; color: #94a3b8; margin-top: 3px; line-height: 1.4; }

    .pages-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 8px; }

    .page-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px; }
    .page-btn {
      background: #f97316; color: #fff; border: none; border-radius: 7px;
      padding: 7px 4px; font-size: 11px; font-weight: 700; cursor: pointer;
      transition: background 0.15s, transform 0.1s;
      text-align: center; line-height: 1.3;
    }
    .page-btn:hover:not(:disabled) { background: #ea580c; transform: translateY(-1px); }
    .page-btn:disabled { background: #cbd5e1; cursor: not-allowed; transform: none; }
    .page-btn.success { background: #16a34a; }
    .page-btn.error   { background: #dc2626; }
    .page-btn .icon   { display: block; font-size: 14px; margin-bottom: 2px; }

    .status {
      border-radius: 7px; padding: 7px 9px; font-size: 11px; line-height: 1.5;
      display: none; margin-bottom: 8px;
    }
    .status.info    { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; display: block; }
    .status.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; display: block; }
    .status.error   { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; display: block; }

    .footer {
      padding: 8px 14px; border-top: 1px solid #f1f5f9;
      display: flex; align-items: center; justify-content: space-between;
    }
    .setup-link {
      font-size: 10px; color: #f97316; text-decoration: none; font-weight: 600;
    }
    .setup-link:hover { text-decoration: underline; }
    .collapse-btn {
      background: none; border: none; cursor: pointer; font-size: 10px; color: #94a3b8;
    }

    /* Setup required */
    .setup-req {
      padding: 16px; text-align: center;
    }
    .setup-req h3 { font-size: 13px; color: #0f172a; margin-bottom: 4px; }
    .setup-req p  { font-size: 11px; color: #64748b; line-height: 1.5; }

    /* FAB (when panel is collapsed) */
    #fab {
      position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff; font-weight: 900; font-size: 12px; letter-spacing: -0.5px;
      border: none; cursor: pointer;
      box-shadow: 0 4px 18px rgba(249,115,22,0.45);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    #fab:hover { transform: scale(1.1); box-shadow: 0 8px 28px rgba(249,115,22,0.6); }
    #fab.hidden { display: none; }
  `;

  const PAGES = [
    { key: "landing",  icon: "🏠", label: "Landing" },
    { key: "optin",    icon: "📋", label: "Opt-In" },
    { key: "thankyou", icon: "🎉", label: "Thank You" },
    { key: "booking",  icon: "📅", label: "Booking" },
  ];

  // ── Build the panel DOM (inside shadow root) ───────────────────────────────
  function buildPanel(shadow, settings, ctx) {
    const setupRequired = !settings.appUrl || !settings.projectId || !settings.projectToken || !settings.hlApiKey;

    shadow.innerHTML = `
      <style>${PANEL_CSS}</style>
      <div id="root">
        <div class="header">
          <div class="brand">
            <div class="logo">CF</div>
            <div>
              <div class="title">CF Funnel</div>
              <div class="sub">HL Page Injector</div>
            </div>
          </div>
          <button class="close-btn" id="close-btn" title="Collapse">−</button>
        </div>

        <div class="body">
          ${setupRequired ? `
            <div class="setup-req">
              <h3>Setup required</h3>
              <p>Open your Challenge Funnel results page and copy your Extension Token into the Chrome extension popup.</p>
            </div>
          ` : `
            <div class="ctx-box">
              <div class="ctx-row">
                <span class="ctx-key">Location</span>
                <span class="ctx-val ${ctx.locationId ? 'ok' : 'bad'}">${ctx.locationId || 'not detected'}</span>
              </div>
              <div class="ctx-row">
                <span class="ctx-key">Page ID</span>
                <span class="ctx-val ${ctx.pageId ? 'ok' : 'warn'}" id="pageid-display">${ctx.pageId || 'enter below'}</span>
              </div>
            </div>

            <div class="page-id-wrap">
              <label class="inp-label" for="pageid-inp">HighLevel Page ID</label>
              <input class="inp" id="pageid-inp" type="text" placeholder="Paste from HL step settings…" value="${ctx.pageId || ''}" />
              <div class="inp-note">In HL → Funnel → click a step → copy the Page ID from the URL or settings panel.</div>
            </div>

            <div class="pages-label">Inject page</div>
            <div class="page-grid">
              ${PAGES.map(p => `
                <button class="page-btn" data-page="${p.key}" id="btn-${p.key}">
                  <span class="icon">${p.icon}</span>${p.label}
                </button>
              `).join("")}
            </div>

            <div class="status" id="status-box"></div>
          `}
        </div>

        <div class="footer">
          <a class="setup-link" href="${settings.appUrl || '#'}" target="_blank">
            ${setupRequired ? '⚙ Get extension token →' : '⚙ Open app'}
          </a>
          <button class="collapse-btn" id="collapse-btn">Collapse</button>
        </div>
      </div>
      <button id="fab" class="hidden" title="CF Funnel Injector">CF</button>
    `;

    // Bind events
    shadow.getElementById("close-btn").addEventListener("click", () => {
      shadow.getElementById("root").classList.add("hidden");
      shadow.getElementById("fab").classList.remove("hidden");
    });
    shadow.getElementById("collapse-btn").addEventListener("click", () => {
      shadow.getElementById("root").classList.add("hidden");
      shadow.getElementById("fab").classList.remove("hidden");
    });
    shadow.getElementById("fab").addEventListener("click", () => {
      shadow.getElementById("root").classList.remove("hidden");
      shadow.getElementById("fab").classList.add("hidden");
    });

    if (setupRequired) return;

    const pageIdInp = shadow.getElementById("pageid-inp");
    const statusBox = shadow.getElementById("status-box");

    PAGES.forEach(({ key }) => {
      const btn = shadow.getElementById(`btn-${key}`);
      if (!btn) return;
      btn.addEventListener("click", async () => {
        const pageId = pageIdInp.value.trim() || ctx.pageId;
        if (!pageId) {
          showStatus(statusBox, "error", "Enter a Page ID above — find it in your HL funnel step settings.");
          return;
        }
        if (!ctx.locationId) {
          showStatus(statusBox, "error", "Location ID not detected. Make sure you're in a HighLevel funnel.");
          return;
        }
        await doInject(key, pageId, ctx, settings, btn, statusBox);
      });
    });
  }

  async function doInject(page, pageId, ctx, settings, btn, statusBox) {
    const original = btn.innerHTML;
    btn.textContent = "…";
    btn.disabled = true;
    showStatus(statusBox, "info", `Injecting ${page} page…`);

    try {
      const res = await fetch(`${settings.appUrl}/api/highlevel/inject`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          projectId:    settings.projectId,
          projectToken: settings.projectToken,
          page,
          hlApiKey:     settings.hlApiKey,
          locationId:   ctx.locationId,
          pageId,
          funnelId:     ctx.funnelId || undefined,
        }),
      });
      const json = await res.json();

      if (json.success) {
        btn.textContent = "✓";
        btn.classList.add("success");
        showStatus(statusBox, "success", "Injected! Refresh the page builder to see your page.");
      } else {
        btn.textContent = "✗";
        btn.classList.add("error");
        showStatus(statusBox, "error", `Failed: ${json.error || "Unknown error"}`);
      }
    } catch (e) {
      btn.textContent = "✗";
      btn.classList.add("error");
      showStatus(statusBox, "error", `Network error: ${e.message}`);
    }

    btn.disabled = false;
    setTimeout(() => {
      btn.innerHTML  = original;
      btn.classList.remove("success", "error");
    }, 3500);
  }

  function showStatus(el, type, msg) {
    el.className   = `status ${type}`;
    el.textContent = msg;
  }

  // ── Mount the panel ────────────────────────────────────────────────────────
  function mountPanel() {
    if (document.getElementById(PANEL_ID)) return;

    const host = document.createElement("div");
    host.id = PANEL_ID;
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: "open" });

    chrome.storage.sync.get(["appUrl", "projectId", "projectToken", "hlApiKey"], (settings) => {
      const ctx = detectContext();
      buildPanel(shadow, settings, ctx);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountPanel);
  } else {
    mountPanel();
  }
})();
