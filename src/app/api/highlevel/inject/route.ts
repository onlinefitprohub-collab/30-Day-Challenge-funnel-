import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { hlFetch } from "@/lib/highlevel/client";
import { deriveProjectToken } from "@/lib/highlevel/inject-token";
import {
  buildLandingPageData,
  buildOptInPageData,
  buildThankYouPageData,
  buildBookingPageData,
} from "@/lib/highlevel/ghl-pagedata";
import type { GeneratedFunnelAssets } from "@/types/generation";

export const dynamic = "force-dynamic";

interface InjectBody {
  projectId:     string;
  projectToken:  string;
  page:          string;
  hlApiKey:      string;
  locationId:    string;
  pageId:        string;
  funnelId?:     string;
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

  const { projectId, projectToken, page, hlApiKey, locationId, pageId, funnelId } = body;

  if (!projectId || !projectToken || !page || !hlApiKey || !locationId || !pageId) {
    return NextResponse.json(
      { success: false, error: "Missing required fields: projectId, projectToken, page, hlApiKey, locationId, pageId" },
      { status: 400 },
    );
  }

  // ── Token validation (ownership proof) ────────────────────────────────────
  let expectedToken: string;
  try {
    expectedToken = deriveProjectToken(projectId);
  } catch {
    return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
  }

  if (projectToken !== expectedToken) {
    return NextResponse.json(
      { success: false, error: "Invalid project token. Get your token from the Results page → HighLevel tab → Chrome Extension card." },
      { status: 403 },
    );
  }

  // ── Fetch project outputs using service role (token already validated) ─────
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
  let lastStatus = 502;
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
      lastStatus = res.status >= 400 && res.status < 600 ? res.status : 502;
      lastError  = `HL API ${res.status}: ${text.slice(0, 300)}`;
    } catch (e) {
      lastStatus = 502;
      lastError  = e instanceof Error ? e.message : "Network error";
    }
  }

  return NextResponse.json({ success: false, error: lastError }, { status: lastStatus });
}
