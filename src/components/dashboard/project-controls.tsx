"use client";

import { useState, useMemo } from "react";
import { ProjectList } from "./project-list";
import type { ProjectRow } from "@/types/project";

type SortKey = "updated" | "created" | "name";
type FilterStatus = "all" | "complete" | "draft" | "generating" | "error";

interface Props {
  projects: ProjectRow[];
  subtitles: Record<string, string>;
}

const FILTER_LABELS: Record<FilterStatus, string> = {
  all: "All",
  complete: "Complete",
  draft: "In Progress",
  generating: "Generating",
  error: "Error",
};

export function ProjectControls({ projects, subtitles }: Props) {
  const [sort, setSort] = useState<SortKey>("updated");
  const [filter, setFilter] = useState<FilterStatus>("all");

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    for (const p of projects) {
      counts[p.status] = (counts[p.status] ?? 0) + 1;
    }
    return counts;
  }, [projects]);

  const visibleFilters = (["all", "complete", "draft", "generating", "error"] as FilterStatus[]).filter(
    (f) => f === "all" || (statusCounts[f] ?? 0) > 0
  );

  const processed = useMemo(() => {
    let list = filter === "all" ? projects : projects.filter((p) => p.status === filter);
    list = [...list].sort((a, b) => {
      if (sort === "name")    return a.name.localeCompare(b.name);
      if (sort === "created") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    return list;
  }, [projects, sort, filter]);

  return (
    <div className="space-y-3">
      {/* Controls bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {visibleFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                filter === f
                  ? "bg-orange-500 text-white"
                  : "bg-white/[0.05] text-zinc-400 hover:bg-white/[0.09] hover:text-zinc-200"
              }`}
            >
              {FILTER_LABELS[f]}
              {f !== "all" && (
                <span className="ml-1 opacity-60">{statusCounts[f] ?? 0}</span>
              )}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-white/[0.08] bg-[#18181b] px-2.5 py-1 text-[11px] text-zinc-400 outline-none focus:border-orange-500/40 cursor-pointer"
        >
          <option value="updated">Last updated</option>
          <option value="created">Newest first</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Project grid */}
      <ProjectList projects={processed} subtitles={subtitles} />
    </div>
  );
}
