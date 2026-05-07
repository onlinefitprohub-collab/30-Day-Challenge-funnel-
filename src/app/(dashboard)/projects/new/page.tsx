import { WizardShell } from "@/components/wizard/wizard-shell";

export const metadata = {
  title: "New Funnel Project | FitPro Launch",
};

interface PageProps {
  searchParams: Promise<{ projectId?: string }>;
}

export default async function NewProjectPage({ searchParams }: PageProps) {
  const { projectId } = await searchParams;
  // WizardShell loads saved inputs from localStorage when projectId is provided
  return <WizardShell initialProjectId={projectId} />;
}
