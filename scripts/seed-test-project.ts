/**
 * seed-test-project.ts
 *
 * Creates a fully pre-filled test project so you can skip the wizard
 * and jump straight to results / generation testing.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/seed-test-project.ts
 *
 * Output: prints the project URL to open in your browser.
 *
 * The script inserts rows directly via the Supabase service-role key
 * (bypasses RLS) so you don't need to be logged in while running it.
 * You DO need to be logged in as the target user in your browser to
 * view the results page.
 *
 * Set TEST_USER_EMAIL in .env.local (or pass as env var) to target a
 * specific user account. Defaults to the first user in auth.users.
 */

import { createClient } from "@supabase/supabase-js";
import type { WizardInputs } from "../src/types/wizard";

const SUPABASE_URL          = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const APP_URL               = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const TARGET_EMAIL          = process.env.TEST_USER_EMAIL;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/* ── Test data — edit freely ───────────────────────────────────────────── */

const CHALLENGE_INPUTS: WizardInputs = {
  funnelType: "challenge",

  // Business basics
  businessName:       "FitPro Launch Test",
  coachName:         "Sarah Mitchell",
  location:          "London, UK",
  deliveryMode:      "online",
  targetAudience:    "busy women aged 30–50 who want to lose weight, tone up, and rebuild their energy without fad diets or spending hours in the gym",
  audienceDemographic: "Women 30–50, predominantly UK-based, juggling careers and families, frustrated after trying multiple programmes that didn't stick",
  coachCredentials:  "L3 Personal Trainer, Precision Nutrition Level 1, 8 years coaching, featured in Women's Health UK",
  namedMethod:       "The Metabolic Reset Method",

  // Offer basics
  challengeName:     "The 30-Day Metabolic Reset Challenge",
  challengeType:     "weight loss & energy",
  mainGoal:          "Lose 8–12 lbs, reset metabolism, build sustainable healthy habits, and feel genuinely energised within 30 days",
  duration:          30,
  price:             "£97",
  ctaType:           "signup",
  inclusions:        "Daily 20-minute workout videos, done-with-you meal plan, private Facebook community, weekly live Q&A calls, habit tracker, recipe booklet (50+ recipes)",
  bonuses:           "Bonus 1: 7-Day Kickstart Guide (£27 value). Bonus 2: Mindset & Motivation Audio Series (£47 value). Bonus 3: Access to the FitPro Launch vault of past challenges",
  videoUrl:          "",
  investmentRange:   "",
  roiAnchor:         "one month of results you've been chasing for years",
  cohortStartDate:   "2 June 2025",
  applicationDeadline: "",

  // Audience & pain
  biggestStruggle:   "They've tried every diet and workout plan going but always fall off the wagon after 2 weeks. Life gets in the way — kids, work, exhaustion — and they feel like they're the problem when really the programmes aren't designed for their real life",
  desiredOutcome:    "Wake up with energy, feel proud in the mirror, stop thinking about food 24/7, and finally feel like themselves again",
  objections:        "I've tried everything and nothing works. I don't have time. It's too expensive. I can't stick to diets. My metabolism is broken. I'll start Monday (then never do).",
  demographicDetails: "Most are mums, many have desk jobs, 60% have tried at least 3 other programmes. Primary pain: exhaustion + body confidence. Secondary: food relationship issues.",
  whatTheyTried:     "SlimFast, WeightWatchers, random YouTube workouts, meal prep apps, gym memberships they didn't use — all short-lived because they required too much time or were too restrictive",

  // Brand voice
  toneOfVoice:       "motivational",
  colourScheme:      "rose-pink",
  phrasesToInclude:  "real results, no fluff, done-with-you, this is your time",
  phrasesToAvoid:    "diet, restrict, cheat day, bikini body",
  coachPhotoUrl:     "",

  // Traffic
  trafficSources:    ["instagram", "facebook"],
  primaryPlatform:   "instagram",
  utmNamingPreference: "instagram_organic",
  adBudgetRange:     "£500–£1,000/month",

  // Social proof
  testimonials:      "\"I lost 11 lbs and 2 dress sizes in 30 days — and I ate MORE than before!\" — Emma T.\n\"Sarah's challenge completely changed my relationship with food. Down 9 lbs and sleeping like a baby.\" — Claire H.\n\"I've done so many challenges. This is the ONLY one that felt sustainable.\" — Nicola F.",
  caseStudySnippets: "Emma T.: started at 14st 4lbs, ended at 13st 7lbs. Said the biggest change was her energy — was falling asleep at 3pm every day, now powers through until bedtime.\nClaire H.: lost 9lbs, more importantly ditched the 11pm wine-and-crisps habit she'd had for 5 years.",
  resultsHighlights: "Average loss: 8–12 lbs in 30 days. 94% of completers report feeling more energised. 87% say they'd recommend to a friend.",
  hasBeforeAfter:    true,
  clientCount:       "400+",
  yearsCoaching:     "8",
  clientTransformations: "Emma: stuck in a diet cycle for 6 years → lost 11 lbs in 30 days, now maintains effortlessly → 4 months ago.\nNicola: tried 5 programmes with no lasting result → completed the challenge, then re-enrolled → 6 weeks ago.",
  bestClientResult:  "Emma T. lost 11 lbs and dropped 2 dress sizes in 30 days while eating more food than she had in years",

  // Application details (not used for challenge, but included for completeness)
  programPillars:     undefined,
  uniqueApproach:     undefined,
  idealClientProfile: undefined,
  notForWho:          undefined,
  applicationProcess: undefined,
  coachingCapacity:   undefined,
  applicationFormQuestions: undefined,

  // Coach story
  coachBeforeState:   "Before becoming a coach, Sarah was a marketing manager working 60-hour weeks, living on coffee and cereal bars, 2 stone heavier than she is now, and convinced her body was 'just like this'",
  coachTurningPoint:  "A chance conversation with a nutritionist at her gym who told her: 'You're not broken, you're just under-fuelled and over-stressed.' That one sentence changed everything.",
  coachPersonalResult: "Lost 2 stone in 4 months, kept it off for 8 years, went from exhausted corporate worker to full-time coach with a waiting list",
  coachWhyCoach:      "Because she was told for years that her body was the problem — and she now knows that's never true. She coaches to give women the truth the diet industry hides.",
};

const APPLICATION_INPUTS: WizardInputs = {
  ...CHALLENGE_INPUTS,
  funnelType:       "application",
  challengeName:    "The Elite Transformation Programme",
  challengeType:    "high-ticket coaching",
  price:            "£4,997",
  ctaType:          "booking",
  duration:         90,
  investmentRange:  "£4,997 single pay or 3× £1,799",
  roiAnchor:        "one new client from the confidence and results you gain covers the full investment",
  cohortStartDate:  "12 June 2025",
  applicationDeadline: "31 May 2025",

  programPillars:   "1. Metabolic Optimisation — repair your metabolism after years of dieting. 2. Strength & Conditioning — build a body that performs. 3. Nutritional Intelligence — eat for energy, not restriction. 4. Mindset & Identity — become the person who maintains results. 5. Accountability & Community — never navigate this alone.",
  uniqueApproach:   "We don't give you a meal plan and wish you luck. Every 2 weeks you get a private 1-on-1 coaching call, daily check-ins via WhatsApp, and a plan that adapts to your actual life — not some idealised version of it.",
  idealClientProfile: "You're a professional woman who is serious about change. You've done the surface-level programmes and you know you need something deeper. You're ready to invest in yourself and you'll do the work.",
  notForWho:        "This programme is NOT for you if you're looking for a quick fix, unwilling to track your food, or can't commit to 45 minutes per day. I only work with women who are ready to be all in.",
  applicationProcess: "1. Complete the application form (5 mins). 2. If you're a fit, we'll book a free 30-min Discovery Call. 3. On the call we'll build your custom plan together. 4. If we both agree it's right, you'll enrol and we start within 48 hours.",
  coachingCapacity: "Maximum 8 clients per cohort — I cap at 8 so every client gets my full attention",
  applicationFormQuestions: "1. What is your single biggest fitness/health challenge right now?\n2. What have you tried before and why did it not work?\n3. What would your life look like in 90 days if this programme worked perfectly?\n4. What is your biggest concern about committing to this?\n5. Are you ready to invest in yourself at the level this programme requires?",
};

/* ─────────────────────────────────────────────────────────────────────────── */

async function run() {
  // 1. Find the target user
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError || !users?.length) {
    console.error("✗ Could not list users:", usersError?.message ?? "no users found");
    process.exit(1);
  }

  const targetUser = TARGET_EMAIL
    ? users.find(u => u.email === TARGET_EMAIL)
    : users[0];

  if (!targetUser) {
    console.error(`✗ User not found${TARGET_EMAIL ? `: ${TARGET_EMAIL}` : ""}`);
    console.error("  Available users:", users.map(u => u.email).join(", "));
    process.exit(1);
  }

  console.log(`✓ Targeting user: ${targetUser.email}`);

  // 2. Seed both challenge and application projects
  const seeds = [
    { name: "TEST — Metabolic Reset Challenge",     inputs: CHALLENGE_INPUTS },
    { name: "TEST — Elite Transformation Programme", inputs: APPLICATION_INPUTS },
  ];

  for (const seed of seeds) {
    console.log(`\n  Creating: ${seed.name}`);

    // Insert project row
    const { data: project, error: projErr } = await supabase
      .from("projects")
      .insert({ user_id: targetUser.id, name: seed.name, status: "draft" })
      .select()
      .single();

    if (projErr || !project) {
      console.error(`  ✗ Failed to create project:`, projErr?.message);
      continue;
    }

    // Insert inputs row
    const { error: inputErr } = await supabase
      .from("project_inputs")
      .insert({ project_id: project.id, inputs: seed.inputs as unknown as Record<string, unknown> });

    if (inputErr) {
      console.error(`  ✗ Failed to save inputs:`, inputErr?.message);
      continue;
    }

    console.log(`  ✓ Created: ${seed.name}`);
    console.log(`    Open wizard (pre-filled): ${APP_URL}/projects/new?projectId=${project.id}`);
    console.log(`    Jump to generation:       ${APP_URL}/projects/${project.id}/generating`);
  }

  console.log("\nDone! Open the wizard links above to generate assets for each project.");
}

run().catch(err => {
  console.error("✗ Unexpected error:", err);
  process.exit(1);
});
