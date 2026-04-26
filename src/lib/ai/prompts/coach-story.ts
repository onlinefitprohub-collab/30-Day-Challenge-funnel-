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
    ? `=== COPYWRITER STYLE (MANDATORY — DO NOT DEVIATE) ===

Your copywriting framework and voice have been pre-selected. Write ALL copy in exactly this style:

${styleDescription}

`
    : "";

  const storyInputs = [
    story.coachBeforeState    && `WHERE I STARTED:\n${story.coachBeforeState}`,
    story.coachTurningPoint   && `THE TURNING POINT:\n${story.coachTurningPoint}`,
    story.coachPersonalResult && `MY PERSONAL RESULT:\n${story.coachPersonalResult}`,
    story.coachWhyCoach       && `WHY I DO THIS:\n${story.coachWhyCoach}`,
  ].filter(Boolean).join("\n\n");

  return `${context}

${styleBlock}=== YOUR TASK ===

You are a world-class direct response copywriter. You are writing the coach's personal bio story for the "About the Coach" section of a high-ticket application funnel landing page.

The coach has answered 4 questions in their own words. Your job is to transform those raw answers into 3 polished, emotionally compelling paragraphs written in first person as the coach. The copy must:
- Feel authentic and personal — not corporate or generic
- Draw the reader in through vulnerability and honesty before establishing authority
- Make the ideal client feel deeply understood: "this person has been exactly where I am"
- Build trust through specificity: real numbers, real moments, real emotions
- End with a clear sense of the coach's mission and why this work matters to them

=== THE COACH'S RAW ANSWERS ===

Coach name: ${story.coachName}
Target audience: ${story.targetAudience}
Programme goal: ${story.mainGoal}${story.challengeName ? `\nProgramme name: ${story.challengeName}` : ""}

${storyInputs || "(No story inputs provided — generate a compelling generic coach bio based on the programme context above.)"}

=== PARAGRAPH STRUCTURE ===

part1 — THE BEFORE (100–150 words):
Open with the coach's struggle — where they were before they figured this out. Must feel honest and relatable. The reader should recognise themselves immediately. Do NOT start with "Hi, my name is..." — that's already on the page. Open with the raw truth of the situation. E.g. "For years, I was the person who..." or "I know what it feels like to..."

part2 — THE TURNING POINT (100–150 words):
Describe the moment of discovery — what changed, what they learned, what made everything click. This is where the reader starts to feel hope. Bridge from the struggle to the solution. Include any specific result the coach achieved for themselves.

part3 — THE MISSION (80–120 words):
Why the coach does this work. Their purpose and drive. This paragraph should make the ideal client feel seen, chosen, and confident that this is the right person to guide them. End on a forward-looking note — what the coach believes is possible for the reader.

=== OUTPUT FORMAT ===

Respond with ONLY valid JSON. No markdown, no explanation, no preamble.

{
  "coachStory": {
    "part1": "...",
    "part2": "...",
    "part3": "..."
  }
}`;
}
