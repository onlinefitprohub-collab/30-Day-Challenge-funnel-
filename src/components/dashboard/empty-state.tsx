import Link from "next/link";
import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white px-8 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100">
        <Zap className="h-8 w-8 text-brand-600" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-gray-900">
        No funnel projects yet
      </h2>
      <p className="mt-2 max-w-sm text-gray-500">
        Create your first challenge funnel project and have a complete,
        launch-ready funnel generated in minutes.
      </p>
      <Link href="/projects/new" className="mt-8">
        <Button size="lg" variant="gradient">
          <Plus className="h-5 w-5" />
          Create my first funnel
        </Button>
      </Link>
    </div>
  );
}
