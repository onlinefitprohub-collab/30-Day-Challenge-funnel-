"use client";

import { useState, useEffect } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Dumbbell, Loader2, CheckCircle2 } from "lucide-react";

const WORKOUT_MESSAGES = [
  "Selecting exercises from Bodybuilding.com...",
  "Building Week 1 Foundation sessions...",
  "Designing progressive overload structure...",
  "Mapping training and recovery days...",
  "Writing Week 3 Intensity Surge sessions...",
  "Planning your Week 4 Final Challenge...",
  "Adding coaching notes and modifications...",
  "Finalising your 30-day programme...",
];
import { toast } from "@/hooks/use-toast";
import type { WorkoutPlan, WorkoutDay } from "@/types/generation";

// ─── Placeholder (no workout plan generated yet) ──────────────────────────────

interface WorkoutPlanPlaceholderProps {
  projectId: string;
  onGenerated: (plan: WorkoutPlan) => void;
}

export function WorkoutPlanPlaceholder({ projectId, onGenerated }: WorkoutPlanPlaceholderProps) {
  const [loading, setLoading] = useState(false);
  const [msgIdx, setMsgIdx]   = useState(0);

  useEffect(() => {
    if (!loading) { setMsgIdx(0); return; }
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % WORKOUT_MESSAGES.length), 3500);
    return () => clearInterval(id);
  }, [loading]);

  async function handleGenerate() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-workout", {
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
      const json = await res.json() as { workoutPlan: WorkoutPlan; isMock?: boolean };
      onGenerated(json.workoutPlan);
      if (json.isMock) {
        toast({ title: "Demo plan shown", description: "AI generation unavailable — displaying a template plan. Configure your API key to generate a personalised programme.", variant: "destructive" });
      } else {
        toast({ title: "Workout plan generated!", description: "Your 30-day programme is ready." });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50 to-white px-8 py-20 text-center">
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-indigo-200 animate-ping opacity-20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 shadow-lg shadow-indigo-200">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
        </div>
        <h3 className="mb-3 text-xl font-bold text-gray-900">Building your 30-day programme…</h3>
        <p className="mb-8 h-5 text-sm font-medium text-indigo-500">{WORKOUT_MESSAGES[msgIdx]}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Usually takes about 60 seconds
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
        <Dumbbell className="h-7 w-7 text-indigo-600" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Generate Your 30-Day Workout Plan</h3>
      <p className="mb-5 max-w-sm text-sm text-gray-500">
        A progressive 4-week programme tailored to your challenge type and target audience — with exercises sourced from Bodybuilding.com, muscle group tags, and coaching modifications.
      </p>
      <ul className="mb-6 w-full max-w-xs space-y-2 text-left">
        {[
          "28 daily sessions across 4 progressive weeks",
          "Exercises with BB.com links, sets, reps & rest",
          "Muscle group tags + beginner modifications",
          "Week 4 capstone Final Challenge sessions",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            {item}
          </li>
        ))}
      </ul>
      <span className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-200">
        ⏱ Takes ~60 seconds
      </span>
      <button
        onClick={handleGenerate}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
      >
        <Dumbbell className="h-4 w-4" /> Generate Workout Plan
      </button>
    </div>
  );
}

// ─── Day card ─────────────────────────────────────────────────────────────────

const TYPE_COLOURS: Record<WorkoutDay["type"], string> = {
  strength:        "bg-blue-100 text-blue-700",
  cardio:          "bg-green-100 text-green-700",
  hiit:            "bg-orange-100 text-orange-700",
  mobility:        "bg-purple-100 text-purple-700",
  rest:            "bg-gray-100 text-gray-500",
  "active-recovery": "bg-teal-100 text-teal-700",
};

function DayCard({ day }: { day: WorkoutDay }) {
  const [open, setOpen] = useState(false);
  const isRest = day.type === "rest";

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        onClick={() => !isRest && setOpen((o) => !o)}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left ${isRest ? "cursor-default" : "hover:bg-gray-50"} transition-colors`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
          {day.dayNumber}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{day.sessionName}</p>
          {!isRest && (
            <p className="text-xs text-gray-400">{day.durationMins} min</p>
          )}
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLOURS[day.type]}`}>
          {day.type.replace("-", " ")}
        </span>
        {!isRest && (
          open ? <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" /> : <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
        )}
      </button>

      {open && !isRest && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Warm-up</p>
            <p className="text-sm text-gray-700">{day.warmUp}</p>
          </div>

          {day.exercises.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Exercises</p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400">
                      <th className="pb-2 pr-4 font-medium">Exercise</th>
                      <th className="pb-2 pr-4 font-medium">Muscles</th>
                      <th className="pb-2 pr-4 font-medium">Sets</th>
                      <th className="pb-2 pr-4 font-medium">Reps</th>
                      <th className="pb-2 pr-4 font-medium">Rest</th>
                      <th className="pb-2 font-medium">Modification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {day.exercises.map((ex, i) => (
                      <tr key={i}>
                        <td className="py-1.5 pr-4 font-medium text-gray-900">{ex.name}</td>
                        <td className="py-1.5 pr-4">
                          <div className="flex flex-wrap gap-1">
                            {(ex.muscleGroups ?? []).map((m) => (
                              <span key={m} className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
                                {m}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-1.5 pr-4 text-gray-600">{ex.sets}</td>
                        <td className="py-1.5 pr-4 text-gray-600">{ex.reps}</td>
                        <td className="py-1.5 pr-4 text-gray-600">{ex.rest}</td>
                        <td className="py-1.5 text-gray-400 text-xs">{ex.modification ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Cool-down</p>
            <p className="text-sm text-gray-700">{day.coolDown}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Week accordion ───────────────────────────────────────────────────────────

function WeekAccordion({ week, defaultOpen }: { week: WorkoutPlan["weeks"][0]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          W{week.weekNumber}
        </span>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{week.theme}</p>
          <p className="text-xs text-gray-400">{week.focus}</p>
        </div>
        <span className="text-xs text-gray-400">{week.days.length} days</span>
        {open ? <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" /> : <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />}
      </button>
      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-2">
          {week.days.map((day) => (
            <DayCard key={day.dayNumber} day={day} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface WorkoutPlanSectionProps {
  data: WorkoutPlan;
  projectId: string;
  onRegenerate: (plan: WorkoutPlan) => void;
}

export function WorkoutPlanSection({ data, projectId, onRegenerate }: WorkoutPlanSectionProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  async function handleCopyAll() {
    const lines: string[] = [
      `PROGRAMME: ${data.programName}`,
      "",
      data.programOverview,
      "",
      `EQUIPMENT: ${data.equipmentNeeded.join(", ")}`,
      `WEEKLY SCHEDULE: ${data.weeklySchedule}`,
      "",
    ];
    for (const week of data.weeks) {
      lines.push(`── WEEK ${week.weekNumber}: ${week.theme.toUpperCase()} ──`);
      lines.push(week.focus);
      for (const day of week.days) {
        lines.push(`\nDay ${day.dayNumber} — ${day.sessionName} (${day.durationMins} min)`);
        if (day.exercises.length > 0) {
          lines.push("Warm-up: " + day.warmUp);
          for (const ex of day.exercises) {
            lines.push(`  • ${ex.name}: ${ex.sets} sets × ${ex.reps}, rest ${ex.rest}${ex.modification ? ` | Mod: ${ex.modification}` : ""}`);
          }
          lines.push("Cool-down: " + day.coolDown);
        }
      }
      lines.push("");
    }
    lines.push("NUTRITION GUIDANCE");
    lines.push(data.nutritionGuidance);
    lines.push("");
    lines.push("PROGRESSION RULES");
    lines.push(data.progressionRules);
    lines.push("");
    lines.push("COACHING NOTES");
    lines.push(data.coachingNotes);

    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    toast({ title: "Full programme copied!", description: "All 30 days copied as formatted text." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/generate-workout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { workoutPlan } = await res.json() as { workoutPlan: WorkoutPlan };
      onRegenerate(workoutPlan);
      toast({ title: "Workout plan regenerated!", description: "Your 30-day programme has been refreshed." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Regeneration failed", description: msg, variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{data.programName}</h2>
          <p className="mt-1 text-sm text-gray-500">{data.programOverview}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.equipmentNeeded.map((item) => (
              <span key={item} className="rounded-full border border-gray-200 bg-white px-3 py-0.5 text-xs font-medium text-gray-600">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400">{data.weeklySchedule}</p>
        </div>
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
              : <><Copy className="h-3.5 w-3.5" /> Copy full plan</>
            }
          </button>
        </div>
      </div>

      {/* Weeks */}
      <div className="space-y-3">
        {data.weeks.map((week) => (
          <WeekAccordion key={week.weekNumber} week={week} defaultOpen={week.weekNumber === 1} />
        ))}
      </div>

      {/* Nutrition + Coaching notes */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Nutrition Guidance</p>
          <p className="text-sm leading-relaxed text-gray-700">{data.nutritionGuidance}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Progression Rules</p>
          <p className="text-sm leading-relaxed text-gray-700">{data.progressionRules}</p>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Coaching Notes</p>
        <p className="text-sm leading-relaxed text-gray-700">{data.coachingNotes}</p>
      </div>
    </div>
  );
}
