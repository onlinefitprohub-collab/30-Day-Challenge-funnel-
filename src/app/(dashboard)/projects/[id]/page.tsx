"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProject } from "@/lib/storage";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const project = getProject(id);
    if (!project) {
      router.replace("/dashboard");
      return;
    }
    if (project.status === "complete") {
      router.replace(`/projects/${id}/results`);
    } else {
      router.replace(`/projects/new?projectId=${id}`);
    }
  }, [id, router]);

  return null;
}
