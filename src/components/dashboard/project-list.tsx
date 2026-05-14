"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle, Loader2, MoreHorizontal, ExternalLink, RefreshCw, Zap, Target } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { CloneButton } from "./clone-button";
import type { ProjectRow } from "@/types/project";

const STATUS_CONFIG: Record<
  ProjectRow["status"],
  { label: string; dot: string; text: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  complete:   { label: "Complete",    dot: "bg-emerald-400",           text: "text-emerald-400",  bg: "bg-emerald-400/10", icon: CheckCircle2 },
  generating: { label: "Generating…", dot: "bg-blue-400 animate-pulse",text: "text-blue-400",     bg: "bg-blue-400/10",    icon: Loader2 },
  draft:      { label: "In Progress", dot: "bg-zinc-500",              text: "text-zinc-400",     bg: "bg-zinc-500/10",    icon: Clock },
  error:      { label: "Error",       dot: "bg-red-400",               text: "text-red-400",      bg: "bg-red-400/10",     icon: AlertCircle },
};

function funnelTypeLabel(name: string): { label: string; colour: string } | null {
  const lower = name.toLowerCase();
  if (lower.includes("application")) return { label: "Application", colour: "#a78bfa" };
  if (lower.includes("challenge"))   return { label: "Challenge",   colour: "#60a5fa" };
  return null;
}

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
        const sub     = subtitles[project.id];
        const typeTag = funnelTypeLabel(project.name);
        const isComplete   = project.status === "complete";
        const isGenerating = project.status === "generating";

        return (
          <div
            key={project.id}
            className="group relative flex flex-col rounded-2xl border border-white/[0.07] bg-[#18181b] overflow-hidden transition-all hover:border-white/[0.14] hover:shadow-xl hover:shadow-black/30"
          >
            {/* Top accent bar */}
            <div
              className="h-0.5 w-full shrink-0"
              style={{
                background: isComplete
                  ? "linear-gradient(90deg,#10b981,#34d399)"
                  : isGenerating
                  ? "linear-gradient(90deg,#3b82f6,#60a5fa)"
                  : "transparent",
              }}
            />

            <div className="flex flex-col flex-1 p-4">
              {/* Status + menu row */}
              <div className="mb-3 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>

                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === project.id ? null : project.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/[0.08] hover:text-zinc-300"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {menuOpen === project.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                      <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-white/[0.08] bg-[#18181b] py-1 shadow-xl">
                        <Link
                          href={href}
                          onClick={() => setMenuOpen(null)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {isComplete ? "View results" : "Open"}
                        </Link>
                        {isComplete && (
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

              {/* Project name + subtitle + type tag */}
              <Link href={href} className="min-w-0 flex-1 block">
                <p className="font-bold text-zinc-100 text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">
                  {project.name}
                </p>
                {sub && (
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-1">{sub}</p>
                )}
                {typeTag && (
                  <span
                    className="mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                    style={{ color: typeTag.colour, borderColor: `${typeTag.colour}30`, backgroundColor: `${typeTag.colour}10` }}
                  >
                    {typeTag.label === "Application" ? <Target className="h-2.5 w-2.5" /> : <Zap className="h-2.5 w-2.5" />}
                    {typeTag.label}
                  </span>
                )}
              </Link>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
                <span className="text-[11px] text-zinc-600 tabular-nums">
                  {formatDate(project.updated_at)}
                </span>
                <Link
                  href={href}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all"
                  style={isComplete
                    ? { color: "#f97316" }
                    : { color: "#71717a" }
                  }
                >
                  <Icon className={`h-3 w-3 ${isGenerating ? "animate-spin" : ""}`} />
                  {isComplete
                    ? "View Results →"
                    : isGenerating
                    ? "Generating…"
                    : project.status === "error"
                    ? "Retry →"
                    : "Resume Setup →"}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
