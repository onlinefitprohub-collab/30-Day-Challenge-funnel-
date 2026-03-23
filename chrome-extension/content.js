// content.js — Runs on app.gohighlevel.com
// 1. Injects bridge.js into the page's MAIN world to detect pageId/locationId
// 2. Maintains a floating panel with Inject buttons for the saved project

const PAGE_TYPES = [
  { key: "landing",  label: "Landing Page",  emoji: "🏠" },
  { key: "optin",    label: "Opt-In Page",   emoji: "📋" },
  { key: "thankyou", label: "Thank You",     emoji: "🎉" },
  { key: "booking",  label: "Booking Page",  emoji: "📅" },
];

let panel          = null;
let detectedCtx    = { pageId: null, funnelId: null, locationId: null };
let savedProject   = null;
let hlApiKey       = null;
let minimized      = false;
let injecting      = false;
let lastResult     = null; // { ok: bool, msg: string }

// ── Bridge injection ──────────────────────────────────────────────────────────
function injectBridge() {
  if (document.getElementById("__cf_bridge")) return;
  const s = document.createElement("script");
  s.id  = "__cf_bridge";
  s.src = chrome.runtime.getURL("bridge.js");
  s.onload = () => s.remove();
  (document.head || document.documentElement).appendChild(s);
}

window.addEventListener("message", (e) => {
  if (e.source !== window) return;
  if (e.data?.source !== "cf-bridge" || e.data?.type !== "CONTEXT_DETECTED") return;

  const { pageId, funnelId, locationId } = e.data.payload;
  let changed = false;
  if (pageId     && pageId     !== detectedCtx.pageId)     { detectedCtx.pageId     = pageId;     changed = true; }
  if (funnelId   && funnelId   !== detectedCtx.funnelId)   { detectedCtx.funnelId   = funnelId;   changed = true; }
  if (locationId && locationId !== detectedCtx.locationId)  { detectedCtx.locationId = locationId; changed = true; }

  chrome.storage.local.set({ detectedContext: detectedCtx });
  if (changed) renderPanel();
});

function tryUrlExtract() {
  const url = window.location.href;
  const loc  = url.match(/\/location\/([a-zA-Z0-9]+)/i);
  const page = url.match(/\/(?:page-builder|pages)\/([a-zA-Z0-9]+)/i);
  if (loc?.[1])  detectedCtx.locationId = loc[1];
  if (page?.[1]) detectedCtx.pageId     = page[1];
  if (loc?.[1] || page?.[1]) {
    chrome.storage.local.set({ detectedContext: detectedCtx });
    renderPanel();
  }
}

// ── Panel ─────────────────────────────────────────────────────────────────────
function ensurePanel() {
  if (panel) return;
  panel = document.createElement("div");
  panel.style.cssText = `
    position:fixed; bottom:20px; right:20px; z-index:2147483647;
    width:252px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    font-size:13px; color:#111827; border-radius:12px;
    box-shadow:0 4px 24px rgba(0,0,0,.18); overflow:hidden; user-select:none;
  `;
  document.body.appendChild(panel);
}

function renderPanel() {
  ensurePanel();

  const hasProject  = !!savedProject;
  const hasKey      = !!hlApiKey;
  const hasLoc      = !!detectedCtx.locationId;
  const hasPage     = !!detectedCtx.pageId;
  const ready       = hasProject && hasKey && hasLoc && hasPage;
  const dot         = ready ? "#22c55e" : hasProject && hasKey ? "#f59e0b" : "#ef4444";

  const headerHtml = `
    <div id="__cfh" style="
      display:flex;align-items:center;justify-content:space-between;
      padding:9px 12px;background:linear-gradient(135deg,#3b5bdb,#7950f2);cursor:pointer;
    ">
      <span style="color:#fff;font-weight:700;font-size:11px;letter-spacing:.05em;">🏋️ CF FUNNEL</span>
      <div style="display:flex;align-items:center;gap:7px;">
        <div style="width:7px;height:7px;border-radius:50%;background:${dot};"></div>
        <span style="color:rgba(255,255,255,.75);font-size:15px;">${minimized ? "＋" : "−"}</span>
      </div>
    </div>
  `;

  if (minimized) {
    panel.innerHTML = headerHtml;
    panel.querySelector("#__cfh").addEventListener("click", () => { minimized = false; renderPanel(); });
    return;
  }

  let statusMsg = "";
  if (!hasProject)  statusMsg = "Open your results page first.";
  else if (!hasKey)  statusMsg = "Enter HL API key in the extension popup.";
  else if (!hasLoc)  statusMsg = "Navigate to a funnel step in HL.";
  else if (!hasPage) statusMsg = "Detecting page… open or save the step.";

  const btnsHtml = ready ? PAGE_TYPES.map(({ key, label, emoji }) => `
    <button data-inj="${key}" style="
      display:flex;align-items:center;gap:6px;width:100%;
      padding:6px 9px;background:#f0f4ff;border:1px solid #c7d7ff;
      border-radius:7px;cursor:pointer;color:#3b5bdb;
      font-size:11px;font-weight:600;font-family:inherit;transition:background .1s;
    ">${emoji} ${label}</button>
  `).join("") : `
    <div style="font-size:11px;color:#9ca3af;background:#f9fafb;border-radius:7px;padding:8px 9px;">${statusMsg}</div>
  `;

  const resultHtml = lastResult
    ? `<div style="margin-top:6px;font-size:11px;text-align:center;color:${lastResult.ok ? "#22c55e" : "#ef4444"};">
        ${lastResult.ok ? "✓ Injected!" : "✗ " + lastResult.msg}
       </div>`
    : "";

  const injectingHtml = injecting
    ? `<div style="margin-top:6px;font-size:11px;text-align:center;color:#6366f1;">⏳ Injecting…</div>`
    : "";

  panel.innerHTML = headerHtml + `
    <div style="padding:10px 11px;background:#fff;">
      ${hasProject ? `
        <div style="font-weight:600;color:#1e3a8a;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;">
          ${savedProject.projectName || "Your Challenge Funnel"}
        </div>
        <div style="font-size:10px;color:#9ca3af;margin-bottom:8px;">
          ${hasLoc ? "📍 " + detectedCtx.locationId.slice(0,10) + "…" : "📍 waiting…"}
          ${hasPage ? " · 📄 " + detectedCtx.pageId.slice(0,10) + "…" : " · 📄 detecting…"}
        </div>
      ` : `<div style="font-size:11px;color:#9ca3af;margin-bottom:8px;">No project loaded.</div>`}
      <div style="display:flex;flex-direction:column;gap:4px;">${btnsHtml}</div>
      ${injectingHtml}${resultHtml}
    </div>
  `;

  panel.querySelector("#__cfh").addEventListener("click", () => { minimized = true; renderPanel(); });

  if (ready) {
    panel.querySelectorAll("button[data-inj]").forEach((btn) => {
      btn.addEventListener("mouseover", () => { btn.style.background = "#dce4ff"; });
      btn.addEventListener("mouseout",  () => { btn.style.background = "#f0f4ff"; });
      btn.addEventListener("click", () => doInject(btn.dataset.inj));
    });
  }
}

async function doInject(pageType) {
  if (injecting || !savedProject) return;
  injecting   = true;
  lastResult  = null;
  renderPanel();

  try {
    const resp = await fetch(`${savedProject.appUrl}/api/highlevel/inject`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId:    savedProject.projectId,
        projectToken: savedProject.projectToken,
        page:         pageType,
        hlApiKey,
        locationId:   detectedCtx.locationId,
        pageId:       detectedCtx.pageId,
        funnelId:     detectedCtx.funnelId || undefined,
      }),
    });

    const body = await resp.json().catch(() => ({}));
    lastResult = resp.ok
      ? { ok: true,  msg: "" }
      : { ok: false, msg: body.error || `HTTP ${resp.status}` };
  } catch (err) {
    lastResult = { ok: false, msg: err.message || "Network error" };
  }

  injecting = false;
  renderPanel();
  setTimeout(() => { lastResult = null; renderPanel(); }, 4000);
}

// ── Init ──────────────────────────────────────────────────────────────────────
chrome.storage.local.get(["savedProject", "hlApiKey", "detectedContext"], (data) => {
  savedProject  = data.savedProject   || null;
  hlApiKey      = data.hlApiKey       || null;
  detectedCtx   = data.detectedContext || { pageId: null, funnelId: null, locationId: null };

  tryUrlExtract();
  injectBridge();
  renderPanel();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.savedProject) savedProject = changes.savedProject.newValue || null;
  if (changes.hlApiKey)     hlApiKey     = changes.hlApiKey.newValue     || null;
  renderPanel();
});

// SPA navigation watcher
let lastHref = location.href;
new MutationObserver(() => {
  if (location.href !== lastHref) {
    lastHref = location.href;
    tryUrlExtract();
    injectBridge();
    renderPanel();
  }
}).observe(document, { subtree: true, childList: true });
