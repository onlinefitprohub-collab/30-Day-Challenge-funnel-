"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, AlertCircle } from "lucide-react";
import { WIZARD_STEPS, type WizardInputs } from "@/types/wizard";
import { WizardProgress } from "@/components/wizard/wizard-progress";
import { StepBusinessBasics } from "@/components/wizard/steps/step-business-basics";
import { StepOfferBasics } from "@/components/wizard/steps/step-offer-basics";
import { StepAudiencePain } from "@/components/wizard/steps/step-audience-pain";
import { StepBrandVoice } from "@/components/wizard/steps/step-brand-voice";
import { StepTrafficInputs } from "@/components/wizard/steps/step-traffic-inputs";
import { StepSocialProof } from "@/components/wizard/steps/step-social-proof";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { ProjectRow } from "@/types/project";

const STEP_COMPONENTS = [
  StepBusinessBasics,
  StepOfferBasics,
  StepAudiencePain,
  StepBrandVoice,
  StepTrafficInputs,
  StepSocialProof,
];

interface WizardShellProps {
  initialProjectId?: string;
  initialData?: Partial<WizardInputs>;
}

export function WizardShell({ initialProjectId, initialData }: WizardShellProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [projectId, setProjectId] = useState<string | undefined>(initialProjectId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<WizardInputs>>(
    initialData ?? { duration: 30, trafficSources: [], hasBeforeAfter: false }
  );

  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLastStep = currentStep === WIZARD_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  // Upsert inputs to DB — called silently after each step
  async function persistInputs(data: Partial<WizardInputs>, pid: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("project_inputs")
      .upsert(
        { project_id: pid, inputs: data as Record<string, unknown> },
        { onConflict: "project_id" }
      );
    if (error) throw new Error(error.message);
  }

  // Create the project row — happens once on completing step 1
  async function createProject(data: Partial<WizardInputs>): Promise<string> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      throw new Error("Not authenticated");
    }

    const name = data.businessName
      ? `${data.businessName} — ${data.challengeType ?? `${data.duration ?? 30}-Day Challenge`}`
      : "My 30-Day Challenge Funnel";

    const { data: project, error } = await supabase
      .from("projects")
      .insert({ user_id: user.id, name, status: "draft" })
      .select()
      .single();

    if (error || !project) throw new Error(error?.message ?? "Failed to create project");

    return (project as ProjectRow).id;
  }

  async function handleNext(stepData: Partial<WizardInputs>) {
    const merged = { ...formData, ...stepData };
    setFormData(merged);
    setSaveError(null);

    try {
      let pid = projectId;

      // Create project on first step completion
      if (!pid) {
        pid = await createProject(merged);
        setProjectId(pid);
        // Soft URL update so a refresh will reload this project
        window.history.replaceState({}, "", `/projects/new?projectId=${pid}`);
      }

      // Persist in background — don't block navigation
      persistInputs(merged, pid).catch((err) => {
        console.error("Background save failed:", err);
      });

      setCurrentStep((s) => s + 1);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save progress";
      setSaveError(message);
      toast({ title: "Couldn't save progress", description: message, variant: "destructive" });
    }
  }

  function handleBack() {
    setSaveError(null);
    setCurrentStep((s) => Math.max(0, s - 1));
  }

  async function handleSubmit(stepData: Partial<WizardInputs>) {
    const allData = { ...formData, ...stepData };
    setFormData(allData);
    setIsSubmitting(true);
    setSaveError(null);

    try {
      const supabase = createClient();
      let pid = projectId;

      // Edge case: user somehow skipped step 1 project creation
      if (!pid) {
        pid = await createProject(allData);
        setProjectId(pid);
      }

      // Save final inputs
      await persistInputs(allData, pid);

      // Mark as generating
      await supabase.from("projects").update({ status: "generating" }).eq("id", pid);

      // Call generation API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: pid, inputs: allData }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Generation failed");
      }

      router.push(`/projects/${pid}/results`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setSaveError(message);
      toast({ title: "Generation failed", description: message, variant: "destructive" });
      setIsSubmitting(false);

      // Reset project status on failure
      if (projectId) {
        const supabase = createClient();
        await supabase.from("projects").update({ status: "draft" }).eq("id", projectId);
      }
    }
  }

  const step = WIZARD_STEPS[currentStep];

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-3 flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Build your challenge funnel</h1>
        <p className="mt-2 text-gray-500">
          {initialProjectId
            ? "Pick up where you left off — your answers are saved."
            : "Answer 6 short sections. We'll generate your complete funnel."}
        </p>
      </div>

      {/* Progress bar */}
      <WizardProgress currentStep={currentStep} steps={WIZARD_STEPS} />

      {/* Save error banner */}
      {saveError && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-800">Something went wrong</p>
            <p className="text-sm text-red-600">{saveError}</p>
          </div>
        </div>
      )}

      {/* Step card */}
      <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Step {step.id} of {WIZARD_STEPS.length}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
          <p className="mt-1 text-gray-500">{step.description}</p>
        </div>

        <StepComponent
          defaultValues={formData}
          onNext={isLastStep ? handleSubmit : handleNext}
          onBack={handleBack}
          isLastStep={isLastStep}
          isFirstStep={isFirstStep}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Auto-save note */}
      {projectId && !isSubmitting && (
        <p className="mt-3 text-center text-xs text-gray-400">
          Progress saved — you can close this tab and return any time.
        </p>
      )}
    </div>
  );
}
