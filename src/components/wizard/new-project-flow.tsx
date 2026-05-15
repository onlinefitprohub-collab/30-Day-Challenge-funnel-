"use client";

import { useState } from "react";
import { TemplatePicker } from "./template-picker";
import { WizardShell } from "./wizard-shell";
import type { WizardInputs } from "@/types/wizard";

interface Props {
  initialProjectId?: string;
  initialData?: Partial<WizardInputs>;
}

export function NewProjectFlow({ initialProjectId, initialData }: Props) {
  const [phase, setPhase] = useState<"picker" | "wizard">(
    // Skip picker when resuming an existing project
    initialProjectId ? "wizard" : "picker"
  );
  const [prefill, setPrefill] = useState<Partial<WizardInputs>>(
    initialData ?? { duration: 30, trafficSources: [], hasBeforeAfter: false }
  );

  if (phase === "picker") {
    return (
      <TemplatePicker
        onSelect={(templateData) => {
          setPrefill(templateData);
          setPhase("wizard");
        }}
        onSkip={() => setPhase("wizard")}
      />
    );
  }

  return (
    <WizardShell
      initialProjectId={initialProjectId}
      initialData={prefill}
    />
  );
}
