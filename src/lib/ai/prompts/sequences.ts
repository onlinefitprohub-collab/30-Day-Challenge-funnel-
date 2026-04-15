/**
 * Group 2: Follow-up Sequences
 * Generates: smsSequence, emailSequence
 *
 * A full lifecycle sequence — from opt-in through the challenge to post-challenge.
 * SMS must sound like the coach actually typed it on their phone.
 * Emails must be readable in under a minute and feel personal, not automated.
 * Each message has a specific job tied to where the lead is in the journey.
 */

export function buildSequencesPrompt(context: string, style: string): string {
  return `${context}

=== COPYWRITING STYLE ===

${style}

=== YOUR TASK: FOLLOW-UP SEQUENCES ===

Write a complete SMS and email sequence for this challenge funnel. These are not one-off messages — they form a lifecycle arc from opt-in through the challenge to post-challenge follow-up. Each message must feel like it was written specifically for that moment. Use all available context — audience psychology, objections, tone, and any social proof.

─── SMS RULES ───

Hard limits:
- EVERY SMS must be under 160 characters including spaces — count carefully
- One message, one purpose — never pack two ideas into one SMS
- Must sound like the coach typed it on their phone, not a CRM template

Style:
- Use {name} as the merge tag — only where it sounds natural (usually at the start)
- Sign off with the coach's first name or initials — not "The [Business] Team"
- Conversational punctuation: ellipsis (...), em dash (—), simple emoji if it fits the tone
- No exclamation marks on every SMS — save them for moments that deserve it
- No corporate language. No all-caps.
- If the tone is "simple" or "friendly", write like a text from someone who actually knows them

Each SMS job:
- confirmation: Immediately after opt-in. Validates their decision. Directs to email. Warm sign-off.
- challengeReminder: 24h before the challenge starts. Specific nudge — what to do to prepare, not just "see you tomorrow".
- dayOneKickoff: Challenge Day 1 morning. Short burst of energy. Tells them exactly what to do first.
- midChallengeMotivation: Challenge Day 15. Checks in genuinely. Acknowledges they're halfway. Invites a reply.
- noShow: Triggered if they haven't started by Day 2. No guilt, no pressure. Opens the door. Rescheduling easy.
- challengeComplete: Challenge Day 30. Celebrates the win. Teases what's next. Invites a response.
- reEngagement: Day 37, no conversion after challenge. Soft and curious. Acknowledges the gap without blame. Zero pressure.

─── EMAIL RULES ───

Subject lines:
- Under 50 characters ideally
- Specific — reference the challenge name, a timeline, or a direct concern
- No: "Important update", "Quick question", "Don't miss out", "Re:", "FWD:"
- Best subjects make the person feel this email is about them, not a product

Email body:
- Write in first person — the coach is writing, not "the team"
- Short paragraphs: 2–3 sentences max per paragraph
- Use {first_name} as the merge tag — once, near the top
- End each email with the coach's name (first name or signature style from context)
- One CTA per email — clear, low-friction
- No sign-offs like "Best regards" or "Warmly" — match the tone
- Length guide: Pre-challenge emails 3–4 paragraphs. During-challenge emails 2–3 paragraphs. Post-challenge 2–3 paragraphs.

Each email job (in order):
- welcome: After opt-in. Confirms what they signed up for. Tells them exactly what happens next. Builds warmth.
- valueDelivery: Day 1. Deliver a quick win — one actionable tip related to the challenge topic that they can use right now. Earns trust before the challenge starts.
- socialProof: Day 2. Tell a brief, specific story about a past client who had the same starting point. Concrete result. Makes the reader see themselves in it.
- objectionHandling: Day 4. Pick ONE of the stated objections from context. Address it directly and honestly with a story, reframe, or straight answer — not hollow reassurance.
- lastChance: 24h before challenge starts. States clearly what they'll miss and when. Specific outcome reminder. Honest urgency — not artificial.
- dayOneKickoff: Challenge Day 1. Energy, clarity, and specific instructions for today. What to do, what to expect, how to get the most out of Day 1.
- midChallenge: Challenge Day 15. Acknowledge they're halfway. Celebrate the fact they've shown up. Address the "mid-challenge dip" — most people hit a wall here. Remind them why they started.
- finalStretch: Challenge Day 28. Almost there. Two days left. Reference how far they've come. Create anticipation for the finish line.
- challengeComplete: Challenge Day 30. Celebrate the completion. Acknowledge the work they put in. Soft introduction to the next step (programme, offer, or next cohort) — not a hard sell.
- reEngagement: 7+ days after challenge with no conversion. Acknowledges the gap without blame. Opens the door genuinely. Asks if they're still interested or if things changed. Zero pressure.

─── OUTPUT FORMAT ───

Return ONLY this JSON structure. All copy must be real and ready to use — no placeholder text, no [INSERT] style gaps:

{
  "smsSequence": {
    "confirmation": "...",
    "challengeReminder": "...",
    "dayOneKickoff": "...",
    "midChallengeMotivation": "...",
    "noShow": "...",
    "challengeComplete": "...",
    "reEngagement": "..."
  },
  "emailSequence": {
    "welcome":           { "subject": "...", "body": "..." },
    "valueDelivery":     { "subject": "...", "body": "..." },
    "socialProof":       { "subject": "...", "body": "..." },
    "objectionHandling": { "subject": "...", "body": "..." },
    "lastChance":        { "subject": "...", "body": "..." },
    "dayOneKickoff":     { "subject": "...", "body": "..." },
    "midChallenge":      { "subject": "...", "body": "..." },
    "finalStretch":      { "subject": "...", "body": "..." },
    "challengeComplete": { "subject": "...", "body": "..." },
    "reEngagement":      { "subject": "...", "body": "..." }
  }
}`;
}
