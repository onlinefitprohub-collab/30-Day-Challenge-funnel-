/**
 * Core AI generation orchestrator.
 *
 * Makes 5 focused API calls in parallel for challenge funnels — 8 for application funnels.
 * Each call has its own token budget and is validated independently.
 * If a group fails (or ANTHROPIC_API_KEY is absent), it falls back to
 * personalised mock data.
 *
 * Group 1 — Strategy & Pages: offerSummary, landingPage, optInForm, thankYouPage, bookingPage, design
 * Group 2 — Follow-up Sequences: smsSequence, emailSequence
 * Group 3 — Ads & Campaign: adCopy, creativePrompts, campaignNaming
 * Group 4 — Application Landing Page (application funnels only): applicationLandingPage
 * Group 5 — Content Calendar: 30-day organic social plan
 * Group 6 — Delivery Pack: challenge participant communication templates
 * Group 7 — Coaching Tools: testimonialHarvestSequence + pricingGuide
 *
 * Model routing:
 *   All groups → claude-sonnet-4-6
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
import { buildVslScriptPrompt } from "./prompts/vsl-script";
import { buildContentCalendarPrompt } from "./prompts/content-calendar";
import { buildDeliveryPackPrompt } from "./prompts/delivery-pack";
import { buildCoachingToolsPrompt } from "./prompts/coaching-tools";
import { pickRandomStyle } from "./copywriter-styles";
import {
  offerPagesResponseSchema,
  sequencesResponseSchema,
  adsCampaignResponseSchema,
  applicationLandingResponseSchema,
  coachStoryResponseSchema,
  vslScriptResponseSchema,
  contentCalendarResponseSchema,
  deliveryPackResponseSchema,
  coachingToolsResponseSchema,
} from "./validators";
import {
  generateMockAssets, buildMockApplicationLandingPage, buildMockCoachStory,
  buildMockContentCalendar, buildMockDeliveryPack,
  buildMockTestimonialHarvest, buildMockPricingGuide,
} from "./mock";
import type { WizardInputs } from "@/types/wizard";
import type { GeneratedFunnelAssets } from "@/types/generation";

const MODEL_PRIMARY = "claude-sonnet-4-6";

// Token budgets per group — sized to comfortably fit each group's JSON output.
// Sequences and delivery pack produce the most text (10 full email bodies + 30 SMS);
// bumping them to 6000 prevents mid-JSON truncation on longer coaching contexts.
const TOKENS = {
  offerPages:          4096,  // 5 sections + design spec + framework/voice/layout variants
  sequences:           6000,  // 7 SMS + 10 emails with subject + body (was 4500, bumped for long copy)
  adsCampaign:         3200,  // ad copy, creative prompts, campaign naming
  applicationLanding: 10000,  // 29 fields + 9 arrays + 6 client stories (was 8000, bumped for extra 2 stories)
  coachStory:          3500,  // 3 long-form bio sections (300–450 words each) + bridge headline (was 1000)
  vslScript:           5000,  // 11-section VSL — full spoken-word script (was 4000)
  contentCalendar:     4096,  // 30 posts with hook + caption + CTA
  deliveryPack:        6000,  // welcome + 4 weekly emails + 30 daily SMS + completion (was 4500)
  coachingTools:       3000,  // testimonial harvest sequence + pricing guide
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

  // Fire groups in parallel — up to 8 calls for application funnels, 5 for challenge funnels
  const [offerPagesResult, sequencesResult, adsCampaignResult, appLandingResult, coachStoryResult, vslScriptResult, contentCalendarResult, deliveryPackResult, coachingToolsResult] =
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
        MODEL_PRIMARY,
      ),
      callCopyGroup(
        buildAdsCampaignPrompt(context, style.promptDescription),
        adsCampaignResponseSchema,
        "ads-campaign",
        TOKENS.adsCampaign,
        MODEL_PRIMARY,
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
      isApplication
        ? callCopyGroup(
            buildCoachStoryPrompt(context, style.promptDescription, coachStoryInputs),
            coachStoryResponseSchema,
            "coach-story",
            TOKENS.coachStory,
            MODEL_PRIMARY,
          )
        : Promise.resolve({ data: null, error: null, usedFallback: false } as GroupResult<{ coachStory: import("@/types/generation").GeneratedFunnelAssets["coachStory"] }>),
      isApplication
        ? callCopyGroup(
            buildVslScriptPrompt(context, style.promptDescription, "application"),
            vslScriptResponseSchema,
            "vsl-script",
            TOKENS.vslScript,
            MODEL_PRIMARY,
          )
        : callCopyGroup(
            buildVslScriptPrompt(context, style.promptDescription, "challenge"),
            vslScriptResponseSchema,
            "vsl-script",
            TOKENS.vslScript,
            MODEL_PRIMARY,
          ),
      // Group 5 — Content Calendar (all funnels)
      callCopyGroup(
        buildContentCalendarPrompt(context, style.promptDescription),
        contentCalendarResponseSchema,
        "content-calendar",
        TOKENS.contentCalendar,
        MODEL_PRIMARY,
      ),
      // Group 6 — Delivery Pack (all funnels)
      callCopyGroup(
        buildDeliveryPackPrompt(context, style.promptDescription),
        deliveryPackResponseSchema,
        "delivery-pack",
        TOKENS.deliveryPack,
        MODEL_PRIMARY,
      ),
      // Group 7 — Coaching Tools: testimonial harvest + pricing guide (all funnels)
      callCopyGroup(
        buildCoachingToolsPrompt(context, style.promptDescription),
        coachingToolsResponseSchema,
        "coaching-tools",
        TOKENS.coachingTools,
        MODEL_PRIMARY,
      ),
    ]);

  console.log("[design] Claude returned:", offerPagesResult.data?.design);
  console.log("[framework] Claude selected:", offerPagesResult.data?.copywritingFramework, offerPagesResult.data?.copywriterVoice);
  if (isApplication) {
    console.log("=== [application-landing] ===", appLandingResult.error ? `FAILED: ${appLandingResult.error}` : "ok — AI data will be used");
    console.log("=== [coach-story] ===", coachStoryResult.error ? `FAILED: ${coachStoryResult.error}` : (coachStoryResult.data ? "ok" : "skipped (not application funnel)"));
    console.log("=== [application-landing] usedFallback:", appLandingResult.usedFallback, "| data present:", !!appLandingResult.data);
  }
  console.log("=== [vsl-script] ===", vslScriptResult.error ? `FAILED: ${vslScriptResult.error}` : (vslScriptResult.data ? `ok (${isApplication ? "application" : "challenge"})` : "skipped"));

  // Log any errors for observability
  const errors = [
    offerPagesResult.error,
    sequencesResult.error,
    adsCampaignResult.error,
    isApplication ? appLandingResult.error : null,
    isApplication ? coachStoryResult.error : null,
    isApplication ? vslScriptResult.error : null,
    contentCalendarResult.error,
    deliveryPackResult.error,
    coachingToolsResult.error,
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
    ? (coachStoryResult.data?.coachStory ?? buildMockCoachStory(inputs))
    : undefined;

  const vslScript = vslScriptResult.data?.vslScript ?? undefined;

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
    vslScript,
    contentCalendar:             contentCalendarResult.data?.contentCalendar             ?? buildMockContentCalendar(inputs),
    deliveryPack:                deliveryPackResult.data?.deliveryPack                   ?? buildMockDeliveryPack(inputs),
    testimonialHarvestSequence:  coachingToolsResult.data?.testimonialHarvestSequence   ?? buildMockTestimonialHarvest(inputs),
    pricingGuide:                coachingToolsResult.data?.pricingGuide                 ?? buildMockPricingGuide(inputs),
  };
}
