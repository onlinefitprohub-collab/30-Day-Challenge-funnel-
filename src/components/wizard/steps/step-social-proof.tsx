"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      testimonials:      defaultValues.testimonials ?? "",
      caseStudySnippets: defaultValues.caseStudySnippets ?? "",
      resultsHighlights: defaultValues.resultsHighlights ?? "",
      hasBeforeAfter:    defaultValues.hasBeforeAfter ?? false,
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

      {/* Testimonials */}
      <div className="space-y-1.5">
        <Label htmlFor="testimonials">
          Client testimonials or quotes <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="testimonials"
          placeholder={`e.g.\n"Lost 12lbs and finally feel like myself again" — Emma T., 38\n"Down 2 dress sizes in 6 weeks, and I didn't give up pasta" — Maria P., 44`}
          rows={4}
          {...register("testimonials")}
        />
        <p className="text-xs text-gray-400">
          Copy and paste real quotes here. Include first name and age if possible for authenticity.
        </p>
      </div>

      {/* Case study */}
      <div className="space-y-1.5">
        <Label htmlFor="caseStudySnippets">
          Client story or case study <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="caseStudySnippets"
          placeholder="e.g. Claire, 42, a nurse and mum of three, was working night shifts and felt she had no time for herself. After 30 days she had lost 8lbs, started sleeping better, and said it was the first time she'd stuck to anything in years."
          rows={3}
          {...register("caseStudySnippets")}
        />
      </div>

      {/* Results highlights */}
      <div className="space-y-1.5">
        <Label htmlFor="resultsHighlights">
          Quick wins or stats to highlight <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="resultsHighlights"
          placeholder="e.g. 95 clients completed the last challenge, average weight loss 9lbs, 4.9-star rating, 87% said they'd recommend it to a friend"
          rows={2}
          {...register("resultsHighlights")}
        />
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
      <div className="rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 to-accent-50 p-5">
        <div className="flex items-start gap-3">
          <Zap className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <div>
            <p className="font-semibold text-brand-900">You're ready to generate</p>
            <p className="mt-1 text-sm text-brand-700">
              We'll now build your complete challenge funnel — landing page, emails, SMS, ad copy,
              creative prompts, and campaign setup. Takes about 30 seconds.
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
              Generating your funnel…
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Generate my funnel
            </>
          )}
        </Button>
      </div>

      {isSubmitting && (
        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-500">Building your funnel — this takes about 30 seconds.</p>
          <p className="text-xs text-gray-400">Don't close this tab.</p>
        </div>
      )}
    </form>
  );
}
