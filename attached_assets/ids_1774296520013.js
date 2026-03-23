export function generateId(prefix = "cl") {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
}
export function generatePageId() {
    return generateId("page");
}
export function generateAssetId() {
    return generateId("asset");
}
export function generateSectionId() {
    return generateId("sec");
}
export function generateRowId() {
    return generateId("row");
}
export function generateColumnId() {
    return generateId("col");
}
export function generateElementId() {
    return generateId("el");
}
export function generateEdgeId() {
    return generateId("edge");
}
export function generateMessageId() {
    return generateId("msg");
}
//# sourceMappingURL=ids.js.map