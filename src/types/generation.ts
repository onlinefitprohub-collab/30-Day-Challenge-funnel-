export interface OfferSummary {
  challengeConcept: string;
  targetAudienceSummary: string;
  offerPositioning: string;
  corePromise: string;
}

export interface LandingPageCopy {
  headlineOptions: string[];
  subheadline: string;
  bulletPoints: string[];
  ctaText: string;
  sectionIdeas: string[];
  faqItems: Array<{ question: string; answer: string }>;
  urgencyIdeas: string[];
  sectionLayoutVariants?: Record<string, string>;
}

export interface OptInFormSuggestions {
  recommendedFields: string[];
  formIntroText: string;
  ctaButtonText: string;
}

export interface ThankYouPageCopy {
  confirmationMessage: string;
  nextSteps: string[];
  bookingEncouragement: string;
}

export interface BookingPageCopy {
  shortIntro: string;
  whyBook: string[];
  expectationSetting: string;
}

export interface SmsSequence {
  // Pre-Challenge
  confirmation: string;
  challengeReminder: string;
  // During Challenge
  dayOneKickoff: string;
  midChallengeMotivation: string;
  noShow: string;
  // Post-Challenge
  challengeComplete: string;
  reEngagement: string;
}

export interface EmailSequence {
  // Pre-Challenge
  welcome: { subject: string; body: string };
  valueDelivery: { subject: string; body: string };
  socialProof: { subject: string; body: string };
  objectionHandling: { subject: string; body: string };
  lastChance: { subject: string; body: string };
  // During Challenge
  dayOneKickoff: { subject: string; body: string };
  midChallenge: { subject: string; body: string };
  finalStretch: { subject: string; body: string };
  // Post-Challenge
  challengeComplete: { subject: string; body: string };
  reEngagement: { subject: string; body: string };
}

// ─── 52-Week Nurture Sequence ────────────────────────────────────────────────

export interface NurtureEmail {
  week: number;
  theme: string;
  subject: string;
  body: string;
}

export interface NurtureSequence {
  generatedAt: string;
  emails: NurtureEmail[]; // 52 items
}

export interface AdCopy {
  hooks: string[];
  primaryTexts: string[];
  headlines: string[];
  descriptions: string[];
}

export interface CreativePrompts {
  staticImageIdeas: string[];
  talkingHeadPrompts: string[];
  beforeAfterConcepts: string[];
  ugcStylePrompts: string[];
}

export interface CampaignNaming {
  campaignName: string;
  adSetNamingConvention: string;
  adNamingConvention: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
}

export interface GeneratedAdImage {
  url: string;
  prompt: string;
  index: number;
}

export interface FunnelDesign {
  heroGradient?: string;
  primaryColor?: string;
  accentColor?: string;
  darkBackground?: string;
  midBackground?: string;
  alternateSectionBackground?: string;
  ctaSectionBackground?: string;
  socialProofBackground?: string;
  textColorOnDark?: string;
  textColorOnLight?: string;
  headlineFontWeight?: string;
  buttonBorderRadius?: string;
}

export interface SectionLayoutVariants {
  hero?: string;
  'social-proof'?: string;
  'whats-included'?: string;
  faq?: string;
  'final-cta'?: string;
}

// ─── Workout Plan types ──────────────────────────────────────────────────────

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;         // "10-12" | "30 seconds" | "to failure"
  rest: string;         // "60 sec" | "90 sec"
  modification?: string;
}

export interface WorkoutDay {
  dayNumber: number;
  type: "strength" | "cardio" | "hiit" | "mobility" | "rest" | "active-recovery";
  sessionName: string;
  durationMins: number;
  warmUp: string;
  exercises: WorkoutExercise[];
  coolDown: string;
}

export interface WorkoutWeek {
  weekNumber: number;
  theme: string;
  focus: string;
  days: WorkoutDay[];
}

export interface WorkoutPlan {
  programName: string;
  programOverview: string;
  equipmentNeeded: string[];
  weeklySchedule: string;
  weeks: WorkoutWeek[];
  nutritionGuidance: string;
  progressionRules: string;
  coachingNotes: string;
}

// ─── GeneratedFunnelAssets ───────────────────────────────────────────────────

export interface GeneratedFunnelAssets {
  offerSummary: OfferSummary;
  landingPage: LandingPageCopy;
  optInForm: OptInFormSuggestions;
  thankYouPage: ThankYouPageCopy;
  bookingPage: BookingPageCopy;
  smsSequence: SmsSequence;
  emailSequence: EmailSequence;
  adCopy: AdCopy;
  creativePrompts: CreativePrompts;
  campaignNaming: CampaignNaming;
  generatedAdImages?: GeneratedAdImage[];
  colourScheme?: string;
  copywriterStyle?: string;
  copywritingFramework?: string;
  copywriterVoice?: string;
  design?: FunnelDesign;
  sectionLayoutVariants?: SectionLayoutVariants;
  landingVariant?: "variant-a";
  // Wizard-sourced fields for template personalisation (persisted alongside AI assets)
  coachVideoUrl?:  string;
  coachPhotoUrl?:  string;
  clientCount?:    string;
  yearsCoaching?:  string;
  templateVariant?: string;
  // On-demand extras (separate generation flows)
  workoutPlan?: WorkoutPlan;
  longFormAssets?: import("./longform").LongFormSalesAssets;
  nurtureSequence?: NurtureSequence;
}

export type OutputSection = keyof GeneratedFunnelAssets;
