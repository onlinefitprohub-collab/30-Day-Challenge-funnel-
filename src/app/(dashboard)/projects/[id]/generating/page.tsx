import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GeneratingView } from "@/components/projects/generating-view";
import type { ProjectRow } from "@/types/project";

export const metadata = {
  title: "Generating your funnel… | FitPro Launch",
};

export default async function GeneratingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ trigger?: string }>;
}) {
  const { id } = await params;
  const { trigger } = await searchParams;
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
  return (
    <GeneratingView
      projectId={id}
      projectName={project.name}
      triggerGenerate={trigger === "1"}
    />
  );
}
