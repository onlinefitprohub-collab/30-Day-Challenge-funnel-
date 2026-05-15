import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

function isAdmin(email: string | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  if (!email || !adminEmail) return false;
  return adminEmail.split(",").map((e) => e.trim().toLowerCase()).includes(email.toLowerCase());
}

// POST /api/admin/grant-access — grant manual access to a user by email
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email } = await req.json() as { email?: string };
  if (!email?.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const service = createServiceClient();

  // Look up the target user by email
  const { data: { users }, error: listErr } = await service.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 });

  const target = users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());
  if (!target) {
    return NextResponse.json({ error: "No account found with that email" }, { status: 404 });
  }

  const { error } = await service.from("user_settings").upsert(
    {
      user_id: target.id,
      subscription_status: "manual",
      subscription_tier: "manual",
    },
    { onConflict: "user_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, userId: target.id, email: target.email });
}

// DELETE /api/admin/grant-access — revoke manual access
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await req.json() as { userId?: string };
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const service = createServiceClient();

  const { error } = await service.from("user_settings")
    .update({ subscription_status: "none", subscription_tier: "none" })
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
