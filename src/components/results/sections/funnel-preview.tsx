"use client";

import { useState, useCallback } from "react";
import { Globe, Check, ExternalLink, Loader2, X, Download, RefreshCw, Shuffle } from "lucide-react";
import type { GeneratedFunnelAssets } from "@/types/generation";
import type { LongFormSalesAssets, SalesLetter } from "@/types/longform";
import { GhlPagePreview } from "./GhlPagePreview";
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

// All 20 template variants with display names and a short description
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
  liveLongFormAssets?: LongFormSalesAssets;
}

const CHALLENGE_PAGES = [
  { id: "landing",      label: "Landing Page" },
  { id: "optin",        label: "Opt-in Form" },
  { id: "thankyou",     label: "Thank You" },
  { id: "booking",      label: "Booking Page" },
] as const;

const APPLICATION_PAGES = [
  { id: "salesletter",  label: "Long-Form Landing" },
  { id: "optin",        label: "Application Form" },
  { id: "thankyou",     label: "App Received" },
  { id: "booking",      label: "Strategy Call" },
] as const;

type ChallengePage = (typeof CHALLENGE_PAGES)[number]["id"];
type ApplicationPage = (typeof APPLICATION_PAGES)[number]["id"];
type PageId = ChallengePage | ApplicationPage;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Sales letter direct renderer (no API — built from liveLongFormAssets)      */
/* ─────────────────────────────────────────────────────────────────────────── */
function SalesLetterDirectPreview({ sl, scheme }: { sl: SalesLetter; scheme: SchemeColors }) {
  const p  = scheme.primary;
  const dk = scheme.dark;
  const md = scheme.mid;

  const sections: string[] = [
    // 1. Hero
    `<div style="background:${dk};padding:80px 32px 64px;text-align:center">
  <p style="display:inline-block;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);padding:6px 20px;border-radius:999px;color:${p};font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:24px">Long-Form Landing Page</p>
  <h1 style="font-size:clamp(26px,4vw,52px);font-weight:900;color:#fff;line-height:1.1;margin:0 auto 20px;max-width:800px;font-family:'Poppins',sans-serif">${sl.headline ?? ""}</h1>
  <p style="font-size:clamp(15px,1.8vw,20px);color:rgba(255,255,255,0.7);max-width:600px;margin:0 auto;line-height:1.6">${sl.subheadline ?? ""}</p>
</div>`,
    // 2. Opening Hook
    `<div style="background:#fff;padding:64px 32px">
  <div style="max-width:720px;margin:0 auto">
    <p style="font-size:clamp(15px,1.4vw,18px);color:#374151;line-height:1.85;white-space:pre-line">${sl.openingHook ?? ""}</p>
  </div>
</div>`,
    // 3. Problem Agitation
    `<div style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:64px 32px">
  <div style="max-width:720px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:16px">The Problem</p>
    <p style="font-size:clamp(15px,1.4vw,18px);color:#374151;line-height:1.85;white-space:pre-line">${sl.problemAgitation ?? ""}</p>
  </div>
</div>`,
    // 4. Bridge + Coach Credentials
    `<div style="background:${md};padding:64px 32px">
  <div style="max-width:720px;margin:0 auto;margin-bottom:40px">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:14px">There's a Better Way</p>
    <p style="font-size:clamp(15px,1.5vw,18px);color:rgba(255,255,255,0.85);line-height:1.85;white-space:pre-line">${sl.bridgeToPossibility ?? ""}</p>
  </div>
  <div style="max-width:720px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:14px">Why Trust Me</p>
    <p style="font-size:clamp(15px,1.4vw,18px);color:rgba(255,255,255,0.8);line-height:1.85;white-space:pre-line">${sl.coachCredentials ?? ""}</p>
  </div>
</div>`,
    // 5. Offer Reveal
    `<div style="background:${dk};padding:64px 32px;text-align:center">
  <div style="max-width:720px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:14px">Introducing</p>
    <p style="font-size:clamp(15px,1.6vw,20px);color:#fff;line-height:1.75;white-space:pre-line">${sl.offerReveal ?? ""}</p>
  </div>
</div>`,
    // 6. What You Get
    `<div style="background:#f8fafc;padding:72px 32px">
  <div style="max-width:880px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};text-align:center;margin-bottom:8px">Everything Included</p>
    <h2 style="font-size:clamp(22px,2.8vw,36px);font-weight:900;text-align:center;color:#111;margin-bottom:36px;font-family:'Poppins',sans-serif">Here's what you get</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px">
      ${(sl.whatYouGet ?? []).map(item =>
        `<div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05)">
        <p style="font-weight:800;font-size:14px;color:#111;margin-bottom:6px">✓ ${item.name ?? ""}</p>
        <p style="font-size:13px;color:#6b7280;line-height:1.6">${item.description ?? ""}</p>
      </div>`).join("")}
    </div>
  </div>
</div>`,
    // 7. Social Proof + Bonus Stack
    `<div style="background:${md};padding:72px 32px">
  <div style="max-width:720px;margin:0 auto;margin-bottom:48px">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:14px">What Clients Say</p>
    <p style="font-size:clamp(15px,1.4vw,18px);color:rgba(255,255,255,0.85);line-height:1.85;white-space:pre-line">${sl.socialProofFramework ?? ""}</p>
  </div>
  <div style="max-width:740px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};text-align:center;margin-bottom:8px">Free Bonuses</p>
    <h2 style="font-size:clamp(20px,2.2vw,30px);font-weight:900;text-align:center;color:#fff;margin-bottom:28px;font-family:'Poppins',sans-serif">Included at no extra cost</h2>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${(sl.bonusStack ?? []).map(bonus =>
        `<div style="display:flex;align-items:flex-start;gap:14px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:18px">
        <div style="flex:1">
          <p style="font-weight:800;font-size:14px;color:#fff;margin-bottom:4px">🎁 ${bonus.name ?? ""}</p>
          <p style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.6">${bonus.description ?? ""}</p>
        </div>
        <span style="white-space:nowrap;background:${p};color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;margin-top:2px">${bonus.valueLabel ?? ""}</span>
      </div>`).join("")}
    </div>
  </div>
</div>`,
    // 8. Price + Guarantee
    `<div style="background:#fff;padding:72px 32px">
  <div style="max-width:620px;margin:0 auto;text-align:center;margin-bottom:40px">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:8px">Investment</p>
    <p style="font-size:clamp(15px,1.6vw,19px);color:#374151;line-height:1.8;white-space:pre-line">${sl.priceReveal ?? ""}</p>
  </div>
  <div style="max-width:620px;margin:0 auto;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:16px;padding:28px">
    <p style="font-weight:800;font-size:17px;color:#14532d;margin-bottom:8px">My Personal Guarantee</p>
    <p style="font-size:14px;color:#166534;line-height:1.75;white-space:pre-line">${sl.guarantee ?? ""}</p>
  </div>
</div>`,
    // 9. Objection Handling
    `<div style="background:#f8fafc;padding:72px 32px">
  <div style="max-width:680px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};text-align:center;margin-bottom:8px">Your Questions Answered</p>
    <h2 style="font-size:clamp(20px,2.2vw,30px);font-weight:900;text-align:center;color:#111;margin-bottom:28px;font-family:'Poppins',sans-serif">Before you decide</h2>
    ${(sl.objectionHandling ?? []).map(o =>
      `<div style="border:1px solid #e5e7eb;border-radius:12px;padding:18px;background:#fff;margin-bottom:10px">
      <p style="font-weight:700;font-size:14px;color:#111;margin-bottom:0">${o.objection ?? ""}</p>
      <p style="font-size:13px;color:#4b5563;line-height:1.7;margin-top:10px">${o.response ?? ""}</p>
    </div>`).join("")}
  </div>
</div>`,
    // 10. Urgency + Final CTA
    `<div style="background:${md};padding:48px 32px;text-align:center">
  <div style="max-width:600px;margin:0 auto">
    <p style="font-size:clamp(15px,1.4vw,17px);color:rgba(255,255,255,0.85);line-height:1.8;white-space:pre-line">${sl.urgencySection ?? ""}</p>
  </div>
</div>
<div style="background:${p};padding:80px 32px;text-align:center">
  <div style="max-width:600px;margin:0 auto">
    <p style="font-size:clamp(15px,1.8vw,20px);color:#fff;line-height:1.75;margin-bottom:36px;font-weight:500;white-space:pre-line">${sl.finalCta ?? ""}</p>
    <span style="display:inline-block;background:#fff;color:${p};padding:18px 44px;border-radius:8px;font-weight:900;font-size:17px;box-shadow:0 12px 40px rgba(0,0,0,0.2)">Yes — I'm Ready to Start →</span>
  </div>
</div>`,
  ];

  return (
    <div style={{ backgroundColor: dk, fontFamily: "'Poppins', 'Inter', sans-serif", color: "#ffffff" }}>
      {sections.map((html, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Browser chrome wrapper                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 shadow-xl overflow-hidden bg-white">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-[#f0f0f0] px-4 py-2.5">
        <div className="flex gap-1.5 shrink-0">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex flex-1 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1">
          <Globe className="h-3 w-3 text-gray-400 shrink-0" />
          <span className="text-xs text-gray-500 truncate">{url}</span>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[640px] text-left bg-white">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MAIN EXPORT                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
export function FunnelPreviewSection({ data, projectId, funnelType = "challenge", liveLongFormAssets }: Props) {
  const isApplication = funnelType === "application";
  const PAGES = isApplication ? APPLICATION_PAGES : CHALLENGE_PAGES;
  const [activePage, setActivePage] = useState<PageId>(isApplication ? "salesletter" : "landing");

  // Template selector — null means "use persisted/random (server decides)"
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    data.templateVariant ?? null,
  );
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Clone-to-GHL one-click state
  const [cloneStatus, setCloneStatus] = useState<"idle" | "loading" | "saved" | "no-ext" | "error">("idle");
  const [cloneMsg, setCloneMsg]       = useState("");

  // Refresh: incrementing refreshKey remounts GhlPagePreview → triggers a fresh fetch
  const [refreshKey, setRefreshKey] = useState(0);
  // Template label: set by GhlPagePreview after a successful landing-page fetch
  const [templateLabel, setTemplateLabel] = useState<string>(
    data.templateVariant ? (ALL_TEMPLATES.find(t => t.id === data.templateVariant)?.label ?? data.templateVariant) : "",
  );

  const scheme = getScheme(data.colourScheme);
  const activeMeta = PAGES.find((p) => p.id === activePage)!;

  const pageUrls: Record<PageId, string> = {
    landing:      "yourfunnel.com/challenge",
    salesletter:  "yourfunnel.com/apply",
    optin:        "yourfunnel.com/optin",
    thankyou:     "yourfunnel.com/thank-you",
    booking:      "yourfunnel.com/book",
  };

  const handleLandingLoad = useCallback(
    ({ templateLabel: label, templateVariant: tv }: { templateLabel?: string; templateVariant?: string }) => {
      setTemplateLabel(label ?? tv ?? "");
    },
    [],
  );

  function handleRefresh() {
    setTemplateLabel("");
    setRefreshKey((k) => k + 1);
  }

  function handleRandomTemplate() {
    // Pick a random template from all 20
    const random = ALL_TEMPLATES[Math.floor(Math.random() * ALL_TEMPLATES.length)];
    setSelectedTemplate(random.id);
    setTemplateLabel(random.label);
    setRefreshKey((k) => k + 1);
    setCloneStatus("idle");
  }

  function handleSelectTemplate(id: string) {
    setSelectedTemplate(id);
    const meta = ALL_TEMPLATES.find(t => t.id === id);
    setTemplateLabel(meta?.label ?? id);
    setRefreshKey((k) => k + 1);
    setCloneStatus("idle");
    setShowTemplateSelector(false);
  }

  // Build query string for API calls — include templateVariant when on landing page
  function buildQs(page: PageId) {
    const qs = new URLSearchParams({ page, ...(projectId ? { projectId } : {}) });
    if (page === "landing" && selectedTemplate) qs.set("templateVariant", selectedTemplate);
    return qs.toString();
  }

  // For application funnels, show a generating spinner while the sales letter is being produced.
  // The salesletter preview is rendered directly from liveLongFormAssets (no API fetch needed).
  const showGeneratingSpinner = isApplication && activePage === "salesletter" && !liveLongFormAssets?.salesLetter;

  async function handleDownloadJson() {
    try {
      let res = await fetch(`/api/highlevel/page-data?${buildQs(activePage)}`);
      // If sales letter isn't indexed yet (DB write just completed), wait briefly and retry once
      if (!res.ok && res.status === 404) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        if (body.error?.includes("not generated yet")) {
          await new Promise(r => setTimeout(r, 2500));
          res = await fetch(`/api/highlevel/page-data?${buildQs(activePage)}`);
        }
      }
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json() as { pageData: unknown };
      if (!json.pageData) throw new Error("No page data");
      const blob = new Blob([JSON.stringify(json.pageData, null, 2)], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `ghl-page-${activePage}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast({
        title: "Download failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  }

  async function handleClone() {
    if (cloneStatus === "loading") return;
    setCloneStatus("loading");
    setCloneMsg("");

    try {
      let res = await fetch(`/api/highlevel/page-data?${buildQs(activePage)}`);
      // If sales letter isn't indexed yet, wait briefly and retry once
      if (!res.ok && res.status === 404) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        if (body.error?.includes("not generated yet")) {
          await new Promise(r => setTimeout(r, 2500));
          res = await fetch(`/api/highlevel/page-data?${buildQs(activePage)}`);
        }
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Server error ${res.status}`);
      }
      const json = await res.json() as { pageData: unknown; colourScheme?: string };
      if (!json.pageData) throw new Error("No page data returned from server");

      const requestId = Math.random().toString(36).slice(2);

      const ackPromise = new Promise<boolean>((resolve) => {
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
          page: activePage,
          pageData: json.pageData,
          challengeConcept: data.offerSummary?.challengeConcept ?? "Challenge Funnel",
          appUrl: window.location.origin,
        },
      }, "*");

      const acked = await ackPromise;
      setCloneStatus(acked ? "saved" : "no-ext");
    } catch (err) {
      setCloneStatus("error");
      setCloneMsg(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-gray-900">Funnel Page Previews</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Switch pages to review the full funnel flow. Each tab renders the exact GHL element tree that will be injected.
        </p>
      </div>

      {/* Page selector + Clone button */}
      <div className="flex flex-wrap items-center gap-2">
        {PAGES.map((page) => (
          <button
            key={page.id}
            onClick={() => { setActivePage(page.id); setCloneStatus("idle"); setCloneMsg(""); }}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all border ${
              activePage === page.id
                ? "text-white border-transparent shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
            style={activePage === page.id ? { backgroundColor: scheme.dark } : {}}
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: activePage === page.id ? "#fff" : scheme.primary }}
            />
            {page.label}
          </button>
        ))}

        <div className="ml-auto flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              title="Reload this page preview"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
            <button
              onClick={handleDownloadJson}
              disabled={showGeneratingSpinner}
              className="flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title={showGeneratingSpinner ? "Generating — please wait" : "Download this page's GHL JSON"}
            >
              <Download className="h-3 w-3" />
              Download JSON
            </button>
            <button
              onClick={handleClone}
              disabled={cloneStatus === "loading" || showGeneratingSpinner}
              className="flex items-center gap-1.5 rounded-full border border-[#1a56db] px-3 py-1.5 text-xs font-semibold text-[#1a56db] hover:bg-[#1a56db] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title={showGeneratingSpinner ? "Generating — please wait" : "Clone to GHL"}
            >
              {cloneStatus === "loading" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <ExternalLink className="h-3 w-3" />
              )}
              {cloneStatus === "loading" ? "Saving…" : "Clone to GHL"}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-right max-w-[280px] leading-snug">
            Clone to GHL queues this page for the orange CF button. Download JSON gives you the raw GHL element tree.
          </p>
        </div>
      </div>

      {/* ── Template selector (challenge landing page only) ──────────────── */}
      {activePage === "landing" && !isApplication && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
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
                title="Pick a random template from all 20"
              >
                <Shuffle className="h-3 w-3" />
                Random
              </button>
              <button
                onClick={() => setShowTemplateSelector((v) => !v)}
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
                      isActive
                        ? "border-transparent text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    style={isActive ? { backgroundColor: scheme.dark } : {}}
                  >
                    <div className={`text-[11px] font-semibold leading-tight ${isActive ? "text-white" : "text-gray-800"}`}>
                      {tmpl.label}
                    </div>
                    <div className={`text-[10px] mt-0.5 leading-snug ${isActive ? "text-white/70" : "text-gray-400"}`}>
                      {tmpl.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Clone-to-GHL status strip */}
      {cloneStatus === "saved" && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <div className="flex items-start gap-2.5">
            <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
            <div className="text-xs text-green-800 leading-relaxed">
              <strong>{activeMeta.label}</strong> saved to extension.{" "}
              Open the GHL page builder and click <strong>Paste into Page Builder</strong>.
            </div>
          </div>
          <button
            onClick={() => setCloneStatus("idle")}
            className="text-green-500 hover:text-green-700 shrink-0 mt-0.5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {cloneStatus === "no-ext" && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong>Extension not detected.</strong> Make sure the Chrome extension is installed and this page is reloaded after installation,
            then click <strong>Clone to GHL</strong> again.{" "}
            <a href="/account?tab=highlevel" className="underline font-semibold">Download the extension →</a>
          </div>
          <button
            onClick={() => setCloneStatus("idle")}
            className="text-amber-500 hover:text-amber-700 shrink-0 mt-0.5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {cloneStatus === "error" && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="text-xs text-red-800 leading-relaxed">
            <strong>Error:</strong> {cloneMsg || "Something went wrong. Try again."}
          </div>
          <button
            onClick={() => setCloneStatus("idle")}
            className="text-red-400 hover:text-red-600 shrink-0 mt-0.5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Browser preview — key includes refreshKey + selectedTemplate so each change remounts */}
      <BrowserFrame url={pageUrls[activeMeta.id]}>
        {showGeneratingSpinner ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-gray-400" />
            <p className="text-sm font-medium text-gray-600">Generating your long-form landing page…</p>
            <p className="mt-1 text-xs text-gray-400">This takes about 30 seconds</p>
          </div>
        ) : isApplication && activePage === "salesletter" && liveLongFormAssets?.salesLetter ? (
          /* Render sales letter directly from state — no API round-trip needed */
          <SalesLetterDirectPreview sl={liveLongFormAssets.salesLetter} scheme={scheme} />
        ) : (
          <GhlPagePreview
            key={`${activePage}-${refreshKey}-${selectedTemplate ?? "auto"}`}
            projectId={projectId ?? ""}
            page={activePage}
            templateVariant={activePage === "landing" && selectedTemplate ? selectedTemplate : undefined}
            onLoad={activePage === "landing" ? handleLandingLoad : undefined}
          />
        )}
      </BrowserFrame>
    </div>
  );
}
