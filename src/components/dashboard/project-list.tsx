"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle, Loader2, MoreHorizontal, ExternalLink, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { CloneButton } from "./clone-button";
import type { ProjectRow } from "@/types/project";

const STATUS_CONFIG: Record<
  ProjectRow["status"],
  { label: string; dot: string; text: string; icon: React.ComponentType<{ className?: string }> }
> = {
  complete:   { label: "Complete",    dot: "bg-green-400",              text: "text-green-400",  icon: CheckCircle2 },
  generating: { label: "Generating…", dot: "bg-blue-400 animate-pulse", text: "text-blue-400",   icon: Loader2 },
  draft:      { label: "In Progress",  dot: "bg-zinc-500",               text: "text-zinc-500",   icon: Clock },
  error:      { label: "Error",       dot: "bg-red-400",                text: "text-red-400",    icon: AlertCircle },
};

interface Props {
  projects: ProjectRow[];
  subtitles: Record<string, string>;
}

export function ProjectList({ projects, subtitles }: Props) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const cfg  = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.draft;
        const Icon = cfg.icon;
        const href = project.status === "complete"
          ? `/projects/${project.id}/results`
          : `/projects/${project.id}`;
        const sub = subtitles[project.id];

        return (
          <div
            key={project.id}
            className="group relative flex flex-col rounded-xl border border-white/[0.07] bg-[#18181b] p-4 transition-all hover:border-white/[0.12] hover:bg-[#1f1f23] hover:shadow-lg"
          >
            {/* Status + actions row */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                <span className={`text-[11px] font-semibold ${cfg.text}`}>{cfg.label}</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(menuOpen === project.id ? null : project.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-600 opacity-40 transition-all group-hover:opacity-100 hover:bg-white/[0.08] hover:text-zinc-300"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>

                {menuOpen === project.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                    <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-white/[0.08] bg-[#18181b] py-1 shadow-xl">
                      <Link
                        href={href}
                        onClick={() => setMenuOpen(null)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {project.status === "complete" ? "View results" : "Open"}
                      </Link>
                      {project.status === "complete" && (
                        <div className="px-3 py-2">
                          <CloneButton projectId={project.id} />
                        </div>
                      )}
                      {project.status === "error" && (
                        <Link
                          href={`/projects/${project.id}`}
                          onClick={() => setMenuOpen(null)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-white/[0.05] transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Retry
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Project name + subtitle */}
            <Link href={href} className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-200 transition-colors group-hover:text-white">
                {project.name}
              </p>
              {sub && (
                <p className="mt-0.5 truncate text-xs text-zinc-600">{sub}</p>
              )}
            </Link>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
              <span className="text-[11px] text-zinc-700 tabular-nums">
                {formatDate(project.updated_at)}
              </span>
              <Link
                href={href}
                className="flex items-center gap-1 text-[11px] font-medium text-orange-500 transition-colors hover:text-orange-400"
              >
                <Icon className={`h-3 w-3 ${project.status === "generating" ? "animate-spin" : ""}`} />
                {project.status === "complete"
                  ? "View Results →"
                  : project.status === "generating"
                    ? "Generating…"
                    : project.status === "error"
                      ? "Retry →"
                      : "Resume Setup →"}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
