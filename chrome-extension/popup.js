// popup.js — Challenge Funnel Library Extension

let appUrl    = "";
let projectId = "";
let copying   = {};

document.addEventListener("DOMContentLoaded", async () => {
  await loadSettings();
  renderLibrary();
  bindNav();
  bindCopyButtons();
  bindSaveSettings();
  document.getElementById("settings-quick-btn").addEventListener("click", () => {
    document.querySelector('[data-tab="settings"]').click();
  });
});

async function loadSettings() {
  const s = await chrome.storage.sync.get(["appUrl", "projectId"]);
  appUrl    = (s.appUrl    || "").replace(/\/$/, "");
  projectId = s.projectId || "";
  document.getElementById("s-app-url").value    = appUrl;
  document.getElementById("s-project-id").value = projectId;
}

function isReady() {
  return appUrl && projectId;
}

function renderLibrary() {
  const banner = document.getElementById("setup-banner");
  const btns   = document.querySelectorAll(".copy-btn");
  if (!isReady()) {
    banner.style.display = "";
    btns.forEach((b) => (b.disabled = true));
  } else {
    banner.style.display = "none";
    btns.forEach((b) => (b.disabled = false));
  }
}

function bindNav() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach((b)  => b.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p)    => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

function bindCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => copyPage(btn.dataset.page, btn));
  });
}

async function copyPage(page, btn) {
  if (copying[page]) return;
  copying[page] = true;
  btn.textContent = "…";
  btn.disabled = true;
  hideNote();

  try {
    const url = `${appUrl}/api/highlevel/page-copy?projectId=${encodeURIComponent(projectId)}&page=${page}`;
    const res = await fetch(url);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      showNote("err", `Failed: ${j.error || res.statusText}`);
      resetBtn(btn, page);
      return;
    }

    const html = await res.text();
    await navigator.clipboard.writeText(html);

    btn.textContent = "✓ Copied!";
    btn.classList.add("done");
    showNote("info",
      `${pageLabel(page)} HTML copied to clipboard!\n\nIn HL builder: drag an HTML Code element onto the page, click it, then press Ctrl+V (or ⌘V on Mac) to paste.`
    );
  } catch (e) {
    showNote("err", `Error: ${e.message}. Check your App URL in Settings.`);
    resetBtn(btn, page);
    copying[page] = false;
    return;
  }

  copying[page] = false;
  setTimeout(() => {
    btn.textContent = "Copy";
    btn.classList.remove("done");
  }, 4000);
}

function resetBtn(btn, _page) {
  btn.textContent = "Copy";
  btn.disabled = !isReady();
  btn.classList.remove("done", "error");
}

function showNote(type, msg) {
  const el       = document.getElementById("paste-note");
  el.textContent = msg;
  el.className   = `paste-note show ${type}`;
}

function hideNote() {
  document.getElementById("paste-note").className = "paste-note";
}

async function bindSaveSettings() {
  document.getElementById("save-settings").addEventListener("click", async () => {
    const url = document.getElementById("s-app-url").value.trim().replace(/\/$/, "");
    const pid = document.getElementById("s-project-id").value.trim();

    if (!url || !pid) {
      showSettingsStatus("err", "Please enter both App URL and Project ID.");
      return;
    }

    await chrome.storage.sync.set({ appUrl: url, projectId: pid });
    appUrl    = url;
    projectId = pid;
    showSettingsStatus("ok", "Saved! Switch to Library to copy your pages.");
    renderLibrary();
  });
}

function showSettingsStatus(type, msg) {
  const el       = document.getElementById("settings-status");
  el.textContent = msg;
  el.className   = `settings-status ${type}`;
}

function pageLabel(page) {
  return {
    landing:  "Landing Page",
    optin:    "Opt-In Page",
    thankyou: "Thank You Page",
    booking:  "Booking Page",
  }[page] || page;
}
