import Link from "next/link";
import { Plus, Zap } from "lucide-react";
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {displayName} 👋
          </h1>
          <p className="mt-1 text-gray-500">
            {typedProjects.length > 0
              ? `You have ${typedProjects.length} funnel project${typedProjects.length === 1 ? "" : "s"}.`
              : "Ready to build your first challenge funnel?"}
          </p>
        </div>
        <Link href="/projects/new">
          <Button variant="gradient" size="lg">
            <Plus className="h-4 w-4" />
            New funnel project
          </Button>
        </Link>
      </div>

      {/* Stats bar */}
      {typedProjects.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total projects",
              value: typedProjects.length,
              color: "text-gray-900",
            },
            {
              label: "Complete",
              value: typedProjects.filter((p) => p.status === "complete").length,
              color: "text-green-600",
            },
            {
              label: "In progress",
              value: typedProjects.filter((p) => p.status === "draft").length,
              color: "text-amber-600",
            },
            {
              label: "Generating",
              value: typedProjects.filter((p) => p.status === "generating").length,
              color: "text-blue-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-0.5 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {typedProjects.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Your projects
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {typedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Quick tip for new users */}
      {typedProjects.length === 0 && (
        <div className="rounded-xl border border-brand-100 bg-brand-50 p-6">
          <div className="flex gap-3">
            <Zap className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <div>
              <h3 className="font-semibold text-brand-900">
                Pro tip: be specific in the wizard
              </h3>
              <p className="mt-1 text-sm text-brand-700">
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
