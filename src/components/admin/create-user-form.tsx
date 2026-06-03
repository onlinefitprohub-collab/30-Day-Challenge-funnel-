"use client";

import { useState } from "react";
import { UserPlus, Loader2, Send } from "lucide-react";

export function CreateUserForm() {
  const [email, setEmail]             = useState("");
  const [name, setName]               = useState("");
  const [grantAccess, setGrantAccess] = useState(true);
  const [loading, setLoading]         = useState(false);
  const [message, setMessage]         = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), grantAccess }),
      });
      const data = await res.json() as { success?: boolean; error?: string; email?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setMessage({
        type: "success",
        text: `Invite sent to ${data.email}${grantAccess ? " — access granted immediately" : ""}`,
      });
      setEmail(""); setName("");
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-gray-600" />
        <h3 className="font-semibold text-gray-900 text-sm">Create / Invite User</h3>
      </div>
      <p className="text-xs text-gray-500">Sends an invite email with a magic link. User sets their own password on first login.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="coach@example.com"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Full name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={grantAccess}
            onChange={e => setGrantAccess(e.target.checked)}
            className="rounded border-gray-300"
          />
          Grant immediate access (no Stripe payment required)
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {loading ? "Sending…" : "Send invite"}
          </button>
        </div>
      </form>
      {message && (
        <p className={`text-sm rounded-lg px-3 py-2 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
