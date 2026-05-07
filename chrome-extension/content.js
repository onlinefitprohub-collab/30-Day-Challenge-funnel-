// Listen for injection events dispatched from popup.js
window.addEventListener("ghl-funnel-inject", (e) => {
  const data = e.detail;
  if (!data) return;

  // Attempt to call GHL's import API if it's available on the page
  if (typeof window.__ghl_builder_import === "function") {
    window.__ghl_builder_import(data);
    return;
  }

  // Store in sessionStorage so the page can pick it up
  try {
    sessionStorage.setItem("ghl_funnel_import", JSON.stringify(data));
    console.log("[Challenge Funnel Helper] Page data stored in sessionStorage under 'ghl_funnel_import'.");
  } catch {
    console.error("[Challenge Funnel Helper] Failed to store page data.");
  }
});
