const LAST_PACKAGE_KEY = "clonelevel_last_package";
const PACKAGE_HISTORY_KEY = "clonelevel_package_history";
const MAX_HISTORY = 10;
export async function getLastPackage() {
    const result = await chrome.storage.local.get(LAST_PACKAGE_KEY);
    return result[LAST_PACKAGE_KEY] || null;
}
export async function savePackage(pkg) {
    await chrome.storage.local.set({ [LAST_PACKAGE_KEY]: pkg });
    const history = await getPackageHistory();
    history.unshift({
        url: pkg.source.url,
        capturedAt: pkg.source.capturedAt,
        mode: pkg.source.mode,
        sectionCount: pkg.page.sections.length,
        assetCount: pkg.assets.length,
    });
    if (history.length > MAX_HISTORY) {
        history.splice(MAX_HISTORY);
    }
    await chrome.storage.local.set({ [PACKAGE_HISTORY_KEY]: history });
}
export async function getPackageHistory() {
    const result = await chrome.storage.local.get(PACKAGE_HISTORY_KEY);
    return result[PACKAGE_HISTORY_KEY] || [];
}
export async function clearPackages() {
    await chrome.storage.local.remove([LAST_PACKAGE_KEY, PACKAGE_HISTORY_KEY]);
}
//# sourceMappingURL=clone-repo.js.map