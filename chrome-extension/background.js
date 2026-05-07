// Service worker — no persistent state needed.
// Listens for install events for future use.
chrome.runtime.onInstalled.addListener(() => {
  console.log("[Challenge Funnel Helper] Extension installed.");
});
