import type { WizardInputs } from "@/types/wizard";

export interface StepProps {
  defaultValues: Partial<WizardInputs>;
  onNext: (data: Partial<WizardInputs>) => void;
  onBack: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  isSubmitting: boolean;
}
