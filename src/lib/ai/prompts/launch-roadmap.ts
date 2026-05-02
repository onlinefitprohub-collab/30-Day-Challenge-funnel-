/**
 * Launch Roadmap prompt
 *
 * Generates a phased launch roadmap that tells the coach exactly what to do
 * and when — from initial setup through to post-challenge upsell.
 * References specific FitPro Launch assets at each step.
 */

export function buildLaunchRoadmapPrompt(context: string): { system: string; user: string } {
  const system = `You are an expert online fitness business launch strategist who has helped hundreds of coaches go from zero to fully-booked using challenge and application funnels. You create practical, step-by-step launch roadmaps that are specific to the coach's offer, funnel type, and audience. Every task you recommend is actionable, time-estimated, and connected to a real tool or asset.

CRITICAL OUTPUT RULE: Return ONLY a single valid JSON object wrapped in:
{ "launchRoadmap": { ... } }
No preamble, no markdown fences, no trailing text. The response must be parseable by JSON.parse().`;

  const user = `${context}

=== YOUR TASK: LAUNCH ROADMAP ===

Write a complete phased launch roadmap for this coach. The roadmap covers everything from initial setup to post-challenge upsell — a full end-to-end business launch plan.

Where relevant, reference which FitPro Launch asset covers each task (e.g. "Use your FitPro Launch Landing Page copy", "Run your Discovery Call Script"). This makes the roadmap feel like a direct implementation guide for the tool they just used.

─── PHASE STRUCTURE ───

Generate 6 phases:

Phase 1 — "Foundation" (timing: "Week 1 — 4 weeks before launch")
Goal: Get all the technical pieces in place before any promotion starts.
Tasks: Set up the funnel in HighLevel or your page builder (use FitPro Launch landing page copy), set up email/SMS automations, connect payment processor, set up booking calendar, create tracking spreadsheet.

Phase 2 — "Audience Warm-Up" (timing: "Weeks 2–3 — 3 weeks before launch")
Goal: Warm up your existing audience before any paid promotion.
Tasks: Post 3x/week using content calendar content, DM 10 warm leads per day using the DM script, post stories daily, share 1 testimonial/transformation per week, engage with target audience accounts for 15 min/day.

Phase 3 — "Pre-Launch Push" (timing: "Week 4 — 1 week before launch")
Goal: Build urgency and fill the pipeline before opening registration.
Tasks: Launch Facebook/Instagram ads (use FitPro Launch ad copy), send pre-launch email to existing list, increase DM outreach to 20 leads/day, post daily countdown stories, run a "founding member" or early bird offer if applicable.

Phase 4 — "Registration Open" (timing: "Launch week")
Goal: Convert warm leads and ad traffic into challenge registrations.
Tasks: Open registration and send launch email, post daily on all platforms, reply to every comment within 1 hour, run discovery calls using the call script (aim for 3–5 calls/day), send SMS follow-ups to non-openers.

Phase 5 — "Challenge Delivery" (timing: "Challenge weeks 1–4")
Goal: Deliver an exceptional experience that generates testimonials and referrals.
Tasks: Send daily SMS prompts (use FitPro Launch delivery pack), send weekly emails (use weekly email templates), post client wins publicly with permission, run weekly group Q&A, collect progress photos/videos for social proof.

Phase 6 — "Post-Challenge Growth" (timing: "Week after challenge ends")
Goal: Harvest testimonials, convert completers to next-tier, and re-engage non-completers.
Tasks: Send testimonial harvest sequence, run upsell email sequence (send to all completers), book follow-up calls with highest-engagement clients, post transformation results, plan next cohort launch date.

─── ADDITIONAL FIELDS ───

quickStartPriorities: The 5 most important things to do in the very first sitting (first 2 hours). These should be the highest-leverage setup tasks.

commonMistakes: 4–6 mistakes coaches typically make when launching for the first time. Make these specific, not generic ("not posting enough" is too vague — "launching ads before the landing page is live" is specific).

totalTimeToLaunch: How long from starting setup to having an active, live challenge (e.g. "4 weeks from today").

overview: 2–3 sentences on the philosophy of this launch plan — why it's structured this way.

─── TASK CATEGORY GUIDE ───
- "setup" = technical/admin (pages, automations, calendar)
- "content" = organic social, emails, stories
- "ads" = paid advertising
- "sales" = calls, DMs, closing
- "delivery" = running the actual challenge
- "growth" = testimonials, referrals, upsell

─── JSON STRUCTURE ───

{
  "launchRoadmap": {
    "overview": "string",
    "totalTimeToLaunch": "string",
    "phases": [
      {
        "name": "string",
        "timing": "string",
        "goal": "string",
        "tasks": [
          { "task": "string", "category": "setup|content|ads|sales|delivery|growth", "fitproAsset": "string or omit", "timeEstimate": "string" }
        ],
        "completionMarker": "string"
      }
    ],
    "quickStartPriorities": ["string", ...],
    "commonMistakes": ["string", ...]
  }
}`;

  return { system, user };
}
