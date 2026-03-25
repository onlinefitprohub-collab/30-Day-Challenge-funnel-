// popup.js v2.6.0 — Challenge Funnel Extension
// Handles: Copy any GHL page + Paste into GHL builder (clone-funnel-step)
// Also handles: AI project library (load app-generated pages)

const PAGES = ["landing", "optin", "thankyou", "booking"];
const PAGE_LABELS = {
  landing:  "Landing Page",
  optin:    "Opt-In Page",
  thankyou: "Thank You Page",
  booking:  "Booking Page",
};

document.addEventListener("DOMContentLoaded", async () => {
  initCopyPaste();
  initLibrary();
});

/* ════════════════════════════════════════════════════════════════════════════
   COPY / PASTE — clone any GHL page into the builder
   ════════════════════════════════════════════════════════════════════════════ */

function initCopyPaste() {
  refreshCopiedCard();

  document.getElementById("copy-btn").addEventListener("click", doCopy);
  document.getElementById("paste-btn").addEventListener("click", doPaste);
  document.getElementById("clear-btn").addEventListener("click", doClear);

  // Refresh when storage changes in another context (e.g. content.js cleared it)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.cf_copied_page) refreshCopiedCard();
  });
}

function refreshCopiedCard() {
  chrome.storage.local.get("cf_copied_page", (s) => {
    const copied    = s.cf_copied_page ?? null;
    const card      = document.getElementById("copied-card");
    const clearBtn  = document.getElementById("clear-btn");
    const pasteBtn  = document.getElementById("paste-btn");

    if (copied?.funnelId && copied?.stepId) {
      const name = copied.pageName || "GHL Page";
      const ago  = timeSince(copied.copiedAt);
      card.className = "copied-card has";
      card.innerHTML = `<strong>Copied: ${esc(name)}</strong>Copied ${ago} — funnelId: <code>${esc(copied.funnelId.slice(0,12))}…</code>`;
      clearBtn.style.display = "";
      pasteBtn.disabled      = false;
    } else {
      card.className = "copied-card none";
      card.innerHTML = `<strong>Nothing copied yet</strong>Navigate to any GHL funnel or builder page, then click Copy.`;
      clearBtn.style.display = "none";
      pasteBtn.disabled      = true;
    }
  });
}

async function doCopy() {
  const btn = document.getElementById("copy-btn");
  const res = document.getElementById("copy-result");

  btn.disabled    = true;
  btn.textContent = "Copying…";
  res.className   = "copy-result";
  res.textContent = "";

  try {
    const result = await sendMessage({ type: "CF_COPY_PAGE" });

    if (result?.ok) {
      const name = result.record?.pageName || "page";
      res.textContent = `Copied! "${esc(name)}" — now navigate to your GHL builder and click Paste.`;
      res.className   = "copy-result ok";
      refreshCopiedCard();
    } else {
      const err = result?.error ?? "Unknown error";
      res.textContent = `Copy failed: ${err}`;
      res.className   = "copy-result err";
    }
  } catch(e) {
    res.textContent = `Error: ${e.message}`;
    res.className   = "copy-result err";
  } finally {
    btn.textContent = "Copy Current GHL Page";
    btn.disabled    = false;
  }
}

async function doPaste() {
  const btn = document.getElementById("paste-btn");
  const res = document.getElementById("paste-result");

  btn.disabled    = true;
  btn.textContent = "Pasting…";
  btn.className   = "btn btn-paste";
  res.className   = "paste-result";
  res.textContent = "";

  try {
    const result = await sendMessage({ type: "CF_PASTE_PAGE" });

    if (result?.ok) {
      btn.textContent = "Pasted!";
      btn.className   = "btn btn-paste ok";
      res.textContent = "Page cloned into the builder! The builder is reloading — switch to that tab to see your content.";
      res.className   = "paste-result ok";
    } else {
      const err = result?.error ?? "Unknown error";
      btn.textContent = "Failed";
      btn.className   = "btn btn-paste err";
      res.textContent = err.slice(0, 300);
      res.className   = "paste-result err";
    }
  } catch(e) {
    btn.textContent = "Error";
    btn.className   = "btn btn-paste err";
    res.textContent = `Error: ${e.message}`;
    res.className   = "paste-result err";
  } finally {
    setTimeout(() => {
      btn.textContent = "Paste into GHL Builder";
      btn.className   = "btn btn-paste";
      refreshCopiedCard();
    }, 6000);
  }
}

function doClear() {
  chrome.storage.local.remove("cf_copied_page", refreshCopiedCard);
  document.getElementById("copy-result").className  = "copy-result";
  document.getElementById("paste-result").className = "paste-result";
}

/* ════════════════════════════════════════════════════════════════════════════
   AI PROJECT LIBRARY — load app-generated pages
   ════════════════════════════════════════════════════════════════════════════ */

async function initLibrary() {
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
  const tokenUrl = `${appUrl}/api/highlevel/inject-token?projectId=${encodeURIComponent(projectId)}`;
  const tokenRes = await fetch(tokenUrl, { credentials: "include" });
  if (!tokenRes.ok) throw new Error("Could not fetch project info — are you logged in to the app?");
  const tokenData = await tokenRes.json();

  const project = {
    projectId,
    appUrl,
    challengeConcept: tokenData.projectName || "Challenge Funnel",
    savedAt: Date.now(),
  };

  await new Promise((resolve) => {
    chrome.storage.local.set({ cfProject: project }, resolve);
  });
}

/* ── UI states ──────────────────────────────────────────────────────────── */

function showEmpty() {
  document.getElementById("empty-state").style.display      = "";
  document.getElementById("saving-state").style.display     = "none";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display    = "none";
}

function showSaving() {
  document.getElementById("empty-state").style.display      = "none";
  document.getElementById("saving-state").style.display     = "";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display    = "none";
}

function showSaveError() {
  document.getElementById("empty-state").style.display      = "none";
  document.getElementById("saving-state").style.display     = "none";
  document.getElementById("save-error-state").style.display = "";
  document.getElementById("library-state").style.display    = "none";
}

function showLibrary(cached, justSaved, ready) {
  document.getElementById("empty-state").style.display      = "none";
  document.getElementById("saving-state").style.display     = "none";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display    = "";

  document.getElementById("project-name").textContent = cached.challengeConcept || "Challenge Funnel";

  if (justSaved) {
    const banner = document.getElementById("saved-banner");
    banner.classList.add("show");
    setTimeout(() => banner.classList.remove("show"), 5000);
  }

  refreshLoadedBadge(ready);

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

  document.querySelectorAll(".load-btn").forEach((btn) => {
    btn.addEventListener("click", () => loadPage(btn.dataset.page, btn, cached));
  });

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

async function loadPage(page, btn, cached) {
  const origText = btn.textContent;
  btn.disabled   = true;
  btn.textContent = "Loading…";

  try {
    const pdUrl = `${cached.appUrl}/api/highlevel/page-data?projectId=${encodeURIComponent(cached.projectId)}&page=${encodeURIComponent(page)}`;
    const pdRes = await fetch(pdUrl, { credentials: "include" });
    if (!pdRes.ok) throw new Error(`HTTP ${pdRes.status} — are you logged in to the app?`);
    const pdJson = await pdRes.json();

    if (!pdJson.pageData) throw new Error("No page data returned from the app");

    const ready = {
      projectId:        cached.projectId,
      appUrl:           cached.appUrl,
      challengeConcept: cached.challengeConcept,
      page,
      pageData:         pdJson.pageData,
      loadedAt:         Date.now(),
    };

    await new Promise((resolve) => {
      chrome.storage.local.set({ cfReady: ready }, resolve);
    });

    highlightCard(page);
    refreshLoadedBadge(ready);

    showNote("info",
      `${PAGE_LABELS[page]} is loaded!\n\nOpen that page in the HighLevel builder — the extension panel will show a "Paste into Builder" button.`
    );
  } catch (e) {
    showNote("err", `Could not load page data: ${e.message}`);
    btn.textContent = origText;
  } finally {
    btn.disabled = false;
    const ready = await getReady();
    if (ready) highlightCard(ready.page);
  }
}

function showNote(type, msg) {
  const el = document.getElementById("note");
  el.textContent = msg;
  el.className   = `note show ${type}`;
}

/* ════════════════════════════════════════════════════════════════════════════
   SHARED UTILS
   ════════════════════════════════════════════════════════════════════════════ */

function sendMessage(msg) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (response) => {
      resolve(response ?? { ok: false, error: "no_response" });
    });
  });
}

function esc(s) {
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

function timeSince(ts) {
  if (!ts) return "";
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60)    return "just now";
  if (secs < 3600)  return `${Math.floor(secs/60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs/3600)}h ago`;
  return `${Math.floor(secs/86400)}d ago`;
}
