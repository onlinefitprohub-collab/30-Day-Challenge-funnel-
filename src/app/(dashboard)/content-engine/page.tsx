import { redirect } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscriptionStatus, isPro } from "@/lib/subscription";
import { UpgradePrompt } from "@/components/subscription/upgrade-prompt";
import { ContentEnginePage } from "@/components/content-engine/content-engine-page";
import type { MonthlyContentPlan } from "@/types/monthly-content";
import type { ProjectRow } from "@/types/project";

export const metadata = {
  title: "Content Engine | FitPro Launch",
};

export default async function ContentEnginePage_() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const subscriptionStatus = await getUserSubscriptionStatus(supabase, user.id);

  if (!isPro(subscriptionStatus)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
            <CalendarDays className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Content Engine</h1>
            <p className="text-sm text-gray-500">Monthly social content, generated for you</p>
          </div>
        </div>
        <UpgradePrompt />
      </div>
    );
  }

  // Load complete projects for the project selector
  const { data: projectsData } = await supabase
    .from("projects")
    .select("id, name, status")
    .eq("user_id", user.id)
    .eq("status", "complete")
    .order("updated_at", { ascending: false });

  const projects = ((projectsData ?? []) as ProjectRow[]).map((p) => ({
    id:   p.id,
    name: p.name,
  }));

  // Load existing monthly plans for this user
  const { data: plansData } = await supabase
    .from("monthly_content_plans")
    .select("month, plan")
    .eq("user_id", user.id)
    .order("month", { ascending: false });

  const existingPlans: Record<string, MonthlyContentPlan> = {};
  for (const row of (plansData ?? []) as Array<{ month: string; plan: MonthlyContentPlan }>) {
    existingPlans[row.month] = row.plan;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
          <CalendarDays className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Content Engine</h1>
          <p className="text-sm text-gray-500">A fresh 30-post content plan every month, personalised to your niche</p>
        </div>
      </div>

      <ContentEnginePage projects={projects} existingPlans={existingPlans} />
    </div>
  );
}
