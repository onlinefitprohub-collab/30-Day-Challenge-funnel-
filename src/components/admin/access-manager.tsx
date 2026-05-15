"use client";

import { useState } from "react";
import { ShieldCheck, ShieldX, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserAccess {
  userId: string;
  email: string;
  status: string;
}

interface AccessManagerProps {
  users: UserAccess[];
}

export function AccessManager({ users: initialUsers }: AccessManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [email, setEmail] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setGrantLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/grant-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json() as { success?: boolean; error?: string; userId?: string; email?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");

      setMessage({ type: "success", text: `Access granted to ${data.email}` });
      setEmail("");
      setUsers((prev) => {
        const exists = prev.find((u) => u.userId === data.userId);
        if (exists) return prev.map((u) => u.userId === data.userId ? { ...u, status: "manual" } : u);
        return [{ userId: data.userId!, email: data.email!, status: "manual" }, ...prev];
      });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setGrantLoading(false);
    }
  }

  async function handleRevoke(userId: string) {
    setRevokeLoading(userId);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/grant-access", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");

      setMessage({ type: "success", text: "Access revoked" });
      setUsers((prev) => prev.map((u) => u.userId === userId ? { ...u, status: "none" } : u));
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setRevokeLoading(null);
    }
  }

  const statusBadge = (status: string) => {
    if (status === "active")  return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"><ShieldCheck className="h-3 w-3" />Active</span>;
    if (status === "manual")  return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"><ShieldCheck className="h-3 w-3" />Admin access</span>;
    return <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">None</span>;
  };

  return (
    <div className="space-y-4">
      {/* Grant form */}
      <form onSubmit={handleGrant} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <Button type="submit" variant="gradient" size="sm" className="gap-2 shrink-0" disabled={grantLoading}>
          {grantLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
          Grant access
        </Button>
      </form>

      {/* Feedback */}
      {message && (
        <p className={`text-sm rounded-lg px-3 py-2 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </p>
      )}

      {/* User table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Access</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No users</td></tr>
            )}
            {users.map((u) => (
              <tr key={u.userId} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{u.email}</td>
                <td className="px-4 py-3">{statusBadge(u.status)}</td>
                <td className="px-4 py-3 text-right">
                  {u.status === "manual" && (
                    <button
                      onClick={() => handleRevoke(u.userId)}
                      disabled={revokeLoading === u.userId}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      {revokeLoading === u.userId ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldX className="h-3 w-3" />}
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
