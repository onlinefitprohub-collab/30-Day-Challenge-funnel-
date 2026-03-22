/**
 * Live AI generation test — Brighton Fit Reset
 *
 * Requires OPENAI_API_KEY to be set in the environment or .env.local.
 *
 * Run:
 *   OPENAI_API_KEY=sk-... npx tsx scripts/test-live-generation.ts
 *
 * Or with a .env.local file:
 *   npx tsx --env-file=.env.local scripts/test-live-generation.ts
 *
 * Output goes to stdout. Timing for each group is shown at the end.
 * Total cost estimate is printed based on gpt-4o pricing (approx).
 */

import { generateFunnelAssets } from "../src/lib/ai/generate";
import type { WizardInputs } from "../src/types/wizard";

if (!process.env.OPENAI_API_KEY) {
  console.error("✗ OPENAI_API_KEY is not set.");
  console.error("  Run: OPENAI_API_KEY=sk-... npx tsx scripts/test-live-generation.ts");
  console.error("  Or:  npx tsx --env-file=.env.local scripts/test-live-generation.ts");
  process.exit(1);
}

const inputs: WizardInputs = {
  businessName: "Brighton Fit Reset",
  coachName: "Tom",
  location: "Brighton",
  deliveryMode: "hybrid",
  targetAudience: "Busy men aged 30-45 who have gained weight and lost their routine",
  demographicDetails: "Mostly working professionals, some with families, sedentary jobs, limited free time",
  challengeType: "30-day body reset",
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function section(n: number, title: string) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ${n}. ${title}`);
  console.log("═".repeat(60));
}

function sub(label: string) {
  console.log(`\n  ── ${label} ──`);
}

function print(value: string | string[]) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => console.log(`  ${i + 1}. ${v}`));
  } else {
    console.log(`  ${value.replace(/\n/g, "\n  ")}`);
  }
}

// ─── Run ──────────────────────────────────────────────────────────────────────

void (async () => {
console.log("\n  Calling OpenAI gpt-4o — 3 groups in parallel...\n");
const t0 = Date.now();

const result = await generateFunnelAssets(inputs);
const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

section(1, "OFFER SUMMARY");
sub("Challenge Concept");     print(result.offerSummary.challengeConcept);
sub("Target Audience");       print(result.offerSummary.targetAudienceSummary);
sub("Positioning");           print(result.offerSummary.offerPositioning);
sub("Core Promise");          print(result.offerSummary.corePromise);

section(2, "LANDING PAGE");
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

section(3, "OPT-IN FORM");
sub("Recommended Fields");    print(result.optInForm.recommendedFields);
sub("Form Intro Text");       print(result.optInForm.formIntroText);
sub("Submit Button");         print(result.optInForm.ctaButtonText);

section(4, "THANK YOU PAGE");
sub("Confirmation Message");  print(result.thankYouPage.confirmationMessage);
sub("Next Steps");            print(result.thankYouPage.nextSteps);
sub("Booking Encouragement"); print(result.thankYouPage.bookingEncouragement);

section(5, "BOOKING PAGE");
sub("Short Intro");           print(result.bookingPage.shortIntro);
sub("Why Book");              print(result.bookingPage.whyBook);
sub("Expectation Setting");   print(result.bookingPage.expectationSetting);

section(6, "SMS SEQUENCE");
const sms = result.smsSequence;
const smsList: [string, string][] = [
  ["Confirmation", sms.confirmation],
  ["Reminder",     sms.reminder],
  ["Follow-up",    sms.followUp],
  ["No-show",      sms.noShow],
  ["Re-engagement",sms.reEngagement],
];
smsList.forEach(([label, text]) => {
  const flag = text.length > 160 ? "  ⚠️  OVER 160 CHARS" : "";
  console.log(`\n  [${label}] — ${text.length} chars${flag}`);
  console.log(`  "${text}"`);
});

section(7, "EMAIL SEQUENCE");
const emails = result.emailSequence;
const emailList = [
  ["Welcome",            emails.welcome],
  ["Reminder",          emails.reminder],
  ["Objection Handling",emails.objectionHandling],
  ["Last Chance",       emails.lastChance],
  ["Re-engagement",     emails.reEngagement],
] as const;
emailList.forEach(([label, email]) => {
  console.log(`\n  ── ${label} Email ──`);
  console.log(`  Subject: ${email.subject}`);
  console.log(`\n  Body:\n  ${email.body.replace(/\n/g, "\n  ")}`);
});

section(8, "AD COPY");
sub("Hooks");             print(result.adCopy.hooks);
sub("Primary Text — V1"); print(result.adCopy.primaryTexts[0] ?? "");
sub("Primary Text — V2"); print(result.adCopy.primaryTexts[1] ?? "");
sub("Primary Text — V3"); print(result.adCopy.primaryTexts[2] ?? "");
sub("Headlines");         print(result.adCopy.headlines);
sub("Descriptions");      print(result.adCopy.descriptions);

section(9, "CREATIVE PROMPTS");
sub("Static Image Ideas");    print(result.creativePrompts.staticImageIdeas);
sub("Talking Head Prompts");  print(result.creativePrompts.talkingHeadPrompts);
sub("Before/After Concepts"); print(result.creativePrompts.beforeAfterConcepts);
sub("UGC-Style Prompts");     print(result.creativePrompts.ugcStylePrompts);

section(10, "CAMPAIGN NAMING");
const cn = result.campaignNaming;
console.log(`\n  Campaign name:   ${cn.campaignName}`);
console.log(`  Ad set naming:   ${cn.adSetNamingConvention}`);
console.log(`  Ad naming:       ${cn.adNamingConvention}`);
console.log(`  utm_source:      ${cn.utmSource}`);
console.log(`  utm_medium:      ${cn.utmMedium}`);
console.log(`  utm_campaign:    ${cn.utmCampaign}`);
console.log(`  utm_content:     ${cn.utmContent}`);

console.log(`\n${"═".repeat(60)}`);
console.log(`  ✓ Live generation complete in ${elapsed}s`);
console.log("═".repeat(60) + "\n");
})();
