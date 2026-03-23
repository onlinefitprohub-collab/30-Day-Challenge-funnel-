import Link from "next/link";
import { ArrowRight, RefreshCw, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ProjectRow } from "@/types/project";

const STATUS_CONFIG: Record<
  ProjectRow["status"],
  { label: string; color: string; icon: React.ElementType; ring: string }
> = {
  complete:   { label: "Complete",      color: "text-green-700 bg-green-50",  icon: CheckCircle2, ring: "border-green-200 hover:border-green-300" },
  generating: { label: "Generating...", color: "text-blue-700 bg-blue-50",    icon: Loader2,      ring: "border-blue-200 hover:border-blue-300" },
  draft:      { label: "Draft",         color: "text-gray-600 bg-gray-100",   icon: Clock,        ring: "border-gray-200 hover:border-orange-300" },
  error:      { label: "Error",         color: "text-red-700 bg-red-50",      icon: AlertCircle,  ring: "border-red-200 hover:border-red-300" },
};

function ctaFor(status: ProjectRow["status"]) {
  if (status === "complete")   return { text: "View results", icon: ArrowRight };
  if (status === "error")      return { text: "Retry",        icon: RefreshCw };
  if (status === "generating") return { text: "Check status", icon: ArrowRight };
  return { text: "Continue",   icon: ArrowRight };
}

export function ProjectCard({ project }: { project: ProjectRow }) {
  const cfg  = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.draft;
  const cta  = ctaFor(project.status);
  const CtaIcon = cta.icon;
  const StatusIcon = cfg.icon;

  const href =
    project.status === "complete"
      ? `/projects/${project.id}/results`
      : `/projects/${project.id}`;

  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${cfg.ring}`}
    >
      {/* Top row: name + status badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 truncate font-semibold text-gray-900 group-hover:text-orange-600 leading-snug">
          {project.name}
        </h3>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.color}`}>
          <StatusIcon className={`h-3 w-3 ${project.status === "generating" ? "animate-spin" : ""}`} />
          {cfg.label}
        </span>
      </div>

      {/* Timestamp */}
      <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
        <Clock className="h-3 w-3" />
        Updated {formatDate(project.updated_at)}
      </p>

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA row */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-[11px] text-gray-400">
          Created {formatDate(project.created_at)}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 opacity-0 transition-opacity group-hover:opacity-100">
          {cta.text}
          <CtaIcon className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
