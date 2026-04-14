import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { importToHighLevel } from "@/lib/highlevel/import";
import type { GeneratedFunnelAssets } from "@/types/generation";
import type { UserSettingsRow } from "@/types/project";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { projectId?: string };
  try {
    body = (await request.json()) as { projectId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { projectId } = body;
  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  // Fetch HL credentials
  const { data: settingsData } = await supabase
    .from("user_settings")
    .select("hl_api_key, hl_location_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const settings = settingsData as Pick<
    UserSettingsRow,
    "hl_api_key" | "hl_location_id"
  > | null;

  if (!settings?.hl_api_key || !settings?.hl_location_id) {
    return NextResponse.json(
      { error: "HighLevel credentials not configured. Please add them in Account Settings." },
      { status: 422 }
    );
  }

  // Verify the project belongs to this user, then fetch its outputs
  const { data: projectCheck } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!projectCheck) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const { data: outputData } = await supabase
    .from("project_outputs")
    .select("outputs")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!outputData) {
    return NextResponse.json(
      { error: "Project outputs not found. Please generate the funnel first." },
      { status: 404 }
    );
  }

  const outputs = outputData.outputs as Record<string, unknown>;
  const assets = outputs as unknown as GeneratedFunnelAssets;

  try {
    const result = await importToHighLevel(
      settings.hl_location_id,
      settings.hl_api_key,
      assets
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("HL import error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Import failed" },
      { status: 500 }
    );
  }
}
