import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import type { GeneratedFunnelAssets } from "@/types/generation";
import { LandingPage } from "@/components/funnel-pages/landing";
import { OptInPage } from "@/components/funnel-pages/optin";
import { ThankYouPage } from "@/components/funnel-pages/thank-you";
import { BookingPage } from "@/components/funnel-pages/booking";

const VALID_PAGES = ["landing", "optin", "thank-you", "booking"] as const;
type PageType = (typeof VALID_PAGES)[number];

interface Props {
  params: Promise<{ projectId: string; pageType: string }>;
}

async function getProjectData(projectId: string): Promise<GeneratedFunnelAssets | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("project_outputs")
    .select("outputs")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data?.outputs) return null;
  const { _isMock: _removed, ...assets } = data.outputs as Record<string, unknown>;
  return assets as GeneratedFunnelAssets;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId, pageType } = await params;
  const data = await getProjectData(projectId);
  if (!data) return { title: "Funnel Page" };
  const concept = data.offerSummary?.challengeConcept ?? "Challenge";

  const titles: Record<string, string> = {
    landing: `Join the ${concept}`,
    optin: `Claim Your Free Spot — ${concept}`,
    "thank-you": `You're In! — ${concept}`,
    booking: `Book Your Call — ${concept}`,
  };

  return {
    title: titles[pageType] ?? concept,
    description: data.offerSummary?.corePromise ?? "",
  };
}

export default async function FunnelPage({ params }: Props) {
  const { projectId, pageType } = await params;

  if (!VALID_PAGES.includes(pageType as PageType)) {
    notFound();
  }

  const data = await getProjectData(projectId);
  if (!data) notFound();

  const urls = {
    landing:  `/funnel/${projectId}/landing`,
    optin:    `/funnel/${projectId}/optin`,
    thankYou: `/funnel/${projectId}/thank-you`,
    booking:  `/funnel/${projectId}/booking`,
  };

  switch (pageType as PageType) {
    case "landing":
      return <LandingPage data={data} optinUrl={urls.optin} />;
    case "optin":
      return <OptInPage data={data} thankYouUrl={urls.thankYou} />;
    case "thank-you":
      return <ThankYouPage data={data} bookingUrl={urls.booking} />;
    case "booking":
      return <BookingPage data={data} />;
    default:
      notFound();
  }
}
