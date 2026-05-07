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
        4000,
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
    if (upsertError) throw new Error(upsertError.message);

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
  const posts = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const week = Math.ceil(day / 7);
    const themes = [
      ["Pain point", "Authority", "Myth bust", "Pain point", "Story", "Value", "Engagement"],
      ["Education", "Quick win", "Education", "Proof", "Education", "Quick win", "Engagement"],
      ["Transformation", "Client story", "Social proof", "Before/after", "Transformation", "Testimonial", "Engagement"],
      ["Behind the scenes", "Objection", "Behind the scenes", "Urgency", "Direct offer", "Last chance", "Reflection", "Reflection", "Reflection"],
    ];
    const weekThemes = themes[Math.min(week - 1, 3)];
    const theme = weekThemes[(day - 1) % weekThemes.length];
    const formats = ["Talking head reel", "Text-on-screen reel", "Carousel post", "Value list reel", "Before/after static"];
    const format = formats[(day - 1) % formats.length];
    return {
      day,
      theme,
      format,
      hook: `This is the one thing most ${audience} get wrong in ${monthName}`,
      caption: `If you're ${audience} and you've been struggling with [specific pain], this post is for you.\n\nHere's what I've seen work with the coaches I work with inside ${challengeName}:\n\n[Value point 1]\n[Value point 2]\n[Value point 3]\n\nThe difference between the people who get results and the ones who don't? They don't wait for the perfect moment — they start now.\n\nWhich one resonates with you most? Drop it below 👇`,
      cta: "Drop a 🔥 if this hits home",
    };
  });

  return {
    month: `${monthName} ${year}`,
    monthlyTheme: `${monthName} momentum — helping ${audience} build the habits that stick`,
    weeklyFocuses: [
      "Establish authority and call out the pain your audience is feeling this month",
      "Deliver education and quick wins that build trust through genuine value",
      "Share social proof and transformations — show what's possible right now",
      "Behind the scenes, handle objections, and make the direct ask",
    ],
    posts,
    storyIdeas: [
      `Poll: "What's your biggest fitness struggle in ${monthName}?" (use their answers in future content)`,
      `Behind-the-scenes of a client check-in call — blurred face, real conversation`,
      `Day-in-the-life of a ${challengeName} participant — morning routine`,
      `"React to this if you've ever felt…" story prompt`,
      `Share a client win from this week — message screenshot or voice note`,
      `Q&A box: "Ask me anything about [your niche] this ${monthName}"`,
      `Countdown story: "X days until the next ${challengeName} opens"`,
    ],
    dmStarters: [
      `Hey [name] — love that you're focused on your fitness this ${monthName}. Quick question: what's the #1 thing you'd love to change before the end of the month?`,
      `Hey [name] — noticed you've been engaging with my content lately. Is [niche goal] something you're actively working on right now?`,
      `Hey [name]! ${monthName} always feels like a turning point for a lot of people I work with. Are you in a building phase or a stuck phase right now?`,
      `Hi [name] — you watched my story about [topic]. Is that something you're dealing with at the moment?`,
      `Hey [name] — just wanted to reach out. I work with ${audience} to [main goal]. Is that something you'd find useful right now?`,
    ],
  };
}
