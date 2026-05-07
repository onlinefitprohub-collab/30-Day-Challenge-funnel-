"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { businessBasicsSchema, type BusinessBasics, type WizardInputs } from "@/types/wizard";
import type { StepProps } from "./types";

const deliveryOptions = [
  { value: "online", label: "Online", description: "Fully remote coaching" },
  { value: "offline", label: "In-person", description: "Local / gym-based" },
  { value: "hybrid", label: "Hybrid", description: "Mix of online + in-person" },
] as const;

export function StepBusinessBasics({
  defaultValues,
  onNext,
  isFirstStep,
}: StepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BusinessBasics>({
    resolver: zodResolver(businessBasicsSchema),
    defaultValues: {
      businessName:        defaultValues.businessName        ?? "",
      coachName:           defaultValues.coachName           ?? "",
      location:            defaultValues.location            ?? "",
      deliveryMode:        defaultValues.deliveryMode,
      targetAudience:      defaultValues.targetAudience      ?? "",
      audienceDemographic: defaultValues.audienceDemographic ?? "",
      coachCredentials:    defaultValues.coachCredentials    ?? "",
      namedMethod:         defaultValues.namedMethod         ?? "",
    },
  });

  const deliveryMode = watch("deliveryMode");

  function onSubmit(data: BusinessBasics) {
    onNext(data as Partial<WizardInputs>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="businessName">Business name</Label>
          <Input
            id="businessName"
            placeholder="e.g. FitLife Coaching"
            {...register("businessName")}
          />
          {errors.businessName && (
            <p className="text-sm text-red-500">{errors.businessName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="coachName">Your name</Label>
          <Input
            id="coachName"
            placeholder="e.g. Sarah Jones"
            {...register("coachName")}
          />
          {errors.coachName && (
            <p className="text-sm text-red-500">{errors.coachName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g. London, UK or Online / Worldwide"
          {...register("location")}
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>How do you deliver your coaching?</Label>
        <div className="grid grid-cols-3 gap-3">
          {deliveryOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("deliveryMode", option.value)}
              className={`rounded-lg border-2 p-3 text-left transition-all ${
                deliveryMode === option.value
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  deliveryMode === option.value
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
        {errors.deliveryMode && (
          <p className="text-sm text-red-500">{errors.deliveryMode.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="targetAudience">
          Who do you typically work with?
        </Label>
        <Textarea
          id="targetAudience"
          placeholder="e.g. Busy mums aged 30-45 who want to lose weight without crash dieting and fit exercise around school runs"
          rows={3}
          {...register("targetAudience")}
        />
        <p className="text-xs text-gray-400">
          Be specific — the more detail, the better the copy
        </p>
        {errors.targetAudience && (
          <p className="text-sm text-red-500">{errors.targetAudience.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="audienceDemographic">
          Audience demographic breakdown <span className="text-gray-400">(optional)</span>
        </Label>
        <Input
          id="audienceDemographic"
          placeholder="e.g. Women 35–50, mums returning to fitness · Men 40–60, professional / executive · Mixed 30–45"
          {...register("audienceDemographic")}
        />
        <p className="text-xs text-gray-400">
          Age range, gender lean, and life stage — sharpens ad copy targeting and the "who this is for" framing.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="namedMethod">
          Does your method or system have a name? <span className="text-gray-400">(optional)</span>
        </Label>
        <Input
          id="namedMethod"
          placeholder="e.g. The 5-Phase Protocol · The Identity Shift Method · The LEAN System"
          {...register("namedMethod")}
        />
        <p className="text-xs text-gray-400">
          A named system makes your offer non-comparable. Leave blank and the AI will suggest one from your inputs.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coachCredentials">
          Your credentials &amp; authority signals <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="coachCredentials"
          placeholder={`e.g.\n• Level 3 Personal Trainer + Precision Nutrition L2 certified\n• Featured in Women's Health, The Sun, and BBC Radio\n• Creator of the 5-Phase Protocol — used by 300+ clients\n• Former NHS dietitian turned performance coach`}
          rows={4}
          {...register("coachCredentials")}
        />
        <p className="text-xs text-gray-400">
          Certifications, media appearances, named methods, notable results — the AI uses these for your authority section.
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="gradient" size="lg">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
