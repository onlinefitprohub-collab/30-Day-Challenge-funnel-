// popup.js — Challenge Funnel Library Extension (zero-config auto-save)

const PAGES = ["landing", "optin", "thankyou", "booking"];
let copying = {};

document.addEventListener("DOMContentLoaded", async () => {
  await init();
});

async function init() {
  const cached = await getCached();

  if (cached) {
    showLibrary(cached, false);
    return;
  }

  // Check if we're on a results page
  const tab = await getActiveTab();
  if (!tab) {
    showEmpty();
    return;
  }

  const match = parseResultsUrl(tab.url);
  if (!match) {
    showEmpty();
    return;
  }

  // Auto-save: fetch all pages and cache them
  showSaving();
  try {
    await autoSave(match.appUrl, match.projectId);
    const saved = await getCached();
    if (saved) {
      showLibrary(saved, true);
    } else {
      showSaveError();
    }
  } catch {
    showSaveError();
  }
}

function parseResultsUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    // Match: /dashboard/projects/{id}/results
    const m = u.pathname.match(/\/dashboard\/projects\/([^/]+)\/results/);
    if (!m) return null;
    return {
      appUrl: u.origin,
      projectId: m[1],
    };
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

async function getCached() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["cfProject"], (s) => {
      resolve(s.cfProject || null);
    });
  });
}

async function autoSave(appUrl, projectId) {
  // First fetch project info (?info=true) to get challenge concept
  const infoUrl = `${appUrl}/api/highlevel/page-copy?projectId=${encodeURIComponent(projectId)}&info=true`;
  const infoRes = await fetch(infoUrl);
  if (!infoRes.ok) throw new Error("Could not fetch project info");
  const info = await infoRes.json();
  const challengeConcept = info.challengeConcept || "Challenge Funnel";

  // Fetch all 4 pages in parallel
  const pageHtmls = {};
  await Promise.all(
    PAGES.map(async (page) => {
      const url = `${appUrl}/api/highlevel/page-copy?projectId=${encodeURIComponent(projectId)}&page=${page}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${page} page`);
      pageHtmls[page] = await res.text();
    })
  );

  const project = {
    projectId,
    appUrl,
    challengeConcept,
    pages: pageHtmls,
    savedAt: Date.now(),
  };

  await new Promise((resolve) => {
    chrome.storage.local.set({ cfProject: project }, resolve);
  });
}

function showEmpty() {
  document.getElementById("empty-state").style.display = "";
  document.getElementById("saving-state").style.display = "none";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display = "none";
}

function showSaving() {
  document.getElementById("empty-state").style.display = "none";
  document.getElementById("saving-state").style.display = "";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display = "none";
}

function showSaveError() {
  document.getElementById("empty-state").style.display = "none";
  document.getElementById("saving-state").style.display = "none";
  document.getElementById("save-error-state").style.display = "";
  document.getElementById("library-state").style.display = "none";
}

function showLibrary(cached, justSaved) {
  document.getElementById("empty-state").style.display = "none";
  document.getElementById("saving-state").style.display = "none";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display = "";

  // Project name
  document.getElementById("project-name").textContent = cached.challengeConcept || "Challenge Funnel";

  // Saved banner
  const banner = document.getElementById("saved-banner");
  if (justSaved) {
    banner.classList.add("show");
    setTimeout(() => banner.classList.remove("show"), 4000);
  }

  // Change button — clear cache then immediately re-attempt auto-detect
  document.getElementById("change-btn").addEventListener("click", async () => {
    await new Promise((resolve) => chrome.storage.local.remove("cfProject", resolve));
    document.getElementById("library-state").style.display = "none";
    copying = {};

    const tab = await getActiveTab();
    const match = tab ? parseResultsUrl(tab.url) : null;
    if (match) {
      showSaving();
      try {
        await autoSave(match.appUrl, match.projectId);
        const saved = await getCached();
        if (saved) {
          showLibrary(saved, true);
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

  // Copy buttons
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => copyPage(btn.dataset.page, btn, cached));
  });
}

async function copyPage(page, btn, cached) {
  if (copying[page]) return;
  copying[page] = true;

  const html = cached.pages && cached.pages[page];
  if (!html) {
    showNote("err", `No cached HTML for ${pageLabel(page)}. Clear project and re-save.`);
    copying[page] = false;
    return;
  }

  btn.textContent = "…";
  btn.disabled = true;
  hideNote();

  try {
    await navigator.clipboard.writeText(html);
    btn.textContent = "✓ Copied!";
    btn.classList.add("done");
    showNote(
      "info",
      `${pageLabel(page)} HTML copied!\n\nIn HL builder: drag an HTML Code element onto the page, click it, then paste with Ctrl+V (or ⌘V on Mac).`
    );
  } catch (e) {
    showNote("err", `Copy failed: ${e.message}`);
    btn.textContent = "Copy";
    btn.classList.remove("done");
    btn.disabled = false;
    copying[page] = false;
    return;
  }

  copying[page] = false;
  setTimeout(() => {
    btn.textContent = "Copy";
    btn.classList.remove("done");
    btn.disabled = false;
  }, 4000);
}

function showNote(type, msg) {
  const el = document.getElementById("paste-note");
  el.textContent = msg;
  el.className = `paste-note show ${type}`;
}

function hideNote() {
  document.getElementById("paste-note").className = "paste-note";
}

function pageLabel(page) {
  return {
    landing:  "Landing Page",
    optin:    "Opt-In Page",
    thankyou: "Thank You Page",
    booking:  "Booking Page",
  }[page] || page;
}
