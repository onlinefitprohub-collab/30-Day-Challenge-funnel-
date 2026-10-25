const CLIPBOARD_KEYS = [
  'hl-copy-element', 'hl_copy_element', 'builder-clipboard',
  'ghl-clipboard', 'section-clipboard', 'hl-page-clipboard',
  'highlevel_clipboard', 'page-builder-clipboard',
  'hl-section-copy', 'hl_section_copy', 'hl-builder-copy'
];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GHL_INJECT') {
    try {
      CLIPBOARD_KEYS.forEach(k => localStorage.setItem(k, msg.jsonStr));
      sendResponse({ ok: true });
    } catch (e) {
      sendResponse({ ok: false, error: e.message });
    }
  }
});
