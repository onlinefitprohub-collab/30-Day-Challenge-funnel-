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

  // Query all normal tabs — works for any domain including white-label GHL
  chrome.tabs.query({ url: '<all_urls>' }, (tabs) => {
    // Exclude extension pages and the panel itself
    const candidates = (tabs || []).filter(t =>
      t.url &&
      !t.url.startsWith('chrome') &&
      !t.url.startsWith('about') &&
      !t.url.startsWith('edge') &&
      t.id !== sender.tab?.id
    );

    if (candidates.length === 0) {
      sendResponse({ ok: false, error: 'No page found to inject into. Open the GHL page builder in another tab first.' });
      return;
    }

    // Prefer a tab with "builder" in URL, otherwise use the most recently active
    const builderTab =
      candidates.find(t => t.url.includes('builder')) ||
      candidates.find(t => t.url.includes('gohighlevel') || t.url.includes('leadconnector') || t.url.includes('highlevel')) ||
      candidates[0];

    // Try sending to content script first
    chrome.tabs.sendMessage(builderTab.id, { type: 'GHL_INJECT', jsonStr }, (resp) => {
      if (chrome.runtime.lastError) {
        // Content script not ready — inject directly via scripting API
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
