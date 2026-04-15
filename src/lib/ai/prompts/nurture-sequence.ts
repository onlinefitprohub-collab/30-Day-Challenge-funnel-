/**
 * 52-Week Email Nurture Sequence
 *
 * Generated in 4 batches of 13 weeks each (one per quarter).
 * Each batch is a separate Claude call, fired in parallel pairs.
 *
 * Quarter themes:
 *   Q1 (weeks  1–13): Foundation — habits, mindset shifts, early identity
 *   Q2 (weeks 14–26): Momentum — visible results, overcoming plateaus
 *   Q3 (weeks 27–39): Transformation — deep change, confidence, community
 *   Q4 (weeks 40–52): Legacy — identity lock-in, next-level goals, new challenge invitation
 */

type Quarter = 1 | 2 | 3 | 4;

interface QuarterConfig {
  label: string;
  weekStart: number;
  weekEnd: number;
  theme: string;
  focus: string;
  emailTypes: string;
}

const QUARTER_CONFIG: Record<Quarter, QuarterConfig> = {
  1: {
    label:      "Q1: Foundation",
    weekStart:  1,
    weekEnd:    13,
    theme:      "Building the foundation — habits, identity shifts, and early momentum",
    focus:      "Help the reader understand why they haven't succeeded before, introduce the mindset and habits that make the challenge work, and build a sense of possibility. These emails should feel like the start of a relationship with a trusted coach.",
    emailTypes: "motivational check-ins, habit-building tips, mindset reframes, 'why this time is different' frames, quick wins to build confidence, story-driven emails about the journey starting",
  },
  2: {
    label:      "Q2: Momentum",
    weekStart:  14,
    weekEnd:    26,
    theme:      "Building momentum — early results, overcoming the mid-journey plateau",
    focus:      "The reader has been in the coach's world for 3+ months. Acknowledge their progress. Address the plateau that most people hit. Share social proof of others who kept going. Re-ignite motivation with new angles on the same core transformation.",
    emailTypes: "progress celebration emails, plateau-busting tips, client success stories, 'halfway there' mindset content, advanced strategies, community stories, new challenge invitation hints",
  },
  3: {
    label:      "Q3: Transformation",
    weekStart:  27,
    weekEnd:    39,
    theme:      "Deep transformation — confidence, identity, and community belonging",
    focus:      "By now the reader has been in contact for 6+ months. These emails go deeper — identity, belonging, how their life looks different now versus before. Start seeding the idea of the next level. These are the most personal emails in the sequence.",
    emailTypes: "identity shift stories, community and belonging themes, 'who you're becoming' reframes, deeper transformation case studies, challenge anniversary content, soft re-invitation to next cohort",
  },
  4: {
    label:      "Q4: Legacy",
    weekStart:  40,
    weekEnd:    52,
    theme:      "Legacy — locking in the new identity and inviting the next chapter",
    focus:      "The final quarter. These emails celebrate how far they've come, plant the seed of passing it on or levelling up, and build anticipation for the next challenge cohort. End the year with a strong invitation to join again or refer a friend.",
    emailTypes: "year-in-review reflection emails, 'look how far you've come' content, gift-to-yourself or gift-for-others framing, next challenge cohort launch teasers, referral or community-building asks, final 'this is who you are now' identity email",
  },
};

export function buildNurturePrompt(context: string, quarter: Quarter): string {
  const q = QUARTER_CONFIG[quarter];

  return `${context}

=== YOUR TASK: 52-WEEK EMAIL NURTURE — ${q.label.toUpperCase()} ===

You are writing ${q.weekEnd - q.weekStart + 1} weekly nurture emails (weeks ${q.weekStart}–${q.weekEnd}) for a long-term email sequence specific to this coach and their challenge.

QUARTER THEME: ${q.theme}

FOCUS FOR THIS QUARTER:
${q.focus}

EMAIL MIX TO USE:
${q.emailTypes}

─── RULES ───

- Every email must feel specific to THIS coach and THIS audience — not generic wellness advice
- Reference the coach's challenge, their specific audience struggles, and the transformation they deliver
- Write in first person (the coach is writing)
- Subject lines: under 50 characters, specific and curiosity-driven, no "Quick update" or "Important news"
- Body: 150–250 words. Short paragraphs (2–3 sentences max). Conversational, warm, and direct.
- One clear idea per email — don't pack multiple messages into one
- Use {first_name} as the merge tag — once, near the top, only when it sounds natural
- End with the coach's first name only (no "Best regards")
- Each email needs a distinct 3–5 word theme that describes the specific angle (e.g. "Beating the mid-point slump", "The identity shift no one talks about")
- Vary the tone week to week — don't let every email sound identical
- Week ${q.weekEnd} should feel like a natural ending to this quarter, with a thread leading into the next chapter

─── OUTPUT FORMAT ───

Return ONLY this JSON. No preamble, no markdown fences:

{
  "emails": [
    {
      "week": ${q.weekStart},
      "theme": "...",
      "subject": "...",
      "body": "..."
    },
    {
      "week": ${q.weekStart + 1},
      "theme": "...",
      "subject": "...",
      "body": "..."
    }
    ... (${q.weekEnd - q.weekStart + 1} total emails, weeks ${q.weekStart} through ${q.weekEnd})
  ]
}`;
}
