"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { MonthSelector } from "./month-selector";
import { MonthlyPlanPlaceholder, MonthlyPlanSection } from "./monthly-plan-section";
import type { MonthlyContentPlan } from "@/types/monthly-content";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function monthLabel(yyyyMM: string): string {
  const [yearStr, monthStr] = yyyyMM.split("-");
  return `${MONTH_NAMES[parseInt(monthStr, 10) - 1]} ${yearStr}`;
}

interface Project {
  id: string;
  name: string;
}

interface ContentEnginePageProps {
  projects: Project[];
  existingPlans: Record<string, MonthlyContentPlan>; // month -> plan
}

export function ContentEnginePage({ projects, existingPlans }: ContentEnginePageProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [activeMonth, setActiveMonth]   = useState(currentMonth);
  const [selectedProject, setSelectedProject] = useState<string>(projects[0]?.id ?? "");
  const [plans, setPlans]               = useState<Record<string, MonthlyContentPlan>>(existingPlans);

  const generatedMonths = new Set(Object.keys(plans));
  const activePlan      = plans[activeMonth];

  function handlePlanGenerated(plan: MonthlyContentPlan) {
    setPlans((prev) => ({ ...prev, [activeMonth]: plan }));
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <CalendarDays className="h-7 w-7 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">No projects yet</h3>
        <p className="max-w-sm text-sm text-gray-500">
          Build your first funnel project first — the Content Engine uses your project's niche and audience to personalise the content.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Project selector */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm font-medium text-gray-700 shrink-0">Based on project:</p>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400">
            The niche, audience and offer from this project shapes your content
          </p>
        </div>
      </div>

      {/* Month selector */}
      <MonthSelector
        activeMonth={activeMonth}
        generatedMonths={generatedMonths}
        onChange={setActiveMonth}
      />

      {/* Active month plan */}
      {activePlan ? (
        <MonthlyPlanSection
          plan={activePlan}
          month={activeMonth}
          projectId={selectedProject}
          onRegenerate={handlePlanGenerated}
        />
      ) : (
        <MonthlyPlanPlaceholder
          month={activeMonth}
          monthLabel={monthLabel(activeMonth)}
          projectId={selectedProject}
          onGenerated={handlePlanGenerated}
        />
      )}

    </div>
  );
}
