import { handleMessage } from "./message-router";
import { removeTabContext } from "./tab-state";
import { logger } from "../core/logger";
logger.info("service-worker", "CloneLevel service worker started");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const keepOpen = handleMessage(message, sender, sendResponse);
    return keepOpen;
});
chrome.tabs.onRemoved.addListener((tabId) => {
    removeTabContext(tabId);
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
        removeTabContext(tabId);
    }
});
chrome.runtime.onInstalled.addListener((details) => {
    logger.info("service-worker", `CloneLevel installed: ${details.reason}`);
});
//# sourceMappingURL=service-worker.js.map