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
  dayRange: { start: number; end: number } = { start: 1, end: 30 },
): { system: string; user: string } {
  const seasonal = SEASONAL_CONTEXT[monthNumber] ?? `${monthName} — adapt content to the season`;
  const dayCount = dayRange.end - dayRange.start + 1;

  const system = `You are an expert fitness social media strategist who creates high-converting monthly content plans for online fitness coaches. You write hooks that stop the scroll, captions that build trust, and CTAs that drive DMs and sign-ups. Every post feels like native content — not advertising.

⚠️ ABSOLUTE RULE — NO PLACEHOLDER TEXT:
Never write placeholder text like [specific pain], [Value point 1], [topic], [result], [name], [audience], [challenge name] or any bracket-notation text. Every single word in every hook, caption and CTA must be final, ready-to-post copy. Use the coach's real details from the context block.

⚠️ EVERY POST MUST BE UNIQUE:
All ${dayCount} posts must have completely different hooks, different angles, and different captions. No two posts can reuse the same opening sentence or the same idea. Vary the tone, format, and audience insight across every post.

CRITICAL OUTPUT RULE: Return ONLY a single valid JSON object wrapped in:
{ "monthlyContentPlan": { ... } }
No preamble, no markdown fences, no trailing text. The response must be parseable by JSON.parse().`;

  const user = `${context}

=== YOUR TASK: ${monthName.toUpperCase()} ${year} CONTENT PLAN — DAYS ${dayRange.start}–${dayRange.end} ===

Create ${dayCount} social media posts for days ${dayRange.start} to ${dayRange.end} of the ${monthName} ${year} content calendar.

SEASONAL CONTEXT:
${seasonal}

─── HOW TO USE THE COACH CONTEXT ───

The coach context above contains real information about this specific coach, their audience, their programme, and their clients' results. USE THIS INFORMATION to write every post. Do not write generic fitness content. Write content that ONLY this coach could publish.

Examples of how to use the context:
- If the audience is "busy mums over 40 who want to lose weight" — write hooks that speak directly to that specific person's life
- If the programme is called "The 6-Week Lean Body Blueprint" — reference it by name in CTAs and captions
- If there's a client result like "Sarah lost 8kg in 8 weeks" — use that specific result in social proof posts
- If the coach has 5 years of experience — that is the credibility angle to use

─── CONTENT STRATEGY FOR DAYS ${dayRange.start}–${dayRange.end} ───

${dayRange.start <= 7 ? `Days 1–7: Establish authority + speak to ${monthName}-specific pain points. The audience is thinking about fresh starts and common frustrations. Mirror their internal dialogue.` : ""}
${dayRange.start <= 14 && dayRange.end >= 8 ? `Days 8–14: Education and quick wins — build trust through genuine value. Give away useful tips they can implement this week. Demonstrate expertise without selling.` : ""}
${dayRange.start <= 21 && dayRange.end >= 15 ? `Days 15–21: Social proof and transformation — show what is possible. Reference real client outcomes. Frame the coach as someone who gets results for people just like the reader.` : ""}
${dayRange.start <= 30 && dayRange.end >= 22 ? `Days 22–30: Behind the scenes, objection handling, and direct call to action. Address why people hesitate. Create urgency. Make the offer clear and compelling.` : ""}

Formats to use across these posts (rotate through them, use each format at least once):
- "Talking head reel" — coach speaks direct to camera
- "Text-on-screen reel" — fast cuts, hook text appears on screen
- "Carousel post" — 5–8 swipeable slides with real tips
- "Before/after static" — image comparison with caption about the transformation
- "Value list reel" — numbered tips delivered fast with specific actionable points
- "Day-in-the-life reel" — authentic behind-the-scenes footage

─── WRITING RULES ───

Hooks (max 12 words, no emojis): Punchy pattern interrupts. Start with the problem, a number, a contrarian take, or a story opener. Never start with "Hey guys" or "Are you ready".

BAD hook: "This is the one thing most [audience description] get wrong in [month]"
GOOD hook: "Stop doing this in the gym if you actually want to lose weight"
GOOD hook: "I used to hate telling clients this — but it's the truth"
GOOD hook: "Three words I stopped using in my coaching (and why)"

Captions (70–120 words): Write from the coach's first-person voice. Use short sentences and white space. Tell a specific story OR deliver a specific insight OR reference a real client outcome. End with the CTA question or instruction.

BAD caption: "If you're [audience] and you've been struggling with [specific pain], this post is for you. Here's what I've seen work:\n[Value point 1]\n[Value point 2]"
GOOD caption: "Most of my clients come to me after trying two or three other programmes that didn't stick.\nNot because they lacked willpower — but because the programme didn't fit their actual life.\nThe ${monthName} cohort of [programme name] is built differently. Three sessions a week, each under 30 minutes, with nutrition guidance that works around a busy schedule.\nIf that sounds like what's been missing, let's talk."

CTAs: Vary between engagement ("Drop a 🔥 below"), DM ("DM me the word X"), and direct ask ("Comment READY if you want in"). Make each CTA different from the others.

─── JSON STRUCTURE ───

{
  "monthlyContentPlan": {
    "month": "${monthName} ${year}",
    "monthlyTheme": "one sentence capturing the emotional/seasonal theme for this month's content",
    "weeklyFocuses": ["Week 1 focus sentence", "Week 2 focus sentence", "Week 3 focus sentence", "Week 4 focus sentence"],
    "posts": [
      {
        "day": ${dayRange.start},
        "theme": "2-4 word topic label",
        "format": "one of the six formats listed above",
        "hook": "the scroll-stopping opening line — max 12 words, no placeholders",
        "caption": "full ready-to-post caption — no placeholders, no bracket text, all content written out",
        "cta": "the final action line"
      }
    ],
    "storyIdeas": [
      "specific story/reel idea tied to this month (provide 7 items)"
    ],
    "dmStarters": [
      "a DM opener the coach can copy and paste to start conversations this month (provide 5 items)"
    ]
  }
}

Generate exactly ${dayCount} posts numbered day ${dayRange.start} through day ${dayRange.end}. Every hook must be unique. Every caption must be unique. Use the coach's real programme name, real audience details, and real results from the context.`;

  return { system, user };
}
