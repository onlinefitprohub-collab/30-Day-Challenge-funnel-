import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GeneratingView } from "@/components/projects/generating-view";
import type { ProjectRow } from "@/types/project";

export const metadata = {
  title: "Generating your funnel… | Challenge Funnel in a Box",
};

export default async function GeneratingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  const project = data as ProjectRow | null;
  if (!project) redirect("/dashboard");

  // Already done — go straight to results
  if (project.status === "complete") redirect(`/projects/${id}/results`);

  // Error state — let user retry from wizard
  if (project.status === "error") redirect(`/projects/new?projectId=${id}`);

  // Still generating (or somehow draft) — show the waiting screen
  return <GeneratingView projectId={id} projectName={project.name} />;
}
