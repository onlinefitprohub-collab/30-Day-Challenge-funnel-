"use client";

import { FUNNEL_TEMPLATES, type FunnelTemplate } from "@/lib/templates/funnel-templates";
import type { WizardInputs } from "@/types/wizard";

const COLOUR_MAP: Record<string, { border: string; bg: string; badge: string; text: string; emoji: string }> = {
  rose:   { border: "border-rose-200",   bg: "bg-rose-50",   badge: "bg-rose-100 text-rose-700",   text: "text-rose-700",   emoji: "bg-rose-100" },
  blue:   { border: "border-blue-200",   bg: "bg-blue-50",   badge: "bg-blue-100 text-blue-700",   text: "text-blue-700",   emoji: "bg-blue-100" },
  teal:   { border: "border-teal-200",   bg: "bg-teal-50",   badge: "bg-teal-100 text-teal-700",   text: "text-teal-700",   emoji: "bg-teal-100" },
  violet: { border: "border-violet-200", bg: "bg-violet-50", badge: "bg-violet-100 text-violet-700",text: "text-violet-700", emoji: "bg-violet-100" },
  purple: { border: "border-purple-200", bg: "bg-purple-50", badge: "bg-purple-100 text-purple-700",text: "text-purple-700", emoji: "bg-purple-100" },
};

interface Props {
  onSelect: (prefill: Partial<WizardInputs>) => void;
  onSkip: () => void;
}

function TemplateCard({ tpl, onSelect }: { tpl: FunnelTemplate; onSelect: () => void }) {
  const c = COLOUR_MAP[tpl.colour] ?? COLOUR_MAP.blue;
  return (
    <button
      onClick={onSelect}
      className={`group relative flex flex-col rounded-2xl border-2 ${c.border} ${c.bg} p-5 text-left transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${c.emoji}`}>
          {tpl.emoji}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${c.badge}`}>
          {tpl.funnelType === "application" ? "Application" : "Challenge"}
        </span>
      </div>
      <p className={`font-bold text-gray-900 text-sm mb-1`}>{tpl.label}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{tpl.tagline}</p>
      <div className={`mt-4 text-[11px] font-semibold ${c.text} flex items-center gap-1`}>
        Use this template →
      </div>
    </button>
  );
}

export function TemplatePicker({ onSelect, onSkip }: Props) {
  const challengeTemplates = FUNNEL_TEMPLATES.filter((t) => t.funnelType === "challenge");
  const applicationTemplates = FUNNEL_TEMPLATES.filter((t) => t.funnelType === "application");

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Start from a template</h1>
        <p className="mt-2 text-gray-500 text-sm">
          Pick a template to pre-fill your wizard — you can edit every detail before generating.
        </p>
      </div>

      {/* Challenge funnels */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Challenge funnels</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {challengeTemplates.map((tpl) => (
            <TemplateCard key={tpl.id} tpl={tpl} onSelect={() => onSelect(tpl.prefill)} />
          ))}
        </div>
      </div>

      {/* Application funnels */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Application (high-ticket) funnels</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {applicationTemplates.map((tpl) => (
            <TemplateCard key={tpl.id} tpl={tpl} onSelect={() => onSelect(tpl.prefill)} />
          ))}
        </div>
      </div>

      {/* Start from scratch */}
      <div className="flex justify-center pb-4">
        <button
          onClick={onSkip}
          className="text-sm text-gray-400 hover:text-gray-700 underline underline-offset-4 transition-colors"
        >
          Start from scratch instead
        </button>
      </div>
    </div>
  );
}
