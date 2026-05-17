import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasClaude } from "@/lib/ai/claude-client";
import { callClaudeGroup } from "@/lib/ai/claude-generate";
import { buildCoachContext } from "@/lib/ai/context";
import { buildDmScriptPrompt } from "@/lib/ai/prompts/dm-script";
import { instagramDmScriptResponseSchema } from "@/lib/ai/validators";
import { wizardInputsSchema } from "@/types/wizard";
import type { InstagramDmScript } from "@/types/dm-script";
import type { ProjectInputRow, ProjectRow } from "@/types/project";

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rateLimitError = checkRateLimit(user.id, "generate-dm-script", 1, 60_000);
    if (rateLimitError) return rateLimitError;

    const body = await request.json() as { projectId?: string };
    if (!body.projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });

    const { data: projectData } = await supabase
      .from("projects").select("id, user_id, status")
      .eq("id", body.projectId).eq("user_id", user.id).maybeSingle();
    if (!projectData) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const { data: inputData } = await supabase
      .from("project_inputs").select("inputs")
      .eq("project_id", body.projectId).maybeSingle();
    const stored = inputData as Pick<ProjectInputRow, "inputs"> | null;
    if (!stored?.inputs) return NextResponse.json({ error: "No saved inputs found." }, { status: 400 });

    const validatedInputs = wizardInputsSchema.parse(stored.inputs);
    const context = buildCoachContext(validatedInputs);

    const { data: outputData } = await supabase
      .from("project_outputs").select("id, outputs")
      .eq("project_id", body.projectId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    const outputRowId = (outputData as { id?: string } | null)?.id;
    const existingOutputs = (outputData?.outputs as Record<string, unknown>) ?? {};

    let instagramDmScript: InstagramDmScript;
    let isMock = false;

    if (!hasClaude()) {
      instagramDmScript = buildMockDmScript(
        validatedInputs.coachName ?? "Coach",
        validatedInputs.challengeName ?? "30-Day Challenge",
        validatedInputs.targetAudience ?? "people",
        validatedInputs.mainGoal ?? "reach their goals",
      );
      isMock = true;
    } else {
      const { system, user: userPrompt } = buildDmScriptPrompt(context);
      const result = await callClaudeGroup<{ instagramDmScript: InstagramDmScript }>(
        `${system}\n\n${userPrompt}`,
        instagramDmScriptResponseSchema,
        "dm-script",
        3000,
        "claude-sonnet-4-6",
      );
      if (result.error || !result.data) {
        console.warn("[generate-dm-script] fallback:", result.error);
        instagramDmScript = buildMockDmScript(
          validatedInputs.coachName ?? "Coach",
          validatedInputs.challengeName ?? "30-Day Challenge",
          validatedInputs.targetAudience ?? "people",
          validatedInputs.mainGoal ?? "reach their goals",
        );
        isMock = true;
      } else {
        instagramDmScript = result.data.instagramDmScript;
      }
    }

    const mergedOutputs = { ...existingOutputs, instagramDmScript };
    if (outputRowId) {
      const { error } = await supabase.from("project_outputs").update({ outputs: mergedOutputs }).eq("id", outputRowId);
      if (error) throw new Error(error.message);
    } else {
      const { data: runData } = await supabase.from("generation_runs").insert({ project_id: body.projectId, status: "complete" }).select().maybeSingle();
      const { error } = await supabase.from("project_outputs").insert({ project_id: body.projectId, generation_run_id: (runData as { id?: string } | null)?.id, outputs: mergedOutputs });
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ success: true, instagramDmScript, isMock });
  } catch (error) {
    console.error("[generate-dm-script] error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Generation failed" }, { status: 500 });
  }
}

function buildMockDmScript(coachName: string, programmeName: string, audience: string, mainGoal: string): InstagramDmScript {
  return {
    overview: `These DM scripts are designed for organic lead generation — converting Instagram followers and engaged users into discovery call bookings. The goal of every conversation is to qualify the prospect and get them on a call, not to pitch or close in DMs.`,
    coldOutreach: {
      trigger: "New follower or someone who fits the target audience profile but hasn't engaged yet",
      opener: `Hey [name]! Quick question — are you currently working on [relevant goal related to ${mainGoal}], or is that something you're looking to change?`,
      followUps: [
        `That's really interesting — what's been the main thing getting in the way for you so far?`,
        `Got it. I work specifically with ${audience} to help them ${mainGoal} — I run a programme called the ${programmeName}. It might be exactly what you're looking for. Would it be worth a quick 20-minute chat to see?`,
      ],
      bookingBridge: `I'd love to jump on a free 20-minute call with you — no pitch, just a conversation to see if what I do could genuinely help you. Want me to send you a link to book a time?`,
      coachingNotes: `Keep volume to 20–30 cold DMs per day to avoid being flagged. Personalise the opener with their name and a detail from their profile if possible. Never send a second cold DM the same day — space follow-ups by at least 48 hours.`,
    },
    warmLead: {
      trigger: "Someone who liked a post, watched a story to the end, saved a reel, or engaged with your content",
      opener: `Hey [name] — noticed you [watched my story / saved that post / liked that reel] about [topic]. Is that something you're currently dealing with?`,
      followUps: [
        `Really? Tell me more — how long has that been going on and what have you tried so far?`,
        `Honestly, that's exactly who the ${programmeName} is designed for. I help ${audience} ${mainGoal} — and most people I work with come from exactly where you are. Want to jump on a quick call to see if it's a fit?`,
      ],
      bookingBridge: `Let's book a 20-minute call — I'll ask you a few questions, share what we do, and if it makes sense we can talk about working together. No pressure either way. Want me to send you the link?`,
      coachingNotes: `DM within 30 minutes of engagement for the highest response rate. Reference the exact piece of content they engaged with — it shows you noticed them specifically, not that you're mass DMing. This path converts 2–3x better than cold outreach.`,
    },
    commentToDm: {
      trigger: "Someone who left a genuine, substantive comment on one of your posts",
      opener: `Hey [name] — loved your comment on my [topic] post! What you said about [their words] really resonated. Can I ask — is that something you're actively working through right now?`,
      followUps: [
        `That makes a lot of sense. What's been the hardest part of trying to change that?`,
        `I run a programme specifically for ${audience} dealing with exactly that — the ${programmeName}. Based on what you've shared, I think it could be a really good fit. Would a quick 20-minute chat be useful?`,
      ],
      bookingBridge: `I'd love to find out more about your situation and share what we do. Can I send you a booking link for a free 20-minute call this week?`,
      coachingNotes: `Only DM people who left genuine comments — a comment that shows they actually read the post. Skip emoji-only comments. Quoting their own words back to them is extremely powerful — it shows you read what they wrote, not that you copied a template.`,
    },
    applicationInquiry: {
      trigger: "Someone who sent a DM asking about the programme, your prices, or how to join",
      opener: `Thanks so much for reaching out! Before I share all the details — can I ask what's going on for you right now and what made you decide to reach out today?`,
      followUps: [
        `That's really helpful — it sounds like [reflect their situation back]. How long has this been something you've been wanting to change?`,
        `Based on what you've shared, the ${programmeName} could be a really strong fit. Rather than me just sending you a link, it'd be worth a quick 20-minute call so I can understand your situation properly and make sure it's right for you before you commit to anything. Does that sound fair?`,
      ],
      bookingBridge: `Great — let me send you a booking link for a free 20-minute call. I'll answer all your questions there and we can figure out together if it's the right next step for you.`,
      coachingNotes: `Never send prices in DMs — always move to a call first. The call is where 80% of conversions happen. If they push for a price before the call, say: "I want to make sure it's the right fit for you before we talk investment — the call will make that clear." This filters out low-intent enquiries.`,
    },
    noResponseFollowUp: `Hey [name] — just wanted to check in! Did my last message make sense? Happy to answer any questions 😊`,
    dmTips: [
      `Keep cold DM volume to 20–30 per day per account — more than that risks being flagged by Instagram's spam filters`,
      `Personalise every opener with the prospect's name and something specific to them — a generic opener gets ignored`,
      `Voice notes outperform text DMs by 3–4x in response rate — record a 20-second voice note instead of typing for warm leads`,
      `Follow up exactly once if there's no response — after that, move on. Two unanswered messages is the limit before it becomes harassment`,
      `Time your DMs for when your audience is most active — typically 7–9am and 7–9pm in their timezone`,
      `Don't pitch in the first message — ever. The first DM's only job is to start a conversation`,
      `Track your DM outreach in a simple spreadsheet: name, date, path used, response (yes/no/maybe), outcome. This tells you what's working`,
    ],
  };
}
