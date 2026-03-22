import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/types/project";

export default async function ProjectPage({
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

  if (!project) {
    redirect("/dashboard");
  }

  if (project.status === "complete") {
    redirect(`/projects/${id}/results`);
  }

  redirect(`/projects/new?projectId=${id}`);
}
