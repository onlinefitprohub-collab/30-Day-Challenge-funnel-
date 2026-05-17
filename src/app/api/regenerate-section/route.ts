import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasClaude } from "@/lib/ai/claude-client";
import { callClaudeGroup } from "@/lib/ai/claude-generate";
import { buildCoachContext } from "@/lib/ai/context";
import { buildOfferPagesPrompt } from "@/lib/ai/prompts/offer-pages";
import { buildSequencesPrompt } from "@/lib/ai/prompts/sequences";
import { buildAdsCampaignPrompt } from "@/lib/ai/prompts/ads-campaign";
import { pickRandomStyle } from "@/lib/ai/copywriter-styles";
import {
  offerPagesResponseSchema,
  sequencesResponseSchema,
  adsCampaignResponseSchema,
} from "@/lib/ai/validators";
import { generateMockAssets } from "@/lib/ai/mock";
import { wizardInputsSchema } from "@/types/wizard";
import type { GeneratedFunnelAssets } from "@/types/generation";
import type { ProjectInputRow, ProjectRow } from "@/types/project";

type SectionGroup = "offer-pages" | "sequences" | "ads";

/**
 * POST /api/regenerate-section
 *
 * Re-runs AI generation for a single content group without touching the rest.
 * Merges the new output into the existing project_outputs and returns the
 * updated full outputs object.
 *
 * Body: { projectId: string; group: "offer-pages" | "sequences" | "ads" }
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as { projectId?: string; group?: string };
    const { projectId, group } = body;

    if (!projectId || !group) {
      return NextResponse.json({ error: "projectId and group are required" }, { status: 400 });
    }

    const validGroups: SectionGroup[] = ["offer-pages", "sequences", "ads"];
    if (!validGroups.includes(group as SectionGroup)) {
      return NextResponse.json(
        { error: `group must be one of: ${validGroups.join(", ")}` },
        { status: 400 }
      );
    }

    // Verify project belongs to this user
    const { data: projectData } = await supabase
      .from("projects")
      .select("id, user_id, status")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

    const project = projectData as Pick<ProjectRow, "id" | "user_id" | "status"> | null;
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

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
        { status: 400 }
      );
    }

    const validatedInputs = wizardInputsSchema.parse(stored.inputs);

    // Load existing outputs to preserve the other groups
    const { data: outputData } = await supabase
      .from("project_outputs")
      .select("id, outputs")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const outputRowId = (outputData as { id?: string } | null)?.id;
    const existingOutputs = (outputData?.outputs as Record<string, unknown>) ?? {};

    const context = buildCoachContext(validatedInputs);
    const style   = pickRandomStyle();
    const mock    = generateMockAssets(validatedInputs);
    const isMockMode = !hasClaude();

    let sectionUpdates: Record<string, unknown> = {};

    if (group === "offer-pages") {
      const result = isMockMode
        ? { data: mock as GeneratedFunnelAssets, error: null, usedFallback: true }
        : await callClaudeGroup(
            buildOfferPagesPrompt(context, style.promptDescription),
            offerPagesResponseSchema,
            "offer-pages",
            4096,
            "claude-sonnet-4-6",
          );
      const data = (result.data ?? mock) as GeneratedFunnelAssets;
      sectionUpdates = {
        offerSummary:          data.offerSummary,
        landingPage:           data.landingPage,
        optInForm:             data.optInForm,
        thankYouPage:          data.thankYouPage,
        bookingPage:           data.bookingPage,
        copywritingFramework:  data.copywritingFramework,
        copywriterVoice:       data.copywriterVoice,
        design:                data.design,
        sectionLayoutVariants: data.sectionLayoutVariants,
        copywriterStyle:       `${style.name} — ${style.tagline}`,
      };
    } else if (group === "sequences") {
      const storedFunnelType = (existingOutputs.funnelType as "challenge" | "application" | undefined) ?? "challenge";
      const result = isMockMode
        ? { data: mock as GeneratedFunnelAssets, error: null, usedFallback: true }
        : await callClaudeGroup(
            buildSequencesPrompt(context, style.promptDescription, storedFunnelType),
            sequencesResponseSchema,
            "sequences",
            4500,
            "claude-haiku-4-5-20251001",
          );
      const data = (result.data ?? mock) as GeneratedFunnelAssets;
      sectionUpdates = {
        smsSequence:   data.smsSequence,
        emailSequence: data.emailSequence,
      };
    } else {
      // ads
      const result = isMockMode
        ? { data: mock as GeneratedFunnelAssets, error: null, usedFallback: true }
        : await callClaudeGroup(
            buildAdsCampaignPrompt(context, style.promptDescription),
            adsCampaignResponseSchema,
            "ads-campaign",
            3200,
            "claude-haiku-4-5-20251001",
          );
      const data = (result.data ?? mock) as GeneratedFunnelAssets;
      sectionUpdates = {
        adCopy:          data.adCopy,
        creativePrompts: data.creativePrompts,
        campaignNaming:  data.campaignNaming,
      };
    }

    // Deep merge: existing outputs + section updates
    const mergedOutputs = { ...existingOutputs, ...sectionUpdates };

    // Update the existing output row in-place, or insert a new one if none exists
    let updateError: { message: string } | null = null;
    if (outputRowId) {
      const { error } = await supabase
        .from("project_outputs")
        .update({ outputs: mergedOutputs })
        .eq("id", outputRowId);
      updateError = error;
    } else {
      // Fallback: insert a new row (shouldn't happen for complete projects, but handle gracefully)
      const { data: runData } = await supabase
        .from("generation_runs")
        .insert({ project_id: projectId, status: "complete" })
        .select()
        .maybeSingle();
      const runId = (runData as { id?: string } | null)?.id;
      const { error } = await supabase
        .from("project_outputs")
        .insert({ project_id: projectId, generation_run_id: runId, outputs: mergedOutputs });
      updateError = error;
    }

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({
      ok: true,
      outputs: mergedOutputs,
      isMock: isMockMode,
    });

  } catch (error) {
    console.error("[regenerate-section] error:", error);
    const message = error instanceof Error ? error.message : "Section regeneration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
