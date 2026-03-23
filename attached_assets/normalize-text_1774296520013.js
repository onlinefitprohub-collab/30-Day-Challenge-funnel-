export function normalizeText(text) {
    return text
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}
export function containsAny(text, keywords) {
    const normalized = normalizeText(text);
    return keywords.some((kw) => normalized.includes(kw.toLowerCase()));
}
export function extractTextContent(el) {
    return (el.textContent || "").trim();
}
export function truncate(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + "...";
}
//# sourceMappingURL=normalize-text.js.map