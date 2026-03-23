import type { GeneratedFunnelAssets } from "@/types/generation";

// ── Types ─────────────────────────────────────────────────────────────────

type SV = { value: string | number; unit?: string };
type StyleMap = Record<string, SV>;

export interface GhlNode {
  id: string;
  metaData: Record<string, unknown>;
}

export interface GhlPageData {
  sections: GhlNode[];
  rows: Record<string, GhlNode>;
  columns: Record<string, GhlNode>;
  elements: Record<string, GhlNode>;
}

interface Builder extends GhlPageData {}

// ── Low-level helpers ──────────────────────────────────────────────────────

function ghlId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function sv(n: number, unit = "px"): SV { return { value: n, unit }; }
function ss(s: string): SV { return { value: s }; }

const VISIBILITY = { value: { hideMobile: false, hideDesktop: false } };
const SECTION_CLASS = {
  borders: { value: "noBorder" },
  borderRadius: { value: "radius0" },
};
const BG_IMAGE_EMPTY = {
  value: {
    options: "bgCover", url: "", svgCode: "", opacity: ".3",
    servingUrl: "", placeholderBase64: "", imageMeta: "",
    showSvgToggle: false, videoUrl: "",
  },
};

function buildNode(
  id: string,
  type: string,
  tagName: string,
  meta: string,
  title: string,
  child: string[],
  styles: StyleMap,
  mobileStyles: StyleMap,
  extra: Record<string, unknown> = {},
  classObj?: Record<string, unknown>,
): GhlNode {
  const base: Record<string, unknown> = {
    id, _id: id, type, tagName, meta, title,
    wrapper: {},
    child,
    extra: { visibility: VISIBILITY, ...extra },
    styles,
    mobileStyles,
  };
  if (classObj) base.class = classObj;
  base.element = { ...base };
  return { id, metaData: base };
}

// ── Section ────────────────────────────────────────────────────────────────

interface SectionOpts {
  bg?: string;
  bgColor?: string;
  ptD?: number; pbD?: number;
  ptM?: number; pbM?: number;
}

function makeSection(children: string[], opts: SectionOpts = {}): GhlNode {
  const id = ghlId("section");
  const styles: StyleMap = {
    paddingTop:    sv(opts.ptD ?? 80),
    paddingBottom: sv(opts.pbD ?? 80),
  };
  if (opts.bg)      styles.background      = ss(opts.bg);
  if (opts.bgColor) styles.backgroundColor = ss(opts.bgColor);

  return buildNode(
    id, "section", "c-section", "section", "Section",
    children,
    styles,
    { paddingTop: sv(opts.ptM ?? 48), paddingBottom: sv(opts.pbM ?? 48) },
    {
      desktopFontSize: sv(22),
      mobileFontSize:  { value: "16", unit: "px" },
      typography:      ss("var(--contentfont)"),
      bgImage:         BG_IMAGE_EMPTY,
    },
    SECTION_CLASS,
  );
}

// ── Row ────────────────────────────────────────────────────────────────────

function makeRow(children: string[], maxWidth = 1200, padH = 0): GhlNode {
  const id = ghlId("row");
  return buildNode(
    id, "row", "c-row", "row", "Row",
    children,
    {
      maxWidth:     sv(maxWidth),
      marginLeft:   ss("auto"),
      marginRight:  ss("auto"),
      width:        sv(100, "%"),
      paddingLeft:  sv(padH),
      paddingRight: sv(padH),
    },
    {},
    { visibility: VISIBILITY },
  );
}

// ── Column ─────────────────────────────────────────────────────────────────

function makeCol(
  children: string[],
  widthPct = 100,
  opts: { padH?: number; padV?: number; align?: string; valign?: string } = {},
): GhlNode {
  const id = ghlId("col");
  const styles: StyleMap = {
    width:        sv(widthPct, "%"),
    paddingLeft:  sv(opts.padH ?? 16),
    paddingRight: sv(opts.padH ?? 16),
    paddingTop:   sv(opts.padV ?? 0),
    paddingBottom: sv(opts.padV ?? 0),
  };
  if (opts.align)  styles.textAlign       = ss(opts.align);
  if (opts.valign) styles.verticalAlign   = ss(opts.valign);

  return buildNode(
    id, "col", "c-col", "col", "Column",
    children,
    styles,
    {},
    { visibility: VISIBILITY, width: sv(widthPct, "%") },
  );
}

// ── Elements ───────────────────────────────────────────────────────────────

function makeHeadline(
  text: string,
  tag: "h1" | "h2" | "h3" | "h4",
  styles: StyleMap,
  mobileStyles: StyleMap = {},
): GhlNode {
  return buildNode(
    ghlId("el"), "element", "c-headline", "headline", "Headline",
    [],
    styles,
    mobileStyles,
    { tag: ss(tag), content: ss(text), typography: ss("var(--contentfont)") },
  );
}

function makeParagraph(text: string, styles: StyleMap, mobileStyles: StyleMap = {}): GhlNode {
  return buildNode(
    ghlId("el"), "element", "c-paragraph", "paragraph", "Paragraph",
    [],
    styles,
    mobileStyles,
    { content: ss(text), typography: ss("var(--contentfont)") },
  );
}

function makeButton(
  label: string,
  action: "next-step" | "url",
  url = "",
  styles: StyleMap = {},
  mobileStyles: StyleMap = {},
): GhlNode {
  return buildNode(
    ghlId("el"), "element", "c-button", "button", "Button",
    [],
    {
      backgroundColor: ss("#f97316"),
      color:           ss("#ffffff"),
      fontSize:        sv(17),
      fontWeight:      ss("700"),
      minHeight:       sv(54),
      borderRadius:    sv(999),
      paddingLeft:     sv(36),
      paddingRight:    sv(36),
      paddingTop:      sv(14),
      paddingBottom:   sv(14),
      textAlign:       ss("center"),
      display:         ss("inline-block"),
      ...styles,
    },
    { width: sv(100, "%"), ...mobileStyles },
    { content: ss(label), action: ss(action), url: ss(url), typography: ss("var(--contentfont)") },
  );
}

function makeForm(): GhlNode {
  return buildNode(
    ghlId("el"), "element", "c-form", "form", "Form",
    [], {}, {},
    { formId: ss("") },
  );
}

function makeDivider(color = "rgba(255,255,255,0.1)", marginV = 12): GhlNode {
  return buildNode(
    ghlId("el"), "element", "c-divider", "divider", "Divider",
    [],
    { borderColor: ss(color), borderWidth: sv(1), marginTop: sv(marginV), marginBottom: sv(marginV) },
    {},
  );
}

// ── Builder accumulator ────────────────────────────────────────────────────

function createBuilder(): Builder {
  return { sections: [], rows: {}, columns: {}, elements: {} };
}

function el(b: Builder, n: GhlNode): string  { b.elements[n.id] = n; return n.id; }
function co(b: Builder, n: GhlNode): string  { b.columns[n.id]  = n; return n.id; }
function ro(b: Builder, n: GhlNode): string  { b.rows[n.id]     = n; return n.id; }
function sec(b: Builder, n: GhlNode): void   { b.sections.push(n); }

// ── LANDING PAGE ───────────────────────────────────────────────────────────

export function buildLandingPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const lp      = data.landingPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  // ── 1. HERO ──────────────────────────────────────────────────────────────
  {
    const badge = el(b, makeParagraph(
      `🔥 Limited Spots — ${concept}`,
      { color: ss("#fb923c"), fontSize: sv(13), fontWeight: ss("600"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
    ));
    const h1 = el(b, makeHeadline(
      lp.headlineOptions[0] ?? `Join the Free ${concept}`,
      "h1",
      { color: ss("#ffffff"), fontSize: sv(54), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.08"), paddingBottom: sv(20), maxWidth: sv(820), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(30), paddingBottom: sv(16) },
    ));
    const sub = el(b, makeParagraph(
      lp.subheadline,
      { color: ss("#94a3b8"), fontSize: sv(19), textAlign: ss("center"), lineHeight: ss("1.7"), maxWidth: sv(620), marginLeft: ss("auto"), marginRight: ss("auto"), paddingBottom: sv(36) },
      { fontSize: sv(16) },
    ));
    const cta = el(b, makeButton(
      `${lp.ctaText} →`, "next-step", "",
      { backgroundColor: ss("#f97316"), boxShadow: ss("0 12px 32px rgba(249,115,22,0.45)") },
    ));
    const elIds = [badge, h1, sub, cta];
    if (lp.urgencyIdeas[0]) {
      elIds.push(el(b, makeParagraph(
        lp.urgencyIdeas[0],
        { color: ss("#f87171"), fontSize: sv(13), fontWeight: ss("600"), textAlign: ss("center"), paddingTop: sv(18) },
      )));
    }
    const c = co(b, makeCol(elIds, 100, { align: "center", padH: 32 }));
    const r = ro(b, makeRow([c], 860, 0));
    sec(b, makeSection([r], {
      bg: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%)",
      ptD: 108, pbD: 108, ptM: 64, pbM: 64,
    }));
  }

  // ── 2. SOCIAL PROOF BAR ───────────────────────────────────────────────────
  {
    const stars = el(b, makeParagraph(
      "⭐⭐⭐⭐⭐  500+ coaches launched",
      { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") },
    ));
    const sep = el(b, makeParagraph(
      "·",
      { color: ss("#334155"), fontSize: sv(20), textAlign: ss("center") },
    ));
    const promise = el(b, makeParagraph(
      `✓  ${data.offerSummary.corePromise}`,
      { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") },
    ));
    const sep2 = el(b, makeParagraph(
      "·",
      { color: ss("#334155"), fontSize: sv(20), textAlign: ss("center") },
    ));
    const noCard = el(b, makeParagraph(
      "✓  No credit card required",
      { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") },
    ));
    const c1 = co(b, makeCol([stars],   33, { align: "center" }));
    const c2 = co(b, makeCol([sep],      4, { align: "center" }));
    const c3 = co(b, makeCol([promise], 26, { align: "center" }));
    const c4 = co(b, makeCol([sep2],     4, { align: "center" }));
    const c5 = co(b, makeCol([noCard],  33, { align: "center" }));
    const r  = ro(b, makeRow([c1, c2, c3, c4, c5], 1200, 24));
    sec(b, makeSection([r], {
      bgColor: "#1e293b", ptD: 20, pbD: 20, ptM: 16, pbM: 16,
    }));
  }

  // ── 3. BENEFITS ───────────────────────────────────────────────────────────
  {
    const eyebrow = el(b, makeParagraph(
      "What You'll Get",
      { color: ss("#f97316"), fontSize: sv(11), fontWeight: ss("700"), textAlign: ss("center"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(8) },
    ));
    const h2 = el(b, makeHeadline(
      "Everything you need to succeed in 30 days",
      "h2",
      { color: ss("#111827"), fontSize: sv(36), fontWeight: ss("800"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(52), maxWidth: sv(640), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(24), paddingBottom: sv(32) },
    ));
    const headerCol = co(b, makeCol([eyebrow, h2], 100, { align: "center" }));
    const headerRow = ro(b, makeRow([headerCol], 800));

    const bullets = lp.bulletPoints.slice(0, 6);
    const perRow  = 3;
    const bulletRows: string[] = [];
    for (let start = 0; start < bullets.length; start += perRow) {
      const rowBullets = bullets.slice(start, start + perRow);
      const colWidth   = Math.floor(100 / rowBullets.length);
      const colIds = rowBullets.map((b_text) => {
        const icon = el(b, makeParagraph("✓", {
          color: ss("#22c55e"), fontSize: sv(20), fontWeight: ss("900"), paddingBottom: sv(6),
        }));
        const txt = el(b, makeParagraph(b_text, {
          color: ss("#374151"), fontSize: sv(15), lineHeight: ss("1.6"),
        }));
        return co(b, makeCol([icon, txt], colWidth, { padH: 24, padV: 4 }));
      });
      bulletRows.push(ro(b, makeRow(colIds, 1200, 0)));
    }

    sec(b, makeSection([headerRow, ...bulletRows], {
      bgColor: "#ffffff", ptD: 88, pbD: 88, ptM: 56, pbM: 56,
    }));
  }

  // ── 4. FAQ ────────────────────────────────────────────────────────────────
  if (lp.faqItems.length > 0) {
    const heading = el(b, makeHeadline(
      "Frequently Asked Questions",
      "h2",
      { color: ss("#111827"), fontSize: sv(30), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(44) },
      { fontSize: sv(22) },
    ));
    const faqEls = lp.faqItems.slice(0, 5).flatMap((f) => [
      el(b, makeHeadline(f.question, "h3", {
        color: ss("#111827"), fontSize: sv(16), fontWeight: ss("700"),
        paddingTop: sv(24), paddingBottom: sv(8),
      })),
      el(b, makeParagraph(f.answer, {
        color: ss("#6b7280"), fontSize: sv(15), lineHeight: ss("1.7"), paddingBottom: sv(4),
      })),
      el(b, makeDivider("#e5e7eb", 4)),
    ]);
    const c = co(b, makeCol([heading, ...faqEls], 100, { padH: 0 }));
    const r = ro(b, makeRow([c], 680, 24));
    sec(b, makeSection([r], { bgColor: "#f8fafc", ptD: 72, pbD: 80, ptM: 48, pbM: 56 }));
  }

  // ── 5. FINAL CTA ──────────────────────────────────────────────────────────
  {
    const h2 = el(b, makeHeadline(
      "Ready to start? Spots are limited.",
      "h2",
      { color: ss("#ffffff"), fontSize: sv(40), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(600), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(26) },
    ));
    const urgency = el(b, makeParagraph(
      lp.urgencyIdeas[1] ?? "Claim your free spot before they're gone.",
      { color: ss("rgba(255,255,255,0.82)"), fontSize: sv(17), textAlign: ss("center"), paddingBottom: sv(36) },
    ));
    const cta = el(b, makeButton(
      `${lp.ctaText} →`, "next-step", "",
      { backgroundColor: ss("#ffffff"), color: ss("#f97316"), boxShadow: ss("0 8px 24px rgba(0,0,0,0.18)") },
    ));
    const c = co(b, makeCol([h2, urgency, cta], 100, { align: "center", padH: 32 }));
    const r = ro(b, makeRow([c], 640));
    sec(b, makeSection([r], {
      bg: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      ptD: 88, pbD: 88,
    }));
  }

  return b;
}

// ── OPT-IN PAGE ────────────────────────────────────────────────────────────

export function buildOptInPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const form    = data.optInForm;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  const badge = el(b, makeParagraph(
    "Step 1 of 2 — Claim Your Free Spot",
    { color: ss("#c4b5fd"), fontSize: sv(13), fontWeight: ss("600"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
  ));
  const h1 = el(b, makeHeadline(
    `Join the ${concept} — Free`,
    "h1",
    { color: ss("#ffffff"), fontSize: sv(44), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(560), marginLeft: ss("auto"), marginRight: ss("auto") },
    { fontSize: sv(28) },
  ));
  const intro = el(b, makeParagraph(
    form.formIntroText,
    { color: ss("#c4b5fd"), fontSize: sv(16), textAlign: ss("center"), lineHeight: ss("1.7"), maxWidth: sv(460), marginLeft: ss("auto"), marginRight: ss("auto"), paddingBottom: sv(32) },
  ));
  const formEl = el(b, makeForm());
  const trust = el(b, makeParagraph(
    "🔒  Secure · No credit card · Cancel anytime",
    { color: ss("rgba(196,181,253,0.7)"), fontSize: sv(12), textAlign: ss("center"), paddingTop: sv(16) },
  ));

  const c = co(b, makeCol([badge, h1, intro, formEl, trust], 100, { align: "center", padH: 32 }));
  const r = ro(b, makeRow([c], 480));
  sec(b, makeSection([r], {
    bg: "linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #1e1b4b 100%)",
    ptD: 88, pbD: 88, ptM: 56, pbM: 56,
  }));

  return b;
}

// ── THANK YOU PAGE ─────────────────────────────────────────────────────────

export function buildThankYouPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const ty      = data.thankYouPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  // ── 1. HERO ──────────────────────────────────────────────────────────────
  {
    const badge = el(b, makeParagraph(
      `🎉  You're in — Welcome to the ${concept}`,
      { color: ss("#4ade80"), fontSize: sv(13), fontWeight: ss("700"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
    ));
    const h1 = el(b, makeHeadline(
      ty.confirmationMessage,
      "h1",
      { color: ss("#ffffff"), fontSize: sv(46), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(20), maxWidth: sv(740), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(28) },
    ));
    const sub = el(b, makeParagraph(
      ty.bookingEncouragement,
      { color: ss("#86efac"), fontSize: sv(17), textAlign: ss("center"), lineHeight: ss("1.7"), maxWidth: sv(540), marginLeft: ss("auto"), marginRight: ss("auto") },
    ));
    const c = co(b, makeCol([badge, h1, sub], 100, { align: "center", padH: 32 }));
    const r = ro(b, makeRow([c], 880));
    sec(b, makeSection([r], {
      bg: "linear-gradient(160deg, #052e16 0%, #14532d 60%, #052e16 100%)",
      ptD: 100, pbD: 100, ptM: 64, pbM: 64,
    }));
  }

  // ── 2. NEXT STEPS ─────────────────────────────────────────────────────────
  {
    const eyebrow = el(b, makeParagraph(
      "What Happens Next",
      { color: ss("#22c55e"), fontSize: sv(11), fontWeight: ss("700"), textAlign: ss("center"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(8) },
    ));
    const h2 = el(b, makeHeadline(
      "Here's your next steps",
      "h2",
      { color: ss("#111827"), fontSize: sv(32), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(40) },
      { fontSize: sv(22) },
    ));
    const stepEls = ty.nextSteps.flatMap((step, i) => [
      el(b, makeParagraph(`${i + 1}. ${step}`, {
        color: ss("#374151"), fontSize: sv(15), lineHeight: ss("1.65"),
        paddingTop: sv(16), paddingBottom: sv(16),
        paddingLeft: sv(20), paddingRight: sv(20),
        backgroundColor: ss("#f0fdf4"),
        borderRadius: sv(12),
        marginBottom: sv(10),
      })),
    ]);
    const c = co(b, makeCol([eyebrow, h2, ...stepEls], 100, { padH: 0 }));
    const r = ro(b, makeRow([c], 620, 24));
    sec(b, makeSection([r], { bgColor: "#ffffff", ptD: 80, pbD: 80, ptM: 48, pbM: 48 }));
  }

  // ── 3. BOOKING CTA ────────────────────────────────────────────────────────
  {
    const h2 = el(b, makeHeadline(
      "One more step — book your kick-off call",
      "h2",
      { color: ss("#ffffff"), fontSize: sv(36), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.15"), paddingBottom: sv(14), maxWidth: sv(560), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(24) },
    ));
    const sub = el(b, makeParagraph(
      "30 minutes · Free · No sales pressure — just a game plan for your challenge.",
      { color: ss("rgba(255,255,255,0.8)"), fontSize: sv(16), textAlign: ss("center"), paddingBottom: sv(36) },
    ));
    const cta = el(b, makeButton(
      "Book My Free Call →", "next-step", "",
      { backgroundColor: ss("#ffffff"), color: ss("#16a34a"), boxShadow: ss("0 8px 24px rgba(0,0,0,0.15)") },
    ));
    const c = co(b, makeCol([h2, sub, cta], 100, { align: "center", padH: 32 }));
    const r = ro(b, makeRow([c], 640));
    sec(b, makeSection([r], {
      bg: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
      ptD: 80, pbD: 80,
    }));
  }

  return b;
}

// ── BOOKING PAGE ───────────────────────────────────────────────────────────

export function buildBookingPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const bk      = data.bookingPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  // ── 1. HERO ──────────────────────────────────────────────────────────────
  {
    const badge = el(b, makeParagraph(
      "Almost there — pick a time that works for you",
      { color: ss("#fb923c"), fontSize: sv(13), fontWeight: ss("600"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
    ));
    const h1 = el(b, makeHeadline(
      `Book Your Free ${concept} Strategy Call`,
      "h1",
      { color: ss("#ffffff"), fontSize: sv(44), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(640), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(27) },
    ));
    const sub = el(b, makeParagraph(
      bk.shortIntro,
      { color: ss("#fcd34d"), fontSize: sv(16), textAlign: ss("center"), lineHeight: ss("1.7"), maxWidth: sv(520), marginLeft: ss("auto"), marginRight: ss("auto"), opacity: ss("0.9") },
    ));
    const c = co(b, makeCol([badge, h1, sub], 100, { align: "center", padH: 32 }));
    const r = ro(b, makeRow([c], 800));
    sec(b, makeSection([r], {
      bg: "linear-gradient(160deg, #1c0a00 0%, #431407 60%, #1c0a00 100%)",
      ptD: 88, pbD: 88, ptM: 56, pbM: 56,
    }));
  }

  // ── 2. TWO-COLUMN CONTENT ─────────────────────────────────────────────────
  {
    const whyLabel = el(b, makeParagraph(
      "Why Book a Call",
      { color: ss("#d97706"), fontSize: sv(11), fontWeight: ss("700"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(16) },
    ));
    const whyItems = bk.whyBook.map((reason) =>
      el(b, makeParagraph(`✓  ${reason}`, {
        color: ss("#374151"), fontSize: sv(15), lineHeight: ss("1.65"), paddingBottom: sv(12),
      }))
    );
    const expectLabel = el(b, makeParagraph(
      "What to expect on the call",
      { color: ss("#92400e"), fontSize: sv(13), fontWeight: ss("700"), paddingTop: sv(20), paddingBottom: sv(6) },
    ));
    const expectText = el(b, makeParagraph(
      bk.expectationSetting,
      { color: ss("#b45309"), fontSize: sv(13), lineHeight: ss("1.6") },
    ));
    const trustItems = ["Free 30-minute call", "No sales pressure", "100% confidential"].map((t) =>
      el(b, makeParagraph(`✓  ${t}`, {
        color: ss("#6b7280"), fontSize: sv(13), paddingBottom: sv(6),
      }))
    );
    const leftCol = co(b, makeCol(
      [whyLabel, ...whyItems, expectLabel, expectText, el(b, makeDivider("#e5e7eb", 16)), ...trustItems],
      50, { padH: 24 },
    ));

    const calLabel = el(b, makeHeadline(
      "Select a Date & Time",
      "h3",
      { color: ss("#111827"), fontSize: sv(16), fontWeight: ss("700"), textAlign: ss("center"), paddingBottom: sv(6) },
    ));
    const calSub = el(b, makeParagraph(
      "Connect your GHL Calendar element here after import.",
      { color: ss("#9ca3af"), fontSize: sv(12), textAlign: ss("center"), paddingBottom: sv(24) },
    ));
    const calPlaceholder = el(b, makeParagraph(
      "📅  Drag your GHL Calendar element from the Elements panel into this column",
      { color: ss("#9ca3af"), fontSize: sv(13), textAlign: ss("center"), lineHeight: ss("1.6"),
        paddingTop: sv(32), paddingBottom: sv(32), paddingLeft: sv(24), paddingRight: sv(24),
        backgroundColor: ss("#f8fafc"), borderRadius: sv(12) },
    ));
    const confirmBtn = el(b, makeButton(
      "Confirm My Spot →", "next-step", "",
      { backgroundColor: ss("#d97706"), marginTop: ss("20px") },
    ));
    const calMicro = el(b, makeParagraph(
      "You'll receive a confirmation email immediately after booking.",
      { color: ss("#9ca3af"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(10) },
    ));
    const rightCol = co(b, makeCol(
      [calLabel, calSub, calPlaceholder, confirmBtn, calMicro],
      50, { padH: 24 },
    ));

    const r = ro(b, makeRow([leftCol, rightCol], 1100, 0));
    sec(b, makeSection([r], { bgColor: "#f8fafc", ptD: 72, pbD: 72, ptM: 48, pbM: 48 }));
  }

  // ── 3. TRUST BAR ─────────────────────────────────────────────────────────
  {
    const items = ["Free 30-min call", "No sales pressure", "100% confidential"].map((t) =>
      el(b, makeParagraph(`✓  ${t}`, { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") }))
    );
    const cols = items.map((id) => co(b, makeCol([id], 33, { align: "center" })));
    const r = ro(b, makeRow(cols, 720, 24));
    sec(b, makeSection([r], {
      bgColor: "#0f172a", ptD: 24, pbD: 24, ptM: 20, pbM: 20,
    }));
  }

  return b;
}

// ── All pages ──────────────────────────────────────────────────────────────

export interface AllPageData {
  landing:  GhlPageData;
  optin:    GhlPageData;
  thankYou: GhlPageData;
  booking:  GhlPageData;
}

export function buildAllPageData(data: GeneratedFunnelAssets): AllPageData {
  return {
    landing:  buildLandingPageData(data),
    optin:    buildOptInPageData(data),
    thankYou: buildThankYouPageData(data),
    booking:  buildBookingPageData(data),
  };
}
