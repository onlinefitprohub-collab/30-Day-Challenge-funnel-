/**
 * Group 1: Strategy & Pages
 * Generates: offerSummary, landingPage, optInForm, thankYouPage, bookingPage
 *
 * The conversion assets — what the prospect sees before and just after opting in.
 * Every word here either earns trust or loses it. No filler.
 */

export function buildOfferPagesPrompt(context: string, style: string): string {
  return `${context}

=== COPYWRITING STYLE ===

${style}

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
- sectionLayoutVariants: For each of the 5 page sections, select the single best layout variant from the lists below. Base your selection on the coach's niche, the content length, and whether visual proof elements (video/image/countdown) feel appropriate. You MUST vary your selections — do not default to the same variant across different generations or niches. Use the coach's context as a clear signal:
  * hero: sports/fitness coaches → prefer 'hero-two-col-video'; nutrition/lifestyle/mindset coaches → prefer 'hero-centered'; online-only or cohort programmes with urgency → prefer 'hero-two-col-countdown'; established coaches with a strong visual brand → consider 'hero-two-col-image' or 'hero-full-width'
  * social-proof-bar: if the coach has specific result numbers → prefer 'social-proof-three-stats' or 'social-proof-centered-stat'; if a testimonial quote is available → prefer 'social-proof-single-quote'; default for new coaches → 'social-proof-stars-bullets'
  * whats-included: long benefit lists (6+ items) → prefer 'included-two-col-bullets' or 'included-single-col-numbered'; visual/transformation programmes → prefer 'included-alternating-rows' or 'included-image-left-list'; quick scannable features → 'included-three-col-checks'
  * faq: 4+ FAQs and coaching niche → prefer 'faq-two-col'; coach has a strong photo → 'faq-image-left'; numbered/structured content → 'faq-numbered'; you want a soft CTA close → 'faq-with-inline-cta'; simple stacked → 'faq-single-col'
  * final-cta: programmes with limited intake → prefer 'cta-with-countdown'; minimal premium feel → 'cta-dark-minimal'; social proof close → 'cta-social-proof-cta'; two-column with direct action → 'cta-two-col-form'; default → 'cta-centered-color-bg'
  Available variant names (only output names from this list):
  hero: hero-centered | hero-two-col-video | hero-two-col-image | hero-two-col-countdown | hero-full-width
  social-proof-bar: social-proof-stars-bullets | social-proof-centered-stat | social-proof-three-stats | social-proof-single-quote | social-proof-horizontal-badges
  whats-included: included-three-col-checks | included-two-col-bullets | included-image-left-list | included-single-col-numbered | included-alternating-rows
  faq: faq-single-col | faq-two-col | faq-image-left | faq-numbered | faq-with-inline-cta
  final-cta: cta-centered-color-bg | cta-two-col-form | cta-with-countdown | cta-dark-minimal | cta-social-proof-cta

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
    "urgencyIdeas": ["...", "...", "..."],
    "sectionLayoutVariants": {
      "hero": "hero-two-col-video",
      "social-proof-bar": "social-proof-stars-bullets",
      "whats-included": "included-three-col-checks",
      "faq": "faq-single-col",
      "final-cta": "cta-centered-color-bg"
    }
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
