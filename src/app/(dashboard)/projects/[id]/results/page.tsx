import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResultsShell } from "@/components/results/results-shell";
import type { ProjectRow, ProjectOutputRow } from "@/types/project";

export const metadata = {
  title: "Funnel Results | Challenge Funnel in a Box",
};

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: projectData } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  const project = projectData as ProjectRow | null;

  if (!project) {
    notFound();
  }

  if (project.status !== "complete") {
    redirect(`/projects/${id}`);
  }

  const { data: outputData } = await supabase
    .from("project_outputs")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const output = outputData as ProjectOutputRow | null;

  if (!output) {
    redirect("/dashboard");
  }

  return <ResultsShell project={project} outputs={output.outputs} />;
}
