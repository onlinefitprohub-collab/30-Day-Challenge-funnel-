/**
 * Application Funnel — 22-Section Registration Page Content
 *
 * Generates: applicationLandingPage
 *
 * This is the main landing/registration page for application-style funnels.
 * It replaces the AI-generated sales letter for application funnels.
 * All copy must be in the chosen copywriter style.
 */

import { buildCopyStandardsBlock, buildAudienceAnalysisBlock } from "../copy-quality";

export function buildApplicationLandingPrompt(
  context: string,
  styleDescription?: string,
): string {
  const styleBlock = styleDescription
    ? `=== COPYWRITER STYLE (MANDATORY — DO NOT DEVIATE) ===

Your copywriting framework and voice have been pre-selected for this funnel. You MUST write ALL copy in exactly this style:

${styleDescription}

Maintain this tone, structure, sentence rhythm, and personality throughout every field. Do not deviate.

`
    : "";

  return `${context}

${styleBlock}${buildAudienceAnalysisBlock()}

${buildCopyStandardsBlock()}

=== YOUR TASK ===

You are a world-class direct response copywriter specialising in high-ticket coaching and transformation programmes. You are writing copy for a 22-section application/registration landing page — the flagship page prospects land on before submitting an application to work with this coach.

This is NOT a challenge funnel. This is an APPLICATION FUNNEL. The reader is applying for a premium coaching programme or transformation system. The copy must:
- Position the coach as a sought-after expert with limited availability
- Qualify prospects so only the right people apply
- Use specific results, credibility signals, and social proof
- Create urgency through scarcity and desirability — not desperation
- Speak directly to the person who is ready to invest in transformation

Generate content for every field in the JSON schema below. Every piece of copy must be specific to the niche, audience, and offer from the context above.

=== FIELD-BY-FIELD INSTRUCTIONS ===

valuePropHeadline:
A bold, benefit-rich headline stating exactly what the programme delivers. Format: "[Join/Discover/Unlock] [specific transformation], even if [common objection]". Make it specific to the niche. 10–15 words max.

valuePropSubheadline:
One sentence expanding the headline — what the prospect will achieve and in what timeframe. Specific, not vague. Max 25 words.

videoSectionHeading:
A compelling h1 placed above the coach's intro video. Should create curiosity or make a bold promise. 8–14 words. E.g. "Watch This Short Video Before You Apply — It Will Change How You See [Goal]"

videoSectionSubheading:
A supporting line below the video heading that reinforces why watching is important. 12–20 words.

heroCtaText:
The primary call-to-action button text. Action-oriented. E.g. "Start Your Application Now", "Apply For Your Spot Today", "Begin Your Application — It Takes 3 Minutes". 4–8 words.

heroCtaSubtext:
A reassurance line below the CTA button. Reduces friction. E.g. "Free strategy consultation included — no payment required to apply". 8–15 words.

testimonialIntroHeading:
A heading introducing the social proof video section. Should reference real client results. E.g. "Here's What Clients Just Like You Are Saying..." or "Don't Take Our Word For It — Hear From [Niche] Clients Who've Transformed". 8–15 words.

testimonialVideoQuote:
A single compelling quote (20–40 words) that represents what a real client might say after completing the programme. Should include a specific result or transformation. Written in first person as if from a real client. No attribution needed here — it's a pull quote displayed under a testimonial video.

credentialItems:
Exactly 4 credential/authority items that establish the coach's credibility. Each has:
- label: Short bold label (2–5 words). E.g. "Certified Nutrition Coach", "10+ Years Experience", "500+ Clients Transformed", "Featured in [Publication]"
- description: 1–2 sentences expanding on the credential and why it matters to the prospect.

benefitBlocks:
Exactly 5 programme pillars or benefit sections. Each represents a core component of what the client gets. Each has:
- heading: A compelling benefit-focused heading (NOT a feature). 5–10 words. E.g. "Stop Guessing — Get a Personalised Nutrition Plan That Actually Works"
- body: 2–3 sentences explaining what this pillar delivers and how it changes the client's life. Be specific to the niche.

midCtaHeading:
A bold mid-page CTA heading. Creates urgency or scarcity. E.g. "Ready to Finally [Achieve Goal]? Applications Are Now Open — But Spaces Are Limited". 10–18 words.

midCtaText:
The CTA button text for the mid-page CTA. 4–7 words. E.g. "Secure Your Application Spot", "Apply Now — Limited Spaces"

painPointHeading:
A bold, visceral rhetorical question or statement that names the single biggest pain the ideal client is living right now. Placed as a section heading just after the coach bio, it bridges the coach's personal struggle into the reader's current situation. E.g. "You Know Exactly How Exhausting It Is To Keep Starting Over, Don't You?", "Nobody Wakes Up Wanting To Feel Invisible In Their Own Body." 10–18 words. Must be emotionally direct — no corporate language.

dividerHeading:
A bold section-break heading used to introduce the qualification section. E.g. "Is This Programme Right For You?", "Before You Apply — Read This Carefully". 5–10 words.

faqItems:
Between 6 and 8 FAQ items. These should address the most common objections and questions prospects have before applying. Each has:
- question: A realistic question a prospect would ask. 8–18 words.
- answer: A warm, direct, reassuring answer. 30–80 words. Reframe objections positively. No fluff.

galleryHeading:
A heading for the transformation/results gallery section. E.g. "Real Results From Real Clients", "What's Possible When You Commit to [Programme Name]". 5–12 words.

qualificationSectionHeading:
A heading introducing the red/green qualification section. E.g. "This Programme Is Designed For a Very Specific Type of Person", "Not Everyone Is Ready For This — Are You?". 8–16 words.

shouldNotApply:
Between 4 and 8 bullet points for the "You Should NOT Apply If..." disqualifier list. These should:
- Describe the wrong mindset (not ready to invest time, money, or effort)
- Mention people who want quick fixes or magic pills
- Mention those who won't implement or are not coachable
- Be specific enough to create contrast — but not aggressive or insulting
Write each as a short phrase (8–18 words).

shouldApply:
Between 4 and 8 bullet points for the "You SHOULD Apply If..." qualifier list. These should:
- Describe the motivated, committed, coachable ideal client
- Reference being ready to invest in themselves and trust a structured system
- Mention specific desires or goals aligned with the programme
- Create a sense of recognition — the right person reads these and thinks "that's me"
Write each as a short phrase (8–18 words).

textTestimonials:
Exactly 3 text-based client testimonials. Each has:
- quote: 25–50 words written as if from a real client. Specific result mentioned. First person.
- attribution: "First Name, Title/Location" — e.g. "Sarah T., Busy Mum of 3" or "Mark R., 52, Business Owner"
- result: A short bold result badge (4–8 words). E.g. "Lost 18kg in 12 weeks", "Went from burnout to thriving"

whatYouGetHeading:
Heading for the "What's Included" section. E.g. "Everything You Get When You Join [Programme Name]", "Here's What's Waiting For You Inside". 6–12 words.

whatYouGetItems:
Between 6 and 8 items listing what's included in the programme. Write each as a compelling benefit statement, not just a feature name. E.g. "Weekly 1-on-1 coaching calls — personalised accountability and strategy every step of the way". 10–20 words each.

transformationGalleryHeading:
Heading for the before/after transformation gallery section. E.g. "The Proof Is In The Results", "These Are Real Transformations From Real People". 5–10 words.

clientWinsHeading:
Heading for the client wins grid. E.g. "More Wins From Our Community", "What Our Clients Are Achieving". 4–8 words.

clientWins:
Between 4 and 8 short client win entries. Each has:
- name: First name + initial only (e.g. "Emma R.", "James K.") — fictional but realistic
- result: A specific, measurable result (e.g. "Down 22kg and off medication", "Ran first 5k after years of inactivity"). 5–12 words.

clientStories:
Exactly 4 longer-form client case studies for the "Meet..." testimonial sections. Each has:
- intro: A compelling single sentence intro naming the client. Uses the "Meet [Name], [a brief situation]..." pattern. Must be specific to the target audience and reflect their situation before joining. E.g. "Meet Sarah, a 38-year-old mum of 2 who had tried every diet going and was ready to give up." 10–20 words.
- story: A 2–3 paragraph first-person client narrative (80–140 words total). Write as if the client is speaking. Cover: (1) their situation and frustration before joining; (2) what changed and a specific result they achieved; (3) their recommendation. Must reference the coach or programme by name where it fits naturally. Be specific: include numbers (lbs lost, weeks, kg, dress sizes, etc.) and emotional detail. Do NOT name the client — the name is in the intro.

finalCtaText:
The final page CTA button text. More urgent/decisive than the mid-page CTA. E.g. "Submit Your Application Now", "Claim Your Spot — Apply Today". 4–7 words.

finalCtaSubtext:
Final reassurance line below the last CTA. Remove any remaining objection. E.g. "No payment today. A member of our team will review your application and reach out within 24 hours." 15–25 words.

=== OUTPUT FORMAT ===

Respond with ONLY valid JSON. No markdown, no explanation, no preamble. The JSON must conform exactly to this structure:

{
  "applicationLandingPage": {
    "valuePropHeadline": "...",
    "valuePropSubheadline": "...",
    "videoSectionHeading": "...",
    "videoSectionSubheading": "...",
    "heroCtaText": "...",
    "heroCtaSubtext": "...",
    "testimonialIntroHeading": "...",
    "testimonialVideoQuote": "...",
    "credentialItems": [
      { "label": "...", "description": "..." },
      { "label": "...", "description": "..." },
      { "label": "...", "description": "..." },
      { "label": "...", "description": "..." }
    ],
    "benefitBlocks": [
      { "heading": "...", "body": "..." },
      { "heading": "...", "body": "..." },
      { "heading": "...", "body": "..." },
      { "heading": "...", "body": "..." },
      { "heading": "...", "body": "..." }
    ],
    "midCtaHeading": "...",
    "midCtaText": "...",
    "painPointHeading": "...",
    "dividerHeading": "...",
    "faqItems": [
      { "question": "...", "answer": "..." }
    ],
    "galleryHeading": "...",
    "qualificationSectionHeading": "...",
    "shouldNotApply": ["...", "..."],
    "shouldApply": ["...", "..."],
    "textTestimonials": [
      { "quote": "...", "attribution": "...", "result": "..." },
      { "quote": "...", "attribution": "...", "result": "..." },
      { "quote": "...", "attribution": "...", "result": "..." }
    ],
    "whatYouGetHeading": "...",
    "whatYouGetItems": ["...", "..."],
    "transformationGalleryHeading": "...",
    "clientWinsHeading": "...",
    "clientWins": [
      { "name": "...", "result": "..." }
    ],
    "clientStories": [
      { "intro": "Meet [Name], ...", "story": "..." },
      { "intro": "Meet [Name], ...", "story": "..." },
      { "intro": "Meet [Name], ...", "story": "..." },
      { "intro": "Meet [Name], ...", "story": "..." }
    ],
    "finalCtaText": "...",
    "finalCtaSubtext": "..."
  }
}`;
}
