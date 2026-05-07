"use client";

import { useState, useEffect, useRef } from "react";
import type { GhlPageData } from "@/lib/highlevel/ghl-pagedata";

interface Props {
  projectId: string;
  page: "landing" | "optin" | "thankyou" | "booking" | "salesletter";
  templateVariant?: string;
  onLoad?: (info: { templateLabel?: string; templateVariant?: string }) => void;
  /** Called when the page-data fetch fails (404, 500, or network error) */
  onError?: () => void;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HTML sanitizer (strips XSS vectors before dangerouslySetInnerHTML)        */
/* ─────────────────────────────────────────────────────────────────────────── */

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[^>]*>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    // Strip <svg> blocks (can contain onload/onclick handlers)
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    // Sanitize <style> blocks: allow them but strip known CSS XSS vectors
    .replace(/(<style[\s\S]*?>)([\s\S]*?)(<\/style>)/gi, (_m, open, body: string, close) => {
      const safeBody = body
        .replace(/expression\s*\(/gi, "")
        .replace(/-moz-binding\s*:/gi, "")
        .replace(/url\s*\(\s*["']?\s*javascript/gi, "");
      return `${open}${safeBody}${close}`;
    })
    // Strip unquoted event handlers (on* = ...)
    .replace(/\bon\w+\s*=\s*[^\s>]*/gi, "")
    // Strip double-quoted event handlers
    .replace(/\bon\w+\s*=\s*"[^"]*"/gi, "")
    // Strip single-quoted event handlers
    .replace(/\bon\w+\s*=\s*'[^']*'/gi, "")
    // Strip javascript: URIs (including entity-encoded variants)
    .replace(/javascript\s*:/gi, "")
    // Strip HTML-entity encoded javascript: (&amp;#...; patterns)
    .replace(/j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi, "")
    // Strip data: URIs (potential vector for scripts in some browsers)
    .replace(/data\s*:[^,]*;base64/gi, "");
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CSS variable resolution                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

function parseCssVars(pageStyles: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const re = /--([a-zA-Z0-9-]+)\s*:\s*([^;}\n]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(pageStyles)) !== null) {
    vars[`--${m[1].trim()}`] = m[2].trim();
  }
  return vars;
}

function resolveVarStr(val: string, vars: Record<string, string>): string {
  return val.replace(/var\(([^)]+)\)/g, (_, name: string) => {
    const key = name.trim();
    if (key === "--transparent") return "transparent";
    return vars[key] ?? "transparent";
  });
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  GHL style value → CSS string                                               */
/* ─────────────────────────────────────────────────────────────────────────── */

type GhlStyleVal = { value?: unknown; unit?: string; desktop?: string };

function sv(v: unknown, vars: Record<string, string>): string | undefined {
  if (!v || typeof v !== "object") return undefined;
  const obj = v as GhlStyleVal;
  const raw =
    obj.desktop !== undefined && obj.desktop !== ""
      ? String(obj.desktop)
      : String(obj.value ?? "");
  if (raw === "" || raw === "undefined" || raw === "null") return undefined;
  const unit = typeof obj.unit === "string" && obj.unit !== "" ? obj.unit : "";
  const withUnit = unit ? `${raw}${unit}` : raw;
  return withUnit.includes("var(") ? resolveVarStr(withUnit, vars) : withUnit;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Typed node shape (subset of what finalize() produces)                     */
/* ─────────────────────────────────────────────────────────────────────────── */

interface GhlNode {
  id: string;
  tagName: string;
  type: string;
  meta?: string;
  child: string[];
  styles: Record<string, unknown>;
  extra?: Record<string, unknown>;
  wrapper?: Record<string, unknown>;
  tag?: string;
}

type NodeMap = Map<string, GhlNode>;

interface FaqItem {
  id: number;
  heading: string;
  text: string;
  active: boolean;
  showImage?: boolean;
  image?: string;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Element renderers                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */

function stripTag(html: string, tag: string): string {
  const open = `<${tag}>`;
  const close = `</${tag}>`;
  let s = html.trim();
  if (s.startsWith(open)) s = s.slice(open.length);
  if (s.endsWith(close)) s = s.slice(0, s.length - close.length);
  return s.trim();
}

function FaqAccordion({ node, vars }: { node: GhlNode; vars: Record<string, string> }) {
  const items: FaqItem[] = (node.extra?.faqList as { value?: FaqItem[] })?.value ?? [];
  const initialOpen = items.findIndex((item) => item.active);
  const [openIdx, setOpenIdx] = useState<number | null>(
    initialOpen >= 0 ? initialOpen : null,
  );

  if (!items.length) return null;

  const rawColor = vars["--text-color"];
  const textColor = rawColor && !rawColor.startsWith("var(") ? rawColor : "#1a1a2e";

  return (
    <div style={{ width: "100%" }}>
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        const isLast = idx === items.length - 1;
        const questionText = stripTag(item.heading, "h4");
        const answerHtml = sanitizeHtml(stripTag(item.text, "p"));
        return (
          <div
            key={item.id}
            style={{
              borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,0.12)",
            }}
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "14px 0",
                cursor: "pointer",
                background: "none",
                border: "none",
                textAlign: "left",
                color: textColor,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.4 }}>
                {questionText}
              </span>
              <span
                style={{
                  marginLeft: 12,
                  fontSize: 12,
                  flexShrink: 0,
                  display: "inline-block",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                ▼
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: "0 0 14px",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: textColor,
                  opacity: 0.85,
                }}
                dangerouslySetInnerHTML={{ __html: answerHtml }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function RenderChildren({
  childIds,
  nodeMap,
  vars,
}: {
  childIds: string[];
  nodeMap: NodeMap;
  vars: Record<string, string>;
}) {
  return (
    <>
      {childIds.map((id) => (
        <RenderNode key={id} nodeId={id} nodeMap={nodeMap} vars={vars} />
      ))}
    </>
  );
}

function RenderNode({
  nodeId,
  nodeMap,
  vars,
}: {
  nodeId: string;
  nodeMap: NodeMap;
  vars: Record<string, string>;
}) {
  const node = nodeMap.get(nodeId);
  if (!node) return null;

  const s = node.styles ?? {};
  const extra = node.extra ?? {};

  switch (node.tagName) {
    /* ── Row ─────────────────────────────────────────────────────────────── */
    case "c-row": {
      const maxWidth = sv(s.maxWidth, vars) ?? "1200px";
      const padH = sv(s.paddingLeft, vars) ?? "0px";
      const style: React.CSSProperties = {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        width: "100%",
        maxWidth,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: padH,
        paddingRight: padH,
        boxSizing: "border-box",
      };
      return (
        <div style={style}>
          <RenderChildren childIds={node.child} nodeMap={nodeMap} vars={vars} />
        </div>
      );
    }

    /* ── Column ──────────────────────────────────────────────────────────── */
    case "c-column": {
      const width = sv(s.width, vars) ?? "100%";
      const padH = sv(s.paddingLeft, vars) ?? "16px";
      const padV = sv(s.paddingTop, vars) ?? "0px";
      const textAlign = sv(s.textAlign, vars);
      const style: React.CSSProperties = {
        width,
        paddingLeft: padH,
        paddingRight: padH,
        paddingTop: padV,
        paddingBottom: padV,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
        minWidth: 0,
        ...(textAlign ? { textAlign: textAlign as React.CSSProperties["textAlign"] } : {}),
      };
      return (
        <div style={style}>
          <RenderChildren childIds={node.child} nodeMap={nodeMap} vars={vars} />
        </div>
      );
    }

    /* ── Heading ─────────────────────────────────────────────────────────── */
    case "c-heading": {
      const rawHtml =
        typeof (extra.text as { value?: unknown })?.value === "string"
          ? ((extra.text as { value: string }).value)
          : "";
      const sanitized = sanitizeHtml(rawHtml);
      // Extract outer tag and inner HTML so styles apply to the semantic element,
      // not a wrapper div (which would be overridden by browser UA heading styles).
      const headingMatch = sanitized.match(/^<(h[1-4])[^>]*>([\s\S]*)<\/h[1-4]>$/i);
      const TagName = (headingMatch?.[1] ?? node.tag ?? "h2") as
        | "h1" | "h2" | "h3" | "h4";
      const innerHtml = headingMatch?.[2] ?? sanitized;

      const fontSize =
        sv(s.fontSize, vars) ??
        sv(extra.desktopFontSize, vars) ??
        "36px";
      const color = sv(s.color, vars) ?? "#ffffff";
      const fontWeight = sv(s.fontWeight, vars) ?? "700";
      const lineHeight = sv(s.lineHeight, vars) ?? "1.2em";
      const textAlign = sv(s.textAlign, vars);
      const letterSpacing = sv(s.letterSpacing, vars);
      const textTransform = sv(s.textTransform, vars);
      const paddingTop = sv(s.paddingTop, vars) ?? "0px";
      const paddingBottom = sv(s.paddingBottom, vars) ?? "0px";
      const typography = sv(extra.typography as unknown, vars);
      const style: React.CSSProperties = {
        fontSize,
        color,
        fontWeight,
        lineHeight,
        paddingTop,
        paddingBottom,
        margin: 0,
        ...(textAlign ? { textAlign: textAlign as React.CSSProperties["textAlign"] } : {}),
        ...(letterSpacing ? { letterSpacing } : {}),
        ...(textTransform ? { textTransform: textTransform as React.CSSProperties["textTransform"] } : {}),
        ...(typography && !typography.includes("var(")
          ? { fontFamily: typography }
          : { fontFamily: "'Bebas Neue', 'Montserrat', sans-serif" }),
      };
      return (
        <TagName
          style={style}
          dangerouslySetInnerHTML={{ __html: innerHtml }}
        />
      );
    }

    /* ── Paragraph ───────────────────────────────────────────────────────── */
    case "c-paragraph": {
      const rawHtml =
        typeof (extra.text as { value?: unknown })?.value === "string"
          ? ((extra.text as { value: string }).value)
          : "";
      const sanitized = sanitizeHtml(rawHtml);
      // Extract inner HTML from the outer <p> so styles apply to the <p> directly,
      // not a wrapper div (which avoids UA margin/padding overrides).
      const paraMatch = sanitized.match(/^<p[^>]*>([\s\S]*)<\/p>$/i);
      const innerHtml = paraMatch?.[1] ?? sanitized;

      const fontSize =
        sv(s.fontSize, vars) ??
        sv(extra.desktopFontSize, vars) ??
        "16px";
      const color = sv(s.color, vars) ?? "#ffffff";
      const lineHeight = sv(s.lineHeight, vars) ?? "1.6em";
      const textAlign = sv(s.textAlign, vars);
      const letterSpacing = sv(s.letterSpacing, vars);
      const textTransform = sv(s.textTransform, vars);
      const paddingTop = sv(s.paddingTop, vars) ?? "0px";
      const paddingBottom = sv(s.paddingBottom, vars) ?? "0px";
      const fontWeight = sv(s.fontWeight, vars);
      const typography = sv(extra.typography as unknown, vars);
      const style: React.CSSProperties = {
        fontSize,
        color,
        lineHeight,
        paddingTop,
        paddingBottom,
        margin: 0,
        ...(fontWeight ? { fontWeight } : {}),
        ...(textAlign ? { textAlign: textAlign as React.CSSProperties["textAlign"] } : {}),
        ...(letterSpacing ? { letterSpacing } : {}),
        ...(textTransform ? { textTransform: textTransform as React.CSSProperties["textTransform"] } : {}),
        ...(typography && !typography.includes("var(")
          ? { fontFamily: typography }
          : { fontFamily: "'Poppins', sans-serif" }),
      };
      return (
        <p
          style={style}
          dangerouslySetInnerHTML={{ __html: innerHtml }}
        />
      );
    }

    /* ── Button ──────────────────────────────────────────────────────────── */
    case "c-button": {
      const label =
        typeof (extra.text as { value?: unknown })?.value === "string"
          ? ((extra.text as { value: string }).value)
          : "Click Here";
      const bgColor =
        sv(s.backgroundColor, vars) ?? "#f97316";
      const color = sv(s.color, vars) ?? "#ffffff";
      const paddingTop = sv(s.paddingTop, vars) ?? "16px";
      const paddingBottom = sv(s.paddingBottom, vars) ?? "16px";
      const paddingLeft = sv(s.paddingLeft, vars) ?? "32px";
      const paddingRight = sv(s.paddingRight, vars) ?? "32px";
      const fontSize =
        sv(s.fontSize, vars) ??
        sv(extra.desktopFontSize, vars) ??
        "16px";
      const wrapperAlign = sv(
        (node.wrapper as Record<string, unknown>)?.textAlign,
        vars,
      ) ?? "center";
      const wrapperStyle: React.CSSProperties = {
        textAlign: wrapperAlign as React.CSSProperties["textAlign"],
        paddingTop: "8px",
        paddingBottom: "8px",
      };
      const btnStyle: React.CSSProperties = {
        display: "inline-block",
        backgroundColor: bgColor,
        color,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        fontSize,
        fontWeight: "700",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontFamily: "'Bebas Neue', 'Montserrat', sans-serif",
        letterSpacing: "0.04em",
      };
      return (
        <div style={wrapperStyle}>
          <button style={btnStyle}>{label}</button>
        </div>
      );
    }

    /* ── Image ───────────────────────────────────────────────────────────── */
    case "c-image": {
      const imgProps = (extra.imageProperties as { value?: { url?: string } })
        ?.value;
      const url = imgProps?.url ?? "";
      if (!url) {
        return (
          <div
            style={{
              width: "100%",
              height: "160px",
              background: "rgba(255,255,255,0.07)",
              border: "1px dashed rgba(255,255,255,0.2)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.4)",
              fontSize: "12px",
            }}
          >
            Image placeholder
          </div>
        );
      }
      return (
        <img
          src={url}
          alt=""
          style={{ width: "100%", display: "block", borderRadius: "8px" }}
        />
      );
    }

    /* ── Video ───────────────────────────────────────────────────────────── */
    case "c-video": {
      const videoProps = (
        extra.videoProperties as { value?: { thumbnailURL?: string; url?: string } }
      )?.value;
      const thumbnail = videoProps?.thumbnailURL ?? "";
      const borderRadius = sv(s.borderRadius, vars) ?? "12px";
      if (thumbnail) {
        return (
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius,
              overflow: "hidden",
            }}
          >
            <img
              src={thumbnail}
              alt="Video thumbnail"
              style={{ width: "100%", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "10px solid transparent",
                    borderBottom: "10px solid transparent",
                    borderLeft: "18px solid #1a1a1a",
                    marginLeft: "4px",
                  }}
                />
              </div>
            </div>
          </div>
        );
      }
      return (
        <div
          style={{
            width: "100%",
            height: "200px",
            background: "rgba(255,255,255,0.05)",
            border: "1px dashed rgba(255,255,255,0.2)",
            borderRadius,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.4)",
            fontSize: "12px",
          }}
        >
          ▶ Video placeholder
        </div>
      );
    }

    /* ── Divider ─────────────────────────────────────────────────────────── */
    case "c-divider": {
      return (
        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            margin: "12px 0",
          }}
        />
      );
    }

    /* ── Custom Code ─────────────────────────────────────────────────────── */
    case "c-custom-code": {
      const rawHtml =
        (extra.customCode as { value?: { rawCustomCode?: string } } | undefined)
          ?.value?.rawCustomCode ?? "";
      const safe = sanitizeHtml(rawHtml);
      return (
        <div
          style={{ width: "100%" }}
          dangerouslySetInnerHTML={{ __html: safe }}
        />
      );
    }

    /* ── Bullet List ─────────────────────────────────────────────────────── */
    case "c-bullet-list": {
      const items = (
        extra.items as { value?: Array<{ text?: string }> }
      )?.value ?? [];
      const color = sv(s.color, vars) ?? "#1a1a2e";
      const fontSize = sv(s.fontSize, vars) ?? "16px";
      const lineHeight = sv(s.lineHeight, vars) ?? "1.7em";
      const iconColor =
        typeof extra.iconColor === "string"
          ? extra.iconColor
          : sv(extra.iconColor as unknown, vars) ?? "#f97316";
      if (items.length === 0) {
        return (
          <p
            style={{
              color: "rgba(0,0,0,0.35)",
              fontStyle: "italic",
              fontSize: "13px",
              margin: "8px 0",
            }}
          >
            Bullet points will appear here once generated.
          </p>
        );
      }
      return (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            color,
            fontSize,
            lineHeight,
          }}
        >
          {items.map((item, i) => (
            <li
              key={i}
              style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}
            >
              <span
                style={{
                  color: iconColor,
                  flexShrink: 0,
                  marginTop: "2px",
                  fontSize: "14px",
                }}
              >
                ✓
              </span>
              <span>{item.text ?? ""}</span>
            </li>
          ))}
        </ul>
      );
    }

    /* ── Countdown ───────────────────────────────────────────────────────── */
    case "c-countdown": {
      return (
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            padding: "12px 0",
          }}
        >
          {["00", "00", "00", "00"].map((val, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontFamily: "'Bebas Neue', monospace",
                  fontSize: "28px",
                  color: "#ffffff",
                  minWidth: "48px",
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: "4px",
                }}
              >
                {["Days", "Hrs", "Min", "Sec"][i]}
              </div>
            </div>
          ))}
        </div>
      );
    }

    /* ── Form ────────────────────────────────────────────────────────────── */
    case "c-form": {
      return (
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px dashed rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "24px",
            textAlign: "center",
            color: "rgba(255,255,255,0.4)",
            fontSize: "12px",
          }}
        >
          Form element — connect in GHL builder
        </div>
      );
    }

    /* ── FAQ Accordion ───────────────────────────────────────────────────── */
    case "c-faq":
      return <FaqAccordion node={node} vars={vars} />;

    default:
      return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Section renderer                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */

function RenderSection({
  section,
  vars,
}: {
  section: GhlSection;
  vars: Record<string, string>;
}) {
  const meta = section.metaData as Record<string, unknown>;
  const styles = (meta.styles ?? {}) as Record<string, unknown>;

  const rootRowIds = Array.isArray(meta.child) ? (meta.child as string[]) : [];

  const nodeMap: NodeMap = new Map();
  for (const el of section.elements) {
    const node = el as unknown as GhlNode;
    if (node.id) nodeMap.set(node.id, node);
  }

  const ptRaw = sv(styles.paddingTop, vars);
  const pbRaw = sv(styles.paddingBottom, vars);

  const bgGradient = sv(styles.background, vars);
  const bgColor = sv(styles.backgroundColor, vars);

  const sectionStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    paddingTop: ptRaw ?? "80px",
    paddingBottom: pbRaw ?? "80px",
    paddingLeft: "0",
    paddingRight: "0",
  };

  if (bgGradient && bgGradient !== "none") {
    sectionStyle.background = bgGradient;
  } else if (bgColor && bgColor !== "transparent" && bgColor !== "none") {
    sectionStyle.backgroundColor = bgColor;
  }

  return (
    <div style={sectionStyle}>
      {rootRowIds.map((rowId) => (
        <RenderNode key={rowId} nodeId={rowId} nodeMap={nodeMap} vars={vars} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Loading skeleton                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */

function LoadingSkeleton() {
  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "480px", padding: "0" }}>
      {[120, 200, 160, 180, 100].map((h, i) => (
        <div
          key={i}
          style={{
            height: `${h}px`,
            background:
              i % 2 === 0
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.02)",
            marginBottom: "2px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main component                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */

export function GhlPagePreview({ projectId, page, templateVariant, onLoad, onError }: Props) {
  const [status, setStatus] = useState<"loading" | "ok" | "empty" | "error">(
    "loading",
  );

  // Keep stable refs so they never become useEffect dependencies.
  const onLoadRef = useRef(onLoad);
  useEffect(() => { onLoadRef.current = onLoad; });
  const onErrorRef = useRef(onError);
  useEffect(() => { onErrorRef.current = onError; });

  // Probe page-data to detect empty/error states and get templateLabel metadata.
  // The actual rendering is done by the iframe (/api/highlevel/page-preview).
  useEffect(() => {
    if (!projectId) {
      setStatus("empty");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    const qs = new URLSearchParams({ page, projectId });
    if (templateVariant) qs.set("templateVariant", templateVariant);
    fetch(`/api/highlevel/page-data?${qs}`)
      .then(async (res) => {
        if (!res.ok) {
          if (cancelled) return;
          setStatus(res.status === 404 ? "empty" : "error");
          onErrorRef.current?.();
          return;
        }
        const json = (await res.json()) as { pageData?: GhlPageData; templateLabel?: string; templateVariant?: string };
        if (cancelled) return;
        const pd = json.pageData;
        if (!pd?.sections?.length) {
          setStatus("empty");
          onErrorRef.current?.();
          return;
        }
        setStatus("ok");
        onLoadRef.current?.({ templateLabel: json.templateLabel, templateVariant: json.templateVariant });
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
          onErrorRef.current?.();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, page, templateVariant]);

  if (status === "loading") return <LoadingSkeleton />;

  if (status === "empty" || status === "error") {
    return (
      <div
        style={{
          backgroundColor: "#0f172a",
          padding: "64px 32px",
          textAlign: "center",
          color: "rgba(255,255,255,0.5)",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "16px" }}>📄</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontWeight: "600" }}>
          Generate your funnel to see the GHL-accurate page preview.
        </div>
      </div>
    );
  }

  // Render via server-generated HTML iframe so CSS variables from pageStyles
  // resolve natively (var(--primary) etc.) and fonts load correctly — giving a
  // much more accurate representation of the GHL page builder output.
  const qs = new URLSearchParams({ page, projectId: projectId ?? "" });
  if (templateVariant) qs.set("templateVariant", templateVariant);

  return (
    <iframe
      src={`/api/highlevel/page-preview?${qs}`}
      style={{ width: "100%", height: "640px", border: "none", display: "block" }}
      title="Page preview"
    />
  );
}
