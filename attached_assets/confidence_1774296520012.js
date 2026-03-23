export function clampConfidence(value) {
    return Math.max(0, Math.min(1, value));
}
export function averageConfidence(values) {
    if (values.length === 0)
        return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return clampConfidence(sum / values.length);
}
export function weightedConfidence(entries) {
    if (entries.length === 0)
        return 0;
    const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
    if (totalWeight === 0)
        return 0;
    const weighted = entries.reduce((sum, e) => sum + e.value * e.weight, 0);
    return clampConfidence(weighted / totalWeight);
}
export function confidenceLevel(value) {
    if (value >= 0.8)
        return "high";
    if (value >= 0.5)
        return "medium";
    if (value > 0)
        return "low";
    return "none";
}
//# sourceMappingURL=confidence.js.map