export interface DiscoveryCallPhase {
  title: string;
  duration: string;
  script: string;        // word-for-word spoken text with personalised inserts woven in
  coachingNotes: string; // delivery tips and branching guidance for the coach
}

export interface DiscoveryCallObjection {
  objection: string;
  response: string;
}

export interface DiscoveryCallScript {
  callOverview: string;
  prepChecklist: string[];                      // 7 items to complete before the call
  openingRapport: DiscoveryCallPhase;           // 5 min — greet, build rapport, transition
  callFrameSetting: DiscoveryCallPhase;         // 3–5 min — set expectations, confirm DM
  painDiscovery: DiscoveryCallPhase;            // 10–15 min — niche-specific probe questions
  reflectionMirroring: DiscoveryCallPhase;      // 3–5 min — mirror back, validate
  futurePacing: DiscoveryCallPhase;             // 5–10 min — vivid outcome picture
  offerPresentation: DiscoveryCallPhase;        // 10 min — programme phases + positioning
  priceReveal: DiscoveryCallPhase;              // 5 min — price + payment framing
  closeAndEnroll: DiscoveryCallPhase;           // 5–10 min — handle final friction, enrol
  objectionScripts: DiscoveryCallObjection[];   // 6–7 common objections with scripted replies
  postCallEmail: { subject: string; body: string };
  callClosingScript: string;                    // graceful wrap-up if they don't enrol today
}
