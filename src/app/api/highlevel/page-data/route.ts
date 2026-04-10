import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildLandingPageData,
  buildOptInPageData,
  buildThankYouPageData,
  buildBookingPageData,
  pickTemplateVariant,
  type TemplateVariant,
} from "@/lib/highlevel/ghl-pagedata";
import type { GeneratedFunnelAssets } from "@/types/generation";

const TEMPLATE_LABELS: Record<string, string> = {
  "standard":          "Standard Hero",
  "stats-hero":        "Stats Hero",
  "social-proof-grid": "Social Proof Grid",
};

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

  console.log(`[page-data] REQUEST page=${page} projectId=${projectId}`);

  let pageData;
  let templateVariant: TemplateVariant | undefined;
  switch (page) {
    case "landing": {
      templateVariant = pickTemplateVariant();
      console.log(`[page-data] templateVariant=${templateVariant}`);
      pageData = buildLandingPageData(assets, templateVariant);
      break;
    }
    case "optin":    pageData = buildOptInPageData(assets);    break;
    case "thankyou": pageData = buildThankYouPageData(assets); break;
    case "booking":  pageData = buildBookingPageData(assets);  break;
    default:         return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }

  // Diagnostic: dump every element's meta, tagName, and styles keys so we can spot missing props
  pageData.sections.forEach((sec, si) => {
    (sec.elements ?? []).forEach((el, ei) => {
      const e = el as Record<string, unknown>;
      const sk = Object.keys((e.styles as Record<string, unknown>) ?? {}).join(",");
      console.log(`[page-data] sec${si}.el[${ei}] type=${e.type} meta=${e.meta} tag=${e.tagName} styles=[${sk}]`);
    });
  });

  return NextResponse.json({
    pageData,
    colourScheme: assets.colourScheme ?? "navy-orange",
    page,
    projectId,
    templateLabel: templateVariant ? (TEMPLATE_LABELS[templateVariant] ?? templateVariant) : undefined,
  });
}
