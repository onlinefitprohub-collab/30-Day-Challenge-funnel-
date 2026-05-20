import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Count user's projects
  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const dataExport = {
    email:        user.email,
    displayName:  user.user_metadata?.full_name ?? null,
    createdAt:    user.created_at,
    lastSignIn:   user.last_sign_in_at,
    projectCount: projectCount ?? 0,
    dataStoredBy: ["Supabase (database + auth)", "Stripe (payment data)", "Anthropic (prompt processing, not retained)"],
    yourRights:   "You may request deletion of your account and all associated data by emailing hello@fitprolaunch.com",
  };

  console.log(`[GDPR] Data request from user ${user.id} (${user.email})`);
  return NextResponse.json({ success: true, data: dataExport });
}
