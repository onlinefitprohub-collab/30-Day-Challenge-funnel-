import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WizardShell } from "@/components/wizard/wizard-shell";
import type { ProjectRow, ProjectInputRow } from "@/types/project";
import type { WizardInputs } from "@/types/wizard";

export const metadata = {
  title: "New Funnel Project | Challenge Funnel in a Box",
};

interface PageProps {
  searchParams: Promise<{ projectId?: string }>;
}

export default async function NewProjectPage({ searchParams }: PageProps) {
  const { projectId } = await searchParams;

  // No projectId — fresh wizard
  if (!projectId) {
    return <WizardShell />;
  }

  // Load existing project for returning users
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: projectData } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  const project = projectData as ProjectRow | null;

  // Project not found or doesn't belong to user
  if (!project) redirect("/dashboard");

  // Already complete — send to results
  if (project.status === "complete") redirect(`/projects/${projectId}/results`);

  // Still generating from a previous attempt — show generating page
  if (project.status === "generating") redirect(`/projects/${projectId}/generating`);

  // Load saved inputs
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
