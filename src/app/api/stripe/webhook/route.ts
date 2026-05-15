import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";
import type Stripe from "stripe";

// Raw body required for Stripe signature verification
export const dynamic = "force-dynamic";

// In Stripe API 2026-04-22.dahlia, current_period_end lives on subscription items
function getPeriodEnd(sub: Stripe.Subscription): string | null {
  const firstItem = sub.items?.data?.[0] as (Stripe.SubscriptionItem & { current_period_end?: number }) | undefined;
  const ts = firstItem?.current_period_end;
  return ts ? new Date(ts * 1000).toISOString() : null;
}

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;
  return (customer as Stripe.Customer).metadata?.supabase_user_id ?? null;
}

async function setSubscriptionStatus(
  userId: string,
  status: "active" | "none",
  periodEnd?: string | null,
) {
  const supabase = createServiceClient();
  await supabase.from("user_settings").upsert(
    {
      user_id: userId,
      subscription_status: status,
      subscription_tier: status,
      ...(periodEnd !== undefined ? { subscription_period_end: periodEnd } : {}),
    },
    { onConflict: "user_id" }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      if (!userId || !session.subscription) break;

      const sub = await stripe.subscriptions.retrieve(session.subscription as string, {
        expand: ["items"],
      }) as Stripe.Subscription;

      await supabase.from("user_settings").upsert(
        {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          subscription_status: "active",
          subscription_tier: "active",
          subscription_period_end: getPeriodEnd(sub),
        },
        { onConflict: "user_id" }
      );
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = await getUserIdFromCustomer(sub.customer as string);
      if (!userId) break;

      const isActive = sub.status === "active" || sub.status === "trialing";
      await setSubscriptionStatus(userId, isActive ? "active" : "none", getPeriodEnd(sub));
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = await getUserIdFromCustomer(sub.customer as string);
      if (!userId) break;
      await setSubscriptionStatus(userId, "none", null);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      if (!invoice.customer) break;
      const userId = await getUserIdFromCustomer(invoice.customer as string);
      if (!userId) break;
      await setSubscriptionStatus(userId, "none");
      break;
    }
  }

  return NextResponse.json({ received: true });
}
