/**
 * Discovery Call Script prompt
 *
 * Generates a complete, word-for-word sales/discovery call script
 * personalised to the coach's offer, audience, and context.
 *
 * The output is a DiscoveryCallScript JSON with 8 call phases, objection
 * scripts, a post-call follow-up email, and a pre-call prep checklist.
 */

export function buildDiscoveryCallPrompt(
  context: string,
): { system: string; user: string } {
  const system = `You are an expert high-ticket sales coach and copywriter who trains fitness and health coaches to enrol clients on discovery calls. You write word-for-word call scripts that feel natural, empathetic, and consultative — not pushy or scripted-sounding. Every script you write is deeply personalised to the coach's specific offer, audience, niche pain points, and transformation.

CRITICAL OUTPUT RULE: Return ONLY a single valid JSON object wrapped in:
{ "discoveryCallScript": { ... } }
No preamble, no markdown fences, no trailing text. The response must be parseable by JSON.parse().`;

  const user = `${context}

=== YOUR TASK: DISCOVERY CALL SCRIPT ===

Using the coach context above, write a complete word-for-word discovery/sales call script for this coach to use on one-to-one enrolment calls. The call lasts 45–60 minutes total.

This script is based on a proven consultative sales framework. Write each phase fully — the coach should be able to read it aloud almost verbatim while adapting naturally to the conversation.

─── WRITING RULES ───

- Write in FIRST PERSON from the coach's perspective (the coach is speaking to the prospect)
- Use the coach's actual programme name, price, audience, and transformation throughout
- Niche probe questions must be specific to this coach's audience struggles and goals — not generic
- The offer presentation must describe the actual programme phases/pillars from the context
- Price reveal must use the actual price from the context
- The post-call email must reference the specific conversation and programme
- Do NOT use placeholder text like [CLIENT NAME] — use "you" or audience-appropriate language
- Coaching notes should give practical delivery guidance (timing, tone, body language cues, branching paths)

─── PHASE SPECIFICATIONS ───

openingRapport (title: "Opening & Rapport", duration: "5 minutes")
script: Greet warmly, confirm they can talk for 45 minutes, build rapport with 2 questions about their current situation and what they do. Transition smoothly into the call frame. Use the coach's name in the opening.
coachingNotes: Tips on energy level, small talk, reading the prospect's mood, and the rapport-to-business transition timing.

callFrameSetting (title: "Setting the Call Frame", duration: "3–5 minutes")
script: Explain the call structure: "First I want to understand where you're at. Then I'll share what we do. At the end, if it makes sense, I'll share how we can work together — and if it's not right, I'll tell you that too." Confirm they are the decision-maker, or gently establish if a partner needs to be involved. Mention the investment range so there are no surprises at the end.
coachingNotes: The DM check should be done without pressure. The investment mention frames the call and removes the "I need to ask my partner" ambush at close.

painDiscovery (title: "Pain Discovery", duration: "10–15 minutes")
script: Start with the big open question: "Tell me, what made you reach out today — what's going on?" Then ask 5–7 niche-specific probe questions drawn from this coach's audience struggles. Each question should go deeper: from surface symptom → emotional impact → cost of inaction → failed attempts → what they've tried. Use the exact struggles, language, and obstacles from the context.
coachingNotes: Silence is your best tool — let them fill the space. Take notes. Never interrupt or offer solutions yet. If they go off topic, gently redirect: "That's really helpful — tell me more about [core pain]." Rate their pain level mentally on a scale of 1–10.

reflectionMirroring (title: "Reflection & Mirroring", duration: "3–5 minutes")
script: Mirror back everything they said — their words, not yours. Start with: "So let me make sure I understand what you've shared with me..." Summarise their current state, the impact, what they've tried, and why it hasn't worked. End with: "Is that a fair picture?" Then ask: "And how long has this been going on?" Then: "If nothing changes in the next 6 months, what does that mean for you?"
coachingNotes: Mirroring is the most important step — it shows you listened and builds massive trust. Use their exact phrases. The "6 months" question surfaces urgency without you having to manufacture it.

futurePacing (title: "Future Pacing", duration: "5–10 minutes")
script: Transition into the future: "Let's flip this. If we could wave a magic wand — what does life look like on the other side of this?" Let them describe it. Then paint a vivid picture using the coach's programme outcome and transformation. Use the audience's specific desired outcome from the context. Ask: "How would that feel?" and "What would change for you if you had that?" Tie the vision back to their specific words.
coachingNotes: Don't rush this. The more vivid their future picture, the more motivated they are to invest. Reflect their language back: "You said you want [X] — that's exactly who this is designed for."

offerPresentation (title: "Offer Presentation", duration: "10 minutes")
script: Transition: "Based on everything you've shared, I think I can actually help you. Let me tell you what we do." Deliver the offer in 3 parts: (1) Who it's for — positioning sentence using the audience and transformation. (2) How it works — describe the programme phases/pillars from the context, connecting each phase to a pain they mentioned. (3) Client example — share a real-ish result from the context's testimonials or results highlights. Close with: "Does that sound like what you've been looking for?"
coachingNotes: Connect every feature back to their specific pains from the discovery. Never just list features — always say "which means for you..." Keep it conversational, not a pitch deck presentation. Watch for the nod or the "yes" energy.

priceReveal (title: "Price Reveal", duration: "5 minutes")
script: Use the actual price from the context. Anchor it with value first — what it would cost to solve this problem another way, what the cost of inaction is. Frame it clearly: "The investment for [programme name] is [price]. We also have a payment plan option if that makes it easier." Then silence. Let them respond.
coachingNotes: Say the price and STOP TALKING. Many coaches over-explain after the price, which signals insecurity. The next person to speak loses. Hold the silence for up to 10 seconds. Write the price down — the act of writing anchors it.

closeAndEnroll (title: "Close & Enrol", duration: "5–10 minutes")
script: After the price silence, ask: "So where are you at with all that?" or "What questions do you have?" Handle any final hesitations. If they're ready: "Great — let me get you set up. I'll take your card details now / send you a payment link now." Confirm start date, next steps, what happens after payment.
coachingNotes: The close is just the natural next step after a great call — not a separate "sales pitch." If they hesitate, revisit their pain: "You said that if nothing changes in 6 months... Is that worth [price] to change?" Only close if you genuinely believe this is right for them.

objectionScripts: Generate 6–7 scripted objection handlers specific to this coach's audience. Base them on the objections listed in the context, plus common high-ticket coaching objections. Each response should: validate the concern, reframe it, tie back to their stated pain, and move gently toward a decision. Include: "I need to think about it", "I can't afford it", "I need to talk to my partner/husband/wife", "I've tried things before and they didn't work", "I'm not sure it will work for me", "Is this the right time?", and 1 niche-specific objection from the context.

postCallEmail: A warm, personalised follow-up email sent within 1 hour of the call if they didn't enrol on the day. It should: reference what they shared specifically, remind them of their future vision, restate the programme name and investment briefly, include a clear CTA (link to book a follow-up or pay), and have a personal sign-off from the coach.

callClosingScript: A graceful 60-second closing if they say they need more time. Confirm next steps: "I'll send you an email with everything we discussed. When can we schedule a quick 15-minute follow-up call?" Book the follow-up before hanging up.

prepChecklist: 7 specific things to do 30–60 minutes before every discovery call. Make them practical and specific to this type of coaching call (e.g., review their application/DM, have the payment link ready, review their social profile, close unnecessary tabs, etc.).

callOverview: 2–3 sentences summarising the call arc and the mindset the coach should bring.

─── JSON STRUCTURE ───

{
  "discoveryCallScript": {
    "callOverview": "string",
    "prepChecklist": ["string", ...],
    "openingRapport":      { "title": "string", "duration": "string", "script": "string", "coachingNotes": "string" },
    "callFrameSetting":    { "title": "string", "duration": "string", "script": "string", "coachingNotes": "string" },
    "painDiscovery":       { "title": "string", "duration": "string", "script": "string", "coachingNotes": "string" },
    "reflectionMirroring": { "title": "string", "duration": "string", "script": "string", "coachingNotes": "string" },
    "futurePacing":        { "title": "string", "duration": "string", "script": "string", "coachingNotes": "string" },
    "offerPresentation":   { "title": "string", "duration": "string", "script": "string", "coachingNotes": "string" },
    "priceReveal":         { "title": "string", "duration": "string", "script": "string", "coachingNotes": "string" },
    "closeAndEnroll":      { "title": "string", "duration": "string", "script": "string", "coachingNotes": "string" },
    "objectionScripts": [{ "objection": "string", "response": "string" }, ...],
    "postCallEmail": { "subject": "string", "body": "string" },
    "callClosingScript": "string"
  }
}`;

  return { system, user };
}
