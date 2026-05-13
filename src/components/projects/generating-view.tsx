"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap, CheckCircle2, AlertCircle, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const STEPS_COPY = [
  "Analysing your offer and audience…",
  "Writing landing page copy…",
  "Building your email sequence…",
  "Crafting SMS follow-ups…",
  "Writing ad hooks and creative prompts…",
  "Setting up campaign naming and UTMs…",
  "Finalising your funnel…",
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

  // Cycle through copy steps for UX
  useEffect(() => {
    if (status !== "generating") return;
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS_COPY.length - 1));
    }, 3500);
    return () => clearInterval(interval);
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

      {/* Animated step copy */}
      <div className="mt-8 h-6">
        <p className="text-sm text-gray-500 animate-fade-in" key={stepIndex}>
          {STEPS_COPY[stepIndex]}
        </p>
      </div>

      {/* Progress dots */}
      <div className="mt-6 flex gap-1.5">
        {STEPS_COPY.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i <= stepIndex ? "w-4 bg-brand-500" : "w-1.5 bg-gray-200"
            }`}
          />
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-400">
        This takes 1–3 minutes. Don&apos;t close this tab.
      </p>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Working…</span>
      </div>
    </div>
  );
}
