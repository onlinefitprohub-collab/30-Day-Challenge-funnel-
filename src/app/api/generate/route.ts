import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateFunnelAssets } from "@/lib/ai/generate";
import { generateMockAssets } from "@/lib/ai/mock";
import { pickLandingVariant, pickTemplateVariant } from "@/lib/highlevel/ghl-pagedata";
import { wizardInputsSchema } from "@/types/wizard";
import type { GenerationRunRow, ProjectRow } from "@/types/project";

export async function POST(request: Request) {
  const supabase = await createClient();
  let runId: string | null = null;
  let projectId: string | null = null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as { projectId?: string; inputs?: unknown };
    projectId = body.projectId ?? null;
    const inputs = body.inputs;

    if (!projectId || !inputs) {
      return NextResponse.json({ error: "Missing projectId or inputs" }, { status: 400 });
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

    // Validate inputs with Zod
    const validatedInputs = wizardInputsSchema.parse(inputs);

    // Create a generation run record
    const { data: runData, error: runError } = await supabase
      .from("generation_runs")
      .insert({ project_id: projectId, status: "running" })
      .select()
      .maybeSingle();

    if (runError || !runData) throw new Error("Failed to create generation run");
    runId = (runData as GenerationRunRow).id;

    // Use real AI if API key is present, otherwise mock
    const apiKey = process.env.ANTHROPIC_API_KEY ?? "";
    console.log(`[generate] ANTHROPIC_API_KEY present=${!!apiKey} length=${apiKey.length} prefix=${apiKey.slice(0, 10) || "(empty)"}`);
    const isMockMode = !apiKey;
    const assets = isMockMode
      ? generateMockAssets(validatedInputs)
      : await generateFunnelAssets(validatedInputs);

    // Pick layout variants once per run and persist so all subsequent
    // inject/preview calls always use the same template.
    const landingVariant = pickLandingVariant();
    const templateVariant = pickTemplateVariant();
    console.log(`[generate] landing-variant: ${landingVariant}`);
    console.log(`[generate] template-variant: ${templateVariant}`);

    // Save outputs — include mock flag so results page can show a banner
    await supabase.from("project_outputs").insert({
      project_id: projectId,
      generation_run_id: runId,
      outputs: {
        ...assets,
        generatedAdImages: [],
        funnelType:   validatedInputs.funnelType ?? "challenge",
        colourScheme: validatedInputs.colourScheme ?? "navy-orange",
        landingVariant,
        templateVariant,
        // Wizard-sourced fields for template personalisation
        coachName:      validatedInputs.coachName,
        coachVideoUrl:  validatedInputs.videoUrl,
        coachPhotoUrl:  validatedInputs.coachPhotoUrl,
        clientCount:    validatedInputs.clientCount,
        yearsCoaching:  validatedInputs.yearsCoaching,
        _isMock: isMockMode,
      } as Record<string, unknown>,
    });

    // Mark run complete
    await supabase
      .from("generation_runs")
      .update({ status: "complete", completed_at: new Date().toISOString() })
      .eq("id", runId);

    // Mark project complete
    await supabase
      .from("projects")
      .update({ status: "complete" })
      .eq("id", projectId);

    return NextResponse.json({ success: true, projectId, isMock: isMockMode });

  } catch (error) {
    console.error("Generation error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";

    // Mark run as errored
    if (runId) {
      await supabase
        .from("generation_runs")
        .update({ status: "error", error_message: message })
        .eq("id", runId);
    }

    // Reset project to draft so user can try again
    if (projectId) {
      await supabase
        .from("projects")
        .update({ status: "error" })
        .eq("id", projectId);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
