"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WIZARD_STEPS } from "@/types/wizard";

type Step = (typeof WIZARD_STEPS)[number];

interface WizardProgressProps {
  currentStep: number;
  steps: readonly Step[];
}

export function WizardProgress({ currentStep, steps }: WizardProgressProps) {
  return (
    <div className="relative">
      {/* Progress bar background */}
      <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200" />
      {/* Active progress */}
      <div
        className="absolute left-0 top-4 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                  isComplete
                    ? "border-brand-600 bg-brand-600 text-white"
                    : isCurrent
                      ? "border-brand-600 bg-white text-brand-600"
                      : "border-gray-200 bg-white text-gray-400"
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "mt-2 hidden text-xs font-medium sm:block",
                  isCurrent ? "text-brand-700" : "text-gray-400"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
