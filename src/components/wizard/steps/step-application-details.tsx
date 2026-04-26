"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applicationDetailsSchema, type ApplicationDetails, type WizardInputs } from "@/types/wizard";
import type { StepProps } from "./types";

export function StepApplicationDetails({ defaultValues, onNext, onBack }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationDetails>({
    resolver: zodResolver(applicationDetailsSchema),
    defaultValues: {
      programPillars:           defaultValues.programPillars           ?? "",
      uniqueApproach:           defaultValues.uniqueApproach           ?? "",
      idealClientProfile:       defaultValues.idealClientProfile       ?? "",
      notForWho:                defaultValues.notForWho                ?? "",
      applicationProcess:       defaultValues.applicationProcess       ?? "",
      coachingCapacity:         defaultValues.coachingCapacity         ?? "",
      applicationFormQuestions: defaultValues.applicationFormQuestions ?? "",
    },
  });

  function onSubmit(data: ApplicationDetails) {
    onNext(data as Partial<WizardInputs>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      <div className="space-y-1.5">
        <Label htmlFor="programPillars">
          What are the core pillars or phases of your programme?{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="programPillars"
          placeholder={`e.g.\nPillar 1: Mindset Reset — breaking old patterns and building a champion's identity\nPillar 2: Nutrition Architecture — building a sustainable calorie deficit without restriction\nPillar 3: Intelligent Training — progressive overload tailored to your body and schedule\nPillar 4: Accountability Systems — weekly check-ins, daily tracking, and coach access\nPillar 5: Lifestyle Integration — making this permanent, not another failed programme`}
          rows={5}
          {...register("programPillars")}
        />
        <p className="text-xs text-gray-400">
          These become the benefit blocks on your registration page — the more specific, the better.
        </p>
        {errors.programPillars && (
          <p className="text-sm text-red-500">{errors.programPillars.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="uniqueApproach">
          What makes your approach different from anyone else?{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="uniqueApproach"
          placeholder="e.g. We don't use generic plans or cookie-cutter macros. Every client gets a fully personalised protocol built around their lifestyle, work schedule, and injury history. Most coaches prescribe — we engineer."
          rows={3}
          {...register("uniqueApproach")}
        />
        {errors.uniqueApproach && (
          <p className="text-sm text-red-500">{errors.uniqueApproach.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="idealClientProfile">
          Describe the PERFECT person for this programme{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="idealClientProfile"
          placeholder="e.g. High-achieving professionals aged 30–50 who are serious about transformation, have already tried diets and PT without lasting results, can commit 4–5 hours per week, and are ready to invest in themselves. They want accountability, not just a plan."
          rows={3}
          {...register("idealClientProfile")}
        />
        <p className="text-xs text-gray-400">
          This shapes the &ldquo;Who this IS for&rdquo; section — qualifiers that attract the right applicants.
        </p>
        {errors.idealClientProfile && (
          <p className="text-sm text-red-500">{errors.idealClientProfile.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notForWho">
          Who is this programme NOT right for?{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="notForWho"
          placeholder="e.g. People looking for a quick fix or magic pill. Anyone not willing to track their food and training. Those who can't commit to at least 3 sessions per week. People who want someone to do the work for them."
          rows={3}
          {...register("notForWho")}
        />
        <p className="text-xs text-gray-400">
          Disqualifiers pre-screen applicants and make serious prospects feel more confident applying.
        </p>
        {errors.notForWho && (
          <p className="text-sm text-red-500">{errors.notForWho.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="applicationProcess">
            What happens after someone applies?{" "}
            <span className="text-gray-400">(optional)</span>
          </Label>
          <Input
            id="applicationProcess"
            placeholder="e.g. We review within 24h and book a free strategy call"
            {...register("applicationProcess")}
          />
          {errors.applicationProcess && (
            <p className="text-sm text-red-500">{errors.applicationProcess.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="coachingCapacity">
            How many clients do you take at once?{" "}
            <span className="text-gray-400">(optional)</span>
          </Label>
          <Input
            id="coachingCapacity"
            placeholder="e.g. Max 10 per cohort, 6 spots remaining"
            {...register("coachingCapacity")}
          />
          <p className="text-xs text-gray-400">Creates scarcity on the page.</p>
          {errors.coachingCapacity && (
            <p className="text-sm text-red-500">{errors.coachingCapacity.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="applicationFormQuestions">
          What questions do you ask applicants?{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="applicationFormQuestions"
          placeholder={`e.g.\n1. What is your current weight and goal weight?\n2. Have you worked with a coach before? What happened?\n3. What's your biggest obstacle to getting in shape right now?\n4. What does your current training and nutrition look like?\n5. Why do you feel now is the right time to invest in yourself?`}
          rows={5}
          {...register("applicationFormQuestions")}
        />
        <p className="text-xs text-gray-400">
          These pre-screen applicants and feed the AI-generated application form copy.
        </p>
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
