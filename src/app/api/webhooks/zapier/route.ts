import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

function validateSecret(req: NextRequest): boolean {
  const secret = process.env.ZAPIER_WEBHOOK_SECRET ?? "";
  if (!secret) return false; // secret not configured — deny all
  return req.headers.get("x-webhook-secret") === secret;
}

/**
 * POST /api/webhooks/zapier
 *
 * Called by Zapier when a purchase or event occurs. Creates or activates a user account.
 *
 * Headers:
 *   x-webhook-secret: {ZAPIER_WEBHOOK_SECRET}
 *   Content-Type: application/json
 *
 * Body:
 *   email: string (required)
 *   name?: string
 *   action?: "invite" | "grant" | "invite_and_grant" (default: "invite_and_grant")
 *   revoke?: boolean — if true, revokes access instead
 */
export async function POST(req: NextRequest) {
  if (!validateSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { email?: string; name?: string; action?: string; revoke?: boolean };
  try {
    body = await req.json() as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, name = "", action = "invite_and_grant", revoke = false } = body;

  if (!email?.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const service = createServiceClient();

  // Find existing user
  const { data: { users } } = await service.auth.admin.listUsers({ perPage: 1000 });
  let target = users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());

  const result: Record<string, unknown> = { email: email.trim() };

  // Revoke path
  if (revoke) {
    if (target) {
      await service.from("user_settings")
        .update({ subscription_status: "none" })
        .eq("user_id", target.id);
      result.action = "revoked";
      result.userId = target.id;
    } else {
      result.action = "not_found";
    }
    return NextResponse.json({ success: true, ...result });
  }

  // Create user if they don't exist and action includes invite
  if (!target && (action === "invite" || action === "invite_and_grant")) {
    const { data: invited, error: inviteErr } = await service.auth.admin.inviteUserByEmail(
      email.trim(),
      { data: { full_name: name.trim() || undefined } }
    );
    if (inviteErr) {
      return NextResponse.json({ error: inviteErr.message }, { status: 500 });
    }
    target = invited.user;
    result.created = true;
    result.inviteSent = true;
  }

  if (!target) {
    return NextResponse.json({ error: "User not found and action does not include invite" }, { status: 404 });
  }

  result.userId = target.id;

  // Grant access if action includes grant
  if (action === "grant" || action === "invite_and_grant") {
    const { error } = await service.from("user_settings").upsert(
      { user_id: target.id, subscription_status: "manual", subscription_tier: "manual" },
      { onConflict: "user_id" }
    );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    result.accessGranted = true;
  }

  console.log(`[zapier-webhook] ${action} for ${email.trim()} — userId: ${target.id as string}`);

  return NextResponse.json({ success: true, ...result });
}
