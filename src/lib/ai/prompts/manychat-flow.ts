/**
 * ManyChat Flow prompt
 *
 * Generates a Facebook Messenger / Instagram DM chatbot flow script
 * for organic lead nurture — 10 messages that qualify leads and guide
 * them to challenge signup.
 *
 * Output: ManyChatFlow JSON
 */

export function buildManyChatFlowPrompt(context: string): { system: string; user: string } {
  const system = `You are a ManyChat automation specialist who writes high-converting chatbot flows for fitness and wellness coaches on Facebook Messenger and Instagram DM. Your scripts feel human, conversational, and platform-native — not like an automated bot.

CRITICAL OUTPUT RULE: Return ONLY a single valid JSON object with no preamble, no markdown fences, no trailing text. The response must be parseable by JSON.parse().`;

  const user = `${context}

=== YOUR TASK: MANYCHAT FLOW ===

Write a complete ManyChat chatbot flow for this challenge funnel. This flow is used on Facebook Messenger and/or Instagram DM to nurture organic leads from the coach's social content into challenge registrations.

─── MESSAGE RULES ───

Hard limits (ManyChat platform constraints):
- Every message (welcomeMessage, challengeOverview, signupCta, registrationConfirm, dayOneReminder, midpointCheckIn, noShowFollowUp) must be under 300 characters INCLUDING spaces.
- quickReplies: maximum 3 per message. Each quick reply must be under 20 characters.
- setupInstructions is NOT a bot message — it is guidance text for the coach, so it can be longer.

Style:
- Short sentences. One idea per message.
- Conversational — like a text from the coach, not a CRM automation.
- Use the coach's first name at the end of messages where it fits naturally (e.g. "— [Coach Name]" or just sign it naturally).
- Emoji: 1 per message maximum. Only if it adds warmth. Never use emoji in quick replies.
- Do NOT use corporate language: no "We are excited to inform you", no "Please be advised".
- qualificationQ1 and qualificationQ2 should ask questions that naturally filter the right audience for this challenge.

Each message has a specific job:
- welcomeMessage: The very first message someone receives when they DM. Make them feel seen. Tease the value.
- qualificationQ1: First qualifying question — establish they have the pain/goal this challenge solves.
- qualificationQ2: Second qualifying question — confirm they're ready/available for the challenge duration.
- challengeOverview: Brief, punchy overview of the challenge. Name it. Give the key outcome. No more than 2 sentences.
- signupCta: Direct them to sign up. Include where to go (link placeholder: {{signup_link}}). Create urgency.
- registrationConfirm: Sent after they confirm they've signed up. Celebrate. Build excitement for Day 1.
- dayOneReminder: Day 1 kick-off message. Hype them up. Tell them one specific thing to do today.
- midpointCheckIn: Day 15 check-in. Acknowledge they're halfway. Encourage. Invite a reply.
- noShowFollowUp: For people who haven't started. No guilt. Open a door. Keep it warm.
- setupInstructions: Guidance for the coach on how to set up this flow in ManyChat — which triggers to use, how to connect the flow to their Instagram/Facebook, what to link to. 3–5 bullet points. This is plain text, not a bot message.

─── OUTPUT FORMAT ───

Return ONLY this JSON structure:

{
  "welcomeMessage": "string (under 300 chars)",
  "qualificationQ1": {
    "message": "string (under 300 chars)",
    "quickReplies": ["string (under 20 chars)", "string", "string"]
  },
  "qualificationQ2": {
    "message": "string (under 300 chars)",
    "quickReplies": ["string (under 20 chars)", "string", "string"]
  },
  "challengeOverview": "string (under 300 chars)",
  "signupCta": "string (under 300 chars)",
  "registrationConfirm": "string (under 300 chars)",
  "dayOneReminder": "string (under 300 chars)",
  "midpointCheckIn": "string (under 300 chars)",
  "noShowFollowUp": "string (under 300 chars)",
  "setupInstructions": "string (coach guidance, can be longer)"
}`;

  return { system, user };
}
