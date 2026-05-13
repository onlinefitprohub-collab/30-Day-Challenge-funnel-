import { buildCopyStandardsBlock } from "../copy-quality";

export function buildContentCalendarPrompt(context: string, styleBlock: string): string {
  return `${context}

${buildCopyStandardsBlock()}

=== YOUR TASK: 30-DAY ORGANIC CONTENT CALENDAR ===

You are creating a 30-day social media content plan for the coach above. This calendar will be used to build organic reach and drive sign-ups for their challenge or programme — without paid ads.

The content must be native to short-form video (Reels/TikTok) and static social (Instagram/Facebook). Every post must feel like content, not advertising.

=== COPYWRITER STYLE (MANDATORY — DO NOT DEVIATE) ===

${styleBlock}

=== STYLE ENFORCEMENT — APPLIES TO EVERY LINE ===
The copywriter style above is not a tone suggestion — it is the creative brief for this entire calendar. Every post hook, caption, CTA line, and content theme must be unmistakably written in this copywriter's voice. A reader who knows this copywriter's published work should be able to identify the style from a single sentence. Do NOT write generic social posts and then adjust for style. BUILD every hook and caption from the style's structure, vocabulary, sentence rhythm, and signature moves. If the content format rules below conflict with the style's structural framework, the STYLE WINS.

=== CONTENT STRATEGY PRINCIPLES ===

- Posts 1–7: Establish authority and call out the pain. Attract the right audience.
- Posts 8–14: Education and quick wins. Build trust by giving genuine value.
- Posts 15–21: Social proof and transformation. Show what's possible.
- Posts 22–28: Behind the scenes, objection handling, and urgency.
- Posts 29–30: Direct call to action. Enrolment or application push.

Formats to cycle through:
- "Talking head reel" — coach speaks direct to camera
- "Text-on-screen reel" — fast cuts, no face required
- "Carousel post" — 5–8 swipeable slides
- "Before/after static" — image comparison with caption
- "Day-in-the-life reel" — authentic footage of coaching process
- "Value list reel" — numbered tips delivered fast

=== OUTPUT FORMAT ===

Respond with ONLY valid JSON. No markdown, no explanation. Conform exactly to this structure:

{
  "contentCalendar": {
    "strategy": "2–3 sentence overview of the content arc and how it drives sign-ups",
    "posts": [
      {
        "day": 1,
        "theme": "Pain call-out",
        "format": "Talking head reel",
        "hook": "The single opening line — must stop the scroll. Max 15 words.",
        "caption": "Full caption text. 60–120 words. Include story, value, or tension. End with the CTA line.",
        "cta": "The final action line. E.g. 'Drop a 🔥 if this hits home' or 'Link in bio to join the waitlist.'"
      }
    ]
  }
}

Generate all 30 posts. Day numbers must be 1–30 in sequence.`;
}
