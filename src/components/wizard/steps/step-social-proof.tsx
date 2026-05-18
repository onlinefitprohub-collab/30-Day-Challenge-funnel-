"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { socialProofSchema, type SocialProof, type WizardInputs } from "@/types/wizard";
import type { StepProps } from "./types";

export function StepSocialProof({
  defaultValues,
  onNext,
  onBack,
  isSubmitting,
}: StepProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SocialProof>({
    resolver: zodResolver(socialProofSchema),
    defaultValues: {
      testimonials:          defaultValues.testimonials          ?? "",
      caseStudySnippets:     defaultValues.caseStudySnippets     ?? "",
      resultsHighlights:     defaultValues.resultsHighlights     ?? "",
      hasBeforeAfter:        defaultValues.hasBeforeAfter        ?? false,
      clientTransformations: defaultValues.clientTransformations ?? "",
      bestClientResult:      defaultValues.bestClientResult      ?? "",
    },
  });

  const hasBeforeAfter = watch("hasBeforeAfter");

  function onSubmit(data: SocialProof) {
    onNext(data as Partial<WizardInputs>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Intro note */}
      <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
        <div className="flex gap-2.5">
          <Star className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-900">Social proof converts sceptics</p>
            <p className="mt-0.5 text-sm text-amber-700">
              Even one or two real results make a huge difference to ad performance and opt-in rates.
              All fields here are optional — skip what you don't have yet.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials + results */}
      <div className="space-y-1.5">
        <Label htmlFor="testimonials">
          Client results, quotes, or wins <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="testimonials"
          placeholder={`Add anything you have — quotes, stats, client stories:\n\n"Lost 12lbs and finally feel like myself again" — Emma T., 38\n\n95 clients completed the last challenge, average loss 9lbs, 4.9 stars\n\nClaire, 42, a nurse and mum of three, was working night shifts… After 30 days she had lost 8lbs and sleeping better.`}
          rows={5}
          {...register("testimonials")}
        />
        <p className="text-xs text-gray-400">
          Include quotes, stats, short client stories — whatever you have. Real results dramatically improve conversions.
        </p>
      </div>

      {/* Structured transformations */}
      <div className="space-y-1.5">
        <Label htmlFor="clientTransformations">
          2–3 specific client transformations <span className="text-gray-400">(optional — highest impact)</span>
        </Label>
        <Textarea
          id="clientTransformations"
          placeholder={`Give the AI structured before → after → timeframe stories:\n\nEmma, 42, nurse and mum of 3 — was 3 stone overweight, exhausted, had tried Slimming World twice. Lost 24lbs and ran her first 10k. 14 weeks.\n\nMark, 51, company director — hadn't exercised in 10 years, back pain, low energy. Dropped 18kg, off blood pressure meds, now trains 4x per week. 16 weeks.\n\nSarah, 35, teacher — postpartum, couldn't shift baby weight after 2 years of trying. Lost 16lbs, regained confidence, back in her pre-pregnancy clothes. 12 weeks.`}
          rows={7}
          {...register("clientTransformations")}
        />
        <p className="text-xs text-gray-400">
          Specific stories with real numbers and timelines are far more powerful than generic quotes. The more detail you give, the stronger the AI-generated copy.
        </p>
      </div>

      {/* Best single result */}
      <div className="space-y-1.5">
        <Label htmlFor="bestClientResult">
          What's the single best result any client has achieved? <span className="text-gray-400">(optional)</span>
        </Label>
        <Input
          id="bestClientResult"
          placeholder="e.g. Emma lost 24lbs and ran her first 10k in 14 weeks — after 3 failed diets"
          {...register("bestClientResult")}
        />
        <p className="text-xs text-gray-400">
          Your most impressive outlier result — becomes the headline anchor and proof ceiling for all copy.
        </p>
      </div>

      {/* Before/after */}
      <div className="space-y-2">
        <Label>Do you have before/after photos or results images?</Label>
        <div className="flex gap-3">
          {[
            { value: true,  label: "Yes, I have them" },
            { value: false, label: "Not yet" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => setValue("hasBeforeAfter", opt.value)}
              className={cn(
                "flex-1 rounded-lg border-2 py-2.5 text-sm font-medium transition-all",
                hasBeforeAfter === opt.value
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate CTA */}
      <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-5">
        <div className="flex items-start gap-3">
          <Zap className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
          <div>
            <p className="font-semibold text-zinc-100">You're ready to generate</p>
            <p className="mt-1 text-sm text-zinc-400">
              We'll build your complete funnel — landing page, emails, SMS, ad copy, content calendar and more. Takes 1–3 minutes.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={isSubmitting}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="submit" variant="gradient" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Starting…
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
