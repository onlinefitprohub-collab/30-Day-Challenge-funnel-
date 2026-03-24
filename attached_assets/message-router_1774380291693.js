import { setTabContext, getTabContext } from "./tab-state";
import { getSettings, saveSettings } from "../storage/settings-repo";
import { getLastPackage, savePackage, clearPackages } from "../storage/clone-repo";
import { getLastFunnelMap, saveFunnelMap, clearCrawlData } from "../storage/crawl-repo";
import { clearSession, addDiagnostic } from "../storage/session-repo";
import { createDiagnosticEntry } from "../core/schema/diagnostics";
import { crawlFunnel } from "../core/crawl/crawler";
import { logger } from "../core/logger";
async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab ?? null;
}
async function sendToContentScript(tabId, message) {
    return chrome.tabs.sendMessage(tabId, message);
}
async function pingContentScript(tabId, message, maxAttempts = 3) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const result = await sendToContentScript(tabId, message);
            return result;
        }
        catch {
            if (attempt === 0) {
                logger.info("router", "Content script not ready, injecting...");
                await chrome.scripting.executeScript({
                    target: { tabId },
                    files: ["content/bootstrap.js"],
                });
            }
            await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
        }
    }
    return null;
}
export function handleMessage(message, sender, sendResponse) {
    const tabId = sender.tab?.id;
    switch (message.type) {
        case "CONTEXT_DETECTED":
            if (tabId) {
                setTabContext(tabId, message.payload);
                logger.info("router", `Context detected for tab ${tabId}`, message.payload);
            }
            sendResponse({ ok: true });
            return false;
        case "DETECT_CONTEXT":
            handleDetectContext(sendResponse);
            return true;
        case "GET_SETTINGS":
            getSettings().then((s) => sendResponse({ ok: true, data: s }));
            return true;
        case "UPDATE_SETTINGS":
            saveSettings(message.payload).then((s) => sendResponse({ ok: true, data: s }));
            return true;
        case "GET_LAST_PACKAGE":
            getLastPackage().then((pkg) => sendResponse({ ok: true, data: pkg }));
            return true;
        case "CAPTURE_PUBLIC_PAGE":
            handleCapturePublicPage(sendResponse);
            return true;
        case "CRAWL_FUNNEL":
            handleCrawlFunnel(message.payload, sendResponse);
            return true;
        case "EXPORT_FUNNEL_MAP":
            getLastFunnelMap().then((m) => sendResponse({ ok: true, data: m }));
            return true;
        case "EXPORT_ASSET_MANIFEST":
            handleExportAssetManifest(sendResponse);
            return true;
        case "CLEAR_SESSION":
            handleClearSession(sendResponse);
            return true;
        case "CAPTURE_COMPLETE":
            savePackage(message.payload).then(() => {
                addDiagnostic(createDiagnosticEntry("info", "CAPTURE_SAVED", `Package saved for ${message.payload.source.url}`));
                sendResponse({ ok: true });
            });
            return true;
        case "CRAWL_COMPLETE":
            saveFunnelMap(message.payload).then(() => {
                addDiagnostic(createDiagnosticEntry("info", "CRAWL_SAVED", `Funnel map saved: ${message.payload.discoveredPages.length} pages`));
                sendResponse({ ok: true });
            });
            return true;
        case "CAPTURE_NATIVE_PAGE":
            sendResponse({ ok: false, error: "Native page capture is not yet implemented" });
            return false;
        case "INSPECT_SAVE_PAYLOAD":
            sendResponse({ ok: false, error: "Save payload inspection is not yet implemented" });
            return false;
        case "CAPTURE_THUMBNAILS":
            sendResponse({ ok: false, error: "Thumbnail capture is not yet implemented" });
            return false;
        case "CRAWL_PROGRESS":
            sendResponse({ ok: true });
            return false;
        case "ERROR":
            logger.error("router", "Error message received", message.payload);
            sendResponse({ ok: true });
            return false;
        default: {
            const _exhaustive = message;
            logger.warn("router", `Unhandled message type: ${message.type}`);
            sendResponse({ ok: false, error: "Unknown message type" });
            return false;
        }
    }
}
async function handleDetectContext(sendResponse) {
    try {
        const tab = await getActiveTab();
        if (!tab?.id) {
            sendResponse({ ok: false, error: "No active tab" });
            return;
        }
        const cached = getTabContext(tab.id);
        if (cached) {
            sendResponse({ ok: true, data: cached });
            return;
        }
        const result = await pingContentScript(tab.id, { type: "DO_DETECT_CONTEXT" });
        if (result?.ok && result.data) {
            setTabContext(tab.id, result.data);
            sendResponse({ ok: true, data: result.data });
        }
        else {
            sendResponse({ ok: true, data: null });
        }
    }
    catch (err) {
        logger.error("router", "Failed to detect context", err);
        sendResponse({ ok: false, error: String(err) });
    }
}
async function handleCapturePublicPage(sendResponse) {
    try {
        const tab = await getActiveTab();
        if (!tab?.id) {
            sendResponse({ ok: false, error: "No active tab" });
            return;
        }
        const result = await pingContentScript(tab.id, { type: "DO_CAPTURE_PAGE" });
        if (result?.ok && result.data) {
            await savePackage(result.data);
            sendResponse({ ok: true, data: result.data });
        }
        else {
            sendResponse({ ok: false, error: result?.error || "Capture returned no data" });
        }
    }
    catch (err) {
        logger.error("router", "Failed to capture page", err);
        sendResponse({ ok: false, error: String(err) });
    }
}
async function handleCrawlFunnel(payload, sendResponse) {
    try {
        const settings = await getSettings();
        const config = {
            rootUrl: payload.rootUrl,
            maxDepth: payload.maxDepth ?? settings.maxCrawlDepth,
            maxPages: payload.maxPages ?? settings.maxPages,
            delayMs: payload.delayMs ?? settings.crawlDelayMs,
            allowedDomains: payload.allowedDomains ?? [],
            includePatterns: payload.includePatterns ?? [],
            excludePatterns: payload.excludePatterns ?? [],
            stripQueryStrings: payload.stripQueryStrings ?? settings.stripQueryStrings,
        };
        logger.info("router", "Starting crawl in background", config);
        const map = await crawlFunnel(config);
        await saveFunnelMap(map);
        sendResponse({ ok: true, data: map });
    }
    catch (err) {
        logger.error("router", "Crawl failed", err);
        sendResponse({ ok: false, error: String(err) });
    }
}
async function handleExportAssetManifest(sendResponse) {
    const pkg = await getLastPackage();
    if (pkg) {
        sendResponse({ ok: true, data: { version: 1, generatedAt: new Date().toISOString(), sourceUrl: pkg.source.url, totalAssets: pkg.assets.length, assets: pkg.assets } });
    }
    else {
        sendResponse({ ok: false, error: "No package available" });
    }
}
async function handleClearSession(sendResponse) {
    await clearSession();
    await clearPackages();
    await clearCrawlData();
    sendResponse({ ok: true });
}
//# sourceMappingURL=message-router.js.map