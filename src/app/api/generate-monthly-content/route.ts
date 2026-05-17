import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
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

    const rateLimitError = checkRateLimit(user.id, "generate-monthly-content", 1, 60_000);
    if (rateLimitError) return rateLimitError;

    const body = await request.json() as { month?: string; projectId?: string };
    if (!body.projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });

    const monthParam = body.month ?? new Date().toISOString().slice(0, 7);
    const [yearStr, monthStr] = monthParam.split("-");
    const year = parseInt(yearStr, 10);
    const monthNumber = parseInt(monthStr, 10);
    if (!year || !monthNumber || monthNumber < 1 || monthNumber > 12) {
      return NextResponse.json({ error: "Invalid month format. Use YYYY-MM." }, { status: 400 });
    }
    const monthName = MONTH_NAMES[monthNumber - 1];

    const { data: projectData } = await supabase
      .from("projects").select("id, user_id")
      .eq("id", body.projectId).eq("user_id", user.id).single();
    if (!projectData) return NextResponse.json({ error: "Project not found" }, { status: 404 });

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
        monthName, year,
        validatedInputs.coachName ?? "Coach",
        validatedInputs.challengeName ?? "30-Day Challenge",
        validatedInputs.targetAudience ?? "people",
      );
    } else {
      // Split into two calls (days 1–15 and 16–30) so each batch has enough
      // token budget to write complete, unique, placeholder-free captions.
      const [promptA, promptB] = [
        buildMonthlyContentPrompt(context, monthName, monthNumber, year, { start: 1, end: 15 }),
        buildMonthlyContentPrompt(context, monthName, monthNumber, year, { start: 16, end: 30 }),
      ];

      const [resultA, resultB] = await Promise.all([
        callClaudeGroup<{ monthlyContentPlan: MonthlyContentPlan }>(
          `${promptA.system}\n\n${promptA.user}`,
          monthlyContentPlanResponseSchema,
          "monthly-content-A",
          8000,
          "claude-sonnet-4-6",
        ),
        callClaudeGroup<{ monthlyContentPlan: MonthlyContentPlan }>(
          `${promptB.system}\n\n${promptB.user}`,
          monthlyContentPlanResponseSchema,
          "monthly-content-B",
          8000,
          "claude-sonnet-4-6",
        ),
      ]);

      if ((resultA.error || !resultA.data) || (resultB.error || !resultB.data)) {
        console.warn("[generate-monthly-content] fallback — A:", resultA.error, "B:", resultB.error);
        plan = buildMockMonthlyContentPlan(
          monthName, year,
          validatedInputs.coachName ?? "Coach",
          validatedInputs.challengeName ?? "30-Day Challenge",
          validatedInputs.targetAudience ?? "people",
        );
      } else {
        const planA = resultA.data.monthlyContentPlan;
        const planB = resultB.data.monthlyContentPlan;
        // Merge: use planA's metadata + combined posts from both halves
        plan = {
          ...planA,
          posts: [...planA.posts, ...planB.posts].sort((a, b) => a.day - b.day),
          storyIdeas: [...new Set([...(planA.storyIdeas ?? []), ...(planB.storyIdeas ?? [])])].slice(0, 7),
          dmStarters: [...new Set([...(planA.dmStarters ?? []), ...(planB.dmStarters ?? [])])].slice(0, 5),
        };
      }
    }

    const { error: upsertError } = await supabase
      .from("monthly_content_plans")
      .upsert(
        { user_id: user.id, month: monthParam, plan, generated_at: new Date().toISOString() },
        { onConflict: "user_id,month" },
      );
    if (upsertError) {
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
    // Day 1
    {
      theme: "Pain point",
      format: "Talking head reel",
      hook: `The real reason ${audience} can't stay consistent (it's not motivation)`,
      caption: `Most ${audience} I speak to think they have a motivation problem.\n\nThey don't.\n\nThey have a system problem.\n\nWhen your plan only works if you feel like it — it's not a plan, it's a wish.\n\nInside the ${challengeName} I show people how to build a routine that works on the days you're tired, busy, and don't feel like it.\n\nBecause those are the days that actually matter.\n\nDrop a 🙋 if this sounds familiar.`,
      cta: "Drop a 🙋 if this sounds familiar",
    },
    // Day 2
    {
      theme: "Authority",
      format: "Text-on-screen reel",
      hook: `3 things I've noticed after working with hundreds of ${audience}`,
      caption: `After years of coaching ${audience}, here's what I know for certain:\n\n1. The ones who succeed don't have more willpower — they have fewer decisions to make each day.\n2. Progress stalls when life gets busy, not because of lack of effort.\n3. The gap between wanting to change and actually changing is almost always information, not intention.\n\nThis is exactly why I built the ${challengeName}.\n\nWhich of these hits closest to home?`,
      cta: "Comment below — I read every reply",
    },
    // Day 3
    {
      theme: "Myth bust",
      format: "Carousel post",
      hook: `Stop doing this if you want results this ${monthName}`,
      caption: `I see this mistake every single week.\n\n${audience} overhaul everything at once — diet, training, sleep, supplements — and wonder why nothing sticks past week two.\n\nYou don't need a complete lifestyle reset.\n\nYou need one anchor habit that everything else builds around.\n\nFor most people inside the ${challengeName}, that anchor is a 20-minute morning routine.\n\nSimple. Repeatable. Actually sustainable.\n\nSwipe to see the exact framework.`,
      cta: "Save this for when you need a reset",
    },
    // Day 4
    {
      theme: "Story",
      format: "Talking head reel",
      hook: `I almost quit coaching. Here's what changed everything.`,
      caption: `There was a point where I genuinely thought this wasn't working.\n\nMy clients were trying hard but the results weren't matching the effort.\n\nThen I realised — I was coaching the programme, not the person.\n\nOnce I changed that, everything shifted. Retention went up. Results got better. Referrals started coming in.\n\nThe ${challengeName} is built on that lesson. It's not just a programme — it's a coaching relationship.\n\nIf that's what you've been missing, let's talk.`,
      cta: "DM me the word READY if you want details",
    },
    // Day 5
    {
      theme: "Quick win",
      format: "Value list reel",
      hook: `Do these 3 things before 9am and your whole day changes`,
      caption: `You don't need a perfect morning.\n\nYou need a consistent one.\n\nHere's what the most consistent ${audience} I coach do before 9am:\n\n→ Drink 500ml of water before coffee\n→ Move for 10 minutes (walk, stretch, anything)\n→ Write down the one thing that actually needs to happen today\n\nThat's it. No 4am wake-ups. No hour-long routines.\n\nJust three things that tell your brain: today is intentional.\n\nTry it tomorrow and let me know.`,
      cta: "Comment 'MORNING' and I'll send you the full routine",
    },
    // Day 6
    {
      theme: "Education",
      format: "Carousel post",
      hook: `Why you lose weight fast then put it all back on (the honest answer)`,
      caption: `It's not your fault — but it is your strategy.\n\nMost programmes are designed to produce fast results, not lasting ones.\n\nThey work by creating a large deficit that your body eventually fights back against.\n\nThe result? You lose weight, feel great for 4 weeks, then life happens and you're back where you started.\n\nThe ${challengeName} works differently. We focus on the behaviours first, the results follow.\n\nSwipe for the full breakdown.`,
      cta: "Save this — share it with someone who needs to hear it",
    },
    // Day 7
    {
      theme: "Engagement",
      format: "Text-on-screen reel",
      hook: `Be honest — which one are you right now?`,
      caption: `I want to know where you're at this ${monthName}.\n\nA) Consistent and feeling good about it\nB) Started well but lost momentum\nC) Haven't started yet — waiting for the right time\nD) Going through the motions but not seeing results\n\nNo judgment here. I've been all four of these at different points.\n\nDrop your letter below — I read every single one and I'll reply.`,
      cta: "Drop A, B, C or D below",
    },
    // Day 8
    {
      theme: "Transformation",
      format: "Before/after static",
      hook: `What 8 weeks of consistency actually looks like`,
      caption: `This is what happens when ${audience} stop starting over and just stay the course.\n\nNot a crash diet. Not twice-a-day training.\n\nJust consistent action, a structured plan, and someone holding you accountable to it.\n\nThe ${challengeName} is 30 days. But most people who go through it keep going because they've finally built something that feels sustainable.\n\nIf you want to know what that looks like for your situation, send me a DM.`,
      cta: "DM me 'RESULTS' to find out if this is right for you",
    },
    // Day 9
    {
      theme: "Client story",
      format: "Talking head reel",
      hook: `She almost didn't join. Now she's the one people message asking what changed.`,
      caption: `One of my clients told me she spent six months watching my content before reaching out.\n\nShe thought she wasn't ready. That she needed to lose a bit of weight first before starting a programme.\n\nThat thinking is exactly what the ${challengeName} addresses in week one.\n\nYou don't get ready. You get started, and the readiness follows.\n\nShe's now three rounds in and coaching other women in her own right.\n\nIf you've been watching and wondering — this is your sign.`,
      cta: "Comment 'STORY' if this resonates",
    },
    // Day 10
    {
      theme: "Social proof",
      format: "Carousel post",
      hook: `Real results from real ${audience} — no filters, no fluff`,
      caption: `I want to show you what's possible when ${audience} commit to the right structure.\n\nThese aren't outliers. They're people who showed up consistently for 30 days inside the ${challengeName}.\n\nWhat they have in common:\n→ They stopped trying to be perfect\n→ They followed the plan even on bad days\n→ They asked for help when they got stuck\n\nResults like these aren't accidents. They're the product of a system that works.\n\nSwipe to see the full breakdown of what changed for them.`,
      cta: "Drop a 🔥 if you want results like this",
    },
    // Day 11
    {
      theme: "Objection handling",
      format: "Text-on-screen reel",
      hook: `"I don't have time" — let's fix that right now`,
      caption: `If I had a pound for every time I heard this…\n\nHere's the truth: you don't need more time. You need a better plan for the time you already have.\n\nThe ${challengeName} is built around real schedules.\n\nThree 20-minute sessions a week. Nutrition guidance that fits around family dinners and work lunches.\n\nThe people who say they don't have time usually have 90 minutes of scrolling a day.\n\nI'm not judging — I was one of them.\n\nIf you want to see how this fits your schedule, drop me a message.`,
      cta: "DM me 'TIME' and let's look at your week together",
    },
    // Day 12
    {
      theme: "Behind the scenes",
      format: "Day-in-the-life reel",
      hook: `A day in my life as a coach — the parts nobody talks about`,
      caption: `People see the results. They don't see the 6am client check-ins, the WhatsApp messages at 9pm, the planning sessions on Sunday afternoon.\n\nCoaching isn't just programming.\n\nIt's being the person who believes in someone when they've stopped believing in themselves.\n\nThat's what ${firstName} does inside the ${challengeName}.\n\nAnd honestly — it's the most rewarding work I've ever done.\n\nIf you're curious about what working together actually looks like, drop a question below.`,
      cta: "Ask me anything — drop it in the comments",
    },
    // Day 13
    {
      theme: "Direct offer",
      format: "Talking head reel",
      hook: `I'm looking for ${audience} who are serious about ${monthName}`,
      caption: `Not everyone who wants to change their body is ready to do what it takes.\n\nAnd that's okay.\n\nBut if you're someone who is ready — who's tired of starting over, tired of near-misses, tired of knowing what to do but not doing it — then the ${challengeName} was built for you.\n\nHere's what you get: a structured 30-day plan, daily accountability, a coach in your corner, and a community of people doing the same thing at the same time.\n\nIf that's what you've been missing, let's talk this ${monthName}.`,
      cta: "Comment 'IN' or DM me to get started",
    },
    // Day 14
    {
      theme: "Value",
      format: "Carousel post",
      hook: `The 5-minute evening habit that makes next-day consistency automatic`,
      caption: `Most ${audience} focus all their effort on the morning.\n\nBut the day is won or lost the night before.\n\nHere's the 5-minute evening routine that changes everything:\n\n→ Lay out your training gear\n→ Prep your first meal or know exactly what it'll be\n→ Write down your one commitment for tomorrow\n\nWhen decisions are already made, you remove the friction that stops most people.\n\nThe ${challengeName} comes with a daily planning template that does this for you.\n\nSwipe for the full breakdown.`,
      cta: "Save this and try it tonight",
    },
    // Day 15
    {
      theme: "Mindset",
      format: "Talking head reel",
      hook: `The mindset shift that separates ${audience} who get results from those who don't`,
      caption: `Most ${audience} are chasing the feeling of being motivated.\n\nThe ones who actually change their bodies have stopped waiting for it.\n\nMotivation is a visitor. It shows up when things are going well and disappears the moment life gets hard.\n\nDiscipline is a skill. You build it like a muscle — by doing the thing when you don't feel like it.\n\nWeek one of the ${challengeName} is entirely about this shift.\n\nNot because it sounds good. Because it's the only thing that actually works long-term.`,
      cta: "Comment 'MINDSET' if this is what you've been missing",
    },
    // Day 16
    {
      theme: "Nutrition tip",
      format: "Value list reel",
      hook: `4 nutrition habits that cost nothing and change everything`,
      caption: `You don't need a meal plan, supplements, or expensive food to eat better.\n\nYou need habits that fit your actual life.\n\nHere are the four I teach every ${audience} inside the ${challengeName}:\n\n→ Eat protein at every meal (aim for a palm-sized portion)\n→ Fill half your plate with vegetables before adding anything else\n→ Drink water before every meal — it reduces cravings by 30%\n→ Plan your meals the night before — even just mentally\n\nStart with one. Build from there.`,
      cta: "Save this and start with just one this week",
    },
    // Day 17
    {
      theme: "Accountability",
      format: "Text-on-screen reel",
      hook: `Why ${audience} get better results with a coach than alone (it's not what you think)`,
      caption: `People assume coaching is about information.\n\nGet the right plan, follow it, get results.\n\nBut ${audience} I work with already know roughly what to do.\n\nThe missing piece isn't knowledge. It's accountability.\n\nHaving someone who notices when you go quiet. Who asks the hard question. Who reminds you why you started when you're ready to quit.\n\nThat's what the ${challengeName} provides.\n\nNot a magic formula. A support system that actually works.`,
      cta: "Drop a 💪 if you've tried going it alone and know this feeling",
    },
    // Day 18
    {
      theme: "Weekend consistency",
      format: "Talking head reel",
      hook: `Your weekends are sabotaging your weekday progress — here's the fix`,
      caption: `Monday to Friday, ${audience} are locked in.\n\nThen the weekend hits.\n\nSocial events, lie-ins, takeaways, skipped sessions — and by Monday you feel like you're starting from scratch again.\n\nThis pattern is one of the most common things I see.\n\nInside the ${challengeName} we solve it in week two. The weekend isn't the enemy — the lack of a plan for it is.\n\nI'll show you exactly how to enjoy your weekends without undoing your week.`,
      cta: "Comment 'WEEKEND' if this is your pattern",
    },
    // Day 19
    {
      theme: "Progress milestone",
      format: "Before/after static",
      hook: `30 days. No gimmicks. Here's what actually changed.`,
      caption: `I want to show you what one month of consistent effort looks like for ${audience} inside the ${challengeName}.\n\nNot a dramatic transformation. A real one.\n\nBetter sleep. More energy. Clothes fitting differently. Feeling in control of food for the first time in years.\n\nThese aren't headline results — but they're the ones that last.\n\nBecause when your habits change, your body follows. Not the other way around.\n\nThis is what 30 days looks like when you have the right structure behind you.`,
      cta: "DM me '30 DAYS' to find out what this looks like for you",
    },
    // Day 20
    {
      theme: "Common mistake",
      format: "Carousel post",
      hook: `The #1 mistake ${audience} make in week 3 of any programme`,
      caption: `Week one: you're fired up. Everything feels possible.\nWeek two: it's harder, but you're still going.\nWeek three: you've had a bad day, missed a session, and suddenly the whole thing feels pointless.\n\nThis is the wall. And almost everyone hits it.\n\nThe people who get results aren't the ones who never hit the wall. They're the ones who know what to do when they do.\n\nInside the ${challengeName} we build a specific plan for week three. Because momentum isn't something you hope for — it's something you design.\n\nSwipe to see how.`,
      cta: "Save this for when you need it most",
    },
    // Day 21
    {
      theme: "Sleep & recovery",
      format: "Carousel post",
      hook: `You can't out-train bad sleep — here's what that actually means`,
      caption: `${audience} focus on training and nutrition. Almost nobody talks about sleep.\n\nBut here's what the research shows: poor sleep raises cortisol, increases cravings for processed food, reduces muscle recovery, and tanks your motivation.\n\nYou can do everything right in the gym and still stall if you're sleeping badly.\n\nInside the ${challengeName}, recovery is a core part of the plan — not an afterthought.\n\nSwipe for the five sleep habits that make everything else work better.`,
      cta: "Save this — your results depend on it",
    },
    // Day 22
    {
      theme: "Community",
      format: "Day-in-the-life reel",
      hook: `What happens inside the ${challengeName} community (you'd be surprised)`,
      caption: `People join the ${challengeName} for the programme.\n\nThey stay because of the community.\n\nThere's something that happens when ${audience} realise they're not struggling alone.\n\nThe check-ins at 6am. The "I nearly quit today" messages that get 40 replies. The wins that get celebrated like they're everyone's wins.\n\nYou can follow a plan on your own. But you can't replicate that.\n\nIf you've been doing this solo and wondering why it keeps stalling — this might be what's missing.`,
      cta: "Comment 'COMMUNITY' to find out how to join us",
    },
    // Day 23
    {
      theme: "Testimonial",
      format: "Text-on-screen reel",
      hook: `"I've tried everything. This is the first thing that actually worked."`,
      caption: `That's a direct quote from someone who completed the ${challengeName} last month.\n\nShe'd done three other programmes before. Lost weight, put it back on, lost confidence each time.\n\nWhat was different this time wasn't the workouts or the meal plan.\n\nIt was having a coach who understood why she kept stopping — and helped her build something that worked around her actual life.\n\nIf "I've tried everything" sounds familiar, I want to hear your story.`,
      cta: "DM me and tell me what you've already tried",
    },
    // Day 24
    {
      theme: "FAQ",
      format: "Carousel post",
      hook: `The 5 questions I get asked most before ${audience} join the ${challengeName}`,
      caption: `Before people join, they always ask the same questions.\n\nSo here are the honest answers:\n\n1. How much time does it take? 3 sessions a week, 20–30 minutes each.\n2. Do I need equipment? No. Bodyweight options for everything.\n3. What if I miss a session? We plan for that. Life happens.\n4. Is the nutrition plan strict? No — it's built around your lifestyle.\n5. What if it doesn't work for me? We stay until it does.\n\nStill have questions? Drop them below.`,
      cta: "Drop your question in the comments",
    },
    // Day 25
    {
      theme: "Motivation vs discipline",
      format: "Talking head reel",
      hook: `Stop waiting to feel ready. This is what actually gets results.`,
      caption: `The most common thing I hear from ${audience} before they start is: "I just need to get my head right first."\n\nI understand why they say it.\n\nBut here's the truth: your head gets right by taking action. Not the other way around.\n\nClarity comes from movement. Confidence comes from doing hard things. Motivation follows action — it doesn't lead it.\n\nThe ${challengeName} is designed to get you moving before you feel ready. Because waiting for ready is how months turn into years.`,
      cta: "Drop a 🙌 if you needed to hear this today",
    },
    // Day 26
    {
      theme: "Family & lifestyle",
      format: "Day-in-the-life reel",
      hook: `How ${audience} fit training around a full life (not the other way around)`,
      caption: `I don't work with people who have empty schedules.\n\nI work with ${audience} who have jobs, families, social lives, and exactly 45 minutes on a good day.\n\nThe ${challengeName} is built for real life. Not Instagram life.\n\nThat means sessions that fit in your lunch break. Meal ideas that take 15 minutes. Check-ins that meet you where you actually are.\n\nIf you've ever felt like the "right time" never comes — this is how you stop waiting for it.`,
      cta: "DM me 'REAL LIFE' and I'll show you how this fits your schedule",
    },
    // Day 27
    {
      theme: "Myth bust #2",
      format: "Text-on-screen reel",
      hook: `Cardio won't fix what's actually holding ${audience} back`,
      caption: `Every ${audience} I've ever worked with started with the same assumption: do more cardio, lose more weight.\n\nHere's the problem.\n\nCardio burns calories during the session. Strength training raises your resting metabolism — so you burn more calories doing nothing.\n\nMore importantly: strength training changes how your body looks. Cardio alone doesn't.\n\nInside the ${challengeName} we use both — in the right combination, at the right time.\n\nNot because it's complicated. Because doing it right matters.`,
      cta: "Comment 'STRENGTH' if this changes how you think about training",
    },
    // Day 28
    {
      theme: "Reflection",
      format: "Talking head reel",
      hook: `If you'd started the ${challengeName} 30 days ago, where would you be today?`,
      caption: `I'm not asking this to make you feel bad.\n\nI'm asking because ${audience} I speak to often look back at a month that passed and realise — nothing changed.\n\nSame habits. Same frustrations. Same starting point.\n\nAnd the honest answer is usually: I kept waiting for the right time.\n\nThe right time doesn't arrive. You decide it's the right time.\n\nThe next cohort of the ${challengeName} starts soon. In 30 days from now, you could be somewhere completely different.`,
      cta: "DM me 'START' if you're done waiting",
    },
    // Day 29
    {
      theme: "Last chance",
      format: "Text-on-screen reel",
      hook: `Spots in the ${challengeName} are filling up — here's what you need to know`,
      caption: `I keep the ${challengeName} small on purpose.\n\nSmall enough that I can actually coach people — not just send them a PDF and hope for the best.\n\nThat means when spots fill up, they're gone. I don't open a waitlist and squeeze people in.\n\nIf you've been thinking about it, the time to decide is now.\n\nHere's what you get: a 30-day structured programme, daily accountability, direct access to ${firstName}, and a community of ${audience} doing the same thing at the same time.\n\nThe next cohort starts in ${monthName}. Message me before it's full.`,
      cta: "DM me NOW before spots are gone",
    },
    // Day 30
    {
      theme: "Month wrap-up",
      format: "Talking head reel",
      hook: `${monthName} is almost over — let's talk about what's next`,
      caption: `I always do a quick reflection at the end of the month.\n\nWhat worked this ${monthName}. What didn't. What I'm doing differently next month.\n\nAnd one thing I consistently hear from ${audience} who completed the ${challengeName} this month:\n\n"I wish I'd started sooner."\n\nNot because it was easy. Because they finally feel like they're moving in the right direction.\n\nIf that's where you want to be at the end of next month — the doors are open.\n\nLet's make it happen.`,
      cta: "Comment 'NEXT MONTH' and I'll send you the details",
    },
  ];

  const posts = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const template = postTemplates[i];
    return {
      day,
      theme: template.theme,
      format: template.format,
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
      `Hey [name] — just wanted to reach out personally. I work with ${audience} to help them get results that actually last. Is that something you're actively working on right now?`,
      `Hi [name]! ${monthName} always feels like a turning point for the people I work with. Are you in a building phase or feeling a bit stuck at the moment?`,
      `Hey [name] — you engaged with my post about [topic]. Is that something you're dealing with right now? I might be able to help.`,
      `Hey [name] — love that you're focused on this. I'm running the ${challengeName} this month and I think it could be a good fit for you. Want me to send the details?`,
    ],
  };
}
