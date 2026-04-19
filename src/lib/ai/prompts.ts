import type { WizardInputs } from "@/types/wizard";

export function buildFunnelPrompt(inputs: WizardInputs): string {
  const {
    businessName,
    coachName,
    location,
    deliveryMode,
    targetAudience,
    challengeType,
    mainGoal,
    duration,
    price,
    ctaType,
    inclusions,
    bonuses,
    biggestStruggle,
    objections,
    demographicDetails,
    toneOfVoice,
    phrasesToInclude,
    phrasesToAvoid,
    trafficSources,
    utmNamingPreference,
    testimonials,
    caseStudySnippets,
  } = inputs;

  const toneGuide: Record<string, string> = {
    friendly: "warm, supportive, like a knowledgeable and encouraging friend — approachable but professional",
    bold: "confident, punchy, direct. No waffle. Strong statements. Respect the reader's time",
    motivational: "high-energy, inspiring, action-oriented. Push people to take the leap",
    premium: "elevated, sophisticated. Position the coach as an elite expert. Avoid hype, lean into quality",
    simple: "crystal clear, no jargon, simple language. Digestible for anyone",
  };

  const tone = toneGuide[toneOfVoice] ?? toneGuide.friendly;

  return `You are a world-class direct response copywriter and funnel strategist specialising in fitness coaching businesses.

Your job is to generate a complete, high-converting 30-day challenge funnel for the following coaching business.

IMPORTANT: You must return ONLY a valid JSON object — no markdown, no code blocks, no explanation. Just the raw JSON.

=== BUSINESS CONTEXT ===
Business: ${businessName}
Coach: ${coachName}
Location: ${location}
Delivery: ${deliveryMode}
Target Audience: ${targetAudience}
${demographicDetails ? `Demographic Details: ${demographicDetails}` : ""}

=== THE OFFER ===
Challenge Type: ${challengeType}
Main Goal: ${mainGoal}
Duration: ${duration} days
Price / Offer Type: ${price}
Primary CTA: ${ctaType === "booking" ? "Book a call" : "Direct sign-up"}
What's Included: ${inclusions}
${bonuses ? `Bonuses: ${bonuses}` : ""}

=== AUDIENCE INSIGHTS ===
Biggest Struggle: ${biggestStruggle}
Desired Outcome: ${inputs.desiredOutcome ?? mainGoal}
Common Objections: ${objections}

=== BRAND VOICE ===
Tone: ${tone}
${phrasesToInclude ? `Phrases to include/reference: ${phrasesToInclude}` : ""}
${phrasesToAvoid ? `Phrases/words to AVOID: ${phrasesToAvoid}` : ""}

=== TRAFFIC ===
Traffic Sources: ${trafficSources.join(", ")}
${utmNamingPreference ? `UTM Naming Preference: ${utmNamingPreference}` : ""}

${testimonials ? `=== SOCIAL PROOF ===\nTestimonials: ${testimonials}` : ""}
${caseStudySnippets ? `Case Study: ${caseStudySnippets}` : ""}

=== GENERATION RULES ===
- Write copy that is specific to this coach and audience — NOT generic
- Use the pain points and desired outcomes throughout
- Make CTAs clear, action-oriented, and benefit-led
- Address objections naturally in relevant sections
- Use the tone consistently throughout ALL sections
- Generate multiple options where asked (3 headlines, 3 hooks, etc.)
- Keep SMS under 160 characters each
- Write emails with clear subject lines and scannable body copy
- Ad copy should be platform-appropriate (Facebook/Instagram style)
- Include social proof naturally where provided

Return this EXACT JSON structure (all fields required):

{
  "offerSummary": {
    "challengeConcept": "2-3 sentence description of the challenge concept",
    "targetAudienceSummary": "Who this is for and why they need it",
    "offerPositioning": "How to position this vs other options in the market",
    "corePromise": "The single biggest promise / transformation"
  },
  "landingPage": {
    "headlineOptions": ["Headline 1", "Headline 2", "Headline 3"],
    "subheadline": "Supporting subheadline",
    "bulletPoints": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5", "Benefit 6"],
    "ctaText": "Primary CTA button text",
    "sectionIdeas": ["Section idea 1", "Section idea 2", "Section idea 3", "Section idea 4"],
    "faqItems": [
      {"question": "Q1", "answer": "A1"},
      {"question": "Q2", "answer": "A2"},
      {"question": "Q3", "answer": "A3"},
      {"question": "Q4", "answer": "A4"}
    ],
    "urgencyIdeas": ["Urgency idea 1", "Urgency idea 2", "Urgency idea 3"]
  },
  "optInForm": {
    "recommendedFields": ["Field 1", "Field 2", "Field 3"],
    "formIntroText": "Short intro text above the form",
    "ctaButtonText": "Button text for the opt-in form"
  },
  "thankYouPage": {
    "confirmationMessage": "Confirmation message for after opt-in",
    "nextSteps": ["Step 1", "Step 2", "Step 3"],
    "bookingEncouragement": "Text to encourage booking a call or next action"
  },
  "bookingPage": {
    "shortIntro": "Short paragraph intro for the booking page",
    "whyBook": ["Reason 1", "Reason 2", "Reason 3"],
    "expectationSetting": "What to expect from the call/session"
  },
  "smsSequence": {
    "confirmation": "SMS 1: Confirmation (under 160 chars)",
    "reminder": "SMS 2: Day-before reminder (under 160 chars)",
    "followUp": "SMS 3: Post-call follow up (under 160 chars)",
    "noShow": "SMS 4: No-show re-engagement (under 160 chars)",
    "reEngagement": "SMS 5: Re-engagement for cold leads (under 160 chars)"
  },
  "emailSequence": {
    "welcome": {
      "subject": "Email 1 subject line",
      "body": "Email 1 body (2-3 paragraphs, conversational)"
    },
    "reminder": {
      "subject": "Email 2 subject line",
      "body": "Email 2 body"
    },
    "objectionHandling": {
      "subject": "Email 3 subject line",
      "body": "Email 3 body"
    },
    "lastChance": {
      "subject": "Email 4 subject line",
      "body": "Email 4 body"
    },
    "reEngagement": {
      "subject": "Email 5 subject line",
      "body": "Email 5 body"
    }
  },
  "adCopy": {
    "hooks": ["Hook 1", "Hook 2", "Hook 3"],
    "primaryTexts": ["Primary text 1 (2-3 sentences)", "Primary text 2", "Primary text 3"],
    "headlines": ["Headline 1", "Headline 2", "Headline 3"],
    "descriptions": ["Description 1", "Description 2", "Description 3"]
  },
  "creativePrompts": {
    "staticImageIdeas": ["Idea 1", "Idea 2", "Idea 3"],
    "talkingHeadPrompts": ["Prompt 1", "Prompt 2", "Prompt 3"],
    "beforeAfterConcepts": ["Concept 1", "Concept 2"],
    "ugcStylePrompts": ["UGC prompt 1", "UGC prompt 2"]
  },
  "campaignNaming": {
    "campaignName": "Suggested campaign name",
    "adSetNamingConvention": "Ad set naming convention",
    "adNamingConvention": "Ad naming convention",
    "utmSource": "utm_source value",
    "utmMedium": "utm_medium value",
    "utmCampaign": "utm_campaign value",
    "utmContent": "utm_content value"
  }
}`;
}
