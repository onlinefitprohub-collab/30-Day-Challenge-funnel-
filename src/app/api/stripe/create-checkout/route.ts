import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { stripe, PRO_PRICE_ID } from "@/lib/stripe";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!PRO_PRICE_ID) {
    return NextResponse.json({ error: "Stripe price not configured" }, { status: 500 });
  }

  const service = createServiceClient();
  const { data: settings } = await service
    .from("user_settings")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let customerId = (settings as { stripe_customer_id?: string | null } | null)?.stripe_customer_id ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await service.from("user_settings").upsert(
      { user_id: user.id, stripe_customer_id: customerId },
      { onConflict: "user_id" }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:5000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
    success_url: `${appUrl}/account?upgraded=1`,
    cancel_url: `${appUrl}/account`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    metadata: { supabase_user_id: user.id },
  });

  return NextResponse.json({ url: session.url });
}
