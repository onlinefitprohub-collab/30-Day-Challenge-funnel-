"use client";

import { useState } from "react";
import { Globe, Check, ExternalLink, Loader2, X, Download } from "lucide-react";
import type { GeneratedFunnelAssets } from "@/types/generation";
import { GhlPagePreview } from "./GhlPagePreview";

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

interface Props {
  data: GeneratedFunnelAssets;
  projectId?: string;
}

const PAGES = [
  { id: "landing",  label: "Landing Page" },
  { id: "optin",    label: "Opt-in Form" },
  { id: "thankyou", label: "Thank You" },
  { id: "booking",  label: "Booking Page" },
] as const;

type PageId = (typeof PAGES)[number]["id"];

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
export function FunnelPreviewSection({ data, projectId }: Props) {
  const [activePage, setActivePage] = useState<PageId>("landing");

  // Clone-to-GHL one-click state
  const [cloneStatus, setCloneStatus] = useState<"idle" | "loading" | "saved" | "no-ext" | "error">("idle");
  const [cloneMsg, setCloneMsg]       = useState("");

  const scheme = getScheme(data.colourScheme);
  const activeMeta = PAGES.find((p) => p.id === activePage)!;

  const pageUrls: Record<PageId, string> = {
    landing:  "yourfunnel.com/challenge",
    optin:    "yourfunnel.com/optin",
    thankyou: "yourfunnel.com/thank-you",
    booking:  "yourfunnel.com/book",
  };

  const pageContent: Record<PageId, React.ReactNode> = {
    landing:  <GhlPagePreview projectId={projectId ?? ""} page="landing" />,
    optin:    <GhlPagePreview projectId={projectId ?? ""} page="optin" />,
    thankyou: <GhlPagePreview projectId={projectId ?? ""} page="thankyou" />,
    booking:  <GhlPagePreview projectId={projectId ?? ""} page="booking" />,
  };

  async function handleDownloadJson() {
    try {
      const qs  = new URLSearchParams({ page: activePage, ...(projectId ? { projectId } : {}) });
      const res = await fetch(`/api/highlevel/page-data?${qs}`);
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
      alert(`Download failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  async function handleClone() {
    if (cloneStatus === "loading") return;
    setCloneStatus("loading");
    setCloneMsg("");

    try {
      const qs = new URLSearchParams({ page: activePage, ...(projectId ? { projectId } : {}) });
      const res = await fetch(`/api/highlevel/page-data?${qs}`);
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
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              title="Download this page's GHL JSON — import manually or inspect the schema"
            >
              <Download className="h-3 w-3" />
              Download JSON
            </button>
            <button
              onClick={handleClone}
              disabled={cloneStatus === "loading"}
              className="flex items-center gap-1.5 rounded-full border border-[#1a56db] px-3 py-1.5 text-xs font-semibold text-[#1a56db] hover:bg-[#1a56db] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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

      {/* Browser preview */}
      <BrowserFrame url={pageUrls[activeMeta.id]}>
        {pageContent[activePage]}
      </BrowserFrame>
    </div>
  );
}
