/**
 * Core AI generation orchestrator.
 *
 * Makes 3 focused API calls in parallel for challenge funnels — 4 for application funnels.
 * Each call has its own token budget and is validated independently.
 * If a group fails (or ANTHROPIC_API_KEY is absent), it falls back to
 * personalised mock data.
 *
 * Group 1 — Strategy & Pages: offerSummary, landingPage, optInForm, thankYouPage, bookingPage, design
 * Group 2 — Follow-up Sequences: smsSequence, emailSequence
 * Group 3 — Ads & Campaign: adCopy, creativePrompts, campaignNaming
 * Group 4 — Application Landing Page (application funnels only): applicationLandingPage
 *
 * Model routing:
 *   Group 1 → claude-sonnet-4-6              (offer pages — most complex)
 *   Group 2 → claude-haiku-4-5-20251001      (sequences — mechanical/templated)
 *   Group 3 → claude-haiku-4-5-20251001      (ads campaign — structured JSON)
 *   Group 4 → claude-sonnet-4-6              (22-section registration page — complex copy)
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
import { buildApplicationLandingPrompt } from "./prompts/application-landing";
import { buildCoachStoryPrompt } from "./prompts/coach-story";
import { pickRandomStyle } from "./copywriter-styles";
import {
  offerPagesResponseSchema,
  sequencesResponseSchema,
  adsCampaignResponseSchema,
  applicationLandingResponseSchema,
  coachStoryResponseSchema,
} from "./validators";
import { generateMockAssets, buildMockApplicationLandingPage } from "./mock";
import type { WizardInputs } from "@/types/wizard";
import type { GeneratedFunnelAssets } from "@/types/generation";

const MODEL_PRIMARY = "claude-sonnet-4-6";
const MODEL_FAST    = "claude-haiku-4-5-20251001";

// Token budgets per group — sized to comfortably fit each group's JSON
const TOKENS = {
  offerPages:          4096,  // 5 sections + design spec + framework/voice/layout variants (was 2800 — truncated)
  sequences:           4500,  // 7 SMS + 10 emails with subject + body (expanded lifecycle sequence)
  adsCampaign:         3200,  // ad copy, creative prompts, campaign naming (was 2400 — truncated)
  applicationLanding:  3200,  // 22-section registration page content
  coachStory:          1000,  // 3 bio paragraphs (~300–400 words)
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

  const isApplication = inputs.funnelType === "application";

  const coachStoryInputs = {
    coachName:           inputs.coachName,
    coachBeforeState:    inputs.coachBeforeState,
    coachTurningPoint:   inputs.coachTurningPoint,
    coachPersonalResult: inputs.coachPersonalResult,
    coachWhyCoach:       inputs.coachWhyCoach,
    targetAudience:      inputs.targetAudience,
    mainGoal:            inputs.mainGoal,
    challengeName:       inputs.challengeName,
  };

  const hasStoryInputs = !!(
    inputs.coachBeforeState || inputs.coachTurningPoint ||
    inputs.coachPersonalResult || inputs.coachWhyCoach
  );

  // Fire groups in parallel — up to 5 calls for application funnels, 3 for challenge funnels
  const [offerPagesResult, sequencesResult, adsCampaignResult, appLandingResult, coachStoryResult] =
    await Promise.all([
      callCopyGroup(
        buildOfferPagesPrompt(context, style.promptDescription),
        offerPagesResponseSchema,
        "offer-pages",
        TOKENS.offerPages,
        MODEL_PRIMARY,
      ),
      callCopyGroup(
        buildSequencesPrompt(context, style.promptDescription, inputs.funnelType ?? "challenge"),
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
        MODEL_FAST,
      ),
      isApplication
        ? callCopyGroup(
            buildApplicationLandingPrompt(context, style.promptDescription),
            applicationLandingResponseSchema,
            "application-landing",
            TOKENS.applicationLanding,
            MODEL_PRIMARY,
          )
        : Promise.resolve({ data: null, error: null, usedFallback: false } as GroupResult<{ applicationLandingPage: import("@/types/generation").ApplicationLandingPage }>),
      isApplication && hasStoryInputs
        ? callCopyGroup(
            buildCoachStoryPrompt(context, style.promptDescription, coachStoryInputs),
            coachStoryResponseSchema,
            "coach-story",
            TOKENS.coachStory,
            MODEL_PRIMARY,
          )
        : Promise.resolve({ data: null, error: null, usedFallback: false } as GroupResult<{ coachStory: import("@/types/generation").GeneratedFunnelAssets["coachStory"] }>),
    ]);

  console.log("[design] Claude returned:", offerPagesResult.data?.design);
  console.log("[framework] Claude selected:", offerPagesResult.data?.copywritingFramework, offerPagesResult.data?.copywriterVoice);
  if (isApplication) {
    console.log("[application-landing] result:", appLandingResult.error ?? "ok");
    console.log("[coach-story] result:", coachStoryResult.error ?? (coachStoryResult.data ? "ok" : "skipped"));
  }

  // Log any errors for observability
  const errors = [
    offerPagesResult.error,
    sequencesResult.error,
    adsCampaignResult.error,
    isApplication ? appLandingResult.error : null,
    isApplication ? coachStoryResult.error : null,
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

  const applicationLandingPage = isApplication
    ? (appLandingResult.data?.applicationLandingPage ?? buildMockApplicationLandingPage(inputs))
    : undefined;

  const coachStory = isApplication
    ? (coachStoryResult.data?.coachStory ?? undefined)
    : undefined;

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
    copywriterStyle:       `${style.name} — ${style.tagline}`,
    copywritingFramework:  offerPages.copywritingFramework,
    copywriterVoice:       offerPages.copywriterVoice,
    design:                offerPages.design,
    sectionLayoutVariants: offerPages.sectionLayoutVariants,
    applicationLandingPage,
    coachStory,
  };
}
