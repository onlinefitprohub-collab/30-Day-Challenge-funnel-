import { logger } from "../../core/logger";
export function injectPageBridge() {
    logger.info("bridge", "Injecting page bridge");
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("content/bridge/page-bridge-runtime.js");
    script.onload = () => {
        script.remove();
        logger.info("bridge", "Page bridge injected successfully");
    };
    (document.head || document.documentElement).appendChild(script);
}
export function listenForBridgeMessages(callback) {
    window.addEventListener("message", (event) => {
        if (event.source !== window)
            return;
        if (event.data?.source !== "clonelevel-page-bridge")
            return;
        callback(event.data.payload);
    });
}
//# sourceMappingURL=inject-page-bridge.js.map