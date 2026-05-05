/**
 * Long-form Sales Letter prompt
 *
 * Generates a classic direct-response sales letter (3,000–5,000 words,
 * 15 persuasion sections) based on coach context and a chosen copywriting style.
 *
 * Output: SalesLetter JSON
 */

export function buildSalesLetterPrompt(
  context: string,
  styleDescription: string,
): { system: string; user: string } {
  const system = `You are a world-class direct-response copywriter. You write long-form sales letters that convert cold and warm traffic into challenge registrations. You adapt your style, voice, and persuasion approach to match the copywriting framework and voice specified in the context — every letter sounds distinctly different depending on the style. Every section must be specific to the coach and their audience — no generic filler.

CRITICAL OUTPUT RULE: Return ONLY a single valid JSON object with no preamble, no markdown fences, no trailing text. The response must be parseable by JSON.parse().`;

  const user = `${context}

=== COPYWRITING STYLE (MANDATORY) ===

${styleDescription}

=== YOUR TASK: LONG-FORM SALES LETTER ===

Write a complete direct-response sales letter for this challenge funnel. This is NOT a landing page — it is a long-form letter, 3,000–5,000 words in total, structured as a series of persuasion sections.

─── WRITING RULES ───

- Write in first person — the coach is speaking directly to their target audience.
- Use the target audience's specific language, pain points, and desires from the context above.
- Every section must reference specifics from the context — challenge name, duration, target audience, goal, bonuses, price.
- Do NOT use placeholder names like [CLIENT NAME] — describe the audience directly.
- No corporate language. This is a personal letter from one human to another.
- Headline and subheadline must be completely different from landing page headlines — this is a deeper, more story-driven entry point.

─── FORMATTING RULES ───

Use **double asterisks** around words or phrases that deserve bold emphasis — key outcomes, specific numbers, important claims. Use sparingly (3–6 per text block) so each instance lands hard. Do NOT use markdown headings (#, ##) inside text fields — bold only.

─── SECTION RULES ───

painPointHeadline: One punchy, provocative question or statement that names the audience's single most embarrassing or frustrating pain from the context. Written in the voice of the audience — not the coach. Should make the reader think "how did they know?" Examples: "There Is No Person On The Planet Who Wants To Still Be Struggling With [Their Exact Problem] Is There?" or "If You've Tried Everything And Nothing's Worked, Read This Carefully." Must be audience-specific — not generic.

openingHook: 2–3 paragraphs. Start with a story, a provocative question, or a surprising fact. Must immediately speak to the reader's #1 pain or aspiration. Use **bold** for the most important phrases.

problemAgitation: 3–4 paragraphs. Amplify the pain. Name the specific frustrations, failures, and consequences of staying stuck. This is the "rub salt in the wound" section — do it empathetically, not cruelly. Use **bold** for the sharpest truth-telling lines.

problemBreakdown: 2–4 problems. Each is the real reason their audience hasn't succeeded yet — drawn specifically from biggestStruggle, objections, and whatTheyTried in the context. These are NOT generic fitness problems — they must reflect this specific audience's actual experience.
  - title: short, all-caps label. E.g. "PROBLEM #1 – [SPECIFIC PROBLEM NAME]"
  - headline: 1 bold capitalised sentence expanding on the problem. The thing their audience has said to themselves.
  - body: 2–3 short paragraphs. Conversational, empathetic. Shows you understand exactly what they've been through. Use **bold** on the sharpest insights.

bridgeToPossibility: 1–2 paragraphs. The turning point. Introduce hope without revealing the solution yet. "But what if..."

coachCredentials: 2–3 paragraphs. Who the coach is, their story, why they're credible. Include clientCount and yearsCoaching from context if available. Vulnerability + authority blend — not a bragging section. Use **bold** for specific proof points (numbers, results, credentials).

offerReveal: 1–2 paragraphs. "Here's what I've created..." — introduce the challenge with its name and core promise.

whatYouGet: 4–6 items. Each has a name (feature) and description (benefit). Benefits must be specific and outcome-focused.

testimonialCaseStudies: 1–3 case studies. Generated directly from clientTransformations, testimonials, caseStudySnippets, and bestClientResult in the context. If no specific data is provided, construct plausible-sounding case studies that match the audience profile and typical results for this type of challenge.
  - sectionHeadline: A motivational all-caps banner headline above the case study. Targets the desire the case study satisfies. E.g. "WANT TO FEEL MORE CONFIDENT IN YOUR OWN SKIN?" or "WHAT WOULD IT MEAN TO FINALLY SEE RESULTS?"
  - clientHeadline: "Meet [First Name], [Brief Audience Identity Description] Who [Specific Achievement]". Names should feel real and match the audience demographic.
  - quote: Full testimonial in the client's own voice — conversational, specific, credible. 3–5 sentences. Include their before state, what changed, and the specific result.
  - result: 4–8 words. The result as a banner caption. E.g. "Lost 2 stone in 6 weeks" or "Went from 0 to 18 clients in 60 days".

testimonialQuotes: 6 short punchy quotes for an image testimonial grid. Each is 1–2 sentences in the client's voice. Drawn from the same social proof context. Should feel varied — some about physical results, some about confidence, some about how the coach/programme helped them. If no specific testimonial data is provided, write quotes that sound authentic for this audience type and result.

socialProofFramework: 2–3 paragraphs of copy that ties together the proof. Use "Clients like [describe type of person] have..." framing. Write around the proof they said they have.

bonusStack: 2–4 bonuses. Each has a name, a 1–2 sentence description, and a valueLabel (e.g. "Worth $97").

priceReveal: 2–3 paragraphs. Build value stack first (add up what they're getting), then reveal the price as surprisingly low by comparison. Use **bold** on the value numbers and the price.

guarantee: 1–2 paragraphs. Strong risk reversal. What's the guarantee? Make it specific and confidence-inspiring.

objectionHandling: 5–6 Q&A pairs. Address the real objections from the audience psychology context — time, money, "I've tried before", "is this right for me", "what if it doesn't work".

urgencySection: 1 paragraph. Specific, honest scarcity — limited spots, enrollment deadline, or cohort timing. Not fake countdown language.

finalCta: 1 paragraph. Closing appeal. Remind them of the transformation. Tell them exactly what to do next.

─── OUTPUT FORMAT ───

Return ONLY this JSON structure:

{
  "headline": "string",
  "subheadline": "string",
  "painPointHeadline": "string",
  "openingHook": "string",
  "problemAgitation": "string",
  "problemBreakdown": [
    { "title": "string", "headline": "string", "body": "string" }
  ],
  "bridgeToPossibility": "string",
  "coachCredentials": "string",
  "offerReveal": "string",
  "whatYouGet": [{ "name": "string", "description": "string" }],
  "testimonialCaseStudies": [
    { "sectionHeadline": "string", "clientHeadline": "string", "quote": "string", "result": "string" }
  ],
  "testimonialQuotes": ["string", "string", "string", "string", "string", "string"],
  "socialProofFramework": "string",
  "bonusStack": [{ "name": "string", "description": "string", "valueLabel": "string" }],
  "priceReveal": "string",
  "guarantee": "string",
  "objectionHandling": [{ "objection": "string", "response": "string" }],
  "urgencySection": "string",
  "finalCta": "string"
}`;

  return { system, user };
}
