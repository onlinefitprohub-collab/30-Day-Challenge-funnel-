/**
 * Group 1: Strategy & Pages
 * Generates: offerSummary, landingPage, coachBio, testimonialCards,
 *            optInForm, thankYouPage, bookingPage
 *
 * The conversion assets — what the prospect sees before and just after opting in.
 * Every word here either earns trust or loses it. No filler.
 */

export function buildOfferPagesPrompt(context: string): string {
  return `${context}

=== YOUR TASK: STRATEGY & PAGES ===

Write the conversion assets for this specific coach and challenge. Use the context above to make every piece of copy feel like it was written for this exact person and audience — not a generic template.

─── ASSET-SPECIFIC RULES ───

OFFER SUMMARY
- challengeConcept: 2–3 sentences. Say what it is, who runs it, how long, and what makes it work. Be concrete — name the duration, the format, the coach. No fluff.
- targetAudienceSummary: Name the person this is for. Use their language for their frustration and their goal. If the context mentions demographic details, use them. Make the right person feel instantly seen.
- offerPositioning: Why this vs doing nothing or buying a generic programme? Give a real reason — not "because it's the best". Be honest about what makes it different.
- corePromise: One sentence. The single most specific and believable outcome. Not the biggest claim — the most credible one.

LANDING PAGE
- headlineOptions: Write 3 headlines. HARD RULES that cannot be broken:
  * MAXIMUM 12 WORDS per headline — count every word, cut if over limit
  * NEVER start with "Are you", "Do you", "Want to", "Who is", or "Who's"
  * NEVER copy the targetAudience field verbatim into a headline
  * Angle 1: Outcome-led — specific result + timeframe. Example: "Lose Your First Stone in 30 Days"
  * Angle 2: Pain-framing — the struggle they recognise. 2 short punchy sentences, max 6 words each
  * Angle 3: Challenge-specific — format, coach, or structure as the hook
  * Each headline tests a completely different angle — not the same thought rephrased
- subheadline: 1–2 sentences. Expands the offer and who it's for. Must NOT reuse any headline wording.
- bulletPoints: Write exactly 6. Format: "[specific mechanism or inclusion] — [why it matters for this audience]". HARD RULES:
  * Every bullet must describe a SPECIFIC INCLUSION, structure feature, or support mechanism from the context — not the overall outcome
  * NO bullet may repeat or closely paraphrase any of the 3 headline options
  * NO bullet may start with "Join", "Experience", or "Achieve"
  * At least one bullet must name a specific inclusion from "What's included" in the context
  * At least one bullet must address a likely objection from the context
  * If bonuses exist, include at least one
- ctaText: The primary button text. Action verb first. Under 6 words. Not "Click here" or "Get started".
- sectionIdeas: 7 section briefs for the page builder. Each gives actual content direction, not just a section name.
- faqItems: Write 4 FAQ pairs. Tackle real objections from the context. Answers must be direct and specific. Never start with "Great question!".
- urgencyIdeas: 3 urgency tactics — real scarcity, social proof momentum, cost of inaction. No fake urgency.

COACH BIO
- coachBio: 3–4 sentences written in first person, as if the coach is speaking. Should cover: who they are, why they created this programme (personal motivation or professional expertise), and the core transformation they've helped clients achieve. Specific and warm — not a résumé. If a case study or testimonial snippet exists in the context, weave in one concrete result. Do NOT use phrases like "I am passionate about" or "I help people achieve their goals".

TESTIMONIAL CARDS
- testimonialCards: Extract and format up to 4 testimonial cards from the "Client testimonials", "Case study/story", and "Results/stats" fields in the context. If no testimonials are provided, leave this as an empty array []. For each card:
  * quote: the actual testimonial text. Clean it up for readability but keep it authentic. 1–3 sentences max.
  * attribution: first name + age or descriptor if available (e.g. "Emma T., 38" or "Sarah, busy mum of 3"). If no name given, use a descriptor that matches the target audience. IMPORTANT: attribution must match the gender of the target audience — if the programme targets women, every attribution must be a woman's name.

OPT-IN FORM
- recommendedFields: Minimum fields for the CTA type. If booking, include phone. Don't over-collect.
- formIntroText: 1–2 lines above the form. Reinforces the main promise, reduces friction. Coach's voice.
- ctaButtonText: Matches the landing page CTA in tone. Same action, same voice.

THANK YOU PAGE
- confirmationMessage: First thing they see. Warm and specific — confirms what they signed up for. Uses {first_name}. Sets expectation immediately.
- nextSteps: 3 steps ordered by priority. Each clear and specific.
- bookingEncouragement: Makes skipping the call feel like a mistake (if booking CTA), or names the most valuable next action (if direct sign-up).

BOOKING PAGE
- shortIntro: 2–3 sentences at the top. Reassures, sets expectations, acknowledges they're about to book.
- whyBook: 3 specific reasons — what they'll walk away with, not vague "expert advice".
- expectationSetting: Duration, format, rough agenda, what not to prepare. Low-effort and high-value framing.

COLOUR SCHEME & LAYOUT VARIANTS
- colourScheme: Pick the ONE key that best fits this brand. "navy-orange" (bold, fitness/performance), "rose-pink" (warm, women's health/wellness), "teal-forest" (calm, nutrition/mindfulness), "purple-lilac" (premium, mindset/coaching), "sky-blue" (professional, business/productivity). Don't default to navy-orange unless it genuinely suits.
- sectionLayoutVariants: Pick ONE variant key per section based on what best fits the brand and message.
  * "hero": "hero-two-col-video" | "hero-centered" | "hero-two-col-image" | "hero-two-col-countdown" | "hero-full-width"
  * "social-proof-bar": "social-proof-stars-bullets" | "social-proof-centered-stat" | "social-proof-three-stats" | "social-proof-single-quote" | "social-proof-horizontal-badges"
  * "whats-included": "included-three-col-checks" | "included-two-col-bullets" | "included-image-left-list" | "included-single-col-numbered" | "included-alternating-rows"
  * "faq": "faq-single-col" | "faq-two-col" | "faq-image-left" | "faq-numbered" | "faq-with-inline-cta"
  * "final-cta": "cta-centered-color-bg" | "cta-two-col-form" | "cta-with-countdown" | "cta-dark-minimal" | "cta-social-proof-cta"

─── OUTPUT FORMAT ───

Return ONLY this JSON structure. Every string field must contain actual copy, not a description of what to write:

{
  "colourScheme": "rose-pink",
  "coachBio": "...",
  "testimonialCards": [
    { "quote": "...", "attribution": "..." },
    { "quote": "...", "attribution": "..." }
  ],
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
