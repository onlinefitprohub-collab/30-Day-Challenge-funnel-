import { logger } from "../core/logger";
export function detectPageContext() {
    const url = window.location.href;
    const builderResult = detectBuilderFamily();
    const hlDomain = detectHighLevelDomain(url);
    const editorResult = detectEditorPage(hlDomain);
    const isHighLevel = hlDomain ||
        builderResult.family !== "unknown" ||
        !!document.querySelector('[data-ghl]');
    let pageType;
    if (editorResult.detected) {
        pageType = "editor-page";
    }
    else if (isHighLevel) {
        pageType = "public-page";
    }
    else {
        pageType = "unknown";
    }
    const context = {
        pageType,
        builderFamily: builderResult.family,
        isHighLevel,
        url,
        detectedAt: new Date().toISOString(),
        confidence: editorResult.detected ? editorResult.confidence : builderResult.confidence,
    };
    logger.info("detect", "Page context detected", context);
    return context;
}
function detectHighLevelDomain(url) {
    const hostname = new URL(url).hostname.toLowerCase();
    return (hostname.includes("gohighlevel.com") ||
        hostname.includes("highlevel.com") ||
        hostname.includes("msgsndr.com") ||
        hostname.includes("leadconnectorhq.com"));
}
function detectEditorPage(isHlDomain) {
    const urlSignals = [];
    urlSignals.push(/\/funnel\/[^/]+\/edit/i.test(window.location.href));
    urlSignals.push(/\/builder\//i.test(window.location.href));
    urlSignals.push(/\/sites\/[^/]+\/edit/i.test(window.location.href));
    urlSignals.push(/\/pages\/[^/]+\/edit/i.test(window.location.href));
    const urlScore = urlSignals.filter(Boolean).length;
    const domSignals = [];
    domSignals.push(!!document.querySelector('[data-editor]'));
    domSignals.push(!!document.querySelector('[data-ghl-editor]'));
    domSignals.push(!!document.querySelector('[class*="hl-editor"]'));
    domSignals.push(!!document.querySelector('[class*="hl-page-builder"]'));
    domSignals.push(!!document.querySelector('[data-page-builder]'));
    domSignals.push(!!document.querySelector('iframe[class*="preview"]'));
    const domScore = domSignals.filter(Boolean).length;
    if (isHlDomain && urlScore >= 1) {
        return { detected: true, confidence: Math.min(0.5 + urlScore * 0.15 + domScore * 0.1, 1) };
    }
    if (urlScore >= 1 && domScore >= 1) {
        return { detected: true, confidence: Math.min(0.4 + urlScore * 0.15 + domScore * 0.1, 1) };
    }
    if (domScore >= 3) {
        return { detected: true, confidence: Math.min(domScore * 0.15, 1) };
    }
    return { detected: false, confidence: 0 };
}
function detectBuilderFamily() {
    const newBuilderSignals = [];
    const legacyBuilderSignals = [];
    if (document.querySelector('[class*="hl-page-builder"]')) {
        newBuilderSignals.push("hl-page-builder class found");
    }
    if (document.querySelector('[data-page-builder]')) {
        newBuilderSignals.push("data-page-builder attribute found");
    }
    if (document.querySelector('[class*="cf-"]')) {
        legacyBuilderSignals.push("cf- class prefix found (ClickFunnels legacy)");
    }
    if (document.querySelector('[class*="elFont"]')) {
        legacyBuilderSignals.push("elFont class found (legacy builder)");
    }
    if (document.querySelector('[class*="containerWrapper"]')) {
        legacyBuilderSignals.push("containerWrapper found (legacy builder)");
    }
    if (document.querySelector('[id*="sections"]')) {
        legacyBuilderSignals.push("sections id found");
    }
    if (newBuilderSignals.length > legacyBuilderSignals.length) {
        return {
            family: "new-builder",
            confidence: Math.min(newBuilderSignals.length * 0.3, 1),
            signals: newBuilderSignals,
        };
    }
    if (legacyBuilderSignals.length > 0) {
        return {
            family: "legacy-builder",
            confidence: Math.min(legacyBuilderSignals.length * 0.25, 1),
            signals: legacyBuilderSignals,
        };
    }
    return {
        family: "unknown",
        confidence: 0,
        signals: [],
    };
}
//# sourceMappingURL=detect-page-context.js.map