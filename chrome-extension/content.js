// content.js — Injected into app.gohighlevel.com pages
// Reads page context from the URL and stores it for the popup.

(function () {
  "use strict";

  function detectContext() {
    const url = window.location.href;
    const locationMatch = url.match(/\/location\/([a-zA-Z0-9]+)/);
    const funnelMatch   = url.match(/\/funnels\/([a-zA-Z0-9]+)/);
    const pageMatch     = url.match(/\/(?:page-builder|pages)\/([a-zA-Z0-9]+)/);

    return {
      onHl:       true,
      locationId: locationMatch ? locationMatch[1] : null,
      funnelId:   funnelMatch   ? funnelMatch[1]  : null,
      pageId:     pageMatch     ? pageMatch[1]    : null,
      url:        url,
    };
  }

  function storeContext() {
    const ctx = detectContext();
    chrome.storage.local.set({ hlContext: ctx });
  }

  // Store on initial load
  storeContext();

  // Update when navigation happens (HL is a SPA)
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      storeContext();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Inject a floating "CF" button in the bottom-right
  function injectFloatingButton() {
    if (document.getElementById("cf-funnel-fab")) return;

    const fab = document.createElement("div");
    fab.id = "cf-funnel-fab";
    fab.title = "Challenge Funnel — Inject Page";
    fab.style.cssText = [
      "position: fixed",
      "bottom: 24px",
      "right: 24px",
      "width: 48px",
      "height: 48px",
      "border-radius: 50%",
      "background: linear-gradient(135deg, #f97316, #ea580c)",
      "color: #fff",
      "font-weight: 900",
      "font-size: 13px",
      "border: none",
      "cursor: pointer",
      "z-index: 2147483647",
      "box-shadow: 0 4px 18px rgba(249,115,22,0.5)",
      "display: flex",
      "align-items: center",
      "justify-content: center",
      "font-family: -apple-system, sans-serif",
      "letter-spacing: -0.5px",
      "transition: transform 0.15s, box-shadow 0.15s",
      "user-select: none",
    ].join(";");

    fab.textContent = "CF";

    fab.addEventListener("mouseenter", () => {
      fab.style.transform  = "scale(1.1)";
      fab.style.boxShadow  = "0 8px 28px rgba(249,115,22,0.65)";
    });
    fab.addEventListener("mouseleave", () => {
      fab.style.transform  = "scale(1)";
      fab.style.boxShadow  = "0 4px 18px rgba(249,115,22,0.5)";
    });

    // Show a tooltip on click instructing user to open the extension popup
    fab.addEventListener("click", () => {
      showTooltip(fab);
    });

    document.body.appendChild(fab);
  }

  function showTooltip(anchor) {
    const existing = document.getElementById("cf-funnel-tooltip");
    if (existing) { existing.remove(); return; }

    const tip = document.createElement("div");
    tip.id = "cf-funnel-tooltip";
    tip.style.cssText = [
      "position: fixed",
      "bottom: 82px",
      "right: 24px",
      "background: #0f172a",
      "color: #fff",
      "font-size: 12px",
      "font-family: -apple-system, sans-serif",
      "padding: 10px 14px",
      "border-radius: 10px",
      "z-index: 2147483647",
      "max-width: 220px",
      "line-height: 1.55",
      "box-shadow: 0 8px 28px rgba(0,0,0,0.35)",
      "pointer-events: none",
    ].join(";");

    const ctx = detectContext();
    const locStr = ctx.locationId ? `Location: ${ctx.locationId}` : "Location not detected";
    const pageStr = ctx.pageId ? `Page ID: ${ctx.pageId}` : "Page ID not in URL";

    tip.innerHTML = `
      <strong style="color:#f97316;">CF Funnel Injector</strong><br>
      ${locStr}<br>
      ${pageStr}<br>
      <span style="color:#94a3b8;font-size:11px;">Click the extension icon in Chrome's toolbar to inject pages.</span>
    `;

    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 4000);
  }

  // Inject FAB after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectFloatingButton);
  } else {
    injectFloatingButton();
  }
})();
