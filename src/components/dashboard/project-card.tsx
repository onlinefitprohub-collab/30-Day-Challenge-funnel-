import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { StoredProject } from "@/lib/storage";

const statusConfig: Record<StoredProject["status"], { label: string; variant: "draft" | "complete" | "error" }> = {
  draft: { label: "Draft", variant: "draft" },
  complete: { label: "Complete", variant: "complete" },
  error: { label: "Error", variant: "error" },
};

export function ProjectCard({ project }: { project: StoredProject }) {
  const status = statusConfig[project.status] ?? statusConfig.draft;

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
          {project.status === "complete" ? "View results" : "Continue"}
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
