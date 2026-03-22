import { hlFetch } from "./client";
import type { GeneratedFunnelAssets } from "@/types/generation";

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

function extractId(data: Record<string, unknown>, ...nestedKeys: string[]): string | undefined {
  for (const key of nestedKeys) {
    const nested = data[key] as Record<string, unknown> | undefined;
    if (nested?.id) return nested.id as string;
  }
  return data.id as string | undefined;
}

async function tryCreateFunnelStep(
  funnelId: string,
  locationId: string,
  apiKey: string,
  name: string,
  url: string
): Promise<HLFunnelStep | null> {
  const payload = { locationId, funnelId, name, url };

  // Try primary endpoint first, then fallback path
  for (const path of [`/funnels/${funnelId}/pages`, "/funnel-pages"]) {
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

  // Step 1: Create email templates
  for (const key of EMAIL_KEYS) {
    const email = assets.emailSequence[key];
    const name = EMAIL_TEMPLATE_NAMES[key];

    try {
      const res = await hlFetch("/email-templates/", apiKey, {
        method: "POST",
        body: JSON.stringify({
          locationId,
          name,
          subject: email.subject,
          body: email.body.replace(/\n/g, "<br/>"),
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as Record<string, unknown>;
        const templateId = extractId(data, "template") ?? name;
        result.emailTemplates.push({ id: templateId, name });
      } else {
        let errText = "";
        try {
          errText = await res.text();
        } catch {
          errText = "Unknown error";
        }
        result.errors.push(`"${name}": ${res.status} ${errText.slice(0, 120)}`);
      }
    } catch (err) {
      result.errors.push(
        `"${name}": ${err instanceof Error ? err.message : "Network error"}`
      );
    }
  }

  // Step 2: Attempt funnel creation (best-effort)
  try {
    const funnelName =
      assets.offerSummary?.challengeConcept ?? "30-Day Challenge Funnel";
    const res = await hlFetch("/funnels/", apiKey, {
      method: "POST",
      body: JSON.stringify({
        locationId,
        name: funnelName,
        type: "funnel",
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      const funnelId = extractId(data, "funnel");

      if (funnelId) {
        result.funnelId = funnelId;
        result.funnelUrl = `https://app.gohighlevel.com/v2/location/${locationId}/funnels/${funnelId}`;

        // Step 3: Attempt funnel step creation — opt-in + thank-you (best-effort)
        const steps: HLFunnelStep[] = [];

        const optInStep = await tryCreateFunnelStep(
          funnelId,
          locationId,
          apiKey,
          "Opt-in Page",
          "opt-in"
        );
        if (optInStep) steps.push(optInStep);

        const thankYouStep = await tryCreateFunnelStep(
          funnelId,
          locationId,
          apiKey,
          "Thank You Page",
          "thank-you"
        );
        if (thankYouStep) steps.push(thankYouStep);

        if (steps.length > 0) {
          result.funnelSteps = steps;
        }
      }
    }
  } catch {
    // Funnel API may not be available — skip silently
  }

  return result;
}
