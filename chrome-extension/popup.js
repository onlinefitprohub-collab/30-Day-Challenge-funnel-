// popup.js v2.12.1 — Challenge Funnel Extension
// Handles: Copy any GHL page + Paste into GHL builder (clone-funnel-step)
// Also handles: AI project library (load → inject via revex, no API key)
// Also handles: Capture any GHL page schema via URL → CF_FETCH_URL_PAGE

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
  initCapture();
});

/* ════════════════════════════════════════════════════════════════════════════
   COPY / PASTE — clone any GHL page into the builder
   ════════════════════════════════════════════════════════════════════════════ */

function initCopyPaste() {
  refreshCopiedCard();

  document.getElementById("copy-btn").addEventListener("click", doCopy);
  document.getElementById("paste-btn").addEventListener("click", doPaste);
  document.getElementById("clear-btn").addEventListener("click", doClear);
  document.getElementById("debug-inject-btn").addEventListener("click", showInjectDebug);

  // Refresh when storage changes in another context (e.g. content.js cleared it)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "session" && changes.cf_copied_page) refreshCopiedCard();
    if (area === "local"   && changes.cfReady)        refreshCopiedCard();
  });
}

function refreshCopiedCard() {
  chrome.storage.session.get("cf_copied_page", (s) => {
    const copied    = s.cf_copied_page ?? null;
    const card      = document.getElementById("copied-card");
    const clearBtn  = document.getElementById("clear-btn");
    const pasteBtn  = document.getElementById("paste-btn");

    const PAGE_LABELS = {
      landing: "Landing Page", optin: "Opt-In Page",
      thankyou: "Thank You Page", booking: "Booking Page",
    };

    if (copied?.funnelId && copied?.stepId) {
      // Real GHL clone (clone-funnel-step path)
      const name = copied.pageName || "GHL Page";
      const ago  = timeSince(copied.copiedAt);
      card.className = "copied-card has";
      card.innerHTML = `<strong>Copied: ${esc(name)}</strong>GHL clone · copied ${ago} — ready to paste.`;
      clearBtn.style.display = "";
      pasteBtn.disabled      = false;

    } else if (copied?.type === "ai-inject" && copied?.pageData) {
      // AI-generated page (revex inject path)
      const label = PAGE_LABELS[copied.page] || copied.pageName || "AI Page";
      const ago   = timeSince(copied.copiedAt);
      card.className = "copied-card has";
      card.innerHTML = `<strong>AI Page Ready: ${esc(label)}</strong>Saved ${ago} — click Paste to inject into the builder.`;
      clearBtn.style.display = "";
      pasteBtn.disabled      = false;

    } else if (copied?.type === "url-clone" && copied?.pageData) {
      // URL-captured GHL page or AI test page (revex inject path)
      const name = copied.pageName || "Captured Page";
      const ago  = timeSince(copied.copiedAt);
      card.className = "copied-card has";
      card.innerHTML = `<strong>Captured: ${esc(name)}</strong>Queued ${ago} — click Paste to inject into the builder.`;
      clearBtn.style.display = "";
      pasteBtn.disabled      = false;

    } else {
      // cf_copied_page is empty — check cfReady (local storage) as fallback.
      // cfReady is written by "Clone to GHL" and persists across extension updates.
      chrome.storage.local.get("cfReady", (ls) => {
        const ready = ls.cfReady ?? null;
        if (ready?.pageData) {
          const label = PAGE_LABELS[ready.page] || "AI Page";
          const ago   = timeSince(ready.loadedAt);
          card.className = "copied-card has";
          card.innerHTML = `<strong>AI Page Ready: ${esc(label)}</strong>Loaded ${ago} — open a GHL builder tab and click the orange CF button to paste.`;
          clearBtn.style.display = "";
          pasteBtn.disabled      = false;
        } else {
          card.className = "copied-card none";
          card.innerHTML = `<strong>Nothing copied yet</strong>Go to your Challenge Funnel results page and click <strong>Clone to GHL</strong>, or navigate to a GHL page and click Copy below.`;
          clearBtn.style.display = "none";
          pasteBtn.disabled      = true;
        }
      });
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
      const ir = result.injectResult ?? {};
      const methodNote = ir.method ? ` via ${ir.method}` : "";
      res.textContent = `Page pasted into the builder${methodNote}! The builder is reloading — switch to that tab to see your content.`;
      res.className   = "paste-result ok";
      // Show detailed debug info for successful inject
      if (ir.raw || ir.status) {
        res.textContent += `\n\nStatus: ${ir.status ?? "ok"} | Meta: ${ir.metaStatus ?? "-"}\n${(ir.raw ?? "").slice(0, 200)}`;
      }
    } else if ((result?.injectResult?.method ?? result?.method) === "clipboard-ready") {
      // Clipboard keys written — direct injection didn't land but GHL's Ctrl+V may work
      btn.textContent = "Ready — Ctrl+V";
      btn.className   = "btn btn-paste";
      res.textContent = "Content written to GHL's clipboard storage!\n\nSwitch to your GHL builder tab and press Ctrl+V. GHL's own paste handler should load your content.";
      res.className   = "paste-result ok";
    } else {
      const err = result?.error ?? "Unknown error";
      const ir  = result?.injectResult ?? {};
      btn.textContent = "Failed";
      btn.className   = "btn btn-paste err";
      // Show full error + raw GHL response for diagnosis
      let detail = err.slice(0, 400);
      if (ir.method || ir.status || ir.raw) {
        detail += `\n\n— method: ${ir.method ?? "?"} | status: ${ir.status ?? "?"} | meta: ${ir.metaStatus ?? "?"}`;
        if (ir.raw) detail += `\n— GHL raw: ${ir.raw.slice(0, 300)}`;
      }
      res.textContent = detail;
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
  chrome.storage.session.remove("cf_copied_page", refreshCopiedCard);
  document.getElementById("copy-result").className  = "copy-result";
  document.getElementById("paste-result").className = "paste-result";
}

async function showInjectDebug() {
  const div = document.getElementById("debug-inject-result");
  const btn = document.getElementById("debug-inject-btn");
  if (!div) return;
  if (div.className.includes("err") || div.className.includes("ok") || div.className.includes("info")) {
    div.className = "paste-result";
    div.textContent = "";
    btn.textContent = "Debug Info";
    return;
  }

  btn.textContent = "Hide";

  const [ls, ss, tabs] = await Promise.all([
    chrome.storage.local.get(["cf_last_inject", "cfReady"]),
    chrome.storage.session.get("cf_copied_page"),
    new Promise((r) => chrome.tabs.query({ active: true, currentWindow: true }, r)),
  ]);

  const inject = ls.cf_last_inject;
  const ready  = ls.cfReady;
  const copied = ss.cf_copied_page;
  const tab    = tabs?.[0];

  let lines = [];

  /* ── Extension version ── */
  lines.push("=== CF Extension v2.12.1 ===");

  /* ── Active tab info ── */
  const tabUrl = tab?.url ?? "(unknown)";
  const isBuilder = /\/(page-builder|funnel-builder)\//.test(tabUrl);
  lines.push(`\nActive tab: ${tabUrl.slice(0, 100)}`);
  lines.push(`Builder tab: ${isBuilder ? "✓ YES" : "✗ NO — FAB will be disabled"}`);

  /* ── Storage: queued page ── */
  lines.push("\n--- Queued page (session storage) ---");
  if (!copied) {
    lines.push("Nothing queued. Click 'Clone to GHL' in the app first.");
  } else {
    lines.push(`type: ${copied.type ?? "?"}`);
    lines.push(`page: ${copied.pageName || copied.page || "?"}`);
    lines.push(`hasPageData: ${!!copied.pageData}`);
    lines.push(`copiedAt: ${copied.copiedAt ? new Date(copied.copiedAt).toLocaleTimeString() : "?"}`);
    if (copied.funnelId) lines.push(`funnelId: ${copied.funnelId}`);
  }

  /* ── Storage: cfReady ── */
  lines.push("\n--- cfReady (local storage) ---");
  if (!ready) {
    lines.push("Empty.");
  } else {
    lines.push(`page: ${ready.page || "?"}`);
    lines.push(`hasPageData: ${!!ready.pageData}`);
    lines.push(`loadedAt: ${ready.loadedAt ? new Date(ready.loadedAt).toLocaleTimeString() : "?"}`);
  }

  /* ── Last inject result ── */
  lines.push("\n--- Last inject result ---");
  if (!inject) {
    lines.push("No inject attempt yet.");
  } else {
    const ts = inject.ts ? new Date(inject.ts).toLocaleTimeString() : "?";
    lines.push(`[${ts}] ok=${inject.ok} | method=${inject.method ?? "?"}`);
    lines.push(`builderId: ${inject.builderId ?? "?"}`);
    if (inject.savedVia) lines.push(`savedVia: ${inject.savedVia}`);
    if (inject.error)   lines.push(`error: ${inject.error.slice(0, 300)}`);
    if (inject.diag) {
      try {
        const d = typeof inject.diag === "string" ? JSON.parse(inject.diag) : inject.diag;
        if (d.approach1) lines.push(`A1: ${JSON.stringify(d.approach1).slice(0, 120)}`);
        if (d.approach2) lines.push(`A2: ${JSON.stringify(d.approach2).slice(0, 120)}`);
        if (d.approach3) {
          lines.push(`A3 stores found: ${JSON.stringify(d.approach3.candidates ?? []).slice(0, 200)}`);
          lines.push(`A3 result: ${d.approach3.result ?? "?"}`);
        }
      } catch(_) { lines.push(`diag: ${JSON.stringify(inject.diag).slice(0, 200)}`); }
    }
  }

  div.textContent = lines.join("\n");
  div.className = inject?.ok ? "paste-result ok" : "paste-result info";
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
      `${PAGE_LABELS[page]} is loaded!\n\nNow open that funnel page in the GHL builder — the extension panel will show an "Inject AI Page" button. Click it to inject the AI-generated content directly, no API key needed.`
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

/* ════════════════════════════════════════════════════════════════════════════
   CAPTURE — fetch any public GHL page URL → store schema for GHL Inspector
   ════════════════════════════════════════════════════════════════════════════ */

function initCapture() {
  const input  = document.getElementById("capture-url");
  const btn    = document.getElementById("capture-btn");
  const result = document.getElementById("capture-result");

  // Pre-fill with the active tab URL if available
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs?.[0]?.url ?? "";
    if (url && url.startsWith("http")) input.value = url;
  });

  btn.addEventListener("click", async () => {
    const url = input.value.trim();
    if (!url) {
      result.textContent = "Please enter a URL first.";
      result.className = "capture-result err";
      return;
    }

    btn.disabled    = true;
    btn.textContent = "Capturing…";
    result.className = "capture-result";
    result.textContent = "";

    try {
      const res = await sendMessage({ type: "CF_FETCH_URL_PAGE", url });

      if (res?.ok) {
        const name = res.pageName ? esc(res.pageName) : "the page";
        result.innerHTML = `Schema captured for <strong>${name}</strong> — open the GHL Inspector in the app to inspect its element tree.`;
        result.className = "capture-result ok";
      } else {
        result.textContent = res?.error ?? "Capture failed — unknown error.";
        result.className = "capture-result err";
      }
    } catch (e) {
      result.textContent = `Error: ${e.message}`;
      result.className = "capture-result err";
    } finally {
      btn.disabled    = false;
      btn.textContent = "Capture";
    }
  });
}
