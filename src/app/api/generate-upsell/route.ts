import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasClaude } from "@/lib/ai/claude-client";
import { callClaudeGroup } from "@/lib/ai/claude-generate";
import { buildCoachContext } from "@/lib/ai/context";
import { buildUpsellSequencePrompt } from "@/lib/ai/prompts/upsell-sequence";
import { upsellSequenceResponseSchema } from "@/lib/ai/validators";
import { wizardInputsSchema } from "@/types/wizard";
import type { UpsellSequence } from "@/types/upsell-sequence";
import type { ProjectInputRow, ProjectRow } from "@/types/project";

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rateLimitError = checkRateLimit(user.id, "generate-upsell", 1, 60_000);
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

    let upsellSequence: UpsellSequence;
    let isMock = false;

    if (!hasClaude()) {
      upsellSequence = buildMockUpsellSequence(
        validatedInputs.coachName ?? "Coach",
        validatedInputs.challengeName ?? "30-Day Challenge",
        validatedInputs.targetAudience ?? "people",
        validatedInputs.mainGoal ?? "reach their goals",
        validatedInputs.price ?? "£997",
      );
      isMock = true;
    } else {
      const { system, user: userPrompt } = buildUpsellSequencePrompt(context);
      const result = await callClaudeGroup<{ upsellSequence: UpsellSequence }>(
        `${system}\n\n${userPrompt}`,
        upsellSequenceResponseSchema,
        "upsell-sequence",
        3500,
        "claude-sonnet-4-6",
      );
      if (result.error || !result.data) {
        console.warn("[generate-upsell] fallback:", result.error);
        upsellSequence = buildMockUpsellSequence(
          validatedInputs.coachName ?? "Coach",
          validatedInputs.challengeName ?? "30-Day Challenge",
          validatedInputs.targetAudience ?? "people",
          validatedInputs.mainGoal ?? "reach their goals",
          validatedInputs.price ?? "£997",
        );
        isMock = true;
      } else {
        upsellSequence = result.data.upsellSequence;
      }
    }

    const mergedOutputs = { ...existingOutputs, upsellSequence };
    if (outputRowId) {
      const { error } = await supabase.from("project_outputs").update({ outputs: mergedOutputs }).eq("id", outputRowId);
      if (error) throw new Error(error.message);
    } else {
      const { data: runData } = await supabase.from("generation_runs").insert({ project_id: body.projectId, status: "complete" }).select().maybeSingle();
      const { error } = await supabase.from("project_outputs").insert({ project_id: body.projectId, generation_run_id: (runData as { id?: string } | null)?.id, outputs: mergedOutputs });
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ success: true, upsellSequence, isMock });
  } catch (error) {
    console.error("[generate-upsell] error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Generation failed" }, { status: 500 });
  }
}

function buildMockUpsellSequence(coachName: string, programmeName: string, audience: string, mainGoal: string, price: string): UpsellSequence {
  const firstName = coachName.split(" ")[0];
  return {
    targetOffer: `1:1 coaching or a higher-tier programme for ${audience} who completed the ${programmeName} and want to go deeper`,
    overview: `This 5-email sequence runs over 14 days immediately after the challenge ends — when clients are at peak motivation and trust. The strategy is: celebrate → plant a seed → inspire with proof → make the offer → close with warmth. No hard sell, just a natural next step in the coaching relationship.`,
    emails: [
      {
        day: 1,
        purpose: "Celebrate + Plant the seed",
        subject: `You did it. Seriously. 🎉`,
        body: `Hi [name],\n\nI just wanted to take a moment to say: I'm genuinely proud of you.\n\nCompleting the ${programmeName} isn't easy. Most people who sign up for challenges don't finish them. You did — and the results you've seen are real.\n\nI've been thinking about what you shared during the challenge. The progress you made in just 30 days is honestly impressive — but here's what I keep coming back to:\n\nWhat happens in the next 30 days?\n\nBecause here's the truth: the hardest part isn't getting results. It's keeping them, and building on them.\n\nI'll share more on this in the next few days — but for now, take a breath, celebrate what you've done, and know that this is just the beginning.\n\nWarm regards,\n${firstName}`,
      },
      {
        day: 3,
        purpose: "The honest truth about what comes next",
        subject: `The honest thing I need to tell you`,
        body: `Hi [name],\n\nI've worked with a lot of ${audience} over the years. And I've noticed a pattern.\n\nThe ones who complete a challenge — they feel amazing on day 30. Full of momentum, confident, clear.\n\nAnd then... life happens.\n\nWithin 6–8 weeks, about 70% of people are back where they started. Not because they didn't work hard enough. But because they lost the structure, the accountability, and the support that made the challenge work.\n\nI don't want that for you.\n\nThe 30-day challenge was a beginning. What you've built is a foundation. The question is: what are you going to build on it?\n\nI'll share something specific tomorrow — something I think could genuinely be the difference between this being a peak moment and a turning point.\n\nSpeak soon,\n${firstName}`,
      },
      {
        day: 5,
        purpose: "Client story / transformation proof",
        subject: `What happened when [client] kept going`,
        body: `Hi [name],\n\nI want to share a story with you.\n\nOne of my clients — let's call her [Sarah] — came to me in a similar position to where you are now. She'd just completed a challenge, felt great, but knew she needed something more structured to keep the momentum going.\n\nShe decided to continue with more personalised coaching. Within 3 months, she had achieved ${mainGoal} — but more than that, she said she finally felt like it was going to stick.\n\n"I needed someone who actually knew my situation," she told me. "The challenge got me started. The coaching made it permanent."\n\nThat's what I want for you.\n\nIf you're thinking about what's next — I'd love to have a conversation. Just reply to this email with "I'm interested" and I'll share more about how we could work together.\n\nWarm regards,\n${firstName}`,
      },
      {
        day: 8,
        purpose: "The direct offer",
        subject: `Working together — here's what it looks like`,
        body: `Hi [name],\n\nI'll be direct with you today.\n\nI have limited spots available for 1:1 coaching, and I wanted to offer you the chance to work with me before I open it up more widely.\n\nHere's what it involves:\n\n• Personalised coaching designed around your specific situation and goals\n• Weekly check-ins and ongoing accountability\n• Direct access to me when you need guidance or support\n• A clear progression from where you are now to ${mainGoal}\n\nThe investment is ${price}.\n\nThis isn't for everyone — it's for people who are serious about making a lasting change and want the support to do it properly.\n\nIf that's you, the next step is simple: book a free 20-minute call with me and we'll talk through whether it's the right fit.\n\n[BOOKING LINK]\n\nSpots are limited — I only work with a small number of coaching clients at a time.\n\nWarm regards,\n${firstName}`,
      },
      {
        day: 14,
        purpose: "Last chance / warm close",
        subject: `Before I close this offer`,
        body: `Hi [name],\n\nI wanted to send one final message about working together.\n\nI'm closing the remaining spots for 1:1 coaching at the end of this week — I want to give my full attention to the clients I'm already working with, and I can only take on a small number of new people.\n\nIf working together feels like something you want to explore, book a free 20-minute call before [day]. No pressure, no obligation — just a conversation.\n\n[BOOKING LINK]\n\nAnd if it's not the right time — that's completely okay. I just want to say: whatever you decide, the work you did during the ${programmeName} was real. Don't lose it.\n\nI'm rooting for you either way.\n\nWarm regards,\n${firstName}`,
      },
    ],
    smsNudge: `Hey [name] — sent you a couple of emails this week about continuing your progress after the ${programmeName}. Worth a read if you haven't seen them yet! [LINK]`,
  };
}
