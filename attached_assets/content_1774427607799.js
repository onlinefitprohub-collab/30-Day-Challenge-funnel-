// SiteGrab — Content Script
// Bridges between background.js (extension context) and inject.js (page context)

// Guard against multiple injections
if (!window.__sitegrab_content_injected) {
  window.__sitegrab_content_injected = true;

  let injected = false;

  function injectPageScript() {
    if (injected) return;
    injected = true;
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('scripts/inject.js');
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  }

  // Listen for messages from background.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.target !== 'content') return false;

    injectPageScript();

    // Forward to inject.js via window.postMessage, wait for response
    const requestId = 'sg_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    let didRespond = false;

    function onResponse(event) {
      if (event.source !== window) return;
      if (event.data?.source !== 'sitegrab-inject') return;
      if (event.data?.requestId !== requestId) return;
      if (didRespond) return;
      didRespond = true;
      window.removeEventListener('message', onResponse);
      sendResponse(event.data.payload);
    }

    window.addEventListener('message', onResponse);

    // Timeout after 15s
    setTimeout(() => {
      window.removeEventListener('message', onResponse);
      if (!didRespond) {
        didRespond = true;
        sendResponse({ success: false, error: 'Timed out — try refreshing the page.' });
      }
    }, 15000);

    window.postMessage({
      source: 'sitegrab-content',
      requestId,
      action: message.action,
      data: message.data
    }, '*');

    return true; // keep channel open
  });
}
