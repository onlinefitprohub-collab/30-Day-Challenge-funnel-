"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink, Puzzle, Download, Zap, CheckCircle2, AlertCircle, Loader2, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { GeneratedFunnelAssets } from "@/types/generation";

function HLCopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast({ title: "Copied!", description: label ? `${label} copied.` : "Copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : `Copy${label ? ` ${label}` : ""}`}
    </button>
  );
}

interface PublishResult {
  funnelId?: string;
  funnelUrl?: string;
  funnelSteps?: { id: string; name: string; pageId?: string; nativePage?: boolean }[];
  nativePages?: { stepName: string; written: boolean }[];
  errors: string[];
}

function PublishCard({ projectId, hlConnected }: { projectId: string; hlConnected: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<PublishResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function publish() {
    setState("loading");
    try {
      const res = await fetch("/api/highlevel/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json() as PublishResult & { error?: string };

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong");
        setState("error");
        return;
      }

      setResult(data);
      const hasErrors = data.errors && data.errors.length > 0;
      setState(data.funnelId || data.funnelSteps?.length ? "success" : "error");
      if (!data.funnelId && !data.funnelSteps?.length) {
        setErrorMsg(data.errors?.join("\n") ?? "Funnel creation failed");
      }
      if (hasErrors && data.funnelId) {
        // Partial success — still show success but surface warnings
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
      setState("error");
    }
  }

  if (!hlConnected) {
    return (
      <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 mt-0.5">
            <Settings className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Connect your HighLevel account to publish in one click</p>
            <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
              Add your HL API key and Location ID in Account Settings, then come back here to publish your funnel directly.
            </p>
            <Link
              href="/account"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#1a56db] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1245b5] transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Go to Account Settings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (state === "idle") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1a56db] text-white">
            <Zap className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">One-click publish to HighLevel</p>
            <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
              Creates a new funnel in your GHL account with all pages built out — Landing Page, Opt-In, Thank You, Booking, and Sales Letter. Uses your connected API key.
            </p>
            <button
              onClick={publish}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1a56db] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1245b5] active:scale-[0.98] transition-all shadow-sm"
            >
              <Zap className="h-4 w-4" />
              Publish Funnel to HighLevel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin shrink-0" />
          <div>
            <p className="font-semibold text-blue-900 text-sm">Creating your funnel…</p>
            <p className="text-xs text-blue-600 mt-0.5">This usually takes 5–15 seconds</p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-5 space-y-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900 text-sm">Publish failed</p>
            <p className="mt-1 text-xs text-red-700 leading-relaxed whitespace-pre-wrap">{errorMsg}</p>
          </div>
        </div>
        <button
          onClick={() => { setState("idle"); setErrorMsg(""); setResult(null); }}
          className="text-xs font-semibold text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // Success
  const steps = result?.funnelSteps ?? [];
  const nativePages = result?.nativePages ?? [];
  const warnings = result?.errors ?? [];

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-green-900">Funnel published to HighLevel!</p>
          <p className="text-xs text-green-700 mt-0.5">Your funnel is live in your GHL account and ready to edit.</p>
        </div>
      </div>

      {/* Open in GHL */}
      {result?.funnelUrl && (
        <a
          href={result.funnelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-green-300 bg-white px-4 py-2.5 text-sm font-bold text-green-800 hover:bg-green-50 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Open funnel in HighLevel
        </a>
      )}

      {/* Step breakdown */}
      {nativePages.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-green-700">Pages created</p>
          {nativePages.map(({ stepName, written }) => (
            <div key={stepName} className="flex items-center gap-2 text-xs text-green-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span className="font-medium">{stepName}</span>
              {written && (
                <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                  native content injected
                </span>
              )}
            </div>
          ))}
          {steps.filter((s) => !nativePages.find((n) => n.stepName === s.name)).map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-xs text-green-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span className="font-medium">{s.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Warnings (partial errors) */}
      {warnings.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-700">Notes</p>
          {warnings.map((w, i) => (
            <p key={i} className="text-xs text-yellow-800 leading-relaxed">{w}</p>
          ))}
        </div>
      )}

      {/* Publish again */}
      <button
        onClick={() => { setState("idle"); setResult(null); }}
        className="text-xs font-semibold text-green-700 hover:text-green-900 underline"
      >
        Publish again (creates a new funnel)
      </button>
    </div>
  );
}

function ChromeExtensionSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a56db]/10 text-[#1a56db]">
            <Puzzle className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Chrome Extension (alternative method)</p>
            <p className="text-xs text-gray-400">Paste pages directly into the GHL page builder — no API key needed</p>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 p-5 space-y-3">
          {[
            {
              n: "1",
              title: "Install the Chrome extension",
              body: "Open chrome://extensions, enable Developer mode, click Load unpacked, and select the unzipped folder.",
              extra: (
                <a
                  href="/api/highlevel/extension-download"
                  download="challenge-funnel-extension.zip"
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-md border border-[#1a56db] px-2.5 py-1 text-xs font-semibold text-[#1a56db] hover:bg-[#1a56db] hover:text-white transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Download extension (.zip)
                </a>
              ),
            },
            {
              n: "2",
              title: "Load a page from the extension popup",
              body: "Click the extension icon on this results page. Click Load next to the page you want (Landing, Opt-In, Thank You, Booking, or Sales Letter).",
            },
            {
              n: "3",
              title: "Open that page in the GHL page builder",
              body: "In HighLevel go to Sites → Funnels → open your funnel → click Edit on the matching funnel step.",
            },
            {
              n: "4",
              title: "Click \"Paste into Page Builder\"",
              body: "The orange panel in the bottom-right corner of the builder appears. Click Paste — native sections, columns, headings, and buttons are injected instantly.",
            },
            {
              n: "5",
              title: "Builder reloads with your content",
              body: "After the success message the builder refreshes. Your funnel page content appears as fully editable native HighLevel elements.",
            },
          ].map(({ n, title, body, extra }) => (
            <div key={n} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a56db] text-[10px] font-bold text-white mt-0.5">{n}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                {body && <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{body}</p>}
                {extra}
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2.5 text-xs text-green-800">
            <strong>Repeat for each page.</strong> Load → open builder → Paste. Each funnel step gets its own content injected separately.
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  data: GeneratedFunnelAssets;
  projectId: string;
  hlConnected: boolean;
}

export function HighLevelSection({ data: _data, projectId, hlConnected }: Props) {
  return (
    <div className="space-y-4">

      {/* One-click publish */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
          Publish to HighLevel
        </h3>
        <PublishCard projectId={projectId} hlConnected={hlConnected} />
      </div>

      {/* Chrome Extension alternative */}
      <ChromeExtensionSection />

    </div>
  );
}
