// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

const CLIPBOARD_KEYS = [
  'hl-copy-element', 'hl_copy_element', 'builder-clipboard',
  'ghl-clipboard', 'section-clipboard', 'hl-page-clipboard',
  'highlevel_clipboard', 'page-builder-clipboard',
  'hl-section-copy', 'hl_section_copy', 'hl-builder-copy'
];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== 'GHL_INJECT') return;

  const jsonStr = JSON.stringify(msg.payload);

  // Find the active GHL builder tab
  chrome.tabs.query({
    url: [
      'https://*.gohighlevel.com/*',
      'https://*.highlevel.com/*',
      'https://*.leadconnectorhq.com/*'
    ]
  }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      sendResponse({ ok: false, error: 'No GHL page found. Open the GHL page builder in another tab first.' });
      return;
    }

    // Prefer a tab with "builder" in the URL, otherwise use first match
    const builderTab = tabs.find(t => t.url && t.url.includes('builder')) || tabs[0];

    // Try sending to content script first
    chrome.tabs.sendMessage(builderTab.id, { type: 'GHL_INJECT', jsonStr }, (resp) => {
      if (chrome.runtime.lastError) {
        // Content script not ready — inject via scripting API directly
        chrome.scripting.executeScript({
          target: { tabId: builderTab.id },
          func: (keys, str) => {
            keys.forEach(k => localStorage.setItem(k, str));
            return true;
          },
          args: [CLIPBOARD_KEYS, jsonStr]
        }, (results) => {
          if (chrome.runtime.lastError) {
            sendResponse({ ok: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse({ ok: true });
          }
        });
      } else {
        sendResponse(resp || { ok: true });
      }
    });
  });

  return true; // keep message channel open for async response
});
