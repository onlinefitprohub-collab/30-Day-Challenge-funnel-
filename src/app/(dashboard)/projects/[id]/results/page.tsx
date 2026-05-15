import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResultsShell } from "@/components/results/results-shell";
import type { ProjectRow, ProjectOutputRow } from "@/types/project";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Funnel Results | FitPro Launch",
};

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projectData } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  const project = projectData as ProjectRow | null;

  if (!project) notFound();
  if (project.status === "generating") redirect(`/projects/${id}/generating`);
  if (project.status === "error")     redirect(`/projects/new?projectId=${id}`);
  if (project.status !== "complete")  redirect(`/projects/new?projectId=${id}`);

  const { data: outputData } = await supabase
    .from("project_outputs")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const output = outputData as ProjectOutputRow | null;
  if (!output) redirect("/dashboard");

  const isMock = Boolean((output.outputs as Record<string, unknown>)._isMock);

  let hlConnected     = false;
  let notionConnected = false;
  if (user) {
    const { data: settingsData, error: settingsError } = await supabase
      .from("user_settings")
      .select("hl_api_key, hl_location_id, notion_api_key, notion_page_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!settingsError) {
      const s = settingsData as {
        hl_api_key?: string | null; hl_location_id?: string | null;
        notion_api_key?: string | null; notion_page_id?: string | null;
      } | null;
      hlConnected     = Boolean(s?.hl_api_key && s?.hl_location_id);
      notionConnected = Boolean(s?.notion_api_key && s?.notion_page_id);
    }
  }

  return (
    <ResultsShell
      project={project}
      outputs={output.outputs}
      isMock={isMock}
      hlConnected={hlConnected}
      notionConnected={notionConnected}
    />
  );
}
