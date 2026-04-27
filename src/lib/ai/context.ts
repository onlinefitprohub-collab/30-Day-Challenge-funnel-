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
    targetAudience, demographicDetails, audienceDemographic,
    challengeName, challengeType, mainGoal, duration, price, ctaType,
    inclusions, bonuses, videoUrl,
    biggestStruggle, desiredOutcome, objections, whatTheyTried,
    toneOfVoice, phrasesToInclude, phrasesToAvoid, coachPhotoUrl,
    trafficSources, utmNamingPreference, adBudgetRange,
    testimonials, caseStudySnippets, resultsHighlights, hasBeforeAfter,
    clientCount, yearsCoaching, coachCredentials, clientTransformations, bestClientResult,
    namedMethod,
    programPillars, uniqueApproach, idealClientProfile, notForWho,
    applicationProcess, coachingCapacity, applicationFormQuestions,
    investmentRange, roiAnchor, cohortStartDate, applicationDeadline,
    coachBeforeState, coachTurningPoint, coachPersonalResult, coachWhyCoach,
  } = inputs;

  const isFree = price.toLowerCase().includes("free");
  const ctaDescription = ctaType === "booking"
    ? "book a free strategy call with the coach"
    : "sign up / register directly";

  const isApplication = inputs.funnelType === "application";

  const lines: string[] = [
    `=== COACH & BUSINESS ===`,
    `Business name: ${businessName}`,
    `Coach name: ${coachName}`,
    `Location: ${location}`,
    `Delivery: ${DELIVERY_LABEL[deliveryMode] ?? deliveryMode}`,
    ...(namedMethod ? [`Named system/method: ${namedMethod}`] : []),
    ``,
    isApplication ? `=== THE PROGRAMME OFFER ===` : `=== THE CHALLENGE OFFER ===`,
    ...(challengeName ? [`${isApplication ? "Program" : "Challenge"} name: ${challengeName}`] : []),
    `${isApplication ? "Programme" : "Challenge"} type: ${challengeType}`,
    `Duration: ${duration} days`,
    `Main goal: ${mainGoal}`,
    `Price: ${price}${isFree ? " (free offer)" : ""}`,
    `Primary CTA: ${ctaDescription}`,
    `What's included: ${inclusions}`,
  ];

  if (bonuses) lines.push(`Bonuses: ${bonuses}`);

  if (isApplication && (investmentRange || roiAnchor || cohortStartDate || applicationDeadline)) {
    lines.push(``, `=== INVESTMENT & URGENCY ===`);
    if (investmentRange)      lines.push(`Exact investment: ${investmentRange}`);
    if (roiAnchor)            lines.push(`ROI frame: ${roiAnchor}`);
    if (cohortStartDate)      lines.push(`Next cohort start: ${cohortStartDate}`);
    if (applicationDeadline)  lines.push(`Application deadline: ${applicationDeadline}`);
  }

  lines.push(
    ``,
    `=== TARGET AUDIENCE ===`,
    `Who they are: ${targetAudience}`,
  );
  if (demographicDetails)    lines.push(`Demographic detail: ${demographicDetails}`);
  if (audienceDemographic)   lines.push(`Audience demographic: ${audienceDemographic}`);

  lines.push(
    ``,
    `=== AUDIENCE PSYCHOLOGY ===`,
    `Biggest struggle right now: ${biggestStruggle}`,
    `What they actually want: ${desiredOutcome || mainGoal}`,
    `Their objections before joining: ${objections}`,
  );
  if (whatTheyTried) lines.push(`What they've already tried (that didn't work):\n${whatTheyTried}`);

  lines.push(
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

  if (testimonials || caseStudySnippets || resultsHighlights || clientTransformations || bestClientResult) {
    lines.push(``, `=== SOCIAL PROOF ===`);
    if (bestClientResult)      lines.push(`Best single client result (headline anchor): ${bestClientResult}`);
    if (clientTransformations) lines.push(`Specific client transformations (before → after → timeframe):\n${clientTransformations}`);
    if (testimonials)          lines.push(`Client testimonials:\n${testimonials}`);
    if (caseStudySnippets)     lines.push(`Case study/story:\n${caseStudySnippets}`);
    if (resultsHighlights)     lines.push(`Results/stats: ${resultsHighlights}`);
    if (hasBeforeAfter)        lines.push(`Before/after content: available`);
  }

  if (clientCount || yearsCoaching || videoUrl || coachPhotoUrl || coachCredentials) {
    lines.push(``, `=== COACH CREDIBILITY ===`);
    if (coachCredentials) lines.push(`Credentials & authority:\n${coachCredentials}`);
    if (clientCount)      lines.push(`Clients helped: ${clientCount}`);
    if (yearsCoaching)    lines.push(`Years coaching: ${yearsCoaching}`);
    if (videoUrl)         lines.push(`Intro video URL: ${videoUrl}`);
    if (coachPhotoUrl)    lines.push(`Coach photo URL: ${coachPhotoUrl}`);
  }

  if (isApplication && (programPillars || uniqueApproach || idealClientProfile || notForWho || applicationProcess || coachingCapacity || applicationFormQuestions)) {
    lines.push(``, `=== APPLICATION PROGRAMME DETAILS ===`);
    if (programPillars)            lines.push(`Programme pillars:\n${programPillars}`);
    if (uniqueApproach)            lines.push(`Unique approach/method: ${uniqueApproach}`);
    if (idealClientProfile)        lines.push(`Ideal client (qualifiers):\n${idealClientProfile}`);
    if (notForWho)                 lines.push(`Who this is NOT for:\n${notForWho}`);
    if (applicationProcess)        lines.push(`Application process: ${applicationProcess}`);
    if (coachingCapacity)          lines.push(`Coaching capacity (scarcity): ${coachingCapacity}`);
    if (applicationFormQuestions)  lines.push(`Application form questions:\n${applicationFormQuestions}`);
  }

  if (isApplication && (coachBeforeState || coachTurningPoint || coachPersonalResult || coachWhyCoach)) {
    lines.push(``, `=== COACH PERSONAL STORY (for bio generation) ===`);
    if (coachBeforeState)    lines.push(`Coach before state:\n${coachBeforeState}`);
    if (coachTurningPoint)   lines.push(`Coach turning point:\n${coachTurningPoint}`);
    if (coachPersonalResult) lines.push(`Coach personal result: ${coachPersonalResult}`);
    if (coachWhyCoach)       lines.push(`Coach's mission/why:\n${coachWhyCoach}`);
  }

  return lines.join("\n");
}
