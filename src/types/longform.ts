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

export interface SalesLetter {
  headline: string;
  subheadline: string;
  openingHook: string;
  problemAgitation: string;
  bridgeToPossibility: string;
  coachCredentials: string;
  offerReveal: string;
  whatYouGet: WhatYouGetItem[];
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
