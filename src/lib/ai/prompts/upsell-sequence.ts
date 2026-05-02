/**
 * Upsell Email Sequence prompt
 *
 * Generates a 5-email post-challenge sequence designed to convert
 * challenge completers into a higher-tier offer (1:1 coaching, next programme, etc.)
 */

export function buildUpsellSequencePrompt(context: string): { system: string; user: string } {
  const system = `You are an expert email copywriter who specialises in post-programme upsell sequences for fitness coaches. You write warm, conversational emails that feel like a natural continuation of the coaching relationship — not a hard sell. Every email is specific to the coach's next-tier offer and the transformation the client just experienced.

CRITICAL OUTPUT RULE: Return ONLY a single valid JSON object wrapped in:
{ "upsellSequence": { ... } }
No preamble, no markdown fences, no trailing text. The response must be parseable by JSON.parse().`;

  const user = `${context}

=== YOUR TASK: UPSELL EMAIL SEQUENCE ===

Write a 5-email post-challenge upsell sequence. These emails go to people who completed the challenge — they've experienced a result, they trust the coach, and they're at peak motivation. The goal is to convert them to the coach's next-tier offer (1:1 coaching, a premium programme, or the application funnel).

Infer the upsell offer from the context: if it's a challenge funnel, the upsell is likely to 1:1 coaching or a higher-tier programme. If it's an application funnel, the upsell may be a longer coaching engagement or a mastermind.

─── SEQUENCE STRATEGY ───

Email 1 (Day 1 after challenge ends): "Celebrate + Plant the seed"
Subject: Celebratory, acknowledges their completion. Body: Congratulate them genuinely, reflect back what they achieved, ask a reflective question about what they want next. No pitch yet — just momentum.

Email 2 (Day 3): "The honest truth"
Subject: Curiosity-driven. Body: Share that most challenge completers fall back into old patterns without continued support. Not scary — honest. Bridge to the idea of what's possible with deeper work. Still no direct pitch.

Email 3 (Day 5): "A client story / transformation"
Subject: Story-led. Body: Share a real (or representative) story of a client who went from where they are now → to deeper results with ongoing coaching. Make it vivid and specific to this audience. Include a soft invitation: "If you want to talk about what that could look like for you, reply to this email."

Email 4 (Day 8): "The offer"
Subject: Direct, confident. Body: Introduce the next-tier programme or 1:1 coaching clearly. What it is, who it's for, what it costs, and how to take the next step. Keep it conversational — this is the coach speaking, not a sales page. Include a clear CTA (book a call or apply now).

Email 5 (Day 14): "Last chance / No pressure close"
Subject: Creates urgency without being pushy. Body: A brief, personal message. Reference the journey, remind them of the offer, and give them a deadline or capacity limit. End with a genuine "whatever you decide, I'm proud of you" — makes the coach likeable regardless of outcome.

smsNudge: A single SMS to send on Day 6 to non-openers after Email 3. References the challenge, creates curiosity, includes a link to the offer or application.

targetOffer: Infer and describe in 1 sentence what the coach is upselling to, based on their context.

overview: 2–3 sentences describing the strategy behind the sequence.

─── WRITING RULES ───

- Write as the coach in first person
- Emails should be 150–300 words each — warm and readable, not long
- Subject lines should feel personal, not newsletter-like
- Every email should feel like a continuation of a coaching relationship
- Use specifics from the coach's context (challenge name, audience, transformation)
- No corporate language — this is one human writing to another

─── JSON STRUCTURE ───

{
  "upsellSequence": {
    "targetOffer": "string",
    "overview": "string",
    "emails": [
      { "day": 1, "purpose": "string", "subject": "string", "body": "string" },
      { "day": 3, "purpose": "string", "subject": "string", "body": "string" },
      { "day": 5, "purpose": "string", "subject": "string", "body": "string" },
      { "day": 8, "purpose": "string", "subject": "string", "body": "string" },
      { "day": 14, "purpose": "string", "subject": "string", "body": "string" }
    ],
    "smsNudge": "string"
  }
}`;

  return { system, user };
}
