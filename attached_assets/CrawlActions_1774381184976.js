import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
export function CrawlActions({ currentUrl, onCrawl, funnelMap, loading }) {
    const [crawlUrl, setCrawlUrl] = useState(currentUrl || "");
    const [userEdited, setUserEdited] = useState(false);
    useEffect(() => {
        if (currentUrl && !userEdited) {
            setCrawlUrl(currentUrl);
        }
    }, [currentUrl]);
    return (_jsxs("div", { className: "card", children: [_jsx("div", { className: "card-title", children: "Funnel Crawler" }), _jsxs("div", { className: "actions-grid", children: [_jsxs("div", { className: "input-group", children: [_jsx("input", { className: "input", type: "text", placeholder: "Root URL to crawl...", value: crawlUrl, onChange: (e) => { setUserEdited(true); setCrawlUrl(e.target.value); }, "data-testid": "input-crawl-url" }), _jsx("button", { className: "btn btn-primary btn-sm", style: { width: "auto", whiteSpace: "nowrap" }, onClick: () => onCrawl(crawlUrl), disabled: loading || !crawlUrl, "data-testid": "btn-start-crawl", children: loading ? _jsx("div", { className: "spinner" }) : "Crawl" })] }), funnelMap && (_jsxs("div", { style: { marginTop: "8px" }, children: [_jsxs("div", { className: "summary-grid", children: [_jsxs("div", { className: "summary-item", children: [_jsx("span", { className: "summary-label", children: "Pages Found" }), _jsx("span", { className: "summary-value", "data-testid": "text-page-count", children: funnelMap.discoveredPages.length })] }), _jsxs("div", { className: "summary-item", children: [_jsx("span", { className: "summary-label", children: "Connections" }), _jsx("span", { className: "summary-value", "data-testid": "text-edge-count", children: funnelMap.edges.length })] })] }), _jsx("div", { style: { marginTop: "8px", maxHeight: "100px", overflowY: "auto" }, children: funnelMap.discoveredPages.map((page) => (_jsxs("div", { style: {
                                        fontSize: "11px",
                                        padding: "3px 0",
                                        borderBottom: "1px solid var(--border)",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }, "data-testid": `page-item-${page.id}`, children: [_jsx("span", { style: {
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                flex: 1,
                                            }, title: page.url, children: page.title || page.url }), page.pageTypeHint && page.pageTypeHint !== "unknown" && (_jsx("span", { style: {
                                                fontSize: "9px",
                                                color: "var(--primary-hover)",
                                                marginLeft: "6px",
                                                textTransform: "uppercase",
                                            }, children: page.pageTypeHint }))] }, page.id))) })] }))] })] }));
}
//# sourceMappingURL=CrawlActions.js.map