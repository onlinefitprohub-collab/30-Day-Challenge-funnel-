import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ProjectInputRow, ProjectRow } from "@/types/project";

/**
 * POST /api/projects/clone
 *
 * Deep-clones a project: copies the project row, wizard inputs, and generated
 * outputs (if they exist). Returns hasOutputs so the client can redirect to
 * the results page (complete clone) or the wizard (inputs-only clone).
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
    const { data: sourceProject } = await supabase
      .from("projects")
      .select("id, user_id, name")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

    const project = sourceProject as Pick<ProjectRow, "id" | "user_id" | "name"> | null;
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Load wizard inputs + latest outputs in parallel
    const [inputResult, outputResult] = await Promise.all([
      supabase
        .from("project_inputs")
        .select("inputs")
        .eq("project_id", projectId)
        .maybeSingle(),
      supabase
        .from("project_outputs")
        .select("outputs")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const stored   = inputResult.data  as Pick<ProjectInputRow, "inputs"> | null;
    const outputs  = outputResult.data as { outputs: Record<string, unknown> } | null;
    const hasOutputs = !!outputs?.outputs;

    // Create new project — "complete" if we have outputs to copy, else "draft"
    const { data: newProject, error: insertError } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name:    `Copy of ${project.name}`,
        status:  hasOutputs ? "complete" : "draft",
      })
      .select()
      .maybeSingle();

    if (insertError || !newProject) {
      throw new Error(insertError?.message ?? "Failed to create project");
    }

    const newProjectId = (newProject as ProjectRow).id;

    // Copy inputs and outputs in parallel (if they exist)
    await Promise.all([
      stored?.inputs
        ? supabase.from("project_inputs").insert({ project_id: newProjectId, inputs: stored.inputs })
        : Promise.resolve(),
      hasOutputs
        ? supabase
            .from("generation_runs")
            .insert({ project_id: newProjectId, status: "complete" })
            .select()
            .maybeSingle()
            .then(({ data: run }) =>
              supabase.from("project_outputs").insert({
                project_id:         newProjectId,
                generation_run_id:  (run as { id?: string } | null)?.id,
                outputs:            outputs!.outputs,
              })
            )
        : Promise.resolve(),
    ]);

    return NextResponse.json({ ok: true, newProjectId, hasOutputs });

  } catch (error) {
    console.error("[clone] error:", error);
    const message = error instanceof Error ? error.message : "Failed to clone project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
