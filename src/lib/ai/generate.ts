/**
 * Core AI generation orchestrator.
 *
 * Makes 3 focused API calls in parallel — one per section group.
 * Each call has its own token budget and is validated independently.
 * If a group fails validation, its sections fall back to personalised mock data.
 *
 * Group 1 — Strategy & Pages: offerSummary, landingPage, optInForm, thankYouPage, bookingPage, design
 * Group 2 — Follow-up Sequences: smsSequence, emailSequence
 * Group 3 — Ads & Campaign: adCopy, creativePrompts, campaignNaming
 *
 * Model routing:
 *   Group 1 & 3 → claude-sonnet-4-6 (persuasive copy)
 *   Group 2     → claude-haiku-4-5-20251001 (sequences — coherent at lower cost)
 *   All groups  → GPT-4o fallback when ANTHROPIC_API_KEY is absent or Claude fails
 */

import { getOpenAIClient, SYSTEM_PROMPT } from "./client";
import { hasClaude } from "./claude-client";
import { callClaudeGroup } from "./claude-generate";
import { buildCoachContext } from "./context";
import { buildOfferPagesPrompt } from "./prompts/offer-pages";
import { buildSequencesPrompt } from "./prompts/sequences";
import { buildAdsCampaignPrompt } from "./prompts/ads-campaign";
import { pickRandomStyle } from "./copywriter-styles";
import {
  offerPagesResponseSchema,
  sequencesResponseSchema,
  adsCampaignResponseSchema,
  safeParse,
} from "./validators";
import { generateMockAssets } from "./mock";
import type { WizardInputs } from "@/types/wizard";
import type { GeneratedFunnelAssets } from "@/types/generation";

const MODEL_PRIMARY = "claude-sonnet-4-6";
const MODEL_FAST    = "claude-haiku-4-5-20251001";

const GPT_MODEL   = "gpt-4o";
const TEMPERATURE = 0.72;

// Token budgets per group — sized to comfortably fit each group's JSON
const TOKENS = {
  offerPages:  4000,  // 5 sections + design spec
  sequences:   2800,  // 5 SMS + 5 emails with subject + body
  adsCampaign: 2400,  // ad copy, creative prompts, campaign naming
} as const;

interface GroupResult<T> {
  data: T | null;
  error: string | null;
  usedFallback: boolean;
}

async function callGroup<T>(
  prompt: string,
  schema: Parameters<typeof safeParse<T>>[0],
  groupName: string,
  maxTokens: number,
): Promise<GroupResult<T>> {
  const openai = getOpenAIClient();

  try {
    const response = await openai.chat.completions.create({
      model: GPT_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: prompt },
      ],
      temperature: TEMPERATURE,
      max_tokens:  maxTokens,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { data: null, error: `${groupName}: empty response from AI`, usedFallback: false };
    }

    const parsed = safeParse(schema, content, groupName);
    if (parsed.error) {
      console.error(`[generate] ${parsed.error}`);
      return { data: null, error: parsed.error, usedFallback: false };
    }

    return { data: parsed.data, error: null, usedFallback: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[generate] ${groupName} API call failed:`, message);
    return { data: null, error: `${groupName}: ${message}`, usedFallback: false };
  }
}

/**
 * Attempt Claude for a copy-heavy group; fall back to GPT-4o on any error.
 * This ensures existing users without an Anthropic key are unaffected.
 */
async function callCopyGroup<T>(
  prompt: string,
  schema: Parameters<typeof safeParse<T>>[0],
  groupName: string,
  maxTokens: number,
  model: string,
): Promise<GroupResult<T>> {
  if (hasClaude()) {
    console.log(`[generate] ${groupName} → ${model}`);
    const result = await callClaudeGroup<T>(prompt, schema, groupName, maxTokens, model);
    if (result.data !== null) return result;

    // Claude call failed — fall through to GPT-4o with a warning
    console.warn(
      `[generate] Claude failed for ${groupName} (${result.error}) — falling back to GPT-4o`,
    );
  } else {
    console.warn(
      `[generate] ANTHROPIC_API_KEY not set — using GPT-4o for ${groupName}`,
    );
  }

  return callGroup<T>(prompt, schema, groupName, maxTokens);
}

export async function generateFunnelAssets(
  inputs: WizardInputs,
): Promise<GeneratedFunnelAssets> {
  const context = buildCoachContext(inputs);
  const mock    = generateMockAssets(inputs);
  const style   = pickRandomStyle();

  console.log(`[generate] Copywriter style selected: ${style.name} — ${style.tagline}`);

  // Fire all 3 groups in parallel — Groups 1 & 3 use Sonnet, Group 2 uses Haiku
  const [offerPagesResult, sequencesResult, adsCampaignResult] = await Promise.all([
    callCopyGroup(
      buildOfferPagesPrompt(context, style.promptDescription),
      offerPagesResponseSchema,
      "offer-pages",
      TOKENS.offerPages,
      MODEL_PRIMARY,
    ),
    callCopyGroup(
      buildSequencesPrompt(context, style.promptDescription),
      sequencesResponseSchema,
      "sequences",
      TOKENS.sequences,
      MODEL_FAST,
    ),
    callCopyGroup(
      buildAdsCampaignPrompt(context, style.promptDescription),
      adsCampaignResponseSchema,
      "ads-campaign",
      TOKENS.adsCampaign,
      MODEL_PRIMARY,
    ),
  ]);

  console.log("[design] Claude returned:", offerPagesResult.data?.design);

  // Log any errors for observability
  const errors = [
    offerPagesResult.error,
    sequencesResult.error,
    adsCampaignResult.error,
  ].filter(Boolean);
  if (errors.length > 0) {
    console.warn(
      "[generate] Partial failures, falling back to mock for failed groups:",
      errors,
    );
  }

  // Merge: use AI output if valid, otherwise fall back to the matching mock section
  const offerPages  = offerPagesResult.data  ?? mock;
  const sequences   = sequencesResult.data   ?? mock;
  const adsCampaign = adsCampaignResult.data ?? mock;

  return {
    offerSummary:    offerPages.offerSummary,
    landingPage:     offerPages.landingPage,
    optInForm:       offerPages.optInForm,
    thankYouPage:    offerPages.thankYouPage,
    bookingPage:     offerPages.bookingPage,
    smsSequence:     sequences.smsSequence,
    emailSequence:   sequences.emailSequence,
    adCopy:          adsCampaign.adCopy,
    creativePrompts: adsCampaign.creativePrompts,
    campaignNaming:  adsCampaign.campaignNaming,
    copywriterStyle: `${style.name} — ${style.tagline}`,
    design:          offerPages.design,
  };
}
