import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deriveProjectToken } from "@/lib/highlevel/inject-token";

export const dynamic = "force-dynamic";

/**
 * GET /api/highlevel/inject-token?projectId=X
 *
 * Requires a valid Supabase session.  Verifies the user owns the project, then
 * returns a server-signed HMAC token.  The Chrome extension stores this token
 * and sends it with every /api/highlevel/inject call instead of relying on
 * browser session cookies (which are inaccessible from extension fetch calls).
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  // Ownership check — the project_outputs row must belong to a project whose user
  // matches the authenticated user.
  const { data: project, error } = await supabase
    .from("projects")
    .select("id, name")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (error || !project) {
    return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 });
  }

  // Fetch funnel type from project_inputs
  let funnelType = "challenge";
  const { data: inputs } = await supabase
    .from("project_inputs")
    .select("inputs")
    .eq("project_id", projectId)
    .single();

  if (inputs?.inputs && typeof inputs.inputs === "object") {
    const inputsObj = inputs.inputs as Record<string, unknown>;
    if (inputsObj.funnelType === "application") {
      funnelType = "application";
    }
  }

  let token: string;
  try {
    token = deriveProjectToken(projectId);
  } catch {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  return NextResponse.json({
    projectId,
    projectName: project.name ?? "Untitled Project",
    funnelType,
    token,
  });
}
