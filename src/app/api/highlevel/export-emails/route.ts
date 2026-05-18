import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  pushEmailSequenceAsTemplates,
  pushNurtureSequenceAsTemplates,
} from "@/lib/highlevel/email-templates";
import type { GeneratedFunnelAssets } from "@/types/generation";
import type { ProjectRow } from "@/types/project";

/**
 * POST /api/highlevel/export-emails
 *
 * Pushes the project's email sequence (and optionally nurture sequence) to
 * the user's GoHighLevel account as reusable email templates.
 *
 * Body: { projectId: string; includeNurture?: boolean }
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as { projectId?: string; includeNurture?: boolean };
    const { projectId, includeNurture = false } = body;

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    // Load GHL credentials
    const service = createServiceClient();
    const { data: settings } = await service
      .from("user_settings")
      .select("hl_api_key, hl_location_id")
      .eq("user_id", user.id)
      .maybeSingle();

    const s = settings as { hl_api_key?: string | null; hl_location_id?: string | null } | null;
    if (!s?.hl_api_key || !s?.hl_location_id) {
      return NextResponse.json(
        { error: "HighLevel credentials not configured. Go to Account → HighLevel to connect." },
        { status: 400 }
      );
    }

    // Verify project belongs to user
    const { data: projectData } = await supabase
      .from("projects")
      .select("id, name, status")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

    const project = projectData as Pick<ProjectRow, "id" | "name" | "status"> | null;
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Load outputs
    const { data: outputData } = await service
      .from("project_outputs")
      .select("outputs")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const assets = (outputData?.outputs ?? {}) as GeneratedFunnelAssets;

    if (!assets.emailSequence) {
      return NextResponse.json(
        { error: "No email sequence found. Generate your funnel first." },
        { status: 400 }
      );
    }

    const challengeName = assets.offerSummary?.challengeConcept ?? project.name;

    // Push welcome sequence (always)
    const sequenceResult = await pushEmailSequenceAsTemplates(
      s.hl_location_id,
      s.hl_api_key,
      assets.emailSequence,
      challengeName,
    );

    // Optionally push nurture sequence (52 emails — can be slow)
    let nurtureResult = null;
    if (includeNurture && assets.nurtureSequence) {
      nurtureResult = await pushNurtureSequenceAsTemplates(
        s.hl_location_id,
        s.hl_api_key,
        assets.nurtureSequence,
        challengeName,
      );
    }

    const totalPushed =
      sequenceResult.pushed.filter((r) => r.ok).length +
      (nurtureResult?.pushed.filter((r) => r.ok).length ?? 0);

    const allErrors = [
      ...sequenceResult.errors,
      ...(nurtureResult?.errors ?? []),
    ];

    return NextResponse.json({
      ok: true,
      totalPushed,
      sequenceResult,
      nurtureResult,
      errors: allErrors,
    });

  } catch (error) {
    console.error("[export-emails] error:", error);
    const message = error instanceof Error ? error.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
