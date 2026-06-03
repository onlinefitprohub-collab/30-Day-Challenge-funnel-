import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

function isAdmin(email: string | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  if (!email || !adminEmail) return false;
  return adminEmail.split(",").map((e) => e.trim().toLowerCase()).includes(email.toLowerCase());
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as { email?: string; name?: string; grantAccess?: boolean };
  const { email, name = "", grantAccess = false } = body;

  if (!email?.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const service = createServiceClient();

  // Send invite email (user sets their own password via the link)
  const { data: invited, error: inviteErr } = await service.auth.admin.inviteUserByEmail(
    email.trim(),
    { data: { full_name: name.trim() || undefined } }
  );

  if (inviteErr) {
    return NextResponse.json({ error: inviteErr.message }, { status: 500 });
  }

  const userId = invited.user.id;

  // Optionally grant immediate access
  if (grantAccess && userId) {
    await service.from("user_settings").upsert(
      { user_id: userId, subscription_status: "manual", subscription_tier: "manual" },
      { onConflict: "user_id" }
    );
  }

  return NextResponse.json({
    success: true,
    userId,
    email: invited.user.email,
    inviteSent: true,
    accessGranted: grantAccess,
  });
}
