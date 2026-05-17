import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasClaude } from "@/lib/ai/claude-client";
import { callClaudeGroup } from "@/lib/ai/claude-generate";
import { buildCoachContext } from "@/lib/ai/context";
import { buildSalesLetterPrompt } from "@/lib/ai/prompts/longform-sales-letter";
import { buildManyChatFlowPrompt } from "@/lib/ai/prompts/manychat-flow";
import { salesLetterSchema, manyChatFlowSchema } from "@/lib/ai/validators";
import { pickRandomStyle } from "@/lib/ai/copywriter-styles";
import { wizardInputsSchema } from "@/types/wizard";
import type { LongFormSalesAssets, SalesLetter, ManyChatFlow } from "@/types/longform";
import type { ProjectInputRow, ProjectRow } from "@/types/project";

/**
 * POST /api/generate-longform
 *
 * Generates a long-form sales letter + ManyChat flow on-demand for an
 * existing project. Both assets are generated in parallel then merged
 * into the existing project_outputs as the "longFormAssets" key.
 *
 * Body: { projectId: string }
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitError = checkRateLimit(user.id, "generate-longform", 1, 60_000);
    if (rateLimitError) return rateLimitError;

    const body = await request.json() as { projectId?: string };
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    // Verify project belongs to this user
    const { data: projectData } = await supabase
      .from("projects")
      .select("id, user_id, status")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    const project = projectData as Pick<ProjectRow, "id" | "user_id" | "status"> | null;
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Load wizard inputs
    const { data: inputData } = await supabase
      .from("project_inputs")
      .select("inputs")
      .eq("project_id", projectId)
      .single();

    const stored = inputData as Pick<ProjectInputRow, "inputs"> | null;
    if (!stored?.inputs) {
      return NextResponse.json(
        { error: "No saved inputs found — please re-run the wizard." },
        { status: 400 },
      );
    }

    const validatedInputs = wizardInputsSchema.parse(stored.inputs);
    const context = buildCoachContext(validatedInputs);

    // Load existing outputs to pick up persisted copywriter style
    const { data: outputData } = await supabase
      .from("project_outputs")
      .select("id, outputs")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const outputRowId = (outputData as { id?: string } | null)?.id;
    const existingOutputs = (outputData?.outputs as Record<string, unknown>) ?? {};

    // Use persisted style if available, otherwise pick a new one
    const persistedStyle = existingOutputs.copywriterStyle as string | undefined;
    const style = pickRandomStyle();
    const styleDescription = persistedStyle
      ? `Write in the style that was already selected for this project: ${persistedStyle}. ${style.promptDescription}`
      : style.promptDescription;

    let longFormAssets: LongFormSalesAssets;

    if (!hasClaude()) {
      longFormAssets = buildMockLongFormAssets(validatedInputs.challengeName ?? "30-Day Challenge");
    } else {
      // Build full prompt strings (system + user combined)
      const { system: slSystem, user: slUser } = buildSalesLetterPrompt(context, styleDescription);
      const { system: mcSystem, user: mcUser } = buildManyChatFlowPrompt(context);
      const salesLetterPrompt = `${slSystem}\n\n${slUser}`;
      const manyChatPrompt    = `${mcSystem}\n\n${mcUser}`;

      // Fire both in parallel
      const [salesLetterResult, manyChatResult] = await Promise.all([
        callClaudeGroup<SalesLetter>(
          salesLetterPrompt,
          salesLetterSchema,
          "sales-letter",
          4096,
          "claude-sonnet-4-6",
        ),
        callClaudeGroup<ManyChatFlow>(
          manyChatPrompt,
          manyChatFlowSchema,
          "manychat-flow",
          2048,
          "claude-sonnet-4-6",
        ),
      ]);

      const salesLetter = salesLetterResult.data ?? buildMockSalesLetter(validatedInputs.challengeName ?? "30-Day Challenge");
      const manyChatFlow = manyChatResult.data ?? buildMockManyChatFlow(validatedInputs.challengeName ?? "30-Day Challenge");

      if (salesLetterResult.error) {
        console.warn("[generate-longform] sales letter fallback to mock:", salesLetterResult.error);
      }
      if (manyChatResult.error) {
        console.warn("[generate-longform] manychat fallback to mock:", manyChatResult.error);
      }

      longFormAssets = { salesLetter, manyChatFlow };
    }

    const mergedOutputs = { ...existingOutputs, longFormAssets };

    if (outputRowId) {
      const { error } = await supabase
        .from("project_outputs")
        .update({ outputs: mergedOutputs })
        .eq("id", outputRowId);
      if (error) throw new Error(error.message);
    } else {
      const { data: runData } = await supabase
        .from("generation_runs")
        .insert({ project_id: projectId, status: "complete" })
        .select()
        .single();
      const runId = (runData as { id?: string } | null)?.id;
      const { error } = await supabase
        .from("project_outputs")
        .insert({ project_id: projectId, generation_run_id: runId, outputs: mergedOutputs });
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ success: true, longFormAssets });

  } catch (error) {
    console.error("[generate-longform] error:", error);
    const message = error instanceof Error ? error.message : "Long-form generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── Mock fallbacks ───────────────────────────────────────────────────────────

function buildMockSalesLetter(challengeName: string): SalesLetter {
  return {
    headline: `Finally: A Proven System That Gets Real Results From Your ${challengeName}`,
    subheadline: "How coaches are transforming their clients' lives with this step-by-step challenge framework — and how you can too",
    painPointHeadline: "There Is No One On The Planet Who Actually Wants To Keep Struggling With The Same Problem Year After Year — Is There?",
    openingHook: "Let me ask you something. How many times have you started a new programme, full of hope and excitement, only to find yourself back at square one three weeks later?\n\nIf you're nodding your head right now, you're not alone. I've spoken to **hundreds of people** who felt exactly the same way — frustrated, defeated, and wondering if change was even possible for them.\n\nThe worst part? They were doing everything they thought they were supposed to do. They weren't lazy. They weren't uncommitted. They just had the wrong system.",
    problemAgitation: "The truth is, **most programmes fail not because of the person — but because of the programme.** They're designed for averages, not for you. They ignore your schedule, your starting point, your specific obstacles.\n\nAnd when you inevitably can't keep up, you blame yourself instead of the system. That self-blame is the most damaging part. It builds a story in your head: 'I'm not the kind of person who succeeds at this.'\n\nThat story is a lie. But when you've failed at the same thing three or four times, it starts to feel like the truth.",
    problemBreakdown: [
      {
        title: "PROBLEM #1 – THE WRONG APPROACH",
        headline: "THE METHODS YOU'VE TRIED AREN'T BUILT FOR SOMEONE IN YOUR SITUATION",
        body: "Generic programmes assume you have unlimited time, no competing priorities, and a body that responds the way the average person's does.\n\nThey weren't designed with **your specific life** in mind. So of course they don't work. It's not a failure of willpower — it's a failure of fit.\n\nUntil you find an approach that's built around who you actually are, you'll keep hitting the same wall.",
      },
      {
        title: "PROBLEM #2 – NO REAL ACCOUNTABILITY",
        headline: "GOING IT ALONE IS THE SINGLE BIGGEST REASON PEOPLE QUIT",
        body: "Research consistently shows that people with **structured accountability** are significantly more likely to achieve their goals.\n\nYet most programmes hand you a PDF and wish you luck. There's no check-in, no community, no human on the other end who notices when you go quiet.\n\nAccountability isn't a nice-to-have. For most people, it's the entire difference between finishing and quitting.",
      },
      {
        title: "PROBLEM #3 – INCONSISTENCY",
        headline: "YOU HAVE GREAT WEEKS AND TERRIBLE WEEKS — AND NO SYSTEM TO BRIDGE THEM",
        body: "Motivation comes in waves. You feel unstoppable for two weeks, then life happens — stress, a bad day, a missed session — and suddenly you've lost all momentum.\n\n**Results don't come from perfect weeks. They come from consistent ones.** The 30-day structure solves this by removing the need to rely on motivation at all. You just follow the system.",
      },
    ],
    bridgeToPossibility: "But what if the problem was never you? What if you just needed the right structure, the right community, and the right level of personal support?\n\nWhat if **30 days from now**, you had proof — real, undeniable proof — that you can do this?",
    coachCredentials: `I've been where you are. Before I became a coach, I struggled with the same challenges my clients face today. That struggle is exactly why I built this programme differently.\n\nOver the past several years, I've worked with **hundreds of clients** to deliver real, measurable results — not through motivation hacks, but through proven structure and genuine accountability.\n\nI don't teach theory. Everything in the ${challengeName} is something I've tested, refined, and watched work — on real people, in real life, with real schedules.`,
    offerReveal: `That's why I created the ${challengeName}. A 30-day structured programme designed specifically to give you the accountability, the community, and the daily actions you need to see real change.`,
    whatYouGet: [
      { name: "Daily Guided Sessions", description: "Step-by-step guidance every single day so you always know exactly what to do — no guesswork, no decision fatigue." },
      { name: "Private Community Access", description: "Join a group of people on the same journey as you. Celebrate wins, get support on hard days, and never feel alone." },
      { name: "Personal Check-ins", description: "Direct access to your coach throughout the 30 days so you can ask questions and get personalised guidance." },
      { name: "Proven Framework", description: "A battle-tested system that's already produced results for hundreds of clients — adapted for your specific starting point." },
    ],
    testimonialCaseStudies: [
      {
        sectionHeadline: "WHAT WOULD IT MEAN TO FINALLY GET THE RESULT YOU'VE BEEN CHASING?",
        clientHeadline: "Meet Sarah, A Busy Mum Who Finally Made It Work Around Her Life",
        quote: "I honestly didn't think it was possible with my schedule. I'd tried everything — apps, programmes, you name it. But this was different. The daily structure meant I never had to think about what to do next, and knowing someone was checking in on me made all the difference. I can't believe where I am now compared to 30 days ago.",
        result: "Transformed in 30 days",
      },
    ],
    testimonialQuotes: [
      "I honestly didn't think it was possible at my age and with my schedule.",
      "The support made all the difference — I've never had that before.",
      "30 days in and I can't believe the change. Best decision I made this year.",
      "Finally something that actually fits around real life.",
      "I was sceptical. Now I'm recommending it to everyone I know.",
      "The accountability element was everything. I needed that.",
    ],
    socialProofFramework: `Clients who've completed this challenge describe it as a turning point. People who had tried and failed before finally got the results they were after — because this time, **they weren't doing it alone**.\n\n"I can't believe how different I feel after 30 days," is something I hear regularly. "I've tried everything. This was the first thing that actually worked."\n\nThat's not a coincidence. It's the result of structure, accountability, and a system that was built for real people with real lives.`,
    bonusStack: [
      { name: "Quick-Start Guide", description: "A step-by-step guide to get you set up and ready before Day 1, so you hit the ground running.", valueLabel: "Worth $47" },
      { name: "Resource Library", description: "Templates, trackers, and reference guides to support you throughout the 30 days.", valueLabel: "Worth $37" },
    ],
    priceReveal: "When you add everything up — the daily programme, the community, the coaching access, and the bonuses — the total value is well over **$500**.\n\nBut because this is a challenge model designed to get you results fast, the investment is a fraction of that. For a limited time, you can join for just the challenge fee.\n\n**One result. One conversation. One transformation. That's all it takes to make this worthwhile.**",
    guarantee: "I'm so confident in this programme that I'll back it with a simple guarantee: if you show up, do the work, and don't see results — I'll make it right. No hoops, no conditions.\n\nI want you to succeed, and I stand behind this programme.",
    objectionHandling: [
      { objection: "I don't have time for a 30-day programme.", response: "I designed this specifically for busy people. Sessions are structured to fit around your existing schedule — not replace it." },
      { objection: "I've tried programmes before and they didn't work.", response: "Most programmes fail because they're generic. This one is built around your specific situation and supported by real coaching accountability." },
      { objection: "Is this right for my level?", response: "Yes — the programme is designed to meet you where you are. Whether you're a complete beginner or returning after a gap, the structure adapts." },
      { objection: "What if I fall behind?", response: "That's what the community and coaching access are for. Falling behind doesn't mean failing. It means you need a nudge — and we're there to give it." },
    ],
    urgencySection: "Spaces in this cohort are limited to keep the community tight and coaching quality high. Once we hit capacity, registration closes until the next round.",
    finalCta: "If you're ready to stop waiting for 'the right time' and start seeing real results, this is your moment. Click below to secure your spot in the challenge. I'll see you on Day 1.",
  };
}

function buildMockManyChatFlow(challengeName: string): ManyChatFlow {
  return {
    welcomeMessage: `Hey! 👋 Thanks for reaching out. Interested in the ${challengeName.slice(0, 20)}? Let me share the details!`,
    qualificationQ1: {
      message: "Quick question — what's your biggest goal right now?",
      quickReplies: ["Get results fast", "Build consistency", "Not sure yet"],
    },
    qualificationQ2: {
      message: "Are you able to commit 30 days starting next week?",
      quickReplies: ["Yes, I'm ready!", "Tell me more", "Maybe"],
    },
    challengeOverview: `The ${challengeName.slice(0, 15)} is a 30-day programme with daily guidance, community support, and coaching. Real results, real accountability.`,
    signupCta: "Spots are limited! Secure yours here: {{signup_link}} — takes 2 mins to register.",
    registrationConfirm: "You're in! 🎉 Check your email for your welcome pack. Day 1 starts soon — get ready!",
    dayOneReminder: "Today's the day! Day 1 is live. Check the group for your first session. Let's go! 💪",
    midpointCheckIn: "Halfway there! How's it going? Reply and let me know your biggest win so far 🙌",
    noShowFollowUp: "Hey — noticed you haven't started yet. No worries, life happens. Want to jump in today? Still time!",
    setupInstructions: "• Connect this flow to your Instagram DM keyword trigger (e.g. 'CHALLENGE') or Facebook comment automation.\n• Set the welcomeMessage as the first response after opt-in keyword.\n• Link qualificationQ1 → qualificationQ2 → challengeOverview in sequence.\n• Set signupCta to fire after qualificationQ2 if reply is positive.\n• Schedule dayOneReminder for Day 1 at 7am in participant timezone.\n• Schedule midpointCheckIn for Day 15.\n• Trigger noShowFollowUp if no click on signupCta after 48 hours.",
  };
}

function buildMockLongFormAssets(challengeName: string): LongFormSalesAssets {
  return {
    salesLetter: buildMockSalesLetter(challengeName),
    manyChatFlow: buildMockManyChatFlow(challengeName),
  };
}
