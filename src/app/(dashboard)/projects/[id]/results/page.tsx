"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProject, type StoredProject } from "@/lib/storage";
import { ResultsShell } from "@/components/results/results-shell";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<StoredProject | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = getProject(id);
    if (!p) {
      router.replace("/dashboard");
      return;
    }
    if (p.status !== "complete" || !p.outputs) {
      router.replace(`/projects/new?projectId=${id}`);
      return;
    }
    setProject(p);
    setReady(true);
  }, [id, router]);

  if (!ready || !project || !project.outputs) return null;

  const isMock = Boolean(project.outputs._isMock);

  return <ResultsShell project={project} outputs={project.outputs} isMock={isMock} />;
}
