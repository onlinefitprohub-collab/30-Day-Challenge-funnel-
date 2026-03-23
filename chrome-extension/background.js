// background.js — Service Worker (Manifest V3)
// Handles install events and message passing.

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    console.log("[CF Funnel] Extension installed. Click the extension icon on app.gohighlevel.com to start injecting pages.");
  }
});

// Listen for messages from content scripts (future use)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "ping") {
    sendResponse({ alive: true });
  }
  return false;
});
