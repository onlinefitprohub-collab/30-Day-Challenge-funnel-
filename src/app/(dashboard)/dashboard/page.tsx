"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/project-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { getProjects, type StoredProject } from "@/lib/storage";

export default function DashboardPage() {
  const [projects, setProjects] = useState<StoredProject[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your funnels</h1>
          <p className="mt-1 text-gray-500">
            {projects.length > 0
              ? `You have ${projects.length} funnel project${projects.length === 1 ? "" : "s"}.`
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
      {projects.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: "Total projects", value: projects.length, color: "text-gray-900" },
            {
              label: "Complete",
              value: projects.filter((p) => p.status === "complete").length,
              color: "text-green-600",
            },
            {
              label: "In progress",
              value: projects.filter((p) => p.status === "draft").length,
              color: "text-amber-600",
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
      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Your projects</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Quick tip for new users */}
      {projects.length === 0 && (
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
