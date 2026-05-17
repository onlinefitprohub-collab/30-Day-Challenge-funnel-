"use client";

import { useState, useEffect } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Loader2, Salad, CheckCircle2, Info } from "lucide-react";

const NUTRITION_MESSAGES = [
  "Calculating calorie targets for your audience...",
  "Building Fat Loss meal templates...",
  "Designing Maintenance day menus...",
  "Creating Performance fuel plans...",
  "Writing training day vs rest day meals...",
  "Selecting whole foods for your shopping list...",
  "Writing meal prep guide and batch-cook tips...",
  "Finalising your complete nutrition plan...",
];
import { toast } from "@/hooks/use-toast";
import type { NutritionPlan, NutritionTier, NutritionDayPlan } from "@/types/generation";

// ─── Placeholder ──────────────────────────────────────────────────────────────

interface NutritionPlanPlaceholderProps {
  projectId: string;
  onGenerated: (plan: NutritionPlan) => void;
}

export function NutritionPlanPlaceholder({ projectId, onGenerated }: NutritionPlanPlaceholderProps) {
  const [loading, setLoading] = useState(false);
  const [msgIdx, setMsgIdx]   = useState(0);

  useEffect(() => {
    if (!loading) { setMsgIdx(0); return; }
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % NUTRITION_MESSAGES.length), 3500);
    return () => clearInterval(id);
  }, [loading]);

  async function handleGenerate() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-nutrition", {
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
      const json = await res.json() as { nutritionPlan: NutritionPlan; isMock?: boolean };
      onGenerated(json.nutritionPlan);
      if (json.isMock) {
        toast({ title: "Demo plan shown", description: "AI generation unavailable — displaying a template plan. Configure your API key to generate a personalised plan.", variant: "destructive" });
      } else {
        toast({ title: "Nutrition plan generated!", description: "Your client meal plan is ready." });
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-green-200 bg-gradient-to-b from-green-50 to-white px-8 py-20 text-center">
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-green-200 animate-ping opacity-20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-600 shadow-lg shadow-green-200">
            <Salad className="h-8 w-8 text-white" />
          </div>
        </div>
        <h3 className="mb-3 text-xl font-bold text-gray-900">Building your nutrition plan…</h3>
        <p className="mb-8 h-5 text-sm font-medium text-green-600">{NUTRITION_MESSAGES[msgIdx]}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Usually takes about 60 seconds
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <p className="text-xs text-blue-700">
          <span className="font-semibold">This is a coach template, not a personalised plan.</span>{" "}
          It uses your challenge goal, challenge type, and target audience to calibrate calorie targets and meal themes.
          Your clients choose their tier (Fat Loss, Maintenance, or Performance) based on their individual goal.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-12 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <Salad className="h-7 w-7 text-green-600" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Generate Client Nutrition Plan</h3>
        <p className="mb-5 max-w-sm text-sm text-gray-500">
          World-cuisine inspired meal templates your challenge participants will actually look forward to eating — not another chicken-and-rice plan.
        </p>
        <ul className="mb-6 w-full max-w-xs space-y-2 text-left">
          {[
            "3 calorie tiers: Fat Loss, Maintenance & Performance",
            "Training day & rest day menus — completely different per tier",
            "Full macro breakdowns per food item with preparation inspiration",
            "Pantry shopping list + 5-step Sunday meal prep guide",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              {item}
            </li>
          ))}
        </ul>
        <span className="mb-4 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
          ⏱ Takes ~60 seconds
        </span>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          <Salad className="h-4 w-4" /> Generate Nutrition Plan
        </button>
      </div>
    </div>
  );
}

// ─── Macro bar ────────────────────────────────────────────────────────────────

function MacroBar({ proteinPct, carbsPct, fatsPct }: { proteinPct: number; carbsPct: number; fatsPct: number }) {
  return (
    <div className="space-y-1">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="bg-blue-500" style={{ width: `${proteinPct}%` }} />
        <div className="bg-amber-400" style={{ width: `${carbsPct}%` }} />
        <div className="bg-rose-400" style={{ width: `${fatsPct}%` }} />
      </div>
      <div className="flex gap-3 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-blue-500" />Protein {proteinPct}%</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-amber-400" />Carbs {carbsPct}%</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-rose-400" />Fats {fatsPct}%</span>
      </div>
    </div>
  );
}

// ─── Day plan view ────────────────────────────────────────────────────────────

function DayPlanView({ plan }: { plan: NutritionDayPlan }) {
  const [openMeal, setOpenMeal] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {/* Totals strip */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Calories", value: `${plan.totalCals} kcal`, colour: "text-gray-900" },
          { label: "Protein", value: `${plan.totalProteinG}g`, colour: "text-blue-600" },
          { label: "Carbs", value: `${plan.totalCarbsG}g`, colour: "text-amber-600" },
          { label: "Fats", value: `${plan.totalFatsG}g`, colour: "text-rose-600" },
        ].map(({ label, value, colour }) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-white p-2.5 text-center">
            <p className={`text-base font-bold ${colour}`}>{value}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Meals */}
      {plan.meals.map((meal) => (
        <div key={meal.name} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <button
            onClick={() => setOpenMeal(openMeal === meal.name ? null : meal.name)}
            className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-900">{meal.name}</span>
              <span className="text-xs text-gray-400">{meal.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500">{meal.totalCals} kcal · {meal.totalProteinG}g protein</span>
              {openMeal === meal.name
                ? <ChevronDown className="h-4 w-4 text-gray-400" />
                : <ChevronRight className="h-4 w-4 text-gray-400" />}
            </div>
          </button>
          {openMeal === meal.name && (
            <div className="border-t border-gray-100 px-4 pb-4 pt-3">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wide text-gray-400">
                      <th className="pb-2 pr-4 font-medium">Food</th>
                      <th className="pb-2 pr-4 font-medium">Amount</th>
                      <th className="pb-2 pr-3 font-medium text-right">Cal</th>
                      <th className="pb-2 pr-3 font-medium text-right text-blue-500">P(g)</th>
                      <th className="pb-2 pr-3 font-medium text-right text-amber-500">C(g)</th>
                      <th className="pb-2 font-medium text-right text-rose-500">F(g)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {meal.foods.map((food, i) => (
                      <tr key={i}>
                        <td className="py-1.5 pr-4 font-medium text-gray-800">{food.item}</td>
                        <td className="py-1.5 pr-4 text-gray-500 text-xs">{food.amount}</td>
                        <td className="py-1.5 pr-3 text-right text-gray-600">{food.cals}</td>
                        <td className="py-1.5 pr-3 text-right text-blue-600">{food.proteinG}</td>
                        <td className="py-1.5 pr-3 text-right text-amber-600">{food.carbsG}</td>
                        <td className="py-1.5 text-right text-rose-600">{food.fatsG}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Hydration + timing notes */}
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-blue-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500 mb-1">Hydration</p>
          <p className="text-xs text-blue-800">{plan.hydration}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-amber-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 mb-1">Pre-Workout</p>
          <p className="text-xs text-amber-800">{plan.preWorkout}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-green-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-green-600 mb-1">Post-Workout</p>
          <p className="text-xs text-green-800">{plan.postWorkout}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Tier card ────────────────────────────────────────────────────────────────

const TIER_COLOURS = {
  "Fat Loss":    { badge: "bg-rose-100 text-rose-700 border-rose-200",   ring: "ring-rose-400" },
  "Maintenance": { badge: "bg-amber-100 text-amber-700 border-amber-200", ring: "ring-amber-400" },
  "Performance": { badge: "bg-blue-100 text-blue-700 border-blue-200",   ring: "ring-blue-400" },
};

function TierCard({ tier }: { tier: NutritionTier }) {
  const [day, setDay] = useState<"training" | "rest">("training");
  const colours = TIER_COLOURS[tier.name as keyof typeof TIER_COLOURS] ?? { badge: "bg-gray-100 text-gray-700 border-gray-200", ring: "ring-gray-400" };

  return (
    <div className="space-y-4">
      {/* Tier header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colours.badge}`}>
              {tier.name}
            </span>
            <span className="text-sm font-bold text-gray-900">{tier.targetCals} kcal target</span>
          </div>
          <p className="mt-1.5 text-sm text-gray-500">{tier.rationale}</p>
        </div>
        <div className="sm:w-40 shrink-0">
          <MacroBar proteinPct={tier.macros.proteinPct} carbsPct={tier.macros.carbsPct} fatsPct={tier.macros.fatsPct} />
        </div>
      </div>

      {/* Training/Rest day toggle */}
      <div className="flex gap-2">
        {(["training", "rest"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              day === d
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {d === "training" ? "Training Day" : "Rest Day"}
          </button>
        ))}
      </div>

      <DayPlanView plan={day === "training" ? tier.trainingDay : tier.restDay} />
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface NutritionPlanSectionProps {
  data: NutritionPlan;
  projectId: string;
  onRegenerate: (plan: NutritionPlan) => void;
}

export function NutritionPlanSection({ data, projectId, onRegenerate }: NutritionPlanSectionProps) {
  const [activeTier, setActiveTier] = useState(0);
  const [copiedAll, setCopiedAll]   = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [confirming, setConfirming]     = useState(false);
  const [showShop, setShowShop]     = useState(false);
  const [showPrep, setShowPrep]     = useState(false);

  async function handleCopyAll() {
    const lines: string[] = [data.planName, "", `Approach: ${data.approach}`, "", "PRINCIPLES:"];
    data.principles.forEach((p, i) => lines.push(`${i + 1}. ${p}`));
    for (const tier of data.tiers) {
      lines.push("", `── ${tier.name.toUpperCase()} (${tier.targetCals} kcal) ──`);
      lines.push(tier.rationale);
      for (const dayPlan of [tier.trainingDay, tier.restDay]) {
        lines.push(`\n${dayPlan.label} — ${dayPlan.totalCals} kcal | P: ${dayPlan.totalProteinG}g C: ${dayPlan.totalCarbsG}g F: ${dayPlan.totalFatsG}g`);
        for (const meal of dayPlan.meals) {
          lines.push(`  ${meal.name} (${meal.time}): ${meal.totalCals} kcal / ${meal.totalProteinG}g protein`);
          meal.foods.forEach((f) => lines.push(`    - ${f.item} ${f.amount}: ${f.cals} cal`));
        }
      }
    }
    lines.push("", "SHOPPING LIST:");
    data.shoppingList.forEach((item) => lines.push(`• ${item}`));
    lines.push("", "MEAL PREP GUIDE:");
    data.mealPrepGuide.forEach((tip, i) => lines.push(`${i + 1}. ${tip}`));
    lines.push("", "SUPPLEMENT NOTES:", data.supplementNotes);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    toast({ title: "Full nutrition plan copied!" });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/generate-nutrition", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { nutritionPlan } = await res.json() as { nutritionPlan: NutritionPlan };
      onRegenerate(nutritionPlan);
      toast({ title: "Nutrition plan regenerated!" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Regeneration failed", description: msg, variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  }

  const tier = data.tiers[activeTier];

  return (
    <div className="space-y-5">
      {/* Coach context note */}
      <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <p className="text-xs text-blue-700">
          <span className="font-semibold">Coach template — calibrated to your challenge goal and target audience.</span>{" "}
          Share the full plan with participants and ask them to choose their tier. Fat Loss = calorie deficit; Maintenance = body recomposition; Performance = muscle-building surplus.
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{data.planName}</h2>
          <p className="mt-1 text-sm text-gray-500">{data.approach}</p>
          {data.generatedAt && (
            <p className="text-xs text-gray-400 mt-0.5">Generated {new Date(data.generatedAt).toLocaleDateString()}</p>
          )}
        </div>
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
            {regenerating ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Regenerating…</> : "Regenerate"}
          </button>
          )}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy full plan</>}
          </button>
        </div>
      </div>

      {/* Principles */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Core Principles</p>
        <ul className="space-y-2">
          {data.principles.map((p, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-[10px] font-bold text-green-700">{i + 1}</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Tier selector */}
      <div className="flex gap-2">
        {data.tiers.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActiveTier(i)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTier === i
                ? "bg-gray-900 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {t.name}
            <span className={`ml-1.5 text-xs font-normal ${activeTier === i ? "text-gray-400" : "text-gray-400"}`}>
              {t.targetCals} kcal
            </span>
          </button>
        ))}
      </div>

      {/* Active tier */}
      {tier && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <TierCard tier={tier} />
        </div>
      )}

      {/* Shopping list + Prep guide */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white">
          <button
            onClick={() => setShowShop((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <p className="font-semibold text-gray-900 text-sm">Pantry Shopping List</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{data.shoppingList.length} items</span>
              {showShop ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
            </div>
          </button>
          {showShop && (
            <div className="border-t border-gray-100 px-5 pb-4 pt-3">
              <div className="grid grid-cols-2 gap-1.5">
                {data.shoppingList.map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <button
            onClick={() => setShowPrep((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <p className="font-semibold text-gray-900 text-sm">Weekly Meal Prep Guide</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{data.mealPrepGuide.length} tips</span>
              {showPrep ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
            </div>
          </button>
          {showPrep && (
            <div className="border-t border-gray-100 px-5 pb-4 pt-3 space-y-2">
              {data.mealPrepGuide.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[9px] font-bold text-amber-700">{i + 1}</span>
                  {tip}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Supplement notes + Coaching notes */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Supplement Notes</p>
          <p className="text-sm leading-relaxed text-gray-700">{data.supplementNotes}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Coaching Notes</p>
          <p className="text-sm leading-relaxed text-gray-700">{data.coachingNotes}</p>
        </div>
      </div>
    </div>
  );
}
