"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CloneButtonProps {
  projectId: string;
}

export function CloneButton({ projectId }: CloneButtonProps) {
  const router = useRouter();
  const [cloning, setCloning] = useState(false);

  async function handleClone(e: React.MouseEvent) {
    e.preventDefault(); // Prevent the parent <Link> from navigating
    e.stopPropagation();
    if (cloning) return;

    setCloning(true);
    try {
      const res = await fetch("/api/projects/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const { newProjectId, hasOutputs } = await res.json() as { newProjectId: string; hasOutputs: boolean };
      if (hasOutputs) {
        toast({ title: "Project cloned!", description: "Opening your duplicate funnel." });
        router.push(`/projects/${newProjectId}`);
      } else {
        toast({ title: "Project cloned!", description: "Opening wizard with your saved inputs." });
        router.push(`/projects/new?projectId=${newProjectId}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Could not clone project", description: msg, variant: "destructive" });
      setCloning(false);
    }
  }

  return (
    <button
      onClick={handleClone}
      disabled={cloning}
      title="Clone this project — opens a new wizard pre-filled with your saved inputs"
      className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-50"
    >
      {cloning
        ? <Loader2 className="h-3 w-3 animate-spin" />
        : <Copy className="h-3 w-3" />
      }
      {cloning ? "Cloning…" : "Clone"}
    </button>
  );
}
