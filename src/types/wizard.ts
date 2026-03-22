import { z } from "zod";

// Step 1: Business Basics
export const businessBasicsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  coachName: z.string().min(1, "Coach name is required"),
  location: z.string().min(1, "Location is required"),
  deliveryMode: z.enum(["online", "offline", "hybrid"], {
    required_error: "Please select a delivery mode",
  }),
  targetAudience: z.string().min(10, "Please describe your target audience"),
});

// Step 2: Offer Basics
export const offerBasicsSchema = z.object({
  challengeType: z.string().min(1, "Challenge type is required"),
  mainGoal: z.string().min(10, "Please describe the main goal"),
  duration: z.number().min(7).max(90).default(30),
  price: z.string().min(1, "Price or offer type is required"),
  ctaType: z.enum(["booking", "signup"], {
    required_error: "Please select a CTA type",
  }),
  inclusions: z.string().min(10, "Please list what's included"),
  bonuses: z.string().optional(),
});

// Step 3: Audience Pain Points
export const audiencePainSchema = z.object({
  biggestStruggle: z.string().min(10, "Please describe the biggest struggle"),
  desiredOutcome: z.string().min(10, "Please describe the desired outcome"),
  objections: z.string().min(10, "Please describe common objections"),
  demographicDetails: z.string().optional(),
});

// Step 4: Brand Voice
export const brandVoiceSchema = z.object({
  toneOfVoice: z.enum(
    ["friendly", "bold", "premium", "simple", "motivational"],
    {
      required_error: "Please select a tone",
    }
  ),
  phrasesToInclude: z.string().optional(),
  phrasesToAvoid: z.string().optional(),
});

// Step 5: Traffic & Social Proof
export const trafficSocialSchema = z.object({
  trafficSources: z
    .array(z.enum(["facebook", "instagram", "google", "local", "organic"]))
    .min(1, "Select at least one traffic source"),
  utmNamingPreference: z.string().optional(),
  testimonials: z.string().optional(),
  caseStudySnippets: z.string().optional(),
});

// Combined wizard inputs
export const wizardInputsSchema = z.object({
  ...businessBasicsSchema.shape,
  ...offerBasicsSchema.shape,
  ...audiencePainSchema.shape,
  ...brandVoiceSchema.shape,
  ...trafficSocialSchema.shape,
});

export type BusinessBasics = z.infer<typeof businessBasicsSchema>;
export type OfferBasics = z.infer<typeof offerBasicsSchema>;
export type AudiencePain = z.infer<typeof audiencePainSchema>;
export type BrandVoice = z.infer<typeof brandVoiceSchema>;
export type TrafficSocial = z.infer<typeof trafficSocialSchema>;
export type WizardInputs = z.infer<typeof wizardInputsSchema>;

export const WIZARD_STEPS = [
  { id: 1, title: "Business Basics", description: "Tell us about your business" },
  { id: 2, title: "Your Offer", description: "Define your challenge offer" },
  { id: 3, title: "Your Audience", description: "Who are you trying to reach?" },
  { id: 4, title: "Brand Voice", description: "How do you want to sound?" },
  { id: 5, title: "Traffic & Proof", description: "How will you get leads?" },
] as const;
