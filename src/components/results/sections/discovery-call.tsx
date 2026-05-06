"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Phone, Loader2, ClipboardCheck } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";
import type { DiscoveryCallScript, DiscoveryCallPhase } from "@/types/discovery-call";

// ─── Phase badge colours ──────────────────────────────────────────────────────

const PHASE_COLOURS: Record<string, string> = {
  "Opening & Rapport":     "bg-blue-50 text-blue-700 border-blue-100",
  "Setting the Call Frame":"bg-indigo-50 text-indigo-700 border-indigo-100",
  "Pain Discovery":        "bg-red-50 text-red-700 border-red-100",
  "Reflection & Mirroring":"bg-amber-50 text-amber-700 border-amber-100",
  "Future Pacing":         "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Offer Presentation":    "bg-violet-50 text-violet-700 border-violet-100",
  "Price Reveal":          "bg-orange-50 text-orange-700 border-orange-100",
  "Close & Enrol":         "bg-green-50 text-green-700 border-green-100",
};

function phaseBadgeClass(title: string): string {
  return PHASE_COLOURS[title] ?? "bg-gray-50 text-gray-700 border-gray-100";
}

// ─── Phase card ───────────────────────────────────────────────────────────────

function PhaseCard({ phase, index }: { phase: DiscoveryCallPhase; index: number }) {
  const [open, setOpen]          = useState(index === 0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [copied, setCopied]       = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(phase.script);
    setCopied(true);
    toast({ title: `${phase.title} copied!` });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{phase.title}</p>
            <span className={`mt-0.5 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${phaseBadgeClass(phase.title)}`}>
              {phase.duration}
            </span>
          </div>
        </div>
        <div className="ml-3 shrink-0 text-gray-400">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          {/* Script */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Script</p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {copied
                  ? <><Check className="h-3 w-3 text-green-500" /> Copied</>
                  : <><Copy className="h-3 w-3" /> Copy</>
                }
              </button>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 whitespace-pre-line font-mono">
              {phase.script}
            </div>
          </div>

          {/* Coaching notes — collapsible */}
          <div>
            <button
              onClick={() => setNotesOpen((v) => !v)}
              className="flex w-full items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-600 hover:text-brand-700"
            >
              {notesOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              Coaching Notes
            </button>
            {notesOpen && (
              <div className="mt-2 rounded-lg border border-brand-100 bg-brand-50 p-4">
                <p className="text-sm leading-relaxed text-brand-800">{phase.coachingNotes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────

function SectionDivider({ label, colour }: {
  label: string;
  colour: "blue" | "red" | "emerald" | "amber" | "violet" | "gray";
}) {
  const cls: Record<string, string> = {
    blue:    "bg-blue-50 text-blue-700",
    red:     "bg-red-50 text-red-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber:   "bg-amber-50 text-amber-700",
    violet:  "bg-violet-50 text-violet-700",
    gray:    "bg-gray-100 text-gray-600",
  };
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls[colour]}`}>
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────

interface DiscoveryCallPlaceholderProps {
  projectId: string;
  onGenerated: (script: DiscoveryCallScript) => void;
}

export function DiscoveryCallPlaceholder({ projectId, onGenerated }: DiscoveryCallPlaceholderProps) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-discovery-call", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { discoveryCallScript } = await res.json() as { discoveryCallScript: DiscoveryCallScript };
      onGenerated(discoveryCallScript);
      toast({ title: "Discovery call script generated!", description: "Your personalised call script is ready." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
        {loading ? (
          <Loader2 className="h-7 w-7 text-violet-600 animate-spin" />
        ) : (
          <Phone className="h-7 w-7 text-violet-600" />
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {loading ? "Generating your call script…" : "Generate Discovery Call Script"}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">
        {loading
          ? "This usually takes 1–2 minutes — your word-for-word call script is being written."
          : "Create a complete, personalised 45–60 minute discovery call script with 8 call phases, objection handlers, and a post-call follow-up email — all tailored to your offer and audience."}
      </p>
      {!loading && (
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          <Phone className="h-4 w-4" /> Generate Call Script
        </button>
      )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface DiscoveryCallSectionProps {
  data: DiscoveryCallScript;
  projectId: string;
  onRegenerate: (script: DiscoveryCallScript) => void;
}

export function DiscoveryCallSection({ data, projectId, onRegenerate }: DiscoveryCallSectionProps) {
  const [regenerating, setRegenerating]         = useState(false);
  const [copiedAll, setCopiedAll]               = useState(false);
  const [openObjections, setOpenObjections]     = useState<Set<number>>(new Set());
  const [copiedEmail, setCopiedEmail]           = useState(false);
  const [copiedClosing, setCopiedClosing]       = useState(false);

  const phases: DiscoveryCallPhase[] = [
    data.openingRapport,
    data.callFrameSetting,
    data.painDiscovery,
    data.reflectionMirroring,
    data.futurePacing,
    data.offerPresentation,
    data.priceReveal,
    data.closeAndEnroll,
  ];

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/generate-discovery-call", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { discoveryCallScript } = await res.json() as { discoveryCallScript: DiscoveryCallScript };
      onRegenerate(discoveryCallScript);
      toast({ title: "Call script regenerated!", description: "Your updated script is ready." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Regeneration failed", description: msg, variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  }

  async function handleCopyAll() {
    const lines: string[] = [
      "=== DISCOVERY CALL SCRIPT ===",
      "",
      data.callOverview,
      "",
      "=== PRE-CALL PREP ===",
      ...data.prepChecklist.map((item, i) => `${i + 1}. ${item}`),
      "",
      ...phases.flatMap((phase) => [
        `=== ${phase.title.toUpperCase()} (${phase.duration}) ===`,
        "",
        phase.script,
        "",
        `[COACHING NOTES] ${phase.coachingNotes}`,
        "",
      ]),
      "=== OBJECTION SCRIPTS ===",
      "",
      ...data.objectionScripts.flatMap((o) => [
        `OBJECTION: ${o.objection}`,
        `RESPONSE: ${o.response}`,
        "",
      ]),
      "=== POST-CALL EMAIL ===",
      "",
      `Subject: ${data.postCallEmail.subject}`,
      "",
      data.postCallEmail.body,
      "",
      "=== CLOSING SCRIPT (IF NOT ENROLLING TODAY) ===",
      "",
      data.callClosingScript,
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    toast({ title: "Full call script copied!", description: "All phases and objection scripts copied." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  async function handleCopyEmail() {
    const text = `Subject: ${data.postCallEmail.subject}\n\n${data.postCallEmail.body}`;
    await navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    toast({ title: "Follow-up email copied!" });
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  async function handleCopyClosing() {
    await navigator.clipboard.writeText(data.callClosingScript);
    setCopiedClosing(true);
    toast({ title: "Closing script copied!" });
    setTimeout(() => setCopiedClosing(false), 2000);
  }

  function toggleObjection(idx: number) {
    setOpenObjections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function toggleExpandAllObjections() {
    if (openObjections.size < data.objectionScripts.length) {
      setOpenObjections(new Set(data.objectionScripts.map((_, i) => i)));
    } else {
      setOpenObjections(new Set());
    }
  }

  return (
    <div className="space-y-5">

      {/* Top bar */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-gray-500">
          Word-for-word discovery call script with 8 phases, objection handlers, and a post-call follow-up email — personalised to your offer.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {regenerating ? "Regenerating…" : "Regenerate"}
          </button>
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy full script</>
            }
          </button>
        </div>
      </div>

      {/* Call overview */}
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100">
            <Phone className="h-4.5 w-4.5 text-violet-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 mb-1">Call Overview</p>
            <p className="text-sm leading-relaxed text-violet-900">{data.callOverview}</p>
          </div>
        </div>
      </div>

      {/* Pre-call prep checklist */}
      <div>
        <SectionDivider label="Pre-Call Prep" colour="emerald" />
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-5">
          <ol className="space-y-3">
            {data.prepChecklist.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-800">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Call phases */}
      <div>
        <SectionDivider label="Call Phases" colour="blue" />
        <div className="mt-3 space-y-2">
          {phases.map((phase, i) => (
            <PhaseCard key={phase.title} phase={phase} index={i} />
          ))}
        </div>
      </div>

      {/* Objection scripts */}
      <div>
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-700">
            Objection Scripts
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <button
            onClick={toggleExpandAllObjections}
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            {openObjections.size < data.objectionScripts.length ? "Expand all" : "Collapse all"}
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {data.objectionScripts.map((obj, i) => {
            const isOpen = openObjections.has(i);
            return (
              <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => toggleObjection(i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {isOpen
                      ? <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                      : <ChevronRight className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    }
                    <p className="font-semibold text-gray-900 text-sm">{obj.objection}</p>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Response</p>
                    <CopyableItem value={obj.response} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Post-call follow-up email */}
      <div>
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700">
            Post-Call Follow-Up Email
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <button
            onClick={handleCopyEmail}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedEmail
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy email</>
            }
          </button>
        </div>
        <div className="mt-3 rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-3">
            <p className="text-xs text-gray-400 mb-0.5">Subject line</p>
            <p className="text-sm font-medium text-gray-900">{data.postCallEmail.subject}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-gray-400 mb-2">Body</p>
            <CopyableItem value={data.postCallEmail.body} />
          </div>
        </div>
      </div>

      {/* Closing script */}
      <div>
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600">
            Closing Script (If Not Enrolling Today)
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <button
            onClick={handleCopyClosing}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedClosing
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy</>
            }
          </button>
        </div>
        <div className="mt-3">
          <CopyableItem value={data.callClosingScript} />
        </div>
      </div>

    </div>
  );
}
