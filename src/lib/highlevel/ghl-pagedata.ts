import type { GeneratedFunnelAssets } from "@/types/generation";

// ── Colour Scheme ──────────────────────────────────────────────────────────

interface SchemeColors {
  primary: string;
  dark: string;
  mid: string;
  accent: string;
}

const COLOUR_SCHEMES: Record<string, SchemeColors> = {
  "navy-orange":  { primary: "#f97316", dark: "#0f172a", mid: "#1e293b", accent: "#ea580c" },
  "rose-pink":    { primary: "#ec4899", dark: "#1a0010", mid: "#2d0420", accent: "#be185d" },
  "teal-forest":  { primary: "#14b8a6", dark: "#0a1f1e", mid: "#0f2f2e", accent: "#0d9488" },
  "purple-lilac": { primary: "#a855f7", dark: "#1a0a2e", mid: "#2d1069", accent: "#9333ea" },
  "sky-blue":     { primary: "#38bdf8", dark: "#0f1b2d", mid: "#1e3a5f", accent: "#0ea5e9" },
};

function getScheme(key?: string): SchemeColors {
  return COLOUR_SCHEMES[key ?? "navy-orange"] ?? COLOUR_SCHEMES["navy-orange"];
}

// ── Types ─────────────────────────────────────────────────────────────────

type SV = { value: string | number; unit?: string };
type StyleMap = Record<string, SV>;

export interface GhlNode {
  id: string;
  metaData: Record<string, unknown>;
  elements?: GhlNode[];
  sequence?: number;
  pageId?: string;
  funnelId?: string;
  locationId?: string;
  general?: Record<string, unknown>;
}

export interface GhlPageData {
  fontsForPreview: string[];
  general: {
    general: {
      colors: Array<{ label: string; value: string }>;
      customFonts: unknown[];
      fontsToLoad: string[];
      fontsToLoadForPreview: string[];
      pageStyles: string;
    };
  };
  id: string;
  pageStyles: string;
  popups: unknown[];
  sections: GhlNode[];
  rows: Record<string, GhlNode>;
  columns: Record<string, GhlNode>;
  elements: Record<string, GhlNode>;
}

interface Builder {
  sections: GhlNode[];
  rows: Record<string, GhlNode>;
  columns: Record<string, GhlNode>;
  elements: Record<string, GhlNode>;
}

// ── Page envelope builder ──────────────────────────────────────────────────

const STANDARD_FONTS = ["Arial", "Lato", "Roboto", "Open Sans", "Oxygen", "Oswald", "Montserrat", "Manrope", "Poppins", "Bebas Neue"];
const PREVIEW_FONTS  = ["Roboto", "Montserrat", "Bebas Neue", "Poppins"];

function buildEnvelope(schemeKey: string | undefined): Omit<GhlPageData, "sections" | "rows" | "columns" | "elements"> {
  const s = getScheme(schemeKey);
  const pageStyles = [
    `:root{`,
    ` --primary:${s.primary};`,
    ` --secondary:${s.accent};`,
    ` --dark:${s.dark};`,
    ` --mid:${s.mid};`,
    ` --white:#ffffff;`,
    ` --black:#000000;`,
    ` --gray:#cbd5e0;`,
    ` --transparent:transparent;`,
    `}`,
  ].join("\n");
  const colors = [
    { label: "Primary",     value: s.primary },
    { label: "Secondary",   value: s.accent  },
    { label: "Dark",        value: s.dark    },
    { label: "Mid",         value: s.mid     },
    { label: "White",       value: "#ffffff"  },
    { label: "Gray",        value: "#cbd5e0"  },
    { label: "Black",       value: "#000000"  },
    { label: "Transparent", value: "transparent" },
  ];
  const previewFontsCss = PREVIEW_FONTS.map(f => `'${f}'`);
  return {
    fontsForPreview: previewFontsCss,
    general: {
      general: {
        colors,
        customFonts: [],
        fontsToLoad: STANDARD_FONTS,
        fontsToLoadForPreview: PREVIEW_FONTS,
        pageStyles: `body { font-family: var(--contentfont, 'Roboto', sans-serif); }`,
      },
    },
    id: Math.random().toString(36).slice(2, 14),
    pageStyles,
    popups: [],
  };
}

// ── Low-level helpers ──────────────────────────────────────────────────────

function ghlId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function sv(n: number, unit = "px"): SV { return { value: n, unit }; }
function ss(s: string): SV { return { value: s }; }

const VISIBILITY         = { value: { hideMobile: false, hideDesktop: false } };
const ELEMENT_VISIBILITY = { value: { hideMobile: "", hideDesktop: "" } };
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
    id, "column", "c-column", "col", "Column",
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
  const id = ghlId("el");
  return buildNode(
    id, "element", "c-heading", "heading", "Headline",
    [],
    styles,
    mobileStyles,
    { text: { value: `<${tag}>${text}</${tag}>` }, nodeId: `c${id}`, visibility: ELEMENT_VISIBILITY },
    { borders: { value: "noBorder" }, borderRadius: { value: "radius0" } },
  );
}

function makeParagraph(text: string, styles: StyleMap, mobileStyles: StyleMap = {}): GhlNode {
  const id = ghlId("el");
  return buildNode(
    id, "element", "c-paragraph", "paragraph", "Paragraph",
    [],
    styles,
    mobileStyles,
    { content: ss(text), nodeId: `c${id}`, visibility: ELEMENT_VISIBILITY },
  );
}

function makeSubHeading(htmlText: string, styles: StyleMap, mobileStyles: StyleMap = {}): GhlNode {
  const id = ghlId("el");
  return buildNode(
    id, "element", "c-sub-heading", "sub-heading", "Sub Heading",
    [],
    styles,
    mobileStyles,
    {
      text:        { value: htmlText },
      nodeId:      `c${id}`,
      customClass: { value: [] },
      visibility:  ELEMENT_VISIBILITY,
    },
    {
      boxShadow:    { value: "none" },
      borders:      { value: "noBorder" },
      borderRadius: { value: "radius0" },
      radiusEdge:   { value: "none" },
    },
  );
}

function makeButton(
  label: string,
  action: "next-step" | "url",
  url = "",
  styles: StyleMap = {},
  mobileStyles: StyleMap = {},
): GhlNode {
  const id = ghlId("el");
  return buildNode(
    id, "element", "c-button", "button", "Button",
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
    { content: ss(label), action: ss(action), url: ss(url), typography: ss("var(--contentfont)"), nodeId: `c${id}`, visibility: ELEMENT_VISIBILITY },
  );
}

function makeForm(): GhlNode {
  const id = ghlId("el");
  return buildNode(
    id, "element", "c-form", "form", "Form",
    [], {}, {},
    { formId: ss(""), nodeId: `c${id}`, visibility: ELEMENT_VISIBILITY },
  );
}

function makeImage(opts: { url?: string; width?: number } = {}): GhlNode {
  const id = ghlId("el");
  return buildNode(
    id, "element", "c-image", "image", "Image",
    [],
    {},
    {},
    {
      imageProperties: {
        value: {
          url:            opts.url ?? "",
          width:          String(opts.width ?? 100),
          redirectAction: "normal",
          imageMeta:      {},
        },
      },
      nodeId:       `c${id}`,
      visitWebsite: "",
      downloadFile: "",
      visibility:   ELEMENT_VISIBILITY,
    },
    { borderRadius: { value: "radius0" } },
  );
}

function makeDivider(): GhlNode {
  const id = ghlId("el");
  return buildNode(
    id, "element", "c-divider", "divider", "Divider",
    [],
    {},
    {},
    { visibility: ELEMENT_VISIBILITY, nodeId: `c${id}` },
    {},
  );
}

function makeVideo(youtubeUrl: string, styles: StyleMap = {}): GhlNode {
  const id = ghlId("el");
  const videoId = youtubeUrl.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1] ?? "";
  const thumbnailURL = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "";
  const embedURL = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&controls=0`
    : "";
  return buildNode(
    id, "element", "c-video", "video", "Video",
    [],
    {
      width:        sv(100, "%"),
      borderRadius: sv(12),
      overflow:     ss("hidden"),
      ...styles,
    },
    { width: sv(100, "%") },
    {
      videoProperties: {
        value: {
          url:          youtubeUrl,
          thumbnailURL,
          autoplay:     0,
          controls:     0,
          type:         "youtube",
          embedURL,
        },
      },
      playBackControls: { value: {} },
      leadVideoOptions: { value: {} },
      checkStep:        { value: {} },
      nodeId:           `c${id}`,
      visibility:       ELEMENT_VISIBILITY,
    },
    { borderRadius: { value: "radius0" }, borders: { value: "noBorder" } },
  );
}

function makeCountdown(endDate: string, styles: StyleMap = {}): GhlNode {
  const id = ghlId("el");
  return buildNode(
    id, "element", "c-countdown", "minute-timer", "Countdown Timer",
    [],
    {
      textAlign:   ss("center"),
      paddingTop:  sv(8),
      paddingBottom: sv(8),
      ...styles,
    },
    {},
    {
      timerType:    ss("fixed"),
      endDate:      ss(endDate),
      timezone:     ss("America/New_York"),
      expireAction: ss("none"),
      labelDays:    ss("Days"),
      labelHours:   ss("Hours"),
      labelMinutes: ss("Minutes"),
      labelSeconds: ss("Seconds"),
      displayStyle: ss("block"),
      nodeId:       `c${id}`,
      visibility:   ELEMENT_VISIBILITY,
    },
  );
}

function makeBulletList(items: string[], primary: string, styles: StyleMap = {}): GhlNode {
  const id = ghlId("el");
  return buildNode(
    id, "element", "c-bullet-list", "bulletList", "Bullet List",
    [],
    {
      fontSize:        sv(16),
      color:           ss("#e2e8f0"),
      lineHeight:      ss("1.7"),
      paddingBottom:   sv(8),
      ...styles,
    },
    {},
    {
      items:           { value: items.map((t) => ({ text: t, icon: "check" })) },
      listType:        ss("icon"),
      iconType:        ss("check"),
      iconColor:       ss(primary),
      iconSize:        ss("18px"),
      listItemSpacing: ss("10px"),
      nodeId:          `c${id}`,
      visibility:      ELEMENT_VISIBILITY,
    },
  );
}

// ── Builder accumulator ────────────────────────────────────────────────────

function createBuilder(): Builder {
  return { sections: [], rows: {}, columns: {}, elements: {} };
}

function finalize(b: Builder, schemeKey: string | undefined): GhlPageData {
  /* Post-process: attach nested `elements` arrays at section → row → col → element level.
   * GHL's new builder calls createNestedJsonFromSections which iterates section.elements
   * (top-level, not inside metaData). Without this, section.elements = undefined → TypeError.
   *
   * IMPORTANT: use object spread to create NEW objects for the nested tree rather than
   * mutating the flat map entries in b.rows / b.columns / b.elements. If we mutate those
   * objects in place, the top-level flat maps written to Firebase also end up containing
   * deeply nested element trees — which GHL's backend cannot parse and returns HTTP 500.
   * The flat maps must remain {id, metaData} only; only section.elements carries the tree. */
  for (const section of b.sections) {
    const rowIds = (section.metaData.child as string[]) ?? [];
    section.elements = rowIds.map((rowId) => {
      const row = b.rows[rowId];
      if (!row) return { id: rowId, metaData: {}, elements: [] };
      const colIds = (row.metaData.child as string[]) ?? [];
      const rowElements = colIds.map((colId) => {
        const col = b.columns[colId];
        if (!col) return { id: colId, metaData: {}, elements: [] };
        const elemIds = (col.metaData.child as string[]) ?? [];
        const colElements = elemIds.map((elemId) => {
          const elem = b.elements[elemId];
          if (!elem) return { id: elemId, metaData: {}, elements: [] };
          return { ...elem, elements: [] };
        });
        return { ...col, elements: colElements };
      });
      return { ...row, elements: rowElements };
    });
  }
  return { ...buildEnvelope(schemeKey), ...b };
}

function el(b: Builder, n: GhlNode): string  { b.elements[n.id] = n; return n.id; }
function co(b: Builder, n: GhlNode): string  { b.columns[n.id]  = n; return n.id; }
function ro(b: Builder, n: GhlNode): string  { b.rows[n.id]     = n; return n.id; }
function sec(b: Builder, n: GhlNode): void   { b.sections.push(n); }

// ── LANDING PAGE ───────────────────────────────────────────────────────────

export function buildLandingPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const s       = getScheme(data.colourScheme);
  const lp      = data.landingPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  // ── 1. HERO (2-column: text left, video right) ────────────────────────────
  {
    // ── Left column: badge, headline, bullet points, CTA, urgency ─────────
    const badge = el(b, makeParagraph(
      `🔥 Limited Spots — ${concept}`,
      { color: ss(s.primary), fontSize: sv(12), fontWeight: ss("700"), paddingBottom: sv(16), letterSpacing: ss("0.08em"), textTransform: ss("uppercase") },
    ));
    const h1 = el(b, makeSubHeading(
      `<h1>${lp.headlineOptions[0] ?? `Join the Free ${concept}`}</h1>`,
      { color: ss("#ffffff"), fontSize: sv(46), fontWeight: ss("900"), lineHeight: ss("1.1"), paddingBottom: sv(16) },
      { fontSize: sv(30), paddingBottom: sv(12) },
    ));
    const sub = el(b, makeParagraph(
      lp.subheadline,
      { color: ss("#94a3b8"), fontSize: sv(17), lineHeight: ss("1.7"), paddingBottom: sv(24) },
      { fontSize: sv(15) },
    ));
    const bullets = el(b, makeBulletList(
      lp.bulletPoints.slice(0, 4),
      s.primary,
      { paddingBottom: sv(28) },
    ));
    const cta = el(b, makeButton(
      `${lp.ctaText} →`, "next-step", "",
      { backgroundColor: ss(s.primary), boxShadow: ss(`0 12px 32px ${s.primary}55`) },
    ));
    const leftElIds: string[] = [badge, h1, sub, bullets, cta];
    if (lp.urgencyIdeas[0]) {
      leftElIds.push(el(b, makeParagraph(
        lp.urgencyIdeas[0],
        { color: ss("#f87171"), fontSize: sv(13), fontWeight: ss("600"), paddingTop: sv(14) },
      )));
    }
    const leftCol = co(b, makeCol(leftElIds, 45, { padH: 24, valign: "middle" }));

    // ── Right column: countdown timer + placeholder video frame ───────────
    // Countdown — 7 days from "today" when pages are generated; trainers can edit in GHL.
    const countdownEnd = (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().slice(0, 16);
    })();
    const countdownLabel = el(b, makeParagraph(
      "Challenge starts in:",
      { color: ss(s.primary), fontSize: sv(12), fontWeight: ss("700"), textAlign: ss("center"), letterSpacing: ss("0.1em"), textTransform: ss("uppercase"), paddingBottom: sv(4) },
    ));
    const countdown = el(b, makeCountdown(countdownEnd, { paddingBottom: sv(20) }));
    const videoEl = el(b, makeVideo(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      { borderRadius: sv(16), boxShadow: ss(`0 24px 64px rgba(0,0,0,0.5)`) },
    ));
    const videoNote = el(b, makeParagraph(
      "▶  Replace this video with your own challenge intro",
      { color: ss("rgba(148,163,184,0.6)"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(8) },
    ));
    const rightCol = co(b, makeCol([countdownLabel, countdown, videoEl, videoNote], 55, { padH: 24, valign: "middle" }));

    const r = ro(b, makeRow([leftCol, rightCol], 1200, 0));
    sec(b, makeSection([r], {
      bg: `linear-gradient(160deg, ${s.dark} 0%, ${s.mid} 55%, ${s.dark} 100%)`,
      ptD: 88, pbD: 88, ptM: 56, pbM: 56,
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
      { color: ss("rgba(255,255,255,0.2)"), fontSize: sv(20), textAlign: ss("center") },
    ));
    const promise = el(b, makeParagraph(
      `✓  ${data.offerSummary.corePromise}`,
      { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") },
    ));
    const sep2 = el(b, makeParagraph(
      "·",
      { color: ss("rgba(255,255,255,0.2)"), fontSize: sv(20), textAlign: ss("center") },
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
      bgColor: s.mid, ptD: 20, pbD: 20, ptM: 16, pbM: 16,
    }));
  }

  // ── 3. BENEFITS ───────────────────────────────────────────────────────────
  {
    // Coach photo placeholder (left) + heading text (right)
    const coachImg = el(b, makeImage({ width: 480 }));
    const imgNote = el(b, makeParagraph(
      "📸 Replace with your coach/before-after photo",
      { color: ss("rgba(107,114,128,0.7)"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(8) },
    ));
    const imgCol = co(b, makeCol([coachImg, imgNote], 40, { padH: 24, valign: "middle" }));

    const eyebrow = el(b, makeParagraph(
      "What You'll Get",
      { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(8) },
    ));
    const h2 = el(b, makeHeadline(
      "Everything included in your free challenge",
      "h2",
      { color: ss("#111827"), fontSize: sv(36), fontWeight: ss("800"), lineHeight: ss("1.2"), paddingBottom: sv(16), maxWidth: sv(520) },
      { fontSize: sv(24), paddingBottom: sv(12) },
    ));
    const textCol = co(b, makeCol([eyebrow, h2], 60, { padH: 24, valign: "middle" }));
    const headerRow = ro(b, makeRow([imgCol, textCol], 1100, 0));

    // Show all bullets (including any beyond the 4 shown in hero) in 3-column cards
    const allBullets = lp.bulletPoints.slice(0, 9);
    const perRow  = 3;
    const bulletRows: string[] = [];
    for (let start = 0; start < allBullets.length; start += perRow) {
      const rowBullets = allBullets.slice(start, start + perRow);
      const colWidth   = Math.floor(100 / rowBullets.length);
      const colIds = rowBullets.map((b_text) => {
        const icon = el(b, makeParagraph("✓", {
          color: ss(s.primary), fontSize: sv(22), fontWeight: ss("900"), paddingBottom: sv(8),
        }));
        const txt = el(b, makeParagraph(b_text, {
          color: ss("#374151"), fontSize: sv(15), lineHeight: ss("1.6"),
        }));
        return co(b, makeCol([icon, txt], colWidth, { padH: 24, padV: 20 }));
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
      el(b, makeDivider()),
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
      { backgroundColor: ss("#ffffff"), color: ss(s.primary), boxShadow: ss("0 8px 24px rgba(0,0,0,0.18)") },
    ));
    const c = co(b, makeCol([h2, urgency, cta], 100, { align: "center", padH: 32 }));
    const r = ro(b, makeRow([c], 640));
    sec(b, makeSection([r], {
      bg: `linear-gradient(135deg, ${s.primary} 0%, ${s.accent} 100%)`,
      ptD: 88, pbD: 88,
    }));
  }

  return finalize(b, data.colourScheme);
}

// ── OPT-IN PAGE ────────────────────────────────────────────────────────────

export function buildOptInPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const s       = getScheme(data.colourScheme);
  const form    = data.optInForm;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  const badge = el(b, makeParagraph(
    "Step 1 of 2 — Claim Your Free Spot",
    { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("600"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
  ));
  const h1 = el(b, makeHeadline(
    `Join the ${concept} — Free`,
    "h1",
    { color: ss("#ffffff"), fontSize: sv(44), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(560), marginLeft: ss("auto"), marginRight: ss("auto") },
    { fontSize: sv(28) },
  ));
  const intro = el(b, makeParagraph(
    form.formIntroText,
    { color: ss("rgba(255,255,255,0.75)"), fontSize: sv(16), textAlign: ss("center"), lineHeight: ss("1.7"), maxWidth: sv(460), marginLeft: ss("auto"), marginRight: ss("auto"), paddingBottom: sv(32) },
  ));
  const formEl = el(b, makeForm());
  const trust = el(b, makeParagraph(
    "🔒  Secure · No credit card · Cancel anytime",
    { color: ss("rgba(255,255,255,0.5)"), fontSize: sv(12), textAlign: ss("center"), paddingTop: sv(16) },
  ));

  const c = co(b, makeCol([badge, h1, intro, formEl, trust], 100, { align: "center", padH: 32 }));
  const r = ro(b, makeRow([c], 480));
  sec(b, makeSection([r], {
    bg: `linear-gradient(160deg, ${s.dark} 0%, ${s.mid} 60%, ${s.dark} 100%)`,
    ptD: 88, pbD: 88, ptM: 56, pbM: 56,
  }));

  return finalize(b, data.colourScheme);
}

// ── THANK YOU PAGE ─────────────────────────────────────────────────────────

export function buildThankYouPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const s       = getScheme(data.colourScheme);
  const ty      = data.thankYouPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  // ── 1. HERO ──────────────────────────────────────────────────────────────
  {
    const badge = el(b, makeParagraph(
      `🎉  You're in — Welcome to the ${concept}`,
      { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("700"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
    ));
    const h1 = el(b, makeHeadline(
      ty.confirmationMessage,
      "h1",
      { color: ss("#ffffff"), fontSize: sv(46), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(20), maxWidth: sv(740), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(28) },
    ));
    const sub = el(b, makeParagraph(
      ty.bookingEncouragement,
      { color: ss("rgba(255,255,255,0.75)"), fontSize: sv(17), textAlign: ss("center"), lineHeight: ss("1.7"), maxWidth: sv(540), marginLeft: ss("auto"), marginRight: ss("auto") },
    ));
    const c = co(b, makeCol([badge, h1, sub], 100, { align: "center", padH: 32 }));
    const r = ro(b, makeRow([c], 880));
    sec(b, makeSection([r], {
      bg: `linear-gradient(160deg, ${s.dark} 0%, ${s.mid} 60%, ${s.dark} 100%)`,
      ptD: 100, pbD: 100, ptM: 64, pbM: 64,
    }));
  }

  // ── 2. NEXT STEPS ─────────────────────────────────────────────────────────
  {
    const eyebrow = el(b, makeParagraph(
      "What Happens Next",
      { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), textAlign: ss("center"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(8) },
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
        backgroundColor: ss("#f8fafc"),
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
      { backgroundColor: ss("#ffffff"), color: ss(s.primary), boxShadow: ss("0 8px 24px rgba(0,0,0,0.15)") },
    ));
    const c = co(b, makeCol([h2, sub, cta], 100, { align: "center", padH: 32 }));
    const r = ro(b, makeRow([c], 640));
    sec(b, makeSection([r], {
      bg: `linear-gradient(135deg, ${s.primary} 0%, ${s.accent} 100%)`,
      ptD: 80, pbD: 80,
    }));
  }

  return finalize(b, data.colourScheme);
}

// ── BOOKING PAGE ───────────────────────────────────────────────────────────

export function buildBookingPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const s       = getScheme(data.colourScheme);
  const bk      = data.bookingPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  // ── 1. HERO ──────────────────────────────────────────────────────────────
  {
    const badge = el(b, makeParagraph(
      "Almost there — pick a time that works for you",
      { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("600"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
    ));
    const h1 = el(b, makeHeadline(
      `Book Your Free ${concept} Strategy Call`,
      "h1",
      { color: ss("#ffffff"), fontSize: sv(44), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(640), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(27) },
    ));
    const sub = el(b, makeParagraph(
      bk.shortIntro,
      { color: ss("rgba(255,255,255,0.75)"), fontSize: sv(16), textAlign: ss("center"), lineHeight: ss("1.7"), maxWidth: sv(520), marginLeft: ss("auto"), marginRight: ss("auto") },
    ));
    const c = co(b, makeCol([badge, h1, sub], 100, { align: "center", padH: 32 }));
    const r = ro(b, makeRow([c], 800));
    sec(b, makeSection([r], {
      bg: `linear-gradient(160deg, ${s.dark} 0%, ${s.mid} 60%, ${s.dark} 100%)`,
      ptD: 88, pbD: 88, ptM: 56, pbM: 56,
    }));
  }

  // ── 2. TWO-COLUMN CONTENT ─────────────────────────────────────────────────
  {
    const whyLabel = el(b, makeParagraph(
      "Why Book a Call",
      { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(16) },
    ));
    const whyItems = bk.whyBook.map((reason) =>
      el(b, makeParagraph(`✓  ${reason}`, {
        color: ss("#374151"), fontSize: sv(15), lineHeight: ss("1.65"), paddingBottom: sv(12),
      }))
    );
    const expectLabel = el(b, makeParagraph(
      "What to expect on the call",
      { color: ss(s.accent), fontSize: sv(13), fontWeight: ss("700"), paddingTop: sv(20), paddingBottom: sv(6) },
    ));
    const expectText = el(b, makeParagraph(
      bk.expectationSetting,
      { color: ss("#374151"), fontSize: sv(13), lineHeight: ss("1.6") },
    ));
    const trustItems = ["Free 30-minute call", "No sales pressure", "100% confidential"].map((t) =>
      el(b, makeParagraph(`✓  ${t}`, {
        color: ss("#6b7280"), fontSize: sv(13), paddingBottom: sv(6),
      }))
    );
    const leftCol = co(b, makeCol(
      [whyLabel, ...whyItems, expectLabel, expectText, el(b, makeDivider()), ...trustItems],
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
      { backgroundColor: ss(s.primary), marginTop: sv(20) },
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
      bgColor: s.dark, ptD: 24, pbD: 24, ptM: 20, pbM: 20,
    }));
  }

  return finalize(b, data.colourScheme);
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
