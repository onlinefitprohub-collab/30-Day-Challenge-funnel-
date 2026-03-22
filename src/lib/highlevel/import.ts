import { hlFetch } from "./client";
import type { GeneratedFunnelAssets } from "@/types/generation";

export interface HLEmailTemplate {
  id: string;
  name: string;
}

export interface HLImportResult {
  emailTemplates: HLEmailTemplate[];
  funnelId?: string;
  funnelUrl?: string;
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

export async function importToHighLevel(
  locationId: string,
  apiKey: string,
  assets: GeneratedFunnelAssets
): Promise<HLImportResult> {
  const result: HLImportResult = {
    emailTemplates: [],
    errors: [],
  };

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
        const nested = data?.template as Record<string, unknown> | undefined;
        const templateId =
          (nested?.id as string | undefined) ??
          (data?.id as string | undefined) ??
          name;
        result.emailTemplates.push({ id: templateId, name });
      } else {
        let errText = "";
        try {
          errText = await res.text();
        } catch {
          errText = "Unknown error";
        }
        result.errors.push(
          `"${name}": ${res.status} ${errText.slice(0, 120)}`
        );
      }
    } catch (err) {
      result.errors.push(
        `"${name}": ${err instanceof Error ? err.message : "Network error"}`
      );
    }
  }

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
      const nested = data?.funnel as Record<string, unknown> | undefined;
      const funnelId =
        (nested?.id as string | undefined) ?? (data?.id as string | undefined);
      if (funnelId) {
        result.funnelId = funnelId;
        result.funnelUrl = `https://app.gohighlevel.com/v2/location/${locationId}/funnels/${funnelId}`;
      }
    }
  } catch {
    // Funnel API may not be available — skip silently
  }

  return result;
}
