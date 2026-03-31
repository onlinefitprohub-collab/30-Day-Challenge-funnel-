/**
 * Core AI generation orchestrator.
 *
 * Makes 3 focused API calls in parallel — one per section group.
 * Each call has its own token budget and is validated independently.
 * If a group fails (or ANTHROPIC_API_KEY is absent), it falls back to
 * personalised mock data.
 *
 * Group 1 — Strategy & Pages: offerSummary, landingPage, optInForm, thankYouPage, bookingPage, design
 * Group 2 — Follow-up Sequences: smsSequence, emailSequence
 * Group 3 — Ads & Campaign: adCopy, creativePrompts, campaignNaming
 *
 * Model routing:
 *   Group 1 & 3 → claude-sonnet-4-6   (persuasive page + ad copy)
 *   Group 2     → claude-haiku-4-5-20251001  (sequences — coherent at lower cost)
 *
 * Retry: claude-generate handles 529 overload errors automatically (3 attempts,
 * 2-second delay). All other failures fall back to mock.
 */

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
} from "./validators";
import { generateMockAssets } from "./mock";
import type { WizardInputs } from "@/types/wizard";
import type { GeneratedFunnelAssets } from "@/types/generation";

const MODEL_PRIMARY = "claude-sonnet-4-6";
const MODEL_FAST    = "claude-haiku-4-5-20251001";

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

/**
 * Call Claude for a group; fall back to mock (not another provider) on failure.
 * When ANTHROPIC_API_KEY is absent, skips the API call entirely and returns null
 * so the caller uses mock data.
 */
async function callCopyGroup<T>(
  prompt: string,
  schema: Parameters<typeof callClaudeGroup<T>>[1],
  groupName: string,
  maxTokens: number,
  model: string,
): Promise<GroupResult<T>> {
  if (!hasClaude()) {
    console.warn(`[generate] ANTHROPIC_API_KEY not set — using mock for ${groupName}`);
    return { data: null, error: null, usedFallback: true };
  }

  console.log(`[generate] ${groupName} → ${model}`);
  return callClaudeGroup<T>(prompt, schema, groupName, maxTokens, model);
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
