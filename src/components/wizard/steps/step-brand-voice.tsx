"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { brandVoiceSchema, type BrandVoice, type WizardInputs } from "@/types/wizard";
import type { StepProps } from "./types";

const toneOptions = [
  {
    value: "friendly",
    label: "Friendly & Warm",
    description: "Supportive, approachable, like a knowledgeable mate",
  },
  {
    value: "bold",
    label: "Bold & Direct",
    description: "Confident, punchy, no-fluff communication",
  },
  {
    value: "motivational",
    label: "Motivational",
    description: "High-energy, inspiring, pushes people to take action",
  },
  {
    value: "premium",
    label: "Premium",
    description: "Elevated, sophisticated, positions you as high-value",
  },
  {
    value: "simple",
    label: "Simple & Clear",
    description: "No jargon, easy to understand, straight to the point",
  },
] as const;

export function StepBrandVoice({ defaultValues, onNext, onBack }: StepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BrandVoice>({
    resolver: zodResolver(brandVoiceSchema),
    defaultValues: {
      toneOfVoice: defaultValues.toneOfVoice,
      phrasesToInclude: defaultValues.phrasesToInclude ?? "",
      phrasesToAvoid: defaultValues.phrasesToAvoid ?? "",
    },
  });

  const toneOfVoice = watch("toneOfVoice");

  function onSubmit(data: BrandVoice) {
    onNext(data as Partial<WizardInputs>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label>What tone best represents your brand?</Label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {toneOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("toneOfVoice", option.value)}
              className={`rounded-lg border-2 p-3 text-left transition-all ${
                toneOfVoice === option.value
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  toneOfVoice === option.value
                    ? "text-brand-700"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">{option.description}</p>
            </button>
          ))}
        </div>
        {errors.toneOfVoice && (
          <p className="text-sm text-red-500">{errors.toneOfVoice.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phrasesToInclude">
          Phrases or words you love to use{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="phrasesToInclude"
          placeholder="e.g. 'sustainable results', 'no quick fixes', 'real life', 'without restriction'"
          rows={2}
          {...register("phrasesToInclude")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phrasesToAvoid">
          Phrases or words to avoid{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="phrasesToAvoid"
          placeholder="e.g. 'shred', 'burn fat fast', 'transformation', 'beast mode'"
          rows={2}
          {...register("phrasesToAvoid")}
        />
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
