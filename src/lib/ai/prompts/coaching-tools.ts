import { buildCopyStandardsBlock } from "../copy-quality";

export function buildCoachingToolsPrompt(context: string, styleBlock: string): string {
  return `${context}

${buildCopyStandardsBlock()}

=== YOUR TASK: COACHING BUSINESS TOOLS ===

Generate two coaching business tools for the coach above: a testimonial harvest sequence and a pricing guide. These are internal tools — not public-facing marketing. Be practical and direct.

${styleBlock}

=== TOOL 1: TESTIMONIAL HARVEST SEQUENCE ===

After a challenge or programme ends, the coach needs to collect results, before/after photos, and referrals. This sequence goes to participants after completion.

Generate 5 messages sent across 8 days post-completion:

- day31Email: Sent the day after challenge ends. Subject + body. Warm congratulations, then ask for results (what changed? specific numbers? how do you feel?). Keep it conversational. 100–150 words body.
- day33Sms: 2-day follow-up SMS if no reply. Friendly nudge asking for their result. Max 140 chars.
- day35Email: A second email requesting a testimonial or case study. Subject + body. Explain how their story helps others. Ask for a written quote + before/after photo. 100–150 words body.
- day38Sms: Final nudge SMS. Frame it as celebrating their win publicly. Max 140 chars.
- referralEmail: A separate email asking for referrals. Subject + body. Position it as: "Who do you know who needs this?" Include an incentive hook if appropriate. 100–150 words body.

=== TOOL 2: PRICING & OFFER CONFIDENCE GUIDE ===

Based on the coach's offer details, target audience, and positioning, generate a complete pricing guide to help them charge with confidence.

Generate:
- recommendedPrice: The specific price point to charge (e.g. "£497", "$997")
- priceRange: A sensible minimum and maximum (e.g. min: "£297", max: "£797")
- rationale: 3–4 sentences explaining WHY this price is right — based on transformation value, market position, and audience ability to pay
- valueStack: 5–7 items. Each item has:
  - item: the feature or component name (e.g. "1-on-1 onboarding call")
  - perceivedValue: a plain currency value ONLY — currency symbol + number, optionally followed by "value". E.g. "£497", "£300 value", "$997". NEVER include words like "single pay", "per month", "×", payment plan details, or anything other than a currency symbol and a number.
  - description: 1 sentence on why it matters to the client
- positioningStatement: 2–3 sentences — the coach's "elevator pitch" for the price when someone asks "why so much?"
- confidenceScript: What the coach actually says word-for-word when someone pushes back on price. 80–120 words. Conversational, not salesy.
- objectionHandlers: 3–5 common pricing objections with direct scripted responses (50–80 words each)
- nextSteps: 3–5 concrete actions the coach should take this week to increase the perceived value of their offer

=== OUTPUT FORMAT ===

Respond with ONLY valid JSON. No markdown. Conform exactly to:

{
  "testimonialHarvestSequence": {
    "day31Email":    { "subject": "...", "body": "..." },
    "day33Sms":      "...",
    "day35Email":    { "subject": "...", "body": "..." },
    "day38Sms":      "...",
    "referralEmail": { "subject": "...", "body": "..." }
  },
  "pricingGuide": {
    "recommendedPrice": "...",
    "priceRange": { "min": "...", "max": "..." },
    "rationale": "...",
    "valueStack": [
      { "item": "...", "perceivedValue": "...", "description": "..." }
    ],
    "positioningStatement": "...",
    "confidenceScript": "...",
    "objectionHandlers": [
      { "objection": "...", "response": "..." }
    ],
    "nextSteps": ["...", "..."]
  }
}`;
}
