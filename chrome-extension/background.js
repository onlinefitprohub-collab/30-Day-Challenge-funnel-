// background.js — Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    console.log("[CF Funnel] Installed. Open your Challenge Funnel Results page and click the extension icon to save your project.");
  }
  if (reason === "update") {
    console.log("[CF Funnel] Updated to v2 — zero config, native HL injection.");
  }

  // Inject content.js into already-open matching tabs so the user doesn't
  // have to refresh after installing or updating the extension.
  if (reason === "install" || reason === "update") {
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (!tab.url) continue;
        const isGHL    = tab.url.startsWith("https://app.gohighlevel.com/");
        const isReplit = /https:\/\/[^/]+\.replit\.(dev|app|com)\//.test(tab.url);
        if (!isGHL && !isReplit) continue;
        chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          files: ["content.js"],
        }).catch(() => {}); // silently skip restricted/chrome:// tabs
      }
    });
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
