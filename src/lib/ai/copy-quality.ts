/**
 * Shared prompt-engineering quality constraints.
 * Imported by every AI prompt builder.
 *
 * buildCopyStandardsBlock()    — forbidden phrases, specificity rules, voice rules
 * buildAudienceAnalysisBlock() — chain-of-thought reader analysis (before writing)
 */

export function buildCopyStandardsBlock(): string {
  return `=== COPY QUALITY STANDARDS (MANDATORY — READ BEFORE WRITING) ===

FORBIDDEN PHRASES — never use these or close paraphrases of them:
- "unlock your potential" / "unleash your potential"
- "transform your life" / "life-changing transformation"
- "achieve your goals" / "reach your goals"
- "the best version of yourself"
- "take control of your health"
- "embark on your journey" / "begin your journey"
- "it's time to invest in yourself"
- "what are you waiting for?"
- "join our community"
- "life-changing"
- Any headline or hook that opens with "Are you tired of..." or "Are you struggling with..."
- "Don't miss out" / "don't miss this opportunity"
- "game-changer" / "game-changing"

WHY: These phrases appear on every generic funnel. Readers are blind to them. They signal copy-paste mediocrity.

SPECIFICITY RULE — replace every vague claim with a number, a name, or a concrete detail:
✗ "lose weight"           → ✓ "lose 18–24lbs"
✗ "get fit"               → ✓ "run a 5k without stopping by Week 4"
✗ "improve your energy"   → ✓ "stop needing a nap after the school run"
✗ "busy women"            → ✓ "nurses and teachers who are on their feet all day but can't carve out 20 minutes for themselves"
✗ "great results"         → ✓ "Emma lost 24lbs and ran her first 10k in 14 weeks"
✗ "affordable"            → ✓ "less than a daily coffee"
✗ "experienced coach"     → ✓ "10 years coaching, 300+ clients, Level 4 PT and Precision Nutrition certified"

The moment you write a vague phrase, ask: what is the specific number, name, or real-world detail that replaces it?

VOICE RULE — write as a human practitioner, not a marketing department:
✗ "Our comprehensive programme delivers outstanding results through evidence-based methodology."
✓ "Here's what we actually do in the first two weeks — and why it works when everything else hasn't."

Every sentence must sound like a real person wrote it for one specific reader. If it could appear in any fitness ad by any coach, rewrite it.`;
}

export function buildAudienceAnalysisBlock(): string {
  return `=== AUDIENCE ANALYSIS — COMPLETE BEFORE WRITING ===

Before generating any copy, reason through these four questions. Your answers shape every word:

1. AWARENESS LEVEL: Where is this prospect in their awareness journey?
   - Unaware: doesn't know they have a solvable problem → lead with the problem
   - Problem-aware: knows the problem, hasn't found the solution → lead with "why nothing has worked"
   - Solution-aware: knows solutions exist, hasn't chosen one → lead with differentiation
   - Most aware: ready to buy, needs the offer angle → lead with the offer and proof
   Answer this before choosing your headline angle.

2. PRIMARY EMOTIONAL DRIVER: What is the deepest emotion driving them to consider this?
   Choose one: fear of further decline / embarrassment after repeated failure / desire for identity shift / frustration with slow progress / relief from daily pain or exhaustion / social aspiration (how others will see them)
   → This determines whether you open with empathy, contrast, or aspiration.

3. MOST CREDIBLE PROOF: From the social proof and results in the context, what is the single most believable, specific result to anchor copy around?
   → Lead with this in headlines, testimonial sections, and CTAs. Do not bury it.

4. MARKET SOPHISTICATION: How ad-saturated is this audience?
   - Naive (first offer of this type): explain the mechanism, educate
   - Moderate (seen a few): lead with differentiation + results
   - Sophisticated (seen dozens, sceptical): lead with the unique mechanism and what is fundamentally different; avoid all hype language
   → This determines whether you assert or prove.

Resolve these four dimensions, then write every headline, bullet, and CTA to match your answers.`;
}
