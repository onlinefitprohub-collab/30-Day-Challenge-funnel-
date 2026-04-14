import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ProjectInputRow, ProjectRow } from "@/types/project";

/**
 * POST /api/projects/clone
 *
 * Clones an existing project: creates a new draft project row and copies
 * all wizard inputs to it. Returns the new project ID so the client can
 * redirect into the pre-filled wizard.
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
      .single();

    const project = sourceProject as Pick<ProjectRow, "id" | "user_id" | "name"> | null;
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Load saved wizard inputs
    const { data: inputData } = await supabase
      .from("project_inputs")
      .select("inputs")
      .eq("project_id", projectId)
      .single();

    const stored = inputData as Pick<ProjectInputRow, "inputs"> | null;

    // Create new draft project
    const { data: newProject, error: insertError } = await supabase
      .from("projects")
      .insert({ user_id: user.id, name: `Copy of ${project.name}`, status: "draft" })
      .select()
      .single();

    if (insertError || !newProject) {
      throw new Error(insertError?.message ?? "Failed to create project");
    }

    const newProjectId = (newProject as ProjectRow).id;

    // Copy inputs if they exist
    if (stored?.inputs) {
      await supabase
        .from("project_inputs")
        .insert({ project_id: newProjectId, inputs: stored.inputs });
    }

    return NextResponse.json({ ok: true, newProjectId });

  } catch (error) {
    console.error("[clone] error:", error);
    const message = error instanceof Error ? error.message : "Failed to clone project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
