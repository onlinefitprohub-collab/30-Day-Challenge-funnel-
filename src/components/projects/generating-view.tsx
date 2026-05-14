"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap, CheckCircle2, AlertCircle, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const STEPS_COPY = [
  { emoji: "🔍", text: "Analysing your audience and offer positioning…" },
  { emoji: "✍️", text: "Writing your landing page headlines and subheadlines…" },
  { emoji: "🧠", text: "Building your coach story and bio copy…" },
  { emoji: "🎬", text: "Scripting your VSL hook and opening…" },
  { emoji: "📖", text: "Writing the full video sales letter script…" },
  { emoji: "💌", text: "Crafting your email welcome sequence…" },
  { emoji: "📱", text: "Building your SMS follow-up sequence…" },
  { emoji: "🎯", text: "Creating Facebook ad hooks and primary texts…" },
  { emoji: "🖼️", text: "Writing creative briefs and video prompts…" },
  { emoji: "📅", text: "Building your 30-day content calendar…" },
  { emoji: "📦", text: "Writing your programme delivery pack…" },
  { emoji: "🛠️", text: "Creating coaching tools and check-in templates…" },
  { emoji: "💰", text: "Writing your pricing strategy and confidence scripts…" },
  { emoji: "📊", text: "Setting up campaign naming and UTM parameters…" },
  { emoji: "✨", text: "Packaging everything and running final checks…" },
];

const MAX_POLLS = 80; // 80 × 3s = ~4 minutes

interface GeneratingViewProps {
  projectId: string;
  projectName: string;
}

export function GeneratingView({ projectId, projectName }: GeneratingViewProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState<"generating" | "complete" | "error" | "timeout">("generating");
  const [pollCount, setPollCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Cycle through copy steps for UX
  useEffect(() => {
    if (status !== "generating") return;
    const interval = setInterval(() => {
      setStepIndex((i: number) => Math.min(i + 1, STEPS_COPY.length - 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [status]);

  // Elapsed time counter
  useEffect(() => {
    if (status !== "generating") return;
    const timer = setInterval(() => {
      setElapsedSeconds((s: number) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Poll project status every 3 seconds
  useEffect(() => {
    if (status !== "generating") return;

    // Stop polling after MAX_POLLS
    if (pollCount >= MAX_POLLS) {
      setStatus("timeout");
      return;
    }

    const poll = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("status")
        .eq("id", projectId)
        .single();

      const projectStatus = (data as { status: string } | null)?.status;

      if (projectStatus === "complete") {
        setStatus("complete");
        setTimeout(() => { router.refresh(); router.push(`/projects/${projectId}/results`); }, 800);
      } else if (projectStatus === "error") {
        setStatus("error");
      } else {
        setPollCount((c) => c + 1);
      }
    };

    const timer = setTimeout(poll, 3000);
    return () => clearTimeout(timer);
  }, [projectId, pollCount, status, router]);

  if (status === "complete") {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900">Your funnel is ready!</h2>
        <p className="mt-2 text-gray-500">Taking you there now…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <AlertCircle className="mb-4 h-16 w-16 text-red-400" />
        <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
        <p className="mt-2 max-w-sm text-gray-500">
          The generation failed. Your answers are saved — click below to try again.
        </p>
        <Button
          className="mt-6"
          variant="gradient"
          onClick={() => router.push(`/projects/new?projectId=${projectId}`)}
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  if (status === "timeout") {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 mb-4">
          <Clock className="h-8 w-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Taking longer than expected</h2>
        <p className="mt-2 max-w-sm text-gray-500">
          Generation is still running in the background. Check if your results are ready, or go back and try again.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="gradient"
            onClick={() => { router.refresh(); router.push(`/projects/${projectId}/results`); }}
          >
            Check results
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Back to dashboard
          </Button>
        </div>
        <p className="mt-6 text-xs text-gray-400">
          If results aren&apos;t ready yet, wait a moment and check again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 shadow-lg">
          <Zap className="h-10 w-10 text-white" />
        </div>
        <div className="absolute -inset-1 -z-10 animate-ping rounded-2xl bg-brand-400 opacity-20" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Building your funnel</h2>
      <p className="mt-1 max-w-xs text-gray-500">{projectName}</p>

      {/* Step display */}
      <div className="mt-8 flex items-center gap-2 h-7">
        <span className="text-xl" key={`emoji-${stepIndex}`}>{STEPS_COPY[stepIndex].emoji}</span>
        <p className="text-sm text-gray-600 font-medium" key={`text-${stepIndex}`}>
          {STEPS_COPY[stepIndex].text}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-5 w-72 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-1000 ease-out"
          style={{ width: `${Math.round(((stepIndex + 1) / STEPS_COPY.length) * 100)}%` }}
        />
      </div>

      {/* Step count + elapsed */}
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
        <span>{stepIndex + 1} of {STEPS_COPY.length} steps</span>
        <span>·</span>
        <span>{Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")} elapsed</span>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        This takes 1–3 minutes. Don&apos;t close this tab.
      </p>
    </div>
  );
}
