import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildLandingPageData,
  buildOptInPageData,
  buildApplicationFormPageData,
  buildThankYouPageData,
  buildBookingPageData,
  buildSalesLetterPageData,
  ALL_TEMPLATE_VARIANTS,
  pickTemplateVariant,
  type TemplateVariant,
} from "@/lib/highlevel/ghl-pagedata";
import type { GeneratedFunnelAssets } from "@/types/generation";

const TEMPLATE_LABELS: Record<TemplateVariant, string> = {
  "standard":              "Standard",
  "stats-hero":            "Stats Hero",
  "social-proof-grid":     "Social Proof Grid",
  "transformation-split":  "Transformation Split",
  "authority-builder":     "Authority Builder",
  "urgency-driven":        "Urgency Driven",
  "bold-impact":           "Bold Impact",
  "community-proof":       "Community Proof",
  "video-authority":       "Video Authority",
  "minimalist-elite":      "Minimalist Elite",
  "vsl-focused":           "VSL Focused",
  "transformation-wall":   "Transformation Wall",
  "is-this-for-you":       "Is This For You",
  "event-agenda":          "Event Agenda",
  "executive-clean":       "Executive Clean",
  "local-demographic":     "Local Demographic",
  "free-value-first":      "Free Value First",
  "application-style":     "Application Style",
  "story-journey":         "Story Journey",
  "results-first":         "Results First",
  "gradient-proof":        "Gradient Proof",
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

  const validPages = ["landing", "optin", "thankyou", "booking", "salesletter"] as const;
  if (!validPages.includes(page as typeof validPages[number])) {
    return NextResponse.json({ error: "Invalid page value" }, { status: 400 });
  }

  // Verify the project belongs to this user before returning its data
  const { data: projectCheck } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!projectCheck) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
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
      // Priority: query param (UI selector) → persisted from generation → random from pool
      const requested = searchParams.get("templateVariant");
      const isValid   = requested && (ALL_TEMPLATE_VARIANTS as readonly string[]).includes(requested);
      const persisted = assets.templateVariant as TemplateVariant | undefined;
      templateVariant = (isValid ? (requested as TemplateVariant) : undefined) ?? persisted ?? pickTemplateVariant();
      console.log(`[page-data] templateVariant=${templateVariant} (requested=${requested ?? "none"}, persisted=${persisted ?? "none"})`);
      try {
        pageData = buildLandingPageData(assets, templateVariant);
      } catch (err) {
        console.error(`[page-data] buildLandingPageData threw for variant "${templateVariant}":`, err);
        return NextResponse.json(
          { error: err instanceof Error ? err.message : "Page build failed" },
          { status: 500 },
        );
      }
      break;
    }
    case "optin":
      pageData = assets.funnelType === "application"
        ? buildApplicationFormPageData(assets)
        : buildOptInPageData(assets);
      break;
    case "thankyou": pageData = buildThankYouPageData(assets); break;
    case "booking":  pageData = buildBookingPageData(assets);  break;
    case "salesletter":
      if (!assets.longFormAssets?.salesLetter) {
        return NextResponse.json({ error: "Sales letter not generated yet" }, { status: 404 });
      }
      try {
        pageData = buildSalesLetterPageData(assets);
      } catch (err) {
        console.error("[page-data] buildSalesLetterPageData threw:", err);
        return NextResponse.json(
          { error: err instanceof Error ? err.message : "Sales letter page build failed" },
          { status: 500 },
        );
      }
      break;
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
    templateVariant,
  });
}
