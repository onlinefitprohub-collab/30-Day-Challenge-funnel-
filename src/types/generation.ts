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

// ─── Testimonial Card ────────────────────────────────────────────────────────

export interface TestimonialCard {
  quote: string;
  attribution: string;
}

// ─── Qualification Section ───────────────────────────────────────────────────

export interface QualificationSection {
  shouldntApply: string[];  // 3–6 disqualifiers — who this is NOT for
  shouldApply:   string[];  // 3–6 qualifiers   — who this IS for
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
  videoSectionSubheading?: string;
  heroCtaText: string;
  heroCtaSubtext: string;
  testimonialIntroHeading?: string;
  testimonialVideoQuote?: string;
  credentialItems?: Array<{ label: string; description: string }>;
  benefitBlocks?: Array<{ heading: string; body: string }>;
  midCtaHeading?: string;
  midCtaText?: string;
  painPointHeading?: string;
  dividerHeading: string;
  faqItems: Array<{ question: string; answer: string }>;
  galleryHeading?: string;
  qualificationSectionHeading: string;
  shouldNotApply?: string[];
  shouldApply?: string[];
  textTestimonials: Array<{ quote: string; attribution: string; result: string }>;
  whatYouGetHeading: string;
  whatYouGetBodyCopy?: string;
  whatYouGetItems?: string[];
  whatYouGetBullets?: string[][];
  guaranteeBullets?: string[];
  transformationGalleryHeading: string;
  clientWinsHeading: string;
  clientWins?: Array<{ name: string; result: string }>;
  clientStories: Array<{ storyHeadline: string; intro: string; story: string }>;
  problemBreakdown?: Array<{ title: string; headline: string; body: string }>;
  finalCtaText?: string;
  finalCtaSubtext?: string;
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

// ─── Content Calendar ────────────────────────────────────────────────────────

export interface ContentPost {
  day: number;
  theme: string;
  format: string;        // e.g. "Talking head reel", "Carousel", "Static image"
  hook: string;          // Opening line / scroll-stopper
  caption: string;       // Full post caption
  cta: string;           // Call to action line
}

export interface ContentCalendar {
  strategy: string;      // 2-3 sentence overview of the 30-day strategy
  posts: ContentPost[];  // exactly 30
}

// ─── Challenge Delivery Pack ──────────────────────────────────────────────────

export interface DeliveryWeeklyEmail {
  week: number;
  theme: string;
  subject: string;
  body: string;
}

export interface DeliveryPack {
  welcomeEmail: { subject: string; body: string };
  welcomeSms: string;
  weeklyEmails: DeliveryWeeklyEmail[];  // 4 items
  dailySmsPrompts: string[];            // 30 items — brief daily motivation/check-in
  completionEmail: { subject: string; body: string };
  completionSms: string;
}

// ─── Testimonial Harvest Sequence ────────────────────────────────────────────

export interface TestimonialHarvestSequence {
  day31Email: { subject: string; body: string };
  day33Sms: string;
  day35Email: { subject: string; body: string };
  day38Sms: string;
  referralEmail: { subject: string; body: string };
}

// ─── Pricing & Offer Guide ───────────────────────────────────────────────────

export interface PricingValueItem {
  item: string;
  perceivedValue: string;
  description: string;
}

export interface PricingObjectionHandler {
  objection: string;
  response: string;
}

export interface PricingGuide {
  recommendedPrice: string;
  priceRange: { min: string; max: string };
  rationale: string;
  valueStack: PricingValueItem[];
  positioningStatement: string;
  confidenceScript: string;
  objectionHandlers: PricingObjectionHandler[];
  nextSteps: string[];
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
  coachStory?: { part1: string; part2: string; part3: string; bridgeHeadline: string };
  // Application funnel — AI-generated VSL script (11 sections)
  vslScript?: VslScript;
  // Coaching tools — generated for all funnel types
  contentCalendar?: ContentCalendar;
  deliveryPack?: DeliveryPack;
  testimonialHarvestSequence?: TestimonialHarvestSequence;
  pricingGuide?: PricingGuide;
  // Testimonial cards — used by GHL page builder testimonials section
  testimonialCards?: TestimonialCard[];
  // Qualification section — who should/shouldn't apply (used by GHL page builder)
  qualificationSection?: QualificationSection;
  // Coach bio — used by GHL page builder coach bio section
  coachBio?: string;
  // Discovery call script — on-demand generation
  discoveryCallScript?: import("./discovery-call").DiscoveryCallScript;
  // Instagram DM scripts — on-demand generation
  instagramDmScript?: import("./dm-script").InstagramDmScript;
  // Upsell email sequence — on-demand generation
  upsellSequence?: import("./upsell-sequence").UpsellSequence;
  // Launch roadmap — on-demand generation
  launchRoadmap?: import("./launch-roadmap").LaunchRoadmap;
}

export type OutputSection = keyof GeneratedFunnelAssets;
