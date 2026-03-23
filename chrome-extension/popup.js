// popup.js — Challenge Funnel Extension Popup Logic

// ── State ─────────────────────────────────────────────────────────────────────
let settings = { appUrl: "", projectId: "", projectToken: "", hlApiKey: "" };
let hlContext = { locationId: null, pageId: null, funnelId: null, onHl: false };
let injecting = {};

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  await loadSettings();
  await detectContext();
  renderInjectTab();
  bindEvents();
});

async function loadSettings() {
  const stored = await chrome.storage.sync.get(["appUrl", "projectId", "projectToken", "hlApiKey"]);
  settings.appUrl       = stored.appUrl       || "";
  settings.projectId    = stored.projectId    || "";
  settings.projectToken = stored.projectToken || "";
  settings.hlApiKey     = stored.hlApiKey     || "";

  document.getElementById("s-app-url").value      = settings.appUrl;
  document.getElementById("s-project-id").value   = settings.projectId;
  document.getElementById("s-project-token").value= settings.projectToken;
  document.getElementById("s-hl-api-key").value   = settings.hlApiKey;
}

async function detectContext() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url) return;

    const url = tab.url;
    hlContext.onHl = url.includes("app.gohighlevel.com");

    if (hlContext.onHl) {
      hlContext.locationId = (url.match(/\/location\/([a-zA-Z0-9]+)/) || [])[1] || null;
      hlContext.funnelId   = (url.match(/\/funnels\/([a-zA-Z0-9]+)/)  || [])[1] || null;
      hlContext.pageId     = (url.match(/\/(?:page-builder|pages)\/([a-zA-Z0-9]+)/) || [])[1] || null;

      // Also read from storage (content.js may have detected more)
      const stored = await chrome.storage.local.get(["hlContext"]);
      if (stored.hlContext) {
        hlContext.locationId = hlContext.locationId || stored.hlContext.locationId;
        hlContext.funnelId   = hlContext.funnelId   || stored.hlContext.funnelId;
        hlContext.pageId     = hlContext.pageId     || stored.hlContext.pageId;
      }
    }
  } catch (e) {
    console.error("detectContext error:", e);
  }
}

function isSetupComplete() {
  return settings.appUrl && settings.projectId && settings.projectToken && settings.hlApiKey;
}

// ── Render Inject Tab ─────────────────────────────────────────────────────────
function renderInjectTab() {
  const notOnHl       = document.getElementById("not-on-hl");
  const onHlDiv       = document.getElementById("on-hl");
  const setupRequired = document.getElementById("setup-required");

  if (!hlContext.onHl) {
    notOnHl.style.display       = "";
    onHlDiv.style.display       = "none";
    setupRequired.style.display = "none";
    return;
  }

  notOnHl.style.display = "none";

  if (!isSetupComplete()) {
    setupRequired.style.display = "";
    onHlDiv.style.display       = "none";
    return;
  }

  setupRequired.style.display = "none";
  onHlDiv.style.display       = "";

  // Context card
  const locEl  = document.getElementById("ctx-location");
  const pageEl = document.getElementById("ctx-pageid");
  const projEl = document.getElementById("ctx-project");

  if (hlContext.locationId) {
    locEl.textContent = hlContext.locationId;
    locEl.className   = "context-value ok";
  } else {
    locEl.textContent = "not detected";
    locEl.className   = "context-value bad";
  }

  pageEl.textContent = hlContext.pageId ? hlContext.pageId : "enter below ↓";
  pageEl.className   = hlContext.pageId ? "context-value ok" : "context-value warn";

  projEl.textContent = settings.projectId
    ? settings.projectId.slice(0, 22) + "…"
    : "not set";
  projEl.className = settings.projectId ? "context-value ok" : "context-value bad";

  if (hlContext.pageId) {
    document.getElementById("manual-page-id").value = hlContext.pageId;
  }
}

// ── Events ────────────────────────────────────────────────────────────────────
function bindEvents() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p)  => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });

  document.getElementById("settingsTabBtn").addEventListener("click", () => {
    document.querySelectorAll(".nav-btn")[1].click();
  });

  document.getElementById("save-settings").addEventListener("click", saveSettings);
  document.getElementById("fetch-token-btn").addEventListener("click", fetchToken);

  document.querySelectorAll(".inject-btn").forEach((btn) => {
    btn.addEventListener("click", () => inject(btn.dataset.page, btn));
  });
}

async function saveSettings() {
  const appUrl       = document.getElementById("s-app-url").value.trim().replace(/\/$/, "");
  const projectId    = document.getElementById("s-project-id").value.trim();
  const projectToken = document.getElementById("s-project-token").value.trim();
  const hlApiKey     = document.getElementById("s-hl-api-key").value.trim();

  if (!appUrl || !projectId || !projectToken || !hlApiKey) {
    showStatus("settings-status", "error", "Please fill in all fields (App URL, Project ID, Extension Token, HL API Key).");
    return;
  }

  await chrome.storage.sync.set({ appUrl, projectId, projectToken, hlApiKey });
  settings = { appUrl, projectId, projectToken, hlApiKey };
  showStatus("settings-status", "success", "Settings saved! Switch to Inject Pages tab.");
  renderInjectTab();
}

async function fetchToken() {
  const appUrl    = document.getElementById("s-app-url").value.trim().replace(/\/$/, "");
  const projectId = document.getElementById("s-project-id").value.trim();

  if (!appUrl || !projectId) {
    showStatus("settings-status", "error", "Enter App URL and Project ID first, then click Fetch Token.");
    return;
  }

  const btn = document.getElementById("fetch-token-btn");
  btn.textContent = "Fetching…";
  btn.disabled = true;

  try {
    const res  = await fetch(`${appUrl}/api/highlevel/inject-token?projectId=${projectId}`, {
      credentials: "include",
    });
    const json = await res.json();

    if (json.token) {
      document.getElementById("s-project-token").value = json.token;
      showStatus("settings-status", "success", `Token fetched for "${json.projectName}". Click Save Settings to store it.`);
    } else {
      showStatus("settings-status", "error", json.error || "Could not fetch token. Make sure you're logged into the app.");
    }
  } catch (e) {
    showStatus("settings-status", "error", `Fetch error: ${e.message}. Check App URL and ensure you're logged in.`);
  }

  btn.textContent = "Fetch Token";
  btn.disabled = false;
}

async function inject(page, btn) {
  if (injecting[page]) return;

  const manualPageId = document.getElementById("manual-page-id").value.trim();
  const pageId       = manualPageId || hlContext.pageId;

  if (!pageId) {
    showStatus("inject-status", "error", "Enter a Page ID above — find it in your HL funnel step settings.");
    return;
  }
  if (!hlContext.locationId) {
    showStatus("inject-status", "error", "Location ID not detected. Make sure you're on an app.gohighlevel.com page.");
    return;
  }

  injecting[page] = true;
  btn.textContent = "…";
  btn.disabled    = true;
  showStatus("inject-status", "info", `Injecting ${pageLabel(page)}…`);

  try {
    const res  = await fetch(`${settings.appUrl}/api/highlevel/inject`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        projectId:    settings.projectId,
        projectToken: settings.projectToken,
        page,
        hlApiKey:     settings.hlApiKey,
        locationId:   hlContext.locationId,
        pageId,
        funnelId:     hlContext.funnelId || undefined,
      }),
    });
    const json = await res.json();

    if (json.success) {
      btn.textContent = "✓ Done";
      btn.classList.add("success");
      showStatus("inject-status", "success", `${pageLabel(page)} injected! Refresh the HL page builder to see your page.`);
    } else {
      btn.textContent = "✗ Error";
      btn.classList.add("error");
      showStatus("inject-status", "error", `Injection failed: ${json.error || "Unknown error"}`);
    }
  } catch (e) {
    btn.textContent = "✗ Error";
    btn.classList.add("error");
    showStatus("inject-status", "error", `Network error: ${e.message}. Check App URL in Settings.`);
  }

  injecting[page] = false;
  setTimeout(() => {
    btn.textContent = "Inject";
    btn.disabled    = false;
    btn.classList.remove("success", "error");
  }, 3500);
}

function pageLabel(page) {
  return { landing: "Landing Page", optin: "Opt-In Page", thankyou: "Thank You Page", booking: "Booking Page" }[page] || page;
}

function showStatus(id, type, msg) {
  const el       = document.getElementById(id);
  el.className   = `status-box ${type}`;
  el.textContent = msg;
}
