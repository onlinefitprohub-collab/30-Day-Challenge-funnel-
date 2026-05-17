import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ProjectInputRow, ProjectRow } from "@/types/project";

/**
 * POST /api/regenerate/[projectId]
 *
 * Quick-start: marks project as "generating", creates a generation run,
 * and returns the stored wizard inputs.  The client then fires the heavy
 * AI generation request against /api/generate with keepalive:true and
 * navigates to the generating-view polling screen.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Load the stored wizard inputs
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

    // Mark project as generating so the generating-view polling screen shows
    await supabase
      .from("projects")
      .update({ status: "generating" })
      .eq("id", projectId);

    return NextResponse.json({
      ok: true,
      projectId,
      inputs: stored.inputs,
    });

  } catch (error) {
    console.error("[regenerate] error:", error);
    const message = error instanceof Error ? error.message : "Failed to start regeneration";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
