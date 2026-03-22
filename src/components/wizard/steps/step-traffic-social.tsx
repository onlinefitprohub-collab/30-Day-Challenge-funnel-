"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trafficSocialSchema, type TrafficSocial, type WizardInputs } from "@/types/wizard";
import type { StepProps } from "./types";
import { cn } from "@/lib/utils";

const trafficOptions = [
  { value: "facebook" as const, label: "Facebook Ads" },
  { value: "instagram" as const, label: "Instagram" },
  { value: "google" as const, label: "Google Ads" },
  { value: "local" as const, label: "Local / Word of mouth" },
  { value: "organic" as const, label: "Organic / Content" },
];

export function StepTrafficSocial({
  defaultValues,
  onNext,
  onBack,
  isLastStep,
  isSubmitting,
}: StepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TrafficSocial>({
    resolver: zodResolver(trafficSocialSchema),
    defaultValues: {
      trafficSources: defaultValues.trafficSources ?? [],
      utmNamingPreference: defaultValues.utmNamingPreference ?? "",
      testimonials: defaultValues.testimonials ?? "",
      caseStudySnippets: defaultValues.caseStudySnippets ?? "",
    },
  });

  function onSubmit(data: TrafficSocial) {
    onNext(data as Partial<WizardInputs>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label>Where will you drive traffic from?</Label>
        <p className="text-xs text-gray-400">Select all that apply</p>
        <Controller
          name="trafficSources"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {trafficOptions.map((option) => {
                const isSelected = field.value.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      const current = field.value;
                      if (isSelected) {
                        field.onChange(current.filter((v) => v !== option.value));
                      } else {
                        field.onChange([...current, option.value]);
                      }
                    }}
                    className={cn(
                      "rounded-full border-2 px-4 py-1.5 text-sm font-medium transition-all",
                      isSelected
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    {option.label}
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

      <div className="space-y-1.5">
        <Label htmlFor="utmNamingPreference">
          UTM / campaign naming preference{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Input
          id="utmNamingPreference"
          placeholder="e.g. fitlife_30daychallenge_jan2025 or leave blank for auto-generated"
          {...register("utmNamingPreference")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="testimonials">
          Do you have any testimonials or results to include?{" "}
          <span className="text-gray-400">(optional but powerful)</span>
        </Label>
        <Textarea
          id="testimonials"
          placeholder={`e.g. "Lost 12lbs in the first month and finally have energy again" — Emma T.\n"Down 2 dress sizes and my coach kept me accountable" — Maria P.`}
          rows={3}
          {...register("testimonials")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="caseStudySnippets">
          Any case study snippets or client wins?{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="caseStudySnippets"
          placeholder="e.g. Claire, 42, a nurse and mum of 3, lost 18lbs over 8 weeks while working night shifts..."
          rows={2}
          {...register("caseStudySnippets")}
        />
      </div>

      {/* Generation preview */}
      <div className="rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 to-accent-50 p-5">
        <div className="flex items-start gap-3">
          <Zap className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <div>
            <p className="font-semibold text-brand-900">Ready to generate your funnel</p>
            <p className="mt-1 text-sm text-brand-700">
              Once you click Generate, we&apos;ll build your complete challenge funnel —
              10 sections of tailored copy, sequences, and ad creative — in about 30 seconds.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating your funnel...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Generate my funnel
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
