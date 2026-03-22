import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UserSettingsRow } from "@/types/project";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { hlApiKey?: string; hlLocationId?: string };
  try {
    body = (await request.json()) as { hlApiKey?: string; hlLocationId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { hlApiKey, hlLocationId } = body;

  if (!hlApiKey || !hlLocationId) {
    return NextResponse.json(
      { error: "hlApiKey and hlLocationId are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("user_settings").upsert(
    {
      user_id: user.id,
      hl_api_key: hlApiKey.trim(),
      hl_location_id: hlLocationId.trim(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("user_settings upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("user_settings")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("user_settings delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("user_settings")
    .select("hl_api_key, hl_location_id, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const settings = data as Pick<
    UserSettingsRow,
    "hl_api_key" | "hl_location_id" | "updated_at"
  > | null;

  const isConnected = Boolean(
    settings?.hl_api_key && settings?.hl_location_id
  );

  const maskedKey = settings?.hl_api_key
    ? `••••••••${settings.hl_api_key.slice(-4)}`
    : null;

  return NextResponse.json({
    isConnected,
    maskedKey,
    locationId: settings?.hl_location_id ?? null,
  });
}
