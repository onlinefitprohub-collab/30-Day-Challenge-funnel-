/**
 * Coach Story Bio — AI-Generated First-Person Narrative
 *
 * Generates: coachStory (3 paragraphs injected into the GHL template coach bio section)
 *
 * Inputs come from the wizard's "Your Story" step — 4 leading questions answered
 * by the coach in their own words. The AI turns raw answers into polished copy.
 */

export interface CoachStoryInputFields {
  coachName:           string;
  coachBeforeState?:   string;
  coachTurningPoint?:  string;
  coachPersonalResult?: string;
  coachWhyCoach?:      string;
  targetAudience:      string;
  mainGoal:            string;
  challengeName?:      string;
}

export function buildCoachStoryPrompt(
  context: string,
  styleDescription: string | undefined,
  story: CoachStoryInputFields,
): string {
  const styleBlock = styleDescription
    ? `=== COPYWRITER STYLE (MANDATORY — DO NOT DEVIATE) ===\n\nYour copywriting framework and voice have been pre-selected. Write ALL copy in exactly this style:\n\n${styleDescription}\n\n`
    : "";

  const storyInputs = [
    story.coachBeforeState    && `WHERE I STARTED:\n${story.coachBeforeState}`,
    story.coachTurningPoint   && `THE TURNING POINT:\n${story.coachTurningPoint}`,
    story.coachPersonalResult && `MY PERSONAL RESULT:\n${story.coachPersonalResult}`,
    story.coachWhyCoach       && `WHY I DO THIS:\n${story.coachWhyCoach}`,
  ].filter(Boolean).join("\n\n");

  return `${context}\n\n${styleBlock}=== YOUR TASK ===\n\nYou are a world-class direct response copywriter. You are writing the coach's personal bio story for the "About the Coach" section of a high-ticket application funnel landing page.\n\nThe coach has answered 4 questions in their own words. Your job is to transform those raw answers into 3 polished, emotionally compelling paragraphs written in first person as the coach. The copy must:\n- Feel authentic and personal — not corporate or generic\n- Draw the reader in through vulnerability and honesty before establishing authority\n- Make the ideal client feel deeply understood: "this person has been exactly where I am"\n- Build trust through specificity: real numbers, real moments, real emotions\n- End with a clear sense of the coach's mission and why this work matters to them\n\n=== THE COACH'S RAW ANSWERS ===\n\nCoach name: ${story.coachName}\nTarget audience: ${story.targetAudience}\nProgramme goal: ${story.mainGoal}${story.challengeName ? `\nProgramme name: ${story.challengeName}` : ""}\n\n${storyInputs || "(No story inputs provided — generate a compelling generic coach bio based on the programme context above.)"}\n\n=== PARAGRAPH STRUCTURE ===\n\npart1 — THE BEFORE (100–150 words):\nOpen with the coach's struggle — where they were before they figured this out. Must feel honest and relatable. The reader should recognise themselves immediately. Do NOT start with "Hi, my name is..." — that's already on the page. Open with the raw truth of the situation. E.g. "For years, I was the person who..." or "I know what it feels like to..."\n\npart2 — THE TURNING POINT (100–150 words):\nDescribe the moment of discovery — what changed, what they learned, what made everything click. This is where the reader starts to feel hope. Bridge from the struggle to the solution. Include any specific result the coach achieved for themselves.\n\npart3 — THE MISSION (80–120 words):\nWhy the coach does this work. Their purpose and drive. This paragraph should make the ideal client feel seen, chosen, and confident that this is the right person to guide them. End on a forward-looking note — what the coach believes is possible for the reader.\n\nbridgeHeadline — THE PAIN-POINT BRIDGE (max 12 words):\nA single punchy sentence placed BETWEEN part1 and part2 on the page. Its purpose: make the ideal client feel deeply seen — they should read it and nod, thinking "that's me." Write it as a direct statement of shared pain that naturally pivots toward hope. No rhetorical questions. No emojis. No filler phrases.\nGood examples: "Still searching for something that finally sticks." / "If that sounds like your story, keep reading." / "That guilt and exhaustion is real — and it has a solution." / "Sound familiar? The good news is, it doesn't have to stay this way."\n\n=== OUTPUT FORMAT ===\n\nRespond with ONLY valid JSON. No markdown, no explanation, no preamble.\n\n{\n  "coachStory": {\n    "part1": "...",\n    "part2": "...",\n    "part3": "...",\n    "bridgeHeadline": "..."\n  }\n}`;
}
