import { logger } from "../core/logger";
export async function runCrawl(_config) {
    logger.warn("crawler-entry", "Content script crawl entry is deprecated. Crawling now runs in the background service worker.");
    return null;
}
//# sourceMappingURL=crawler.entry.js.map