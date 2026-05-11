import type { GhlPageData, GhlSection } from "./ghl-pagedata";

// Returns the raw CSS value string, keeping var() references intact so the
// browser resolves them against the pageStyles <style> block.
function sv(v: unknown): string | null {
  if (!v || typeof v !== "object") return null;
  const obj = v as { value?: unknown; unit?: string; desktop?: string };
  const raw =
    obj.desktop !== undefined && String(obj.desktop) !== ""
      ? String(obj.desktop)
      : String(obj.value ?? "");
  if (!raw || raw === "undefined" || raw === "null") return null;
  const unit = typeof obj.unit === "string" && obj.unit ? obj.unit : "";
  return unit ? `${raw}${unit}` : raw;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function css(props: Record<string, string | null | undefined>): string {
  return Object.entries(props)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}

interface GhlNode {
  id: string;
  tagName: string;
  meta?: string;
  child: string[];
  styles: Record<string, unknown>;
  extra?: Record<string, unknown>;
  wrapper?: Record<string, unknown>;
  tag?: string;
}

type NodeMap = Map<string, GhlNode>;

// Firebase-native element types use plain names; the renderer expects "c-*" prefixed names.
// This mapping lets both formats share the same switch block.
const FIREBASE_TO_C: Record<string, string> = {
  "row":          "c-row",
  "col":          "c-column",
  "heading":      "c-heading",
  "sub-heading":  "c-sub-heading",
  "paragraph":    "c-paragraph",
  "button":       "c-button",
  "image":        "c-image",
  "video":        "c-video",
  "bulletList":   "c-bullet-list",
  "custom-code":  "c-custom-code",
};

function normalizeTag(node: GhlNode): string {
  const t = node.tagName ?? "";
  if (t.startsWith("c-")) return t;
  const m = node.meta ?? "";
  return FIREBASE_TO_C[t] ?? FIREBASE_TO_C[m] ?? t;
}

function renderNode(nodeId: string, nodeMap: NodeMap): string {
  const node = nodeMap.get(nodeId);
  if (!node) return "";
  const s = node.styles ?? {};
  const extra = node.extra ?? {};
  const children = node.child.map((id) => renderNode(id, nodeMap)).join("");

  switch (normalizeTag(node)) {
    case "c-row": {
      const style = css({
        display: "flex",
        "flex-wrap": "wrap",
        "align-items": sv(s.alignItems) ?? "center",
        width: "100%",
        "box-sizing": "border-box",
        "margin-left": "auto",
        "margin-right": "auto",
        "max-width": sv(s.maxWidth) ?? "1200px",
        "padding-left": sv(s.paddingLeft) ?? "0",
        "padding-right": sv(s.paddingRight) ?? sv(s.paddingLeft) ?? "0",
        "padding-top": sv(s.paddingTop) ?? "0",
        "padding-bottom": sv(s.paddingBottom) ?? "0",
      });
      return `<div style="${style}">${children}</div>`;
    }

    case "c-column": {
      const style = css({
        display: "flex",
        "flex-direction": "column",
        "justify-content": sv(s.justifyContent) ?? "flex-start",
        "box-sizing": "border-box",
        "min-width": "0",
        width: sv(s.width) ?? "100%",
        "padding-left": sv(s.paddingLeft) ?? "8px",
        "padding-right": sv(s.paddingRight) ?? sv(s.paddingLeft) ?? "8px",
        "padding-top": sv(s.paddingTop) ?? "0",
        "padding-bottom": sv(s.paddingBottom) ?? "0",
        "text-align": sv(s.textAlign) ?? undefined,
        "background-color": sv(s.backgroundColor) ?? undefined,
        "align-items": sv(s.alignItems) ?? undefined,
      });
      return `<div style="${style}">${children}</div>`;
    }

    case "c-heading":
    case "c-sub-heading": {
      const rawHtml = String((extra.text as { value?: unknown })?.value ?? "");
      const typo = sv(extra.typography as unknown);
      const fontFamily =
        typo && !typo.includes("var(")
          ? `'${typo}',sans-serif`
          : "var(--headlinefont,'Bebas Neue',sans-serif)";
      const style = css({
        margin: "0",
        "font-size": sv(s.fontSize) ?? undefined,
        color: sv(s.color) ?? undefined,
        "font-weight": sv(s.fontWeight) ?? undefined,
        "line-height": sv(s.lineHeight) ?? undefined,
        "text-align": sv(s.textAlign) ?? undefined,
        "letter-spacing": sv(s.letterSpacing) ?? undefined,
        "text-transform": sv(s.textTransform) ?? undefined,
        "padding-top": sv(s.paddingTop) ?? "0",
        "padding-bottom": sv(s.paddingBottom) ?? "0",
        "font-family": fontFamily,
      });
      // Multi-paragraph content (injected coach story): render as div to avoid
      // invalid <h2><p>…</p></h2> nesting that browsers silently break.
      if (/<p[\s>]/i.test(rawHtml)) {
        return `<div style="${style}">${rawHtml}</div>`;
      }
      const m = rawHtml.match(/^<(h[1-6])[^>]*>([\s\S]*)<\/h[1-6]>$/i);
      const tag = m?.[1] ?? node.tag ?? "h2";
      const inner = m?.[2] ?? rawHtml;
      return `<${tag} style="${style}">${inner}</${tag}>`;
    }

    case "c-paragraph": {
      const rawHtml = String((extra.text as { value?: unknown })?.value ?? "");
      const m = rawHtml.match(/^<p[^>]*>([\s\S]*)<\/p>$/i);
      const inner = m?.[1] ?? rawHtml;
      const style = css({
        margin: "0",
        "font-size": sv(s.fontSize) ?? undefined,
        color: sv(s.color) ?? undefined,
        "font-weight": sv(s.fontWeight) ?? undefined,
        "line-height": sv(s.lineHeight) ?? "1.6em",
        "text-align": sv(s.textAlign) ?? undefined,
        "padding-top": sv(s.paddingTop) ?? "0",
        "padding-bottom": sv(s.paddingBottom) ?? "0",
        "font-family": "var(--contentfont,'Poppins',sans-serif)",
      });
      return `<p style="${style}">${inner}</p>`;
    }

    case "c-button": {
      const label = esc(
        String((extra.text as { value?: unknown })?.value ?? "Click Here"),
      );
      const subText = String(
        (extra.subText as { value?: unknown })?.value ?? "",
      );
      const w = (node.wrapper as Record<string, unknown>) ?? {};
      const wrapAlign = sv(w.textAlign as unknown) ?? "center";
      const style = css({
        display: "inline-block",
        cursor: "pointer",
        "font-weight": "700",
        "border-radius": sv(s.borderRadius) ?? "6px",
        border: "none",
        "text-decoration": "none",
        "background-color":
          sv(s.backgroundColor) ?? "var(--primary,#f97316)",
        color: sv(s.color) ?? "#fff",
        "padding-top": sv(s.paddingTop) ?? "16px",
        "padding-bottom": sv(s.paddingBottom) ?? "16px",
        "padding-left": sv(s.paddingLeft) ?? "32px",
        "padding-right": sv(s.paddingRight) ?? "32px",
        "font-size": sv(s.fontSize) ?? "16px",
        "font-family": "var(--headlinefont,'Bebas Neue',sans-serif)",
        "letter-spacing": sv(s.letterSpacing) ?? "0.04em",
      });
      const sub = subText
        ? `<div style="font-size:12px;opacity:0.8;margin-top:4px">${esc(subText)}</div>`
        : "";
      return `<div style="text-align:${wrapAlign};padding:8px 0"><button style="${style}">${label}</button>${sub}</div>`;
    }

    case "c-image": {
      const imgProps = (
        extra.imageProperties as {
          value?: { url?: string; width?: string };
        }
      )?.value;
      const url = imgProps?.url ?? "";
      const imgW =
        imgProps?.width && imgProps.width !== ""
          ? `${imgProps.width}%`
          : "100%";
      const w = (node.wrapper as Record<string, unknown>) ?? {};
      const wrapAlign =
        sv(w.textAlign as unknown) ?? sv(s.textAlign) ?? "left";
      const radius = sv(s.borderRadius) ?? "0";
      const wrapStyle = css({
        "text-align": wrapAlign,
        "margin-top": sv(w.marginTop as unknown) ?? "0",
        "margin-bottom": sv(w.marginBottom as unknown) ?? "0",
        "padding-left": sv(s.paddingLeft) ?? "0",
        "padding-right": sv(s.paddingRight) ?? "0",
        "padding-top": sv(s.paddingTop) ?? "0",
        "padding-bottom": sv(s.paddingBottom) ?? "0",
      });
      if (!url) {
        return `<div style="${wrapStyle}"><div style="width:${imgW};background:rgba(255,255,255,0.07);border:1px dashed rgba(255,255,255,0.2);border-radius:8px;aspect-ratio:16/9;display:inline-flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);font-size:12px">Image</div></div>`;
      }
      return `<div style="${wrapStyle}"><img src="${esc(url)}" alt="" loading="lazy" style="width:${imgW};max-width:100%;display:inline-block;border-radius:${radius}"></div>`;
    }

    case "c-video": {
      const videoProps = (
        extra.videoProperties as { value?: { thumbnailURL?: string } }
      )?.value;
      const thumbnail = videoProps?.thumbnailURL ?? "";
      const radius = sv(s.borderRadius) ?? "12px";
      if (thumbnail) {
        return `<div style="position:relative;width:100%;border-radius:${radius};overflow:hidden">
  <img src="${esc(thumbnail)}" alt="Video thumbnail" loading="lazy" style="width:100%;display:block">
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)">
    <div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center">
      <div style="width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid transparent;border-left:18px solid #1a1a1a;margin-left:4px"></div>
    </div>
  </div>
</div>`;
      }
      return `<div style="width:100%;height:200px;background:rgba(255,255,255,0.05);border:1px dashed rgba(255,255,255,0.2);border-radius:${radius};display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4)">&#9654; Video</div>`;
    }

    case "c-custom-code": {
      const rawHtml =
        (
          extra.customCode as {
            value?: { rawCustomCode?: string };
          } | undefined
        )?.value?.rawCustomCode ?? "";
      return `<div style="width:100%">${rawHtml}</div>`;
    }

    case "c-divider":
      return `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.15);margin:12px 0">`;

    case "c-form":
      return `<div style="background:rgba(255,255,255,0.05);border:1px dashed rgba(255,255,255,0.2);border-radius:8px;padding:24px;text-align:center;color:rgba(255,255,255,0.4);font-size:12px">Form — connect in GHL builder</div>`;

    case "c-countdown":
      return `<div style="display:flex;gap:12px;justify-content:center;padding:12px 0">${["Days", "Hrs", "Min", "Sec"].map((u) => `<div style="text-align:center"><div style="background:rgba(255,255,255,0.1);border-radius:6px;padding:8px 12px;font-family:monospace;font-size:28px;color:#fff;min-width:48px">00</div><div style="font-size:9px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.08em;margin-top:4px">${u}</div></div>`).join("")}</div>`;

    case "c-bullet-list": {
      const items =
        (extra.items as { value?: Array<{ text?: string }> })?.value ?? [];
      if (!items.length) return "";
      const color = sv(s.color) ?? "var(--text-color,#fff)";
      const iconColor =
        sv(extra.iconColor as unknown) ?? "var(--primary,#f97316)";
      const fontSize = sv(s.fontSize) ?? "16px";
      const lineHeight = sv(s.lineHeight) ?? "1.7em";
      return `<ul style="list-style:none;padding:0;margin:0;color:${color};font-size:${fontSize};line-height:${lineHeight}">${items.map((item) => `<li style="display:flex;align-items:flex-start;gap:8px;margin-bottom:16px"><span style="color:${iconColor};flex-shrink:0;margin-top:2px;font-size:14px">&#10003;</span><span>${esc(item.text ?? "")}</span></li>`).join("")}</ul>`;
    }

    case "c-faq": {
      const items = (
        extra.faqList as { value?: Array<{ id: number; heading: string; text: string; active: boolean }> } | undefined
      )?.value ?? [];
      if (!items.length) return children;
      const color = sv(s.color) ?? "var(--text-color,#1a1a2e)";
      const faqs = items.map((item) => {
        const qMatch = item.heading.match(/^<h[1-6][^>]*>([\s\S]*)<\/h[1-6]>$/i);
        const q = qMatch?.[1] ?? item.heading;
        const aMatch = item.text.match(/^<p[^>]*>([\s\S]*)<\/p>$/i);
        const a = aMatch?.[1] ?? item.text;
        return `<details${item.active ? " open" : ""} style="border-bottom:1px solid rgba(0,0,0,0.1);padding:4px 0;color:${color}">
  <summary style="font-weight:600;font-size:15px;line-height:1.4;padding:14px 0;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;font-family:var(--contentfont,'Poppins',sans-serif)">${q}<span style="font-size:11px;margin-left:12px;flex-shrink:0;opacity:0.6">▼</span></summary>
  <p style="padding:0 0 14px;font-size:14px;line-height:1.6;opacity:0.85;margin:0;font-family:var(--contentfont,'Poppins',sans-serif)">${a}</p>
</details>`;
      }).join("\n");
      return `<div style="width:100%">${faqs}</div>`;
    }

    default:
      return children;
  }
}

function renderSection(section: GhlSection): string {
  const meta = section.metaData as Record<string, unknown>;
  const styles = (meta.styles ?? {}) as Record<string, unknown>;
  const rootRowIds = Array.isArray(meta.child)
    ? (meta.child as string[])
    : [];

  const nodeMap: NodeMap = new Map();
  for (const el of section.elements) {
    const node = el as unknown as GhlNode;
    if (node.id) nodeMap.set(node.id, node);
  }

  const pt = sv(styles.paddingTop) ?? "80px";
  const pb = sv(styles.paddingBottom) ?? "80px";
  const bg = sv(styles.background);
  const bgColor = sv(styles.backgroundColor);
  const bgImage = sv(styles.backgroundImage);

  const styleParts: string[] = [
    "width:100%",
    "box-sizing:border-box",
    `padding-top:${pt}`,
    `padding-bottom:${pb}`,
  ];

  if (bg && bg !== "none" && bg !== "transparent") {
    styleParts.push(`background:${bg}`);
  } else if (bgColor && bgColor !== "transparent" && bgColor !== "none") {
    styleParts.push(`background-color:${bgColor}`);
  }
  if (bgImage && bgImage !== "none") {
    styleParts.push(`background-image:${bgImage}`);
    styleParts.push(
      `background-size:${sv(styles.backgroundSize) ?? "cover"}`,
    );
    styleParts.push(
      `background-position:${sv(styles.backgroundPosition) ?? "center"}`,
    );
    const bgRepeat = sv(styles.backgroundRepeat);
    if (bgRepeat) styleParts.push(`background-repeat:${bgRepeat}`);
  }

  const rowsHtml = rootRowIds
    .map((id) => renderNode(id, nodeMap))
    .join("\n");
  return `<div style="${styleParts.join(";")}">\n${rowsHtml}\n</div>`;
}

export function renderPageToHtml(pageData: GhlPageData): string {
  const pageStyles = (pageData as unknown as Record<string, unknown>).pageStyles as string ?? "";
  const sectionsHtml = pageData.sections.map(renderSection).join("\n\n");

  const fontFamilies: string[] =
    Array.isArray(pageData.fontsForPreview) && pageData.fontsForPreview.length > 0
      ? pageData.fontsForPreview
      : ["Bebas Neue", "Poppins"];
  const googleFontsUrl =
    "https://fonts.googleapis.com/css2?" +
    fontFamilies.map((f) => `family=${encodeURIComponent(f)}:ital,wght@0,400;0,600;0,700;0,900;1,400`).join("&") +
    "&display=swap";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="${googleFontsUrl}" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box}
body{margin:0;padding:0;font-family:var(--contentfont,'Poppins',sans-serif)}
img{max-width:100%;height:auto}
h1,h2,h3,h4,h5,h6{margin:0}
p{margin:0}
button{font-family:inherit;cursor:pointer;border:none}
a{color:inherit}
${pageStyles}
</style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;
}
