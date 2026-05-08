"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, Clock, AlertCircle, Loader2,
  ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, RefreshCw, ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { CloneButton } from "./clone-button";
import type { ProjectRow } from "@/types/project";

type SortKey = "name" | "status" | "updated_at";
type SortDir = "asc" | "desc";

const STATUS_CONFIG: Record<
  ProjectRow["status"],
  { label: string; dot: string; text: string }
> = {
  complete:   { label: "Complete",      dot: "bg-green-400",  text: "text-green-400" },
  generating: { label: "Generating…",   dot: "bg-blue-400 animate-pulse", text: "text-blue-400" },
  draft:      { label: "Draft",         dot: "bg-zinc-500",   text: "text-zinc-500" },
  error:      { label: "Error",         dot: "bg-red-400",    text: "text-red-400" },
};

interface Props {
  projects: ProjectRow[];
  subtitles: Record<string, string>;
}

export function ProjectList({ projects, subtitles }: Props) {
  const [sortKey, setSortKey]   = useState<SortKey>("updated_at");
  const [sortDir, setSortDir]   = useState<SortDir>("desc");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...projects].sort((a, b) => {
    let av: string = "", bv: string = "";
    if (sortKey === "name")       { av = a.name; bv = b.name; }
    if (sortKey === "status")     { av = a.status; bv = b.status; }
    if (sortKey === "updated_at") { av = a.updated_at; bv = b.updated_at; }
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 text-zinc-600" />;
    return sortDir === "asc"
      ? <ArrowUp className="h-3 w-3 text-orange-400" />
      : <ArrowDown className="h-3 w-3 text-orange-400" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07]">
      {/* Header row */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-white/[0.07] bg-[#111113] px-4 py-2.5">
        <button
          onClick={() => handleSort("name")}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors text-left"
        >
          Project <SortIcon col="name" />
        </button>
        <button
          onClick={() => handleSort("status")}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Status <SortIcon col="status" />
        </button>
        <button
          onClick={() => handleSort("updated_at")}
          className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Updated <SortIcon col="updated_at" />
        </button>
        <span className="w-6" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.04] bg-[#0d0d10]">
        {sorted.map((project) => {
          const cfg  = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.draft;
          const href = project.status === "complete"
            ? `/projects/${project.id}/results`
            : `/projects/${project.id}`;
          const sub = subtitles[project.id];

          return (
            <div
              key={project.id}
              className="group grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-3.5 hover:bg-white/[0.025] transition-colors"
            >
              {/* Name + subtitle */}
              <Link href={href} className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  {project.name}
                </p>
                {sub && (
                  <p className="truncate text-xs text-zinc-600 mt-0.5">{sub}</p>
                )}
              </Link>

              {/* Status */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                <span className={`text-xs font-medium ${cfg.text} hidden sm:block`}>{cfg.label}</span>
              </div>

              {/* Updated */}
              <span className="hidden sm:block text-xs text-zinc-600 shrink-0 tabular-nums">
                {formatDate(project.updated_at)}
              </span>

              {/* Actions */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setMenuOpen(menuOpen === project.id ? null : project.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-600 hover:bg-white/[0.08] hover:text-zinc-300 transition-colors"
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
          );
        })}
      </div>
    </div>
  );
}
