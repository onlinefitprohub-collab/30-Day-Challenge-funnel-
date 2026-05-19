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

const copywriterStyles = [
  {
    value: "brunson",
    label: "Story-Driven",
    icon: "📖",
    description: "Hooks, origin stories, secret mechanisms",
    example: '"The moment I stopped counting calories and discovered this one shift, everything changed…"',
  },
  {
    value: "hormozi",
    label: "Bold & Proven",
    icon: "📊",
    description: "Data-first, no fluff, bold guarantees",
    example: '"Most coaches waste your time. Here\'s exactly what 847 clients did to lose 2 stone in 90 days."',
  },
  {
    value: "halbert",
    label: "Conversational",
    icon: "💬",
    description: "Honest, personal, reads like a letter from a friend",
    example: '"Look, I\'m just going to be straight with you. Most fitness programmes fail because of one thing nobody talks about."',
  },
  {
    value: "ogilvy",
    label: "Credibility-Led",
    icon: "🏆",
    description: "Research-backed, specific, intelligent",
    example: '"After 9 years and 400+ clients, I\'ve identified the exact 3 habits that separate those who transform from those who don\'t."',
  },
  {
    value: "schwartz",
    label: "Empathy-First",
    icon: "❤️",
    description: "Deeply resonant, mirrors the reader\'s own thoughts",
    example: '"You already know what to do. You\'ve read the articles, tried the plans. The problem isn\'t knowledge — it\'s something else."',
  },
  {
    value: "kennedy",
    label: "No-Nonsense",
    icon: "🎯",
    description: "Blunt, direct, results-focused",
    example: '"I\'ll be blunt: if you\'re not getting results, you\'re following the wrong system. Here\'s the one that actually works."',
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
      copywriterStyle: (defaultValues.copywriterStyle as BrandVoice["copywriterStyle"]) ?? undefined,
      phrasesToInclude: defaultValues.phrasesToInclude ?? "",
      phrasesToAvoid: defaultValues.phrasesToAvoid ?? "",
    },
  });

  const toneOfVoice = watch("toneOfVoice");
  const colourScheme = watch("colourScheme");
  const copywriterStyle = watch("copywriterStyle");

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
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
              }`}
            >
              <p className={`text-sm font-semibold ${toneOfVoice === option.value ? "text-orange-400" : "text-zinc-100"}`}>
                {option.label}
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">{option.description}</p>
            </button>
          ))}
        </div>
        {errors.toneOfVoice && (
          <p className="text-sm text-red-500">{errors.toneOfVoice.message}</p>
        )}
      </div>

      {/* Copywriter style */}
      <div className="space-y-2">
        <Label>
          Writing style <span className="text-zinc-400 font-normal">(optional — click an example to hear how it sounds)</span>
        </Label>
        <p className="text-xs text-zinc-500">
          This controls the structure and voice of every line of copy. Pick the one that sounds most like you, or skip and we'll choose automatically.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {copywriterStyles.map((style) => {
            const isSelected = copywriterStyle === style.value;
            return (
              <button
                key={style.value}
                type="button"
                onClick={() => setValue("copywriterStyle", isSelected ? undefined : style.value)}
                className={`rounded-lg border-2 p-3 text-left transition-all ${
                  isSelected
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{style.icon}</span>
                  <p className={`text-sm font-semibold ${isSelected ? "text-orange-400" : "text-zinc-100"}`}>
                    {style.label}
                  </p>
                </div>
                <p className="text-xs text-zinc-400 mb-2">{style.description}</p>
                <p className={`text-[11px] italic leading-relaxed ${isSelected ? "text-orange-300/80" : "text-zinc-500"}`}>
                  {style.example}
                </p>
              </button>
            );
          })}
        </div>
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
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
              }`}
            >
              <div className="flex shrink-0 gap-1">
                <div className="h-6 w-6 rounded-full border border-white/10" style={{ backgroundColor: scheme.preview[0] }} />
                <div className="h-6 w-6 rounded-full border border-white/10" style={{ backgroundColor: scheme.preview[1] }} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${colourScheme === scheme.value ? "text-orange-400" : "text-zinc-100"}`}>
                  {scheme.label}
                </p>
                <p className="text-xs text-zinc-400">{scheme.description}</p>
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
