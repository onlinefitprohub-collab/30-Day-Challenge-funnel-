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
  // Pre-Challenge
  confirmation:           z.string().min(1),
  challengeReminder:      z.string().min(1),
  // During Challenge
  dayOneKickoff:          z.string().min(1),
  midChallengeMotivation: z.string().min(1),
  noShow:                 z.string().min(1),
  // Post-Challenge
  challengeComplete:      z.string().min(1),
  reEngagement:           z.string().min(1),
});

const emailSchema = z.object({ subject: z.string().min(1), body: z.string().min(1) });

export const emailSequenceSchema = z.object({
  // Pre-Challenge
  welcome:           emailSchema,
  valueDelivery:     emailSchema,
  socialProof:       emailSchema,
  objectionHandling: emailSchema,
  lastChance:        emailSchema,
  // During Challenge
  dayOneKickoff:     emailSchema,
  midChallenge:      emailSchema,
  finalStretch:      emailSchema,
  // Post-Challenge
  challengeComplete: emailSchema,
  reEngagement:      emailSchema,
});

// ─── 52-Week Nurture schemas ─────────────────────────────────────────────────

export const nurtureEmailSchema = z.object({
  week:    z.number().int().min(1).max(52),
  theme:   z.string().min(1),
  subject: z.string().min(1),
  body:    z.string().min(1),
});

export const nurtureSequenceSchema = z.object({
  generatedAt: z.string().min(1),
  emails:      z.array(nurtureEmailSchema).min(52).max(52),
});

export const nurtureBatchSchema = z.object({
  emails: z.array(nurtureEmailSchema).min(13).max(13),
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

export const designSchema = z.object({
  heroGradient:               z.string().optional(),
  primaryColor:               z.string().optional(),
  accentColor:                z.string().optional(),
  darkBackground:             z.string().optional(),
  midBackground:              z.string().optional(),
  alternateSectionBackground: z.string().optional(),
  ctaSectionBackground:       z.string().optional(),
  socialProofBackground:      z.string().optional(),
  textColorOnDark:            z.string().optional(),
  textColorOnLight:           z.string().optional(),
  headlineFontWeight:         z.string().optional(),
  buttonBorderRadius:         z.string().optional(),
});

export const sectionLayoutVariantsSchema = z.object({
  hero:             z.string().optional(),
  'social-proof':   z.string().optional(),
  'whats-included': z.string().optional(),
  faq:              z.string().optional(),
  'final-cta':      z.string().optional(),
});

// ─── Group response schemas ──────────────────────────────────────────────────

export const offerPagesResponseSchema = z.object({
  copywritingFramework:  z.string().optional(),
  copywriterVoice:       z.string().optional(),
  design:                designSchema.optional(),
  sectionLayoutVariants: sectionLayoutVariantsSchema.optional(),
  offerSummary:          offerSummarySchema,
  landingPage:           landingPageSchema,
  optInForm:             optInFormSchema,
  thankYouPage:          thankYouPageSchema,
  bookingPage:           bookingPageSchema,
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

// ─── Workout Plan schemas ────────────────────────────────────────────────────

export const workoutExerciseSchema = z.object({
  name:         z.string().min(1),
  sets:         z.number().int().min(0),
  reps:         z.string().min(1),
  rest:         z.string().min(1),
  modification: z.string().optional(),
});

export const workoutDaySchema = z.object({
  dayNumber:    z.number().int().min(1),
  type:         z.enum(["strength", "cardio", "hiit", "mobility", "rest", "active-recovery"]),
  sessionName:  z.string().min(1),
  durationMins: z.number().int().min(0),
  warmUp:       z.string().min(1),
  exercises:    z.array(workoutExerciseSchema),
  coolDown:     z.string().min(1),
});

export const workoutWeekSchema = z.object({
  weekNumber: z.number().int().min(1),
  theme:      z.string().min(1),
  focus:      z.string().min(1),
  days:       z.array(workoutDaySchema).min(7),
});

export const workoutPlanSchema = z.object({
  programName:       z.string().min(1),
  programOverview:   z.string().min(1),
  equipmentNeeded:   z.array(z.string()).min(1),
  weeklySchedule:    z.string().min(1),
  weeks:             z.array(workoutWeekSchema).min(4).max(4),
  nutritionGuidance: z.string().min(1),
  progressionRules:  z.string().min(1),
  coachingNotes:     z.string().min(1),
});

// ─── Long-Form Sales Assets schemas ─────────────────────────────────────────

export const salesLetterSchema = z.object({
  headline:             z.string().min(1),
  subheadline:          z.string().min(1),
  openingHook:          z.string().min(1),
  problemAgitation:     z.string().min(1),
  bridgeToPossibility:  z.string().min(1),
  coachCredentials:     z.string().min(1),
  offerReveal:          z.string().min(1),
  whatYouGet:           z.array(z.object({ name: z.string().min(1), description: z.string().min(1) })).min(1),
  socialProofFramework: z.string().min(1),
  bonusStack:           z.array(z.object({ name: z.string().min(1), description: z.string().min(1), valueLabel: z.string().min(1) })).min(1),
  priceReveal:          z.string().min(1),
  guarantee:            z.string().min(1),
  objectionHandling:    z.array(z.object({ objection: z.string().min(1), response: z.string().min(1) })).min(1),
  urgencySection:       z.string().min(1),
  finalCta:             z.string().min(1),
});

const manyChatMessageSchema = z.object({
  message:      z.string().min(1),
  quickReplies: z.array(z.string().min(1)).min(1).max(3),
});

export const manyChatFlowSchema = z.object({
  welcomeMessage:      z.string().min(1),
  qualificationQ1:     manyChatMessageSchema,
  qualificationQ2:     manyChatMessageSchema,
  challengeOverview:   z.string().min(1),
  signupCta:           z.string().min(1),
  registrationConfirm: z.string().min(1),
  dayOneReminder:      z.string().min(1),
  midpointCheckIn:     z.string().min(1),
  noShowFollowUp:      z.string().min(1),
  setupInstructions:   z.string().min(1),
});

// ─── Application Landing Page schema ────────────────────────────────────────

const credentialItemSchema = z.object({ label: z.string().min(1), description: z.string().min(1) });
const benefitBlockSchema   = z.object({ heading: z.string().min(1), body: z.string().min(1) });
const faqItemSchema        = z.object({ question: z.string().min(1), answer: z.string().min(1) });
const textTestimonialSchema = z.object({ quote: z.string().min(1), attribution: z.string().min(1), result: z.string().min(1) });
const clientWinSchema      = z.object({ name: z.string().min(1), result: z.string().min(1) });

export const applicationLandingPageSchema = z.object({
  valuePropHeadline:            z.string().min(1),
  valuePropSubheadline:         z.string().min(1),
  videoSectionHeading:          z.string().min(1),
  videoSectionSubheading:       z.string().min(1),
  heroCtaText:                  z.string().min(1),
  heroCtaSubtext:               z.string().min(1),
  testimonialIntroHeading:      z.string().min(1),
  testimonialVideoQuote:        z.string().min(1),
  credentialItems:              z.array(credentialItemSchema).length(4),
  benefitBlocks:                z.array(benefitBlockSchema).length(5),
  midCtaHeading:                z.string().min(1),
  midCtaText:                   z.string().min(1),
  dividerHeading:               z.string().min(1),
  faqItems:                     z.array(faqItemSchema).min(4).max(8),
  galleryHeading:               z.string().min(1),
  qualificationSectionHeading:  z.string().min(1),
  shouldNotApply:               z.array(z.string().min(1)).min(4).max(8),
  shouldApply:                  z.array(z.string().min(1)).min(4).max(8),
  textTestimonials:             z.array(textTestimonialSchema).length(3),
  whatYouGetHeading:            z.string().min(1),
  whatYouGetItems:              z.array(z.string().min(1)).min(4).max(10),
  transformationGalleryHeading: z.string().min(1),
  clientWinsHeading:            z.string().min(1),
  clientWins:                   z.array(clientWinSchema).min(4).max(8),
  finalCtaText:                 z.string().min(1),
  finalCtaSubtext:              z.string().min(1),
});

export const applicationLandingResponseSchema = z.object({
  applicationLandingPage: applicationLandingPageSchema,
});

// ─── Coach Story schema ──────────────────────────────────────────────────────

export const coachStoryPartsSchema = z.object({
  part1: z.string().min(1),
  part2: z.string().min(1),
  part3: z.string().min(1),
});

export const coachStoryResponseSchema = z.object({
  coachStory: coachStoryPartsSchema,
});

// ─── VSL Script schema ───────────────────────────────────────────────────────

export const vslScriptSchema = z.object({
  hook:                   z.string().min(1),
  problemStatement:       z.string().min(1),
  agitation:              z.string().min(1),
  coachStoryBridge:       z.string().min(1),
  solutionReveal:         z.string().min(1),
  programmeWalkthrough:   z.string().min(1),
  socialProof:            z.string().min(1),
  offerPresentation:      z.string().min(1),
  objectionHandling:      z.string().min(1),
  callToAction:           z.string().min(1),
  closingScarcity:        z.string().min(1),
});

export const vslScriptResponseSchema = z.object({
  vslScript: vslScriptSchema,
});

// ─── Content Calendar schema ─────────────────────────────────────────────────

export const contentPostSchema = z.object({
  day:     z.number().int().min(1).max(30),
  theme:   z.string().min(1),
  format:  z.string().min(1),
  hook:    z.string().min(1),
  caption: z.string().min(1),
  cta:     z.string().min(1),
});

export const contentCalendarSchema = z.object({
  strategy: z.string().min(1),
  posts:    z.array(contentPostSchema).min(28).max(31),
});

export const contentCalendarResponseSchema = z.object({
  contentCalendar: contentCalendarSchema,
});

// ─── Delivery Pack schema ─────────────────────────────────────────────────────

const emailBlockSchema = z.object({ subject: z.string().min(1), body: z.string().min(1) });

export const deliveryPackSchema = z.object({
  welcomeEmail:     emailBlockSchema,
  welcomeSms:       z.string().min(1),
  weeklyEmails:     z.array(z.object({
    week:    z.number().int().min(1).max(4),
    theme:   z.string().min(1),
    subject: z.string().min(1),
    body:    z.string().min(1),
  })).min(4).max(4),
  dailySmsPrompts:  z.array(z.string().min(1)).min(28).max(31),
  completionEmail:  emailBlockSchema,
  completionSms:    z.string().min(1),
});

export const deliveryPackResponseSchema = z.object({
  deliveryPack: deliveryPackSchema,
});

// ─── Testimonial Harvest Sequence schema ─────────────────────────────────────

export const testimonialHarvestSchema = z.object({
  day31Email:   emailBlockSchema,
  day33Sms:     z.string().min(1),
  day35Email:   emailBlockSchema,
  day38Sms:     z.string().min(1),
  referralEmail: emailBlockSchema,
});

export const testimonialHarvestResponseSchema = z.object({
  testimonialHarvestSequence: testimonialHarvestSchema,
});

// ─── Pricing Guide schema ─────────────────────────────────────────────────────

export const pricingGuideSchema = z.object({
  recommendedPrice:    z.string().min(1),
  priceRange:          z.object({ min: z.string().min(1), max: z.string().min(1) }),
  rationale:           z.string().min(1),
  valueStack:          z.array(z.object({
    item:            z.string().min(1),
    perceivedValue:  z.string().min(1),
    description:     z.string().min(1),
  })).min(4).max(8),
  positioningStatement: z.string().min(1),
  confidenceScript:     z.string().min(1),
  objectionHandlers:    z.array(z.object({
    objection: z.string().min(1),
    response:  z.string().min(1),
  })).min(3).max(5),
  nextSteps:            z.array(z.string().min(1)).min(3).max(6),
});

export const coachingToolsResponseSchema = z.object({
  pricingGuide:               pricingGuideSchema,
  testimonialHarvestSequence: testimonialHarvestSchema,
});

// ─── Discovery Call Script schema ────────────────────────────────────────────

const discoveryCallPhaseSchema = z.object({
  title:         z.string().min(1),
  duration:      z.string().min(1),
  script:        z.string().min(1),
  coachingNotes: z.string().min(1),
});

const discoveryCallObjectionSchema = z.object({
  objection: z.string().min(1),
  response:  z.string().min(1),
});

export const discoveryCallScriptSchema = z.object({
  callOverview:       z.string().min(1),
  prepChecklist:      z.array(z.string().min(1)).min(5),
  openingRapport:     discoveryCallPhaseSchema,
  callFrameSetting:   discoveryCallPhaseSchema,
  painDiscovery:      discoveryCallPhaseSchema,
  reflectionMirroring: discoveryCallPhaseSchema,
  futurePacing:       discoveryCallPhaseSchema,
  offerPresentation:  discoveryCallPhaseSchema,
  priceReveal:        discoveryCallPhaseSchema,
  closeAndEnroll:     discoveryCallPhaseSchema,
  objectionScripts:   z.array(discoveryCallObjectionSchema).min(4),
  postCallEmail:      z.object({ subject: z.string().min(1), body: z.string().min(1) }),
  callClosingScript:  z.string().min(1),
});

export const discoveryCallScriptResponseSchema = z.object({
  discoveryCallScript: discoveryCallScriptSchema,
});

// ─── Instagram DM Script schema ───────────────────────────────────────────────

const dmConversationScriptSchema = z.object({
  trigger:        z.string().min(1),
  opener:         z.string().min(1),
  followUps:      z.array(z.string().min(1)).min(2),
  bookingBridge:  z.string().min(1),
  coachingNotes:  z.string().min(1),
});

export const instagramDmScriptSchema = z.object({
  overview:             z.string().min(1),
  coldOutreach:         dmConversationScriptSchema,
  warmLead:             dmConversationScriptSchema,
  commentToDm:          dmConversationScriptSchema,
  applicationInquiry:   dmConversationScriptSchema,
  noResponseFollowUp:   z.string().min(1),
  dmTips:               z.array(z.string().min(1)).min(5),
});

export const instagramDmScriptResponseSchema = z.object({
  instagramDmScript: instagramDmScriptSchema,
});

// ─── Upsell Email Sequence schema ─────────────────────────────────────────────

export const upsellSequenceSchema = z.object({
  targetOffer: z.string().min(1),
  overview:    z.string().min(1),
  emails:      z.array(z.object({
    day:     z.number().int().min(1),
    purpose: z.string().min(1),
    subject: z.string().min(1),
    body:    z.string().min(1),
  })).min(5).max(5),
  smsNudge:    z.string().min(1),
});

export const upsellSequenceResponseSchema = z.object({
  upsellSequence: upsellSequenceSchema,
});

// ─── Launch Roadmap schema ────────────────────────────────────────────────────

const roadmapTaskSchema = z.object({
  task:          z.string().min(1),
  category:      z.enum(["setup", "content", "ads", "sales", "delivery", "growth"]),
  fitproAsset:   z.string().optional(),
  timeEstimate:  z.string().min(1),
});

const roadmapPhaseSchema = z.object({
  name:              z.string().min(1),
  timing:            z.string().min(1),
  goal:              z.string().min(1),
  tasks:             z.array(roadmapTaskSchema).min(3),
  completionMarker:  z.string().min(1),
});

export const launchRoadmapSchema = z.object({
  overview:               z.string().min(1),
  totalTimeToLaunch:      z.string().min(1),
  phases:                 z.array(roadmapPhaseSchema).min(4),
  quickStartPriorities:   z.array(z.string().min(1)).min(5),
  commonMistakes:         z.array(z.string().min(1)).min(4),
});

export const launchRoadmapResponseSchema = z.object({
  launchRoadmap: launchRoadmapSchema,
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
