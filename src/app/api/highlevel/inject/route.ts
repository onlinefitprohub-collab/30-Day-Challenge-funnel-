import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { hlFetch } from "@/lib/highlevel/client";
import {
  buildLandingPageData,
  buildOptInPageData,
  buildThankYouPageData,
  buildBookingPageData,
} from "@/lib/highlevel/ghl-pagedata";
import type { GeneratedFunnelAssets } from "@/types/generation";

export const dynamic = "force-dynamic";

interface InjectBody {
  projectId: string;
  page:       string;
  hlApiKey:   string;
  locationId: string;
  pageId:     string;
  funnelId?:  string;
}

function serviceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(request: Request) {
  let body: InjectBody;
  try {
    body = (await request.json()) as InjectBody;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { projectId, page, hlApiKey, locationId, pageId, funnelId } = body;

  if (!projectId || !page || !hlApiKey || !locationId || !pageId) {
    return NextResponse.json(
      { success: false, error: "Missing required fields: projectId, page, hlApiKey, locationId, pageId" },
      { status: 400 },
    );
  }

  const validPages = ["landing", "optin", "thankyou", "booking"];
  if (!validPages.includes(page)) {
    return NextResponse.json({ success: false, error: "Invalid page value" }, { status: 400 });
  }

  const supabase = serviceClient();
  const { data, error } = await supabase
    .from("project_outputs")
    .select("outputs")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data?.outputs) {
    return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
  }

  const assets = data.outputs as unknown as GeneratedFunnelAssets;

  let pageData;
  switch (page) {
    case "landing":  pageData = buildLandingPageData(assets);  break;
    case "optin":    pageData = buildOptInPageData(assets);    break;
    case "thankyou": pageData = buildThankYouPageData(assets); break;
    case "booking":  pageData = buildBookingPageData(assets);  break;
    default:         return NextResponse.json({ success: false, error: "Invalid page" }, { status: 400 });
  }

  const payload = { pageData, locationId, pageId, isPublished: false };

  const candidates = [
    `/funnels/funnel/page/${pageId}`,
    ...(funnelId ? [`/funnels/${funnelId}/pages/${pageId}`] : []),
  ];

  let lastError = "No endpoint succeeded";
  for (const path of candidates) {
    try {
      const res = await hlFetch(path, hlApiKey, {
        method: "PUT",
        body:   JSON.stringify(payload),
      });
      if (res.ok) {
        return NextResponse.json({ success: true, page, pageId });
      }
      const text = await res.text().catch(() => "");
      lastError = `HL API ${res.status}: ${text.slice(0, 300)}`;
    } catch (e) {
      lastError = e instanceof Error ? e.message : "Network error";
    }
  }

  return NextResponse.json({ success: false, error: lastError });
}
