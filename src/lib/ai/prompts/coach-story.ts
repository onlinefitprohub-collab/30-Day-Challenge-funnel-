/**
 * Coach Story Bio — AI-Generated First-Person Narrative
 *
 * Generates: coachStory (3 long-form sections injected into the GHL template coach bio section)
 *
 * Inputs come from the wizard's "Your Story" step — 4 leading questions answered
 * by the coach in their own words. The AI turns raw answers into polished, long-form copy.
 *
 * Part 1 (300–450 words): Before state — pain, struggle, daily-life detail
 * bridgeHeadline: Short punchy line that agitates the pain and pivots to hope
 * Part 2 (300–450 words): Turning point — discovery, what changed, personal result
 * Part 3 (200–300 words): Mission — why coaching, who they help, invitation to reader
 *
 * Each part uses \n\n between paragraphs so the injection layer wraps them in <p> tags.
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
    ? `=== COPYWRITER STYLE (MANDATORY — DO NOT DEVIATE) ===\n\nYour copywriting framework and voice have been pre-selected. Write ALL copy in exactly this style:\n\n${styleDescription}\n\n=== HOW THE COPYWRITER STYLE CONTROLS THIS BIO'S STRUCTURE ===\nThe style above defines HOW this bio is structured — not just how it sounds. Adapt the section instructions below to match the style's known structural signature. The STYLE WINS over generic formatting rules:\n- Russell Brunson: Open part1 with a single vivid scene — the "Epiphany Bridge" moment. NOT a background intro. The incident should pull the reader immediately into the coach's struggle.\n- Dan Kennedy: Open part1 with a blunt, contrarian claim or a stark problem statement. No warm-up, no softening. Get to the point in the first sentence.\n- Alex Hormozi: Lead part1 with the concrete result the coach achieved (data first), then backfill the story that explains how.\n- David Ogilvy: Open part1 with the single most impressive specific fact about the coach's results or credentials.\n- Gary Halbert: Open with an urgent personal confession that creates immediate identification in the reader.\n- Eugene Schwartz: Open part1 by meeting the reader in their existing desire — the coach's story is a mirror for where the reader already wants to go.\nFor any other style: let the STYLE define the opening move of part1. Fulfil the word count requirements, but let the style determine the structure.\n\n`
    : "";

  const storyInputs = [
    story.coachBeforeState    && `WHERE I STARTED:\n${story.coachBeforeState}`,
    story.coachTurningPoint   && `THE TURNING POINT:\n${story.coachTurningPoint}`,
    story.coachPersonalResult && `MY PERSONAL RESULT:\n${story.coachPersonalResult}`,
    story.coachWhyCoach       && `WHY I DO THIS:\n${story.coachWhyCoach}`,
  ].filter(Boolean).join("\n\n");

  return `${context}

${styleBlock}=== YOUR TASK ===

You are a world-class direct response copywriter. You are writing the coach's personal story for the "About the Coach" section of a high-ticket application funnel landing page.

The coach has answered questions in their own words. Your job is to transform those raw answers into three long-form, emotionally compelling sections written in first person as the coach.

THIS COPY MUST BE LONG AND DETAILED. Short paragraphs are NOT acceptable. Each section must tell a real, specific story that makes the ideal client feel deeply understood and builds genuine trust. Use specific details, emotions, moments, and turning points — not vague generalities.

The copy must:
- Feel authentic and deeply personal — raw honesty, not polished corporate language
- Open with the reader recognising themselves immediately in the coach's story
- Build from vulnerability → discovery → authority → invitation
- Use specific numbers, timeframes, emotions, and vivid details throughout
- Separate paragraphs with a blank line (\\n\\n between each paragraph)

=== THE COACH'S RAW ANSWERS ===

Coach name: ${story.coachName}
Target audience: ${story.targetAudience}
Programme goal: ${story.mainGoal}${story.challengeName ? `\nProgramme name: ${story.challengeName}` : ""}

${storyInputs || "(No story inputs provided — generate a compelling, detailed coach bio based on the programme context above. Invent specific, plausible details that would resonate deeply with the target audience described.)"}

=== SECTION STRUCTURE ===

part1 — THE BEFORE STATE (120–160 words, 2 paragraphs):
Tell the coach's full "before" story in detail. This is where they were BEFORE they found the solution.
- Open with an honest, vulnerable statement about where the coach was. Do NOT start with "Hi, my name is..." — that heading is already on the page.
- Describe their day-to-day life in specific, sensory detail: what were the mornings like, what did they feel when they looked in the mirror, how did it affect their relationships, confidence, energy?
- Name the specific pain points, failed attempts, and emotional low points. Give them names and moments.
- Paint the picture so clearly that the ideal client reads it and thinks "this person was me."
- End this section still in the "before" — do NOT reveal the solution here. Leave the reader in the problem.
Each paragraph should be 3–5 sentences. Separate paragraphs with \\n\\n.

part2 — THE TURNING POINT & TRANSFORMATION (300–450 words, 3–5 paragraphs):
This is where everything changed. Tell the story of discovery and personal transformation.
- Open with the specific moment, conversation, realisation, or event that changed everything.
- Describe what they discovered, learned, or did differently. Be specific about the approach or method.
- Walk through the transformation: what changed first, then what changed next. Include real results with numbers and timeframes where possible.
- Describe how their life changed beyond just the physical — confidence, relationships, energy, identity.
- End with the pivot: why this experience made them want to help others do the same.
Each paragraph should be 3–5 sentences. Separate paragraphs with \\n\\n.

part3 — THE MISSION & INVITATION (200–300 words, 2–3 paragraphs):
Why the coach does this work and why the reader should trust them.
- Open with a clear statement of the coach's mission — who they exist to help and why.
- Reference how many people they've helped, the kinds of transformations they've seen, and what makes their approach different from everything else out there.
- End with a warm, direct invitation: make the ideal client feel chosen, seen, and confident that this is the right person to guide them. Look them in the eye through the page.
Each paragraph should be 3–5 sentences. Separate paragraphs with \\n\\n.

bridgeHeadline — THE PAIN-POINT AGITATOR (max 12 words):
A single powerful sentence placed BETWEEN part1 and part2. Its purpose: name the pain so precisely that the reader stops, feels seen, and wants to keep reading. It should agitate the exact frustration described in part1 — then hint that something is about to change.
Write as a bold statement, not a question. Examples for tone:
- "Still trying to figure out why nothing works — even when you're doing everything right."
- "That exhaustion and self-doubt is real. And it has a cause — and a solution."
- "The worst part? You already know what you should be doing. So why isn't it working?"
Max 12 words. No emojis. No filler phrases.

=== CRITICAL OUTPUT RULES ===

- part1 MUST be 120–160 words (2 concise paragraphs). It sits in a narrow right column next to a photo — keep it short and punchy. If it exceeds 160 words, you have failed.
- part2 MUST be at least 300 words. If it is less, you have failed.
- part3 MUST be at least 200 words. If it is less, you have failed.
- Use \\n\\n between every paragraph within each part.
- Do NOT summarise or abbreviate. Write the FULL copy.
- Respond with ONLY valid JSON. No markdown, no explanation, no preamble.

{
  "coachStory": {
    "part1": "...",
    "part2": "...",
    "part3": "...",
    "bridgeHeadline": "..."
  }
}`;
}
