"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { trafficInputsSchema, type TrafficInputs, type WizardInputs } from "@/types/wizard";
import { cn } from "@/lib/utils";
import type { StepProps } from "./types";

const trafficOptions = [
  { value: "facebook"  as const, label: "Facebook Ads",          description: "Paid ads on Facebook" },
  { value: "instagram" as const, label: "Instagram",             description: "Reels, posts, stories" },
  { value: "google"    as const, label: "Google Ads",            description: "Search or display" },
  { value: "local"     as const, label: "Local / Word of mouth", description: "Referrals, flyers, events" },
  { value: "organic"   as const, label: "Organic content",       description: "Free posts, SEO, email" },
] as const;

const budgetOptions = [
  { value: "bootstrapped", label: "Bootstrapped",   description: "Organic & referrals only" },
  { value: "small",        label: "Small budget",   description: "Up to £/$ 500/month" },
  { value: "medium",       label: "Medium budget",  description: "£/$ 500–2,000/month" },
  { value: "scaling",      label: "Scaling",        description: "£/$ 2,000+/month" },
];

export function StepTrafficInputs({ defaultValues, onNext, onBack }: StepProps) {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TrafficInputs>({
    resolver: zodResolver(trafficInputsSchema),
    defaultValues: {
      trafficSources: defaultValues.trafficSources ?? [],
      adBudgetRange:  defaultValues.adBudgetRange ?? "",
    },
  });

  const selectedSources = watch("trafficSources");
  const adBudgetRange   = watch("adBudgetRange");

  function onSubmit(data: TrafficInputs) {
    onNext(data as Partial<WizardInputs>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Traffic sources */}
      <div className="space-y-2">
        <Label>Where will you drive traffic from?</Label>
        <p className="text-xs text-gray-400">Select all that apply — we'll tailor the ad copy to your platforms</p>
        <Controller
          name="trafficSources"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {trafficOptions.map((opt) => {
                const selected = field.value.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? field.value.filter((v) => v !== opt.value)
                        : [...field.value, opt.value];
                      field.onChange(next);
                    }}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-all",
                      selected
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
                        selected ? "border-orange-500 bg-orange-500" : "border-zinc-500"
                      )}
                    >
                      {selected && (
                        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={cn("text-sm font-semibold", selected ? "text-orange-400" : "text-zinc-100")}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-zinc-400">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.trafficSources && (
          <p className="text-sm text-red-500">{errors.trafficSources.message}</p>
        )}
      </div>

      {/* Ad budget range */}
      <div className="space-y-2">
        <Label>Approximate ad budget range <span className="text-gray-400">(optional)</span></Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {budgetOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("adBudgetRange", opt.value)}
              className={cn(
                "rounded-lg border-2 p-2.5 text-left transition-all",
                adBudgetRange === opt.value
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
              )}
            >
              <p className={cn("text-xs font-semibold", adBudgetRange === opt.value ? "text-orange-400" : "text-zinc-100")}>
                {opt.label}
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="submit" variant="gradient" size="lg">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
