/**
 * VSL Script — Video Sales Letter for Application Funnels
 *
 * Generates: vslScript (11 sections for a 10–20 minute spoken video script)
 *
 * Used by application funnels only. The script draws on all wizard inputs —
 * coach story, programme details, transformations, credentials — to produce
 * a fully scripted, spoken-word VSL the coach can record directly.
 */

export function buildVslScriptPrompt(
  context: string,
  styleDescription?: string,
): string {
  const styleBlock = styleDescription
    ? `=== COPYWRITER STYLE (MANDATORY — DO NOT DEVIATE) ===

Write ALL copy in exactly this style. Apply the rhythm, sentence structure, tone, and personality throughout the entire script:

${styleDescription}

`
    : "";

  return `${context}

${styleBlock}=== YOUR TASK ===

You are an elite direct response copywriter specialising in high-ticket coaching VSLs (Video Sales Letters). Write a full, word-for-word VSL script for this application funnel — a 10–20 minute spoken video the coach records and places at the top of their registration page.

The script must:
- Sound completely natural when spoken aloud — no corporate language, no phrasing that only reads well on paper
- Feel like a conversation the coach is having personally with one specific viewer
- Build through a precise emotional arc: curiosity → identification → hope → trust → desire → action
- Be grounded in the specific niche, audience, and results from the context above
- Every section must be production-ready — the coach should be able to record this word-for-word

Write each section as if the coach is speaking directly to camera. Use short sentences, natural pauses, and conversational rhythm. Where you write [pause] or [beat], the coach stops for effect.

=== SECTION-BY-SECTION INSTRUCTIONS ===

hook (150–250 words):
The first 30–60 seconds. Make the viewer stop scrolling. Open with ONE of: a shocking statistic, a bold counterintuitive statement, a direct callout ("If you're a [audience] who..."), or a vivid "imagine this" scenario. Then immediately name exactly who this video is for and promise one specific thing they'll discover. Do NOT introduce the coach yet — earn the right first.

problemStatement (200–350 words):
Name the exact pain the viewer is living with right now. Be specific and vivid — use the language from the context, not generic fitness phrases. Show them you understand their world: what they've tried, why it hasn't worked, and what it's costing them. This section should make the viewer think "how does this person know exactly what I'm going through?"

agitation (150–250 words):
Make the cost of staying stuck viscerally clear. What does their life look like in 12 months if nothing changes? What are they missing out on right now — physically, emotionally, socially? This is not about piling on shame — it's about painting the contrast between where they are and where they could be. End on a pivot: "But it doesn't have to be this way."

coachStoryBridge (250–400 words):
The coach's story. Open with "My name is [coach name]..." then immediately go into their OWN before state — before they figured this out. Then the turning point: what changed, what they discovered, what made everything click. Then the result: what happened for them when they applied this approach. End by connecting their journey to the viewer: "Which is why I created [programme name]."

solutionReveal (200–300 words):
Introduce the unique mechanism — the specific reason why this programme gets results that other approaches don't. Name it if it has a name. Explain exactly WHY it works in simple, clear terms. Distinguish it from what the viewer has tried before. This is not a list of features — it's the reason the approach is different at a fundamental level.

programmeWalkthrough (250–400 words):
Walk through what's included, step by step. Describe what the client's first week looks like, what a typical month feels like, and what they'll have achieved by the end. Name the deliverables with benefit-led language — not "weekly calls" but "weekly 1:1 strategy sessions where we adjust your plan based on exactly how your body is responding." End with: "Here's what clients say about the experience..."

socialProof (200–300 words):
Script 2–3 brief client story testimonials using the transformation data from context. Format each as: [Name], a [description], came to me [before state]. After [timeframe] of [programme], [specific result]. If no specific clients are provided in context, write plausible-sounding but clearly illustrative examples — flag them as examples the coach should replace with real ones.

offerPresentation (200–300 words):
Reveal the programme name and investment. Build the value stack before revealing the price: "Here's everything you get..." Then state the investment and immediately frame it: payment options if available, ROI anchor if provided ("one new client pays for this"), comparison frames. Make the price feel like an obvious decision given the value.

objectionHandling (200–300 words):
Address the top 3 objections one by one in script form. Format: "Now, you might be thinking... [objection]." Then answer directly, honestly, and without dismissing the concern. Use real reasoning, not hype. The three objections should come from the wizard context — if not specified, use the most common high-ticket coaching objections: "I've tried this before," "I can't afford it," and "I don't have time."

callToAction (150–200 words):
The close. Tell the viewer exactly what to do next — click the button, fill in the application, book the call — and what happens after they do it. Make this feel like the natural next step, not a hard sell. Remind them of the single most powerful result this programme delivers.

closingScarcity (100–150 words):
Final urgency. Reference the cohort start date and/or application deadline from context if provided — real urgency is far more powerful than manufactured scarcity. If not provided, use capacity scarcity ("I only work with X clients at a time"). End with a final direct address to the viewer: look into the camera, say their name (or "friend"), and make one final emotional appeal. Close with something memorable — a line they'll carry with them after the video ends.

=== OUTPUT FORMAT ===

Respond with ONLY valid JSON. No markdown, no preamble, no explanation. All values must be strings containing natural spoken-word script.

{
  "vslScript": {
    "hook": "...",
    "problemStatement": "...",
    "agitation": "...",
    "coachStoryBridge": "...",
    "solutionReveal": "...",
    "programmeWalkthrough": "...",
    "socialProof": "...",
    "offerPresentation": "...",
    "objectionHandling": "...",
    "callToAction": "...",
    "closingScarcity": "..."
  }
}`;
}
