import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL ?? "").split(",").map((e) => e.trim().toLowerCase());

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vars = [
    "ANTHROPIC_API_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRO_PRICE_ID",
    "ADMIN_EMAIL",
    "NEXT_PUBLIC_APP_URL",
  ];

  const report = Object.fromEntries(
    vars.map((name) => {
      const val = process.env[name] ?? "";
      return [name, { present: !!val, length: val.length }];
    }),
  );

  return NextResponse.json({ env: report, node_env: process.env.NODE_ENV });
}
