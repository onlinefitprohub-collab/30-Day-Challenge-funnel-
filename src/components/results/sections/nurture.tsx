"use client";

import { useState } from "react";
import { Copy, Check, CalendarDays, ChevronDown, ChevronRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";
import type { NurtureSequence, NurtureEmail } from "@/types/generation";

// ─── Placeholder (not yet generated) ─────────────────────────────────────────

interface NurturePlaceholderProps {
  projectId: string;
  onGenerated: (sequence: NurtureSequence) => void;
}

export function NurturePlaceholder({ projectId, onGenerated }: NurturePlaceholderProps) {
  const [loading, setLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  async function handleGenerate() {
    if (loading) return;
    setGenError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate-nurture", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string; retryAfter?: number };
        const msg = res.status === 429
          ? `Please wait ${err.retryAfter ?? 30}s before generating again.`
          : (err.error ?? `HTTP ${res.status}`);
        throw new Error(msg);
      }
      const json = await res.json() as { nurtureSequence: NurtureSequence; isMock?: boolean };
      onGenerated(json.nurtureSequence);
      if (json.isMock) {
        toast({ title: "Demo sequence shown", description: "No API key found — showing a template. Add your Anthropic key for a personalised 52-week sequence." });
      } else {
        toast({ title: "52-week nurture generated!", description: "A full year of emails is ready." });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      setGenError(msg);
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
        {loading ? (
          <Loader2 className="h-7 w-7 text-violet-600 animate-spin" />
        ) : (
          <CalendarDays className="h-7 w-7 text-violet-600" />
        )}
      </div>
      {genError && (
        <div className="mb-4 flex w-full max-w-sm items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <span>{genError}</span>
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Generate Your 52-Week Nurture Sequence</h3>
      <p className="mb-5 max-w-sm text-sm text-gray-500">
        A full year of weekly emails tailored to your challenge type and audience — ready to load straight into GHL or any email platform.
      </p>
      <ul className="mb-6 w-full max-w-xs space-y-2 text-left">
        {[
          "52 unique weekly emails — one per week for a full year",
          "Organised by quarter with themed arcs (Foundation → Legacy)",
          "Each email has a subject line + full body copy",
          "Ready to paste into GHL, ActiveCampaign, or any platform",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
            {item}
          </li>
        ))}
      </ul>
      <span className="mb-4 inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 border border-violet-200">
        ⏱ Takes ~30 seconds
      </span>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating 52 emails…
          </>
        ) : (
          <>
            <CalendarDays className="h-4 w-4" />
            {genError ? "Try again" : "Generate 52-Week Nurture"}
          </>
        )}
      </button>
    </div>
  );
}

// ─── Section (sequence generated) ────────────────────────────────────────────

interface NurtureSectionProps {
  data: NurtureSequence;
  projectId: string;
  onRegenerate: (sequence: NurtureSequence) => void;
}

interface Quarter {
  label: string;
  weeks: [number, number]; // [start, end] inclusive
  colorClass: string;
  badgeClass: string;
}

const QUARTERS: Quarter[] = [
  { label: "Q1: Foundation",     weeks: [1,  13], colorClass: "border-blue-200 bg-blue-50",    badgeClass: "bg-blue-100 text-blue-700" },
  { label: "Q2: Momentum",       weeks: [14, 26], colorClass: "border-emerald-200 bg-emerald-50", badgeClass: "bg-emerald-100 text-emerald-700" },
  { label: "Q3: Transformation", weeks: [27, 39], colorClass: "border-amber-200 bg-amber-50",  badgeClass: "bg-amber-100 text-amber-700" },
  { label: "Q4: Legacy",         weeks: [40, 52], colorClass: "border-violet-200 bg-violet-50", badgeClass: "bg-violet-100 text-violet-700" },
];

export function NurtureSection({ data, projectId, onRegenerate }: NurtureSectionProps) {
  const [openWeeks, setOpenWeeks]     = useState<Set<number>>(new Set());
  const [openQuarters, setOpenQuarters] = useState<Set<number>>(new Set([0])); // Q1 open by default
  const [copiedAll, setCopiedAll]     = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [confirming, setConfirming]     = useState(false);

  function toggleWeek(week: number) {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week); else next.add(week);
      return next;
    });
  }

  function toggleQuarter(qi: number) {
    setOpenQuarters((prev) => {
      const next = new Set(prev);
      if (next.has(qi)) next.delete(qi); else next.add(qi);
      return next;
    });
  }

  async function handleCopyAll() {
    const text = data.emails
      .map((e) => `WEEK ${e.week} — ${e.theme.toUpperCase()}\nSubject: ${e.subject}\n\n${e.body}`)
      .join("\n\n---\n\n");
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast({ title: "All 52 emails copied!", description: "Paste into your email platform." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/generate-nurture", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { nurtureSequence } = await res.json() as { nurtureSequence: NurtureSequence };
      onRegenerate(nurtureSequence);
      toast({ title: "Nurture sequence regenerated!", description: "52 fresh emails ready." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Regeneration failed", description: msg, variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  }

  const emailsByWeek = new Map<number, NurtureEmail>(data.emails.map((e) => [e.week, e]));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            52 weekly emails — one per week for a full year, organised by quarter.
          </p>
          {data.generatedAt && (
            <p className="text-xs text-gray-400 mt-0.5">
              Generated {new Date(data.generatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {confirming && !regenerating ? (
            <span className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Replace existing content?</span>
              <button onClick={() => { setConfirming(false); void handleRegenerate(); }} className="font-semibold text-red-600 hover:text-red-800">Yes</button>
              <span className="text-gray-300">·</span>
              <button onClick={() => setConfirming(false)} className="text-gray-400 hover:text-gray-600">No</button>
            </span>
          ) : (
          <button
            onClick={() => setConfirming(true)}
            disabled={regenerating}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {regenerating ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Regenerating…</> : "Regenerate"}
          </button>
          )}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy all 52 emails</>
            }
          </button>
        </div>
      </div>

      {/* Quarters */}
      {QUARTERS.map((q, qi) => {
        const [wStart, wEnd] = q.weeks;
        const quarterEmails: NurtureEmail[] = [];
        for (let w = wStart; w <= wEnd; w++) {
          const email = emailsByWeek.get(w);
          if (email) quarterEmails.push(email);
        }
        const isQOpen = openQuarters.has(qi);

        return (
          <div key={qi} className={`rounded-xl border overflow-hidden ${q.colorClass}`}>
            {/* Quarter header */}
            <button
              onClick={() => toggleQuarter(qi)}
              className="flex w-full items-center justify-between px-5 py-4 text-left hover:brightness-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${q.badgeClass}`}>
                  {q.label}
                </span>
                <span className="text-sm text-gray-500">Weeks {wStart}–{wEnd}</span>
                <span className="text-xs text-gray-400">{quarterEmails.length} emails</span>
              </div>
              {isQOpen
                ? <ChevronDown className="h-4 w-4 text-gray-400" />
                : <ChevronRight className="h-4 w-4 text-gray-400" />
              }
            </button>

            {/* Week rows */}
            {isQOpen && (
              <div className="border-t border-gray-200 bg-white divide-y divide-gray-100">
                {quarterEmails.map((email) => {
                  const isOpen = openWeeks.has(email.week);
                  return (
                    <div key={email.week}>
                      <button
                        onClick={() => toggleWeek(email.week)}
                        className="flex w-full items-start justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <span className="mt-0.5 shrink-0 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-mono font-semibold text-gray-600 min-w-[3rem]">
                            Wk {email.week}
                          </span>
                          <div className="min-w-0">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mr-2 ${q.badgeClass}`}>
                              {email.theme}
                            </span>
                            {!isOpen && (
                              <span className="text-xs text-gray-400 italic">{email.subject}</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-2 shrink-0 text-gray-400">
                          {isOpen
                            ? <ChevronDown className="h-4 w-4" />
                            : <ChevronRight className="h-4 w-4" />
                          }
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
                          <div>
                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Subject Line</p>
                            <CopyableItem value={email.subject} />
                          </div>
                          <div>
                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Email Body</p>
                            <CopyableItem value={email.body} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
