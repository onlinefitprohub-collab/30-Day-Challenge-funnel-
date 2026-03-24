import { generateMessageId } from "../../core/ids";
export function createInitialState() {
    return {
        context: null,
        lastPackage: null,
        lastFunnelMap: null,
        settings: null,
        loading: true,
        error: null,
        activeAction: null,
    };
}
function sendMessage(message) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
            resolve(response);
        });
    });
}
export async function detectContext() {
    const response = await sendMessage({
        type: "DETECT_CONTEXT",
        id: generateMessageId(),
        timestamp: new Date().toISOString(),
    });
    return response?.ok ? response.data : null;
}
export async function capturePublicPage(url) {
    const response = await sendMessage({
        type: "CAPTURE_PUBLIC_PAGE",
        id: generateMessageId(),
        timestamp: new Date().toISOString(),
        payload: { url },
    });
    return response?.ok ? response.data : null;
}
export async function crawlFunnel(rootUrl) {
    const response = await sendMessage({
        type: "CRAWL_FUNNEL",
        id: generateMessageId(),
        timestamp: new Date().toISOString(),
        payload: { rootUrl },
    });
    return response?.ok ? response.data : null;
}
export async function getLastPackage() {
    const response = await sendMessage({
        type: "GET_LAST_PACKAGE",
        id: generateMessageId(),
        timestamp: new Date().toISOString(),
    });
    return response?.ok ? response.data : null;
}
export async function getFunnelMap() {
    const response = await sendMessage({
        type: "EXPORT_FUNNEL_MAP",
        id: generateMessageId(),
        timestamp: new Date().toISOString(),
    });
    return response?.ok ? response.data : null;
}
export async function getAssetManifest() {
    const response = await sendMessage({
        type: "EXPORT_ASSET_MANIFEST",
        id: generateMessageId(),
        timestamp: new Date().toISOString(),
    });
    return response?.ok ? response.data : null;
}
export async function getSettings() {
    const response = await sendMessage({
        type: "GET_SETTINGS",
        id: generateMessageId(),
        timestamp: new Date().toISOString(),
    });
    return response?.ok ? response.data : null;
}
export async function clearSession() {
    const response = await sendMessage({
        type: "CLEAR_SESSION",
        id: generateMessageId(),
        timestamp: new Date().toISOString(),
    });
    return response?.ok || false;
}
export function downloadJson(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
//# sourceMappingURL=popup-store.js.map