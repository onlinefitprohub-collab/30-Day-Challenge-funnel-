export function getElementRect(el) {
    const rect = el.getBoundingClientRect();
    return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
    };
}
export function isVisible(el) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0)
        return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none")
        return false;
    if (style.visibility === "hidden")
        return false;
    if (style.opacity === "0")
        return false;
    return true;
}
export function overlaps(a, b) {
    return !(a.x + a.width < b.x ||
        b.x + b.width < a.x ||
        a.y + a.height < b.y ||
        b.y + b.height < a.y);
}
//# sourceMappingURL=rect.js.map