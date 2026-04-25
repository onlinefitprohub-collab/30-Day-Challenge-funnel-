"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { audiencePainSchema, type AudiencePain, type WizardInputs } from "@/types/wizard";
import type { StepProps } from "./types";

export function StepAudiencePain({ defaultValues, onNext, onBack }: StepProps) {
  const isApplication = defaultValues.funnelType === "application";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AudiencePain>({
    resolver: zodResolver(audiencePainSchema),
    defaultValues: {
      biggestStruggle: defaultValues.biggestStruggle ?? "",
      objections: defaultValues.objections ?? "",
    },
  });

  function onSubmit(data: AudiencePain) {
    onNext(data as Partial<WizardInputs>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="biggestStruggle">
          {isApplication
            ? "What's the single biggest frustration your ideal client faces right now?"
            : "What's the biggest struggle your ideal client faces?"}
        </Label>
        <Textarea
          id="biggestStruggle"
          placeholder={isApplication
            ? "e.g. They've invested in coaches, programmes, and courses before but nothing has stuck. They're motivated but stuck in the same cycles — they know what to do but can't stay consistent. High performers in their career who feel like failures in their health."
            : "e.g. They start and stop, feel overwhelmed, lose motivation, can't find time — include who they are (e.g. busy mums, men over 40, postpartum women)"}
          rows={3}
          {...register("biggestStruggle")}
        />
        <p className="text-xs text-gray-400">
          {isApplication
            ? "Be specific — the more clearly you describe their pain, the stronger the copy"
            : "Describe them and what keeps them up at night"}
        </p>
        {errors.biggestStruggle && (
          <p className="text-sm text-red-500">{errors.biggestStruggle.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="objections">
          {isApplication
            ? "What hesitations hold serious prospects back from investing at this level?"
            : "What objections or hesitations do they typically have before joining?"}
        </Label>
        <Textarea
          id="objections"
          placeholder={isApplication
            ? "e.g. 'I've already tried coaches and it didn't work', 'I'm not sure I can commit to the schedule', 'Is the investment worth it for me?', 'What if I don't get the results?', 'I've heard this before'"
            : "e.g. 'I've tried before and failed', 'I don't have time', 'I'm not sure it'll work for me', 'I can't afford it'"}
          rows={3}
          {...register("objections")}
        />
        {errors.objections && (
          <p className="text-sm text-red-500">{errors.objections.message}</p>
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
