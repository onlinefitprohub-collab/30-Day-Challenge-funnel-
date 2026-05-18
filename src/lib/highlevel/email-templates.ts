import { hlFetch } from "./client";
import type { EmailSequence, NurtureSequence } from "@/types/generation";

export interface GhlTemplateResult {
  name: string;
  ok: boolean;
  templateId?: string;
  error?: string;
}

export interface PushEmailTemplatesResult {
  pushed: GhlTemplateResult[];
  errors: string[];
}

// Plain-text body → minimal HTML email that renders in GHL's editor
function toHtml(body: string): string {
  const lines = body
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "<br/>";
      return `<p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">${trimmed.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:24px;background:#ffffff;">
${lines}
</body></html>`;
}

async function createTemplate(
  locationId: string,
  apiKey: string,
  name: string,
  subject: string,
  htmlBody: string,
): Promise<GhlTemplateResult> {
  // Try emailMarketing/templates first (v2 preferred), then legacy path
  const paths = ["/emailMarketing/templates", "/emails/builder"];

  for (const path of paths) {
    try {
      const res = await hlFetch(path, apiKey, {
        method: "POST",
        body: JSON.stringify({
          locationId,
          name,
          subject,
          body: htmlBody,
          templateType: "email",
          isPlainText: false,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as Record<string, unknown>;
        const template = (data.template ?? data) as Record<string, unknown>;
        return { name, ok: true, templateId: template.id as string | undefined };
      }

      if (res.status === 404) continue;

      let errText = "";
      try { errText = await res.text(); } catch { /* ignore */ }
      return { name, ok: false, error: `${res.status}: ${errText.slice(0, 120)}` };
    } catch (err) {
      if (path === paths[paths.length - 1]) {
        return { name, ok: false, error: err instanceof Error ? err.message : "Network error" };
      }
    }
  }

  return { name, ok: false, error: "All endpoints failed" };
}

// Sequence key → human-readable label for the template name
const EMAIL_SEQUENCE_LABELS: Record<keyof EmailSequence, string> = {
  welcome:           "1. Welcome",
  valueDelivery:     "2. Value Delivery",
  socialProof:       "3. Social Proof",
  objectionHandling: "4. Objection Handling",
  lastChance:        "5. Last Chance",
  dayOneKickoff:     "6. Day 1 Kickoff",
  midChallenge:      "7. Mid-Challenge",
  finalStretch:      "8. Final Stretch",
  challengeComplete: "9. Challenge Complete",
  reEngagement:      "10. Re-Engagement",
};

export async function pushEmailSequenceAsTemplates(
  locationId: string,
  apiKey: string,
  sequence: EmailSequence,
  challengeName: string,
): Promise<PushEmailTemplatesResult> {
  const prefix = challengeName.slice(0, 30);
  const results: GhlTemplateResult[] = [];
  const errors: string[] = [];

  for (const [key, label] of Object.entries(EMAIL_SEQUENCE_LABELS) as [keyof EmailSequence, string][]) {
    const email = sequence[key];
    if (!email) continue;

    const result = await createTemplate(
      locationId,
      apiKey,
      `${prefix} — ${label}`,
      email.subject,
      toHtml(email.body),
    );

    results.push(result);
    if (!result.ok && result.error) errors.push(`${label}: ${result.error}`);
  }

  return { pushed: results, errors };
}

export async function pushNurtureSequenceAsTemplates(
  locationId: string,
  apiKey: string,
  sequence: NurtureSequence,
  challengeName: string,
): Promise<PushEmailTemplatesResult> {
  const prefix = challengeName.slice(0, 25);
  const results: GhlTemplateResult[] = [];
  const errors: string[] = [];

  for (const email of sequence.emails) {
    const result = await createTemplate(
      locationId,
      apiKey,
      `${prefix} — Week ${String(email.week).padStart(2, "0")}: ${email.theme.slice(0, 30)}`,
      email.subject,
      toHtml(email.body),
    );

    results.push(result);
    if (!result.ok && result.error) errors.push(`Week ${email.week}: ${result.error}`);
  }

  return { pushed: results, errors };
}
