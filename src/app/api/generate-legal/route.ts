import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasClaude } from "@/lib/ai/claude-client";
import { callClaudeGroup } from "@/lib/ai/claude-generate";
import { buildCoachContext } from "@/lib/ai/context";
import { buildLegalTemplatesPrompt } from "@/lib/ai/prompts/legal-templates";
import { wizardInputsSchema } from "@/types/wizard";
import type { LegalTemplates } from "@/types/generation";
import type { ProjectInputRow, ProjectRow } from "@/types/project";
import { z } from "zod";

const legalTemplatesSchema = z.object({
  legalTemplates: z.object({
    serviceAgreement:   z.string(),
    liabilityWaiver:    z.string(),
    participationTerms: z.string(),
    refundPolicy:       z.string(),
    jurisdiction:       z.enum(["UK", "US", "AU", "generic"]),
  }),
});

/**
 * POST /api/generate-legal
 *
 * Generates four legal document templates on-demand for an existing project.
 * Merges legalTemplates into the existing project_outputs row.
 *
 * Body: { projectId: string }
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rateLimitError = checkRateLimit(user.id, "generate-legal", 1, 60_000);
    if (rateLimitError) return rateLimitError;

    const body = await request.json() as { projectId?: string };
    const { projectId } = body;
    if (!projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });

    // Verify project belongs to this user
    const { data: projectData } = await supabase
      .from("projects")
      .select("id, user_id, status")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

    const project = projectData as Pick<ProjectRow, "id" | "user_id" | "status"> | null;
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Load wizard inputs
    const { data: inputData } = await supabase
      .from("project_inputs")
      .select("inputs")
      .eq("project_id", projectId)
      .maybeSingle();

    const stored = inputData as Pick<ProjectInputRow, "inputs"> | null;
    if (!stored?.inputs) {
      return NextResponse.json(
        { error: "No saved inputs found — please re-run the wizard." },
        { status: 400 },
      );
    }

    const validatedInputs = wizardInputsSchema.parse(stored.inputs);
    const context = buildCoachContext(validatedInputs);
    const prompt = buildLegalTemplatesPrompt(context);

    let legalTemplates: LegalTemplates;
    let isMock = false;

    if (!hasClaude()) {
      legalTemplates = buildMockLegalTemplates(validatedInputs.businessName, validatedInputs.coachName, validatedInputs.challengeName);
      isMock = true;
    } else {
      const result = await callClaudeGroup<{ legalTemplates: LegalTemplates }>(
        prompt,
        legalTemplatesSchema,
        "legal-templates",
        8000,
        "claude-sonnet-4-6",
      );

      if (!result.data) {
        console.error("[generate-legal] Claude call failed:", result.error);
        legalTemplates = buildMockLegalTemplates(validatedInputs.businessName, validatedInputs.coachName, validatedInputs.challengeName);
        isMock = true;
      } else {
        legalTemplates = result.data.legalTemplates;
      }
    }

    // Merge into existing outputs
    const { data: outputData } = await supabase
      .from("project_outputs")
      .select("id, outputs")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const outputRowId = (outputData as { id?: string } | null)?.id;
    const existingOutputs = (outputData?.outputs as Record<string, unknown>) ?? {};
    const mergedOutputs = { ...existingOutputs, legalTemplates };

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
        .maybeSingle();
      const runId = (runData as { id?: string } | null)?.id;
      const { error } = await supabase
        .from("project_outputs")
        .insert({ project_id: projectId, generation_run_id: runId, outputs: mergedOutputs });
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ success: true, legalTemplates, isMock });

  } catch (error) {
    console.error("[generate-legal] error:", error);
    const message = error instanceof Error ? error.message : "Legal template generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildMockLegalTemplates(
  businessName?: string,
  coachName?: string,
  challengeName?: string,
): LegalTemplates {
  const biz = businessName ?? "[YOUR BUSINESS NAME]";
  const coach = coachName ?? "[YOUR FULL LEGAL NAME]";
  const prog = challengeName ?? "[YOUR PROGRAMME NAME]";

  return {
    jurisdiction: "generic",
    serviceAgreement: `NOTE: This template should be reviewed by a qualified solicitor/attorney before use. It is not legal advice.

COACHING SERVICES AGREEMENT

This Coaching Services Agreement ("Agreement") is entered into between ${biz} ("Coach") and the undersigned client ("Client").

1. SERVICES
The Coach agrees to provide the following services: ${prog}, including [DESCRIBE WHAT'S INCLUDED — e.g. weekly group calls, private messaging, workout plans, nutrition guidance, and access to the online community portal].

Duration: [NUMBER] weeks/months, commencing [START DATE].

2. INVESTMENT AND PAYMENT
The total investment for these services is [TOTAL PRICE]. Payment is due [upfront / in instalments of [AMOUNT] per [week/month]].

If payment is missed, access to programme materials may be suspended until payment is received. Repeated non-payment may result in termination of this Agreement.

3. CLIENT RESPONSIBILITIES
The Client agrees to: attend scheduled sessions, complete assigned tasks between sessions, communicate openly and honestly, and take full responsibility for their own actions and decisions throughout the programme.

4. CANCELLATION AND RESCHEDULING
Sessions cancelled with less than [24/48] hours' notice will be forfeited unless exceptional circumstances apply. [NUMBER] reschedules are permitted per programme.

5. INTELLECTUAL PROPERTY
All programme materials, resources, frameworks, and content provided by the Coach remain the intellectual property of ${biz}. Clients may not reproduce, share, or resell any materials without written permission.

6. CONFIDENTIALITY
Both parties agree to maintain confidentiality regarding any sensitive information shared during coaching sessions.

7. HEALTH AND MEDICAL DISCLAIMER
The Client confirms they have consulted, or will consult, a qualified medical professional before beginning this programme. The Coach is not a medical professional and does not provide medical advice.

8. RESULTS DISCLAIMER
Results depend on individual effort, consistency, and circumstances. The Coach cannot and does not guarantee specific outcomes.

9. TERMINATION
Either party may terminate this Agreement with [14] days' written notice. Fees for services already delivered are non-refundable.

10. GOVERNING LAW
This Agreement shall be governed by the laws of [YOUR COUNTRY/STATE].

By signing below (or checking the digital acceptance box), both parties agree to the terms of this Agreement.

Coach: ${coach} / ${biz}
Client: _______________________ Date: _______________________`,

    liabilityWaiver: `NOTE: This template should be reviewed by a qualified solicitor/attorney before use. It is not legal advice.

HEALTH, FITNESS & LIABILITY WAIVER

Programme: ${prog}
Provider: ${biz} (the "Coach")

I, the undersigned ("Participant"), acknowledge and agree to the following:

1. VOLUNTARY PARTICIPATION
I am voluntarily choosing to participate in ${prog} and any related physical activities.

2. MEDICAL CLEARANCE
I confirm that I have consulted, or will consult, my doctor or a qualified medical professional before beginning this programme. I am aware of my current physical condition and any health risks that participation may pose.

3. ASSUMPTION OF RISK
I understand that physical exercise carries inherent risks including, but not limited to, muscle soreness, injury, and in rare cases, more serious health events. I voluntarily assume all such risks.

4. RELEASE OF LIABILITY
I release ${biz}, ${coach}, their employees, and associates from any and all claims, damages, losses, or expenses arising from my participation in ${prog}, to the fullest extent permitted by law.

5. INDEMNIFICATION
I agree to indemnify and hold harmless ${biz} and ${coach} from any claims brought by third parties arising from my participation.

6. RESULTS DISCLAIMER
I understand that fitness results vary by individual and are not guaranteed. The Coach does not guarantee specific physical outcomes.

7. MEDIA RELEASE (Optional — remove if not required)
I grant ${biz} permission to use photographs, videos, or testimonials of my participation and results for marketing purposes, unless I indicate otherwise in writing.

8. ACKNOWLEDGEMENT
I have read and understood this waiver and sign it voluntarily.

Participant Name: _______________________
Signature: _______________________
Date: _______________________`,

    participationTerms: `NOTE: This template should be reviewed by a qualified solicitor/attorney before use. It is not legal advice.

CHALLENGE PARTICIPATION TERMS & CONDITIONS

Welcome to ${prog}! By registering for this programme, you agree to the following terms.

ELIGIBILITY
Participants must be 18 years of age or older. Participants with pre-existing medical conditions should consult a doctor before joining.

WHAT'S INCLUDED
${prog} includes: [LIST KEY INCLUSIONS — e.g. access to the challenge portal, daily workout videos, nutrition guidance, and the private Facebook community for the duration of the challenge].

COMMUNITY CONDUCT
We're committed to a supportive, inclusive community. The following are not tolerated: harassment, bullying, spam, unsolicited promotion, or sharing of offensive content. Violations may result in removal from the programme without refund.

INTELLECTUAL PROPERTY
All challenge content — including videos, PDFs, meal plans, and frameworks — is the intellectual property of ${biz}. You may not copy, share, or resell any materials.

PRIVACY
Your personal information is collected and used in accordance with our Privacy Policy [LINK TO PRIVACY POLICY]. We will not share your data with third parties without your consent, except as required by law.

PHOTOS AND TESTIMONIALS
We love sharing your wins! By participating, you grant ${biz} permission to share your before/after photos and written testimonials for marketing purposes. You may opt out by emailing [YOUR EMAIL ADDRESS].

REFUNDS
Please refer to our Refund Policy [LINK / see below]. Refund requests must be submitted via email to [YOUR EMAIL ADDRESS].

ACCEPTANCE
By completing your registration, you confirm that you have read, understood, and agreed to these Terms and Conditions.

Questions? Contact us at [YOUR EMAIL ADDRESS].`,

    refundPolicy: `NOTE: This template should be reviewed by a qualified solicitor/attorney before use. It is not legal advice.

REFUND POLICY

Last updated: [DATE]

${biz} is committed to delivering exceptional value through ${prog}. Here's our clear, no-jargon refund policy.

OUR POLICY
[CHOOSE ONE AND DELETE THE OTHER:]

Option A (Money-Back Guarantee):
We offer a [14/30]-day money-back guarantee. If you're not satisfied within [14/30] days of your purchase date and have not yet accessed [describe what triggers non-refund — e.g. Week 2 content], you may request a full refund.

Option B (No Refunds):
Due to the nature of digital products — which are delivered immediately upon purchase and include instant access to all content — we do not offer refunds. We encourage you to read the full programme description and FAQs before purchasing.

HOW TO REQUEST A REFUND (if applicable)
Email [YOUR EMAIL ADDRESS] with the subject line "Refund Request — [Programme Name]." Include your full name and the email address used at purchase. We'll respond within [3–5] business days.

CHARGEBACKS
If you initiate a chargeback with your bank or payment provider without first contacting us, we reserve the right to dispute the chargeback and provide evidence of service delivery. We always prefer to resolve any dissatisfaction directly.

EXCEPTIONAL CIRCUMSTANCES
At our discretion, we may consider refunds outside of the above policy in cases of significant extenuating circumstances (e.g. serious illness). Please contact us directly to discuss.

Questions? Contact us at [YOUR EMAIL ADDRESS].`,
  };
}
