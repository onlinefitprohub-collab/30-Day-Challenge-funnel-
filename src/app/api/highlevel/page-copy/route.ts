import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  generateLandingPageHtml,
  generateOptInPageHtml,
  generateThankYouPageHtml,
  generateBookingPageHtml,
} from "@/lib/highlevel/page-html";
import type { GeneratedFunnelAssets } from "@/types/generation";

export const dynamic = "force-dynamic";

/**
 * GET /api/highlevel/page-copy?projectId=X&page=landing
 *
 * Public endpoint — projectId UUID acts as a capability token.
 * Returns the fully rendered HTML for the requested page so the Chrome
 * extension can copy it to the clipboard without needing auth or API keys.
 * CORS is open so extension content scripts can call it directly.
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const page      = searchParams.get("page");
  const info      = searchParams.get("info");

  if (!projectId) {
    return NextResponse.json(
      { error: "Missing projectId param" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase
    .from("project_outputs")
    .select("outputs")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data?.outputs) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404, headers: CORS_HEADERS },
    );
  }

  const assets = data.outputs as unknown as GeneratedFunnelAssets;

  // ?info=true — return project metadata (no page HTML)
  if (info === "true") {
    const challengeConcept = assets.offerSummary?.challengeConcept ?? "Challenge Funnel";
    return NextResponse.json(
      { challengeConcept, pages: ["landing", "optin", "thankyou", "booking"] },
      { status: 200, headers: CORS_HEADERS },
    );
  }

  const validPages = ["landing", "optin", "thankyou", "booking"] as const;
  if (!page || !validPages.includes(page as typeof validPages[number])) {
    return NextResponse.json(
      { error: "Missing or invalid page param" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  let html: string;
  switch (page) {
    case "landing":  html = generateLandingPageHtml(assets);  break;
    case "optin":    html = generateOptInPageHtml(assets);    break;
    case "thankyou": html = generateThankYouPageHtml(assets); break;
    case "booking":  html = generateBookingPageHtml(assets);  break;
    default:
      return NextResponse.json({ error: "Invalid page" }, { status: 400, headers: CORS_HEADERS });
  }

  return new Response(html, {
    status: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "text/html; charset=utf-8" },
  });
}
