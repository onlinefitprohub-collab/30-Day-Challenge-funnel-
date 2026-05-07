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

export interface GhlDesignOverride {
  primaryColor?: string;
  darkBackground?: string;
  midBackground?: string;
  accentColor?: string;
  alternateSectionBackground?: string;
  heroGradient?: string;
}

export interface TestimonialCard {
  quote: string;
  attribution: string;
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
  confirmation: string;
  reminder: string;
  followUp: string;
  noShow: string;
  reEngagement: string;
}

export interface EmailSequence {
  welcome: { subject: string; body: string };
  reminder: { subject: string; body: string };
  objectionHandling: { subject: string; body: string };
  lastChance: { subject: string; body: string };
  reEngagement: { subject: string; body: string };
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
  colourScheme?: string;
  design?: GhlDesignOverride;
  coachBio?: string;
  testimonialCards?: TestimonialCard[];
}

export type OutputSection = keyof GeneratedFunnelAssets;
