"use strict";
(() => {
  // clonelevel/src/adapters/new-builder/detect.ts
  function detectNewBuilder() {
    const signals = [];
    if (document.querySelector("[data-page-builder]")) {
      signals.push("data-page-builder attr");
    }
    const allClasses = /* @__PURE__ */ new Set();
    document.querySelectorAll("[class]").forEach((el) => {
      el.classList.forEach((c) => allClasses.add(c));
    });
    if (allClasses.has("hl-page-builder")) signals.push("hl-page-builder class");
    if (allClasses.has("hl-editor")) signals.push("hl-editor class");
    if (allClasses.has("hl-builder-canvas")) signals.push("hl-builder-canvas class");
    for (const cls of allClasses) {
      if (cls.startsWith("hl-builder-")) {
        signals.push(`hl-builder- prefix (${cls})`);
        break;
      }
      if (cls.startsWith("pb-")) {
        signals.push(`pb- class prefix`);
        break;
      }
    }
    const href = window.location.href;
    if (/\/sites\/[^/]+\/editor/i.test(href)) signals.push("url:sites-editor");
    if (/\/builder\//i.test(href)) signals.push("url:builder-path");
    if (/\/pages\/[^/]+\/edit/i.test(href)) signals.push("url:pages-edit");
    if (document.querySelector('meta[name="builder-version"]')) {
      signals.push("meta:builder-version");
    }
    if (document.getElementById("builder-app")) signals.push("dom:builder-app");
    if (document.getElementById("page-builder-root")) signals.push("dom:page-builder-root");
    if (document.querySelector("[data-builder-element]")) signals.push("dom:data-builder-element");
    if (signals.length === 0) {
      return { family: "unknown", confidence: 0, signals: [] };
    }
    return {
      family: "new-builder",
      confidence: Math.min(signals.length * 0.3, 1),
      signals
    };
  }

  // clonelevel/src/adapters/legacy-builder/detect.ts
  function detectLegacyBuilder() {
    const signals = [];
    const allClasses = /* @__PURE__ */ new Set();
    document.querySelectorAll("[class]").forEach((el) => {
      el.classList.forEach((c) => allClasses.add(c));
    });
    if (allClasses.has("elFont")) signals.push("elFont class");
    if (allClasses.has("containerWrapper")) signals.push("containerWrapper class");
    if (allClasses.has("elRow")) signals.push("elRow class");
    if (allClasses.has("elColumn")) signals.push("elColumn class");
    if (allClasses.has("elContent")) signals.push("elContent class");
    if (allClasses.has("elButton")) signals.push("elButton class");
    let hasCfPrefix = false;
    for (const cls of allClasses) {
      if (cls.startsWith("cf-")) {
        hasCfPrefix = true;
        break;
      }
    }
    if (hasCfPrefix) signals.push("cf- class prefix (legacy)");
    const sectionsEl = document.getElementById("sections");
    if (sectionsEl && sectionsEl.children.length >= 2) {
      signals.push("dom:#sections with children");
    }
    if (document.getElementById("funnelBuilderContainer")) {
      signals.push("dom:#funnelBuilderContainer");
    }
    if (document.querySelector("[data-funnel-builder]")) {
      signals.push("dom:data-funnel-builder attr");
    }
    if (document.querySelector('script[src*="funnel-builder"]')) {
      signals.push("script:funnel-builder src");
    }
    const href = window.location.href;
    if (/\/funnel\/[^/]+\/edit/i.test(href)) signals.push("url:funnel-edit");
    if (/\/funnel\/[^/]+\/steps/i.test(href)) signals.push("url:funnel-steps");
    if (signals.length === 0) {
      return { family: "unknown", confidence: 0, signals: [] };
    }
    if (signals.length < 2) {
      return { family: "unknown", confidence: signals.length * 0.1, signals };
    }
    return {
      family: "legacy-builder",
      confidence: Math.min(signals.length * 0.2, 1),
      signals
    };
  }

  // clonelevel/src/core/logger.ts
  var LOG_PREFIX = "[CloneLevel]";
  var debugMode = false;
  function log(level, module, message, data) {
    if (level === "debug" && !debugMode) return;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
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
  var logger = {
    debug: (module, message, data) => log("debug", module, message, data),
    info: (module, message, data) => log("info", module, message, data),
    warn: (module, message, data) => log("warn", module, message, data),
    error: (module, message, data) => log("error", module, message, data)
  };

  // clonelevel/src/content/detect-page-context.ts
  var HL_EXACT_DOMAINS = [
    "gohighlevel.com",
    "highlevel.com",
    "msgsndr.com",
    "leadconnectorhq.com"
  ];
  var HL_EDITOR_URL_FAST_PATHS = [
    // app.gohighlevel.com/location/<loc>/page-builder/<id>
    [/\/location\/[^/]+\/page-builder\//i, "url:hl-page-builder"],
    // funnel editor routes
    [/\/location\/[^/]+\/funnels\//i, "url:hl-funnels"],
    // sites editor routes
    [/\/location\/[^/]+\/sites\//i, "url:hl-sites"],
    // generic /page-builder/ anywhere on HL domain
    [/\/page-builder\//i, "url:page-builder"],
    // /funnels/ path on HL domain
    [/\/funnels\//i, "url:funnels"],
    // /sites/ path with edit/builder suffix on HL domain
    [/\/sites\/[^/]+\/(edit|builder|editor)/i, "url:sites-editor"],
    // /builder/ path on HL domain
    [/\/builder\//i, "url:builder"]
  ];
  function collectClassTokens(limit = 2e3) {
    const tokens = /* @__PURE__ */ new Set();
    const els = document.querySelectorAll("[class]");
    const cap = Math.min(els.length, limit);
    for (let i = 0; i < cap; i++) {
      const cl = els[i].classList;
      for (let j = 0; j < cl.length; j++) tokens.add(cl[j]);
    }
    return tokens;
  }
  function collectClassPrefixes(tokens, prefix) {
    for (const tok of tokens) {
      if (tok.startsWith(prefix)) return true;
    }
    return false;
  }
  function detectPageContext() {
    const url = window.location.href;
    const hostname = extractHostname(url);
    if (isHighLevelDomain(hostname)) {
      const matchedSignals2 = [`hl-domain:${hostname}`];
      for (const [pattern, label] of HL_EDITOR_URL_FAST_PATHS) {
        if (pattern.test(url)) {
          matchedSignals2.push(label);
          const context2 = {
            pageType: "editor-page",
            builderFamily: "highlevel",
            editorVariant: "new-builder",
            isHighLevel: true,
            url,
            detectedAt: (/* @__PURE__ */ new Date()).toISOString(),
            confidence: 0.97,
            matchedSignals: matchedSignals2,
            signalDetail: { urlScore: 2, domScore: 0, classScore: 0 }
          };
          logger.info("detect", "Page context detected (HL fast-path)", context2);
          return context2;
        }
      }
    }
    const classTokens = collectClassTokens();
    const newBuilderResult = detectNewBuilder();
    const legacyBuilderResult = detectLegacyBuilder();
    let builderResult;
    if (newBuilderResult.family !== "unknown" && newBuilderResult.confidence >= legacyBuilderResult.confidence) {
      builderResult = newBuilderResult;
    } else if (legacyBuilderResult.family !== "unknown") {
      builderResult = legacyBuilderResult;
    } else {
      builderResult = detectBuilderFamilyFallback(classTokens);
    }
    const hlDomain = isHighLevelDomain(hostname);
    const editorResult = detectEditorPage(hlDomain, classTokens);
    const hasDataGhl = !!document.querySelector("[data-ghl]");
    const matchedSignals = [];
    if (hlDomain) matchedSignals.push(`hl-domain:${hostname}`);
    if (hasDataGhl) matchedSignals.push("data-ghl attribute");
    for (const sig of builderResult.signals) matchedSignals.push(`builder:${sig}`);
    for (const sig of editorResult.signals) matchedSignals.push(sig);
    let hlScore = 0;
    if (hlDomain) hlScore += 0.7;
    if (builderResult.confidence >= 0.5) hlScore += 0.2;
    if (hasDataGhl) hlScore += 0.2;
    if (editorResult.detected) hlScore += 0.2;
    const isHighLevel = hlScore >= 0.6;
    const confidence = computeConfidence(editorResult, isHighLevel, hlScore, builderResult);
    let pageType;
    if (editorResult.detected) {
      pageType = "editor-page";
    } else if (isHighLevel && confidence >= 0.5) {
      pageType = "public-page";
    } else {
      pageType = "unknown";
    }
    let editorVariant;
    if (editorResult.detected) {
      if (builderResult.family === "new-builder") editorVariant = "new-builder";
      else if (builderResult.family === "legacy-builder") editorVariant = "legacy-builder";
      else editorVariant = "unknown";
    }
    const context = {
      pageType,
      builderFamily: builderResult.family,
      editorVariant,
      isHighLevel,
      url,
      detectedAt: (/* @__PURE__ */ new Date()).toISOString(),
      confidence,
      matchedSignals: matchedSignals.length > 0 ? matchedSignals : void 0,
      signalDetail: {
        urlScore: editorResult.urlScore,
        domScore: editorResult.domScore,
        classScore: editorResult.classScore
      }
    };
    logger.info("detect", "Page context detected", context);
    return context;
  }
  function computeConfidence(editorResult, isHighLevel, hlScore, builderResult) {
    if (editorResult.detected) return editorResult.confidence;
    if (isHighLevel) return Math.min(hlScore, 1);
    return builderResult.confidence > 0 ? builderResult.confidence * 0.5 : 0;
  }
  function extractHostname(url) {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return "";
    }
  }
  function isHighLevelDomain(hostname) {
    for (const domain of HL_EXACT_DOMAINS) {
      if (hostname === domain || hostname.endsWith("." + domain)) return true;
    }
    return false;
  }
  function detectEditorPage(isHlDomain, classTokens) {
    const signals = [];
    const href = window.location.href;
    const urlPatterns = [
      [/\/funnel\/[^/]+\/edit/i, "url:funnel-edit"],
      [/\/funnel\/[^/]+\/steps/i, "url:funnel-steps"],
      [/\/builder\//i, "url:builder-path"],
      [/\/sites\/[^/]+\/edit/i, "url:sites-edit"],
      [/\/sites\/[^/]+\/editor/i, "url:sites-editor"],
      [/\/pages\/[^/]+\/edit/i, "url:pages-edit"],
      [/app\.gohighlevel\.com.*\/(funnel|sites|pages)\//i, "url:ghl-app-editor"],
      [/app\.msgsndr\.com.*\/(funnel|sites|pages)\//i, "url:msgsndr-app-editor"]
    ];
    let urlScore = 0;
    for (const [pattern, label] of urlPatterns) {
      if (pattern.test(href)) {
        urlScore++;
        signals.push(label);
      }
    }
    const domChecks = [
      ["[data-editor]", "dom:data-editor"],
      ["[data-ghl-editor]", "dom:data-ghl-editor"],
      ["[data-page-builder]", "dom:data-page-builder"],
      ['iframe[class*="preview"]', "dom:preview-iframe"],
      ["[data-builder-element]", "dom:data-builder-element"],
      ["[data-funnel-builder]", "dom:data-funnel-builder"],
      ["#funnelBuilderContainer", "dom:#funnelBuilderContainer"],
      ["#builder-app", "dom:#builder-app"],
      ["#page-builder-root", "dom:#page-builder-root"]
    ];
    let domScore = 0;
    for (const [selector, label] of domChecks) {
      if (document.querySelector(selector)) {
        domScore++;
        signals.push(label);
      }
    }
    const editorClassTokens = [
      ["hl-editor", "class:hl-editor"],
      ["hl-page-builder", "class:hl-page-builder"],
      ["hl-builder-canvas", "class:hl-builder-canvas"],
      ["elFont", "class:elFont (legacy)"],
      ["containerWrapper", "class:containerWrapper (legacy)"]
    ];
    let classScore = 0;
    for (const [token, label] of editorClassTokens) {
      if (classTokens.has(token)) {
        classScore++;
        signals.push(label);
      }
    }
    if (collectClassPrefixes(classTokens, "hl-builder-")) {
      classScore++;
      signals.push("class:hl-builder- prefix");
    }
    if (collectClassPrefixes(classTokens, "cf-")) {
      classScore++;
      signals.push("class:cf- prefix (legacy)");
    }
    const totalScore = urlScore + domScore + classScore;
    if (isHlDomain && urlScore >= 1) {
      return { detected: true, confidence: Math.min(0.5 + urlScore * 0.12 + domScore * 0.1 + classScore * 0.08, 1), signals, urlScore, domScore, classScore };
    }
    if (urlScore >= 1 && domScore + classScore >= 1) {
      return { detected: true, confidence: Math.min(0.4 + urlScore * 0.12 + (domScore + classScore) * 0.1, 1), signals, urlScore, domScore, classScore };
    }
    if (totalScore >= 4) {
      return { detected: true, confidence: Math.min(totalScore * 0.12, 1), signals, urlScore, domScore, classScore };
    }
    return { detected: false, confidence: 0, signals, urlScore, domScore, classScore };
  }
  function detectBuilderFamilyFallback(classTokens) {
    const newBuilderSignals = [];
    const legacyBuilderSignals = [];
    if (classTokens.has("hl-page-builder")) newBuilderSignals.push("hl-page-builder class");
    if (document.querySelector("[data-page-builder]")) newBuilderSignals.push("data-page-builder attr");
    if (collectClassPrefixes(classTokens, "cf-")) legacyBuilderSignals.push("cf- class prefix");
    if (classTokens.has("elFont")) legacyBuilderSignals.push("elFont class");
    if (classTokens.has("containerWrapper")) legacyBuilderSignals.push("containerWrapper class");
    const sectionsById = document.getElementById("sections");
    if (sectionsById && sectionsById.children.length >= 2) legacyBuilderSignals.push("sections container");
    if (newBuilderSignals.length > 0 && newBuilderSignals.length >= legacyBuilderSignals.length) {
      return { family: "new-builder", confidence: Math.min(newBuilderSignals.length * 0.35, 1), signals: newBuilderSignals };
    }
    if (legacyBuilderSignals.length >= 2) {
      return { family: "legacy-builder", confidence: Math.min(legacyBuilderSignals.length * 0.25, 1), signals: legacyBuilderSignals };
    }
    return { family: "unknown", confidence: 0, signals: [...newBuilderSignals, ...legacyBuilderSignals] };
  }

  // clonelevel/src/core/schema/clone-package.ts
  function createEmptyPackage(url) {
    return {
      version: 1,
      source: {
        mode: "public-dom",
        builderFamily: "unknown",
        url,
        capturedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      page: {
        sections: []
      },
      assets: [],
      diagnostics: {
        warnings: [],
        unsupported: []
      }
    };
  }

  // clonelevel/src/core/schema/assets.ts
  var EXTENSION_TO_TYPE = {
    png: "image",
    jpg: "image",
    jpeg: "image",
    svg: "image",
    webp: "image",
    gif: "image",
    avif: "image",
    bmp: "image",
    tiff: "image",
    ico: "image",
    mp4: "video",
    webm: "video",
    mov: "video",
    avi: "video",
    mkv: "video",
    mp3: "audio",
    wav: "audio",
    m4a: "audio",
    ogg: "audio",
    flac: "audio",
    aac: "audio",
    pdf: "document",
    txt: "document",
    doc: "document",
    docx: "document",
    csv: "document",
    xls: "document",
    xlsx: "document",
    ppt: "document",
    pptx: "document",
    woff: "font",
    woff2: "font",
    ttf: "font",
    eot: "font",
    otf: "font"
  };
  var MIME_MAP = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    webp: "image/webp",
    gif: "image/gif",
    avif: "image/avif",
    bmp: "image/bmp",
    ico: "image/x-icon",
    tiff: "image/tiff",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    ogg: "audio/ogg",
    flac: "audio/flac",
    aac: "audio/aac",
    pdf: "application/pdf",
    json: "application/json",
    xml: "application/xml",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    otf: "font/otf",
    eot: "application/vnd.ms-fontobject"
  };
  function inferAssetType(url) {
    try {
      const pathname = new URL(url).pathname;
      const ext = getExtension(pathname);
      return EXTENSION_TO_TYPE[ext] || "other";
    } catch {
      return "other";
    }
  }
  function inferMimeHint(url) {
    try {
      const pathname = new URL(url).pathname;
      const ext = getExtension(pathname);
      return MIME_MAP[ext];
    } catch {
      return void 0;
    }
  }
  function extractFilename(url) {
    try {
      const pathname = new URL(url).pathname;
      const parts = pathname.split("/");
      const last = parts[parts.length - 1];
      return last && last.includes(".") ? decodeURIComponent(last) : void 0;
    } catch {
      return void 0;
    }
  }
  function getExtension(pathname) {
    const lastSegment = pathname.split("/").pop() || "";
    const dotIdx = lastSegment.lastIndexOf(".");
    if (dotIdx < 0) return "";
    return lastSegment.slice(dotIdx + 1).toLowerCase().split("?")[0];
  }
  var TRACKING_JUNK_PATTERNS = [
    /\/pixel\b/i,
    /\/beacon\b/i,
    /\/track(ing)?\b/i,
    /\/analytics\b/i,
    /\/collect\b/i,
    /doubleclick\.net/i,
    /facebook\.com\/tr/i,
    /google-analytics\.com/i,
    /googletagmanager\.com/i,
    /googleadservices\.com/i,
    /facebook\.net/i,
    /connect\.facebook\.net/i,
    /ads\.linkedin\.com/i,
    /bat\.bing\.com/i,
    /snap\.licdn\.com/i,
    /ct\.pinterest\.com/i,
    /analytics\.tiktok\.com/i,
    /clarity\.ms/i,
    /hotjar\.com/i,
    /fullstory\.com/i,
    /mouseflow\.com/i,
    /cdn\.segment\.com/i,
    /cdn\.heapanalytics\.com/i,
    /widget.*chat/i,
    /intercom/i,
    /drift\.com/i,
    /crisp\.chat/i
  ];
  function isJunkAsset(url) {
    return TRACKING_JUNK_PATTERNS.some((p) => p.test(url));
  }

  // clonelevel/src/core/css.ts
  function extractBackgroundImageUrls(cssText) {
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

  // clonelevel/src/core/ids.ts
  function generateId(prefix = "cl") {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
  }
  function generateAssetId() {
    return generateId("asset");
  }
  function generateSectionId() {
    return generateId("sec");
  }
  function generateRowId() {
    return generateId("row");
  }
  function generateColumnId() {
    return generateId("col");
  }
  function generateElementId() {
    return generateId("el");
  }
  function generateMessageId() {
    return generateId("msg");
  }

  // clonelevel/src/core/url.ts
  function resolveUrl(link, baseUrl) {
    try {
      return new URL(link, baseUrl).toString();
    } catch {
      return link;
    }
  }

  // clonelevel/src/core/dom/extract-assets.ts
  function extractAssets(doc, pageUrl) {
    const assets = [];
    const seen = /* @__PURE__ */ new Set();
    function addAsset(url, usageType) {
      const resolved = resolveUrl(url, pageUrl);
      if (seen.has(resolved)) return;
      if (resolved.startsWith("data:")) return;
      if (/^about:|^blob:/i.test(resolved)) return;
      seen.add(resolved);
      const junk = isJunkAsset(resolved);
      assets.push({
        id: generateAssetId(),
        url: resolved,
        filename: extractFilename(resolved),
        mimeHint: inferMimeHint(resolved),
        assetType: inferAssetType(resolved),
        sourcePageUrl: pageUrl,
        usageType,
        isJunk: junk || void 0
      });
    }
    doc.querySelectorAll("img[src]").forEach((el) => {
      const src = el.getAttribute("src");
      if (src) {
        if (isTrackingPixel(el)) {
          addJunkAsset(src);
        } else {
          addAsset(src, "img-tag");
        }
      }
    });
    doc.querySelectorAll("img[srcset]").forEach((el) => {
      const srcset = el.getAttribute("srcset") || "";
      srcset.split(",").forEach((entry) => {
        const url = entry.trim().split(/\s+/)[0];
        if (url) addAsset(url, "img-tag");
      });
    });
    doc.querySelectorAll("picture source[srcset]").forEach((el) => {
      const srcset = el.getAttribute("srcset") || "";
      srcset.split(",").forEach((entry) => {
        const url = entry.trim().split(/\s+/)[0];
        if (url) addAsset(url, "img-tag");
      });
    });
    doc.querySelectorAll("video source[src], video[src]").forEach((el) => {
      const src = el.getAttribute("src");
      if (src) addAsset(src, "video-src");
    });
    doc.querySelectorAll("video[poster]").forEach((el) => {
      const poster = el.getAttribute("poster");
      if (poster) addAsset(poster, "img-tag");
    });
    doc.querySelectorAll("audio source[src], audio[src]").forEach((el) => {
      const src = el.getAttribute("src");
      if (src) addAsset(src, "audio-src");
    });
    doc.querySelectorAll("a[href]").forEach((el) => {
      const href = el.getAttribute("href") || "";
      const download = el.hasAttribute("download");
      if (download || /\.(pdf|doc|docx|csv|txt|zip|xlsx|pptx?)(\?|$)/i.test(href)) {
        addAsset(href, "anchor-download");
      }
    });
    doc.querySelectorAll("embed[src], object[data]").forEach((el) => {
      const src = el.getAttribute("src") || el.getAttribute("data");
      if (src) addAsset(src, "embed");
    });
    doc.querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']").forEach((el) => {
      const href = el.getAttribute("href");
      if (href) addAsset(href, "favicon");
    });
    doc.querySelectorAll("meta[property='og:image'], meta[name='twitter:image']").forEach((el) => {
      const content = el.getAttribute("content");
      if (content) addAsset(content, "og-image");
    });
    doc.querySelectorAll("[style]").forEach((el) => {
      const style = el.getAttribute("style") || "";
      const urls = extractBackgroundImageUrls(style);
      urls.forEach((url) => addAsset(url, "css-background"));
    });
    try {
      for (let i = 0; i < doc.styleSheets.length; i++) {
        try {
          const sheet = doc.styleSheets[i];
          for (let j = 0; j < sheet.cssRules.length; j++) {
            const rule = sheet.cssRules[j];
            const cssText = rule.cssText;
            const bgUrls = extractBackgroundImageUrls(cssText);
            bgUrls.forEach((url) => addAsset(url, "css-background"));
            if (rule instanceof CSSFontFaceRule) {
              const srcMatch = cssText.match(/url\(["']?([^"')]+)["']?\)/g);
              if (srcMatch) {
                srcMatch.forEach((m) => {
                  const urlMatch = m.match(/url\(["']?([^"')]+)["']?\)/);
                  if (urlMatch && urlMatch[1]) addAsset(urlMatch[1], "font-face");
                });
              }
            }
          }
        } catch {
        }
      }
    } catch {
    }
    const htmlContent = doc.documentElement.outerHTML;
    const urlPattern = /(?:https?:\/\/[^\s"'<>]+\.(?:png|jpg|jpeg|gif|svg|webp|avif|mp4|webm|mov|mp3|wav|m4a|pdf|doc|docx|csv|txt|woff2?|ttf|eot|otf))/gi;
    const matches = htmlContent.match(urlPattern) || [];
    matches.forEach((url) => {
      if (!seen.has(url)) {
        addAsset(url, "unknown");
      }
    });
    return assets;
    function addJunkAsset(url) {
      const resolved = resolveUrl(url, pageUrl);
      if (seen.has(resolved)) return;
      seen.add(resolved);
      assets.push({
        id: generateAssetId(),
        url: resolved,
        filename: extractFilename(resolved),
        mimeHint: inferMimeHint(resolved),
        assetType: inferAssetType(resolved),
        sourcePageUrl: pageUrl,
        usageType: "img-tag",
        isJunk: true
      });
    }
  }
  function isTrackingPixel(img) {
    const w = img.getAttribute("width");
    const h = img.getAttribute("height");
    if (w && h) {
      const width = parseInt(w, 10);
      const height = parseInt(h, 10);
      if (width <= 2 && height <= 2) return true;
    }
    if (img.naturalWidth > 0 && img.naturalWidth <= 2 && img.naturalHeight <= 2) return true;
    const src = img.getAttribute("src") || "";
    if (isJunkAsset(src)) return true;
    return false;
  }

  // clonelevel/src/core/dom/extract-metadata.ts
  function extractMetadata(doc) {
    const meta = {};
    meta.title = doc.title || void 0;
    const descEl = doc.querySelector('meta[name="description"]');
    if (descEl) meta.description = descEl.getAttribute("content") || void 0;
    const kwEl = doc.querySelector('meta[name="keywords"]');
    if (kwEl) {
      const kw = kwEl.getAttribute("content");
      if (kw) meta.keywords = kw.split(",").map((k) => k.trim());
    }
    const ogTitleEl = doc.querySelector('meta[property="og:title"]');
    if (ogTitleEl) meta.ogTitle = ogTitleEl.getAttribute("content") || void 0;
    const ogDescEl = doc.querySelector('meta[property="og:description"]');
    if (ogDescEl) meta.ogDescription = ogDescEl.getAttribute("content") || void 0;
    const ogImageEl = doc.querySelector('meta[property="og:image"]');
    if (ogImageEl) meta.ogImage = ogImageEl.getAttribute("content") || void 0;
    const canonicalEl = doc.querySelector('link[rel="canonical"]');
    if (canonicalEl) meta.canonical = canonicalEl.getAttribute("href") || void 0;
    const schemaBlocks = [];
    doc.querySelectorAll('script[type="application/ld+json"]').forEach((el) => {
      const content = el.textContent?.trim();
      if (content) schemaBlocks.push(content);
    });
    if (schemaBlocks.length > 0) meta.schemaBlocks = schemaBlocks;
    return meta;
  }

  // clonelevel/src/core/dom/extract-styles.ts
  var STYLE_PROPS = [
    "backgroundColor",
    "color",
    "fontSize",
    "fontFamily",
    "fontWeight",
    "textAlign",
    "padding",
    "margin",
    "borderRadius",
    "border",
    "width",
    "height",
    "maxWidth",
    "backgroundImage",
    "display",
    "flexDirection",
    "justifyContent",
    "alignItems",
    "gap",
    "lineHeight",
    "letterSpacing",
    "textDecoration",
    "opacity",
    "boxShadow"
  ];
  function extractStyles(el) {
    const computed = window.getComputedStyle(el);
    const styles = {};
    for (const prop of STYLE_PROPS) {
      const cssProperty = prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      const value = computed.getPropertyValue(cssProperty);
      if (value && value !== "none" && value !== "normal" && value !== "0px" && value !== "auto") {
        styles[prop] = value;
      }
    }
    return styles;
  }
  var MAX_STYLE_SAMPLE_ELEMENTS = 200;
  function extractGlobalStyles(doc) {
    const fonts = /* @__PURE__ */ new Set();
    const colors = /* @__PURE__ */ new Set();
    const sampleElements = selectStyleSample(doc, MAX_STYLE_SAMPLE_ELEMENTS);
    for (const el of sampleElements) {
      try {
        const computed = window.getComputedStyle(el);
        const fontFamily = computed.fontFamily;
        if (fontFamily) {
          fontFamily.split(",").forEach((f) => {
            const cleaned = f.trim().replace(/['"]/g, "");
            if (cleaned) fonts.add(cleaned);
          });
        }
        const color = computed.color;
        if (color) colors.add(color);
        const bg = computed.backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") colors.add(bg);
      } catch {
      }
    }
    let customCss = "";
    try {
      for (let i = 0; i < doc.styleSheets.length; i++) {
        try {
          const sheet = doc.styleSheets[i];
          if (sheet.href && !sheet.href.startsWith(window.location.origin)) continue;
          for (let j = 0; j < sheet.cssRules.length; j++) {
            customCss += sheet.cssRules[j].cssText + "\n";
            if (customCss.length > 1e4) break;
          }
        } catch {
        }
        if (customCss.length > 1e4) break;
      }
    } catch {
    }
    return {
      fonts: Array.from(fonts).slice(0, 20),
      colors: Array.from(colors).slice(0, 50),
      customCss: customCss.slice(0, 1e4)
    };
  }
  function selectStyleSample(doc, maxCount) {
    const semanticTags = "h1, h2, h3, h4, h5, h6, p, a, button, span, li, td, th, label, input, textarea, blockquote, figcaption";
    const structuralTags = "section, header, footer, main, nav, article, aside, div.container, div.wrapper, div.hero, div.content";
    const elements = [];
    const seen = /* @__PURE__ */ new WeakSet();
    function addFromSelector(selector, limit) {
      try {
        const matches = doc.querySelectorAll(selector);
        for (let i = 0; i < Math.min(matches.length, limit); i++) {
          if (!seen.has(matches[i])) {
            seen.add(matches[i]);
            elements.push(matches[i]);
          }
        }
      } catch {
      }
    }
    addFromSelector(semanticTags, Math.floor(maxCount * 0.7));
    addFromSelector(structuralTags, Math.floor(maxCount * 0.3));
    return elements.slice(0, maxCount);
  }

  // clonelevel/src/core/normalize-text.ts
  function normalizeText(text) {
    return text.replace(/\s+/g, " ").trim().toLowerCase();
  }
  function containsAny(text, keywords) {
    const normalized = normalizeText(text);
    return keywords.some((kw) => normalized.includes(kw.toLowerCase()));
  }
  function hasClassToken(el, token) {
    return el.classList.contains(token);
  }
  function hasAnyClassToken(el, tokens) {
    for (const t of tokens) {
      if (el.classList.contains(t)) return true;
    }
    return false;
  }
  function hasClassTokenPrefix(el, prefix) {
    for (let i = 0; i < el.classList.length; i++) {
      if (el.classList[i].startsWith(prefix)) return true;
    }
    return false;
  }

  // clonelevel/src/core/dom/classify-elements.ts
  var TEXT_ELEMENT_TYPES = /* @__PURE__ */ new Set([
    "headline",
    "subheadline",
    "paragraph",
    "link",
    "button"
  ]);
  function isTextElementType(type) {
    return TEXT_ELEMENT_TYPES.has(type);
  }
  var BUTTON_CTA_RE = /\b(buy|get|start|sign\s*up|join|order|subscribe|download|book|schedule|claim|try|grab|unlock|enroll|register|purchase|checkout|reserve|access|submit)\b/i;
  function classifyElement(el) {
    const tag = el.tagName.toLowerCase();
    const text = (el.textContent || "").trim();
    const textLower = text.toLowerCase();
    const role = (el.getAttribute("role") || "").toLowerCase();
    if (tag === "h1") return { type: "headline", confidence: 0.95 };
    if (tag === "h2" || tag === "h3") return { type: "subheadline", confidence: 0.9 };
    if (tag === "h4" || tag === "h5" || tag === "h6") return { type: "subheadline", confidence: 0.8 };
    if (tag === "p") return { type: "paragraph", confidence: 0.85 };
    if (tag === "img") return { type: "image", confidence: 0.95 };
    if (tag === "picture") return { type: "image", confidence: 0.9 };
    if (tag === "figure") {
      if (el.querySelector("img, picture")) return { type: "image", confidence: 0.85 };
      if (el.querySelector("blockquote")) return { type: "testimonial", confidence: 0.75 };
    }
    if (tag === "video") return { type: "video", confidence: 0.95 };
    if (tag === "audio") return { type: "audio", confidence: 0.95 };
    if (tag === "hr") return { type: "divider", confidence: 0.95 };
    if (tag === "form") return { type: "form", confidence: 0.9 };
    if (tag === "label") return { type: "paragraph", confidence: 0.6 };
    if (tag === "input" && el.type === "submit") {
      return { type: "button", confidence: 0.95 };
    }
    if (tag === "input" && el.type === "hidden") {
      return { type: "unknown", confidence: 0.1 };
    }
    if (tag === "input") return { type: "input", confidence: 0.9 };
    if (tag === "textarea") return { type: "textarea", confidence: 0.9 };
    if (tag === "select") return { type: "select", confidence: 0.9 };
    if (tag === "ul" || tag === "ol") return { type: "list", confidence: 0.85 };
    if (tag === "iframe") return { type: "embed", confidence: 0.8 };
    if (tag === "details") return { type: "faq-item", confidence: 0.8 };
    if (tag === "button" || role === "button") {
      const isCta = BUTTON_CTA_RE.test(textLower);
      return { type: "button", confidence: isCta ? 0.95 : 0.9 };
    }
    if (tag === "a") {
      const isBtn = hasAnyClassToken(el, ["btn", "button", "cta"]) || hasClassTokenPrefix(el, "btn-") || hasClassTokenPrefix(el, "button-") || hasClassTokenPrefix(el, "cta-") || role === "button";
      if (isBtn) {
        const isCta = BUTTON_CTA_RE.test(textLower);
        const isSmall = text.length <= 40;
        if (isCta && isSmall) return { type: "button", confidence: 0.95 };
        if (isCta) return { type: "button", confidence: 0.9 };
        if (isSmall) return { type: "button", confidence: 0.85 };
        return { type: "button", confidence: 0.75 };
      }
      return { type: "link", confidence: 0.85 };
    }
    if (hasAnyClassToken(el, ["spacer", "spacing"])) {
      return { type: "spacer", confidence: 0.7 };
    }
    if (hasAnyClassToken(el, ["divider", "separator"])) {
      return { type: "divider", confidence: 0.7 };
    }
    if (tag === "svg" || tag === "i" && el.children.length === 0 && text.length === 0) {
      return { type: "icon", confidence: 0.75 };
    }
    if (hasClassToken(el, "icon") && el.children.length <= 1 && text.length < 5) {
      return { type: "icon", confidence: 0.7 };
    }
    if (hasAnyClassToken(el, ["countdown", "timer"])) {
      return { type: "countdown", confidence: 0.7 };
    }
    if (tag === "blockquote") {
      return { type: "testimonial", confidence: 0.8 };
    }
    if (hasAnyClassToken(el, ["testimonial", "review-card", "testimonial-card"])) {
      const hasName = !!el.querySelector("cite, [class*='name'], [class*='author']");
      return { type: "testimonial", confidence: hasName ? 0.8 : 0.65 };
    }
    if (hasAnyClassToken(el, ["pricing-card", "price-card"])) {
      const hasPrice = !!el.querySelector("[class*='price'], [class*='amount']") || /\$[\d,.]+|€[\d,.]+|£[\d,.]+/i.test(text);
      return { type: "card", confidence: hasPrice ? 0.8 : 0.6 };
    }
    if (hasAnyClassToken(el, ["feature-card", "benefit-card"])) {
      return { type: "card", confidence: 0.7 };
    }
    if (hasClassToken(el, "card") && el.children.length >= 2) {
      return { type: "card", confidence: 0.6 };
    }
    if (hasAnyClassToken(el, ["faq-item", "accordion-item"])) {
      return { type: "faq-item", confidence: 0.75 };
    }
    return { type: "unknown", confidence: 0.2 };
  }
  function classifySection(el) {
    const rawText = el.textContent || "";
    const text = normalizeText(rawText.slice(0, 5e3));
    const tag = el.tagName.toLowerCase();
    if (tag === "header") return { hint: "header", confidence: 0.9 };
    if (tag === "footer") return { hint: "footer", confidence: 0.9 };
    if (tag === "nav") return { hint: "header", confidence: 0.7 };
    if (hasClassToken(el, "header") || el.id === "header") return { hint: "header", confidence: 0.85 };
    if (hasClassToken(el, "footer") || el.id === "footer") return { hint: "footer", confidence: 0.85 };
    if (hasAnyClassToken(el, ["hero", "hero-section", "hero-banner"]) || el.id === "hero") {
      return { hint: "hero", confidence: 0.85 };
    }
    if (hasAnyClassToken(el, ["feature", "features", "feature-section", "features-section"]) || el.id === "features") {
      return { hint: "features", confidence: 0.75 };
    }
    if (hasAnyClassToken(el, ["testimonial", "testimonials", "testimonial-section", "reviews"]) || el.id === "testimonials" || el.id === "reviews") {
      return { hint: "testimonials", confidence: 0.75 };
    }
    if (hasAnyClassToken(el, ["pricing", "pricing-section", "plans"]) || el.id === "pricing") {
      return { hint: "pricing", confidence: 0.75 };
    }
    if (hasAnyClassToken(el, ["faq", "faq-section", "accordion"]) || el.id === "faq") {
      return { hint: "faq", confidence: 0.75 };
    }
    if (hasAnyClassToken(el, ["cta", "cta-section", "call-to-action"]) || el.id === "cta") {
      return { hint: "cta", confidence: 0.75 };
    }
    if (hasAnyClassToken(el, ["gallery", "carousel", "slider", "gallery-section"]) || el.id === "gallery") {
      return { hint: "gallery", confidence: 0.7 };
    }
    const isFirst = !el.previousElementSibling;
    const hasH1 = !!el.querySelector("h1");
    const hasButton = !!el.querySelector("button, [role='button']") || hasButtonLink(el);
    const hasLargeImage = !!el.querySelector("img[src], picture");
    if (isFirst && hasH1 && hasButton) return { hint: "hero", confidence: 0.7 };
    if (isFirst && hasH1 && hasLargeImage) return { hint: "hero", confidence: 0.6 };
    if (isFirst && hasH1) return { hint: "hero", confidence: 0.5 };
    const detailsOrAccordion = el.querySelectorAll("details, [class~='accordion-item'], [class~='faq-item']");
    if (detailsOrAccordion.length >= 2) {
      return { hint: "faq", confidence: 0.7 };
    }
    if (containsAny(text, ["frequently asked", "common questions", "have questions"]) && detailsOrAccordion.length >= 1) {
      return { hint: "faq", confidence: 0.65 };
    }
    if (containsAny(text, ["frequently asked", "common questions"]) && el.querySelectorAll("h3, h4, dt").length >= 3) {
      return { hint: "faq", confidence: 0.55 };
    }
    const testimonialEls = el.querySelectorAll("blockquote, [class~='testimonial'], [class~='testimonial-card'], [class~='review-card']");
    if (testimonialEls.length >= 2) {
      return { hint: "testimonials", confidence: 0.65 };
    }
    if (containsAny(text, ["what people say", "customer review", "what our clients", "success stories", "hear from", "what others say"]) && testimonialEls.length >= 1) {
      return { hint: "testimonials", confidence: 0.6 };
    }
    const priceSignals = el.querySelectorAll("[class~='pricing-card'], [class~='price-card'], [class~='plan-card']");
    if (priceSignals.length >= 2) {
      return { hint: "pricing", confidence: 0.65 };
    }
    if (containsAny(text, ["per month", "/mo", "pricing", "choose your plan"]) && (priceSignals.length >= 1 || /\$[\d,.]+/.test(rawText))) {
      return { hint: "pricing", confidence: 0.55 };
    }
    const featureCards = el.querySelectorAll("[class~='feature-card'], [class~='benefit-card'], [class~='feature']");
    if (featureCards.length >= 3) {
      return { hint: "features", confidence: 0.55 };
    }
    if (hasButton && containsAny(text, ["get started", "sign up", "buy now", "start now", "join", "book", "schedule", "claim", "try free", "order now"])) {
      const directTextLen = el.querySelector("h1, h2, h3")?.textContent?.length || 0;
      const isFocused = el.children.length <= 5 && directTextLen < 200;
      return { hint: "cta", confidence: isFocused ? 0.6 : 0.45 };
    }
    return { hint: "content", confidence: 0.3 };
  }
  function hasButtonLink(container) {
    const anchors = container.querySelectorAll("a");
    const limit = Math.min(anchors.length, 50);
    for (let i = 0; i < limit; i++) {
      const a = anchors[i];
      if (hasAnyClassToken(a, ["btn", "button", "cta"]) || hasClassTokenPrefix(a, "btn-") || hasClassTokenPrefix(a, "button-") || hasClassTokenPrefix(a, "cta-")) return true;
    }
    return false;
  }

  // clonelevel/src/core/dom/infer-layout.ts
  var SKIP_TAGS = /* @__PURE__ */ new Set(["script", "style", "link", "meta", "noscript"]);
  var JUNK_TAGS = /* @__PURE__ */ new Set(["script", "style", "link", "meta", "noscript", "br"]);
  var SNAP_TARGETS = [100, 80, 75, 70, 67, 66, 60, 50, 40, 34, 33, 30, 25, 20];
  function snapWidth(raw) {
    let best = raw;
    let bestDist = Infinity;
    for (const target of SNAP_TARGETS) {
      const dist = Math.abs(raw - target);
      if (dist < bestDist && dist <= 4) {
        bestDist = dist;
        best = target;
      }
    }
    return best;
  }
  var WRAPPER_TAGS = /* @__PURE__ */ new Set(["div", "span", "section", "article", "main"]);
  var WRAPPER_SUBSTRINGS = ["wrapper", "container", "inner", "outer", "wrap"];
  function isPassthroughWrapper(el) {
    const tag = el.tagName.toLowerCase();
    if (!WRAPPER_TAGS.has(tag)) return false;
    if (el.getAttribute("role")) return false;
    const contentChildren = Array.from(el.children).filter((c) => !SKIP_TAGS.has(c.tagName.toLowerCase()));
    if (contentChildren.length !== 1) return false;
    const computed = window.getComputedStyle(el);
    const bg = computed.backgroundColor;
    const border = computed.border;
    const hasStyling = bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent" || border && border !== "0px none rgb(0, 0, 0)" && !border.startsWith("0px");
    if (hasStyling) return false;
    if (el.classList.length > 0) {
      for (let i = 0; i < el.classList.length; i++) {
        const cls = el.classList[i].toLowerCase();
        if (WRAPPER_SUBSTRINGS.some((tok) => cls.includes(tok))) {
          return true;
        }
      }
    }
    if (el.id === "" && el.classList.length === 0) return true;
    return false;
  }
  function unwrapPassthrough(el) {
    let current = el;
    let depth = 0;
    while (depth < 6 && isPassthroughWrapper(current)) {
      const contentChildren = Array.from(current.children).filter((c) => !SKIP_TAGS.has(c.tagName.toLowerCase()));
      if (contentChildren.length !== 1) break;
      current = contentChildren[0];
      depth++;
    }
    return current;
  }
  function isFlexRowDisplay(display, flexDir) {
    if (display !== "flex" && display !== "inline-flex") return false;
    return flexDir === "row" || flexDir === "row-reverse" || flexDir === "" || flexDir === "initial";
  }
  function inferLayout(container) {
    const rows = [];
    const unwrapped = unwrapPassthrough(container);
    const directChildren = Array.from(unwrapped.children).filter((c) => !SKIP_TAGS.has(c.tagName.toLowerCase()));
    for (const rawChild of directChildren) {
      const child = unwrapPassthrough(rawChild);
      const tag = child.tagName.toLowerCase();
      if (SKIP_TAGS.has(tag)) continue;
      const computed = window.getComputedStyle(child);
      const display = computed.display;
      const flexDir = computed.flexDirection;
      const gridCols = computed.gridTemplateColumns;
      const isFlexRow = isFlexRowDisplay(display, flexDir);
      const isGrid = display === "grid" || display === "inline-grid";
      const isReversed = flexDir === "row-reverse";
      if (isFlexRow || isGrid) {
        const contentKids = Array.from(child.children).filter((c) => !SKIP_TAGS.has(c.tagName.toLowerCase()));
        if (isFlexRow && contentKids.length === 1) {
          const soleChild = unwrapPassthrough(contentKids[0]);
          const elements = inferElements(soleChild, 0);
          if (elements.length > 0) {
            rows.push({
              id: generateRowId(),
              columnCount: 1,
              styles: extractStyles(child),
              columns: [{ id: generateColumnId(), widthPercent: 100, styles: {}, elements }]
            });
          }
        } else {
          const columns = inferColumns(child, isGrid, gridCols);
          const filtered = filterEmptyColumns(columns);
          if (filtered.length > 0) {
            const ordered = isReversed ? filtered.reverse() : filtered;
            rows.push({
              id: generateRowId(),
              columnCount: ordered.length,
              styles: extractStyles(child),
              columns: ordered
            });
          }
        }
      } else {
        const twoColResult = detectImplicitTwoColumn(child);
        if (twoColResult) {
          rows.push(twoColResult);
        } else {
          const elements = inferElements(child, 0);
          if (elements.length > 0) {
            rows.push({
              id: generateRowId(),
              columnCount: 1,
              styles: extractStyles(child),
              columns: [
                {
                  id: generateColumnId(),
                  widthPercent: 100,
                  styles: {},
                  elements
                }
              ]
            });
          }
        }
      }
    }
    return mergeAdjacentSingleColumnRows(rows);
  }
  function mergeAdjacentSingleColumnRows(rows) {
    if (rows.length <= 1) return rows;
    const result = [];
    let pending = null;
    for (const row of rows) {
      if (row.columnCount === 1 && row.columns[0].elements.length === 1) {
        const el = row.columns[0].elements[0];
        if (el.type === "unknown" && !el.content) {
          continue;
        }
      }
      if (row.columnCount === 1 && pending && pending.columnCount === 1 && row.columns[0].elements.length <= 2 && pending.columns[0].elements.length <= 3) {
        const prevTypes = new Set(pending.columns[0].elements.map((e) => e.type));
        const curTypes = new Set(row.columns[0].elements.map((e) => e.type));
        const isRelated = prevTypes.has("headline") && (curTypes.has("paragraph") || curTypes.has("button") || curTypes.has("subheadline") || curTypes.has("image")) || prevTypes.has("subheadline") && (curTypes.has("paragraph") || curTypes.has("button")) || prevTypes.has("paragraph") && curTypes.has("button") || prevTypes.has("image") && (curTypes.has("headline") || curTypes.has("subheadline") || curTypes.has("paragraph"));
        if (isRelated) {
          pending.columns[0].elements.push(...row.columns[0].elements);
          continue;
        }
      }
      if (pending) result.push(pending);
      pending = row;
    }
    if (pending) result.push(pending);
    return result;
  }
  function filterEmptyColumns(columns) {
    return columns.filter((col) => {
      if (col.elements.length === 0) return false;
      const allEmpty = col.elements.every((e) => e.type === "unknown" && !e.content && !e.src);
      return !allEmpty;
    });
  }
  function inferColumns(container, isGrid, gridCols) {
    const children = Array.from(container.children).filter((c) => !SKIP_TAGS.has(c.tagName.toLowerCase()));
    if (children.length === 0) return [];
    const containerWidth = container.getBoundingClientRect().width || 1;
    const columns = [];
    if (isGrid && gridCols && gridCols !== "none") {
      const tracks = gridCols.split(/\s+/).filter((t) => t !== "");
      const totalFr = tracks.reduce((sum, t) => {
        const frMatch = t.match(/^([\d.]+)fr$/);
        return frMatch ? sum + parseFloat(frMatch[1]) : sum;
      }, 0);
      for (let i = 0; i < children.length && i < tracks.length; i++) {
        let widthPercent;
        const frMatch = tracks[i].match(/^([\d.]+)fr$/);
        if (frMatch && totalFr > 0) {
          widthPercent = snapWidth(Math.round(parseFloat(frMatch[1]) / totalFr * 100));
        } else {
          widthPercent = snapWidth(Math.round(children[i].getBoundingClientRect().width / containerWidth * 100));
        }
        const unwrapped = unwrapPassthrough(children[i]);
        const elements = inferElements(unwrapped, 0);
        columns.push({
          id: generateColumnId(),
          widthPercent,
          styles: extractStyles(children[i]),
          elements
        });
      }
      return columns;
    }
    for (const child of children) {
      const childWidth = child.getBoundingClientRect().width;
      const widthPercent = snapWidth(Math.round(childWidth / containerWidth * 100));
      const unwrapped = unwrapPassthrough(child);
      const elements = inferElements(unwrapped, 0);
      columns.push({
        id: generateColumnId(),
        widthPercent,
        styles: extractStyles(child),
        elements
      });
    }
    return columns;
  }
  function detectImplicitTwoColumn(container) {
    const children = Array.from(container.children).filter((c) => {
      const tag = c.tagName.toLowerCase();
      if (JUNK_TAGS.has(tag) || tag === "hr") return false;
      const text = c.textContent?.trim() || "";
      return text.length > 0 || c.children.length > 0;
    });
    if (children.length !== 2) return null;
    const containerRect = container.getBoundingClientRect();
    if (containerRect.width < 400) return null;
    const r1 = children[0].getBoundingClientRect();
    const r2 = children[1].getBoundingClientRect();
    if (r1.width < 50 || r2.width < 50) return null;
    if (r1.height < 10 || r2.height < 10) return null;
    const horizontalOverlap = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
    const narrower = Math.min(r1.width, r2.width);
    if (narrower > 0 && horizontalOverlap / narrower > 0.3) return null;
    const verticalOverlap = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
    const shorterHeight = Math.min(r1.height, r2.height);
    if (shorterHeight > 0 && verticalOverlap / shorterHeight < 0.3) return null;
    const w1 = snapWidth(Math.round(r1.width / containerRect.width * 100));
    const w2 = snapWidth(Math.round(r2.width / containerRect.width * 100));
    if (w1 < 15 || w2 < 15) return null;
    const u1 = unwrapPassthrough(children[0]);
    const u2 = unwrapPassthrough(children[1]);
    const elements1 = inferElements(u1, 0);
    const elements2 = inferElements(u2, 0);
    if (elements1.length === 0 && elements2.length === 0) return null;
    return {
      id: generateRowId(),
      columnCount: 2,
      styles: extractStyles(container),
      columns: [
        { id: generateColumnId(), widthPercent: w1, styles: extractStyles(children[0]), elements: elements1 },
        { id: generateColumnId(), widthPercent: w2, styles: extractStyles(children[1]), elements: elements2 }
      ]
    };
  }
  var MAX_RECURSE_DEPTH = 8;
  function inferElements(container, depth) {
    if (depth > MAX_RECURSE_DEPTH) return [];
    const elements = [];
    const children = Array.from(container.children);
    if (children.length === 0) {
      const classification = classifyElement(container);
      if (classification.type !== "unknown" || (container.textContent?.trim() || "").length > 0) {
        elements.push(buildElementNode(container, classification.type, classification.confidence));
      }
      return elements;
    }
    for (const rawChild of children) {
      const tag = rawChild.tagName.toLowerCase();
      if (SKIP_TAGS.has(tag)) continue;
      const child = unwrapPassthrough(rawChild);
      const classification = classifyElement(child);
      if (classification.confidence >= 0.5) {
        elements.push(buildElementNode(child, classification.type, classification.confidence));
      } else if (child.children.length > 0) {
        const nested = inferElements(child, depth + 1);
        elements.push(...nested);
      } else {
        const text = child.textContent?.trim() || "";
        if (text.length > 0) {
          elements.push(buildElementNode(child, "paragraph", 0.4));
        }
      }
    }
    return elements;
  }
  function buildElementNode(el, type, confidence) {
    const tag = el.tagName.toLowerCase();
    const node = {
      id: generateElementId(),
      type,
      confidence,
      htmlTag: tag,
      styles: extractStyles(el)
    };
    const shouldHaveContent = isTextElementType(type) || type === "testimonial" || type === "faq-item" || type === "card" || type === "countdown";
    if (shouldHaveContent) {
      const text = el.textContent?.trim();
      if (text && text.length < 2e3) {
        node.content = text;
      }
    }
    if (tag === "img" || tag === "picture") {
      const imgEl = tag === "picture" ? el.querySelector("img") : el;
      node.src = imgEl?.getAttribute("src") || imgEl?.getAttribute("srcset")?.split(",")[0]?.trim()?.split(/\s+/)[0] || void 0;
      node.alt = imgEl?.getAttribute("alt") || void 0;
      if (!node.src && tag === "picture") {
        const source = el.querySelector("source[srcset]");
        if (source) {
          node.src = source.getAttribute("srcset")?.split(",")[0]?.trim()?.split(/\s+/)[0] || void 0;
        }
      }
    }
    if (tag === "a") {
      node.href = el.getAttribute("href") || void 0;
    }
    if (tag === "video") {
      node.src = el.getAttribute("src") || el.querySelector("source")?.getAttribute("src") || void 0;
    }
    const attrs = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      if (!["class", "id", "style"].includes(attr.name)) {
        attrs[attr.name] = attr.value;
      }
    }
    if (Object.keys(attrs).length > 0) {
      node.attributes = attrs;
    }
    return node;
  }
  function fallbackInferElements(container) {
    return inferElements(container, 0);
  }

  // clonelevel/src/core/dom/build-public-package.ts
  function capturePublicPage(url, doc) {
    logger.info("build-package", `Building public package for ${url}`);
    const pkg = createEmptyPackage(url);
    const warnings = [];
    const unsupported = [];
    try {
      const metadata = extractMetadata(doc);
      pkg.page.title = metadata.title;
      pkg.page.meta = {
        description: metadata.description,
        keywords: metadata.keywords,
        schemaBlocks: metadata.schemaBlocks
      };
    } catch (err) {
      warnings.push(`Metadata extraction failed: ${String(err)}`);
    }
    try {
      const globalStyles = extractGlobalStyles(doc);
      pkg.page.globalStyles = {
        fonts: globalStyles.fonts,
        colors: globalStyles.colors,
        customCss: globalStyles.customCss
      };
    } catch (err) {
      warnings.push(`Global styles extraction failed: ${String(err)}`);
    }
    try {
      const assets = extractAssets(doc, url);
      pkg.assets = assets;
      const junkCount = assets.filter((a) => a.isJunk).length;
      if (junkCount > 0) {
        warnings.push(`Filtered ${junkCount} tracking/junk assets`);
      }
    } catch (err) {
      warnings.push(`Asset extraction failed: ${String(err)}`);
    }
    try {
      const sections = extractSections(doc, warnings);
      pkg.page.sections = sections;
      if (sections.length === 0) {
        warnings.push("No sections could be extracted from the page");
      } else if (sections.length === 1) {
        warnings.push("Only 1 section extracted \u2014 page structure may be too flat or non-standard");
      }
      const lowConfSections = sections.filter((s) => s.confidence < 0.5);
      if (lowConfSections.length > 0) {
        warnings.push(`${lowConfSections.length} section(s) classified with low confidence (<0.5): ${lowConfSections.map((s) => s.sectionHint).join(", ")}`);
      }
      const totalElements = sections.reduce(
        (sum, s) => sum + s.rows.reduce((rs, r) => rs + r.columns.reduce((cs, c) => cs + c.elements.length, 0), 0),
        0
      );
      if (totalElements === 0) {
        warnings.push("No elements detected within extracted sections");
      }
      const hasHero = sections.some((s) => s.sectionHint === "hero");
      const hasCta = sections.some((s) => s.sectionHint === "cta");
      if (!hasHero) {
        warnings.push("No hero section detected \u2014 the first section may need manual review");
      }
      if (!hasCta && sections.length >= 3) {
        warnings.push("No CTA section detected \u2014 review section hints for accuracy");
      }
      const fallbackCount = sections.filter(
        (s) => s.rows.length === 1 && s.rows[0].columns.length === 1 && s.rows[0].columns[0].elements.some((e) => e.confidence < 0.5)
      ).length;
      if (fallbackCount > 0) {
        warnings.push(`${fallbackCount} section(s) used fallback element extraction \u2014 layout may be simplified`);
      }
      const wrapperDepth = measureWrapperDepth(doc.body);
      if (wrapperDepth >= 4) {
        warnings.push(`Deeply nested page structure detected (wrapper depth: ${wrapperDepth}). Layout inference may have unwrapped structural containers`);
      }
    } catch (err) {
      warnings.push(`Section extraction failed: ${String(err)}`);
    }
    try {
      pkg.raw = {
        domSnapshot: doc.documentElement.outerHTML.slice(0, 5e5)
      };
    } catch (err) {
      warnings.push(`DOM snapshot failed: ${String(err)}`);
    }
    const customTags = detectCustomElements(doc);
    if (customTags.length > 0) {
      unsupported.push(`Custom web components detected: ${customTags.slice(0, 10).join(", ")}${customTags.length > 10 ? ` (+${customTags.length - 10} more)` : ""}`);
    }
    pkg.diagnostics = { warnings, unsupported };
    logger.info("build-package", `Package built: ${pkg.page.sections.length} sections, ${pkg.assets.length} assets, ${warnings.length} warnings`);
    return pkg;
  }
  function detectCustomElements(doc) {
    const customTags = /* @__PURE__ */ new Set();
    const els = doc.querySelectorAll("*");
    const limit = Math.min(els.length, 1e4);
    for (let i = 0; i < limit; i++) {
      const tag = els[i].tagName.toLowerCase();
      if (tag.includes("-") && !tag.startsWith("data-")) {
        customTags.add(tag);
      }
    }
    return Array.from(customTags);
  }
  function measureWrapperDepth(body) {
    if (!body) return 0;
    let depth = 0;
    let current = body;
    const wrapperTags = /* @__PURE__ */ new Set(["div", "section", "article", "main", "span"]);
    while (current) {
      const contentChildren = Array.from(current.children).filter((c) => {
        const tag = c.tagName.toLowerCase();
        return !["script", "style", "link", "meta", "noscript"].includes(tag);
      });
      if (contentChildren.length === 1 && wrapperTags.has(contentChildren[0].tagName.toLowerCase())) {
        depth++;
        current = contentChildren[0];
      } else {
        break;
      }
    }
    return depth;
  }
  function extractSections(doc, warnings) {
    const body = doc.body;
    if (!body) return [];
    const cleanedBody = cleanBodyForExtraction(body);
    const sections = [];
    const processed = /* @__PURE__ */ new WeakSet();
    const topLevelSections = cleanedBody.querySelectorAll(":scope > section, :scope > header, :scope > footer, :scope > main, :scope > article, :scope > nav");
    if (topLevelSections.length > 0) {
      topLevelSections.forEach((el) => {
        if (processed.has(el)) return;
        processed.add(el);
        const section = buildSection(el, warnings);
        if (section) sections.push(section);
      });
      const remaining = Array.from(cleanedBody.children).filter(
        (child) => !processed.has(child) && isContentElement(child)
      );
      for (const child of remaining) {
        const section = buildSection(child, warnings);
        if (section) sections.push(section);
      }
    }
    if (sections.length === 0) {
      const mainContent = cleanedBody.querySelector("main") || cleanedBody;
      const directChildren = Array.from(mainContent.children);
      for (const child of directChildren) {
        if (!isContentElement(child)) continue;
        const section = buildSection(child, warnings);
        if (section) sections.push(section);
      }
    }
    if (sections.length === 0) {
      const nestedCandidates = [
        ":scope > div > div",
        ":scope > div > section",
        ":scope > div > div > div",
        ":scope > div > div > section"
      ];
      for (const selector of nestedCandidates) {
        try {
          const nested = cleanedBody.querySelectorAll(selector);
          if (nested.length >= 2) {
            warnings.push(`Falling back to nested section detection (${selector})`);
            nested.forEach((el) => {
              if (processed.has(el)) return;
              processed.add(el);
              const section = buildSection(el, warnings);
              if (section) sections.push(section);
            });
            if (sections.length > 0) break;
          }
        } catch {
        }
      }
    }
    return sections;
  }
  function cleanBodyForExtraction(body) {
    const clone = body.cloneNode(true);
    const safeJunkSelectors = [
      "script",
      "noscript",
      "style",
      "link[rel='stylesheet']",
      "link[rel='preload']",
      "link[rel='prefetch']",
      "[style*='display: none']",
      "[style*='display:none']",
      "[aria-hidden='true']:not([role]):not(svg):not(svg *)",
      "iframe[src*='analytics']",
      "iframe[src*='tracking']",
      "iframe[src*='pixel']",
      "img[width='1'][height='1']",
      "img[width='0'][height='0']"
    ];
    const targetedJunkSelectors = [
      "[class*='cookie-banner']",
      "[class*='cookie-notice']",
      "[class*='cookie-consent']",
      "[id*='cookie-banner']",
      "[id*='cookie-notice']",
      "[id*='cookie-consent']",
      "[class*='gdpr']",
      "[class*='consent-manager']",
      "[class*='consent-banner']",
      "[class*='chat-widget']",
      "[class*='intercom']",
      "[class*='drift-widget']",
      "[class*='crisp-client']",
      "[class~='fb-pixel']",
      "[class*='google-tag-manager']",
      "[class~='popup-overlay']",
      "[class~='modal-backdrop']"
    ];
    for (const sel of safeJunkSelectors) {
      try {
        clone.querySelectorAll(sel).forEach((el) => el.remove());
      } catch {
      }
    }
    for (const sel of targetedJunkSelectors) {
      try {
        clone.querySelectorAll(sel).forEach((el) => el.remove());
      } catch {
      }
    }
    return clone;
  }
  function isContentElement(el) {
    const tag = el.tagName.toLowerCase();
    if (["script", "style", "link", "noscript", "meta", "br"].includes(tag)) return false;
    if (el instanceof HTMLElement) {
      if (el.style.display === "none") return false;
      if (el.getAttribute("aria-hidden") === "true" && !el.getAttribute("role") && tag !== "svg") return false;
    }
    const text = el.textContent?.trim() || "";
    if (text.length === 0 && el.children.length === 0) return false;
    if (tag === "div" && text.length === 0 && el.children.length === 0) {
      return false;
    }
    if (tag === "div" && text.length === 0) {
      const hasVisibleContent = !!el.querySelector("img, video, audio, iframe, svg, canvas, picture, form, input, button, select, textarea");
      if (!hasVisibleContent && el.children.length === 0) return false;
    }
    return true;
  }
  function buildSection(el, warnings) {
    const classification = classifySection(el);
    let rows = inferLayout(el);
    if (rows.length === 0) {
      const elements = fallbackInferElements(el);
      if (elements.length > 0) {
        warnings.push(`Section "${classification.hint}" used fallback element extraction (no layout rows inferred)`);
        rows = [
          {
            id: generateRowId(),
            columnCount: 1,
            columns: [
              {
                id: generateColumnId(),
                widthPercent: 100,
                styles: {},
                elements
              }
            ]
          }
        ];
      }
    }
    if (rows.length === 0) return null;
    return {
      id: generateSectionId(),
      sectionHint: classification.hint,
      confidence: classification.confidence,
      rows
    };
  }

  // clonelevel/src/content/bridge/inject-page-bridge.ts
  function injectPageBridge() {
    if (window.__clonelevel_bridge_injected) return;
    window.__clonelevel_bridge_injected = true;
    logger.info("bridge", "Injecting page bridge runtime");
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("content/bridge/page-bridge-runtime.js");
    script.onload = () => {
      script.remove();
      logger.info("bridge", "Page bridge runtime injected successfully");
    };
    script.onerror = () => {
      script.remove();
      logger.warn("bridge", "Failed to inject page bridge runtime");
    };
    (document.head || document.documentElement).appendChild(script);
  }

  // clonelevel/src/content/editor-inspector.ts
  var CONTENT_SOURCE = "clonelevel-content";
  var BRIDGE_SOURCE = "clonelevel-page-bridge";
  var SNAPSHOTS_KEY = "clonelevel_inspector_snapshots_v2";
  var MAX_SNAPSHOTS = 200;
  var bridgeReady = false;
  var bridgeListenerAttached = false;
  var csReceivedCount = 0;
  var csForwardedCount = 0;
  var csDirectStoreCount = 0;
  var csDroppedCount = 0;
  var lastReceivedAt = null;
  var csSentEnableCount = 0;
  var csSentPingCount = 0;
  var csSentDebugEnableCount = 0;
  var csSentMarkSaveCount = 0;
  var csRxBootedCount = 0;
  var csRxPingAckCount = 0;
  var csRxBridgeAckCount = 0;
  var csRxRawLogCount = 0;
  var lastRawLog = [];
  var lastRawLogTs = null;
  async function writeDirectToStorage(snapshot) {
    try {
      const result = await chrome.storage.local.get(SNAPSHOTS_KEY);
      const existing = result[SNAPSHOTS_KEY] || [];
      existing.push(snapshot);
      if (existing.length > MAX_SNAPSHOTS) existing.splice(0, existing.length - MAX_SNAPSHOTS);
      await chrome.storage.local.set({ [SNAPSHOTS_KEY]: existing });
      csDirectStoreCount++;
      logger.info("editor-inspector", `Snapshot stored directly (SW fallback) id=${snapshot.id}`);
    } catch (err) {
      csDroppedCount++;
      logger.error("editor-inspector", "Failed to store snapshot directly", err);
    }
  }
  function forwardToSW(type, payload) {
    chrome.runtime.sendMessage({
      type,
      id: `${type}_${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      payload
    }).catch(() => {
      if (type === "INSPECTOR_BRIDGE_ACK" || type === "INSPECTOR_BRIDGE_BOOTED" || type === "INSPECTOR_PING_ACK") {
        chrome.storage.local.set({ [`clonelevel_${type.toLowerCase()}`]: payload });
      }
    });
  }
  function setupEditorInspector() {
    if (bridgeListenerAttached) return;
    bridgeListenerAttached = true;
    window.addEventListener("message", async (event) => {
      if (event.data?.source !== BRIDGE_SOURCE) return;
      const { type, payload } = event.data;
      logger.info("editor-inspector", `[CS rx] ${type}`, payload);
      if (type === "BRIDGE_BOOTED") {
        csRxBootedCount++;
        bridgeReady = true;
        forwardToSW("INSPECTOR_BRIDGE_BOOTED", payload);
      }
      if (type === "BRIDGE_READY") {
        bridgeReady = true;
      }
      if (type === "PING_BRIDGE_ACK") {
        csRxPingAckCount++;
        forwardToSW("INSPECTOR_PING_ACK", payload);
      }
      if (type === "BRIDGE_ACK") {
        csRxBridgeAckCount++;
        const ackPayload = { timestamp: (/* @__PURE__ */ new Date()).toISOString(), via: "postMessage", activated: true, ...payload };
        forwardToSW("INSPECTOR_BRIDGE_ACK", ackPayload);
      }
      if (type === "BRIDGE_RAW_LOG") {
        csRxRawLogCount++;
        lastRawLog = payload?.rawLog ?? [];
        lastRawLogTs = (/* @__PURE__ */ new Date()).toISOString();
        logger.info("editor-inspector", `[BRIDGE_RAW_LOG] ${lastRawLog.length} entries`);
        chrome.storage.local.set({ clonelevel_bridge_raw_log: payload }).catch(() => {
        });
      }
      if (type === "PATCHES_INSTALLED" || type === "PATCH_VERIFY_RESULT") {
        logger.info("editor-inspector", `[${type}]`, payload);
        chrome.storage.local.set({ clonelevel_patch_status: payload }).catch(() => {
        });
      }
      if (type === "DEBUG_INTERCEPT_ACK") {
        logger.info("editor-inspector", "[DEBUG_INTERCEPT_ACK] debugMode=" + payload?.debugMode);
        chrome.storage.local.set({ clonelevel_debug_intercept_ack: payload }).catch(() => {
        });
      }
      if (type === "SAVE_MARK_ACK") {
        logger.info("editor-inspector", "[SAVE_MARK_ACK] ts=" + payload?.ts);
        chrome.storage.local.set({ clonelevel_save_mark: payload }).catch(() => {
        });
      }
      if (type === "INSPECTOR_ENABLED") {
        logger.info("editor-inspector", "[INSPECTOR_ENABLED] Page context enabled");
      }
      if (type === "INSPECTOR_DISABLED") {
        logger.info("editor-inspector", "Inspector disabled in page context");
      }
      if (type === "PAYLOAD_CAPTURED") {
        const snapshot = payload;
        csReceivedCount++;
        lastReceivedAt = snapshot.timestamp;
        logger.info("editor-inspector", "Payload captured", { id: snapshot.id, url: snapshot.requestUrl });
        let swOk = false;
        try {
          const response = await chrome.runtime.sendMessage({
            type: "INSPECTOR_SNAPSHOT_CAPTURED",
            id: snapshot.id,
            timestamp: snapshot.timestamp,
            payload: snapshot
          });
          if (response?.ok) {
            swOk = true;
            csForwardedCount++;
          }
        } catch {
          logger.warn("editor-inspector", "SW not reachable \u2014 direct storage write");
        }
        if (!swOk) await writeDirectToStorage(snapshot);
      }
    });
    document.addEventListener("clonelevel:bridge:reply", (e) => {
      const detail = e.detail;
      if (!detail?.type) return;
      logger.info("editor-inspector", `[CustomEvent reply] type=${detail.type}`, detail);
      if (detail.type === "PING_BRIDGE_ACK") {
        csRxPingAckCount++;
        forwardToSW("INSPECTOR_PING_ACK", { ...detail, via: "customEvent" });
      }
      if (detail.type === "BRIDGE_BOOTED" || detail.type === "CUSTOM_ACK") {
        forwardToSW("INSPECTOR_BRIDGE_BOOTED", { ...detail, via: "customEvent" });
      }
    });
    logger.info("editor-inspector", "Editor inspector listener attached");
  }
  function enableInspector() {
    csSentEnableCount++;
    logger.info("editor-inspector", `[CS tx] ENABLE_INSPECTOR (attempt ${csSentEnableCount})`);
    window.postMessage({ source: CONTENT_SOURCE, type: "ENABLE_INSPECTOR" }, "*");
    document.dispatchEvent(new CustomEvent("clonelevel:bridge", { detail: { source: CONTENT_SOURCE, type: "ENABLE_INSPECTOR" } }));
    setTimeout(() => {
      window.postMessage({ source: CONTENT_SOURCE, type: "ENABLE_INSPECTOR" }, "*");
      document.dispatchEvent(new CustomEvent("clonelevel:bridge", { detail: { source: CONTENT_SOURCE, type: "ENABLE_INSPECTOR" } }));
      logger.info("editor-inspector", "[CS tx] ENABLE_INSPECTOR retry");
    }, 600);
  }
  function pingBridgeWithNonce(nonce) {
    csSentPingCount++;
    const payload = { source: CONTENT_SOURCE, type: "PING_BRIDGE", nonce, ts: (/* @__PURE__ */ new Date()).toISOString() };
    window.postMessage(payload, "*");
    document.dispatchEvent(new CustomEvent("clonelevel:bridge", { detail: payload }));
  }
  function disableInspector() {
    window.postMessage({ source: CONTENT_SOURCE, type: "DISABLE_INSPECTOR" }, "*");
  }
  function enableDebugIntercept() {
    csSentDebugEnableCount++;
    logger.info("editor-inspector", `[CS tx] ENABLE_DEBUG_INTERCEPT (attempt ${csSentDebugEnableCount})`);
    window.postMessage({ source: CONTENT_SOURCE, type: "ENABLE_DEBUG_INTERCEPT" }, "*");
    document.dispatchEvent(new CustomEvent("clonelevel:bridge", { detail: { source: CONTENT_SOURCE, type: "ENABLE_DEBUG_INTERCEPT" } }));
  }
  function disableDebugIntercept() {
    window.postMessage({ source: CONTENT_SOURCE, type: "DISABLE_DEBUG_INTERCEPT" }, "*");
  }
  function markSaveEvent() {
    csSentMarkSaveCount++;
    logger.info("editor-inspector", `[CS tx] MARK_SAVE_EVENT (attempt ${csSentMarkSaveCount})`);
    window.postMessage({ source: CONTENT_SOURCE, type: "MARK_SAVE_EVENT" }, "*");
    document.dispatchEvent(new CustomEvent("clonelevel:bridge", { detail: { source: CONTENT_SOURCE, type: "MARK_SAVE_EVENT" } }));
  }
  function requestBridgeRawLog() {
    logger.info("editor-inspector", "[CS tx] GET_BRIDGE_RAW_LOG");
    window.postMessage({ source: CONTENT_SOURCE, type: "GET_BRIDGE_RAW_LOG" }, "*");
  }
  function getBridgeStatus() {
    const ds = document.documentElement.dataset;
    return {
      // Connection
      bridgeInjected: window.__clonelevel_bridge_injected === true,
      bridgeActive: ds.clBridgeActive === "1",
      bridgeEnabled: ds.clBridgeEnabled === "1",
      debugMode: ds.clDebugMode === "1",
      bridgeBootTs: ds.clBridgeBootTs ?? null,
      bridgeMsgLog: ds.clBridgeMsgLog ? ds.clBridgeMsgLog.split(",") : [],
      // Task 1: pre-filter raw counters
      rawFetchSeen: parseInt(ds.clRawFetch || "0", 10),
      rawXhrSeen: parseInt(ds.clRawXhr || "0", 10),
      rawBeaconSeen: parseInt(ds.clRawBeacon || "0", 10),
      rawWsSeen: parseInt(ds.clRawWs || "0", 10),
      filteredOutCount: parseInt(ds.clFiltered || "0", 10),
      // Task 6: patch status (verified by reference in bridge)
      patchAttempted: ds.clPatchAttempted === "1",
      fetchPatched: ds.clFetchPatched === "1",
      fetchError: ds.clFetchErr ?? "",
      xhrPatched: ds.clXhrPatched === "1",
      xhrError: ds.clXhrErr ?? "",
      beaconPatched: ds.clBeaconPatched === "1",
      beaconError: ds.clBeaconErr ?? "",
      wsPatched: ds.clWsPatched === "1",
      wsError: ds.clWsErr ?? "",
      // Task 5: save mark
      saveMark: ds.clSaveMark || null,
      // Post-filter
      bridgeInterceptCount: parseInt(ds.clInterceptCount || "0", 10),
      bridgeSentCount: parseInt(ds.clSentCount || "0", 10),
      // CS counters
      csReceivedCount,
      csForwardedCount,
      csDirectStoreCount,
      csDroppedCount,
      csSentEnableCount,
      csSentPingCount,
      csSentDebugEnableCount,
      csSentMarkSaveCount,
      csRxBootedCount,
      csRxPingAckCount,
      csRxBridgeAckCount,
      csRxRawLogCount,
      lastReceivedAt,
      // Task 3: raw log
      rawLog: ds.clRawLog ? (() => {
        try {
          return JSON.parse(ds.clRawLog);
        } catch {
          return [];
        }
      })() : [],
      tabUrl: window.location.href
    };
  }

  // clonelevel/src/content/bootstrap.ts
  (function bootstrap() {
    if (globalThis.__clonelevel_bootstrapped) return;
    globalThis.__clonelevel_bootstrapped = true;
    logger.info("bootstrap", "CloneLevel content script loaded on " + location.href);
    (function injectCloneLevelScript() {
      try {
        if (document.getElementById("clonelevel-inject-script")) return;
        const s = document.createElement("script");
        s.id = "clonelevel-inject-script";
        s.src = chrome.runtime.getURL("content/clonelevel-inject.js");
        s.type = "text/javascript";
        (document.head || document.documentElement).appendChild(s);
        logger.info("bootstrap", "clonelevel-inject.js injected");
      } catch (e) {
        logger.warn("bootstrap", "Failed to inject clonelevel-inject.js: " + String(e));
      }
    })();
    const context = detectPageContext();
    chrome.runtime.sendMessage({
      type: "CONTEXT_DETECTED",
      id: generateMessageId(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      payload: context
    }).catch(() => {
    });
    if (context.pageType === "editor-page") {
      logger.info("bootstrap", "Editor page detected \u2014 injecting page bridge", {
        editorVariant: context.editorVariant,
        confidence: context.confidence
      });
      injectPageBridge();
      setupEditorInspector();
    }
    window.addEventListener("message", (e) => {
      if (e.source !== window) return;
      if (e.data?.source !== "clonelevel-page-bridge") return;
      if (e.data?.type !== "PREBUILT_REQUEST_CAPTURED") return;
      logger.info("bootstrap", `PREBUILT_REQUEST_CAPTURED relay \u2014 bodyLen=${String(e.data.payload?.reqBody?.length ?? 0)}`);
      chrome.runtime.sendMessage({
        type: "SAVE_PREBUILT_REQUEST",
        payload: e.data.payload
      }).catch(() => {
      });
    });
    window.addEventListener("message", (e) => {
      if (e.source !== window) return;
      if (e.data?.from !== "CL_InjectJS") return;
      if (e.data?.type !== "GHL_PAGE_DETECTED") return;
      chrome.runtime.sendMessage({
        type: "GHL_PAGE_DETECTED",
        payload: e.data.payload
      }).catch(() => {
      });
    });
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === "DO_DETECT_CONTEXT") {
        const freshContext = detectPageContext();
        sendResponse({ ok: true, data: freshContext });
        return false;
      }
      if (message.type === "DO_CAPTURE_PAGE") {
        try {
          const pkg = capturePublicPage(window.location.href, document);
          sendResponse({ ok: true, data: pkg });
        } catch (err) {
          logger.error("bootstrap", "Capture failed", err);
          sendResponse({ ok: false, error: String(err) });
        }
        return false;
      }
      if (message.type === "DO_ENABLE_INSPECTOR") {
        if (context.pageType !== "editor-page") {
          logger.warn("bootstrap", "DO_ENABLE_INSPECTOR on tab not originally detected as editor-page", {
            pageType: context.pageType,
            url: location.href
          });
        }
        injectPageBridge();
        setupEditorInspector();
        enableInspector();
        sendResponse({ ok: true, data: { enabled: true, editorVariant: context.editorVariant, url: location.href } });
        return false;
      }
      if (message.type === "DO_ACTIVATE_BRIDGE") {
        const log2 = [];
        const cts = () => (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour12: false });
        log2.push(`[${cts()}] \u2714 Stage 3 \u2014 Content script received DO_ACTIVATE_BRIDGE`);
        log2.push(`[${cts()}] Stage 3 \u2014 URL: ${location.href}`);
        log2.push(`[${cts()}] Stage 3 \u2014 Original context.pageType: "${context.pageType}"`);
        const ds = document.documentElement.dataset;
        log2.push(`[${cts()}] Stage 3 \u2014 ds.clBridgeActive: "${ds.clBridgeActive ?? "(not set)"}"`);
        log2.push(`[${cts()}] Stage 3 \u2014 ds.clBridgeEnabled: "${ds.clBridgeEnabled ?? "(not set)"}"`);
        log2.push(`[${cts()}] Stage 3 \u2014 isolated-world flag __clonelevel_bridge_injected: ${!!window.__clonelevel_bridge_injected}`);
        if (!ds.clBridgeActive) {
          log2.push(`[${cts()}] Stage 3 \u2014 ds.clBridgeActive is absent \u2192 bridge script DID NOT RUN (likely CSP blocked <script src>)`);
        }
        injectPageBridge();
        setupEditorInspector();
        log2.push(`[${cts()}] \u2714 Stage 4 \u2014 Calling window.postMessage ENABLE_INSPECTOR (source=clonelevel-content)`);
        enableInspector();
        log2.push(`[${cts()}] \u2714 Stage 4 \u2014 postMessage sent (+ retry in 600 ms)`);
        logger.info("bootstrap", "DO_ACTIVATE_BRIDGE executed", { url: location.href, bridgeActive: ds.clBridgeActive });
        sendResponse({ ok: true, log: log2, data: { url: location.href, bridgeActive: ds.clBridgeActive, bridgeEnabled: ds.clBridgeEnabled } });
        return false;
      }
      if (message.type === "DO_DISABLE_INSPECTOR") {
        disableInspector();
        sendResponse({ ok: true, data: { enabled: false } });
        return false;
      }
      if (message.type === "DO_PING_BRIDGE") {
        const nonce = message.payload?.nonce ?? `ping_${Date.now()}`;
        pingBridgeWithNonce(nonce);
        sendResponse({ ok: true, data: { nonce } });
        return false;
      }
      if (message.type === "DO_GET_BRIDGE_STATUS") {
        sendResponse({ ok: true, data: getBridgeStatus() });
        return false;
      }
      if (message.type === "DO_ENABLE_DEBUG_INTERCEPT") {
        enableDebugIntercept();
        sendResponse({ ok: true });
        return false;
      }
      if (message.type === "DO_DISABLE_DEBUG_INTERCEPT") {
        disableDebugIntercept();
        sendResponse({ ok: true });
        return false;
      }
      if (message.type === "DO_MARK_SAVE_EVENT") {
        markSaveEvent();
        sendResponse({ ok: true });
        return false;
      }
      if (message.type === "DO_GET_BRIDGE_RAW_LOG") {
        requestBridgeRawLog();
        sendResponse({ ok: true, data: getBridgeStatus() });
        return false;
      }
      if (message.type === "DO_VERIFY_PATCHES") {
        sendToBridgeRuntime("VERIFY_PATCHES");
        sendResponse({ ok: true });
        return false;
      }
      if (message.type === "PING_BUILDER") {
        sendResponse({ ok: true, data: { alive: true, url: location.href } });
        return false;
      }
      if (message.type === "REPLAY_MUTATION") {
        const payload = message.payload ?? {};
        const targetUrl = payload.fullUrl ?? payload.url ?? "";
        const method = payload.method ?? "POST";
        const headers = payload.headers ?? {};
        const rawBody = payload.body;
        const bodyStr = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody ?? {});
        logger.info("bootstrap", `REPLAY_MUTATION: ${method} ${targetUrl}`);
        (async () => {
          const doFetch = async (creds) => {
            const r = await fetch(targetUrl, { method, headers, body: bodyStr, credentials: creds });
            const text = await r.text().catch(() => "");
            return { ok: r.ok, status: r.status, bodyText: text.slice(0, 2e3) };
          };
          try {
            let result = await doFetch("omit");
            if (result.status === 401 || result.status === 403) {
              logger.info("bootstrap", `REPLAY_MUTATION: ${result.status} with omit \u2014 retrying with credentials:include`);
              result = await doFetch("include");
            }
            logger.info("bootstrap", `REPLAY_MUTATION: response ${result.status}`);
            sendResponse(result);
          } catch (err) {
            logger.warn("bootstrap", "REPLAY_MUTATION: fetch error", { err: String(err) });
            sendResponse({ ok: false, status: 0, bodyText: String(err) });
          }
        })();
        return true;
      }
      if (message.type === "CL_COPY_FUNNEL") {
        let copyHandler2 = function(e) {
          if (e.source !== window) return;
          if (e.data?.type !== "CL_INJECT_RESPONSE") return;
          if (e.data?.from !== "CL_InjectJS") return;
          if (e.data?.callbackId !== callbackId) return;
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          window.removeEventListener("message", copyHandler2);
          const p = e.data.payload ?? {};
          if (p.status === "ok") {
            sendResponse({ ok: true, data: p.funnelData });
          } else {
            sendResponse({ ok: false, error: p.error ?? "copy failed" });
          }
        };
        var copyHandler = copyHandler2;
        const callbackId = `cl_copy_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        let settled = false;
        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          window.removeEventListener("message", copyHandler2);
          sendResponse({ ok: false, error: "timeout \u2014 inject script did not respond within 10s" });
        }, 1e4);
        window.addEventListener("message", copyHandler2);
        window.postMessage({ from: "CL_Background", type: "CL_COPY_FUNNEL", callbackId }, "*");
        return true;
      }
      if (message.type === "CL_PASTE_FUNNEL") {
        let pasteHandler2 = function(e) {
          if (e.source !== window) return;
          if (e.data?.type !== "CL_INJECT_RESPONSE") return;
          if (e.data?.from !== "CL_InjectJS") return;
          if (e.data?.callbackId !== callbackId) return;
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          window.removeEventListener("message", pasteHandler2);
          const p = e.data.payload ?? {};
          if (p.status === "ok") {
            sendResponse({ ok: true });
          } else {
            sendResponse({ ok: false, error: p.error ?? "paste failed" });
          }
        };
        var pasteHandler = pasteHandler2;
        const callbackId = `cl_paste_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        let settled = false;
        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          window.removeEventListener("message", pasteHandler2);
          sendResponse({ ok: false, error: "timeout \u2014 inject script did not respond within 30s" });
        }, 3e4);
        window.addEventListener("message", pasteHandler2);
        window.postMessage({ from: "CL_Background", type: "CL_PASTE_FUNNEL", callbackId, payload: message.payload }, "*");
        return true;
      }
      if (message.type === "DO_INJECT_CLONE_PACKAGE") {
        let bridgeReplyHandler2 = function(e) {
          if (e.data?.source !== "clonelevel-page-bridge") return;
          if (e.data?.type !== "INJECT_CLONE_RESULT") return;
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          window.removeEventListener("message", bridgeReplyHandler2);
          const p = e.data.payload ?? {};
          logger.info("bootstrap", "INJECT_CLONE_RESULT received", { success: p.success, strategies: p.strategies });
          sendResponse({
            ok: true,
            attempted: true,
            verified: p.success === true,
            message: p.success ? `Injected ${p.sectionCount ?? "?"} sections via: ${(p.strategies ?? []).join(", ")}` : `Injection attempted \u2014 strategies tried: ${(p.strategies ?? []).join(", ")}`,
            strategies: p.strategies,
            globals: p.globals
          });
        };
        var bridgeReplyHandler = bridgeReplyHandler2;
        injectPageBridge();
        setupEditorInspector();
        const TIMEOUT_MS = 6e3;
        let settled = false;
        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          window.removeEventListener("message", bridgeReplyHandler2);
          logger.warn("bootstrap", "DO_INJECT_CLONE_PACKAGE: bridge reply timed out");
          sendResponse({
            ok: true,
            attempted: true,
            verified: false,
            bridgeTimeout: true,
            message: "Injection commands dispatched \u2014 bridge did not confirm within 6 s. Check HL builder console for [CloneLevel] logs."
          });
        }, TIMEOUT_MS);
        window.addEventListener("message", bridgeReplyHandler2);
        window.postMessage({
          source: "clonelevel-content",
          type: "INJECT_CLONE",
          payload: message.payload
        }, "*");
        return true;
      }
      return false;
    });
  })();
})();
//# sourceMappingURL=bootstrap.js.map
