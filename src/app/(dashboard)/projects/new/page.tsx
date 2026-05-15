import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";
import { getUserSubscriptionStatus, isPro } from "@/lib/subscription";
import { FREE_PROJECT_LIMIT } from "@/lib/stripe";
import type { ProjectRow, ProjectInputRow } from "@/types/project";
import type { WizardInputs } from "@/types/wizard";

export const metadata = {
  title: "New Funnel Project | FitPro Launch",
};

interface PageProps {
  searchParams: Promise<{ projectId?: string }>;
}

export default async function NewProjectPage({ searchParams }: PageProps) {
  const { projectId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ── Fresh wizard — check subscription gate ────────────────────────────────
  if (!projectId) {
    const status = await getUserSubscriptionStatus(supabase, user.id);
    if (!isPro(status)) {
      const { count } = await supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if ((count ?? 0) >= FREE_PROJECT_LIMIT) {
        return <UpgradeGate />;
      }
    }
    return <WizardShell />;
  }

  // ── Returning to an existing project ─────────────────────────────────────

  const { data: projectData } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  const project = projectData as ProjectRow | null;
  if (!project) redirect("/dashboard");

  if (project.status === "complete") redirect(`/projects/${projectId}/results`);
  if (project.status === "generating") redirect(`/projects/${projectId}/generating`);

  const { data: inputData } = await supabase
    .from("project_inputs")
    .select("inputs")
    .eq("project_id", projectId)
    .single();

  const savedInputs = inputData
    ? ((inputData as ProjectInputRow).inputs as Partial<WizardInputs>)
    : undefined;

  return (
    <WizardShell
      initialProjectId={projectId}
      initialData={savedInputs ?? { duration: 30, trafficSources: [], hasBeforeAfter: false }}
    />
  );
}
