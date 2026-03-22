/**
 * Group 2: Follow-up Sequences
 * Generates: smsSequence, emailSequence
 *
 * Follow-up and nurture assets — what contacts receive after opting in.
 * SMS must sound like the coach actually typed it on their phone.
 * Emails must be readable in 45 seconds and feel personal, not automated.
 */

export function buildSequencesPrompt(context: string): string {
  return `${context}

=== YOUR TASK: FOLLOW-UP SEQUENCES ===

Write the SMS and email follow-up sequences for this challenge funnel. Use all available context — audience psychology, objections, tone, and any social proof — to make these feel personal and specific.

─── SMS RULES ───

Hard limits:
- EVERY SMS must be under 160 characters including spaces — count carefully before writing
- One message, one purpose — never pack two ideas into one SMS
- Must sound like the coach typed it on their phone, not a CRM template

Style:
- Use {name} as the merge tag — only where it sounds natural (usually at the start)
- Sign off with the coach's first name or initials — not "The [Business] Team"
- Conversational punctuation: ellipsis (...), em dash (—), simple emoji if it fits the tone
- Don't use exclamation marks on every SMS — save them for moments that deserve it
- No corporate language: "Please be advised", "As per", "We are delighted"
- No all-caps
- If the tone is "simple" or "friendly", the SMS should read like a text from someone who actually knows them

Each SMS has a specific job:
- confirmation: Immediately after opt-in. Makes them feel good about their decision. Directs to email. Signs off warmly.
- reminder: Day before challenge starts or 24h before a booked call. Specific nudge — what to do, not just "see you tomorrow".
- followUp: After Day 1 or after a completed call. Checks in genuinely. Invites a reply. Human, not evaluative.
- noShow: Missed their call or didn't start. No guilt, no pressure. Opens a door. Makes rescheduling easy.
- reEngagement: Opted in 7+ days ago, no engagement. Soft and curious. Acknowledges the gap without blame. Low-pressure.

─── EMAIL RULES ───

Subject lines:
- Under 50 characters ideally
- Specific — reference the challenge name, a timeline, or a direct concern
- No: "Important update", "Quick question", "Don't miss out", "Re:", "FWD:"
- The best subjects make the person feel like this email is actually about them, not about a product

Email body:
- Write in first person — the coach is writing, not "the team"
- Short paragraphs: 2–3 sentences max per paragraph
- Use {first_name} as the merge tag — once, near the top
- End each email with the coach's name (first name or signature style from context)
- One CTA per email — clear, low-friction
- No sign-offs like "Best regards" or "Warmly" — match the tone

Each email has a specific job:
- welcome: After opt-in. Confirms what they signed up for. Tells them exactly what happens next (numbered list if there are steps). Builds warmth and sets the right expectation. 3–4 paragraphs.
- reminder: 24h before challenge starts or before a booked call. Short. Checklist or single clear action. Ends with encouragement — not hype. 2–3 paragraphs.
- objectionHandling: Pick ONE of the stated objections from the context and address it directly and honestly. Use a story, a reframe, or a straight answer — not reassurance without substance. Don't hedge. 3 paragraphs.
- lastChance: Final registration close or last push. States clearly what they'll miss and when. Specific outcome reminder. Single CTA. 2–3 paragraphs. Honest urgency — not artificial.
- reEngagement: For someone who opted in but hasn't engaged. Acknowledges the gap without blame. Opens the door genuinely. Asks if they're still interested or if things changed. 2–3 paragraphs. Zero pressure.

─── OUTPUT FORMAT ───

Return ONLY this JSON structure. All copy must be real and ready to use — no placeholder text, no [INSERT] style gaps:

{
  "smsSequence": {
    "confirmation": "...",
    "reminder": "...",
    "followUp": "...",
    "noShow": "...",
    "reEngagement": "..."
  },
  "emailSequence": {
    "welcome": {
      "subject": "...",
      "body": "..."
    },
    "reminder": {
      "subject": "...",
      "body": "..."
    },
    "objectionHandling": {
      "subject": "...",
      "body": "..."
    },
    "lastChance": {
      "subject": "...",
      "body": "..."
    },
    "reEngagement": {
      "subject": "...",
      "body": "..."
    }
  }
}`;
}
