"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Trash2, Clock, Eye, Loader2, ChevronDown, ChevronRight, User2, Pen } from "lucide-react";

interface Project {
  id: string;
  user_id: string;
  name: string;
  status: string;
  created_at: string;
}

interface Props {
  projects: Project[];
  inputMap:  Record<string, Record<string, unknown>>;
  outputMap: Record<string, Record<string, unknown>>;
  userMap:   Record<string, string>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    complete:   { label: "Complete",   cls: "bg-green-100 text-green-700" },
    generating: { label: "Generating", cls: "bg-blue-100 text-blue-700" },
    error:      { label: "Error",      cls: "bg-red-100 text-red-700" },
    draft:      { label: "Draft",      cls: "bg-gray-100 text-gray-600" },
  };
  const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

/* ── Per-user collapsible section ─────────────────────────────────────────── */

interface SectionProps {
  email:        string;
  userProjects: Project[];
  inputMap:     Record<string, Record<string, unknown>>;
  outputMap:    Record<string, Record<string, unknown>>;
  onDeleted:    (id: string) => void;
  onError:      (msg: string) => void;
}

function UserProjectsSection({
  email,
  userProjects,
  inputMap,
  outputMap,
  onDeleted,
  onError,
}: SectionProps) {
  const [expanded,   setExpanded]   = useState(true);
  const [confirmId,  setConfirmId]  = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        let errMsg = `Delete failed (HTTP ${res.status})`;
        try { const d = await res.json() as { error?: string }; if (d.error) errMsg = d.error; } catch { /* ignore parse errors */ }
        throw new Error(errMsg);
      }
      onDeleted(id);
      setConfirmId(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  const count = userProjects.length;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* User header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <User2 className="h-3.5 w-3.5 text-blue-600" />
        </div>
        <span className="text-sm font-semibold text-gray-900">{email}</span>
        <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {count} {count === 1 ? "project" : "projects"}
        </span>
        <span className="ml-auto text-gray-400">
          {expanded
            ? <ChevronDown className="h-4 w-4" />
            : <ChevronRight className="h-4 w-4" />}
        </span>
      </button>

      {/* Projects table */}
      {expanded && (
        <table className="min-w-full divide-y divide-gray-50 text-sm">
          <thead>
            <tr className="bg-white text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              <th className="px-4 py-2.5">Project</th>
              <th className="px-4 py-2.5">Challenge</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">
                <span className="flex items-center gap-1">
                  <Pen className="h-3 w-3" /> Style · Framework
                </span>
              </th>
              <th className="px-4 py-2.5 whitespace-nowrap">Created</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {userProjects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-xs italic text-gray-400">
                  No projects
                </td>
              </tr>
            )}
            {userProjects.map((p) => {
              const inp = inputMap[p.id]  ?? {};
              const out = outputMap[p.id] ?? {};

              const challengeName = typeof inp.challengeName === "string" ? inp.challengeName : "—";
              const fullStyle     = String(out.copywriterStyle      ?? "");
              const framework     = String(out.copywritingFramework ?? "—");
              // Show just the copywriter name (before " — ")
              const styleName     = fullStyle ? fullStyle.split(" — ")[0] : "—";

              const date = new Date(p.created_at).toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "numeric",
              });

              const isConfirming = confirmId  === p.id;
              const isDeleting   = deletingId === p.id;

              return (
                <tr
                  key={p.id}
                  className={`transition-colors ${isConfirming ? "bg-red-50" : "hover:bg-gray-50"}`}
                >
                  <td className="max-w-[200px] truncate px-4 py-3 font-medium text-gray-900" title={p.name}>
                    {p.name}
                  </td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-gray-600" title={challengeName}>
                    {challengeName}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-xs text-gray-600"
                    title={`${styleName} · ${framework}`}
                  >
                    {styleName !== "—" && (
                      <span className="font-medium text-gray-800">{styleName}</span>
                    )}
                    {framework !== "—" && (
                      <span className="text-gray-400"> · {framework}</span>
                    )}
                    {styleName === "—" && framework === "—" && "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 shrink-0" />
                      {date}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-1">
                      {/* Preview — links to the results page in a new tab */}
                      {!isConfirming && (
                        <Link
                          href={`/projects/${p.id}/results`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          title="Preview funnel"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}

                      {/* Delete */}
                      {isConfirming ? (
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-medium text-red-600">Delete?</span>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={isDeleting}
                            className="rounded px-2 py-1 text-xs font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                          >
                            {isDeleting
                              ? <Loader2 className="h-3 w-3 animate-spin" />
                              : "Yes, delete"}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="rounded px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmId(p.id)}
                          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────────────────────── */

export function AdminProjectsTable({ projects: initial, inputMap, outputMap, userMap }: Props) {
  const [allProjects, setAllProjects] = useState(initial);
  const [bannerErr,   setBannerErr]   = useState<string | null>(null);

  // Group projects by user, sorted alphabetically by email
  const groups = useMemo(() => {
    const g: Record<string, { email: string; projects: Project[] }> = {};
    for (const p of allProjects) {
      if (!g[p.user_id]) {
        g[p.user_id] = {
          email:    userMap[p.user_id] ?? `${p.user_id.slice(0, 8)}…`,
          projects: [],
        };
      }
      g[p.user_id].projects.push(p);
    }
    return Object.entries(g).sort(([, a], [, b]) => a.email.localeCompare(b.email));
  }, [allProjects, userMap]);

  function handleDeleted(id: string) {
    setAllProjects((ps) => ps.filter((p) => p.id !== id));
  }

  return (
    <>
      {bannerErr && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {bannerErr}
          <button onClick={() => setBannerErr(null)} className="ml-3 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <div className="space-y-3">
        {groups.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-10 text-center text-gray-400">
            No projects yet
          </div>
        )}
        {groups.map(([userId, { email, projects }]) => (
          <UserProjectsSection
            key={userId}
            email={email}
            userProjects={projects}
            inputMap={inputMap}
            outputMap={outputMap}
            onDeleted={handleDeleted}
            onError={(msg) => setBannerErr(msg)}
          />
        ))}
      </div>
    </>
  );
}
