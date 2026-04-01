import type { GeneratedFunnelAssets, LandingPageCopy } from "@/types/generation";

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
  entranceAnimation: { value: null },
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
        pageStyles: `body { font-family: var(--contentfont, 'Poppins', sans-serif); background-color: var(--dark, #0f172a); color: #ffffff; }`,
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
    function dfs(ids: string[]) {
      for (const id of ids) {
        const node = b.nodes[id];
        if (!node) continue;
        flat.push(node);
        dfs((node.child as string[]) ?? []);
      }
    }
    dfs(rootIds);
    sec.elements = flat;
  }
  return { ...buildEnvelope(s), sections: b.sections };
}

// ── Section ───────────────────────────────────────────────────────────────────

interface SectionOpts {
  bg?: string; bgColor?: string;
  ptD?: number; pbD?: number; ptM?: number; pbM?: number;
}

function makeSection(b: Builder, rowIds: string[], opts: SectionOpts = {}): void {
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
      child: rowIds,
      class: {
        width:        { value: "fullSection" },
        borders:      { value: "noBorder" },
        borderRadius: { value: "radius0" },
        radiusEdge:   { value: "none" },
      },
      styles,
      extra: {
        sticky:            { value: "noneSticky" },
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
  opts: { padH?: number; padV?: number; align?: string; valign?: string } = {},
): string {
  const id = ghlId("col");
  const styles: GhlElem = {
    boxShadow:       { value: "none" },
    paddingLeft:     { value: opts.padH ?? 16, unit: "px" },
    paddingRight:    { value: opts.padH ?? 16, unit: "px" },
    paddingTop:      { value: opts.padV ?? 0,  unit: "px" },
    paddingBottom:   { value: opts.padV ?? 0,  unit: "px" },
    backgroundColor: { value: "var(--transparent)" },
    background:      { value: "none" },
    backdropFilter:  { value: "none" },
    borderColor:     { value: "var(--black)" },
    borderWidth:     { value: "2", unit: "px" },
    borderStyle:     { value: "solid" },
    width:           { value: widthPct, unit: "%" },
  };
  if (opts.align)  styles.textAlign     = { value: opts.align };
  if (opts.valign) styles.verticalAlign = { value: opts.valign };

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
      hoverAnimation: { value: null },
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
      iconColor:       { value: "var(--white)" },
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
    styles:        {},
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

function makeImage(b: Builder, opts: { url?: string; width?: number } = {}): string {
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
    styles:        {},
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

function makeDivider(b: Builder): string {
  const id = ghlId("el");
  b.nodes[id] = {
    extra: {
      nodeId:         `c${id}`,
      visibility:     VISIBILITY,
      customClass:    { value: [] },
      elementVersion: { value: 2 },
    },
    class: { ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles:        {},
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
      iconColor:       { value: primary },
      iconSize:        { value: "18px" },
      listItemSpacing: { value: "10px" },
      customClass:     { value: [] },
      elementVersion:  { value: 2 },
    },
    class: { ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles: {
      fontSize:      { value: 16, unit: "px" },
      color:         { value: "#e2e8f0" },
      lineHeight:    { value: 1.7, unit: "em" },
      paddingBottom: { value: 8, unit: "px" },
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

// ── LANDING PAGE ──────────────────────────────────────────────────────────────

// ── Hero layout variants ───────────────────────────────────────────────────

function _heroCountdownEnd(): string {
  const d = new Date(); d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 16);
}

function buildHeroTwoColVideo(b: Builder, s: SchemeColors, lp: LandingPageCopy, concept: string): void {
  const badgeLabel = concept.replace(/^\d+-Day\s+/i, "").slice(0, 35);
  const badge = makeParagraph(b, `🔥 ${badgeLabel} — Limited Spots`,
    { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), paddingTop: sv(6), paddingBottom: sv(6), letterSpacing: ss("0.1em"), textTransform: ss("uppercase") });
  const h1 = makeHeading(b, lp.headlineOptions[0] ?? `Join the Free ${concept}`, "h1",
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

function buildHeroCentered(b: Builder, s: SchemeColors, lp: LandingPageCopy, concept: string): void {
  const badgeLabel = concept.replace(/^\d+-Day\s+/i, "").slice(0, 35);
  const badge = makeParagraph(b, `🔥 ${badgeLabel} — Limited Spots`,
    { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), paddingTop: sv(6), paddingBottom: sv(6), letterSpacing: ss("0.1em"), textTransform: ss("uppercase"), textAlign: ss("center") });
  const h1 = makeHeading(b, lp.headlineOptions[0] ?? `Join the Free ${concept}`, "h1",
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

function buildHeroTwoColImage(b: Builder, s: SchemeColors, lp: LandingPageCopy, concept: string): void {
  const badgeLabel = concept.replace(/^\d+-Day\s+/i, "").slice(0, 35);
  const badge = makeParagraph(b, `🔥 ${badgeLabel} — Limited Spots`,
    { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), paddingTop: sv(6), paddingBottom: sv(6), letterSpacing: ss("0.1em"), textTransform: ss("uppercase") });
  const h1 = makeHeading(b, lp.headlineOptions[0] ?? `Join the Free ${concept}`, "h1",
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

function buildHeroTwoColCountdown(b: Builder, s: SchemeColors, lp: LandingPageCopy, concept: string): void {
  const badgeLabel = concept.replace(/^\d+-Day\s+/i, "").slice(0, 35);
  const badge = makeParagraph(b, `🔥 ${badgeLabel} — Limited Spots`,
    { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), paddingTop: sv(6), paddingBottom: sv(6), letterSpacing: ss("0.1em"), textTransform: ss("uppercase") });
  const h1 = makeHeading(b, lp.headlineOptions[0] ?? `Join the Free ${concept}`, "h1",
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

function buildHeroFullWidth(b: Builder, s: SchemeColors, lp: LandingPageCopy, concept: string): void {
  const badgeLabel = concept.replace(/^\d+-Day\s+/i, "").slice(0, 35);
  const urgencyBadge = makeParagraph(b, `🔥 ${badgeLabel} — Limited Spots`,
    { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), paddingTop: sv(6), paddingBottom: sv(6), letterSpacing: ss("0.1em"), textTransform: ss("uppercase"), textAlign: ss("center") });
  const h1 = makeHeading(b, lp.headlineOptions[0] ?? `Join the Free ${concept}`, "h1",
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
  const label = makeParagraph(b, "coaches have launched their challenge with us — free",
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
  const c1 = makeStatCol("500+", "Coaches Launched");
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
  const attr = makeParagraph(b, "— 500+ coaches already on board",
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

function buildIncludedThreeColChecks(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const eyebrow    = makeParagraph(b, "What You'll Get",
    { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("700"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(8), textAlign: ss("center") });
  const h2         = makeHeading(b, "Everything included in your free challenge", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(36), fontWeight: ss("800"), lineHeight: ss("1.2"), paddingBottom: sv(0), textAlign: ss("center") },
    { fontSize: sv(24), paddingBottom: sv(12) });
  const headingCol = makeCol(b, [eyebrow, h2], 100, { align: "center", padH: 24 });
  const headingRow = makeRow(b, [headingCol], 800, 0);
  const allBullets = lp.bulletPoints.slice(0, 9);
  const third      = Math.ceil(allBullets.length / 3);
  const bl1        = makeBulletList(b, allBullets.slice(0, third),         s.primary, { color: ss(s.textColorOnLight) });
  const bl2        = makeBulletList(b, allBullets.slice(third, third * 2), s.primary, { color: ss(s.textColorOnLight) });
  const bl3        = makeBulletList(b, allBullets.slice(third * 2),        s.primary, { color: ss(s.textColorOnLight) });
  const col1 = makeCol(b, [bl1], 33, { padH: 24, padV: 16 });
  const col2 = makeCol(b, [bl2], 33, { padH: 24, padV: 16 });
  const col3 = makeCol(b, [bl3], 34, { padH: 24, padV: 16 });
  const bulletsRow = makeRow(b, [col1, col2, col3], 1200, 0);
  makeSection(b, [headingRow, bulletsRow], { bgColor: s.alt, ptD: 48, pbD: 64, ptM: 32, pbM: 48 });
}

function buildIncludedTwoColBullets(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const eyebrow = makeParagraph(b, "What You'll Get",
    { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("700"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(8), textAlign: ss("center") });
  const h2 = makeHeading(b, "Everything included in your free challenge", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(36), fontWeight: ss("800"), lineHeight: ss("1.2"), paddingBottom: sv(0), textAlign: ss("center") },
    { fontSize: sv(24) });
  const headingCol = makeCol(b, [eyebrow, h2], 100, { align: "center", padH: 24 });
  const headingRow = makeRow(b, [headingCol], 800, 0);
  const allBullets = lp.bulletPoints.slice(0, 8);
  const half       = Math.ceil(allBullets.length / 2);
  const bl1        = makeBulletList(b, allBullets.slice(0, half), s.primary, { color: ss(s.textColorOnLight) });
  const bl2        = makeBulletList(b, allBullets.slice(half),    s.primary, { color: ss(s.textColorOnLight) });
  const leftCol    = makeCol(b, [bl1], 50, { padH: 32, padV: 16 });
  const rightCol   = makeCol(b, [bl2], 50, { padH: 32, padV: 16 });
  const bulletsRow = makeRow(b, [leftCol, rightCol], 1100, 0);
  makeSection(b, [headingRow, bulletsRow], { bgColor: s.alt, ptD: 48, pbD: 64, ptM: 32, pbM: 48 });
}

function buildIncludedImageLeftList(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const eyebrow    = makeParagraph(b, "What You'll Get",
    { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("700"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(8), textAlign: ss("center") });
  const h2         = makeHeading(b, "Everything included in your free challenge", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("800"), lineHeight: ss("1.2"), paddingBottom: sv(0), textAlign: ss("center") },
    { fontSize: sv(22) });
  const headingCol = makeCol(b, [eyebrow, h2], 100, { align: "center", padH: 24 });
  const headingRow = makeRow(b, [headingCol], 800, 0);
  const img        = makeImage(b, { width: 520 });
  const imgNote    = makeParagraph(b, "📸 Replace with your programme photo",
    { color: ss("rgba(107,114,128,0.7)"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(8) });
  const imgCol     = makeCol(b, [img, imgNote], 45, { padH: 24, valign: "middle" });
  const bl         = makeBulletList(b, lp.bulletPoints.slice(0, 6), s.primary, { color: ss(s.textColorOnLight) });
  const textCol    = makeCol(b, [bl], 55, { padH: 32, valign: "middle" });
  const contentRow = makeRow(b, [imgCol, textCol], 1100, 0);
  makeSection(b, [headingRow, contentRow], { bgColor: s.alt, ptD: 48, pbD: 64, ptM: 32, pbM: 48 });
}

function buildIncludedSingleColNumbered(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const eyebrow    = makeParagraph(b, "What You'll Get",
    { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("700"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(8), textAlign: ss("center") });
  const h2         = makeHeading(b, "Everything included in your free challenge", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("800"), lineHeight: ss("1.2"), paddingBottom: sv(0), textAlign: ss("center") },
    { fontSize: sv(22) });
  const headingCol = makeCol(b, [eyebrow, h2], 100, { align: "center", padH: 24 });
  const headingRow = makeRow(b, [headingCol], 800, 0);
  const bullets    = lp.bulletPoints.slice(0, 6);
  const itemEls    = bullets.flatMap((txt, i) => {
    const num   = makeParagraph(b, String(i + 1).padStart(2, "0"),
      { color: ss(s.primary), fontSize: sv(28), fontWeight: ss("900"), lineHeight: ss("1"), paddingBottom: sv(4) });
    const label = makeParagraph(b, txt,
      { color: ss(s.textColorOnLight), fontSize: sv(16), lineHeight: ss("1.6"), paddingBottom: sv(24) });
    return i < bullets.length - 1 ? [num, label, makeDivider(b)] : [num, label];
  });
  const contentCol = makeCol(b, itemEls, 100, { padH: 0 });
  const contentRow = makeRow(b, [contentCol], 640, 24);
  makeSection(b, [headingRow, contentRow], { bgColor: s.alt, ptD: 48, pbD: 64, ptM: 32, pbM: 48 });
}

function buildIncludedAlternatingRows(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const eyebrow    = makeParagraph(b, "What You'll Get",
    { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("700"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(8), textAlign: ss("center") });
  const h2         = makeHeading(b, "Everything included in your free challenge", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("800"), lineHeight: ss("1.2"), paddingBottom: sv(0), textAlign: ss("center") },
    { fontSize: sv(22) });
  const headingCol = makeCol(b, [eyebrow, h2], 100, { align: "center", padH: 24 });
  const headingRow = makeRow(b, [headingCol], 800, 0);
  const pairs = lp.bulletPoints.slice(0, 3);
  const altRows = pairs.map((txt, i) => {
    const img     = makeImage(b, { width: 420 });
    const imgNote = makeParagraph(b, "📸 Replace with your programme photo",
      { color: ss("rgba(107,114,128,0.7)"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(8) });
    const imgCol  = makeCol(b, [img, imgNote], 45, { padH: 24, valign: "middle" });
    const num     = makeParagraph(b, String(i + 1).padStart(2, "0"),
      { color: ss(s.primary), fontSize: sv(24), fontWeight: ss("900"), paddingBottom: sv(4) });
    const label   = makeParagraph(b, txt,
      { color: ss(s.textColorOnLight), fontSize: sv(16), lineHeight: ss("1.65") });
    const textCol = makeCol(b, [num, label], 55, { padH: 32, valign: "middle" });
    return i % 2 === 0
      ? makeRow(b, [imgCol, textCol], 1100, 0)
      : makeRow(b, [textCol, imgCol], 1100, 0);
  });
  makeSection(b, [headingRow, ...altRows], { bgColor: s.alt, ptD: 48, pbD: 64, ptM: 32, pbM: 48 });
}

// ── FAQ layout variants ────────────────────────────────────────────────────

function makeFaq(b: Builder, items: { question: string; answer: string }[]): string {
  const id = ghlId("faq");
  b.nodes[id] = {
    extra: {
      nodeId: `c${id}`,
      faqType: { value: "separated" },
      faqList: {
        value: items.map((item, i) => ({
          id: i + 1,
          heading: item.question,
          text: `<p>${item.answer}</p>`,
          showImage: false,
          image: "",
          active: i === 0,
          compression: false,
        })),
      },
      typography: { value: "var(--contentfont)" },
      inlineTypographies: { value: [] },
      faqCustomOptions: {
        value: {
          openIcon: { color: "var(--black)", fontFamily: "Font Awesome 5 Free", name: "chevron-down", unicode: "f078" },
          closeIcon: { color: "var(--black)", fontFamily: "Font Awesome 5 Free", name: "chevron-up", unicode: "f077" },
        },
      },
      visibility: { value: { hideDesktop: false, hideMobile: false } },
      customClass: { value: [] },
    },
    class: { ...BORDER_CLASS },
    styles: {},
    wrapper: {
      marginTop: { unit: "px", value: 0 }, marginBottom: { unit: "px", value: 0 },
      marginLeft: { unit: "px", value: 0 }, marginRight: { unit: "px", value: 0 },
      width: { value: "auto", unit: "" }, height: { value: "auto", unit: "" },
    },
    customCss: [],
    id,
    mobileStyles: {},
    mobileWrapper: {},
    type: "element",
    child: [],
    meta: "faq",
    tagName: "c-faq",
    title: "FAQ",
    tag: "",
  };
  return id;
}

function buildFaqSingleCol(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const heading = makeHeading(b, "Frequently Asked Questions", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(44) },
    { fontSize: sv(22) });
  const faqEl = makeFaq(b, lp.faqItems.slice(0, 5));
  const c = makeCol(b, [heading, faqEl], 100, { padH: 0 });
  const r = makeRow(b, [c], 680, 24);
  makeSection(b, [r], { bgColor: s.alt, ptD: 72, pbD: 80, ptM: 48, pbM: 56 });
}

function buildFaqTwoCol(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const heading    = makeHeading(b, "Frequently Asked Questions", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(44) },
    { fontSize: sv(22) });
  const headingCol = makeCol(b, [heading], 100, { align: "center" });
  const headingRow = makeRow(b, [headingCol], 800, 0);
  const faqEl      = makeFaq(b, lp.faqItems.slice(0, 5));
  const faqCol     = makeCol(b, [faqEl], 100, { padH: 24 });
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
  const faqEl   = makeFaq(b, lp.faqItems.slice(0, 5));
  const textCol = makeCol(b, [heading, faqEl], 65, { padH: 24, valign: "top" });
  const r = makeRow(b, [imgCol, textCol], 1100, 0);
  makeSection(b, [r], { bgColor: s.alt, ptD: 72, pbD: 80, ptM: 48, pbM: 56 });
}

function buildFaqNumbered(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const heading = makeHeading(b, "Frequently Asked Questions", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(44) },
    { fontSize: sv(22) });
  const faqEl = makeFaq(b, lp.faqItems.slice(0, 5));
  const c = makeCol(b, [heading, faqEl], 100, { padH: 0 });
  const r = makeRow(b, [c], 700, 24);
  makeSection(b, [r], { bgColor: s.alt, ptD: 72, pbD: 80, ptM: 48, pbM: 56 });
}

function buildFaqWithInlineCta(b: Builder, s: SchemeColors, lp: LandingPageCopy): void {
  const heading = makeHeading(b, "Frequently Asked Questions", "h2",
    { color: ss(s.textColorOnLight), fontSize: sv(34), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(44) },
    { fontSize: sv(22) });
  const faqEl = makeFaq(b, lp.faqItems.slice(0, 5));
  const cta = makeButton(b, `${lp.ctaText} →`, "next-step", "",
    { backgroundColor: ss(s.primary), boxShadow: ss(`0 8px 24px ${s.primary}44`), borderRadius: ss(s.buttonBorderRadius) });
  const c = makeCol(b, [heading, faqEl, cta], 100, { padH: 0, align: "center" });
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
  const proof = makeParagraph(b, "⭐⭐⭐⭐⭐  Join 500+ coaches already inside",
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

function dispatchHero(b: Builder, s: SchemeColors, lp: LandingPageCopy, concept: string, variant: string): void {
  const VALID = ["hero-centered","hero-two-col-video","hero-two-col-image","hero-two-col-countdown","hero-full-width"] as const;
  const v = pick(VALID, variant);
  if (!VALID.includes(variant as never)) console.warn(`[layout-variant] hero: ${variant ? `unknown variant "${variant}"` : "key absent"}, falling back to "${v}"`);
  console.log(`[layout-variant] hero → ${v}`);
  switch (v) {
    case "hero-centered":           return buildHeroCentered(b, s, lp, concept);
    case "hero-two-col-image":      return buildHeroTwoColImage(b, s, lp, concept);
    case "hero-two-col-countdown":  return buildHeroTwoColCountdown(b, s, lp, concept);
    case "hero-full-width":         return buildHeroFullWidth(b, s, lp, concept);
    default:                        return buildHeroTwoColVideo(b, s, lp, concept);
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

function dispatchWhatsIncluded(b: Builder, s: SchemeColors, lp: LandingPageCopy, variant: string): void {
  // Accept both new prompt names and legacy names for backward compat
  const ALIAS: Record<string, string> = {
    "included-two-col-image":   "included-two-col-bullets",
    "included-icon-grid":       "included-three-col-checks",
    "included-bold-list":       "included-single-col-numbered",
    "included-alternating":     "included-alternating-rows",
  };
  const resolved = ALIAS[variant] ?? variant;
  const VALID = ["included-three-col-checks","included-two-col-bullets","included-image-left-list","included-single-col-numbered","included-alternating-rows"] as const;
  const v = pick(VALID, resolved);
  if (!VALID.includes(resolved as never)) console.warn(`[layout-variant] whats-included: ${variant ? `unknown variant "${variant}"` : "key absent"}, falling back to "${v}"`);
  console.log(`[layout-variant] whats-included → ${v}${resolved !== variant ? ` (alias for "${variant}")` : ""}`);
  switch (v) {
    case "included-two-col-bullets":     return buildIncludedTwoColBullets(b, s, lp);
    case "included-image-left-list":     return buildIncludedImageLeftList(b, s, lp);
    case "included-single-col-numbered": return buildIncludedSingleColNumbered(b, s, lp);
    case "included-alternating-rows":    return buildIncludedAlternatingRows(b, s, lp);
    default:                             return buildIncludedThreeColChecks(b, s, lp);
  }
}

function dispatchFaq(b: Builder, s: SchemeColors, lp: LandingPageCopy, variant: string): void {
  const VALID = ["faq-single-col","faq-two-col","faq-image-left","faq-numbered","faq-with-inline-cta"] as const;
  const v = pick(VALID, variant);
  if (!VALID.includes(variant as never)) console.warn(`[layout-variant] faq: ${variant ? `unknown variant "${variant}"` : "key absent"}, falling back to "${v}"`);
  console.log(`[layout-variant] faq → ${v}`);
  switch (v) {
    case "faq-two-col":         return buildFaqTwoCol(b, s, lp);
    case "faq-image-left":      return buildFaqImageLeft(b, s, lp);
    case "faq-numbered":        return buildFaqNumbered(b, s, lp);
    case "faq-with-inline-cta": return buildFaqWithInlineCta(b, s, lp);
    default:                    return buildFaqSingleCol(b, s, lp);
  }
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

function buildFooter(b: Builder, s: SchemeColors, brandName: string): void {
  const year = new Date().getFullYear();
  const copy = makeParagraph(b,
    `© ${year} ${brandName}. All rights reserved. | Privacy Policy | Terms of Service`,
    { color: ss("rgba(255,255,255,0.5)"), fontSize: sv(12), textAlign: ss("center"), paddingBottom: sv(4) });
  const disclaimer = makeParagraph(b,
    "Results may vary. This challenge is for informational purposes only.",
    { color: ss("rgba(255,255,255,0.3)"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(4) });
  const col = makeCol(b, [copy, disclaimer], 100, { align: "center", padH: 24 });
  const row = makeRow(b, [col], 1200, 0);
  makeSection(b, [row], { bgColor: s.dark, ptD: 32, pbD: 32, ptM: 24, pbM: 24 });
}

export function buildLandingPageData(data: GeneratedFunnelAssets): GhlPageData {
  console.log("[design] applied design:", data.design);
  const b = createBuilder();
  const s = resolveScheme(data);
  const lp      = data.landingPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";
  // Top-level sectionLayoutVariants (new prompt) takes priority;
  // fall back to landingPage.sectionLayoutVariants for backward compat with old records.
  const slv     = data.sectionLayoutVariants ?? lp.sectionLayoutVariants ?? {};

  console.log("[diag] sectionLayoutVariants:", JSON.stringify(slv));

  const countBefore = (label: string) => ({ label, before: b.sections.length });
  const countAfter  = (snap: { label: string; before: number }, variant: string) => {
    const added = b.sections.length - snap.before;
    console.log(`[diag] dispatch:${snap.label} variant="${variant}" added=${added} section(s)`);
  };

  let snap = countBefore("hero");
  dispatchHero(b, s, lp, concept, slv["hero"] ?? "");
  countAfter(snap, slv["hero"] ?? "(none)");

  const skipSocialProof = slv["final-cta"] === "cta-social-proof-cta";
  console.log("[diag] skip-social-proof:", skipSocialProof, "finalCtaVariant:", slv["final-cta"] ?? "(none)");
  if (!skipSocialProof) {
    snap = countBefore("social-proof");
    dispatchSocialProof(b, s, data.offerSummary.corePromise, slv["social-proof"] ?? "");
    countAfter(snap, slv["social-proof"] ?? "(none)");
  }

  snap = countBefore("whats-included");
  dispatchWhatsIncluded(b, s, lp, slv["whats-included"] ?? "");
  countAfter(snap, slv["whats-included"] ?? "(none)");

  if (lp.faqItems.length > 0) {
    snap = countBefore("faq");
    dispatchFaq(b, s, lp, slv["faq"] ?? "");
    countAfter(snap, slv["faq"] ?? "(none)");
  } else {
    console.log("[diag] dispatch:faq skipped (no faqItems)");
  }

  snap = countBefore("final-cta");
  dispatchFinalCta(b, s, lp, slv["final-cta"] ?? "");
  countAfter(snap, slv["final-cta"] ?? "(none)");

  buildFooter(b, s, concept);

  const result = finalize(b, s);
  console.log("[diag] FINAL sections array (" + result.sections.length + " total):");
  result.sections.forEach((sec, i) => {
    const elemCount = sec.elements?.length ?? 0;
    console.log(`  [${i}] id=${sec.id} elements=${elemCount}`);
  });

  return result;
}

// ── OPT-IN PAGE ───────────────────────────────────────────────────────────────

export function buildOptInPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const s    = resolveScheme(data);
  const form = data.optInForm;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  const badge  = makeParagraph(b,
    "Step 1 of 2 — Claim Your Free Spot",
    { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("600"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
  );
  const h1 = makeHeading(b,
    `Join the ${concept} — Free`, "h1",
    { color: ss("#ffffff"), fontSize: sv(44), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(560), marginLeft: ss("auto"), marginRight: ss("auto") },
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

  buildFooter(b, s, concept);

  return finalize(b, s);
}

// ── THANK YOU PAGE ────────────────────────────────────────────────────────────

export function buildThankYouPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const s = resolveScheme(data);
  const ty      = data.thankYouPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  // ── 1. HERO ──────────────────────────────────────────────────────────────
  {
    const badge = makeParagraph(b,
      `🎉  You're in — Welcome to the ${concept}`,
      { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("700"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
    );
    const h1 = makeHeading(b,
      ty.confirmationMessage, "h1",
      { color: ss("#ffffff"), fontSize: sv(46), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(20), maxWidth: sv(740), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(28) },
    );
    const sub = makeParagraph(b,
      ty.bookingEncouragement,
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
    const stepEls = ty.nextSteps.flatMap((step, i) => [
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
      { color: ss("#ffffff"), fontSize: sv(36), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.15"), paddingBottom: sv(14), maxWidth: sv(560), marginLeft: ss("auto"), marginRight: ss("auto") },
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

  buildFooter(b, s, concept);

  return finalize(b, s);
}

// ── BOOKING PAGE ──────────────────────────────────────────────────────────────

export function buildBookingPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const s = resolveScheme(data);
  const bk      = data.bookingPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  // ── 1. HERO ──────────────────────────────────────────────────────────────
  {
    const badge = makeParagraph(b,
      "Almost there — pick a time that works for you",
      { color: ss(s.primary), fontSize: sv(13), fontWeight: ss("600"), textAlign: ss("center"), paddingBottom: sv(20), letterSpacing: ss("0.06em"), textTransform: ss("uppercase") },
    );
    const h1 = makeHeading(b,
      `Book Your Free ${concept} Strategy Call`, "h1",
      { color: ss("#ffffff"), fontSize: sv(44), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(640), marginLeft: ss("auto"), marginRight: ss("auto") },
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
    const whyItems = bk.whyBook.map((reason) =>
      makeParagraph(b, `✓  ${reason}`, {
        color: ss(s.textColorOnLight), fontSize: sv(15), lineHeight: ss("1.65"), paddingBottom: sv(12),
      })
    );
    const expectLabel = makeParagraph(b,
      "What to expect on the call",
      { color: ss(s.accent), fontSize: sv(13), fontWeight: ss("700"), paddingTop: sv(20), paddingBottom: sv(6) },
    );
    const expectText = makeParagraph(b,
      bk.expectationSetting,
      { color: ss(s.textColorOnLight), fontSize: sv(13), lineHeight: ss("1.6") },
    );
    const trustItems = ["Free 30-minute call", "No sales pressure", "100% confidential"].map((t) =>
      makeParagraph(b, `✓  ${t}`, { color: ss("#6b7280"), fontSize: sv(13), paddingBottom: sv(6) })
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
      { color: ss("#9ca3af"), fontSize: sv(12), textAlign: ss("center"), paddingBottom: sv(24) },
    );
    const calPlaceholder = makeParagraph(b,
      "📅  Drag your GHL Calendar element from the Elements panel into this column",
      { color: ss("#9ca3af"), fontSize: sv(13), textAlign: ss("center"), lineHeight: ss("1.6"),
        paddingTop: sv(32), paddingBottom: sv(32), paddingLeft: sv(24), paddingRight: sv(24),
        backgroundColor: ss(s.alt), borderRadius: sv(12) },
    );
    const confirmBtn = makeButton(b,
      "Confirm My Spot →", "next-step", "",
      { backgroundColor: ss(s.primary), marginTop: sv(20) },
    );
    const calMicro = makeParagraph(b,
      "You'll receive a confirmation email immediately after booking.",
      { color: ss("#9ca3af"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(10) },
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
      makeParagraph(b, `✓  ${t}`, { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") })
    );
    const cols = items.map((id) => makeCol(b, [id], 33, { align: "center" }));
    const r    = makeRow(b, cols, 720, 24);
    makeSection(b, [r], { bgColor: s.dark, ptD: 24, pbD: 24, ptM: 20, pbM: 20 });
  }

  buildFooter(b, s, concept);

  return finalize(b, s);
}

// ── All pages ─────────────────────────────────────────────────────────────────

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
