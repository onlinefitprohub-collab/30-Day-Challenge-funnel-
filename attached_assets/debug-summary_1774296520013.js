export function summarizeCrawl(map) {
    const pageTypes = {};
    const relationshipTypes = {};
    let maxDepth = 0;
    const pageIdToUrl = new Map();
    for (const page of map.discoveredPages) {
        pageIdToUrl.set(page.id, page.url);
        const t = page.pageTypeHint || "unknown";
        pageTypes[t] = (pageTypes[t] || 0) + 1;
        if (page.depth > maxDepth)
            maxDepth = page.depth;
    }
    for (const edge of map.edges) {
        const t = edge.relationshipType;
        relationshipTypes[t] = (relationshipTypes[t] || 0) + 1;
    }
    const redirectCount = map.diagnostics.filter((d) => d.startsWith("Redirect:")).length;
    return {
        type: "crawl",
        rootUrl: map.rootUrl,
        pageCount: map.discoveredPages.length,
        edgeCount: map.edges.length,
        pageTypes,
        relationshipTypes,
        maxDepth,
        diagnosticCount: map.diagnostics.length,
        redirectCount,
        pages: map.discoveredPages.map((p) => ({
            url: p.url,
            type: p.pageTypeHint || "unknown",
            depth: p.depth,
            assets: p.assetCount || 0,
            hasThumbnail: !!p.thumbnailDataUrl,
        })),
        edges: map.edges.map((e) => ({
            from: pageIdToUrl.get(e.fromPageId) || e.fromPageId,
            to: pageIdToUrl.get(e.toPageId) || e.toPageId,
            type: e.relationshipType,
            confidence: e.confidence,
            text: e.linkText || undefined,
        })),
        diagnostics: map.diagnostics,
    };
}
export function summarizePackage(pkg) {
    const elementTypes = {};
    let totalRows = 0;
    let totalColumns = 0;
    let totalElements = 0;
    const sections = pkg.page.sections.map((s) => {
        let sectionElements = 0;
        for (const row of s.rows) {
            totalRows++;
            for (const col of row.columns) {
                totalColumns++;
                totalElements += col.elements.length;
                sectionElements += col.elements.length;
                for (const el of col.elements) {
                    elementTypes[el.type] = (elementTypes[el.type] || 0) + 1;
                }
            }
        }
        return {
            hint: s.sectionHint,
            confidence: s.confidence,
            rows: s.rows.length,
            elements: sectionElements,
        };
    });
    const junkAssets = pkg.assets.filter((a) => a.isJunk).length;
    return {
        type: "package",
        url: pkg.source.url,
        title: pkg.page.title,
        sectionCount: pkg.page.sections.length,
        totalRows,
        totalColumns,
        totalElements,
        assetCount: pkg.assets.length,
        junkAssets,
        sections,
        elementTypes,
        fonts: pkg.page.globalStyles?.fonts || [],
        colors: pkg.page.globalStyles?.colors || [],
        warningCount: pkg.diagnostics?.warnings.length || 0,
        unsupportedCount: pkg.diagnostics?.unsupported.length || 0,
        warnings: pkg.diagnostics?.warnings || [],
        unsupported: pkg.diagnostics?.unsupported || [],
    };
}
export function summarizeAssets(manifest) {
    const byUsage = {};
    for (const asset of manifest.assets) {
        byUsage[asset.usageType] = (byUsage[asset.usageType] || 0) + 1;
    }
    const byType = {};
    for (const [type, assets] of Object.entries(manifest.byType)) {
        byType[type] = assets.length;
    }
    return {
        type: "assets",
        sourceUrl: manifest.sourceUrl,
        totalAssets: manifest.totalAssets,
        uniqueAssets: manifest.uniqueAssets,
        sharedCount: manifest.sharedAssets.length,
        junkFiltered: manifest.junkFiltered,
        byType,
        byUsage,
        pageCount: Object.keys(manifest.byPage).length,
        topSharedAssets: manifest.sharedAssets.slice(0, 10).map((a) => ({
            url: a.url,
            type: a.assetType,
        })),
    };
}
export function formatDebugSummary(summary) {
    return JSON.stringify(summary, null, 2);
}
//# sourceMappingURL=debug-summary.js.map