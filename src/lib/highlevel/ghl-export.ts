import type { GeneratedFunnelAssets } from "@/types/generation";
import {
  generateLandingPageHtml,
  generateOptInPageHtml,
  generateThankYouPageHtml,
  generateBookingPageHtml,
} from "./page-html";

export interface GhlImportJson {
  name: string;
  domain: string;
  steps: GhlImportStep[];
}

export interface GhlImportStep {
  id: string;
  name: string;
  stepType: "sales" | "opt-in" | "thank-you";
  sequence: number;
  url: string;
  body: string;
}

function stepId(slug: string): string {
  return `step-${slug}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateGhlImportJson(
  data: GeneratedFunnelAssets,
  funnelName?: string,
): GhlImportJson {
  const name = funnelName ?? data.offerSummary.challengeConcept ?? "30-Day Challenge Funnel";

  return {
    name,
    domain: "",
    steps: [
      {
        id:       stepId("landing"),
        name:     "Landing Page",
        stepType: "sales",
        sequence: 0,
        url:      "/challenge",
        body:     generateLandingPageHtml(data),
      },
      {
        id:       stepId("optin"),
        name:     "Opt-In Page",
        stepType: "opt-in",
        sequence: 1,
        url:      "/optin",
        body:     generateOptInPageHtml(data),
      },
      {
        id:       stepId("thank-you"),
        name:     "Thank You Page",
        stepType: "thank-you",
        sequence: 2,
        url:      "/thank-you",
        body:     generateThankYouPageHtml(data),
      },
      {
        id:       stepId("booking"),
        name:     "Booking Page",
        stepType: "sales",
        sequence: 3,
        url:      "/book",
        body:     generateBookingPageHtml(data),
      },
    ],
  };
}
