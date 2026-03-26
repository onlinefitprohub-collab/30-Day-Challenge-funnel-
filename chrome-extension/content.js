// content.js v2.12.1 — Challenge Funnel in a Box
// On app pages (*.replit.*): intercepts CF_SAVE_PAGE and CF_SAVE_URL_PAGE and saves
//   pageData to chrome.storage.session (cf_copied_page). CF_SAVE_PAGE also writes
//   chrome.storage.local (cfReady) for the popup.
// On GHL pages: shows a minimal orange FAB. Click it to paste the copied page
//   directly into the builder — no panel, no separate inject button.

(function () {
  "use strict";

  // Version-specific guard: when the extension updates, the new version string
  // doesn't match the old one, so the new content.js always replaces the old one
  // in already-open tabs (no manual page reload needed after extension update).
  if (window.__cfExtLoaded === "2.12.1") return;
  window.__cfExtLoaded = "2.12.1";

  const IS_GHL = window.location.hostname.endsWith("gohighlevel.com");

  /* ─── CF_SAVE_PAGE handler (runs on our app pages) ──────────────────────
   * The app sends page data via postMessage; we cache it for later pasting.
   * ─────────────────────────────────────────────────────────────────────── */
  window.addEventListener("message", (evt) => {
    // Accept CF_SAVE_PAGE from same window OR from child frames (e.g. when the app
    // is embedded inside a Replit project-preview iframe on replit.com/@user/...).
    // We validate by checking source/type fields instead of evt.source identity.
    if (!evt.data || evt.data.source !== "cf-app" || evt.data.type !== "CF_SAVE_PAGE") return;

    const { requestId, projectId, page, pageData, challengeConcept, appUrl } = evt.data.payload || {};
    if (!page || !pageData) return;

    const PAGE_NAMES = { landing: "Landing Page", optin: "Opt-In Form", thankyou: "Thank You Page", booking: "Booking Page" };

    const ready = {
      projectId: projectId || "",
      appUrl:    appUrl || window.location.origin,
      challengeConcept: challengeConcept || "Challenge Funnel",
      page,
      pageData,
      loadedAt: Date.now(),
    };

    const sessionCopy = {
      type:      "ai-inject",
      page,
      pageName:  PAGE_NAMES[page] || page || "AI Page",
      pageData,
      projectId: projectId || "",
      appUrl:    appUrl || window.location.origin,
      copiedAt:  Date.now(),
    };

    chrome.storage.local.set({ cfReady: ready }, () => {
      chrome.storage.session.set({ cf_copied_page: sessionCopy }, () => {
        window.postMessage(
          { source: "cf-ext", type: "CF_SAVE_ACK", payload: { requestId, page, success: true } },
          "*"
        );
      });
    });
  });

  /* ─── CF_GET_CAPTURED_GHL handler (runs on app pages) ───────────────────
   * App sends { source: "cf-app", type: "CF_GET_CAPTURED_GHL" }.
   * We forward to background, then postMessage the result back to the page.
   * ─────────────────────────────────────────────────────────────────────── */
  window.addEventListener("message", (evt) => {
    if (!evt.data || evt.data.source !== "cf-app") return;
    const t = evt.data.type;

    if (t === "CF_PING") {
      window.postMessage({ source: "cf-ext", type: "CF_PONG", version: "2.12.1" }, "*");
    }

    if (t === "CF_PERSIST_CAPTURED_GHL") {
      const capturedPage = evt.data.payload;
      if (capturedPage && typeof capturedPage === "object") {
        chrome.storage.local.set({ capturedGHLPage: capturedPage }, () => {
          window.postMessage(
            { source: "cf-ext", type: "CF_PERSIST_CAPTURED_GHL_ACK", payload: { ok: true } },
            "*"
          );
        });
      }
    }

    if (t === "CF_GET_CAPTURED_GHL") {
      chrome.runtime.sendMessage({ type: "CF_GET_CAPTURED_GHL" }, (result) => {
        window.postMessage(
          { source: "cf-ext", type: "CF_CAPTURED_GHL_DATA", payload: result ?? { ok: false, capturedGHLPage: null } },
          "*"
        );
      });
    }

    if (t === "CF_CLEAR_CAPTURED_GHL") {
      chrome.runtime.sendMessage({ type: "CF_CLEAR_CAPTURED_GHL" });
    }

    if (t === "CF_FETCH_URL_PAGE") {
      chrome.runtime.sendMessage({ type: "CF_FETCH_URL_PAGE", url: evt.data.url }, (result) => {
        window.postMessage(
          { source: "cf-ext", type: "CF_URL_PAGE_DATA", payload: result ?? { ok: false, error: "no_response" } },
          "*"
        );
      });
    }

    if (t === "CF_SAVE_URL_PAGE") {
      const { pageData, pageName, funnelId, locationId, requestId } = evt.data.payload || {};
      if (!pageData) return;
      const sessionCopy = {
        type:       "url-clone",
        pageName:   pageName  || "Captured GHL Page",
        pageData,
        funnelId:   funnelId  || "",
        locationId: locationId || "",
        copiedAt:   Date.now(),
      };
      chrome.storage.session.set({ cf_copied_page: sessionCopy }, () => {
        window.postMessage(
          { source: "cf-ext", type: "CF_URL_CLONE_ACK", payload: { requestId, success: true } },
          "*"
        );
      });
    }
  });

  /* ─── GHL-only from here on ──────────────────────────────────────────── */
  if (!IS_GHL) return;

  /* ─── Inject bridge.js into main world ──────────────────────────────── */
  function injectBridge() {
    if (document.getElementById("cf-bridge-script")) return;
    const s = document.createElement("script");
    s.id  = "cf-bridge-script";
    s.src = chrome.runtime.getURL("bridge.js");
    (document.head || document.documentElement).appendChild(s);
  }

  const HOST_ID = "cf-fab-host";
  let   shadow  = null;
  let   pasting = false;

  /* ─── FAB CSS (shadow DOM — isolated from GHL styles) ───────────────── */
  const CSS = `
    :host { all: initial; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    #fab {
      position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff; font-weight: 900; font-size: 12px; letter-spacing: -0.5px;
      border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(249,115,22,.5), 0 0 0 3px rgba(249,115,22,.15);
      display: flex; align-items: center; justify-content: center;
      transition: box-shadow 0.15s, transform 0.1s, opacity 0.15s;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #fab:hover:not(:disabled) {
      box-shadow: 0 6px 28px rgba(249,115,22,.7), 0 0 0 4px rgba(249,115,22,.2);
      transform: scale(1.06);
    }
    #fab:active:not(:disabled) { transform: scale(0.96); }
    #fab:disabled { opacity: 0.5; cursor: not-allowed; }
    #fab.no-page {
      background: linear-gradient(135deg, #94a3b8, #64748b);
      box-shadow: 0 4px 14px rgba(0,0,0,.18);
    }

    #badge {
      position: absolute; top: 1px; right: 1px;
      width: 13px; height: 13px; border-radius: 50%;
      background: #22c55e;
      border: 2px solid #fff;
      display: none;
    }
    #badge.show     { display: block; }
    #badge.show.ghl { background: #0ea5e9; }

    #toast {
      position: fixed; bottom: 82px; right: 24px; z-index: 2147483647;
      min-width: 210px; max-width: 290px;
      border-radius: 10px; padding: 10px 14px;
      font-size: 12px; line-height: 1.55; font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.16);
      opacity: 0; pointer-events: none;
      transition: opacity 0.2s;
    }
    #toast.show          { opacity: 1; }
    #toast.ok  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
    #toast.err { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
    #toast.spin { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }
  `;

  /* ─── Build FAB ─────────────────────────────────────────────────────── */
  function buildFab() {
    const host = document.createElement("div");
    host.id    = HOST_ID;
    document.body.appendChild(host);
    shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>${CSS}</style>
      <button id="fab" class="no-page" title="CF Funnel — loading…" disabled>
        <span id="fab-text">CF</span>
        <span id="badge"></span>
      </button>
      <div id="toast"></div>
    `;
    shadow.getElementById("fab").addEventListener("click", doPaste);
    updateFab();
  }

  /* ─── Update FAB badge + tooltip ────────────────────────────────────── */
  function setFabNoPage(fab, badge) {
    fab.title    = "CF Funnel — click Clone to GHL in the app to load a page";
    fab.disabled = true;
    fab.classList.add("no-page");
    badge.className = "";
  }

  function updateFab() {
    if (!shadow) return;
    const fab   = shadow.getElementById("fab");
    const badge = shadow.getElementById("badge");
    if (!fab || !badge) return;

    const PAGE_LABELS = { landing: "Landing Page", optin: "Opt-In Page", thankyou: "Thank You Page", booking: "Booking Page" };
    const isBuilder = /\/(page-builder|funnel-builder)\//.test(window.location.href);

    // Safety net: if storage callbacks never fire (e.g. service worker restart),
    // 8 s is enough for the service worker to cold-start after browser/extension restart.
    const fallbackTimer = setTimeout(() => setFabNoPage(fab, badge), 8000);

    try {
      chrome.storage.local.get(["cfReady"], (ls) => {
        if (chrome.runtime.lastError) {
          clearTimeout(fallbackTimer);
          setFabNoPage(fab, badge);
          return;
        }
        chrome.storage.session.get(["cf_copied_page"], (ss) => {
          clearTimeout(fallbackTimer);
          if (chrome.runtime.lastError) {
            setFabNoPage(fab, badge);
            return;
          }

          const ready  = ls.cfReady       ?? null;
          const copied = ss.cf_copied_page ?? null;

          const hasAiCopy  = !!(copied?.type === "ai-inject" && copied?.pageData);
          const hasUrlClone = !!(copied?.type === "url-clone" && copied?.pageData);
          const hasGHLCopy = !!(copied?.funnelId && copied?.stepId);
          const hasAIOnly  = !hasAiCopy && !hasUrlClone && !hasGHLCopy && !!(ready?.pageData);

          if (hasGHLCopy) {
            const name = copied.pageName || "GHL Page";
            fab.title   = isBuilder
              ? `GHL Clone ready: ${name} — click to paste`
              : `GHL Clone: ${name} — open a GHL builder tab to paste`;
            fab.disabled = !isBuilder || pasting;
            fab.classList.remove("no-page");
            badge.className = "show ghl";

          } else if (hasUrlClone) {
            const name = copied.pageName || "Captured GHL Page";
            fab.title   = isBuilder
              ? `Captured: ${name} — click to paste`
              : `Captured: ${name} — open a GHL builder tab to paste`;
            fab.disabled = !isBuilder || pasting;
            fab.classList.remove("no-page");
            badge.className = "show";

          } else if (hasAiCopy || hasAIOnly) {
            const pg    = hasAiCopy ? copied.page : ready.page;
            const label = PAGE_LABELS[pg] || "AI Page";
            fab.title   = isBuilder
              ? `AI Page Ready: ${label} — click to paste`
              : `AI Page: ${label} — open a GHL builder tab to paste`;
            fab.disabled = !isBuilder || pasting;
            fab.classList.remove("no-page");
            badge.className = "show";

          } else {
            setFabNoPage(fab, badge);
          }

          if (pasting) fab.disabled = true;
        });
      });
    } catch (e) {
      clearTimeout(fallbackTimer);
      setFabNoPage(fab, badge);
    }
  }

  /* ─── Paste action ──────────────────────────────────────────────────── */
  function setFabText(txt) {
    const t = shadow && shadow.getElementById("fab-text");
    if (t) t.textContent = txt;
  }

  async function doPaste() {
    if (pasting) return;
    pasting = true;
    const fab = shadow && shadow.getElementById("fab");
    if (fab) fab.disabled = true;
    setFabText("…");
    showToast("spin", "Pasting page…");

    try {
      const result = await Promise.race([
        new Promise((resolve) => chrome.runtime.sendMessage({ type: "CF_PASTE_PAGE" }, resolve)),
        new Promise((resolve) => setTimeout(
          () => resolve({ ok: false, error: "Timed out (10s) — the extension took too long. Try reloading the GHL builder tab and clicking the CF button again." }),
          10000
        )),
      ]);

      if (result?.ok) {
        setFabText("✓");
        const msg = result.toast
          ?? "Pasted! Builder is reloading — your content will appear in a few seconds.";
        showToast("ok", msg);
        setTimeout(() => { resetFab(); hideToast(); }, 4000);
      } else if (result?.injectResult?.method === "clipboard-ready" || result?.method === "clipboard-ready") {
        // Clipboard keys written — direct injection didn't land, but GHL's own Ctrl+V may work
        setFabText("V");
        showToast("spin", "Content written to clipboard storage! Now press Ctrl+V inside the GHL builder to paste using GHL's own paste.");
        setTimeout(() => { resetFab(); hideToast(); }, 12000);
      } else {
        const err = result?.error ?? "Unknown error";
        setFabText("!");
        showToast("err", err.slice(0, 220));
        setTimeout(() => { resetFab(); hideToast(); }, 7000);
      }
    } catch(e) {
      setFabText("!");
      showToast("err", `Error: ${e.message.slice(0, 180)}`);
      setTimeout(() => { resetFab(); hideToast(); }, 7000);
    } finally {
      pasting = false;
    }
  }

  function resetFab() {
    setFabText("CF");
    updateFab();
  }

  /* ─── Toast helpers ─────────────────────────────────────────────────── */
  function showToast(type, msg) {
    const t = shadow && shadow.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.className   = `show ${type}`;
  }

  function hideToast() {
    const t = shadow && shadow.getElementById("toast");
    if (t) { t.className = ""; t.textContent = ""; }
  }

  /* ─── Listen for storage changes ────────────────────────────────────── */
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "session" && changes.cf_copied_page) updateFab();
    if (area === "local"   && changes.cfReady)        updateFab();
  });

  /* ─── Mount ─────────────────────────────────────────────────────────── */
  function mount() {
    document.getElementById(HOST_ID)?.remove();
    injectBridge();
    buildFab();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

})();
