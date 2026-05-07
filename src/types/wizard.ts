import { z } from "zod";

// Step 1: Business Basics
export const businessBasicsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  coachName: z.string().min(1, "Coach name is required"),
  location: z.string().min(1, "Location is required"),
  deliveryMode: z.enum(["online", "offline", "hybrid"], {
    required_error: "Please select a delivery mode",
  }),
  targetAudience: z.string().min(10, "Please describe your target audience (at least 10 characters)"),
});

// Step 2: Offer Basics
export const offerBasicsSchema = z.object({
  challengeName: z.string().min(2, "Challenge name is required"),
  challengeType: z.string().optional(),
  mainGoal: z.string().min(10, "Please describe the main goal"),
  duration: z.number().min(7).max(90).default(30),
  price: z.string().min(1, "Price or offer type is required"),
  ctaType: z.enum(["booking", "signup"], {
    required_error: "Please select a CTA type",
  }),
  inclusions: z.string().min(10, "Please list what's included"),
  bonuses: z.string().optional(),
  videoUrl: z.string().optional(), // YouTube/Vimeo embed URL for hero-two-col-video templates
});

// Step 3: Audience Pain Points
export const audiencePainSchema = z.object({
  biggestStruggle: z.string().min(10, "Please describe the biggest struggle"),
  // desiredOutcome removed from the wizard UI — the AI falls back to mainGoal; kept optional for stored data
  desiredOutcome: z.string().optional(),
  objections: z.string().min(10, "Please describe common objections"),
  demographicDetails: z.string().optional(),
  // legacy field kept optional for backward compat
});

// Step 4: Brand Voice
export const brandVoiceSchema = z.object({
  toneOfVoice: z.enum(["friendly", "bold", "premium", "simple", "motivational"], {
    required_error: "Please select a tone",
  }),
  colourScheme: z.enum(["navy-orange", "rose-pink", "teal-forest", "purple-lilac", "sky-blue"]).default("navy-orange"),
  phrasesToInclude: z.string().optional(),
  phrasesToAvoid: z.string().optional(),
  coachPhotoUrl: z.string().optional(), // Coach headshot URL for image-hero templates
});

// Step 5: Traffic Inputs
export const trafficInputsSchema = z.object({
  trafficSources: z
    .array(z.enum(["facebook", "instagram", "google", "local", "organic"]))
    .min(1, "Select at least one traffic source"),
  primaryPlatform: z.enum(["facebook", "instagram", "google", "local", "organic"]).optional(),
  utmNamingPreference: z.string().optional(),
  adBudgetRange: z.string().optional(),
  // primaryPlatform and utmNamingPreference kept optional for backward compat
});

// Step 6: Social Proof
export const socialProofSchema = z.object({
  testimonials: z.string().optional(),
  caseStudySnippets: z.string().optional(),
  resultsHighlights: z.string().optional(),
  hasBeforeAfter: z.boolean().default(false),
  clientCount: z.string().optional(),   // e.g. "500+" — shown in community stats bar
  yearsCoaching: z.string().optional(), // e.g. "7" — shown in credentials strip
  // caseStudySnippets and resultsHighlights kept optional for backward compat
});

// Step 7: Application-funnel-specific details
export const applicationDetailsSchema = z.object({
  programPillars:           z.string().optional(),
  uniqueApproach:           z.string().optional(),
  idealClientProfile:       z.string().optional(),
  notForWho:                z.string().optional(),
  applicationProcess:       z.string().optional(),
  coachingCapacity:         z.string().optional(),
  applicationFormQuestions: z.string().optional(),
});

// Step 8: Coach story (all funnels)
export const coachStorySchema = z.object({
  coachBeforeState:    z.string().optional(),
  coachTurningPoint:  z.string().optional(),
  coachPersonalResult: z.string().optional(),
  coachWhyCoach:      z.string().optional(),
});

// Combined wizard inputs — all steps merged
export const wizardInputsSchema = z.object({
  funnelType: z.enum(["challenge", "application"]).default("challenge"),
  ...businessBasicsSchema.shape,
  ...offerBasicsSchema.shape,
  ...audiencePainSchema.shape,
  ...brandVoiceSchema.shape,
  ...trafficInputsSchema.shape,
  ...socialProofSchema.shape,
  ...applicationDetailsSchema.shape,
  ...coachStorySchema.shape,
  // Extra fields used in seed / generation context
  audienceDemographic:   z.string().optional(),
  coachCredentials:      z.string().optional(),
  namedMethod:           z.string().optional(),
  whatTheyTried:         z.string().optional(),
  roiAnchor:             z.string().optional(),
  cohortStartDate:       z.string().optional(),
  applicationDeadline:   z.string().optional(),
  investmentRange:       z.string().optional(),
  clientTransformations: z.string().optional(),
  bestClientResult:      z.string().optional(),
  utmNamingPreference:   z.string().optional(),
  adBudgetRange:         z.string().optional(),
  videoUrl:              z.string().optional(),
  coachPhotoUrl:         z.string().optional(),
});

export type BusinessBasics = z.infer<typeof businessBasicsSchema>;
export type OfferBasics = z.infer<typeof offerBasicsSchema>;
export type AudiencePain = z.infer<typeof audiencePainSchema>;
export type BrandVoice = z.infer<typeof brandVoiceSchema>;
export type TrafficInputs = z.infer<typeof trafficInputsSchema>;
export type SocialProof = z.infer<typeof socialProofSchema>;
export type ApplicationDetails = z.infer<typeof applicationDetailsSchema>;
export type CoachStoryInputs = z.infer<typeof coachStorySchema>;
export type WizardInputs = z.infer<typeof wizardInputsSchema>;

export const WIZARD_STEPS = [
  { id: 1, title: "Funnel Type",      description: "What are you building?" },
  { id: 2, title: "Business Basics",  description: "Tell us about your business" },
  { id: 3, title: "Your Offer",       description: "Define your offer" },
  { id: 4, title: "Your Audience",    description: "Who are you trying to reach?" },
  { id: 5, title: "Brand Voice",      description: "How do you want to sound?" },
  { id: 6, title: "Traffic",          description: "Where will your leads come from?" },
  { id: 7, title: "Social Proof",     description: "Results, testimonials, and wins" },
] as const;
