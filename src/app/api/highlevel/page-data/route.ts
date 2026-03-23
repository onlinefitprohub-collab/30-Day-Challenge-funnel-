import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildLandingPageData,
  buildOptInPageData,
  buildThankYouPageData,
  buildBookingPageData,
} from "@/lib/highlevel/ghl-pagedata";
import type { GeneratedFunnelAssets } from "@/types/generation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const page      = searchParams.get("page");

  if (!projectId || !page) {
    return NextResponse.json({ error: "Missing projectId or page" }, { status: 400 });
  }

  const validPages = ["landing", "optin", "thankyou", "booking"] as const;
  if (!validPages.includes(page as typeof validPages[number])) {
    return NextResponse.json({ error: "Invalid page value" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("project_outputs")
    .select("outputs")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data?.outputs) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const assets = data.outputs as unknown as GeneratedFunnelAssets;

  let pageData;
  switch (page) {
    case "landing":  pageData = buildLandingPageData(assets);  break;
    case "optin":    pageData = buildOptInPageData(assets);    break;
    case "thankyou": pageData = buildThankYouPageData(assets); break;
    case "booking":  pageData = buildBookingPageData(assets);  break;
    default:         return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }

  return NextResponse.json({
    pageData,
    colourScheme: assets.colourScheme ?? "navy-orange",
    page,
    projectId,
  });
}
