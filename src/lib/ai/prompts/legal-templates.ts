/**
 * Legal Templates — Coaching contracts, waivers, and terms
 *
 * Generates four fill-in-the-blank legal documents personalised to the coach:
 * 1. Service Agreement — coaching relationship, scope, payment terms, IP, confidentiality
 * 2. Liability Waiver — fitness/health disclaimer, medical advice disclaimer, assumption of risk
 * 3. Challenge Participation Terms — participant conduct, IP, refund terms, community rules
 * 4. Refund Policy — clear, plain-English refund terms
 *
 * Output is jurisdiction-aware (UK/US/AU/generic based on coach location).
 * Documents use [BRACKETED PLACEHOLDERS] for coach-specific details to personalise.
 * Documents are NOT legal advice — coaches should have a solicitor/attorney review.
 */

export function buildLegalTemplatesPrompt(
  context: string,
): string {
  return `${context}

=== YOUR TASK ===

You are a specialist in fitness coaching legal documentation. Generate four ready-to-use legal document templates for this fitness coach. These should be professional, plain-English, and practical — not unnecessarily dense legalese, but thorough enough to protect the coach.

CRITICAL INSTRUCTIONS:
- Use [BRACKETED PLACEHOLDERS] for any detail the coach needs to personalise (e.g. [YOUR BUSINESS NAME], [YOUR FULL LEGAL NAME], [YOUR LOCATION])
- Pre-fill anything that can be derived from the context above (coach name, business name, programme name, price range)
- Jurisdiction: use the coach's location from context. UK coach → UK-style language (solicitor, GDPR, Consumer Rights Act). US coach → US-style language (attorney, HIPAA disclaimer). AU coach → AU-style. Unknown/international → generic jurisdiction-neutral language
- Each document must be complete and usable — not a skeleton. Include all standard clauses a fitness coaching business needs
- Add a one-line NOTE at the top of each document: "NOTE: This template should be reviewed by a qualified [solicitor/attorney] before use. It is not legal advice."
- Write in plain English that a client can understand, not dense legal jargon. Friendly but firm.

=== DOCUMENT 1: SERVICE AGREEMENT ===

A coaching services agreement between the coach and individual coaching clients (1:1 or group). Must include:
- Parties (coach + client)
- Services description (what the programme includes, format, duration, frequency)
- Investment and payment terms (total fee, payment schedule, what happens if payment is missed)
- Client responsibilities (what the client commits to doing)
- Cancellation and rescheduling policy
- Intellectual property (the coach's materials remain their property)
- Confidentiality (both parties)
- Health and medical disclaimer (client confirms medical clearance if needed)
- Results disclaimer (results depend on client effort — no guarantee)
- Termination clause (how either party can end the agreement)
- Governing law (based on jurisdiction)
- Entire agreement clause

serviceAgreement: write the complete document, approximately 600–900 words, using [PLACEHOLDERS] where needed.

=== DOCUMENT 2: LIABILITY WAIVER ===

A health and fitness liability waiver for challenge participants and coaching clients. Must include:
- Clear identification of who is signing and what they're agreeing to
- Acknowledgement of physical fitness risks
- Medical disclaimer: "I have consulted or will consult my doctor before beginning this programme"
- Assumption of risk statement
- Release and waiver of claims against the coach
- Indemnification clause
- Media release option (optional section the coach can include/remove)
- Acknowledgement that results are not guaranteed
- Electronic signature clause (valid for digital sign-off)
- Date and signature block

liabilityWaiver: write the complete document, approximately 400–600 words. Clear, serious tone — this is a legal protection document.

=== DOCUMENT 3: CHALLENGE PARTICIPATION TERMS ===

Terms of participation for online fitness challenges. Shorter and more accessible in tone than the service agreement. Must include:
- Who can participate (eligibility, age, medical conditions)
- What's included and what isn't
- Community conduct rules (for group challenges with Facebook groups or online communities)
- Intellectual property (challenge content is the coach's; participants may not share/copy)
- Privacy statement (how participant data is used — GDPR/CCPA/AU Privacy Act aware by jurisdiction)
- Photos and testimonials permission (if they get a result, can the coach share it?)
- Refund terms (reference the refund policy document)
- Behaviour policy (zero tolerance for harassment, what happens if someone breaks the rules)
- Acceptance method (by registering, they accept these terms)

participationTerms: write the complete document, approximately 500–700 words. Friendlier tone than the waiver — this is what participants will actually read.

=== DOCUMENT 4: REFUND POLICY ===

A clear, plain-English refund policy. Must include:
- General policy statement (refundable or non-refundable, and why)
- If refundable: specific timeframe (e.g. "within 14 days of purchase, before Week 2 begins")
- If non-refundable: the justification ("digital content is delivered immediately upon purchase")
- How to request a refund (process, who to contact, response time)
- Chargebacks policy (what happens if a client initiates a chargeback without contacting the coach first)
- Change of mind vs. dissatisfied customer distinction
- What happens to access if a refund is granted
- Exception clause (at the coach's discretion)

refundPolicy: write the complete document, approximately 300–450 words. Very plain, clear English — no ambiguity.

=== OUTPUT FORMAT ===

Respond with ONLY valid JSON. No markdown wrapper, no preamble, no explanation outside the JSON.

{
  "legalTemplates": {
    "serviceAgreement": "...",
    "liabilityWaiver": "...",
    "participationTerms": "...",
    "refundPolicy": "...",
    "jurisdiction": "UK" | "US" | "AU" | "generic"
  }
}`;
}
