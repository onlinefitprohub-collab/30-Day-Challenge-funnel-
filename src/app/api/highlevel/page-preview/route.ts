import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildLandingPageData,
  buildOptInPageData,
  buildApplicationFormPageData,
  buildThankYouPageData,
  buildBookingPageData,
  buildSalesLetterPageData,
  buildApplicationLandingPageData,
  ALL_TEMPLATE_VARIANTS,
  pickTemplateVariant,
  type TemplateVariant,
} from "@/lib/highlevel/ghl-pagedata";
import { renderPageToHtml } from "@/lib/highlevel/render-page-html";
import type { GeneratedFunnelAssets } from "@/types/generation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const page = searchParams.get("page");

  if (!projectId || !page) {
    return new NextResponse("Missing projectId or page", { status: 400 });
  }

  const validPages = [
    "landing",
    "optin",
    "thankyou",
    "booking",
    "salesletter",
  ] as const;
  if (!validPages.includes(page as (typeof validPages)[number])) {
    return new NextResponse("Invalid page value", { status: 400 });
  }

  const { data: projectCheck } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!projectCheck) {
    return new NextResponse("Project not found", { status: 404 });
  }

  const { data, error } = await supabase
    .from("project_outputs")
    .select("outputs")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data?.outputs) {
    return new NextResponse("Project outputs not found", { status: 404 });
  }

  const assets = data.outputs as unknown as GeneratedFunnelAssets;

  let pageData;
  switch (page) {
    case "landing": {
      const requested = searchParams.get("templateVariant");
      const isValid =
        requested &&
        (ALL_TEMPLATE_VARIANTS as readonly string[]).includes(requested);
      const persisted = assets.templateVariant as TemplateVariant | undefined;
      const templateVariant =
        (isValid ? (requested as TemplateVariant) : undefined) ??
        persisted ??
        pickTemplateVariant();
      try {
        pageData = buildLandingPageData(assets, templateVariant);
      } catch {
        return new NextResponse("Page build failed", { status: 500 });
      }
      break;
    }
    case "optin":
      pageData =
        assets.funnelType === "application"
          ? buildApplicationFormPageData(assets)
          : buildOptInPageData(assets);
      break;
    case "thankyou":
      pageData = buildThankYouPageData(assets);
      break;
    case "booking":
      pageData = buildBookingPageData(assets);
      break;
    case "salesletter":
      if (assets.funnelType === "application") {
        if (!assets.applicationLandingPage) {
          return new NextResponse("Registration page not generated yet", {
            status: 404,
          });
        }
        try {
          pageData = buildApplicationLandingPageData(assets);
        } catch {
          return new NextResponse("Registration page build failed", {
            status: 500,
          });
        }
      } else {
        if (!assets.longFormAssets?.salesLetter) {
          return new NextResponse("Sales letter not generated yet", {
            status: 404,
          });
        }
        try {
          pageData = buildSalesLetterPageData(assets);
        } catch {
          return new NextResponse("Sales letter build failed", {
            status: 500,
          });
        }
      }
      break;
    default:
      return new NextResponse("Invalid page", { status: 400 });
  }

  const html = renderPageToHtml(pageData);
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
