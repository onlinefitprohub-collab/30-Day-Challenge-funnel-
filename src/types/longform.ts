export interface WhatYouGetItem {
  name: string;
  description: string;
}

export interface BonusItem {
  name: string;
  description: string;
  valueLabel: string;
}

export interface ObjectionItem {
  objection: string;
  response: string;
}

export interface ProblemItem {
  title: string;    // e.g. "PROBLEM #1 – YOYO DIETS!"
  headline: string; // bold sub-headline expanding on the problem
  body: string;     // 1-2 paragraph explanation
}

export interface TestimonialCaseStudy {
  sectionHeadline: string; // motivational banner, e.g. "WANT TO FEEL MORE CONFIDENT?"
  clientHeadline: string;  // e.g. "Meet Sarah, A Busy Mum Who Lost 3 Stone In 12 Weeks"
  quote: string;           // full testimonial in their voice
  result: string;          // short punchy result caption, e.g. "Lost 3 stone in 12 weeks"
}

export interface SalesLetter {
  headline: string;
  subheadline: string;
  painPointHeadline: string;
  openingHook: string;
  problemAgitation: string;
  problemBreakdown: ProblemItem[];
  bridgeToPossibility: string;
  coachCredentials: string;
  offerReveal: string;
  whatYouGet: WhatYouGetItem[];
  testimonialCaseStudies: TestimonialCaseStudy[];
  testimonialQuotes: string[];
  socialProofFramework: string;
  bonusStack: BonusItem[];
  priceReveal: string;
  guarantee: string;
  objectionHandling: ObjectionItem[];
  urgencySection: string;
  finalCta: string;
}

export interface ManyChatMessage {
  message: string;
  quickReplies: string[];
}

export interface ManyChatFlow {
  welcomeMessage: string;
  qualificationQ1: ManyChatMessage;
  qualificationQ2: ManyChatMessage;
  challengeOverview: string;
  signupCta: string;
  registrationConfirm: string;
  dayOneReminder: string;
  midpointCheckIn: string;
  noShowFollowUp: string;
  setupInstructions: string;
}

export interface LongFormSalesAssets {
  salesLetter: SalesLetter;
  manyChatFlow: ManyChatFlow;
}
