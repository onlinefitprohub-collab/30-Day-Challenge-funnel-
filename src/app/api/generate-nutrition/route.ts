import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasClaude } from "@/lib/ai/claude-client";
import { callClaudeGroup } from "@/lib/ai/claude-generate";
import { buildCoachContext } from "@/lib/ai/context";
import { buildNutritionPlanPrompt } from "@/lib/ai/prompts/nutrition-plan";
import { nutritionPlanSchema } from "@/lib/ai/validators";
import { wizardInputsSchema } from "@/types/wizard";
import type { NutritionPlan } from "@/types/generation";
import type { ProjectInputRow, ProjectRow } from "@/types/project";

/**
 * POST /api/generate-nutrition
 *
 * Generates a 30-day client nutrition plan on-demand for an existing project.
 * Merges the nutritionPlan key into the existing project_outputs row.
 *
 * Body: { projectId: string }
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json() as { projectId?: string };
    const { projectId } = body;
    if (!projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });

    // Verify project belongs to this user
    const { data: projectData } = await supabase
      .from("projects")
      .select("id, user_id, status")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    const project = projectData as Pick<ProjectRow, "id" | "user_id" | "status"> | null;
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Load wizard inputs
    const { data: inputData } = await supabase
      .from("project_inputs")
      .select("inputs")
      .eq("project_id", projectId)
      .single();

    const stored = inputData as Pick<ProjectInputRow, "inputs"> | null;
    if (!stored?.inputs) {
      return NextResponse.json(
        { error: "No saved inputs found — please re-run the wizard." },
        { status: 400 },
      );
    }

    const validatedInputs = wizardInputsSchema.parse(stored.inputs);
    const context = buildCoachContext(validatedInputs);
    const { system, user: userPrompt } = buildNutritionPlanPrompt(context);
    const prompt = `${system}\n\n${userPrompt}`;

    let nutritionPlan: NutritionPlan;

    if (!hasClaude()) {
      nutritionPlan = buildMockNutritionPlan(validatedInputs.challengeName ?? "30-Day Challenge");
    } else {
      const result = await callClaudeGroup<NutritionPlan>(
        prompt,
        nutritionPlanSchema,
        "nutrition-plan",
        8000,
        "claude-sonnet-4-6",
      );

      if (!result.data) {
        console.error("[generate-nutrition] Claude call failed:", result.error);
        nutritionPlan = buildMockNutritionPlan(validatedInputs.challengeName ?? "30-Day Challenge");
      } else {
        nutritionPlan = result.data;
      }
    }

    // Load existing outputs to merge into
    const { data: outputData } = await supabase
      .from("project_outputs")
      .select("id, outputs")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const outputRowId = (outputData as { id?: string } | null)?.id;
    const existingOutputs = (outputData?.outputs as Record<string, unknown>) ?? {};
    const mergedOutputs = { ...existingOutputs, nutritionPlan };

    if (outputRowId) {
      const { error } = await supabase
        .from("project_outputs")
        .update({ outputs: mergedOutputs })
        .eq("id", outputRowId);
      if (error) throw new Error(error.message);
    } else {
      const { data: runData } = await supabase
        .from("generation_runs")
        .insert({ project_id: projectId, status: "complete" })
        .select()
        .single();
      const runId = (runData as { id?: string } | null)?.id;
      const { error } = await supabase
        .from("project_outputs")
        .insert({ project_id: projectId, generation_run_id: runId, outputs: mergedOutputs });
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ success: true, nutritionPlan });

  } catch (error) {
    console.error("[generate-nutrition] error:", error);
    const message = error instanceof Error ? error.message : "Nutrition plan generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildMockNutritionPlan(challengeName: string): NutritionPlan {
  const mockMeals = (multiplier: number) => [
    {
      name: "Breakfast",
      time: "7:00 AM",
      foods: [
        { item: "Rolled oats", amount: "80g / ¾ cup", cals: 300, proteinG: 10, carbsG: 54, fatsG: 6 },
        { item: "Whey protein powder", amount: "30g / 1 scoop", cals: 120, proteinG: 25, carbsG: 3, fatsG: 1 },
        { item: "Banana", amount: "1 medium (120g)", cals: 105, proteinG: 1, carbsG: 27, fatsG: 0 },
      ],
      totalCals: Math.round(525 * multiplier),
      totalProteinG: 36,
    },
    {
      name: "Lunch",
      time: "12:30 PM",
      foods: [
        { item: "Chicken breast", amount: "150g", cals: 248, proteinG: 46, carbsG: 0, fatsG: 5 },
        { item: "Brown rice", amount: "100g cooked", cals: 111, proteinG: 3, carbsG: 23, fatsG: 1 },
        { item: "Mixed salad leaves", amount: "80g", cals: 16, proteinG: 1, carbsG: 2, fatsG: 0 },
        { item: "Olive oil", amount: "1 tsp (5ml)", cals: 40, proteinG: 0, carbsG: 0, fatsG: 5 },
      ],
      totalCals: Math.round(415 * multiplier),
      totalProteinG: 50,
    },
    {
      name: "Afternoon Snack",
      time: "3:30 PM",
      foods: [
        { item: "Greek yogurt (0%)", amount: "150g", cals: 87, proteinG: 15, carbsG: 6, fatsG: 0 },
        { item: "Blueberries", amount: "80g", cals: 46, proteinG: 1, carbsG: 11, fatsG: 0 },
      ],
      totalCals: Math.round(133 * multiplier),
      totalProteinG: 16,
    },
    {
      name: "Dinner",
      time: "7:00 PM",
      foods: [
        { item: "Salmon fillet", amount: "150g", cals: 285, proteinG: 36, carbsG: 0, fatsG: 16 },
        { item: "Sweet potato", amount: "200g", cals: 172, proteinG: 3, carbsG: 40, fatsG: 0 },
        { item: "Broccoli", amount: "150g steamed", cals: 51, proteinG: 5, carbsG: 8, fatsG: 1 },
      ],
      totalCals: Math.round(508 * multiplier),
      totalProteinG: 44,
    },
  ];

  const makeDayPlan = (label: string, cals: number, proteinG: number, carbsG: number, fatsG: number, isTraining: boolean): NutritionPlan["tiers"][0]["trainingDay"] => ({
    label,
    totalCals: cals,
    totalProteinG: proteinG,
    totalCarbsG: carbsG,
    totalFatsG: fatsG,
    meals: mockMeals(cals / 1581),
    hydration: isTraining ? "2.5–3 litres of water, plus 500ml extra per hour of training" : "2–2.5 litres of water throughout the day",
    preWorkout: "30–45 minutes before training: a banana or small bowl of oats with protein powder",
    postWorkout: "Within 30 minutes after training: protein shake with fast-digesting carbs to aid recovery",
  });

  return {
    planName: `${challengeName} — Client Nutrition Plan`,
    approach: "High-protein flexible dieting",
    principles: [
      "Protein first: aim for 30–40g of protein at every main meal to support muscle retention and satiety",
      "Whole foods 80% of the time: leave 20% flexibility for social meals and treats — no foods are banned",
      "Carbs around training: front-load carbohydrates in your pre- and post-workout meals when you need them most",
      "Hydration is non-negotiable: aim for a minimum of 2 litres of water daily — hunger is often thirst in disguise",
      "Consistency beats perfection: one off-plan day does not ruin progress — get back on track at your next meal",
    ],
    tiers: [
      {
        name: "Fat Loss",
        targetCals: 1600,
        rationale: "A 300–500 calorie daily deficit creating sustainable 1–2 lb/week fat loss. Best for participants whose primary goal is weight loss.",
        macros: { proteinPct: 35, carbsPct: 35, fatsPct: 30 },
        trainingDay: makeDayPlan("Training Day", 1650, 145, 145, 55, true),
        restDay: makeDayPlan("Rest Day", 1500, 140, 115, 58, false),
      },
      {
        name: "Maintenance",
        targetCals: 2000,
        rationale: "Approximately maintenance calories for body recomposition — losing fat while preserving or gaining lean muscle. Best for participants who want to change their body composition without a strict deficit.",
        macros: { proteinPct: 30, carbsPct: 40, fatsPct: 30 },
        trainingDay: makeDayPlan("Training Day", 2100, 158, 210, 70, true),
        restDay: makeDayPlan("Rest Day", 1900, 143, 190, 63, false),
      },
      {
        name: "Performance",
        targetCals: 2400,
        rationale: "A slight calorie surplus to fuel muscle growth and maximise training performance. Best for participants focused on strength gains and muscle building.",
        macros: { proteinPct: 30, carbsPct: 45, fatsPct: 25 },
        trainingDay: makeDayPlan("Training Day", 2500, 188, 281, 69, true),
        restDay: makeDayPlan("Rest Day", 2300, 173, 259, 64, false),
      },
    ],
    shoppingList: [
      "Chicken breast", "Salmon fillets", "Eggs (free range)", "Greek yogurt (0% fat)",
      "Whey protein powder", "Rolled oats", "Brown rice", "Sweet potato",
      "Whole grain bread", "Broccoli", "Spinach", "Mixed salad leaves",
      "Banana", "Blueberries", "Apple", "Olive oil", "Almonds",
      "Tinned tuna in spring water", "Cottage cheese", "Frozen mixed vegetables",
    ],
    mealPrepGuide: [
      "Sunday batch cook: roast 1kg of chicken breast, portion into 150g containers for 6–7 weekday lunches",
      "Cook 500g of brown rice in one go — it keeps for 4 days in the fridge and reheats in 2 minutes",
      "Hard-boil 6 eggs at the start of the week for quick high-protein snacks and breakfast additions",
      "Pre-portion overnight oats in jars for 5 days of grab-and-go breakfasts — takes 10 minutes Sunday evening",
      "Wash and chop all salad vegetables at the start of the week and store in airtight containers to save 10 minutes per meal",
    ],
    supplementNotes: "Keep it simple. A high-quality whey protein powder is the only supplement most challenge participants need — it makes hitting daily protein targets easier and more convenient. If your challenge is strength-focused, creatine monohydrate (5g/day) has the strongest evidence base for performance and is safe for most adults. Omega-3 fish oil (2–3g/day with food) supports joint health and recovery. Everything else — fat burners, pre-workouts, detox teas — is marketing. Save your money for quality food.",
    coachingNotes: "Introduce the three tiers at the start of the challenge and help each participant choose based on their primary goal, not what sounds most impressive. Most beginners overestimate how much they need to eat in a deficit and underestimate how much protein matters — gently redirect. Normalise imperfect eating: when a participant says they 'ruined everything' with one meal, remind them that one meal is 1 of 90 in a 30-day challenge. Create a meal check-in culture in your group — asking who prepped on Sunday keeps accountability high.",
    generatedAt: new Date().toISOString(),
  };
}
