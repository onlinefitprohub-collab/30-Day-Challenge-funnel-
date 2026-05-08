import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ProjectList } from "@/components/dashboard/project-list";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { ProjectRow } from "@/types/project";

export const metadata = {
  title: "Dashboard | FitPro Launch",
};

function deriveSubtitle(inputs: Record<string, unknown>): string {
  const challenge = typeof inputs.challengeName === "string" ? inputs.challengeName.trim() : "";
  const audience  = typeof inputs.targetAudience === "string" ? inputs.targetAudience.trim() : "";
  if (challenge) return challenge;
  if (audience)  return audience;
  return "";
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  const typedProjects = (projects ?? []) as ProjectRow[];
  const hasProjects   = typedProjects.length > 0;

  const subtitleMap: Record<string, string> = {};
  if (hasProjects) {
    const projectIds = typedProjects.map((p) => p.id);
    const { data: inputs } = await supabase
      .from("project_inputs")
      .select("project_id, inputs")
      .in("project_id", projectIds);

    for (const row of inputs ?? []) {
      subtitleMap[row.project_id] = deriveSubtitle(
        (row.inputs ?? {}) as Record<string, unknown>
      );
    }
  }

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Coach";

  const completeCount = typedProjects.filter((p) => p.status === "complete").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">
            {hasProjects ? `Welcome back, ${displayName}` : `Hey ${displayName} 👋`}
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {hasProjects
              ? `${typedProjects.length} funnel${typedProjects.length === 1 ? "" : "s"} · ${completeCount} complete`
              : "Create your first funnel to get started."}
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold border-0 shadow-sm h-9 px-4 text-sm">
            <Plus className="h-4 w-4" />
            New funnel
          </Button>
        </Link>
      </div>

      {/* Projects */}
      {!hasProjects ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            Your funnels
          </p>
          <ProjectList projects={typedProjects} subtitles={subtitleMap} />
        </div>
      )}
    </div>
  );
}
