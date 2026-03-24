import { DEFAULT_SETTINGS } from "../types/messages";
const SETTINGS_KEY = "clonelevel_settings";
export async function getSettings() {
    const result = await chrome.storage.local.get(SETTINGS_KEY);
    const stored = result[SETTINGS_KEY];
    if (stored) {
        return { ...DEFAULT_SETTINGS, ...stored };
    }
    return { ...DEFAULT_SETTINGS };
}
export async function saveSettings(settings) {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await chrome.storage.local.set({ [SETTINGS_KEY]: updated });
    return updated;
}
export async function resetSettings() {
    await chrome.storage.local.set({ [SETTINGS_KEY]: DEFAULT_SETTINGS });
    return { ...DEFAULT_SETTINGS };
}
//# sourceMappingURL=settings-repo.js.map