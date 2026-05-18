"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
interface WizardStep {
  id: number;
  title: string;
  description: string;
}

interface WizardProgressProps {
  currentStep: number;
  steps: readonly WizardStep[];
  onStepClick?: (step: number) => void;
}

export function WizardProgress({ currentStep, steps, onStepClick }: WizardProgressProps) {
  const progressPct = steps.length > 1
    ? (currentStep / (steps.length - 1)) * 100
    : 0;

  return (
    <div>
      {/* Mobile: simple bar + label */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-300 truncate mr-2">{steps[currentStep]?.title}</span>
          <span className="text-zinc-500">{currentStep + 1} / {steps.length}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: step dots */}
      <div className="relative hidden sm:block">
        {/* Track line */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-white/[0.08]" />
        <div
          className="absolute left-0 top-4 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />

        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isComplete = index < currentStep;
            const isCurrent  = index === currentStep;
            const isClickable = isComplete && !!onStepClick;

            const dotClasses = cn(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
              isComplete ? "border-orange-500 bg-orange-500 text-white"
              : isCurrent  ? "border-orange-500 bg-[#18181b] text-orange-400 shadow-sm"
              :              "border-white/[0.12] bg-[#18181b] text-zinc-600",
              isClickable && "cursor-pointer hover:ring-2 hover:ring-orange-500/30 hover:ring-offset-1 hover:ring-offset-[#09090b]"
            );

            return (
              <div key={step.id} className="flex flex-col items-center">
                {isClickable ? (
                  <button
                    type="button"
                    onClick={() => onStepClick(index)}
                    title={`Back to step ${index + 1}: ${step.title}`}
                    className={dotClasses}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div className={dotClasses}>
                    {isComplete ? <Check className="h-3.5 w-3.5" /> : step.id}
                  </div>
                )}
                <span
                  className={cn(
                    "mt-2 max-w-[72px] text-center text-xs font-medium leading-tight",
                    isCurrent  ? "text-orange-400"
                    : isComplete ? "text-zinc-500"
                    :              "text-zinc-600"
                  )}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
