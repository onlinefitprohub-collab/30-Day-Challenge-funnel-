import Link from "next/link";
import { ArrowRight, Clock, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { ProjectRow } from "@/types/project";

const statusConfig: Record<ProjectRow["status"], { label: string; variant: "draft" | "generating" | "complete" | "error" }> = {
  draft: { label: "Draft", variant: "draft" },
  generating: { label: "Generating...", variant: "generating" },
  complete: { label: "Complete", variant: "complete" },
  error: { label: "Error", variant: "error" },
};

function ctaLabel(status: ProjectRow["status"]) {
  if (status === "complete") return { text: "View results", icon: ArrowRight };
  if (status === "error") return { text: "Retry", icon: RefreshCw };
  return { text: "Continue", icon: ArrowRight };
}

export function ProjectCard({ project }: { project: ProjectRow }) {
  const status = statusConfig[project.status] ?? statusConfig.draft;
  const cta = ctaLabel(project.status);
  const Icon = cta.icon;

  return (
    <Link
      href={
        project.status === "complete"
          ? `/projects/${project.id}/results`
          : `/projects/${project.id}`
      }
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-brand-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900 group-hover:text-brand-700">
            {project.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>Updated {formatDate(project.updated_at)}</span>
          </div>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Created {formatDate(project.created_at)}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
          {cta.text}
          <Icon className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
