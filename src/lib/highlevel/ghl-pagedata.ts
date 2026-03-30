import type { GeneratedFunnelAssets } from "@/types/generation";

// ── Colour Scheme ─────────────────────────────────────────────────────────────

interface SchemeColors { primary: string; dark: string; mid: string; accent: string; }

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

function buildEnvelope(schemeKey?: string): Omit<GhlPageData, "sections"> {
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
    ` --text-color:#ffffff;`,
    ` --link-color:${s.primary};`,
    ` --headlinefont:'Bebas Neue',sans-serif;`,
    ` --contentfont:'Poppins',sans-serif;`,
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
  return {
    fontsForPreview: PREVIEW_FONTS.map(f => `'${f}'`),
    general: {
      general: {
        colors,
        customFonts: [],
        fontsToLoad: STANDARD_FONTS,
        fontsToLoadForPreview: PREVIEW_FONTS,
        pageStyles: `body { font-family: var(--contentfont, 'Poppins', sans-serif); }`,
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

function finalize(b: Builder, schemeKey?: string): GhlPageData {
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
  return { ...buildEnvelope(schemeKey), sections: b.sections };
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

// ── LANDING PAGE ──────────────────────────────────────────────────────────────

export function buildLandingPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const s       = getScheme(data.colourScheme);
  const lp      = data.landingPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  // ── 1. HERO ───────────────────────────────────────────────────────────────
  {
    const badge = makeParagraph(b,
      `🔥 Limited Spots — ${concept}`,
      { color: ss(s.primary), fontSize: sv(12), fontWeight: ss("700"), paddingBottom: sv(16), letterSpacing: ss("0.08em"), textTransform: ss("uppercase") },
    );
    const h1 = makeHeading(b,
      lp.headlineOptions[0] ?? `Join the Free ${concept}`,
      "h1",
      { color: ss("#ffffff"), fontSize: sv(46), fontWeight: ss("900"), lineHeight: ss("1.1"), paddingBottom: sv(16) },
      { fontSize: sv(30), paddingBottom: sv(12) },
    );
    const sub = makeParagraph(b,
      lp.subheadline,
      { color: ss("#94a3b8"), fontSize: sv(17), lineHeight: ss("1.7"), paddingBottom: sv(24) },
      { fontSize: sv(15) },
    );
    const bullets = makeBulletList(b, lp.bulletPoints.slice(0, 4), s.primary, { paddingBottom: sv(28) });
    const cta = makeButton(b,
      `${lp.ctaText} →`, "next-step", "",
      { backgroundColor: ss(s.primary), boxShadow: ss(`0 12px 32px ${s.primary}55`) },
    );
    const leftElIds: string[] = [badge, h1, sub, bullets, cta];
    if (lp.urgencyIdeas[0]) {
      leftElIds.push(makeParagraph(b,
        lp.urgencyIdeas[0],
        { color: ss("#f87171"), fontSize: sv(13), fontWeight: ss("600"), paddingTop: sv(14) },
      ));
    }
    const leftCol = makeCol(b, leftElIds, 45, { padH: 24, valign: "middle" });

    const countdownEnd = (() => {
      const d = new Date(); d.setDate(d.getDate() + 7);
      return d.toISOString().slice(0, 16);
    })();
    const countdownLabel = makeParagraph(b,
      "Challenge starts in:",
      { color: ss(s.primary), fontSize: sv(12), fontWeight: ss("700"), textAlign: ss("center"), letterSpacing: ss("0.1em"), textTransform: ss("uppercase"), paddingBottom: sv(4) },
    );
    const countdown = makeCountdown(b, countdownEnd, { paddingBottom: sv(20) });
    const videoEl   = makeVideo(b,
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      { borderRadius: sv(16), boxShadow: ss(`0 24px 64px rgba(0,0,0,0.5)`) },
    );
    const videoNote = makeParagraph(b,
      "▶  Replace this video with your own challenge intro",
      { color: ss("rgba(148,163,184,0.6)"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(8) },
    );
    const rightCol = makeCol(b, [countdownLabel, countdown, videoEl, videoNote], 55, { padH: 24, valign: "middle" });

    const r = makeRow(b, [leftCol, rightCol], 1200, 0);
    makeSection(b, [r], {
      bg: `linear-gradient(160deg, ${s.dark} 0%, ${s.mid} 55%, ${s.dark} 100%)`,
      ptD: 88, pbD: 88, ptM: 56, pbM: 56,
    });
  }

  // ── 2. SOCIAL PROOF BAR ───────────────────────────────────────────────────
  {
    const stars   = makeParagraph(b, "⭐⭐⭐⭐⭐  500+ coaches launched",
      { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") });
    const sep     = makeParagraph(b, "·",
      { color: ss("rgba(255,255,255,0.2)"), fontSize: sv(20), textAlign: ss("center") });
    const promise = makeParagraph(b, `✓  ${data.offerSummary.corePromise}`,
      { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") });
    const sep2    = makeParagraph(b, "·",
      { color: ss("rgba(255,255,255,0.2)"), fontSize: sv(20), textAlign: ss("center") });
    const noCard  = makeParagraph(b, "✓  No credit card required",
      { color: ss("#94a3b8"), fontSize: sv(13), textAlign: ss("center") });
    const c1 = makeCol(b, [stars],   33, { align: "center" });
    const c2 = makeCol(b, [sep],      4, { align: "center" });
    const c3 = makeCol(b, [promise], 26, { align: "center" });
    const c4 = makeCol(b, [sep2],     4, { align: "center" });
    const c5 = makeCol(b, [noCard],  33, { align: "center" });
    const r  = makeRow(b, [c1, c2, c3, c4, c5], 1200, 24);
    makeSection(b, [r], { bgColor: s.mid, ptD: 20, pbD: 20, ptM: 16, pbM: 16 });
  }

  // ── 3. BENEFITS ───────────────────────────────────────────────────────────
  {
    const coachImg = makeImage(b, { width: 480 });
    const imgNote  = makeParagraph(b,
      "📸 Replace with your coach/before-after photo",
      { color: ss("rgba(107,114,128,0.7)"), fontSize: sv(11), textAlign: ss("center"), paddingTop: sv(8) });
    const imgCol   = makeCol(b, [coachImg, imgNote], 40, { padH: 24, valign: "middle" });

    const eyebrow = makeParagraph(b,
      "What You'll Get",
      { color: ss(s.primary), fontSize: sv(11), fontWeight: ss("700"), letterSpacing: ss("0.12em"), textTransform: ss("uppercase"), paddingBottom: sv(8) });
    const h2 = makeHeading(b,
      "Everything included in your free challenge",
      "h2",
      { color: ss("#111827"), fontSize: sv(36), fontWeight: ss("800"), lineHeight: ss("1.2"), paddingBottom: sv(16), maxWidth: sv(520) },
      { fontSize: sv(24), paddingBottom: sv(12) },
    );
    const textCol   = makeCol(b, [eyebrow, h2], 60, { padH: 24, valign: "middle" });
    const headerRow = makeRow(b, [imgCol, textCol], 1100, 0);

    const allBullets = lp.bulletPoints.slice(0, 9);
    const perRow  = 3;
    const bulletRows: string[] = [];
    for (let start = 0; start < allBullets.length; start += perRow) {
      const rowBullets = allBullets.slice(start, start + perRow);
      const colWidth   = Math.floor(100 / rowBullets.length);
      const colIds = rowBullets.map((b_text) => {
        const icon = makeParagraph(b, "✓", {
          color: ss(s.primary), fontSize: sv(22), fontWeight: ss("900"), paddingBottom: sv(8),
        });
        const txt = makeParagraph(b, b_text, {
          color: ss("#374151"), fontSize: sv(15), lineHeight: ss("1.6"),
        });
        return makeCol(b, [icon, txt], colWidth, { padH: 24, padV: 20 });
      });
      bulletRows.push(makeRow(b, colIds, 1200, 0));
    }
    makeSection(b, [headerRow, ...bulletRows], { bgColor: "#ffffff", ptD: 88, pbD: 88, ptM: 56, pbM: 56 });
  }

  // ── 4. FAQ ────────────────────────────────────────────────────────────────
  if (lp.faqItems.length > 0) {
    const heading = makeHeading(b,
      "Frequently Asked Questions", "h2",
      { color: ss("#111827"), fontSize: sv(30), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(44) },
      { fontSize: sv(22) },
    );
    const faqEls = lp.faqItems.slice(0, 5).flatMap((f) => [
      makeHeading(b, f.question, "h3", {
        color: ss("#111827"), fontSize: sv(16), fontWeight: ss("700"),
        paddingTop: sv(24), paddingBottom: sv(8),
      }),
      makeParagraph(b, f.answer, {
        color: ss("#6b7280"), fontSize: sv(15), lineHeight: ss("1.7"), paddingBottom: sv(4),
      }),
      makeDivider(b),
    ]);
    const c = makeCol(b, [heading, ...faqEls], 100, { padH: 0 });
    const r = makeRow(b, [c], 680, 24);
    makeSection(b, [r], { bgColor: "#f8fafc", ptD: 72, pbD: 80, ptM: 48, pbM: 56 });
  }

  // ── 5. FINAL CTA ──────────────────────────────────────────────────────────
  {
    const h2 = makeHeading(b,
      "Ready to start? Spots are limited.", "h2",
      { color: ss("#ffffff"), fontSize: sv(40), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.12"), paddingBottom: sv(16), maxWidth: sv(600), marginLeft: ss("auto"), marginRight: ss("auto") },
      { fontSize: sv(26) },
    );
    const urgency = makeParagraph(b,
      lp.urgencyIdeas[1] ?? "Claim your free spot before they're gone.",
      { color: ss("rgba(255,255,255,0.82)"), fontSize: sv(17), textAlign: ss("center"), paddingBottom: sv(36) },
    );
    const cta = makeButton(b,
      `${lp.ctaText} →`, "next-step", "",
      { backgroundColor: ss("#ffffff"), color: ss(s.primary), boxShadow: ss("0 8px 24px rgba(0,0,0,0.18)") },
    );
    const c = makeCol(b, [h2, urgency, cta], 100, { align: "center", padH: 32 });
    const r = makeRow(b, [c], 640);
    makeSection(b, [r], {
      bg: `linear-gradient(135deg, ${s.primary} 0%, ${s.accent} 100%)`,
      ptD: 88, pbD: 88,
    });
  }

  return finalize(b, data.colourScheme);
}

// ── OPT-IN PAGE ───────────────────────────────────────────────────────────────

export function buildOptInPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const s       = getScheme(data.colourScheme);
  const form    = data.optInForm;
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

  return finalize(b, data.colourScheme);
}

// ── THANK YOU PAGE ────────────────────────────────────────────────────────────

export function buildThankYouPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const s       = getScheme(data.colourScheme);
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
      { color: ss("#111827"), fontSize: sv(32), fontWeight: ss("900"), textAlign: ss("center"), lineHeight: ss("1.2"), paddingBottom: sv(40) },
      { fontSize: sv(22) },
    );
    const stepEls = ty.nextSteps.flatMap((step, i) => [
      makeParagraph(b, `${i + 1}. ${step}`, {
        color: ss("#374151"), fontSize: sv(15), lineHeight: ss("1.65"),
        paddingTop: sv(16), paddingBottom: sv(16),
        paddingLeft: sv(20), paddingRight: sv(20),
        backgroundColor: ss("#f8fafc"),
        borderRadius: sv(12),
        marginBottom: sv(10),
      }),
    ]);
    const c = makeCol(b, [eyebrow, h2, ...stepEls], 100, { padH: 0 });
    const r = makeRow(b, [c], 620, 24);
    makeSection(b, [r], { bgColor: "#ffffff", ptD: 80, pbD: 80, ptM: 48, pbM: 48 });
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

  return finalize(b, data.colourScheme);
}

// ── BOOKING PAGE ──────────────────────────────────────────────────────────────

export function buildBookingPageData(data: GeneratedFunnelAssets): GhlPageData {
  const b = createBuilder();
  const s       = getScheme(data.colourScheme);
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
        color: ss("#374151"), fontSize: sv(15), lineHeight: ss("1.65"), paddingBottom: sv(12),
      })
    );
    const expectLabel = makeParagraph(b,
      "What to expect on the call",
      { color: ss(s.accent), fontSize: sv(13), fontWeight: ss("700"), paddingTop: sv(20), paddingBottom: sv(6) },
    );
    const expectText = makeParagraph(b,
      bk.expectationSetting,
      { color: ss("#374151"), fontSize: sv(13), lineHeight: ss("1.6") },
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
      { color: ss("#111827"), fontSize: sv(16), fontWeight: ss("700"), textAlign: ss("center"), paddingBottom: sv(6) },
    );
    const calSub = makeParagraph(b,
      "Connect your GHL Calendar element here after import.",
      { color: ss("#9ca3af"), fontSize: sv(12), textAlign: ss("center"), paddingBottom: sv(24) },
    );
    const calPlaceholder = makeParagraph(b,
      "📅  Drag your GHL Calendar element from the Elements panel into this column",
      { color: ss("#9ca3af"), fontSize: sv(13), textAlign: ss("center"), lineHeight: ss("1.6"),
        paddingTop: sv(32), paddingBottom: sv(32), paddingLeft: sv(24), paddingRight: sv(24),
        backgroundColor: ss("#f8fafc"), borderRadius: sv(12) },
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
    makeSection(b, [r], { bgColor: "#f8fafc", ptD: 72, pbD: 72, ptM: 48, pbM: 48 });
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

  return finalize(b, data.colourScheme);
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
