import Link from "next/link";
import { Plus, Zap, TrendingUp, Layers, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/project-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { ProjectRow } from "@/types/project";

export const metadata = {
  title: "Dashboard | Challenge Funnel in a Box",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  const typedProjects = (projects ?? []) as ProjectRow[];

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Coach";

  const completeCount = typedProjects.filter((p) => p.status === "complete").length;
  const inProgressCount = typedProjects.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="rounded-2xl bg-[#0f172a] px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 text-slate-400">
              {typedProjects.length > 0
                ? `${typedProjects.length} funnel project${typedProjects.length === 1 ? "" : "s"} — ${completeCount} complete`
                : "Ready to build your first challenge funnel?"}
            </p>
          </div>
          <Link href="/projects/new">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold border-0 shadow-sm" size="lg">
              <Plus className="h-4 w-4" />
              New funnel project
            </Button>
          </Link>
        </div>

        {typedProjects.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{typedProjects.length}</p>
              <p className="mt-0.5 flex items-center justify-center gap-1 text-xs text-slate-400">
                <Layers className="h-3 w-3" />
                Total
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{completeCount}</p>
              <p className="mt-0.5 flex items-center justify-center gap-1 text-xs text-slate-400">
                <TrendingUp className="h-3 w-3" />
                Complete
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-300">{inProgressCount}</p>
              <p className="mt-0.5 flex items-center justify-center gap-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                In progress
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Projects */}
      {typedProjects.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Your projects
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {typedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Pro tip */}
      {typedProjects.length === 0 && (
        <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
          <div className="flex gap-3">
            <Zap className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
            <div>
              <h3 className="font-semibold text-orange-900">
                Pro tip: be specific in the wizard
              </h3>
              <p className="mt-1 text-sm text-orange-700">
                The more detail you give about your audience and offer, the more
                targeted and persuasive your generated copy will be.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
