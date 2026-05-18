"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Map, Loader2, Zap, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { LaunchRoadmap, RoadmapPhase, RoadmapTask } from "@/types/launch-roadmap";

// ─── Category badges ──────────────────────────────────────────────────────────

const CATEGORY_BADGE: Record<string, string> = {
  setup:    "bg-blue-50 text-blue-700 border-blue-100",
  content:  "bg-emerald-50 text-emerald-700 border-emerald-100",
  ads:      "bg-orange-50 text-orange-700 border-orange-100",
  sales:    "bg-violet-50 text-violet-700 border-violet-100",
  delivery: "bg-cyan-50 text-cyan-700 border-cyan-100",
  growth:   "bg-pink-50 text-pink-700 border-pink-100",
};

const CATEGORY_LABEL: Record<string, string> = {
  setup:    "Setup",
  content:  "Content",
  ads:      "Ads",
  sales:    "Sales",
  delivery: "Delivery",
  growth:   "Growth",
};

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({ task, index }: { task: RoadmapTask; index: number }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug text-gray-800">{task.task}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${CATEGORY_BADGE[task.category] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
            {CATEGORY_LABEL[task.category] ?? task.category}
          </span>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {task.timeEstimate}
          </span>
          {task.fitproAsset && (
            <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 border border-brand-100">
              {task.fitproAsset}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Phase accordion card ─────────────────────────────────────────────────────

const PHASE_ICON_COLOURS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
];

function PhaseCard({ phase, index }: { phase: RoadmapPhase; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const colour = PHASE_ICON_COLOURS[index % PHASE_ICON_COLOURS.length];

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${colour}`}>
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{phase.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{phase.timing}</p>
          </div>
        </div>
        <div className="ml-3 shrink-0 text-gray-400">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          {/* Goal */}
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Goal</p>
            <p className="text-sm text-gray-800">{phase.goal}</p>
          </div>

          {/* Tasks */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Tasks</p>
            <div>
              {phase.tasks.map((task, i) => (
                <TaskRow key={i} task={task} index={i} />
              ))}
            </div>
          </div>

          {/* Completion marker */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1">Phase Complete When…</p>
            <p className="text-sm text-emerald-800">{phase.completionMarker}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────

interface LaunchRoadmapPlaceholderProps {
  projectId: string;
  onGenerated: (roadmap: LaunchRoadmap) => void;
}

export function LaunchRoadmapPlaceholder({ projectId, onGenerated }: LaunchRoadmapPlaceholderProps) {
  const [loading, setLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  async function handleGenerate() {
    if (loading) return;
    setGenError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate-launch-roadmap", {
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
      const json = await res.json() as { launchRoadmap: LaunchRoadmap; isMock?: boolean };
      onGenerated(json.launchRoadmap);
      if (json.isMock) {
        toast({ title: "Demo roadmap shown", description: "AI generation unavailable — displaying a template plan. Configure your API key for personalised output.", variant: "destructive" });
      } else {
        toast({ title: "Launch roadmap generated!", description: "Your step-by-step launch plan is ready." });
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
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
        {loading ? (
          <Loader2 className="h-7 w-7 text-blue-600 animate-spin" />
        ) : (
          <Map className="h-7 w-7 text-blue-600" />
        )}
      </div>
      {genError && (
        <div className="mb-4 flex w-full max-w-sm items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <span>{genError}</span>
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {loading ? "Generating your launch roadmap…" : "Generate Launch Roadmap"}
      </h3>
      {loading ? (
        <p className="mb-6 max-w-sm text-sm text-gray-500">
          This usually takes 1–2 minutes — your complete 6-phase launch plan is being built.
        </p>
      ) : (
        <>
          <p className="mb-5 max-w-sm text-sm text-gray-500">
            A complete week-by-week launch plan — from technical setup to post-challenge growth — with every task tied to your FitPro assets.
          </p>
          <ul className="mb-6 w-full max-w-xs space-y-2 text-left">
            {[
              "6 launch phases mapped week by week",
              "Every task linked to the FitPro assets you've generated",
              "Time estimates per task so you know what to prioritise",
              "Phase completion markers to track your progress",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                {item}
              </li>
            ))}
          </ul>
          <span className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
            ⏱ Takes 1–2 minutes
          </span>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <Map className="h-4 w-4" /> {genError ? "Try again" : "Generate Launch Roadmap"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface LaunchRoadmapSectionProps {
  data: LaunchRoadmap;
  projectId: string;
  onRegenerate: (roadmap: LaunchRoadmap) => void;
}

export function LaunchRoadmapSection({ data, projectId, onRegenerate }: LaunchRoadmapSectionProps) {
  const [regenerating, setRegenerating] = useState(false);
  const [confirming, setConfirming]     = useState(false);
  const [copiedAll, setCopiedAll]       = useState(false);

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/generate-launch-roadmap", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { launchRoadmap } = await res.json() as { launchRoadmap: LaunchRoadmap };
      onRegenerate(launchRoadmap);
      toast({ title: "Launch roadmap regenerated!", description: "Your updated plan is ready." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Regeneration failed", description: msg, variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  }

  async function handleCopyAll() {
    const lines: string[] = [
      "=== LAUNCH ROADMAP ===",
      "",
      data.overview,
      "",
      `Time to Launch: ${data.totalTimeToLaunch}`,
      "",
      "=== QUICK-START PRIORITIES ===",
      ...data.quickStartPriorities.map((p, i) => `${i + 1}. ${p}`),
      "",
    ];
    data.phases.forEach((phase) => {
      lines.push(`=== PHASE: ${phase.name.toUpperCase()} (${phase.timing}) ===`);
      lines.push(`Goal: ${phase.goal}`);
      lines.push("");
      lines.push("Tasks:");
      phase.tasks.forEach((t, i) => {
        let row = `${i + 1}. ${t.task} [${t.category}] — ${t.timeEstimate}`;
        if (t.fitproAsset) row += ` (Asset: ${t.fitproAsset})`;
        lines.push(row);
      });
      lines.push("");
      lines.push(`Phase complete when: ${phase.completionMarker}`);
      lines.push("");
    });
    lines.push("=== COMMON MISTAKES ===");
    data.commonMistakes.forEach((m, i) => lines.push(`${i + 1}. ${m}`));
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    toast({ title: "Launch roadmap copied!" });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div className="space-y-5">

      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm text-gray-500">
          A 6-phase launch roadmap tying every FitPro Launch asset to a specific week and task — from technical setup to post-challenge upsell.
        </p>
        <div className="flex shrink-0 gap-2">
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
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {regenerating ? "Regenerating…" : "Regenerate"}
          </button>
          )}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy roadmap</>
            }
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <Map className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Launch Plan Overview</p>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {data.totalTimeToLaunch}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-blue-900">{data.overview}</p>
          </div>
        </div>
      </div>

      {/* Quick-start priorities */}
      <div>
        <div className="flex items-center gap-2 pb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700">
            <Zap className="h-3 w-3" /> Quick-Start Priorities
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <p className="text-xs text-gray-400">Do these first</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-5">
          <ol className="space-y-3">
            {data.quickStartPriorities.map((priority, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-800">{priority}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Phase cards */}
      <div>
        <div className="flex items-center gap-2 pb-3">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700">
            Launch Phases
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <p className="text-xs text-gray-400">{data.phases.length} phases</p>
        </div>
        <div className="space-y-2">
          {data.phases.map((phase, i) => (
            <PhaseCard key={phase.name} phase={phase} index={i} />
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div>
        <div className="flex items-center gap-2 pt-1 pb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-700">
            <AlertTriangle className="h-3 w-3" /> Common Mistakes to Avoid
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="rounded-xl border border-red-100 bg-white p-5">
          <ul className="space-y-3">
            {data.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  !
                </span>
                <p className="text-sm leading-relaxed text-gray-700">{mistake}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
