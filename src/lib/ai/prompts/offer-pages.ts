/**
 * Group 1: Strategy & Pages
 * Generates: copywritingFramework, copywriterVoice, design, sectionLayoutVariants,
 *            offerSummary, landingPage, optInForm, thankYouPage, bookingPage
 *
 * The conversion assets — what the prospect sees before and just after opting in.
 * Every word here either earns trust or loses it. No filler.
 */

export function buildOfferPagesPrompt(context: string, styleDescription?: string): string {
  const styleBlock = styleDescription
    ? `=== COPYWRITER STYLE (MANDATORY — DO NOT DEVIATE) ===

Your copywriting framework and voice have been pre-selected for this funnel. You MUST write ALL copy — every headline, bullet, CTA, FAQ answer, and page — in exactly this style:

${styleDescription}

This style applies to every section: landing page, opt-in form, thank you page, booking page. The tone, structure, sentence rhythm, and personality must be consistent throughout. Do not switch styles mid-funnel. Your \`copywritingFramework\` and \`copywriterVoice\` JSON fields must reflect the framework and voice described above.

`
    : `=== STEP 1: CHOOSE YOUR COPYWRITING APPROACH ===

Select the most appropriate framework and voice for this specific offer and audience. Do not default — make a deliberate choice based on the context above.

FRAMEWORKS (pick one):
- PAS: Problem → Agitate → Solution. Best for audiences who are frustrated, stuck, or have tried and failed. Name their exact problem, intensify the pain, present the challenge as the only logical solution.
- AIDA: Attention → Interest → Desire → Action. Best for cold traffic. Hook with bold statement, build curiosity, layer desire through benefits and proof, drive action.
- BAB: Before → After → Bridge. Best for transformation challenges where visual contrast is powerful. Paint the before state vividly, make the after state irresistible, position the challenge as the bridge.
- STORY: Epiphany Bridge / Hero's Journey. Best for personal brand coaches with a compelling backstory. Coach shares their own transformation — audience sees themselves in the story.
- DAN_KENNEDY_DIRECT: Interrupt → Engage → Educate → Offer. Best for sceptical, sophisticated buyers. Pattern-interrupt headline, specificity and proof, reason-why copy, no-brainer offer.

COPYWRITER VOICE (pick one that best matches the brand tone from context):
- GARY_HALBERT: Raw, energetic, intensely personal. Writes as if speaking to one specific person. Extreme specificity ("If you're a 42-year-old dad with a beer belly and a packed calendar..."). Short punchy sentences. Urgency through vivid storytelling.
- DAN_KENNEDY: Direct, no-nonsense, benefit-rich. Assumes the reader is smart and time-poor. Heavy on specificity, proof, reason-why copy. Unapologetic about selling. Makes the offer feel inevitable.
- RUSSELL_BRUNSON: Story-driven, attractive character, epiphany bridge. Makes the coach the hero of a relatable journey. Conversational but structured. Helps readers see the world differently before they buy.
- FRANK_KERN: Casual, future-pacing, results in advance. Writes like a trusted friend. Uses vivid mental imagery to put the reader into the desired future state. Disarms resistance through warmth and personality.
- EUGENE_SCHWARTZ: Desire-focused, meets the market where it is. Writes to the reader's existing desires rather than creating new ones. Copy reads like it came from inside the reader's own head.

`;

  return `${context}

=== YOUR ROLE ===

You are two things simultaneously:
1. A world-class direct response copywriter trained in the methods of Dan Kennedy, Gary Halbert, Russell Brunson, Frank Kern, and Eugene Schwartz
2. A professional funnel designer who understands colour psychology, visual hierarchy, and what makes high-converting landing pages look and feel premium in the GoHighLevel page builder

Your job is to generate a complete, high-converting 30-day challenge funnel AND a precise design specification. Every word, every colour choice, every layout decision must serve one goal: convert the right prospect into a lead or buyer.

${styleBlock}=== STEP 2: DESIGN SPECIFICATION ===

Choose a design that is visually compelling and on-brand for this specific coach, niche, and audience. Do not pick generic defaults — make deliberate choices based on the tone, audience, and niche from the context.

DESIGN PRINCIPLES:
- FITNESS / HIGH-ENERGY / TRANSFORMATION: Dark hero (deep navy, charcoal, or near-black), vivid high-contrast accent (orange, electric green, hot pink, electric blue). Creates energy, urgency, authority.
- WELLNESS / MINDFULNESS / LIFESTYLE: Lighter base tones (warm white, cream, soft sage), muted but elegant accent (terracotta, dusty rose, forest green). Creates calm, trust, aspiration.
- PREMIUM / HIGH-TICKET: Deep rich backgrounds (midnight navy, forest green, dark burgundy), gold or champagne accent. Creates exclusivity.
- FEMALE-SKEWING AUDIENCE: Warmer tones, softer gradients, rose, coral, teal, or blush accents.
- MALE-SKEWING AUDIENCE: Bold contrast, harder edges, electric, metallic, or vivid accent colours.

Choose genuinely on-brand colours — not random. A hero gradient should feel designed, not default.

=== STEP 3: SECTION LAYOUT VARIANTS ===

Select the best layout variant for each section based on the coach's context and available assets.

HERO — pick one:
- 'hero-two-col-video': Left: headline + subheadline + CTA. Right: video embed. Best when coach has or can record an intro video. Highest-converting hero layout.
- 'hero-centered': Full-width centred headline + subheadline + CTA. Best for bold single-hook offers. Clean and premium.
- 'hero-two-col-image': Left: copy. Right: coach photo or result image. Best when no video available.
- 'hero-two-col-countdown': Left: copy + CTA. Right: countdown timer. Best for cohort challenges with a real deadline.
- 'hero-full-width': Full-width background image with centred copy overlay. Best for strong lifestyle photography.

SOCIAL PROOF — pick one:
- 'social-proof-three-stats': Three numbers side by side. Best when strong stats exist (clients, rating, results).
- 'social-proof-stars-bullets': Star rating + 3 short proof bullets. Best for coaches with strong testimonial language.
- 'social-proof-centered-stat': One dominant number centred. Best when one stat outweighs all others.
- 'social-proof-single-quote': One killer client quote, large and centred. Best for high-trust personal brands.
- 'social-proof-horizontal-badges': Row of trust badges or certification logos. Best for established coaches with credentials or press.

WHAT'S INCLUDED — pick one:
- 'included-three-col-checks': Three columns of check-mark benefits. Best for 6+ inclusions.
- 'included-two-col-image': Image left, benefits list right. Best for visual offers with a strong programme image.
- 'included-icon-grid': Icon grid with titles. Best for clean modern brands.
- 'included-bold-list': Large numbered or bulleted list. Best for simple offers where clarity beats design.
- 'included-alternating': Alternating image-text rows per inclusion. Best for premium offers where each item deserves a spotlight.

FAQ — pick one:
- 'faq-single-col': Single-column accordion. Clean and functional. Works for most cases.
- 'faq-two-col': Two-column accordion. Best for 6+ FAQ items.
- 'faq-image-left': Coach photo left, FAQ right. Best when social proof anchors the FAQ.
- 'faq-numbered': Numbered FAQ items. Best for objection-heavy audiences needing structured reassurance.
- 'faq-with-inline-cta': FAQ with CTA below. Best for long pages needing a mid-page conversion point.

FINAL CTA — pick one:
- 'cta-centered-color-bg': Centred headline + CTA on coloured background. Most conversion-tested.
- 'cta-two-col-image': Image left, CTA right. Best when a strong result image can anchor the close.
- 'cta-dark-minimal': Dark background, minimal copy, single large CTA. Best for premium feel.
- 'cta-social-proof-cta': Stats or quote above the CTA. Best for sceptical audiences needing final reassurance.
- 'cta-split-countdown': Countdown timer + CTA side by side. Best for deadline-driven cohort offers.

=== STEP 4: COPY ASSETS ===

Apply your selected framework and voice consistently across ALL copy below. The tone, structure, and personality must be coherent from headline to booking page.

─── RULES ───

OFFER SUMMARY
- challengeConcept: 2–3 sentences. What it is, who runs it, how it works. Concrete — name the format, duration, delivery. The elevator pitch.
- targetAudienceSummary: The specific person this is for. Use their language for their frustration and goal. If demographics are in the context, use them.
- offerPositioning: Why this over doing nothing, or a generic programme. Give a real reason — the coach's method, the support structure, the audience specificity.
- corePromise: One sentence. The most specific, believable outcome. Not the biggest claim — the most credible one.

LANDING PAGE
- headlineOptions: 3 headlines, each a different angle:
  * Angle 1: Outcome-led — specific result tied to timeframe. Use numbers.
  * Angle 2: Problem/identity-led — names who they are and what's holding them back. Makes them feel seen.
  * Angle 3: Mechanism-led — what makes this challenge different from everything else they've tried.
  Rules: No headline starts with "Are you..." or "Want to...". Each must be independently testable.
- subheadline: 1–2 sentences. Answers "what is this and who is it for?" Reduces friction.
- bulletPoints: Exactly 6. Format: "[specific outcome or inclusion] — [specific reason it matters to THIS audience]". At least one addresses an objection. At least one references a specific inclusion. Don't start every bullet the same way.
- ctaText: Under 6 words. Action verb first. Benefit-hinted. Not "Get started" or "Click here".
- sectionIdeas: Exactly 7 section briefs following this structure:
  1. Hero — above-the-fold hook
  2. Social proof bar — trust anchors immediately below hero
  3. Problem/pain — agitate the struggle before presenting the solution
  4. What's included — full offer breakdown
  5. Testimonials/results — client wins, before/after, social proof stories
  6. FAQ — top objections from the context
  7. Final CTA — close with urgency and one clear action
  Each brief includes what goes in it and one specific directional note from this coach's context.
- faqItems: 4 FAQ pairs. Questions must sound like something the actual prospect would say out loud. Pull from the objections in the context. Answers are direct, specific, honest — no "Great question!" openers.
- urgencyIdeas: 3 tactics for the COACH TO IMPLEMENT — these are instructions, not page copy:
  * Real scarcity or deadline with specific mechanic
  * Social momentum (others joining creates pull)
  * Cost of inaction (time, money, or identity cost of staying stuck)
  No fake urgency.

OPT-IN FORM
- recommendedFields: Minimum fields for the CTA type. If booking, include phone.
- formIntroText: 1–2 lines above the form. Reinforces main promise. Coach's voice.
- ctaButtonText: Match landing page CTA voice.

THANK YOU PAGE
- confirmationMessage: First thing after opt-in. Warm, specific, uses {first_name}. Confirms exactly what they signed up for.
- nextSteps: 3 steps, ordered by priority. Specific — not "check your inbox" as a standalone.
- bookingEncouragement: If booking CTA — make skipping the call feel like a real mistake. If direct sign-up — the most valuable next action.

BOOKING PAGE
- shortIntro: 2–3 sentences. Reassures them, sets expectation, acknowledges they're about to book.
- whyBook: 3 concrete reasons — what they walk away with, not "expert advice".
- expectationSetting: Duration, format, rough agenda, what they don't need to prepare. Low-effort, high-value.

─── OUTPUT FORMAT ───

Return ONLY this JSON. Every string must contain actual copy — no placeholders:

{
  "copywritingFramework": "PAS",
  "copywriterVoice": "DAN_KENNEDY",
  "design": {
    "heroGradient": "linear-gradient(135deg, #0d1f2d 0%, #1a3a4a 100%)",
    "primaryColor": "#f97316",
    "accentColor": "#f97316",
    "darkBackground": "#0d1f2d",
    "midBackground": "#1a2e3b",
    "alternateSectionBackground": "#f8fafc",
    "ctaSectionBackground": "#f97316",
    "socialProofBackground": "#0f172a",
    "textColorOnDark": "#ffffff",
    "textColorOnLight": "#111827",
    "headlineFontWeight": "900",
    "buttonBorderRadius": "8px"
  },
  "sectionLayoutVariants": {
    "hero": "hero-two-col-video",
    "social-proof": "social-proof-three-stats",
    "whats-included": "included-three-col-checks",
    "faq": "faq-single-col",
    "final-cta": "cta-centered-color-bg"
  },
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
