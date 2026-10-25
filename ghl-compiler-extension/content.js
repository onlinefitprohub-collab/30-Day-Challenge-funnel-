const CLIPBOARD_KEYS = [
  'hl-copy-element', 'hl_copy_element', 'builder-clipboard',
  'ghl-clipboard', 'section-clipboard', 'hl-page-clipboard',
  'highlevel_clipboard', 'page-builder-clipboard',
  'hl-section-copy', 'hl_section_copy', 'hl-builder-copy',
  'hl-clipboard', 'ghl-section-clipboard', 'funnel-clipboard',
  'page-section-clipboard', 'hl-page-builder-clipboard'
];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  // ── INJECT ──────────────────────────────────────────────────────────────
  if (msg.type === 'GHL_INJECT') {
    try {
      // 1. Write full page JSON to every likely localStorage key
      CLIPBOARD_KEYS.forEach(k => localStorage.setItem(k, msg.jsonStr));

      // 2. Also write individual section objects to section-specific keys
      try {
        const parsed = JSON.parse(msg.jsonStr);
        if (parsed.sections && parsed.sections.length) {
          const sectionStr = JSON.stringify(parsed.sections[0]);
          ['hl-copy-element', 'hl_copy_element', 'hl-section-copy', 'hl_section_copy'].forEach(k =>
            localStorage.setItem(k, sectionStr)
          );
        }
      } catch (_) {}

      // 3. Write to system clipboard so Ctrl+V works natively
      navigator.clipboard.writeText(msg.jsonStr).catch(() => {});

      // 4. Dispatch a paste event on the document — fires GHL's paste handler if it has one
      try {
        const dt = new DataTransfer();
        dt.setData('text/plain', msg.jsonStr);
        dt.setData('application/json', msg.jsonStr);
        document.dispatchEvent(new ClipboardEvent('paste', {
          clipboardData: dt,
          bubbles: true,
          cancelable: true
        }));
        // Also try on the actively focused element (the builder canvas)
        if (document.activeElement && document.activeElement !== document.body) {
          document.activeElement.dispatchEvent(new ClipboardEvent('paste', {
            clipboardData: dt,
            bubbles: true,
            cancelable: true
          }));
        }
      } catch (_) {}

      sendResponse({ ok: true });
    } catch (e) {
      sendResponse({ ok: false, error: e.message });
    }
  }

  // ── SNIFF ── detect what localStorage keys GHL actually uses ────────────
  if (msg.type === 'GHL_SNIFF') {
    const snap = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      snap[k] = localStorage.getItem(k);
    }
    sendResponse({ ok: true, snap });
  }

  return true;
});
