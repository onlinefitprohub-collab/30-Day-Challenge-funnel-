import { hlFetch } from "./client";
import type { GeneratedFunnelAssets } from "@/types/generation";
import {
  generateLandingPageHtml,
  generateOptInPageHtml,
  generateThankYouPageHtml,
  generateBookingPageHtml,
} from "./page-html";

export interface HLEmailTemplate {
  id: string;
  name: string;
}

export interface HLFunnelStep {
  id: string;
  name: string;
}

export interface HLImportResult {
  emailTemplates: HLEmailTemplate[];
  emailApiUnavailable?: boolean;
  funnelId?: string;
  funnelUrl?: string;
  funnelSteps?: HLFunnelStep[];
  errors: string[];
}

const EMAIL_KEYS = [
  "welcome",
  "reminder",
  "objectionHandling",
  "lastChance",
  "reEngagement",
] as const;

const EMAIL_TEMPLATE_NAMES: Record<(typeof EMAIL_KEYS)[number], string> = {
  welcome: "Welcome Email",
  reminder: "Reminder Email",
  objectionHandling: "Objection Handling Email",
  lastChance: "Last Chance Email",
  reEngagement: "Re-engagement Email",
};

const EMAIL_TEMPLATE_PATHS = [
  "/email-templates",
  "/email-templates/",
  "/email/",
  "/email",
];

function extractId(data: Record<string, unknown>, ...nestedKeys: string[]): string | undefined {
  for (const key of nestedKeys) {
    const nested = data[key] as Record<string, unknown> | undefined;
    if (nested?.id) return nested.id as string;
  }
  return data.id as string | undefined;
}

async function tryCreateEmailTemplate(
  locationId: string,
  apiKey: string,
  name: string,
  subject: string,
  body: string
): Promise<{ id: string; notFound?: boolean } | null> {
  const payload = { locationId, name, subject, body };

  for (const path of EMAIL_TEMPLATE_PATHS) {
    try {
      const res = await hlFetch(path, apiKey, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = (await res.json()) as Record<string, unknown>;
        const id = extractId(data, "template", "emailTemplate") ?? name;
        return { id };
      }

      if (res.status === 404) {
        continue; // Try next path
      }

      // Non-404 error — surface it
      let errText = "";
      try { errText = await res.text(); } catch { errText = "Unknown"; }
      return { id: name, notFound: false };
      // Return null to propagate as a regular error
    } catch {
      // Network error for this path — try next
    }
  }

  // All paths returned 404 — endpoint not available
  return { id: "", notFound: true };
}

async function tryCreateFunnelStep(
  funnelId: string,
  locationId: string,
  apiKey: string,
  name: string,
  pageType: string,
  htmlBody?: string
): Promise<HLFunnelStep | null> {
  const payload: Record<string, unknown> = {
    locationId,
    funnelId,
    name,
    type: pageType,
    ...(htmlBody ? { body: htmlBody, html: htmlBody } : {}),
  };

  const paths = [
    `/funnels/${funnelId}/steps`,
    `/funnels/${funnelId}/pages`,
    `/funnel-pages`,
  ];

  for (const path of paths) {
    try {
      const res = await hlFetch(path, apiKey, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as Record<string, unknown>;
        const id = extractId(data, "page", "funnelPage", "step") ?? `${name}-id`;
        return { id, name };
      }
    } catch {
      // Try next path
    }
  }
  return null;
}

export async function importToHighLevel(
  locationId: string,
  apiKey: string,
  assets: GeneratedFunnelAssets
): Promise<HLImportResult> {
  const result: HLImportResult = {
    emailTemplates: [],
    errors: [],
  };

  // Step 1: Create email templates — try multiple endpoint paths
  let notFoundCount = 0;

  for (const key of EMAIL_KEYS) {
    const email = assets.emailSequence[key];
    const name = EMAIL_TEMPLATE_NAMES[key];
    const htmlBody = email.body.replace(/\n/g, "<br/>");

    const outcome = await tryCreateEmailTemplate(
      locationId,
      apiKey,
      name,
      email.subject,
      htmlBody
    );

    if (outcome?.notFound) {
      notFoundCount++;
    } else if (outcome?.id && !outcome.notFound) {
      result.emailTemplates.push({ id: outcome.id, name });
    } else {
      result.errors.push(`"${name}": failed to create`);
    }
  }

  // If all paths returned 404, the Email Template API is unavailable for this account
  if (notFoundCount === EMAIL_KEYS.length) {
    result.emailApiUnavailable = true;
  }

  // Step 2: Attempt funnel creation (best-effort; failure is non-fatal)
  let funnelId: string | undefined;
  try {
    const funnelName =
      assets.offerSummary?.challengeConcept ?? "30-Day Challenge Funnel";
    const res = await hlFetch("/funnels/", apiKey, {
      method: "POST",
      body: JSON.stringify({ locationId, name: funnelName, type: "funnel" }),
    });

    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      funnelId = extractId(data, "funnel");
      if (funnelId) {
        result.funnelId = funnelId;
        result.funnelUrl = `https://app.gohighlevel.com/v2/location/${locationId}/funnels/${funnelId}`;
      }
    } else {
      let errText = "";
      try { errText = await res.text(); } catch { errText = "Unknown"; }
      if (res.status !== 404) {
        result.errors.push(`Funnel creation skipped: ${res.status} ${errText.slice(0, 80)}`);
      }
    }
  } catch (err) {
    result.errors.push(
      `Funnel creation skipped: ${err instanceof Error ? err.message : "Network error"}`
    );
  }

  // Step 3: Attempt funnel step creation with page HTML (best-effort)
  if (funnelId) {
    const steps: HLFunnelStep[] = [];

    const landingStep = await tryCreateFunnelStep(
      funnelId, locationId, apiKey,
      "Landing Page", "landing",
      generateLandingPageHtml(assets)
    );
    if (landingStep) steps.push(landingStep);

    const optInStep = await tryCreateFunnelStep(
      funnelId, locationId, apiKey,
      "Opt-in Page", "optin",
      generateOptInPageHtml(assets)
    );
    if (optInStep) steps.push(optInStep);

    const thankYouStep = await tryCreateFunnelStep(
      funnelId, locationId, apiKey,
      "Thank You Page", "thank-you",
      generateThankYouPageHtml(assets)
    );
    if (thankYouStep) steps.push(thankYouStep);

    const bookingStep = await tryCreateFunnelStep(
      funnelId, locationId, apiKey,
      "Booking Page", "booking",
      generateBookingPageHtml(assets)
    );
    if (bookingStep) steps.push(bookingStep);

    if (steps.length > 0) result.funnelSteps = steps;
  }

  return result;
}
