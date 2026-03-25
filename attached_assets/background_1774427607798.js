// SiteGrab — Background Service Worker
// Relays messages between popup.js and content.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === 'background') {
    handleBackgroundMessage(message, sender, sendResponse);
    return true; // keep channel open for async response
  }
  return false;
});

async function handleBackgroundMessage(message, sender, sendResponse) {
  try {
    switch (message.action) {
      case 'detectPage':
      case 'grabPage':
      case 'dropPage':
        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
          sendResponse({ success: false, error: 'No active tab found' });
          return;
        }

        // Dynamically inject content script (idempotent — content.js guards against double-injection)
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['scripts/content.js']
          });
        } catch (e) {
          sendResponse({ success: false, error: 'Could not access page. Try refreshing.' });
          return;
        }

        // Forward message to content script
        chrome.tabs.sendMessage(tab.id, {
          target: 'content',
          action: message.action,
          data: message.data
        }, (response) => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: 'Could not connect to page. Try refreshing.' });
          } else {
            sendResponse(response);
          }
        });
        break;

      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (err) {
    sendResponse({ success: false, error: err.message });
  }
}
