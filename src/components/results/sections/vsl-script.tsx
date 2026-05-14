"use client";

import { useState } from "react";
import { Copy, Check, Video, FileDown, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { VslScript } from "@/types/generation";

interface VslSectionMeta {
  label: string;
  timing: string;
  tip: string;
}

const VSL_SECTION_META: Record<keyof VslScript, VslSectionMeta> = {
  hook: {
    label: "Hook",
    timing: "0:00 – 0:45",
    tip: "Open strong — this determines if they keep watching. Deliver with energy.",
  },
  problemStatement: {
    label: "Problem",
    timing: "0:45 – 2:00",
    tip: "Slow down here. Let the emotion land. Show empathy, not urgency.",
  },
  agitation: {
    label: "Agitation",
    timing: "2:00 – 3:15",
    tip: "Paint the cost of staying stuck. Pause after the most impactful lines.",
  },
  coachStoryBridge: {
    label: "Your Story",
    timing: "3:15 – 6:00",
    tip: "Be vulnerable and specific. Real moments are more powerful than credentials.",
  },
  solutionReveal: {
    label: "Solution Reveal",
    timing: "6:00 – 8:00",
    tip: "This is the 'aha' moment. Speak clearly and with conviction.",
  },
  programmeWalkthrough: {
    label: "Programme Walkthrough",
    timing: "8:00 – 10:30",
    tip: "Use benefit-led language throughout. What does their day-to-day look like?",
  },
  socialProof: {
    label: "Social Proof",
    timing: "10:30 – 12:30",
    tip: "Replace placeholder clients with your real ones. Specifics = credibility.",
  },
  offerPresentation: {
    label: "Offer & Investment",
    timing: "12:30 – 14:30",
    tip: "State the price clearly and confidently. Hesitation here signals doubt.",
  },
  objectionHandling: {
    label: "Objection Handling",
    timing: "14:30 – 16:30",
    tip: "Address these calmly. Don't dismiss or over-justify — just answer honestly.",
  },
  callToAction: {
    label: "Call to Action",
    timing: "16:30 – 17:30",
    tip: "Point at the button/link explicitly. Tell them what to do right now.",
  },
  closingScarcity: {
    label: "Closing Urgency",
    timing: "17:30 – 18:30",
    tip: "Make this sincere. End by looking directly into the camera.",
  },
};

const VSL_KEYS = Object.keys(VSL_SECTION_META) as Array<keyof VslScript>;

function CopyableScript({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative">
      <div className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap font-mono">
        {text}
      </div>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-50"
      >
        {copied ? <><Check className="h-3 w-3 text-green-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
      </button>
    </div>
  );
}

function VslSectionCard({ sectionKey, meta, text, defaultOpen }: {
  sectionKey: keyof VslScript;
  meta: VslSectionMeta;
  text: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border-b border-gray-100 px-5 py-3 text-left hover:bg-gray-50 transition-colors"
        style={{ borderBottom: open ? undefined : "none" }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{meta.label}</span>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
              {meta.timing}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-400">{meta.tip}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="text-xs text-gray-400">{text?.split(/\s+/).length ?? 0} words</span>
          {open ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="p-4">
          <CopyableScript text={text} />
        </div>
      )}
    </div>
  );
}

export function VslScriptSection({ data }: { data: VslScript }) {
  const [copiedAll, setCopiedAll] = useState(false);

  function handleDownloadPdf() {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const sectionsHtml = VSL_KEYS.map((key) => {
      const meta  = VSL_SECTION_META[key];
      const words = data[key]?.split(/\s+/).length ?? 0;
      return `
      <div class="section">
        <div class="section-header">
          <div>
            <span class="section-title">${esc(meta.label)}</span>
            <span class="timing">${esc(meta.timing)}</span>
          </div>
          <span class="word-count">${words} words</span>
        </div>
        <div class="tip">${esc(meta.tip)}</div>
        <div class="script">${esc(data[key] ?? "").replace(/\n/g, "<br/>")}</div>
      </div>`;
    }).join("");

    const totalWords    = VSL_KEYS.reduce((s, k) => s + (data[k]?.split(/\s+/).length ?? 0), 0);
    const estimatedMins = Math.round(totalWords / 130);

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>VSL Script</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:14px;color:#111;background:#fff;padding:32px 40px}
  .brand{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:700;color:#7c3aed;margin-bottom:20px}
  .brand-rocket{font-size:17px}
  .page-title{font-size:24px;font-weight:800;color:#111;margin-bottom:4px}
  .meta{font-size:13px;color:#6b7280;margin-bottom:12px}
  .checklist{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;margin-bottom:20px}
  .checklist p{font-size:13px;font-weight:700;color:#92400e;margin-bottom:8px}
  .checklist li{font-size:13px;color:#92400e;margin-bottom:4px;list-style:none;padding-left:14px;position:relative}
  .checklist li::before{content:'✓';position:absolute;left:0;color:#d97706}
  .section{border:1px solid #e5e7eb;border-radius:8px;margin-bottom:10px;overflow:hidden;page-break-inside:avoid}
  .section-header{display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#f9fafb;border-bottom:1px solid #f3f4f6}
  .section-title{font-size:13px;font-weight:700;color:#111;margin-right:8px}
  .timing{display:inline-block;background:#ede9fe;color:#6d28d9;border-radius:20px;padding:1px 8px;font-size:11px;font-weight:600}
  .word-count{font-size:11px;color:#9ca3af}
  .tip{font-size:11px;color:#9ca3af;font-style:italic;padding:4px 14px 0}
  .script{padding:10px 14px;font-size:13px;line-height:1.8;color:#1f2937;font-family:Arial,sans-serif;white-space:pre-wrap;background:#f9fafb}
  @media print{body{padding:24px 32px}@page{margin:0;size:A4}}
</style>
</head><body>
<div class="brand"><span class="brand-rocket">🚀</span> FitPro Launch</div>
<div class="page-title">VSL Script</div>
<div class="meta">~${totalWords.toLocaleString()} words · ~${estimatedMins} min video</div>
<div class="checklist">
  <p>Before you record</p>
  <ul>
    <li>Replace any example client names/results with your real ones (marked in the Social Proof section)</li>
    <li>Fill in your actual cohort start date and investment figure where noted</li>
    <li>Read through once before recording — adapt any phrase to sound like you</li>
    <li>Target 130–150 words per minute for a natural speaking pace</li>
  </ul>
</div>
${sectionsHtml}
<script>window.onload=function(){window.print();}<\/script>
</body></html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    } else {
      toast({ title: "Pop-up blocked", description: "Allow pop-ups for this site to download the PDF.", variant: "destructive" });
    }
  }

  async function handleCopyAll() {
    const fullScript = VSL_KEYS.map((key) => {
      const meta = VSL_SECTION_META[key];
      return `═══ ${meta.label.toUpperCase()} [${meta.timing}] ═══\n\n${data[key]}`;
    }).join("\n\n\n");

    await navigator.clipboard.writeText(fullScript);
    setCopiedAll(true);
    toast({ title: "Full VSL script copied!", description: "All 11 sections copied as formatted text." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  const totalWords = VSL_KEYS.reduce((sum, key) => sum + (data[key]?.split(/\s+/).length ?? 0), 0);
  const estimatedMins = Math.round(totalWords / 130); // ~130 words per minute for natural speech

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-brand-600" />
            <span className="font-semibold text-gray-900">VSL Script</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              ~{totalWords.toLocaleString()} words · ~{estimatedMins} min video
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Word-for-word script — record directly or use as a framework. Replace any example client names/results with your real ones.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy full script</>
            }
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors"
          >
            <FileDown className="h-3.5 w-3.5" /> Download PDF
          </button>
        </div>
      </div>

      {/* Recording checklist */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900 mb-2">Before you record</p>
        <ul className="space-y-1 text-sm text-amber-800">
          <li>✓ Replace any example client names/results with your real ones (marked in the Social Proof section)</li>
          <li>✓ Fill in your actual cohort start date and investment figure where noted</li>
          <li>✓ Read through once before recording — the script flows naturally but you may want to adapt a phrase or two to sound like you</li>
          <li>✓ Target 130–150 words per minute for a natural speaking pace</li>
        </ul>
      </div>

      {/* Script sections — Hook open by default, rest collapsed */}
      {VSL_KEYS.map((key, i) => (
        <VslSectionCard
          key={key}
          sectionKey={key}
          meta={VSL_SECTION_META[key]}
          text={data[key]}
          defaultOpen={i === 0}
        />
      ))}
    </div>
  );
}

export function VslScriptPlaceholder() {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <Video className="mx-auto mb-3 h-8 w-8 text-gray-300" />
      <p className="font-semibold text-gray-600">VSL Script not yet generated</p>
      <p className="mt-1 text-sm text-gray-400">
        Regenerate this funnel to produce the full video sales letter script.
      </p>
    </div>
  );
}
