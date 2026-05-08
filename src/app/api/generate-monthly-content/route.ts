import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasClaude } from "@/lib/ai/claude-client";
import { callClaudeGroup } from "@/lib/ai/claude-generate";
import { buildCoachContext } from "@/lib/ai/context";
import { buildMonthlyContentPrompt } from "@/lib/ai/prompts/monthly-content";
import { monthlyContentPlanResponseSchema } from "@/lib/ai/validators";
import { wizardInputsSchema } from "@/types/wizard";
import type { MonthlyContentPlan } from "@/types/monthly-content";
import type { ProjectInputRow } from "@/types/project";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json() as { month?: string; projectId?: string };
    if (!body.projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });

    // Validate month param (YYYY-MM), default to current month
    const monthParam = body.month ?? new Date().toISOString().slice(0, 7);
    const [yearStr, monthStr] = monthParam.split("-");
    const year = parseInt(yearStr, 10);
    const monthNumber = parseInt(monthStr, 10);
    if (!year || !monthNumber || monthNumber < 1 || monthNumber > 12) {
      return NextResponse.json({ error: "Invalid month format. Use YYYY-MM." }, { status: 400 });
    }
    const monthName = MONTH_NAMES[monthNumber - 1];

    // Verify project belongs to user
    const { data: projectData } = await supabase
      .from("projects").select("id, user_id")
      .eq("id", body.projectId).eq("user_id", user.id).single();
    if (!projectData) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Load coach context from project inputs
    const { data: inputData } = await supabase
      .from("project_inputs").select("inputs")
      .eq("project_id", body.projectId).single();
    const stored = inputData as Pick<ProjectInputRow, "inputs"> | null;
    if (!stored?.inputs) return NextResponse.json({ error: "No saved inputs found." }, { status: 400 });

    const validatedInputs = wizardInputsSchema.parse(stored.inputs);
    const context = buildCoachContext(validatedInputs);

    let plan: MonthlyContentPlan;

    if (!hasClaude()) {
      plan = buildMockMonthlyContentPlan(
        monthName,
        year,
        validatedInputs.coachName ?? "Coach",
        validatedInputs.challengeName ?? "30-Day Challenge",
        validatedInputs.targetAudience ?? "people",
      );
    } else {
      const { system, user: userPrompt } = buildMonthlyContentPrompt(context, monthName, monthNumber, year);
      const result = await callClaudeGroup<{ monthlyContentPlan: MonthlyContentPlan }>(
        `${system}\n\n${userPrompt}`,
        monthlyContentPlanResponseSchema,
        "monthly-content",
        8000,
        "claude-sonnet-4-6",
      );
      if (result.error || !result.data) {
        console.warn("[generate-monthly-content] fallback:", result.error);
        plan = buildMockMonthlyContentPlan(
          monthName,
          year,
          validatedInputs.coachName ?? "Coach",
          validatedInputs.challengeName ?? "30-Day Challenge",
          validatedInputs.targetAudience ?? "people",
        );
      } else {
        plan = result.data.monthlyContentPlan;
      }
    }

    // Upsert — one plan per user per month
    const { error: upsertError } = await supabase
      .from("monthly_content_plans")
      .upsert(
        { user_id: user.id, month: monthParam, plan, generated_at: new Date().toISOString() },
        { onConflict: "user_id,month" },
      );
    if (upsertError) {
      // Detect missing table — user needs to run the schema migration
      if (upsertError.message.includes("schema cache") || upsertError.message.includes("monthly_content_plans") || upsertError.code === "42P01") {
        return NextResponse.json({
          error: "Database table not found. Please run the following SQL in your Supabase SQL editor:\n\nCREATE TABLE IF NOT EXISTS public.monthly_content_plans (\n  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),\n  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,\n  month text NOT NULL,\n  plan jsonb NOT NULL DEFAULT '{}',\n  generated_at timestamptz NOT NULL DEFAULT now(),\n  UNIQUE(user_id, month)\n);\nALTER TABLE public.monthly_content_plans ENABLE ROW LEVEL SECURITY;\nCREATE POLICY \"Users can manage own content plans\" ON public.monthly_content_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);",
        }, { status: 503 });
      }
      throw new Error(upsertError.message);
    }

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("[generate-monthly-content] error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Generation failed" }, { status: 500 });
  }
}

function buildMockMonthlyContentPlan(
  monthName: string,
  year: number,
  coachName: string,
  challengeName: string,
  audience: string,
): MonthlyContentPlan {
  const firstName = coachName.split(" ")[0];

  type PostTemplate = { theme: string; format: string; hook: string; caption: string; cta: string };

  const postTemplates: PostTemplate[] = [
    {
      theme: "Pain point",
      format: "Talking head reel",
      hook: `The real reason ${audience} can't stay consistent (it's not motivation)`,
      caption: `Most ${audience} I speak to think they have a motivation problem.\n\nThey don't.\n\nThey have a system problem.\n\nWhen your plan only works if you feel like it — it's not a plan, it's a wish.\n\nInside the ${challengeName} I show people how to build a routine that works on the days you're tired, busy, and don't feel like it.\n\nBecause those are the days that actually matter.\n\nDrop a 🙋 if this sounds familiar.`,
      cta: "Drop a 🙋 if this sounds familiar",
    },
    {
      theme: "Authority",
      format: "Text-on-screen reel",
      hook: `3 things I've noticed after working with hundreds of ${audience}`,
      caption: `After years of coaching ${audience}, here's what I know for certain:\n\n1. The ones who succeed don't have more willpower — they have fewer decisions to make each day.\n2. Progress stalls when life gets busy, not because of lack of effort.\n3. The gap between wanting to change and actually changing is almost always information, not intention.\n\nThis is exactly why I built the ${challengeName}.\n\nWhich of these hits closest to home?`,
      cta: "Comment below — I read every reply",
    },
    {
      theme: "Myth bust",
      format: "Carousel post",
      hook: `Stop doing this if you want results this ${monthName}`,
      caption: `I see this mistake every single week.\n\n${audience} overhaul everything at once — diet, training, sleep, supplements — and wonder why nothing sticks past week two.\n\nYou don't need a complete lifestyle reset.\n\nYou need one anchor habit that everything else builds around.\n\nFor most people inside the ${challengeName}, that anchor is a 20-minute morning routine.\n\nSimple. Repeatable. Actually sustainable.\n\nSwipe to see the exact framework.`,
      cta: "Save this for when you need a reset",
    },
    {
      theme: "Story",
      format: "Talking head reel",
      hook: `I almost quit coaching. Here's what changed everything.`,
      caption: `There was a point where I genuinely thought this wasn't working.\n\nMy clients were trying hard but the results weren't matching the effort.\n\nThen I realised — I was coaching the programme, not the person.\n\nOnce I changed that, everything shifted. Retention went up. Results got better. Referrals started coming in.\n\nThe ${challengeName} is built on that lesson. It's not just a programme — it's a coaching relationship.\n\nIf that's what you've been missing, let's talk.`,
      cta: "DM me the word READY if you want details",
    },
    {
      theme: "Quick win",
      format: "Value list reel",
      hook: `Do these 3 things before 9am and your whole day changes`,
      caption: `You don't need a perfect morning.\n\nYou need a consistent one.\n\nHere's what the most consistent ${audience} I coach do before 9am:\n\n→ Drink 500ml of water before coffee\n→ Move for 10 minutes (walk, stretch, anything)\n→ Write down the one thing that actually needs to happen today\n\nThat's it. No 4am wake-ups. No hour-long routines.\n\nJust three things that tell your brain: today is intentional.\n\nTry it tomorrow and let me know.`,
      cta: "Comment 'MORNING' and I'll send you the full routine",
    },
    {
      theme: "Education",
      format: "Carousel post",
      hook: `Why you lose weight fast then put it all back on (the honest answer)`,
      caption: `It's not your fault — but it is your strategy.\n\nMost programmes are designed to produce fast results, not lasting ones.\n\nThey work by creating a large deficit that your body eventually fights back against.\n\nThe result? You lose weight, feel great for 4 weeks, then life happens and you're back where you started.\n\nThe ${challengeName} works differently. We focus on the behaviours first, the results follow.\n\nSwipe for the full breakdown.`,
      cta: "Save this — share it with someone who needs to hear it",
    },
    {
      theme: "Engagement",
      format: "Text-on-screen reel",
      hook: `Be honest — which one are you right now?`,
      caption: `I want to know where you're at this ${monthName}.\n\nA) Consistent and feeling good about it\nB) Started well but lost momentum\nC) Haven't started yet — waiting for the right time\nD) Going through the motions but not seeing results\n\nNo judgment here. I've been all four of these at different points.\n\nDrop your letter below — I read every single one and I'll reply.`,
      cta: "Drop A, B, C or D below",
    },
    {
      theme: "Transformation",
      format: "Before/after static",
      hook: `What 8 weeks of consistency actually looks like`,
      caption: `This is what happens when ${audience} stop starting over and just stay the course.\n\nNot a crash diet. Not twice-a-day training.\n\nJust consistent action, a structured plan, and someone holding you accountable to it.\n\nThe ${challengeName} is 30 days. But most people who go through it keep going because they've finally built something that feels sustainable.\n\nIf you want to know what that looks like for your situation, send me a DM.`,
      cta: "DM me 'RESULTS' to find out if this is right for you",
    },
    {
      theme: "Client story",
      format: "Talking head reel",
      hook: `She almost didn't join. Now she's the one people message asking what changed.`,
      caption: `One of my clients told me she spent six months watching my content before reaching out.\n\nShe thought she wasn't ready. That she needed to lose a bit of weight first before starting a programme.\n\nThat thinking is exactly what the ${challengeName} addresses in week one.\n\nYou don't get ready. You get started, and the readiness follows.\n\nShe's now three rounds in and coaching other women in her own right.\n\nIf you've been watching and wondering — this is your sign.`,
      cta: "Comment 'STORY' if this resonates",
    },
    {
      theme: "Social proof",
      format: "Carousel post",
      hook: `Real results from real ${audience} — no filters, no fluff`,
      caption: `I want to show you what's possible when ${audience} commit to the right structure.\n\nThese aren't outliers. They're people who showed up consistently for 30 days inside the ${challengeName}.\n\nWhat they have in common:\n→ They stopped trying to be perfect\n→ They followed the plan even on bad days\n→ They asked for help when they got stuck\n\nResults like these aren't accidents. They're the product of a system that works.\n\nSwipe to see the full breakdown of what changed for them.`,
      cta: "Drop a 🔥 if you want results like this",
    },
    {
      theme: "Objection handling",
      format: "Text-on-screen reel",
      hook: `"I don't have time" — let's fix that right now`,
      caption: `If I had a pound for every time I heard this…\n\nHere's the truth: you don't need more time. You need a better plan for the time you already have.\n\nThe ${challengeName} is built around real schedules.\n\nThree 20-minute sessions a week. Nutrition guidance that fits around family dinners and work lunches.\n\nThe people who say they don't have time usually have 90 minutes of scrolling a day.\n\nI'm not judging — I was one of them.\n\nIf you want to see how this fits your schedule, drop me a message.`,
      cta: "DM me 'TIME' and let's look at your week together",
    },
    {
      theme: "Behind the scenes",
      format: "Day-in-the-life reel",
      hook: `A day in my life as a coach — the parts nobody talks about`,
      caption: `People see the results. They don't see the 6am client check-ins, the WhatsApp messages at 9pm, the planning sessions on Sunday afternoon.\n\nCoaching isn't just programming.\n\nIt's being the person who believes in someone when they've stopped believing in themselves.\n\nThat's what ${firstName} does inside the ${challengeName}.\n\nAnd honestly — it's the most rewarding work I've ever done.\n\nIf you're curious about what working together actually looks like, drop a question below.`,
      cta: "Ask me anything — drop it in the comments",
    },
    {
      theme: "Direct offer",
      format: "Talking head reel",
      hook: `I'm looking for ${audience} who are serious about ${monthName}`,
      caption: `Not everyone who wants to change their body is ready to do what it takes.\n\nAnd that's okay.\n\nBut if you're someone who is ready — who's tired of starting over, tired of near-misses, tired of knowing what to do but not doing it — then the ${challengeName} was built for you.\n\nHere's what you get: a structured 30-day plan, daily accountability, a coach in your corner, and a community of people doing the same thing at the same time.\n\nIf that's what you've been missing, let's talk this ${monthName}.`,
      cta: "Comment 'IN' or DM me to get started",
    },
    {
      theme: "Value",
      format: "Carousel post",
      hook: `The 5-minute evening habit that makes next-day consistency automatic`,
      caption: `Most ${audience} focus all their effort on the morning.\n\nBut the day is won or lost the night before.\n\nHere's the 5-minute evening routine that changes everything:\n\n→ Lay out your training gear\n→ Prep your first meal or know exactly what it'll be\n→ Write down your one commitment for tomorrow\n\nWhen decisions are already made, you remove the friction that stops most people.\n\nThe ${challengeName} comes with a daily planning template that does this for you.\n\nSwipe for the full breakdown.`,
      cta: "Save this and try it tonight",
    },
    {
      theme: "Urgency",
      format: "Text-on-screen reel",
      hook: `There are 8 weeks left before the end of ${monthName.includes("May") || monthName.includes("June") ? "summer" : "the year"}`,
      caption: `I'm not saying this to panic you.\n\nI'm saying it because ${audience} I speak to always underestimate how much is possible in 8 weeks of focused effort.\n\nNot 8 weeks of perfect eating and daily training.\n\nJust 8 weeks of showing up more often than not, following a plan, and staying accountable.\n\nThe ${challengeName} is 30 days — which means you could do it twice before ${monthName.includes("May") || monthName.includes("June") ? "summer ends" : "the year is out"}.\n\nIf you've been waiting, the wait ends here.`,
      cta: "DM me the word NOW and I'll send you the details",
    },
  ];

  const posts = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const template = postTemplates[i % postTemplates.length];
    const formats = ["Talking head reel", "Text-on-screen reel", "Carousel post", "Value list reel", "Before/after static", "Day-in-the-life reel"];
    return {
      day,
      theme: template.theme,
      format: template.format ?? formats[i % formats.length],
      hook: template.hook,
      caption: template.caption,
      cta: template.cta,
    };
  });

  return {
    month: `${monthName} ${year}`,
    monthlyTheme: `${monthName} momentum — helping ${audience} build the habits that stick before ${monthName.includes("May") || monthName.includes("Jun") ? "summer" : "the end of the year"}`,
    weeklyFocuses: [
      `Week 1: Speak to the ${monthName}-specific frustrations your audience is feeling right now. Establish that you understand their world before talking about solutions.`,
      `Week 2: Deliver education and quick wins. Build trust by giving genuine value — tips they can use this week, not just reasons to buy.`,
      `Week 3: Show social proof and transformation. Demonstrate what's possible for ${audience} when they have the right structure in place.`,
      `Week 4: Handle objections, go behind the scenes, and make a clear, direct offer. This is the week people convert.`,
    ],
    posts,
    storyIdeas: [
      `Poll: "What's your #1 fitness challenge this ${monthName}?" — use the results to shape your next week of content`,
      `Behind-the-scenes of a real client check-in — blurred face, real conversation, real progress update`,
      `Day-in-the-life of someone inside the ${challengeName} — their morning routine, their meals, their evening wind-down`,
      `"React with 🔥 if you've ever felt like you're doing everything right but not seeing results"`,
      `Screenshot a client win (with permission) and share the context — what changed, how long it took, what they said`,
      `Q&A box: "Ask me anything about getting results as a ${audience.split(" ").slice(0, 3).join(" ")} this ${monthName}"`,
      `Countdown story: "${challengeName} next cohort opens in X days — tap to get on the waitlist"`,
    ],
    dmStarters: [
      `Hey [name] — saw you've been engaging with my content lately. Quick question: what's the #1 thing you'd love to crack with your fitness before the end of ${monthName}?`,
      `Hey [name] — just wanted to reach out personally. I work with ${audience} to [your main result]. Is that something you're actively working on right now?`,
      `Hi [name]! ${monthName} always feels like a turning point for the people I work with. Are you in a building phase or feeling a bit stuck at the moment?`,
      `Hey [name] — you watched my story about [topic]. Is that something you're dealing with right now? I might be able to help.`,
      `Hey [name] — love that you're focused on this. I'm running the ${challengeName} this month and I think it could be a good fit for you. Want me to send the details?`,
    ],
  };
}
