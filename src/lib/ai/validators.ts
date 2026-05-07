import { z } from "zod";

// ─── Section schemas ────────────────────────────────────────────────────────

export const offerSummarySchema = z.object({
  challengeConcept:      z.string().min(1),
  targetAudienceSummary: z.string().min(1),
  offerPositioning:      z.string().min(1),
  corePromise:           z.string().min(1),
});

export const landingPageSchema = z.object({
  headlineOptions:       z.array(z.string()).min(1),
  subheadline:           z.string().min(1),
  bulletPoints:          z.array(z.string()).min(1),
  ctaText:               z.string().min(1),
  sectionIdeas:          z.array(z.string()).min(1),
  faqItems:              z.array(z.object({ question: z.string(), answer: z.string() })).min(1),
  urgencyIdeas:          z.array(z.string()).min(1),
  sectionLayoutVariants: z.record(z.string()).optional(),
});

export const optInFormSchema = z.object({
  recommendedFields: z.array(z.string()).min(1),
  formIntroText:     z.string().min(1),
  ctaButtonText:     z.string().min(1),
});

export const thankYouPageSchema = z.object({
  confirmationMessage:  z.string().min(1),
  nextSteps:            z.array(z.string()).min(1),
  bookingEncouragement: z.string().min(1),
});

export const bookingPageSchema = z.object({
  shortIntro:          z.string().min(1),
  whyBook:             z.array(z.string()).min(1),
  expectationSetting:  z.string().min(1),
});

export const smsSequenceSchema = z.object({
  confirmation:  z.string().min(1),
  reminder:      z.string().min(1),
  followUp:      z.string().min(1),
  noShow:        z.string().min(1),
  reEngagement:  z.string().min(1),
});

const emailSchema = z.object({ subject: z.string().min(1), body: z.string().min(1) });

export const emailSequenceSchema = z.object({
  welcome:           emailSchema,
  reminder:          emailSchema,
  objectionHandling: emailSchema,
  lastChance:        emailSchema,
  reEngagement:      emailSchema,
});

export const adCopySchema = z.object({
  hooks:        z.array(z.string()).min(1),
  primaryTexts: z.array(z.string()).min(1),
  headlines:    z.array(z.string()).min(1),
  descriptions: z.array(z.string()).min(1),
});

export const creativePromptsSchema = z.object({
  staticImageIdeas:    z.array(z.string()).min(1),
  talkingHeadPrompts:  z.array(z.string()).min(1),
  beforeAfterConcepts: z.array(z.string()).min(1),
  ugcStylePrompts:     z.array(z.string()).min(1),
});

export const campaignNamingSchema = z.object({
  campaignName:           z.string().min(1),
  adSetNamingConvention:  z.string().min(1),
  adNamingConvention:     z.string().min(1),
  utmSource:              z.string().min(1),
  utmMedium:              z.string().min(1),
  utmCampaign:            z.string().min(1),
  utmContent:             z.string().min(1),
});

// ─── Group response schemas ──────────────────────────────────────────────────

const testimonialCardSchema = z.object({
  quote:       z.string().min(1),
  attribution: z.string().min(1),
});

const ghlDesignOverrideSchema = z.object({
  primaryColor:               z.string().optional(),
  darkBackground:             z.string().optional(),
  midBackground:              z.string().optional(),
  accentColor:                z.string().optional(),
  alternateSectionBackground: z.string().optional(),
  heroGradient:               z.string().optional(),
}).optional();

export const offerPagesResponseSchema = z.object({
  offerSummary:     offerSummarySchema,
  landingPage:      landingPageSchema,
  optInForm:        optInFormSchema,
  thankYouPage:     thankYouPageSchema,
  bookingPage:      bookingPageSchema,
  colourScheme:     z.string().optional(),
  design:           ghlDesignOverrideSchema,
  coachBio:         z.string().optional(),
  testimonialCards: z.array(testimonialCardSchema).optional(),
});

export const sequencesResponseSchema = z.object({
  smsSequence:   smsSequenceSchema,
  emailSequence: emailSequenceSchema,
});

export const adsCampaignResponseSchema = z.object({
  adCopy:          adCopySchema,
  creativePrompts: creativePromptsSchema,
  campaignNaming:  campaignNamingSchema,
});

// ─── Safe parse helpers ──────────────────────────────────────────────────────

interface ParseResult<T> {
  data: T | null;
  error: string | null;
}

/**
 * Safely parses raw JSON string from the AI.
 * Returns { data, error } instead of throwing, so the caller can decide
 * whether to fall back or fail the whole generation.
 */
export function safeParse<T>(
  schema: z.ZodType<T>,
  raw: string,
  groupName: string
): ParseResult<T> {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { data: null, error: `${groupName}: response was not valid JSON` };
  }

  const result = schema.safeParse(json);
  if (result.success) {
    return { data: result.data, error: null };
  }

  // Log the detailed error for debugging, return a summary
  const issues = result.error.issues
    .slice(0, 3)
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join("; ");
  return { data: null, error: `${groupName}: validation failed — ${issues}` };
}
