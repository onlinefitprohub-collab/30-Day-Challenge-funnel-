// clonelevel/src/background/tab-state.ts
var tabContexts = /* @__PURE__ */ new Map();
function setTabContext(tabId, context) {
  tabContexts.set(tabId, context);
}
function getTabContext(tabId) {
  return tabContexts.get(tabId);
}
function removeTabContext(tabId) {
  tabContexts.delete(tabId);
}

// clonelevel/src/types/messages.ts
var DEFAULT_SETTINGS = {
  autoCaptureAssets: true,
  strictSameDomain: true,
  stripQueryStrings: false,
  maxCrawlDepth: 3,
  maxPages: 50,
  crawlDelayMs: 500,
  enablePreviewCapture: true,
  debugMode: false
};

// clonelevel/src/storage/settings-repo.ts
var SETTINGS_KEY = "clonelevel_settings";
async function getSettings() {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  const stored = result[SETTINGS_KEY];
  if (stored) {
    return { ...DEFAULT_SETTINGS, ...stored };
  }
  return { ...DEFAULT_SETTINGS };
}
async function saveSettings(settings) {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await chrome.storage.local.set({ [SETTINGS_KEY]: updated });
  return updated;
}

// clonelevel/src/storage/clone-repo.ts
var LAST_PACKAGE_KEY = "clonelevel_last_package";
var PACKAGE_HISTORY_KEY = "clonelevel_package_history";
var MAX_HISTORY = 10;
async function getLastPackage() {
  const result = await chrome.storage.local.get(LAST_PACKAGE_KEY);
  return result[LAST_PACKAGE_KEY] || null;
}
async function savePackage(pkg) {
  await chrome.storage.local.set({ [LAST_PACKAGE_KEY]: pkg });
  const history = await getPackageHistory();
  history.unshift({
    url: pkg.source.url,
    capturedAt: pkg.source.capturedAt,
    mode: pkg.source.mode,
    sectionCount: pkg.page.sections.length,
    assetCount: pkg.assets.length
  });
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY);
  }
  await chrome.storage.local.set({ [PACKAGE_HISTORY_KEY]: history });
}
async function getPackageHistory() {
  const result = await chrome.storage.local.get(PACKAGE_HISTORY_KEY);
  return result[PACKAGE_HISTORY_KEY] || [];
}
async function clearPackages() {
  await chrome.storage.local.remove([LAST_PACKAGE_KEY, PACKAGE_HISTORY_KEY]);
}

// clonelevel/src/storage/crawl-repo.ts
var LAST_FUNNEL_MAP_KEY = "clonelevel_last_funnel_map";
var CRAWL_HISTORY_KEY = "clonelevel_crawl_history";
var MAX_HISTORY2 = 10;
async function getLastFunnelMap() {
  const result = await chrome.storage.local.get(LAST_FUNNEL_MAP_KEY);
  return result[LAST_FUNNEL_MAP_KEY] || null;
}
async function saveFunnelMap(map) {
  await chrome.storage.local.set({ [LAST_FUNNEL_MAP_KEY]: map });
  const history = await getCrawlHistory();
  history.unshift({
    rootUrl: map.rootUrl,
    crawledAt: map.crawledAt,
    pageCount: map.discoveredPages.length,
    edgeCount: map.edges.length
  });
  if (history.length > MAX_HISTORY2) {
    history.splice(MAX_HISTORY2);
  }
  await chrome.storage.local.set({ [CRAWL_HISTORY_KEY]: history });
}
async function getCrawlHistory() {
  const result = await chrome.storage.local.get(CRAWL_HISTORY_KEY);
  return result[CRAWL_HISTORY_KEY] || [];
}
async function clearCrawlData() {
  await chrome.storage.local.remove([LAST_FUNNEL_MAP_KEY, CRAWL_HISTORY_KEY]);
}

// clonelevel/src/storage/session-repo.ts
var SESSION_KEY = "clonelevel_session";
var DIAGNOSTICS_KEY = "clonelevel_diagnostics";
var PAYLOAD_SNAPSHOTS_KEY = "clonelevel_payload_snapshots";
async function clearSession() {
  await chrome.storage.local.remove([
    SESSION_KEY,
    DIAGNOSTICS_KEY,
    PAYLOAD_SNAPSHOTS_KEY
  ]);
}
async function getDiagnostics() {
  const result = await chrome.storage.local.get(DIAGNOSTICS_KEY);
  return result[DIAGNOSTICS_KEY] || [];
}
async function addDiagnostic(entry) {
  const entries = await getDiagnostics();
  entries.push(entry);
  if (entries.length > 200) entries.splice(0, entries.length - 200);
  await chrome.storage.local.set({ [DIAGNOSTICS_KEY]: entries });
}

// clonelevel/src/storage/inspector-repo.ts
var INSPECTOR_SNAPSHOTS_KEY = "clonelevel_inspector_snapshots_v2";
var MAX_SNAPSHOTS = 200;
async function addSnapshot(snapshot) {
  const snapshots = await getAllSnapshots();
  snapshots.push(snapshot);
  if (snapshots.length > MAX_SNAPSHOTS) {
    snapshots.splice(0, snapshots.length - MAX_SNAPSHOTS);
  }
  await chrome.storage.local.set({ [INSPECTOR_SNAPSHOTS_KEY]: snapshots });
}
async function getAllSnapshots() {
  const result = await chrome.storage.local.get(INSPECTOR_SNAPSHOTS_KEY);
  return result[INSPECTOR_SNAPSHOTS_KEY] || [];
}
async function clearSnapshots() {
  await chrome.storage.local.remove(INSPECTOR_SNAPSHOTS_KEY);
}

// clonelevel/src/background/inspector-state.ts
var KEY = "clonelevel_inspector_state";
var DEFAULT = {
  enabled: false,
  tabId: null,
  editorTabId: null,
  lastSnapshotAt: null
};
async function getInspectorSessionState() {
  const res = await chrome.storage.session.get(KEY);
  return res[KEY] ?? DEFAULT;
}
async function patchInspectorSessionState(patch) {
  const current = await getInspectorSessionState();
  const next = { ...current, ...patch };
  await chrome.storage.session.set({ [KEY]: next });
  return next;
}

// clonelevel/src/background/inspector-ports.ts
var ports = /* @__PURE__ */ new Set();
function registerInspectorPort(port) {
  ports.add(port);
  port.onDisconnect.addListener(() => {
    ports.delete(port);
  });
}
function broadcastToInspectors(message) {
  for (const port of ports) {
    try {
      port.postMessage(message);
    } catch {
    }
  }
}

// clonelevel/src/core/schema/diagnostics.ts
function createDiagnosticEntry(severity, code, message, context) {
  return {
    severity,
    code,
    message,
    context,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}

// clonelevel/src/core/crawl/normalize-url.ts
var TRACKING_PARAMS = /* @__PURE__ */ new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "gclsrc",
  "dclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "twclid",
  "li_fat_id",
  "mc_cid",
  "mc_eid",
  "s_kwcid",
  "ef_id",
  "_ga",
  "_gl",
  "_hsenc",
  "_hsmi",
  "__hstc",
  "__hsfp",
  "ref",
  "referrer",
  "click_id",
  "clickid",
  "trk",
  "trkCampaign",
  "trkInfo"
]);
function normalizeCrawlUrl(url, stripQueryOrOptions = false) {
  const opts = typeof stripQueryOrOptions === "boolean" ? { stripQuery: stripQueryOrOptions } : stripQueryOrOptions;
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.hostname = parsed.hostname.toLowerCase();
    parsed.protocol = parsed.protocol.toLowerCase();
    if (parsed.protocol === "http:" && parsed.port === "80" || parsed.protocol === "https:" && parsed.port === "443") {
      parsed.port = "";
    }
    let pathname = parsed.pathname;
    if (pathname.endsWith("/") && pathname.length > 1) {
      pathname = pathname.slice(0, -1);
    }
    pathname = pathname.replace(/\/+/g, "/");
    parsed.pathname = pathname;
    if (opts.stripQuery) {
      parsed.search = "";
    } else {
      if (opts.stripTracking !== false) {
        const params = new URLSearchParams(parsed.search);
        for (const key of Array.from(params.keys())) {
          if (TRACKING_PARAMS.has(key.toLowerCase())) {
            params.delete(key);
          }
        }
        parsed.search = params.toString();
      }
      if (opts.sortParams) {
        const params = new URLSearchParams(parsed.search);
        const sorted = new URLSearchParams();
        Array.from(params.keys()).sort().forEach((key) => {
          const val = params.get(key);
          if (val !== null) sorted.set(key, val);
        });
        parsed.search = sorted.toString();
      }
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

// clonelevel/src/core/crawl/queue.ts
var CrawlQueue = class {
  constructor() {
    this.queue = [];
    this.visited = /* @__PURE__ */ new Set();
  }
  enqueue(item) {
    const normalized = normalizeCrawlUrl(item.url, { stripTracking: true });
    if (this.visited.has(normalized)) return false;
    this.visited.add(normalized);
    this.queue.push({ ...item, url: normalized });
    return true;
  }
  dequeue() {
    return this.queue.shift();
  }
  get size() {
    return this.queue.length;
  }
  get visitedCount() {
    return this.visited.size;
  }
  hasVisited(url) {
    return this.visited.has(normalizeCrawlUrl(url, { stripTracking: true }));
  }
  isEmpty() {
    return this.queue.length === 0;
  }
  getVisitedUrls() {
    return Array.from(this.visited);
  }
};

// clonelevel/src/core/normalize-text.ts
function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}
function containsAny(text, keywords) {
  const normalized = normalizeText(text);
  return keywords.some((kw) => normalized.includes(kw.toLowerCase()));
}

// clonelevel/src/core/crawl/page-classifier.ts
var URL_SIGNALS = {
  "opt-in": ["opt-in", "optin", "subscribe", "signup", "sign-up", "lead", "squeeze", "register", "free", "freebie", "webinar-register", "newsletter"],
  sales: ["sales", "offer", "promo", "deal", "pitch", "vsl", "video-sales", "letter", "launch", "product"],
  checkout: ["checkout", "order", "payment", "buy", "purchase", "cart", "billing"],
  upsell: ["upsell", "oto", "upgrade", "one-time-offer", "bump", "special-offer", "oto1", "oto2", "oto3"],
  downsell: ["downsell", "downgrade", "last-chance", "wait-offer", "final-offer"],
  "thank-you": ["thank", "thanks", "thankyou", "thank-you", "success", "welcome"],
  booking: ["book", "schedule", "calendar", "appointment", "consult", "demo", "call", "meeting", "reservation", "pick-a-time"],
  confirmation: ["confirmation", "confirmed", "receipt", "order-complete", "order-confirmed", "verify"],
  unknown: []
};
var BUTTON_SIGNALS = {
  "opt-in": ["submit", "sign up", "get access", "join", "subscribe", "download", "claim", "get free", "send me", "yes, send", "get instant", "reserve my spot", "register", "get your"],
  sales: ["buy now", "add to cart", "purchase", "order now", "get it now", "i want this", "start now", "get started", "invest", "enroll now", "grab", "unlock"],
  checkout: ["complete order", "place order", "pay now", "checkout", "complete purchase", "submit payment", "process order", "confirm order", "pay", "finalize"],
  upsell: ["yes, add this", "upgrade", "add to order", "yes! give me", "one click add", "add this now", "yes upgrade", "i want this too", "include this"],
  downsell: ["no thanks", "skip", "decline", "no, i don't want", "maybe later", "continue without"],
  "thank-you": ["continue", "go to dashboard", "access now", "get started"],
  booking: ["book now", "schedule", "reserve", "pick a time", "choose a slot", "book a call", "book a demo", "book appointment", "confirm booking"],
  confirmation: ["view order", "track order", "print receipt", "download receipt"],
  unknown: []
};
var HEADLINE_SIGNALS = {
  "opt-in": ["free", "instant access", "get your", "claim your", "discover", "subscribe", "join", "enter your email", "sign up", "register now", "grab your copy"],
  sales: ["introducing", "finally", "secret", "proven", "discover how", "transform", "the ultimate", "limited time", "new release", "presenting"],
  checkout: ["complete your order", "order summary", "billing", "payment details", "secure checkout", "review your order"],
  upsell: ["wait", "one time offer", "special deal", "exclusive", "before you go", "hold on", "don't miss", "add this to your order", "limited bonus", "upgrade your order"],
  downsell: ["are you sure", "last chance", "final offer", "we understand", "before you leave", "reduced price"],
  "thank-you": ["thank you", "thanks", "order confirmed", "you're in", "welcome aboard", "congratulations", "you're all set", "success"],
  booking: ["book a call", "schedule", "pick a time", "calendar", "available times", "choose a date", "book your", "consultation", "let's talk"],
  confirmation: ["confirmation", "confirmed", "receipt", "order details", "booking confirmed", "reservation confirmed"],
  unknown: []
};
var BODY_SIGNALS = {
  "opt-in": ["enter your email", "your name", "first name", "email address", "newsletter", "mailing list", "free download", "free access"],
  sales: ["money back guarantee", "limited time", "add to cart", "testimonial", "results", "before and after", "what you get", "what's included", "bonus", "guarantee"],
  checkout: ["credit card", "billing address", "shipping address", "order total", "payment method", "card number", "expiration", "cvv", "ssl", "secure"],
  upsell: ["one-time offer", "this offer", "just for you", "add to your order", "special price", "normally costs", "today only", "one click"],
  downsell: ["reduced price", "last chance", "final offer", "we understand"],
  "thank-you": ["order has been placed", "check your email", "will receive", "been processed", "thank you for your purchase", "access your"],
  booking: ["available slot", "time zone", "pick a date", "duration", "consultation call", "appointment type", "schedule your"],
  confirmation: ["order number", "confirmation number", "transaction id", "tracking number", "estimated delivery"],
  unknown: []
};
function classifyPage(url, title, bodyText, hasForm, buttonTexts, headlineTexts) {
  const scores = {
    "opt-in": 0,
    sales: 0,
    checkout: 0,
    upsell: 0,
    downsell: 0,
    "thank-you": 0,
    booking: 0,
    confirmation: 0,
    unknown: 0.1
  };
  const urlLower = url.toLowerCase();
  const titleLower = normalizeText(title || "");
  const allText = normalizeText(bodyText);
  const allButtons = buttonTexts.map(normalizeText).join(" ");
  const allHeadlines = headlineTexts.map(normalizeText).join(" ");
  for (const [hint, keywords] of Object.entries(URL_SIGNALS)) {
    if (hint === "unknown") continue;
    for (const kw of keywords) {
      if (urlLower.includes(kw)) {
        scores[hint] += 0.35;
        break;
      }
    }
  }
  for (const [hint, keywords] of Object.entries(BUTTON_SIGNALS)) {
    if (hint === "unknown") continue;
    if (containsAny(allButtons, keywords)) scores[hint] += 0.3;
  }
  for (const [hint, keywords] of Object.entries(HEADLINE_SIGNALS)) {
    if (hint === "unknown") continue;
    if (containsAny(allHeadlines, keywords)) scores[hint] += 0.3;
  }
  for (const [hint, keywords] of Object.entries(BODY_SIGNALS)) {
    if (hint === "unknown") continue;
    if (containsAny(allText, keywords)) scores[hint] += 0.15;
  }
  if (containsAny(titleLower, ["thank you", "thanks", "order confirmed"])) scores["thank-you"] += 0.2;
  if (containsAny(titleLower, ["checkout", "order", "payment"])) scores["checkout"] += 0.2;
  if (containsAny(titleLower, ["book", "schedule", "calendar"])) scores["booking"] += 0.2;
  if (hasForm) {
    scores["opt-in"] += 0.15;
    scores["checkout"] += 0.1;
    scores["booking"] += 0.1;
  }
  if (hasForm && containsAny(allText, ["credit card", "billing", "payment method"])) {
    scores["checkout"] += 0.25;
    scores["opt-in"] -= 0.15;
  }
  if (hasForm && containsAny(allText, ["email", "name"]) && !containsAny(allText, ["credit card", "payment"])) {
    scores["opt-in"] += 0.1;
  }
  if (containsAny(allButtons, ["no thanks", "skip", "decline"]) && containsAny(allHeadlines, ["wait", "hold on", "before you go"])) {
    scores["downsell"] += 0.2;
  }
  let bestHint = "unknown";
  let bestScore = 0;
  let secondBest = 0;
  for (const [hint, score2] of Object.entries(scores)) {
    if (score2 > bestScore) {
      secondBest = bestScore;
      bestScore = score2;
      bestHint = hint;
    } else if (score2 > secondBest) {
      secondBest = score2;
    }
  }
  const margin = bestScore - secondBest;
  const confidence = Math.min(bestScore * (margin > 0.15 ? 1.1 : 0.9), 1);
  return {
    hint: bestHint,
    confidence: Math.round(confidence * 100) / 100
  };
}

// clonelevel/src/core/crawl/relationship-detector.ts
var PRIMARY_CTA_TEXT = [
  "buy now",
  "get started",
  "get access",
  "sign up",
  "join",
  "enroll",
  "start",
  "order now",
  "yes",
  "add to cart",
  "i want this",
  "get it now",
  "claim",
  "grab",
  "unlock",
  "try free",
  "purchase",
  "register now",
  "subscribe now",
  "start free",
  "start trial",
  "begin now",
  "take action",
  "let's go",
  "go now",
  "proceed"
];
var CHECKOUT_CTA_TEXT = [
  "checkout",
  "complete order",
  "place order",
  "pay now",
  "submit payment",
  "complete purchase",
  "finalize order",
  "buy"
];
var BOOKING_CTA_TEXT = [
  "book now",
  "schedule",
  "reserve",
  "book a call",
  "book a demo",
  "pick a time",
  "book appointment",
  "schedule a call",
  "choose a slot",
  "confirm booking",
  "request consultation"
];
var UPSELL_CTA_TEXT = [
  "yes, add this",
  "upgrade",
  "add to order",
  "yes! give me",
  "add this now",
  "one click add",
  "yes upgrade",
  "i want this too",
  "include this",
  "add to my order",
  "yes, upgrade me"
];
var DOWNSELL_CTA_TEXT = [
  "no thanks",
  "skip",
  "decline",
  "no, i don't want",
  "maybe later",
  "continue without",
  "not interested",
  "pass",
  "skip this offer",
  "i'll pass"
];
var SECONDARY_TEXT = [
  "learn more",
  "read more",
  "view",
  "details",
  "see",
  "explore",
  "find out",
  "discover",
  "more info",
  "about",
  "features",
  "how it works",
  "faq"
];
var NAV_TEXT = [
  "home",
  "about",
  "contact",
  "blog",
  "resources",
  "support",
  "terms",
  "privacy",
  "legal",
  "sitemap",
  "help"
];
var CHECKOUT_URL_SIGNALS = ["checkout", "order", "payment", "billing", "cart", "purchase"];
var UPSELL_URL_SIGNALS = ["upsell", "oto", "upgrade", "one-time-offer", "bump", "special"];
var DOWNSELL_URL_SIGNALS = ["downsell", "downgrade", "last-chance"];
var THANKYOU_URL_SIGNALS = ["thank", "thanks", "thankyou", "success", "welcome"];
var BOOKING_URL_SIGNALS = ["book", "schedule", "calendar", "appointment", "consult", "demo"];
var CONFIRMATION_URL_SIGNALS = ["confirmation", "confirmed", "receipt", "verify"];
function detectRelationship(linkText, sourceElement, targetUrl, targetPageType, targetHasForm, targetButtonTexts) {
  const text = normalizeText(linkText);
  const url = targetUrl.toLowerCase();
  let best = { type: "unknown", confidence: 0.2 };
  function candidate(type, confidence) {
    if (confidence > best.confidence) {
      best = { type, confidence: Math.min(confidence, 1) };
    }
  }
  if (sourceElement === "a.cta" && containsAny(text, PRIMARY_CTA_TEXT)) {
    candidate("primary-cta", 0.9);
  } else if (containsAny(text, PRIMARY_CTA_TEXT)) {
    candidate("primary-cta", 0.75);
  }
  if (containsAny(text, CHECKOUT_CTA_TEXT) || containsAny(url, CHECKOUT_URL_SIGNALS)) {
    const base = containsAny(text, CHECKOUT_CTA_TEXT) ? 0.7 : 0.5;
    const boost = containsAny(url, CHECKOUT_URL_SIGNALS) ? 0.15 : 0;
    const typeBoost = targetPageType === "checkout" ? 0.15 : 0;
    candidate("checkout-next", base + boost + typeBoost);
  }
  if (containsAny(text, UPSELL_CTA_TEXT) || containsAny(url, UPSELL_URL_SIGNALS)) {
    const base = containsAny(text, UPSELL_CTA_TEXT) ? 0.7 : 0.5;
    const boost = containsAny(url, UPSELL_URL_SIGNALS) ? 0.15 : 0;
    const typeBoost = targetPageType === "upsell" ? 0.15 : 0;
    candidate("upsell-next", base + boost + typeBoost);
  }
  if (containsAny(text, DOWNSELL_CTA_TEXT) || containsAny(url, DOWNSELL_URL_SIGNALS)) {
    const base = containsAny(text, DOWNSELL_CTA_TEXT) ? 0.7 : 0.5;
    const boost = containsAny(url, DOWNSELL_URL_SIGNALS) ? 0.15 : 0;
    const typeBoost = targetPageType === "downsell" ? 0.15 : 0;
    candidate("downsell-next", base + boost + typeBoost);
  }
  if (containsAny(url, THANKYOU_URL_SIGNALS)) {
    const typeBoost = targetPageType === "thank-you" ? 0.15 : 0;
    candidate("thank-you-next", 0.6 + typeBoost);
  }
  if (containsAny(text, BOOKING_CTA_TEXT) || containsAny(url, BOOKING_URL_SIGNALS)) {
    const base = containsAny(text, BOOKING_CTA_TEXT) ? 0.7 : 0.5;
    const boost = containsAny(url, BOOKING_URL_SIGNALS) ? 0.15 : 0;
    const typeBoost = targetPageType === "booking" ? 0.15 : 0;
    candidate("booking-next", base + boost + typeBoost);
  }
  if (containsAny(url, CONFIRMATION_URL_SIGNALS)) {
    const typeBoost = targetPageType === "confirmation" ? 0.15 : 0;
    candidate("confirmation-next", 0.6 + typeBoost);
  }
  if (sourceElement === "form") {
    if (best.confidence < 0.6) {
      candidate("form-action", 0.65);
    }
  }
  if (containsAny(text, SECONDARY_TEXT)) {
    if (best.confidence < 0.4) {
      candidate("secondary-link", 0.45);
    }
  }
  if (containsAny(text, NAV_TEXT)) {
    if (best.confidence < 0.35) {
      candidate("navigation", 0.35);
    }
  }
  return best;
}

// clonelevel/src/core/crawl/platform-detector.ts
function scriptSrcs(html) {
  const srcs = [];
  const re = /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) srcs.push(m[1].toLowerCase());
  return srcs.join(" ");
}
function metaGenerator(html) {
  const m = html.match(/<meta\b[^>]*\bname\s*=\s*["']generator["'][^>]*\bcontent\s*=\s*["']([^"']+)["']/i) ?? html.match(/<meta\b[^>]*\bcontent\s*=\s*["']([^"']+)["'][^>]*\bname\s*=\s*["']generator["']/i);
  return m ? m[1].toLowerCase() : "";
}
function bodyClasses(html) {
  const m = html.match(/<body\b[^>]*\bclass\s*=\s*["']([^"']+)["']/i);
  return m ? m[1].toLowerCase() : "";
}
function hostname(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}
function score(signals) {
  const total = signals.reduce((s, x) => s + x.weight, 0);
  const hits = signals.reduce((s, x) => s + (x.hit ? x.weight : 0), 0);
  return total === 0 ? 0 : Math.round(hits / total * 100);
}
function detectHighLevel(html, url) {
  const srcs = scriptSrcs(html);
  const host = hostname(url);
  const lower = html.slice(0, 6e4).toLowerCase();
  return score([
    { weight: 25, hit: /cdn\.leadconnectorhq\.com|widgets\.leadconnectorhq\.com|js\.leadconnectorhq\.com|msgsndr\.com/.test(srcs) },
    { weight: 20, hit: /leadconnectorhq\.com|gohighlevel\.com/.test(host) },
    { weight: 20, hit: lower.includes("data-gjs-") || lower.includes('"locationid"') || lower.includes("window.attribution") || lower.includes("hl_page") },
    { weight: 15, hit: lower.includes("leadconnector") || lower.includes("gohighlevel") },
    { weight: 10, hit: /\.hl\-/.test(host) || lower.includes("lc-calendar") || lower.includes("lc-booking") },
    { weight: 10, hit: lower.includes("funnelid") || lower.includes("funnel-step") || lower.includes("page-builder.leadconnector") }
  ]);
}
function detectClickFunnels1(html, url) {
  const srcs = scriptSrcs(html);
  const host = hostname(url);
  const gen = metaGenerator(html);
  const lower = html.slice(0, 6e4).toLowerCase();
  const bodyCls = bodyClasses(html);
  return score([
    { weight: 30, hit: gen.includes("clickfunnels") },
    { weight: 25, hit: /scripts\.clickfunnels\.com|cf\.clickfunnels\.com/.test(srcs) },
    { weight: 15, hit: bodyCls.includes("cfpage") || lower.includes('class="cfpage') || lower.includes('id="cfpage') },
    { weight: 15, hit: lower.includes("elixir-cf-") || lower.includes("cf-page-container") },
    { weight: 10, hit: /clickfunnels\.com/.test(host) || lower.includes("clickfunnels") },
    { weight: 5, hit: lower.includes("cf_page") || lower.includes("cf-step") }
  ]);
}
function detectClickFunnels2(html, url) {
  const srcs = scriptSrcs(html);
  const host = hostname(url);
  const lower = html.slice(0, 6e4).toLowerCase();
  return score([
    { weight: 35, hit: /myclickfunnels\.com/.test(host) },
    { weight: 25, hit: /myclickfunnels\.com|assets\.cfunnel\.com/.test(srcs) },
    { weight: 20, hit: lower.includes("data-cf2-") || lower.includes("__cf2") || lower.includes("cf2-page") },
    { weight: 10, hit: lower.includes("myclickfunnels") },
    { weight: 10, hit: lower.includes("clickfunnels 2") || lower.includes("cfunnel") }
  ]);
}
function detectWebflow(html, url) {
  const srcs = scriptSrcs(html);
  const host = hostname(url);
  const gen = metaGenerator(html);
  const lower = html.slice(0, 6e4).toLowerCase();
  return score([
    { weight: 30, hit: gen.includes("webflow") },
    { weight: 25, hit: /webflow\.js|js\.webflow\.com|d3e54v103j859\.cloudfront\.net/.test(srcs) },
    { weight: 20, hit: lower.includes("data-wf-page=") || lower.includes("data-wf-site=") },
    { weight: 15, hit: /webflow\.io/.test(host) },
    { weight: 10, hit: lower.includes("w-webflow-badge") || lower.includes("webflow-badge") }
  ]);
}
function detectKajabi(html, url) {
  const srcs = scriptSrcs(html);
  const host = hostname(url);
  const gen = metaGenerator(html);
  const lower = html.slice(0, 6e4).toLowerCase();
  return score([
    { weight: 30, hit: gen.includes("kajabi") },
    { weight: 25, hit: /kajabi-cdn\.com|cdn\.kajabi\.com|app\.kajabi\.com/.test(srcs) },
    { weight: 20, hit: /mykajabi\.com/.test(host) },
    { weight: 15, hit: lower.includes("__kajabi_app__") || lower.includes("kajabi-") },
    { weight: 10, hit: lower.includes("kajabi") }
  ]);
}
function detectKartra(html, url) {
  const srcs = scriptSrcs(html);
  const host = hostname(url);
  const lower = html.slice(0, 6e4).toLowerCase();
  return score([
    { weight: 35, hit: /app\.kartra\.com|kartra\.com\/component\//.test(srcs) || /kartra\.com/.test(host) },
    { weight: 25, hit: lower.includes("kartra_page") || lower.includes("data-kartra") || lower.includes("kartrapage") },
    { weight: 25, hit: lower.includes("kartra_") || lower.includes(".kartra_") },
    { weight: 15, hit: lower.includes("kartra") }
  ]);
}
function detectSystemeIo(html, url) {
  const srcs = scriptSrcs(html);
  const host = hostname(url);
  const gen = metaGenerator(html);
  const lower = html.slice(0, 6e4).toLowerCase();
  return score([
    { weight: 30, hit: gen.includes("systeme") },
    { weight: 25, hit: /cdn\.systeme\.io|assets\.systeme\.io|systeme\.io/.test(srcs) },
    { weight: 25, hit: /systeme\.io/.test(host) },
    { weight: 20, hit: lower.includes("systemeio") || lower.includes("systeme_") || lower.includes("data-systeme") }
  ]);
}
function detectLeadpages(html, url) {
  const srcs = scriptSrcs(html);
  const host = hostname(url);
  const gen = metaGenerator(html);
  const lower = html.slice(0, 6e4).toLowerCase();
  return score([
    { weight: 30, hit: gen.includes("leadpages") },
    { weight: 25, hit: /lpcdn\.lpages\.co|lp\.lpages\.co|cdn\.leadpages\.net|assets\.leadpages\.net/.test(srcs) },
    { weight: 20, hit: /lpages\.co|leadpages\.net/.test(host) },
    { weight: 15, hit: lower.includes("data-lp-") || lower.includes("lp_page_") || lower.includes("lp-elements") },
    { weight: 10, hit: lower.includes("leadpages") }
  ]);
}
function detectWordPress(html) {
  const srcs = scriptSrcs(html);
  const gen = metaGenerator(html);
  const lower = html.slice(0, 6e4).toLowerCase();
  const wpScore = score([
    { weight: 30, hit: gen.includes("wordpress") },
    { weight: 25, hit: /\/wp-content\/|\/wp-includes\//.test(srcs) },
    { weight: 20, hit: lower.includes("wp-content") || lower.includes("wp-includes") },
    { weight: 15, hit: bodyClasses(html).includes("wp-") || lower.includes('class="wp-') },
    { weight: 10, hit: lower.includes("wordpress") }
  ]);
  const isElementor = lower.includes("data-elementor-type") || lower.includes("elementor-section") || lower.includes('class="elementor-');
  const isDivi = lower.includes("et_pb_") || lower.includes("data-et-multi-view") || lower.includes('class="et_pb_');
  const isBeaverBuilder = lower.includes("fl-builder") || lower.includes("data-fl-");
  const isGutenberg = lower.includes("wp-block-") || lower.includes("is-layout-flow");
  let sub = "";
  if (isElementor) sub = " / Elementor";
  else if (isDivi) sub = " / Divi";
  else if (isBeaverBuilder) sub = " / Beaver Builder";
  else if (isGutenberg) sub = " / Gutenberg";
  return { score: wpScore, subPlatform: sub };
}
function detectSquarespace(html, url) {
  const host = hostname(url);
  const gen = metaGenerator(html);
  const lower = html.slice(0, 6e4).toLowerCase();
  return score([
    { weight: 30, hit: gen.includes("squarespace") },
    { weight: 25, hit: /squarespace\.com/.test(host) },
    { weight: 25, hit: lower.includes("static.squarespace_context") || lower.includes("squarespace-cdn") },
    { weight: 20, hit: lower.includes("data-squarespace-") || lower.includes("squarespace.com") }
  ]);
}
function detectWix(html, url) {
  const host = hostname(url);
  const lower = html.slice(0, 6e4).toLowerCase();
  return score([
    { weight: 30, hit: /wixsite\.com|wix\.com/.test(host) },
    { weight: 25, hit: lower.includes("_wix_") || lower.includes("wix-code-") },
    { weight: 25, hit: lower.includes("parastorage.com") || lower.includes("wixstatic.com") || lower.includes("static.wixstatic") },
    { weight: 20, hit: lower.includes("wix.com") }
  ]);
}
function detectHubSpot(html, url) {
  const srcs = scriptSrcs(html);
  const host = hostname(url);
  const lower = html.slice(0, 6e4).toLowerCase();
  return score([
    { weight: 35, hit: /js\.hs-scripts\.com|hs-analytics\.net|hubspot\.com/.test(srcs) && (lower.includes("data-hs-") || lower.includes("hbspt")) },
    { weight: 25, hit: lower.includes("data-hs-forms") || lower.includes("hbspt.forms.create") },
    { weight: 20, hit: lower.includes("hubspot") && lower.includes("hsblog") },
    { weight: 20, hit: /hs-sites\.com|hubspotpagebuilder\.com/.test(host) }
  ]);
}
function detectPlatform(html, url) {
  const host = hostname(url);
  if (/myclickfunnels\.com/.test(host)) {
    return { platform: "clickfunnels2", confidence: 95, label: "ClickFunnels 2" };
  }
  if (/leadconnectorhq\.com|gohighlevel\.com/.test(host)) {
    return { platform: "highlevel", confidence: 95, label: "HighLevel" };
  }
  if (/mykajabi\.com/.test(host)) {
    return { platform: "kajabi", confidence: 95, label: "Kajabi" };
  }
  if (/webflow\.io/.test(host)) {
    return { platform: "webflow", confidence: 95, label: "Webflow" };
  }
  if (/lpages\.co|leadpages\.net/.test(host)) {
    return { platform: "leadpages", confidence: 95, label: "Leadpages" };
  }
  if (/systeme\.io/.test(host)) {
    return { platform: "systemeio", confidence: 95, label: "Systeme.io" };
  }
  if (/kartra\.com/.test(host)) {
    return { platform: "kartra", confidence: 90, label: "Kartra" };
  }
  if (/wixsite\.com/.test(host)) {
    return { platform: "wix", confidence: 90, label: "Wix" };
  }
  if (/squarespace\.com/.test(host)) {
    return { platform: "squarespace", confidence: 90, label: "Squarespace" };
  }
  const hlScore = detectHighLevel(html, url);
  const cf1Score = detectClickFunnels1(html, url);
  const cf2Score = detectClickFunnels2(html, url);
  const wfScore = detectWebflow(html, url);
  const kjScore = detectKajabi(html, url);
  const krScore = detectKartra(html, url);
  const siScore = detectSystemeIo(html, url);
  const lpScore = detectLeadpages(html, url);
  const ssScore = detectSquarespace(html, url);
  const wxScore = detectWix(html, url);
  const hsScore = detectHubSpot(html, url);
  const { score: wpScore, subPlatform } = detectWordPress(html);
  const candidates = [
    { platform: "highlevel", label: "HighLevel", confidence: hlScore },
    { platform: "clickfunnels1", label: "ClickFunnels 1", confidence: cf1Score },
    { platform: "clickfunnels2", label: "ClickFunnels 2", confidence: cf2Score },
    { platform: "webflow", label: "Webflow", confidence: wfScore },
    { platform: "kajabi", label: "Kajabi", confidence: kjScore },
    { platform: "kartra", label: "Kartra", confidence: krScore },
    { platform: "systemeio", label: "Systeme.io", confidence: siScore },
    { platform: "leadpages", label: "Leadpages", confidence: lpScore },
    { platform: "wordpress", label: `WordPress${subPlatform}`, confidence: wpScore },
    { platform: "squarespace", label: "Squarespace", confidence: ssScore },
    { platform: "wix", label: "Wix", confidence: wxScore },
    { platform: "hubspot", label: "HubSpot", confidence: hsScore }
  ];
  candidates.sort((a, b) => b.confidence - a.confidence);
  const winner = candidates[0];
  if (winner.confidence === 0) {
    return { platform: "unknown", confidence: 0, label: "Web" };
  }
  const label = winner.confidence < 45 ? `${winner.label}?` : winner.label;
  return { platform: winner.platform, confidence: winner.confidence, label };
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

// clonelevel/src/core/crawl/thumbnail-plan.ts
var TYPE_COLORS = {
  "opt-in": { bg: "#1e3a5f", fg: "#e8f4fd", accent: "#4a9eff" },
  sales: { bg: "#2d1b4e", fg: "#f0e6ff", accent: "#a855f7" },
  checkout: { bg: "#1a3d2e", fg: "#e6f9f0", accent: "#34d399" },
  upsell: { bg: "#4a2c17", fg: "#fff3e6", accent: "#f59e0b" },
  downsell: { bg: "#3d1f1f", fg: "#ffe6e6", accent: "#ef4444" },
  "thank-you": { bg: "#1a3d2e", fg: "#e6f9f0", accent: "#22c55e" },
  booking: { bg: "#1e3a5f", fg: "#e8f4fd", accent: "#3b82f6" },
  confirmation: { bg: "#2d3748", fg: "#edf2f7", accent: "#63b3ed" },
  unknown: { bg: "#374151", fg: "#f3f4f6", accent: "#9ca3af" }
};
var TYPE_ICONS = {
  "opt-in": "M12 2L2 7v10l10 5 10-5V7L12 2z",
  sales: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z",
  checkout: "M3 3h18v2H3V3zm0 8h18v2H3v-2zm0 8h18v2H3v-2z",
  upsell: "M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7l2-7z",
  downsell: "M12 22l-2-7H3l5.5-4-2-7L12 8l5.5-4-2 7L21 15h-7l-2 7z",
  "thank-you": "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
  booking: "M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z",
  confirmation: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
  unknown: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
};
var TYPE_LABELS = {
  "opt-in": "Opt-In",
  sales: "Sales",
  checkout: "Checkout",
  upsell: "Upsell",
  downsell: "Downsell",
  "thank-you": "Thank You",
  booking: "Booking",
  confirmation: "Confirmation",
  unknown: "Page"
};
function generatePlaceholderThumbnail(page, width = 320, height = 200) {
  const pageType = page.pageTypeHint || "unknown";
  const colors = TYPE_COLORS[pageType];
  const icon = TYPE_ICONS[pageType];
  const label = TYPE_LABELS[pageType];
  const title = page.title || page.url.replace(/^https?:\/\//, "").split("/").pop() || "Untitled";
  const truncTitle = title.length > 30 ? title.slice(0, 27) + "..." : title;
  const escapedTitle = escapeXml(truncTitle);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${darken(colors.bg, 20)};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)" rx="8"/>
  <rect x="0" y="0" width="${width}" height="4" fill="${colors.accent}" rx="2"/>
  <g transform="translate(${width / 2 - 12}, ${height / 2 - 40})">
    <path d="${icon}" fill="${colors.accent}" opacity="0.8"/>
  </g>
  <text x="${width / 2}" y="${height / 2 + 10}" fill="${colors.fg}" font-family="system-ui,sans-serif" font-size="14" font-weight="600" text-anchor="middle" opacity="0.9">${label}</text>
  <text x="${width / 2}" y="${height / 2 + 32}" fill="${colors.fg}" font-family="system-ui,sans-serif" font-size="10" text-anchor="middle" opacity="0.6">${escapedTitle}</text>
  <rect x="12" y="${height - 28}" width="${width - 24}" height="16" fill="${colors.accent}" opacity="0.15" rx="3"/>
  <text x="${width / 2}" y="${height - 16}" fill="${colors.accent}" font-family="system-ui,sans-serif" font-size="8" text-anchor="middle" opacity="0.7">depth: ${page.depth}</text>
</svg>`;
  const dataUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
  return {
    pageId: page.id,
    dataUrl,
    method: "placeholder",
    width,
    height
  };
}
function generateAllPlaceholders(pages) {
  const results = /* @__PURE__ */ new Map();
  for (const page of pages) {
    results.set(page.id, generatePlaceholderThumbnail(page));
  }
  return results;
}
function darken(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16 & 255) - Math.round(255 * (percent / 100)));
  const g = Math.max(0, (num >> 8 & 255) - Math.round(255 * (percent / 100)));
  const b = Math.max(0, (num & 255) - Math.round(255 * (percent / 100)));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}
function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// clonelevel/src/core/crawl/sitemap-builder.ts
function buildSitemap(rootUrl, pages, edges, diagnostics, settings) {
  const thumbnails = generateAllPlaceholders(pages);
  const pagesWithThumbnails = pages.map((page) => {
    const thumb = thumbnails.get(page.id);
    if (thumb) {
      return { ...page, thumbnailDataUrl: thumb.dataUrl };
    }
    return page;
  });
  return {
    rootUrl,
    discoveredPages: pagesWithThumbnails,
    edges,
    diagnostics,
    crawledAt: (/* @__PURE__ */ new Date()).toISOString(),
    settings
  };
}

// clonelevel/src/core/ids.ts
function generateId(prefix = "cl") {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}
function generatePageId() {
  return generateId("page");
}

// clonelevel/src/core/url.ts
function getBaseDomain(hostname2) {
  const parts = hostname2.toLowerCase().split(".");
  if (parts.length <= 2) return hostname2.toLowerCase();
  return parts.slice(-2).join(".");
}
function isInternalLink(link, baseUrl, allowedDomains = []) {
  try {
    const linkUrl = new URL(link, baseUrl);
    const baseHostname = new URL(baseUrl).hostname.toLowerCase();
    const linkHostname = linkUrl.hostname.toLowerCase();
    if (linkHostname === baseHostname) return true;
    if (getBaseDomain(linkHostname) === getBaseDomain(baseHostname)) return true;
    for (const allowed of allowedDomains) {
      const pattern = allowed.toLowerCase();
      if (pattern.startsWith("*.")) {
        const suffix = pattern.slice(2);
        if (linkHostname === suffix || linkHostname.endsWith("." + suffix)) {
          return true;
        }
      } else if (linkHostname === pattern) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
function resolveUrl(link, baseUrl) {
  try {
    return new URL(link, baseUrl).toString();
  } catch {
    return link;
  }
}
var NON_PAGE_EXTENSIONS = /* @__PURE__ */ new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "webp",
  "ico",
  "avif",
  "bmp",
  "tiff",
  "mp4",
  "webm",
  "mov",
  "avi",
  "mkv",
  "flv",
  "wmv",
  "mp3",
  "wav",
  "m4a",
  "ogg",
  "flac",
  "aac",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "csv",
  "ppt",
  "pptx",
  "zip",
  "tar",
  "gz",
  "rar",
  "7z",
  "bz2",
  "css",
  "js",
  "json",
  "xml",
  "rss",
  "atom",
  "woff",
  "woff2",
  "ttf",
  "eot",
  "otf",
  "map",
  "min.js",
  "min.css"
]);
function isNavigableUrl(url) {
  try {
    const parsed = new URL(url);
    const protocol = parsed.protocol.toLowerCase();
    if (protocol !== "http:" && protocol !== "https:") return false;
    const pathname = parsed.pathname.toLowerCase();
    const lastSegment = pathname.split("/").pop() || "";
    const ext = lastSegment.includes(".") ? lastSegment.split(".").pop() || "" : "";
    if (ext && NON_PAGE_EXTENSIONS.has(ext)) return false;
    if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.startsWith("/wp-json/")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
function matchesPattern(url, patterns) {
  if (patterns.length === 0) return true;
  try {
    const parsed = new URL(url);
    const fullPath = parsed.pathname + parsed.search;
    return patterns.some((pattern) => {
      const regex = new RegExp(pattern.replace(/\*/g, ".*"));
      return regex.test(fullPath) || regex.test(parsed.pathname);
    });
  } catch {
    return false;
  }
}

// clonelevel/src/core/crawl/crawler.ts
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
var BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache"
};
async function fetchPage(url) {
  const res = await fetch(url, {
    credentials: "omit",
    redirect: "follow",
    headers: BROWSER_HEADERS
  });
  const html = await res.text();
  const isBlocked = isBlockedPage(html, res.status, res.url);
  return { html, finalUrl: res.url || url, status: res.status, isBlocked };
}
function isBlockedPage(html, status, url) {
  if (status === 403 || status === 429) return true;
  const lower = html.slice(0, 4e3).toLowerCase();
  if (lower.includes("email protection") && lower.includes("cloudflare")) return true;
  if (lower.includes("just a moment") && lower.includes("cloudflare")) return true;
  if (lower.includes("checking your browser") && lower.includes("cloudflare")) return true;
  if (lower.includes("enable javascript") && lower.includes("captcha")) return true;
  return false;
}
function extractTagContent(html, tag) {
  const results = [];
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, "").trim();
    if (text) results.push(text);
  }
  return results;
}
function extractAttributeValues(html, tag, attr) {
  const results = [];
  const regex = new RegExp(`<${tag}\\b[^>]*?\\b${attr}\\s*=\\s*["']([^"']+)["']`, "gi");
  let match;
  while ((match = regex.exec(html)) !== null) {
    results.push(match[1]);
  }
  return results;
}
var CTA_CLASSES_RE = /\b(btn|button|cta|primary|action|submit|hero-btn|main-btn)\b/i;
var CTA_TEXT_RE = /\b(buy|get|start|sign up|join|enroll|order|register|subscribe|download|book|schedule|reserve|claim|try|grab|unlock|access|add to cart|checkout)\b/i;
function extractAnchors(html) {
  const links = [];
  const regex = /<a\b([^>]*?)\bhref\s*=\s*["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const preAttrs = match[1];
    const href = match[2];
    const postAttrs = match[3];
    const innerHtml = match[4];
    if (href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:") || href === "#") continue;
    const text = innerHtml.replace(/<[^>]*>/g, "").trim();
    const allAttrs = preAttrs + " " + postAttrs;
    const classMatch = allAttrs.match(/class\s*=\s*["']([^"']+)["']/i);
    const classes = classMatch ? classMatch[1] : "";
    const isButton = CTA_CLASSES_RE.test(classes);
    const isPrimaryCta = isButton && CTA_TEXT_RE.test(text);
    links.push({ url: href, text, element: "a", isButton, isPrimaryCta });
  }
  return links;
}
function extractFormActions(html) {
  const links = [];
  const regex = /<form\b[^>]*?\baction\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const action = match[1];
    if (!action.startsWith("javascript:")) {
      links.push({ url: action, text: "", element: "form", isButton: false, isPrimaryCta: false });
    }
  }
  return links;
}
var DATA_URL_ATTRS = [
  "data-href",
  "data-url",
  "data-next",
  "data-action",
  "data-redirect",
  "data-link",
  "data-goto",
  "data-navigate",
  "data-target-url",
  "data-src",
  "data-destination",
  "data-page-url",
  "data-next-url",
  "data-step-url"
];
function extractDataAttributeUrls(html) {
  const links = [];
  for (const attr of DATA_URL_ATTRS) {
    const regex = new RegExp(`\\b${attr}\\s*=\\s*["']([^"']+)["']`, "gi");
    let match;
    while ((match = regex.exec(html)) !== null) {
      const val = match[1];
      if (val && (val.startsWith("http") || val.startsWith("/"))) {
        links.push({ url: val, text: "", element: attr, isButton: false, isPrimaryCta: false });
      }
    }
  }
  return links;
}
function extractScriptUrls(html, domain) {
  const links = [];
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  const escapedDomain = domain.replace(/\./g, "\\.");
  const urlPattern = new RegExp(
    `["'\`](https?://${escapedDomain}/[^"'\`\\s<>?#]{1,200})["'\`]|["'\`](/[a-z0-9_/-][^"'\`\\s<>?#]{0,100})["'\`]`,
    "gi"
  );
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    const scriptContent = scriptMatch[1];
    if (!scriptContent || scriptContent.length < 5) continue;
    if (scriptContent.includes("google-analytics") || scriptContent.includes("fbq(")) continue;
    let urlMatch;
    urlPattern.lastIndex = 0;
    while ((urlMatch = urlPattern.exec(scriptContent)) !== null) {
      const url = urlMatch[1] || urlMatch[2];
      if (!url) continue;
      if (/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico|webp|mp4|pdf)(\?|$)/i.test(url)) continue;
      if (/\/(api|cdn|static|assets|_next|__webpack|wp-content|wp-admin|wp-json)/i.test(url)) continue;
      links.push({ url, text: "", element: "script", isButton: false, isPrimaryCta: false });
    }
  }
  return links;
}
function extractMetaRefresh(html) {
  const match = html.match(/<meta\b[^>]*http-equiv\s*=\s*["']refresh["'][^>]*content\s*=\s*["'][^"']*url\s*=\s*([^"'>\s]+)/i) ?? html.match(/<meta\b[^>]*content\s*=\s*["'][^"']*url\s*=\s*([^"'>\s]+)[^"']*["'][^>]*http-equiv\s*=\s*["']refresh["']/i);
  return match ? match[1].trim() : null;
}
async function fetchSitemapUrls(rootUrl) {
  const urls = [];
  const origin = (() => {
    try {
      return new URL(rootUrl).origin;
    } catch {
      return "";
    }
  })();
  if (!origin) return urls;
  const sitemapCandidates = [
    `${origin}/sitemap.xml`,
    `${origin}/sitemap_index.xml`,
    `${origin}/sitemap/`,
    `${origin}/page-sitemap.xml`
  ];
  for (const sitemapUrl of sitemapCandidates) {
    try {
      const res = await fetch(sitemapUrl, { credentials: "omit", headers: BROWSER_HEADERS });
      if (!res.ok) continue;
      const text = await res.text();
      if (!text.includes("<loc>")) continue;
      const locRegex = /<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/gi;
      let m;
      while ((m = locRegex.exec(text)) !== null) {
        const u = m[1].trim();
        if (u && new URL(u).hostname === new URL(rootUrl).hostname) {
          urls.push(u);
        }
      }
      if (urls.length > 0) {
        logger.info("crawler", `Sitemap ${sitemapUrl}: found ${urls.length} URLs`);
        break;
      }
    } catch {
    }
  }
  return urls;
}
var COMMON_FUNNEL_PATHS = [
  "/opt-in",
  "/optin",
  "/signup",
  "/sign-up",
  "/register",
  "/subscribe",
  "/free",
  "/sales",
  "/offer",
  "/vsl",
  "/watch",
  "/video",
  "/checkout",
  "/order",
  "/cart",
  "/payment",
  "/buy",
  "/upsell",
  "/upsell-1",
  "/upsell-2",
  "/oto",
  "/oto1",
  "/oto2",
  "/upgrade",
  "/downsell",
  "/downsell-1",
  "/downgrade",
  "/last-chance",
  "/thank-you",
  "/thankyou",
  "/thanks",
  "/success",
  "/confirmation",
  "/confirmed",
  "/webinar",
  "/workshop",
  "/masterclass",
  "/training",
  "/booking",
  "/schedule",
  "/calendar",
  "/appointment",
  "/consult",
  "/bridge",
  "/step-1",
  "/step-2",
  "/step-3",
  "/step1",
  "/step2",
  "/start",
  "/begin",
  "/launch",
  "/access",
  "/members",
  "/welcome"
];
async function probeFunnelPaths(origin, visited) {
  const found = [];
  const probePromises = COMMON_FUNNEL_PATHS.map(async (path) => {
    const url = origin + path;
    const normalized = normalizeCrawlUrl(url, false);
    if (visited.has(normalized)) return;
    try {
      const res = await fetch(url, {
        method: "HEAD",
        credentials: "omit",
        redirect: "follow",
        headers: BROWSER_HEADERS
      });
      if (res.ok && res.url) {
        const finalUrl = normalizeCrawlUrl(res.url, false);
        if (!visited.has(finalUrl) && new URL(finalUrl).hostname === new URL(origin).hostname) {
          found.push(finalUrl);
        }
      }
    } catch {
    }
  });
  await Promise.all(probePromises);
  return found;
}
function filenameFromUrl(url) {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").pop() || url);
  } catch {
    return url;
  }
}
function extractMediaItems(html, pageUrl) {
  const items = [];
  const seen = /* @__PURE__ */ new Set();
  const add = (item) => {
    if (!seen.has(item.url)) {
      seen.add(item.url);
      items.push(item);
    }
  };
  const aRegex = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = aRegex.exec(html)) !== null) {
    const href = m[1];
    if (/\.pdf(\?[^"']*)?$/i.test(href)) {
      add({ type: "pdf", url: href, platform: "direct", filename: filenameFromUrl(href), pageUrl });
    }
  }
  const pdfInline = /["'\s](https?:\/\/[^"'\s<>]+\.pdf(?:\?[^"'\s<>]*)?)/gi;
  let pm;
  while ((pm = pdfInline.exec(html)) !== null) {
    add({ type: "pdf", url: pm[1], platform: "direct", filename: filenameFromUrl(pm[1]), pageUrl });
  }
  const audioExtRe = /\.(mp3|m4a|aac|ogg|wav|flac)(\?[^"'\s<>]*)?$/i;
  const audioHrefRe = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
  audioHrefRe.lastIndex = 0;
  while ((m = audioHrefRe.exec(html)) !== null) {
    if (audioExtRe.test(m[1])) add({ type: "mp3", url: m[1], platform: "direct", filename: filenameFromUrl(m[1]), pageUrl });
  }
  const audioSrcRe = /<(?:audio|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  while ((m = audioSrcRe.exec(html)) !== null) {
    if (audioExtRe.test(m[1])) add({ type: "mp3", url: m[1], platform: "direct", filename: filenameFromUrl(m[1]), pageUrl });
  }
  const audioInline = /["'\s](https?:\/\/[^"'\s<>]+\.mp3(?:\?[^"'\s<>]*)?)/gi;
  while ((m = audioInline.exec(html)) !== null) {
    add({ type: "mp3", url: m[1], platform: "direct", filename: filenameFromUrl(m[1]), pageUrl });
  }
  const videoExtRe = /\.(mp4|mov|m4v|webm|avi|mkv)(\?[^"'\s<>]*)?$/i;
  const videoHrefRe = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
  videoHrefRe.lastIndex = 0;
  while ((m = videoHrefRe.exec(html)) !== null) {
    if (videoExtRe.test(m[1])) add({ type: "mp4", url: m[1], platform: "direct", filename: filenameFromUrl(m[1]), pageUrl });
  }
  const videoSrcRe = /<(?:video|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  while ((m = videoSrcRe.exec(html)) !== null) {
    if (videoExtRe.test(m[1])) add({ type: "mp4", url: m[1], platform: "direct", filename: filenameFromUrl(m[1]), pageUrl });
  }
  const mp4Inline = /["'\s](https?:\/\/[^"'\s<>]+\.mp4(?:\?[^"'\s<>]*)?)/gi;
  while ((m = mp4Inline.exec(html)) !== null) {
    add({ type: "mp4", url: m[1], platform: "direct", filename: filenameFromUrl(m[1]), pageUrl });
  }
  const ytIframeRe = /<iframe\b[^>]*\bsrc\s*=\s*["']([^"']*(?:youtube\.com|youtube-nocookie\.com|youtu\.be)[^"']*)["']/gi;
  while ((m = ytIframeRe.exec(html)) !== null) {
    const ytUrl = m[1];
    const embedId = ytUrl.match(/(?:embed\/|v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1];
    add({ type: "video-embed", url: ytUrl, platform: "youtube", embedId, pageUrl });
  }
  const ytWatchRe = /["'](https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})[^"'\s<>]*)["']/gi;
  while ((m = ytWatchRe.exec(html)) !== null) {
    add({ type: "video-embed", url: m[1], platform: "youtube", embedId: m[2], pageUrl });
  }
  const ytDataIdRe = /data-(?:video-?id|videoid|youtube-?id)\s*=\s*["']([A-Za-z0-9_-]{11})["']/gi;
  while ((m = ytDataIdRe.exec(html)) !== null) {
    add({ type: "video-embed", url: `https://www.youtube.com/watch?v=${m[1]}`, platform: "youtube", embedId: m[1], pageUrl });
  }
  const vimeoIframeRe = /<iframe\b[^>]*\bsrc\s*=\s*["']([^"']*(?:player\.vimeo\.com|vimeo\.com)[^"']*)["']/gi;
  while ((m = vimeoIframeRe.exec(html)) !== null) {
    const vmUrl = m[1];
    const embedId = vmUrl.match(/\/video\/(\d+)/)?.[1];
    add({ type: "video-embed", url: vmUrl, platform: "vimeo", embedId, pageUrl });
  }
  const vimeoWatchRe = /["'](https?:\/\/(?:www\.)?vimeo\.com\/(\d+)[^"'\s<>]*)["']/gi;
  while ((m = vimeoWatchRe.exec(html)) !== null) {
    add({ type: "video-embed", url: m[1], platform: "vimeo", embedId: m[2], pageUrl });
  }
  const wistiaIframeRe = /<(?:iframe|script)\b[^>]*\bsrc\s*=\s*["']([^"']*(?:wistia\.com|wistia\.net|fast\.wistia)[^"']*)["']/gi;
  while ((m = wistiaIframeRe.exec(html)) !== null) {
    const wsUrl = m[1];
    const embedId = wsUrl.match(/(?:medias|embed)\/([A-Za-z0-9]+)/)?.[1];
    add({ type: "video-embed", url: wsUrl, platform: "wistia", embedId, pageUrl });
  }
  const wistiaHashRe = /(?:hashed_?id|wistia_?id)\s*[=:]\s*["']([A-Za-z0-9]{5,30})["']/gi;
  while ((m = wistiaHashRe.exec(html)) !== null) {
    const embedId = m[1];
    add({ type: "video-embed", url: `https://fast.wistia.net/embed/iframe/${embedId}`, platform: "wistia", embedId, pageUrl });
  }
  const wqRe = /\b_wq\s*\.push[\s\S]{0,60}id\s*:\s*["']([A-Za-z0-9]{5,30})["']/gi;
  while ((m = wqRe.exec(html)) !== null) {
    const embedId = m[1];
    add({ type: "video-embed", url: `https://fast.wistia.net/embed/iframe/${embedId}`, platform: "wistia", embedId, pageUrl });
  }
  const loomIframeRe = /<iframe\b[^>]*\bsrc\s*=\s*["']([^"']*loom\.com\/embed\/([A-Za-z0-9]+)[^"']*)["']/gi;
  while ((m = loomIframeRe.exec(html)) !== null) {
    add({ type: "video-embed", url: m[1], platform: "loom", embedId: m[2], pageUrl });
  }
  const loomShareRe = /["'](https?:\/\/(?:www\.)?loom\.com\/share\/([A-Za-z0-9]+)[^"'\s<>]*)["']/gi;
  while ((m = loomShareRe.exec(html)) !== null) {
    add({ type: "video-embed", url: m[1], platform: "loom", embedId: m[2], pageUrl });
  }
  const videolyticsRe = /<(?:iframe|script)\b[^>]*\bsrc\s*=\s*["']([^"']*videolytics[^"']*)["']/gi;
  while ((m = videolyticsRe.exec(html)) !== null) {
    const vlUrl = m[1];
    const embedId = vlUrl.match(/\/(?:embed|v|video)\/([A-Za-z0-9_-]+)/)?.[1];
    add({ type: "video-embed", url: vlUrl, platform: "videolytics", embedId, pageUrl });
  }
  const vlInlineRe = /["'](https?:\/\/[^"'\s<>]*videolytics[^"'\s<>]*)["']/gi;
  while ((m = vlInlineRe.exec(html)) !== null) {
    add({ type: "video-embed", url: m[1], platform: "videolytics", pageUrl });
  }
  return items;
}
function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}
function stripHtmlTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function parseHtml(html, domain, pageUrl) {
  const title = extractTitle(html);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;
  const bodyText = stripHtmlTags(bodyHtml).slice(0, 2e4);
  const hasForm = /<form\b/i.test(html);
  const buttonTexts = [];
  const btnRegex = /<(?:button|input\b[^>]*type\s*=\s*["']submit["'])[^>]*>([\s\S]*?)<\/(?:button)>/gi;
  let btnMatch;
  while ((btnMatch = btnRegex.exec(html)) !== null) {
    const text = btnMatch[1].replace(/<[^>]*>/g, "").trim();
    if (text) buttonTexts.push(text);
  }
  const submitInputRegex = /<input\b[^>]*type\s*=\s*["']submit["'][^>]*value\s*=\s*["']([^"']+)["']/gi;
  let subMatch;
  while ((subMatch = submitInputRegex.exec(html)) !== null) {
    if (subMatch[1]) buttonTexts.push(subMatch[1]);
  }
  const btnLinkRegex = /<a\b[^>]*class\s*=\s*["'][^"']*(?:btn|button|cta)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  let btnLinkMatch;
  while ((btnLinkMatch = btnLinkRegex.exec(html)) !== null) {
    const text = btnLinkMatch[1].replace(/<[^>]*>/g, "").trim();
    if (text) buttonTexts.push(text);
  }
  const headlineTexts = [
    ...extractTagContent(html, "h1"),
    ...extractTagContent(html, "h2"),
    ...extractTagContent(html, "h3")
  ];
  const anchorLinks = extractAnchors(html);
  const formLinks = extractFormActions(html);
  const dataLinks = extractDataAttributeUrls(html);
  const scriptLinks = extractScriptUrls(html, domain);
  const metaRefreshUrl = extractMetaRefresh(html);
  const metaLinks = metaRefreshUrl ? [{ url: metaRefreshUrl, text: "", element: "meta-refresh", isButton: false, isPrimaryCta: true }] : [];
  const links = [...metaLinks, ...anchorLinks, ...formLinks, ...dataLinks, ...scriptLinks];
  const assetUrls = [
    ...extractAttributeValues(html, "img", "src"),
    ...extractAttributeValues(html, "video", "src"),
    ...extractAttributeValues(html, "source", "src")
  ];
  const mediaItems = extractMediaItems(html, pageUrl);
  const detection = pageUrl ? detectPlatform(html, pageUrl) : null;
  return {
    title,
    bodyText,
    hasForm,
    buttonTexts,
    headlineTexts,
    links,
    assetUrls,
    mediaItems,
    platformHint: detection?.platform,
    platformLabel: detection?.label,
    platformConfidence: detection?.confidence
  };
}
async function crawlFunnel(config) {
  const queue = new CrawlQueue();
  const pages = [];
  const edges = [];
  const diagnostics = [];
  const redirects = [];
  const pageUrlToId = /* @__PURE__ */ new Map();
  const domain = (() => {
    try {
      return new URL(config.rootUrl).hostname;
    } catch {
      return "";
    }
  })();
  const origin = (() => {
    try {
      return new URL(config.rootUrl).origin;
    } catch {
      return "";
    }
  })();
  const normalizedRoot = normalizeCrawlUrl(config.rootUrl, config.stripQueryStrings);
  queue.enqueue({ url: normalizedRoot, depth: 0 });
  logger.info("crawler", `Starting crawl from ${normalizedRoot} (domain=${domain})`);
  if (origin) {
    const sitemapUrls = await fetchSitemapUrls(normalizedRoot);
    for (const su of sitemapUrls) {
      const nu = normalizeCrawlUrl(su, config.stripQueryStrings);
      queue.enqueue({ url: nu, depth: 1, parentUrl: normalizedRoot, linkText: "sitemap", sourceElement: "sitemap" });
    }
    if (sitemapUrls.length) diagnostics.push(`Seeded ${sitemapUrls.length} URLs from sitemap`);
  }
  while (!queue.isEmpty() && pages.length < config.maxPages) {
    const item = queue.dequeue();
    if (!item) break;
    if (item.depth > config.maxDepth) {
      diagnostics.push(`Skipped ${item.url}: exceeds max depth ${config.maxDepth}`);
      continue;
    }
    try {
      let html;
      let finalUrl = item.url;
      let statusCode = 200;
      let isBlocked = false;
      try {
        const fetched = await fetchPage(item.url);
        statusCode = fetched.status;
        html = fetched.html;
        isBlocked = fetched.isBlocked;
        finalUrl = normalizeCrawlUrl(fetched.finalUrl, config.stripQueryStrings);
        if (!fetched.isBlocked && !fetched.html) {
          diagnostics.push(`Empty response for ${item.url}`);
          continue;
        }
        if (finalUrl !== item.url) {
          redirects.push({ originalUrl: item.url, finalUrl, statusCode });
          diagnostics.push(`Redirect: ${item.url} \u2192 ${finalUrl}`);
          if (queue.hasVisited(finalUrl)) continue;
        }
        if (statusCode >= 400 && !isBlocked) {
          diagnostics.push(`HTTP ${statusCode} for ${item.url}`);
          continue;
        }
      } catch (fetchErr) {
        diagnostics.push(`Fetch failed for ${item.url}: ${String(fetchErr)}`);
        continue;
      }
      if (isBlocked) {
        diagnostics.push(`Blocked (Cloudflare/bot-protection): ${finalUrl}`);
        logger.warn("crawler", `Blocked page: ${finalUrl}`);
        const pageData2 = parseHtml(html, domain, finalUrl);
        for (const link of pageData2.links) {
          const resolvedUrl = resolveUrl(link.url, finalUrl);
          const normalizedUrl = normalizeCrawlUrl(resolvedUrl, config.stripQueryStrings);
          if (!isNavigableUrl(normalizedUrl)) continue;
          if (!isInternalLink(normalizedUrl, config.rootUrl, config.allowedDomains)) continue;
          queue.enqueue({ url: normalizedUrl, depth: item.depth + 1, parentUrl: finalUrl, linkText: link.text, sourceElement: link.element });
        }
        continue;
      }
      const pageData = parseHtml(html, domain, finalUrl);
      const pageId = generatePageId();
      pageUrlToId.set(item.url, pageId);
      pageUrlToId.set(finalUrl, pageId);
      const classification = classifyPage(
        finalUrl,
        pageData.title,
        pageData.bodyText,
        pageData.hasForm,
        pageData.buttonTexts,
        pageData.headlineTexts
      );
      const page = {
        id: pageId,
        url: finalUrl,
        title: pageData.title || void 0,
        pageTypeHint: classification.hint,
        pageTypeConfidence: classification.confidence,
        platformHint: pageData.platformHint,
        platformLabel: pageData.platformLabel,
        platformConfidence: pageData.platformConfidence,
        statusCode,
        assetCount: pageData.assetUrls.length,
        depth: item.depth,
        crawledAt: (/* @__PURE__ */ new Date()).toISOString(),
        mediaItems: pageData.mediaItems.length > 0 ? pageData.mediaItems : void 0
      };
      pages.push(page);
      if (item.parentUrl) {
        const parentId = pageUrlToId.get(item.parentUrl);
        if (parentId) {
          const relationship = detectRelationship(
            item.linkText || "",
            item.sourceElement || "a",
            finalUrl,
            classification.hint,
            pageData.hasForm,
            pageData.buttonTexts
          );
          edges.push({
            fromPageId: parentId,
            toPageId: pageId,
            relationshipType: relationship.type,
            confidence: relationship.confidence,
            linkText: item.linkText,
            sourceElement: item.sourceElement
          });
        }
      }
      const metaRefreshLinks = pageData.links.filter((l) => l.element === "meta-refresh");
      const ctaLinks = pageData.links.filter((l) => l.isPrimaryCta);
      const regularLinks = pageData.links.filter((l) => !l.isPrimaryCta && l.element === "a");
      const formLinks2 = pageData.links.filter((l) => l.element === "form");
      const dataScriptLinks = pageData.links.filter((l) => l.element !== "a" && l.element !== "form" && l.element !== "meta-refresh");
      const orderedLinks = [...metaRefreshLinks, ...ctaLinks, ...formLinks2, ...regularLinks, ...dataScriptLinks];
      for (const link of orderedLinks) {
        const resolvedUrl = resolveUrl(link.url, finalUrl);
        const normalizedUrl = normalizeCrawlUrl(resolvedUrl, config.stripQueryStrings);
        if (!isNavigableUrl(normalizedUrl)) continue;
        if (!isInternalLink(normalizedUrl, config.rootUrl, config.allowedDomains)) continue;
        if (config.includePatterns.length > 0 && !matchesPattern(normalizedUrl, config.includePatterns)) continue;
        if (config.excludePatterns.length > 0 && matchesPattern(normalizedUrl, config.excludePatterns)) continue;
        queue.enqueue({
          url: normalizedUrl,
          depth: item.depth + 1,
          parentUrl: finalUrl,
          linkText: link.text,
          sourceElement: link.isPrimaryCta ? "a.cta" : link.element
        });
      }
      logger.info("crawler", `Crawled ${finalUrl} (depth ${item.depth}, ${pages.length}/${config.maxPages}, links=${orderedLinks.length})`);
      if (config.delayMs > 0 && !queue.isEmpty()) {
        await delay(config.delayMs);
      }
    } catch (err) {
      diagnostics.push(`Error crawling ${item.url}: ${String(err)}`);
      logger.error("crawler", `Error crawling ${item.url}`, err);
    }
  }
  if (pages.length < 5 && origin) {
    diagnostics.push(`Only ${pages.length} pages found \u2014 probing common funnel paths`);
    const visitedSet = new Set(queue.getVisitedUrls());
    const probed = await probeFunnelPaths(origin, visitedSet);
    diagnostics.push(`Probe found ${probed.length} candidate URLs`);
    for (const probedUrl of probed) {
      if (pages.length >= config.maxPages) break;
      if (queue.hasVisited(probedUrl)) continue;
      try {
        const { html, finalUrl, status, isBlocked } = await fetchPage(probedUrl);
        if (isBlocked || status >= 400 || !html) continue;
        const pageData = parseHtml(html, domain, finalUrl);
        const pageId = generatePageId();
        pageUrlToId.set(probedUrl, pageId);
        pageUrlToId.set(finalUrl, pageId);
        const classification = classifyPage(finalUrl, pageData.title, pageData.bodyText, pageData.hasForm, pageData.buttonTexts, pageData.headlineTexts);
        pages.push({
          id: pageId,
          url: finalUrl,
          title: pageData.title || void 0,
          pageTypeHint: classification.hint,
          pageTypeConfidence: classification.confidence,
          platformHint: pageData.platformHint,
          platformLabel: pageData.platformLabel,
          platformConfidence: pageData.platformConfidence,
          statusCode: status,
          assetCount: pageData.assetUrls.length,
          depth: 1,
          crawledAt: (/* @__PURE__ */ new Date()).toISOString(),
          mediaItems: pageData.mediaItems.length > 0 ? pageData.mediaItems : void 0
        });
        diagnostics.push(`Probe hit: ${finalUrl} (${classification.hint})`);
        if (config.delayMs > 0) await delay(config.delayMs);
      } catch {
      }
    }
  }
  if (redirects.length > 0) {
    diagnostics.push(`Total redirects detected: ${redirects.length}`);
  }
  logger.info("crawler", `Crawl complete: ${pages.length} pages, ${edges.length} edges`);
  return buildSitemap(config.rootUrl, pages, edges, diagnostics, {
    maxDepth: config.maxDepth,
    maxPages: config.maxPages,
    stripQueryStrings: config.stripQueryStrings,
    allowedDomains: config.allowedDomains
  });
}

// clonelevel/src/core/inspector/payload-schema.ts
var HL_DOMAINS = [
  "gohighlevel.com",
  "leadconnectorhq.com",
  "highlevel.com"
];
var STRUCTURE_HINT_KEYS = [
  "elements",
  "sections",
  "components",
  "blocks",
  "content",
  "rows",
  "columns",
  "pages",
  "steps",
  "nodes",
  "items",
  "children"
];
function looksLikePageStructure(rawBody) {
  try {
    const obj = JSON.parse(rawBody);
    if (typeof obj !== "object" || obj === null) return false;
    const keys = Object.keys(obj);
    return STRUCTURE_HINT_KEYS.some((k) => keys.includes(k));
  } catch {
    return false;
  }
}
var HIGH_SIGNAL_PATHS = [
  "/pages",
  "/funnels",
  "/save",
  "/update",
  "/builder",
  "/assets",
  "/forms",
  "/element",
  "/funnel-page",
  "/publish",
  "/upsert"
];
var BODY_STRUCTURE_KEYS = [
  "page",
  "sections",
  "rows",
  "columns",
  "elements",
  "styles",
  "layout",
  "content",
  "nodes",
  "steps",
  "children",
  "blocks"
];
function scoreRelevance(url, method, body, mimeType) {
  let score2 = 0;
  const tags = [];
  const urlLower = url.toLowerCase();
  if (HL_DOMAINS.some((d) => urlLower.includes(d))) score2 += 30;
  for (const path of HIGH_SIGNAL_PATHS) {
    if (urlLower.includes(path)) {
      score2 += 30;
      break;
    }
  }
  if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) score2 += 20;
  const isJson = mimeType.includes("json") || body.trimStart().startsWith("{") || body.trimStart().startsWith("[");
  if (isJson) score2 += 15;
  if (isJson && body.length > 10) {
    try {
      const parsed = JSON.parse(body);
      const keys = typeof parsed === "object" && parsed ? Object.keys(parsed) : [];
      if (BODY_STRUCTURE_KEYS.some((k) => keys.includes(k))) score2 += 25;
    } catch {
    }
  }
  if (urlLower.includes("/save") || urlLower.includes("/update") || urlLower.includes("/publish") || urlLower.includes("/upsert")) {
    tags.push("likely-save");
  } else if (urlLower.includes("/pages") || urlLower.includes("/funnels") || urlLower.includes("/load") || method.toUpperCase() === "GET") {
    tags.push("likely-load");
  } else if (urlLower.includes("/assets") || urlLower.includes("/upload") || urlLower.includes("/media")) {
    tags.push("likely-asset");
  } else if (score2 < 20) {
    tags.push("likely-noise");
  } else {
    tags.push("unknown");
  }
  return { score: Math.min(score2, 100), tags };
}

// clonelevel/src/background/asset-store.ts
var ASSETS_KEY = "clonelevel_assets";
var MAX_ASSETS = 500;
var IMAGE_EXTS = /* @__PURE__ */ new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "ico", "bmp", "tiff"]);
var VIDEO_EXTS = /* @__PURE__ */ new Set(["mp4", "webm", "mov", "avi", "m3u8", "flv", "mkv"]);
var FONT_EXTS = /* @__PURE__ */ new Set(["woff", "woff2", "ttf", "eot", "otf"]);
var AUDIO_EXTS = /* @__PURE__ */ new Set(["mp3", "ogg", "wav", "m4a", "aac", "flac"]);
var SCRIPT_EXTS = /* @__PURE__ */ new Set(["js", "mjs"]);
var STYLE_EXTS = /* @__PURE__ */ new Set(["css"]);
var KNOWN_IMAGE_DOMAINS = [
  "storage.googleapis.com",
  "firebasestorage.googleapis.com",
  "cdn.gohighlevel.com",
  "msgsndr.com",
  "images.unsplash.com",
  "images.pexels.com",
  "cloudfront.net",
  "s3.amazonaws.com",
  "s3.us-east",
  "imagekit.io",
  "imgix.net"
];
function classifyAssetUrl(raw) {
  let href;
  try {
    href = new URL(raw);
  } catch {
    return null;
  }
  if (href.protocol !== "http:" && href.protocol !== "https:") return null;
  const domain = href.hostname.toLowerCase();
  if (domain.includes("analytics") || domain.includes("segment.io") || domain.includes("google-analytics") || domain.includes("doubleclick") || domain.includes("facebook.net") || domain.includes("hotjar") || domain.includes("intercom") || domain.includes("sentry") || raw.includes("/__/") || raw.includes("/beacon")) return null;
  const path = href.pathname;
  const lastDot = path.lastIndexOf(".");
  const lastSlash = path.lastIndexOf("/");
  const ext = lastDot > lastSlash && lastDot < path.length - 1 ? path.slice(lastDot + 1).split(/[?#]/)[0].toLowerCase() : "";
  if (IMAGE_EXTS.has(ext)) return { type: "image", ext, domain };
  if (VIDEO_EXTS.has(ext)) return { type: "video", ext, domain };
  if (FONT_EXTS.has(ext)) return { type: "font", ext, domain };
  if (AUDIO_EXTS.has(ext)) return { type: "audio", ext, domain };
  if (SCRIPT_EXTS.has(ext)) return { type: "script", ext, domain };
  if (STYLE_EXTS.has(ext)) return { type: "style", ext, domain };
  if (KNOWN_IMAGE_DOMAINS.some((d) => domain.includes(d))) {
    return { type: "image", ext, domain };
  }
  if (path.length > 2 && ext.length === 0) return { type: "other", ext, domain };
  return null;
}
var URL_PATTERN = /https?:\/\/[^\s"'<>`,)\\]+/g;
function extractUrlsFromString(str) {
  const matches = [];
  let m;
  URL_PATTERN.lastIndex = 0;
  while ((m = URL_PATTERN.exec(str)) !== null) {
    let u = m[0].replace(/[.,;:)}\]]+$/, "");
    if (u.startsWith("http")) matches.push(u);
  }
  return matches;
}
function walkJson(obj, depth = 0, urls = /* @__PURE__ */ new Set(), seen = /* @__PURE__ */ new WeakSet()) {
  if (depth > 30 || obj === null) return urls;
  if (typeof obj === "string") {
    if (obj.startsWith("http")) {
      urls.add(obj.trimEnd().replace(/[.,;:)}\]]+$/, ""));
    } else if (obj.includes("https://") || obj.includes("http://")) {
      extractUrlsFromString(obj).forEach((u) => urls.add(u));
    }
    return urls;
  }
  if (typeof obj !== "object") return urls;
  if (seen.has(obj)) return urls;
  seen.add(obj);
  if (Array.isArray(obj)) {
    for (const item of obj) walkJson(item, depth + 1, urls, seen);
  } else {
    for (const val of Object.values(obj)) {
      walkJson(val, depth + 1, urls, seen);
    }
  }
  return urls;
}
async function getAllAssets() {
  const r = await chrome.storage.local.get(ASSETS_KEY);
  return Array.isArray(r[ASSETS_KEY]) ? r[ASSETS_KEY] : [];
}
async function clearAssets() {
  await chrome.storage.local.remove(ASSETS_KEY);
}
async function scanPageLayoutForAssets(page) {
  if (!page.pageLayout) return 0;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const pageId = page.pageId;
  const pageTitle = page.title ?? page.slug ?? page.pageId;
  const source = page.url;
  const rawUrls = walkJson(page.pageLayout);
  const newRecords = [];
  for (const raw of rawUrls) {
    const cls = classifyAssetUrl(raw);
    if (!cls) continue;
    if (raw.length > 2048) continue;
    newRecords.push({
      url: raw,
      type: cls.type,
      ext: cls.ext,
      domain: cls.domain,
      pageId,
      pageTitle,
      source,
      capturedAt: now
    });
  }
  if (newRecords.length === 0) return 0;
  const existing = await getAllAssets();
  const existingKeys = new Set(existing.map((r) => `${r.url}::${r.pageId}`));
  const fresh = newRecords.filter((r) => !existingKeys.has(`${r.url}::${r.pageId}`));
  if (fresh.length === 0) return 0;
  const merged = [...existing, ...fresh].sort((a, b) => a.type.localeCompare(b.type) || a.url.localeCompare(b.url)).slice(0, MAX_ASSETS);
  await chrome.storage.local.set({ [ASSETS_KEY]: merged });
  return fresh.length;
}
async function rebuildAssetStore(pages) {
  await clearAssets();
  let total = 0;
  for (const page of pages) {
    if (page.pageLayout) total += await scanPageLayoutForAssets(page);
  }
  return total;
}

// clonelevel/src/background/schema-store.ts
var PAGE_SCHEMAS_KEY = "clonelevel_page_schemas";
var FUNNEL_SCHEMAS_KEY = "clonelevel_funnel_schemas";
var SAVE_EVENTS_KEY = "clonelevel_save_events";
var MAX_PAGE_SCHEMAS = 30;
var MAX_FUNNEL_SCHEMAS = 20;
var MAX_SAVE_EVENTS = 100;
function classifyUrl(url) {
  const u = url.toLowerCase();
  if (u.includes("/funnels/page/") && !u.includes("/builder/")) {
    const m = url.match(/\/funnels\/page\/([^/?&#\s]+)/i);
    return { tag: "PAGE_SCHEMA", pageId: m?.[1] };
  }
  if (u.includes("/funnels/funnel/fetch/")) {
    const m = url.match(/\/funnels\/funnel\/fetch\/([^/?&#\s]+)/i);
    return { tag: "FUNNEL_SCHEMA", funnelId: m?.[1] };
  }
  if (u.includes("/funnels/builder/autosave")) {
    const pm = url.match(/\/pages?\/([^/?&#\s]+)/i);
    const fm = url.match(/\/funnels?\/([^/?&#\s]+)/i);
    return { tag: "SAVE_EVENT", pageId: pm?.[1], funnelId: fm?.[1], eventType: "autosave" };
  }
  if (u.includes("/funnels/builder/prebuilt-section")) {
    return { tag: "SAVE_EVENT", eventType: "prebuilt-section" };
  }
  if (u.includes("/funnels/builder/global-section")) {
    return { tag: "SAVE_EVENT", eventType: "global-section" };
  }
  if (u.includes("/funnels/builder/") && ["POST", "PUT", "PATCH"].includes("")) {
    return { tag: "SAVE_EVENT", eventType: "other-save" };
  }
  return { tag: null };
}
var KNOWN_ELEMENT_TYPES = /* @__PURE__ */ new Set([
  "headline",
  "paragraph",
  "text",
  "richtext",
  "image",
  "video",
  "audio",
  "gif",
  "button",
  "link",
  "form",
  "input",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "captcha",
  "icon",
  "icon-text",
  "fa-icon",
  "list",
  "ordered-list",
  "unordered-list",
  "countdown",
  "timer",
  "divider",
  "spacer",
  "separator",
  "blank",
  "html",
  "custom",
  "embed",
  "code",
  "raw-html",
  "section",
  "row",
  "column",
  "container",
  "box",
  "grid",
  "flex",
  "map",
  "survey",
  "calendar",
  "chat",
  "testimonial",
  "pricing",
  "progress",
  "slider",
  "carousel",
  "tabs",
  "accordion",
  "navbar",
  "social",
  "share",
  "comments",
  "rating"
]);
function detectElementTypes(obj) {
  const counts = {};
  const seen = /* @__PURE__ */ new WeakSet();
  const walk = (v, depth) => {
    if (depth > 25 || v === null || typeof v !== "object") return;
    if (seen.has(v)) return;
    seen.add(v);
    if (Array.isArray(v)) {
      v.forEach((item) => walk(item, depth + 1));
      return;
    }
    const o = v;
    if (typeof o.type === "string" && o.type) {
      const t = o.type.toLowerCase().trim();
      if (KNOWN_ELEMENT_TYPES.has(t) || t.length > 1 && t.length < 40 && !/^https?:/.test(t)) {
        counts[t] = (counts[t] ?? 0) + 1;
      }
    }
    for (const val of Object.values(o)) walk(val, depth + 1);
  };
  walk(obj, 0);
  return counts;
}
function countElements(obj, depth = 0) {
  const counts = { sections: 0, rows: 0, columns: 0, elements: 0 };
  if (depth > 20 || obj === null || typeof obj !== "object") return counts;
  const rec = (v, d) => {
    if (d > 20 || v === null || typeof v !== "object") return;
    if (Array.isArray(v)) {
      v.forEach((item) => rec(item, d + 1));
      return;
    }
    for (const [k, val] of Object.entries(v)) {
      if (Array.isArray(val)) {
        if (k === "sections") counts.sections += val.length;
        if (k === "rows") counts.rows += val.length;
        if (k === "columns") counts.columns += val.length;
        if (k === "elements") counts.elements += val.length;
        val.forEach((item) => rec(item, d + 1));
      } else {
        rec(val, d + 1);
      }
    }
  };
  rec(obj, 0);
  return counts;
}
function pluck(obj, ...keys) {
  if (obj === null || typeof obj !== "object") return void 0;
  const o = obj;
  for (const k of keys) {
    if (typeof o[k] === "string" && o[k]) return o[k];
  }
  for (const val of Object.values(o)) {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const found = pluck(val, ...keys);
      if (found) return found;
    }
  }
  return void 0;
}
function extractSteps(obj) {
  if (!obj || typeof obj !== "object") return [];
  const findStepsArray = (v, depth) => {
    if (depth > 6 || !v || typeof v !== "object" || Array.isArray(v)) return null;
    const o = v;
    if (Array.isArray(o["steps"]) && o["steps"].length > 0) return o["steps"];
    for (const val of Object.values(o)) {
      const found = findStepsArray(val, depth + 1);
      if (found) return found;
    }
    return null;
  };
  const stepsArr = findStepsArray(obj, 0);
  if (!stepsArr) return [];
  const steps = [];
  for (const item of stepsArr) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const s = item;
    const stepId = s["id"] ?? s["stepId"] ?? s["_id"] ?? "";
    if (!stepId) continue;
    let pageIds = [];
    if (Array.isArray(s["pages"])) {
      pageIds = s["pages"].filter((p) => typeof p === "string");
    } else if (Array.isArray(s["pageIds"])) {
      pageIds = s["pageIds"].filter((p) => typeof p === "string");
    }
    steps.push({
      stepId,
      name: s["name"] ?? s["title"] ?? s["pageName"] ?? void 0,
      path: s["path"] ?? s["slug"] ?? s["url"] ?? void 0,
      pageIds
    });
  }
  return steps;
}
async function getPageSchemas() {
  const r = await chrome.storage.local.get(PAGE_SCHEMAS_KEY);
  return Array.isArray(r[PAGE_SCHEMAS_KEY]) ? r[PAGE_SCHEMAS_KEY] : [];
}
async function getFunnelSchemas() {
  const r = await chrome.storage.local.get(FUNNEL_SCHEMAS_KEY);
  return Array.isArray(r[FUNNEL_SCHEMAS_KEY]) ? r[FUNNEL_SCHEMAS_KEY] : [];
}
async function getSaveEvents() {
  const r = await chrome.storage.local.get(SAVE_EVENTS_KEY);
  return Array.isArray(r[SAVE_EVENTS_KEY]) ? r[SAVE_EVENTS_KEY] : [];
}
async function clearSchemaStore() {
  await chrome.storage.local.remove([PAGE_SCHEMAS_KEY, FUNNEL_SCHEMAS_KEY, SAVE_EVENTS_KEY]);
}
async function classifyAndStore(snapshot) {
  const { tag, pageId, funnelId, eventType } = classifyUrl(snapshot.requestUrl);
  if (tag === "PAGE_SCHEMA" && snapshot.rawBody && snapshot.rawBody.length > 2) {
    await _storePageSchema(snapshot, pageId);
    return "PAGE_SCHEMA";
  }
  if (tag === "FUNNEL_SCHEMA" && snapshot.rawBody && snapshot.rawBody.length > 2) {
    await _storeFunnelSchema(snapshot, funnelId);
    return "FUNNEL_SCHEMA";
  }
  if (tag === "SAVE_EVENT") {
    await _storeSaveEvent(snapshot, pageId, funnelId, eventType ?? "other-save");
    return "SAVE_EVENT";
  }
  return null;
}
async function _storePageSchema(snap, pageId) {
  let parsed;
  try {
    parsed = JSON.parse(snap.rawBody);
  } catch {
    return;
  }
  const id = pageId ?? pluck(parsed, "id", "pageId", "_id") ?? snap.id;
  const raw = snap.rawBody.slice(0, 5e5);
  const summary = countElements(parsed);
  const elementTypes = detectElementTypes(parsed);
  const downloadUrl = pluck(
    parsed,
    "pageDataDownloadUrl",
    "pageDataUrl",
    "dataDownloadUrl",
    "downloadUrl"
  ) ?? _findDownloadUrl(parsed);
  const record = {
    pageId: id,
    snapshotId: snap.id,
    capturedAt: snap.timestamp,
    url: snap.requestUrl,
    raw,
    title: pluck(parsed, "name", "title", "pageName"),
    slug: pluck(parsed, "path", "slug", "url", "pathname"),
    summary,
    elementTypes,
    linkedSaveIds: [],
    pageDataDownloadUrl: downloadUrl ?? void 0
  };
  const existing = await getPageSchemas();
  const filtered = existing.filter((r) => r.pageId !== id || r.snapshotId !== snap.id);
  const updated = [record, ...filtered].slice(0, MAX_PAGE_SCHEMAS);
  await chrome.storage.local.set({ [PAGE_SCHEMAS_KEY]: updated });
  if (downloadUrl) {
    _fetchAndStoreLayout(id, downloadUrl).catch(() => {
    });
  }
}
function _findDownloadUrl(obj, depth = 0) {
  if (depth > 6 || !obj || typeof obj !== "object") return void 0;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const r = _findDownloadUrl(item, depth + 1);
      if (r) return r;
    }
    return void 0;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string" && (k.toLowerCase().includes("downloadurl") || k.toLowerCase().includes("pagedata")) && (v.startsWith("https://firebasestorage") || v.startsWith("https://storage.googleapis"))) {
      return v;
    }
    const r = _findDownloadUrl(v, depth + 1);
    if (r) return r;
  }
  return void 0;
}
async function _fetchAndStoreLayout(pageId, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Layout fetch failed: ${res.status}`);
  const layout = await res.json();
  const existing = await getPageSchemas();
  let patched = false;
  const updated = existing.map((r) => {
    if (r.pageId === pageId && !patched) {
      patched = true;
      return { ...r, pageLayout: layout, layoutCapturedAt: (/* @__PURE__ */ new Date()).toISOString() };
    }
    return r;
  });
  if (patched) {
    await chrome.storage.local.set({ [PAGE_SCHEMAS_KEY]: updated });
    const patchedRecord = updated.find((r) => r.pageId === pageId && r.pageLayout);
    if (patchedRecord) {
      scanPageLayoutForAssets(patchedRecord).catch(() => {
      });
    }
  }
  return layout;
}
async function fetchAndStorePageLayout(pageId) {
  const records = await getPageSchemas();
  const record = records.find((r) => r.pageId === pageId);
  if (!record?.pageDataDownloadUrl) return null;
  const layout = await _fetchAndStoreLayout(pageId, record.pageDataDownloadUrl);
  return { layout };
}
async function _storeFunnelSchema(snap, funnelId) {
  let parsed;
  try {
    parsed = JSON.parse(snap.rawBody);
  } catch {
    return;
  }
  const id = funnelId ?? pluck(parsed, "id", "funnelId", "_id") ?? snap.id;
  const name = pluck(parsed, "name", "title", "funnelName");
  const steps = extractSteps(parsed);
  const raw = snap.rawBody.slice(0, 5e5);
  const allPageIds = [...new Set(steps.flatMap((s) => s.pageIds))];
  const record = {
    funnelId: id,
    snapshotId: snap.id,
    capturedAt: snap.timestamp,
    url: snap.requestUrl,
    raw,
    name,
    pageCount: allPageIds.length,
    pageIds: allPageIds,
    steps
  };
  const existing = await getFunnelSchemas();
  const filtered = existing.filter((r) => r.funnelId !== id || r.snapshotId !== snap.id);
  const updated = [record, ...filtered].slice(0, MAX_FUNNEL_SCHEMAS);
  await chrome.storage.local.set({ [FUNNEL_SCHEMAS_KEY]: updated });
}
async function _storeSaveEvent(snap, pageId, funnelId, eventType = "other-save") {
  const record = {
    snapshotId: snap.id,
    capturedAt: snap.timestamp,
    url: snap.requestUrl,
    method: snap.method,
    eventType,
    pageId,
    funnelId,
    bodySize: snap.requestBodyText?.length ?? 0
  };
  const existing = await getSaveEvents();
  const updated = [record, ...existing].slice(0, MAX_SAVE_EVENTS);
  await chrome.storage.local.set({ [SAVE_EVENTS_KEY]: updated });
  if (pageId) {
    const pages = await getPageSchemas();
    const page = pages.find((p) => p.pageId === pageId);
    if (page && !page.linkedSaveIds.includes(snap.id)) {
      page.linkedSaveIds = [snap.id, ...page.linkedSaveIds].slice(0, 20);
      const patched = pages.map((p) => p.pageId === pageId && p.snapshotId === page.snapshotId ? page : p);
      await chrome.storage.local.set({ [PAGE_SCHEMAS_KEY]: patched });
    }
  }
}
async function buildFunnelPackage(funnelId) {
  const funnels = await getFunnelSchemas();
  const funnel = funnels.find((f) => f.funnelId === funnelId);
  if (!funnel) return null;
  const allPages = await getPageSchemas();
  const allSaves = await getSaveEvents();
  const latestPageByPageId = /* @__PURE__ */ new Map();
  for (const p of allPages) {
    if (!latestPageByPageId.has(p.pageId)) {
      latestPageByPageId.set(p.pageId, p);
    }
  }
  const pages = [];
  for (const step of funnel.steps) {
    for (const pid of step.pageIds) {
      const captured = latestPageByPageId.get(pid) ?? null;
      let schema = null;
      if (captured) {
        try {
          schema = JSON.parse(captured.raw);
        } catch {
          schema = null;
        }
      }
      pages.push({
        stepId: step.stepId,
        pageId: pid,
        name: captured?.title ?? step.name,
        path: captured?.slug ?? step.path,
        captured: captured !== null,
        schema,
        layout: captured?.pageLayout ?? null
      });
    }
  }
  if (funnel.steps.length === 0 && funnel.pageIds.length > 0) {
    for (const pid of funnel.pageIds) {
      const captured = latestPageByPageId.get(pid) ?? null;
      let schema = null;
      if (captured) {
        try {
          schema = JSON.parse(captured.raw);
        } catch {
          schema = null;
        }
      }
      pages.push({
        stepId: "unknown",
        pageId: pid,
        name: captured?.title,
        path: captured?.slug,
        captured: captured !== null,
        schema,
        layout: captured?.pageLayout ?? null
      });
    }
  }
  const allPageIds = new Set(funnel.pageIds);
  const saveEvents = allSaves.filter(
    (s) => s.funnelId === funnelId || s.pageId && allPageIds.has(s.pageId)
  );
  return { funnel, pages, saveEvents, exportedAt: (/* @__PURE__ */ new Date()).toISOString() };
}

// clonelevel/src/background/import-store.ts
var IMPORT_CANDIDATES_KEY = "clonelevel_import_candidates";
var IMPORT_TARGET_KEY = "clonelevel_import_target";
var MAX_CANDIDATES = 50;
var HL_DOMAINS2 = ["gohighlevel.com", "leadconnectorhq.com", "highlevel.com", "msgsndr.com", "app.ghl.io"];
var CREATE_SEGS = ["/create", "/new", "/add", "/import", "/template", "/clone", "/copy"];
var UPDATE_SEGS = ["/update", "/save", "/savepage", "/autosave", "/upsert", "/publish", "/draft"];
var DUPE_SEGS = ["/duplicate", "/clone", "/copy"];
var IMPORT_SEGS = ["/import", "/template"];
var BUILDER_SEGS = [
  "/pages",
  "/funnels",
  "/funnel",
  "/builder",
  "/elements",
  "/sections",
  "/rows",
  "/columns"
];
var PAGE_BODY_KEYS = [
  "sections",
  "rows",
  "columns",
  "elements",
  "content",
  "layout",
  "page",
  "pages",
  "funnel",
  "funnels",
  "steps",
  "nodes",
  "blocks",
  "html",
  "css",
  "templateId",
  "pageId",
  "funnelId"
];
var MIN_SCORE = 40;
function scoreSnapshot(snap) {
  const url = snap.requestUrl.toLowerCase();
  const method = snap.method.toUpperCase();
  const body = snap.requestBodyText ?? "";
  let domain = 0;
  let methodS = 0;
  let path = 0;
  let bodyKeys = 0;
  let bodySize = 0;
  let mutation = 0;
  let tagScore = 0;
  if (!HL_DOMAINS2.some((d) => url.includes(d))) {
    return { tag: null, score: 0, breakdown: { domain, method: methodS, path, bodyKeys, bodySize, mutation, tag: tagScore } };
  }
  domain = 30;
  if (method === "POST") methodS = 25;
  else if (method === "PUT" || method === "PATCH") methodS = 20;
  else if (method === "GET") methodS = 0;
  if (method === "GET") {
    const hasCreatePath = [...CREATE_SEGS, ...DUPE_SEGS, ...IMPORT_SEGS].some((s) => url.includes(s));
    if (!hasCreatePath) {
      return { tag: null, score: 0, breakdown: { domain, method: methodS, path, bodyKeys, bodySize, mutation, tag: tagScore } };
    }
    methodS = 5;
  }
  if (BUILDER_SEGS.some((s) => url.includes(s))) path = 15;
  if (body && body.length > 4) {
    try {
      const parsed = JSON.parse(body);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const keys = Object.keys(parsed).map((k) => k.toLowerCase());
        const hits = PAGE_BODY_KEYS.filter((k) => keys.some((bk) => bk.includes(k)));
        bodyKeys = Math.min(hits.length * 5, 20);
        if (body.length > 5e3) bodySize = 5;
      }
    } catch {
    }
  }
  const isDupe = DUPE_SEGS.some((s) => url.includes(s));
  const isImport = IMPORT_SEGS.some((s) => url.includes(s));
  const isCreate = CREATE_SEGS.some((s) => url.includes(s));
  const isUpdate = UPDATE_SEGS.some((s) => url.includes(s));
  if (isImport) mutation = 15;
  else if (isDupe) mutation = 12;
  else if (isCreate) mutation = 10;
  else if (isUpdate) mutation = 8;
  let tag = null;
  if (isImport) {
    tag = "IMPORT_CANDIDATE";
    tagScore = 10;
  } else if (isDupe) {
    tag = "DUPLICATE_CANDIDATE";
    tagScore = 8;
  } else if (isCreate) {
    tag = "CREATE_CANDIDATE";
    tagScore = 7;
  } else if (isUpdate && (url.includes("/page") || url.includes("/funnel") || url.includes("/builder"))) {
    tag = "UPDATE_CANDIDATE";
    tagScore = 6;
  } else if (url.includes("/publish")) {
    tag = "PUBLISH_CANDIDATE";
    tagScore = 5;
  } else if (url.includes("/save") || url.includes("/autosave")) {
    tag = "SAVE_CANDIDATE";
    tagScore = 4;
  }
  if (!tag && method === "POST" && path > 0) {
    tag = "CREATE_CANDIDATE";
    tagScore = 3;
  }
  if (!tag && (method === "PUT" || method === "PATCH") && path > 0) {
    tag = "UPDATE_CANDIDATE";
    tagScore = 3;
  }
  if (!tag) {
    return { tag: null, score: 0, breakdown: { domain, method: methodS, path, bodyKeys, bodySize, mutation, tag: tagScore } };
  }
  const raw = domain + methodS + path + bodyKeys + bodySize + mutation + tagScore;
  const maxRaw = 30 + 25 + 15 + 20 + 5 + 15 + 10;
  const score2 = Math.round(Math.min(raw / maxRaw * 100, 100));
  return { tag, score: score2, breakdown: { domain, method: methodS, path, bodyKeys, bodySize, mutation, tag: tagScore } };
}
async function getImportCandidates() {
  const r = await chrome.storage.local.get(IMPORT_CANDIDATES_KEY);
  return Array.isArray(r[IMPORT_CANDIDATES_KEY]) ? r[IMPORT_CANDIDATES_KEY] : [];
}
async function clearImportCandidates() {
  await chrome.storage.local.remove(IMPORT_CANDIDATES_KEY);
}
async function getImportTarget() {
  const r = await chrome.storage.local.get(IMPORT_TARGET_KEY);
  return r[IMPORT_TARGET_KEY] ?? null;
}
async function setImportTarget(target) {
  await chrome.storage.local.set({ [IMPORT_TARGET_KEY]: target });
}
var LEARN_SESSIONS_KEY = "clonelevel_learn_sessions";
var MAX_LEARN_SESSIONS = 20;
async function getLearnSessions() {
  const r = await chrome.storage.local.get(LEARN_SESSIONS_KEY);
  return Array.isArray(r[LEARN_SESSIONS_KEY]) ? r[LEARN_SESSIONS_KEY] : [];
}
async function saveLearnSession(session) {
  const existing = await getLearnSessions();
  const merged = [session, ...existing.filter((s) => s.id !== session.id)].slice(0, MAX_LEARN_SESSIONS);
  await chrome.storage.local.set({ [LEARN_SESSIONS_KEY]: merged });
}
async function clearLearnSessions() {
  await chrome.storage.local.remove(LEARN_SESSIONS_KEY);
}
async function classifyForImport(snap) {
  const { tag, score: score2, breakdown } = scoreSnapshot(snap);
  if (!tag || score2 < MIN_SCORE) return;
  const candidate = {
    id: snap.id,
    capturedAt: snap.timestamp,
    url: snap.requestUrl,
    method: snap.method,
    statusCode: snap.statusCode,
    tag,
    score: score2,
    scoreBreakdown: breakdown,
    requestBody: (snap.requestBodyText ?? "").slice(0, 2e5),
    responseBody: (snap.rawBody ?? "").slice(0, 2e5),
    contentType: snap.contentType,
    requestHeaders: snap.requestHeaders ?? {},
    payloadSize: snap.payloadSize
  };
  const existing = await getImportCandidates();
  const filtered = existing.filter((c) => c.id !== snap.id);
  const merged = [candidate, ...filtered].sort((a, b) => b.score - a.score).slice(0, MAX_CANDIDATES);
  await chrome.storage.local.set({ [IMPORT_CANDIDATES_KEY]: merged });
}

// clonelevel/src/background/global-store.ts
var GLOBAL_SECTIONS_KEY = "clonelevel_global_sections";
var THEME_SETTINGS_KEY = "clonelevel_theme_settings";
var TEMPLATES_KEY = "clonelevel_templates";
var MAX_GLOBAL_SECTIONS = 100;
var MAX_THEME_RECORDS = 30;
var MAX_TEMPLATES = 100;
function classifyGlobalUrl(url, method) {
  const u = url.toLowerCase();
  const m = method.toUpperCase();
  if (m !== "GET") return { tag: null };
  if (u.includes("/global-sections") || u.includes("/global-section") || u.includes("/prebuilt-section") || u.includes("/shared-sections") || u.includes("/global-elements")) {
    const sid = extractId(url, /\/global-sections?\/([^/?&#\s]+)/i) ?? extractId(url, /\/global-elements?\/([^/?&#\s]+)/i);
    return { tag: "GLOBAL_SECTION", sectionId: sid };
  }
  if (u.includes("/themes") || u.includes("/theme") || u.includes("/style-settings") || u.includes("/style/settings") || u.includes("/funnel-theme") || u.includes("/fonts-settings") || u.includes("/brand-settings") || u.includes("/brand/settings") || u.includes("/custom-css") || u.includes("/global-styles") || u.includes("/design-system") || u.includes("/color-palette")) {
    const funnelMatch = url.match(/\/funnels?\/([^/?&#\s]+)/i);
    const pageMatch = url.match(/\/pages?\/([^/?&#\s]+)/i);
    const sourceId = funnelMatch?.[1] ?? pageMatch?.[1];
    const source = funnelMatch ? "funnel" : pageMatch ? "page" : "global";
    return { tag: "THEME_SETTINGS", themeId: extractId(url, /\/themes?\/([^/?&#\s]+)/i), sourceId, source };
  }
  if (u.includes("/templates") || u.includes("/template") || u.includes("/marketplace") || u.includes("/builder-templates") || u.includes("/funnel-templates") || u.includes("/page-templates") || u.includes("/prebuilt-funnels") || u.includes("/snapshot")) {
    const tid = extractId(url, /\/templates?\/([^/?&#\s]+)/i) ?? extractId(url, /\/snapshots?\/([^/?&#\s]+)/i);
    return { tag: "TEMPLATE", templateId: tid };
  }
  return { tag: null };
}
function extractId(url, pattern) {
  const m = url.match(pattern);
  const candidate = m?.[1];
  if (!candidate || candidate === "fetch" || candidate === "list" || candidate === "all") return void 0;
  return candidate;
}
var COLOR_KEYS = /* @__PURE__ */ new Set([
  "primaryColor",
  "primary_color",
  "primary",
  "secondaryColor",
  "secondary_color",
  "secondary",
  "accentColor",
  "accent_color",
  "accent",
  "backgroundColor",
  "bg",
  "background",
  "textColor",
  "text_color",
  "text",
  "buttonColor",
  "button_color",
  "headlineColor",
  "headline_color",
  "linkColor",
  "link_color",
  "borderColor",
  "border_color",
  "--primary",
  "--secondary",
  "--accent",
  "--background",
  "--text",
  "--bg",
  "--primary-color",
  "--secondary-color",
  "--accent-color",
  "--button-color",
  "--headline-color",
  "--link-color"
]);
var FONT_KEYS = /* @__PURE__ */ new Set([
  "fontFamily",
  "font_family",
  "fontfamily",
  "headlineFont",
  "headline_font",
  "headlinefont",
  "contentFont",
  "content_font",
  "contentfont",
  "primaryFont",
  "primary_font",
  "primaryfont",
  "bodyFont",
  "body_font",
  "bodyfont",
  "h1Font",
  "h2Font",
  "h3Font",
  "--font-family",
  "--headline-font",
  "--body-font",
  "--content-font",
  "--primary-font"
]);
var SPACING_KEYS = /* @__PURE__ */ new Set([
  "borderRadius",
  "border_radius",
  "radius",
  "padding",
  "margin",
  "gap",
  "spacing",
  "--border-radius",
  "--radius",
  "--spacing",
  "--gap"
]);
function isColorValue(v) {
  return /^#[0-9a-f]{3,8}$/i.test(v) || /^rgb/.test(v) || /^hsl/.test(v);
}
function classifyVar(key, value) {
  const k = key.toLowerCase().replace(/-/g, "").replace(/_/g, "");
  if (COLOR_KEYS.has(key) || isColorValue(value)) return "color";
  if (FONT_KEYS.has(key) || k.includes("font")) return "font";
  if (SPACING_KEYS.has(key) || k.includes("radius") || k.includes("spacing")) return "spacing";
  return "other";
}
function extractThemeVariables(obj, depth = 0, vars = /* @__PURE__ */ new Map(), seen = /* @__PURE__ */ new WeakSet()) {
  if (depth > 20 || obj === null || typeof obj !== "object") return [...vars.values()];
  if (seen.has(obj)) return [...vars.values()];
  seen.add(obj);
  const o = obj;
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === "string" && v.length > 0 && v.length < 300) {
      const isColorK = COLOR_KEYS.has(k);
      const isFontK = FONT_KEYS.has(k);
      const isSpacingK = SPACING_KEYS.has(k);
      const isColorV = isColorValue(v);
      if (isColorK || isFontK || isSpacingK || isColorV || k.startsWith("--")) {
        const type = classifyVar(k, v);
        if (!vars.has(k)) {
          vars.set(k, { name: k, value: v, type });
        }
      }
    }
    if (v && typeof v === "object" && !Array.isArray(v)) {
      extractThemeVariables(v, depth + 1, vars, seen);
    }
    if (Array.isArray(v)) {
      for (const item of v) {
        if (item && typeof item === "object") {
          extractThemeVariables(item, depth + 1, vars, seen);
        }
      }
    }
  }
  return [...vars.values()];
}
var URL_RE = /https?:\/\/[^\s"'<>`,)\\]{10,}/g;
function extractAssetUrlsFromJson(obj) {
  const urls = /* @__PURE__ */ new Set();
  const IMAGE_EXTS2 = /\.(jpg|jpeg|png|gif|webp|svg|avif|mp4|webm|woff2?|ttf|otf)(\?|$)/i;
  const seen = /* @__PURE__ */ new WeakSet();
  function walk(v, d) {
    if (d > 25 || v === null) return;
    if (typeof v === "string") {
      const raw = v.trim();
      if (raw.startsWith("http") && IMAGE_EXTS2.test(raw)) urls.add(raw);
      else if (raw.includes("http")) {
        let m;
        URL_RE.lastIndex = 0;
        while ((m = URL_RE.exec(raw)) !== null) {
          const u = m[0].replace(/[.,;:)}\]"']+$/, "");
          if (IMAGE_EXTS2.test(u)) urls.add(u);
        }
      }
      return;
    }
    if (typeof v !== "object") return;
    if (seen.has(v)) return;
    seen.add(v);
    if (Array.isArray(v)) {
      v.forEach((i) => walk(i, d + 1));
    } else {
      for (const val of Object.values(v)) walk(val, d + 1);
    }
  }
  walk(obj, 0);
  return [...urls];
}
async function getGlobalSections() {
  const r = await chrome.storage.local.get(GLOBAL_SECTIONS_KEY);
  return Array.isArray(r[GLOBAL_SECTIONS_KEY]) ? r[GLOBAL_SECTIONS_KEY] : [];
}
async function getThemeSettings() {
  const r = await chrome.storage.local.get(THEME_SETTINGS_KEY);
  return Array.isArray(r[THEME_SETTINGS_KEY]) ? r[THEME_SETTINGS_KEY] : [];
}
async function getTemplates() {
  const r = await chrome.storage.local.get(TEMPLATES_KEY);
  return Array.isArray(r[TEMPLATES_KEY]) ? r[TEMPLATES_KEY] : [];
}
async function clearGlobalSections() {
  await chrome.storage.local.remove(GLOBAL_SECTIONS_KEY);
}
async function clearThemeSettings() {
  await chrome.storage.local.remove(THEME_SETTINGS_KEY);
}
async function clearTemplates() {
  await chrome.storage.local.remove(TEMPLATES_KEY);
}
async function clearGlobalStore() {
  await chrome.storage.local.remove([GLOBAL_SECTIONS_KEY, THEME_SETTINGS_KEY, TEMPLATES_KEY]);
}
function pluck2(obj, ...keys) {
  if (!obj || typeof obj !== "object") return void 0;
  const o = obj;
  for (const k of keys) {
    if (typeof o[k] === "string" && o[k]) return o[k];
  }
  return void 0;
}
async function storeGlobalSection(snapshotId, capturedAt, url, body, cls) {
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    return;
  }
  const items = Array.isArray(parsed) ? parsed : [parsed];
  const existing = await getGlobalSections();
  const fresh = [];
  for (const item of items) {
    const id = cls.sectionId ?? pluck2(item, "id", "sectionId", "_id") ?? snapshotId;
    const name = pluck2(item, "name", "title", "label");
    const type = pluck2(item, "type", "sectionType", "elementType");
    const layout = item?.layout ?? item?.body ?? item?.content ?? item;
    const assetUrls = extractAssetUrlsFromJson(layout);
    const raw = JSON.stringify(item).slice(0, 2e5);
    const record = {
      sectionId: id,
      snapshotId,
      capturedAt,
      url,
      name,
      type,
      layout,
      assetUrls,
      raw
    };
    if (!existing.some((r) => r.sectionId === id)) fresh.push(record);
  }
  if (fresh.length === 0) return;
  const updated = [...fresh, ...existing].slice(0, MAX_GLOBAL_SECTIONS);
  await chrome.storage.local.set({ [GLOBAL_SECTIONS_KEY]: updated });
}
async function storeThemeSettings(snapshotId, capturedAt, url, body, cls) {
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    return;
  }
  const variables = extractThemeVariables(parsed);
  if (variables.length < 2) return;
  const themeId = cls.themeId ?? pluck2(parsed, "id", "themeId") ?? snapshotId;
  const raw = body.slice(0, 2e5);
  const record = {
    themeId,
    snapshotId,
    capturedAt,
    url,
    source: cls.source ?? "unknown",
    sourceId: cls.sourceId,
    variables,
    raw
  };
  const existing = await getThemeSettings();
  const filtered = existing.filter((r) => r.themeId !== themeId);
  const updated = [record, ...filtered].slice(0, MAX_THEME_RECORDS);
  await chrome.storage.local.set({ [THEME_SETTINGS_KEY]: updated });
}
async function storeTemplate(snapshotId, capturedAt, url, body, cls) {
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    return;
  }
  const items = Array.isArray(parsed) ? parsed : parsed?.templates ?? parsed?.data ?? [parsed];
  const existing = await getTemplates();
  const fresh = [];
  for (const item of items) {
    const id = cls.templateId ?? pluck2(item, "id", "templateId", "_id") ?? snapshotId;
    const name = pluck2(item, "name", "title", "templateName");
    const category = pluck2(item, "category", "categoryName", "type");
    const preview = pluck2(item, "thumbnailUrl", "preview", "previewUrl", "coverImage");
    const tags = Array.isArray(item?.tags) ? item.tags : void 0;
    const pageCount = typeof item?.pages === "number" ? item.pages : Array.isArray(item?.pages) ? item.pages.length : void 0;
    const raw = JSON.stringify(item).slice(0, 5e5);
    if (!existing.some((r) => r.templateId === id)) {
      fresh.push({ templateId: id, snapshotId, capturedAt, url, name, category, tags, pageCount, preview, raw });
    }
  }
  if (fresh.length === 0) return;
  const updated = [...fresh, ...existing].slice(0, MAX_TEMPLATES);
  await chrome.storage.local.set({ [TEMPLATES_KEY]: updated });
}
async function classifyAndStoreGlobal(snapshotId, capturedAt, url, method, body) {
  if (!body || body.trim().length < 10) return;
  const cls = classifyGlobalUrl(url, method);
  if (!cls.tag) return;
  const trimmed = body.trimStart();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return;
  switch (cls.tag) {
    case "GLOBAL_SECTION":
      await storeGlobalSection(snapshotId, capturedAt, url, body, cls);
      break;
    case "THEME_SETTINGS":
      await storeThemeSettings(snapshotId, capturedAt, url, body, cls);
      break;
    case "TEMPLATE":
      await storeTemplate(snapshotId, capturedAt, url, body, cls);
      break;
  }
}
async function tryExtractThemeFromAnyResponse(snapshotId, capturedAt, url, body) {
  if (!body || body.trim().length < 50) return;
  const u = url.toLowerCase();
  const isHlEndpoint = u.includes("gohighlevel.com") || u.includes("leadconnectorhq.com") || u.includes("/funnels/");
  if (!isHlEndpoint) return;
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    return;
  }
  const variables = extractThemeVariables(parsed);
  if (variables.length < 3) return;
  const themeId = snapshotId;
  const raw = body.slice(0, 2e5);
  const funnelMatch = url.match(/\/funnels?\/([^/?&#\s]+)/i);
  const pageMatch = url.match(/\/pages?\/([^/?&#\s]+)/i);
  const sourceId = funnelMatch?.[1] ?? pageMatch?.[1];
  const source = funnelMatch ? "funnel" : pageMatch ? "page" : "unknown";
  const record = {
    themeId,
    snapshotId,
    capturedAt,
    url,
    source,
    sourceId,
    variables,
    raw
  };
  const existing = await getThemeSettings();
  const alreadyKnownKeys = new Set(existing.flatMap((r) => r.variables.map((v) => v.name)));
  const newVars = variables.filter((v) => !alreadyKnownKeys.has(v.name));
  if (newVars.length < 2) return;
  const updated = [record, ...existing].slice(0, MAX_THEME_RECORDS);
  await chrome.storage.local.set({ [THEME_SETTINGS_KEY]: updated });
}
async function buildFullClonePackage(funnelId) {
  const [globalSections, themeRecords, templates] = await Promise.all([
    getGlobalSections(),
    getThemeSettings(),
    getTemplates()
  ]);
  const mergedVars = /* @__PURE__ */ new Map();
  for (const rec of [...themeRecords].reverse()) {
    for (const v of rec.variables) mergedVars.set(v.name, v);
  }
  const importOrder = [
    "1. Upload & register asset files (images, videos, fonts)",
    "2. Apply theme settings (CSS variables, font families, colors)",
    "3. Create global sections and register IDs",
    "4. Create funnel shell (name, domain, steps)",
    "5. Create each page within funnel steps",
    "6. Apply page layouts (attach builder JSON)",
    "7. Replace global section references with imported IDs",
    "8. Publish funnel"
  ];
  return {
    formatVersion: "2.0",
    sourceType: "funnel",
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    globalSections,
    themeSettings: [...mergedVars.values()],
    templates,
    assets: [],
    // filled by caller who imports from asset-store
    importOrder
  };
}

// clonelevel/src/background/debugger-network.ts
var SAVE_MARK_KEY = "clonelevel_save_mark_ts";
var DEBUGGER_STATUS_KEY = "clonelevel_debugger_status";
var _attachedTabId = null;
var _networkEnabled = false;
var _autoAttachEnabled = false;
var _targetMap = /* @__PURE__ */ new Map();
var pendingRequests = /* @__PURE__ */ new Map();
function cdpKind(type) {
  const t = (type ?? "").toLowerCase();
  if (t === "page") return "FRAME";
  if (t === "iframe") return "IFRAME";
  if (t === "worker") return "WORKER";
  if (t === "shared_worker") return "WORKER";
  if (t === "service_worker") return "SERVICE_WORKER";
  return "OTHER";
}
function sourceKey(source) {
  if (source.targetId) return `tgt:${source.targetId}`;
  if (source.tabId) return `tab:${source.tabId}`;
  return "unknown";
}
function reqKey(src, requestId) {
  return `${sourceKey(src)}:${requestId}`;
}
async function persistStatus(attached, tabId, tabUrl, targets = {}) {
  const payload = {
    attached,
    networkEnabled: _networkEnabled,
    autoAttachEnabled: _autoAttachEnabled,
    tabId,
    tabUrl,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    targets,
    totalTargets: Object.values(targets).reduce((a, b) => a + (b ?? 0), 0)
  };
  await chrome.storage.local.set({ [DEBUGGER_STATUS_KEY]: payload });
}
function currentTargetCounts() {
  const counts = {};
  if (_attachedTabId !== null) counts["FRAME"] = (counts["FRAME"] ?? 0) + 1;
  for (const t of _targetMap.values()) {
    counts[t.kind] = (counts[t.kind] ?? 0) + 1;
  }
  return counts;
}
async function getSaveMarkTs() {
  const res = await chrome.storage.local.get(SAVE_MARK_KEY);
  const v = res[SAVE_MARK_KEY];
  return typeof v === "number" ? v : null;
}
async function setSaveMarkNow() {
  const ts2 = Date.now();
  await chrome.storage.local.set({ [SAVE_MARK_KEY]: ts2 });
  return ts2;
}
async function clearSaveMark() {
  await chrome.storage.local.remove(SAVE_MARK_KEY);
}
async function getDebuggerStatus() {
  const res = await chrome.storage.local.get(DEBUGGER_STATUS_KEY);
  return res[DEBUGGER_STATUS_KEY] ?? {
    attached: false,
    networkEnabled: false,
    autoAttachEnabled: false,
    tabId: null,
    tabUrl: "",
    updatedAt: "",
    targets: {},
    totalTargets: 0
  };
}
async function attachToSubTarget(targetId, targetType, targetUrl, parentTabId) {
  if (_targetMap.has(targetId)) return;
  const kind = cdpKind(targetType);
  const debuggee = { targetId };
  try {
    await chrome.debugger.attach(debuggee, "1.3");
  } catch {
  }
  try {
    await chrome.debugger.sendCommand(debuggee, "Network.enable", {
      maxTotalBufferSize: 1e7,
      maxResourceBufferSize: 5e6
    });
  } catch (err) {
    console.warn(`[CL] Failed to enable Network for sub-target ${targetId}:`, err);
    return;
  }
  _targetMap.set(targetId, { targetId, kind, url: targetUrl, parentTabId });
  console.info(`[CL] Sub-target attached: ${kind} ${targetUrl}`);
  await persistStatus(true, parentTabId, "", currentTargetCounts());
}
async function attachDebugger(tabId) {
  if (_attachedTabId !== null && _attachedTabId !== tabId) {
    await detachDebugger();
  }
  try {
    await chrome.debugger.attach({ tabId }, "1.3");
  } catch (err) {
    const already = await verifyAttachment();
    if (!already) {
      await persistStatus(false, null, "");
      return { ok: false, error: `attach failed: ${String(err)}` };
    }
  }
  try {
    await chrome.debugger.sendCommand({ tabId }, "Network.enable", {
      maxTotalBufferSize: 1e7,
      maxResourceBufferSize: 5e6
    });
    _networkEnabled = true;
  } catch (err) {
    try {
      await chrome.debugger.detach({ tabId });
    } catch {
    }
    _networkEnabled = false;
    _autoAttachEnabled = false;
    await persistStatus(false, null, "");
    return { ok: false, error: `Network.enable failed: ${String(err)}` };
  }
  _attachedTabId = tabId;
  let tabUrl = "";
  try {
    const t = await chrome.tabs.get(tabId);
    tabUrl = t.url ?? "";
  } catch {
  }
  await persistStatus(true, tabId, tabUrl, { FRAME: 1 });
  try {
    await chrome.debugger.sendCommand({ tabId }, "Target.enable", {});
  } catch (err) {
    console.warn("[CL] Target.enable not supported \u2014 multi-target capture unavailable:", String(err));
  }
  try {
    await chrome.debugger.sendCommand({ tabId }, "Target.setAutoAttach", {
      autoAttach: true,
      waitForDebuggerOnStart: false,
      flatten: true
    });
    _autoAttachEnabled = true;
    console.info("[CL] Target.setAutoAttach enabled \u2014 capturing all sub-targets");
  } catch (err) {
    _autoAttachEnabled = false;
    console.warn("[CL] Target.setAutoAttach not supported (-32601 is expected in some Chrome versions) \u2014 continuing with tab-only capture:", String(err));
  }
  await persistStatus(true, tabId, tabUrl, currentTargetCounts());
  await _scanExistingTargets(tabId);
  return { ok: true };
}
async function _scanExistingTargets(parentTabId) {
  if (!_autoAttachEnabled) return;
  try {
    const targets = await chrome.debugger.getTargets();
    for (const t of targets) {
      if (!t.targetId || _targetMap.has(t.targetId)) continue;
      if (t.attached) continue;
      const type = (t.type ?? "").toLowerCase();
      if (type === "page" && t.tabId === parentTabId) continue;
      if (type === "browser" || type === "webview" || type === "page") continue;
      if (["iframe", "worker", "shared_worker", "service_worker"].includes(type)) {
        await attachToSubTarget(t.targetId, t.type ?? "other", t.url ?? "", parentTabId);
      }
    }
  } catch (err) {
    console.warn("[CL] Error scanning existing targets:", err);
  }
}
async function _doDetachTarget(targetId) {
  try {
    await chrome.debugger.detach({ targetId });
  } catch {
  }
}
async function detachDebugger() {
  const tabId = _attachedTabId;
  _attachedTabId = null;
  _networkEnabled = false;
  _autoAttachEnabled = false;
  for (const [targetId] of _targetMap) {
    await _doDetachTarget(targetId);
  }
  _targetMap.clear();
  pendingRequests.clear();
  await persistStatus(false, null, "");
  if (tabId !== null) {
    try {
      await chrome.debugger.detach({ tabId });
    } catch {
    }
  }
  return { ok: true };
}
async function verifyAttachment() {
  if (_attachedTabId === null) return false;
  try {
    const targets = await chrome.debugger.getTargets();
    return targets.some((t) => t.tabId === _attachedTabId && t.attached);
  } catch {
    return false;
  }
}
async function handleDebuggerEvent(source, method, params) {
  const isOurTab = source.tabId === _attachedTabId;
  const isSubTarget = source.targetId ? _targetMap.has(source.targetId) : false;
  if (!isOurTab && !isSubTarget) return;
  const tabId = _attachedTabId;
  if (method === "Target.attachedToTarget" && isOurTab) {
    const p = params;
    await attachToSubTarget(p.targetInfo.targetId, p.targetInfo.type, p.targetInfo.url, tabId);
    return;
  }
  if (method === "Target.detachedFromTarget" && isOurTab) {
    const p = params;
    if (p.targetId) {
      _targetMap.delete(p.targetId);
      await persistStatus(true, tabId, "", currentTargetCounts());
    }
    return;
  }
  if (method === "Network.requestWillBeSent") {
    const p = params;
    if (!p.request.url.startsWith("http")) return;
    let tabUrl = "";
    try {
      const t = await chrome.tabs.get(tabId);
      tabUrl = t.url ?? "";
    } catch {
    }
    let targetKind = "FRAME";
    let targetIdStr;
    let targetUrl;
    if (source.targetId && _targetMap.has(source.targetId)) {
      const t = _targetMap.get(source.targetId);
      targetKind = t.kind;
      targetIdStr = t.targetId;
      targetUrl = t.url;
    }
    pendingRequests.set(reqKey(source, p.requestId), {
      url: p.request.url,
      method: p.request.method,
      requestHeaders: p.request.headers ?? {},
      requestBodyText: p.request.postData,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      tabUrl,
      targetKind,
      targetId: targetIdStr,
      targetUrl,
      debuggee: source
    });
    return;
  }
  if (method === "Network.responseReceived") {
    const p = params;
    const key = reqKey(source, p.requestId);
    const pending = pendingRequests.get(key);
    if (!pending) return;
    let responseBody = "";
    try {
      const bodyRes = await chrome.debugger.sendCommand(
        pending.debuggee,
        "Network.getResponseBody",
        { requestId: p.requestId }
      );
      responseBody = bodyRes.base64Encoded ? atob(bodyRes.body) : bodyRes.body;
    } catch {
    }
    const snapshot = await buildSnapshot({
      pending,
      status: p.response.status,
      responseHeaders: p.response.headers ?? {},
      mimeType: p.response.mimeType ?? "",
      responseBody
    });
    await addSnapshot(snapshot);
    await classifyAndStore(snapshot).catch(() => {
    });
    await classifyForImport(snapshot).catch(() => {
    });
    await classifyAndStoreGlobal(
      snapshot.id,
      snapshot.timestamp,
      snapshot.requestUrl,
      snapshot.method,
      snapshot.rawBody ?? ""
    ).catch(() => {
    });
    await tryExtractThemeFromAnyResponse(
      snapshot.id,
      snapshot.timestamp,
      snapshot.requestUrl,
      snapshot.rawBody ?? ""
    ).catch(() => {
    });
    pendingRequests.delete(key);
    return;
  }
  if (method === "Network.loadingFailed" || method === "Network.loadingFinished") {
    const key = reqKey(source, params.requestId);
    pendingRequests.delete(key);
  }
}
async function buildSnapshot(opts) {
  const { pending, status, responseHeaders, mimeType, responseBody } = opts;
  const { score: score2, tags } = scoreRelevance(
    pending.url,
    pending.method,
    responseBody,
    mimeType
  );
  const saveMarkTs = await getSaveMarkTs();
  const reqTime = new Date(pending.timestamp).getTime();
  const nearSaveMark = saveMarkTs !== null && reqTime >= saveMarkTs && reqTime <= saveMarkTs + 3e4;
  const { tag: schemaTag, pageId, funnelId } = classifyUrl(pending.url);
  return {
    id: crypto.randomUUID(),
    timestamp: pending.timestamp,
    tabUrl: pending.tabUrl,
    builderFamily: "unknown",
    requestUrl: pending.url,
    method: pending.method,
    statusCode: status,
    payloadSize: responseBody.length,
    looksLikeStructure: looksLikePageStructure(responseBody),
    rawBody: responseBody,
    contentType: mimeType,
    source: "debugger-network",
    requestHeaders: pending.requestHeaders,
    responseHeaders,
    requestBodyText: pending.requestBodyText,
    relevanceScore: score2,
    tags,
    nearSaveMark,
    targetKind: pending.targetKind,
    targetId: pending.targetId,
    targetUrl: pending.targetUrl,
    ...schemaTag && { schemaTag },
    ...pageId && { pageId },
    ...funnelId && { funnelId }
  };
}

// clonelevel/src/background/state-extractor.ts
var STORAGE_KEY = "clonelevel_state_extracts";
async function getStateExtracts() {
  const res = await chrome.storage.local.get(STORAGE_KEY);
  return Array.isArray(res[STORAGE_KEY]) ? res[STORAGE_KEY] : [];
}
async function clearStateExtracts() {
  await chrome.storage.local.remove(STORAGE_KEY);
}
async function saveStateExtract(result) {
  const existing = await getStateExtracts();
  const updated = [result, ...existing].slice(0, 10);
  await chrome.storage.local.set({ [STORAGE_KEY]: updated });
}
function _probePageState() {
  const BUILDER_KEYS = [
    "page",
    "pages",
    "site",
    "sites",
    "funnel",
    "funnels",
    "sections",
    "rows",
    "columns",
    "elements",
    "styles",
    "layout",
    "content",
    "blocks",
    "nodes",
    "steps",
    "children",
    "components",
    "draft",
    "publish",
    "builder",
    "pageData",
    "siteData",
    "funnelData",
    "locationId"
  ];
  function maxDepth(obj, d) {
    if (d > 15 || obj === null || typeof obj !== "object") return d;
    let m = d;
    const keys = Object.keys(obj).slice(0, 10);
    for (const k of keys) {
      const v = maxDepth(obj[k], d + 1);
      if (v > m) m = v;
    }
    return m;
  }
  function matchedBuilderKeys(json, keys) {
    return keys.filter((k) => json.includes(`"${k}"`));
  }
  const PROBES = [
    ["window.__INITIAL_STATE__", () => window.__INITIAL_STATE__],
    ["window.store.getState()", () => {
      const s = window.store;
      return typeof s?.getState === "function" ? s.getState() : void 0;
    }],
    ["window.appStore.getState()", () => {
      const s = window.appStore;
      return typeof s?.getState === "function" ? s.getState() : void 0;
    }],
    ["window.pageData", () => window.pageData],
    ["window.builderData", () => window.builderData],
    ["window.__NEXT_DATA__", () => window.__NEXT_DATA__],
    ["window.__NUXT__", () => window.__NUXT__],
    ["window.__STATE__", () => window.__STATE__],
    ["window.__STORE__", () => window.__STORE__],
    ["window.vuex", () => window.vuex],
    ["window.App", () => window.App],
    ["window._pageConfig", () => window._pageConfig],
    ["window.funnelConfig", () => window.funnelConfig],
    ["window.pageConfig", () => window.pageConfig],
    ["window.__clConfig", () => window.__clConfig],
    ["window.hl", () => window.hl],
    ["window.HLBuilder", () => window.HLBuilder],
    ["window.__BUILDER_DATA__", () => window.__BUILDER_DATA__]
  ];
  const results = [];
  for (const [name, probe] of PROBES) {
    try {
      const val = probe();
      if (val === null || val === void 0) continue;
      if (typeof val !== "object" && typeof val !== "function") continue;
      let json = "";
      try {
        json = JSON.stringify(val);
      } catch {
        json = "[non-serializable]";
      }
      if (json === "{}") continue;
      const matched = matchedBuilderKeys(json, BUILDER_KEYS);
      if (matched.length === 0) continue;
      results.push({
        source: name,
        depth: maxDepth(val, 0),
        byteSize: json.length,
        matchedKeys: matched,
        topLevelKeys: typeof val === "object" ? Object.keys(val).slice(0, 40) : [],
        json: json.slice(0, 2e5)
        // cap at 200 KB
      });
    } catch {
    }
  }
  return results;
}
function scoreCandidateRaw(raw) {
  let s = 0;
  s += Math.min(raw.matchedKeys.length * 8, 60);
  s += Math.min(raw.depth * 3, 20);
  if (raw.byteSize > 1e4) s += 10;
  if (raw.byteSize > 1e5) s += 10;
  if (raw.source.includes("getState")) s += 15;
  const highValueKeys = ["funnel", "funnels", "page", "pages", "site", "sections", "elements", "locationId", "draft"];
  const highMatches = raw.matchedKeys.filter((k) => highValueKeys.includes(k)).length;
  s += highMatches * 5;
  return Math.min(s, 100);
}
async function runStateExtract(tabId) {
  let tabUrl = "";
  try {
    const t = await chrome.tabs.get(tabId);
    tabUrl = t.url ?? "";
  } catch {
  }
  const extractId2 = `se_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  try {
    const scriptResults = await chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      world: "MAIN",
      func: _probePageState
    });
    const raw = scriptResults?.[0]?.result ?? [];
    const candidates = raw.map((r, i) => {
      const score2 = scoreCandidateRaw(r);
      return {
        id: `${extractId2}_${i}`,
        capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
        source: r.source,
        depth: r.depth,
        byteSize: r.byteSize,
        matchedKeys: r.matchedKeys,
        score: score2,
        topLevelKeys: r.topLevelKeys,
        preview: r.json.slice(0, 800),
        full: r.json
      };
    });
    candidates.sort((a, b) => b.score - a.score);
    const result = {
      id: extractId2,
      extractedAt: (/* @__PURE__ */ new Date()).toISOString(),
      tabId,
      tabUrl,
      candidates
    };
    await saveStateExtract(result);
    return { ok: true, result };
  } catch (err) {
    const result = {
      id: extractId2,
      extractedAt: (/* @__PURE__ */ new Date()).toISOString(),
      tabId,
      tabUrl,
      candidates: [],
      error: String(err)
    };
    await saveStateExtract(result);
    return { ok: false, result, error: String(err) };
  }
}

// clonelevel/src/background/public-clone-store.ts
var PUBLIC_CAPTURES_KEY = "clonelevel_public_captures";
var MAX_CAPTURES = 20;
function classifyPageType(url, title, text) {
  const u = url.toLowerCase();
  const t = (title + " " + text).toLowerCase();
  if (/thank.?you|order.?confirm|success|receipt/.test(u + t)) return "thank-you";
  if (/checkout|order|payment|buy|purchase|billing/.test(u + t)) return "checkout";
  if (/upsell|one.time.offer|oto|upgrade|special.offer/.test(u + t)) return "upsell";
  if (/order.?bump/.test(u + t)) return "order-bump";
  if (/booking|schedule|calendar|appointment/.test(u + t)) return "booking";
  if (/webinar|workshop|masterclass|training/.test(u + t)) return "webinar";
  if (/squeeze|lead.?magnet|free.?gift|opt.?in/.test(u + t)) return "squeeze";
  return "landing";
}
async function getPublicCaptures() {
  const r = await chrome.storage.local.get(PUBLIC_CAPTURES_KEY);
  return Array.isArray(r[PUBLIC_CAPTURES_KEY]) ? r[PUBLIC_CAPTURES_KEY] : [];
}
async function storePublicCapture(cap) {
  const existing = await getPublicCaptures();
  const filtered = existing.filter((c) => c.sourceUrl !== cap.sourceUrl);
  const updated = [cap, ...filtered].slice(0, MAX_CAPTURES);
  await chrome.storage.local.set({ [PUBLIC_CAPTURES_KEY]: updated });
}
async function clearPublicCaptures() {
  await chrome.storage.local.remove(PUBLIC_CAPTURES_KEY);
}
function buildCaptureFromScrape(raw) {
  let domain = "";
  try {
    domain = new URL(raw.url).hostname;
  } catch {
    domain = raw.url;
  }
  const pageType = classifyPageType(raw.url, raw.title, raw.description ?? "");
  const links = raw.links.map((l) => ({
    url: l.url,
    text: l.text,
    type: classifyPageType(l.url, l.text ?? "", ""),
    isSameDomain: l.isSameDomain
  }));
  const funnelLinks = links.filter(
    (l) => l.isSameDomain && l.type !== "unknown" && l.url !== raw.url
  );
  const VALID_TYPES = /* @__PURE__ */ new Set(["image", "video", "audio", "font", "css", "script", "other"]);
  const assets = raw.assets.map((a) => ({
    url: a.url,
    type: VALID_TYPES.has(a.type) ? a.type : "other",
    alt: a.alt,
    source: a.source
  }));
  const sections = raw.sections.map((s) => ({
    sectionHint: s.hint,
    confidence: s.confidence,
    elementCount: s.elementCount
  }));
  return {
    captureId: crypto.randomUUID(),
    capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
    sourceUrl: raw.url,
    domain,
    title: raw.title || domain,
    description: raw.description,
    favicon: raw.favicon,
    pageType,
    status: "captured",
    sections,
    links,
    funnelLinks,
    assets,
    assetCount: assets.length,
    linkCount: links.length,
    hasFunnel: funnelLinks.length >= 2,
    rawHtmlSize: raw.rawHtmlSize
  };
}

// clonelevel/src/background/real-tab-tracker.ts
var BLOCKED_PREFIXES = [
  "chrome-extension://",
  "chrome://",
  "edge://",
  "about:",
  "devtools://",
  "moz-extension://",
  "file:///"
];
function isRealUrl(url) {
  if (!url) return false;
  return (url.startsWith("http://") || url.startsWith("https://")) && !BLOCKED_PREFIXES.some((p) => url.startsWith(p));
}
var _lastReal = null;
function updateRealTab(tab) {
  if (!tab.id || !tab.url || !isRealUrl(tab.url)) return;
  _lastReal = {
    tabId: tab.id,
    url: tab.url,
    title: tab.title ?? "",
    favIconUrl: tab.favIconUrl ?? "",
    updatedAt: Date.now()
  };
}
async function resolveRealTab() {
  if (_lastReal) {
    try {
      const tab = await chrome.tabs.get(_lastReal.tabId);
      if (tab?.url && isRealUrl(tab.url)) return tab;
    } catch {
    }
  }
  const allActive = await chrome.tabs.query({ active: true });
  const real = allActive.find((t) => isRealUrl(t.url));
  if (real) {
    updateRealTab(real);
    return real;
  }
  const allTabs = await chrome.tabs.query({});
  const any = allTabs.find((t) => isRealUrl(t.url));
  if (any) {
    updateRealTab(any);
    return any;
  }
  return null;
}

// clonelevel/src/content/builder-runtime-probe.ts
function _builderRuntimeProbeFunc() {
  const w = window;
  if (w.__cl_runtime?.spyActive) return "already_active";
  w.__cl_runtime = {
    spyActive: false,
    storeType: "none",
    storeKey: null,
    _storeRef: null,
    _origDispatch: null,
    dispatched: [],
    apolloFound: false,
    errors: []
  };
  let store = null;
  try {
    const hook = w.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook) {
      let findStoreInFiber2 = function(fiber, depth) {
        if (!fiber || depth > 150) return null;
        const mp = fiber.memoizedProps;
        if (mp) {
          if (mp.store?.dispatch && typeof mp.store.getState === "function") return mp.store;
          if (mp.value?.store?.dispatch) return mp.value.store;
          if (mp.value?.dispatch && typeof mp.value.getState === "function") return mp.value;
        }
        const ms = fiber.memoizedState;
        if (ms?.element?.props?.store?.dispatch) return ms.element.props.store;
        return findStoreInFiber2(fiber.child, depth + 1) || findStoreInFiber2(fiber.sibling, depth + 1);
      };
      var findStoreInFiber = findStoreInFiber2;
      if (hook.renderers) {
        for (const [, renderer] of hook.renderers) {
          try {
            const roots = typeof renderer.getFiberRoots === "function" ? renderer.getFiberRoots() : /* @__PURE__ */ new Set();
            for (const root of roots) {
              if (root?.current) {
                const s = findStoreInFiber2(root.current, 0);
                if (s) {
                  store = s;
                  w.__cl_runtime.storeType = "devtools-fiber";
                  break;
                }
              }
            }
          } catch {
          }
          if (store) break;
        }
      }
      if (!store && hook._roots) {
        for (const root of hook._roots) {
          if (root?.current) {
            const s = findStoreInFiber2(root.current, 0);
            if (s) {
              store = s;
              w.__cl_runtime.storeType = "devtools-fiber-_roots";
              break;
            }
          }
        }
      }
    }
  } catch (e) {
    w.__cl_runtime.errors.push("devtools:" + String(e).slice(0, 60));
  }
  if (!store) {
    const STORE_KEYS = [
      "store",
      "__store",
      "__redux_store",
      "pageStore",
      "builderStore",
      "funnelStore",
      "appStore",
      "rootStore",
      "__builderStore",
      "__pageStore",
      "editorStore",
      "__editorStore",
      "__appStore",
      "__rootStore",
      "_store",
      "mainStore",
      "hlStore",
      "__hlStore"
    ];
    for (const k of STORE_KEYS) {
      try {
        const s = w[k];
        if (s?.dispatch && typeof s.dispatch === "function" && typeof s.getState === "function") {
          store = s;
          w.__cl_runtime.storeType = "window-global";
          w.__cl_runtime.storeKey = k;
          break;
        }
      } catch {
      }
    }
  }
  if (!store) {
    try {
      const propNames = Object.getOwnPropertyNames(w).slice(0, 1e3);
      for (const k of propNames) {
        if (/^(__cl_|on|webkit|moz|ms|css|SVG|HTML|document|window|navigator|screen|history|location|performance|crypto|indexedDB|caches|console|Math|JSON|Array|Object|Function|String|Number|Boolean|Symbol|BigInt|Promise|Set|Map|WeakSet|WeakMap|Error|RegExp|Date|Intl|Reflect|Proxy|globalThis|undefined|NaN|Infinity)/.test(k)) continue;
        try {
          const v = w[k];
          if (!v || typeof v !== "object" || Array.isArray(v)) continue;
          if (typeof v.dispatch !== "function" || typeof v.getState !== "function") continue;
          try {
            const st = v.getState();
            if (st && typeof st === "object") {
              const stKeys = Object.keys(st).join(",").toLowerCase();
              if (/section|page|funnel|builder|editor|element|step|row|block/.test(stKeys)) {
                store = v;
                w.__cl_runtime.storeType = "window-scan";
                w.__cl_runtime.storeKey = k;
                break;
              }
            }
          } catch {
          }
        } catch {
        }
      }
    } catch (e) {
      w.__cl_runtime.errors.push("scan:" + String(e).slice(0, 60));
    }
  }
  if (!store) {
    try {
      const iframes = document.querySelectorAll("iframe");
      for (let i = 0; i < Math.min(iframes.length, 10) && !store; i++) {
        try {
          const fw = iframes[i].contentWindow;
          if (!fw) continue;
          for (const k of ["store", "__store", "__redux_store", "builderStore", "pageStore", "editorStore", "appStore"]) {
            try {
              const s = fw[k];
              if (s?.dispatch && typeof s.getState === "function") {
                store = s;
                w.__cl_runtime.storeType = "iframe-window";
                w.__cl_runtime.storeKey = `iframe[${i}].${k}`;
                break;
              }
            } catch {
            }
          }
        } catch {
        }
      }
    } catch {
    }
  }
  try {
    if (w.__APOLLO_CLIENT__ || w.apolloClient || w.__APOLLO_STATE__ || w.__APOLLO__) {
      w.__cl_runtime.apolloFound = true;
    }
  } catch {
  }
  if (store) {
    try {
      w.__cl_runtime._storeRef = store;
      w.__cl_runtime._origDispatch = store.dispatch;
      const rt2 = w.__cl_runtime;
      const origDispatch = store.dispatch;
      store.dispatch = function clSpyDispatch(action) {
        try {
          if (action && typeof action === "object") {
            rt2.dispatched.push({
              type: String(action.type ?? "@@unknown"),
              payload: JSON.stringify(action).slice(0, 3e3),
              ts: Date.now()
            });
            if (rt2.dispatched.length > 300) rt2.dispatched.shift();
          }
        } catch {
        }
        return origDispatch.call(this, action);
      };
      w.__cl_runtime.spyActive = true;
    } catch (e) {
      w.__cl_runtime.errors.push("spy:" + String(e).slice(0, 60));
    }
  }
  const rt = w.__cl_runtime;
  if (rt.spyActive) return `store:${rt.storeType}:key=${rt.storeKey ?? "?"}:spy=ACTIVE`;
  if (rt._storeRef) return `store:${rt.storeType}:spy=WRAP_FAILED`;
  return `no_store:apollo=${rt.apolloFound}:errors=${rt.errors.length}`;
}
function _pullRuntimeCapturesFunc() {
  const w = window;
  const rt = w.__cl_runtime;
  const empty = {
    active: false,
    storeFound: false,
    storeType: "none",
    storeKey: null,
    apolloFound: false,
    dispatched: [],
    allDispatched: [],
    totalCaptured: 0,
    statePreview: null,
    errors: []
  };
  if (!rt) return empty;
  const SECTION_ADD = [
    "add",
    "insert",
    "create",
    "append",
    "paste",
    "import",
    "duplicate",
    "copy",
    "clone",
    "template",
    "apply",
    "inject",
    "load"
  ];
  const SECTION_NOUN = [
    "section",
    "element",
    "row",
    "block",
    "component",
    "widget",
    "module",
    "node",
    "step",
    "column"
  ];
  const REMOVE_KW = ["delete", "remove", "destroy", "clear", "reset", "undo", "pop", "splice"];
  function scoreAction(type) {
    const t = type.toLowerCase().replace(/[/_\-\.]/g, " ");
    const hasRemove = REMOVE_KW.some((k) => t.includes(k));
    if (hasRemove) return -10;
    const addHits = SECTION_ADD.filter((k) => t.includes(k)).length;
    const nounHits = SECTION_NOUN.filter((k) => t.includes(k)).length;
    return addHits * 8 + nounHits * 12;
  }
  const allDispatched = (rt.dispatched ?? []).slice(-50).map((d) => ({
    type: d.type ?? "unknown",
    payload: d.payload ?? "",
    ts: d.ts ?? 0,
    score: scoreAction(d.type ?? "")
  }));
  const scored = [...allDispatched].filter((d) => d.score > 0).sort((a, b) => b.score - a.score || b.ts - a.ts).slice(0, 30);
  let statePreview = null;
  try {
    if (rt._storeRef?.getState) {
      statePreview = JSON.stringify(rt._storeRef.getState()).slice(0, 4e3);
    }
  } catch {
  }
  return {
    active: rt.spyActive ?? false,
    storeFound: !!rt._storeRef,
    storeType: rt.storeType ?? "none",
    storeKey: rt.storeKey ?? null,
    apolloFound: rt.apolloFound ?? false,
    dispatched: scored,
    allDispatched,
    totalCaptured: (rt.dispatched ?? []).length,
    statePreview,
    errors: rt.errors ?? []
  };
}
function _insertTestSectionFunc() {
  const w = window;
  const rt = w.__cl_runtime;
  if (!rt?._storeRef) {
    return JSON.stringify({ ok: false, error: "no_store_ref \u2014 run probe first", stateKeys: [] });
  }
  let state;
  try {
    state = rt._storeRef.getState();
  } catch (e) {
    return JSON.stringify({ ok: false, error: "getState_threw: " + String(e).slice(0, 80) });
  }
  function findSectionsInState(obj, depth, path) {
    if (!obj || typeof obj !== "object" || depth > 7) return null;
    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === "object" && (obj[0].rows != null || obj[0].elements != null || obj[0].type === "section" || obj[0].type === "row")) {
        return { path, arr: obj };
      }
      return null;
    }
    for (const k of ["sections", "rows", "elements", "blocks", "steps", "content", "nodes"]) {
      if (Array.isArray(obj[k]) && obj[k].length > 0 && typeof obj[k][0] === "object") {
        return { path: path + "." + k, arr: obj[k] };
      }
    }
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === "object") {
        const r = findSectionsInState(obj[k], depth + 1, path + "." + k);
        if (r) return r;
      }
    }
    return null;
  }
  const found = findSectionsInState(state, 0, "state");
  if (!found) {
    return JSON.stringify({ ok: false, error: "no_sections_array_in_state", stateKeys: Object.keys(state ?? {}) });
  }
  let testSection;
  try {
    let patchText2 = function(node, remaining) {
      if (!node || typeof node !== "object" || remaining <= 0) return;
      if (node.content != null && typeof node.content === "string") {
        node.content = "CloneLevel Test Insert";
        return;
      }
      if (node.text != null && typeof node.text === "string") {
        node.text = "CloneLevel Test Insert";
        return;
      }
      if (node.value != null && typeof node.value === "string") {
        node.value = "CloneLevel Test Insert";
        return;
      }
      for (const k of ["children", "elements", "rows", "cols", "columns"]) {
        if (Array.isArray(node[k])) {
          for (const child of node[k]) patchText2(child, remaining - 1);
        }
      }
    };
    var patchText = patchText2;
    testSection = JSON.parse(JSON.stringify(found.arr[0]));
    const newId = "cl_test_" + Date.now();
    testSection.id = newId;
    testSection.label = "CloneLevel Test Insert";
    patchText2(testSection, 4);
  } catch (e) {
    testSection = { id: "cl_test_" + Date.now(), type: "section", label: "CloneLevel Test Insert", rows: [] };
  }
  const countBefore = found.arr.length;
  const dispatchFn = (a) => typeof rt._origDispatch === "function" ? rt._origDispatch.call(rt._storeRef, a) : rt._storeRef.dispatch(a);
  const capturedTypes = (rt.dispatched ?? []).filter((d) => {
    const t = (d.type ?? "").toLowerCase().replace(/[/_\-\.]/g, " ");
    return ["add", "insert", "paste", "import", "create", "append"].some((v) => t.includes(v)) && ["section", "element", "row", "block", "component"].some((v) => t.includes(v));
  }).map((d) => d.type);
  const STATIC_TYPES = [
    "ADD_SECTION",
    "INSERT_SECTION",
    "PASTE_SECTION",
    "IMPORT_SECTION",
    "CREATE_SECTION",
    "APPEND_SECTION",
    "builder/ADD_SECTION",
    "builder/INSERT_SECTION",
    "builder/PASTE_SECTION",
    "page/ADD_SECTION",
    "page/INSERT_SECTION",
    "funnel/ADD_SECTION",
    "sections/add",
    "sections/insert",
    "SECTION_ADDED",
    "BUILDER_ADD_SECTION",
    "FUNNEL_ADD_SECTION"
  ];
  const allTypes = [.../* @__PURE__ */ new Set([...capturedTypes, ...STATIC_TYPES])];
  const results = [];
  for (const actionType of allTypes) {
    try {
      dispatchFn({
        type: actionType,
        section: testSection,
        payload: testSection,
        sections: [testSection],
        data: testSection
      });
      try {
        const newState = rt._storeRef.getState();
        const newFound = findSectionsInState(newState, 0, "state");
        if (newFound && newFound.arr.length > countBefore) {
          return JSON.stringify({
            ok: true,
            actionType,
            path: found.path,
            countBefore,
            countAfter: newFound.arr.length,
            results,
            fromCaptured: capturedTypes.includes(actionType)
          });
        }
      } catch {
      }
      results.push("dispatched:" + actionType);
    } catch (e) {
      results.push("err:" + actionType + ":" + String(e).slice(0, 40));
    }
  }
  return JSON.stringify({
    ok: false,
    error: "no_action_type_changed_state",
    path: found.path,
    countBefore,
    capturedTypes: capturedTypes.slice(0, 8),
    tried: allTypes.length,
    results: results.slice(0, 15),
    templateShape: Object.keys(found.arr[0] ?? {}).join(",")
  });
}
function _dispatchSectionInsertFunc(actionType, sectionsJson, origPayloadJson) {
  const w = window;
  const rt = w.__cl_runtime;
  if (!rt?._storeRef) {
    return { ok: false, error: "No store ref \u2014 run probe first or probe failed to find store.", results: [] };
  }
  const dispatchFn = typeof rt._origDispatch === "function" ? (a) => rt._origDispatch.call(rt._storeRef, a) : typeof rt._storeRef.dispatch === "function" ? (a) => rt._storeRef.dispatch(a) : null;
  if (!dispatchFn) {
    return { ok: false, error: "No dispatch function available on store", results: [] };
  }
  let ourSections;
  let origPayload;
  try {
    ourSections = JSON.parse(sectionsJson);
  } catch {
    return { ok: false, error: "Could not parse sectionsJson", results: [] };
  }
  try {
    origPayload = JSON.parse(origPayloadJson || "null");
  } catch {
    origPayload = null;
  }
  const section = ourSections[0] ?? { id: `cl_${Date.now()}`, type: "section", rows: [] };
  const results = [];
  const attempts = [
    ...origPayload ? [
      // Exact original payload with section data replaced
      { type: actionType, payload: { ...origPayload, ...section }, ...origPayload, ...section },
      { type: actionType, payload: { ...origPayload, section }, section },
      { type: actionType, payload: section }
    ] : [],
    // Generic shapes — HL builder action creators use various conventions
    { type: actionType, payload: section },
    { type: actionType, section, payload: { section } },
    { type: actionType, sections: ourSections, payload: { sections: ourSections } },
    { type: actionType, payload: ourSections },
    { type: actionType, data: section, payload: { data: section } },
    // Thunk-style: payload is the first section directly
    { type: actionType, ...section }
  ];
  for (const action of attempts) {
    try {
      dispatchFn(action);
      results.push(`dispatched:${actionType}:shape=${JSON.stringify(Object.keys(action))}`);
      return { ok: true, actionType, results };
    } catch (e) {
      results.push(`err:${String(e).slice(0, 80)}`);
    }
  }
  return { ok: false, error: `All ${attempts.length} dispatch attempts threw`, results };
}
function _fiberInjectTestFunc() {
  const w = window;
  const SKIP_GLOBAL = /^(window|document|navigator|location|history|screen|performance|crypto|console|Math|JSON|Array|Object|Function|String|Number|Boolean|Symbol|Promise|Set|Map|Proxy|Reflect|globalThis|undefined|NaN|Infinity|on|webkit|moz|ms)/;
  const notableGlobals = [];
  try {
    for (const k of Object.getOwnPropertyNames(w).slice(0, 500)) {
      if (SKIP_GLOBAL.test(k)) continue;
      try {
        const v = w[k];
        if (v !== null && v !== void 0) notableGlobals.push(k);
      } catch {
      }
    }
  } catch {
  }
  const hasReactHook = !!w.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  const hasReactGlobal = !!w.React;
  let reactFiberEl = null;
  try {
    const primaries = [document.body, document.documentElement];
    for (const el of primaries) {
      if (!el) continue;
      if (Object.getOwnPropertyNames(el).some((k) => k.startsWith("__reactFiber") || k.startsWith("__reactContainer") || k.startsWith("__reactInternals"))) {
        reactFiberEl = el;
        break;
      }
    }
    if (!reactFiberEl) {
      const allEls = document.querySelectorAll("*");
      for (let i = 0; i < Math.min(allEls.length, 200) && !reactFiberEl; i++) {
        const el = allEls[i];
        if (Object.getOwnPropertyNames(el).some((k) => k.startsWith("__reactFiber") || k.startsWith("__reactContainer") || k.startsWith("__reactInternals"))) {
          reactFiberEl = el;
        }
      }
    }
  } catch {
  }
  const hasReactDom = !!reactFiberEl;
  const hasReact = hasReactHook || hasReactGlobal || hasReactDom;
  const hasAngularGlobal = !!(w.ng || w.getAllAngularRootElements);
  const hasAngularVersion = !!document.querySelector("[ng-version]");
  let ngContextEl = null;
  try {
    const candidates = document.querySelectorAll("*");
    for (let i = 0; i < Math.min(candidates.length, 200) && !ngContextEl; i++) {
      const el = candidates[i];
      if (Object.getOwnPropertyNames(el).some((k) => k === "__ngContext" || k === "__ngHost" || k.startsWith("__ngContext"))) {
        ngContextEl = el;
      }
    }
  } catch {
  }
  const hasAngularIvy = !!ngContextEl;
  const hasAngular = hasAngularGlobal || hasAngularVersion || hasAngularIvy;
  const hasNuxt = !!(w.useNuxtApp || w.app && Object.values(w.app ?? {}).some((ai) => ai?.appContext));
  const hasVue = !!(w.Vue || w.__vue_app__ || w.__VUE_DEVTOOLS_GLOBAL_HOOK__ || hasNuxt);
  const framework = hasNuxt ? "nuxt" : hasReact ? "react" : hasAngular ? "angular" : hasVue ? "vue" : "unknown";
  if (!hasReact && hasAngular) {
    const targetEl = ngContextEl ?? document.querySelector("[ng-version]") ?? document.body;
    try {
      const ngRuntime = w.ng ?? {};
      const comp = typeof ngRuntime.getComponent === "function" ? ngRuntime.getComponent(targetEl) : typeof ngRuntime.getOwningComponent === "function" ? ngRuntime.getOwningComponent(targetEl) : null;
      if (!comp) {
        return JSON.stringify({
          ok: false,
          error: "angular_no_component",
          framework: "angular",
          hasAngularGlobal,
          hasAngularIvy,
          notableGlobals: notableGlobals.slice(0, 30)
        });
      }
      const sectKeys = ["sections", "rows", "elements", "blocks", "steps", "content", "nodes"];
      let sectKey = "";
      for (const k of sectKeys) {
        if (Array.isArray(comp[k]) && comp[k].length > 0) {
          sectKey = k;
          break;
        }
      }
      if (!sectKey) {
        return JSON.stringify({
          ok: false,
          error: "angular_no_sections_on_component",
          framework: "angular",
          componentKeys: Object.keys(comp).slice(0, 30),
          notableGlobals: notableGlobals.slice(0, 20)
        });
      }
      const existing = comp[sectKey];
      let testSection2;
      try {
        testSection2 = JSON.parse(JSON.stringify(existing[0]));
        testSection2.id = "cl_test_" + Date.now();
        testSection2.label = "CloneLevel Test Insert";
      } catch {
        testSection2 = { id: "cl_test_" + Date.now(), type: "section", label: "CloneLevel Test Insert", rows: [] };
      }
      comp[sectKey] = [...existing, testSection2];
      if (typeof ngRuntime.applyChanges === "function") {
        ngRuntime.applyChanges(comp);
      }
      return JSON.stringify({
        ok: true,
        method: "angular_ng_component",
        sectionsKey: sectKey,
        countBefore: existing.length,
        countAfter: existing.length + 1,
        framework: "angular"
      });
    } catch (e) {
      return JSON.stringify({
        ok: false,
        error: "angular_inject_threw: " + String(e).slice(0, 100),
        framework: "angular",
        notableGlobals: notableGlobals.slice(0, 30)
      });
    }
  }
  if (!hasReact && hasNuxt) {
    let revexFound = false;
    let globalPropsKeys = [];
    let payloadKeys = [];
    try {
      for (const ai of Object.values(w.app ?? {})) {
        const gp = ai?.appContext?.config?.globalProperties ?? {};
        globalPropsKeys = Object.keys(gp).slice(0, 30);
        const r = gp.revexBackendService;
        if (r && (typeof r.get === "function" || typeof r.post === "function")) {
          revexFound = true;
          break;
        }
      }
      if (w.useNuxtApp) {
        const na = w.useNuxtApp();
        payloadKeys = Object.keys(na?.payload?.data ?? {}).slice(0, 20);
      }
    } catch {
    }
    return JSON.stringify({
      ok: revexFound,
      framework: "nuxt",
      method: revexFound ? "nuxt_revex_ready" : "nuxt_no_revex",
      error: revexFound ? void 0 : "revexBackendService_not_found \u2014 use Copy/Paste buttons",
      revexFound,
      globalPropsKeys,
      payloadKeys,
      notableGlobals: notableGlobals.slice(0, 20)
    });
  }
  if (!hasReact) {
    return JSON.stringify({
      ok: false,
      error: "no_react_detected",
      framework,
      hasAngular,
      hasAngularGlobal,
      hasAngularVersion,
      hasAngularIvy,
      hasNuxt,
      hasVue,
      hasReactHook,
      hasReactGlobal,
      hasReactDom,
      notableGlobals: notableGlobals.slice(0, 40)
    });
  }
  const roots = [];
  try {
    const hook = w.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook?.renderers) {
      for (const [, renderer] of hook.renderers) {
        try {
          const rootSet = typeof renderer.getFiberRoots === "function" ? renderer.getFiberRoots() : /* @__PURE__ */ new Set();
          for (const root of rootSet) {
            if (root?.current) roots.push(root.current);
          }
        } catch {
        }
      }
    }
    if (hook?._roots) {
      for (const root of hook._roots) {
        if (root?.current) roots.push(root.current);
      }
    }
  } catch {
  }
  try {
    const scanTargets = [document.body, document.documentElement];
    const allEls = document.querySelectorAll("*");
    for (let i = 0; i < Math.min(allEls.length, 200); i++) scanTargets.push(allEls[i]);
    for (const el of scanTargets) {
      if (!el) continue;
      const fk = Object.getOwnPropertyNames(el).find((k) => k.startsWith("__reactFiber") || k.startsWith("__reactContainer") || k.startsWith("__reactInternals"));
      if (fk) {
        const f = el[fk];
        if (f) roots.push(f.child ?? f.stateNode ?? f);
      }
    }
  } catch {
  }
  if (roots.length === 0) {
    return JSON.stringify({
      ok: false,
      error: "no_fiber_roots_found",
      framework,
      hasReactHook,
      hasReactGlobal,
      hasReactDom,
      notableGlobals: notableGlobals.slice(0, 40)
    });
  }
  const SECTION_KEYS = ["sections", "rows", "elements", "blocks", "steps", "content", "nodes"];
  function looksLikeSections(arr) {
    if (!arr.length || typeof arr[0] !== "object") return false;
    const item = arr[0];
    return !!(item.rows != null || item.elements != null || item.cols != null || item.type === "section" || item.type === "row" || item.id && (item.type || item.label || item.name));
  }
  function walkFiber(fiber, depth) {
    if (!fiber || depth > 120) return null;
    if (fiber.stateNode?.setState && fiber.stateNode?.state && typeof fiber.stateNode.state === "object" && !Array.isArray(fiber.stateNode.state)) {
      const s = fiber.stateNode.state;
      for (const k of SECTION_KEYS) {
        if (Array.isArray(s[k]) && looksLikeSections(s[k])) {
          return { stateType: "class", fiber, sectionsKey: k, sections: s[k] };
        }
      }
    }
    if (fiber.memoizedState) {
      let hook = fiber.memoizedState;
      while (hook) {
        const ms = hook.memoizedState;
        if (Array.isArray(ms) && looksLikeSections(ms)) {
          return { stateType: "hook", fiber, hookNode: hook, sections: ms };
        }
        if (ms && typeof ms === "object" && !Array.isArray(ms)) {
          for (const k of SECTION_KEYS) {
            if (Array.isArray(ms[k]) && looksLikeSections(ms[k])) {
              return { stateType: "hook", fiber, hookNode: hook, sections: ms[k] };
            }
          }
        }
        hook = hook.next;
      }
    }
    return walkFiber(fiber.child, depth + 1) || walkFiber(fiber.sibling, depth + 1);
  }
  let target = null;
  for (const root of roots) {
    target = walkFiber(root, 0);
    if (target) break;
  }
  if (!target) {
    let collectStateKeys2 = function(fiber, depth) {
      if (!fiber || depth > 4) return;
      if (fiber.stateNode?.state && typeof fiber.stateNode.state === "object") {
        stateSnapshot.push("class:" + Object.keys(fiber.stateNode.state).join(","));
      }
      if (fiber.memoizedState) {
        const types = [];
        let h = fiber.memoizedState;
        while (h) {
          types.push(typeof h.memoizedState + (Array.isArray(h.memoizedState) ? "[" + h.memoizedState.length + "]" : ""));
          h = h.next;
        }
        if (types.length) stateSnapshot.push("hooks:" + types.join("|"));
      }
      collectStateKeys2(fiber.child, depth + 1);
      collectStateKeys2(fiber.sibling, depth + 1);
    };
    var collectStateKeys = collectStateKeys2;
    const stateSnapshot = [];
    for (const root of roots.slice(0, 2)) collectStateKeys2(root, 0);
    return JSON.stringify({
      ok: false,
      error: "no_sections_in_fiber_state",
      framework,
      rootsFound: roots.length,
      stateSnapshot: stateSnapshot.slice(0, 10)
    });
  }
  let testSection;
  try {
    let patchNodeText2 = function(node, ttl) {
      if (!node || typeof node !== "object" || ttl <= 0) return;
      if (typeof node.content === "string") {
        node.content = "CloneLevel Test";
        return;
      }
      if (typeof node.text === "string") {
        node.text = "CloneLevel Test";
        return;
      }
      if (typeof node.value === "string") {
        node.value = "CloneLevel Test";
        return;
      }
      for (const k of ["children", "elements", "rows", "cols", "columns"]) {
        if (Array.isArray(node[k])) node[k].forEach((c) => patchNodeText2(c, ttl - 1));
      }
    };
    var patchNodeText = patchNodeText2;
    testSection = JSON.parse(JSON.stringify(target.sections[0]));
    testSection.id = "cl_test_" + Date.now();
    testSection.label = "CloneLevel Test Insert";
    patchNodeText2(testSection, 4);
  } catch {
    testSection = { id: "cl_test_" + Date.now(), type: "section", label: "CloneLevel Test Insert", rows: [] };
  }
  const newSections = [...target.sections, testSection];
  if (target.stateType === "class") {
    try {
      target.fiber.stateNode.setState({ [target.sectionsKey]: newSections });
      try {
        target.fiber.stateNode.forceUpdate?.();
      } catch {
      }
      return JSON.stringify({
        ok: true,
        method: "fiber_class_setState",
        sectionsKey: target.sectionsKey,
        countBefore: target.sections.length,
        countAfter: newSections.length,
        framework
      });
    } catch (e) {
      return JSON.stringify({
        ok: false,
        error: "class_setState_threw: " + String(e).slice(0, 100),
        method: "fiber_class_setState",
        framework
      });
    }
  }
  const hookNode = target.hookNode;
  const dispatch = typeof hookNode?.queue?.dispatch === "function" ? hookNode.queue.dispatch : typeof hookNode?.queue?.dispatchSetState === "function" ? hookNode.queue.dispatchSetState : null;
  if (!dispatch) {
    try {
      hookNode.memoizedState = newSections;
      if (hookNode.baseState !== void 0) hookNode.baseState = newSections;
      const ReactDOM = w.ReactDOM ?? w.__reactDom;
      if (typeof ReactDOM?.flushSync === "function") {
        ReactDOM.flushSync(() => {
        });
      }
      return JSON.stringify({
        ok: "maybe",
        method: "fiber_hook_memoizedState_mutate",
        framework,
        countBefore: target.sections.length,
        countAfter: newSections.length,
        warning: "no_dispatch_fn \u2014 mutated memoizedState directly, render not guaranteed"
      });
    } catch (e) {
      return JSON.stringify({
        ok: false,
        error: "no_hook_dispatch: " + String(e).slice(0, 80),
        hookQueueKeys: Object.keys(hookNode?.queue ?? {}).join(","),
        framework
      });
    }
  }
  try {
    dispatch(newSections);
    return JSON.stringify({
      ok: true,
      method: "fiber_hook_dispatch",
      countBefore: target.sections.length,
      countAfter: newSections.length,
      framework
    });
  } catch (e) {
    return JSON.stringify({
      ok: false,
      error: "hook_dispatch_threw: " + String(e).slice(0, 100),
      method: "fiber_hook_dispatch",
      framework
    });
  }
}
function _nuxtGetFunnelInfoFunc() {
  const w = window;
  try {
    if (!w.useNuxtApp) {
      const appEntry = Object.values(w.app ?? {})[0];
      if (!appEntry?.appContext) {
        return JSON.stringify({ ok: false, error: "not_nuxt", hasApp: !!w.app });
      }
    }
    const nuxtApp = w.useNuxtApp ? w.useNuxtApp() : null;
    if (!nuxtApp) return JSON.stringify({ ok: false, error: "useNuxtApp_returned_null" });
    const payloadData = nuxtApp?.payload?.data ?? nuxtApp?._data ?? {};
    const keys = Object.keys(payloadData);
    let data = null;
    for (const k of keys) {
      const v = payloadData[k];
      if (v && typeof v === "object" && (v.funnelId || v.funnel_id)) {
        data = v;
        break;
      }
    }
    if (!data) {
      return JSON.stringify({
        ok: false,
        error: "no_funnel_in_payload",
        payloadKeys: keys.slice(0, 20)
      });
    }
    return JSON.stringify({
      ok: true,
      funnelId: data.funnelId ?? data.funnel_id,
      funnelName: data.funnelName ?? data.funnel_name ?? "",
      locationId: data.locationId ?? data.location_id ?? "",
      pageId: data.pageId ?? data.page_id ?? "",
      stepId: data.stepId ?? data.step_id ?? "",
      pageName: data.pageName ?? data.page_name ?? "",
      pageUrl: data.pageUrl ?? data.page_url ?? ""
    });
  } catch (e) {
    return JSON.stringify({ ok: false, error: "nuxtGetFunnelInfo_threw: " + String(e).slice(0, 120) });
  }
}
async function _revexGetBuilderInfoFunc(builderId) {
  const w = window;
  try {
    const appMap = w.app ?? {};
    let revex = null;
    for (const ai of Object.values(appMap)) {
      const r = ai?.appContext?.config?.globalProperties?.revexBackendService;
      if (r && (typeof r.get === "function" || typeof r.post === "function")) {
        revex = r;
        break;
      }
    }
    if (!revex) {
      return JSON.stringify({
        ok: false,
        error: "revexBackendService_not_found",
        appKeys: Object.keys(appMap)
      });
    }
    const resp = await revex.get(`https://backend.leadconnectorhq.com/funnels/page/${builderId}`);
    const data = resp?.data ?? resp;
    return JSON.stringify({
      ok: true,
      funnelId: data?.funnelId ?? data?.funnel_id,
      stepId: data?.stepId ?? data?.step_id,
      locationId: data?.locationId ?? data?.location_id,
      pageId: data?.pageId ?? data?.page_id,
      raw: JSON.stringify(data).slice(0, 400)
    });
  } catch (e) {
    return JSON.stringify({ ok: false, error: "_revexGetBuilderInfo_threw: " + String(e).slice(0, 140) });
  }
}
async function _revexCloneFunnelStepFunc(req) {
  const w = window;
  try {
    const appEl = document.querySelector("#app");
    const revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
    if (!revex) {
      return JSON.stringify({ ok: false, error: "revexBackendService_not_found \u2014 open the HL page builder tab" });
    }
    let userId = "";
    try {
      if (typeof w.AppUtils !== "undefined" && w.AppUtils?.Utilities?.getCurrentUser) {
        const u = await w.AppUtils.Utilities.getCurrentUser();
        userId = u?.id ?? u?.userId ?? "";
      }
    } catch (_) {
    }
    const payload = {
      funnelId: req.destFunnelId,
      funnelIdToImport: req.sourceFunnelId,
      funnels: [req.destFunnelId],
      locationId: req.locationId,
      pageIndexToImport: "0",
      pageIndexToImportInto: "0",
      stepId: req.sourceStepId,
      stepIdToImportInto: req.destStepId
    };
    if (userId) payload.userId = userId;
    const response = await revex.post(
      "https://backend.leadconnectorhq.com/funnels/funnel/clone-funnel-step/",
      payload
    );
    const data = response?.data ?? response;
    const status = typeof response?.status === "number" ? response.status : typeof data?.status === "number" ? data.status : 0;
    if (status >= 400) {
      return JSON.stringify({
        ok: false,
        error: `HTTP ${status}: ` + (data?.message ?? data?.response ?? "server error"),
        raw: JSON.stringify(data).slice(0, 300),
        payload: JSON.stringify(payload).slice(0, 300)
      });
    }
    const ok = !data?.status || data?.status === "ok" || status < 300;
    return JSON.stringify({ ok, status, raw: JSON.stringify(data).slice(0, 400) });
  } catch (e) {
    return JSON.stringify({ ok: false, error: "_revexCloneFunnelStep_threw: " + String(e).slice(0, 140) });
  }
}
function _refreshBuilderIframeFunc() {
  try {
    const iframe = document.querySelector('iframe[name="funnel-builder"]');
    if (!iframe) return JSON.stringify({ ok: false, error: "no_iframe_name_funnel-builder" });
    iframe.src = iframe.src;
    return JSON.stringify({ ok: true, src: iframe.src.slice(0, 80) });
  } catch (e) {
    return JSON.stringify({ ok: false, error: String(e).slice(0, 100) });
  }
}
function _detectCmsFunc() {
  const w = window;
  function metaGen() {
    const el = document.querySelector('meta[name="generator"]');
    return (el?.content ?? "").toLowerCase();
  }
  if (w.attribution?.locationId) return "HighLevel";
  if (/page-builder\.leadconnectorhq\.com/.test(location.hostname)) return "HighLevel";
  if (w.wp?.blocks || w.wpApiSettings || metaGen().includes("wordpress")) return "WordPress";
  if (w.Shopify?.shop || typeof w.Shopify === "object") return "Shopify";
  if (w.Webflow || metaGen().includes("webflow") || document.body?.hasAttribute?.("data-wf-site")) return "Webflow";
  if (w.Y?.config?.squarespace || document.querySelector("[data-config-node='squarespace']") || metaGen().includes("squarespace")) return "Squarespace";
  if (w.wixBiSession || document.querySelector('meta[name="generator"][content*="Wix"]') || metaGen().includes("wix")) return "Wix";
  if (w.__framerIsBrowser || metaGen().includes("framer")) return "Framer";
  if (w._hsq || document.querySelector(".hs-form")) return "HubSpot";
  if (typeof w.useNuxtApp === "function" || w.__NUXT__) return "Nuxt.js";
  if (w.__NEXT_DATA__) return "Next.js";
  if (metaGen().includes("ghost")) return "Ghost";
  if (w.Drupal || metaGen().includes("drupal")) return "Drupal";
  return "Web";
}
async function _fetchGhlFunnelStepsFunc(funnelId) {
  const w = window;
  const BASE = "https://backend.leadconnectorhq.com";
  function getRevex() {
    return w.document?.querySelector?.("#app")?.__vue_app__?.config.globalProperties?.revexBackendService ?? w.Object?.values?.(w.app ?? {})?.[0]?.appContext?.config?.globalProperties?.revexBackendService ?? null;
  }
  try {
    const revex = getRevex();
    if (!revex) return JSON.stringify({ ok: false, error: "no-revex" });
    const res = await revex.get(`${BASE}/funnels/funnel/fetch/${funnelId}`);
    const body = res?.data?.data ?? res?.data ?? {};
    const funnel = body.funnel ?? body;
    const rawSteps = Array.isArray(funnel.steps) ? funnel.steps : Array.isArray(body.steps) ? body.steps : [];
    const steps = rawSteps.sort((a, b) => (a.sequence ?? a.index ?? a.order ?? 0) - (b.sequence ?? b.index ?? b.order ?? 0)).map((s, i) => ({
      id: s.id ?? s._id ?? `step-${i}`,
      name: s.name ?? s.stepName ?? `Step ${i + 1}`,
      url: s.url ?? s.path ?? "",
      sequence: s.sequence ?? s.index ?? s.order ?? i,
      stepType: s.stepType ?? s.type ?? "",
      products: (s.products ?? []).length,
      splitUrl: s.splitUrl ?? "",
      splitName: s.splitName ?? ""
    }));
    return JSON.stringify({
      ok: true,
      funnelId,
      funnelName: funnel.name ?? funnel.funnelName ?? "Funnel",
      domain: funnel.domain ?? funnel.customDomain ?? "",
      steps
    });
  } catch (err) {
    return JSON.stringify({ ok: false, error: String(err).slice(0, 200) });
  }
}
function _lookupGhlPageByDomainFunc(sourceDomain, sourcePath) {
  return (async () => {
    const w = window;
    const BASE = "https://backend.leadconnectorhq.com";
    const log2 = [];
    function getRevex() {
      return w.document?.querySelector?.("#app")?.__vue_app__?.config.globalProperties?.revexBackendService ?? w.Object?.values?.(w.app ?? {})?.[0]?.appContext?.config?.globalProperties?.revexBackendService ?? null;
    }
    try {
      let domainCandidates2 = function(f) {
        const vals = [];
        for (const key of ["domain", "customDomain", "domainName", "funnelUrl", "url", "siteUrl", "subdomain", "hostname"]) {
          const v = f[key];
          if (!v) continue;
          if (typeof v === "string") vals.push(v);
          else if (typeof v === "object") {
            for (const sub of ["domain", "domainName", "hostname", "url", "name"]) {
              if (typeof v[sub] === "string") vals.push(v[sub]);
            }
          }
        }
        return vals;
      }, extractFunnelId2 = function(f) {
        return f._id ?? f.id ?? f.funnelId ?? f.fid ?? void 0;
      }, extractList2 = function(body) {
        if (Array.isArray(body)) return body;
        const candidates = [
          body?.data?.funnels,
          body?.data?.data?.funnels,
          body?.data?.list,
          body?.data,
          body?.funnels,
          body?.list,
          body?.items
        ];
        for (const c of candidates) {
          if (Array.isArray(c) && c.length > 0) return c;
        }
        return [];
      };
      var domainCandidates = domainCandidates2, extractFunnelId = extractFunnelId2, extractList = extractList2;
      const revex = getRevex();
      if (!revex) return JSON.stringify({ ok: false, error: "no-revex" });
      const locMatch = window.location.href.match(/\/location(?:s)?\/([A-Za-z0-9_-]{6,})/i);
      const locationId = locMatch?.[1] ?? "";
      log2.push(`locationId=${locationId || "(none)"}`);
      if (!locationId) return JSON.stringify({ ok: false, error: "no-locationId" });
      const normalise = (s) => (s ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase();
      const needle = normalise(sourceDomain);
      const listEndpoints = [
        `${BASE}/funnels/funnel/?locationId=${locationId}&domain=${encodeURIComponent(sourceDomain)}&limit=20`,
        `${BASE}/funnels/funnel/?locationId=${locationId}&limit=100`,
        `${BASE}/funnels/funnel/list?locationId=${locationId}&limit=100`,
        `${BASE}/funnels/?locationId=${locationId}&limit=100`
      ];
      for (const endpoint of listEndpoints) {
        try {
          const res = await revex.get(endpoint);
          log2.push(`${endpoint.split("?")[0]} \u2192 status=${res?.status}`);
          if (res?.status !== 200) continue;
          const list = extractList2(res.data ?? {});
          if (!list.length) {
            log2.push("empty list");
            continue;
          }
          const firstKeys = Object.keys(list[0] ?? {}).join(",");
          log2.push(`keys=${firstKeys.slice(0, 80)}`);
          let matched = list.find((f) => {
            return domainCandidates2(f).some((v) => normalise(v) === needle || normalise(v).includes(needle));
          });
          if (!matched) {
            const domainRoot = needle.replace(/^www\./, "").split(".")[0];
            matched = list.find(
              (f) => (f.name ?? f.funnelName ?? "").toLowerCase().includes(domainRoot)
            );
            if (matched) log2.push(`name-fallback matched: ${matched.name ?? matched.funnelName}`);
          }
          if (!matched) {
            const firstDomains = domainCandidates2(list[0]).join("|") || "(none)";
            log2.push(`no match in ${list.length} funnels \u2014 first domains: ${firstDomains}`);
            continue;
          }
          const funnelId = extractFunnelId2(matched);
          log2.push(`matched funnel id=${funnelId} name=${matched.name ?? matched.funnelName}`);
          const fetchRes = await revex.get(`${BASE}/funnels/funnel/fetch/${funnelId}`);
          const fetchBody = fetchRes?.data?.data ?? fetchRes?.data ?? {};
          const steps = fetchBody.steps ?? [];
          if (!steps.length) return JSON.stringify({ ok: false, error: "no-steps", log: log2.join("|") });
          const normPath = (sourcePath || "/").replace(/\/$/, "").toLowerCase() || "/";
          let step = steps.find((s) => {
            const su = (s.url ?? "").replace(/\/$/, "").toLowerCase();
            return su && (normPath.includes(su) || su.includes(normPath));
          }) ?? steps[0];
          return JSON.stringify({
            ok: true,
            funnelId,
            stepId: step.id,
            stepName: step.name,
            locationId,
            log: log2.join("|")
          });
        } catch (err) {
          log2.push(`${endpoint.split("?")[0]} threw: ${String(err).slice(0, 60)}`);
        }
      }
      return JSON.stringify({ ok: false, error: "not-found", domain: sourceDomain, log: log2.join("|") });
    } catch (outerErr) {
      return JSON.stringify({ ok: false, error: String(outerErr).slice(0, 100), log: log2.join("|") });
    }
  })();
}
function _extractGhlMetadataFunc() {
  const w = window;
  const log2 = [];
  function extractIds(str, source) {
    const fm = str.match(/"funnelId"\s*:\s*"([A-Za-z0-9_\-]{8,40})"/);
    const sm = str.match(/"stepId"\s*:\s*"([A-Za-z0-9_\-]{8,40})"/);
    if (fm && sm) {
      const lm = str.match(/"locationId"\s*:\s*"([A-Za-z0-9_\-]{8,40})"/);
      return JSON.stringify({
        isGhlPage: true,
        funnelId: fm[1],
        stepId: sm[1],
        locationId: lm?.[1] ?? w.attribution?.locationId ?? "",
        source,
        debugLog: log2.join(" | ")
      });
    }
    return null;
  }
  try {
    const locationId = w.attribution?.locationId ?? "";
    log2.push(`attr.locationId=${locationId || "(none)"}`);
    if (typeof w.useNuxtApp === "function") {
      log2.push("useNuxtApp=available");
      try {
        const nuxt = w.useNuxtApp();
        const payload = nuxt?.payload?.data;
        if (payload) {
          const pd = payload.pageData ?? payload.page ?? payload;
          if (pd?.funnelId && pd?.stepId) {
            log2.push("found via useNuxtApp.payload.data.pageData");
            return JSON.stringify({
              isGhlPage: true,
              funnelId: pd.funnelId,
              stepId: pd.stepId,
              locationId: locationId || pd.locationId || "",
              source: "useNuxtApp-pageData",
              debugLog: log2.join(" | ")
            });
          }
          for (const key of Object.keys(payload)) {
            const val = payload[key];
            if (val && typeof val === "object" && val.funnelId && val.stepId) {
              log2.push(`found via useNuxtApp.payload.data.${key}`);
              return JSON.stringify({
                isGhlPage: true,
                funnelId: val.funnelId,
                stepId: val.stepId,
                locationId: locationId || val.locationId || "",
                source: `useNuxtApp-data.${key}`,
                debugLog: log2.join(" | ")
              });
            }
          }
          const hit = extractIds(JSON.stringify(payload), "useNuxtApp-serialized");
          if (hit) return hit;
        } else {
          log2.push(`useNuxtApp payload.data=${payload}`);
        }
      } catch (e) {
        log2.push(`useNuxtApp threw: ${String(e).slice(0, 60)}`);
      }
    } else {
      log2.push("useNuxtApp=not-global");
    }
    if (w.__NUXT__) {
      log2.push("__NUXT__=found");
      const hit = extractIds(JSON.stringify(w.__NUXT__), "__NUXT__");
      if (hit) return hit;
    }
    if (w.__NUXT_DATA__) {
      log2.push("__NUXT_DATA__=found");
      const hit = extractIds(JSON.stringify(w.__NUXT_DATA__), "__NUXT_DATA__-obj");
      if (hit) return hit;
    }
    const inlineScripts = Array.from(document.querySelectorAll("script:not([src])"));
    log2.push(`inline-scripts=${inlineScripts.length}`);
    for (const el of inlineScripts) {
      const content = el.textContent ?? "";
      if (!content.includes("funnelId")) continue;
      log2.push(`script[id=${el.id || "(no-id)"}] contains funnelId`);
      const hit = extractIds(content, `dom-script[id=${el.id || "?"}]`);
      if (hit) return hit;
    }
    const candidates = [
      "pageData",
      "funnel",
      "funnelData",
      "pageInfo",
      "stepData",
      "__GHL__",
      "__HL__",
      "ghlPage",
      "attribution"
    ];
    for (const key of candidates) {
      const val = w[key];
      if (!val || typeof val !== "object") continue;
      if (val.funnelId && val.stepId) {
        log2.push(`found in window.${key}`);
        return JSON.stringify({
          isGhlPage: true,
          funnelId: val.funnelId,
          stepId: val.stepId,
          locationId: locationId || val.locationId || "",
          source: `window.${key}`,
          debugLog: log2.join(" | ")
        });
      }
      if (typeof val === "object") {
        const hit = extractIds(JSON.stringify(val), `window.${key}-deep`);
        if (hit) return hit;
      }
    }
  } catch (outerErr) {
    log2.push(`outer-error: ${String(outerErr).slice(0, 80)}`);
  }
  return JSON.stringify({ isGhlPage: false, debugLog: log2.join(" | ") });
}
async function _cloneFromGhlCaptureFunc(sourceFunnelId, sourceStepId, destPageId, destLocationId) {
  const w = window;
  const BASE = "https://backend.leadconnectorhq.com";
  const appEl = document.querySelector("#app");
  const revex = appEl?.__vue_app__?.config?.globalProperties?.revexBackendService ?? null;
  if (!revex) return JSON.stringify({ ok: false, error: "revexBackendService_not_found \u2014 is this the HL builder tab?" });
  let destData = null;
  try {
    const r = await revex.get(`${BASE}/funnels/page/${destPageId}`);
    destData = r?.data ?? r;
  } catch (e) {
    return JSON.stringify({ ok: false, error: `GET dest page failed: ${e?.response?.status ?? String(e).slice(0, 80)}` });
  }
  const destFunnelId = destData?.funnelId ?? destData?.funnel_id ?? "";
  const destStepId = destData?.stepId ?? destData?.step_id ?? "";
  const resolvedLoc = destLocationId || destData?.locationId || destData?.location_id || "";
  if (!destFunnelId || !destStepId) {
    return JSON.stringify({ ok: false, error: `Could not resolve dest funnelId/stepId from pageData. Keys: ${Object.keys(destData ?? {}).join(",")}` });
  }
  let userId = "";
  try {
    if (typeof w.AppUtils !== "undefined" && w.AppUtils?.Utilities?.getCurrentUser) {
      const u = await w.AppUtils.Utilities.getCurrentUser();
      userId = u?.id ?? u?.userId ?? "";
    }
  } catch (_) {
  }
  const payload = {
    funnelId: destFunnelId,
    funnelIdToImport: sourceFunnelId,
    funnels: [destFunnelId],
    locationId: resolvedLoc,
    pageIndexToImport: "0",
    pageIndexToImportInto: "0",
    stepId: sourceStepId,
    stepIdToImportInto: destStepId
  };
  if (userId) payload.userId = userId;
  try {
    const resp = await revex.post(`${BASE}/funnels/funnel/clone-funnel-step/`, payload);
    const status = resp?.status ?? 0;
    const data = resp?.data ?? resp;
    return JSON.stringify({
      ok: status < 400,
      status,
      data: JSON.stringify(data).slice(0, 200),
      destFunnelId,
      destStepId,
      userId: userId || "(none)",
      strategy: "clone-funnel-step"
    });
  } catch (e) {
    const status = e?.response?.status;
    const data = e?.response?.data;
    return JSON.stringify({
      ok: false,
      status,
      error: `clone-funnel-step HTTP ${status ?? "?"}: ${data?.message ?? String(e).slice(0, 100)}`,
      payload: JSON.stringify(payload).slice(0, 300),
      strategy: "clone-funnel-step"
    });
  }
}

// clonelevel/src/background/message-router.ts
var MAX_HEADER_BUFFER = 300;
var HEADER_BUFFER_TTL = 10 * 60 * 1e3;
var _headerBuffer = /* @__PURE__ */ new Map();
var VERSION_HEADER_NAMES = /* @__PURE__ */ new Set([
  "version",
  "x-version",
  "x-hl-version",
  "x-build-version",
  "x-app-version",
  "x-client-version",
  "x-api-version"
]);
function hasVersionHeaders(headers) {
  return Object.keys(headers).some((k) => VERSION_HEADER_NAMES.has(k.toLowerCase()));
}
var HL_BEST_REQUEST_KEY = "hl_best_api_request";
function updateHeaderBuffer(url, method, rawHeaders) {
  const now = Date.now();
  for (const [k, v] of _headerBuffer) {
    if (now - v.ts > HEADER_BUFFER_TTL) _headerBuffer.delete(k);
  }
  if (_headerBuffer.size >= MAX_HEADER_BUFFER) {
    const oldest = [..._headerBuffer.entries()].sort((a, b) => a[1].ts - b[1].ts)[0];
    if (oldest) _headerBuffer.delete(oldest[0]);
  }
  const headers = {};
  for (const h of rawHeaders) {
    if (h.name && h.value) headers[h.name.toLowerCase()] = h.value;
  }
  _headerBuffer.set(url, { method: method.toUpperCase(), headers, ts: now });
  const isBackend = url.includes("backend.leadconnectorhq.com") || url.includes("services.leadconnectorhq.com");
  if (isBackend && hasVersionHeaders(headers)) {
    chrome.storage.local.set({ [HL_BEST_REQUEST_KEY]: { url, method: method.toUpperCase(), headers, ts: now } }).catch(() => {
    });
    logger.info(
      "router",
      `updateHeaderBuffer: persisted HL API headers to storage \u2014 url=${url} versionKeys=[${Object.keys(headers).filter((k) => VERSION_HEADER_NAMES.has(k)).join(",")}]`
    );
  }
}
async function getActiveTab() {
  const real = await resolveRealTab();
  if (real) return real;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ?? null;
}
async function sendToContentScript(tabId, message) {
  return chrome.tabs.sendMessage(tabId, message);
}
async function forwardToContentScript(type, payload, sendResponse) {
  try {
    const state = await getInspectorSessionState();
    const targetTabId = state.editorTabId ?? null;
    if (!targetTabId) {
      sendResponse({ ok: false, error: "No editorTabId in session" });
      return;
    }
    const result = await pingContentScript(targetTabId, { type, payload });
    sendResponse({ ok: result?.ok ?? false, data: result?.data, error: result?.error });
  } catch (err) {
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleGetBridgeRawLog(sendResponse) {
  try {
    const state = await getInspectorSessionState();
    const targetTabId = state.editorTabId ?? null;
    if (targetTabId) {
      pingContentScript(targetTabId, { type: "DO_GET_BRIDGE_RAW_LOG" }).catch(() => {
      });
    }
    const res = await chrome.storage.local.get("clonelevel_bridge_raw_log");
    sendResponse({ ok: true, data: res["clonelevel_bridge_raw_log"] ?? null });
  } catch (err) {
    sendResponse({ ok: false, error: String(err) });
  }
}
async function pingContentScript(tabId, message, maxAttempts = 3) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const result = await sendToContentScript(tabId, message);
      return result;
    } catch {
      if (attempt === 0) {
        logger.info("router", "Content script not ready, injecting...");
        await chrome.scripting.executeScript({ target: { tabId }, files: ["content/bootstrap.js"] });
      }
      await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
    }
  }
  return null;
}
var PASTE_SESSION_KEY = "clonelevel_paste_session";
async function ensureBuilderConnection(tabId) {
  try {
    const res = await chrome.tabs.sendMessage(tabId, { type: "PING_BUILDER" });
    if (res?.ok) return { ok: true };
  } catch {
  }
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: ["content/bootstrap.js"] });
  } catch (e) {
    return { ok: false, error: "Could not inject into builder tab. Refresh HighLevel and try again." };
  }
  await new Promise((r) => setTimeout(r, 400));
  try {
    const res2 = await chrome.tabs.sendMessage(tabId, { type: "PING_BUILDER" });
    if (res2?.ok) return { ok: true };
  } catch {
  }
  return { ok: false, error: "Could not connect to the HighLevel builder. Refresh the builder tab and try again." };
}
async function findBuilderTab() {
  const allTabs = await chrome.tabs.query({});
  return allTabs.find((t) => {
    if (!t.url) return false;
    const isHL = /gohighlevel\.com|highlevel\.com|msgsndr\.com|leadconnectorhq\.com|app\.ghl\.io/.test(t.url);
    const isEdit = /\/funnel|\/page-builder|\/builder\/|funnels\/|\/pages\/|funnel-builder|page-editor|site-builder|\/edit\/|\/editor\//.test(t.url);
    return isHL && isEdit;
  }) ?? null;
}
function candidatePriority(url) {
  const u = url.toLowerCase();
  if (u.includes("prebuilt-section")) return 1e3;
  if (u.includes("autosave")) return 800;
  if (u.includes("element-template")) return 600;
  if (u.includes("global-section")) return 400;
  return 0;
}
function sortCandidatesByPriority(cands) {
  return [...cands].sort(
    (a, b) => candidatePriority(b.url) + b.score - (candidatePriority(a.url) + a.score)
  );
}
var FORBIDDEN_REPLAY_HEADERS = /* @__PURE__ */ new Set([
  // Fetch spec forbidden headers
  "accept-charset",
  "accept-encoding",
  "access-control-request-headers",
  "access-control-request-method",
  "connection",
  "content-length",
  "cookie",
  "cookie2",
  "date",
  "dnt",
  "expect",
  "host",
  "keep-alive",
  "origin",
  // browser sets this automatically in MAIN world fetch
  "referer",
  // browser manages
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "via",
  "upgrade-insecure-requests"
  // All headers starting with proxy- or sec- are also forbidden (handled below via prefix check)
]);
function buildReplayHeaders(cand) {
  const captured = {
    ...cand.requestHeaders ?? {},
    ...cand.headers ?? {}
  };
  const headers = {};
  for (const [k, v] of Object.entries(captured)) {
    const kl = k.toLowerCase();
    if (FORBIDDEN_REPLAY_HEADERS.has(kl)) continue;
    if (kl.startsWith("proxy-") || kl.startsWith("sec-")) continue;
    if (!v) continue;
    headers[kl] = v;
  }
  if (!headers["content-type"]) {
    headers["content-type"] = cand.contentType || "application/json";
  }
  return headers;
}
function auditReplayHeaders(headers) {
  const AUTH_KEYS = [
    "authorization",
    "token",
    "x-location-id",
    "x-builder-session-id",
    "x-csrf-token",
    "x-xsrf-token",
    "x-session-id",
    "x-api-key",
    "x-user-id",
    "x-organization-id"
  ];
  const present = AUTH_KEYS.filter((k) => k in headers);
  const missing = AUTH_KEYS.filter((k) => !(k in headers));
  const allKeys = Object.keys(headers).sort().join(", ");
  return `total=${Object.keys(headers).length} [${allKeys}] | Auth V: ${present.length > 0 ? present.join(", ") : "(none)"} | Auth X: ${missing.length > 0 ? missing.join(", ") : "(none)"}`;
}
async function fetchInMainWorld(tabId, frameId, url, method, headers, body) {
  const injectedFunc = async (u, m, h, b) => {
    try {
      const r = await fetch(u, { method: m, headers: h, body: b || void 0, credentials: "include" });
      const text = await r.text().catch(() => "");
      return { ok: r.ok, status: r.status, bodyText: text.slice(0, 2e3) };
    } catch (err) {
      return { ok: false, status: 0, bodyText: String(err) };
    }
  };
  const target = frameId != null ? { tabId, frameIds: [frameId] } : { tabId, allFrames: true };
  const injected = await chrome.scripting.executeScript({
    target,
    world: "MAIN",
    func: injectedFunc,
    args: [url, method, headers, body]
  });
  if (!injected?.length) throw new Error("executeScript returned no results");
  for (const frame of injected) {
    const r = frame.result;
    if (r && r.status > 0) return r;
  }
  const first = injected[0]?.result;
  if (!first) throw new Error("executeScript: all frames returned null");
  return first;
}
async function fetchViaContentScript(tabId, url, method, headers, body) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(
      tabId,
      { type: "REPLAY_MUTATION", payload: { fullUrl: url, method, headers, body } },
      (result) => {
        if (chrome.runtime.lastError || !result) {
          const errMsg = chrome.runtime.lastError?.message ?? "No response from content script";
          logger.warn("router", `fetchViaContentScript: ${errMsg}`);
          resolve({ ok: false, status: 0, bodyText: errMsg });
        } else {
          resolve(result);
        }
      }
    );
  });
}
async function fetchReplayRequest(tabId, frameId, url, method, headers, body) {
  if (tabId) {
    try {
      const r = await fetchInMainWorld(tabId, frameId, url, method, headers, body);
      if (r.status > 0) {
        logger.info("router", `fetchReplayRequest: main-world path \u2192 ${r.status}`);
        return { ...r, fetchPath: "main-world" };
      }
      logger.warn("router", `fetchReplayRequest: main-world got network error (${r.bodyText.slice(0, 80)}), trying content-script`);
    } catch (err) {
      logger.warn("router", `fetchReplayRequest: main-world threw (${err}), trying content-script`);
    }
    try {
      const r = await fetchViaContentScript(tabId, url, method, headers, body);
      if (r.status > 0 || r.ok) {
        logger.info("router", `fetchReplayRequest: content-script path \u2192 ${r.status}`);
        return { ...r, fetchPath: "content-script" };
      }
      logger.warn("router", `fetchReplayRequest: content-script returned network error: ${r.bodyText}`);
    } catch (err) {
      logger.warn("router", `fetchReplayRequest: content-script threw (${err}), falling back`);
    }
  }
  logger.warn("router", "fetchReplayRequest: service-worker fallback (no cookies \u2014 likely 401)");
  try {
    const r = await fetch(url, { method, headers, body });
    const text = await r.text().catch(() => "");
    return { ok: r.ok, status: r.status, bodyText: text.slice(0, 2e3), fetchPath: "service-worker" };
  } catch (err) {
    return { ok: false, status: 0, bodyText: String(err), fetchPath: "service-worker-error" };
  }
}
async function attemptTestSectionReplay(cand, targetTabId, targetFrameId) {
  const bodyStr = cand.requestBody ?? "";
  const headers = buildReplayHeaders(cand);
  const audit = auditReplayHeaders(headers);
  logger.info("router", `test-replay [VERBATIM]: ${cand.method} ${cand.url}`);
  logger.info("router", `test-replay header-audit: ${audit}`);
  logger.info("router", `test-replay body: ${bodyStr.length} bytes verbatim, tabCtx=${!!targetTabId}, frameId=${targetFrameId ?? "auto"}`);
  try {
    const r = await fetchReplayRequest(targetTabId, targetFrameId, cand.url, cand.method, headers, bodyStr);
    const { ok, status, bodyText, fetchPath } = r;
    logger.info("router", `test-replay [${fetchPath}] frame=${targetFrameId ?? "auto"}: response ${status}`, { bodyPreview: bodyText.slice(0, 200) });
    return {
      ok,
      verified: ok,
      message: ok ? `Test section sent (${status}) \u2014 ${cand.method} ${cand.url}` : `Test section rejected (${status}) \u2014 ${bodyText.slice(0, 120)}`,
      status,
      responseBodyPreview: bodyText.slice(0, 400),
      responseSize: bodyText.length,
      requestBodySize: bodyStr.length,
      candidateUrl: cand.url,
      candidateMethod: cand.method,
      fetchPath
    };
  } catch (err) {
    return {
      ok: false,
      verified: false,
      message: `Fetch error: ${String(err).slice(0, 120)}`,
      status: 0,
      responseBodyPreview: "",
      responseSize: 0,
      requestBodySize: bodyStr.length,
      candidateUrl: cand.url,
      candidateMethod: cand.method
    };
  }
}
async function attemptFetchReplay(cand, cap, targetTabId, targetFrameId) {
  let origBody = {};
  try {
    origBody = JSON.parse(cand.requestBody);
  } catch {
    return { ok: false, verified: false, message: "Could not parse original request body as JSON", status: 0, responseBodyPreview: "", responseSize: 0, requestBodySize: 0, candidateUrl: cand.url, candidateMethod: cand.method };
  }
  const SECTION_KEYS = ["sections", "rows", "elements", "columns", "blocks", "nodes", "content", "layout", "steps", "pages"];
  const sectionKey = SECTION_KEYS.find((k) => k in origBody && Array.isArray(origBody[k]));
  const ourSections = (cap.sections ?? []).map((sec, idx) => ({
    id: `cl_${Date.now()}_${idx}`,
    type: "section",
    label: sec.sectionHint || `Imported Section ${idx + 1}`,
    rows: [],
    props: { importedBy: "clonelevel", sourceHint: sec.sectionHint }
  }));
  const newBody = { ...origBody };
  if (sectionKey) {
    newBody[sectionKey] = ourSections;
    logger.info("router", `fetch-replay: replacing "${sectionKey}" with ${ourSections.length} sections`);
  } else {
    newBody["sections"] = ourSections;
    newBody["importedTitle"] = cap.title;
    logger.warn("router", "fetch-replay: no known sections key found \u2014 injecting sections directly");
  }
  if ("title" in origBody || "name" in origBody) {
    const titleKey = "title" in origBody ? "title" : "name";
    newBody[titleKey] = cap.title || origBody[titleKey];
  }
  const bodyStr = JSON.stringify(newBody);
  const headers = buildReplayHeaders(cand);
  const audit = auditReplayHeaders(headers);
  logger.info("router", `fetch-replay [MODIFIED]: ${cand.method} ${cand.url}`);
  logger.info("router", `fetch-replay header-audit: ${audit}`);
  logger.info("router", `fetch-replay body: ${bodyStr.length} bytes (${sectionKey ? `"${sectionKey}" replaced` : "sections injected"}), tabCtx=${!!targetTabId}, frameId=${targetFrameId ?? "auto"}`);
  try {
    const r = await fetchReplayRequest(targetTabId, targetFrameId, cand.url, cand.method, headers, bodyStr);
    const { ok, status, bodyText, fetchPath } = r;
    logger.info("router", `fetch-replay [${fetchPath}] frame=${targetFrameId ?? "auto"}: response ${status}`, { bodyPreview: bodyText.slice(0, 200) });
    return {
      ok,
      verified: ok,
      message: ok ? `API call succeeded (${status}) \u2014 ${cand.method} ${cand.url}. ${sectionKey ? `Replaced "${sectionKey}" with ${ourSections.length} sections.` : ""}` : `API call returned ${status} \u2014 ${cand.method} ${cand.url}. Body: ${bodyText.slice(0, 120)}`,
      status,
      responseBodyPreview: bodyText.slice(0, 400),
      responseSize: bodyText.length,
      requestBodySize: bodyStr.length,
      candidateUrl: cand.url,
      candidateMethod: cand.method,
      fetchPath
    };
  } catch (err) {
    return {
      ok: false,
      verified: false,
      message: `Fetch error: ${String(err).slice(0, 120)}`,
      status: 0,
      responseBodyPreview: "",
      responseSize: 0,
      requestBodySize: 0,
      candidateUrl: cand.url,
      candidateMethod: cand.method
    };
  }
}
function handleMessage(message, sender, sendResponse) {
  const tabId = sender.tab?.id;
  switch (message.type) {
    // ── Prebuilt section body capture ────────────────────────────────────────
    // Sent by bootstrap.ts when the page bridge captures a real builder request
    // to prebuilt-section/sync/changes.  Stored verbatim so PASTE_DIRECT_TO_BUILDER
    // can replay it exactly (control test) before mutating sections.
    case "SAVE_PREBUILT_REQUEST": {
      const pl = message.payload ?? {};
      if (pl.reqBody) {
        const entry = { url: pl.url, method: pl.method, reqBody: pl.reqBody, statusCode: pl.statusCode, ts: pl.ts ?? Date.now() };
        chrome.storage.local.set({ hl_prebuilt_body: entry }).catch(() => {
        });
        logger.info("router", `SAVE_PREBUILT_REQUEST: stored ${pl.reqBody.length} chars from ${pl.url} HTTP ${pl.statusCode}`);
        sendResponse({ ok: true, stored: pl.reqBody.length });
      } else {
        sendResponse({ ok: false, error: "no reqBody in payload" });
      }
      return false;
    }
    case "CONTEXT_DETECTED":
      if (tabId) {
        setTabContext(tabId, message.payload);
        logger.info("router", `Context detected for tab ${tabId}`, message.payload);
        if (message.payload.pageType === "editor-page") {
          patchInspectorSessionState({ editorTabId: tabId }).then((state) => {
            broadcastToInspectors({ type: "STATE_UPDATE", payload: state });
          });
        }
      }
      sendResponse({ ok: true });
      return false;
    // ── Cache per-tab GHL metadata sent by clonelevel-inject.js ──────────────
    // inject.js fires GHL_PAGE_DETECTED at [0,100,300,600,1000,2000]ms on every
    // page load. We cache the best result (one with funnelId+stepId) so that
    // handleCapturePublicPage can use it without re-running executeScript.
    case "GHL_PAGE_DETECTED": {
      if (!tabId) {
        sendResponse({ ok: true });
        return false;
      }
      const ghlPayload = message.payload ?? {};
      if (ghlPayload.isGhlPage && ghlPayload.pageInfo?.funnelId && ghlPayload.pageInfo?.stepId) {
        const cached = {
          funnelId: ghlPayload.pageInfo.funnelId,
          stepId: ghlPayload.pageInfo.stepId,
          locationId: ghlPayload.locationId ?? "",
          source: "inject-detect"
        };
        chrome.storage.session.set({ [`ghl_tab_${tabId}`]: cached }).catch(() => {
        });
        logger.info("router", `GHL_PAGE_DETECTED cached for tab ${tabId}: funnelId=${cached.funnelId} stepId=${cached.stepId}`);
      }
      sendResponse({ ok: true });
      return false;
    }
    case "DETECT_CONTEXT":
      handleDetectContext(sendResponse);
      return true;
    case "GET_SETTINGS":
      getSettings().then((s) => sendResponse({ ok: true, data: s }));
      return true;
    case "UPDATE_SETTINGS":
      saveSettings(message.payload).then((s) => sendResponse({ ok: true, data: s }));
      return true;
    case "GET_LAST_PACKAGE":
      getLastPackage().then((pkg) => sendResponse({ ok: true, data: pkg }));
      return true;
    case "CAPTURE_PUBLIC_PAGE":
      handleCapturePublicPage(sendResponse);
      return true;
    case "CRAWL_FUNNEL":
      handleCrawlFunnel(message.payload, sendResponse);
      return true;
    case "EXPORT_FUNNEL_MAP":
      getLastFunnelMap().then((m) => sendResponse({ ok: true, data: m }));
      return true;
    // ── FETCH_GHL_FUNNEL_MAP ──────────────────────────────────────────────────
    // Fetches all steps of a GHL funnel via revex, using the funnelId from:
    //   1. Message payload (explicit)
    //   2. Current tab GHL detection cache (from inject.js)
    //   3. Most recent GHL capture in the library
    case "FETCH_GHL_FUNNEL_MAP": {
      (async () => {
        try {
          let funnelId = message.payload?.funnelId ?? null;
          let locationId = message.payload?.locationId ?? "";
          const payloadDomain = message.payload?.domain ?? "";
          if (!funnelId && payloadDomain) {
            const allTabs2 = await chrome.tabs.query({});
            const hlTab = allTabs2.find(
              (t) => t.url && /page-builder\.leadconnectorhq\.com|app\.gohighlevel\.com/.test(t.url)
            );
            if (hlTab?.id) {
              try {
                const hostname2 = payloadDomain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
                const lookupExec = await chrome.scripting.executeScript({
                  target: { tabId: hlTab.id, frameIds: [0] },
                  world: "MAIN",
                  func: _lookupGhlPageByDomainFunc,
                  args: [hostname2, "/"]
                });
                const lookupRaw = lookupExec?.[0]?.result;
                if (lookupRaw) {
                  const lp = JSON.parse(lookupRaw);
                  if (lp?.ok && lp.funnelId) {
                    funnelId = lp.funnelId;
                    locationId = lp.locationId ?? "";
                    logger.info("router", `FETCH_GHL_FUNNEL_MAP: domain "${hostname2}" \u2192 funnelId=${funnelId}`);
                  } else {
                    sendResponse({ ok: false, error: `Domain not found in this HL account: ${lp?.error ?? "no match"} \u2014 log: ${lp?.log ?? ""}` });
                    return;
                  }
                }
              } catch (lookupErr) {
                logger.warn("router", `domain lookup failed: ${String(lookupErr)}`);
              }
            } else {
              sendResponse({ ok: false, error: "No HighLevel builder tab is open. Open the HL page builder, then try again." });
              return;
            }
          }
          if (!funnelId) {
            const activeTab = await resolveRealTab();
            if (activeTab?.id) {
              const stored = await chrome.storage.session.get(`ghl_tab_${activeTab.id}`);
              const cached = stored[`ghl_tab_${activeTab.id}`];
              if (cached?.funnelId) {
                funnelId = cached.funnelId;
                locationId = cached.locationId ?? "";
              }
            }
          }
          if (!funnelId) {
            const captures = await getPublicCaptures();
            const ghlCap = captures.find((c) => c.isGhlPage && c.ghlFunnelId);
            if (ghlCap) {
              funnelId = ghlCap.ghlFunnelId;
              locationId = ghlCap.ghlLocationId ?? "";
            }
          }
          if (!funnelId) {
            sendResponse({ ok: false, error: "No GHL funnel detected. Open a published GHL funnel page or capture one first, then try again." });
            return;
          }
          const allTabs = await chrome.tabs.query({});
          const builderTab = allTabs.find(
            (t) => t.url && /page-builder\.leadconnectorhq\.com|app\.gohighlevel\.com/.test(t.url)
          );
          if (!builderTab?.id) {
            sendResponse({ ok: false, error: "No HighLevel tab is open. Open the HL page builder, then try again." });
            return;
          }
          logger.info("router", `FETCH_GHL_FUNNEL_MAP: funnelId=${funnelId} via builderTab=${builderTab.id}`);
          const execResult = await chrome.scripting.executeScript({
            target: { tabId: builderTab.id, frameIds: [0] },
            world: "MAIN",
            func: _fetchGhlFunnelStepsFunc,
            args: [funnelId]
          });
          const raw = execResult?.[0]?.result;
          if (!raw) {
            sendResponse({ ok: false, error: "No result returned from HL API" });
            return;
          }
          const parsed = JSON.parse(raw);
          logger.info("router", `FETCH_GHL_FUNNEL_MAP: ok=${parsed.ok} steps=${parsed.steps?.length ?? 0} name=${parsed.funnelName ?? "?"}`);
          sendResponse(parsed.ok ? { ok: true, data: parsed } : { ok: false, error: parsed.error ?? "Fetch failed" });
        } catch (err) {
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    case "EXPORT_ASSET_MANIFEST":
      handleExportAssetManifest(sendResponse);
      return true;
    case "CLEAR_SESSION":
      handleClearSession(sendResponse);
      return true;
    case "CAPTURE_COMPLETE":
      savePackage(message.payload).then(() => {
        addDiagnostic(createDiagnosticEntry("info", "CAPTURE_SAVED", `Package saved for ${message.payload.source.url}`));
        sendResponse({ ok: true });
      });
      return true;
    case "CRAWL_COMPLETE":
      saveFunnelMap(message.payload).then(() => {
        addDiagnostic(createDiagnosticEntry("info", "CRAWL_SAVED", `Funnel map saved: ${message.payload.discoveredPages.length} pages`));
        sendResponse({ ok: true });
      });
      return true;
    case "ENABLE_EDITOR_INSPECTOR":
      handleEnableInspector(sendResponse);
      return true;
    case "DISABLE_EDITOR_INSPECTOR":
      handleDisableInspector(sendResponse);
      return true;
    case "GET_INSPECTOR_SNAPSHOTS":
      getAllSnapshots().then((snapshots) => sendResponse({ ok: true, data: snapshots }));
      return true;
    case "CLEAR_INSPECTOR_SNAPSHOTS":
      clearSnapshots().then(() => {
        broadcastToInspectors({ type: "SNAPSHOTS_CLEARED" });
        sendResponse({ ok: true });
      });
      return true;
    case "GET_INSPECTOR_STATE":
      getInspectorSessionState().then((state) => sendResponse({ ok: true, data: state }));
      return true;
    case "GET_BRIDGE_STATUS":
      handleGetBridgeStatus(sendResponse);
      return true;
    case "INJECT_TEST_SNAPSHOT":
      handleInjectTestSnapshot(sendResponse);
      return true;
    case "ACTIVATE_BRIDGE_DEBUG":
      handleActivateBridgeDebug(sendResponse);
      return true;
    case "ACTIVATE_BRIDGE_FALLBACK":
      handleActivateBridgeFallback(sendResponse);
      return true;
    case "INSPECTOR_BRIDGE_ACK":
      handleInspectorBridgeAck(message.payload, sendResponse);
      return true;
    case "GET_BRIDGE_ACK":
      chrome.storage.local.get("clonelevel_bridge_ack").then(
        (res) => sendResponse({ ok: true, data: res["clonelevel_bridge_ack"] ?? null })
      );
      return true;
    case "INSPECTOR_BRIDGE_BOOTED":
      chrome.storage.local.set({ clonelevel_bridge_boot: message.payload }).then(
        () => sendResponse({ ok: true })
      );
      return true;
    case "INSPECTOR_PING_ACK":
      chrome.storage.local.set({ clonelevel_bridge_ping_ack: message.payload }).then(
        () => sendResponse({ ok: true })
      );
      return true;
    case "GET_BRIDGE_PING_STATUS":
      chrome.storage.local.get(["clonelevel_bridge_boot", "clonelevel_bridge_ping_ack"]).then(
        (res) => sendResponse({ ok: true, data: { boot: res["clonelevel_bridge_boot"] ?? null, pingAck: res["clonelevel_bridge_ping_ack"] ?? null } })
      );
      return true;
    case "PING_BRIDGE_FROM_INSPECTOR":
      handlePingBridgeFromInspector(message.payload, sendResponse);
      return true;
    case "ENABLE_DEBUG_INTERCEPT":
      forwardToContentScript("DO_ENABLE_DEBUG_INTERCEPT", null, sendResponse);
      return true;
    case "DISABLE_DEBUG_INTERCEPT":
      forwardToContentScript("DO_DISABLE_DEBUG_INTERCEPT", null, sendResponse);
      return true;
    case "MARK_SAVE_EVENT":
      forwardToContentScript("DO_MARK_SAVE_EVENT", null, sendResponse);
      return true;
    case "GET_BRIDGE_RAW_LOG":
      handleGetBridgeRawLog(sendResponse);
      return true;
    case "VERIFY_PATCHES":
      forwardToContentScript("DO_VERIFY_PATCHES", null, sendResponse);
      return true;
    case "INSPECTOR_SNAPSHOT_CAPTURED":
      handleSnapshotCaptured(message.payload, sendResponse);
      return true;
    case "CAPTURE_NATIVE_PAGE":
      sendResponse({ ok: false, error: "Native page capture is not yet implemented" });
      return false;
    case "INSPECT_SAVE_PAYLOAD":
      sendResponse({ ok: false, error: "Use ENABLE_EDITOR_INSPECTOR then trigger a save action" });
      return false;
    case "CAPTURE_THUMBNAILS":
      sendResponse({ ok: false, error: "Thumbnail capture is not yet implemented" });
      return false;
    case "ATTACH_DEBUGGER":
      handleAttachDebugger(sendResponse);
      return true;
    case "DETACH_DEBUGGER":
      handleDetachDebugger(sendResponse);
      return true;
    case "GET_DEBUGGER_STATUS":
      getDebuggerStatus().then((s) => sendResponse({ ok: true, data: s }));
      return true;
    case "MARK_SAVE_EVENT_NOW":
      setSaveMarkNow().then((ts2) => sendResponse({ ok: true, data: { ts: ts2 } }));
      return true;
    case "CLEAR_SAVE_MARK":
      clearSaveMark().then(() => sendResponse({ ok: true }));
      return true;
    case "EXTRACT_STATE":
      handleExtractState(message.payload?.tabId ?? null, sendResponse);
      return true;
    case "GET_STATE_EXTRACTS":
      getStateExtracts().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "CLEAR_STATE_EXTRACTS":
      clearStateExtracts().then(() => sendResponse({ ok: true }));
      return true;
    case "GET_PAGE_SCHEMAS":
      getPageSchemas().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "GET_FUNNEL_SCHEMAS":
      getFunnelSchemas().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "GET_SAVE_EVENTS":
      getSaveEvents().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "CLEAR_SCHEMA_STORE":
      clearSchemaStore().then(() => sendResponse({ ok: true }));
      return true;
    case "GET_FUNNEL_PACKAGE":
      buildFunnelPackage(message.payload.funnelId).then(
        (pkg) => sendResponse({ ok: !!pkg, data: pkg, error: pkg ? void 0 : "Funnel not found" })
      );
      return true;
    case "FETCH_PAGE_LAYOUT":
      fetchAndStorePageLayout(message.payload.pageId).then(
        (result) => sendResponse(
          result ? { ok: true, data: result.layout } : { ok: false, error: "No pageDataDownloadUrl found for this page \u2014 the schema may not include one" }
        )
      ).catch(
        (err) => sendResponse({ ok: false, error: String(err) })
      );
      return true;
    case "GET_IMPORT_CANDIDATES":
      getImportCandidates().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "CLEAR_IMPORT_CANDIDATES":
      clearImportCandidates().then(() => sendResponse({ ok: true }));
      return true;
    case "SAVE_IMPORT_CANDIDATES": {
      (async () => {
        try {
          const incoming = message.payload?.candidates ?? [];
          if (!incoming.length) {
            sendResponse({ ok: true, saved: 0 });
            return;
          }
          const existing = await getImportCandidates();
          const byId = new Map(existing.map((c) => [c.id, c]));
          for (const c of incoming) {
            const prev = byId.get(c.id);
            if (!prev || c.score >= prev.score) byId.set(c.id, c);
          }
          const merged = [...byId.values()].sort((a, b) => b.score - a.score).slice(0, 50);
          await chrome.storage.local.set({ clonelevel_import_candidates: merged });
          sendResponse({ ok: true, saved: incoming.length, total: merged.length });
        } catch (err) {
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    case "GET_LEARN_SESSIONS":
      getLearnSessions().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "SAVE_LEARN_SESSION":
      saveLearnSession(message.payload).then(() => sendResponse({ ok: true }));
      return true;
    case "CLEAR_LEARN_SESSIONS":
      clearLearnSessions().then(() => sendResponse({ ok: true }));
      return true;
    case "GET_IMPORT_TARGET":
      getImportTarget().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "SET_IMPORT_TARGET":
      setImportTarget({
        tabId: message.payload.tabId,
        tabUrl: message.payload.tabUrl,
        pageId: message.payload.pageId,
        funnelId: message.payload.funnelId,
        builderDetected: message.payload.builderDetected,
        detectedAt: (/* @__PURE__ */ new Date()).toISOString()
      }).then(() => sendResponse({ ok: true }));
      return true;
    case "GET_ALL_ASSETS":
      getAllAssets().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "CLEAR_ASSETS":
      clearAssets().then(() => sendResponse({ ok: true }));
      return true;
    case "SCAN_PAGE_ASSETS": {
      const pid = message.payload?.pageId;
      if (!pid) {
        sendResponse({ ok: false, error: "pageId required" });
        return false;
      }
      getPageSchemas().then(async (pages) => {
        const pg = pages.find((p) => p.pageId === pid);
        if (!pg || !pg.pageLayout) {
          sendResponse({ ok: false, error: "Page or layout not found" });
          return;
        }
        const count = await scanPageLayoutForAssets(pg);
        sendResponse({ ok: true, data: { count } });
      });
      return true;
    }
    case "REBUILD_ASSET_STORE":
      getPageSchemas().then(async (pages) => {
        const count = await rebuildAssetStore(pages);
        sendResponse({ ok: true, data: { count } });
      });
      return true;
    // ── Global Sections ────────────────────────────────────────────────────────
    case "GET_GLOBAL_SECTIONS":
      getGlobalSections().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "CLEAR_GLOBAL_SECTIONS":
      clearGlobalSections().then(() => sendResponse({ ok: true }));
      return true;
    // ── Theme Settings ─────────────────────────────────────────────────────────
    case "GET_THEME_SETTINGS":
      getThemeSettings().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "CLEAR_THEME_SETTINGS":
      clearThemeSettings().then(() => sendResponse({ ok: true }));
      return true;
    // ── Templates ──────────────────────────────────────────────────────────────
    case "GET_TEMPLATES":
      getTemplates().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "CLEAR_TEMPLATES":
      clearTemplates().then(() => sendResponse({ ok: true }));
      return true;
    // ── Clear all global store ─────────────────────────────────────────────────
    case "CLEAR_GLOBAL_STORE":
      clearGlobalStore().then(() => sendResponse({ ok: true }));
      return true;
    // ── Full Clone Package (upgraded v2 format) ────────────────────────────────
    case "GET_FULL_CLONE_PACKAGE": {
      const fid = message.payload?.funnelId;
      Promise.all([buildFullClonePackage(fid), getAllAssets()]).then(([pkg, assets]) => {
        pkg.assets = assets;
        sendResponse({ ok: true, data: pkg });
      });
      return true;
    }
    // ── Export as Template ─────────────────────────────────────────────────────
    case "EXPORT_AS_TEMPLATE": {
      const fid2 = message.payload?.funnelId;
      Promise.all([buildFullClonePackage(fid2), getAllAssets()]).then(([pkg, assets]) => {
        pkg.assets = assets;
        pkg.sourceType = "template";
        const name = message.payload?.name;
        const exportBlob = JSON.stringify({ templateName: name ?? "CloneLevel Template", package: pkg }, null, 2);
        sendResponse({ ok: true, data: { size: exportBlob.length, json: exportBlob } });
      });
      return true;
    }
    // ── Public Clone ───────────────────────────────────────────────────────────
    case "GET_CURRENT_TAB_INFO": {
      (async () => {
        try {
          const tab = await resolveRealTab();
          if (!tab?.id || !tab.url || !isRealUrl(tab.url)) {
            sendResponse({ ok: true, data: null });
            return;
          }
          const url = tab.url ?? "";
          const title = tab.title ?? "";
          const favIconUrl = tab.favIconUrl ?? "";
          const isHighLevel = /gohighlevel\.com|highlevel\.com|msgsndr\.com|leadconnectorhq\.com|app\.ghl\.io/.test(url);
          const isEditor = isHighLevel && /\/funnel|\/page-builder|\/builder\/|funnels\/|\/pages\/|funnel-builder|page-editor|site-builder|\/edit\/|\/editor\//.test(url);
          sendResponse({ ok: true, data: { tabId: tab.id, url, title, favIconUrl, isHighLevel, isEditor } });
        } catch (err) {
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    case "CLONE_PUBLIC_PAGE": {
      (async () => {
        try {
          const tab = await resolveRealTab();
          if (!tab?.id) {
            sendResponse({ ok: false, error: "No active tab found. Navigate to a public page in your browser, then try again." });
            return;
          }
          if (!tab.url || !isRealUrl(tab.url)) {
            sendResponse({ ok: false, error: "Cannot scrape browser or extension pages. Open a public website first." });
            return;
          }
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const url = window.location.href;
              const title = document.title || "";
              const desc = document.querySelector('meta[name="description"]')?.content ?? "";
              const favicon = document.querySelector('link[rel~="icon"]')?.href ?? "";
              let domain = "";
              try {
                domain = new URL(url).hostname;
              } catch {
                domain = "";
              }
              const assets = [];
              const seenUrls = /* @__PURE__ */ new Set();
              const absUrl = (u) => {
                if (!u || u === "about:blank") return "";
                if (u.startsWith("//")) return "https:" + u;
                if (u.startsWith("http")) return u;
                try {
                  return new URL(u, url).href;
                } catch {
                  return "";
                }
              };
              const addAsset = (raw, type, alt, source) => {
                const u = absUrl(raw);
                if (!u || !u.startsWith("http") || seenUrls.has(u)) return;
                seenUrls.add(u);
                assets.push({ url: u, type, alt: alt?.trim() || void 0, source: source ?? "unknown" });
              };
              const parseSrcset = (srcset) => srcset.split(",").map((s) => s.trim().split(/\s+/)[0]).filter(Boolean);
              document.querySelectorAll("img").forEach((el) => {
                const img = el;
                addAsset(img.currentSrc || img.src, "image", img.alt, "img");
                for (const attr of ["data-src", "data-lazy", "data-lazy-src", "data-original", "data-url", "data-image"]) {
                  const v = img.getAttribute(attr);
                  if (v) addAsset(v, "image", img.alt, `img[${attr}]`);
                }
                if (img.srcset) parseSrcset(img.srcset).forEach((u) => addAsset(u, "image", img.alt, "img[srcset]"));
              });
              document.querySelectorAll("picture source").forEach((el) => {
                const src = el;
                if (src.srcset) parseSrcset(src.srcset).forEach((u) => addAsset(u, "image", void 0, "picture"));
                if (src.src) addAsset(src.src, "image", void 0, "picture");
              });
              document.querySelectorAll("video, video source").forEach((el) => {
                const v = el;
                if (v.src) addAsset(v.src, "video", void 0, "video");
                if (v.poster) addAsset(v.poster, "image", void 0, "video-poster");
                const ds = v.getAttribute("data-src");
                if (ds) addAsset(ds, "video", void 0, "video[data-src]");
              });
              document.querySelectorAll("audio, audio source").forEach((el) => {
                const a = el;
                if (a.src) addAsset(a.src, "audio", void 0, "audio");
              });
              const BG_URL_RE = /url\(["']?((?:https?:|\/\/)[^"')]+)["']?\)/g;
              document.querySelectorAll("[style]").forEach((el) => {
                const styleStr = el.getAttribute("style") ?? "";
                let m;
                while ((m = BG_URL_RE.exec(styleStr)) !== null) addAsset(m[1], "image", void 0, "style-bg");
              });
              for (const bgAttr of ["data-bg", "data-background", "data-background-image", "data-lazy-bg"]) {
                document.querySelectorAll(`[${bgAttr}]`).forEach((el) => {
                  addAsset(el.getAttribute(bgAttr) ?? "", "image", void 0, bgAttr);
                });
              }
              document.querySelectorAll("script[src]").forEach((el) => {
                const src = el.src;
                if (src && !src.includes("google-analytics") && !src.includes("gtag") && !src.includes("fbq")) {
                  addAsset(src, "script", void 0, "script");
                }
              });
              document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"][as="style"]').forEach((el) => {
                const href = el.href;
                if (!href) return;
                const type = href.includes("fonts.google") || href.includes("font") || /\.(woff2?|ttf|otf|eot)/.test(href) ? "font" : "css";
                addAsset(href, type, void 0, "link");
              });
              document.querySelectorAll("style").forEach((el) => {
                const text = el.textContent ?? "";
                const fontRe = /url\(["']?((?:https?:|\/\/)[^"')]+\.(?:woff2?|ttf|otf|eot)[^"')']*)["']?\)/g;
                let m;
                while ((m = fontRe.exec(text)) !== null) addAsset(m[1], "font", void 0, "style-font");
              });
              const sameDomainLinks = [];
              const seenLinks = /* @__PURE__ */ new Set();
              document.querySelectorAll("a[href]").forEach((el) => {
                const a = el;
                try {
                  const abs = new URL(a.href, url).href;
                  if (!abs.startsWith("http") || seenLinks.has(abs) || abs === url) return;
                  seenLinks.add(abs);
                  const isSameDomain = new URL(abs).hostname === domain;
                  sameDomainLinks.push({ url: abs, text: a.textContent?.trim().slice(0, 60), isSameDomain });
                } catch {
                }
              });
              const sectionEls = document.querySelectorAll(
                'section, [class*="section"], [class*="block"], [class*="row"], [class*="container"], main > div, article'
              );
              const sections = Array.from(sectionEls).slice(0, 30).map((el) => {
                const elCount = el.querySelectorAll("p,h1,h2,h3,img,a,button").length;
                const cls = el.className?.toString().toLowerCase() ?? "";
                let hint = "section";
                if (/hero|banner|head/.test(cls)) hint = "hero";
                else if (/cta|call.to.action|button/.test(cls)) hint = "cta";
                else if (/footer/.test(cls)) hint = "footer";
                else if (/nav|menu/.test(cls)) hint = "nav";
                else if (/testimonial|review/.test(cls)) hint = "testimonial";
                else if (/pricing|price/.test(cls)) hint = "pricing";
                else if (/faq|accordion/.test(cls)) hint = "faq";
                else if (/feature/.test(cls)) hint = "features";
                return { hint, confidence: elCount > 3 ? 0.8 : 0.5, elementCount: elCount };
              });
              return {
                url,
                title,
                description: desc,
                favicon,
                assets,
                links: sameDomainLinks,
                sections,
                rawHtmlSize: document.documentElement.outerHTML.length
              };
            }
          });
          const scrapeResult = results?.[0]?.result;
          if (!scrapeResult) {
            sendResponse({ ok: false, error: "Scrape returned no result" });
            return;
          }
          const capture = buildCaptureFromScrape(scrapeResult);
          try {
            const cmsResult = await chrome.scripting.executeScript({
              target: { tabId: tab.id, frameIds: [0] },
              world: "MAIN",
              func: _detectCmsFunc
            });
            const platform = cmsResult?.[0]?.result;
            if (platform && typeof platform === "string") {
              capture.platform = platform;
              logger.info("router", `CLONE_PUBLIC_PAGE: platform=${platform}`);
            }
          } catch (_) {
          }
          let ghlFound = false;
          try {
            const stored = await chrome.storage.session.get(`ghl_tab_${tab.id}`);
            const cached = stored[`ghl_tab_${tab.id}`];
            if (cached?.funnelId && cached?.stepId) {
              capture.isGhlPage = true;
              capture.ghlFunnelId = cached.funnelId;
              capture.ghlStepId = cached.stepId;
              capture.ghlLocationId = cached.locationId ?? "";
              if (!capture.platform) capture.platform = "HighLevel";
              ghlFound = true;
              logger.info("router", `CLONE_PUBLIC_PAGE: Path A (inject cache) funnelId=${cached.funnelId}`);
            }
          } catch (_) {
          }
          if (!ghlFound) {
            try {
              for (const delay2 of [0, 400, 1e3]) {
                if (delay2 > 0) await new Promise((r) => setTimeout(r, delay2));
                const pr = await chrome.scripting.executeScript({
                  target: { tabId: tab.id, frameIds: [0] },
                  world: "MAIN",
                  func: _extractGhlMetadataFunc
                });
                const raw = pr?.[0]?.result;
                if (!raw) continue;
                const p = JSON.parse(raw);
                logger.info("router", `CLONE_PUBLIC_PAGE: Path B delay=${delay2} isGhl=${p.isGhlPage} funnelId=${p.funnelId ?? "?"} log=[${p.debugLog ?? ""}]`);
                if (p.isGhlPage && p.funnelId && p.stepId) {
                  capture.isGhlPage = true;
                  capture.ghlFunnelId = p.funnelId;
                  capture.ghlStepId = p.stepId;
                  capture.ghlLocationId = p.locationId ?? "";
                  if (!capture.platform) capture.platform = "HighLevel";
                  ghlFound = true;
                  break;
                }
              }
            } catch (_) {
            }
          }
          if (!ghlFound && scrapeResult.url) {
            try {
              let pu = null;
              try {
                pu = new URL(scrapeResult.url);
              } catch {
              }
              if (pu) {
                const allT = await chrome.tabs.query({});
                const bldr = allT.find((t) => t.url && /page-builder\.leadconnectorhq\.com|app\.gohighlevel\.com/.test(t.url));
                if (bldr?.id) {
                  const lr = await chrome.scripting.executeScript({
                    target: { tabId: bldr.id, frameIds: [0] },
                    world: "MAIN",
                    func: _lookupGhlPageByDomainFunc,
                    args: [pu.hostname, pu.pathname]
                  });
                  const dr = lr?.[0]?.result ? JSON.parse(lr[0].result) : null;
                  logger.info("router", `CLONE_PUBLIC_PAGE: Path C ok=${dr?.ok} funnelId=${dr?.funnelId ?? "?"} log=[${dr?.log ?? ""}]`);
                  if (dr?.ok && dr.funnelId && dr.stepId) {
                    capture.isGhlPage = true;
                    capture.ghlFunnelId = dr.funnelId;
                    capture.ghlStepId = dr.stepId;
                    capture.ghlLocationId = dr.locationId ?? "";
                    if (!capture.platform) capture.platform = "HighLevel";
                  }
                }
              }
            } catch (_) {
            }
          }
          await storePublicCapture(capture);
          sendResponse({ ok: true, data: capture });
        } catch (err) {
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    // ── CLONE_PAGE_BY_URL ─────────────────────────────────────────────────────
    // Opens any URL in a background tab, scrapes it, saves to library, closes tab.
    // Used for cloning public HL-built pages (custom domains, leadconnectorhq, etc.)
    case "CLONE_PAGE_BY_URL": {
      (async () => {
        try {
          const targetUrl = (message.payload?.url ?? "").trim();
          if (!targetUrl || !targetUrl.startsWith("http")) {
            sendResponse({ ok: false, error: "Please enter a valid URL starting with http:// or https://" });
            return;
          }
          const newTab = await chrome.tabs.create({ url: targetUrl, active: false });
          if (!newTab.id) {
            sendResponse({ ok: false, error: "Failed to open tab" });
            return;
          }
          for (let i = 0; i < 60; i++) {
            await new Promise((r) => setTimeout(r, 500));
            try {
              const t = await chrome.tabs.get(newTab.id);
              if (t.status === "complete") break;
            } catch {
              break;
            }
          }
          await new Promise((r) => setTimeout(r, 1500));
          const results = await chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            func: () => {
              const url = window.location.href;
              const title = document.title || "";
              const desc = document.querySelector('meta[name="description"]')?.content ?? "";
              const favicon = document.querySelector('link[rel~="icon"]')?.href ?? "";
              let domain = "";
              try {
                domain = new URL(url).hostname;
              } catch {
                domain = "";
              }
              const assets = [];
              const seenUrls = /* @__PURE__ */ new Set();
              const absUrl = (u) => {
                if (!u || u === "about:blank") return "";
                if (u.startsWith("//")) return "https:" + u;
                if (u.startsWith("http")) return u;
                try {
                  return new URL(u, url).href;
                } catch {
                  return "";
                }
              };
              const addAsset = (raw, type, alt, source) => {
                const u = absUrl(raw);
                if (!u || !u.startsWith("http") || seenUrls.has(u)) return;
                seenUrls.add(u);
                assets.push({ url: u, type, alt: alt?.trim() || void 0, source: source ?? "unknown" });
              };
              const parseSrcset = (srcset) => srcset.split(",").map((s) => s.trim().split(/\s+/)[0]).filter(Boolean);
              document.querySelectorAll("img").forEach((el) => {
                const img = el;
                addAsset(img.currentSrc || img.src, "image", img.alt, "img");
                for (const attr of ["data-src", "data-lazy", "data-lazy-src", "data-original", "data-url", "data-image"]) {
                  const v = img.getAttribute(attr);
                  if (v) addAsset(v, "image", img.alt, `img[${attr}]`);
                }
                if (img.srcset) parseSrcset(img.srcset).forEach((u) => addAsset(u, "image", img.alt, "img[srcset]"));
              });
              document.querySelectorAll("picture source").forEach((el) => {
                const src = el;
                if (src.srcset) parseSrcset(src.srcset).forEach((u) => addAsset(u, "image", void 0, "picture"));
                if (src.src) addAsset(src.src, "image", void 0, "picture");
              });
              document.querySelectorAll("video, video source").forEach((el) => {
                const v = el;
                if (v.src) addAsset(v.src, "video", void 0, "video");
                if (v.poster) addAsset(v.poster, "image", void 0, "video-poster");
              });
              const BG_URL_RE = /url\(["']?((?:https?:|\/\/)[^"')]+)["']?\)/g;
              document.querySelectorAll("[style]").forEach((el) => {
                const styleStr = el.getAttribute("style") ?? "";
                let m;
                while ((m = BG_URL_RE.exec(styleStr)) !== null) addAsset(m[1], "image", void 0, "style-bg");
              });
              document.querySelectorAll("script[src]").forEach((el) => {
                const src = el.src;
                if (src && !src.includes("google-analytics") && !src.includes("gtag")) addAsset(src, "script", void 0, "script");
              });
              document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => {
                const href = el.href;
                if (href) addAsset(href, "css", void 0, "link");
              });
              const sameDomainLinks = [];
              const seenLinks = /* @__PURE__ */ new Set();
              document.querySelectorAll("a[href]").forEach((el) => {
                const a = el;
                try {
                  const abs = new URL(a.href, url).href;
                  if (!abs.startsWith("http") || seenLinks.has(abs) || abs === url) return;
                  seenLinks.add(abs);
                  sameDomainLinks.push({ url: abs, text: a.textContent?.trim().slice(0, 60), isSameDomain: new URL(abs).hostname === domain });
                } catch {
                }
              });
              const sectionEls = document.querySelectorAll('section, [class*="section"], [class*="block"], [class*="row"], main > div, article');
              const sections = Array.from(sectionEls).slice(0, 30).map((el) => {
                const elCount = el.querySelectorAll("p,h1,h2,h3,img,a,button").length;
                const cls = el.className?.toString().toLowerCase() ?? "";
                let hint = "section";
                if (/hero|banner/.test(cls)) hint = "hero";
                else if (/footer/.test(cls)) hint = "footer";
                else if (/cta|call.to.action/.test(cls)) hint = "cta";
                return { hint, confidence: elCount > 3 ? 0.8 : 0.5, elementCount: elCount };
              });
              return { url, title, description: desc, favicon, assets, links: sameDomainLinks, sections, rawHtmlSize: document.documentElement.outerHTML.length };
            }
          });
          try {
            await chrome.tabs.remove(newTab.id);
          } catch {
          }
          const scrapeResult = results?.[0]?.result;
          if (!scrapeResult) {
            sendResponse({ ok: false, error: "Scrape returned no data \u2014 page may have blocked script injection" });
            return;
          }
          const capture = buildCaptureFromScrape(scrapeResult);
          await storePublicCapture(capture);
          logger.info("router", `CLONE_PAGE_BY_URL: saved captureId=${capture.captureId} from ${targetUrl}`);
          sendResponse({ ok: true, data: capture });
        } catch (err) {
          logger.error("router", `CLONE_PAGE_BY_URL threw: ${String(err)}`);
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    case "CLONE_PUBLIC_FUNNEL":
      sendResponse({ ok: true, data: { message: "Funnel detection starting \u2014 trigger CLONE_PUBLIC_PAGE on each linked page." } });
      return false;
    case "GET_PUBLIC_CAPTURES":
      getPublicCaptures().then((data) => sendResponse({ ok: true, data }));
      return true;
    case "CLEAR_PUBLIC_CAPTURES":
      clearPublicCaptures().then(() => sendResponse({ ok: true }));
      return true;
    case "PING_BUILDER": {
      (async () => {
        try {
          const builderTab = await findBuilderTab();
          if (!builderTab?.id) {
            sendResponse({ ok: false, error: "No HighLevel builder tab found." });
            return;
          }
          const conn = await ensureBuilderConnection(builderTab.id);
          sendResponse({ ok: conn.ok, data: conn.ok ? { tabId: builderTab.id, url: builderTab.url, title: builderTab.title } : null, error: conn.error });
        } catch (err) {
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    // ── GET_IMPORT_ENGINE_STATUS ────────────────────────────────────────────────
    // Single shared status model read by popup, workbench, and executor.
    // Returns mode + readiness + candidate counts so every surface stays in sync.
    case "GET_IMPORT_ENGINE_STATUS": {
      (async () => {
        try {
          const allCandidates = await getImportCandidates();
          const allCaptures = await getPublicCaptures();
          const builderTab = await findBuilderTab().catch(() => null);
          const dispatchCandidates = allCandidates.filter(
            (c) => c.source === "runtime-dispatch" || !!c.dispatchActionType
          );
          const networkCandidates = allCandidates.filter(
            (c) => c.source !== "runtime-dispatch" && !c.dispatchActionType
          );
          let mode;
          let available;
          let reasonIfUnavailable = "";
          if (dispatchCandidates.length > 0) {
            mode = "runtime-dispatch";
            available = true;
          } else if (networkCandidates.length > 0) {
            mode = "learned-replay";
            available = true;
          } else {
            mode = "not-configured";
            available = false;
            reasonIfUnavailable = 'No import path learned yet. Open the Debug Workbench and run "Learn Import Path" while the page builder is open.';
          }
          const best = sortCandidatesByPriority(allCandidates)[0] ?? null;
          sendResponse({
            ok: true,
            data: {
              mode,
              available,
              reasonIfUnavailable,
              activeCandidateId: best?.id ?? null,
              activeCandidateTag: best?.tag ?? null,
              builderConnected: !!builderTab?.id,
              builderTabTitle: builderTab?.title ?? null,
              candidateCount: allCandidates.length,
              dispatchCandidateCount: dispatchCandidates.length,
              networkCandidateCount: networkCandidates.length,
              libraryCount: allCaptures.length
            }
          });
        } catch (err) {
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    // ── GET_HEADER_BUFFER ──────────────────────────────────────────────────────
    // Returns headers buffered by onBeforeSendHeaders for the requested URLs.
    // Called by paste.tsx finalize() to enrich watcher candidates that had
    // empty requestHeaders (because the JS watcher couldn't see auth headers
    // that HL adds outside of fetch(init.headers), e.g. from service workers).
    case "GET_HEADER_BUFFER": {
      try {
        const urls = message.payload?.urls ?? [];
        const result = {};
        const now = Date.now();
        for (const url of urls) {
          const entry = _headerBuffer.get(url);
          if (entry && now - entry.ts < HEADER_BUFFER_TTL) {
            result[url] = { headers: entry.headers, method: entry.method };
          }
        }
        sendResponse({ ok: true, data: result });
      } catch (err) {
        sendResponse({ ok: false, error: String(err) });
      }
      return false;
    }
    // ── COPY_PAGE ────────────────────────────────────────────────────────────────
    // Reads funnel + step identity from the current HL page via Nuxt's payload.
    // Stores result in chrome.storage.session under "cl_copied_page".
    case "COPY_PAGE": {
      (async () => {
        try {
          const cpTabId = tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
          if (!cpTabId) {
            sendResponse({ ok: false, error: "no_active_tab" });
            return;
          }
          let res = await chrome.scripting.executeScript({
            target: { tabId: cpTabId, allFrames: false },
            world: "MAIN",
            func: _nuxtGetFunnelInfoFunc
          });
          let info = {};
          try {
            info = JSON.parse(res?.[0]?.result ?? "{}");
          } catch {
          }
          if (!info.ok) {
            const tab = await chrome.tabs.get(cpTabId);
            const url = tab.url ?? "";
            const m = url.match(/\/location\/([^/]+)\/page-builder\/([^/]+)/);
            if (m) {
              const [, locationId, builderId] = m;
              const res2 = await chrome.scripting.executeScript({
                target: { tabId: cpTabId, allFrames: false },
                world: "MAIN",
                func: _revexGetBuilderInfoFunc,
                args: [builderId]
              });
              let info2 = {};
              try {
                info2 = JSON.parse(res2?.[0]?.result ?? "{}");
              } catch {
              }
              if (info2.ok) {
                info = { ...info2, locationId: info2.locationId || locationId, builderId };
              } else {
                info = { ok: false, error: info2.error ?? "revexGetBuilderInfo failed", locationId, builderId };
              }
            } else {
              info.urlNote = "URL did not match /page-builder/ pattern; try on funnel overview page";
            }
          }
          if (info.ok) {
            await chrome.storage.session.set({ cl_copied_page: info });
            logger.info("router", `COPY_PAGE: stored funnelId=${info.funnelId} stepId=${info.stepId}`);
            sendResponse({ ok: true, info });
          } else {
            logger.warn("router", `COPY_PAGE: failed \u2014 ${info.error}`);
            sendResponse({ ok: false, error: info.error, info });
          }
        } catch (err) {
          logger.error("router", `COPY_PAGE threw: ${String(err)}`);
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    // ── PASTE_PAGE ───────────────────────────────────────────────────────────────
    // Clones the copied page into the currently open builder page using
    // revexBackendService.post('/funnels/funnel/clone-funnel-step/', ...).
    case "PASTE_PAGE": {
      (async () => {
        try {
          const ppTabId = tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
          if (!ppTabId) {
            sendResponse({ ok: false, error: "no_active_tab" });
            return;
          }
          const stor = await chrome.storage.session.get("cl_copied_page");
          const src = stor.cl_copied_page;
          if (!src?.funnelId || !src?.stepId) {
            sendResponse({ ok: false, error: "Nothing copied yet \u2014 use Copy Page first", src });
            return;
          }
          const ppTab = await chrome.tabs.get(ppTabId);
          const url = ppTab.url ?? "";
          const m = url.match(/\/location\/([^/]+)\/page-builder\/([^/]+)/);
          if (!m) {
            sendResponse({ ok: false, error: "Current tab is not a /page-builder/ URL \u2014 navigate to the destination page first" });
            return;
          }
          const [, locationId, builderId] = m;
          const destRes = await chrome.scripting.executeScript({
            target: { tabId: ppTabId, allFrames: false },
            world: "MAIN",
            func: _revexGetBuilderInfoFunc,
            args: [builderId]
          });
          let dest = {};
          try {
            dest = JSON.parse(destRes?.[0]?.result ?? "{}");
          } catch {
          }
          if (!dest.ok) {
            sendResponse({ ok: false, error: `Could not read destination page: ${dest.error}`, dest });
            return;
          }
          const req = {
            sourceFunnelId: src.funnelId,
            sourceStepId: src.stepId,
            destFunnelId: dest.funnelId,
            destStepId: dest.stepId,
            locationId: dest.locationId || locationId
          };
          logger.info("router", `PASTE_PAGE: cloning ${req.sourceFunnelId}/${req.sourceStepId} \u2192 ${req.destFunnelId}/${req.destStepId}`);
          const cloneRes = await chrome.scripting.executeScript({
            target: { tabId: ppTabId, allFrames: false },
            world: "MAIN",
            func: _revexCloneFunnelStepFunc,
            args: [req]
          });
          let cloneResult = {};
          try {
            cloneResult = JSON.parse(cloneRes?.[0]?.result ?? "{}");
          } catch {
          }
          if (cloneResult.ok) {
            await chrome.scripting.executeScript({
              target: { tabId: ppTabId, allFrames: false },
              world: "MAIN",
              func: _refreshBuilderIframeFunc
            });
            logger.info("router", `PASTE_PAGE: success \u2014 ${cloneResult.raw?.slice(0, 80)}`);
            sendResponse({ ok: true, req, cloneResult });
          } else {
            logger.warn("router", `PASTE_PAGE: clone failed \u2014 ${cloneResult.error}`);
            sendResponse({ ok: false, error: cloneResult.error, req, cloneResult });
          }
        } catch (err) {
          logger.error("router", `PASTE_PAGE threw: ${String(err)}`);
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    // ── GET_COPIED_PAGE ───────────────────────────────────────────────────────────
    // Returns the currently stored copied page info.
    case "GET_COPIED_PAGE": {
      (async () => {
        const stor = await chrome.storage.session.get("cl_copied_page");
        sendResponse({ ok: true, data: stor.cl_copied_page ?? null });
      })();
      return true;
    }
    // ── PASTE_DIRECT_TO_BUILDER ─────────────────────────────────────────────────
    // Single deterministic insertion primitive — no setup, no learning required.
    //
    // ONE method:  POST /funnels/builder/prebuilt-section/sync/changes
    // ONE context: Extension service worker (bypasses CORS, full host_permissions)
    // ONE auth:    chrome.cookies.getAll() — reads httpOnly session cookies
    // ONE payload: { sections, pageId?, funnelId? }
    // ONE verify:  response.ok
    //
    // Why service worker, not MAIN world:
    //   - MAIN world fetch to backend.leadconnectorhq.com from app.gohighlevel.com
    //     is blocked by CORS (TypeError: Failed to fetch).
    //   - HL stores its auth JWT in httpOnly cookies, invisible to document.cookie
    //     and localStorage.  Only chrome.cookies can read them.
    //   - Extension service workers have host_permissions:<all_urls>, so fetch
    //     calls are not subject to CORS restrictions.
    case "PASTE_DIRECT_TO_BUILDER": {
      (async () => {
        try {
          const msgPayload = message.payload ?? {};
          const captureId = msgPayload.captureId;
          const builderTab = await findBuilderTab();
          if (!builderTab?.id || !builderTab.url) {
            sendResponse({
              ok: false,
              error: "No HighLevel page builder tab found. Open the page builder in Chrome first, then paste."
            });
            return;
          }
          const tabUrl = builderTab.url;
          const locationId = tabUrl.match(/\/location\/([a-zA-Z0-9_-]{6,})/i)?.[1] ?? "";
          const funnelId = tabUrl.match(/\/funnels?\/([a-zA-Z0-9_-]{6,})/i)?.[1] ?? "";
          const pageId = tabUrl.match(/\/(?:pages?|steps?|page-builder)\/([a-zA-Z0-9_-]{6,})/i)?.[1] ?? "";
          logger.info(
            "router",
            `PASTE_DIRECT_TO_BUILDER: tabUrl=${tabUrl} locationId=${locationId || "(none)"} funnelId=${funnelId || "(none)"} pageId=${pageId || "(none)"}`
          );
          const captures = await getPublicCaptures();
          const cap = captureId ? captures.find((c) => c.captureId === captureId) : captures[captures.length - 1];
          if (!cap) {
            sendResponse({ ok: false, error: "No saved page in library. Capture a page first, then paste." });
            return;
          }
          const isGhlCapture = !!cap.isGhlPage && !!cap.ghlFunnelId && !!cap.ghlStepId;
          logger.info(
            "router",
            `PASTE_DIRECT_TO_BUILDER: captureId=${cap.captureId} sections=${(cap.sections ?? []).length} isGhlCapture=${isGhlCapture} ghlFunnelId=${cap.ghlFunnelId ?? "(none)"} ghlStepId=${cap.ghlStepId ?? "(none)"} pageId=${pageId || "(none)"} locationId=${locationId || "(none)"}`
          );
          let pasteResult = {};
          try {
            if (isGhlCapture) {
              logger.info("router", `PASTE: GHL clone-funnel-step \u2014 srcFunnel=${cap.ghlFunnelId} srcStep=${cap.ghlStepId}`);
              const injectRes = await chrome.scripting.executeScript({
                target: { tabId: builderTab.id, frameIds: [0] },
                world: "MAIN",
                func: _cloneFromGhlCaptureFunc,
                args: [
                  cap.ghlFunnelId,
                  cap.ghlStepId,
                  pageId,
                  locationId
                ]
              });
              const raw = injectRes?.[0]?.result;
              try {
                pasteResult = JSON.parse(raw ?? "{}");
              } catch {
                pasteResult = { ok: false, error: "parse_failed", raw };
              }
            } else {
              pasteResult = {
                ok: false,
                error: "No GHL data \u2014 capture this page with the extension open, then paste. If the page is not a GHL funnel, it cannot be pasted."
              };
            }
          } catch (injectErr) {
            pasteResult = { ok: false, error: `executeScript failed: ${String(injectErr).slice(0, 200)}` };
          }
          logger.info(
            "router",
            `PASTE_DIRECT_TO_BUILDER: ok=${pasteResult.ok} HTTP=${pasteResult.status ?? "?"} strategy=${pasteResult.strategy ?? "?"} saveUrl=${pasteResult.saveUrl ?? "?"} destFunnelId=${pasteResult.destFunnelId ?? "?"} destStepId=${pasteResult.destStepId ?? "?"} userId=${pasteResult.userId ?? "?"} sectionsPath=${pasteResult.sectionsPath ?? "?"} added=${pasteResult.addedSections ?? "?"} existing=${pasteResult.existingSections ?? "?"} pageDataKeys=[${pasteResult.pageDataKeys ?? ""}] bodyKeys=[${pasteResult.bodyKeys ?? ""}]`
          );
          if (pasteResult.sampleSection) {
            logger.info("router", `PASTE_DIRECT_TO_BUILDER: sampleSection=${pasteResult.sampleSection}`);
          }
          if (pasteResult.attempts) {
            logger.warn("router", `PASTE_DIRECT_TO_BUILDER: attempts=${JSON.stringify(pasteResult.attempts).slice(0, 400)}`);
          }
          if (pasteResult.ok) {
            try {
              await chrome.tabs.reload(builderTab.id);
            } catch (reloadErr) {
              logger.warn("router", `PASTE_DIRECT_TO_BUILDER: tab reload failed \u2014 ${String(reloadErr)}`);
            }
            sendResponse({
              ok: true,
              strategy: pasteResult.strategy ?? "revex",
              status: pasteResult.status,
              captureTitle: cap.title || cap.domain || "Captured Page",
              added: pasteResult.addedSections,
              existing: pasteResult.existingSections
            });
            return;
          }
          const attemptsSummary = Array.isArray(pasteResult.attempts) ? pasteResult.attempts.map(
            (a) => `${(a.method ?? "?").toUpperCase()} ${a.url ?? "?"}\u2192HTTP${a.status ?? "?"}${a.msg ? ":" + String(a.msg).slice(0, 40) : ""}`
          ).join(" | ") : "";
          sendResponse({
            ok: false,
            status: pasteResult.status,
            error: attemptsSummary ? `${pasteResult.error ?? "Failed"} \u2014 ${attemptsSummary}` : pasteResult.error ?? `HTTP ${pasteResult.status ?? "?"}: ${JSON.stringify(pasteResult.data ?? "").slice(0, 150)}`,
            canOpenDebug: true
          });
        } catch (err) {
          logger.error("router", `PASTE_DIRECT_TO_BUILDER threw: ${String(err)}`);
          sendResponse({ ok: false, error: String(err), canOpenDebug: true });
        }
      })();
      return true;
    }
    // ── Runtime probe: inject dispatch spy into MAIN world ────────────────────
    // Discovers the Redux store via React DevTools hook, window globals, and DOM
    // scan, then wraps store.dispatch so every dispatched action is recorded in
    // window.__cl_runtime.dispatched.  Safe to call multiple times — idempotent.
    case "PROBE_BUILDER_RUNTIME": {
      (async () => {
        try {
          const pl = message.payload ?? {};
          const tabId2 = pl.tabId;
          const frameId = pl.frameId;
          let resolvedTabId = tabId2;
          if (!resolvedTabId) {
            const bt = await findBuilderTab();
            resolvedTabId = bt?.id;
          }
          if (!resolvedTabId) {
            sendResponse({ ok: false, error: "No builder tab found \u2014 open HL page builder first." });
            return;
          }
          const probeResults = [];
          try {
            const r = await chrome.scripting.executeScript({
              target: { tabId: resolvedTabId, frameIds: [0] },
              world: "MAIN",
              func: _builderRuntimeProbeFunc
            });
            probeResults.push(`top:${r?.[0]?.result ?? "no_result"}`);
          } catch (e) {
            probeResults.push(`top:err:${String(e).slice(0, 60)}`);
          }
          if (frameId != null && frameId !== 0) {
            try {
              const r = await chrome.scripting.executeScript({
                target: { tabId: resolvedTabId, frameIds: [frameId] },
                world: "MAIN",
                func: _builderRuntimeProbeFunc
              });
              probeResults.push(`frame${frameId}:${r?.[0]?.result ?? "no_result"}`);
            } catch (e) {
              probeResults.push(`frame${frameId}:err:${String(e).slice(0, 60)}`);
            }
          }
          if (!frameId) {
            try {
              const frames = await chrome.webNavigation.getAllFrames({ tabId: resolvedTabId }) ?? [];
              const builderFrame = frames.find(
                (f) => /leadconnectorhq\.com|gohighlevel\.com|msgsndr\.com/.test(f.url ?? "") && /builder|editor|funnel|page/.test(f.url ?? "") && f.frameId !== 0
              );
              if (builderFrame) {
                try {
                  const r = await chrome.scripting.executeScript({
                    target: { tabId: resolvedTabId, frameIds: [builderFrame.frameId] },
                    world: "MAIN",
                    func: _builderRuntimeProbeFunc
                  });
                  probeResults.push(`auto-frame${builderFrame.frameId}:${r?.[0]?.result ?? "no_result"}`);
                } catch (e) {
                  probeResults.push(`auto-frame${builderFrame.frameId}:err:${String(e).slice(0, 60)}`);
                }
              }
            } catch {
            }
          }
          const storeFound = probeResults.some((r) => r.includes("store:") && !r.includes("no_store"));
          logger.info("router", `PROBE_BUILDER_RUNTIME: ${probeResults.join(" | ")}`);
          sendResponse({ ok: true, storeFound, probeResults });
        } catch (err) {
          logger.error("router", `PROBE_BUILDER_RUNTIME threw: ${String(err)}`);
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    // ── TEST_INJECT: state-introspect + dispatch test section ─────────────────
    case "TEST_INJECT": {
      (async () => {
        try {
          let builderScore2 = function(f) {
            let s = 0;
            if (/leadconnectorhq\.com|gohighlevel\.com|msgsndr\.com/.test(f.url)) s += 10;
            if (/builder|editor|funnel|page/.test(f.url)) s += 10;
            if (f.injectionOk) s += 4;
            if (f.storeFound) s += 6;
            if (f.sectionsFound) s += 6;
            if (f.framework === "react") s += 5;
            if (f.framework === "angular") s += 3;
            if (f.failureReason === "react_no_sections_in_fiber") s += 8;
            if (f.failureReason === "no_action_type_changed_state") s += 7;
            if (f.fiberStateSnap.length > 0) s += 4;
            return s;
          };
          var builderScore = builderScore2;
          const pl = message.payload ?? {};
          const tabId2 = pl.tabId;
          let resolvedTabId = tabId2;
          if (!resolvedTabId) {
            const bt = await findBuilderTab();
            resolvedTabId = bt?.id;
          }
          if (!resolvedTabId) {
            sendResponse({ ok: false, error: "No builder tab found \u2014 open HL page builder first.", frames: [] });
            return;
          }
          let allFrames = [{ frameId: 0, url: "", parentFrameId: -1 }];
          try {
            const nav = await chrome.webNavigation.getAllFrames({ tabId: resolvedTabId }) ?? [];
            allFrames = nav.map((f) => ({ frameId: f.frameId, url: f.url ?? "", parentFrameId: f.parentFrameId ?? -1 }));
          } catch {
          }
          async function diagnoseFrame(fi) {
            const diag = {
              frameId: fi.frameId,
              url: fi.url,
              parentFrameId: fi.parentFrameId,
              injectionOk: false,
              probeRaw: "",
              storeFound: false,
              storeType: "",
              insertRaw: "",
              sectionsFound: false,
              sectionsPath: "",
              capturedCount: 0,
              capturedTypes: [],
              templateShape: "",
              stateKeys: [],
              tried: 0,
              failureReason: "not_run",
              insertOk: false,
              actionType: "",
              countBefore: 0,
              countAfter: 0,
              // fiber
              fiberRaw: "",
              framework: "unknown",
              hasAngular: false,
              hasVue: false,
              fiberInjectOk: false,
              fiberMethod: "",
              fiberError: "",
              fiberCount: "",
              fiberStateSnap: [],
              notableGlobals: []
            };
            try {
              const pr2 = await chrome.scripting.executeScript({
                target: { tabId: resolvedTabId, frameIds: [fi.frameId] },
                world: "MAIN",
                func: _builderRuntimeProbeFunc
              });
              diag.probeRaw = String(pr2?.[0]?.result ?? "no_result");
              diag.injectionOk = true;
            } catch (e) {
              diag.probeRaw = "injection_failed:" + String(e).slice(0, 120);
              diag.failureReason = "injection_failed";
              return diag;
            }
            const pr = diag.probeRaw;
            if (pr.startsWith("store:") || pr === "already_active") {
              diag.storeFound = true;
              const m = pr.match(/^store:([^:]+)/);
              diag.storeType = m ? m[1] : "unknown";
            }
            let insertJson = "";
            try {
              const ir = await chrome.scripting.executeScript({
                target: { tabId: resolvedTabId, frameIds: [fi.frameId] },
                world: "MAIN",
                func: _insertTestSectionFunc
              });
              insertJson = String(ir?.[0]?.result ?? "{}");
              diag.insertRaw = insertJson;
            } catch (e) {
              diag.insertRaw = "injection_failed:" + String(e).slice(0, 120);
            }
            let ins = {};
            try {
              ins = JSON.parse(insertJson);
            } catch {
              ins = {};
            }
            diag.insertOk = !!ins.ok;
            diag.capturedCount = (ins.capturedTypes ?? []).length;
            diag.capturedTypes = ins.capturedTypes ?? [];
            diag.stateKeys = ins.stateKeys ?? [];
            diag.templateShape = ins.templateShape ?? "";
            diag.tried = ins.tried ?? 0;
            if (ins.ok) {
              diag.actionType = ins.actionType ?? "";
              diag.sectionsFound = true;
              diag.sectionsPath = ins.path ?? "";
              diag.countBefore = ins.countBefore ?? 0;
              diag.countAfter = ins.countAfter ?? 0;
              diag.failureReason = "";
              return diag;
            }
            let fiberJson = "";
            try {
              const fr = await chrome.scripting.executeScript({
                target: { tabId: resolvedTabId, frameIds: [fi.frameId] },
                world: "MAIN",
                func: _fiberInjectTestFunc
              });
              fiberJson = String(fr?.[0]?.result ?? "{}");
              diag.fiberRaw = fiberJson;
            } catch (e) {
              diag.fiberRaw = "injection_failed:" + String(e).slice(0, 120);
            }
            let fib = {};
            try {
              fib = JSON.parse(fiberJson);
            } catch {
              fib = {};
            }
            diag.framework = fib.framework ?? "unknown";
            diag.hasAngular = !!(fib.hasAngular || fib.hasAngularGlobal || fib.hasAngularIvy);
            diag.hasVue = !!fib.hasVue;
            diag.fiberInjectOk = fib.ok === true;
            diag.fiberMethod = fib.method ?? "";
            diag.fiberError = (fib.ok !== true ? fib.error ?? "" : "").slice(0, 100);
            diag.fiberStateSnap = fib.stateSnapshot ?? [];
            diag.notableGlobals = fib.notableGlobals ?? [];
            if (fib.ok === true) {
              diag.fiberCount = `${fib.countBefore ?? "?"} \u2192 ${fib.countAfter ?? "?"}`;
            }
            if (diag.fiberInjectOk) {
              diag.failureReason = "";
            } else {
              const fiberErr = fib.error ?? "";
              if (fiberErr.includes("no_react_detected")) diag.failureReason = fib.hasAngular ? "angular_not_react" : fib.hasVue ? "vue_not_react" : "no_framework";
              else if (fiberErr.includes("no_fiber_roots_found")) diag.failureReason = "react_no_fiber_roots";
              else if (fiberErr.includes("no_sections_in_fiber_state")) diag.failureReason = "react_no_sections_in_fiber";
              else if (fiberErr.includes("no_store_ref")) diag.failureReason = "no_store_ref";
              else if (fiberErr.includes("no_sections_array")) diag.failureReason = "no_sections_array_in_state";
              else if (fiberErr.includes("no_action_type")) diag.failureReason = "no_action_type_changed_state";
              else diag.failureReason = fiberErr.slice(0, 50) || (ins.error ?? "unknown").slice(0, 50);
            }
            return diag;
          }
          const frames = [];
          for (const fi of allFrames) {
            frames.push(await diagnoseFrame(fi));
          }
          const successFrame = frames.find((f) => f.insertOk || f.fiberInjectOk);
          const ranked = [...frames].sort((a, b) => builderScore2(b) - builderScore2(a));
          const best = ranked[0];
          let recommendation = "";
          if (successFrame) {
            const method = successFrame.fiberInjectOk ? `fiber:${successFrame.fiberMethod}` : `redux:${successFrame.actionType}`;
            recommendation = `PRIMITIVE PROVEN via ${method} in frame ${successFrame.frameId}`;
          } else if (best?.failureReason === "react_no_sections_in_fiber") {
            recommendation = "React detected, fiber roots found, but sections not in component state. Sections may be in a context/provider or loaded lazily. State snapshot: " + (best.fiberStateSnap.slice(0, 4).join(" | ") || "empty") + ". Try scrolling the builder to trigger lazy load, then re-run.";
          } else if (best?.failureReason === "react_no_fiber_roots") {
            recommendation = "React detected but no fiber roots found. The builder may be in a cross-origin iframe not accessible to MAIN world injection. Check which frame has the builder canvas in the table above.";
          } else if (best?.failureReason === "angular_not_react") {
            recommendation = "HL builder uses Angular (not React). Redux and React fiber paths both inapplicable. Use ng.getComponent() + ng.applyChanges() or the HTTP API path instead.";
          } else if (best?.failureReason === "no_action_type_changed_state") {
            recommendation = "Redux store + sections found but no action type worked. " + (best.capturedTypes.length > 0 ? "Captured real action types: " + best.capturedTypes.slice(0, 4).join(", ") : "No real actions captured \u2014 interact with the builder then re-run.");
          } else if (best?.failureReason === "no_sections_array_in_state") {
            recommendation = "Redux store found but sections not in state. State keys: " + (best.stateKeys.slice(0, 8).join(", ") || "none");
          } else if (frames.every((f) => f.failureReason === "injection_failed")) {
            recommendation = "executeScript injection failed in ALL frames. Check manifest scripting permission or Content-Security-Policy blocking.";
          } else if (best?.framework === "unknown" || best?.failureReason === "no_framework") {
            recommendation = "No known JS framework detected. Builder may be server-rendered or use a bundled custom runtime. HTTP API path (Option A) is the only remaining option.";
          } else {
            recommendation = "Unhandled failure \u2014 see frame table. Best frame: #" + (best?.frameId ?? "?") + " reason: " + (best?.failureReason ?? "unknown");
          }
          if (successFrame) {
            sendResponse({
              ok: true,
              // Redux fields
              actionType: successFrame.actionType || void 0,
              path: successFrame.sectionsPath || void 0,
              countBefore: successFrame.insertOk ? successFrame.countBefore : successFrame.fiberInjectOk ? void 0 : void 0,
              countAfter: successFrame.insertOk ? successFrame.countAfter : void 0,
              // Fiber fields
              fiberMethod: successFrame.fiberMethod || void 0,
              fiberCount: successFrame.fiberCount || void 0,
              method: successFrame.fiberInjectOk ? `fiber:${successFrame.fiberMethod}` : `redux:${successFrame.actionType}`,
              frame: `frame${successFrame.frameId}`,
              frameUrl: successFrame.url,
              framework: successFrame.framework,
              frames,
              recommendation
            });
          } else {
            sendResponse({
              ok: false,
              error: "All frames failed \u2014 see frames[] for per-frame diagnostics",
              frames,
              recommendation
            });
          }
        } catch (err) {
          logger.error("router", `TEST_INJECT threw: ${String(err)}`);
          sendResponse({ ok: false, error: String(err), frames: [] });
        }
      })();
      return true;
    }
    // ── Pull runtime captures: read action spy log from MAIN world ────────────
    // Reads window.__cl_runtime.dispatched and scores each action for relevance
    // to "add section" operations.  Returns top candidates for the Learn panel.
    case "PULL_RUNTIME_CAPTURES": {
      (async () => {
        try {
          const pl = message.payload ?? {};
          const tabId2 = pl.tabId;
          const frameId = pl.frameId;
          let resolvedTabId = tabId2;
          if (!resolvedTabId) {
            const bt = await findBuilderTab();
            resolvedTabId = bt?.id;
          }
          if (!resolvedTabId) {
            sendResponse({ ok: false, error: "No builder tab." });
            return;
          }
          const frameIds = [0];
          if (frameId != null && frameId !== 0) frameIds.push(frameId);
          let best = null;
          for (const fid of frameIds) {
            try {
              const r = await chrome.scripting.executeScript({
                target: { tabId: resolvedTabId, frameIds: [fid] },
                world: "MAIN",
                func: _pullRuntimeCapturesFunc
              });
              const result = r?.[0]?.result;
              if (result?.storeFound) {
                best = result;
                break;
              }
              if (!best && result) best = result;
            } catch {
            }
          }
          sendResponse({ ok: true, data: best });
        } catch (err) {
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    // ── Dispatch section insert: replay captured action with our content ───────
    // Uses the exact action type observed during Learn Import Path (from the
    // dispatch spy) and dispatches it with our cloned section merged into the
    // payload.  Falls back through multiple payload shapes.
    case "DISPATCH_SECTION_INSERT": {
      (async () => {
        try {
          const pl = message.payload ?? {};
          const tabId2 = pl.tabId;
          const frameId = pl.frameId;
          const actionType = pl.actionType;
          const sectionsJson = pl.sectionsJson;
          const origPayloadJson = pl.origPayloadJson;
          if (!actionType) {
            sendResponse({ ok: false, error: "actionType is required" });
            return;
          }
          let resolvedTabId = tabId2;
          if (!resolvedTabId) {
            const bt = await findBuilderTab();
            resolvedTabId = bt?.id;
          }
          if (!resolvedTabId) {
            sendResponse({ ok: false, error: "No builder tab." });
            return;
          }
          const frameIds = frameId != null ? [frameId, 0] : [0];
          let lastResult = { ok: false, error: "No frames tried", results: [] };
          for (const fid of frameIds) {
            try {
              const r = await chrome.scripting.executeScript({
                target: { tabId: resolvedTabId, frameIds: [fid] },
                world: "MAIN",
                func: _dispatchSectionInsertFunc,
                args: [
                  actionType,
                  sectionsJson ?? "[]",
                  origPayloadJson ?? "null"
                ]
              });
              const result = r?.[0]?.result;
              lastResult = result ?? { ok: false, error: "No result from executeScript", results: [] };
              if (lastResult.ok) break;
            } catch (e) {
              lastResult = { ok: false, error: String(e), results: [] };
            }
          }
          logger.info("router", `DISPATCH_SECTION_INSERT: actionType=${actionType} ok=${lastResult.ok} results=${lastResult.results?.join(", ")}`);
          sendResponse({ ok: lastResult.ok, data: lastResult, error: lastResult.error });
        } catch (err) {
          logger.error("router", `DISPATCH_SECTION_INSERT threw: ${String(err)}`);
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    case "SAVE_PASTE_SESSION": {
      (async () => {
        try {
          const session = {
            ...message.payload,
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          await chrome.storage.local.set({ [PASTE_SESSION_KEY]: session });
          sendResponse({ ok: true });
        } catch (err) {
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    case "GET_PASTE_SESSION": {
      (async () => {
        try {
          const r = await chrome.storage.local.get(PASTE_SESSION_KEY);
          const session = r[PASTE_SESSION_KEY] ?? null;
          sendResponse({ ok: true, data: session });
        } catch (err) {
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    case "CLEAR_PASTE_SESSION": {
      (async () => {
        try {
          await chrome.storage.local.remove(PASTE_SESSION_KEY);
          sendResponse({ ok: true });
        } catch (err) {
          sendResponse({ ok: false, error: String(err) });
        }
      })();
      return true;
    }
    case "IMPORT_JSON_PACKAGE": {
      (async () => {
        try {
          const captureId = message.payload?.captureId;
          const targetTabId = message.payload?.targetTabId;
          const targetFrameId = message.payload?.targetFrameId;
          const candidateId = message.payload?.candidateId;
          const inlineCand = message.payload?.candidate;
          const strictStrategy = !!message.payload?.strictStrategy;
          if (!captureId) {
            sendResponse({ ok: false, error: "No saved page or funnel selected." });
            return;
          }
          const captures = await getPublicCaptures();
          const cap = captures.find((c) => c.captureId === captureId);
          if (!cap) {
            sendResponse({ ok: false, error: "Capture not found in library. It may have been deleted." });
            return;
          }
          const allCandidates = await getImportCandidates();
          const replayCandidates = [];
          const seenIds = /* @__PURE__ */ new Set();
          if (inlineCand) {
            const merged = {
              ...inlineCand,
              url: inlineCand.url || inlineCand.fullUrl || inlineCand.endpoint || "",
              method: inlineCand.method || "POST",
              requestHeaders: {
                ...inlineCand.requestHeaders ?? {},
                ...inlineCand.headers ?? {}
              }
            };
            replayCandidates.push(merged);
            seenIds.add(merged.id);
          }
          if (candidateId && !seenIds.has(candidateId)) {
            const pinned = allCandidates.find((c) => c.id === candidateId);
            if (pinned) {
              replayCandidates.push(pinned);
              seenIds.add(pinned.id);
            }
          }
          if (!strictStrategy) {
            const rest = sortCandidatesByPriority(allCandidates.filter((c) => !seenIds.has(c.id)));
            replayCandidates.push(...rest);
          }
          logger.info("router", `IMPORT_JSON_PACKAGE \u2014 ${replayCandidates.length} candidate(s), strict=${strictStrategy}, tabId=${targetTabId}`);
          let lastFailReason = "";
          for (const cand of replayCandidates) {
            const logCtx = { url: cand.url, method: cand.method, headers: Object.keys(cand.requestHeaders ?? {}).length };
            logger.info("router", `Executing learned-mutation-replay [priority=${candidatePriority(cand.url)}]`, logCtx);
            const replayResult = await attemptFetchReplay(cand, cap, targetTabId, targetFrameId);
            if (replayResult.ok) {
              sendResponse({
                ok: true,
                attempted: true,
                verified: replayResult.verified,
                strategy: "learned-mutation-replay",
                fetchPath: replayResult.fetchPath,
                message: replayResult.message,
                status: replayResult.status,
                responseBodyPreview: replayResult.responseBodyPreview,
                responseSize: replayResult.responseSize,
                requestBodySize: replayResult.requestBodySize,
                candidateUrl: replayResult.candidateUrl,
                candidateMethod: replayResult.candidateMethod
              });
              return;
            }
            lastFailReason = `${replayResult.status} \u2014 ${replayResult.message}`;
            logger.warn("router", `Candidate failed (${replayResult.status}), trying next`, { reason: replayResult.message });
          }
          if (strictStrategy) {
            sendResponse({
              ok: false,
              strategy: "learned-mutation-replay",
              error: replayCandidates.length === 0 ? "No learned candidate available. Run Learn Import Path first." : `Learned mutation replay failed: ${lastFailReason}`
            });
            return;
          }
          let builderTab = null;
          if (targetTabId) {
            try {
              builderTab = await chrome.tabs.get(targetTabId);
              const url = builderTab.url ?? "";
              const isHL = /gohighlevel\.com|highlevel\.com|msgsndr\.com|leadconnectorhq\.com|app\.ghl\.io/.test(url);
              const isEdit = /\/funnel|\/page-builder|\/builder\/|funnels\/|\/pages\/|funnel-builder|page-editor|site-builder|\/edit\/|\/editor\//.test(url);
              if (!isHL || !isEdit) {
                sendResponse({ ok: false, error: "Builder tab changed or was closed. Open a HighLevel page builder and try again." });
                return;
              }
            } catch {
              sendResponse({ ok: false, error: "Builder tab is no longer available. Open a HighLevel page builder and try again." });
              return;
            }
          } else {
            builderTab = await findBuilderTab();
          }
          if (!builderTab?.id) {
            sendResponse({ ok: false, error: "Open a HighLevel page builder first, then try again." });
            return;
          }
          const conn = await ensureBuilderConnection(builderTab.id);
          if (!conn.ok) {
            sendResponse({ ok: false, error: conn.error ?? "No live connection to the HighLevel builder tab." });
            return;
          }
          let csResult;
          try {
            csResult = await chrome.tabs.sendMessage(builderTab.id, {
              type: "DO_INJECT_CLONE_PACKAGE",
              payload: {
                captureId: cap.captureId,
                title: cap.title,
                domain: cap.domain,
                pageType: cap.pageType,
                sections: cap.sections,
                assets: cap.assets,
                funnelLinks: cap.funnelLinks,
                rawHtmlSize: cap.rawHtmlSize
              }
            });
          } catch (err) {
            sendResponse({ ok: false, error: "Builder detected, but content script communication failed. Refresh the builder tab and try again." });
            return;
          }
          sendResponse({
            ok: true,
            attempted: true,
            verified: csResult?.verified === true,
            strategy: "content-script-inject",
            message: csResult?.message ?? `"${cap.title}" \u2014 injection attempted via content script.`,
            strategies: csResult?.strategies,
            globals: csResult?.globals
          });
        } catch (err) {
          sendResponse({ ok: false, error: String(err).replace("Error: ", "") });
        }
      })();
      return true;
    }
    case "REPLAY_TEST_SECTION": {
      (async () => {
        try {
          const payload = message.payload ?? {};
          const candidateId = payload.candidateId;
          const targetTabId = payload.targetTabId;
          const targetFrameId = payload.targetFrameId;
          const inlineCand = payload.candidate;
          if (!candidateId && !inlineCand) {
            sendResponse({ ok: false, error: "No candidateId or candidate provided" });
            return;
          }
          let cand = inlineCand;
          if (!cand && candidateId) {
            const allCandidates = await getImportCandidates();
            cand = allCandidates.find((c) => c.id === candidateId);
          }
          if (!cand) {
            sendResponse({ ok: false, error: `Candidate not found (id: ${candidateId ?? "n/a"})` });
            return;
          }
          const replayUrl = cand.url ?? cand.fullUrl ?? cand.endpoint ?? "";
          const replayMethod = cand.method ?? "";
          if (!replayUrl || !replayMethod) {
            sendResponse({ ok: false, error: "Candidate missing required url or method for replay" });
            return;
          }
          if (!cand.url) cand = { ...cand, url: replayUrl, method: replayMethod };
          const SECTION_SELS = ["[data-type='section']", "[data-section]", ".hl-section", "section", "[class*='section']"];
          const countSections = () => {
            const SELS = ["[data-type='section']", "[data-section]", ".hl-section", "section", "[class*='section']"];
            let n = 0;
            for (const s of SELS) {
              try {
                const c = document.querySelectorAll(s).length;
                if (c > n) n = c;
              } catch {
              }
            }
            return n;
          };
          void SECTION_SELS;
          let sectionsBefore = 0;
          if (targetTabId) {
            try {
              const snapRes = await chrome.scripting.executeScript({ target: { tabId: targetTabId }, world: "MAIN", func: countSections });
              sectionsBefore = Number(snapRes?.[0]?.result ?? 0) || 0;
            } catch {
            }
          }
          const replayResult = await attemptTestSectionReplay(cand, targetTabId, targetFrameId);
          let sectionsAfter = 0;
          if (targetTabId && replayResult.ok) {
            await new Promise((r) => setTimeout(r, 900));
            try {
              const snapRes = await chrome.scripting.executeScript({ target: { tabId: targetTabId }, world: "MAIN", func: countSections });
              sectionsAfter = Number(snapRes?.[0]?.result ?? 0) || 0;
            } catch {
            }
          }
          const safeBefore = Number(sectionsBefore) || 0;
          const safeAfter = Number(sectionsAfter) || 0;
          const sectionsDelta = safeAfter - safeBefore;
          sendResponse({ ...replayResult, sectionsDelta, sectionsBefore: safeBefore });
        } catch (err) {
          sendResponse({ ok: false, error: String(err).replace("Error: ", "") });
        }
      })();
      return true;
    }
    case "CRAWL_PROGRESS":
      sendResponse({ ok: true });
      return false;
    case "ERROR":
      logger.error("router", "Error message received", message.payload);
      sendResponse({ ok: true });
      return false;
    default: {
      const _exhaustive = message;
      logger.warn("router", `Unhandled message type: ${message.type}`);
      sendResponse({ ok: false, error: "Unknown message type" });
      return false;
    }
  }
}
async function handleDetectContext(sendResponse) {
  try {
    const tab = await getActiveTab();
    if (!tab?.id) {
      sendResponse({ ok: false, error: "No active tab" });
      return;
    }
    const cached = getTabContext(tab.id);
    if (cached) {
      sendResponse({ ok: true, data: cached });
      return;
    }
    const result = await pingContentScript(tab.id, { type: "DO_DETECT_CONTEXT" });
    if (result?.ok && result.data) {
      setTabContext(tab.id, result.data);
      sendResponse({ ok: true, data: result.data });
    } else {
      sendResponse({ ok: true, data: null });
    }
  } catch (err) {
    logger.error("router", "Failed to detect context", err);
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleCapturePublicPage(sendResponse) {
  try {
    const tab = await getActiveTab();
    if (!tab?.id) {
      sendResponse({ ok: false, error: "No active tab" });
      return;
    }
    const result = await pingContentScript(tab.id, { type: "DO_CAPTURE_PAGE" });
    if (!result?.ok || !result.data) {
      sendResponse({ ok: false, error: result?.error || "Capture returned no data" });
      return;
    }
    const capture = result.data;
    try {
      const cmsProbe = await chrome.scripting.executeScript({
        target: { tabId: tab.id, frameIds: [0] },
        world: "MAIN",
        func: _detectCmsFunc
      });
      const platform = cmsProbe?.[0]?.result;
      if (platform && typeof platform === "string" && platform !== "Web") {
        capture.platform = platform;
        logger.info("router", `handleCapturePublicPage: platform=${platform}`);
      }
    } catch (cmsErr) {
      logger.warn("router", `handleCapturePublicPage: CMS detect failed (non-fatal): ${String(cmsErr).slice(0, 80)}`);
    }
    const sourceUrl = capture.source?.url ?? tab.url ?? "";
    let ghl = null;
    try {
      const stored = await chrome.storage.session.get(`ghl_tab_${tab.id}`);
      const cached = stored[`ghl_tab_${tab.id}`];
      if (cached?.funnelId && cached?.stepId) {
        ghl = cached;
        logger.info("router", `handleCapturePublicPage: Path A (inject cache) \u2014 funnelId=${ghl.funnelId} stepId=${ghl.stepId}`);
      }
    } catch (_) {
    }
    if (!ghl) {
      try {
        for (const delay2 of [0, 300, 700, 1500]) {
          if (delay2 > 0) await new Promise((r) => setTimeout(r, delay2));
          const probe = await chrome.scripting.executeScript({
            target: { tabId: tab.id, frameIds: [0] },
            world: "MAIN",
            func: _extractGhlMetadataFunc
          });
          const raw = probe?.[0]?.result;
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          logger.info("router", `handleCapturePublicPage: Path B delay=${delay2}ms isGhlPage=${parsed.isGhlPage} funnelId=${parsed.funnelId ?? "(none)"} log=[${parsed.debugLog ?? ""}]`);
          if (parsed.isGhlPage && parsed.funnelId && parsed.stepId) {
            ghl = parsed;
            break;
          }
        }
        if (ghl) logger.info("router", `handleCapturePublicPage: Path B confirmed \u2014 funnelId=${ghl.funnelId} stepId=${ghl.stepId} source=${ghl.source}`);
        else logger.info("router", "handleCapturePublicPage: Path B found no GHL metadata");
      } catch (probeErr) {
        logger.warn("router", `handleCapturePublicPage: Path B failed (non-fatal): ${String(probeErr).slice(0, 150)}`);
      }
    }
    if (!ghl && sourceUrl) {
      try {
        let parsedUrl = null;
        try {
          parsedUrl = new URL(sourceUrl);
        } catch {
        }
        if (parsedUrl) {
          const allTabs = await chrome.tabs.query({});
          const builderTabForLookup = allTabs.find(
            (t) => t.url && /page-builder\.leadconnectorhq\.com|app\.gohighlevel\.com/.test(t.url)
          );
          if (builderTabForLookup?.id) {
            logger.info("router", `handleCapturePublicPage: Path C CRM lookup for domain=${parsedUrl.hostname} via builderTab=${builderTabForLookup.id}`);
            const lookupRes = await chrome.scripting.executeScript({
              target: { tabId: builderTabForLookup.id, frameIds: [0] },
              world: "MAIN",
              func: _lookupGhlPageByDomainFunc,
              args: [parsedUrl.hostname, parsedUrl.pathname]
            });
            const domainRaw = lookupRes?.[0]?.result;
            if (domainRaw) {
              const domainResult = JSON.parse(domainRaw);
              logger.info("router", `handleCapturePublicPage: Path C result ok=${domainResult.ok} funnelId=${domainResult.funnelId ?? "?"} log=[${domainResult.log ?? ""}]`);
              if (domainResult.ok && domainResult.funnelId && domainResult.stepId) {
                ghl = { funnelId: domainResult.funnelId, stepId: domainResult.stepId, locationId: domainResult.locationId ?? "", source: "crm-domain-lookup" };
              }
            }
          } else {
            logger.info("router", "handleCapturePublicPage: Path C skipped \u2014 no HL builder tab open");
          }
        }
      } catch (lookupErr) {
        logger.warn("router", `handleCapturePublicPage: Path C failed (non-fatal): ${String(lookupErr).slice(0, 150)}`);
      }
    }
    if (ghl) {
      capture.isGhlPage = true;
      capture.ghlFunnelId = ghl.funnelId;
      capture.ghlStepId = ghl.stepId;
      capture.ghlLocationId = ghl.locationId ?? "";
      logger.info("router", `handleCapturePublicPage: GHL confirmed via ${ghl.source} \u2014 funnelId=${ghl.funnelId} stepId=${ghl.stepId}`);
    } else {
      logger.info("router", "handleCapturePublicPage: all 3 detection paths failed \u2014 not a detectable GHL page");
    }
    await savePackage(capture);
    sendResponse({ ok: true, data: capture });
  } catch (err) {
    logger.error("router", "Failed to capture page", err);
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleEnableInspector(sendResponse) {
  try {
    const state = await getInspectorSessionState();
    const targetTabId = state.editorTabId ?? (await getActiveTab())?.id ?? null;
    if (!targetTabId) {
      sendResponse({ ok: false, error: "No editor tab found. Open the HighLevel editor first." });
      return;
    }
    const result = await pingContentScript(targetTabId, { type: "DO_ENABLE_INSPECTOR" });
    if (result?.ok) {
      const next = await patchInspectorSessionState({ enabled: true, tabId: targetTabId });
      addDiagnostic(createDiagnosticEntry("info", "INSPECTOR_ENABLED", `Inspector enabled on tab ${targetTabId}`));
      broadcastToInspectors({ type: "STATE_UPDATE", payload: next });
      sendResponse({ ok: true, data: result.data });
    } else {
      sendResponse({ ok: false, error: result?.error || "Failed to enable inspector", warning: result?.warning });
    }
  } catch (err) {
    logger.error("router", "Failed to enable inspector", err);
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleDisableInspector(sendResponse) {
  try {
    const state = await getInspectorSessionState();
    const targetTabId = state.tabId ?? (await getActiveTab())?.id ?? null;
    if (targetTabId) {
      try {
        await sendToContentScript(targetTabId, { type: "DO_DISABLE_INSPECTOR" });
      } catch {
      }
    }
    const next = await patchInspectorSessionState({ enabled: false, tabId: null });
    broadcastToInspectors({ type: "STATE_UPDATE", payload: next });
    sendResponse({ ok: true, data: { enabled: false } });
  } catch (err) {
    logger.error("router", "Failed to disable inspector", err);
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleSnapshotCaptured(payload, sendResponse) {
  try {
    await addSnapshot(payload);
    const next = await patchInspectorSessionState({ lastSnapshotAt: payload.timestamp });
    logger.info("router", `Snapshot saved: ${payload.id} \u2014 ${payload.requestUrl}`);
    broadcastToInspectors({ type: "STATE_UPDATE", payload: next });
    broadcastToInspectors({ type: "SNAPSHOT_ADDED", payload });
    sendResponse({ ok: true });
  } catch (err) {
    logger.error("router", "Failed to save snapshot", err);
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleCrawlFunnel(payload, sendResponse) {
  try {
    const settings = await getSettings();
    const config = {
      rootUrl: payload.rootUrl,
      maxDepth: payload.maxDepth ?? settings.maxCrawlDepth,
      maxPages: payload.maxPages ?? settings.maxPages,
      delayMs: payload.delayMs ?? settings.crawlDelayMs,
      allowedDomains: payload.allowedDomains ?? [],
      includePatterns: payload.includePatterns ?? [],
      excludePatterns: payload.excludePatterns ?? [],
      stripQueryStrings: payload.stripQueryStrings ?? settings.stripQueryStrings
    };
    logger.info("router", "Starting crawl", config);
    const map = await crawlFunnel(config);
    await saveFunnelMap(map);
    sendResponse({ ok: true, data: map });
  } catch (err) {
    logger.error("router", "Crawl failed", err);
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleExportAssetManifest(sendResponse) {
  const pkg = await getLastPackage();
  if (pkg) {
    sendResponse({ ok: true, data: { version: 1, generatedAt: (/* @__PURE__ */ new Date()).toISOString(), sourceUrl: pkg.source.url, totalAssets: pkg.assets.length, assets: pkg.assets } });
  } else {
    sendResponse({ ok: false, error: "No package available" });
  }
}
async function handleClearSession(sendResponse) {
  await clearSession();
  await clearPackages();
  await clearCrawlData();
  sendResponse({ ok: true });
}
async function handleGetBridgeStatus(sendResponse) {
  try {
    const state = await getInspectorSessionState();
    const targetTabId = state.editorTabId ?? state.tabId ?? null;
    let bridgeData = {};
    if (targetTabId) {
      try {
        const tab = await chrome.tabs.get(targetTabId);
        bridgeData.tabUrl = tab.url ?? null;
        const result = await chrome.tabs.sendMessage(targetTabId, { type: "DO_GET_BRIDGE_STATUS" });
        if (result?.ok && result.data) {
          bridgeData = { ...bridgeData, ...result.data };
        }
      } catch {
        bridgeData.contentScriptReachable = false;
      }
    }
    sendResponse({
      ok: true,
      data: {
        editorTabId: state.editorTabId,
        monitoredTabId: state.tabId,
        enabled: state.enabled,
        lastSnapshotAt: state.lastSnapshotAt,
        ...bridgeData
      }
    });
  } catch (err) {
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleInjectTestSnapshot(sendResponse) {
  try {
    const state = await getInspectorSessionState();
    const testSnapshot = {
      id: `test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      tabUrl: `https://app.gohighlevel.com/location/test/page-builder/test-page`,
      builderFamily: "highlevel",
      requestUrl: `https://services.leadconnectorhq.com/pages/test-event`,
      method: "POST",
      statusCode: 200,
      payloadSize: 128,
      looksLikeStructure: true,
      rawBody: JSON.stringify({ elements: [{ id: "test-1", type: "section", content: "Test Event" }], test: true }, null, 2),
      contentType: "application/json",
      label: "Test Event"
    };
    await handleSnapshotCapturedInternal(testSnapshot);
    sendResponse({ ok: true, data: testSnapshot });
  } catch (err) {
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleSnapshotCapturedInternal(payload) {
  await addSnapshot(payload);
  const next = await patchInspectorSessionState({ lastSnapshotAt: payload.timestamp });
  broadcastToInspectors({ type: "STATE_UPDATE", payload: next });
  broadcastToInspectors({ type: "SNAPSHOT_ADDED", payload });
}
async function handleExtractState(tabId, sendResponse) {
  try {
    let targetTabId = tabId;
    if (!targetTabId) {
      const state = await getInspectorSessionState();
      targetTabId = state.editorTabId ?? state.tabId ?? (await getActiveTab())?.id ?? null;
    }
    if (!targetTabId) {
      sendResponse({ ok: false, error: "No HighLevel editor tab found. Open the HL editor first." });
      return;
    }
    const { ok, result, error } = await runStateExtract(targetTabId);
    broadcastToInspectors({ type: "STATE_EXTRACT_DONE", payload: result });
    sendResponse({ ok, data: result, error });
  } catch (err) {
    logger.error("router", "handleExtractState failed", err);
    sendResponse({ ok: false, error: String(err) });
  }
}
function ts() {
  return (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
async function handleActivateBridgeDebug(sendResponse) {
  const log2 = [];
  try {
    log2.push(`[${ts()}] \u25B6 Stage 1 \u2014 Inspector sent ACTIVATE_BRIDGE_DEBUG`);
    log2.push(`[${ts()}] \u2714 Stage 2 \u2014 Background received ACTIVATE_BRIDGE_DEBUG`);
    const state = await getInspectorSessionState();
    const targetTabId = state.editorTabId ?? null;
    log2.push(`[${ts()}] Stage 2 \u2014 editorTabId in session: ${targetTabId ?? "none"}`);
    if (!targetTabId) {
      log2.push(`[${ts()}] \u2717 Stage 2 \u2014 FAIL: no editorTabId. Open the HL editor first.`);
      sendResponse({ ok: false, log: log2, error: "No editorTabId in session" });
      return;
    }
    try {
      const tab = await chrome.tabs.get(targetTabId);
      log2.push(`[${ts()}] Stage 2 \u2014 Tab URL: ${tab.url ?? "unknown"}`);
    } catch {
      log2.push(`[${ts()}] Stage 2 \u2014 WARNING: could not read tab URL`);
    }
    await chrome.storage.local.remove("clonelevel_bridge_ack");
    log2.push(`[${ts()}] Stage 2 \u2014 Cleared previous BRIDGE_ACK from storage`);
    log2.push(`[${ts()}] Stage 2b \u2014 Injecting bridge runtime into MAIN world via chrome.scripting\u2026`);
    try {
      await chrome.scripting.executeScript({
        target: { tabId: targetTabId, allFrames: false },
        files: ["content/bridge/page-bridge-runtime.js"],
        world: "MAIN"
      });
      log2.push(`[${ts()}] \u2714 Stage 2b \u2014 Bridge runtime file loaded into MAIN world`);
    } catch (injErr) {
      log2.push(`[${ts()}] \u26A0 Stage 2b \u2014 executeScript(files) failed: ${String(injErr)} \u2014 bridge may already be active`);
    }
    log2.push(`[${ts()}] Stage 2c \u2014 Calling installNetworkInterceptors() from MAIN world via executeScript\u2026`);
    try {
      const enableResult = await chrome.scripting.executeScript({
        target: { tabId: targetTabId, allFrames: false },
        world: "MAIN",
        func: () => {
          const ds = document.documentElement.dataset;
          const bridge = window.__clonelevel_bridge;
          if (!bridge) {
            return { ok: false, reason: "__clonelevel_bridge not found on window" };
          }
          if (typeof bridge.installNetworkInterceptors !== "function") {
            return { ok: false, reason: "installNetworkInterceptors not a function on bridge" };
          }
          ds.clBridgeEnabled = "1";
          bridge.installNetworkInterceptors();
          const ps = bridge.patchStatus?.() ?? {};
          return {
            ok: true,
            patchStatus: ps,
            fetchPatched: ds.clFetchPatched === "1",
            xhrPatched: ds.clXhrPatched === "1"
          };
        }
      });
      const res = enableResult?.[0]?.result;
      if (res?.ok) {
        log2.push(`[${ts()}] \u2714 Stage 2c \u2014 installNetworkInterceptors() done. fetch=${res.fetchPatched} xhr=${res.xhrPatched}`);
        if (res.patchStatus) log2.push(`[${ts()}] Stage 2c \u2014 patchStatus: ${JSON.stringify(res.patchStatus)}`);
      } else {
        log2.push(`[${ts()}] \u2717 Stage 2c \u2014 ${res?.reason ?? "unknown error calling installNetworkInterceptors"}`);
      }
    } catch (enableErr) {
      log2.push(`[${ts()}] \u26A0 Stage 2c \u2014 executeScript(func) failed: ${String(enableErr)}`);
    }
    log2.push(`[${ts()}] Stage 2 \u2192 Stage 3 \u2014 Forwarding DO_ACTIVATE_BRIDGE to content script in tab ${targetTabId}`);
    const result = await pingContentScript(targetTabId, { type: "DO_ACTIVATE_BRIDGE" });
    if (!result) {
      log2.push(`[${ts()}] \u2717 Stage 3 \u2014 FAIL: pingContentScript returned null (content script unreachable)`);
      sendResponse({ ok: false, log: log2, error: "Content script unreachable after retries" });
      return;
    }
    if (!result.ok) {
      log2.push(`[${ts()}] \u2717 Stage 3 \u2014 FAIL: ${result.error ?? "unknown error"}`);
      sendResponse({ ok: false, log: log2, error: result.error });
      return;
    }
    if (result.log) log2.push(...result.log);
    log2.push(`[${ts()}] \u2714 Stage 4 \u2014 Content script responded OK. Waiting for bridge ACK in storage\u2026`);
    sendResponse({ ok: true, log: log2, data: result.data });
  } catch (err) {
    log2.push(`[${ts()}] \u2717 Exception: ${String(err)}`);
    sendResponse({ ok: false, log: log2, error: String(err) });
  }
}
async function handleActivateBridgeFallback(sendResponse) {
  const log2 = [];
  try {
    log2.push(`[${ts()}] \u25B6 Fallback \u2014 Background received ACTIVATE_BRIDGE_FALLBACK`);
    const state = await getInspectorSessionState();
    const targetTabId = state.editorTabId ?? null;
    if (!targetTabId) {
      log2.push(`[${ts()}] \u2717 Fallback \u2014 no editorTabId in session`);
      sendResponse({ ok: false, log: log2, error: "No editorTabId" });
      return;
    }
    log2.push(`[${ts()}] Fallback \u2014 Using chrome.scripting.executeScript world=MAIN on tab ${targetTabId}`);
    await chrome.scripting.executeScript({
      target: { tabId: targetTabId },
      world: "MAIN",
      func: () => {
        const ds = document.documentElement.dataset;
        console.log("[CloneLevel] Fallback scripting injection running in MAIN world");
        if (window.__clonelevel_bridge_active) {
          window.__CLONELEVEL_BRIDGE_ENABLE__ = true;
          ds.clBridgeEnabled = "1";
          window.postMessage({ source: "clonelevel-content", type: "ENABLE_INSPECTOR" }, "*");
          console.log("[CloneLevel] Fallback: bridge was loaded \u2014 sent ENABLE_INSPECTOR from main world");
        } else {
          window.__CLONELEVEL_BRIDGE_ENABLE__ = true;
          ds.clBridgeFallback = "1";
          console.warn(
            "[CloneLevel] Fallback: bridge NOT loaded \u2014 __clonelevel_bridge_active is false.",
            "This means HighLevel CSP blocked the <script src> injection.",
            "Set __CLONELEVEL_BRIDGE_ENABLE__ = true and ds.clBridgeFallback = '1' for bridge to pick up on load."
          );
        }
      }
    });
    log2.push(`[${ts()}] \u2714 Fallback \u2014 executeScript finished. Check the HL editor console for [CloneLevel] logs.`);
    log2.push(`[${ts()}] Fallback \u2014 If bridge was loaded: postMessage sent from main world.`);
    log2.push(`[${ts()}] Fallback \u2014 If bridge NOT loaded: CSP is blocking extension script injection.`);
    log2.push(`[${ts()}] Fallback \u2014 Check document.documentElement.dataset.clBridgeFallback in HL editor console.`);
    sendResponse({ ok: true, log: log2 });
  } catch (err) {
    log2.push(`[${ts()}] \u2717 Fallback exception: ${String(err)}`);
    sendResponse({ ok: false, log: log2, error: String(err) });
  }
}
async function handlePingBridgeFromInspector(msgPayload, sendResponse) {
  try {
    const state = await getInspectorSessionState();
    const targetTabId = state.editorTabId ?? null;
    if (!targetTabId) {
      sendResponse({ ok: false, error: "No editorTabId in session" });
      return;
    }
    const nonce = msgPayload?.nonce ?? `ping_${Date.now()}`;
    await chrome.storage.local.remove("clonelevel_bridge_ping_ack");
    const result = await pingContentScript(targetTabId, { type: "DO_PING_BRIDGE", payload: { nonce } });
    sendResponse({ ok: result?.ok ?? false, data: { nonce }, error: result?.error });
  } catch (err) {
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleInspectorBridgeAck(payload, sendResponse) {
  try {
    await chrome.storage.local.set({ clonelevel_bridge_ack: payload });
    broadcastToInspectors({ type: "BRIDGE_ACK_RECEIVED", payload });
    sendResponse({ ok: true });
  } catch (err) {
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleAttachDebugger(sendResponse) {
  try {
    const state = await getInspectorSessionState();
    const targetTabId = state.editorTabId ?? (await getActiveTab())?.id ?? null;
    if (!targetTabId) {
      sendResponse({ ok: false, error: "No tab found. Open the HighLevel editor and try again." });
      return;
    }
    const result = await attachDebugger(targetTabId);
    sendResponse({ ok: result.ok, error: result.error, data: { tabId: targetTabId } });
  } catch (err) {
    sendResponse({ ok: false, error: String(err) });
  }
}
async function handleDetachDebugger(sendResponse) {
  try {
    const result = await detachDebugger();
    sendResponse({ ok: result.ok, error: result.error });
  } catch (err) {
    sendResponse({ ok: false, error: String(err) });
  }
}

// clonelevel/src/background/service-worker.ts
logger.info("service-worker", "CloneLevel service worker started");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const keepOpen = handleMessage(message, sender, sendResponse);
  return keepOpen;
});
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "cl-inspector") {
    registerInspectorPort(port);
    logger.info("service-worker", "Inspector panel connected");
  }
});
chrome.debugger.onEvent.addListener((source, method, params) => {
  handleDebuggerEvent(source, method, params).catch((err) => {
    logger.warn("service-worker", `debugger event error (${method}): ${String(err)}`);
  });
});
chrome.debugger.onDetach.addListener((_source, reason) => {
  logger.info("service-worker", `Debugger detached: ${reason}`);
  detachDebugger().catch(() => {
  });
});
chrome.tabs.onRemoved.addListener((tabId) => {
  removeTabContext(tabId);
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    removeTabContext(tabId);
  }
  if (changeInfo.status === "complete" && tab.url) {
    updateRealTab(tab);
  }
});
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    updateRealTab(tab);
  } catch {
  }
});
chrome.runtime.onInstalled.addListener((details) => {
  logger.info("service-worker", `CloneLevel installed: ${details.reason}`);
});
if (chrome.webRequest?.onBeforeSendHeaders) {
  chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      if (details.requestHeaders && details.url && details.method) {
        updateHeaderBuffer(details.url, details.method, details.requestHeaders);
      }
    },
    {
      urls: [
        "*://backend.leadconnectorhq.com/*",
        "*://services.leadconnectorhq.com/*",
        "*://*.gohighlevel.com/*",
        "*://*.msgsndr.com/*",
        "*://*.app.ghl.io/*"
      ]
    },
    ["requestHeaders"]
  );
  logger.info("service-worker", "webRequest.onBeforeSendHeaders registered for HL domains");
} else {
  logger.warn("service-worker", "webRequest.onBeforeSendHeaders not available \u2014 header buffer disabled");
}
//# sourceMappingURL=service-worker.js.map
