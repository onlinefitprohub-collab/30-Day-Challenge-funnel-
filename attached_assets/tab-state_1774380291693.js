const tabContexts = new Map();
export function setTabContext(tabId, context) {
    tabContexts.set(tabId, context);
}
export function getTabContext(tabId) {
    return tabContexts.get(tabId);
}
export function removeTabContext(tabId) {
    tabContexts.delete(tabId);
}
export function getAllTabContexts() {
    return new Map(tabContexts);
}
//# sourceMappingURL=tab-state.js.map