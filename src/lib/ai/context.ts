import type { WizardInputs } from "@/types/wizard";

const TONE_GUIDE: Record<string, string> = {
  friendly:     "warm and supportive — like a knowledgeable friend who happens to be a coach. Approachable, never pushy.",
  bold:         "direct and punchy — short sentences, no waffle. Confident without being arrogant. Respects the reader's time.",
  motivational: "energetic and inspiring — but grounded in real outcomes, not empty hype. Pushes people toward action.",
  premium:      "polished and elevated — positions the programme as seriously expert-designed. Calm confidence. Avoid discounting language.",
  simple:       "plain English only — no jargon, no fitness buzzwords. Anyone could read this and understand it immediately.",
};

const DELIVERY_LABEL: Record<string, string> = {
  online:  "fully online",
  offline: "in-person",
  hybrid:  "online and in-person",
};

/**
 * Builds a shared context block from wizard inputs.
 * Every AI call receives this same block — consistent across all 3 generation groups.
 */
export function buildCoachContext(inputs: WizardInputs): string {
  const {
    businessName, coachName, location, deliveryMode,
    targetAudience, demographicDetails,
    challengeName, challengeType, mainGoal, duration, price, ctaType,
    inclusions, bonuses, videoUrl,
    biggestStruggle, desiredOutcome, objections,
    toneOfVoice, phrasesToInclude, phrasesToAvoid, coachPhotoUrl,
    trafficSources, utmNamingPreference, adBudgetRange,
    testimonials, caseStudySnippets, resultsHighlights, hasBeforeAfter,
    clientCount, yearsCoaching,
  } = inputs;

  const isFree = price.toLowerCase().includes("free");
  const ctaDescription = ctaType === "booking"
    ? "book a free strategy call with the coach"
    : "sign up / register directly";

  const lines: string[] = [
    `=== COACH & BUSINESS ===`,
    `Business name: ${businessName}`,
    `Coach name: ${coachName}`,
    `Location: ${location}`,
    `Delivery: ${DELIVERY_LABEL[deliveryMode] ?? deliveryMode}`,
    ``,
    `=== THE CHALLENGE OFFER ===`,
    ...(challengeName ? [`Challenge name: ${challengeName}`] : []),
    `Challenge type: ${challengeType}`,
    `Duration: ${duration} days`,
    `Main goal: ${mainGoal}`,
    `Price: ${price}${isFree ? " (free offer)" : ""}`,
    `Primary CTA: ${ctaDescription}`,
    `What's included: ${inclusions}`,
  ];

  if (bonuses) lines.push(`Bonuses: ${bonuses}`);

  lines.push(
    ``,
    `=== TARGET AUDIENCE ===`,
    `Who they are: ${targetAudience}`,
  );
  if (demographicDetails) lines.push(`Demographic detail: ${demographicDetails}`);

  lines.push(
    ``,
    `=== AUDIENCE PSYCHOLOGY ===`,
    `Biggest struggle right now: ${biggestStruggle}`,
    `What they actually want: ${desiredOutcome}`,
    `Their objections before joining: ${objections}`,
    ``,
    `=== BRAND VOICE ===`,
    `Tone: ${TONE_GUIDE[toneOfVoice] ?? TONE_GUIDE.friendly}`,
  );
  if (phrasesToInclude) lines.push(`Phrases/language to use: ${phrasesToInclude}`);
  if (phrasesToAvoid)   lines.push(`Phrases/words to AVOID: ${phrasesToAvoid}`);

  lines.push(
    ``,
    `=== TRAFFIC & DISTRIBUTION ===`,
    `Traffic sources: ${trafficSources.join(", ")}`,
  );
  if (adBudgetRange)         lines.push(`Budget range: ${adBudgetRange}`);
  if (utmNamingPreference)   lines.push(`UTM/campaign naming preference: ${utmNamingPreference}`);

  if (testimonials || caseStudySnippets || resultsHighlights) {
    lines.push(``, `=== SOCIAL PROOF ===`);
    if (testimonials)       lines.push(`Client testimonials:\n${testimonials}`);
    if (caseStudySnippets)  lines.push(`Case study/story:\n${caseStudySnippets}`);
    if (resultsHighlights)  lines.push(`Results/stats: ${resultsHighlights}`);
    if (hasBeforeAfter)     lines.push(`Before/after content: available`);
  }

  if (clientCount || yearsCoaching || videoUrl || coachPhotoUrl) {
    lines.push(``, `=== COACH CREDIBILITY ===`);
    if (clientCount)    lines.push(`Clients helped: ${clientCount}`);
    if (yearsCoaching)  lines.push(`Years coaching: ${yearsCoaching}`);
    if (videoUrl)       lines.push(`Intro video URL: ${videoUrl}`);
    if (coachPhotoUrl)  lines.push(`Coach photo URL: ${coachPhotoUrl}`);
  }

  return lines.join("\n");
}
