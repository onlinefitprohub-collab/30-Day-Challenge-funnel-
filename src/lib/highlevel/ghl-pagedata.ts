import type { GeneratedFunnelAssets, LandingPageCopy, ApplicationLandingPage } from "@/types/generation";
import APP_PAGE_TEMPLATE from "./templates/applicationpage.json";

// ── Colour Scheme ─────────────────────────────────────────────────────────────

interface SchemeColors {
  primary: string;
  dark: string;
  mid: string;
  accent: string;
  alt: string;
  heroGradient: string;
  ctaSectionBackground: string;
  socialProofBackground: string;
  headlineFontWeight: string;
  buttonBorderRadius: string;
  textColorOnDark: string;
  textColorOnLight: string;
}

const COLOUR_SCHEMES: Record<string, SchemeColors> = {
  "navy-orange":  { primary: "#f97316", dark: "#0f172a", mid: "#1e293b", accent: "#ea580c", alt: "#f8fafc", heroGradient: "linear-gradient(160deg, #0f172a 0%, #1e293b 55%, #0f172a 100%)", ctaSectionBackground: "#f97316", socialProofBackground: "#0f172a", headlineFontWeight: "900", buttonBorderRadius: "8px",  textColorOnDark: "#ffffff", textColorOnLight: "#111827" },
  "rose-pink":    { primary: "#ec4899", dark: "#1a0010", mid: "#2d0420", accent: "#be185d", alt: "#fff8fb", heroGradient: "linear-gradient(160deg, #1a0010 0%, #2d0420 55%, #1a0010 100%)", ctaSectionBackground: "#ec4899", socialProofBackground: "#1a0010", headlineFontWeight: "900", buttonBorderRadius: "8px",  textColorOnDark: "#ffffff", textColorOnLight: "#1a0010" },
  "teal-forest":  { primary: "#14b8a6", dark: "#0a1f1e", mid: "#0f2f2e", accent: "#0d9488", alt: "#f0fdfa", heroGradient: "linear-gradient(160deg, #0a1f1e 0%, #0f2f2e 55%, #0a1f1e 100%)", ctaSectionBackground: "#14b8a6", socialProofBackground: "#0a1f1e", headlineFontWeight: "800", buttonBorderRadius: "8px",  textColorOnDark: "#ffffff", textColorOnLight: "#134e4a" },
  "purple-lilac": { primary: "#a855f7", dark: "#1a0a2e", mid: "#2d1069", accent: "#9333ea", alt: "#faf5ff", heroGradient: "linear-gradient(160deg, #1a0a2e 0%, #2d1069 55%, #1a0a2e 100%)", ctaSectionBackground: "#a855f7", socialProofBackground: "#1a0a2e", headlineFontWeight: "900", buttonBorderRadius: "12px", textColorOnDark: "#ffffff", textColorOnLight: "#1a0a2e" },
  "sky-blue":     { primary: "#38bdf8", dark: "#0f1b2d", mid: "#1e3a5f", accent: "#0ea5e9", alt: "#f0f9ff", heroGradient: "linear-gradient(160deg, #0f1b2d 0%, #1e3a5f 55%, #0f1b2d 100%)", ctaSectionBackground: "#38bdf8", socialProofBackground: "#0f1b2d", headlineFontWeight: "800", buttonBorderRadius: "8px",  textColorOnDark: "#ffffff", textColorOnLight: "#0c4a6e" },
};

function getScheme(key?: string): SchemeColors {
  return COLOUR_SCHEMES[key ?? "navy-orange"] ?? COLOUR_SCHEMES["navy-orange"];
}

function resolveScheme(data: GeneratedFunnelAssets): SchemeColors {
  const base = getScheme(data.colourScheme);
  const d    = data.design;
  if (!d) return base;
  return {
    primary:               d.primaryColor               || base.primary,
    dark:                  d.darkBackground             || base.dark,
    mid:                   d.midBackground              || base.mid,
    accent:                d.accentColor                || base.accent,
    alt:                   d.alternateSectionBackground || base.alt,
    heroGradient:          d.heroGradient               || base.heroGradient,
    ctaSectionBackground:  d.ctaSectionBackground       || base.ctaSectionBackground,
    socialProofBackground: d.socialProofBackground      || base.socialProofBackground,
    headlineFontWeight:    d.headlineFontWeight         || base.headlineFontWeight,
    buttonBorderRadius:    d.buttonBorderRadius         || base.buttonBorderRadius,
    textColorOnDark:       d.textColorOnDark            || base.textColorOnDark,
    textColorOnLight:      d.textColorOnLight           || base.textColorOnLight,
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

type SV  = { value: string | number | boolean | null | unknown[]; unit?: string };
type StyleMap = Record<string, SV | { desktop?: string; value: string | number | boolean }>;
type GhlElem = Record<string, unknown>;

export interface GhlSection {
  id: string;
  metaData: Record<string, unknown>;
  elements: GhlElem[];
  pageId?: string;
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
  popupsList: unknown[];
  settings: Record<string, unknown>;
  trackingCode: string;
  sections: GhlSection[];
  // Optional dicts used by the Chrome extension's "constructed path" for blank pages
  rows?:     Record<string, unknown>;
  columns?:  Record<string, unknown>;
  elements?: Record<string, unknown>;
}

interface Builder {
  sections: GhlSection[];
  nodes: Record<string, GhlElem>;
}

function createBuilder(): Builder {
  return { sections: [], nodes: {} };
}

// ── Shared constants ──────────────────────────────────────────────────────────

const VISIBILITY = { value: { hideDesktop: false, hideMobile: false } };

const BG_IMAGE = {
  value: {
    mediaType: "image", url: "", opacity: "1", options: "bgCover",
    svgCode: "", videoUrl: "", videoThumbnail: "", videoLoop: true,
  },
};

const BORDER_CLASS = {
  borders:      { value: "noBorder" },
  borderRadius: { value: "radius0" },
  radiusEdge:   { value: "none" },
};

const ANIMATION_CLASS = {
  entranceAnimation: { value: "" },
  animationScale:    { value: 1 },
  animationDuration: { value: 1 },
  animationDelay:    { value: 0 },
  animationEasing:   { value: "linear" },
};

const ICON_EMPTY = { value: { name: "", unicode: "", fontFamily: "" } };

const ELEM_WRAPPER = {
  marginTop:    { unit: "px", value: 0 },
  marginBottom: { unit: "px", value: 0 },
  marginLeft:   { unit: "px", value: 0 },
  marginRight:  { unit: "px", value: 0 },
  width:        { value: "auto", unit: "" },
  height:       { value: "auto", unit: "" },
};

const ZERO_MARGIN = {
  marginTop:    { unit: "px", value: 0 },
  marginBottom: { unit: "px", value: 0 },
  marginLeft:   { unit: "px", value: 0 },
  marginRight:  { unit: "px", value: 0 },
};

// ── Low-level helpers ─────────────────────────────────────────────────────────

function ghlId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function sv(n: number, unit = "px"): SV { return { value: n, unit }; }
function ss(s: string): SV { return { value: s }; }

// ── Page envelope ─────────────────────────────────────────────────────────────

const STANDARD_FONTS = ["Arial","Lato","Roboto","Open Sans","Oxygen","Oswald","Montserrat","Manrope","Poppins","Bebas Neue"];
const PREVIEW_FONTS  = ["Roboto","Montserrat","Bebas Neue","Poppins"];

function buildEnvelope(s: SchemeColors): Omit<GhlPageData, "sections"> {
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
    ` --text-color:#ffffff;`,
    ` --link-color:${s.primary};`,
    ` --headlinefont:'Bebas Neue',sans-serif;`,
    ` --contentfont:'Poppins',sans-serif;`,
    `}`,
    `body{background-color:${s.dark};color:#ffffff;}`,
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
  return {
    fontsForPreview: PREVIEW_FONTS.map(f => `'${f}'`),
    general: {
      general: {
        colors,
        customFonts: [],
        fontsToLoad: STANDARD_FONTS,
        fontsToLoadForPreview: PREVIEW_FONTS,
        pageStyles,
      },
    },
    id: Math.random().toString(36).slice(2, 14),
    pageStyles,
    popups: [],
    popupsList: [],
    settings: {},
    trackingCode: "",
  };
}

// ── Finalize ──────────────────────────────────────────────────────────────────

function finalize(b: Builder, scheme?: SchemeColors | string): GhlPageData {
  const s = (typeof scheme === "object" && scheme !== null) ? scheme : getScheme(scheme as string | undefined);
  for (const sec of b.sections) {
    const flat: GhlElem[] = [];
    const rootIds = (sec.metaData.child as string[]) ?? [];
    const dfs = (ids: string[]): void => {
      for (const id of ids) {
        const node = b.nodes[id];
        if (!node) {
          console.warn(`[diag] finalize: node id="${id}" not found in b.nodes (section ${sec.id}) — element will be skipped`);
          continue;
        }
        flat.push(node);
        dfs((node.child as string[]) ?? []);
      }
    };
    dfs(rootIds);
    sec.elements = flat;
  }
  return { ...buildEnvelope(s), sections: b.sections };
}

/**
 * Post-processor: eliminates null values from animation fields and style fields
 * on every element in every section.
 *
 * Root cause: GHL's own native schema uses null for un-animated elements. When
 * the Chrome extension reads an existing GHL page from Firebase as a baseline,
 * those native nulls flow into the write payload. This sanitizer ensures no
 * null animation or style values escape into the final JSON regardless of source.
 *
 * - element.class animation fields → specific typed defaults (string / number)
 * - element.styles fields          → any { value: null } → { value: "" }
 */
const ANIMATION_DEFAULTS: Record<string, string | number> = {
  entranceAnimation: "",
  hoverAnimation:    "",
  animationScale:    1,
  animationDuration: 1,
  animationDelay:    0,
  animationEasing:   "linear",
};

const REQUIRED_TEXT_STYLES: Record<string, unknown> = {
  // Text-style properties — GHL's bootstrapTextElementStyle reads these on all element types
  iconColor:          { value: "var(--text-color)" },
  boldTextColor:      { value: "var(--text-color)" },
  italicTextColor:    { value: "var(--text-color)" },
  underlineTextColor: { value: "var(--text-color)" },
  linkTextColor:      { value: "var(--link-color)" },
  inlineColors:       { value: [] },
  // Base style properties — GHL's element setup() reads these on every node type during render.
  // Elements that already define them are unaffected (guard only injects when absent).
  fontFamily:         { value: "var(--bodyfont)" },
  backgroundColor:    { value: "var(--transparent)" },
  opacity:            { value: 1 },
  boxShadow:          { value: "none" },
  borderRadius:       { value: 0, unit: "px" },
  borderColor:        { value: "var(--black)" },
  borderWidth:        { value: "0", unit: "px" },
  borderStyle:        { value: "solid" },
};

function patchStyles(stylesObj: Record<string, unknown>, label: string): void {
  // Null → "" fallback
  for (const styleField of Object.values(stylesObj)) {
    if (styleField && typeof styleField === "object" && (styleField as Record<string,unknown>).value === null) {
      (styleField as Record<string,unknown>).value = "";
    }
  }
  // Undefined entry → { value: "" }
  for (const key of Object.keys(stylesObj)) {
    if (stylesObj[key] === undefined) {
      stylesObj[key] = { value: "" };
    }
  }
  // Inject every required key that is entirely absent
  for (const [key, defaultVal] of Object.entries(REQUIRED_TEXT_STYLES)) {
    if (!(key in stylesObj)) {
      stylesObj[key] = defaultVal;
      console.log(`[sanitize] patched ${label}: ${key}`);
    }
  }
}

function sanitizePageData(data: GhlPageData): GhlPageData {
  for (const section of data.sections) {
    // Diagnostic: log section metaData.styles keys so we can verify they match native.
    // Native sections carry only layout styles (padding/margin/bg/border) — NO fontFamily etc.
    // Do NOT run patchStyles() here; c-section does not read the text-style props.
    const sectionMeta = section.metaData as Record<string, unknown>;
    if (sectionMeta) {
      const secStylesObj = sectionMeta.styles as Record<string, unknown>;
      if (secStylesObj && typeof secStylesObj === "object") {
        console.log(`[page-data] section ${section.id} metaData.styles=[${Object.keys(secStylesObj).join(",")}]`);
      }
    }

    for (const element of section.elements) {
      // Fix known animation fields in class with typed defaults
      for (const [field, defaultVal] of Object.entries(ANIMATION_DEFAULTS)) {
        const classField = (element.class as Record<string, { value: unknown }>)?.[field];
        if (classField && classField.value === null) {
          classField.value = defaultVal;
        }
      }
      const stylesObj = element.styles as Record<string, unknown>;
      if (stylesObj && typeof stylesObj === "object") {
        patchStyles(stylesObj, `${(element.id as string) ?? "?"} (${(element.tagName as string) ?? "?"})`);
      }
    }
  }
  return data;
}

// ── Section ───────────────────────────────────────────────────────────────────

interface SectionOpts {
  bg?: string; bgColor?: string;
  ptD?: number; pbD?: number; ptM?: number; pbM?: number;
  sticky?: string;
}

function makeSection(b: Builder, rowIds: string[], opts: SectionOpts = {}): void {
  const validRowIds = rowIds.filter((rowId) => {
    if (!rowId || !b.nodes[rowId]) {
      console.warn(`[diag] makeSection: row id="${rowId}" not found in b.nodes — skipped`);
      return false;
    }
    return true;
  });
  if (validRowIds.length === 0) {
    console.warn(`[diag] makeSection: all ${rowIds.length} row ID(s) were invalid — section skipped to avoid blank render`);
    return;
  }
  const id = ghlId("section");
  const styles: GhlElem = {
    boxShadow:       { value: "none" },
    paddingLeft:     { value: 0,  unit: "px" },
    paddingRight:    { value: 0,  unit: "px" },
    paddingTop:      { value: opts.ptD ?? 80, unit: "px" },
    paddingBottom:   { value: opts.pbD ?? 80, unit: "px" },
    marginTop:       { value: 0,  unit: "px" },
    marginBottom:    { value: 0,  unit: "px" },
    marginLeft:      { value: 0,  unit: "px" },
    marginRight:     { value: 0,  unit: "px" },
    backgroundColor: opts.bgColor ? { value: opts.bgColor } : { value: "var(--transparent)" },
    background:      opts.bg      ? { value: opts.bg }      : { value: "none" },
    backdropFilter:  { value: "none" },
    borderColor:     { value: "var(--black)" },
    borderWidth:     { value: "2", unit: "px" },
    borderStyle:     { value: "solid" },
  };
  b.sections.push({
    id,
    metaData: {
      id,
      type:  "section",
      child: validRowIds,
      class: {
        width:        { value: "fullSection" },
        borders:      { value: "noBorder" },
        borderRadius: { value: "radius0" },
        radiusEdge:   { value: "none" },
      },
      styles,
      extra: {
        sticky:            { value: opts.sticky ?? "noneSticky" },
        visibility:        VISIBILITY,
        bgImage:           BG_IMAGE,
        allowRowMaxWidth:  { value: false },
        customClass:       { value: [] },
        elementScreenshot: { value: [] },
      },
      wrapper:       {},
      meta:          "section",
      tagName:       "c-section",
      title:         "Section",
      mobileStyles:  {
        paddingTop:    { value: opts.ptM ?? 48, unit: "px" },
        paddingBottom: { value: opts.pbM ?? 48, unit: "px" },
      },
      mobileWrapper: {},
    },
    elements: [],
  });
}

// ── Row ───────────────────────────────────────────────────────────────────────

function makeRow(b: Builder, colIds: string[], maxWidth = 1200, padH = 0): string {
  const id = ghlId("row");
  b.nodes[id] = {
    id,
    type:  "row",
    child: colIds,
    class: {
      alignRow: { value: "row-align-center" },
      ...BORDER_CLASS,
    },
    styles: {
      boxShadow:       { value: "none" },
      paddingLeft:     { value: padH, unit: "px" },
      paddingRight:    { value: padH, unit: "px" },
      paddingTop:      { value: 0, unit: "px" },
      paddingBottom:   { value: 0, unit: "px" },
      backgroundColor: { value: "var(--transparent)" },
      background:      { value: "none" },
      backdropFilter:  { value: "none" },
      borderColor:     { value: "var(--black)" },
      borderWidth:     { value: "2", unit: "px" },
      borderStyle:     { value: "solid" },
      maxWidth:        { value: maxWidth, unit: "px" },
    },
    extra: {
      visibility:  VISIBILITY,
      bgImage:     BG_IMAGE,
      rowWidth:    { value: 100, unit: "%" },
      customClass: { value: [] },
    },
    wrapper: {
      marginTop:    { unit: "px", value: 0 },
      marginBottom: { unit: "px", value: 0 },
      marginLeft:   { unit: "",   value: "auto" },
      marginRight:  { unit: "",   value: "auto" },
    },
    tagName:       "c-row",
    meta:          "row",
    mobileStyles:  {},
    mobileWrapper: {},
    title: colIds.length === 1 ? "1 Column Row" : `${colIds.length} Column Row`,
  };
  return id;
}

// ── Column ────────────────────────────────────────────────────────────────────

function makeCol(
  b: Builder,
  childIds: string[],
  widthPct = 100,
  opts: { padH?: number; padV?: number; align?: string; valign?: string; bgColor?: string } = {},
): string {
  const id = ghlId("col");
  const styles: GhlElem = {
    boxShadow:       { value: "none" },
    paddingLeft:     { value: opts.padH ?? 16, unit: "px" },
    paddingRight:    { value: opts.padH ?? 16, unit: "px" },
    paddingTop:      { value: opts.padV ?? 0,  unit: "px" },
    paddingBottom:   { value: opts.padV ?? 0,  unit: "px" },
    backgroundColor: { value: opts.bgColor ?? "var(--transparent)" },
    background:      { value: "none" },
    backdropFilter:  { value: "none" },
    borderColor:     { value: "var(--black)" },
    borderWidth:     { value: "2", unit: "px" },
    borderStyle:     { value: "solid" },
    width:           { value: widthPct, unit: "%" },
    // GHL's c-column setup() reads verticalAlign unconditionally — must always be present
    verticalAlign:   { value: opts.valign ?? "top" },
  };
  if (opts.align) styles.textAlign = { value: opts.align };

  b.nodes[id] = {
    id,
    type:  "col",
    child: childIds,
    class: { ...BORDER_CLASS },
    styles,
    extra: {
      visibility:                 VISIBILITY,
      bgImage:                    BG_IMAGE,
      columnLayout:               { value: "column" },
      justifyContentColumnLayout: { value: "center" },
      alignContentColumnLayout:   { value: "inherit" },
      forceColumnLayoutForMobile: { value: true },
      customClass:                { value: [] },
      elementVersion:             { value: 2 },
    },
    wrapper:       { ...ZERO_MARGIN },
    tagName:       "c-column",
    meta:          "col",
    mobileStyles:  {},
    mobileWrapper: {},
    title:         "1st Column",
    noOfColumns:   1,
  };
  return id;
}

// ── Heading (h1 / h2 / h3 / h4) ──────────────────────────────────────────────

function makeHeading(
  b: Builder,
  text: string,
  tag: "h1" | "h2" | "h3" | "h4",
  styles: StyleMap,
  mobileStyles: StyleMap = {},
): string {
  const id = ghlId("el");
  const defaultFontSzDesktop = tag === "h1" ? 48 : tag === "h2" ? 36 : 24;
  const defaultFontSzMobile  = tag === "h1" ? 36 : tag === "h2" ? 26 : 20;
  b.nodes[id] = {
    extra: {
      nodeId:             `c${id}`,
      visibility:         VISIBILITY,
      text:               { value: `<${tag}>${text}</${tag}>` },
      mobileFontSize:     { value: defaultFontSzMobile,  unit: "px" },
      desktopFontSize:    { value: defaultFontSzDesktop, unit: "px" },
      typography:         { value: "var(--headlinefont)" },
      inlineTypographies: { value: [] },
      icon:               ICON_EMPTY,
      customClass:        { value: [] },
      elementVersion:     { value: 2 },
    },
    class: { ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles: {
      backgroundColor:    { value: "var(--transparent)" },
      color:              { value: "var(--text-color)" },
      inlineColors:       { value: [] },
      boldTextColor:      { value: "var(--text-color)" },
      italicTextColor:    { value: "var(--text-color)" },
      underlineTextColor: { value: "var(--text-color)" },
      linkTextColor:      { value: "var(--link-color)" },
      iconColor:          { value: "var(--text-color)" },
      fontFamily:         { value: "" },
      fontSize:           { value: defaultFontSzDesktop, unit: "px" },
      fontWeight:         { desktop: "700", value: "normal" },
      boxShadow:          { value: "none" },
      paddingLeft:        { value: 0, unit: "px" },
      paddingRight:       { value: 0, unit: "px" },
      paddingTop:         { value: 0, unit: "px" },
      paddingBottom:      { value: 0, unit: "px" },
      opacity:            { value: "1" },
      textShadow:         { value: "none" },
      borderColor:        { value: "var(--black)" },
      borderWidth:        { value: "2", unit: "px" },
      borderStyle:        { value: "solid" },
      lineHeight:         { value: 1.3, unit: "em" },
      textTransform:      { value: "none" },
      letterSpacing:      { value: "0", unit: "px" },
      textAlign:          { value: "left" },
      ...styles,
    },
    wrapper:       { ...ELEM_WRAPPER },
    customCss:     [],
    id,
    mobileStyles,
    mobileWrapper: {},
    type:          "element",
    child:         [],
    meta:          "heading",
    tagName:       "c-heading",
    title:         "Headline",
    tag,
  };
  return id;
}

// ── Paragraph ─────────────────────────────────────────────────────────────────

function makeParagraph(b: Builder, text: string, styles: StyleMap, mobileStyles: StyleMap = {}): string {
  const id = ghlId("el");
  b.nodes[id] = {
    extra: {
      nodeId:             `c${id}`,
      visibility:         VISIBILITY,
      text:               { value: `<p>${text}</p>` },
      mobileFontSize:     { value: 16, unit: "px" },
      desktopFontSize:    { value: 16, unit: "px" },
      typography:         { value: "var(--contentfont)" },
      inlineTypographies: { value: [] },
      icon:               ICON_EMPTY,
      customClass:        { value: [] },
      elementVersion:     { value: 2 },
    },
    class: { ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles: {
      backgroundColor:    { value: "var(--transparent)" },
      color:              { value: "var(--text-color)" },
      inlineColors:       { value: [] },
      boldTextColor:      { value: "var(--text-color)" },
      italicTextColor:    { value: "var(--text-color)" },
      underlineTextColor: { value: "var(--text-color)" },
      linkTextColor:      { value: "var(--link-color)" },
      iconColor:          { value: "var(--text-color)" },
      fontFamily:         { value: "" },
      fontSize:           { value: 16, unit: "px" },
      fontWeight:         { desktop: "400", value: "normal" },
      boxShadow:          { value: "none" },
      paddingLeft:        { value: 0, unit: "px" },
      paddingRight:       { value: 0, unit: "px" },
      paddingTop:         { value: 8, unit: "px" },
      paddingBottom:      { value: 8, unit: "px" },
      opacity:            { value: "1" },
      textShadow:         { value: "none" },
      borderColor:        { value: "var(--black)" },
      borderWidth:        { value: "2", unit: "px" },
      borderStyle:        { value: "solid" },
      lineHeight:         { value: 1.6, unit: "em" },
      textTransform:      { value: "none" },
      letterSpacing:      { value: "0", unit: "px" },
      textAlign:          { value: "left" },
      ...styles,
    },
    wrapper:       { ...ELEM_WRAPPER },
    customCss:     [],
    id,
    mobileStyles,
    mobileWrapper: {},
    type:          "element",
    child:         [],
    meta:          "paragraph",
    tagName:       "c-paragraph",
    title:         "Paragraph",
    tag:           "p",
  };
  return id;
}

// ── Button ────────────────────────────────────────────────────────────────────

function makeButton(
  b: Builder,
  label: string,
  action: "next-step" | "url",
  url = "",
  styles: StyleMap = {},
  mobileStyles: StyleMap = {},
): string {
  const id = ghlId("el");
  b.nodes[id] = {
    extra: {
      nodeId:                 `c${id}`,
      visibility:             VISIBILITY,
      text:                   { value: label },
      subText:                { value: "" },
      mobileFontSize:         { value: 18, unit: "px" },
      desktopFontSize:        { value: 16, unit: "px" },
      subTextDesktopFontSize: { value: 15, unit: "px" },
      subTextMobileFontSize:  { value: 15, unit: "px" },
      typography:             { value: "var(--headlinefont)" },
      iconStart:              ICON_EMPTY,
      iconEnd:                ICON_EMPTY,
      action:                 { value: action === "url" ? "openUrl" : "next-step" },
      visitWebsite:           { value: { url: url ?? "", newTab: false } },
      downloadFile:           { value: { fileUrl: "", fileName: "" } },
      hideElements:           { value: [] },
      showElements:           { value: [] },
      scrollToElement:        { value: "" },
      phoneNumber:            { value: "" },
      emailAddress:           { value: "" },
      stepPath:               { value: "" },
      saleAction:             { value: "go-to-next-funnel-step" },
      popupId:                { value: "" },
      customClass:            { value: [] },
    },
    class: {
      buttonBgStyle:  { value: "custom" },
      buttonVp:       { value: "btn-vp" },
      buttonHp:       { value: "btn-hp" },
      hoverAnimation: { value: "" },
      borders:        { value: "borderFull" },
      borderRadius:   { value: "radius5" },
      radiusEdge:     { value: "none" },
      ...ANIMATION_CLASS,
    },
    styles: {
      backgroundColor: { value: "var(--primary)" },
      color:           { value: "var(--white)" },
      secondaryColor:  { value: "var(--white)" },
      paddingTop:      { value: 16, unit: "px" },
      paddingBottom:   { value: 16, unit: "px" },
      paddingLeft:     { value: 32, unit: "px" },
      paddingRight:    { value: 32, unit: "px" },
      fontWeight:      { desktop: "700", value: "" },
      fontWeightSub:   { desktop: "400", value: "" },
      borderColor:     { value: "var(--white)" },
      borderWidth:     { value: "0", unit: "px" },
      borderStyle:     { value: "solid" },
      letterSpacing:   { value: "0", unit: "px" },
      textTransform:   { value: "none" },
      width:           { value: "auto", unit: "%" },
      boxShadow:       { value: "none" },
      textShadow:      { value: "none" },
      iconColor:          { value: "var(--white)" },
      boldTextColor:      { value: "var(--white)" },
      italicTextColor:    { value: "var(--white)" },
      underlineTextColor: { value: "var(--white)" },
      linkTextColor:      { value: "var(--white)" },
      inlineColors:       { value: [] },
      ...styles,
    },
    wrapper: {
      ...ZERO_MARGIN,
      textAlign: { value: "center" },
      width:     { value: "auto", unit: "" },
      height:    { value: "auto", unit: "" },
    },
    customCss:     [],
    id,
    mobileStyles:  { width: { value: 100, unit: "%" }, ...mobileStyles },
    mobileWrapper: {},
    type:          "element",
    child:         [],
    meta:          "button",
    tagName:       "c-button",
    title:         "Button",
    tag:           "",
  };
  return id;
}

// ── Form ──────────────────────────────────────────────────────────────────────

function makeForm(b: Builder): string {
  const id = ghlId("el");
  b.nodes[id] = {
    extra: {
      nodeId:         `c${id}`,
      visibility:     VISIBILITY,
      formId:         { value: "" },
      customClass:    { value: [] },
      elementVersion: { value: 2 },
    },
    class: { ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles: {
      fontFamily:      { value: "var(--bodyfont)" },
      backgroundColor: { value: "var(--transparent)" },
      opacity:         { value: 1 },
      boxShadow:       { value: "none" },
      borderRadius:    { value: 0, unit: "px" },
      borderColor:     { value: "var(--black)" },
      borderWidth:     { value: "0", unit: "px" },
      borderStyle:     { value: "solid" },
    },
    wrapper:       { ...ELEM_WRAPPER },
    customCss:     [],
    id,
    mobileStyles:  {},
    mobileWrapper: {},
    type:          "element",
    child:         [],
    meta:          "form",
    tagName:       "c-form",
    title:         "Form",
    tag:           "",
  };
  return id;
}

// ── Image ─────────────────────────────────────────────────────────────────────

function makeImage(b: Builder, opts: { url?: string; width?: number; height?: number } = {}): string {
  const id = ghlId("el");
  b.nodes[id] = {
    extra: {
      nodeId:     `c${id}`,
      visibility: VISIBILITY,
      imageProperties: {
        value: {
          url:            opts.url ?? "",
          width:          String(opts.width ?? 100),
          redirectAction: "normal",
          imageMeta:      {},
        },
      },
      visitWebsite:   { value: "" },
      downloadFile:   { value: "" },
      customClass:    { value: [] },
      elementVersion: { value: 2 },
    },
    class: { ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles: {
      width:           { value: opts.width ?? 100, unit: "%" },
      fontFamily:      { value: "var(--bodyfont)" },
      backgroundColor: { value: (!opts.url && opts.height) ? "#e8ecf0" : "var(--transparent)" },
      opacity:         { value: 1 },
      boxShadow:       { value: "none" },
      borderRadius:    { value: 0, unit: "px" },
      borderColor:     { value: "var(--black)" },
      borderWidth:     { value: "0", unit: "px" },
      borderStyle:     { value: "solid" },
      ...(opts.height ? { minHeight: { value: opts.height, unit: "px" } } : {}),
    } as GhlElem,
    wrapper:       { ...ELEM_WRAPPER },
    customCss:     [],
    id,
    mobileStyles:  {},
    mobileWrapper: {},
    type:          "element",
    child:         [],
    meta:          "image",
    tagName:       "c-image",
    title:         "Image",
    tag:           "",
  };
  return id;
}

// ── Divider ───────────────────────────────────────────────────────────────────

function makeDivider(b: Builder, styles: StyleMap = {}): string {
  const id = ghlId("el");
  b.nodes[id] = {
    extra: {
      nodeId:         `c${id}`,
      visibility:     VISIBILITY,
      customClass:    { value: [] },
      elementVersion: { value: 2 },
    },
    class: { ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles:        { ...styles },
    wrapper:       { ...ELEM_WRAPPER },
    customCss:     [],
    id,
    mobileStyles:  {},
    mobileWrapper: {},
    type:          "element",
    child:         [],
    meta:          "divider",
    tagName:       "c-divider",
    title:         "Divider",
    tag:           "",
  };
  return id;
}

// ── Video ─────────────────────────────────────────────────────────────────────

function makeVideo(b: Builder, youtubeUrl: string, styles: StyleMap = {}): string {
  const id = ghlId("el");
  const videoId = youtubeUrl.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1] ?? "";
  const thumbnailURL = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "";
  const embedURL     = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&controls=0` : "";
  b.nodes[id] = {
    extra: {
      nodeId:     `c${id}`,
      visibility: VISIBILITY,
      videoProperties: {
        value: {
          url: youtubeUrl, thumbnailURL,
          autoplay: 0, controls: 0, type: "youtube", embedURL,
        },
      },
      playBackControls: { value: {} },
      leadVideoOptions: { value: {} },
      checkStep:        { value: {} },
      customClass:      { value: [] },
      elementVersion:   { value: 2 },
    },
    class: { ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles: {
      width:        { value: 100, unit: "%" },
      borderRadius: { value: 12, unit: "px" },
      overflow:     { value: "hidden" },
      ...styles,
    },
    wrapper:       { ...ELEM_WRAPPER },
    customCss:     [],
    id,
    mobileStyles:  { width: { value: 100, unit: "%" } },
    mobileWrapper: {},
    type:          "element",
    child:         [],
    meta:          "video",
    tagName:       "c-video",
    title:         "Video",
    tag:           "",
  };
  return id;
}

// ── Countdown ─────────────────────────────────────────────────────────────────

function makeCountdown(b: Builder, endDate: string, styles: StyleMap = {}): string {
  const id = ghlId("el");
  b.nodes[id] = {
    extra: {
      nodeId:         `c${id}`,
      visibility:     VISIBILITY,
      timerType:      { value: "fixed" },
      endDate:        { value: endDate },
      timezone:       { value: "America/New_York" },
      expireAction:   { value: "none" },
      labelDays:      { value: "Days" },
      labelHours:     { value: "Hours" },
      labelMinutes:   { value: "Minutes" },
      labelSeconds:   { value: "Seconds" },
      displayStyle:   { value: "block" },
      customClass:    { value: [] },
      elementVersion: { value: 2 },
    },
    class: { ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles: {
      textAlign:    { value: "center" },
      paddingTop:   { value: 8, unit: "px" },
      paddingBottom:{ value: 8, unit: "px" },
      ...styles,
    },
    wrapper:       { ...ELEM_WRAPPER },
    customCss:     [],
    id,
    mobileStyles:  {},
    mobileWrapper: {},
    type:          "element",
    child:         [],
    meta:          "minute-timer",
    tagName:       "c-countdown",
    title:         "Countdown Timer",
    tag:           "",
  };
  return id;
}

// ── Bullet List ───────────────────────────────────────────────────────────────

function makeBulletList(b: Builder, items: string[], primary: string, styles: StyleMap = {}): string {
  const id = ghlId("el");
  b.nodes[id] = {
    extra: {
      nodeId:          `c${id}`,
      visibility:      VISIBILITY,
      items:           { value: items.map(t => ({ text: t, icon: "check" })) },
      listType:        { value: "icon" },
      iconType:        { value: "check" },
      icon:            { value: { fontFamily: "", name: "", unicode: "" } },
      iconColor:       { value: primary },
      iconSize:        { value: "18px" },
      listItemSpacing: { value: "10px" },
      customClass:     { value: [] },
      elementVersion:  { value: 2 },
    },
    class: { ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles: {
      // Text-style properties
      iconColor:          { value: "var(--text-color)" },
      boldTextColor:      { value: "var(--text-color)" },
      italicTextColor:    { value: "var(--text-color)" },
      underlineTextColor: { value: "var(--text-color)" },
      linkTextColor:      { value: "var(--link-color)" },
      inlineColors:       { value: [] },
      // Typography
      fontFamily:         { value: "var(--bodyfont)" },
      fontSize:           { value: 16, unit: "px" },
      fontWeight:         { value: "400" },
      color:              { value: "#e2e8f0" },
      lineHeight:         { value: 1.7, unit: "em" },
      textAlign:          { value: "left" },
      textTransform:      { value: "none" },
      letterSpacing:      { value: 0, unit: "px" },
      textShadow:         { value: "none" },
      // Spacing
      paddingTop:         { value: 0, unit: "px" },
      paddingRight:       { value: 0, unit: "px" },
      paddingBottom:      { value: 8, unit: "px" },
      paddingLeft:        { value: 0, unit: "px" },
      // Base element styles
      backgroundColor:    { value: "var(--transparent)" },
      opacity:            { value: 1 },
      boxShadow:          { value: "none" },
      borderRadius:       { value: 0, unit: "px" },
      borderColor:        { value: "var(--black)" },
      borderWidth:        { value: "0", unit: "px" },
      borderStyle:        { value: "solid" },
      ...styles,
    },
    wrapper:       { ...ELEM_WRAPPER },
    customCss:     [],
    id,
    mobileStyles:  {},
    mobileWrapper: {},
    type:          "element",
    child:         [],
    meta:          "bulletList",
    tagName:       "c-bullet-list",
    title:         "Bullet List",
    tag:           "",
  };
  return id;
}

function makeVerticalDivider(b: Builder): string {
  return makeParagraph(b, "\u00A0", {
    width:           ss("1px"),
    height:          ss("40px"),
    backgroundColor: ss("rgba(255,255,255,0.2)"),
    marginLeft:      ss("auto"),
    marginRight:     ss("auto"),
    display:         ss("block"),
    paddingTop:      sv(0),
    paddingBottom:   sv(0),
  });
}

// ── Custom Code ───────────────────────────────────────────────────────────────
// Schema verified from live GHL payload (forclaude/makeCustomCode-smoketest.ts).
// styles and class MUST be empty — GHL ignores them on this element type.
// All visual control comes from inline styles inside rawCustomCode HTML.

function makeCustomCode(b: Builder, html: string, marginTop = 24): string {
  const suffix = Math.random().toString(36).slice(2, 12);
  const id     = `custom-code-${suffix}`;
  const nid    = `c${id}`;
  b.nodes[id] = {
    child:       [],
    class:       {},
    customCss:   [],
    extra: {
      customClass: { value: [] },
      customCode:  { value: { rawCustomCode: html } },
      nodeId:      nid,
      visibility:  { value: { hideDesktop: false, hideMobile: false } },
    },
    id,
    meta:          "custom-code",
    mobileWrapper: { marginTop: { unit: "px", value: marginTop } },
    styles:        {},
    tag:           "",
    tagName:       "c-custom-code",
    title:         "Custom Code",
    type:          "element",
    wrapper: {
      marginBottom: { unit: "px", value: 0 },
      marginLeft:   { unit: "px", value: 0 },
      marginRight:  { unit: "px", value: 0 },
      marginTop:    { unit: "px", value: marginTop },
    },
  };
  return id;
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────

// ── Hero layout variants ───────────────────────────────────────────────────

function _heroCountdownEnd(): string {
  const d = new Date(); d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 16);
}

function buildHeroTwoColVideo(b: Builder, s: SchemeColors, lp: LandingPageCopy, badgeLabel: string): void {
  const badge = makeParagraph(b, `🔥 ${badgeLabel} — Limited Spots`,
    { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), paddingTop: sv(6), paddingBottom: sv(6), letterSpacing: ss("0.1em"), textTransform: ss("uppercase") });
  const h1 = makeHeading(b, lp.headlineOptions[0] ?? "Join the Free Challenge", "h1",
    { color: ss(s.textColorOnDark), fontSize: sv(56), fontWeight: ss(s.headlineFontWeight), lineHeight: ss("1.1"), paddingBottom: sv(16) },
    { fontSize: sv(30), paddingBottom: sv(12) });
  const sub = makeParagraph(b, lp.subheadline,
    { color: ss("#94a3b8"), fontSize: sv(18), lineHeight: ss("1.6"), paddingTop: sv(16), paddingBottom: sv(24) },
    { fontSize: sv(15) });
  const bullets = makeBulletList(b, lp.bulletPoints.slice(0, 4), s.primary, { paddingBottom: sv(28) });
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss(s.primary), boxShadow: ss(`0 12px 32px ${s.primary}55`), borderRadius: ss(s.buttonBorderRadius) });
  const leftElIds: string[] = [badge, h1, sub, bullets, cta];
  const leftCol = makeCol(b, leftElIds, 55, { padH: 24, valign: "middle" });
  const countdownLabel = makeParagraph(b, "Challenge starts in:",
    { color: ss(s.primary), fontSize: sv(12), fontWeight: ss("700"), textAlign: ss("center"), letterSpacing: ss("0.1em"), textTransform: ss("uppercase"), paddingBottom: sv(4) });
  const countdown = makeCountdown(b, _heroCountdownEnd(), { paddingBottom: sv(20) });
  const videoEl = makeVideo(b, "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    { borderRadius: sv(16), boxShadow: ss(`0 24px 64px rgba(0,0,0,0.5)`) });
  const videoNote = makeParagraph(b, "▶  Replace this video with your own challenge intro",
    { color: ss("rgba(148,163,184,0.6)"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(8) });
  const rightCol = makeCol(b, [countdownLabel, countdown, videoEl, videoNote], 45, { padH: 24, valign: "middle" });
  const r = makeRow(b, [leftCol, rightCol], 1200, 0);
  makeSection(b, [r], { bg: s.heroGradient, bgColor: s.dark, ptD: 88, pbD: 88, ptM: 56, pbM: 56 });
}

function buildHeroCentered(b: Builder, s: SchemeColors, lp: LandingPageCopy, badgeLabel: string): void {
  const badge = makeParagraph(b, `🔥 ${badgeLabel} — Limited Spots`,
    { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), paddingTop: sv(6), paddingBottom: sv(6), letterSpacing: ss("0.1em"), textTransform: ss("uppercase"), textAlign: ss("center") });
  const h1 = makeHeading(b, lp.headlineOptions[0] ?? "Join the Free Challenge", "h1",
    { color: ss(s.textColorOnDark), fontSize: sv(56), fontWeight: ss(s.headlineFontWeight), lineHeight: ss("1.1"), paddingBottom: sv(16), textAlign: ss("center"), maxWidth: sv(800), marginLeft: ss("auto"), marginRight: ss("auto") },
    { fontSize: sv(30), paddingBottom: sv(12) });
  const sub = makeParagraph(b, lp.subheadline,
    { color: ss("#94a3b8"), fontSize: sv(18), lineHeight: ss("1.6"), paddingTop: sv(16), paddingBottom: sv(24), textAlign: ss("center"), maxWidth: sv(600), marginLeft: ss("auto"), marginRight: ss("auto") },
    { fontSize: sv(15) });
  const bullets = makeBulletList(b, lp.bulletPoints.slice(0, 4), s.primary, { paddingBottom: sv(32) });
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss(s.primary), boxShadow: ss(`0 12px 32px ${s.primary}55`), borderRadius: ss(s.buttonBorderRadius) });
  const elIds: string[] = [badge, h1, sub, bullets, cta];
  const col = makeCol(b, elIds, 100, { align: "center", padH: 32 });
  const r = makeRow(b, [col], 720);
  makeSection(b, [r], { bg: s.heroGradient, bgColor: s.dark, ptD: 96, pbD: 96, ptM: 64, pbM: 64 });
}

function buildHeroTwoColImage(b: Builder, s: SchemeColors, lp: LandingPageCopy, badgeLabel: string): void {
  const badge = makeParagraph(b, `🔥 ${badgeLabel} — Limited Spots`,
    { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), paddingTop: sv(6), paddingBottom: sv(6), letterSpacing: ss("0.1em"), textTransform: ss("uppercase") });
  const h1 = makeHeading(b, lp.headlineOptions[0] ?? "Join the Free Challenge", "h1",
    { color: ss(s.textColorOnDark), fontSize: sv(56), fontWeight: ss(s.headlineFontWeight), lineHeight: ss("1.1"), paddingBottom: sv(16) },
    { fontSize: sv(28), paddingBottom: sv(12) });
  const sub = makeParagraph(b, lp.subheadline,
    { color: ss("#94a3b8"), fontSize: sv(18), lineHeight: ss("1.6"), paddingTop: sv(16), paddingBottom: sv(24) },
    { fontSize: sv(14) });
  const bullets = makeBulletList(b, lp.bulletPoints.slice(0, 4), s.primary, { paddingBottom: sv(28) });
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss(s.primary), boxShadow: ss(`0 12px 32px ${s.primary}55`), borderRadius: ss(s.buttonBorderRadius) });
  const leftElIds: string[] = [badge, h1, sub, bullets, cta];
  const leftCol = makeCol(b, leftElIds, 55, { padH: 24, valign: "middle" });
  const img = makeImage(b, { width: 520 });
  const imgNote = makeParagraph(b, "📸 Replace with your hero/result image",
    { color: ss("rgba(148,163,184,0.6)"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(8) });
  const rightCol = makeCol(b, [img, imgNote], 45, { padH: 24, valign: "middle" });
  const r = makeRow(b, [leftCol, rightCol], 1200, 0);
  makeSection(b, [r], { bg: s.heroGradient, bgColor: s.dark, ptD: 88, pbD: 88, ptM: 56, pbM: 56 });
}

function buildHeroTwoColCountdown(b: Builder, s: SchemeColors, lp: LandingPageCopy, badgeLabel: string): void {
  const badge = makeParagraph(b, `🔥 ${badgeLabel} — Limited Spots`,
    { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), paddingTop: sv(6), paddingBottom: sv(6), letterSpacing: ss("0.1em"), textTransform: ss("uppercase") });
  const h1 = makeHeading(b, lp.headlineOptions[0] ?? "Join the Free Challenge", "h1",
    { color: ss(s.textColorOnDark), fontSize: sv(56), fontWeight: ss(s.headlineFontWeight), lineHeight: ss("1.1"), paddingBottom: sv(16) },
    { fontSize: sv(28), paddingBottom: sv(12) });
  const sub = makeParagraph(b, lp.subheadline,
    { color: ss("#94a3b8"), fontSize: sv(18), lineHeight: ss("1.6"), paddingTop: sv(16), paddingBottom: sv(28) },
    { fontSize: sv(14) });
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss(s.primary), boxShadow: ss(`0 12px 32px ${s.primary}55`), borderRadius: ss(s.buttonBorderRadius) });
  const leftElIds: string[] = [badge, h1, sub, cta];
  const leftCol = makeCol(b, leftElIds, 55, { padH: 24, valign: "middle" });
  const urgencyLabel = makeParagraph(b, "⚡  Cohort closes in:",
    { color: ss(s.primary), fontSize: sv(14), fontWeight: ss("700"), textAlign: ss("center"), letterSpacing: ss("0.08em"), textTransform: ss("uppercase"), paddingBottom: sv(8) });
  const countdown = makeCountdown(b, _heroCountdownEnd(), { paddingBottom: sv(24) });
  const spotsNote = makeParagraph(b, "Only a handful of spots remaining",
    { color: ss("rgba(255,255,255,0.6)"), fontSize: sv(13), textAlign: ss("center"), paddingTop: sv(4) });
  const rightCol = makeCol(b, [urgencyLabel, countdown, spotsNote], 45, { padH: 32, valign: "middle" });
  const r = makeRow(b, [leftCol, rightCol], 1200, 0);
  makeSection(b, [r], { bg: s.heroGradient, bgColor: s.dark, ptD: 88, pbD: 88, ptM: 56, pbM: 56 });
}

function buildHeroFullWidth(b: Builder, s: SchemeColors, lp: LandingPageCopy, badgeLabel: string): void {
  const urgencyBadge = makeParagraph(b, `🔥 ${badgeLabel} — Limited Spots`,
    { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), paddingTop: sv(6), paddingBottom: sv(6), letterSpacing: ss("0.1em"), textTransform: ss("uppercase"), textAlign: ss("center") });
  const h1 = makeHeading(b, lp.headlineOptions[0] ?? "Join the Free Challenge", "h1",
    { color: ss(s.textColorOnDark), fontSize: sv(56), fontWeight: ss(s.headlineFontWeight), lineHeight: ss("1.1"), paddingBottom: sv(20), textAlign: ss("center"), maxWidth: sv(900), marginLeft: ss("auto"), marginRight: ss("auto") },
    { fontSize: sv(32), paddingBottom: sv(14) });
  const sub = makeParagraph(b, lp.subheadline,
    { color: ss("#94a3b8"), fontSize: sv(18), lineHeight: ss("1.6"), paddingTop: sv(16), paddingBottom: sv(32), textAlign: ss("center"), maxWidth: sv(680), marginLeft: ss("auto"), marginRight: ss("auto") },
    { fontSize: sv(16) });
  const bullets = makeBulletList(b, lp.bulletPoints.slice(0, 5), s.primary, { paddingBottom: sv(36) });
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss(s.primary), boxShadow: ss(`0 16px 40px ${s.primary}66`), borderRadius: ss(s.buttonBorderRadius) });
  const col = makeCol(b, [urgencyBadge, h1, sub, bullets, cta], 100, { align: "center", padH: 40 });
  const r = makeRow(b, [col], 800);
  makeSection(b, [r], { bg: s.heroGradient, bgColor: s.dark, ptD: 104, pbD: 104, ptM: 64, pbM: 64 });
}

// ── Social proof bar layout variants ──────────────────────────────────────

function buildSocialProofStarsBullets(b: Builder, s: SchemeColors, corePromise: string): void {
  const stars   = makeParagraph(b, "★★★★★  500+ clients", { color: ss("#fbbf24"), fontSize: sv(13), textAlign: ss("center"), fontWeight: ss("600") });
  const div1    = makeVerticalDivider(b);
  const promise = makeParagraph(b, corePromise.split(" ").slice(0, 8).join(" "), { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") });
  const div2    = makeVerticalDivider(b);
  const noCard  = makeParagraph(b, "Free to join — no card required", { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") });
  const c1 = makeCol(b, [stars],   33, { align: "center" });
  const c2 = makeCol(b, [div1],     4, { align: "center" });
  const c3 = makeCol(b, [promise], 26, { align: "center" });
  const c4 = makeCol(b, [div2],     4, { align: "center" });
  const c5 = makeCol(b, [noCard],  33, { align: "center" });
  const r  = makeRow(b, [c1, c2, c3, c4, c5], 1200, 24);
  makeSection(b, [r], { bgColor: s.socialProofBackground, ptD: 28, pbD: 28, ptM: 20, pbM: 20 });
}

function buildSocialProofCenteredStat(b: Builder, s: SchemeColors, _corePromise: string): void {
  const stat  = makeParagraph(b, "500+",
    { color: ss(s.primary), fontSize: sv(48), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1"), paddingBottom: sv(4) });
  const label = makeParagraph(b, "people have completed this challenge — free to join",
    { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") });
  const col = makeCol(b, [stat, label], 100, { align: "center" });
  const r = makeRow(b, [col], 480, 24);
  makeSection(b, [r], { bgColor: s.socialProofBackground, ptD: 28, pbD: 28, ptM: 20, pbM: 20 });
}

function buildSocialProofThreeStats(b: Builder, s: SchemeColors, _corePromise: string): void {
  const makeStatCol = (num: string, text: string) => {
    const n = makeParagraph(b, num, { color: ss(s.primary), fontSize: sv(30), fontWeight: ss("900"), textAlign: ss("center"), paddingBottom: sv(4) });
    const t = makeParagraph(b, text, { color: ss("#94a3b8"), fontSize: sv(12), textAlign: ss("center") });
    return makeCol(b, [n, t], 33, { align: "center", padH: 16 });
  };
  const c1 = makeStatCol("500+", "Members Joined");
  const c2 = makeStatCol("4.9★", "Average Rating");
  const c3 = makeStatCol("100%", "Free to Join");
  const r = makeRow(b, [c1, c2, c3], 800, 24);
  makeSection(b, [r], { bgColor: s.socialProofBackground, ptD: 28, pbD: 28, ptM: 20, pbM: 20 });
}

function buildSocialProofSingleQuote(b: Builder, s: SchemeColors, corePromise: string): void {
  const openQuote = makeParagraph(b, "\u201c",
    { color: ss(s.primary), fontSize: sv(48), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1"), paddingBottom: sv(0) });
  const quote = makeParagraph(b, corePromise,
    { color: ss("#e2e8f0"), fontSize: sv(18), lineHeight: ss("1.6"), textAlign: ss("center"), fontStyle: ss("italic"), paddingBottom: sv(8), maxWidth: sv(600), marginLeft: ss("auto"), marginRight: ss("auto") });
  const attr = makeParagraph(b, "— 500+ participants already inside",
    { color: ss("#64748b"), fontSize: sv(12), textAlign: ss("center") });
  const col = makeCol(b, [openQuote, quote, attr], 100, { align: "center", padH: 32 });
  const r = makeRow(b, [col], 700, 24);
  makeSection(b, [r], { bgColor: s.socialProofBackground, ptD: 28, pbD: 28, ptM: 20, pbM: 20 });
}

function buildSocialProofHorizontalBadges(b: Builder, s: SchemeColors, corePromise: string): void {
  const t1  = makeParagraph(b, "★★★★★  500+ clients", { color: ss("#fbbf24"), fontSize: sv(13), textAlign: ss("center"), fontWeight: ss("600") });
  const t2  = makeParagraph(b, corePromise.split(" ").slice(0, 8).join(" "), { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center"), fontWeight: ss("500") });
  const t3  = makeParagraph(b, "Free to join — no card required", { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center"), fontWeight: ss("500") });
  const d1  = makeVerticalDivider(b);
  const d2  = makeVerticalDivider(b);
  const c1  = makeCol(b, [t1], 32, { align: "center", padH: 24 });
  const cd1 = makeCol(b, [d1],  4, { align: "center" });
  const c2  = makeCol(b, [t2], 28, { align: "center", padH: 24 });
  const cd2 = makeCol(b, [d2],  4, { align: "center" });
  const c3  = makeCol(b, [t3], 32, { align: "center", padH: 24 });
  const r   = makeRow(b, [c1, cd1, c2, cd2, c3], 1100, 24);
  makeSection(b, [r], { bgColor: s.socialProofBackground, ptD: 28, pbD: 28, ptM: 20, pbM: 20 });
}

// ── What's included layout variants ────────────────────────────────────────
// Single consolidated layout: eyebrow + h2 + ONE c-custom-code = 5 elements total.
// All AI-suggested variant names route here; multi-column variants removed to
// eliminate the element-count explosion that caused GHL publish timeouts.
//
// NOTE: The native c-bullet-list (tagName "c-bullet-list" / meta "bulletList") is
// NOT used here because GHL's page renderer expects tagName "bullet-list" / meta
// "bullet-list" (no c- prefix), causing silent blank rendering on published pages.
// We use a self-contained c-custom-code block instead (same fix as the FAQ section).

/**
 * Builds the raw HTML for the "Everything Included" bullet list section body.
 * Used inside a makeCustomCode block so GHL renders it reliably on published pages.
 */
export function buildIncludedHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font   = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const points = data.landingPage?.bulletPoints?.slice(0, 6) ?? [];

  const itemsHtml = points.length > 0
    ? points.map((pt) => {
        const text = escHtml(typeof pt === "string" ? pt : String(pt ?? ""));
        return `<div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:16px;">
      <div style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:${s.primary};color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:2px;">✓</div>
      <p style="margin:0;color:${s.textColorOnLight};font-size:18px;line-height:1.6;font-family:${font};">${text}</p>
    </div>`;
      }).join("\n    ")
    : `<div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:16px;">
      <div style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:${s.primary};color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:2px;">✓</div>
      <p style="margin:0;color:${s.textColorOnLight};font-size:18px;line-height:1.6;font-family:${font};">Challenge details will appear here.</p>
    </div>`;

  return `<div style="background:${s.alt};padding:0 24px 40px;font-family:${font};">
  <div style="max-width:720px;margin:0 auto;">
    ${itemsHtml}
  </div>
</div>`;
}

function buildIncludedSingleCol(b: Builder, s: SchemeColors, lp: LandingPageCopy, data: GeneratedFunnelAssets): void {
  const eyebrow = makeParagraph(b, "What You'll Get",
    { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("700"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(12), textAlign: ss("center") });
  const h2 = makeHeading(b, "Everything included in your free challenge", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(36), fontWeight: ss("800"), lineHeight: ss("1.2"), paddingBottom: sv(32), textAlign: ss("center") },
    { fontSize: sv(24), paddingBottom: sv(20) });
  const ccHtml = buildIncludedHtml(data, s);
  const ccId   = makeCustomCode(b, ccHtml, 0);
  const col    = makeCol(b, [eyebrow, h2, ccId], 100, { align: "center", padH: 32 });
  const row    = makeRow(b, [col], 720, 24);
  makeSection(b, [row], { bgColor: s.alt, ptD: 56, pbD: 64, ptM: 40, pbM: 48 });
}

// ── FAQ layout variants ────────────────────────────────────────────────────

/**
 * Renders FAQ items as plain paragraphs instead of the native c-faq accordion.
 * Avoids GHL's publish hang caused by the c-faq SSR renderer processing raw
 * HTML strings in faqList[].heading.
 *
 * Each item: bold question paragraph + muted answer paragraph (no dividers).
 * Dividers were removed to keep the section under 9 elements.
 * Returns a flat array of element IDs to spread into the parent column's children.
 */
function makeFaqPlain(
  b: Builder,
  items: { question: string; answer: string }[],
  headingColor: string,
): string[] {
  const ids: string[] = [];

  items.forEach((item) => {
    const q = makeParagraph(b, item.question, {
      fontWeight:    ss("700"),
      fontSize:      sv(16),
      paddingTop:    sv(20),
      paddingBottom: sv(4),
      color:         ss(headingColor),
    });

    const a = makeParagraph(b, item.answer, {
      fontWeight:    ss("400"),
      fontSize:      sv(15),
      paddingTop:    sv(0),
      paddingBottom: sv(8),
      color:         ss("#3a3a5c"),
    });

    ids.push(q, a);
  });

  return ids;
}

function buildFaqSingleCol(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const heading = makeHeading(b, "Frequently Asked Questions", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(44) },
    { fontSize: sv(22) });
  const faqIds = makeFaqPlain(b, lp.faqItems.slice(0, 3), s.textColorOnLight);
  const c = makeCol(b, [heading, ...faqIds], 100, { padH: 0 });
  const r = makeRow(b, [c], 680, 24);
  makeSection(b, [r], { bgColor: s.alt, ptD: 72, pbD: 80, ptM: 48, pbM: 56 });
}

function buildFaqTwoCol(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const heading    = makeHeading(b, "Frequently Asked Questions", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(44) },
    { fontSize: sv(22) });
  const headingCol = makeCol(b, [heading], 100, { align: "center" });
  const headingRow = makeRow(b, [headingCol], 800, 0);
  const faqIds     = makeFaqPlain(b, lp.faqItems.slice(0, 3), s.textColorOnLight);
  const faqCol     = makeCol(b, [...faqIds], 100, { padH: 24 });
  const faqRow     = makeRow(b, [faqCol], 1100, 0);
  makeSection(b, [headingRow, faqRow], { bgColor: s.alt, ptD: 72, pbD: 80, ptM: 48, pbM: 56 });
}

function buildFaqImageLeft(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const img     = makeImage(b, { width: 400 });
  const imgNote = makeParagraph(b, "📸 Replace with your coach photo",
    { color: ss("rgba(107,114,128,0.7)"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(8) });
  const imgCol  = makeCol(b, [img, imgNote], 35, { padH: 24, valign: "top" });
  const heading = makeHeading(b, "Got Questions?", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("900"), lineHeight: ss("1.2"), paddingBottom: sv(32) },
    { fontSize: sv(22) });
  const faqIds  = makeFaqPlain(b, lp.faqItems.slice(0, 3), s.textColorOnLight);
  const textCol = makeCol(b, [heading, ...faqIds], 65, { padH: 24, valign: "top" });
  const r = makeRow(b, [imgCol, textCol], 1100, 0);
  makeSection(b, [r], { bgColor: s.alt, ptD: 72, pbD: 80, ptM: 48, pbM: 56 });
}

function buildFaqNumbered(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const heading = makeHeading(b, "Frequently Asked Questions", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(44) },
    { fontSize: sv(22) });
  const faqIds = makeFaqPlain(b, lp.faqItems.slice(0, 3), s.textColorOnLight);
  const c = makeCol(b, [heading, ...faqIds], 100, { padH: 0 });
  const r = makeRow(b, [c], 700, 24);
  makeSection(b, [r], { bgColor: s.alt, ptD: 72, pbD: 80, ptM: 48, pbM: 56 });
}

function buildFaqWithInlineCta(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const heading = makeHeading(b, "Frequently Asked Questions", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(44) },
    { fontSize: sv(22) });
  const faqIds = makeFaqPlain(b, lp.faqItems.slice(0, 3), s.textColorOnLight);
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss(s.primary), boxShadow: ss(`0 8px 24px ${s.primary}44`), borderRadius: ss(s.buttonBorderRadius) });
  const c = makeCol(b, [heading, ...faqIds, cta], 100, { padH: 0, align: "center" });
  const r = makeRow(b, [c], 680, 24);
  makeSection(b, [r], { bgColor: s.alt, ptD: 72, pbD: 80, ptM: 48, pbM: 56 });
}

// ── Final CTA layout variants ──────────────────────────────────────────────

function buildCtaCenteredColorBg(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const h2 = makeHeading(b, "Ready to start? Spots are limited.", "h2",
    { color: ss(s.textColorOnDark), fontSize: sv(40), fontWeight: ss(s.headlineFontWeight), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(600), marginLeft: ss("auto"), marginRight: ss("auto") },
    { fontSize: sv(26) });
  const urgency = makeParagraph(b, "Spots are limited — claim yours now.",
    { color: ss("rgba(255,255,255,0.82)"), fontSize: sv(17), textAlign: ss("center"), paddingBottom: sv(36) });
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss("#ffffff"), color: ss(s.primary), boxShadow: ss("0 8px 24px rgba(0,0,0,0.18)"), borderRadius: ss(s.buttonBorderRadius) });
  const c = makeCol(b, [h2, urgency, cta], 100, { align: "center", padH: 32 });
  const r = makeRow(b, [c], 640);
  makeSection(b, [r], { bgColor: s.ctaSectionBackground, ptD: 88, pbD: 88 });
}

function buildCtaTwoColForm(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const h2 = makeHeading(b, "Ready to start? Spots are limited.", "h2",
    { color: ss(s.textColorOnDark), fontSize: sv(36), fontWeight: ss(s.headlineFontWeight), lineHeight: ss("1.15"), paddingBottom: sv(12) },
    { fontSize: sv(24) });
  const sub = makeParagraph(b, "Spots are limited — claim yours now.",
    { color: ss("rgba(255,255,255,0.8)"), fontSize: sv(16), lineHeight: ss("1.6") });
  const leftCol = makeCol(b, [h2, sub], 55, { padH: 32, valign: "middle" });
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss("#ffffff"), color: ss(s.primary), boxShadow: ss("0 8px 24px rgba(0,0,0,0.2)"), borderRadius: ss(s.buttonBorderRadius) });
  const note = makeParagraph(b, "🔒  Free · No credit card",
    { color: ss("rgba(255,255,255,0.6)"), fontSize: sv(12), textAlign: ss("center"), paddingTop: sv(12) });
  const rightCol = makeCol(b, [cta, note], 45, { padH: 32, valign: "middle", align: "center" });
  const r = makeRow(b, [leftCol, rightCol], 1000, 0);
  makeSection(b, [r], { bgColor: s.ctaSectionBackground, ptD: 72, pbD: 72, ptM: 48, pbM: 48 });
}

function buildCtaWithCountdown(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const h2 = makeHeading(b, "Ready to start? Spots are limited.", "h2",
    { color: ss(s.textColorOnDark), fontSize: sv(40), fontWeight: ss(s.headlineFontWeight), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(8), maxWidth: sv(600), marginLeft: ss("auto"), marginRight: ss("auto") },
    { fontSize: sv(26) });
  const sub = makeParagraph(b, "Your spot expires when this timer runs out.",
    { color: ss("rgba(255,255,255,0.7)"), fontSize: sv(14), textAlign: ss("center"), paddingBottom: sv(20) });
  const countdown = makeCountdown(b, _heroCountdownEnd(), { paddingBottom: sv(28) });
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss("#ffffff"), color: ss(s.primary), boxShadow: ss("0 8px 24px rgba(0,0,0,0.18)"), borderRadius: ss(s.buttonBorderRadius) });
  const c = makeCol(b, [h2, sub, countdown, cta], 100, { align: "center", padH: 32 });
  const r = makeRow(b, [c], 640);
  makeSection(b, [r], { bgColor: s.ctaSectionBackground, ptD: 88, pbD: 88 });
}

function buildCtaDarkMinimal(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const eyebrow = makeParagraph(b, "One last thing",
    { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), textAlign: ss("center"), letterSpacing: ss("0.1em"), textTransform: ss("uppercase"), paddingBottom: sv(16) });
  const h2 = makeHeading(b, "Ready to start? Spots are limited.", "h2",
    { color: ss("#f8fafc"), fontSize: sv(44), fontWeight: ss(s.headlineFontWeight), textAlign: ss("center"), lineHeight: ss("1.1"), paddingBottom: sv(36), maxWidth: sv(560), marginLeft: ss("auto"), marginRight: ss("auto") },
    { fontSize: sv(26) });
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss(s.primary), boxShadow: ss(`0 12px 32px ${s.primary}44`), borderRadius: ss(s.buttonBorderRadius) });
  const c = makeCol(b, [eyebrow, h2, cta], 100, { align: "center", padH: 32 });
  const r = makeRow(b, [c], 600);
  makeSection(b, [r], { bgColor: s.dark, ptD: 96, pbD: 96, ptM: 64, pbM: 64 });
}

function buildCtaSocialProofCta(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const proof = makeParagraph(b, "⭐⭐⭐⭐⭐  Join 500+ members already inside",
    { color: ss("rgba(255,255,255,0.7)"), fontSize: sv(13), textAlign: ss("center"), paddingBottom: sv(16) });
  const h2 = makeHeading(b, "Ready to start? Spots are limited.", "h2",
    { color: ss(s.textColorOnDark), fontSize: sv(40), fontWeight: ss(s.headlineFontWeight), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(600), marginLeft: ss("auto"), marginRight: ss("auto") },
    { fontSize: sv(26) });
  const urgency = makeParagraph(b, "Spots are limited — claim yours now.",
    { color: ss("rgba(255,255,255,0.82)"), fontSize: sv(16), textAlign: ss("center"), paddingBottom: sv(32) });
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss("#ffffff"), color: ss(s.primary), boxShadow: ss("0 8px 24px rgba(0,0,0,0.18)"), borderRadius: ss(s.buttonBorderRadius) });
  const c = makeCol(b, [proof, h2, urgency, cta], 100, { align: "center", padH: 32 });
  const r = makeRow(b, [c], 640);
  makeSection(b, [r], { bgColor: s.ctaSectionBackground, ptD: 88, pbD: 88 });
}

// ── Layout variant dispatch ────────────────────────────────────────────────

function pick(valid: readonly string[], provided?: string): string {
  if (provided && valid.includes(provided)) return provided;
  return valid[Math.floor(Math.random() * valid.length)];
}

function dispatchHero(b: Builder, s: SchemeColors, lp: LandingPageCopy, badgeLabel: string, variant: string): void {
  const VALID = ["hero-centered","hero-two-col-video","hero-two-col-image","hero-two-col-countdown","hero-full-width"] as const;
  const v = pick(VALID, variant);
  if (!VALID.includes(variant as never)) console.warn(`[layout-variant] hero: ${variant ? `unknown variant "${variant}"` : "key absent"}, falling back to "${v}"`);
  console.log(`[layout-variant] hero → ${v}`);
  switch (v) {
    case "hero-centered":           return buildHeroCentered(b, s, lp, badgeLabel);
    case "hero-two-col-image":      return buildHeroTwoColImage(b, s, lp, badgeLabel);
    case "hero-two-col-countdown":  return buildHeroTwoColCountdown(b, s, lp, badgeLabel);
    case "hero-full-width":         return buildHeroFullWidth(b, s, lp, badgeLabel);
    default:                        return buildHeroTwoColVideo(b, s, lp, badgeLabel);
  }
}

function dispatchSocialProof(b: Builder, s: SchemeColors, corePromise: string, variant: string): void {
  const VALID = ["social-proof-stars-bullets","social-proof-centered-stat","social-proof-three-stats","social-proof-single-quote","social-proof-horizontal-badges"] as const;
  const v = pick(VALID, variant);
  if (!VALID.includes(variant as never)) console.warn(`[layout-variant] social-proof: ${variant ? `unknown variant "${variant}"` : "key absent"}, falling back to "${v}"`);
  console.log(`[layout-variant] social-proof → ${v}`);
  switch (v) {
    case "social-proof-centered-stat":     return buildSocialProofCenteredStat(b, s, corePromise);
    case "social-proof-three-stats":       return buildSocialProofThreeStats(b, s, corePromise);
    case "social-proof-single-quote":      return buildSocialProofSingleQuote(b, s, corePromise);
    case "social-proof-horizontal-badges": return buildSocialProofHorizontalBadges(b, s, corePromise);
    default:                               return buildSocialProofStarsBullets(b, s, corePromise);
  }
}

function dispatchWhatsIncluded(b: Builder, s: SchemeColors, lp: LandingPageCopy, variant: string, data: GeneratedFunnelAssets): void {
  // All variants consolidated into one single-col layout (5 elements).
  // Multi-column variants were removed — they produced 11–25 elements and caused
  // GHL publish timeouts at 121KB / 63 total elements.
  console.log(`[layout-variant] whats-included → included-single-col (AI variant "${variant || "(none)"}" ignored)`);
  return buildIncludedSingleCol(b, s, lp, data);
}

function dispatchFaq(b: Builder, s: SchemeColors, lp: LandingPageCopy, variant: string): void {
  // All variants consolidated into buildFaqSingleCol (9 elements: heading + 3×(q+a) + col + row).
  // Other variants (two-col, image-left, with-inline-cta) exceed 9 elements due to extra
  // structural wrappers/images/CTAs and were causing GHL publish timeouts.
  console.log(`[layout-variant] faq → faq-single-col (AI variant "${variant || "(none)"}" ignored)`);
  return buildFaqSingleCol(b, s, lp);
}

function dispatchFinalCta(b: Builder, s: SchemeColors, lp: LandingPageCopy, variant: string): void {
  // Accept both new prompt names and legacy names for backward compat
  const ALIAS: Record<string, string> = {
    "cta-two-col-image":  "cta-two-col-form",
    "cta-split-countdown": "cta-with-countdown",
  };
  const resolved = ALIAS[variant] ?? variant;
  const VALID = ["cta-centered-color-bg","cta-two-col-form","cta-with-countdown","cta-dark-minimal","cta-social-proof-cta"] as const;
  const v = pick(VALID, resolved);
  if (!VALID.includes(resolved as never)) console.warn(`[layout-variant] final-cta: ${variant ? `unknown variant "${variant}"` : "key absent"}, falling back to "${v}"`);
  console.log(`[layout-variant] final-cta → ${v}${resolved !== variant ? ` (alias for "${variant}")` : ""}`);
  switch (v) {
    case "cta-two-col-form":     return buildCtaTwoColForm(b, s, lp);
    case "cta-with-countdown":   return buildCtaWithCountdown(b, s, lp);
    case "cta-dark-minimal":     return buildCtaDarkMinimal(b, s, lp);
    case "cta-social-proof-cta": return buildCtaSocialProofCta(b, s, lp);
    default:                     return buildCtaCenteredColorBg(b, s, lp);
  }
}

// TODO: replace with data.businessName once added to GeneratedFunnelAssets
function buildFooter(b: Builder, s: SchemeColors): void {
  const year = new Date().getFullYear();
  const copy = makeParagraph(b,
    `© ${year} All rights reserved. | Privacy Policy | Terms of Service`,
    { color: ss("rgba(255,255,255,0.5)"), fontSize: sv(12), textAlign: ss("center"), paddingBottom: sv(4) });
  const disclaimer = makeParagraph(b,
    "Results may vary. This challenge is for informational purposes only.",
    { color: ss("rgba(255,255,255,0.3)"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(4) });
  const col = makeCol(b, [copy, disclaimer], 100, { align: "center", padH: 24 });
  const row = makeRow(b, [col], 1200, 0);
  makeSection(b, [row], { bgColor: s.dark, ptD: 32, pbD: 32, ptM: 24, pbM: 24 });
}

// ── Landing page layout variant ─────────────────────────────────────────────
// Currently only variant-a (standard layout) is active. The variant field is
// retained in persisted outputs for forward compatibility when new native-GHL
// element variants are added in future. All runs emit "variant-a".

const LANDING_VARIANTS = ["variant-a"] as const;
export type LandingVariant = typeof LANDING_VARIANTS[number];

export function pickLandingVariant(): LandingVariant {
  return "variant-a";
}

// ── Template variant pool (exported so the API route can pick & name the variant) ──
// ALL_TEMPLATE_VARIANTS defines the full type — all 20 variants are wired into
// buildLandingPageData(). TEMPLATE_VARIANTS_POOL controls frequency.
// Phase 2 variants are commented out of the pool until they pass visual QA.
export const ALL_TEMPLATE_VARIANTS = [
  // Phase 1
  "standard", "stats-hero", "social-proof-grid",
  "transformation-split", "authority-builder", "urgency-driven",
  "bold-impact", "community-proof", "video-authority", "minimalist-elite",
  // Phase 2
  "vsl-focused", "transformation-wall", "is-this-for-you", "event-agenda",
  "executive-clean", "local-demographic", "free-value-first",
  "application-style", "story-journey", "results-first",
  // Phase 3
  "gradient-proof",
] as const;
export type TemplateVariant = typeof ALL_TEMPLATE_VARIANTS[number];

export const TEMPLATE_VARIANTS_POOL: TemplateVariant[] = [
  // Core templates — higher frequency
  "standard","standard","standard",
  "stats-hero","stats-hero",
  "transformation-split","transformation-split",
  // Standard single-slot templates
  "authority-builder",
  "urgency-driven",
  "bold-impact",
  "community-proof",
  "video-authority",
  "minimalist-elite",
  "vsl-focused",
  "transformation-wall",
  "is-this-for-you",
  "event-agenda",
  "executive-clean",
  "local-demographic",
  "free-value-first",
  "application-style",
  "story-journey",
  "results-first",
  "social-proof-grid",
  "gradient-proof",
];

export function pickTemplateVariant(): TemplateVariant {
  return TEMPLATE_VARIANTS_POOL[Math.floor(Math.random() * TEMPLATE_VARIANTS_POOL.length)];
}

// ── Custom-code template builders ─────────────────────────────────────────────
// These functions return self-contained inline-styled HTML strings that are
// injected via makeCustomCode() → c-custom-code elements. No <script> tags.
// Font: system stack only. All colour values come from the active SchemeColors.

// ── Premium CSS design tokens ─────────────────────────────────────────────────
// Shared across all template builders for visual consistency.
const DOT_BG   = "radial-gradient(circle,rgba(255,255,255,0.07) 1px,transparent 1px) center/24px 24px";
const SHADOW_XL = "0 20px 25px -5px rgba(0,0,0,0.18),0 8px 10px -6px rgba(0,0,0,0.12)";
const SHADOW_SM = "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.06)";
function glowStyle(hex: string): string {
  return `box-shadow:0 0 28px ${hex}55,0 4px 16px ${hex}33`;
}
function gradientText(from: string, to: string): string {
  return `background:linear-gradient(135deg,${from} 0%,${to} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:inline-block`;
}

/** Minimal HTML entity escape for AI-generated text interpolated into raw HTML. */
function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildStatsHeroHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const lp = data.landingPage;
  const headline    = escHtml(lp.headlineOptions[0] ?? "Join the Free Challenge");
  const subheadline = escHtml(lp.subheadline ?? "");
  const ctaText     = escHtml(lp.ctaText ?? "Claim Your Spot");
  const clientCount = data.clientCount ? escHtml(data.clientCount) : "500+";

  const conceptWords = escHtml(
    (data.offerSummary.challengeConcept ?? "")
      .split(/\s+/).slice(0, 3).join(" ").trim().toUpperCase()
  );
  const eyebrowConcept = conceptWords || "30-DAY CHALLENGE";
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const videoLink = data.coachVideoUrl
    ? `<a href="${escHtml(data.coachVideoUrl)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;color:rgba(255,255,255,0.7);font-size:14px;text-decoration:none;margin-top:16px;">▶ Watch my story</a>`
    : "";

  return `<div style="background:${s.heroGradient};background-image:${DOT_BG};min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px;text-align:center;font-family:${font};box-sizing:border-box;">
  <div style="max-width:860px;margin:0 auto;width:100%;">
    <p style="color:${s.primary};font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;font-variant:small-caps;margin:0 0 24px;">⚡ LIMITED SPOTS — ${eyebrowConcept} NOW OPEN</p>
    <h1 style="font-size:clamp(32px,5vw,54px);font-weight:900;line-height:1.1;margin:0 0 20px;"><span style="${gradientText("#ffffff", "rgba(255,255,255,0.75)") }">${headline}</span></h1>
    <p style="color:rgba(255,255,255,0.82);font-size:18px;line-height:1.6;margin:0 0 40px;">${subheadline}</p>
    <div style="display:flex;justify-content:center;gap:48px;flex-wrap:wrap;margin-bottom:40px;">
      <div style="text-align:center;">
        <div style="color:${s.primary};font-size:52px;font-weight:900;line-height:1;text-shadow:0 0 40px ${s.primary}88;">${clientCount}</div>
        <div style="color:rgba(255,255,255,0.65);font-size:13px;letter-spacing:1px;margin-top:6px;">Members Transformed</div>
      </div>
      <div style="text-align:center;">
        <div style="color:${s.primary};font-size:52px;font-weight:900;line-height:1;text-shadow:0 0 40px ${s.primary}88;">30</div>
        <div style="color:rgba(255,255,255,0.65);font-size:13px;letter-spacing:1px;margin-top:6px;">Day Challenge</div>
      </div>
      <div style="text-align:center;">
        <div style="color:${s.primary};font-size:52px;font-weight:900;line-height:1;text-shadow:0 0 40px ${s.primary}88;">97%</div>
        <div style="color:rgba(255,255,255,0.65);font-size:13px;letter-spacing:1px;margin-top:6px;">See Results</div>
      </div>
    </div>
    <a href="#optin" style="display:inline-block;background:${s.primary};color:#ffffff;text-decoration:none;padding:18px 44px;border-radius:${s.buttonBorderRadius};font-size:17px;font-weight:700;font-family:${font};${glowStyle(s.primary)}">${ctaText}</a>
    ${videoLink}
  </div>
</div>`;
}

function buildSocialProofGridHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const bg   = s.alt || "#f8fafc";
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  const cards = [
    { initial: "S", name: "Sarah M.",    badge: "Lost 12 lbs in 30 days",  quote: "This challenge completely changed my relationship with fitness. I never thought I could stick to a program for a month — but here I am!" },
    { initial: "J", name: "Jennifer K.", badge: "Down 2 dress sizes",       quote: "I've tried everything before, but this was the first program where I actually looked forward to showing up every single day." },
    { initial: "R", name: "Rachel T.",   badge: "Lost 18 lbs",              quote: "The daily structure and the community accountability made all the difference. I finally feel like myself again." },
    { initial: "M", name: "Maria L.",    badge: "Gained real strength",     quote: "I wasn't just losing weight — I was building real confidence. That's worth more than any number on a scale." },
  ];

  const cardHtml = cards.map(c => `<div style="background:#ffffff;border-radius:14px;padding:24px;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,${s.primary},${s.accent});color:#ffffff;font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${c.initial}</div>
        <div>
          <div style="font-weight:700;color:#0f172a;font-size:15px;">${c.name}</div>
          <div style="font-size:13px;color:${s.primary};margin-top:2px;">${c.badge}</div>
        </div>
      </div>
      <p style="color:#475569;font-size:15px;line-height:1.65;margin:0;">"${c.quote}"</p>
    </div>`).join("\n    ");

  return `<div style="background:${bg};padding:64px 24px;font-family:${font};">
  <div style="max-width:860px;margin:0 auto;text-align:center;">
    <h2 style="color:#0f172a;font-size:clamp(28px,4vw,42px);font-weight:900;margin:0 0 8px;">Real Results. Real Women.</h2>
    <p style="color:#64748b;font-size:17px;margin:0 0 40px;">Here's what happened when they committed to 30 days...</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;max-width:900px;margin:0 auto;">
    ${cardHtml}
  </div>
</div>`;
}

// ── Template 21: gradient-proof ─────────────────────────────────────────────
// Signature palette hard-coded from the original reference page JSON.
// These colors are deliberately NOT scheme-dependent so the visual identity
// is always consistent regardless of which colour scheme the coach selected.
const GP_GRADIENT = "linear-gradient(135deg, #2d1b3d 0%, #6b3fa0 60%, #c2185b 100%)";
const GP_DARK     = "#1e1030";   // deep purple-black (hero bg fallback, dark sections)
const GP_PINK     = "#e91e8c";   // hot magenta-pink  (buttons, accents, CTA section)
const GP_CREAM    = "#fdf6f9";   // very light blush  (qualification + features sections)
const GP_TEXT     = "#1a1a2e";   // near-black for dark text on cream

/**
 * Hero: centred, diagonal purple→violet→hot-pink gradient with headline,
 * subheadline, 4 bullet points (✓ badges) and a glowing hot-pink CTA button.
 */
function buildGradientProofHeroHtml(data: GeneratedFunnelAssets, _s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const lp   = data.landingPage;
  const h1   = escHtml(lp?.headlineOptions?.[0] ?? "Your Free 30-Day Challenge Starts Here");
  const sub  = escHtml(lp?.subheadline ?? "");
  const pts  = lp?.bulletPoints?.slice(0, 4) ?? [];
  const cta  = escHtml(lp?.ctaText ?? "Claim My Free Spot →");

  const bulletsHtml = (pts.length > 0 ? pts : ["Challenge details will appear here."]).map(pt =>
    `<div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;text-align:left;">
      <div style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:${GP_PINK};color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:2px;box-shadow:0 0 12px ${GP_PINK}66;">✓</div>
      <p style="margin:0;color:rgba(255,255,255,0.9);font-size:17px;line-height:1.65;font-family:${font};">${escHtml(typeof pt === "string" ? pt : String(pt ?? ""))}</p>
    </div>`
  ).join("\n");

  return `<div style="background:${GP_GRADIENT};background-color:${GP_DARK};padding:96px 24px;font-family:${font};text-align:center;">
  <div style="max-width:820px;margin:0 auto;">
    <p style="color:rgba(255,255,255,0.65);font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 18px;">🔥 Free 30-Day Challenge — Limited Spots Available</p>
    <h1 style="color:#ffffff;font-size:clamp(30px,5vw,58px);font-weight:900;line-height:1.08;margin:0 0 20px;text-shadow:0 2px 32px rgba(0,0,0,0.35);">${h1}</h1>
    ${sub ? `<p style="color:rgba(255,255,255,0.78);font-size:18px;line-height:1.65;margin:0 0 36px;max-width:620px;margin-left:auto;margin-right:auto;">${sub}</p>` : ""}
    <div style="max-width:620px;margin:0 auto 40px;text-align:left;">
      ${bulletsHtml}
    </div>
    <a href="#optin" style="display:inline-block;background:${GP_PINK};color:#ffffff;text-decoration:none;padding:18px 48px;border-radius:50px;font-size:18px;font-weight:700;box-shadow:0 0 32px ${GP_PINK}66,0 4px 16px rgba(0,0,0,0.25);">${cta}</a>
    <p style="color:rgba(255,255,255,0.45);font-size:13px;margin:16px 0 0;">No payment required · Cancel anytime</p>
  </div>
</div>`;
}

/**
 * Post-hero: cream qualification section — "Is This Right For You?"
 * Mirrors the original page's light #fdf6f9 section that follows the gradient hero.
 */
function buildGradientProofQualificationHtml(data: GeneratedFunnelAssets, _s: SchemeColors): string {
  const font    = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const bullets = data.landingPage?.bulletPoints ?? [];
  const concept = escHtml((data.offerSummary?.challengeConcept ?? "30-Day Challenge").split(/\s+/).slice(0, 3).join(" "));

  const forItems = bullets.slice(0, 5).map(b =>
    `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;">
      <span style="color:${GP_PINK};font-weight:700;flex-shrink:0;font-size:17px;margin-top:1px;">✓</span>
      <span style="color:${GP_TEXT};font-size:15px;line-height:1.6;">${escHtml(b)}</span>
    </div>`
  ).join("");

  const notForItems = [
    "You want instant results with zero effort",
    "You're not willing to show up consistently for 30 days",
    "You're looking for a magic pill or shortcut",
    "You're not open to guidance or changing your habits",
    "You want someone else to do the work for you",
  ].map(item =>
    `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;">
      <span style="color:#ef4444;font-weight:700;flex-shrink:0;font-size:17px;margin-top:1px;">✕</span>
      <span style="color:${GP_TEXT};font-size:15px;line-height:1.6;">${item}</span>
    </div>`
  ).join("");

  return `<style>@media(max-width:640px){.gp-qual{flex-direction:column!important}}</style>
<div style="background:${GP_CREAM};padding:72px 24px;font-family:${font};">
  <div style="max-width:900px;margin:0 auto;">
    <h2 style="color:${GP_TEXT};font-size:clamp(26px,4vw,36px);font-weight:900;text-align:center;margin:0 0 10px;">Is the ${concept} right for you?</h2>
    <p style="color:#64748b;font-size:17px;text-align:center;margin:0 0 40px;">Be honest with yourself — this is for the people who are genuinely ready.</p>
    <div class="gp-qual" style="display:flex;align-items:stretch;gap:24px;">
      <div style="flex:1;background:#ffffff;border-radius:16px;padding:28px 32px;box-shadow:0 4px 24px rgba(0,0,0,0.07);border-top:4px solid ${GP_PINK};">
        <div style="color:${GP_PINK};font-size:18px;font-weight:700;margin-bottom:20px;">✓ This IS for you if...</div>
        ${forItems}
      </div>
      <div style="flex:1;background:#ffffff;border-radius:16px;padding:28px 32px;box-shadow:0 4px 24px rgba(0,0,0,0.07);border-top:4px solid #ef4444;">
        <div style="color:#ef4444;font-size:18px;font-weight:700;margin-bottom:20px;">✕ This is NOT for you if...</div>
        ${notForItems}
      </div>
    </div>
  </div>
</div>`;
}

/**
 * What's-included replacement: cream feature card grid.
 * Mirrors the original page's second cream section (bullet list + heading).
 */
function buildGradientProofFeaturesHtml(data: GeneratedFunnelAssets, _s: SchemeColors): string {
  const font    = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const bullets = data.landingPage?.bulletPoints ?? [];

  const cardHtml = bullets.slice(0, 6).map(bullet => {
    const parts  = bullet.split(" — ");
    const title  = escHtml((parts[0] ?? bullet).trim());
    const reason = escHtml((parts[1] ?? "").trim());
    return `<div style="background:#ffffff;border-radius:14px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,0.06);border-left:4px solid ${GP_PINK};">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <div style="width:32px;height:32px;border-radius:50%;background:${GP_PINK};color:#ffffff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">✓</div>
        <div style="font-weight:800;color:${GP_TEXT};font-size:16px;">${title}</div>
      </div>
      ${reason ? `<div style="color:#64748b;font-size:14px;line-height:1.6;padding-left:42px;">${reason}</div>` : ""}
    </div>`;
  }).join("");

  return `<div style="background:${GP_CREAM};padding:72px 24px;font-family:${font};">
  <div style="max-width:920px;margin:0 auto;">
    <p style="color:${GP_PINK};font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-align:center;margin:0 0 12px;">Everything included</p>
    <h2 style="color:${GP_TEXT};font-size:clamp(26px,4vw,38px);font-weight:900;text-align:center;margin:0 0 8px;">Here's Exactly What You Get</h2>
    <p style="color:#64748b;font-size:17px;text-align:center;margin:0 0 40px;">Every tool, every resource, every bit of support — all included at no cost.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;">
      ${cardHtml}
    </div>
  </div>
</div>`;
}

/**
 * Final CTA: solid hot-pink section — matches section 4 from the original JSON.
 */
function buildGradientProofCtaHtml(data: GeneratedFunnelAssets, _s: SchemeColors): string {
  const font  = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const lp    = data.landingPage;
  const cta   = escHtml(lp?.ctaText ?? "Claim My Free Spot →");
  const h2    = escHtml(lp?.headlineOptions?.[1] ?? lp?.headlineOptions?.[0] ?? "Ready to start your transformation?");
  const core  = escHtml(data.offerSummary?.corePromise ?? "Join the challenge and change your life in 30 days.");

  return `<div style="background:${GP_PINK};padding:88px 24px;font-family:${font};text-align:center;">
  <div style="max-width:720px;margin:0 auto;">
    <p style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 16px;">One last thing before you go...</p>
    <h2 style="color:#ffffff;font-size:clamp(28px,5vw,44px);font-weight:900;line-height:1.1;margin:0 0 18px;text-shadow:0 2px 16px rgba(0,0,0,0.2);">${h2}</h2>
    <p style="color:rgba(255,255,255,0.85);font-size:17px;line-height:1.65;margin:0 0 36px;max-width:560px;margin-left:auto;margin-right:auto;">${core}</p>
    <a href="#optin" style="display:inline-block;background:#ffffff;color:${GP_PINK};text-decoration:none;padding:18px 52px;border-radius:50px;font-size:18px;font-weight:800;box-shadow:0 4px 24px rgba(0,0,0,0.2);">${cta}</a>
    <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:16px 0 0;">Free to join · No credit card required</p>
  </div>
</div>`;
}

export function buildFaqHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font  = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const items = data.landingPage?.faqItems ?? [];

  const makeItem = (num: string, q: string, a: string) =>
    `<details class="faq-item" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;">
  <summary style="display:flex;gap:20px;align-items:flex-start;padding:28px 28px 28px 24px;cursor:pointer;list-style:none;">
    <div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:${s.primary};color:#ffffff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:2px;">${num}</div>
    <div style="flex:1;">
      <p style="color:#ffffff;font-size:18px;font-weight:600;margin:0;line-height:1.4;">${q}</p>
    </div>
    <span class="faq-plus"  style="flex-shrink:0;color:${s.primary};font-size:22px;font-weight:300;line-height:1;margin-top:6px;">+</span>
    <span class="faq-minus" style="flex-shrink:0;color:${s.primary};font-size:22px;font-weight:300;line-height:1;margin-top:6px;display:none;">−</span>
  </summary>
  <div style="padding:0 28px 28px 80px;">
    <p style="color:rgba(255,255,255,0.65);font-size:16px;line-height:1.7;margin:0;">${a}</p>
  </div>
</details>`;

  const itemsHtml = items.length > 0
    ? items.map((item, idx) =>
        makeItem(
          String(idx + 1).padStart(2, "0"),
          escHtml(item.question ?? ""),
          escHtml(item.answer ?? ""),
        )
      ).join("\n")
    : makeItem("01", "FAQ content will appear here.", "Your frequently asked questions will be displayed in this section once generated.");

  return `<div style="background:${s.dark};padding:80px 24px;font-family:${font};">
<style>
  details.faq-item summary::-webkit-details-marker { display:none; }
  details.faq-item summary::marker { display:none; }
  details.faq-item[open] .faq-plus  { display:none; }
  details.faq-item[open] .faq-minus { display:flex !important; }
</style>
<div style="max-width:820px;margin:0 auto;">
  <p style="color:${s.primary};font-size:12px;font-weight:700;letter-spacing:4px;text-transform:uppercase;text-align:center;margin:0 0 16px;">COMMON QUESTIONS</p>
  <h2 style="color:#ffffff;font-size:clamp(28px,4vw,40px);font-weight:800;text-align:center;margin:0 0 48px;line-height:1.2;">Frequently Asked Questions</h2>
  <div style="display:flex;flex-direction:column;gap:16px;">
  ${itemsHtml}
  </div>
</div>
</div>`;
}

// ── Template 16: local-demographic audience banner ───────────────────────────
function buildAudienceBannerHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  // Strip common lead-in phrases so we don't produce "Designed specifically for This is for..."
  const rawTarget = data.offerSummary?.targetAudienceSummary ?? "";
  const strippedTarget = rawTarget
    .replace(/^(this (challenge |programme |program )?is (designed )?for[:\s]+)/i, "")
    .replace(/^(designed for[:\s]+)/i, "")
    .replace(/^(for[:\s]+)/i, "");
  const audience = escHtml(strippedTarget.split(/\s+/).slice(0, 8).join(" "));
  // Use the full corePromise as a short outcome statement (first sentence, ≤60 chars)
  const rawPromise = data.offerSummary?.corePromise ?? "";
  const promise = escHtml(rawPromise.split(/[.!?]/)[0].trim().slice(0, 60));
  return `<div style="background:linear-gradient(90deg,${s.primary} 0%,${s.accent} 100%);padding:14px 24px;text-align:center;font-family:${font};box-shadow:0 2px 8px ${s.primary}66;"><span style="color:#ffffff;font-size:15px;font-weight:600;letter-spacing:0.5px;">📍 Designed specifically for ${audience} — ${promise}</span></div>`;
}

// ── Template 17: free-value-first value stack ─────────────────────────────────
function buildValueStackHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const bg = s.alt || "#f8fafc";
  const conceptFirst3 = escHtml((data.offerSummary?.challengeConcept ?? "30-Day Challenge").split(/\s+/).slice(0, 3).join(" "));
  const items = [
    { num: "01", title: `The ${conceptFirst3} Programme`, desc: "Daily structured workouts + accountability", value: "$97" },
    { num: "02", title: "Nutrition Blueprint", desc: "Meal planning framework tailored to your lifestyle", value: "$47" },
    { num: "03", title: "Private Community Access", desc: "Support from coaches + challenge community", value: "$37" },
    { num: "04", title: "30-Day Action Calendar", desc: "Day-by-day plan so you never guess what's next", value: "$27" },
  ];
  const stackHtml = items.map(item => `<div style="display:flex;align-items:center;gap:20px;padding:20px;background:#ffffff;border-radius:12px;margin-bottom:16px;box-shadow:${SHADOW_XL};border:1px solid rgba(0,0,0,0.04);"><div style="flex-shrink:0;width:48px;height:48px;background:${s.primary};border-radius:8px;color:#ffffff;font-size:17px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px ${s.primary}44;">${item.num}</div><div style="flex:1;"><div style="font-weight:700;color:#0f172a;font-size:17px;">${item.title}</div><div style="color:#64748b;font-size:14px;margin-top:2px;">${item.desc}</div></div><div style="flex-shrink:0;color:#94a3b8;font-size:14px;text-decoration:line-through;">(${item.value} value)</div></div>`).join("");
  return `<div style="background:${bg};padding:64px 24px;font-family:${font};"><div style="max-width:680px;margin:0 auto;"><h2 style="color:#0f172a;font-size:clamp(24px,3.5vw,32px);font-weight:900;text-align:center;margin:0 0 40px;">Here's everything you get — completely free:</h2>${stackHtml}<div style="background:${s.primary}15;border-radius:12px;padding:16px;text-align:center;margin-top:8px;"><p style="color:${s.primary};font-weight:700;font-size:18px;margin:0;">Total value: $208+ — Yours today when you join</p></div></div></div>`;
}

// ── Template 18: application-style hero ──────────────────────────────────────
function buildApplicationHeroHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const lp = data.landingPage;
  const h1Text = escHtml(lp?.headlineOptions?.[1] ?? lp?.headlineOptions?.[0] ?? "Join the 30-Day Challenge");
  const targetFirst = escHtml((data.offerSummary?.targetAudienceSummary ?? "").split(/[.!?]/)[0].trim());
  const reqs = [
    "You're committed to showing up every single day for 30 days",
    "You're ready to follow a structured program (not wing it)",
    targetFirst || "You're serious about achieving real, lasting results",
    "You understand that real results take real effort — and you're ready",
  ].map(r => `<li style="color:#ffffff;font-size:16px;line-height:1.8;list-style:none;display:flex;gap:12px;"><span style="color:${s.primary};font-weight:700;flex-shrink:0;">→</span><span>${escHtml(r)}</span></li>`).join("");
  return `<div style="background:${s.dark};background-image:${DOT_BG};min-height:80vh;display:flex;align-items:center;padding:80px 24px;font-family:${font};box-sizing:border-box;"><div style="max-width:860px;margin:0 auto;width:100%;"><p style="color:${s.primary};font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 20px;">⬡ EXCLUSIVE APPLICATION — LIMITED TO 20 SPOTS</p><h1 style="color:#ffffff;font-size:clamp(30px,5vw,50px);font-weight:900;line-height:1.1;margin:0 0 16px;text-shadow:0 2px 32px rgba(0,0,0,0.4);">${h1Text}</h1><p style="color:rgba(255,255,255,0.75);font-size:17px;margin:0 0 32px;">This isn't for everyone. Here's who we're looking for:</p><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;margin-bottom:36px;"><ul style="padding:0;margin:0;">${reqs}</ul></div><a href="#optin" style="display:inline-block;background:${s.primary};color:#ffffff;text-decoration:none;padding:18px 44px;border-radius:${s.buttonBorderRadius};font-size:17px;font-weight:700;${glowStyle(s.primary)}">Submit Your Application →</a><p style="color:rgba(255,255,255,0.45);font-size:13px;margin:12px 0 0;">No payment required. We'll review and confirm your spot.</p></div></div>`;
}

// ── Template 19: story-journey milestone timeline ─────────────────────────────
function buildJourneyTimelineHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const corePromiseShort = escHtml((data.offerSummary?.corePromise ?? "Real results you can see and feel.").split(/\s+/).slice(0, 8).join(" "));
  const milestones = [
    { day: "Day 1", title: "Your Foundation", desc: "Get set up, meet your accountability crew, make your commitment" },
    { day: "Day 7", title: "Building Momentum", desc: "First visible changes. Energy up. Routine locked in." },
    { day: "Day 14", title: "Breaking Through", desc: "Halfway mark. Most people quit here. You won't." },
    { day: "Day 30", title: "Your Transformation", desc: corePromiseShort },
  ];
  const sep = `<div style="flex-shrink:0;width:40px;height:2px;background:rgba(255,255,255,0.15);align-self:flex-start;margin-top:32px;"></div>`;
  const nodes = milestones.map(m => `<div style="text-align:center;flex:1;min-width:130px;"><div style="width:64px;height:64px;border-radius:50%;border:2px solid ${s.primary};background:${s.dark};color:#ffffff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;box-shadow:0 0 20px ${s.primary}55;">${m.day}</div><div style="color:#ffffff;font-size:16px;font-weight:700;margin-bottom:6px;letter-spacing:-0.5px;">${m.title}</div><div style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.5;">${m.desc}</div></div>`).join(sep);
  return `<div style="background:${s.mid};background-image:${DOT_BG};padding:72px 24px;font-family:${font};"><h2 style="color:#ffffff;font-size:clamp(28px,4vw,38px);font-weight:900;text-align:center;margin:0 0 56px;letter-spacing:-0.5px;">What Happens When You Join</h2><div style="max-width:900px;margin:0 auto;display:flex;align-items:flex-start;flex-wrap:wrap;justify-content:center;gap:16px;">${nodes}</div></div>`;
}

// ── Template 20: results-first stat-led hero ──────────────────────────────────
function buildResultsHeroHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const lp = data.landingPage;
  const headline = escHtml(lp?.headlineOptions?.[0] ?? "Transform Your Body in 30 Days");
  const subheadline = escHtml(lp?.subheadline ?? "");
  const ctaText = escHtml(lp?.ctaText ?? "Claim Your Spot");
  const conceptFirst4 = escHtml((data.offerSummary?.challengeConcept ?? "our 30-day challenge").split(/\s+/).slice(0, 4).join(" "));
  return `<div style="background:${s.dark};background-image:${DOT_BG};font-family:${font};"><div style="background:linear-gradient(135deg,${s.primary} 0%,${s.accent} 100%);padding:20px 24px;text-align:center;"><div style="color:#ffffff;font-size:clamp(24px,4vw,38px);font-weight:900;">Over 2,400 lbs Lost by Our Community</div><div style="color:rgba(255,255,255,0.85);font-size:16px;margin-top:6px;">...and ${conceptFirst4} is how they did it</div></div><div style="padding:60px 24px;text-align:center;max-width:860px;margin:0 auto;"><h1 style="font-size:clamp(32px,5vw,52px);font-weight:900;line-height:1.1;margin:0 0 20px;"><span style="${gradientText("#ffffff", "rgba(255,255,255,0.8)") }">${headline}</span></h1><p style="color:rgba(255,255,255,0.82);font-size:18px;margin:0 0 36px;line-height:1.6;">${subheadline}</p><div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px 32px;max-width:560px;margin:0 auto 36px;box-shadow:${SHADOW_XL};"><span style="color:${s.primary};font-size:48px;line-height:0.5;display:block;">"</span><p style="color:#ffffff;font-size:17px;font-style:italic;line-height:1.7;margin:0 0 12px;">I lost 16 lbs in my first 30 days and finally feel confident in my own skin.</p><span style="color:rgba(255,255,255,0.55);font-size:14px;">— Jessica M., challenge participant</span></div><a href="#optin" style="display:block;max-width:400px;margin:0 auto;background:${s.primary};color:#ffffff;text-decoration:none;padding:18px 44px;border-radius:${s.buttonBorderRadius};font-size:17px;font-weight:700;text-align:center;${glowStyle(s.primary)}">${ctaText}</a></div></div>`;
}

// ── Template 20 social proof: gradient stat banner ───────────────────────────
// Replaces the dark-background centered-stat section with a vivid gradient strip
// so there is clear visual separation between the hero and the next section.
function buildResultsStatBannerHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const memberCount = data.clientCount ? escHtml(data.clientCount) : "500+";
  return `<div style="background:linear-gradient(90deg,${s.primary} 0%,${s.accent} 100%);padding:48px 24px;text-align:center;font-family:${font};box-shadow:0 4px 24px ${s.primary}55;"><div style="color:#ffffff;font-size:clamp(48px,8vw,80px);font-weight:900;line-height:1;letter-spacing:-2px;text-shadow:0 2px 16px rgba(0,0,0,0.2);">${memberCount}</div><div style="color:rgba(255,255,255,0.9);font-size:17px;font-weight:500;margin-top:10px;letter-spacing:0.3px;">people have completed this challenge — free to join</div></div>`;
}

// ── Template 11: vsl-focused "What You'll Discover" strip ───────────────────
function buildVslDiscoverHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  // Use the first 3 benefit bullet points (format: "Benefit — Reason why it matters")
  const bullets = data.landingPage?.bulletPoints ?? [];
  const cols = [0, 1, 2].map((i, idx) => {
    const parts = (bullets[i] ?? "").split(" — ");
    const heading = escHtml((parts[0] ?? bullets[i] ?? `Key Benefit ${i + 1}`).trim());
    const body    = escHtml((parts[1] ?? "").trim());
    const num     = String(idx + 1).padStart(2, "0");
    return `<div style="flex:1;min-width:220px;text-align:center;padding:0 24px;${idx < 2 ? `border-right:1px solid rgba(255,255,255,0.08);` : ""}"><div style="color:${s.primary};font-size:14px;font-weight:700;letter-spacing:1px;margin-bottom:8px;">${num}</div><div style="color:#ffffff;font-size:17px;font-weight:600;margin-bottom:10px;line-height:1.4;">${heading}</div>${body ? `<div style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.6;">${body}</div>` : ""}</div>`;
  }).join("");
  return `<div style="background:${s.dark};padding:48px 24px;border-top:3px solid ${s.primary};font-family:${font};"><h3 style="color:#ffffff;font-size:22px;font-weight:700;text-align:center;margin:0 0 28px;">What you'll discover inside:</h3><div style="max-width:900px;margin:0 auto;display:flex;flex-wrap:wrap;gap:0;">${cols}</div></div>`;
}

// ── Template 12: transformation-wall results card grid ───────────────────────
function buildTransformationWallHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const bg = s.alt || "#f8fafc";
  const results = [
    { name: "Jamie L.", loc: "Austin, TX", badge: "Lost 14 lbs in 28 days", quote: "I finally broke through the plateau I'd been stuck at for two years. This program changed everything." },
    { name: "Priya S.", loc: "London, UK", badge: "Dropped 2 dress sizes", quote: "The structure and daily check-ins kept me accountable in ways I never managed on my own." },
    { name: "Marcus T.", loc: "Chicago, IL", badge: "Lost 22 lbs", quote: "I was sceptical, but the results after just 30 days silenced every doubt I had." },
    { name: "Emma R.", loc: "Sydney, AU", badge: "Gained visible muscle", quote: "I went from not being able to do a single push-up to feeling genuinely strong for the first time." },
    { name: "Linda K.", loc: "Toronto, CA", badge: "Lost 18 lbs + kept it off", quote: "Six months later and I've kept every pound off. This wasn't a diet — it was a lifestyle shift." },
    { name: "Tasha M.", loc: "Miami, FL", badge: "Went from size 16 → 10", quote: "My confidence is completely transformed. I walk differently. I show up differently." },
  ];
  const cardHtml = results.map(r => `<div style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:${SHADOW_XL};"><div style="height:6px;background:linear-gradient(90deg,${s.primary},${s.accent});"></div><div style="padding:20px;"><div style="font-weight:700;font-size:15px;color:#0f172a;">${r.name}</div><div style="font-size:13px;color:#94a3b8;margin-bottom:8px;">${r.loc}</div><div style="display:inline-block;background:linear-gradient(135deg,${s.primary},${s.accent});color:#ffffff;border-radius:999px;padding:4px 12px;font-size:13px;font-weight:600;margin-bottom:10px;box-shadow:0 2px 8px ${s.primary}44;">${r.badge}</div><p style="color:#475569;font-size:14px;line-height:1.6;font-style:italic;margin:0;">"${r.quote}"</p></div></div>`).join("");
  return `<div style="background:${bg};padding:64px 24px;font-family:${font};"><div style="text-align:center;margin-bottom:40px;"><h2 style="color:#0f172a;font-size:clamp(28px,4vw,36px);font-weight:900;margin:0 0 10px;">The Results Speak for Themselves</h2><p style="color:#64748b;font-size:16px;margin:0;">Real clients. Real results. No photoshop.</p></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;max-width:960px;margin:0 auto;">${cardHtml}</div></div>`;
}

// ── Template 13: is-this-for-you qualification split ─────────────────────────
function buildIsThisForYouHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const bg = s.alt || "#f8fafc";
  const bullets = data.landingPage?.bulletPoints ?? [];
  const conceptWords = escHtml((data.offerSummary?.challengeConcept ?? "30-Day Challenge").split(/\s+/).slice(0, 3).join(" "));
  const forItems = bullets.slice(0, 5).map(b => `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;"><span style="color:${s.primary};font-weight:700;flex-shrink:0;margin-top:1px;">✓</span><span style="color:#1e293b;font-size:15px;line-height:1.6;">${escHtml(b)}</span></div>`).join("");
  const notForItems = [
    "You're not ready to commit 30 days",
    "You want instant results with no effort",
    "You're not open to changing your habits",
    "You're looking for a magic pill or shortcut",
    "You're not willing to track your progress",
    "You want someone else to do the work for you",
  ].map(item => `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;"><span style="color:#ef4444;font-weight:700;flex-shrink:0;margin-top:1px;">✕</span><span style="color:#374151;font-size:15px;line-height:1.6;">${item}</span></div>`).join("");
  return `<style>@media(max-width:640px){.itfy-grid{flex-direction:column!important}}</style><div style="background:${s.mid};background-image:${DOT_BG};padding:56px 24px;font-family:${font};"><div style="max-width:900px;margin:0 auto;"><h2 style="color:#ffffff;font-size:clamp(24px,3.5vw,32px);font-weight:800;text-align:center;margin:0 0 36px;">Is the ${conceptWords} right for you?</h2><div class="itfy-grid" style="display:flex;align-items:stretch;gap:24px;"><div style="flex:1;background:${bg};border-radius:16px;padding:28px;box-shadow:${SHADOW_XL};border-top:3px solid ${s.primary};"><div style="color:${s.primary};font-size:18px;font-weight:700;margin-bottom:20px;">✓ This IS for you if...</div>${forItems}</div><div style="flex:1;background:#ffffff;border-radius:16px;padding:28px;box-shadow:${SHADOW_XL};border-top:3px solid #ef4444;"><div style="color:#ef4444;font-size:18px;font-weight:700;margin-bottom:20px;">✕ This is NOT for you if...</div>${notForItems}</div></div></div></div>`;
}

// ── Template 14: event-agenda journey timeline ────────────────────────────────
function buildEventAgendaHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const corePromiseShort = escHtml((data.offerSummary?.corePromise ?? "Real results you can see and feel.").split(/\s+/).slice(0, 8).join(" "));
  const milestones = [
    { dayLabel: "Day 1",  title: "Your Foundation",    desc: "Get set up, meet your accountability crew, make your commitment." },
    { dayLabel: "Week 1", title: "Building Momentum",  desc: "First visible changes — energy up and routine locked in." },
    { dayLabel: "Week 2", title: "Breaking Through",   desc: "Halfway mark. Most people quit here. You won't." },
    { dayLabel: "Day 30", title: "Your Transformation", desc: corePromiseShort },
  ];
  const steps = milestones.map((m, i) => `<div style="display:flex;align-items:flex-start;gap:24px;margin-bottom:${i < 3 ? "40px" : "0"};"><div style="flex-shrink:0;width:48px;height:48px;border-radius:50%;background:${s.primary};color:#ffffff;font-size:14px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px ${s.primary}55;">${i + 1}</div><div><div style="color:${s.primary};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:4px;">${m.dayLabel}</div><div style="color:#ffffff;font-size:20px;font-weight:700;margin-bottom:6px;letter-spacing:-0.5px;">${m.title}</div><div style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.7;">${m.desc}</div></div></div>`).join("");
  return `<div style="background:${s.dark};background-image:${DOT_BG};padding:72px 24px;font-family:${font};"><div style="max-width:700px;margin:0 auto;"><h2 style="color:#ffffff;font-size:clamp(28px,4vw,36px);font-weight:900;text-align:center;margin:0 0 48px;letter-spacing:-0.5px;">Your 30-Day Journey, Step by Step</h2>${steps}</div></div>`;
}

// ── Template 15: executive-clean "Why This Works" grid ───────────────────────
function buildWhyThisWorksHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const positioning = escHtml((data.offerSummary?.offerPositioning ?? "").split(/\s+/).slice(0, 20).join(" ")) + "...";
  const cols = [
    { icon: "🎯", title: "Proven System", body: "A structured 30-day framework built around daily actions that compound. No guesswork — just a clear path from where you are to where you want to be." },
    { icon: "📊", title: "Measurable Results", body: "Every milestone is trackable. You'll know exactly what progress looks like at Day 7, Day 14, and Day 30 — no vague promises." },
    { icon: "🔄", title: "Built to Last", body: "The habits you build in 30 days become the foundation for the results you keep for life. This is a reset, not a quick fix." },
  ].map(col => `<div style="text-align:center;padding:24px;"><div style="width:64px;height:64px;border-radius:50%;background:${s.primary};font-size:28px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 0 24px ${s.primary}44;">${col.icon}</div><div style="color:#0f172a;font-size:20px;font-weight:700;margin-bottom:10px;">${col.title}</div><div style="color:#64748b;font-size:15px;line-height:1.7;">${col.body}</div></div>`).join("");
  return `<div style="background:#ffffff;padding:72px 24px;border-top:4px solid ${s.primary};border-bottom:1px solid #e2e8f0;font-family:${font};"><div style="max-width:900px;margin:0 auto;text-align:center;"><h2 style="color:#0f172a;font-size:clamp(28px,4vw,36px);font-weight:900;margin:0 0 12px;">Why This Method Actually Works</h2><p style="color:#64748b;font-size:18px;max-width:620px;margin:0 auto 48px;line-height:1.6;">${positioning}</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:32px;">${cols}</div></div></div>`;
}

// ── Template 4: transformation-split hero ────────────────────────────────────
function buildTransformationSplitHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const lp   = data.landingPage;
  const bullets = lp?.bulletPoints ?? [];
  const corePromise = escHtml(data.offerSummary?.corePromise ?? "Transform your body in 30 days");
  const headline = escHtml(lp?.headlineOptions?.[1] ?? lp?.headlineOptions?.[0] ?? "Ready to finally make the change?");
  const subheadline = escHtml(lp?.subheadline ?? "");
  const ctaText = escHtml(lp?.ctaText ?? "Claim My Free Spot →");
  const painItems = bullets.slice(0, 3).map(b => `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;"><span style="color:${s.primary};font-size:18px;line-height:1.3;flex-shrink:0;text-shadow:0 0 8px ${s.primary};">◆</span><span style="color:rgba(255,255,255,0.88);font-size:15px;line-height:1.6;">${escHtml(b)}</span></div>`).join("") || `<div style="color:rgba(255,255,255,0.7);font-size:15px;">You're stuck in the same cycle</div>`;
  const gainItems = bullets.slice(3, 6).map(b => `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;"><span style="color:${s.dark};font-size:20px;line-height:1.2;flex-shrink:0;">✓</span><span style="color:${s.dark};font-size:15px;line-height:1.6;font-weight:500;">${escHtml(b)}</span></div>`).join("") || `<div style="color:${s.dark};font-size:15px;">Real, lasting transformation awaits</div>`;
  return `<style>@media(max-width:640px){.ts-split{flex-direction:column!important}.ts-panel{min-height:280px!important}}</style>
<div style="background:${s.dark};background-image:${DOT_BG};padding:64px 24px 48px;font-family:${font};text-align:center;">
  <h1 style="color:#ffffff;font-size:clamp(28px,4vw,50px);font-weight:900;line-height:1.1;margin:0 auto 16px;max-width:780px;letter-spacing:-1px;text-shadow:0 2px 32px rgba(0,0,0,0.4);">${headline}</h1>
  ${subheadline ? `<p style="color:rgba(255,255,255,0.7);font-size:18px;line-height:1.6;margin:0 auto 28px;max-width:600px;">${subheadline}</p>` : ""}
  <a href="#optin" style="display:inline-block;background:${s.primary};color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:${s.buttonBorderRadius};font-size:16px;font-weight:700;margin-bottom:8px;${glowStyle(s.primary)};">${ctaText}</a>
</div>
<div class="ts-split" style="display:flex;min-height:60vh;font-family:${font};"><div class="ts-panel" style="flex:1;background:${s.dark};background-image:${DOT_BG};padding:56px 40px;display:flex;flex-direction:column;justify-content:center;"><p style="color:${s.primary};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 20px;">Where you are now</p><h2 style="color:#ffffff;font-size:clamp(24px,3vw,34px);font-weight:900;margin:0 0 28px;line-height:1.2;letter-spacing:-1px;text-shadow:0 2px 16px rgba(0,0,0,0.3);">Are you stuck here?</h2>${painItems}</div><div class="ts-panel" style="flex:1;background:${s.primary};padding:56px 40px;display:flex;flex-direction:column;justify-content:center;"><p style="color:${s.dark};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 20px;opacity:0.7;">Where you could be</p><h2 style="color:${s.dark};font-size:clamp(24px,3vw,34px);font-weight:900;margin:0 0 28px;line-height:1.2;letter-spacing:-1px;text-shadow:0 2px 16px rgba(0,0,0,0.3);">Imagine this instead</h2>${gainItems}</div></div>
<div style="background:${s.dark};padding:24px;text-align:center;font-family:${font};box-shadow:inset 0 1px 0 rgba(255,255,255,0.08);"><p style="color:rgba(255,255,255,0.9);font-size:20px;font-style:italic;margin:0;">${corePromise}</p></div>`;
}

// ── Template 5: authority-builder credentials strip ──────────────────────────
function buildCredentialsStripHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const clientCount   = data.clientCount   ? escHtml(data.clientCount) + " Clients Transformed" : "1,000+ Clients Transformed";
  const yearsCoaching = data.yearsCoaching ? escHtml(data.yearsCoaching) + " Years Coaching"     : null;
  const pills = [
    "Certified Fitness Coach",
    clientCount,
    "30-Day Method Creator",
    yearsCoaching ?? "Featured in Forbes Health",
  ];
  const pillsHtml = pills.map(p => `<div style="border:1px solid rgba(255,255,255,0.2);border-radius:999px;padding:10px 20px;color:#ffffff;font-size:14px;font-weight:500;white-space:nowrap;box-shadow:${SHADOW_SM};background:rgba(255,255,255,0.04);"><span style="color:${s.primary};margin-right:6px;">✓</span>${p}</div>`).join("");
  return `<div style="background:linear-gradient(135deg,${s.mid} 0%,${s.dark} 100%);padding:32px 24px;font-family:${font};"><div style="max-width:1000px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;">${pillsHtml}</div></div>`;
}

// ── Template 7: bold-impact hero ─────────────────────────────────────────────
function buildBoldImpactHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const lp = data.landingPage;
  const subheadline = escHtml(lp?.subheadline ?? "");
  const rawCta = lp?.ctaText ?? "Claim Your Spot";
  const ctaText = escHtml(rawCta);

  // Pick a short punchy phrase from the CTA (already curated, action-oriented, ≤5 words)
  // Strip arrow/icon characters then take up to 3 words
  const ctaClean = rawCta.replace(/[→←»«•>]/g, "").trim();
  const ctaWords = ctaClean.split(/\s+/);
  const FILLER = new Set(["my", "your", "a", "an", "the", "to", "for", "in", "and", "or"]);
  // Take first 1-3 non-filler words — gives "Claim", "Join Now", "Start Your Journey" etc.
  const displayWords = ctaWords.filter(w => !FILLER.has(w.toLowerCase())).slice(0, 3);
  const displayText = escHtml((displayWords.length ? displayWords : ctaWords.slice(0, 3)).join(" ").toUpperCase());

  return `<div style="background:${s.dark};background-image:${DOT_BG};padding:120px 24px;font-family:${font};text-align:center;box-sizing:border-box;"><div style="max-width:900px;margin:0 auto;"><div style="font-size:clamp(56px,10vw,108px);font-weight:900;letter-spacing:-4px;line-height:0.9;margin:0 0 32px;"><span style="${gradientText("#ffffff", "rgba(255,255,255,0.6)") }">${displayText}</span></div><div style="width:80px;height:4px;background:linear-gradient(90deg,transparent,${s.primary},transparent);margin:0 auto 32px;"></div><p style="color:rgba(255,255,255,0.7);font-size:20px;max-width:560px;margin:0 auto 40px;line-height:1.6;">${subheadline}</p><a href="#optin" style="display:inline-block;background:${s.primary};color:#ffffff;text-decoration:none;padding:18px 48px;border-radius:${s.buttonBorderRadius};font-size:17px;font-weight:700;font-family:${font};${glowStyle(s.primary)}">${ctaText}</a></div></div>`;
}

// ── Template 8: community-proof stats bar ────────────────────────────────────
function buildCommunityStatsHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const memberCount = data.clientCount ? escHtml(data.clientCount) : "2,847";
  const statsBase = [
    { n: memberCount, l: "Active Members" },
    { n: "17",        l: "Countries" },
    { n: "94%",       l: "Complete 30 Days" },
    { n: "4.9★",      l: "Average Rating" },
  ];
  const stats = data.yearsCoaching
    ? [...statsBase, { n: escHtml(data.yearsCoaching) + " Yrs", l: "Experience" }]
    : statsBase;
  const statsHtml = stats.map((st, i) => `<div style="text-align:center;padding:24px 32px;${i < stats.length - 1 ? `border-right:1px solid rgba(255,255,255,0.1);` : ""}"><div style="color:${s.primary};font-size:42px;font-weight:900;line-height:1;text-shadow:0 0 32px ${s.primary}66;">${st.n}</div><div style="color:rgba(255,255,255,0.6);font-size:13px;margin-top:6px;letter-spacing:0.5px;">${st.l}</div></div>`).join("");
  return `<div style="background:linear-gradient(180deg,${s.mid} 0%,${s.dark} 100%);padding:40px 24px;font-family:${font};"><div style="max-width:900px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:center;">${statsHtml}</div></div>`;
}

// ── Template 9: video-authority feature strip ─────────────────────────────────
function buildFeatureStripHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const bg = s.alt || "#f8fafc";
  const bullets = data.landingPage?.bulletPoints ?? [];
  const cardHtml = bullets.slice(0, 6).map(bullet => {
    const parts = bullet.split(" — ");
    const title = escHtml((parts[0] ?? bullet).trim());
    const reason = escHtml((parts[1] ?? "").trim());
    return `<div style="background:#ffffff;border-radius:12px;padding:24px;box-shadow:${SHADOW_XL};border:1px solid rgba(0,0,0,0.04);"><div style="width:36px;height:36px;border-radius:50%;background:${s.primary};color:#ffffff;font-size:16px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;box-shadow:0 0 16px ${s.primary}44;">✓</div><div style="font-weight:800;color:${s.dark};font-size:16px;margin-bottom:6px;">${title}</div>${reason ? `<div style="color:#64748b;font-size:14px;line-height:1.6;">${reason}</div>` : ""}</div>`;
  }).join("");
  return `<div style="background:${bg};padding:48px 24px;font-family:${font};"><div style="max-width:900px;margin:0 auto;"><h2 style="color:${s.dark};font-size:28px;font-weight:800;text-align:center;margin:0 0 32px;">Everything you get:</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">${cardHtml}</div></div></div>`;
}

// ── Template 10: minimalist-elite hero ───────────────────────────────────────
function buildMinimalistEliteHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const lp = data.landingPage;
  const subheadline = escHtml(lp?.subheadline ?? "");
  const rawCta = lp?.ctaText ?? "Claim Your Spot";
  const ctaText = escHtml(rawCta);

  // Use first non-trivial word from CTA text (it's short, curated, action-oriented)
  const CTA_STOP = new Set(["my", "your", "a", "an", "the", "to", "for", "in", "and", "or", "free", "now", "today"]);
  const ctaWords = rawCta.replace(/[→←»«•>]/g, "").trim().split(/\s+/);
  const mainWord = ctaWords.find(w => w.length >= 4 && !CTA_STOP.has(w.toLowerCase()))
    ?? ctaWords[0]
    ?? "Transform";
  const mainWordEsc = escHtml(mainWord.replace(/[^a-zA-Z]/g, "").toUpperCase());
  const fontSize = mainWord.length > 10 ? "72px" : "96px";

  // Strip AI lead-in phrases from targetAudienceSummary before using as program label
  const rawTarget = data.offerSummary?.targetAudienceSummary ?? "";
  const cleanTarget = rawTarget
    .replace(/^(this (challenge |program |is )?is (designed |built |made |perfect |ideal )?(specifically |especially )?for|designed (specifically |especially )?for|built for|made for|perfect for|ideal for|specifically for|for)\s+/i, "")
    .trim();
  const targetWords = cleanTarget.split(/\s+/).slice(0, 4).join(" ").toUpperCase();
  const programLabel = escHtml(targetWords || "30-DAY CHALLENGE") + " PROGRAM";

  return `<div style="background:${s.dark};background-image:${DOT_BG};padding:100px 24px;font-family:${font};text-align:center;box-sizing:border-box;"><p style="color:${s.primary};font-size:12px;letter-spacing:4px;text-transform:uppercase;font-weight:600;margin:0 0 48px;">${programLabel}</p><div style="font-size:${fontSize};font-weight:900;letter-spacing:-6px;line-height:0.9;margin:0 0 24px;"><span style="${gradientText("#ffffff", "rgba(255,255,255,0.5)") }">${mainWordEsc}</span></div><div style="width:60px;height:3px;background:${s.primary};margin:0 auto 32px;"></div><p style="color:rgba(255,255,255,0.55);font-size:17px;max-width:500px;margin:0 auto 48px;line-height:1.8;">${subheadline}</p><a href="#optin" style="display:inline-block;border:2px solid ${s.primary};color:${s.primary};background:transparent;text-decoration:none;padding:16px 44px;border-radius:${s.buttonBorderRadius};font-size:16px;font-weight:600;box-shadow:0 0 24px ${s.primary}33;">${ctaText}</a></div>`;
}

// ── Template 6: urgency-driven banner strip ──────────────────────────────────
function buildUrgencyBannerHtml(data: GeneratedFunnelAssets, s: SchemeColors): string {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const urgencyText = escHtml((data.landingPage?.urgencyIdeas ?? [])[0] ?? "Limited spots available — registration closes soon");
  const ctaText = escHtml(data.landingPage?.ctaText ?? "Claim Your Spot →");
  // Unique suffix per call so multiple instances don't collide
  const uid = Math.random().toString(36).slice(2, 8);
  return `<div style="background:linear-gradient(135deg,${s.dark} 0%,${s.mid} 40%,${s.primary} 100%);padding:48px 24px;font-family:${font};text-align:center;box-shadow:0 4px 16px ${s.primary}66;">
  <p style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;">⚡ Registration Closes In</p>
  <div id="ub-countdown-${uid}" style="display:flex;justify-content:center;align-items:flex-end;gap:12px;margin:0 0 20px;">
    <div style="text-align:center;"><div id="ub-days-${uid}" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:12px;color:#ffffff;font-size:clamp(40px,8vw,80px);font-weight:900;line-height:1;padding:16px 24px;min-width:90px;">07</div><div style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-top:8px;">Days</div></div>
    <div style="color:#ffffff;font-size:clamp(32px,6vw,64px);font-weight:900;line-height:1;padding-bottom:24px;">:</div>
    <div style="text-align:center;"><div id="ub-hours-${uid}" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:12px;color:#ffffff;font-size:clamp(40px,8vw,80px);font-weight:900;line-height:1;padding:16px 24px;min-width:90px;">00</div><div style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-top:8px;">Hours</div></div>
    <div style="color:#ffffff;font-size:clamp(32px,6vw,64px);font-weight:900;line-height:1;padding-bottom:24px;">:</div>
    <div style="text-align:center;"><div id="ub-mins-${uid}" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:12px;color:#ffffff;font-size:clamp(40px,8vw,80px);font-weight:900;line-height:1;padding:16px 24px;min-width:90px;">00</div><div style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-top:8px;">Mins</div></div>
    <div style="color:#ffffff;font-size:clamp(32px,6vw,64px);font-weight:900;line-height:1;padding-bottom:24px;">:</div>
    <div style="text-align:center;"><div id="ub-secs-${uid}" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:12px;color:#ffffff;font-size:clamp(40px,8vw,80px);font-weight:900;line-height:1;padding:16px 24px;min-width:90px;">00</div><div style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-top:8px;">Secs</div></div>
  </div>
  <p style="color:rgba(255,255,255,0.75);font-size:15px;font-weight:500;margin:0 0 24px;max-width:560px;margin-left:auto;margin-right:auto;">⚡ ${urgencyText}</p>
  <a href="#optin" style="display:inline-block;background:#ffffff;color:${s.primary};text-decoration:none;padding:16px 44px;border-radius:50px;font-size:17px;font-weight:800;letter-spacing:0.3px;">${ctaText}</a>
  <script>
  (function(){
    var key='ub_deadline_${uid}';
    var stored=localStorage.getItem(key);
    var deadline;
    if(stored){deadline=parseInt(stored,10);}
    else{deadline=Date.now()+7*24*60*60*1000;localStorage.setItem(key,deadline);}
    function pad(n){return n<10?'0'+n:String(n);}
    function tick(){
      var diff=Math.max(0,deadline-Date.now());
      var d=Math.floor(diff/86400000);
      var h=Math.floor((diff%86400000)/3600000);
      var m=Math.floor((diff%3600000)/60000);
      var s=Math.floor((diff%60000)/1000);
      var el=function(id){return document.getElementById(id);};
      if(el('ub-days-${uid}')) el('ub-days-${uid}').textContent=pad(d);
      if(el('ub-hours-${uid}')) el('ub-hours-${uid}').textContent=pad(h);
      if(el('ub-mins-${uid}')) el('ub-mins-${uid}').textContent=pad(m);
      if(el('ub-secs-${uid}')) el('ub-secs-${uid}').textContent=pad(s);
      if(diff>0)setTimeout(tick,1000);
    }
    tick();
  })();
  </script>
</div>`;
}

export function buildLandingPageData(data: GeneratedFunnelAssets, templateVariant?: TemplateVariant): GhlPageData {
  if (!data?.landingPage)   throw new Error("landingPage is required");
  if (!data?.offerSummary)  throw new Error("offerSummary is required");
  console.log("[design] applied design:", data.design);
  const b = createBuilder();
  const s = resolveScheme(data);
  const lp = data.landingPage;
  // Derive a short badge label from corePromise (8 words / ≤50 chars).
  // corePromise is a terse outcome statement — safe for badges and hero labels.
  const badgeLabel = (data.offerSummary.corePromise ?? "Free Challenge")
    .split(" ").slice(0, 8).join(" ").slice(0, 50);
  // Top-level sectionLayoutVariants (new prompt) takes priority;
  // fall back to landingPage.sectionLayoutVariants for backward compat with old records.
  const slv = data.sectionLayoutVariants ?? lp.sectionLayoutVariants ?? {};

  // ── Template variant ─────────────────────────────────────────────────────────
  // Caller may pass a pre-selected variant (so the API route can log & surface it).
  // If not provided, fall back to picking from the weighted pool.
  const resolvedVariant: TemplateVariant = templateVariant ?? pickTemplateVariant();
  console.log(`[template-variant] selected: ${resolvedVariant}`);

  console.log("[diag] sectionLayoutVariants:", JSON.stringify(slv));

  const countBefore = (label: string) => ({ label, before: b.sections.length });
  const countAfter  = (snap: { label: string; before: number }, variant: string) => {
    const added = b.sections.length - snap.before;
    console.log(`[diag] dispatch:${snap.label} variant="${variant}" added=${added} section(s)`);
  };

  // snap is reused throughout for countBefore/countAfter diagnostics
  // ── Variant lookup tables ─────────────────────────────────────────────────────
  const FORCED_HERO: Partial<Record<TemplateVariant, string>> = {
    "authority-builder":   "hero-two-col-image",
    "urgency-driven":      "hero-two-col-countdown",
    "community-proof":     "hero-centered",
    "vsl-focused":         "hero-two-col-video",
    "transformation-wall": "hero-centered",
    "is-this-for-you":     "hero-two-col-image",
    "event-agenda":        "hero-two-col-countdown",
    "executive-clean":     "hero-centered",
    "local-demographic":   "hero-two-col-image",
    "free-value-first":    "hero-centered",
    "story-journey":       "hero-two-col-video",
  };
  const FORCED_SP: Partial<Record<TemplateVariant, string>> = {
    "transformation-split": "social-proof-three-stats",
    "authority-builder":    "social-proof-horizontal-badges",
    "urgency-driven":       "social-proof-horizontal-badges",
    "bold-impact":          "social-proof-centered-stat",
    "community-proof":      "social-proof-three-stats",
    "video-authority":      "social-proof-single-quote",
    "minimalist-elite":     "social-proof-single-quote",
    "vsl-focused":          "social-proof-single-quote",
    "is-this-for-you":      "social-proof-stars-bullets",
    "event-agenda":         "social-proof-horizontal-badges",
    "executive-clean":      "social-proof-three-stats",
    "local-demographic":    "social-proof-stars-bullets",
    "free-value-first":     "social-proof-single-quote",
    "application-style":    "social-proof-horizontal-badges",
    "story-journey":        "social-proof-three-stats",
    "results-first":        "social-proof-centered-stat",
  };
  const FORCED_CTA: Partial<Record<TemplateVariant, string>> = {
    "transformation-split": "cta-centered-color-bg",
    "authority-builder":    "cta-dark-minimal",
    "urgency-driven":       "cta-with-countdown",
    "bold-impact":          "cta-dark-minimal",
    "community-proof":      "cta-social-proof-cta",
    "video-authority":      "cta-two-col-form",
    "minimalist-elite":     "cta-dark-minimal",
    "vsl-focused":          "cta-centered-color-bg",
    "transformation-wall":  "cta-social-proof-cta",
    "is-this-for-you":      "cta-dark-minimal",
    "event-agenda":         "cta-with-countdown",
    "executive-clean":      "cta-dark-minimal",
    "local-demographic":    "cta-centered-color-bg",
    "free-value-first":     "cta-two-col-form",
    "application-style":    "cta-dark-minimal",
    "story-journey":        "cta-centered-color-bg",
    "results-first":        "cta-social-proof-cta",
    "gradient-proof":       "cta-centered-color-bg",
  };
  // Templates that replace the hero with fully custom HTML
  const CUSTOM_HTML_HERO_SET = new Set<TemplateVariant>([
    "stats-hero", "transformation-split", "bold-impact",
    "minimalist-elite", "application-style", "results-first",
    "gradient-proof",
  ]);
  // Templates that replace social proof with custom HTML
  // results-first: gradient stat banner so it contrasts with the dark hero
  const CUSTOM_HTML_SP_SET = new Set<TemplateVariant>(["social-proof-grid", "transformation-wall", "gradient-proof", "results-first"]);
  // Templates that replace what's-included with custom HTML
  const CUSTOM_HTML_WI_SET = new Set<TemplateVariant>(["event-agenda", "story-journey", "vsl-focused", "free-value-first", "video-authority", "gradient-proof"]);

  // ── Pre-hero strip (local-demographic only) ───────────────────────────────────
  if (resolvedVariant === "local-demographic") {
    const html = buildAudienceBannerHtml(data, s);
    const ccId = makeCustomCode(b, html, 0);
    const col  = makeCol(b, [ccId], 100, {});
    const row  = makeRow(b, [col], 1200, 0);
    makeSection(b, [row], { bgColor: s.primary, ptD: 0, pbD: 0, ptM: 0, pbM: 0 });
  }

  let snap = countBefore("hero");

  // ── Hero ─────────────────────────────────────────────────────────────────────
  if (CUSTOM_HTML_HERO_SET.has(resolvedVariant)) {
    let heroHtml: string;
    switch (resolvedVariant) {
      case "transformation-split": heroHtml = buildTransformationSplitHtml(data, s); break;
      case "bold-impact":          heroHtml = buildBoldImpactHtml(data, s); break;
      case "minimalist-elite":     heroHtml = buildMinimalistEliteHtml(data, s); break;
      case "application-style":    heroHtml = buildApplicationHeroHtml(data, s); break;
      case "results-first":        heroHtml = buildResultsHeroHtml(data, s); break;
      case "gradient-proof":       heroHtml = buildGradientProofHeroHtml(data, s); break;
      default:                     heroHtml = buildStatsHeroHtml(data, s);
    }
    const ccId = makeCustomCode(b, heroHtml, 0);
    const col  = makeCol(b, [ccId], 100, {});
    const row  = makeRow(b, [col], 1200, 0);
    makeSection(b, [row], { bgColor: s.dark, ptD: 0, pbD: 0, ptM: 0, pbM: 0 });
    countAfter(snap, `${resolvedVariant} (custom-code hero)`);
  } else {
    const heroVariant = FORCED_HERO[resolvedVariant] ?? slv["hero"] ?? "";
    dispatchHero(b, s, lp, badgeLabel, heroVariant);
    countAfter(snap, heroVariant || "(auto)");
  }

  // ── Post-hero custom strips ───────────────────────────────────────────────────
  type HtmlFn = (d: GeneratedFunnelAssets, sc: SchemeColors) => string;
  type PostHeroEntry = { fn: HtmlFn; bg: string };
  const postHeroMap: Partial<Record<TemplateVariant, PostHeroEntry>> = {
    "authority-builder": { fn: buildCredentialsStripHtml,           bg: s.mid    },
    "urgency-driven":    { fn: buildUrgencyBannerHtml,               bg: s.mid    },
    "community-proof":   { fn: buildCommunityStatsHtml,              bg: s.mid    },
    "is-this-for-you":   { fn: buildIsThisForYouHtml,                bg: s.mid    },
    "executive-clean":   { fn: buildWhyThisWorksHtml,                bg: s.mid    },
    // gradient-proof: cream qualification section (matches original page's first light section)
    "gradient-proof":    { fn: buildGradientProofQualificationHtml,  bg: GP_CREAM },
  };
  const postHeroEntry = postHeroMap[resolvedVariant];
  if (postHeroEntry) {
    const html = postHeroEntry.fn(data, s);
    const ccId = makeCustomCode(b, html, 0);
    const col  = makeCol(b, [ccId], 100, {});
    const row  = makeRow(b, [col], 1200, 0);
    makeSection(b, [row], { bgColor: postHeroEntry.bg, ptD: 0, pbD: 0, ptM: 0, pbM: 0 });
  }

  // ── Social Proof ──────────────────────────────────────────────────────────────
  // Skip native social proof only when CTA already embeds it AND no forced SP is set.
  const resolvedCtaVariant = FORCED_CTA[resolvedVariant] ?? slv["final-cta"] ?? "";
  const skipSocialProof = !FORCED_SP[resolvedVariant] && resolvedCtaVariant === "cta-social-proof-cta";
  console.log("[diag] skip-social-proof:", skipSocialProof, "resolvedCta:", resolvedCtaVariant, "forcedSP:", FORCED_SP[resolvedVariant] ?? "(none)");

  if (CUSTOM_HTML_SP_SET.has(resolvedVariant)) {
    snap = countBefore("social-proof");
    let spHtml: string;
    let spBg: string;
    if (resolvedVariant === "transformation-wall") {
      spHtml = buildTransformationWallHtml(data, s); spBg = s.alt;
    } else if (resolvedVariant === "gradient-proof") {
      // Dark purple behind testimonials — matches original page's dark section (#1e1030)
      spHtml = buildTransformationWallHtml(data, s); spBg = GP_DARK;
    } else if (resolvedVariant === "results-first") {
      spHtml = buildResultsStatBannerHtml(data, s); spBg = s.primary;
    } else {
      spHtml = buildSocialProofGridHtml(data, s); spBg = s.alt;
    }
    const ccId = makeCustomCode(b, spHtml, 0);
    const col  = makeCol(b, [ccId], 100, {});
    const row  = makeRow(b, [col], 1200, 0);
    makeSection(b, [row], { bgColor: spBg, ptD: 0, pbD: 0, ptM: 0, pbM: 0 });
    countAfter(snap, `${resolvedVariant} (custom-code social-proof)`);
  } else if (!skipSocialProof) {
    snap = countBefore("social-proof");
    const spVariant = FORCED_SP[resolvedVariant] ?? slv["social-proof"] ?? "";
    dispatchSocialProof(b, s, data.offerSummary.corePromise, spVariant);
    countAfter(snap, spVariant || "(auto)");
  }

  // ── What's Included (or custom replacement) ───────────────────────────────────
  snap = countBefore("whats-included");
  if (CUSTOM_HTML_WI_SET.has(resolvedVariant)) {
    let wiHtml: string;
    let wiBg: string;
    switch (resolvedVariant) {
      case "event-agenda":    wiHtml = buildEventAgendaHtml(data, s);  wiBg = s.dark; break;
      case "vsl-focused":     wiHtml = buildVslDiscoverHtml(data, s);  wiBg = s.dark; break;
      case "free-value-first": wiHtml = buildValueStackHtml(data, s); wiBg = s.alt;  break;
      case "video-authority": wiHtml = buildFeatureStripHtml(data, s);          wiBg = s.alt;  break;
      case "gradient-proof":  wiHtml = buildGradientProofFeaturesHtml(data, s); wiBg = GP_CREAM; break;
      default:                wiHtml = buildJourneyTimelineHtml(data, s); wiBg = s.mid;
    }
    const ccId = makeCustomCode(b, wiHtml, 0);
    const col  = makeCol(b, [ccId], 100, {});
    const row  = makeRow(b, [col], 1200, 0);
    makeSection(b, [row], { bgColor: wiBg, ptD: 0, pbD: 0, ptM: 0, pbM: 0 });
    countAfter(snap, `${resolvedVariant} (custom-code whats-included)`);
  } else {
    dispatchWhatsIncluded(b, s, lp, slv["whats-included"] ?? "", data);
    countAfter(snap, slv["whats-included"] ?? "(none)");
  }

  snap = countBefore("faq");
  {
    const faqHtml = buildFaqHtml(data, s);
    const ccId    = makeCustomCode(b, faqHtml, 0);
    const col     = makeCol(b, [ccId], 100, {});
    const row     = makeRow(b, [col], 1200, 0);
    makeSection(b, [row], { bgColor: s.dark, ptD: 0, pbD: 0, ptM: 0, pbM: 0 });
  }
  countAfter(snap, "faq-custom-code");

  snap = countBefore("final-cta");
  if (resolvedVariant === "gradient-proof") {
    // Hot-pink CTA section — matches section 4 (#e91e8c) from the original page JSON
    const ctaHtml = buildGradientProofCtaHtml(data, s);
    const ccId    = makeCustomCode(b, ctaHtml, 0);
    const col     = makeCol(b, [ccId], 100, {});
    const row     = makeRow(b, [col], 1200, 0);
    makeSection(b, [row], { bgColor: GP_PINK, ptD: 0, pbD: 0, ptM: 0, pbM: 0 });
    countAfter(snap, "gradient-proof (custom hot-pink CTA)");
  } else {
    dispatchFinalCta(b, s, lp, resolvedCtaVariant);
    countAfter(snap, resolvedCtaVariant || "(auto)");
  }

  buildFooter(b, s);

  const result = sanitizePageData(finalize(b, s));
  console.log("[diag] FINAL sections array (" + result.sections.length + " total):");
  result.sections.forEach((sec, i) => {
    const elemCount = sec.elements?.length ?? 0;
    console.log(`  [${i}] id=${sec.id} elements=${elemCount}`);
  });

  return result;
}

// ── OPT-IN PAGE ───────────────────────────────────────────────────────────────

export function buildOptInPageData(data: GeneratedFunnelAssets): GhlPageData {
  if (!data?.optInForm) throw new Error("optInForm is required");
  const b = createBuilder();
  const s    = resolveScheme(data);
  const form = data.optInForm;
  // Use formIntroText (first sentence, ≤80 chars) as the hero headline
  const optInHeadline = (form.formIntroText ?? "")
    .split(/[.!?]/)[0].trim().slice(0, 80) || "Claim Your Free Spot";

  const badge  = makeParagraph(b,
    "Step 1 of 2 — Claim Your Free Spot",
    { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("600"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
  );
  const h1 = makeHeading(b,
    optInHeadline, "h1",
    { color: ss(s.textColorOnDark), fontSize: sv(44), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(560), marginLeft: ss("auto"), marginRight: ss("auto") },
    { fontSize: sv(28) },
  );
  const intro = makeParagraph(b,
    form.formIntroText,
    { color: ss("rgba(255,255,255,0.75)"), fontSize: sv(16), textAlign: ss("center"), lineHeight: ss("1.7"), maxWidth: sv(460), marginLeft: ss("auto"), marginRight: ss("auto"), paddingBottom: sv(32) },
  );
  const formEl = makeForm(b);
  const trust  = makeParagraph(b,
    "🔒  Secure · No credit card · Cancel anytime",
    { color: ss("rgba(255,255,255,0.5)"), fontSize: sv(12), textAlign: ss("center"), paddingTop: sv(16) },
  );

  const c = makeCol(b, [badge, h1, intro, formEl, trust], 100, { align: "center", padH: 32 });
  const r = makeRow(b, [c], 480);
  makeSection(b, [r], {
    bg: `linear-gradient(160deg, ${s.dark} 0%, ${s.mid} 60%, ${s.dark} 100%)`,
    ptD: 88, pbD: 88, ptM: 56, pbM: 56,
  });

  buildFooter(b, s);

  const optInResult = sanitizePageData(finalize(b, s));
  console.log("[diag] OPT-IN FINAL sections array (" + optInResult.sections.length + " total):");
  optInResult.sections.forEach((sec, i) => {
    const elemCount = sec.elements?.length ?? 0;
    console.log(`  [${i}] id=${sec.id} elements=${elemCount}`);
  });
  return optInResult;
}

// ── APPLICATION FORM PAGE ─────────────────────────────────────────────────────
// Full-length landing page (no form) that matches the multi-section reference
// layout: header → value prop → CTA with video → testimonials → about coach.
// Used in place of buildOptInPageData when funnelType === "application".

export function buildApplicationFormPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b  = createBuilder();
  const s  = resolveScheme(data);
  const lp = data.landingPage;
  const os = data.offerSummary;

  const challengeConcept = (os?.challengeConcept ?? "this challenge").trim();
  const targetSummary    = (os?.targetAudienceSummary ?? "").split(/[.!]/)[0].trim().toLowerCase();
  const headline         = lp?.headlineOptions?.[0] ?? `Transform with ${challengeConcept}`;
  const subheadline      = lp?.subheadline ?? (os?.corePromise ?? "");
  const corePromiseShort = (os?.corePromise ?? "real results").split(/\s+/).slice(0, 6).join(" ");
  const hasVideo         = Boolean(data.coachVideoUrl);

  // ─── Section 1: Header ──────────────────────────────────────────────────────
  {
    const img = makeImage(b, { url: data.coachPhotoUrl ?? "", width: 200 });
    const col = makeCol(b, [img], 100, { align: "center", padH: 10 });
    const row = makeRow(b, [col], 1170);
    makeSection(b, [row], { bgColor: "#000000", ptD: 0, pbD: 0, ptM: 0, pbM: 0 });
  }

  // ─── Section 2: Value Proposition (2-col: image left, text right) ───────────
  {
    const valPropText = targetSummary
      ? `Join ${challengeConcept}, even if ${targetSummary}`
      : headline;
    const img     = makeImage(b, { url: data.coachPhotoUrl ?? "", width: 100 });
    const heading = makeHeading(b, valPropText, "h2", {
      color:      ss("#ffffff"),
      fontSize:   sv(23),
      lineHeight: ss("1.4em"),
      textAlign:  ss("center"),
    });
    const imgCol  = makeCol(b, [img],     50, { padH: 10, padV: 15 });
    const textCol = makeCol(b, [heading], 50, { align: "center", padH: 10, padV: 15 });
    const row     = makeRow(b, [imgCol, textCol], 1170);
    makeSection(b, [row], { bgColor: "#000000", ptD: 15, pbD: 15, ptM: 10, pbM: 10 });
  }

  // ─── Section 3: Congratulations banner ──────────────────────────────────────
  {
    const congratsHeading = makeHeading(b,
      `Congratulations! You've taken the first step towards ${corePromiseShort}`, "h2",
      {
        color:           ss("#ffffff"),
        fontSize:        sv(28),
        textAlign:       ss("center"),
        lineHeight:      ss("1.3em"),
        paddingTop:      sv(10),
        paddingBottom:   sv(10),
        backgroundColor: ss(s.primary),
      },
      { fontSize: sv(22) },
    );
    const col = makeCol(b, [congratsHeading], 100, { align: "center", padH: 10 });
    const row = makeRow(b, [col], 1170);
    makeSection(b, [row], { bgColor: "#ffffff", ptD: 30, pbD: 10, ptM: 20, pbM: 10 });
  }

  // ─── Section 4: Video + headline / headline only ─────────────────────────────
  {
    const contentHeading = makeHeading(b, headline, "h2", {
      color:         ss(s.primary),
      fontSize:      sv(40),
      textAlign:     ss("center"),
      lineHeight:    ss("1.2em"),
      paddingBottom: sv(10),
    }, { fontSize: sv(26) });
    const contentSubheading = makeParagraph(b, subheadline, {
      color:      ss("#000000"),
      fontSize:   sv(23),
      textAlign:  ss("center"),
      lineHeight: ss("1.4em"),
    });

    let contentRow: string;
    if (hasVideo) {
      const videoEl    = makeVideo(b, data.coachVideoUrl!);
      const videoCol   = makeCol(b, [videoEl],                             50, { padH: 10, padV: 10 });
      const contentCol = makeCol(b, [contentHeading, contentSubheading],   50, { align: "center", padH: 10, padV: 10 });
      contentRow = makeRow(b, [videoCol, contentCol], 1170);
    } else {
      const singleCol = makeCol(b, [contentHeading, contentSubheading], 100, { align: "center", padH: 32 });
      contentRow = makeRow(b, [singleCol], 720);
    }

    // CTA button row
    const ctaBtn = makeButton(b,
      "START YOUR APPLICATION NOW", "next-step", "",
      {
        backgroundColor: ss(s.primary),
        fontSize:        sv(36),
        paddingTop:      sv(13),
        paddingBottom:   sv(13),
        paddingLeft:     sv(35),
        paddingRight:    sv(35),
      },
      { fontSize: sv(26), width: sv(100, "%") },
    );
    const ctaSubtext = makeParagraph(b,
      "Fill Out An Application & Get Your Consultation For FREE",
      { color: ss("#555555"), fontSize: sv(16), textAlign: ss("center"), paddingTop: sv(8) },
    );
    const btnCol = makeCol(b, [ctaBtn, ctaSubtext], 100, { align: "center", padH: 10 });
    const btnRow = makeRow(b, [btnCol], 1170);

    makeSection(b, [contentRow, btnRow], { bgColor: "#ffffff", ptD: 10, pbD: 30, ptM: 10, pbM: 20 });
  }

  // ─── Section 5: Testimonials ─────────────────────────────────────────────────
  {
    const testimonialsHeading = makeHeading(b,
      "Here's What Clients JUST LIKE YOU, Have To Say...", "h2",
      {
        color:         ss("#000000"),
        fontSize:      sv(44),
        textAlign:     ss("center"),
        lineHeight:    ss("1.2em"),
        paddingBottom: sv(20),
      },
      { fontSize: sv(26) },
    );
    const headingCol = makeCol(b, [testimonialsHeading], 100, { align: "center", padH: 10 });
    const headingRow = makeRow(b, [headingCol], 1170);

    const midElems: string[] = [];
    if (hasVideo) midElems.push(makeVideo(b, data.coachVideoUrl!));
    const quoteText = lp?.sectionIdeas?.[0]
      ? `"${lp.sectionIdeas[0]}"`
      : `"This challenge completely transformed my results — I never thought change could happen this fast."`;
    midElems.push(makeParagraph(b, quoteText, {
      color:         ss("rgb(45,45,45)"),
      fontSize:      sv(22),
      textAlign:     ss("center"),
      lineHeight:    ss("1.5em"),
      paddingTop:    sv(10),
      paddingBottom: sv(5),
    }));

    const spacerL = makeCol(b, [],        18, { padH: 0 });
    const midCol  = makeCol(b, midElems,  64, { padH: 10, padV: 5 });
    const spacerR = makeCol(b, [],        18, { padH: 0 });
    const testimonialRow = makeRow(b, [spacerL, midCol, spacerR], 1170);

    makeSection(b, [headingRow, testimonialRow], { bgColor: "rgb(245,245,245)", ptD: 20, pbD: 35, ptM: 15, pbM: 20 });
  }

  // ─── Section 6: About coach ──────────────────────────────────────────────────
  {
    const aboutHeading = makeHeading(b,
      "WHO IS YOUR COACH, And Why Should You Listen To Them?", "h2",
      {
        color:         ss("#000000"),
        fontSize:      sv(46),
        textAlign:     ss("center"),
        lineHeight:    ss("1.2em"),
        paddingBottom: sv(10),
      },
      { fontSize: sv(28) },
    );
    const headingCol = makeCol(b, [aboutHeading], 100, { align: "center", padH: 10 });
    const headingRow = makeRow(b, [headingCol], 1170);

    const stageLabels = ["THE STRUGGLE", "THE TURNING POINT", "THE TRANSFORMATION", "THE RESULT"] as const;
    const imgCols = stageLabels.map(label => {
      const img = makeImage(b, { url: data.coachPhotoUrl ?? "", width: 100 });
      const lbl = makeParagraph(b, label, {
        color:           ss("#ffffff"),
        fontSize:        sv(20),
        textAlign:       ss("center"),
        textTransform:   ss("uppercase"),
        backgroundColor: ss("#333333"),
        paddingTop:      sv(5),
        paddingBottom:   sv(5),
      });
      return makeCol(b, [img, lbl], 25, { padH: 5, padV: 5 });
    });
    const imagesRow = makeRow(b, imgCols, 1170);

    makeSection(b, [headingRow, imagesRow], { bgColor: "#ffffff", ptD: 20, pbD: 10, ptM: 10, pbM: 10 });
  }

  buildFooter(b, s);

  const result = sanitizePageData(finalize(b, s));
  console.log("[diag] APP-FORM FINAL sections array (" + result.sections.length + " total):");
  result.sections.forEach((sec, i) => {
    console.log(`  [${i}] id=${sec.id} elements=${sec.elements?.length ?? 0}`);
  });
  return result;
}

// ── THANK YOU PAGE ────────────────────────────────────────────────────────────

export function buildThankYouPageData(data: GeneratedFunnelAssets): GhlPageData {
  if (!data?.thankYouPage) throw new Error("thankYouPage is required");
  const b = createBuilder();
  const s = resolveScheme(data);
  const ty = data.thankYouPage;

  // ── 1. HERO ──────────────────────────────────────────────────────────────
  {
    const badge = makeParagraph(b,
      "🎉  You're in — Welcome aboard!",
      { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("700"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
    );
    const h1 = makeHeading(b,
      ty.confirmationMessage ?? "You're registered — we'll see you inside!", "h1",
      { color: ss(s.textColorOnDark), fontSize: sv(46), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(20), maxWidth: sv(740), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(28) },
    );
    const sub = makeParagraph(b,
      ty.bookingEncouragement ?? "Book your free kick-off call below to get started.",
      { color: ss("rgba(255,255,255,0.75)"), fontSize: sv(17), textAlign: ss("center"), lineHeight: ss("1.7"), maxWidth: sv(540), marginLeft: ss("auto"), marginRight: ss("auto") },
    );
    const c = makeCol(b, [badge, h1, sub], 100, { align: "center", padH: 32 });
    const r = makeRow(b, [c], 880);
    makeSection(b, [r], {
      bg: `linear-gradient(160deg, ${s.dark} 0%, ${s.mid} 60%, ${s.dark} 100%)`,
      ptD: 100, pbD: 100, ptM: 64, pbM: 64,
    });
  }

  // ── 2. NEXT STEPS ─────────────────────────────────────────────────────────
  {
    const eyebrow = makeParagraph(b,
      "What Happens Next",
      { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), textAlign: ss("center"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(8) },
    );
    const h2 = makeHeading(b,
      "Here's your next steps", "h2",
      { color: ss(s.textColorOnLight), fontSize: sv(32), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(40) },
      { fontSize: sv(22) },
    );
    const stepEls = (ty.nextSteps ?? []).flatMap((step, i) => [
      makeParagraph(b, `${i + 1}. ${step}`, {
        color: ss(s.textColorOnLight), fontSize: sv(15), lineHeight: ss("1.65"),
        paddingTop: sv(16), paddingBottom: sv(16),
        paddingLeft: sv(20), paddingRight: sv(20),
        backgroundColor: ss(s.alt),
        borderRadius: sv(12),
        marginBottom: sv(10),
      }),
    ]);
    const c = makeCol(b, [eyebrow, h2, ...stepEls], 100, { padH: 0 });
    const r = makeRow(b, [c], 620, 24);
    makeSection(b, [r], { bgColor: s.alt, ptD: 80, pbD: 80, ptM: 48, pbM: 48 });
  }

  // ── 3. BOOKING CTA ────────────────────────────────────────────────────────
  {
    const h2 = makeHeading(b,
      "One more step — book your kick-off call", "h2",
      { color: ss(s.textColorOnDark), fontSize: sv(36), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.15"), paddingBottom: sv(14), maxWidth: sv(560), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(24) },
    );
    const sub = makeParagraph(b,
      "30 minutes · Free · No sales pressure — just a game plan for your challenge.",
      { color: ss("rgba(255,255,255,0.8)"), fontSize: sv(16), textAlign: ss("center"), paddingBottom: sv(36) },
    );
    const cta = makeButton(b,
      "Book My Free Call →", "next-step", "",
      { backgroundColor: ss("#ffffff"), color: ss(s.primary), boxShadow: ss("0 8px 24px rgba(0,0,0,0.15)") },
    );
    const c = makeCol(b, [h2, sub, cta], 100, { align: "center", padH: 32 });
    const r = makeRow(b, [c], 640);
    makeSection(b, [r], {
      bg: `linear-gradient(135deg, ${s.primary} 0%, ${s.accent} 100%)`,
      ptD: 80, pbD: 80,
    });
  }

  buildFooter(b, s);

  const tyResult = sanitizePageData(finalize(b, s));
  console.log("[diag] THANK-YOU FINAL sections array (" + tyResult.sections.length + " total):");
  tyResult.sections.forEach((sec, i) => {
    const elemCount = sec.elements?.length ?? 0;
    console.log(`  [${i}] id=${sec.id} elements=${elemCount}`);
  });
  return tyResult;
}

// ── BOOKING PAGE ──────────────────────────────────────────────────────────────

export function buildBookingPageData(data: GeneratedFunnelAssets): GhlPageData {
  if (!data?.bookingPage) throw new Error("bookingPage is required");
  const b = createBuilder();
  const s = resolveScheme(data);
  const bk = data.bookingPage;
  // Use first sentence of shortIntro (≤80 chars) as the hero headline
  const bookingHeadline = (bk.shortIntro ?? "")
    .split(/[.!?]/)[0].trim().slice(0, 80) || "Book Your Free Strategy Call";

  // ── 1. HERO ──────────────────────────────────────────────────────────────
  {
    const badge = makeParagraph(b,
      "Almost there — pick a time that works for you",
      { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("600"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
    );
    const h1 = makeHeading(b,
      bookingHeadline, "h1",
      { color: ss(s.textColorOnDark), fontSize: sv(44), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(640), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(27) },
    );
    const sub = makeParagraph(b,
      bk.shortIntro,
      { color: ss("rgba(255,255,255,0.75)"), fontSize: sv(16), textAlign: ss("center"), lineHeight: ss("1.7"), maxWidth: sv(520), marginLeft: ss("auto"), marginRight: ss("auto") },
    );
    const c = makeCol(b, [badge, h1, sub], 100, { align: "center", padH: 32 });
    const r = makeRow(b, [c], 800);
    makeSection(b, [r], {
      bg: `linear-gradient(160deg, ${s.dark} 0%, ${s.mid} 60%, ${s.dark} 100%)`,
      ptD: 88, pbD: 88, ptM: 56, pbM: 56,
    });
  }

  // ── 2. TWO-COLUMN CONTENT ─────────────────────────────────────────────────
  {
    const whyLabel = makeParagraph(b,
      "Why Book a Call",
      { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(16) },
    );
    const whyItems = (bk.whyBook ?? []).map((reason) =>
      makeParagraph(b, `✓  ${reason}`, {
        color: ss(s.textColorOnLight), fontSize: sv(15), lineHeight: ss("1.65"), paddingBottom: sv(12),
      })
    );
    const expectLabel = makeParagraph(b,
      "What to expect on the call",
      { color: ss(s.accent), fontSize: sv(13), fontWeight: ss("700"), paddingTop: sv(20), paddingBottom: sv(6) },
    );
    const expectText = makeParagraph(b,
      bk.expectationSetting ?? "We'll walk you through your challenge plan step by step.",
      { color: ss(s.textColorOnLight), fontSize: sv(13), lineHeight: ss("1.6") },
    );
    const trustItems = ["Free 30-minute call", "No sales pressure", "100% confidential"].map((t) =>
      makeParagraph(b, `✓  ${t}`, { color: ss(s.textColorOnLight), fontSize: sv(13), paddingBottom: sv(6) })
    );
    const leftCol = makeCol(b,
      [whyLabel, ...whyItems, expectLabel, expectText, makeDivider(b), ...trustItems],
      50, { padH: 24 },
    );

    const calLabel = makeHeading(b,
      "Select a Date & Time", "h3",
      { color: ss(s.textColorOnLight), fontSize: sv(16), fontWeight: ss("700"), textAlign: ss("center"), paddingBottom: sv(6) },
    );
    const calSub = makeParagraph(b,
      "Connect your GHL Calendar element here after import.",
      { color: ss(s.textColorOnLight), fontSize: sv(12), textAlign: ss("center"), paddingBottom: sv(24) },
    );
    const calPlaceholder = makeParagraph(b,
      "📅  Drag your GHL Calendar element from the Elements panel into this column",
      { color: ss(s.textColorOnLight), fontSize: sv(13), textAlign: ss("center"), lineHeight: ss("1.6"),
        paddingTop: sv(32), paddingBottom: sv(32), paddingLeft: sv(24), paddingRight: sv(24),
        backgroundColor: ss(s.alt), borderRadius: sv(12) },
    );
    const confirmBtn = makeButton(b,
      "Confirm My Spot →", "next-step", "",
      { backgroundColor: ss(s.primary), marginTop: sv(20) },
    );
    const calMicro = makeParagraph(b,
      "You'll receive a confirmation email immediately after booking.",
      { color: ss(s.textColorOnLight), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(10) },
    );
    const rightCol = makeCol(b,
      [calLabel, calSub, calPlaceholder, confirmBtn, calMicro],
      50, { padH: 24 },
    );

    const r = makeRow(b, [leftCol, rightCol], 1100, 0);
    makeSection(b, [r], { bgColor: s.alt, ptD: 72, pbD: 72, ptM: 48, pbM: 48 });
  }

  // ── 3. TRUST BAR ──────────────────────────────────────────────────────────
  {
    const items = ["Free 30-min call", "No sales pressure", "100% confidential"].map((t) =>
      makeParagraph(b, `✓  ${t}`, { color: ss(s.textColorOnDark), fontSize: sv(13), textAlign: ss("center") })
    );
    const cols = items.map((id) => makeCol(b, [id], 33, { align: "center" }));
    const r    = makeRow(b, cols, 720, 24);
    makeSection(b, [r], { bgColor: s.dark, ptD: 24, pbD: 24, ptM: 20, pbM: 20 });
  }

  buildFooter(b, s);

  const bookingResult = sanitizePageData(finalize(b, s));
  console.log("[diag] BOOKING FINAL sections array (" + bookingResult.sections.length + " total):");
  bookingResult.sections.forEach((sec, i) => {
    const elemCount = sec.elements?.length ?? 0;
    console.log(`  [${i}] id=${sec.id} elements=${elemCount}`);
  });
  return bookingResult;
}

// ── SALES LETTER PAGE ─────────────────────────────────────────────────────────

/**
 * Builds a full long-form sales letter as a native GHL page.
 * Uses native element builders (makeHeading, makeParagraph, makeButton,
 * makeBulletList, makeDivider) so every section is individually editable
 * in the GHL builder — consistent with all other funnel pages.
 */
export function buildSalesLetterPageData(data: GeneratedFunnelAssets): GhlPageData {
  const sl = data.longFormAssets?.salesLetter;
  if (!sl) throw new Error("salesLetter is required (generate longform assets first)");

  const b = createBuilder();
  const s = resolveScheme(data);
  const p  = s.primary;
  const dk = s.dark;
  const md = s.mid;

  // ── 1. Hero (dark bg, centered) ──────────────────────────────────────────────
  {
    const label = makeParagraph(b, "LONG-FORM LANDING PAGE", {
      color: ss(p), fontSize: sv(12), fontWeight: ss("700"), textTransform: ss("uppercase"),
      letterSpacing: ss("0.1em"), textAlign: ss("center"), paddingBottom: sv(24),
    });
    const h1 = makeHeading(b, sl.headline, "h1", {
      color: ss("#ffffff"), fontSize: sv(52), fontWeight: ss("900"),
      lineHeight: ss("1.1em"), textAlign: ss("center"),
    }, { fontSize: sv(34) });
    const sub = makeParagraph(b, sl.subheadline, {
      color: ss("rgba(255,255,255,0.7)"), fontSize: sv(20), lineHeight: ss("1.65em"),
      textAlign: ss("center"),
    }, { fontSize: sv(16) });
    const btn = makeButton(b, "Apply Now →", "url", "", {
      backgroundColor: ss("#ffffff"), color: ss(p),
      paddingTop: sv(18), paddingBottom: sv(18), paddingLeft: sv(40), paddingRight: sv(40),
      borderColor: ss("#ffffff"),
    });
    const col = makeCol(b, [label, h1, sub, btn], 100, { padH: 32, align: "center" });
    makeSection(b, [makeRow(b, [col], 680)], { bgColor: dk, ptD: 100, pbD: 80, ptM: 64, pbM: 56 });
  }

  // ── 2. Opening Hook (white bg) ────────────────────────────────────────────────
  {
    const body = makeParagraph(b, sl.openingHook, {
      color: ss("#374151"), fontSize: sv(18), lineHeight: ss("1.85em"),
    }, { fontSize: sv(15) });
    const col = makeCol(b, [body], 100, { padH: 32 });
    makeSection(b, [makeRow(b, [col], 720)], { bgColor: "#ffffff", ptD: 72, pbD: 72, ptM: 48, pbM: 48 });
  }

  // ── 3. Problem Agitation (light gray bg) ─────────────────────────────────────
  {
    const label = makeParagraph(b, "THE PROBLEM", {
      color: ss(p), fontSize: sv(11), fontWeight: ss("700"), textTransform: ss("uppercase"),
      letterSpacing: ss("0.12em"), paddingBottom: sv(12),
    });
    const body = makeParagraph(b, sl.problemAgitation, {
      color: ss("#374151"), fontSize: sv(17), lineHeight: ss("1.85em"),
    }, { fontSize: sv(15) });
    const col = makeCol(b, [label, body], 100, { padH: 32 });
    makeSection(b, [makeRow(b, [col], 720)], { bgColor: "#f8fafc", ptD: 72, pbD: 72, ptM: 48, pbM: 48 });
  }

  // ── 4. Bridge + Coach Credentials (mid bg) ───────────────────────────────────
  {
    const label1 = makeParagraph(b, "THERE'S A BETTER WAY", {
      color: ss(p), fontSize: sv(11), fontWeight: ss("700"), textTransform: ss("uppercase"),
      letterSpacing: ss("0.12em"), paddingBottom: sv(12),
    });
    const bridge = makeParagraph(b, sl.bridgeToPossibility, {
      color: ss("rgba(255,255,255,0.85)"), fontSize: sv(18), fontWeight: ss("500"),
      lineHeight: ss("1.85em"), paddingBottom: sv(48),
    }, { fontSize: sv(15) });
    const div = makeDivider(b);
    const label2 = makeParagraph(b, "WHY TRUST ME", {
      color: ss(p), fontSize: sv(11), fontWeight: ss("700"), textTransform: ss("uppercase"),
      letterSpacing: ss("0.12em"), paddingBottom: sv(12), paddingTop: sv(48),
    });
    const creds = makeParagraph(b, sl.coachCredentials, {
      color: ss("rgba(255,255,255,0.8)"), fontSize: sv(17), lineHeight: ss("1.85em"),
    }, { fontSize: sv(15) });
    const col = makeCol(b, [label1, bridge, div, label2, creds], 100, { padH: 32 });
    makeSection(b, [makeRow(b, [col], 720)], { bgColor: md, ptD: 72, pbD: 72, ptM: 48, pbM: 48 });
  }

  // ── 5. Offer Reveal (dark bg, centered) ──────────────────────────────────────
  {
    const label = makeParagraph(b, "INTRODUCING", {
      color: ss(p), fontSize: sv(11), fontWeight: ss("700"), textTransform: ss("uppercase"),
      letterSpacing: ss("0.12em"), textAlign: ss("center"), paddingBottom: sv(12),
    });
    const body = makeParagraph(b, sl.offerReveal, {
      color: ss("#ffffff"), fontSize: sv(20), lineHeight: ss("1.75em"), textAlign: ss("center"),
    }, { fontSize: sv(16) });
    const col = makeCol(b, [label, body], 100, { padH: 32, align: "center" });
    makeSection(b, [makeRow(b, [col], 720)], { bgColor: dk, ptD: 72, pbD: 72, ptM: 48, pbM: 48 });
  }

  // ── 6. What You Get (light gray bg) ──────────────────────────────────────────
  {
    const label = makeParagraph(b, "EVERYTHING INCLUDED", {
      color: ss(p), fontSize: sv(11), fontWeight: ss("700"), textTransform: ss("uppercase"),
      letterSpacing: ss("0.12em"), textAlign: ss("center"), paddingBottom: sv(8),
    });
    const h2 = makeHeading(b, "Here's what you get", "h2", {
      color: ss("#111111"), fontSize: sv(36), fontWeight: ss("900"),
      textAlign: ss("center"), paddingBottom: sv(32),
    }, { fontSize: sv(24) });
    const items = (sl.whatYouGet ?? []).map((i) => `${i.name} — ${i.description}`);
    const bullets = makeBulletList(b, items, p, {
      color: ss("#374151"), fontSize: sv(16), lineHeight: ss("1.7em"),
    });
    const col = makeCol(b, [label, h2, bullets], 100, { padH: 32 });
    makeSection(b, [makeRow(b, [col], 800)], { bgColor: "#f8fafc", ptD: 80, pbD: 80, ptM: 56, pbM: 56 });
  }

  // ── 7. Social Proof (mid bg) ──────────────────────────────────────────────────
  {
    const label = makeParagraph(b, "WHAT CLIENTS SAY", {
      color: ss(p), fontSize: sv(11), fontWeight: ss("700"), textTransform: ss("uppercase"),
      letterSpacing: ss("0.12em"), paddingBottom: sv(12),
    });
    const body = makeParagraph(b, sl.socialProofFramework, {
      color: ss("rgba(255,255,255,0.85)"), fontSize: sv(17), lineHeight: ss("1.85em"),
    }, { fontSize: sv(15) });
    const col = makeCol(b, [label, body], 100, { padH: 32 });
    makeSection(b, [makeRow(b, [col], 720)], { bgColor: md, ptD: 72, pbD: 72, ptM: 48, pbM: 48 });
  }

  // ── 8. Bonus Stack (dark bg) ──────────────────────────────────────────────────
  {
    const label = makeParagraph(b, "FREE BONUSES", {
      color: ss(p), fontSize: sv(11), fontWeight: ss("700"), textTransform: ss("uppercase"),
      letterSpacing: ss("0.12em"), textAlign: ss("center"), paddingBottom: sv(8),
    });
    const h2 = makeHeading(b, "Included at no extra cost", "h2", {
      color: ss("#ffffff"), fontSize: sv(32), fontWeight: ss("900"),
      textAlign: ss("center"), paddingBottom: sv(32),
    }, { fontSize: sv(22) });
    const bonusItems = (sl.bonusStack ?? []).map((bns) => `🎁 ${bns.name} (${bns.valueLabel}) — ${bns.description}`);
    const bullets = makeBulletList(b, bonusItems, p, {
      color: ss("rgba(255,255,255,0.85)"), fontSize: sv(15),
    });
    const col = makeCol(b, [label, h2, bullets], 100, { padH: 32 });
    makeSection(b, [makeRow(b, [col], 760)], { bgColor: dk, ptD: 80, pbD: 80, ptM: 56, pbM: 56 });
  }

  // ── 9. Price + Guarantee (white bg, centered) ─────────────────────────────────
  {
    const label = makeParagraph(b, "INVESTMENT", {
      color: ss(p), fontSize: sv(11), fontWeight: ss("700"), textTransform: ss("uppercase"),
      letterSpacing: ss("0.12em"), textAlign: ss("center"), paddingBottom: sv(8),
    });
    const price = makeParagraph(b, sl.priceReveal, {
      color: ss("#374151"), fontSize: sv(18), lineHeight: ss("1.8em"),
      textAlign: ss("center"), paddingBottom: sv(40),
    }, { fontSize: sv(15) });
    const gH = makeHeading(b, "My Personal Guarantee", "h3", {
      color: ss("#14532d"), fontSize: sv(22), fontWeight: ss("800"), paddingBottom: sv(12),
    });
    const gBody = makeParagraph(b, sl.guarantee, {
      color: ss("#166534"), fontSize: sv(15), lineHeight: ss("1.75em"),
    });
    const col = makeCol(b, [label, price, gH, gBody], 100, { padH: 32, align: "center" });
    makeSection(b, [makeRow(b, [col], 640)], { bgColor: "#ffffff", ptD: 80, pbD: 80, ptM: 56, pbM: 56 });
  }

  // ── 10. Objection Handling (light gray bg) ───────────────────────────────────
  {
    const label = makeParagraph(b, "YOUR QUESTIONS ANSWERED", {
      color: ss(p), fontSize: sv(11), fontWeight: ss("700"), textTransform: ss("uppercase"),
      letterSpacing: ss("0.12em"), textAlign: ss("center"), paddingBottom: sv(8),
    });
    const h2 = makeHeading(b, "Before you decide", "h2", {
      color: ss("#111111"), fontSize: sv(32), fontWeight: ss("900"),
      textAlign: ss("center"), paddingBottom: sv(28),
    }, { fontSize: sv(22) });
    const objEls: string[] = [label, h2];
    (sl.objectionHandling ?? []).forEach((o, idx) => {
      objEls.push(makeHeading(b, o.objection, "h4", {
        color: ss("#111111"), fontSize: sv(17), fontWeight: ss("700"), paddingTop: sv(16),
      }));
      objEls.push(makeParagraph(b, o.response, {
        color: ss("#4b5563"), fontSize: sv(15), lineHeight: ss("1.7em"), paddingBottom: sv(8),
      }));
      if (idx < (sl.objectionHandling ?? []).length - 1) objEls.push(makeDivider(b));
    });
    const col = makeCol(b, objEls, 100, { padH: 32 });
    makeSection(b, [makeRow(b, [col], 680)], { bgColor: "#f8fafc", ptD: 80, pbD: 80, ptM: 56, pbM: 56 });
  }

  // ── 11. Urgency (mid bg, centered) ───────────────────────────────────────────
  {
    const body = makeParagraph(b, sl.urgencySection, {
      color: ss("rgba(255,255,255,0.85)"), fontSize: sv(17), lineHeight: ss("1.8em"),
      textAlign: ss("center"),
    }, { fontSize: sv(15) });
    const col = makeCol(b, [body], 100, { padH: 32, align: "center" });
    makeSection(b, [makeRow(b, [col], 640)], { bgColor: md, ptD: 56, pbD: 56, ptM: 40, pbM: 40 });
  }

  // ── 12. Final CTA (primary bg, centered) ─────────────────────────────────────
  {
    const body = makeParagraph(b, sl.finalCta, {
      color: ss("#ffffff"), fontSize: sv(20), lineHeight: ss("1.75em"),
      fontWeight: ss("500"), textAlign: ss("center"), paddingBottom: sv(32),
    }, { fontSize: sv(16) });
    const btn = makeButton(b, "Yes — I'm Ready to Start →", "url", "", {
      backgroundColor: ss("#ffffff"), color: ss(p),
      paddingTop: sv(20), paddingBottom: sv(20), paddingLeft: sv(48), paddingRight: sv(48),
      fontSize: sv(18), borderColor: ss("#ffffff"),
    });
    const col = makeCol(b, [body, btn], 100, { padH: 32, align: "center" });
    makeSection(b, [makeRow(b, [col], 600)], { bgColor: p, ptD: 100, pbD: 100, ptM: 72, pbM: 72 });
  }

  buildFooter(b, s);

  return sanitizePageData(finalize(b, s));
}

// ── APPLICATION LANDING PAGE — pure template passthrough ─────────────────────
//
const APP_LANDING_BUTTON_IDS = [
  "button-VNuCo6tLUaq", "button-6F0W9reKOkb",
  "button-G_PgzhYgdX5", "button-NPFXJi_u4Oj",
  "button-JUlhAy3fm26", "button-4RmvfMFwZL3",
  "button-XUC4z-jtk-uK", "button-sJIgg-l_A2Bk",
  "button-dqivDvPukA6W", "button-BP2qYN51lxCo",
  "button-8_PI5laVbnxL", "button-DNjLGy_UOY06",
  "button-p9G9HbFSrq5I", "button-aF_VVlBlBjfs",
] as const;

export function buildApplicationLandingPageData(data: GeneratedFunnelAssets): GhlPageData {
  const al = data.applicationLandingPage;
  if (!al) throw new Error("applicationLandingPage is required");

  const photoUrl = ((data as unknown as Record<string, unknown>).coachPhotoUrl as string | undefined) ?? "";
  const videoUrl = ((data as unknown as Record<string, unknown>).coachVideoUrl as string | undefined) ?? "";

  // Deep-clone the native 22-section template (full live Firebase format — all styles intact)
  const page = JSON.parse(JSON.stringify(APP_PAGE_TEMPLATE)) as GhlPageData;

  // Build element lookup across all sections
  const byId = new Map<string, Record<string, unknown>>();
  for (const sec of page.sections)
    for (const el of (sec.elements ?? []) as Record<string, unknown>[])
      byId.set(el.id as string, el);

  function setH(id: string, text: string): void {
    const el = byId.get(id);
    if (!el || !text) return;
    const tag = (el.tag as string) || "h2";
    (el.extra as Record<string, unknown>).text = { value: `<${tag}>${text}</${tag}>` };
  }

  function setBtn(id: string, text: string): void {
    const el = byId.get(id);
    if (!el || !text) return;
    ((el.extra as Record<string, unknown>).text as Record<string, unknown>).value = text;
  }

  function setVid(id: string, url: string): void {
    if (!url) return;
    const el = byId.get(id);
    if (!el) return;
    const vid = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^?&\n]{11})/)?.[1] ?? "";
    const props = ((el.extra as Record<string, unknown>).videoProperties as Record<string, unknown>).value as Record<string, unknown>;
    props.url = url;
    props.embedURL = `https://www.youtube.com/embed/${vid}?autoplay=0&rel=0&controls=0`;
    props.thumbnailURL = `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`;
  }

  function setImg(id: string, url: string): void {
    if (!url) return;
    const el = byId.get(id);
    if (!el) return;
    const props = ((el.extra as Record<string, unknown>).imageProperties as Record<string, unknown>).value as Record<string, unknown>;
    props.url = url;
    props.servingUrl = "";
    props.placeholderBase64 = "";
  }

  // Sets raw HTML directly on a sub-heading element (no heading tag wrapping)
  function setSubH(id: string, html: string): void {
    const el = byId.get(id);
    if (!el || !html) return;
    (el.extra as Record<string, unknown>).text = { value: html };
  }

  const RICK_ROLL_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  // Decorative arrow images flanking the hero CTA button — keep originals
  const KEEP_ORIGINAL_IMAGE_IDS = new Set([
    "image-OQBLc5fXIvH", // left arrow
    "image-ECSXZa0Fgcz", // right arrow
  ]);

  // Force uniform 400×400 square for the 4 coach transformation cards
  const SQUARE_IMAGE_IDS = new Set([
    "image-HxJsjcn1-rj",
    "image-5F0zvBTNVBM",
    "image-r1QRMnqL0md",
    "image-D3RhaKGQKM-",
    // Section 18 "Real Progress" gallery — force uniform 350×350
    "image-i7afiA-ETx9N", "image-WZkzbSVA58_2", "image-Fj9FRKY3ZquK",
    "image-Xli80zyRcW2Q", "image-Y9DmxTo2ZEil", "image-PcwIHpBU9ulS",
    "image-XpMEn-rt2IsE", "image-5vou4GGboZlU", "image-0skWSKJGYq5G",
  ]);

  // Pre-identify device mockup elements by URL BEFORE placeholder loop overwrites them
  const DEVICE_MOCKUP_URL_FRAGMENT = "61851b46290c5b61b2e6739d.png";
  const deviceMockupIds = new Set<string>();
  for (const sec of page.sections)
    for (const el of (sec.elements ?? []) as Record<string, unknown>[]) {
      if ((el.meta as string) !== "image") continue;
      const imgProps = ((el.extra as Record<string, unknown>).imageProperties as Record<string, unknown>)?.value as Record<string, unknown> | undefined;
      if (String(imgProps?.url ?? "").includes(DEVICE_MOCKUP_URL_FRAGMENT))
        deviceMockupIds.add(el.id as string);
    }
  // image-6e0WmsLWqrn: narrow 8.33% left spacer column — not a device mockup
  // image-TGSdIKkezfu: client testimonial photo slot — not a device mockup
  // image-7raUDY4EF6ei: duplicate mockup in the same column as image-QAKnhYeMXD4W
  deviceMockupIds.delete("image-6e0WmsLWqrn");
  deviceMockupIds.delete("image-TGSdIKkezfu");
  deviceMockupIds.delete("image-7raUDY4EF6ei");
  // image-tfgielG28WhY: CTA row device mockup in section-WPVD3X08-hu (different CDN URL, same pattern)
  deviceMockupIds.add("image-tfgielG28WhY");

  // Parse a CSS/numeric dimension string → pixel integer (returns null if invalid)
  const parseDim = (v: unknown): number | null => {
    if (!v) return null;
    const n = parseInt(String(v).replace(/[^0-9]/g, ""), 10);
    return isNaN(n) || n <= 0 ? null : n;
  };

  // Replace all other original images with size-matched placeholders
  for (const sec of page.sections)
    for (const el of (sec.elements ?? []) as Record<string, unknown>[]) {
      if ((el.meta as string) !== "image") continue;
      if (KEEP_ORIGINAL_IMAGE_IDS.has(el.id as string)) continue;
      if (deviceMockupIds.has(el.id as string)) continue;
      const props = ((el.extra as Record<string, unknown>).imageProperties as Record<string, unknown>).value as Record<string, unknown>;
      if ((el.id as string) === "image-nsjFovBSkSa") {
        props.url = "https://placehold.co/800x100/000000/000000";
      } else if ((el.id as string) === "image-8ee1zVG1yd-") {
        props.url = "https://placehold.co/600x150/cccccc/888888?text=Image+Placeholder";
      } else if (["image-HxJsjcn1-rj","image-5F0zvBTNVBM","image-r1QRMnqL0md","image-D3RhaKGQKM-"].includes(el.id as string)) {
        props.url = "https://placehold.co/400x400/cccccc/888888?text=Image+Placeholder";
        props.width = "";
        props.height = "";
      } else if (SQUARE_IMAGE_IDS.has(el.id as string)) {
        props.url = "https://placehold.co/350x350/cccccc/888888?text=Image+Placeholder";
      } else if (["image-6e0WmsLWqrn","image-7raUDY4EF6ei"].includes(el.id as string)) {
        props.url = "https://placehold.co/1x1/ffffff/ffffff";
      } else if ([
        // section-UZvyII6XSc coaching client testimonial photos
        "image-vLTSAbHKiL4","image-zpUQvEWZkt6","image-COlWuRiURYv","image-VwvNcTjxHrw",
        "image-xeVELQp8U0-","image-ZvjPDkc8HjR","image-TGSdIKkezfu",
        // section-mamQkS7y-C benefit/feature images (no original dimensions → 800×600 default)
        "image-5QkufbB2UgXo","image-_x3KJH03nYy4","image-9wc9RwgY6V1E","image-cgUbxwUoI87R",
      ].includes(el.id as string)) {
        props.url = "https://placehold.co/300x300/cccccc/888888?text=Image+Placeholder";
      } else {
        const w = parseDim(props.width) ?? 800;
        const h = parseDim(props.height) ?? Math.round(w * 0.75);
        props.url = `https://placehold.co/${w}x${h}/cccccc/888888?text=Image+Placeholder`;
      }
      props.servingUrl = "";
      props.placeholderBase64 = "";
    }

  // Device mockup CSS — replaces all detected phones+laptop collage images
  const deviceMockupHtml = `<style>
.dm-wrap{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:24px 8px;flex-wrap:wrap}
.dm-phone{display:flex;flex-direction:column;border:3px solid #d0d0d0;border-radius:18px;background:#f8f8f8;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.12)}
.dm-phone.sm{width:70px;height:130px}
.dm-phone.md{width:85px;height:158px}
.dm-screen{flex:1;background:#e0e0e0;margin:4px;border-radius:10px;display:flex;align-items:center;justify-content:center}
.dm-screen .dot{width:6px;height:6px;border-radius:50%;background:#bbb}
.dm-phone-btn{height:8px;width:30px;background:#d0d0d0;border-radius:0 0 4px 4px;align-self:center;margin-bottom:4px}
.dm-laptop{display:flex;flex-direction:column;align-items:center}
.dm-lid{width:200px;height:130px;background:#222;border-radius:8px 8px 0 0;border:3px solid #555;display:flex;align-items:center;justify-content:center;padding:8px;box-shadow:0 6px 20px rgba(0,0,0,0.25)}
.dm-lid-inner{width:100%;height:100%;background:#1a1a2e;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
.dm-prog{font-size:13px;font-weight:900;color:#f97316;font-family:sans-serif;text-transform:uppercase;text-align:center;line-height:1.1}
.dm-sub{font-size:8px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.1em}
.dm-base{width:220px;height:12px;background:#888;border-radius:0 0 6px 6px}
.dm-foot{width:180px;height:6px;background:#666;border-radius:0 0 4px 4px}
.dm-badge{width:64px;height:64px;border-radius:50%;background:radial-gradient(circle,#ffd700,#b8860b);border:3px solid #ffd700;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(184,134,11,0.5);flex-shrink:0}
.dm-badge span{font-size:8px;font-weight:900;color:#1a1a00;text-transform:uppercase;letter-spacing:0.06em;line-height:1.2;text-align:center}
.dm-access{display:flex;flex-direction:column;align-items:flex-start;flex-shrink:0}
.dm-access .num{font-size:36px;font-weight:900;color:#222;font-family:sans-serif;line-height:1;letter-spacing:-0.02em}
.dm-access .lbl{font-size:12px;font-weight:700;color:#555;letter-spacing:0.08em;text-transform:uppercase}
</style>
<div class="dm-wrap">
  <div class="dm-phone sm"><div class="dm-screen"><div class="dot"></div></div><div class="dm-phone-btn"></div></div>
  <div class="dm-phone md"><div class="dm-screen"><div class="dot"></div></div><div class="dm-phone-btn"></div></div>
  <div class="dm-laptop">
    <div class="dm-lid">
      <div class="dm-lid-inner">
        <div class="dm-prog">Your<br>Program</div>
        <div class="dm-sub">Community · Coaching</div>
      </div>
    </div>
    <div class="dm-base"></div>
    <div class="dm-foot"></div>
  </div>
  <div class="dm-badge"><span>VIP<br>MEMBER</span></div>
  <div class="dm-phone md"><div class="dm-screen"><div class="dot"></div></div><div class="dm-phone-btn"></div></div>
  <div class="dm-phone sm"><div class="dm-screen"><div class="dot"></div></div><div class="dm-phone-btn"></div></div>
  <div class="dm-access"><div class="num">24/7</div><div class="lbl">Access</div></div>
</div>`;

  for (const sec of page.sections)
    for (const el of (sec.elements ?? []) as Record<string, unknown>[]) {
      if (!deviceMockupIds.has((el as Record<string, unknown>).id as string)) continue;
      (el as Record<string, unknown>).meta = "custom-code";
      (el as Record<string, unknown>).tagName = "c-custom-code";
      (el as Record<string, unknown>).extra = {
        customClass: { value: [] },
        customCode:  { value: { rawCustomCode: deviceMockupHtml } },
        nodeId:      `c${(el as Record<string, unknown>).id as string}`,
        visibility:  { value: { hideDesktop: false, hideMobile: false } },
      };
    }

  // Remove device mockup images and narrow spacer images from their parent column
  // child lists so they don't appear in the GHL builder or rendered output.
  const REMOVE_FROM_COLUMNS = new Set([
    // Device mockup collage images in CTA rows (user wants clean button-only CTA rows)
    "image-zrBkKPG1mMG", "image-NcImVoRpttF", "image-QAKnhYeMXD4W",
    "image-Gpj_CYEANduI", "image-tQy9jRus_bRY", "image-tfgielG28WhY",
    // Narrow 8.33% left-spacer images
    "image-6e0WmsLWqrn", "image-2MG5utczSnx", "image-7FRVUjOPaILh", "image-Q-1peOTCLKZk",
  ]);
  for (const el of byId.values()) {
    if (Array.isArray(el.child)) {
      el.child = (el.child as string[]).filter(id => !REMOVE_FROM_COLUMNS.has(id));
    }
  }

  // "As Seen On" carousel — replace image-08WmhnTMPWh in-place with custom-code
  const carouselHtml = `<style>
.aso-wrap{width:100%;overflow:hidden;padding:16px 0 8px}
.aso-label{text-align:center;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;margin-bottom:12px}
.aso-track-outer{overflow:hidden;width:100%}
.aso-track{display:flex;gap:24px;width:max-content;animation:aso-scroll 18s linear infinite}
.aso-track:hover{animation-play-state:paused}
@keyframes aso-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.aso-logo{flex-shrink:0;width:120px;height:48px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#aaa;letter-spacing:0.06em;text-transform:uppercase}
</style>
<div class="aso-wrap">
  <div class="aso-label">As Seen On</div>
  <div class="aso-track-outer">
    <div class="aso-track">
      ${["Media Outlet","Press Feature","TV Feature","Podcast","Magazine","News Site","Radio Show","Online Pub"].map((n) => `<div class="aso-logo">${n}</div>`).join("\n      ")}
      ${["Media Outlet","Press Feature","TV Feature","Podcast","Magazine","News Site","Radio Show","Online Pub"].map((n) => `<div class="aso-logo">${n}</div>`).join("\n      ")}
    </div>
  </div>
</div>`;
  const asoEl = byId.get("image-08WmhnTMPWh");
  if (asoEl) {
    asoEl.meta = "custom-code";
    asoEl.tagName = "c-custom-code";
    asoEl.extra = {
      customClass: { value: [] },
      customCode:  { value: { rawCustomCode: carouselHtml } },
      nodeId:      "cimage-08WmhnTMPWh",
      visibility:  { value: { hideDesktop: false, hideMobile: false } },
    };
  }

  // Hero (section 2)
  setH("heading-XSqOdeY3g0-", al.valuePropHeadline);
  setH("heading-l0iAybOMkzS", al.valuePropSubheadline);
  setH("sub-heading-upEtNflpotY", al.heroCtaSubtext);
  setVid("video-20p-7VhVtF4", videoUrl || RICK_ROLL_URL);
  setVid("video-s26YMI7Zhs9", videoUrl || RICK_ROLL_URL);

  // Coach bio (section 5) — heading uses coach name; testimonials intro kept as-is
  const coachFirstName = data.coachName?.split(" ")[0] ?? "Your Coach";
  setH("heading-3u8EPoD9Qou", `<strong>Who Is ${data.coachName ?? "Your Coach"}, And Why Should I Listen To Them?</strong>`);
  setH("heading-EpE-UucuzD_", `<strong>Hi, my name is ${coachFirstName}...</strong>`);
  setH("heading-xZ7OY1ZTCQB", `<strong>Hi, my name is ${coachFirstName}...</strong>`);
  setImg("image-HxJsjcn1-rj", photoUrl);

  // Align 4 transformation cards in section 5 to top
  const transformRow = byId.get("row-LgRplJ7QXHv");
  if (transformRow) {
    (transformRow.styles as Record<string, unknown>).alignItems = { value: "flex-start" };
  }

  // Inject coach story text + set line spacing for all 3 bio paragraphs
  const COACH_STORY_IDS = ["sub-heading-FvfzFHkx-9U", "sub-heading-0vtmtqgq1Lg", "sub-heading-uegTH1yDDad"] as const;
  const cs = data.coachStory;
  const storyParts = cs ? [cs.part1, cs.part2, cs.part3] : [];
  for (let i = 0; i < COACH_STORY_IDS.length; i++) {
    const shEl = byId.get(COACH_STORY_IDS[i]);
    if (!shEl) continue;
    (shEl.styles as Record<string, unknown>).lineHeight = { value: "1.6", unit: "em" };
    if (storyParts[i]) {
      const html = storyParts[i]
        .split(/\n\n+/)
        .map((p) => `<p>${p.replace(/\n/g, "<br>").trim()}</p>`)
        .join("");
      setSubH(COACH_STORY_IDS[i], html);
    }
  }
  // Bridge headline between part1 (before) and part2 (turning point)
  if (cs?.bridgeHeadline) {
    setH("heading-yuy6jYEoC8b", `<strong>${cs.bridgeHeadline}</strong>`);
  }

  // Add spacing below bullet list elements (sections 15, 17)
  for (const blId of [
    "bulletList-ggLT1qrShFG", "bulletList-AWuJ0-P2vjjd", "bulletList-hktollYcOwpn",
    "bulletList-iPt66D6x8OfW", "bulletList-nfCSb8tH0TnX", "bulletList-y_I3SqcE1w2C",
  ]) {
    const blEl = byId.get(blId);
    if (blEl) (blEl.styles as Record<string, unknown>).paddingBottom = { value: "24", unit: "px" };
  }

  // Will This Work For You (section 6)
  setH("heading-egvCRAPVyZT", al.qualificationSectionHeading);

  // Individual testimonial quote headings (sections 7–9) — first sentence only, white font
  const firstSentence = (q: string): string => {
    const m = q.match(/^[^.!?]*[.!?]/);
    return (m ? m[0] : q).trim();
  };
  setH("heading-gGTM7pLAWp1", `<font color="#ffffff"><strong>${firstSentence(al.textTestimonials[0]?.quote ?? "")}</strong></font>`);
  setH("heading-DxtKO-nccYj", `<font color="#ffffff"><strong>${firstSentence(al.textTestimonials[1]?.quote ?? "")}</strong></font>`);
  setH("heading-ry34q51jror", `<font color="#ffffff"><strong>${firstSentence(al.textTestimonials[2]?.quote ?? "")}</strong></font>`);

  // 5-problems divider (section 12)
  setH("heading-VNPStBY-834", al.dividerHeading);

  // Client wins (section 14)
  setH("heading-bhxtdJhlqxm", al.clientWinsHeading);

  // What you get (section 15)
  setH("heading-XpcooI_gth7", al.whatYouGetHeading);

  // More transformations (section 18)
  setH("heading-jl22ZpQrbIgR", al.transformationGalleryHeading);

  // Footer copyright — update year and replace brand name with placeholder
  const copyrightEl = byId.get("paragraph-FTXmive2endp");
  if (copyrightEl) {
    ((copyrightEl.extra as Record<string, unknown>).text as Record<string, unknown>).value =
      `<p>Copyright © 2026 - Your Company - All Rights Reserved</p>`;
  }

  // All CTA buttons — set text and reduce font size to 28px
  for (const id of APP_LANDING_BUTTON_IDS) {
    setBtn(id, al.heroCtaText);
    const btnEl = byId.get(id);
    if (!btnEl) continue;
    const ex = btnEl.extra as Record<string, unknown>;
    if (ex.desktopFontSize) (ex.desktopFontSize as Record<string, unknown>).value = "28";
    if (ex.mobileFontSize)  (ex.mobileFontSize  as Record<string, unknown>).value = "22";
    (btnEl.styles as Record<string, unknown>).fontSize = { value: "28", unit: "px" };
  }

  // Remove empty trailing section (section-yKSj_u9QJlY)
  page.sections = page.sections.filter(
    (s) => ((s as unknown as Record<string, unknown>).id as string) !== "section-yKSj_u9QJlY",
  );

  // Replace FAQ section (section-rkAIJvdkvxg) with a CSS-only accordion
  const faqSection = page.sections.find(
    (s) => (s as unknown as Record<string, unknown>).id === "section-rkAIJvdkvxg",
  ) as unknown as Record<string, unknown> | undefined;

  if (faqSection && al.faqItems?.length) {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    const accordionHtml = `<style>
  .faq-acc{width:100%;max-width:800px;margin:0 auto;font-family:inherit}
  .faq-acc input[type=checkbox]{display:none}
  .faq-item{border-bottom:1px solid rgba(0,0,0,0.12)}
  .faq-label{display:flex;justify-content:space-between;align-items:center;padding:20px 4px;cursor:pointer;font-size:18px;font-weight:600;color:#111;line-height:1.4;gap:16px}
  .faq-label::after{content:'+';font-size:28px;font-weight:300;flex-shrink:0;transition:transform 0.2s}
  input:checked+.faq-label::after{content:'\\2212'}
  .faq-body{max-height:0;overflow:hidden;transition:max-height 0.35s ease,padding 0.35s ease;font-size:16px;line-height:1.7;color:rgba(0,0,0,0.65);padding:0 4px}
  input:checked~.faq-body{max-height:600px;padding:0 4px 20px}
</style>
<div class="faq-acc">
${al.faqItems
  .map(
    (item, i) => `  <div class="faq-item">
    <input type="checkbox" id="faq-${i}">
    <label class="faq-label" for="faq-${i}">${esc(item.question)}</label>
    <div class="faq-body">${esc(item.answer)}</div>
  </div>`,
  )
  .join("\n")}
</div>`;

    const ccId = "custom-code-faq-accordion";
    const ccEl: Record<string, unknown> = {
      id: ccId,
      meta: "custom-code",
      tagName: "c-custom-code",
      title: "FAQ Accordion",
      type: "element",
      tag: "",
      child: [],
      class: {},
      customCss: [],
      styles: {},
      wrapper: {
        marginBottom: { unit: "px", value: 0 },
        marginLeft: { unit: "px", value: 0 },
        marginRight: { unit: "px", value: 0 },
        marginTop: { unit: "px", value: 0 },
      },
      mobileWrapper: { marginTop: { unit: "px", value: 0 } },
      extra: {
        customClass: { value: [] },
        customCode: { value: { rawCustomCode: accordionHtml } },
        nodeId: `c${ccId}`,
        visibility: { value: { hideDesktop: false, hideMobile: false } },
      },
    };

    // Update col's child list to include the accordion after the heading
    const col = byId.get("col-CVERE-5NmZwJ");
    if (col) (col.child as string[]) = ["heading-HshMw8tZBIBp", ccId];

    // Rebuild section elements: row + col + heading + accordion (drop the other 94 elements)
    const faqRow = byId.get("row-jvy-ZbKnSAq7")!;
    const faqCol = byId.get("col-CVERE-5NmZwJ")!;
    const faqHdg = byId.get("heading-HshMw8tZBIBp")!;
    (faqSection.elements as Record<string, unknown>[]) = [faqRow, faqCol, faqHdg, ccEl];

    // Trim section's row list to just the single header row
    const md = faqSection.metaData as Record<string, unknown>;
    (md.child as string[]) = ["row-jvy-ZbKnSAq7"];
  }

  return page;
}



// ── All pages ─────────────────────────────────────────────────────────────────

export interface AllPageData {
  landing:    GhlPageData;
  optin:      GhlPageData;
  thankYou:   GhlPageData;
  booking:    GhlPageData;
  salesLetter?: GhlPageData;
}

export function buildAllPageData(data: GeneratedFunnelAssets): AllPageData {
  return {
    landing:  buildLandingPageData(data),
    optin:    buildOptInPageData(data),
    thankYou: buildThankYouPageData(data),
    booking:  buildBookingPageData(data),
  };
}
