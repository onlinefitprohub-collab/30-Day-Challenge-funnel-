// background.js — Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    console.log("[CF Funnel] Installed. Open your Challenge Funnel Results page and click the extension icon to save your project.");
  }
  if (reason === "update") {
    console.log("[CF Funnel] Updated to v2 — zero config, native HL injection.");
  }
});

// Relay messages between content script and popup if needed
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === "ping") {
    sendResponse({ alive: true });
    return false;
  }
  // Store hlApiKey from content script context
  if (msg.action === "saveApiKey" && msg.hlApiKey) {
    chrome.storage.local.set({ hlApiKey: msg.hlApiKey }, () => sendResponse({ ok: true }));
    return true; // async
  }
  return false;
});
