const SEASONAL_CONTEXT: Record<number, string> = {
  1:  "January — New Year energy, fresh starts, people are highly motivated and setting fitness goals for the year",
  2:  "February — motivation dip month; Valentine's Day angle works well; people need accountability to keep January momentum",
  3:  "March — spring transformation begins; 'new you before summer' narrative starts gaining traction",
  4:  "April — spring in full swing; outdoor training, fresh energy, 8-week countdown to summer bodies",
  5:  "May — pre-summer push; urgency around beach/holiday season; 'last chance before summer' is compelling",
  6:  "June — summer begins; outdoor training, confidence in summer clothes, holiday prep",
  7:  "July — peak summer; social proof from before/after results; some coaches slow down, savvy ones capitalise",
  8:  "August — late summer; back-to-school energy starting; parents have more headspace; 'finish summer strong'",
  9:  "September — back-to-school/routine season; one of the highest-intent fitness months of the year after January",
  10: "October — autumn reset; building habits before the Christmas disruption; 'beat the holiday weight gain' angle",
  11: "November — pre-Christmas urgency; people want to feel great at Christmas events; 'last 6 weeks of the year'",
  12: "December — year-end reflection; 'don't wait until January' works well; positioning for New Year cohort",
};

export function buildMonthlyContentPrompt(
  context: string,
  monthName: string,
  monthNumber: number,
  year: number,
): { system: string; user: string } {
  const seasonal = SEASONAL_CONTEXT[monthNumber] ?? `${monthName} — adapt content to the season`;

  const system = `You are an expert fitness social media strategist who creates high-converting monthly content plans for online fitness coaches. You write hooks that stop the scroll, captions that build trust, and CTAs that drive DMs and sign-ups. Every post feels like native content — not advertising.

CRITICAL OUTPUT RULE: Return ONLY a single valid JSON object wrapped in:
{ "monthlyContentPlan": { ... } }
No preamble, no markdown fences, no trailing text. The response must be parseable by JSON.parse().`;

  const user = `${context}

=== YOUR TASK: ${monthName.toUpperCase()} ${year} CONTENT PLAN ===

Create a complete 30-post social media content plan for ${monthName} ${year}.

SEASONAL CONTEXT:
${seasonal}

This is NOT a generic 30-day content arc. Every post should feel specific to ${monthName} — hooks reference the season, captions speak to what the audience is thinking right now, CTAs align with where they are in their year.

─── CONTENT STRATEGY ───

Week 1 (Days 1–7): Establish authority + speak to ${monthName}-specific pain points
Week 2 (Days 8–14): Education and quick wins — build trust through genuine value
Week 3 (Days 15–21): Social proof and transformation — show what's possible this season
Week 4 (Days 22–30): Behind the scenes, objection handling, and direct call to action

Formats to cycle through (use each at least twice):
- "Talking head reel" — coach speaks direct to camera
- "Text-on-screen reel" — fast cuts, hook text appears on screen
- "Carousel post" — 5–8 swipeable slides
- "Before/after static" — image comparison with caption
- "Value list reel" — numbered tips delivered fast
- "Day-in-the-life reel" — authentic behind-the-scenes footage

─── WRITING RULES ───

Hooks (max 12 words): Must create pattern interrupt, curiosity, or instant relatability. No "Hey guys" openers. No emojis in the hook.
Captions (60–120 words): Story, education, or transformation. One idea per post. End with a question or CTA.
CTAs: Vary between engagement ("Drop a 🔥 below"), DM ("DM me the word X"), link ("Link in bio"), and direct ask ("Comment READY if you want in").

─── JSON STRUCTURE ───

{
  "monthlyContentPlan": {
    "month": "${monthName} ${year}",
    "monthlyTheme": "string — 1 sentence capturing the emotional/seasonal theme for this month's content",
    "weeklyFocuses": ["string", "string", "string", "string"],
    "posts": [
      {
        "day": 1,
        "theme": "string — 2-4 word topic label",
        "format": "string — one of the formats above",
        "hook": "string — the scroll-stopping opening line",
        "caption": "string — full post caption body",
        "cta": "string — the final action line"
      }
    ],
    "storyIdeas": [
      "string — a specific story/reel idea tied to this month (7 items)"
    ],
    "dmStarters": [
      "string — a DM opener coaches can use this month to start conversations (5 items)"
    ]
  }
}

Generate all 30 posts. Day numbers must be 1–30 in sequence. Make every hook feel like it was written specifically for ${monthName} ${year}.`;

  return { system, user };
}
