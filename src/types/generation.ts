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

// ─── Application Landing Page ────────────────────────────────────────────────

export interface ApplicationLandingPage {
  valuePropHeadline: string;
  valuePropSubheadline: string;
  videoSectionHeading: string;
  videoSectionSubheading: string;
  heroCtaText: string;
  heroCtaSubtext: string;
  testimonialIntroHeading: string;
  testimonialVideoQuote: string;
  credentialItems: Array<{ label: string; description: string }>;   // exactly 4
  benefitBlocks: Array<{ heading: string; body: string }>;          // exactly 5
  midCtaHeading: string;
  midCtaText: string;
  dividerHeading: string;
  faqItems: Array<{ question: string; answer: string }>;            // 4–8 items
  galleryHeading: string;
  qualificationSectionHeading: string;
  shouldNotApply: string[];   // 4–8 disqualifiers
  shouldApply: string[];      // 4–8 qualifiers
  textTestimonials: Array<{ quote: string; attribution: string; result: string }>; // 3
  whatYouGetHeading: string;
  whatYouGetItems: string[];  // 6–8 items
  transformationGalleryHeading: string;
  clientWinsHeading: string;
  clientWins: Array<{ name: string; result: string }>;              // 4–8 items
  finalCtaText: string;
  finalCtaSubtext: string;
}

// ─── VSL Script ─────────────────────────────────────────────────────────────

export interface VslScript {
  hook: string;               // First 30–60s — pattern interrupt + bold statement
  problemStatement: string;   // The pain — vivid and specific
  agitation: string;          // Make it worse — cost of staying stuck
  coachStoryBridge: string;   // Coach journey + turning point + how they solved it
  solutionReveal: string;     // Unique mechanism — why THIS approach works
  programmeWalkthrough: string; // What they get — pillars, deliverables, timeline
  socialProof: string;        // Client results and transformations (scripted)
  offerPresentation: string;  // The investment, value stack, payment options
  objectionHandling: string;  // Top 3 objections addressed in script form
  callToAction: string;       // The close — specific action to take right now
  closingScarcity: string;    // Final urgency — deadline, spots, FOMO
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
  coachName?:      string;
  coachVideoUrl?:  string;
  coachPhotoUrl?:  string;
  clientCount?:    string;
  yearsCoaching?:  string;
  templateVariant?: string;
  // Funnel type — determines tab set, sequence copy, and preview behaviour
  funnelType?: "challenge" | "application";
  // On-demand extras (separate generation flows)
  workoutPlan?: WorkoutPlan;
  longFormAssets?: import("./longform").LongFormSalesAssets;
  nurtureSequence?: NurtureSequence;
  // Application funnel — 22-section registration page (generated in parallel with other copy)
  applicationLandingPage?: ApplicationLandingPage;
  // Application funnel — AI-generated first-person coach bio (3 paragraphs from wizard story inputs)
  coachStory?: { part1: string; part2: string; part3: string };
  // Application funnel — AI-generated VSL script (11 sections)
  vslScript?: VslScript;
}

export type OutputSection = keyof GeneratedFunnelAssets;
