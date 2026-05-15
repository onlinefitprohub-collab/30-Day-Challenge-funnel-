"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, TrendingUp, Users, Phone, DollarSign, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProjectStats {
  opt_in_rate: number | null;
  applications: number | null;
  bookings: number | null;
  revenue: number | null;
  notes: string | null;
}

interface Props {
  projectId: string;
}

function StatDisplay({ icon: Icon, label, value, suffix = "" }: {
  icon: React.ElementType;
  label: string;
  value: number | null;
  suffix?: string;
}) {
  if (value === null) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-200">
        <Icon className="h-4 w-4 text-gray-600" />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}{suffix}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export function PerformanceTrackerSection({ projectId }: Props) {
  const [stats, setStats]     = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    opt_in_rate: "",
    applications: "",
    bookings: "",
    revenue: "",
    notes: "",
  });

  useEffect(() => {
    fetch(`/api/projects/${projectId}/stats`)
      .then((r) => r.json())
      .then(({ stats: s }) => {
        setStats(s);
        if (s) {
          setForm({
            opt_in_rate:  s.opt_in_rate  != null ? String(s.opt_in_rate)  : "",
            applications: s.applications != null ? String(s.applications) : "",
            bookings:     s.bookings     != null ? String(s.bookings)     : "",
            revenue:      s.revenue      != null ? String(s.revenue)      : "",
            notes:        s.notes ?? "",
          });
        } else {
          setEditing(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  async function save() {
    setSaving(true);
    const body = {
      opt_in_rate:  form.opt_in_rate  !== "" ? Number(form.opt_in_rate)  : null,
      applications: form.applications !== "" ? Number(form.applications) : null,
      bookings:     form.bookings     !== "" ? Number(form.bookings)     : null,
      revenue:      form.revenue      !== "" ? Number(form.revenue)      : null,
      notes:        form.notes || null,
    };
    const res = await fetch(`/api/projects/${projectId}/stats`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      setStats(body as ProjectStats);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast({ title: "Stats saved" });
    } else {
      toast({ title: "Save failed", variant: "destructive" });
    }
  }

  const hasAnyStats = stats && (
    stats.opt_in_rate != null || stats.applications != null ||
    stats.bookings != null || stats.revenue != null
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Funnel Performance</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Log your actual results as your funnel runs. Track what&apos;s working and spot where to optimise.
            </p>
          </div>
          {!editing && hasAnyStats && (
            <button
              onClick={() => setEditing(true)}
              className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
          )}
          {saved && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved
            </div>
          )}
        </div>
      </div>

      {/* Stats display */}
      {!loading && !editing && hasAnyStats && (
        <div className="grid gap-3 sm:grid-cols-2">
          <StatDisplay icon={Users}       label="Opt-in rate"        value={stats.opt_in_rate}  suffix="%" />
          <StatDisplay icon={FileText}    label="Applications"       value={stats.applications} />
          <StatDisplay icon={Phone}       label="Bookings / Calls"   value={stats.bookings}     />
          <StatDisplay icon={DollarSign}  label="Revenue (£/$)"      value={stats.revenue}      />
        </div>
      )}

      {stats?.notes && !editing && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Notes</p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{stats.notes}</p>
        </div>
      )}

      {/* Edit form */}
      {!loading && editing && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Log your numbers</p>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { key: "opt_in_rate",  label: "Opt-in rate (%)",   icon: Users,       placeholder: "e.g. 32" },
              { key: "applications", label: "Applications",       icon: FileText,    placeholder: "e.g. 18" },
              { key: "bookings",     label: "Bookings / Calls",   icon: Phone,       placeholder: "e.g. 12" },
              { key: "revenue",      label: "Revenue (£/$)",      icon: DollarSign,  placeholder: "e.g. 4700" },
            ].map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Notes (optional)</label>
            <textarea
              rows={3}
              placeholder="What's working? Where are people dropping off? Any patterns you've noticed…"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {saving ? "Saving…" : "Save stats"}
            </button>
            {stats && (
              <button
                onClick={() => setEditing(false)}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading stats…
        </div>
      )}

      {/* Conversion benchmarks */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Conversion benchmarks</p>
        <div className="grid gap-2 sm:grid-cols-2 text-xs text-blue-800">
          {[
            { label: "Landing page → Opt-in",  good: "25–45%",  great: "45%+" },
            { label: "Opt-in → Application",   good: "10–20%",  great: "20%+" },
            { label: "Application → Booking",  good: "40–60%",  great: "70%+" },
            { label: "Booking → Close",        good: "20–35%",  great: "40%+" },
          ].map(({ label, good, great }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="font-semibold text-blue-900">{label}</span>
              <span className="text-blue-700">Good: {good} · Great: {great}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
