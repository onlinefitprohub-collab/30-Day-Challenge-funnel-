import { createClient } from "@/lib/supabase/server";
import { ProjectControls } from "@/components/dashboard/project-controls";
import { EmptyState } from "@/components/dashboard/empty-state";
import { CheckoutRedirect } from "@/components/dashboard/checkout-redirect";
import { FolderKanban, CheckCircle2, Clock, Zap, Target } from "lucide-react";
import type { ProjectRow } from "@/types/project";

export const metadata = {
  title: "Dashboard | FitPro Launch",
};

function deriveSubtitle(inputs: Record<string, unknown>): string {
  const challenge = typeof inputs.challengeName === "string" ? inputs.challengeName.trim() : "";
  const audience  = typeof inputs.targetAudience === "string" ? inputs.targetAudience.trim() : "";
  if (challenge) return challenge;
  if (audience) {
    const firstClause = audience.split(/[,;]/)[0].trim();
    return firstClause.length > 60 ? firstClause.slice(0, 58) + "…" : firstClause;
  }
  const duration   = typeof inputs.duration === "number" ? inputs.duration : 30;
  const funnelType = typeof inputs.funnelType === "string" ? inputs.funnelType : "challenge";
  return funnelType === "application" ? "Application Funnel" : `${duration}-Day Challenge`;
}

function StatPill({
  icon: Icon,
  label,
  value,
  colour,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  colour: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 ${colour}`}>
      <Icon className="h-4 w-4 shrink-0" />
      <div>
        <p className="text-lg font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-[11px] opacity-70">{label}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  const typedProjects = (projects ?? []) as ProjectRow[];
  const hasProjects   = typedProjects.length > 0;

  const subtitleMap: Record<string, string> = {};
  let challengeCount = 0;
  let applicationCount = 0;

  if (hasProjects) {
    const projectIds = typedProjects.map((p) => p.id);
    const { data: inputs } = await supabase
      .from("project_inputs")
      .select("project_id, inputs")
      .in("project_id", projectIds);

    for (const row of inputs ?? []) {
      subtitleMap[row.project_id] = deriveSubtitle(
        (row.inputs ?? {}) as Record<string, unknown>
      );
    }

    // Count funnel types from outputs
    const { data: outputs } = await supabase
      .from("project_outputs")
      .select("project_id, outputs")
      .in("project_id", projectIds);

    for (const row of outputs ?? []) {
      const funnelType = (row.outputs as Record<string, unknown>)?.funnelType;
      if (funnelType === "application") applicationCount++;
      else challengeCount++;
    }
  }

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Coach";

  const completeCount    = typedProjects.filter((p) => p.status === "complete").length;
  const inProgressCount  = typedProjects.filter((p) => p.status === "draft" || p.status === "error").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Auto-triggers Stripe checkout when redirected from email verification with ?checkout=1 */}
      <CheckoutRedirect />

      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-zinc-100">
          {hasProjects ? `Welcome back, ${displayName}` : `Hey ${displayName} 👋`}
        </h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          {hasProjects
            ? `${typedProjects.length} funnel${typedProjects.length === 1 ? "" : "s"} · ${completeCount} complete`
            : "Create your first funnel to get started."}
        </p>
      </div>

      {/* Stats row — only when there are projects */}
      {hasProjects && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <StatPill
            icon={FolderKanban}
            label="Total"
            value={typedProjects.length}
            colour="border-white/[0.07] bg-white/[0.04] text-zinc-200"
          />
          <StatPill
            icon={CheckCircle2}
            label="Complete"
            value={completeCount}
            colour="border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          />
          <StatPill
            icon={Zap}
            label="Challenge"
            value={challengeCount}
            colour="border-blue-500/20 bg-blue-500/10 text-blue-300"
          />
          <StatPill
            icon={Target}
            label="Application"
            value={applicationCount}
            colour="border-violet-500/20 bg-violet-500/10 text-violet-300"
          />
        </div>
      )}

      {/* Projects */}
      {!hasProjects ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            Your funnels
          </p>
          <ProjectControls projects={typedProjects} subtitles={subtitleMap} />
        </div>
      )}
    </div>
  );
}
