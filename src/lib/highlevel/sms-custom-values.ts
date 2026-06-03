import { hlFetch } from "./client";
import type { SmsSequence, DeliveryPack } from "@/types/generation";

export interface GhlCustomValueResult {
  name: string;
  ok: boolean;
  customValueId?: string;
  error?: string;
}

export interface PushSmsCustomValuesResult {
  pushed: GhlCustomValueResult[];
  errors: string[];
}

function toSlug(name: string, maxLen = 20): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, maxLen).replace(/_$/, "");
}

async function createCustomValue(
  locationId: string,
  apiKey: string,
  name: string,
  fieldKey: string,
  value: string,
): Promise<GhlCustomValueResult> {
  try {
    const res = await hlFetch(`/locations/${locationId}/customValues`, apiKey, {
      method: "POST",
      body: JSON.stringify({ name, fieldKey, value }),
    });
    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      const cv = (data.customValue ?? data) as Record<string, unknown>;
      return { name, ok: true, customValueId: cv.id as string | undefined };
    }
    let errText = "";
    try { errText = await res.text(); } catch { /* ignore */ }
    return { name, ok: false, error: `${res.status}: ${errText.slice(0, 120)}` };
  } catch (err) {
    return { name, ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

const SMS_SEQUENCE_LABELS: Record<keyof SmsSequence, string> = {
  confirmation:           "Confirmation",
  challengeReminder:      "Challenge Reminder",
  dayOneKickoff:          "Day 1 Kickoff",
  midChallengeMotivation: "Mid-Challenge Motivation",
  noShow:                 "No Show",
  challengeComplete:      "Challenge Complete",
  reEngagement:           "Re-Engagement",
};

export async function pushSmsSequenceAsCustomValues(
  locationId: string,
  apiKey: string,
  sequence: SmsSequence,
  challengeName: string,
): Promise<PushSmsCustomValuesResult> {
  const slug = toSlug(challengeName);
  const results: GhlCustomValueResult[] = [];
  const errors: string[] = [];

  for (const [key, label] of Object.entries(SMS_SEQUENCE_LABELS) as [keyof SmsSequence, string][]) {
    const value = sequence[key];
    if (!value) continue;
    const fieldKey = `challenge_${slug}_${key.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
    const name = `Challenge SMS — ${label}`;
    const result = await createCustomValue(locationId, apiKey, name, fieldKey, value);
    results.push(result);
    if (!result.ok && result.error) errors.push(`${label}: ${result.error}`);
  }

  return { pushed: results, errors };
}

export async function pushDeliveryPackSmsAsCustomValues(
  locationId: string,
  apiKey: string,
  pack: DeliveryPack,
  challengeName: string,
): Promise<PushSmsCustomValuesResult> {
  const slug = toSlug(challengeName);
  const results: GhlCustomValueResult[] = [];
  const errors: string[] = [];

  const items: { name: string; fieldKey: string; value: string }[] = [
    { name: "Delivery SMS — Welcome", fieldKey: `delivery_${slug}_welcome_sms`, value: pack.welcomeSms },
    ...pack.dailySmsPrompts.map((sms, i) => ({
      name: `Delivery SMS — Day ${String(i + 1).padStart(2, "0")}`,
      fieldKey: `delivery_${slug}_day_${String(i + 1).padStart(2, "0")}`,
      value: sms,
    })),
    { name: "Delivery SMS — Completion", fieldKey: `delivery_${slug}_completion_sms`, value: pack.completionSms },
  ];

  for (const item of items) {
    if (!item.value) continue;
    const result = await createCustomValue(locationId, apiKey, item.name, item.fieldKey, item.value);
    results.push(result);
    if (!result.ok && result.error) errors.push(`${item.name}: ${result.error}`);
  }

  return { pushed: results, errors };
}
