"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-6">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-gray-500">
        An unexpected error occurred. Your data is safe — try refreshing the page or go back to your dashboard.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="gradient" onClick={reset}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline">Go to dashboard</Button>
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-gray-400">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
