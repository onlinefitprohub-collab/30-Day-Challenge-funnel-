/**
 * Group 1: Strategy & Pages
 * Generates: offerSummary, landingPage, optInForm, thankYouPage, bookingPage
 *
 * The conversion assets — what the prospect sees before and just after opting in.
 * Every word here either earns trust or loses it. No filler.
 */

export function buildOfferPagesPrompt(context: string): string {
  return `${context}

=== YOUR TASK: STRATEGY & PAGES ===

Write the five core funnel assets for this specific coach and challenge. Use the context above to make every piece of copy feel like it was written for this exact person and audience — not a generic fitness challenge template.

─── ASSET-SPECIFIC RULES ───

OFFER SUMMARY
- challengeConcept: 2–3 sentences. Say what it is, who runs it, how long, and what makes it work. Be concrete — name the duration, the format, the coach. No fluff.
- targetAudienceSummary: Name the person this is for. Use their language for their frustration and their goal. If the context mentions demographic details, use them. Make the right person feel instantly seen.
- offerPositioning: Why this vs doing nothing or buying a generic programme? Give a real reason — not "because it's the best". Be honest about what makes it different. Could be the coach's approach, the support structure, the format, the audience specificity.
- corePromise: One sentence. The single most specific and believable outcome. Not the biggest claim — the most credible one.

LANDING PAGE
- headlineOptions: Write 3 headlines, each taking a different angle. Rules:
  * Angle 1: Outcome-led — the specific result they want, tied to the timeframe
  * Angle 2: Pain-led or problem-framing — makes them feel understood
  * Angle 3: Challenge-specific — references the format or structure in a compelling way
  * No headline should start with "Are you..." or "Want to..."
  * No headline should use any of the banned phrases
  * Each headline should be testable on its own — different angle, not just rephrased
- subheadline: 1–2 sentences that follow naturally from whichever headline they pick. Expands what the challenge is and who it's for. Sets up the opt-in without overselling.
- bulletPoints: Write exactly 6. Format: "[specific benefit] — [brief reason it matters]". Rules:
  * The benefit must be tied to what's in the inclusions or the challenge structure
  * The reason must be specific to this audience's situation — not generic
  * Don't start every bullet the same way
  * At least one bullet should address a likely objection
  * If bonuses exist in the context, include at least one
- ctaText: The primary button text. Action verb first. Benefit-hinted or specificity-added. Under 6 words. Not "Click here" or "Get started".
- sectionIdeas: 7 section briefs for the page builder. Each brief says what the section is, what goes in it, and one specific direction based on the coach's context. Not just section names — actual guidance.
- faqItems: Write 4 FAQ pairs. Each must tackle a real objection from the context (check the "Their objections" field). Rules:
  * Questions should sound like something the prospect would actually type or say
  * Answers should be direct, honest, and specific — not reassuring in a vague way
  * At least one answer should reference something specific from the inclusions or structure
  * Don't use "Great question!" or similar opener
- urgencyIdeas: 3 urgency tactics. Rules:
  * Urgency 1: Real scarcity or deadline — something they can actually implement (cohort spots, intake dates, price increase)
  * Urgency 2: Social proof momentum — others joining creates its own urgency
  * Urgency 3: Cost of inaction — what staying stuck actually costs them (time, money, self-respect)
  * Do NOT use fake urgency like "limited time" with no specific limit

OPT-IN FORM
- recommendedFields: The minimum fields needed for the CTA type. If CTA is booking, include phone. Don't over-collect.
- formIntroText: 1–2 lines above the form. Reinforces the main promise, reduces friction. Should feel like the coach speaking, not a UI label.
- ctaButtonText: Matches the landing page CTA in tone and style. Same action, same voice.

THANK YOU PAGE
- confirmationMessage: First thing they see after opting in. Warm and specific — confirms what they just signed up for. Uses {first_name} naturally. Sets the right expectation immediately.
- nextSteps: 3 steps, ordered by priority. The most important action first. Each step is clear and specific — not "check your inbox" as a standalone instruction. Tell them what they'll find there.
- bookingEncouragement: If CTA is booking — make skipping the call feel like a mistake. Specific about what they'll get from the call. If direct sign-up — tell them the most valuable next thing to do (join community, watch intro video, etc.).

BOOKING PAGE
- shortIntro: 2–3 sentences at the top of the booking calendar page. Reassures them they made the right decision. Sets expectations without overselling the call. Acknowledges they're about to book something.
- whyBook: 3 specific reasons to book. Each should be concrete — what they'll walk away with, not just "get expert advice".
- expectationSetting: What happens on the call. Duration, format (Zoom/phone), rough agenda, what they don't need to prepare. Should make the call feel low-effort and high-value.

─── OUTPUT FORMAT ───

Return ONLY this JSON structure. Every string field must contain actual copy, not a description of what to write:

{
  "offerSummary": {
    "challengeConcept": "...",
    "targetAudienceSummary": "...",
    "offerPositioning": "...",
    "corePromise": "..."
  },
  "landingPage": {
    "headlineOptions": ["...", "...", "..."],
    "subheadline": "...",
    "bulletPoints": ["...", "...", "...", "...", "...", "..."],
    "ctaText": "...",
    "sectionIdeas": ["...", "...", "...", "...", "...", "...", "..."],
    "faqItems": [
      { "question": "...", "answer": "..." },
      { "question": "...", "answer": "..." },
      { "question": "...", "answer": "..." },
      { "question": "...", "answer": "..." }
    ],
    "urgencyIdeas": ["...", "...", "..."]
  },
  "optInForm": {
    "recommendedFields": ["...", "..."],
    "formIntroText": "...",
    "ctaButtonText": "..."
  },
  "thankYouPage": {
    "confirmationMessage": "...",
    "nextSteps": ["...", "...", "..."],
    "bookingEncouragement": "..."
  },
  "bookingPage": {
    "shortIntro": "...",
    "whyBook": ["...", "...", "..."],
    "expectationSetting": "..."
  }
}`;
}
