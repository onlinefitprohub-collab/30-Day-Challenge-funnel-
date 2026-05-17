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

=== STYLE ENFORCEMENT — APPLIES TO EVERY LINE ===
The copywriter style above is not a tone suggestion — it is the creative brief for this entire output. Every headline, subheadline, body paragraph, CTA, bullet point, testimonial, and FAQ answer must be unmistakably written in this copywriter's voice. A reader who knows this copywriter's published work should be able to identify the style from a single sentence. Do NOT write generic copy and then adjust for style. BUILD every line from the style's structure, vocabulary, sentence rhythm, and signature moves. If the field instructions below conflict with the style's structural framework, the STYLE WINS. Adapt the structure, not the voice.

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
COUNT THE WORDS IN YOUR OUTPUT BEFORE WRITING IT. MAXIMUM 7 WORDS. No exceptions.
A short, punchy benefit phrase. Specific to this programme and audience.
WEIGHT LOSS NUMBERS: For 84–90 day programmes, the weight loss figure must be 20–30 lbs or 2–3 stone minimum. Do NOT write a figure below 20 lbs. Use stone for UK coaches (e.g. "2 Stone"), lbs for US coaches (e.g. "25lbs").
VALID EXAMPLES (all 7 words or fewer):
- "Lose 2 Stone Without Giving Up Food" (7 words)
- "Drop 3 Dress Sizes In 90 Days" (7 words)
- "Finally Lose The Weight For Good" (6 words)
- "Reset Your Metabolism In 90 Days" (6 words)
INVALID — wrong number: "Lose 8–12lbs in 90 Days" (too small — 20+ lbs minimum)
INVALID — too long: "The Elite Transformation Programme Is A 90-Day..." / "Get Back In Shape Even If You've Tried Everything And..."
DO NOT use generic phrases like "transform your body". DO NOT include client names or testimonial results.
Reflect the chosen copywriter style.

valuePropSubheadline:
A single sentence beneath the headline. MAXIMUM 18 WORDS — count before writing. Sells the transformation emotionally. NEVER describes the programme or its features.
CRITICAL: This line MUST reflect the copywriter style — the sentence structure, hook type, and vocabulary must differ clearly between styles. Examples by style:
- Russell Brunson → curiosity gap: "Discover the one system that finally made the weight stay off — for good"
- Dan Kennedy → blunt promise: "Real results. No guesswork. No excuses. Just the plan that works."
- Alex Hormozi → bold result lead: "Lose 25lbs in 90 days — or we work with you until you do"
- David Ogilvy → specific and credible: "The same method that helped 500 people lose 2 stone without starving"
- Gary Halbert → urgent and personal: "This is the last weight loss programme you will ever need"
Do NOT copy these examples — write one that is specific to this coach's niche and audience.
Do NOT invent small generic numbers (e.g. "8–12 lbs" is too low). Use the programme's actual promised outcome.

videoSectionHeading:
A single compelling headline placed above the coach's intro video. Reference the coach's name or programme name and the audience's transformation identity. One line only — no line breaks, no two-part format, no slash separators. Example: "Watch How Sarah Helps Busy Mums Finally Lose the Weight for Good" or "Before You Apply — Watch This Short Message from [Coach Name]". 8–14 words, sentence case.

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
- attribution: "First Name Initial., Age/Role" — CRITICAL: the name MUST match the gender of the target audience. If audience is female (women, mums, ladies, etc.), use FEMALE names ONLY (Sarah T., Emma R., Claire B., Lisa M., etc.). If audience is male (men, dads, guys, etc.), use MALE names ONLY (James R., Mark B., Tom H., etc.). NEVER use a male name for a female audience or vice versa. E.g. for female audience: "Sarah T., 44, Busy Mum of Three". For male audience: "Mark R., 52, Business Owner".
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

whatYouGetBullets:
One inner array per whatYouGetItem (same order, same count). Each inner array has exactly 3 bullets.
Each bullet format: "[Specific deliverable or feature] ([short parenthetical explaining why it matters to the client])"
Example: ["Custom calories & macros (So you know exactly how much food to eat and still see results)", "Weekly check-in calls (So you never feel lost or fall off track alone)", "Done-for-you meal templates (Saving you hours of planning every week)"]
Bullets must be specific to THIS programme's features and THIS audience's struggles — not generic fitness bullets.

transformationGalleryHeading:
Heading for the before/after transformation gallery section. E.g. "The Proof Is In The Results", "These Are Real Transformations From Real People". 5–10 words.

clientWinsHeading:
Heading for the client wins grid. E.g. "More Wins From Our Community", "What Our Clients Are Achieving". 4–8 words.

clientWins:
Between 4 and 8 short client win entries. Each has:
- name: First name + initial only — MUST match the gender of the target audience. If audience is female (women, mums, ladies, etc.) use female names ONLY (Emma R., Sarah K., Claire B., etc.). If male, use male names. Never use a male name for a female audience.
- result: A specific, measurable result using the language of THIS niche (e.g. for weight loss: "Lost 2 stone and dropped 2 dress sizes", "Off blood pressure medication after 14 weeks"). 5–12 words. Never use vague language like "reached their goals."

clientStories:
Exactly 6 longer-form client case studies for the "Meet..." testimonial sections. Each has:
- storyHeadline: A 5–8 word PAIN-POINT IDENTIFICATION headline in ALL CAPS. Name the specific struggle or obstacle the client faced BEFORE joining this programme. Write it as a declarative statement — NEVER a question. The headline must relate specifically to the story content — read the story field before writing this. INVALID EXAMPLES: ❌ "WANT TO FEEL MORE ATTRACTIVE TO YOUR PARTNER?" ❌ "READY TO TRANSFORM YOUR BODY?" ❌ "TIRED OF FEELING STUCK?" (question). VALID EXAMPLES: ✅ "SIX YEARS OF STARTING OVER AND NOTHING STICKING" ✅ "EXHAUSTED OVERWEIGHT AND OUT OF OPTIONS" ✅ "EVERY DIET FAILED HER UNTIL THIS" ✅ "THIRTY YEARS OF YOYO DIETING ENDS HERE". 5–8 words, ALL CAPS, declarative statement only.
- intro: A compelling single sentence intro naming the client. Format: "Meet [Name], [a brief specific situation before joining]..." — CRITICAL: the name MUST match the gender of the target audience. If target audience is women, use female names. If men, use male names. Never write "Meet James" for a programme aimed at women. The situation described must be specific to THIS audience (their age, life stage, struggle) — NOT a copy of the targetAudience description. E.g. for busy mums: "Meet Claire, a 42-year-old mum of three who had been yo-yo dieting since her twenties and was finally done with starting over." 10–20 words.
- story: ONE single paragraph only — no line breaks, no \n\n, no multiple paragraphs. 60–90 words. First-person client voice. Cover: their situation before joining, the specific result they got (with numbers), and a genuine recommendation. Reference the coach or programme name. Do NOT include the client's name. Do NOT use paragraph breaks. This must be a single flowing paragraph.

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
CRITICAL: DO NOT mention cohorts, start dates, application deadlines, or cohort launch dates. This is an always-open application funnel — focus on what happens immediately after applying (e.g. team review, strategy call, no payment required).

guaranteeBullets:
10–12 short, specific "You'll..." result statements for the "I Personally Guarantee" section. These replace generic template bullets and must be 100% specific to this programme and audience — not generic fitness copy.
Each bullet: 4–8 words, starts with "You'll" or a variation. Must reference REAL outcomes this programme delivers.
Good examples for a metabolism/weight loss programme:
- "You'll understand how your metabolism actually works"
- "You'll eat more food and weigh less"
- "You'll stop blaming yourself for failing diets"
- "You'll feel energised by 9am without caffeine"
- "You'll know exactly what to eat and when"
No generic bullets like "You'll be happier" or "You'll be stronger". Every bullet must be niche-specific.

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
    "whatYouGetBullets": [
      ["bullet 1 (reason)", "bullet 2 (reason)", "bullet 3 (reason)"],
      ["bullet 1 (reason)", "bullet 2 (reason)", "bullet 3 (reason)"]
    ],
    "transformationGalleryHeading": "...",
    "clientWinsHeading": "...",
    "clientWins": [
      { "name": "...", "result": "..." }
    ],
    "clientStories": [
      { "storyHeadline": "...", "intro": "Meet [Name], ...", "story": "..." },
      { "storyHeadline": "...", "intro": "Meet [Name], ...", "story": "..." },
      { "storyHeadline": "...", "intro": "Meet [Name], ...", "story": "..." },
      { "storyHeadline": "...", "intro": "Meet [Name], ...", "story": "..." },
      { "storyHeadline": "...", "intro": "Meet [Name], ...", "story": "..." },
      { "storyHeadline": "...", "intro": "Meet [Name], ...", "story": "..." }
    ],
    "problemBreakdown": [
      { "title": "PROBLEM #1 — ...", "headline": "...", "body": "..." },
      { "title": "PROBLEM #2 — ...", "headline": "...", "body": "..." },
      { "title": "PROBLEM #3 — ...", "headline": "...", "body": "..." },
      { "title": "PROBLEM #4 — ...", "headline": "...", "body": "..." },
      { "title": "PROBLEM #5 — ...", "headline": "...", "body": "..." }
    ],
    "finalCtaText": "...",
    "finalCtaSubtext": "...",
    "guaranteeBullets": ["You'll ...", "You'll ...", "You'll ..."]
  }
}`;
}
