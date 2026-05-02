import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasClaude } from "@/lib/ai/claude-client";
import { callClaudeGroup } from "@/lib/ai/claude-generate";
import { buildCoachContext } from "@/lib/ai/context";
import { buildLaunchRoadmapPrompt } from "@/lib/ai/prompts/launch-roadmap";
import { launchRoadmapResponseSchema } from "@/lib/ai/validators";
import { wizardInputsSchema } from "@/types/wizard";
import type { LaunchRoadmap } from "@/types/launch-roadmap";
import type { ProjectInputRow, ProjectRow } from "@/types/project";

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json() as { projectId?: string };
    if (!body.projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });

    const { data: projectData } = await supabase
      .from("projects").select("id, user_id, status")
      .eq("id", body.projectId).eq("user_id", user.id).single();
    if (!projectData) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const { data: inputData } = await supabase
      .from("project_inputs").select("inputs")
      .eq("project_id", body.projectId).single();
    const stored = inputData as Pick<ProjectInputRow, "inputs"> | null;
    if (!stored?.inputs) return NextResponse.json({ error: "No saved inputs found." }, { status: 400 });

    const validatedInputs = wizardInputsSchema.parse(stored.inputs);
    const context = buildCoachContext(validatedInputs);

    const { data: outputData } = await supabase
      .from("project_outputs").select("id, outputs")
      .eq("project_id", body.projectId).order("created_at", { ascending: false }).limit(1).single();
    const outputRowId = (outputData as { id?: string } | null)?.id;
    const existingOutputs = (outputData?.outputs as Record<string, unknown>) ?? {};

    let launchRoadmap: LaunchRoadmap;

    if (!hasClaude()) {
      launchRoadmap = buildMockLaunchRoadmap(validatedInputs.challengeName ?? "30-Day Challenge");
    } else {
      const { system, user: userPrompt } = buildLaunchRoadmapPrompt(context);
      const result = await callClaudeGroup<{ launchRoadmap: LaunchRoadmap }>(
        `${system}\n\n${userPrompt}`,
        launchRoadmapResponseSchema,
        "launch-roadmap",
        4000,
        "claude-sonnet-4-6",
      );
      if (result.error || !result.data) {
        console.warn("[generate-launch-roadmap] fallback:", result.error);
        launchRoadmap = buildMockLaunchRoadmap(validatedInputs.challengeName ?? "30-Day Challenge");
      } else {
        launchRoadmap = result.data.launchRoadmap;
      }
    }

    const mergedOutputs = { ...existingOutputs, launchRoadmap };
    if (outputRowId) {
      const { error } = await supabase.from("project_outputs").update({ outputs: mergedOutputs }).eq("id", outputRowId);
      if (error) throw new Error(error.message);
    } else {
      const { data: runData } = await supabase.from("generation_runs").insert({ project_id: body.projectId, status: "complete" }).select().single();
      const { error } = await supabase.from("project_outputs").insert({ project_id: body.projectId, generation_run_id: (runData as { id?: string } | null)?.id, outputs: mergedOutputs });
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ success: true, launchRoadmap });
  } catch (error) {
    console.error("[generate-launch-roadmap] error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Generation failed" }, { status: 500 });
  }
}

function buildMockLaunchRoadmap(programmeName: string): LaunchRoadmap {
  return {
    overview: `This roadmap takes you from zero to a live, converting challenge in 4 weeks. It's built around the FitPro Launch assets you've already generated — each phase tells you exactly which assets to use and in what order. Follow the phases sequentially and don't skip ahead.`,
    totalTimeToLaunch: "4 weeks from today",
    quickStartPriorities: [
      "Open FitPro Launch and copy your landing page headline and subheadline into your page builder",
      "Set up your HighLevel (or other) funnel with the 4 pages: landing, opt-in, thank you, booking",
      "Connect your email and SMS automation to trigger the welcome sequence on sign-up",
      "Set up your payment processor and create a product for the challenge fee",
      "Block 3 time slots per day in your calendar for discovery calls — this is non-negotiable",
    ],
    commonMistakes: [
      "Launching ads before the landing page and payment system are fully live and tested",
      "Sending traffic to a page that hasn't been tested on mobile — over 80% of your audience will view it on their phone",
      "Starting DM outreach without a clear call booking link ready to send",
      "Waiting until the challenge starts to send emails — the pre-challenge sequence is where most drop-off happens",
      "Not posting organically during the paid ads period — social proof from your own content validates your ads",
      "Setting a launch date and not working backwards from it — always plan by deadline, not by 'when I'm ready'",
    ],
    phases: [
      {
        name: "Foundation",
        timing: "Week 1 — 4 weeks before launch",
        goal: "Get all technical pieces live and tested before any promotion starts",
        completionMarker: "You can complete a test sign-up from start to finish and receive the welcome email and SMS",
        tasks: [
          { task: "Build landing page using your FitPro Launch copy (headline, bullets, FAQ, CTA)", category: "setup", fitproAsset: "Landing Page Copy", timeEstimate: "2–3 hours" },
          { task: "Set up opt-in form, thank-you page, and booking page", category: "setup", fitproAsset: "Opt-in Form & Thank You Page", timeEstimate: "1 hour" },
          { task: "Configure email automation — welcome email triggers on sign-up", category: "setup", fitproAsset: "Email Sequence (Welcome)", timeEstimate: "1 hour" },
          { task: "Configure SMS automation — welcome SMS triggers on sign-up", category: "setup", fitproAsset: "SMS Sequence (Confirmation)", timeEstimate: "30 min" },
          { task: "Set up payment processor and create challenge product/price", category: "setup", timeEstimate: "45 min" },
          { task: "Do a full end-to-end test: sign up, receive email, receive SMS, see booking page", category: "setup", timeEstimate: "30 min" },
        ],
      },
      {
        name: "Audience Warm-Up",
        timing: "Weeks 2–3 — 3 weeks before launch",
        goal: "Warm up your existing audience before any paid advertising starts",
        completionMarker: "You've posted 6+ pieces of content, DM'd 60+ warm leads, and have at least 5 discovery calls booked",
        tasks: [
          { task: "Post 3x per week using your content calendar hooks and captions", category: "content", fitproAsset: "Content Calendar", timeEstimate: "1 hour/post" },
          { task: "DM 10 warm leads per day using the Instagram DM Script", category: "sales", fitproAsset: "Instagram DM Script", timeEstimate: "45 min/day" },
          { task: "Post daily stories — behind the scenes, polls, countdown to challenge", category: "content", timeEstimate: "15 min/day" },
          { task: "Share 1 client transformation or testimonial per week", category: "content", timeEstimate: "30 min" },
          { task: "Engage with 20 target audience accounts per day (like, comment, follow)", category: "growth", timeEstimate: "20 min/day" },
        ],
      },
      {
        name: "Pre-Launch Push",
        timing: "Week 4 — 1 week before launch",
        goal: "Build a full pipeline of leads before registration opens",
        completionMarker: "Ads are live, you have 20+ leads in pipeline, and 10+ discovery calls completed or booked",
        tasks: [
          { task: "Launch Facebook and Instagram ads using your FitPro Launch ad copy", category: "ads", fitproAsset: "Ad Copy + Creative Briefs", timeEstimate: "2 hours to set up" },
          { task: "Send a pre-launch email to your existing list announcing the challenge", category: "content", fitproAsset: "Email Sequence", timeEstimate: "30 min" },
          { task: "Increase DM outreach to 20 leads/day (mix of cold and warm)", category: "sales", fitproAsset: "Instagram DM Script", timeEstimate: "1 hour/day" },
          { task: "Run discovery calls for all booked leads using call script", category: "sales", fitproAsset: "Discovery Call Script", timeEstimate: "45 min/call" },
          { task: "Post daily 'behind the scenes' content showing challenge preparation", category: "content", timeEstimate: "15 min/day" },
        ],
      },
      {
        name: "Registration Open",
        timing: "Launch week",
        goal: "Convert pipeline and ad traffic into paid challenge registrations",
        completionMarker: "Registration is open, you're running calls daily, and hitting your target sign-up number",
        tasks: [
          { task: "Send launch email to full list announcing registration is open", category: "content", fitproAsset: "Email Sequence (Launch)", timeEstimate: "30 min" },
          { task: "Post launch announcement across all platforms", category: "content", timeEstimate: "1 hour" },
          { task: "Run 3–5 discovery calls per day using call script", category: "sales", fitproAsset: "Discovery Call Script", timeEstimate: "3–4 hours/day" },
          { task: "Reply to every comment and DM within 1 hour during launch week", category: "sales", timeEstimate: "Ongoing" },
          { task: "Send SMS follow-up to leads who haven't booked a call yet", category: "sales", fitproAsset: "SMS Sequence", timeEstimate: "30 min/day" },
          { task: "Monitor ad performance and adjust budget toward best-performing ads", category: "ads", timeEstimate: "20 min/day" },
        ],
      },
      {
        name: "Challenge Delivery",
        timing: "Challenge weeks 1–4",
        goal: "Deliver an exceptional client experience that generates testimonials and referrals",
        completionMarker: "All participants are active, you have at least 5 testimonials collected, and 3+ referrals in pipeline",
        tasks: [
          { task: "Send daily SMS prompts each morning using delivery pack SMS schedule", category: "delivery", fitproAsset: "Challenge Delivery Pack (Daily SMS)", timeEstimate: "5 min/day" },
          { task: "Send weekly coaching emails using delivery pack weekly templates", category: "delivery", fitproAsset: "Challenge Delivery Pack (Weekly Emails)", timeEstimate: "15 min/week" },
          { task: "Post client wins and progress publicly (with permission) each week", category: "content", timeEstimate: "20 min/week" },
          { task: "Run a weekly group Q&A call or live session for participants", category: "delivery", timeEstimate: "1 hour/week" },
          { task: "Continue DM outreach for next cohort — keep pipeline warm", category: "sales", fitproAsset: "Instagram DM Script", timeEstimate: "30 min/day" },
        ],
      },
      {
        name: "Post-Challenge Growth",
        timing: "Week after challenge ends",
        goal: "Harvest testimonials, convert completers to next tier, and plan the next launch",
        completionMarker: "Upsell sequence sent, 3+ testimonials collected, next launch date set",
        tasks: [
          { task: "Send testimonial harvest email sequence to all completers", category: "growth", fitproAsset: "Testimonial Harvest Sequence", timeEstimate: "30 min to send" },
          { task: "Launch upsell email sequence to all challenge completers", category: "sales", fitproAsset: "Upsell Email Sequence", timeEstimate: "30 min to send" },
          { task: "Book follow-up discovery calls with highest-engagement participants", category: "sales", fitproAsset: "Discovery Call Script", timeEstimate: "1 hour/day" },
          { task: "Post challenge results and transformations to social media", category: "content", timeEstimate: "1 hour" },
          { task: "Set the date for your next challenge cohort and update your funnel", category: "setup", timeEstimate: "30 min" },
          { task: "Review what worked and what didn't — update your FitPro Launch assets for next time", category: "growth", timeEstimate: "1 hour" },
        ],
      },
    ],
  };
}
