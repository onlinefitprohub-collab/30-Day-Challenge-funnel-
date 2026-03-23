export function extractBackgroundImageUrls(cssText) {
    const urls = [];
    const regex = /url\(\s*(['"]?)(.*?)\1\s*\)/gi;
    let match;
    while ((match = regex.exec(cssText)) !== null) {
        const url = match[2];
        if (url && !url.startsWith("data:") && !url.startsWith("#")) {
            urls.push(url);
        }
    }
    return urls;
}
export function extractInlineStyleBackgrounds(style) {
    return extractBackgroundImageUrls(style);
}
export function getComputedStyleValue(el, property) {
    return window.getComputedStyle(el).getPropertyValue(property);
}
export function extractFontFamilies(cssText) {
    const fonts = new Set();
    const regex = /font-family\s*:\s*([^;}]+)/gi;
    let match;
    while ((match = regex.exec(cssText)) !== null) {
        const families = match[1].split(",").map((f) => f.trim().replace(/['"]/g, ""));
        families.forEach((f) => fonts.add(f));
    }
    return Array.from(fonts);
}
export function extractColors(cssText) {
    const colors = new Set();
    const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;
    const rgbRegex = /rgba?\([^)]+\)/g;
    const hslRegex = /hsla?\([^)]+\)/g;
    [hexRegex, rgbRegex, hslRegex].forEach((regex) => {
        let match;
        while ((match = regex.exec(cssText)) !== null) {
            colors.add(match[0]);
        }
    });
    return Array.from(colors);
}
//# sourceMappingURL=css.js.map