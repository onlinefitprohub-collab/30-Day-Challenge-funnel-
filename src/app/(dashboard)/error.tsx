"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 mb-5">
        <AlertCircle className="h-7 w-7 text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        An unexpected error occurred. Try again, or go back to your dashboard.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="gradient" onClick={reset}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
