"use client";

import { useState } from "react";
import { Trash2, Clock, Pen, Loader2 } from "lucide-react";

interface Project {
  id: string;
  user_id: string;
  name: string;
  status: string;
  created_at: string;
}

interface Props {
  projects: Project[];
  inputMap: Record<string, Record<string, unknown>>;
  outputMap: Record<string, Record<string, unknown>>;
  userMap: Record<string, string>;
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

export function AdminProjectsTable({ projects: initial, inputMap, outputMap, userMap }: Props) {
  const [projects, setProjects] = useState(initial);
  const [confirmId, setConfirmId]   = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bannerErr, setBannerErr]   = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    setBannerErr(null);
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Delete failed");
      }
      setProjects((ps) => ps.filter((p) => p.id !== id));
      setConfirmId(null);
    } catch (err) {
      setBannerErr(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {bannerErr && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {bannerErr}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Challenge</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">
                <span className="flex items-center gap-1">
                  <Pen className="h-3 w-3" />Copywriter style
                </span>
              </th>
              <th className="px-4 py-3">Framework</th>
              <th className="px-4 py-3">Voice</th>
              <th className="px-4 py-3 whitespace-nowrap">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {projects.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                  No projects yet
                </td>
              </tr>
            )}
            {projects.map((p) => {
              const inp = inputMap[p.id] ?? {};
              const out = outputMap[p.id] ?? {};
              const challengeName = typeof inp.challengeName === "string" ? inp.challengeName : "—";
              const style     = String(out.copywriterStyle      ?? "—");
              const framework = String(out.copywritingFramework ?? "—");
              const voice     = String(out.copywriterVoice      ?? "—");
              const email     = userMap[p.user_id] ?? p.user_id.slice(0, 8) + "…";
              const date      = new Date(p.created_at).toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "numeric",
              });
              const isConfirming = confirmId === p.id;
              const isDeleting   = deletingId === p.id;

              return (
                <tr
                  key={p.id}
                  className={`transition-colors ${isConfirming ? "bg-red-50" : "hover:bg-gray-50"}`}
                >
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate" title={email}>
                    {email}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate" title={p.name}>
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate" title={challengeName}>
                    {challengeName}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[140px] truncate" title={style}>
                    {style}
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[140px] truncate" title={framework}>
                    {framework}
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[140px] truncate" title={voice}>
                    {voice}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 shrink-0" />{date}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
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
                        className="rounded p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
