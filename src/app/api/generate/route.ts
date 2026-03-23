import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateFunnelAssets } from "@/lib/ai/generate";
import { generateAdImages } from "@/lib/ai/image-generation";
import { generateMockAssets } from "@/lib/ai/mock";
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
      .single();

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
      .single();

    if (runError || !runData) throw new Error("Failed to create generation run");
    runId = (runData as GenerationRunRow).id;

    // Use real AI if API key is present, otherwise mock
    const isMockMode = !process.env.OPENAI_API_KEY;
    const assets = isMockMode
      ? generateMockAssets(validatedInputs)
      : await generateFunnelAssets(validatedInputs);

    // Generate real ad images (non-blocking — failures just mean no images shown)
    let generatedAdImages: typeof assets.generatedAdImages = [];
    if (!isMockMode && process.env.OPENAI_API_KEY) {
      try {
        generatedAdImages = await generateAdImages(validatedInputs, projectId);
        console.log(`[generate] Generated ${generatedAdImages.length} ad images`);
      } catch (imgErr) {
        console.warn("[generate] Ad image generation failed (non-fatal):", imgErr);
      }
    }

    // Save outputs — include mock flag so results page can show a banner
    await supabase.from("project_outputs").insert({
      project_id: projectId,
      generation_run_id: runId,
      outputs: {
        ...assets,
        generatedAdImages,
        colourScheme: validatedInputs.colourScheme ?? "navy-orange",
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
