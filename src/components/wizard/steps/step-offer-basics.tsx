"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { offerBasicsSchema, type OfferBasics, type WizardInputs } from "@/types/wizard";
import type { StepProps } from "./types";

const ctaOptions = [
  {
    value: "booking",
    label: "Book a call",
    description: "Lead books a strategy / sales call",
  },
  {
    value: "signup",
    label: "Direct sign-up",
    description: "Lead registers or purchases directly",
  },
] as const;

export function StepOfferBasics({
  defaultValues,
  onNext,
  onBack,
}: StepProps) {
  const isApplication = defaultValues.funnelType === "application";
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OfferBasics>({
    resolver: zodResolver(offerBasicsSchema),
    defaultValues: {
      challengeName: defaultValues.challengeName ?? "",
      challengeType: defaultValues.challengeType ?? "",
      mainGoal: defaultValues.mainGoal ?? "",
      duration: defaultValues.duration ?? 30,
      price: defaultValues.price ?? "",
      ctaType: defaultValues.ctaType,
      inclusions: defaultValues.inclusions ?? "",
      bonuses: defaultValues.bonuses ?? "",
    },
  });

  const ctaType = watch("ctaType");

  function onSubmit(data: OfferBasics) {
    onNext(data as Partial<WizardInputs>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="challengeName">{isApplication ? "Program name" : "Challenge name"}</Label>
        <Input
          id="challengeName"
          placeholder={isApplication
            ? "e.g. Elite Coaching Program, 12-Week Body Transformation, VIP Mentorship"
            : "e.g. 30-Day Fat Loss Kickstart, 6-Week Body Reset, Summer Shred Challenge"}
          {...register("challengeName")}
        />
        <p className="text-xs text-gray-400">This becomes the title of your funnel — make it specific and benefit-led.</p>
        {errors.challengeName && (
          <p className="text-sm text-red-500">{errors.challengeName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="mainGoal">What&apos;s the main result your clients get?</Label>
        <Textarea
          id="mainGoal"
          placeholder={isApplication
            ? "e.g. Help high-achieving professionals build a lean, strong physique and sustain it long-term without crash diets or extreme training"
            : "e.g. Help women lose 10-15lbs and build a consistent workout habit without giving up carbs or spending hours in the gym"}
          rows={3}
          {...register("mainGoal")}
        />
        {errors.mainGoal && (
          <p className="text-sm text-red-500">{errors.mainGoal.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="duration">{isApplication ? "Program duration (days)" : "Duration (days)"}</Label>
          <Input
            id="duration"
            type="number"
            min={7}
            max={90}
            {...register("duration", { valueAsNumber: true })}
          />
          {errors.duration && (
            <p className="text-sm text-red-500">{errors.duration.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="price">Price / offer type</Label>
          <Input
            id="price"
            placeholder="e.g. Free, £47, $97/month, Free trial"
            {...register("price")}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>What&apos;s your main CTA?</Label>
        <div className="grid grid-cols-2 gap-3">
          {ctaOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("ctaType", option.value)}
              className={`rounded-lg border-2 p-3 text-left transition-all ${
                ctaType === option.value
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  ctaType === option.value ? "text-brand-700" : "text-gray-700"
                }`}
              >
                {option.label}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">{option.description}</p>
            </button>
          ))}
        </div>
        {errors.ctaType && (
          <p className="text-sm text-red-500">{errors.ctaType.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="inclusions">{isApplication ? "What's included in the program?" : "What's included in the challenge?"}</Label>
        <Textarea
          id="inclusions"
          placeholder={isApplication
            ? "e.g. Weekly 1:1 coaching calls, custom training plan, nutrition coaching, Slack access, monthly reviews"
            : "e.g. Daily workout videos, nutrition guide, private Facebook group, weekly live Q&A, recipe book"}
          rows={3}
          {...register("inclusions")}
        />
        {errors.inclusions && (
          <p className="text-sm text-red-500">{errors.inclusions.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bonuses">
          Any bonuses? <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="bonuses"
          placeholder={isApplication
            ? "e.g. Body composition scan (worth £120), done-for-you nutrition templates, lifetime alumni community access"
            : "e.g. Free 1:1 kickstart call (worth £150), done-for-you meal plan, accountability partner matching"}
          rows={2}
          {...register("bonuses")}
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
