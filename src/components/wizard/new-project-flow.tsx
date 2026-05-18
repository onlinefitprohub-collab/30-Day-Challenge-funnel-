"use client";

import { useState } from "react";
import { Trophy, ClipboardCheck, Check } from "lucide-react";
import { TemplatePicker } from "./template-picker";
import { WizardShell } from "./wizard-shell";
import type { WizardInputs } from "@/types/wizard";

type Stage = "funnel-type" | "template-pick" | "wizard";

interface Props {
  initialProjectId?: string;
  initialData?: Partial<WizardInputs>;
}

const FUNNEL_TYPES: {
  id: "challenge" | "application";
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bullets: string[];
  colour: string;
  activeBorder: string;
  activeBg: string;
  activeText: string;
  activeCheck: string;
}[] = [
  {
    id: "challenge",
    icon: Trophy,
    title: "30-Day Challenge Funnel",
    description: "Perfect for coaches running a structured challenge. Drive registrations and convert participants into long-term clients.",
    bullets: [
      "Short-form landing page + opt-in + booking",
      "10-email challenge lifecycle sequence",
      "7-SMS challenge sequence",
      "Ad copy + campaign naming",
      "52-week nurture sequence (on-demand)",
      "Workout plan generator (on-demand)",
    ],
    colour: "blue",
    activeBorder: "border-blue-500",
    activeBg: "bg-blue-50",
    activeText: "text-blue-700",
    activeCheck: "text-blue-500",
  },
  {
    id: "application",
    icon: ClipboardCheck,
    title: "High-Ticket Application Funnel",
    description: "For premium coaching programs and high-ticket offers. A long-form sales page qualifies leads before they apply.",
    bullets: [
      "Long-form sales letter landing page (GHL)",
      "Application form + thank you + strategy call booking",
      "10-email application lifecycle sequence",
      "7-SMS application sequence",
      "ManyChat DM flow (auto-generated)",
      "Ad copy + campaign naming",
    ],
    colour: "violet",
    activeBorder: "border-violet-500",
    activeBg: "bg-violet-50",
    activeText: "text-violet-700",
    activeCheck: "text-violet-500",
  },
];

export function NewProjectFlow({ initialProjectId, initialData }: Props) {
  const [stage, setStage] = useState<Stage>(
    initialProjectId ? "wizard" : "funnel-type"
  );
  const [selectedType, setSelectedType] = useState<"challenge" | "application" | null>(null);
  const [prefill, setPrefill] = useState<Partial<WizardInputs>>(
    initialData ?? { duration: 30, trafficSources: [], hasBeforeAfter: false }
  );

  // ── Stage 1: Funnel type selection ──────────────────────────────────────────
  if (stage === "funnel-type") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">What are you building?</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Choose the funnel type that matches your offer.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {FUNNEL_TYPES.map((ft) => {
            const isSelected = selectedType === ft.id;
            const Icon = ft.icon;
            return (
              <button
                key={ft.id}
                onClick={() => setSelectedType(ft.id)}
                className={`relative flex flex-col rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md ${
                  isSelected
                    ? `${ft.activeBorder} ${ft.activeBg}`
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {isSelected && (
                  <div className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full ${ft.activeBorder} border-2 ${ft.activeBg}`}>
                    <Check className={`h-3 w-3 ${ft.activeCheck}`} />
                  </div>
                )}
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${
                  isSelected ? `bg-white border ${ft.activeBorder}` : "bg-gray-100"
                }`}>
                  <Icon className={`h-5 w-5 ${isSelected ? ft.activeText : "text-gray-500"}`} />
                </div>
                <p className="font-bold text-gray-900 text-sm mb-1">{ft.title}</p>
                <p className={`text-xs leading-relaxed mb-3 ${isSelected ? ft.activeText : "text-gray-500"}`}>
                  {ft.description}
                </p>
                <ul className="space-y-1">
                  {ft.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-1.5 text-[11px] text-gray-500">
                      <Check className={`h-3 w-3 mt-0.5 shrink-0 ${isSelected ? ft.activeCheck : "text-gray-300"}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400">Click a card to select and continue.</p>

        {selectedType && (
          <div className="flex justify-center">
            <button
              onClick={() => {
                setPrefill((prev) => ({ ...prev, funnelType: selectedType }));
                setStage("template-pick");
              }}
              className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-sm"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Stage 2: Template selection (filtered to funnel type) ───────────────────
  if (stage === "template-pick" && selectedType) {
    return (
      <TemplatePicker
        funnelType={selectedType}
        onSelect={(templateData) => {
          // Template data already has funnelType set; merge with our base prefill
          setPrefill({ ...prefill, ...templateData });
          setStage("wizard");
        }}
        onSkip={() => setStage("wizard")}
        onBack={() => setStage("funnel-type")}
      />
    );
  }

  // ── Stage 3: Wizard (starts at step 2 — Business Basics — since type is set) ─
  return (
    <WizardShell
      initialProjectId={initialProjectId}
      initialData={prefill}
      initialStepIndex={initialProjectId ? 0 : 1}
    />
  );
}
