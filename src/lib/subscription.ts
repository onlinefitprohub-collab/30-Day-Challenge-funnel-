import type { SupabaseClient } from "@supabase/supabase-js";

export type SubscriptionStatus = "free" | "pro" | "annual";

export async function getUserSubscriptionStatus(
  supabase: SupabaseClient,
  userId: string,
): Promise<SubscriptionStatus> {
  const { data } = await supabase
    .from("user_settings")
    .select("subscription_status")
    .eq("user_id", userId)
    .single();

  const status = (data as { subscription_status?: string } | null)?.subscription_status;
  if (status === "pro" || status === "annual") return status;
  return "free";
}

export function isPro(status: SubscriptionStatus): boolean {
  return status === "pro" || status === "annual";
}
