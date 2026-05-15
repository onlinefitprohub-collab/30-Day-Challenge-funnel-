"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle, Loader2, MoreHorizontal, ExternalLink, RefreshCw, Zap, Target, Pencil, Trash2 } from "lucide-react";
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

export function ProjectList({ projects: initialProjects, subtitles }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [menuOpen, setMenuOpen]     = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting]     = useState<string | null>(null);
  const [renaming, setRenaming]     = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameSaving, setRenameSaving] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    if (renaming) renameInputRef.current?.focus();
  }, [renaming]);

  function startRename(projectId: string, currentName: string) {
    setMenuOpen(null);
    setRenameValue(currentName);
    setRenaming(projectId);
  }

  async function saveRename(projectId: string) {
    const trimmed = renameValue.trim();
    if (!trimmed) { setRenaming(null); return; }
    setRenameSaving(true);
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    setRenameSaving(false);
    if (res.ok) {
      setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, name: trimmed } : p));
    }
    setRenaming(null);
  }

  async function deleteProject(projectId: string) {
    setDeleting(projectId);
    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      router.refresh();
    }
    setDeleting(null);
    setConfirmDelete(null);
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-[#18181b] py-16 text-center">
        <p className="text-zinc-400 text-sm">No projects yet</p>
        <p className="mt-1 text-zinc-600 text-xs">Create your first funnel to get started</p>
      </div>
    );
  }

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
        const isRenaming   = renaming === project.id;
        const isConfirmingDelete = confirmDelete === project.id;

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
                    onClick={() => {
                      setConfirmDelete(null);
                      setMenuOpen(menuOpen === project.id ? null : project.id);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/[0.08] hover:text-zinc-300"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {menuOpen === project.id && !isConfirmingDelete && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                      <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-white/[0.08] bg-[#18181b] py-1 shadow-xl">
                        <Link
                          href={href}
                          onClick={() => setMenuOpen(null)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {isComplete ? "View results" : "Open"}
                        </Link>
                        <button
                          onClick={() => startRename(project.id, project.name)}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Rename
                        </button>
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
                        <div className="my-1 border-t border-white/[0.06]" />
                        <button
                          onClick={() => { setConfirmDelete(project.id); setMenuOpen(null); }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Inline delete confirm */}
              {isConfirmingDelete && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setConfirmDelete(null)} />
                  <div className="relative z-20 mb-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                    <p className="text-xs font-semibold text-red-300 mb-2">Delete this project?</p>
                    <p className="text-[11px] text-red-400/70 mb-3">This cannot be undone.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteProject(project.id)}
                        disabled={deleting === project.id}
                        className="flex-1 rounded-lg bg-red-500 px-2 py-1.5 text-[11px] font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                      >
                        {deleting === project.id ? "Deleting…" : "Yes, delete"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="flex-1 rounded-lg border border-white/[0.08] px-2 py-1.5 text-[11px] text-zinc-400 hover:bg-white/[0.05] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Project name (inline rename or static) + subtitle + type tag */}
              <div className="min-w-0 flex-1">
                {isRenaming ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveRename(project.id);
                        if (e.key === "Escape") setRenaming(null);
                      }}
                      onBlur={() => saveRename(project.id)}
                      disabled={renameSaving}
                      className="flex-1 min-w-0 rounded-lg border border-white/[0.12] bg-white/[0.06] px-2 py-1 text-sm font-bold text-zinc-100 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 disabled:opacity-50"
                    />
                  </div>
                ) : (
                  <Link href={href} className="block">
                    <p className="font-bold text-zinc-100 text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">
                      {project.name}
                    </p>
                  </Link>
                )}
                {sub && !isRenaming && (
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
              </div>

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
