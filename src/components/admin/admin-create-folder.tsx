"use client";

import { useState } from "react";
import { FolderPlus, Loader2, Check, Folder } from "lucide-react";

interface User {
  id: string;
  email: string;
}

interface FolderRow {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

interface Props {
  users: User[];
  existingFolders: FolderRow[];
}

export function AdminCreateFolder({ users, existingFolders: initial }: Props) {
  const [folders, setFolders] = useState(initial);
  const [userId, setUserId] = useState("");
  const [name, setName]   = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const userMap = Object.fromEntries(users.map((u) => [u.id, u.email]));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !name.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: name.trim() }),
      });
      const data = await res.json() as { folder?: FolderRow; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to create folder");
      setFolders((fs) => [data.folder!, ...fs]);
      setName("");
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <FolderPlus className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900">Create user folder</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1 min-w-[200px]">
          <label className="text-xs font-medium text-gray-600">User</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          >
            <option value="">Select a user…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.email}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-gray-600">Folder name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cohort 1 · Week 3"
            required
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading" || !userId || !name.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <FolderPlus className="h-4 w-4" />
          )}
          {status === "success" ? "Created!" : "Create folder"}
        </button>

        {status === "error" && (
          <p className="w-full text-xs text-red-600">{errorMsg}</p>
        )}
      </form>

      {folders.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Existing folders
          </p>
          <div className="space-y-1.5">
            {folders.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
              >
                <Folder className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                <span className="font-medium text-gray-800">{f.name}</span>
                <span className="text-gray-300">·</span>
                <span className="truncate text-gray-500">
                  {userMap[f.user_id] ?? f.user_id.slice(0, 8) + "…"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
