import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
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

    const rateLimitError = checkRateLimit(user.id, "generate-nutrition", 1, 60_000);
    if (rateLimitError) return rateLimitError;

    const body = await request.json() as { projectId?: string };
    const { projectId } = body;
    if (!projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });

    // Verify project belongs to this user
    const { data: projectData } = await supabase
      .from("projects")
      .select("id, user_id, status")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

    const project = projectData as Pick<ProjectRow, "id" | "user_id" | "status"> | null;
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Load wizard inputs
    const { data: inputData } = await supabase
      .from("project_inputs")
      .select("inputs")
      .eq("project_id", projectId)
      .maybeSingle();

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
    let isMock = false;

    if (!hasClaude()) {
      nutritionPlan = buildMockNutritionPlan(validatedInputs.challengeName ?? "30-Day Challenge");
      isMock = true;
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
        isMock = true;
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
      .maybeSingle();

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
        .maybeSingle();
      const runId = (runData as { id?: string } | null)?.id;
      const { error } = await supabase
        .from("project_outputs")
        .insert({ project_id: projectId, generation_run_id: runId, outputs: mergedOutputs });
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ success: true, nutritionPlan, isMock });

  } catch (error) {
    console.error("[generate-nutrition] error:", error);
    const message = error instanceof Error ? error.message : "Nutrition plan generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildMockNutritionPlan(challengeName: string): NutritionPlan {
  // ── Fat Loss meals (light, Mediterranean/Asian-inspired, lean proteins + veg) ──
  const fatLossMeals = {
    training: [
      {
        name: "Breakfast",
        time: "7:00 AM",
        foods: [
          { item: "Scrambled egg whites (4) + 1 whole egg", amount: "170g / approx 5 eggs total", cals: 148, proteinG: 22, carbsG: 2, fatsG: 6 },
          { item: "Wilted spinach", amount: "100g", cals: 23, proteinG: 3, carbsG: 3, fatsG: 0 },
          { item: "Cherry tomatoes", amount: "100g", cals: 18, proteinG: 1, carbsG: 4, fatsG: 0 },
          { item: "Rye bread", amount: "1 slice (32g)", cals: 83, proteinG: 3, carbsG: 16, fatsG: 1 },
        ],
        totalCals: 272,
        totalProteinG: 29,
      },
      {
        name: "Mid-Morning Snack",
        time: "10:30 AM",
        foods: [
          { item: "Cottage cheese (low-fat)", amount: "200g", cals: 142, proteinG: 22, carbsG: 8, fatsG: 2 },
          { item: "Cucumber", amount: "100g sliced", cals: 16, proteinG: 1, carbsG: 3, fatsG: 0 },
          { item: "Rice cakes", amount: "2 plain (18g)", cals: 72, proteinG: 1, carbsG: 16, fatsG: 0 },
        ],
        totalCals: 230,
        totalProteinG: 24,
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        foods: [
          { item: "Turkey breast mince (cooked)", amount: "150g", cals: 165, proteinG: 36, carbsG: 0, fatsG: 2 },
          { item: "Courgetti (spiralised courgette)", amount: "200g", cals: 34, proteinG: 2, carbsG: 6, fatsG: 0 },
          { item: "Passata", amount: "100ml", cals: 28, proteinG: 1, carbsG: 6, fatsG: 0 },
          { item: "Feta cheese", amount: "25g", cals: 66, proteinG: 3, carbsG: 1, fatsG: 6 },
          { item: "Fresh basil + oregano", amount: "generous handful", cals: 5, proteinG: 0, carbsG: 1, fatsG: 0 },
        ],
        totalCals: 298,
        totalProteinG: 42,
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        foods: [
          { item: "Baked cod fillet", amount: "200g", cals: 180, proteinG: 40, carbsG: 0, fatsG: 2 },
          { item: "Roasted broccoli + cauliflower", amount: "250g", cals: 88, proteinG: 7, carbsG: 14, fatsG: 1 },
          { item: "Roasted cherry tomatoes", amount: "100g", cals: 30, proteinG: 1, carbsG: 6, fatsG: 0 },
          { item: "Extra virgin olive oil", amount: "1 tsp (5ml)", cals: 40, proteinG: 0, carbsG: 0, fatsG: 5 },
          { item: "Lemon + garlic seasoning", amount: "to taste", cals: 5, proteinG: 0, carbsG: 1, fatsG: 0 },
        ],
        totalCals: 343,
        totalProteinG: 48,
      },
    ],
    rest: [
      {
        name: "Breakfast",
        time: "8:00 AM",
        foods: [
          { item: "Greek yogurt (0% fat)", amount: "200g", cals: 116, proteinG: 20, carbsG: 8, fatsG: 0 },
          { item: "Mixed berries (frozen, thawed)", amount: "100g", cals: 45, proteinG: 1, carbsG: 11, fatsG: 0 },
          { item: "Ground flaxseed", amount: "1 tbsp (10g)", cals: 55, proteinG: 2, carbsG: 3, fatsG: 4 },
        ],
        totalCals: 216,
        totalProteinG: 23,
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        foods: [
          { item: "Tinned tuna in spring water", amount: "2 cans (240g drained)", cals: 216, proteinG: 50, carbsG: 0, fatsG: 2 },
          { item: "Avocado", amount: "½ medium (75g)", cals: 120, proteinG: 1, carbsG: 6, fatsG: 11 },
          { item: "Baby gem lettuce", amount: "80g", cals: 11, proteinG: 1, carbsG: 2, fatsG: 0 },
          { item: "Lemon juice + capers", amount: "to taste", cals: 5, proteinG: 0, carbsG: 1, fatsG: 0 },
        ],
        totalCals: 352,
        totalProteinG: 52,
      },
      {
        name: "Afternoon Snack",
        time: "4:00 PM",
        foods: [
          { item: "Boiled eggs", amount: "2 large", cals: 156, proteinG: 12, carbsG: 1, fatsG: 11 },
          { item: "Celery sticks", amount: "80g", cals: 13, proteinG: 1, carbsG: 3, fatsG: 0 },
        ],
        totalCals: 169,
        totalProteinG: 13,
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        foods: [
          { item: "Chicken breast (grilled)", amount: "175g", cals: 290, proteinG: 54, carbsG: 0, fatsG: 6 },
          { item: "Steamed asparagus", amount: "150g", cals: 30, proteinG: 3, carbsG: 5, fatsG: 0 },
          { item: "Edamame beans", amount: "80g shelled", cals: 98, proteinG: 8, carbsG: 7, fatsG: 4 },
          { item: "Soy-ginger dressing", amount: "1 tbsp", cals: 15, proteinG: 1, carbsG: 2, fatsG: 0 },
        ],
        totalCals: 433,
        totalProteinG: 66,
      },
    ],
  };

  // ── Maintenance meals (balanced, world-cuisine inspired, satisfying) ──
  const maintenanceMeals = {
    training: [
      {
        name: "Breakfast",
        time: "7:00 AM",
        foods: [
          { item: "Overnight oats", amount: "80g dry oats", cals: 306, proteinG: 10, carbsG: 54, fatsG: 6 },
          { item: "Whole milk", amount: "150ml", cals: 99, proteinG: 5, carbsG: 7, fatsG: 6 },
          { item: "Mixed berries", amount: "100g", cals: 45, proteinG: 1, carbsG: 11, fatsG: 0 },
          { item: "Almond butter", amount: "1 tbsp (15g)", cals: 90, proteinG: 3, carbsG: 3, fatsG: 8 },
          { item: "Chia seeds", amount: "1 tbsp (12g)", cals: 58, proteinG: 2, carbsG: 5, fatsG: 4 },
        ],
        totalCals: 598,
        totalProteinG: 21,
      },
      {
        name: "Lunch",
        time: "12:30 PM",
        foods: [
          { item: "Grilled chicken breast", amount: "150g", cals: 248, proteinG: 46, carbsG: 0, fatsG: 5 },
          { item: "Wholegrain wrap", amount: "1 large (65g)", cals: 180, proteinG: 6, carbsG: 34, fatsG: 3 },
          { item: "Avocado", amount: "½ medium (75g)", cals: 120, proteinG: 1, carbsG: 6, fatsG: 11 },
          { item: "Roasted red peppers", amount: "60g", cals: 20, proteinG: 1, carbsG: 4, fatsG: 0 },
          { item: "Hummus", amount: "30g / 2 tbsp", cals: 74, proteinG: 2, carbsG: 5, fatsG: 5 },
        ],
        totalCals: 642,
        totalProteinG: 56,
      },
      {
        name: "Afternoon Snack",
        time: "3:30 PM",
        foods: [
          { item: "Banana", amount: "1 large (136g)", cals: 121, proteinG: 1, carbsG: 31, fatsG: 0 },
          { item: "Peanut butter", amount: "1½ tbsp (24g)", cals: 144, proteinG: 6, carbsG: 5, fatsG: 12 },
        ],
        totalCals: 265,
        totalProteinG: 7,
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        foods: [
          { item: "Lean beef mince (5% fat)", amount: "150g cooked", cals: 225, proteinG: 34, carbsG: 0, fatsG: 10 },
          { item: "Sweet potato mash", amount: "200g", cals: 172, proteinG: 3, carbsG: 40, fatsG: 0 },
          { item: "Green beans", amount: "150g", cals: 37, proteinG: 2, carbsG: 8, fatsG: 0 },
          { item: "Mixed herbs + garlic + paprika", amount: "to taste", cals: 5, proteinG: 0, carbsG: 1, fatsG: 0 },
        ],
        totalCals: 439,
        totalProteinG: 39,
      },
    ],
    rest: [
      {
        name: "Breakfast",
        time: "8:00 AM",
        foods: [
          { item: "Whole eggs (scrambled)", amount: "3 large", cals: 210, proteinG: 18, carbsG: 2, fatsG: 15 },
          { item: "Wholegrain toast", amount: "2 slices (80g)", cals: 188, proteinG: 8, carbsG: 36, fatsG: 2 },
          { item: "Smashed avocado", amount: "½ medium (75g)", cals: 120, proteinG: 1, carbsG: 6, fatsG: 11 },
          { item: "Hot sauce", amount: "1 tsp", cals: 4, proteinG: 0, carbsG: 1, fatsG: 0 },
        ],
        totalCals: 522,
        totalProteinG: 27,
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        foods: [
          { item: "Smoked mackerel fillet", amount: "125g", cals: 296, proteinG: 25, carbsG: 0, fatsG: 21 },
          { item: "Wholegrain bread", amount: "2 slices (80g)", cals: 188, proteinG: 8, carbsG: 36, fatsG: 2 },
          { item: "Baby spinach", amount: "60g", cals: 14, proteinG: 2, carbsG: 2, fatsG: 0 },
          { item: "Beetroot (cooked)", amount: "80g", cals: 38, proteinG: 1, carbsG: 9, fatsG: 0 },
        ],
        totalCals: 536,
        totalProteinG: 36,
      },
      {
        name: "Afternoon Snack",
        time: "4:00 PM",
        foods: [
          { item: "Mixed nuts (unsalted)", amount: "30g", cals: 185, proteinG: 5, carbsG: 6, fatsG: 16 },
          { item: "Apple", amount: "1 medium (182g)", cals: 95, proteinG: 0, carbsG: 25, fatsG: 0 },
        ],
        totalCals: 280,
        totalProteinG: 5,
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        foods: [
          { item: "Salmon fillet", amount: "150g", cals: 285, proteinG: 36, carbsG: 0, fatsG: 16 },
          { item: "Brown basmati rice", amount: "100g cooked", cals: 111, proteinG: 3, carbsG: 23, fatsG: 1 },
          { item: "Tenderstem broccoli", amount: "150g", cals: 51, proteinG: 5, carbsG: 7, fatsG: 1 },
          { item: "Miso-ginger glaze", amount: "1 tbsp", cals: 25, proteinG: 1, carbsG: 4, fatsG: 1 },
        ],
        totalCals: 472,
        totalProteinG: 45,
      },
    ],
  };

  // ── Performance meals (high carb, larger portions, energising world cuisine) ──
  const performanceMeals = {
    training: [
      {
        name: "Breakfast",
        time: "6:30 AM",
        foods: [
          { item: "Rolled oats (large flake)", amount: "120g / 1½ cups", cals: 459, proteinG: 15, carbsG: 81, fatsG: 9 },
          { item: "Whole milk", amount: "200ml", cals: 132, proteinG: 7, carbsG: 10, fatsG: 8 },
          { item: "Whey protein powder", amount: "30g / 1 scoop", cals: 120, proteinG: 25, carbsG: 3, fatsG: 1 },
          { item: "Banana", amount: "1 large (136g)", cals: 121, proteinG: 1, carbsG: 31, fatsG: 0 },
          { item: "Honey", amount: "1 tbsp (20g)", cals: 60, proteinG: 0, carbsG: 16, fatsG: 0 },
        ],
        totalCals: 892,
        totalProteinG: 48,
      },
      {
        name: "Lunch",
        time: "12:30 PM",
        foods: [
          { item: "Salmon fillet (pan-seared)", amount: "200g", cals: 380, proteinG: 48, carbsG: 0, fatsG: 21 },
          { item: "Jasmine rice (cooked)", amount: "250g", cals: 325, proteinG: 6, carbsG: 71, fatsG: 1 },
          { item: "Pak choi (stir-fried)", amount: "150g", cals: 22, proteinG: 2, carbsG: 3, fatsG: 0 },
          { item: "Teriyaki sauce", amount: "2 tbsp (30ml)", cals: 40, proteinG: 1, carbsG: 9, fatsG: 0 },
          { item: "Sesame seeds", amount: "1 tsp (3g)", cals: 17, proteinG: 1, carbsG: 1, fatsG: 1 },
        ],
        totalCals: 784,
        totalProteinG: 58,
      },
      {
        name: "Afternoon Snack",
        time: "4:00 PM",
        foods: [
          { item: "Greek yogurt (full fat)", amount: "250g", cals: 248, proteinG: 18, carbsG: 12, fatsG: 14 },
          { item: "Granola", amount: "50g", cals: 224, proteinG: 5, carbsG: 35, fatsG: 8 },
          { item: "Honey drizzle", amount: "1 tsp (7g)", cals: 21, proteinG: 0, carbsG: 6, fatsG: 0 },
        ],
        totalCals: 493,
        totalProteinG: 23,
      },
      {
        name: "Dinner",
        time: "7:30 PM",
        foods: [
          { item: "Sirloin steak", amount: "220g", cals: 440, proteinG: 60, carbsG: 0, fatsG: 22 },
          { item: "Jacket potato", amount: "250g", cals: 218, proteinG: 5, carbsG: 50, fatsG: 0 },
          { item: "Asparagus (roasted)", amount: "150g", cals: 35, proteinG: 4, carbsG: 6, fatsG: 0 },
          { item: "Garlic butter", amount: "10g", cals: 71, proteinG: 0, carbsG: 0, fatsG: 8 },
        ],
        totalCals: 764,
        totalProteinG: 69,
      },
    ],
    rest: [
      {
        name: "Breakfast",
        time: "7:30 AM",
        foods: [
          { item: "Whole eggs (3) + egg whites (3)", amount: "5 eggs equivalent", cals: 260, proteinG: 28, carbsG: 2, fatsG: 16 },
          { item: "Wholegrain sourdough", amount: "2 thick slices (100g)", cals: 246, proteinG: 10, carbsG: 48, fatsG: 2 },
          { item: "Smashed avocado", amount: "1 medium (150g)", cals: 240, proteinG: 3, carbsG: 13, fatsG: 22 },
          { item: "Smoked salmon", amount: "60g", cals: 88, proteinG: 13, carbsG: 0, fatsG: 4 },
        ],
        totalCals: 834,
        totalProteinG: 54,
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        foods: [
          { item: "Chicken thighs (skinless, grilled)", amount: "200g", cals: 330, proteinG: 44, carbsG: 0, fatsG: 16 },
          { item: "Quinoa (cooked)", amount: "200g", cals: 242, proteinG: 9, carbsG: 44, fatsG: 4 },
          { item: "Roasted Mediterranean veg", amount: "200g", cals: 90, proteinG: 3, carbsG: 18, fatsG: 2 },
          { item: "Tahini dressing", amount: "1½ tbsp", cals: 83, proteinG: 2, carbsG: 3, fatsG: 7 },
        ],
        totalCals: 745,
        totalProteinG: 58,
      },
      {
        name: "Afternoon Snack",
        time: "4:00 PM",
        foods: [
          { item: "Cottage cheese", amount: "250g", cals: 178, proteinG: 28, carbsG: 10, fatsG: 2 },
          { item: "Pineapple chunks", amount: "100g", cals: 50, proteinG: 1, carbsG: 13, fatsG: 0 },
          { item: "Oat crackers", amount: "4 crackers (32g)", cals: 140, proteinG: 3, carbsG: 22, fatsG: 4 },
        ],
        totalCals: 368,
        totalProteinG: 32,
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        foods: [
          { item: "Lean pork tenderloin", amount: "200g", cals: 280, proteinG: 46, carbsG: 0, fatsG: 9 },
          { item: "Sweet potato (roasted, cubed)", amount: "250g", cals: 215, proteinG: 4, carbsG: 50, fatsG: 0 },
          { item: "Sugar snap peas", amount: "100g", cals: 42, proteinG: 3, carbsG: 8, fatsG: 0 },
          { item: "Hoisin-ginger glaze", amount: "1½ tbsp", cals: 55, proteinG: 1, carbsG: 12, fatsG: 0 },
        ],
        totalCals: 592,
        totalProteinG: 54,
      },
    ],
  };

  return {
    planName: `${challengeName} — Client Nutrition Plan`,
    approach: "High-protein, whole-food nutrition with three calorie tiers to suit every participant's goal",
    principles: [
      "Protein first: aim for 30–50g of protein at every main meal to support muscle retention, recovery, and satiety",
      "Whole foods, world flavours: use international cuisine inspiration to make healthy eating genuinely exciting — clients who enjoy their food stick to the plan",
      "Carbs are your fuel: time carbohydrates around training sessions to maximise performance and recovery — don't fear them",
      "Hydration is non-negotiable: aim for a minimum of 2 litres of water daily — hunger is often thirst in disguise",
      "Consistency over perfection: one off-plan meal is 1 of 90 in a 30-day challenge — acknowledge it and move on",
    ],
    tiers: [
      {
        name: "Fat Loss",
        targetCals: 1600,
        rationale: "A 300–500 calorie daily deficit creating sustainable 1–2 lb/week fat loss. Mediterranean and Asian-inspired meals keep food exciting while keeping calories controlled. Best for participants whose primary goal is weight and body fat reduction.",
        macros: { proteinPct: 35, carbsPct: 35, fatsPct: 30 },
        trainingDay: {
          label: "Training Day",
          totalCals: 1650,
          totalProteinG: 143,
          totalCarbsG: 145,
          totalFatsG: 54,
          meals: fatLossMeals.training,
          hydration: "2.5–3 litres of water throughout the day, plus 500ml extra per hour of training",
          preWorkout: "30–45 minutes before training: 2 rice cakes with cottage cheese or a small banana — fast carbs without heaviness",
          postWorkout: "Within 30 minutes after training: Greek yogurt with berries or a protein shake to kick-start recovery",
        },
        restDay: {
          label: "Rest Day",
          totalCals: 1500,
          totalProteinG: 140,
          totalCarbsG: 112,
          totalFatsG: 57,
          meals: fatLossMeals.rest,
          hydration: "2–2.5 litres of water throughout the day; add lemon slices or cucumber to make it more appealing",
          preWorkout: "No training today — focus on steady energy through balanced meals rather than workout timing",
          postWorkout: "No training today — prioritise recovery: lean protein with plenty of colourful vegetables at dinner",
        },
      },
      {
        name: "Maintenance",
        targetCals: 2000,
        rationale: "Approximately maintenance calories for body recomposition — losing fat while building lean muscle simultaneously. Balanced world-cuisine meals with satisfying portion sizes. Best for participants wanting body composition change without a strict deficit.",
        macros: { proteinPct: 30, carbsPct: 40, fatsPct: 30 },
        trainingDay: {
          label: "Training Day",
          totalCals: 2100,
          totalProteinG: 158,
          totalCarbsG: 210,
          totalFatsG: 70,
          meals: maintenanceMeals.training,
          hydration: "2.5–3 litres of water throughout the day, plus 500ml per hour of training",
          preWorkout: "45 minutes before training: banana with peanut butter on rice cakes — sustained carb energy with protein",
          postWorkout: "Within 30 minutes after training: beef bowl or chicken wrap from your lunch prep to refuel muscle glycogen",
        },
        restDay: {
          label: "Rest Day",
          totalCals: 1900,
          totalProteinG: 143,
          totalCarbsG: 186,
          totalFatsG: 62,
          meals: maintenanceMeals.rest,
          hydration: "2–2.5 litres of water throughout the day",
          preWorkout: "No training today — eat your meals at regular intervals to maintain steady blood sugar and energy",
          postWorkout: "No training today — focus on omega-3 rich foods like salmon or mackerel to support muscle recovery and joint health",
        },
      },
      {
        name: "Performance",
        targetCals: 2400,
        rationale: "A slight calorie surplus (200–300 kcal above maintenance) to fuel muscle growth and maximise training performance. Higher carbohydrate meals timed around training. Best for participants focused on strength gains, muscle building, and peak athletic output.",
        macros: { proteinPct: 30, carbsPct: 45, fatsPct: 25 },
        trainingDay: {
          label: "Training Day",
          totalCals: 2500,
          totalProteinG: 188,
          totalCarbsG: 281,
          totalFatsG: 69,
          meals: performanceMeals.training,
          hydration: "3–3.5 litres of water throughout the day, plus 500–750ml per hour of intense training",
          preWorkout: "45–60 minutes before training: large bowl of oats with banana and honey — maximum glycogen loading for peak performance",
          postWorkout: "Within 20 minutes after training: protein shake with a piece of fruit; follow with your main post-workout meal within 90 minutes",
        },
        restDay: {
          label: "Rest Day",
          totalCals: 2300,
          totalProteinG: 173,
          totalCarbsG: 252,
          totalFatsG: 64,
          meals: performanceMeals.rest,
          hydration: "2.5–3 litres of water throughout the day",
          preWorkout: "No training today — this is a recovery day; focus on micronutrient-rich vegetables and anti-inflammatory foods",
          postWorkout: "No training today — prioritise sleep, hydration, and a protein-rich dinner to maximise overnight muscle protein synthesis",
        },
      },
    ],
    shoppingList: [
      "Chicken breast (1kg bags)", "Salmon fillets (frozen portion packs)", "Sirloin steak", "Lean beef mince (5% fat)",
      "Turkey breast mince", "Eggs (free range, box of 12)", "Smoked salmon (pre-sliced)", "Tinned tuna in spring water",
      "Greek yogurt (0% and full-fat)", "Cottage cheese (low-fat)", "Whey protein powder", "Rolled oats (large flake)",
      "Jasmine rice", "Brown basmati rice", "Quinoa", "Wholegrain bread/sourdough", "Sweet potatoes", "Jacket potatoes",
      "Avocados", "Banana (bunch)", "Mixed berries (frozen)", "Broccoli / tenderstem broccoli", "Baby spinach (large bag)",
      "Courgettes (for spiralising)", "Asparagus", "Pak choi", "Cherry tomatoes", "Roasted red peppers (jar)",
      "Extra virgin olive oil", "Almond butter / peanut butter", "Mixed nuts (unsalted)", "Teriyaki sauce", "Miso paste",
      "Tahini", "Hummus (large tub)", "Granola (low-sugar)", "Honey", "Feta cheese", "Sesame seeds",
    ],
    mealPrepGuide: [
      "Sunday batch cook: season and roast 1kg of chicken breast at 200°C for 25 minutes — portion into 150–175g containers for the week's lunches",
      "Cook a large pot of rice or quinoa on Sunday — 500g of dry grain gives you 5–6 cooked portions; store in the fridge for up to 4 days",
      "Spiralise 4–5 courgettes and refrigerate raw — they keep for 3 days and cook in 2 minutes in a hot pan, making lunch prep almost instant",
      "Pre-make overnight oats for 5 mornings on Sunday evening: 80g oats + milk + toppings in airtight jars — grab and go, no cooking required",
      "Hard-boil 8 eggs on Sunday: 10 minutes boiling, ice bath to stop cooking — perfect high-protein snacks that last a week in the fridge",
    ],
    supplementNotes: "Keep your supplement stack simple and evidence-based. A high-quality whey protein powder is genuinely useful for most challenge participants — it makes hitting daily protein targets fast and convenient, especially post-workout. If your challenge is strength or performance focused, creatine monohydrate (3–5g per day, any time) has the most robust evidence base for improving strength and power output — it is safe, cheap, and effective. Omega-3 fish oil (2–3g per day with food) supports joint health, recovery, and cardiovascular health. Everything else — fat burners, pre-workouts, detox teas, collagen blends — is largely marketing. Save the money and spend it on quality whole foods instead.",
    coachingNotes: "Introduce the three tiers in your onboarding video or kick-off call and help each participant choose based on their honest primary goal, not what sounds most impressive. Most beginners gravitate towards Performance because it sounds exciting, but they will actually thrive on Maintenance. Normalise imperfect eating: when a participant messages saying they 'ruined everything' with one takeaway, remind them that one meal is literally 1 of 90 in a 30-day challenge and has zero meaningful impact on their results. Create a Sunday meal prep culture in your community group — weekly check-ins, photos of meal prep, and peer accountability will keep compliance high throughout the challenge.",
    generatedAt: new Date().toISOString(),
  };
}
