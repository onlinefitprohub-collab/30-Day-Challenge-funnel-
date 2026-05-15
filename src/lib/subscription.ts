import type { SupabaseClient } from "@supabase/supabase-js";

// "active"  = paid Stripe subscriber
// "manual"  = admin-granted access (no Stripe required)
// "none"    = no access — must subscribe
export type SubscriptionStatus = "active" | "manual" | "none";

export async function getUserSubscriptionStatus(
  supabase: SupabaseClient,
  userId: string,
): Promise<SubscriptionStatus> {
  const { data } = await supabase
    .from("user_settings")
    .select("subscription_status")
    .eq("user_id", userId)
    .maybeSingle();

  const status = (data as { subscription_status?: string } | null)?.subscription_status;
  if (status === "active" || status === "manual") return status;
  return "none";
}

export function hasAccess(status: SubscriptionStatus): boolean {
  return status === "active" || status === "manual";
}
