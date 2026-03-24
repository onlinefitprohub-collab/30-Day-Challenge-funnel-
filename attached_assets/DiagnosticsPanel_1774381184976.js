import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DiagnosticsPanel({ lastPackage, onExportDiagnostics }) {
    const warnings = lastPackage?.diagnostics?.warnings || [];
    const unsupported = lastPackage?.diagnostics?.unsupported || [];
    if (warnings.length === 0 && unsupported.length === 0)
        return null;
    return (_jsxs("div", { className: "card", children: [_jsx("div", { className: "card-title", children: "Diagnostics" }), _jsxs("ul", { className: "diagnostics-list", children: [warnings.map((w, i) => (_jsxs("li", { className: "diagnostics-item", children: [_jsx("span", { className: "diagnostics-icon warn", children: "\u26A0" }), _jsx("span", { children: w })] }, `w-${i}`))), unsupported.map((u, i) => (_jsxs("li", { className: "diagnostics-item", children: [_jsx("span", { className: "diagnostics-icon info", children: "\u2139" }), _jsx("span", { children: u })] }, `u-${i}`)))] }), _jsxs("button", { className: "btn btn-sm", onClick: onExportDiagnostics, style: { marginTop: "8px" }, "data-testid": "btn-export-diagnostics", children: [_jsx("span", { className: "btn-icon", children: "\uD83D\uDCCB" }), "Export Diagnostics"] })] }));
}
//# sourceMappingURL=DiagnosticsPanel.js.map