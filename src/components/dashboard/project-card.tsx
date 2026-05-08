import Link from "next/link";
import { ArrowRight, RefreshCw, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ProjectRow } from "@/types/project";
import { CloneButton } from "./clone-button";

const STATUS_CONFIG: Record<
  ProjectRow["status"],
  { label: string; color: string; icon: React.ElementType; ring: string }
> = {
  complete:   { label: "Complete",      color: "text-green-400 bg-green-500/10",   icon: CheckCircle2, ring: "border-white/[0.07] hover:border-green-500/40" },
  generating: { label: "Generating...", color: "text-blue-400 bg-blue-500/10",     icon: Loader2,      ring: "border-white/[0.07] hover:border-blue-500/40" },
  draft:      { label: "Draft",         color: "text-zinc-400 bg-white/[0.05]",    icon: Clock,        ring: "border-white/[0.07] hover:border-orange-500/30" },
  error:      { label: "Error",         color: "text-red-400 bg-red-500/10",        icon: AlertCircle,  ring: "border-white/[0.07] hover:border-red-500/40" },
};

function ctaFor(status: ProjectRow["status"]) {
  if (status === "complete")   return { text: "View results", icon: ArrowRight };
  if (status === "error")      return { text: "Retry",        icon: RefreshCw };
  if (status === "generating") return { text: "Check status", icon: ArrowRight };
  return { text: "Continue",   icon: ArrowRight };
}

interface Props {
  project: ProjectRow;
  subtitle?: string;
}

export function ProjectCard({ project, subtitle }: Props) {
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
      className={`group flex flex-col rounded-xl border bg-[#18181b] p-5 transition-all hover:bg-[#1c1c1f] ${cfg.ring}`}
    >
      {/* Top row: name + status badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-zinc-100 group-hover:text-orange-400 leading-snug transition-colors">
            {project.name}
          </h3>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.color}`}>
          <StatusIcon className={`h-3 w-3 ${project.status === "generating" ? "animate-spin" : ""}`} />
          {cfg.label}
        </span>
      </div>

      {/* Timestamp */}
      <p className="mt-2 flex items-center gap-1 text-xs text-zinc-600">
        <Clock className="h-3 w-3" />
        Updated {formatDate(project.updated_at)}
      </p>

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA row */}
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-zinc-600">
            Created {formatDate(project.created_at)}
          </span>
          {project.status === "complete" && (
            <CloneButton projectId={project.id} />
          )}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-orange-400 opacity-0 transition-opacity group-hover:opacity-100">
          {cta.text}
          <CtaIcon className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
