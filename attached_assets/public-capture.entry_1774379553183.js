import { capturePublicPage } from "../core/dom/build-public-package";
import { logger } from "../core/logger";
export function runPublicCapture() {
    logger.info("public-capture", "Starting public page capture");
    return capturePublicPage(window.location.href, document);
}
//# sourceMappingURL=public-capture.entry.js.map