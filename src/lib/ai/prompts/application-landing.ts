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
A bold, benefit-rich headline in a 2-column image+text layout. Must use the EXACT audience and programme from the context — never write a generic fitness headline. Pull directly from mainGoal, targetAudience, and the biggest objection in the context.
Format: "[Achieve specific goal] with [Programme Name], even if you [Most common objection #1] and [Most common objection #2]"
Example structure: "Get Back In Shape As A Busy Dad, Even If You've 'Tried Everything' And Think You Don't Have The Time"
DO NOT use generic phrases like "transform your body" or "reach your goals" — name the specific result (e.g. "lose 2 stone", "build visible muscle", "run your first 5k"), the specific audience identity, and their specific objections from the context.

valuePropSubheadline:
1–2 sentences beneath the headline that expand on the specific transformation the prospect can expect. Must name the programme and include a concrete outcome (timeframe, measurement, or vivid result).
CRITICAL: This field MUST reflect the chosen copywriter style in rhythm, word choice, and personality. If the style is punchy and direct (Dan Kennedy, Alex Hormozi), write short declarative sentences with no fluff. If the style is conversational and warm (Frank Kern, Ryan Deiss), use friendly personal language. If story-driven or NLP-based, hint at the journey or the identity shift. 30–45 words.

videoSectionHeading:
A compelling h1 placed above the coach's intro video. Use the programme name and speak to the audience's identity — what are they trying to become? Format the heading as two stacked lines like a proper video overlay: first line is a short context label (e.g. "BECOMING A STRONGER, HEALTHIER [AUDIENCE IDENTITY]"), second line is a bold curiosity question or promise (e.g. "WHAT IS [PROGRAMME NAME]?"). Both lines should be specific to the niche — never generic. 8–14 words total.

videoSectionSubheading:
A supporting line below the video heading explaining why they should watch now. Must reference the transformation or outcome specific to this programme. 12–20 words. Example: "Watch this short video to see exactly how [Programme Name] has helped [audience type] achieve [specific result]."

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
Exactly 5 programme pillars or benefit sections. Draw these DIRECTLY from the 'inclusions', 'programPillars', and 'uniqueApproach' in the context — do not invent generic pillars. If the programme includes nutrition, training, accountability calls, or community, use those exact inclusions.

Each has:
- heading: A benefit-focused heading written as what the CLIENT gets/feels/achieves — NOT the feature name. Never write "A Customised Nutrition Plan" as the heading — write "Stop Guessing What to Eat — Your Plan Is Built Around Your Life, Goals, and Preferences". The heading should make the prospect feel the value. 8–14 words.
- body: 2–3 sentences. First sentence: what this pillar includes specifically (referencing the actual inclusion). Second sentence: the transformation it creates — what changes in the client's daily life. Third sentence (optional): a specific detail that makes it feel premium and personal. Be specific to the niche and audience in the context.

midCtaHeading:
A bold mid-page CTA heading placed directly below the coach bio section. It must reference the audience's biggest struggle from the context (biggestStruggle field) and position the strategy call as the solution to THAT specific problem — not a generic coaching call. Structure: "Tired of [specific pain from biggestStruggle]? Click Below — Let's Build Your Plan Together." Make the struggle name feel real and personal. 10–18 words.

midCtaText:
The CTA button text for the mid-page CTA. Action verb first. Must reference the programme name or the specific transformation. 4–7 words. E.g. "Book My [Programme Name] Strategy Call", "Apply — Get Your Free Plan"

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
A heading introducing the red/green qualification section. Must be specific to this niche and audience — not generic coaching language. Reference the type of person this programme is designed for. E.g. "This Is For [Audience Identity] Who Are Done Making Excuses And Ready To Change". 8–16 words.

shouldNotApply:
Between 5 and 7 bullet points. Each must be a complete, specific sentence — NOT a vague phrase. They should create a clear mental image of the wrong person and make the right person nod in relief. Pull from objections and audience psychology in the context. Cover: mindset not ready for investment; wanting a magic pill or shortcut; unwilling to follow a structured system; not coachable or open to feedback; looking for results without accountability.
Each bullet = 12–22 words. Write as full sentences, not fragments.
Example: "You're looking for a cheap quick fix that promises results without changing your habits."

shouldApply:
Between 5 and 7 bullet points. Each must create a strong identification moment — the ideal client reads this and thinks "that's exactly me." Pull from idealClientProfile, mainGoal, and targetAudience in the context. Cover: readiness to invest in structured support; tired of doing it alone and getting inconsistent results; committed to following a proven system; a specific life situation that matches the target audience; desire for the specific transformation this programme delivers.
Each bullet = 12–22 words. Write as full sentences, not fragments.
Example: "You're a busy dad who's tried the gym alone but keeps falling off — and you're ready for real accountability."

textTestimonials:
Exactly 3 text-based client testimonials. Each has:
- quote: 25–50 words written as if from a real client. Specific result mentioned. First person.
- attribution: "First Name, Title/Location" — e.g. "Sarah T., Busy Mum of 3" or "Mark R., 52, Business Owner"
- result: A short bold result badge (4–8 words). E.g. "Lost 18kg in 12 weeks", "Went from burnout to thriving"

whatYouGetHeading:
Heading for the "What's Included" section. Must name the programme. E.g. "Everything You Get When You Join [Programme Name]". 6–12 words.

whatYouGetBodyCopy:
2–3 persuasive paragraphs (separated by a blank line — use \n\n) that appear below the "what you get" checklist as the final selling copy before the CTA. This is where the reader makes their decision — write it accordingly.
- Paragraph 1 (2–3 sentences): The done-for-you promise — the programme is fully tailored, personalised, and designed specifically for this audience and their situation. Reference the programme name. Make it feel bespoke.
- Paragraph 2 (2–3 sentences): The transformation outcome — what specifically changes in their daily life, energy, confidence, or results. Be concrete and niche-specific. Reference a measurable change where possible.
- Paragraph 3 (2 sentences, optional): The long-term vision — sustainable results, not just a short-term fix. Connect to the reader's deeper motivation (family, identity, health, career).
Must reflect the chosen copywriter style throughout. 100–180 words total.

whatYouGetItems:
Between 6 and 8 items. Draw DIRECTLY from the wizard's 'inclusions' and 'programPillars' — list the ACTUAL things included, not invented ones. Each item follows this format:
"[Feature name] — [specific benefit in the client's language, referencing the outcome it creates]"
Example: "A fully customised nutrition plan — built around your daily routine, calorie target, and food preferences so you always know exactly what to eat"
The feature name is short and specific. The benefit after the dash must be outcome-focused and personal — 12–20 words after the dash. Never use vague language like "helps you achieve your goals".

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

problemBreakdown:
Exactly 5 problems that your ideal client faces. These appear as a "5 Problems" section with red banner headers. Each must be rooted in the actual pain points, objections, and struggles from the context (biggestStruggle, targetAudience, mainGoal). Do NOT use generic fitness problems — name the SPECIFIC issues this audience faces.
Each has:
- title: The red banner headline in ALL CAPS format: "PROBLEM #[N] — [SHORT TITLE]!" (4–6 words after the number). Must be specific to this niche. E.g. "PROBLEM #1 — YOYO DIETS RUINING YOUR PROGRESS!" or "PROBLEM #2 — NO STRUCTURE OR ACCOUNTABILITY!"
- headline: A bold ALL-CAPS sub-headline (10–16 words) that expands the problem with emotional directness. E.g. "THE DIETS YOU'VE TRIED DON'T WORK BECAUSE THEY WEREN'T BUILT FOR YOUR LIFE"
- body: 2 short paragraphs (60–100 words total) that agitate the pain — describe what this problem feels like day-to-day, why it keeps happening, and why willpower alone can't solve it. Reference the specific audience identity and their world. Write in second person ("you").

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
    "whatYouGetBodyCopy": "...",
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
    "problemBreakdown": [
      { "title": "PROBLEM #1 — ...", "headline": "...", "body": "..." },
      { "title": "PROBLEM #2 — ...", "headline": "...", "body": "..." },
      { "title": "PROBLEM #3 — ...", "headline": "...", "body": "..." },
      { "title": "PROBLEM #4 — ...", "headline": "...", "body": "..." },
      { "title": "PROBLEM #5 — ...", "headline": "...", "body": "..." }
    ],
    "finalCtaText": "...",
    "finalCtaSubtext": "..."
  }
}`;
}
