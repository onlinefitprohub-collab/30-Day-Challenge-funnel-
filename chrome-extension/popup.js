// popup.js — Challenge Funnel Extension: load project → inject native HL elements

const PAGES = ["landing", "optin", "thankyou", "booking"];
const PAGE_LABELS = {
  landing:  "Landing Page",
  optin:    "Opt-In Page",
  thankyou: "Thank You Page",
  booking:  "Booking Page",
};

document.addEventListener("DOMContentLoaded", async () => {
  await initApiKey();
  await init();
});

/* ── HL API Key ─────────────────────────────────────────────────────────── */

async function initApiKey() {
  const stored = await getStoredApiKey();
  const input  = document.getElementById("api-key-input");
  const badge  = document.getElementById("api-key-badge");
  const saveBtn = document.getElementById("api-key-save");

  if (stored) {
    input.value = stored;
    badge.style.display = "flex";
  }

  saveBtn.addEventListener("click", async () => {
    const key = input.value.trim();
    if (!key) return;
    await saveApiKey(key);
    badge.style.display = "flex";
    saveBtn.textContent = "✓";
    setTimeout(() => { saveBtn.textContent = "Save"; }, 1500);
  });
}

function getStoredApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["cfHlApiKey"], (s) => resolve(s.cfHlApiKey || null));
  });
}

function saveApiKey(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ cfHlApiKey: key }, resolve);
  });
}

/* ── Project / Init ─────────────────────────────────────────────────────── */

async function init() {
  const cached = await getCached();

  if (cached) {
    const ready = await getReady();
    showLibrary(cached, false, ready);
    return;
  }

  const tab = await getActiveTab();
  if (!tab) { showEmpty(); return; }

  const match = parseResultsUrl(tab.url);
  if (!match) { showEmpty(); return; }

  showSaving();
  try {
    await autoSave(match.appUrl, match.projectId);
    const saved = await getCached();
    if (saved) {
      showLibrary(saved, true, null);
    } else {
      showSaveError();
    }
  } catch (e) {
    console.error("CF: autoSave failed", e);
    showSaveError();
  }
}

function parseResultsUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/projects\/([^/]+)/);
    if (!m) return null;
    return { appUrl: u.origin, projectId: m[1] };
  } catch {
    return null;
  }
}

async function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs && tabs[0] ? tabs[0] : null);
    });
  });
}

function getCached() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["cfProject"], (s) => resolve(s.cfProject || null));
  });
}

function getReady() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["cfReady"], (s) => resolve(s.cfReady || null));
  });
}

async function autoSave(appUrl, projectId) {
  // Fetch inject-token (includes project name + HMAC token) — requires user session cookies
  const tokenUrl = `${appUrl}/api/highlevel/inject-token?projectId=${encodeURIComponent(projectId)}`;
  const tokenRes = await fetch(tokenUrl, { credentials: "include" });
  if (!tokenRes.ok) throw new Error("Could not fetch project token — are you logged in to the app?");
  const tokenData = await tokenRes.json();

  const project = {
    projectId,
    projectToken: tokenData.token,
    appUrl,
    challengeConcept: tokenData.projectName || "Challenge Funnel",
    savedAt: Date.now(),
  };

  await new Promise((resolve) => {
    chrome.storage.local.set({ cfProject: project }, resolve);
  });
}

/* ── UI states ───────────────────────────────────────────────────────────── */

function showEmpty() {
  document.getElementById("empty-state").style.display     = "";
  document.getElementById("saving-state").style.display    = "none";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display   = "none";
}

function showSaving() {
  document.getElementById("empty-state").style.display     = "none";
  document.getElementById("saving-state").style.display    = "";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display   = "none";
}

function showSaveError() {
  document.getElementById("empty-state").style.display     = "none";
  document.getElementById("saving-state").style.display    = "none";
  document.getElementById("save-error-state").style.display = "";
  document.getElementById("library-state").style.display   = "none";
}

function showLibrary(cached, justSaved, ready) {
  document.getElementById("empty-state").style.display     = "none";
  document.getElementById("saving-state").style.display    = "none";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display   = "";

  document.getElementById("project-name").textContent = cached.challengeConcept || "Challenge Funnel";

  if (justSaved) {
    const banner = document.getElementById("saved-banner");
    banner.classList.add("show");
    setTimeout(() => banner.classList.remove("show"), 5000);
  }

  // Show loaded badge if a page is ready
  refreshLoadedBadge(ready);

  // Change / clear button
  document.getElementById("change-btn").addEventListener("click", async () => {
    await new Promise((resolve) => chrome.storage.local.remove(["cfProject", "cfReady"], resolve));
    document.getElementById("library-state").style.display = "none";

    const tab   = await getActiveTab();
    const match = tab ? parseResultsUrl(tab.url) : null;
    if (match) {
      showSaving();
      try {
        await autoSave(match.appUrl, match.projectId);
        const saved = await getCached();
        if (saved) {
          showLibrary(saved, true, null);
        } else {
          showSaveError();
        }
      } catch {
        showSaveError();
      }
    } else {
      showEmpty();
    }
  });

  // Load buttons
  document.querySelectorAll(".load-btn").forEach((btn) => {
    btn.addEventListener("click", () => loadPage(btn.dataset.page, btn, cached));
  });

  // Highlight already-loaded page if any
  if (ready) highlightCard(ready.page);
}

function refreshLoadedBadge(ready) {
  const badge = document.getElementById("loaded-badge");
  if (ready && ready.page) {
    badge.classList.add("show");
    document.getElementById("loaded-page-name").textContent = PAGE_LABELS[ready.page] || ready.page;
  } else {
    badge.classList.remove("show");
  }
}

function highlightCard(page) {
  PAGES.forEach((p) => {
    const card = document.getElementById(`card-${p}`);
    const btn  = document.getElementById(`btn-${p}`);
    if (!card || !btn) return;
    if (p === page) {
      card.classList.add("loaded-page");
      btn.textContent = "Loaded";
      btn.classList.add("loaded");
    } else {
      card.classList.remove("loaded-page");
      btn.textContent = "Load";
      btn.classList.remove("loaded");
    }
  });
}

async function loadPage(page, _btn, cached) {
  const ready = {
    projectId:        cached.projectId,
    projectToken:     cached.projectToken,
    appUrl:           cached.appUrl,
    challengeConcept: cached.challengeConcept,
    page,
    loadedAt: Date.now(),
  };

  await new Promise((resolve) => {
    chrome.storage.local.set({ cfReady: ready }, resolve);
  });

  highlightCard(page);
  refreshLoadedBadge(ready);

  showNote("info",
    `${PAGE_LABELS[page]} is loaded!\n\nNow open that page in the HighLevel builder — the extension will show a "Paste into Page Builder" button.`
  );
}

function showNote(type, msg) {
  const el = document.getElementById("note");
  el.textContent = msg;
  el.className   = `note show ${type}`;
}
