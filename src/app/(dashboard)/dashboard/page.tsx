import Link from "next/link";
import { Plus, Wand2, Download, Rocket } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/project-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { ProjectRow } from "@/types/project";

export const metadata = {
  title: "Dashboard | Challenge Funnel in a Box",
};

const HOW_IT_WORKS = [
  { icon: Wand2,    step: "1", title: "Fill in the wizard",    body: "Tell us about your niche, audience and challenge — about 3 minutes." },
  { icon: Download, step: "2", title: "Get your full funnel",  body: "4 pages, emails, SMS, and ad copy — all generated and ready to use." },
  { icon: Rocket,   step: "3", title: "Import into HighLevel", body: "Download the JSON or clone pages directly with one click." },
];

function deriveSubtitle(inputs: Record<string, unknown>): string {
  const challenge = typeof inputs.challengeName === "string" ? inputs.challengeName.trim() : "";
  const audience  = typeof inputs.targetAudience === "string" ? inputs.targetAudience.trim() : "";
  if (challenge) return challenge;
  if (audience)  return audience;
  return "Challenge funnel project";
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
    <div className="space-y-6">

      {/* Hero header */}
      <div className="rounded-2xl bg-[#0f172a] px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {hasProjects
                ? `${typedProjects.length} funnel project${typedProjects.length === 1 ? "" : "s"} · ${completeCount} complete`
                : "Ready to build your first challenge funnel?"}
            </p>
          </div>
          <Link href="/projects/new">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold border-0 shadow-sm" size="lg">
              <Plus className="h-4 w-4" />
              New funnel
            </Button>
          </Link>
        </div>
      </div>

      {/* Projects list or empty state */}
      {!hasProjects ? (
        <EmptyState />
      ) : (
        <>
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Your projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {typedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  subtitle={subtitleMap[project.id] ?? "Challenge funnel project"}
                />
              ))}
            </div>
          </div>

          {/* How it works strip */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">How it works</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {HOW_IT_WORKS.map(({ icon: Icon, step, title, body }) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                    <Icon className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{title}</p>
                    <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
