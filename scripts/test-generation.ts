/**
 * Sample generation test — Brighton Fit Reset
 * Run: npx tsx scripts/test-generation.ts
 */

import { generateMockAssets } from "../src/lib/ai/mock";
import type { WizardInputs } from "../src/types/wizard";

const inputs: WizardInputs = {
  funnelType: "challenge",
  businessName: "Brighton Fit Reset",
  coachName: "Tom",
  location: "Brighton",
  deliveryMode: "hybrid",
  targetAudience: "Busy men aged 30-45 who have gained weight and lost their routine",
  demographicDetails: "Mostly working professionals, some with families, sedentary jobs, limited free time",
  challengeName: "Brighton 30-Day Body Reset",
  challengeType: "30-day body reset",
  colourScheme: "navy-orange",
  mainGoal: "Lose 8-12 lbs, rebuild consistency, and improve energy levels",
  duration: 30,
  price: "£49",
  ctaType: "booking",
  inclusions: "Daily workouts, nutrition guidance, weekly accountability check-ins, private coaching group",
  bonuses: "Recipe guide for busy men, daily step target tracker",
  biggestStruggle: "No routine, stress eating in the evenings, low energy that makes exercise feel impossible",
  desiredOutcome: "Lose weight and feel back in control of their body and habits",
  objections: "Don't have enough time. Have tried before and failed. Not sure if £49 is worth it.",
  toneOfVoice: "friendly",
  phrasesToInclude: "back in control, fits around your life, no-nonsense",
  phrasesToAvoid: "transform, journey, game changer, smash your goals",
  trafficSources: ["facebook", "instagram"],
  adBudgetRange: "£500-1000/month",
  utmNamingPreference: "brightonfitreset_[challenge]_[date]",
  testimonials: `"I lost 11 lbs in the first month and actually kept it going. First time I've done that in years." — Dave, 41, Brighton\n"Down 9 lbs and sleeping better. Didn't think a 30-day thing could actually change my habits." — Marcus, 38`,
  caseStudySnippets: "Dave came in with zero routine after a stressful year at work. Within 2 weeks he had a consistent morning routine and was tracking food without obsessing over it.",
  resultsHighlights: "Average 9 lbs lost in 30 days across the last cohort. 80% of participants continue with Tom after the challenge.",
  hasBeforeAfter: true,
};

const result = generateMockAssets(inputs);

// ─── Render output ────────────────────────────────────────────────────────────

function section(title: string) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ${title}`);
  console.log("═".repeat(60));
}

function sub(label: string) {
  console.log(`\n  ── ${label} ──`);
}

function print(value: string | string[] | object) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => console.log(`  ${i + 1}. ${v}`));
  } else if (typeof value === "string") {
    console.log(`  ${value.replace(/\n/g, "\n  ")}`);
  } else {
    console.log(JSON.stringify(value, null, 2));
  }
}

section("1. OFFER SUMMARY");
sub("Challenge Concept");     print(result.offerSummary.challengeConcept);
sub("Target Audience");       print(result.offerSummary.targetAudienceSummary);
sub("Positioning");           print(result.offerSummary.offerPositioning);
sub("Core Promise");          print(result.offerSummary.corePromise);

section("2. LANDING PAGE");
sub("Headlines");             print(result.landingPage.headlineOptions);
sub("Subheadline");           print(result.landingPage.subheadline);
sub("Bullet Points");         print(result.landingPage.bulletPoints);
sub("CTA Button");            print(result.landingPage.ctaText);
sub("Section Ideas");         print(result.landingPage.sectionIdeas);
sub("FAQ");
result.landingPage.faqItems.forEach((item, i) => {
  console.log(`\n  Q${i + 1}: ${item.question}`);
  console.log(`  A:  ${item.answer}`);
});
sub("Urgency Ideas");         print(result.landingPage.urgencyIdeas);

section("3. OPT-IN FORM");
sub("Recommended Fields");    print(result.optInForm.recommendedFields);
sub("Form Intro Text");       print(result.optInForm.formIntroText);
sub("Submit Button");         print(result.optInForm.ctaButtonText);

section("4. THANK YOU PAGE");
sub("Confirmation Message");  print(result.thankYouPage.confirmationMessage);
sub("Next Steps");            print(result.thankYouPage.nextSteps);
sub("Booking Encouragement"); print(result.thankYouPage.bookingEncouragement);

section("5. BOOKING PAGE");
sub("Short Intro");           print(result.bookingPage.shortIntro);
sub("Why Book");              print(result.bookingPage.whyBook);
sub("Expectation Setting");   print(result.bookingPage.expectationSetting);

section("6. SMS SEQUENCE");
const sms = result.smsSequence;
const smsList = [
  ["Confirmation",          sms.confirmation],
  ["Challenge Reminder",    sms.challengeReminder],
  ["Day 1 Kickoff",         sms.dayOneKickoff],
  ["Mid-Challenge",         sms.midChallengeMotivation],
  ["No-show",               sms.noShow],
  ["Challenge Complete",    sms.challengeComplete],
  ["Re-engagement",         sms.reEngagement],
];
smsList.forEach(([label, text]) => {
  console.log(`\n  [${label}] — ${text.length} chars`);
  console.log(`  "${text}"`);
  if (text.length > 160) console.log(`  ⚠️  OVER 160 CHARS`);
});

section("7. EMAIL SEQUENCE");
const emails = result.emailSequence;
const emailList = [
  ["Welcome",            emails.welcome],
  ["Value Delivery",     emails.valueDelivery],
  ["Social Proof",       emails.socialProof],
  ["Objection Handling", emails.objectionHandling],
  ["Last Chance",        emails.lastChance],
  ["Day 1 Kickoff",      emails.dayOneKickoff],
  ["Mid-Challenge",      emails.midChallenge],
  ["Final Stretch",      emails.finalStretch],
  ["Challenge Complete", emails.challengeComplete],
  ["Re-engagement",      emails.reEngagement],
] as const;
emailList.forEach(([label, email]) => {
  console.log(`\n  ── ${label} Email ──`);
  console.log(`  Subject: ${email.subject}`);
  console.log(`\n  Body:\n  ${email.body.replace(/\n/g, "\n  ")}`);
});

section("8. AD COPY");
sub("Hooks");             print(result.adCopy.hooks);
sub("Primary Text — V1"); print(result.adCopy.primaryTexts[0]);
sub("Primary Text — V2"); print(result.adCopy.primaryTexts[1]);
sub("Primary Text — V3"); print(result.adCopy.primaryTexts[2]);
sub("Headlines");         print(result.adCopy.headlines);
sub("Descriptions");      print(result.adCopy.descriptions);

section("9. CREATIVE PROMPTS");
sub("Static Image Ideas");       print(result.creativePrompts.staticImageIdeas);
sub("Talking Head Prompts");     print(result.creativePrompts.talkingHeadPrompts);
sub("Before/After Concepts");    print(result.creativePrompts.beforeAfterConcepts);
sub("UGC-Style Prompts");        print(result.creativePrompts.ugcStylePrompts);

section("10. CAMPAIGN NAMING");
const cn = result.campaignNaming;
console.log(`\n  Campaign name:           ${cn.campaignName}`);
console.log(`  Ad set naming:           ${cn.adSetNamingConvention}`);
console.log(`  Ad naming:               ${cn.adNamingConvention}`);
console.log(`  utm_source:              ${cn.utmSource}`);
console.log(`  utm_medium:              ${cn.utmMedium}`);
console.log(`  utm_campaign:            ${cn.utmCampaign}`);
console.log(`  utm_content:             ${cn.utmContent}`);

console.log(`\n${"═".repeat(60)}\n  ✓ Generation complete — mock output using real inputs\n${"═".repeat(60)}\n`);
