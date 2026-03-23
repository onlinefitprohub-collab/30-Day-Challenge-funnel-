// popup.js — Challenge Funnel Extension v2
// Auto-detects context from the current tab URL.

const RESULTS_RE = /\/dashboard\/projects\/([a-zA-Z0-9-]+)\/results/;
const HL_RE      = /^https:\/\/app\.gohighlevel\.com/;

let tab          = null;
let savedProject = null;
let hlApiKey     = null;
let detectedCtx  = { pageId: null, funnelId: null, locationId: null };
let injecting    = {};

document.addEventListener("DOMContentLoaded", async () => {
  // Load storage
  const data = await chrome.storage.local.get(["savedProject", "hlApiKey", "detectedContext"]);
  savedProject = data.savedProject  || null;
  hlApiKey     = data.hlApiKey      || null;
  detectedCtx  = data.detectedContext || { pageId: null, funnelId: null, locationId: null };

  // Get active tab
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tab = activeTab;
  const url = tab?.url || "";

  const resMatch = url.match(RESULTS_RE);
  const isHL     = HL_RE.test(url);

  if (resMatch) {
    renderResults(resMatch[1], url);
  } else if (isHL) {
    renderHL();
  } else {
    show("ctx-unknown");
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function show(id) {
  ["ctx-results", "ctx-hl", "ctx-unknown"].forEach((x) =>
    document.getElementById(x).classList.toggle("hidden", x !== id)
  );
}

// ── Results page context ──────────────────────────────────────────────────────
function renderResults(projectId, url) {
  show("ctx-results");

  // Derive appUrl from tab URL
  const appUrl = new URL(url).origin;

  // Prefill project name if already saved
  if (savedProject?.projectId === projectId) {
    document.getElementById("res-proj-name").textContent = savedProject.projectName || "Your Funnel";
    document.getElementById("res-proj-meta").textContent = "Already in library";
    document.getElementById("res-proj-card").style.display = "flex";
    document.getElementById("res-banner").classList.add("hidden");
    document.getElementById("res-saved-msg").classList.remove("hidden");
    document.getElementById("res-save-btn").textContent = "♻ Re-save Project";
  }

  document.getElementById("res-save-btn").addEventListener("click", () =>
    saveProject(projectId, appUrl)
  );
}

async function saveProject(projectId, appUrl) {
  const btn = document.getElementById("res-save-btn");
  btn.disabled = true;
  btn.textContent = "⏳ Saving…";

  try {
    // Execute in the page context (has the session cookie)
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world:  "MAIN",
      func: async (pid) => {
        try {
          const res = await fetch(`/api/highlevel/inject-token?projectId=${pid}`);
          if (!res.ok) return { error: await res.text() };
          return await res.json();
        } catch (e) {
          return { error: e.message };
        }
      },
      args: [projectId],
    });

    const result = results?.[0]?.result;
    if (!result || result.error) {
      showResultsBanner(`✗ ${result?.error || "Could not fetch project token. Are you logged in?"}`, "red");
      btn.disabled = false;
      btn.textContent = "💾 Save to Library";
      return;
    }

    const project = {
      appUrl,
      projectId:    result.projectId,
      projectName:  result.projectName,
      projectToken: result.token,
      savedAt:      Date.now(),
    };

    await chrome.storage.local.set({ savedProject: project });
    savedProject = project;

    // Update UI
    document.getElementById("res-proj-name").textContent = project.projectName || "Your Funnel";
    document.getElementById("res-proj-meta").textContent = "Saved at " + new Date().toLocaleTimeString();
    document.getElementById("res-proj-card").style.display = "flex";
    document.getElementById("res-banner").classList.add("hidden");
    document.getElementById("res-saved-msg").classList.remove("hidden");
    btn.textContent = "♻ Re-save Project";
    btn.disabled = false;

  } catch (err) {
    showResultsBanner(`✗ ${err.message}`, "red");
    btn.disabled = false;
    btn.textContent = "💾 Save to Library";
  }
}

function showResultsBanner(msg, color) {
  const el = document.getElementById("res-banner");
  el.className = `banner banner-${color === "red" ? "red" : "green"}`;
  el.innerHTML = msg;
  el.classList.remove("hidden");
}

// ── HL builder context ────────────────────────────────────────────────────────
function renderHL() {
  show("ctx-hl");

  // Project card
  if (savedProject) {
    document.getElementById("hl-proj-name").textContent = savedProject.projectName || "Your Funnel";
    document.getElementById("hl-proj-meta").textContent =
      "From " + (savedProject.appUrl ? new URL(savedProject.appUrl).hostname : "your app");
    document.getElementById("hl-proj-card").style.display = "flex";
    document.getElementById("hl-no-proj").classList.add("hidden");
  } else {
    document.getElementById("hl-proj-card").style.display = "none";
    document.getElementById("hl-no-proj").classList.remove("hidden");
  }

  // Context pills
  updateContextPills();

  // API key
  if (hlApiKey) {
    document.getElementById("hl-api-key").value = hlApiKey;
    document.getElementById("hl-save-key").textContent = "Saved ✓";
    document.getElementById("hl-save-key").classList.add("saved");
  }

  // Enable/disable inject buttons
  updateInjectButtons();

  // Bindings
  document.getElementById("hl-save-key").addEventListener("click", saveApiKey);
  document.querySelectorAll(".inj-btn[data-page]").forEach((btn) =>
    btn.addEventListener("click", () => doInject(btn.dataset.page, btn))
  );

  // Poll context changes (bridge may detect after popup opens)
  pollContext();
}

function updateContextPills() {
  const locEl  = document.getElementById("ctx-loc");
  const pageEl = document.getElementById("ctx-page");

  if (detectedCtx.locationId) {
    locEl.textContent  = "📍 " + detectedCtx.locationId.slice(0, 10) + "…";
    locEl.className    = "ctx-pill ctx-ok";
  } else {
    locEl.textContent  = "📍 Location";
    locEl.className    = "ctx-pill ctx-off";
  }

  if (detectedCtx.pageId) {
    pageEl.textContent = "📄 " + detectedCtx.pageId.slice(0, 10) + "…";
    pageEl.className   = "ctx-pill ctx-ok";
  } else {
    pageEl.textContent = "📄 Detecting…";
    pageEl.className   = "ctx-pill ctx-off";
  }
}

function updateInjectButtons() {
  const ready = !!(savedProject && hlApiKey && detectedCtx.locationId && detectedCtx.pageId);
  document.querySelectorAll(".inj-btn[data-page]").forEach((btn) => {
    if (!injecting[btn.dataset.page]) {
      btn.disabled = !ready;
    }
  });
}

async function saveApiKey() {
  const val = document.getElementById("hl-api-key").value.trim();
  if (!val) return;
  await chrome.storage.local.set({ hlApiKey: val });
  hlApiKey = val;
  const btn = document.getElementById("hl-save-key");
  btn.textContent = "Saved ✓";
  btn.classList.add("saved");
  updateInjectButtons();
}

async function doInject(pageType, btn) {
  if (injecting[pageType] || !savedProject) return;
  injecting[pageType] = true;

  const orig = btn.textContent;
  btn.textContent = "⏳";
  btn.disabled    = true;
  hideStatus();

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

    if (resp.ok) {
      btn.textContent = "✓";
      btn.classList.add("ok");
      showStatus(`✓ ${pageLabel(pageType)} injected as native HL elements!`, "green");
    } else {
      btn.classList.add("err");
      btn.textContent = "✗";
      showStatus(`✗ ${body.error || "HTTP " + resp.status}`, "red");
    }
  } catch (err) {
    btn.classList.add("err");
    btn.textContent = "✗";
    showStatus(`✗ ${err.message || "Network error"}`, "red");
  }

  injecting[pageType] = false;
  setTimeout(() => {
    btn.textContent = orig;
    btn.classList.remove("ok", "err");
    updateInjectButtons();
  }, 3500);
}

function showStatus(msg, color) {
  const el = document.getElementById("hl-status");
  el.className   = `banner banner-${color === "green" ? "green" : "red"}`;
  el.textContent = msg;
  el.classList.remove("hidden");
}

function hideStatus() {
  document.getElementById("hl-status").classList.add("hidden");
}

// Poll storage for context updates while popup is open
function pollContext() {
  const interval = setInterval(async () => {
    const data = await chrome.storage.local.get(["detectedContext"]);
    const newCtx = data.detectedContext || {};
    let changed = false;
    if (newCtx.locationId && newCtx.locationId !== detectedCtx.locationId) {
      detectedCtx.locationId = newCtx.locationId; changed = true;
    }
    if (newCtx.pageId && newCtx.pageId !== detectedCtx.pageId) {
      detectedCtx.pageId = newCtx.pageId; changed = true;
    }
    if (newCtx.funnelId && newCtx.funnelId !== detectedCtx.funnelId) {
      detectedCtx.funnelId = newCtx.funnelId; changed = true;
    }
    if (changed) {
      updateContextPills();
      updateInjectButtons();
    }
  }, 800);

  // Stop polling when popup closes
  window.addEventListener("unload", () => clearInterval(interval));
}

function pageLabel(page) {
  return { landing: "Landing Page", optin: "Opt-In Page", thankyou: "Thank You Page", booking: "Booking Page" }[page] || page;
}
