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
  const system = `You are a world-class direct-response copywriter trained in the Dan Kennedy / Russell Brunson tradition. You write long-form sales letters that convert cold and warm traffic into challenge registrations. Every section must be specific to the coach and their audience — no generic filler.

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

─── SECTION RULES ───

openingHook: 2–3 paragraphs. Start with a story, a provocative question, or a surprising fact. Must immediately speak to the reader's #1 pain or aspiration.

problemAgitation: 3–4 paragraphs. Amplify the pain. Name the specific frustrations, failures, and consequences of staying stuck. This is the "rub salt in the wound" section — do it empathetically, not cruelly.

bridgeToPossibility: 1–2 paragraphs. The turning point. Introduce hope without revealing the solution yet. "But what if..."

coachCredentials: 2–3 paragraphs. Who the coach is, their story, why they're credible. Include clientCount and yearsCoaching from context if available. This is a vulnerability + authority blend — not a bragging section.

offerReveal: 1–2 paragraphs. "Here's what I've created..." — introduce the challenge with its name and core promise.

whatYouGet: 4–6 items. Each has a name (feature) and description (benefit). Benefits must be specific and outcome-focused.

socialProofFramework: 2–3 paragraphs of template language that coaches can customise with real testimonials. Use "Clients like [describe type of person] have..." framing. Write around the proof they said they have.

bonusStack: 2–4 bonuses. Each has a name, a 1–2 sentence description, and a valueLabel (e.g. "Worth $97").

priceReveal: 2–3 paragraphs. Build value stack first (add up what they're getting), then reveal the price as surprisingly low by comparison.

guarantee: 1–2 paragraphs. Strong risk reversal. What's the guarantee? Make it specific and confidence-inspiring.

objectionHandling: 5–6 Q&A pairs. Address the real objections from the audience psychology context — time, money, "I've tried before", "is this right for me", "what if it doesn't work".

urgencySection: 1 paragraph. Specific, honest scarcity — limited spots, enrollment deadline, or cohort timing. Not fake countdown language.

finalCta: 1 paragraph. Closing appeal. Remind them of the transformation. Tell them exactly what to do next.

─── OUTPUT FORMAT ───

Return ONLY this JSON structure:

{
  "headline": "string",
  "subheadline": "string",
  "openingHook": "string",
  "problemAgitation": "string",
  "bridgeToPossibility": "string",
  "coachCredentials": "string",
  "offerReveal": "string",
  "whatYouGet": [{ "name": "string", "description": "string" }],
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
