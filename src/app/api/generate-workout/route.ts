import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasClaude } from "@/lib/ai/claude-client";
import { callClaudeGroup } from "@/lib/ai/claude-generate";
import { buildCoachContext } from "@/lib/ai/context";
import { buildWorkoutPlanPrompt } from "@/lib/ai/prompts/workout-plan";
import { workoutPlanSchema } from "@/lib/ai/validators";
import { wizardInputsSchema } from "@/types/wizard";
import type { WorkoutPlan } from "@/types/generation";
import type { ProjectInputRow, ProjectRow } from "@/types/project";

/**
 * POST /api/generate-workout
 *
 * Generates a personalised 30-day workout programme on-demand for an
 * existing project. Does NOT regenerate the whole funnel — merges the
 * workoutPlan key into the existing project_outputs row and returns it.
 *
 * Body: { projectId: string }
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as { projectId?: string };
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    // Verify project belongs to this user
    const { data: projectData } = await supabase
      .from("projects")
      .select("id, user_id, status")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    const project = projectData as Pick<ProjectRow, "id" | "user_id" | "status"> | null;
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

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
    const { system, user: userPrompt } = buildWorkoutPlanPrompt(context);
    const prompt = `${system}\n\n${userPrompt}`;

    let workoutPlan: WorkoutPlan;

    if (!hasClaude()) {
      // Mock workout plan when no API key is configured
      workoutPlan = buildMockWorkoutPlan(validatedInputs.challengeName ?? "30-Day Challenge");
    } else {
      const result = await callClaudeGroup<WorkoutPlan>(
        prompt,
        workoutPlanSchema,
        "workout-plan",
        6000,
        "claude-sonnet-4-6",
      );

      if (!result.data) {
        console.error("[generate-workout] Claude call failed:", result.error);
        workoutPlan = buildMockWorkoutPlan(validatedInputs.challengeName ?? "30-Day Challenge");
      } else {
        workoutPlan = result.data;
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

    const mergedOutputs = { ...existingOutputs, workoutPlan };

    if (outputRowId) {
      const { error } = await supabase
        .from("project_outputs")
        .update({ outputs: mergedOutputs })
        .eq("id", outputRowId);
      if (error) throw new Error(error.message);
    } else {
      // No existing outputs row — create one (edge case: shouldn't happen for complete projects)
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

    return NextResponse.json({ success: true, workoutPlan });

  } catch (error) {
    console.error("[generate-workout] error:", error);
    const message = error instanceof Error ? error.message : "Workout plan generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildMockWorkoutPlan(challengeName: string): WorkoutPlan {
  const mockDay = (dayNumber: number, week: number): WorkoutPlan["weeks"][0]["days"][0] => ({
    dayNumber,
    type: dayNumber % 7 === 0 ? "rest" : dayNumber % 6 === 0 ? "active-recovery" : dayNumber % 3 === 0 ? "cardio" : "strength",
    sessionName: dayNumber % 7 === 0 ? "Rest Day" : dayNumber % 6 === 0 ? "Active Recovery" : dayNumber % 3 === 0 ? `Cardio Circuit ${week}` : `Full Body Strength ${week}`,
    durationMins: dayNumber % 7 === 0 ? 0 : dayNumber % 6 === 0 ? 20 : 45,
    warmUp: "5 minutes of light movement: arm circles, hip rotations, and slow marching in place to raise heart rate.",
    exercises: dayNumber % 7 === 0 || dayNumber % 6 === 0 ? [] : [
      { name: "Squat", sets: 3, reps: "10-12", rest: "60 sec", muscleGroups: ["Quads", "Glutes"], modification: "Chair-assisted squat" },
      { name: "Push-up", sets: 3, reps: "8-10", rest: "60 sec", muscleGroups: ["Chest", "Triceps"], modification: "Knee push-up" },
      { name: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "60 sec", muscleGroups: ["Hamstrings", "Glutes"], modification: "Bodyweight hip hinge" },
      { name: "Plank", sets: 3, reps: "30 seconds", rest: "45 sec", muscleGroups: ["Core"], modification: "Knee plank" },
    ],
    coolDown: "5 minutes of static stretching: hamstring stretch, hip flexor stretch, chest opener, and deep breathing.",
  });

  return {
    programName: `${challengeName} — 30-Day Programme`,
    programOverview: "A progressive 4-week programme designed to build strength, improve conditioning, and establish sustainable habits. Each week increases in intensity to ensure continuous adaptation.",
    equipmentNeeded: ["Dumbbells (light, medium, heavy)", "Resistance bands", "Exercise mat"],
    weeklySchedule: "Mon/Wed/Fri: Strength | Tue/Thu: Cardio | Sat: Active Recovery | Sun: Rest",
    weeks: [1, 2, 3, 4].map((weekNumber) => ({
      weekNumber,
      theme: ["Foundation", "Building Momentum", "Intensity Surge", "Peak Performance"][weekNumber - 1],
      focus: ["Establishing movement patterns and building base fitness", "Increasing volume and introducing supersets", "Higher intensity with shorter rest periods", "Maximum effort and final challenge"][weekNumber - 1],
      days: Array.from({ length: weekNumber === 4 ? 9 : 7 }, (_, i) => mockDay((weekNumber - 1) * 7 + i + 1, weekNumber)),
    })),
    nutritionGuidance: "Focus on whole foods, adequate protein (0.8–1g per pound of bodyweight), and staying hydrated throughout the challenge. Avoid processed foods and aim for consistent meal timing to support recovery.",
    progressionRules: "Each week, increase weight by 5% or add 1 rep per set where possible. If you complete all sets and reps with good form and feel you could do 2+ more, it's time to increase the load.",
    coachingNotes: "Check in with your group daily via your community platform. Celebrate small wins publicly. Watch for participants who go quiet around Day 10–12 — that's when motivation dips. A personal message at that point can be the difference between a completer and a dropout.",
  };
}
