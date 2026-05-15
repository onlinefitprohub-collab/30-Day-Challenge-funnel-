"use client";

import { useState } from "react";
import { Zap, CheckCircle2, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  "Unlimited funnel projects",
  "All 9 AI generation groups",
  "Chrome Extension + GHL page injection",
  "30-post monthly content engine",
  "VSL script, coach story & discovery call",
  "Facebook ad copy + campaign naming",
];

export function PaywallGate() {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", { method: "POST" });
      const { url, error } = await res.json() as { url?: string; error?: string };
      if (error || !url) throw new Error(error ?? "No checkout URL");
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 mb-6">
        <Lock className="h-8 w-8 text-brand-500" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Subscribe to access FitPro Launch</h2>
      <p className="mt-2 max-w-sm text-gray-500">
        One plan. Everything included. Generate complete funnels in minutes.
      </p>

      <div className="mt-8 w-full max-w-sm rounded-2xl border border-brand-100 bg-brand-50 p-6 text-left space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-brand-900">FitPro Launch</p>
          <p className="text-lg font-bold text-brand-700">£97<span className="text-sm font-normal">/mo</span></p>
        </div>

        <ul className="space-y-2 text-sm text-brand-800">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-500" />
              {f}
            </li>
          ))}
        </ul>

        <Button
          variant="gradient"
          className="w-full gap-2"
          onClick={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          Subscribe — £97/month
        </Button>

        <p className="text-xs text-center text-brand-600">Cancel anytime. No hidden fees.</p>
      </div>
    </div>
  );
}
