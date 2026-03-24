import { jsx as _jsx } from "react/jsx-runtime";
export function BuilderBadge({ family }) {
    const classMap = {
        "new-builder": "badge-builder badge-new-builder",
        "legacy-builder": "badge-builder badge-legacy-builder",
        unknown: "badge-builder badge-unknown-builder",
    };
    const labelMap = {
        "new-builder": "New Builder",
        "legacy-builder": "Legacy Builder",
        unknown: "Unknown",
    };
    return _jsx("span", { className: classMap[family], children: labelMap[family] });
}
//# sourceMappingURL=BuilderBadge.js.map