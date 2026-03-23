// content.js — Challenge Funnel floating copy panel for HighLevel page builder
// Uses Shadow DOM so HL's styles don't interfere.

(function () {
  "use strict";

  const HOST_ID = "cf-funnel-host";
  let copying   = {};

  const PAGES = [
    { key: "landing",  icon: "🏠", label: "Landing" },
    { key: "optin",    icon: "📋", label: "Opt-In" },
    { key: "thankyou", icon: "🎉", label: "Thank You" },
    { key: "booking",  icon: "📅", label: "Booking" },
  ];

  const CSS = `
    :host { all: initial; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }

    #panel {
      position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
      width: 260px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.07);
      overflow: hidden;
    }

    .head {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      padding: 10px 14px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .brand { display: flex; align-items: center; gap: 8px; }
    .logo {
      width: 26px; height: 26px; border-radius: 6px; background: #f97316;
      color: #fff; font-weight: 900; font-size: 11px;
      display: flex; align-items: center; justify-content: center;
    }
    .title { color: #fff; font-size: 12px; font-weight: 700; }
    .sub   { color: rgba(255,255,255,.45); font-size: 10px; }
    .close {
      background: rgba(255,255,255,.12); border: none; border-radius: 4px;
      color: rgba(255,255,255,.7); padding: 2px 6px; cursor: pointer; font-size: 14px;
    }
    .close:hover { background: rgba(255,255,255,.2); }

    .body { padding: 10px 12px; }

    .setup {
      font-size: 11px; color: #92400e; background: #fff7ed;
      border: 1px solid #fed7aa; border-radius: 7px; padding: 8px 10px;
      line-height: 1.5;
    }
    .setup a { color: #f97316; font-weight: 700; text-decoration: underline; cursor: pointer; }

    .label {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .07em; color: #64748b; margin-bottom: 6px;
    }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
    .btn {
      background: #f97316; color: #fff; border: none; border-radius: 7px;
      padding: 7px 6px; font-size: 11px; font-weight: 700; cursor: pointer;
      text-align: center; transition: background .15s; line-height: 1.3;
    }
    .btn:hover:not(:disabled) { background: #ea580c; }
    .btn:disabled { background: #cbd5e1; cursor: not-allowed; }
    .btn.ok  { background: #22c55e; }
    .btn.err { background: #ef4444; }
    .icon { display: block; font-size: 13px; margin-bottom: 1px; }

    .status {
      margin-top: 8px; border-radius: 7px; padding: 7px 9px;
      font-size: 10px; line-height: 1.5; display: none;
    }
    .status.info { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; display: block; }
    .status.err  { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; display: block; }

    /* FAB */
    #fab {
      position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
      width: 42px; height: 42px; border-radius: 50%;
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff; font-weight: 900; font-size: 12px;
      border: none; cursor: pointer;
      box-shadow: 0 4px 16px rgba(249,115,22,.5);
      display: flex; align-items: center; justify-content: center;
    }
    #fab:hover { box-shadow: 0 6px 24px rgba(249,115,22,.7); }
    .hidden { display: none !important; }
  `;

  function buildPanel(shadow, settings) {
    const ready = settings.appUrl && settings.projectId;

    shadow.innerHTML = `
      <style>${CSS}</style>
      <div id="panel">
        <div class="head">
          <div class="brand">
            <div class="logo">CF</div>
            <div>
              <div class="title">CF Funnel Library</div>
              <div class="sub">Click to copy page HTML</div>
            </div>
          </div>
          <button class="close" id="close-btn">−</button>
        </div>
        <div class="body">
          ${!ready ? `
            <div class="setup">
              ⚙ Extension not configured.<br/>
              <a id="open-settings">Open extension popup → Settings</a> and enter your App URL and Project ID.
            </div>
          ` : `
            <div class="label">Copy page HTML</div>
            <div class="grid">
              ${PAGES.map(p => `
                <button class="btn" data-page="${p.key}" id="btn-${p.key}">
                  <span class="icon">${p.icon}</span>${p.label}
                </button>
              `).join("")}
            </div>
            <div class="status" id="status"></div>
          `}
        </div>
      </div>
      <button id="fab" class="hidden" title="CF Funnel Library">CF</button>
    `;

    shadow.getElementById("close-btn").addEventListener("click", () => {
      shadow.getElementById("panel").classList.add("hidden");
      shadow.getElementById("fab").classList.remove("hidden");
    });
    shadow.getElementById("fab").addEventListener("click", () => {
      shadow.getElementById("panel").classList.remove("hidden");
      shadow.getElementById("fab").classList.add("hidden");
    });

    if (!ready) return;

    PAGES.forEach(({ key }) => {
      const btn = shadow.getElementById(`btn-${key}`);
      if (!btn) return;
      btn.addEventListener("click", () => doCopy(key, btn, shadow, settings));
    });
  }

  async function doCopy(page, btn, shadow, settings) {
    if (copying[page]) return;
    copying[page] = true;

    const orig = btn.innerHTML;
    btn.textContent = "…";
    btn.disabled = true;
    clearStatus(shadow);

    try {
      const url = `${settings.appUrl}/api/highlevel/page-copy?projectId=${encodeURIComponent(settings.projectId)}&page=${page}`;
      const res = await fetch(url);

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        showStatus(shadow, "err", `Failed: ${j.error || res.statusText}`);
        resetBtn(btn, orig, settings);
        copying[page] = false;
        return;
      }

      const html = await res.text();
      await navigator.clipboard.writeText(html);

      btn.textContent = "✓";
      btn.classList.add("ok");
      showStatus(shadow, "info", "Copied! In HL builder: drag an HTML Code element → paste with Ctrl+V.");
    } catch (e) {
      btn.classList.add("err");
      btn.textContent = "✗";
      showStatus(shadow, "err", `Error: ${e.message}`);
    }

    copying[page] = false;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.classList.remove("ok", "err");
      btn.disabled = false;
    }, 3500);
  }

  function resetBtn(btn, orig, settings) {
    btn.innerHTML = orig;
    btn.disabled = !(settings.appUrl && settings.projectId);
    btn.classList.remove("ok", "err");
  }

  function showStatus(shadow, type, msg) {
    const el = shadow.getElementById("status");
    if (el) { el.textContent = msg; el.className = `status ${type}`; }
  }

  function clearStatus(shadow) {
    const el = shadow.getElementById("status");
    if (el) { el.textContent = ""; el.className = "status"; }
  }

  function mount() {
    if (document.getElementById(HOST_ID)) return;
    const host = document.createElement("div");
    host.id = HOST_ID;
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: "open" });

    chrome.storage.sync.get(["appUrl", "projectId"], (settings) => {
      buildPanel(shadow, settings);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
