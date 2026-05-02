/**
 * Instagram DM Script prompt
 *
 * Generates 4 conversation paths for organic Instagram DM outreach,
 * each with an opener, follow-ups, and a booking bridge.
 */

export function buildDmScriptPrompt(context: string): { system: string; user: string } {
  const system = `You are an expert social media sales coach who trains fitness coaches to convert Instagram followers into paying clients through direct message conversations. You write natural, non-pushy DM scripts that feel like genuine human conversations — not copy-paste spam. Every script is specific to the coach's offer, audience, and transformation.

CRITICAL OUTPUT RULE: Return ONLY a single valid JSON object wrapped in:
{ "instagramDmScript": { ... } }
No preamble, no markdown fences, no trailing text. The response must be parseable by JSON.parse().`;

  const user = `${context}

=== YOUR TASK: INSTAGRAM DM SCRIPT ===

Write 4 complete Instagram DM conversation scripts for this coach to use for organic lead generation. Each script should feel like a real, warm conversation — not a sales pitch. The goal of every conversation is to get the prospect onto a discovery call or to take the next step.

─── WRITING RULES ───

- Write as the coach speaking (first person)
- Keep openers under 3 sentences — short is credible
- Never pitch the offer in the first message — qualify and build curiosity first
- Use the coach's specific audience, transformation, and challenge name from context
- Follow-ups should feel natural, not desperate
- The booking bridge message should be specific (name the call, the duration, what they'll get)
- Coaching notes should explain why each message is structured the way it is

─── CONVERSATION PATH SPECS ───

coldOutreach:
trigger: "New follower or someone who fits the target audience but hasn't engaged"
opener: A short, curious opener — not "I saw you followed me." Ask about their current situation related to the coach's niche. 1–2 sentences max.
followUps: 2 messages: (1) a deeper qualifying question after they respond, (2) a bridge message that introduces the challenge/programme briefly and creates curiosity
bookingBridge: A soft, specific ask — "I'd love to jump on a quick 20-minute call to see if what I do could actually help you — would that be useful?"
coachingNotes: Tips on timing, tone, volume (how many per day), and how to avoid being flagged as spam.

warmLead:
trigger: "Someone who liked a post, watched a story to the end, or saved a reel"
opener: Reference the specific engagement naturally. "Hey [name] — noticed you [watched my story / saved that post] about [topic]. Curious — is that something you're currently dealing with?"
followUps: 2 messages: (1) a pain probe question, (2) a value-bridge that connects their pain to the programme outcome
bookingBridge: Invite them to a call with a specific outcome promise
coachingNotes: Why this path converts better than cold, timing tips (DM within 30 min of engagement).

commentToDm:
trigger: "Someone who left a genuine comment on a post (not just an emoji)"
opener: Start by acknowledging the comment specifically, then DM them. "Hey — loved your comment on my [topic] post! Really resonated with what you said about [their words]. Do you mind if I ask..." then a qualifying question.
followUps: 2 messages: (1) qualify further, (2) introduce the opportunity
bookingBridge: Invite them to a call
coachingNotes: The power of referencing their own words. Don't DM every commenter — only genuine, engaged comments.

applicationInquiry:
trigger: "Someone who DMed asking about the programme or prices"
opener: Welcome their interest without pitching straight away. Ask a qualifying question first: "Thanks for reaching out! Before I share all the details — can I ask what's going on for you right now and what made you reach out?"
followUps: 2 messages: (1) reflect their answer and deepen the pain/desire, (2) introduce the programme briefly and build curiosity
bookingBridge: Invite them to a discovery call to see if it's right for them
coachingNotes: Don't send a price in DMs — always qualify and move to a call first. The call is where the real conversion happens.

noResponseFollowUp: A single follow-up message to send if someone goes quiet after the opener. Warm, not pushy. Creates curiosity rather than pressure. Max 2 sentences.

dmTips: 5–7 practical tips for running DM outreach at scale without getting flagged or feeling desperate. Cover: volume per day, personalisation, timing, using voice notes, avoiding the "DM me" cliché.

overview: 2–3 sentences on the DM strategy and mindset for organic lead gen.

─── JSON STRUCTURE ───

{
  "instagramDmScript": {
    "overview": "string",
    "coldOutreach":       { "trigger": "string", "opener": "string", "followUps": ["string","string"], "bookingBridge": "string", "coachingNotes": "string" },
    "warmLead":           { "trigger": "string", "opener": "string", "followUps": ["string","string"], "bookingBridge": "string", "coachingNotes": "string" },
    "commentToDm":        { "trigger": "string", "opener": "string", "followUps": ["string","string"], "bookingBridge": "string", "coachingNotes": "string" },
    "applicationInquiry": { "trigger": "string", "opener": "string", "followUps": ["string","string"], "bookingBridge": "string", "coachingNotes": "string" },
    "noResponseFollowUp": "string",
    "dmTips": ["string", ...]
  }
}`;

  return { system, user };
}
