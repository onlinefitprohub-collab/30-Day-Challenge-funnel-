"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, Zap, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SubscriptionStatus } from "@/lib/subscription";

interface SubscriptionCardProps {
  status: SubscriptionStatus;
  periodEnd: string | null;
  projectCount: number;
  upgraded?: boolean;
}

export function SubscriptionCard({ status, periodEnd, projectCount, upgraded }: SubscriptionCardProps) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const isPro = status === "pro" || status === "annual";

  async function handleUpgrade() {
    setLoading("checkout");
    try {
      const res = await fetch("/api/stripe/create-checkout", { method: "POST" });
      const { url, error } = await res.json() as { url?: string; error?: string };
      if (error || !url) throw new Error(error ?? "No checkout URL");
      window.location.href = url;
    } catch {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url, error } = await res.json() as { url?: string; error?: string };
      if (error || !url) throw new Error(error ?? "No portal URL");
      window.location.href = url;
    } catch {
      setLoading(null);
    }
  }

  const renewDate = periodEnd
    ? new Date(periodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-base">Subscription</CardTitle>
        </div>
        <CardDescription>Your current plan and billing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Success banner after upgrade */}
        {upgraded && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
            <span>You&apos;re now on the Pro plan. Unlimited funnels unlocked.</span>
          </div>
        )}

        {isPro ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Pro Plan</p>
                {renewDate && (
                  <p className="text-sm text-gray-500">Renews {renewDate}</p>
                )}
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <ul className="space-y-1.5 text-sm text-gray-600">
              {[
                "Unlimited funnel projects",
                "All 9 AI generation groups",
                "Chrome Extension + GHL injection",
                "Full content engine access",
                "Priority generation queue",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handlePortal}
              disabled={loading === "portal"}
            >
              {loading === "portal" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ExternalLink className="h-3.5 w-3.5" />
              )}
              Manage billing
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Free Plan</p>
                <p className="text-sm text-gray-500">
                  {projectCount} of 3 projects used
                </p>
              </div>
              <Badge variant="secondary">Free</Badge>
            </div>

            {/* Usage bar */}
            <div className="space-y-1">
              <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${Math.min((projectCount / 3) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{Math.max(0, 3 - projectCount)} project{3 - projectCount === 1 ? "" : "s"} remaining</p>
            </div>

            {/* Pro feature list */}
            <div className="rounded-lg border border-brand-100 bg-brand-50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-600" />
                <p className="text-sm font-semibold text-brand-900">Upgrade to Pro — £97/month</p>
              </div>
              <ul className="space-y-1 text-sm text-brand-800">
                {[
                  "Unlimited funnel projects",
                  "All 9 AI generation groups",
                  "Chrome Extension + GHL injection",
                  "Full content engine (30-post monthly calendar)",
                  "Priority generation queue",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 shrink-0 text-brand-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant="gradient"
                className="w-full gap-2"
                onClick={handleUpgrade}
                disabled={loading === "checkout"}
              >
                {loading === "checkout" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                Upgrade to Pro
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
