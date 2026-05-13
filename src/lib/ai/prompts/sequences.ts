/**
 * Group 2: Follow-up Sequences
 * Generates: smsSequence, emailSequence
 *
 * A full lifecycle sequence — from opt-in through the challenge to post-challenge.
 * SMS must sound like the coach actually typed it on their phone.
 * Emails must be readable in under a minute and feel personal, not automated.
 * Each message has a specific job tied to where the lead is in the journey.
 */

import { buildCopyStandardsBlock, buildAudienceAnalysisBlock } from "../copy-quality";

const SMS_RULES = `─── SMS RULES ───

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
- If the tone is "simple" or "friendly", write like a text from someone who actually knows them`;

const EMAIL_RULES = `─── EMAIL RULES ───

Subject lines:
- Under 50 characters ideally
- Specific — reference the programme name, a timeline, or a direct concern
- No: "Important update", "Quick question", "Don't miss out", "Re:", "FWD:"
- Best subjects make the person feel this email is about them, not a product

Email body:
- Write in first person — the coach is writing, not "the team"
- Short paragraphs: 2–3 sentences max per paragraph
- Use {first_name} as the merge tag — once, near the top
- End each email with the coach's name (first name or signature style from context)
- One CTA per email — clear, low-friction
- No sign-offs like "Best regards" or "Warmly" — match the tone
- Length guide: Pre-action emails 3–4 paragraphs. During/post emails 2–3 paragraphs.`;

const JSON_OUTPUT_FORMAT = `─── OUTPUT FORMAT ───

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

function buildChallengeSequencesPrompt(context: string, style: string): string {
  return `${context}

=== COPYWRITER STYLE (MANDATORY — DO NOT DEVIATE) ===

${style}

=== STYLE ENFORCEMENT — APPLIES TO EVERY LINE ===
The copywriter style above is not a tone suggestion — it is the creative brief for this entire output. Every email subject line, email body, SMS message, CTA, and sign-off must be unmistakably written in this copywriter's voice. A reader who knows this copywriter's published work should be able to identify the style from a single sentence. Do NOT write generic copy and then adjust for style. BUILD every line from the style's structure, vocabulary, sentence rhythm, and signature moves. If the message format rules below conflict with the style's structural framework, the STYLE WINS. Adapt the structure, not the voice.

${buildAudienceAnalysisBlock()}

${buildCopyStandardsBlock()}

=== YOUR TASK: CHALLENGE FOLLOW-UP SEQUENCES ===

Write a complete SMS and email sequence for this challenge funnel. These are not one-off messages — they form a lifecycle arc from opt-in through the challenge to post-challenge follow-up. Each message must feel like it was written specifically for that moment. Use all available context — audience psychology, objections, tone, and any social proof.

${SMS_RULES}

Each SMS job:
- confirmation: Immediately after opt-in. Validates their decision. Directs to email. Warm sign-off.
- challengeReminder: 24h before the challenge starts. Specific nudge — what to do to prepare, not just "see you tomorrow".
- dayOneKickoff: Challenge Day 1 morning. Short burst of energy. Tells them exactly what to do first.
- midChallengeMotivation: Challenge Day 15. Checks in genuinely. Acknowledges they're halfway. Invites a reply.
- noShow: Triggered if they haven't started by Day 2. No guilt, no pressure. Opens the door. Rescheduling easy.
- challengeComplete: Challenge Day 30. Celebrates the win. Teases what's next. Invites a response.
- reEngagement: Day 37, no conversion after challenge. Soft and curious. Acknowledges the gap without blame. Zero pressure.

${EMAIL_RULES}

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

${JSON_OUTPUT_FORMAT}`;
}

function buildApplicationSequencesPrompt(context: string, style: string): string {
  return `${context}

=== COPYWRITER STYLE (MANDATORY — DO NOT DEVIATE) ===

${style}

=== STYLE ENFORCEMENT — APPLIES TO EVERY LINE ===
The copywriter style above is not a tone suggestion — it is the creative brief for this entire output. Every email subject line, email body, SMS message, CTA, and sign-off must be unmistakably written in this copywriter's voice. A reader who knows this copywriter's published work should be able to identify the style from a single sentence. Do NOT write generic copy and then adjust for style. BUILD every line from the style's structure, vocabulary, sentence rhythm, and signature moves. If the message format rules below conflict with the style's structural framework, the STYLE WINS. Adapt the structure, not the voice.

${buildAudienceAnalysisBlock()}

${buildCopyStandardsBlock()}

=== YOUR TASK: APPLICATION FUNNEL FOLLOW-UP SEQUENCES ===

Write a complete SMS and email sequence for this high-ticket application funnel. Leads are being nurtured from initial opt-in → application → approval → strategy call → close. Each message must feel personal and match exactly where the lead is in that journey. Use all available context — audience psychology, objections, tone, and social proof.

${SMS_RULES}

Each SMS job (application funnel lifecycle):
- confirmation: Immediately after they submit their application. Confirm receipt, set expectations for next steps. Warm, professional.
- challengeReminder: Sent 24h after submission if the application is incomplete or stalled. Gentle nudge to complete it — frame as a reminder, not a chase.
- dayOneKickoff: Application approved — tell them to book their strategy call. Short, direct, excited for them.
- midChallengeMotivation: 24h before the strategy call. Remind them what to prepare. Keep it brief and practical.
- noShow: Triggered if they miss their strategy call. No blame. Offer to reschedule. Keep the door open.
- challengeComplete: 1–2 days after the strategy call, no decision yet. Re-engage warmly. Ask if they have questions.
- reEngagement: Day 7 post-call, no conversion. Acknowledge the gap. Last soft reach-out. Zero pressure.

${EMAIL_RULES}

Each email job (application funnel lifecycle, in order):
- welcome: First email after they opt-in (pre-application lead magnet or VSL). Confirms what they'll get. Builds anticipation for applying. Does NOT push the application hard yet — earns it.
- valueDelivery: Day 1. Deliver a genuine insight about the transformation you offer — one specific result, mechanism, or perspective shift. Earns trust before asking for the application.
- socialProof: Day 2. A brief, specific client story with a concrete result from this same programme. Makes the reader see themselves as the right fit.
- objectionHandling: Day 4. Address the single most common reason people hesitate to apply (from context). Answer it honestly — not with hype, with truth.
- lastChance: Spots are limited or the application window is closing. Specific, honest urgency — how many spots remain, or what the deadline is. Invite them to apply now.
- dayOneKickoff: Immediately after they submit their application. Confirm receipt. Explain the review process and timeline. Build anticipation for the approval call.
- midChallenge: Day 2 after application. "Your application is under review" — keep them warm. Share what makes a strong candidate. Build excitement without overpromising.
- finalStretch: Application approved — congratulate them. Tell them exactly how to book their strategy call. Make this feel exclusive and earned.
- challengeComplete: 24h before the strategy call. Pre-call prep email — what to think about, what questions to bring, what to expect. Sets them up for a great call.
- reEngagement: Day 7 after the strategy call, no enrolment. Acknowledges the gap. Invites a reply if they have questions or if life got in the way. One last soft door-open.

${JSON_OUTPUT_FORMAT}`;
}

export function buildSequencesPrompt(context: string, style: string, funnelType: "challenge" | "application" = "challenge"): string {
  return funnelType === "application"
    ? buildApplicationSequencesPrompt(context, style)
    : buildChallengeSequencesPrompt(context, style);
}
