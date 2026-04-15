import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasClaude } from "@/lib/ai/claude-client";
import { callClaudeGroup } from "@/lib/ai/claude-generate";
import { buildCoachContext } from "@/lib/ai/context";
import { buildNurturePrompt } from "@/lib/ai/prompts/nurture-sequence";
import { nurtureBatchSchema } from "@/lib/ai/validators";
import { wizardInputsSchema } from "@/types/wizard";
import type { NurtureEmail, NurtureSequence } from "@/types/generation";

type NurtureBatch = { emails: NurtureEmail[] };
import type { ProjectInputRow, ProjectRow } from "@/types/project";

/**
 * POST /api/generate-nurture
 *
 * Generates a 52-week email nurture sequence on-demand for an existing project.
 * Fired in 4 batches of 13 (one per quarter), with Q1+Q2 in parallel then Q3+Q4 in parallel.
 * Result is merged into project_outputs as "nurtureSequence".
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

    // Load existing outputs to find the output row id
    const { data: outputData } = await supabase
      .from("project_outputs")
      .select("id, outputs")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const outputRowId = (outputData as { id?: string } | null)?.id;
    const existingOutputs = (outputData?.outputs as Record<string, unknown>) ?? {};

    let nurtureSequence: NurtureSequence;

    if (!hasClaude()) {
      nurtureSequence = buildMockNurtureSequence(
        validatedInputs.challengeName ?? "30-Day Challenge",
        validatedInputs.challengeType ?? "fitness",
      );
    } else {
      // Fire Q1 + Q2 in parallel, then Q3 + Q4 in parallel
      const [q1Result, q2Result] = await Promise.all([
        callClaudeGroup<NurtureBatch>(
          buildNurturePrompt(context, 1),
          nurtureBatchSchema,
          "nurture-q1",
          4096,
          "claude-haiku-4-5-20251001",
        ),
        callClaudeGroup<NurtureBatch>(
          buildNurturePrompt(context, 2),
          nurtureBatchSchema,
          "nurture-q2",
          4096,
          "claude-haiku-4-5-20251001",
        ),
      ]);

      const [q3Result, q4Result] = await Promise.all([
        callClaudeGroup<NurtureBatch>(
          buildNurturePrompt(context, 3),
          nurtureBatchSchema,
          "nurture-q3",
          4096,
          "claude-haiku-4-5-20251001",
        ),
        callClaudeGroup<NurtureBatch>(
          buildNurturePrompt(context, 4),
          nurtureBatchSchema,
          "nurture-q4",
          4096,
          "claude-haiku-4-5-20251001",
        ),
      ]);

      // Log any batch failures
      if (q1Result.error) console.warn("[generate-nurture] Q1 fallback to mock:", q1Result.error);
      if (q2Result.error) console.warn("[generate-nurture] Q2 fallback to mock:", q2Result.error);
      if (q3Result.error) console.warn("[generate-nurture] Q3 fallback to mock:", q3Result.error);
      if (q4Result.error) console.warn("[generate-nurture] Q4 fallback to mock:", q4Result.error);

      const challengeName = validatedInputs.challengeName ?? "30-Day Challenge";
      const challengeType = validatedInputs.challengeType ?? "fitness";
      const mock = buildMockNurtureSequence(challengeName, challengeType);
      const mockByWeek = Object.fromEntries(mock.emails.map((e) => [e.week, e]));

      // Merge AI results, falling back to mock emails for any failed batch
      const allEmails: NurtureEmail[] = [
        ...(q1Result.data?.emails ?? mock.emails.slice(0, 13)),
        ...(q2Result.data?.emails ?? mock.emails.slice(13, 26)),
        ...(q3Result.data?.emails ?? mock.emails.slice(26, 39)),
        ...(q4Result.data?.emails ?? mock.emails.slice(39, 52)),
      ];

      // Fill any gaps (shouldn't happen but defensive)
      const emailsByWeek = new Map<number, NurtureEmail>(allEmails.map((e) => [e.week, e]));
      const finalEmails: NurtureEmail[] = Array.from({ length: 52 }, (_, i) => {
        const week = i + 1;
        return emailsByWeek.get(week) ?? mockByWeek[week] ?? mock.emails[i];
      });

      nurtureSequence = {
        generatedAt: new Date().toISOString(),
        emails: finalEmails,
      };
    }

    const mergedOutputs = { ...existingOutputs, nurtureSequence };

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

    return NextResponse.json({ success: true, nurtureSequence });

  } catch (error) {
    console.error("[generate-nurture] error:", error);
    const message = error instanceof Error ? error.message : "Nurture generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── Mock fallback ────────────────────────────────────────────────────────────

function buildMockNurtureSequence(challengeName: string, challengeType: string): NurtureSequence {
  const quarterThemes = [
    { quarter: 1, label: "Foundation", weeks: 1,  themes: ["Why most people quit before they start", "The one habit that changes everything", "What progress actually looks like", "The identity shift you didn't expect", "Small wins add up faster than you think", "Why accountability beats motivation", "The hidden cost of staying stuck", "What your future self is counting on", "Redefining what 'enough' means", "The comparison trap and how to escape it", "Building consistency when life gets busy", "Your environment shapes your results", "Quarter 1 reflection — look how far you've come"] },
    { quarter: 2, label: "Momentum",   weeks: 14, themes: ["When the excitement wears off", "The plateau is not a failure", "How to train your brain for long-term change", "What the most successful clients do differently", "Adjusting without quitting", "The power of showing up on hard days", "Progress photos aren't the only measure", "Building a community around your goals", "Why rest is part of the work", "Unlocking the next level of results", "The story you tell yourself about change", "Building momentum you can feel", "Quarter 2 — you're halfway through the year"] },
    { quarter: 3, label: "Transformation", weeks: 27, themes: ["The person you're becoming", "Transformation from the inside out", "What your habits say about your values", "The compound effect in real life", "From surviving to thriving", "Carrying your community with you", "The moment it all clicked", "Your body as a reflection of your choices", "Rebuilding after a setback", "Why community changes outcomes", "The version of you that got here", "What deep change actually feels like", "Quarter 3 — the transformation is real"] },
    { quarter: 4, label: "Legacy",     weeks: 40, themes: ["Building something that lasts", "Passing it on — who inspired you?", "The year in review mindset", "What you've proven to yourself", "Legacy over legacy — what do you want to leave behind?", "Gifting transformation to someone else", "The new normal you've built", "Next year, next level — what's your vision?", "The final 10 weeks push", "Gratitude as fuel for the final stretch", "This time last year vs today", "New year, same powerful you — with more proof", "A year of showing up — here's to the next one"] },
  ];

  const emails: NurtureEmail[] = [];

  for (const q of quarterThemes) {
    for (let i = 0; i < 13; i++) {
      const week = q.weeks + i;
      const theme = q.themes[i];
      emails.push({
        week,
        theme,
        subject: `Week ${week}: ${theme.slice(0, 45)}`,
        body: `Hi {first_name},\n\nThis week's theme: ${theme.toLowerCase()}.\n\nAs you continue your journey with the ${challengeName}, remember that every week you show up is another week of compounding results. The ${challengeType} journey isn't always linear — but it is always worth it.\n\nHere's your focus for this week: reflect on one thing you've done better than you would have a year ago. That gap is your growth.\n\nKeep going. I'm proud of you for being here.\n\n[Coach Name]`,
      });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    emails,
  };
}
