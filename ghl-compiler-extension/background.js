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
  if (!['GHL_INJECT','GHL_SNIFF','GHL_DEBUG'].includes(msg.type)) return;

  // Helper: find best GHL builder tab
  function findTab(cb) {
    chrome.tabs.query({ url: '<all_urls>' }, (tabs) => {
      const candidates = (tabs || []).filter(t =>
        t.url && !t.url.startsWith('chrome') && !t.url.startsWith('about') && !t.url.startsWith('edge')
      );
      const builderTab =
        candidates.find(t => t.url.includes('builder')) ||
        candidates.find(t => t.url.includes('gohighlevel') || t.url.includes('leadconnector') || t.url.includes('highlevel')) ||
        candidates[0];
      cb(builderTab || null);
    });
  }

  // ── DEBUG ─────────────────────────────────────────────────────────────────
  if (msg.type === 'GHL_DEBUG') {
    findTab(tab => {
      if (!tab) { sendResponse({ ok: false, error: 'No tab found' }); return; }
      chrome.tabs.sendMessage(tab.id, { type: 'GHL_DEBUG' }, resp => {
        if (chrome.runtime.lastError) sendResponse({ ok: false, error: chrome.runtime.lastError.message });
        else sendResponse(resp || { ok: false, error: 'no response' });
      });
    });
    return true;
  }

  // ── SNIFF ────────────────────────────────────────────────────────────────
  if (msg.type === 'GHL_SNIFF') {
    findTab(tab => {
      if (!tab) { sendResponse({ ok: false, error: 'No tab found' }); return; }
      chrome.tabs.sendMessage(tab.id, { type: 'GHL_SNIFF' }, resp => {
        if (chrome.runtime.lastError) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const snap = {};
              for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                snap[k] = localStorage.getItem(k);
              }
              return snap;
            }
          }, (results) => {
            if (chrome.runtime.lastError) sendResponse({ ok: false, error: chrome.runtime.lastError.message });
            else sendResponse({ ok: true, snap: results[0].result });
          });
        } else {
          sendResponse(resp || { ok: true, snap: {} });
        }
      });
    });
    return true;
  }

  if (msg.type !== 'GHL_INJECT') return;

  const jsonStr = JSON.stringify(msg.payload);

  findTab(builderTab => {
    if (!builderTab) {
      sendResponse({ ok: false, error: 'No page found. Open the GHL page builder in another tab first.' });
      return;
    }

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
