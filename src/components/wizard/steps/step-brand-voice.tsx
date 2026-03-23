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

const colourSchemes = [
  {
    value: "navy-orange",
    label: "Navy & Orange",
    description: "Bold, energetic, sporty",
    preview: ["#0f172a", "#f97316"],
  },
  {
    value: "rose-pink",
    label: "Rose & Pink",
    description: "Warm, empowering, feminine",
    preview: ["#1a0010", "#ec4899"],
  },
  {
    value: "teal-forest",
    label: "Teal & Forest",
    description: "Fresh, calming, wellness",
    preview: ["#0a1f1e", "#14b8a6"],
  },
  {
    value: "purple-lilac",
    label: "Purple & Lilac",
    description: "Premium, aspirational, modern",
    preview: ["#1a0a2e", "#a855f7"],
  },
  {
    value: "sky-blue",
    label: "Sky & Blue",
    description: "Professional, calm, trustworthy",
    preview: ["#0f1b2d", "#38bdf8"],
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
      colourScheme: (defaultValues.colourScheme as BrandVoice["colourScheme"]) ?? "navy-orange",
      phrasesToInclude: defaultValues.phrasesToInclude ?? "",
      phrasesToAvoid: defaultValues.phrasesToAvoid ?? "",
    },
  });

  const toneOfVoice = watch("toneOfVoice");
  const colourScheme = watch("colourScheme");

  function onSubmit(data: BrandVoice) {
    onNext(data as Partial<WizardInputs>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Tone */}
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
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className={`text-sm font-semibold ${toneOfVoice === option.value ? "text-orange-700" : "text-gray-700"}`}>
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

      {/* Colour scheme */}
      <div className="space-y-2">
        <Label>Funnel colour scheme</Label>
        <p className="text-xs text-gray-400">This colours your funnel pages, ads, and preview. You can always change it later.</p>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {colourSchemes.map((scheme) => (
            <button
              key={scheme.value}
              type="button"
              onClick={() => setValue("colourScheme", scheme.value)}
              className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                colourScheme === scheme.value
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex shrink-0 gap-1">
                <div className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: scheme.preview[0] }} />
                <div className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: scheme.preview[1] }} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${colourScheme === scheme.value ? "text-orange-700" : "text-gray-700"}`}>
                  {scheme.label}
                </p>
                <p className="text-xs text-gray-400">{scheme.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Optional phrases */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="phrasesToInclude">
            Words/phrases you love to use <span className="text-gray-400">(optional)</span>
          </Label>
          <Textarea
            id="phrasesToInclude"
            placeholder="e.g. 'sustainable results', 'real life', 'without restriction'"
            rows={2}
            {...register("phrasesToInclude")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phrasesToAvoid">
            Words/phrases to avoid <span className="text-gray-400">(optional)</span>
          </Label>
          <Textarea
            id="phrasesToAvoid"
            placeholder="e.g. 'shred', 'burn fat fast', 'beast mode'"
            rows={2}
            {...register("phrasesToAvoid")}
          />
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
