export interface UpsellEmail {
  day: number;      // days after challenge completion (e.g. 1, 3, 5, 8, 14)
  purpose: string;  // e.g. "Plant the seed", "Share a result", "Make the offer"
  subject: string;
  body: string;
}

export interface UpsellSequence {
  targetOffer: string;    // what they're upselling to — generated from context
  overview: string;       // 2–3 sentences on the upsell strategy
  emails: UpsellEmail[];  // 5 emails
  smsNudge: string;       // one SMS for non-openers after email 3
}
