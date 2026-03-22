import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateFunnelAssets } from "@/lib/ai/generate";
import { wizardInputsSchema } from "@/types/wizard";
import type { GenerationRunRow, ProjectRow } from "@/types/project";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, inputs } = body as { projectId: string; inputs: unknown };

    if (!projectId || !inputs) {
      return NextResponse.json(
        { error: "Missing projectId or inputs" },
        { status: 400 }
      );
    }

    // Validate project belongs to user
    const { data: projectData } = await supabase
      .from("projects")
      .select("id, user_id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    const project = projectData as Pick<ProjectRow, "id" | "user_id"> | null;

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Validate inputs
    const validatedInputs = wizardInputsSchema.parse(inputs);

    // Create generation run
    const { data: runData, error: runError } = await supabase
      .from("generation_runs")
      .insert({
        project_id: projectId,
        status: "running",
      })
      .select()
      .single();

    const run = runData as GenerationRunRow | null;

    if (runError || !run) {
      throw new Error("Failed to create generation run");
    }

    // Generate
    const assets = await generateFunnelAssets(validatedInputs);

    // Save outputs
    await supabase.from("project_outputs").insert({
      project_id: projectId,
      generation_run_id: run.id,
      outputs: assets as unknown as Record<string, unknown>,
    });

    // Update run status
    await supabase
      .from("generation_runs")
      .update({ status: "complete", completed_at: new Date().toISOString() })
      .eq("id", run.id);

    // Update project status
    await supabase
      .from("projects")
      .update({ status: "complete" })
      .eq("id", projectId);

    return NextResponse.json({ success: true, projectId });
  } catch (error) {
    console.error("Generation error:", error);
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
