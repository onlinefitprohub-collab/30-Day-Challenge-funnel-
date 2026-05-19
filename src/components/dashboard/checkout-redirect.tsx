"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * When the dashboard loads with ?checkout=1 (from the email-verified post-signup flow),
 * automatically kick off the Stripe checkout session and redirect the user.
 */
export function CheckoutRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const triggered = useRef(false);

  useEffect(() => {
    if (!searchParams.get("checkout") || triggered.current) return;
    triggered.current = true;

    async function startCheckout() {
      try {
        const res = await fetch("/api/stripe/create-checkout", { method: "POST" });
        const data = await res.json() as { url?: string; error?: string };
        if (data.url) {
          window.location.href = data.url;
        } else {
          // Checkout not configured (dev env) — just strip the param and stay on dashboard
          router.replace("/dashboard");
        }
      } catch {
        router.replace("/dashboard");
      }
    }

    void startCheckout();
  }, [searchParams, router]);

  return null;
}
