"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { WIZARD_STEPS } from "@/types/wizard";
import { WizardProgress } from "@/components/wizard/wizard-progress";
import { StepBusinessBasics } from "@/components/wizard/steps/step-business-basics";
import { StepOfferBasics } from "@/components/wizard/steps/step-offer-basics";
import { StepAudiencePain } from "@/components/wizard/steps/step-audience-pain";
import { StepBrandVoice } from "@/components/wizard/steps/step-brand-voice";
import { StepTrafficSocial } from "@/components/wizard/steps/step-traffic-social";
import type { WizardInputs } from "@/types/wizard";
import type { ProjectRow } from "@/types/project";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

const STEP_COMPONENTS = [
  StepBusinessBasics,
  StepOfferBasics,
  StepAudiencePain,
  StepBrandVoice,
  StepTrafficSocial,
];

export function WizardShell() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<WizardInputs>>({
    duration: 30,
    trafficSources: [],
  });

  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLastStep = currentStep === WIZARD_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  function handleStepData(data: Partial<WizardInputs>) {
    setFormData((prev) => ({ ...prev, ...data }));
  }

  function handleNext(data: Partial<WizardInputs>) {
    handleStepData(data);
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  async function handleSubmit(finalData: Partial<WizardInputs>) {
    const allData = { ...formData, ...finalData };
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({ title: "Session expired", description: "Please log in again.", variant: "destructive" });
        router.push("/login");
        return;
      }

      const projectName = allData.businessName
        ? `${allData.businessName} — ${allData.challengeType ?? "30-Day Challenge"}`
        : "My 30-Day Challenge Funnel";

      // Create project
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectName,
          status: "generating",
        })
        .select()
        .single();

      const project = projectData as ProjectRow | null;

      if (projectError || !project) {
        throw new Error(projectError?.message ?? "Failed to create project");
      }

      // Save inputs
      await supabase.from("project_inputs").insert({
        project_id: project.id,
        inputs: allData as Record<string, unknown>,
      });

      // Trigger generation API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, inputs: allData }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Generation failed");
      }

      toast({
        title: "Funnel generated!",
        description: "Your complete challenge funnel is ready.",
      });

      router.push(`/projects/${project.id}/results`);
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-3 flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Build your challenge funnel
        </h1>
        <p className="mt-2 text-gray-500">
          Answer these questions and we&apos;ll generate your complete funnel in seconds.
        </p>
      </div>

      {/* Progress */}
      <WizardProgress currentStep={currentStep} steps={WIZARD_STEPS} />

      {/* Step card */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {WIZARD_STEPS[currentStep].title}
          </h2>
          <p className="mt-1 text-gray-500">
            {WIZARD_STEPS[currentStep].description}
          </p>
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
    </div>
  );
}
