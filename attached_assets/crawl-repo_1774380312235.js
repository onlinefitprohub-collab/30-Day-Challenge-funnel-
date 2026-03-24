const LAST_FUNNEL_MAP_KEY = "clonelevel_last_funnel_map";
const CRAWL_HISTORY_KEY = "clonelevel_crawl_history";
const MAX_HISTORY = 10;
export async function getLastFunnelMap() {
    const result = await chrome.storage.local.get(LAST_FUNNEL_MAP_KEY);
    return result[LAST_FUNNEL_MAP_KEY] || null;
}
export async function saveFunnelMap(map) {
    await chrome.storage.local.set({ [LAST_FUNNEL_MAP_KEY]: map });
    const history = await getCrawlHistory();
    history.unshift({
        rootUrl: map.rootUrl,
        crawledAt: map.crawledAt,
        pageCount: map.discoveredPages.length,
        edgeCount: map.edges.length,
    });
    if (history.length > MAX_HISTORY) {
        history.splice(MAX_HISTORY);
    }
    await chrome.storage.local.set({ [CRAWL_HISTORY_KEY]: history });
}
export async function getCrawlHistory() {
    const result = await chrome.storage.local.get(CRAWL_HISTORY_KEY);
    return result[CRAWL_HISTORY_KEY] || [];
}
export async function clearCrawlData() {
    await chrome.storage.local.remove([LAST_FUNNEL_MAP_KEY, CRAWL_HISTORY_KEY]);
}
//# sourceMappingURL=crawl-repo.js.map