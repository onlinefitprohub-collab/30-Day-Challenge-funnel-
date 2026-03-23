/**
 * Group 3: Ads, Creative & Campaign Setup
 * Generates: adCopy, creativePrompts, campaignNaming
 *
 * Traffic acquisition assets — what cold audiences see first.
 * Must hook fast, build just enough trust to click, and hand off cleanly to the landing page.
 */

export function buildAdsCampaignPrompt(context: string): string {
  return `${context}

=== YOUR TASK: AD COPY, CREATIVE PROMPTS & CAMPAIGN SETUP ===

Write Facebook/Instagram ad copy, creative direction, and campaign naming for this specific challenge and coach. These ads are targeting cold audiences who don't know the coach yet — make the copy earn their attention without overselling.

─── FACEBOOK AD POLICY COMPLIANCE (MANDATORY) ───

All copy must pass Facebook ad policy review. Violations get ads rejected or accounts flagged:
- NEVER imply personal attributes: no "if you're overweight", "for people who struggle financially", "if you have [health condition]" — this is discriminatory targeting
- NEVER make guaranteed outcome claims: no "lose 10kg in 30 days guaranteed", no specific income promises
- NEVER use before/after body transformation framing — Facebook restricts fitness before/after imagery
- NEVER make medical claims: "cures", "treats", "eliminates pain", "reverses [condition]" are prohibited
- DO use aspirational lifestyle language instead of problem-shaming
- DO frame results as possible, not guaranteed: "members often find...", "many coaches see..." not "you will..."
- DO use first-person coach voice — less likely to trigger personal attribute violations than "you" framing
- Testimonials must imply they are individual results, not typical outcomes

─── AD COPY RULES ───

HOOKS (first 1–2 lines of the primary text — the scroll-stopper):
- The hook decides whether anyone reads the rest. Write 3 genuinely different hooks.
- Hook angles to try: name the specific person ("If you're a [specific audience description]..."), call out a specific situation they recognise, open with a contrarian or surprising statement, use a specific number or timeframe
- Do NOT start any hook with "Are you tired of...", "Have you ever...", or "Imagine if..."
- Do NOT use "you" language that implies a personal attribute (weight, health, finances)
- Hooks should be 10–20 words. Tight and specific.
- Each hook should work on its own — if someone only reads the first line, it should land

PRIMARY TEXTS (the full ad body — 3 versions):
- Each version should open with the corresponding hook
- Write in first person — the coach is speaking, not "we"
- Reference the audience's real situation using the context provided
- Mention 2–3 key inclusions naturally within the copy — not as a bulleted list
- End with a clear CTA that matches the primary CTA type (booking vs direct sign-up)
- Version 1: Longer form (120–180 words). Builds context, addresses one objection.
- Version 2: Social proof angle if testimonials exist in context. Otherwise: storytelling or coach credibility angle. 80–120 words.
- Version 3: Shortest (50–80 words). Punchy and direct. Good for mobile or smaller placements.
- Do not use: "limited spots", "life-changing", "once in a lifetime", "don't miss out"

HEADLINES (the text below the creative — 3 options):
- 4–7 words ideally. Outcome or CTA.
- Should complement the creative, not repeat it
- One per primary text version — they should feel like a matched set

DESCRIPTIONS (below the headline — 3 options):
- One line each. Reinforces the headline.
- Can be a quick stat, a social proof snippet, a CTA reinforcement, or a specificity booster

─── CREATIVE PROMPT RULES ───

These are briefs for the coach or their designer/videographer. They should be actionable without any prior knowledge of video or design.

STATIC IMAGE IDEAS (3 concepts):
- For each: describe the visual in concrete terms (what's in frame, composition, colour direction), any text overlay (actual words, not "add a headline"), and the intended emotional reaction
- At least one should be quick and cheap to produce (phone photo or text-only graphic)
- Avoid vague instructions like "use a good photo of you" or "make it eye-catching"

TALKING HEAD VIDEO PROMPTS (3 concepts):
- For each: setting (where to film), opening line (word-for-word — the actual first thing they say), key message structure (what to cover in 30–60 seconds as bullet points), and the exact CTA to end on
- One should be 15–20 seconds max (hook + one point + CTA)
- One should address a specific objection from the context

LIFESTYLE CONTRAST CONCEPTS (2 concepts):
- Facebook restricts body transformation before/after imagery. Instead: contrast lifestyle states, habits, or routines — not appearance
- Describe the "before" feeling/situation and the "after" feeling/situation in terms of energy, confidence, routine, or consistency
- Frame around habits, mindset, or schedule — never around weight, body size, or physical appearance metrics
- Must be implementable without professional equipment and must pass Facebook's ad policy on body image

UGC-STYLE PROMPTS (2 concepts):
- Written as if briefing a client or friend to film a short testimonial/review video
- Include: the setting, who's speaking (client persona), the opening hook (word-for-word), the 2–3 key points to hit, and how to end
- Should feel authentic and unscripted — not like a paid ad

─── CAMPAIGN NAMING RULES ───

- All naming conventions must follow platform standards (Meta Ads Manager hierarchy: Campaign > Ad Set > Ad)
- UTM values: lowercase, underscored, no spaces, no special characters
- Give a filled-in example for each naming convention — not just the template
- Use the coach's actual business name, challenge type, and traffic sources from the context
- Be opinionated — give them one specific structure they can implement today, not options

─── OUTPUT FORMAT ───

Return ONLY this JSON structure. All copy must be real and complete — no [PLACEHOLDER] text:

{
  "adCopy": {
    "hooks": ["...", "...", "..."],
    "primaryTexts": ["...", "...", "..."],
    "headlines": ["...", "...", "..."],
    "descriptions": ["...", "...", "..."]
  },
  "creativePrompts": {
    "staticImageIdeas": ["...", "...", "..."],
    "talkingHeadPrompts": ["...", "...", "..."],
    "beforeAfterConcepts": ["...", "..."],
    "ugcStylePrompts": ["...", "..."]
  },
  "campaignNaming": {
    "campaignName": "...",
    "adSetNamingConvention": "...",
    "adNamingConvention": "...",
    "utmSource": "...",
    "utmMedium": "...",
    "utmCampaign": "...",
    "utmContent": "..."
  }
}`;
}
