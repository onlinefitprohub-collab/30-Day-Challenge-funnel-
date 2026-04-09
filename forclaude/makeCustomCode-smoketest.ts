/**
 * makeCustomCode() — verified native GHL element schema
 *
 * Source: attached_assets/Pasted--fontsForPreview...1774701971614.txt
 * Two live specimens captured from a real GHL page payload (lines 19312-19417).
 *
 * Key differences from the previous (broken) version:
 *   meta         → "custom-code"       (was "customCode")
 *   id prefix    → "custom-code-..."   (was "el-...")
 *   nodeId prefix → "ccustom-code-..." (was "cel-...")
 *   styles       → {}                  (was full style map — GHL ignores styles on this element)
 *   class        → {}                  (was border/animation classes)
 *   extra.customCode.value.rawCustomCode → the HTML string
 *
 * Integration notes:
 *   - styles is intentionally empty. GHL renders the rawCustomCode HTML verbatim;
 *     all visual control must come from inline styles in the HTML itself.
 *   - wrapper marginTop is the only spacing lever available from GHL's side.
 *   - The element can be placed anywhere a normal element goes: inside a c-column child array.
 *   - pageStyles / customCss on the section/page can supplement the inline styles if needed.
 */

// TypeScript version (for src/lib/highlevel/ghl-pagedata.ts)
function makeCustomCode(b: Builder, html: string, marginTop = 24): string {
  const suffix = Math.random().toString(36).slice(2, 12);
  const id     = `custom-code-${suffix}`;
  const nid    = `c${id}`;                 // nodeId = "c" + full id

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

// Plain JS version (for chrome-extension or vanilla usage)
function makeCustomCodeJS(b, html, marginTop = 24) {
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
