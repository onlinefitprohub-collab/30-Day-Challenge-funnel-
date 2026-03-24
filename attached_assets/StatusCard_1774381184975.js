import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BuilderBadge } from "./BuilderBadge";
export function StatusCard({ context, loading }) {
    if (loading) {
        return (_jsxs("div", { className: "card", children: [_jsx("div", { className: "card-title", children: "Page Context" }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [_jsx("div", { className: "spinner" }), _jsx("span", { style: { color: "var(--text-muted)", fontSize: "12px" }, children: "Detecting..." })] })] }));
    }
    if (!context) {
        return (_jsxs("div", { className: "card", children: [_jsx("div", { className: "card-title", children: "Page Context" }), _jsx("div", { className: "empty-state", children: "Unable to detect page context" })] }));
    }
    const badgeClass = context.pageType === "public-page" ? "badge-public" :
        context.pageType === "editor-page" ? "badge-editor" : "badge-unknown";
    const badgeLabel = context.pageType === "public-page" ? "Public Page" :
        context.pageType === "editor-page" ? "Editor Page" : "Unknown";
    return (_jsxs("div", { className: "card", children: [_jsx("div", { className: "card-title", children: "Page Context" }), _jsxs("div", { className: "status-row", children: [_jsxs("span", { className: `badge ${badgeClass}`, children: [_jsx("span", { className: "badge-dot" }), badgeLabel] }), _jsx(BuilderBadge, { family: context.builderFamily }), context.isHighLevel && (_jsx("span", { className: "badge badge-editor", style: { fontSize: "10px" }, children: "HL" }))] }), _jsx("div", { className: "status-url", title: context.url, children: context.url })] }));
}
//# sourceMappingURL=StatusCard.js.map