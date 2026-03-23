export function isSameDomain(url1, url2) {
    try {
        const a = new URL(url1);
        const b = new URL(url2);
        return a.hostname.toLowerCase() === b.hostname.toLowerCase();
    }
    catch {
        return false;
    }
}
export function normalizeUrl(url, stripQuery = false) {
    try {
        const parsed = new URL(url);
        parsed.hash = "";
        parsed.hostname = parsed.hostname.toLowerCase();
        parsed.protocol = parsed.protocol.toLowerCase();
        if (stripQuery) {
            parsed.search = "";
        }
        let pathname = parsed.pathname;
        if (pathname.endsWith("/") && pathname.length > 1) {
            pathname = pathname.slice(0, -1);
        }
        parsed.pathname = pathname;
        return parsed.toString();
    }
    catch {
        return url;
    }
}
export function getDomain(url) {
    try {
        return new URL(url).hostname.toLowerCase();
    }
    catch {
        return "";
    }
}
export function getBaseDomain(hostname) {
    const parts = hostname.toLowerCase().split(".");
    if (parts.length <= 2)
        return hostname.toLowerCase();
    return parts.slice(-2).join(".");
}
export function isInternalLink(link, baseUrl, allowedDomains = []) {
    try {
        const linkUrl = new URL(link, baseUrl);
        const baseHostname = new URL(baseUrl).hostname.toLowerCase();
        const linkHostname = linkUrl.hostname.toLowerCase();
        if (linkHostname === baseHostname)
            return true;
        if (getBaseDomain(linkHostname) === getBaseDomain(baseHostname))
            return true;
        for (const allowed of allowedDomains) {
            const pattern = allowed.toLowerCase();
            if (pattern.startsWith("*.")) {
                const suffix = pattern.slice(2);
                if (linkHostname === suffix || linkHostname.endsWith("." + suffix)) {
                    return true;
                }
            }
            else if (linkHostname === pattern) {
                return true;
            }
        }
        return false;
    }
    catch {
        return false;
    }
}
export function resolveUrl(link, baseUrl) {
    try {
        return new URL(link, baseUrl).toString();
    }
    catch {
        return link;
    }
}
const NON_PAGE_EXTENSIONS = new Set([
    "png", "jpg", "jpeg", "gif", "svg", "webp", "ico", "avif", "bmp", "tiff",
    "mp4", "webm", "mov", "avi", "mkv", "flv", "wmv",
    "mp3", "wav", "m4a", "ogg", "flac", "aac",
    "pdf", "doc", "docx", "xls", "xlsx", "csv", "ppt", "pptx",
    "zip", "tar", "gz", "rar", "7z", "bz2",
    "css", "js", "json", "xml", "rss", "atom",
    "woff", "woff2", "ttf", "eot", "otf",
    "map", "min.js", "min.css",
]);
export function isNavigableUrl(url) {
    try {
        const parsed = new URL(url);
        const protocol = parsed.protocol.toLowerCase();
        if (protocol !== "http:" && protocol !== "https:")
            return false;
        const pathname = parsed.pathname.toLowerCase();
        const lastSegment = pathname.split("/").pop() || "";
        const ext = lastSegment.includes(".") ? lastSegment.split(".").pop() || "" : "";
        if (ext && NON_PAGE_EXTENSIONS.has(ext))
            return false;
        if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.startsWith("/wp-json/")) {
            return false;
        }
        return true;
    }
    catch {
        return false;
    }
}
export function matchesPattern(url, patterns) {
    if (patterns.length === 0)
        return true;
    try {
        const parsed = new URL(url);
        const fullPath = parsed.pathname + parsed.search;
        return patterns.some((pattern) => {
            const regex = new RegExp(pattern.replace(/\*/g, ".*"));
            return regex.test(fullPath) || regex.test(parsed.pathname);
        });
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=url.js.map