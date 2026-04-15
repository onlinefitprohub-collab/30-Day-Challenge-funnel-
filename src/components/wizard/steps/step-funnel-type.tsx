"use client";

import { Trophy, ClipboardCheck, Check } from "lucide-react";
import type { WizardInputs } from "@/types/wizard";

interface Props {
  defaultValues: Partial<WizardInputs>;
  onNext: (data: Partial<WizardInputs>) => void;
  onBack: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  isSubmitting: boolean;
}

const FUNNEL_TYPES = [
  {
    id: "challenge" as const,
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
    accent: "brand",
  },
  {
    id: "application" as const,
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
    accent: "violet",
  },
] as const;

export function StepFunnelType({ defaultValues, onNext }: Props) {
  const selected = defaultValues.funnelType;

  function handleSelect(type: "challenge" | "application") {
    onNext({ funnelType: type });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Choose the funnel type that matches your offer. This determines which pages, sequences, and tools are generated for you.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {FUNNEL_TYPES.map((ft) => {
          const Icon = ft.icon;
          const isSelected = selected === ft.id;
          const isChallenge = ft.id === "challenge";
          const activeClass = isChallenge
            ? "border-brand-500 ring-2 ring-brand-200 bg-brand-50"
            : "border-violet-500 ring-2 ring-violet-200 bg-violet-50";
          const iconBg = isChallenge ? "bg-brand-100" : "bg-violet-100";
          const iconColor = isChallenge ? "text-brand-600" : "text-violet-600";
          const badgeColor = isChallenge
            ? "bg-brand-600 text-white"
            : "bg-violet-600 text-white";
          const bulletColor = isChallenge ? "text-brand-500" : "text-violet-500";

          return (
            <button
              key={ft.id}
              type="button"
              onClick={() => handleSelect(ft.id)}
              className={`relative flex flex-col gap-3 rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
                isSelected ? activeClass : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Selected badge */}
              {isSelected && (
                <span className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full ${badgeColor}`}>
                  <Check className="h-3 w-3" />
                </span>
              )}

              {/* Icon */}
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>

              {/* Title + description */}
              <div>
                <p className="font-semibold text-gray-900">{ft.title}</p>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">{ft.description}</p>
              </div>

              {/* Bullet list */}
              <ul className="space-y-1">
                {ft.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className={`mt-0.5 shrink-0 ${bulletColor}`}>✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs text-gray-400">Click a card to select and continue.</p>
    </div>
  );
}
