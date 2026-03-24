import { logger } from "../core/logger";
export function capturePagePreview() {
    try {
        logger.info("preview-capture", "Attempting page preview capture");
        // TODO: Implement canvas-based screenshot or use chrome.tabs.captureVisibleTab from background
        logger.warn("preview-capture", "Preview capture via content script is limited; use background-based capture for full screenshots");
        return null;
    }
    catch (err) {
        logger.error("preview-capture", "Preview capture failed", err);
        return null;
    }
}
//# sourceMappingURL=preview-capture.entry.js.map