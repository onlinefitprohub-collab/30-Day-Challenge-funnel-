"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, Zap, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SubscriptionStatus } from "@/lib/subscription";

const FEATURES = [
  "Unlimited funnel projects",
  "All 9 AI generation groups",
  "Chrome Extension + GHL page injection",
  "30-post monthly content engine",
  "VSL script, coach story & discovery call",
  "Facebook ad copy + campaign naming",
];

interface SubscriptionCardProps {
  status: SubscriptionStatus;
  periodEnd: string | null;
  upgraded?: boolean;
}

export function SubscriptionCard({ status, periodEnd, upgraded }: SubscriptionCardProps) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleSubscribe() {
    setCheckoutError(null);
    setLoading("checkout");
    try {
      const res = await fetch("/api/stripe/create-checkout", { method: "POST" });
      const { url, error } = await res.json() as { url?: string; error?: string };
      if (error || !url) throw new Error(error ?? "No checkout URL");
      window.location.href = url;
    } catch {
      setCheckoutError("Couldn't open checkout. Please try again.");
      setLoading(null);
    }
  }

  async function handlePortal() {
    setCheckoutError(null);
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url, error } = await res.json() as { url?: string; error?: string };
      if (error || !url) throw new Error(error ?? "No portal URL");
      window.location.href = url;
    } catch {
      setCheckoutError("Couldn't open billing portal. Please try again.");
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

        {upgraded && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
            <span>Subscription active. All features unlocked.</span>
          </div>
        )}

        {/* Active — paid via Stripe */}
        {status === "active" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">FitPro Launch</p>
                {renewDate && <p className="text-sm text-gray-500">Renews {renewDate}</p>}
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="gap-2" onClick={handlePortal} disabled={loading === "portal"}>
              {loading === "portal" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
              Manage billing
            </Button>
            {checkoutError && (
              <p className="text-xs text-red-500 mt-1">{checkoutError}</p>
            )}
          </>
        )}

        {/* Manual — admin granted */}
        {status === "manual" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">FitPro Launch</p>
                <p className="text-sm text-gray-500">Access granted by admin</p>
              </div>
              <Badge variant="success">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Admin access
              </Badge>
            </div>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* None — no access */}
        {status === "none" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">No active subscription</p>
              <Badge variant="secondary">Inactive</Badge>
            </div>
            <div className="rounded-lg border border-brand-100 bg-brand-50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-600" />
                <p className="text-sm font-semibold text-brand-900">FitPro Launch — £97/month</p>
              </div>
              <ul className="space-y-1 text-sm text-brand-800">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 shrink-0 text-brand-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="gradient" className="w-full gap-2" onClick={handleSubscribe} disabled={loading === "checkout"}>
                {loading === "checkout" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Subscribe — £97/month
              </Button>
              {checkoutError && (
                <p className="text-xs text-red-500 mt-1">{checkoutError}</p>
              )}
              <p className="text-xs text-center text-brand-600">Cancel anytime. No hidden fees.</p>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
