"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { coachStorySchema, type CoachStoryInputs, type WizardInputs } from "@/types/wizard";
import type { StepProps } from "./types";

export function StepCoachStory({ defaultValues, onNext, onBack }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoachStoryInputs>({
    resolver: zodResolver(coachStorySchema),
    defaultValues: {
      coachBeforeState:    defaultValues.coachBeforeState    ?? "",
      coachTurningPoint:   defaultValues.coachTurningPoint   ?? "",
      coachPersonalResult: defaultValues.coachPersonalResult ?? "",
      coachWhyCoach:       defaultValues.coachWhyCoach       ?? "",
    },
  });

  function onSubmit(data: CoachStoryInputs) {
    onNext(data as Partial<WizardInputs>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <p className="text-sm text-brand-800">
            Answer these 4 questions in your own words — the AI will turn your answers into a compelling first-person coach bio that goes directly onto your registration page.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coachBeforeState">
          Where were you before you discovered your approach?{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="coachBeforeState"
          placeholder="e.g. I was a busy NHS nurse, working 12-hour shifts and completely neglecting my own health. I'd tried every diet going — WeightWatchers, keto, intermittent fasting — and lost and regained the same 2 stone three times. I was exhausted, frustrated, and starting to believe I just didn't have the willpower other people seemed to have."
          rows={4}
          {...register("coachBeforeState")}
        />
        <p className="text-xs text-gray-400">
          Be honest and specific. Your audience will see themselves in your struggle.
        </p>
        {errors.coachBeforeState && (
          <p className="text-sm text-red-500">{errors.coachBeforeState.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coachTurningPoint">
          What was the moment everything changed?{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="coachTurningPoint"
          placeholder="e.g. I had a health scare — my blood pressure was dangerously high at 34 years old. My doctor told me if I didn't make a change I'd be on medication for life. That was the wake-up call. I stopped looking for shortcuts and started studying the actual science of fat loss, hormones, and sustainable habit change."
          rows={4}
          {...register("coachTurningPoint")}
        />
        <p className="text-xs text-gray-400">
          The turning point humanises you and makes your expertise feel earned, not just learned.
        </p>
        {errors.coachTurningPoint && (
          <p className="text-sm text-red-500">{errors.coachTurningPoint.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coachPersonalResult">
          What specific result did YOU achieve using your method?{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="coachPersonalResult"
          placeholder="e.g. In 14 weeks I lost 22kg — without cutting out any food group, without spending hours in the gym, and without ever feeling deprived. My blood pressure normalised, I came off all medication, and for the first time in my adult life I actually felt like myself again."
          rows={3}
          {...register("coachPersonalResult")}
        />
        <p className="text-xs text-gray-400">
          Numbers make this real. Be as specific as you can.
        </p>
        {errors.coachPersonalResult && (
          <p className="text-sm text-red-500">{errors.coachPersonalResult.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coachWhyCoach">
          Why do you do this work? What drives you to help people like your ideal client?{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="coachWhyCoach"
          placeholder="e.g. Because I know exactly what it feels like to be the person who's tried everything and still feels stuck. I know the shame, the self-blame, the secret hope that this time will be different. I built this programme so nobody else has to spend a decade figuring out what took me years to learn. That's why I only work with a small number of clients at a time — so I can give every person the attention I wish I'd had."
          rows={4}
          {...register("coachWhyCoach")}
        />
        <p className="text-xs text-gray-400">
          Your mission turns a sales page into something people actually want to read.
        </p>
        {errors.coachWhyCoach && (
          <p className="text-sm text-red-500">{errors.coachWhyCoach.message}</p>
        )}
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
