import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data } = await supabase
    .from("project_stats")
    .select("*")
    .eq("project_id", id)
    .maybeSingle();

  return NextResponse.json({ stats: data ?? null });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  const { error } = await supabase
    .from("project_stats")
    .upsert(
      {
        project_id: id,
        user_id: user.id,
        opt_in_rate: body.opt_in_rate ?? null,
        applications: body.applications ?? null,
        bookings: body.bookings ?? null,
        revenue: body.revenue ?? null,
        notes: body.notes ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "project_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
