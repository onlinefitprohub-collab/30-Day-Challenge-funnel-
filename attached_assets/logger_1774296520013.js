const LOG_PREFIX = "[CloneLevel]";
let debugMode = false;
export function setDebugMode(enabled) {
    debugMode = enabled;
}
export function log(level, module, message, data) {
    if (level === "debug" && !debugMode)
        return;
    const timestamp = new Date().toISOString();
    const prefix = `${LOG_PREFIX}[${module}]`;
    switch (level) {
        case "debug":
            console.debug(`${prefix} ${message}`, data ?? "");
            break;
        case "info":
            console.info(`${prefix} ${message}`, data ?? "");
            break;
        case "warn":
            console.warn(`${prefix} ${message}`, data ?? "");
            break;
        case "error":
            console.error(`${prefix} ${message}`, data ?? "");
            break;
    }
}
export const logger = {
    debug: (module, message, data) => log("debug", module, message, data),
    info: (module, message, data) => log("info", module, message, data),
    warn: (module, message, data) => log("warn", module, message, data),
    error: (module, message, data) => log("error", module, message, data),
};
//# sourceMappingURL=logger.js.map