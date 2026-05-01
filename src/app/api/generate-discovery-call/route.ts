import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasClaude } from "@/lib/ai/claude-client";
import { callClaudeGroup } from "@/lib/ai/claude-generate";
import { buildCoachContext } from "@/lib/ai/context";
import { buildDiscoveryCallPrompt } from "@/lib/ai/prompts/discovery-call";
import { discoveryCallScriptResponseSchema } from "@/lib/ai/validators";
import { wizardInputsSchema } from "@/types/wizard";
import type { DiscoveryCallScript } from "@/types/discovery-call";
import type { ProjectInputRow, ProjectRow } from "@/types/project";

/**
 * POST /api/generate-discovery-call
 *
 * Generates a personalised word-for-word discovery call script on-demand.
 * Merges the result into project_outputs as the "discoveryCallScript" key.
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

    // Load existing outputs for merge
    const { data: outputData } = await supabase
      .from("project_outputs")
      .select("id, outputs")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const outputRowId = (outputData as { id?: string } | null)?.id;
    const existingOutputs = (outputData?.outputs as Record<string, unknown>) ?? {};

    let discoveryCallScript: DiscoveryCallScript;

    if (!hasClaude()) {
      discoveryCallScript = buildMockDiscoveryCallScript(
        validatedInputs.coachName ?? "Coach",
        validatedInputs.challengeName ?? "30-Day Challenge",
        validatedInputs.mainGoal ?? "reach their goals",
        validatedInputs.price ?? "£997",
        validatedInputs.targetAudience ?? "people",
      );
    } else {
      const { system, user: userPrompt } = buildDiscoveryCallPrompt(context);
      const fullPrompt = `${system}\n\n${userPrompt}`;

      const result = await callClaudeGroup<{ discoveryCallScript: DiscoveryCallScript }>(
        fullPrompt,
        discoveryCallScriptResponseSchema,
        "discovery-call",
        4500,
        "claude-sonnet-4-6",
      );

      if (result.error || !result.data) {
        console.warn("[generate-discovery-call] fallback to mock:", result.error);
        discoveryCallScript = buildMockDiscoveryCallScript(
          validatedInputs.coachName ?? "Coach",
          validatedInputs.challengeName ?? "30-Day Challenge",
          validatedInputs.mainGoal ?? "reach their goals",
          validatedInputs.price ?? "£997",
          validatedInputs.targetAudience ?? "people",
        );
      } else {
        discoveryCallScript = result.data.discoveryCallScript;
      }
    }

    const mergedOutputs = { ...existingOutputs, discoveryCallScript };

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

    return NextResponse.json({ success: true, discoveryCallScript });

  } catch (error) {
    console.error("[generate-discovery-call] error:", error);
    const message = error instanceof Error ? error.message : "Discovery call generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── Mock fallback ────────────────────────────────────────────────────────────

function buildMockDiscoveryCallScript(
  coachName: string,
  programmeName: string,
  mainGoal: string,
  price: string,
  audience: string,
): DiscoveryCallScript {
  const firstName = coachName.split(" ")[0];
  return {
    callOverview: `This is a 45–60 minute consultative enrolment call. Your role is to listen more than you speak, understand the prospect's pain deeply, and only present the offer if you genuinely believe you can help. Come in curious, not salesy — the right energy is "Let me understand your situation and see if I can help."`,
    prepChecklist: [
      "Review their application or DM conversation before the call — note the key details they shared",
      "Have your payment link open and ready in another tab",
      "Check their social profile to understand who they are and their current situation",
      "Close all unnecessary browser tabs and notifications — give the call your full attention",
      "Find a quiet, well-lit space — treat this like a professional meeting",
      "Have a notepad and pen ready to take notes during pain discovery",
      "Set your energy — do 2 minutes of breathing or movement beforehand so you come in calm and present",
    ],
    openingRapport: {
      title: "Opening & Rapport",
      duration: "5 minutes",
      script: `"Hey [name]! It's ${firstName} here — how are you doing today?\n\n[Let them respond — really listen.]\n\nGreat! Thanks so much for taking the time to jump on a call. Before we get into it — can you confirm you have about 45 minutes? I want to make sure we have enough time to do this properly.\n\n[Confirm.]\n\nPerfect. Just to get a quick sense of who I'm speaking with — tell me a little about yourself. What does your current situation look like with [relevant area], and how did you first come across what I do?"`,
      coachingNotes: `Match their energy level from the first second — if they're quiet, be calmer; if they're excited, bring a little more energy. The 45-minute confirm is important: if they say "I only have 20 minutes" you can pause and reschedule rather than rushing a poor call. The rapport questions are genuine curiosity — what they share will inform your discovery.`,
    },
    callFrameSetting: {
      title: "Setting the Call Frame",
      duration: "3–5 minutes",
      script: `"Great. So here's how I like to run these calls — it'll make the most of our time together.\n\nFirst, I'm going to ask you a few questions to really understand where you're at right now and what's been going on. Then I'll share a bit about the ${programmeName} and how it works. And at the end, if it sounds like a good fit, I'll share how we can work together.\n\nIf I don't think it's the right thing for you, I'll tell you that honestly — I'm not here to sell you something that isn't right. Sound good?\n\n[Pause for confirmation.]\n\nOne quick thing — just so there are no surprises later — the investment for this programme is in the ${price} range. Is that something that would be in the realm of possibility for you if you felt confident it was the right move?"`,
      coachingNotes: `The frame-setting does three jobs: (1) shows them this isn't a pressure pitch, (2) gets their buy-in to the process, (3) the investment mention removes shock at the close. If they react negatively to the investment range now, address it here — not at the close when they use it as an escape hatch.`,
    },
    painDiscovery: {
      title: "Pain Discovery",
      duration: "10–15 minutes",
      script: `"So tell me — what made you reach out? What's going on for you right now?\n\n[Let them talk. Don't interrupt. Take notes.]\n\nTell me more about that. What does a typical week look like for you in terms of this?\n\n[Probe deeper.]\n\nAnd how long has this been an issue? Have you tried anything to address it before?\n\n[Listen to what hasn't worked.]\n\nWhat's the impact of this beyond just the surface issue — what does it affect in your day-to-day life?\n\n[Listen for the emotional cost.]\n\nIf you think about it honestly — what's it costing you to NOT have this sorted? Not just in terms of results, but your confidence, your energy, how you feel about yourself?\n\n[Let them sit with that.]\n\nAnd what's the biggest thing that's held you back from fixing this so far?"`,
      coachingNotes: `Pain discovery is the most important part of the call. Uncover THREE levels: (1) Surface pain — the symptom they described. (2) Emotional impact — how it makes them feel. (3) Identity cost — what it says about them or what they're missing out on. A simple "tell me more" does 80% of the work. Never offer solutions here — just listen and note everything.`,
    },
    reflectionMirroring: {
      title: "Reflection & Mirroring",
      duration: "3–5 minutes",
      script: `"Okay. Let me just make sure I've heard you correctly, because I want to make sure I fully understand your situation before I share anything.\n\nSo from what you've told me — [summarise their current state in their words]. You've tried [what they tried], and that hasn't worked because [their reason]. And the real impact of this is [emotional cost they described]. Does that sound right?\n\n[Let them confirm or correct.]\n\nAnd if nothing changes over the next 6 months — if you're in exactly the same place — what does that mean for you?"`,
      coachingNotes: `Use their exact phrases, not your paraphrasing. The 6-months question surfaces urgency they feel internally without you having to manufacture it. Whatever they say in response is the most important sentence of the call — note it, and reference it at the close.`,
    },
    futurePacing: {
      title: "Future Pacing",
      duration: "5–10 minutes",
      script: `"Let's flip this. I want you to imagine that you've solved this — completely. It's a few months from now and you've achieved exactly what you came here for.\n\nWhat does that look like? Walk me through it.\n\n[Let them describe it. Prompt if needed: 'What does your day look like? How do you feel about yourself?']\n\nAnd the goal you mentioned — to ${mainGoal} — if you had that, what would change for you? What does that unlock?\n\n[Reflect their answer.]\n\nThat's exactly the kind of transformation I help ${audience} achieve. The people I work with go from where you are right now, to exactly what you just described — in a structured, supported way so it actually sticks."`,
      coachingNotes: `Don't rush through future pacing — this is where they emotionally connect to the possibility of change. The longer they stay in this state, the more motivated they are to invest. End with the bridge sentence tying their vision to your programme — this is the natural transition to the offer without a jarring gear-change into sales mode.`,
    },
    offerPresentation: {
      title: "Offer Presentation",
      duration: "10 minutes",
      script: `"Based on everything you've shared, I genuinely think I can help you. Let me tell you what the ${programmeName} actually is.\n\nThis programme is designed specifically for ${audience} who want to ${mainGoal} — without the frustration and confusion of trying to figure it out alone.\n\nHere's how it works. It's structured in three phases:\n\nPhase 1 — Foundation. We start by establishing the fundamentals — the exact baseline and structure you need for everything else to work. This is where we eliminate the guesswork.\n\nPhase 2 — Momentum. This is where the real progress happens. You're building consistency, seeing early results, and getting the coaching and adjustments you need to keep going.\n\nPhase 3 — Results and Sustainability. This is where the transformation locks in — you don't just get the result, you understand how to keep it.\n\nWhat makes this different from what you've tried before is that you have direct support and accountability throughout — you're not doing this alone.\n\nDoes that sound like what you've been looking for?"`,
      coachingNotes: `Connect every phase back to a pain they mentioned in discovery: "Phase 2 specifically addresses what you said about..." This turns a programme overview into a personalised solution. Watch for energy shifts at "Does that sound like what you've been looking for?" — a yes here is your green light.`,
    },
    priceReveal: {
      title: "Price Reveal",
      duration: "5 minutes",
      script: `"Before I share the investment — think about what you said earlier: if nothing changes in the next 6 months, [reference their exact 6-months answer]. That's the cost of not solving this.\n\nThe investment for the ${programmeName} is ${price}.\n\nWe also have a payment plan option if that makes it more accessible.\n\n[SAY THE PRICE AND STOP TALKING. Hold silence. Let them respond first.]"`,
      coachingNotes: `Say the price clearly, without apology or softening, and then go completely silent. The first person to speak after the price reveal is at a psychological disadvantage — do not fill the silence. If you've done discovery and future pacing properly, the price will feel justified.`,
    },
    closeAndEnroll: {
      title: "Close & Enrol",
      duration: "5–10 minutes",
      script: `[After their response to the price:]\n\n"So where are you at with all of that? What questions do you have?\n\n[Listen and address any concerns — see Objection Scripts.]\n\n[If they're ready:]\n\n'Great. Let's get you started. I'll send you a payment link right now — it takes about 2 minutes. Once that's processed, I'll send you the welcome information and we'll get your start date locked in.\n\n[Send payment link.]\n\nWhile you do that — your start date would be [date]. And your first step after joining will be [specific first action].\n\nWelcome — I'm really excited to work with you on this.'"`,
      coachingNotes: `If they show genuine readiness, lead them through the logistics as if it's happening. Only push forward when you feel genuine alignment. If they hesitate, ask: "What's the main thing holding you back right now?" and treat that as an objection to address, not a no.`,
    },
    objectionScripts: [
      {
        objection: "I need to think about it.",
        response: `"I completely understand — this is an important decision. Can I ask: what specifically do you need to think through? Is it about whether the programme is right for you, the investment, or something else? [Listen.] I ask because most people who say that end up thinking themselves in circles. What would help you feel clear right now?"`,
      },
      {
        objection: "I can't afford it.",
        response: `"I hear you — and I want to be respectful about money. When you say you can't afford it, do you mean the money literally isn't there, or does it feel like a big investment for something you're not 100% sure about? [Listen.] Because what you described earlier — [reference their 6-months answer] — has a very real cost too. The payment plan option is there if it makes it more manageable."`,
      },
      {
        objection: "I need to talk to my partner first.",
        response: `"That makes complete sense. Is this something you'd need their permission for, or more that you'd want them to be supportive? [Listen.] What would help you feel confident presenting this to them? Let me give you everything you need to explain it clearly — and let's book a follow-up where they can join if that helps."`,
      },
      {
        objection: "I've tried things before and they didn't work.",
        response: `"I'm really glad you said that — because that's exactly the pattern this programme is designed to break. What you described trying before — the reason it didn't stick isn't a reflection of you, it's a reflection of the approach. The difference with ${programmeName} is [unique mechanism]. You're finally doing this with the right structure and support."`,
      },
      {
        objection: "I'm not sure it will work for me.",
        response: `"That's a completely fair concern. But here's what I'd say: you just described [their situation] as your reality, and this programme is specifically designed for ${audience} in exactly that situation. The question isn't really whether it will work — it's whether you're ready to commit to it. What would help you feel more confident?"`,
      },
      {
        objection: "Is this the right time?",
        response: `"When would be the right time? I ask genuinely — because people who wait for the perfect time often wait for years and nothing changes. You reached out today for a reason. What was it that made you take that step now, even if it feels uncertain? [Listen.] The timing question is really a question about whether you're committed to changing this."`,
      },
      {
        objection: "Can I get back to you / Can you send me more information?",
        response: `"Of course. Before we hang up — what specifically do you still need to feel confident? I'd rather we resolve that now than leave you without the information you need. [If genuinely not ready:] That's completely fine. Let me send you a follow-up email, and let's book a 15-minute call to answer any final questions. What day works for you?"`,
      },
    ],
    postCallEmail: {
      subject: `Following up on our call — ${programmeName}`,
      body: `Hi [name],\n\nReally enjoyed speaking with you today — thank you for being so open about where you're at.\n\nWhat stayed with me from our call was when you described [reference their most powerful statement from the call]. That clarity is exactly why I believe the ${programmeName} could be a turning point for you.\n\nAs a reminder:\n\n• Programme: ${programmeName} — designed to help ${audience} ${mainGoal}\n• Investment: ${price} (payment plan available)\n• Start date: [date from the call]\n\nIf you're ready to move forward, you can secure your place here:\n[PAYMENT LINK]\n\nIf you have any final questions, just reply to this email or we can jump on a quick 15-minute call — I'm happy to help you make a clear decision either way.\n\nWarm regards,\n${coachName}`,
    },
    callClosingScript: `"No pressure at all — I completely respect that you want to sit with this. Let me send you a follow-up email with everything we covered today so you have it all in one place. And let's book a quick 15-minute follow-up call — what does [day or time] look like for you? [Book it before hanging up.] Perfect. I'll send that email through now. It was great speaking with you — looking forward to our next chat."`,
  };
}
