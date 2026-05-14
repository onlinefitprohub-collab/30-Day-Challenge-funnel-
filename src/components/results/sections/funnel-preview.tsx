"use client";

import { useState } from "react";
import { Check, ExternalLink, Loader2, X, Download, Shuffle, FileText, FormInput, ThumbsUp, Calendar, LayoutList } from "lucide-react";
import type { GeneratedFunnelAssets } from "@/types/generation";
import { toast } from "@/hooks/use-toast";

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

const ALL_TEMPLATES: Array<{ id: string; label: string; desc: string }> = [
  { id: "standard",             label: "Standard",            desc: "Classic hero with bullets & FAQ" },
  { id: "stats-hero",           label: "Stats Hero",          desc: "Dark hero with 3 stat numbers" },
  { id: "social-proof-grid",    label: "Social Proof Grid",   desc: "Testimonial card grid layout" },
  { id: "transformation-split", label: "Transformation Split",desc: "Before/after split-panel hero" },
  { id: "authority-builder",    label: "Authority Builder",   desc: "Credentials strip + image hero" },
  { id: "urgency-driven",       label: "Urgency Driven",      desc: "Countdown hero + urgency banner" },
  { id: "bold-impact",          label: "Bold Impact",         desc: "Giant full-screen typography hero" },
  { id: "community-proof",      label: "Community Proof",     desc: "Community stats bar + centered hero" },
  { id: "video-authority",      label: "Video Authority",     desc: "Video hero + feature bullet grid" },
  { id: "minimalist-elite",     label: "Minimalist Elite",    desc: "Full-screen single-word hero" },
  { id: "vsl-focused",          label: "VSL Focused",         desc: "Video hero + 'What You'll Discover'" },
  { id: "transformation-wall",  label: "Transformation Wall", desc: "Results card wall layout" },
  { id: "is-this-for-you",      label: "Is This For You",     desc: "For-you / not-for-you qualifier" },
  { id: "event-agenda",         label: "Event Agenda",        desc: "Countdown hero + 4-step timeline" },
  { id: "executive-clean",      label: "Executive Clean",     desc: "'Why This Works' 3-column grid" },
  { id: "local-demographic",    label: "Local Demographic",   desc: "Audience callout banner + image hero" },
  { id: "free-value-first",     label: "Free Value First",    desc: "Value-stack + free offer framing" },
  { id: "application-style",    label: "Application Style",   desc: "Exclusive 'Apply for a spot' hero" },
  { id: "story-journey",        label: "Story Journey",       desc: "Video hero + 4-milestone journey" },
  { id: "results-first",        label: "Results First",       desc: "Stat-led hero with result quote card" },
  { id: "gradient-proof",       label: "Gradient Proof",      desc: "Gradient hero with bullets + testimonial cards" },
];

interface Props {
  data: GeneratedFunnelAssets;
  projectId?: string;
  funnelType?: "challenge" | "application";
  copywriterStyle?: string;
}

const CHALLENGE_PAGES = [
  { id: "landing",     label: "Landing Page",      desc: "Main challenge sign-up page",     icon: LayoutList },
  { id: "optin",       label: "Opt-in Form",        desc: "Lead capture & registration",     icon: FormInput  },
  { id: "thankyou",    label: "Thank You",           desc: "Post-registration confirmation",  icon: ThumbsUp   },
  { id: "booking",     label: "Booking Page",        desc: "Call / session scheduler",        icon: Calendar   },
] as const;

const APPLICATION_PAGES = [
  { id: "salesletter", label: "Registration Page",  desc: "Main application sales page",     icon: LayoutList },
  { id: "optin",       label: "Application Form",   desc: "Prospect application form",       icon: FormInput  },
  { id: "thankyou",    label: "App Received",        desc: "Confirmation & next steps",       icon: ThumbsUp   },
  { id: "booking",     label: "Strategy Call",       desc: "Call booking page",               icon: Calendar   },
] as const;

type PageId = string;
type CloneStatus = "idle" | "loading" | "saved" | "no-ext" | "error";

export function FunnelPreviewSection({ data, projectId, funnelType = "challenge", copywriterStyle }: Props) {
  const copywriterName = copywriterStyle ? copywriterStyle.split(" — ")[0] : null;
  const isApplication = funnelType === "application";
  const PAGES = isApplication ? APPLICATION_PAGES : CHALLENGE_PAGES;

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    data.templateVariant ?? null,
  );
  const [templateLabel, setTemplateLabel] = useState<string>(
    data.templateVariant ? (ALL_TEMPLATES.find(t => t.id === data.templateVariant)?.label ?? data.templateVariant) : "",
  );
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const [cloneStatus, setCloneStatus] = useState<Record<PageId, CloneStatus>>({});
  const [cloneMsg, setCloneMsg]       = useState<Record<PageId, string>>({});
  const [downloading, setDownloading] = useState<Record<PageId, boolean>>({});

  const scheme = getScheme(data.colourScheme);

  function buildQs(page: PageId) {
    const qs = new URLSearchParams({ page, ...(projectId ? { projectId } : {}) });
    if (page === "landing" && selectedTemplate) qs.set("templateVariant", selectedTemplate);
    return qs.toString();
  }

  function handleRandomTemplate() {
    const random = ALL_TEMPLATES[Math.floor(Math.random() * ALL_TEMPLATES.length)];
    setSelectedTemplate(random.id);
    setTemplateLabel(random.label);
  }

  function handleSelectTemplate(id: string) {
    setSelectedTemplate(id);
    const meta = ALL_TEMPLATES.find(t => t.id === id);
    setTemplateLabel(meta?.label ?? id);
    setShowTemplateSelector(false);
  }

  async function handleDownload(page: PageId) {
    setDownloading(prev => ({ ...prev, [page]: true }));
    try {
      let res = await fetch(`/api/highlevel/page-data?${buildQs(page)}`);
      if (!res.ok && res.status === 404) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        if (body.error?.includes("not generated yet")) {
          await new Promise(r => setTimeout(r, 2500));
          res = await fetch(`/api/highlevel/page-data?${buildQs(page)}`);
        }
      }
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json() as { pageData: unknown };
      if (!json.pageData) throw new Error("No page data");
      const blob = new Blob([JSON.stringify(json.pageData, null, 2)], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `ghl-page-${page}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast({ title: "Download failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setDownloading(prev => ({ ...prev, [page]: false }));
    }
  }

  async function handleClone(page: PageId) {
    if (cloneStatus[page] === "loading") return;
    setCloneStatus(prev => ({ ...prev, [page]: "loading" }));
    setCloneMsg(prev => ({ ...prev, [page]: "" }));

    try {
      let res = await fetch(`/api/highlevel/page-data?${buildQs(page)}`);
      if (!res.ok && res.status === 404) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        if (body.error?.includes("not generated yet")) {
          await new Promise(r => setTimeout(r, 2500));
          res = await fetch(`/api/highlevel/page-data?${buildQs(page)}`);
        }
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Server error ${res.status}`);
      }
      const json = await res.json() as { pageData: unknown };
      if (!json.pageData) throw new Error("No page data returned from server");

      const requestId = Math.random().toString(36).slice(2);

      const acked = await new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => {
          window.removeEventListener("message", handler);
          resolve(false);
        }, 3000);
        function handler(evt: MessageEvent) {
          if (!evt.data || evt.data.source !== "cf-ext" || evt.data.type !== "CF_SAVE_ACK") return;
          if (evt.data.payload?.requestId !== requestId) return;
          clearTimeout(timer);
          window.removeEventListener("message", handler);
          resolve(true);
        }
        window.addEventListener("message", handler);
      });

      window.postMessage({
        source: "cf-app",
        type: "CF_SAVE_PAGE",
        payload: {
          requestId,
          projectId: projectId ?? "",
          page,
          pageData: json.pageData,
          challengeConcept: data.offerSummary?.challengeConcept ?? "Challenge Funnel",
          appUrl: window.location.origin,
        },
      }, "*");

      setCloneStatus(prev => ({ ...prev, [page]: acked ? "saved" : "no-ext" }));
    } catch (err) {
      setCloneStatus(prev => ({ ...prev, [page]: "error" }));
      setCloneMsg(prev => ({ ...prev, [page]: err instanceof Error ? err.message : "Something went wrong." }));
    }
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <p className="text-sm text-gray-500 mt-0.5">
          Clone each page directly to GHL, or download the raw JSON for manual import.
        </p>
        {copywriterName && (
          <p className="text-xs text-orange-600 font-medium mt-1">
            ✦ Copy written in the style of {copywriterName}
          </p>
        )}
      </div>

      {/* Template style selector — challenge landing page only */}
      {!isApplication && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">Template Style</span>
              {templateLabel && (
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: scheme.primary }}
                >
                  {templateLabel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRandomTemplate}
                className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <Shuffle className="h-3 w-3" />
                Random
              </button>
              <button
                onClick={() => setShowTemplateSelector(v => !v)}
                className="rounded-full border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                {showTemplateSelector ? "Hide" : "Browse all 21 →"}
              </button>
            </div>
          </div>
          {showTemplateSelector && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
              {ALL_TEMPLATES.map((tmpl) => {
                const isActive = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className={`rounded-lg border px-2.5 py-2 text-left transition-all ${
                      isActive ? "border-transparent text-white shadow-sm" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    style={isActive ? { backgroundColor: scheme.dark } : {}}
                  >
                    <div className={`text-[11px] font-semibold leading-tight ${isActive ? "text-white" : "text-gray-800"}`}>{tmpl.label}</div>
                    <div className={`text-[10px] mt-0.5 leading-snug ${isActive ? "text-white/70" : "text-gray-400"}`}>{tmpl.desc}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Page clone cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAGES.map((page) => {
          const status  = cloneStatus[page.id] ?? "idle";
          const msg     = cloneMsg[page.id] ?? "";
          const loading = status === "loading";
          const saved   = status === "saved";
          const noExt   = status === "no-ext";
          const isError = status === "error";
          const Icon    = page.icon;

          return (
            <div
              key={page.id}
              className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3"
            >
              {/* Page info */}
              <div className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${scheme.primary}15` }}
                >
                  <Icon className="h-4.5 w-4.5" style={{ color: scheme.primary }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{page.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{page.desc}</p>
                </div>
              </div>

              {/* Status feedback */}
              {saved && (
                <div className="flex items-start justify-between gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
                  <div className="flex items-start gap-1.5">
                    <Check className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                    <span>Saved to extension. Open the GHL builder and click <strong>Paste into Page Builder</strong>.</span>
                  </div>
                  <button onClick={() => setCloneStatus(p => ({ ...p, [page.id]: "idle" }))} className="text-green-500 hover:text-green-700 shrink-0">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {noExt && (
                <div className="flex items-start justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <span><strong>Extension not detected.</strong> Install it, reload this page, then try again.</span>
                  <button onClick={() => setCloneStatus(p => ({ ...p, [page.id]: "idle" }))} className="text-amber-500 hover:text-amber-700 shrink-0">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {isError && (
                <div className="flex items-start justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  <span><strong>Error:</strong> {msg || "Something went wrong."}</span>
                  <button onClick={() => setCloneStatus(p => ({ ...p, [page.id]: "idle" }))} className="text-red-400 hover:text-red-600 shrink-0">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  onClick={() => handleDownload(page.id)}
                  disabled={downloading[page.id]}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {downloading[page.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                  JSON
                </button>
                <button
                  onClick={() => handleClone(page.id)}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: saved ? "#16a34a" : scheme.dark }}
                >
                  {loading ? (
                    <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>
                  ) : saved ? (
                    <><Check className="h-3 w-3" /> Cloned</>
                  ) : (
                    <><ExternalLink className="h-3 w-3" /> Clone to GHL</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
