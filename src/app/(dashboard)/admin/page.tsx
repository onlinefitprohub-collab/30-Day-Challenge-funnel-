import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { Users, FolderKanban, CheckCircle2, AlertCircle } from "lucide-react";
import type { GeneratedFunnelAssets } from "@/types/generation";
import { AdminProjectsTable } from "@/components/admin/admin-projects-table";
import { AdminCreateFolder } from "@/components/admin/admin-create-folder";

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

interface FolderRow {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
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
    foldersResult,
  ] = await Promise.all([
    service.from("projects").select("*").order("created_at", { ascending: false }),
    service.from("project_inputs").select("project_id, inputs"),
    service.from("project_outputs").select("project_id, outputs"),
    service.auth.admin.listUsers({ perPage: 1000 }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).from("project_folders").select("*").order("created_at", { ascending: false }),
  ]);

  const allProjects = (projects ?? []) as ProjectRow[];
  const inputMap    = Object.fromEntries(
    (inputs ?? [] as InputRow[]).map((r: InputRow) => [r.project_id, r.inputs])
  );
  const outputMap   = Object.fromEntries(
    (outputs ?? [] as OutputRow[]).map((r: OutputRow) => [r.project_id, r.outputs as Record<string, unknown>])
  );
  const userMap     = Object.fromEntries(
    (authUsers ?? []).map((u) => [u.id, u.email ?? "—"])
  );
  const allFolders  = (foldersResult.data ?? []) as FolderRow[];

  const userList = (authUsers ?? [])
    .map((u) => ({ id: u.id, email: u.email ?? "—" }))
    .sort((a, b) => a.email.localeCompare(b.email));

  const stats = {
    users:    (authUsers ?? []).length,
    projects: allProjects.length,
    complete: allProjects.filter((p) => p.status === "complete").length,
    errors:   allProjects.filter((p) => p.status === "error").length,
  };

  return (
    <div className="space-y-6">

      <div className="rounded-2xl bg-[#0f172a] px-6 py-6 sm:px-8">
        <h1 className="text-2xl font-bold text-white">Admin</h1>
        <p className="mt-1 text-sm text-slate-400">All users and projects across the platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users}        label="Total users"    value={stats.users}    color="bg-blue-100 text-blue-600" />
        <StatCard icon={FolderKanban} label="Total projects" value={stats.projects} color="bg-orange-100 text-orange-600" />
        <StatCard icon={CheckCircle2} label="Complete"       value={stats.complete} color="bg-green-100 text-green-600" />
        <StatCard icon={AlertCircle}  label="Errors"         value={stats.errors}   color="bg-red-100 text-red-600" />
      </div>

      <AdminCreateFolder users={userList} existingFolders={allFolders} />

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Projects by user
        </h2>
        <AdminProjectsTable
          projects={allProjects}
          inputMap={inputMap}
          outputMap={outputMap}
          userMap={userMap}
        />
      </div>

    </div>
  );
}
