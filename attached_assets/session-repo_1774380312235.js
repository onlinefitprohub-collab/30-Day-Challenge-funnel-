const SESSION_KEY = "clonelevel_session";
const DIAGNOSTICS_KEY = "clonelevel_diagnostics";
const PAYLOAD_SNAPSHOTS_KEY = "clonelevel_payload_snapshots";
export async function getSession() {
    const result = await chrome.storage.local.get(SESSION_KEY);
    return result[SESSION_KEY] || {};
}
export async function updateSession(data) {
    const current = await getSession();
    await chrome.storage.local.set({ [SESSION_KEY]: { ...current, ...data } });
}
export async function clearSession() {
    await chrome.storage.local.remove([
        SESSION_KEY,
        DIAGNOSTICS_KEY,
        PAYLOAD_SNAPSHOTS_KEY,
    ]);
}
export async function getDiagnostics() {
    const result = await chrome.storage.local.get(DIAGNOSTICS_KEY);
    return result[DIAGNOSTICS_KEY] || [];
}
export async function addDiagnostic(entry) {
    const entries = await getDiagnostics();
    entries.push(entry);
    if (entries.length > 200)
        entries.splice(0, entries.length - 200);
    await chrome.storage.local.set({ [DIAGNOSTICS_KEY]: entries });
}
export async function savePayloadSnapshot(key, payload) {
    const snapshots = await getPayloadSnapshots();
    snapshots[key] = {
        payload,
        savedAt: new Date().toISOString(),
    };
    await chrome.storage.local.set({ [PAYLOAD_SNAPSHOTS_KEY]: snapshots });
}
export async function getPayloadSnapshots() {
    const result = await chrome.storage.local.get(PAYLOAD_SNAPSHOTS_KEY);
    return result[PAYLOAD_SNAPSHOTS_KEY] || {};
}
//# sourceMappingURL=session-repo.js.map