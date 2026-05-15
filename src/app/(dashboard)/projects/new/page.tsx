import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewProjectFlow } from "@/components/wizard/new-project-flow";
import { PaywallGate } from "@/components/dashboard/paywall-gate";
import { getUserSubscriptionStatus, hasAccess } from "@/lib/subscription";
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

  // ── Fresh wizard — require active subscription ───────────────────────────
  if (!projectId) {
    const status = await getUserSubscriptionStatus(supabase, user.id);
    if (!hasAccess(status)) return <PaywallGate />;
    return <NewProjectFlow />;
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
    <NewProjectFlow
      initialProjectId={projectId}
      initialData={savedInputs ?? { duration: 30, trafficSources: [], hasBeforeAfter: false }}
    />
  );
}
