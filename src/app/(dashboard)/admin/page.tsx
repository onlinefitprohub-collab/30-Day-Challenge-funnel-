import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { Users, FolderKanban, CheckCircle2, AlertCircle, Clock, Pen } from "lucide-react";
import { AccessManager } from "@/components/admin/access-manager";
import type { GeneratedFunnelAssets } from "@/types/generation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | FitPro Launch",
};

interface ProjectRow {
  id: string;
  user_id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface InputRow {
  project_id: string;
  inputs: Record<string, unknown>;
}

interface OutputRow {
  project_id: string;
  outputs: Partial<GeneratedFunnelAssets>;
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

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const service = createServiceClient();

  const [
    { data: projects },
    { data: inputs },
    { data: outputs },
    { data: { users: authUsers } },
    { data: userSettings },
  ] = await Promise.all([
    service.from("projects").select("*").order("created_at", { ascending: false }),
    service.from("project_inputs").select("project_id, inputs"),
    service.from("project_outputs").select("project_id, outputs"),
    service.auth.admin.listUsers({ perPage: 1000 }),
    service.from("user_settings").select("user_id, subscription_status"),
  ]);

  const allProjects = (projects ?? []) as ProjectRow[];
  const settingsMap = Object.fromEntries(
    ((userSettings ?? []) as { user_id: string; subscription_status: string }[])
      .map((s) => [s.user_id, s.subscription_status])
  );

  // Build user access list for AccessManager
  const userAccessList = (authUsers ?? []).map((u) => ({
    userId: u.id,
    email: u.email ?? "—",
    status: settingsMap[u.id] ?? "none",
  }));
  const inputMap    = Object.fromEntries((inputs ?? [] as InputRow[]).map((r: InputRow) => [r.project_id, r.inputs]));
  const outputMap   = Object.fromEntries((outputs ?? [] as OutputRow[]).map((r: OutputRow) => [r.project_id, r.outputs]));
  const userMap     = Object.fromEntries((authUsers ?? []).map((u) => [u.id, u.email ?? "—"]));

  const stats = {
    users:      (authUsers ?? []).length,
    projects:   allProjects.length,
    complete:   allProjects.filter((p) => p.status === "complete").length,
    errors:     allProjects.filter((p) => p.status === "error").length,
  };

  return (
    <div className="space-y-6">

      <div className="rounded-2xl bg-[#0f172a] px-6 py-6 sm:px-8">
        <h1 className="text-2xl font-bold text-white">Admin</h1>
        <p className="mt-1 text-sm text-slate-400">All users and projects across the platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users}         label="Total users"      value={stats.users}    color="bg-blue-100 text-blue-600" />
        <StatCard icon={FolderKanban}  label="Total projects"   value={stats.projects} color="bg-orange-100 text-orange-600" />
        <StatCard icon={CheckCircle2}  label="Complete"         value={stats.complete} color="bg-green-100 text-green-600" />
        <StatCard icon={AlertCircle}   label="Errors"           value={stats.errors}   color="bg-red-100 text-red-600" />
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          All projects
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Challenge</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">
                  <span className="flex items-center gap-1"><Pen className="h-3 w-3" />Copywriter style</span>
                </th>
                <th className="px-4 py-3">Framework</th>
                <th className="px-4 py-3">Voice</th>
                <th className="px-4 py-3 whitespace-nowrap">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allProjects.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">No projects yet</td>
                </tr>
              )}
              {allProjects.map((p) => {
                const inp = inputMap[p.id] ?? {};
                const out = outputMap[p.id] ?? {};
                const challengeName = typeof inp.challengeName === "string" ? inp.challengeName : "—";
                const style     = out.copywriterStyle       ?? "—";
                const framework = out.copywritingFramework  ?? "—";
                const voice     = out.copywriterVoice       ?? "—";
                const email     = userMap[p.user_id] ?? p.user_id.slice(0, 8) + "…";
                const date      = new Date(p.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric",
                });
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
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
                    <td className="px-4 py-3 text-gray-700 max-w-[140px] truncate" title={String(style)}>
                      {String(style)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-[140px] truncate" title={String(framework)}>
                      {String(framework)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-[140px] truncate" title={String(voice)}>
                      {String(voice)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap flex items-center gap-1.5">
                      <Clock className="h-3 w-3 shrink-0" />{date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Access Management */}
      <div>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Access management
        </h2>
        <p className="mb-3 text-sm text-gray-500">
          Grant or revoke manual access to any account. Users with admin access can use all features without a Stripe subscription.
        </p>
        <AccessManager users={userAccessList} />
      </div>

    </div>
  );
}
