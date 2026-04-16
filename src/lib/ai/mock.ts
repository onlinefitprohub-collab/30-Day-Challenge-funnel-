import type { WizardInputs } from "@/types/wizard";
import type { GeneratedFunnelAssets, ApplicationLandingPage } from "@/types/generation";

/**
 * Mock generation — uses real wizard inputs to produce personalised placeholder output.
 * Shown when ANTHROPIC_API_KEY is not set. Results page displays a banner indicating demo mode.
 */
export function generateMockAssets(inputs: WizardInputs): GeneratedFunnelAssets {
  const {
    businessName,
    coachName,
    challengeType,
    duration,
    price,
    ctaType,
    inclusions,
    bonuses,
    targetAudience,
    desiredOutcome,
    biggestStruggle,
    objections,
    trafficSources,
    testimonials,
  } = inputs;

  const isFree = price.toLowerCase().includes("free");
  const ctaLabel = ctaType === "booking" ? "book a free call" : "sign up now";
  const ctaButton = ctaType === "booking" ? "Book My Free Call" : "Join the Challenge";

  // Build the challenge label — use challengeName if available, else fall back to challengeType
  const resolvedType = challengeType ?? inputs.challengeName ?? "fitness";
  const challengeLabel = /^\d/.test(resolvedType)
    ? `${resolvedType} challenge`
    : `${duration}-day ${resolvedType} challenge`;
  const challengeTitle = challengeLabel.charAt(0).toUpperCase() + challengeLabel.slice(1);

  // Clean helpers
  const firstStruggle = biggestStruggle.split(/[.,]/)[0].trim().toLowerCase();
  const firstInclusion = inclusions.split(",")[0]?.trim() ?? "daily guidance";
  const firstBonus = bonuses?.split(",")[0]?.trim();
  const firstObjection = objections.split(/[.,]/)[0].trim();
  // Convert 3rd-person desired outcome to 2nd-person for ad/copy contexts
  const outcomeYou = desiredOutcome
    .replace(/\btheir\b/gi, "your")
    .replace(/\bthey\b/gi, "you")
    .replace(/\bthem\b/gi, "you")
    .replace(/\bthemselves\b/gi, "yourself");
  const outcomeCap = outcomeYou.charAt(0).toUpperCase() + outcomeYou.slice(1);
  // Lowercase version for mid-sentence use
  const outcomeLC = outcomeYou.charAt(0).toLowerCase() + outcomeYou.slice(1);

  // Build a short audience descriptor — trim at the first relative clause or comma
  // e.g. "Busy men aged 30-45 who have gained weight" → "Busy men aged 30-45"
  const audienceShort = targetAudience
    .split(/\s+(who|which|that|with|and)\s+|,/i)[0]
    .trim();

  const platforms = trafficSources.join(", ");

  return {
    offerSummary: {
      challengeConcept: `${businessName} runs a structured ${duration}-day programme — the ${challengeTitle} — led by ${coachName}. It's built specifically for ${targetAudience}, giving participants a clear daily structure to ${outcomeYou} without the guesswork of doing it alone.`,
      targetAudienceSummary: `This is for ${targetAudience}. They're dealing with ${firstStruggle} and want a straightforward plan that fits around a busy life. Not another programme that requires starting over from scratch — one that meets them where they are.`,
      offerPositioning: `Most people struggling with ${firstStruggle} have already tried doing it on their own. This challenge is different because it comes with a structure, ${coachName}'s direct support, and a group of people in the same situation. At ${price}, it removes the price barrier that stops people from getting proper coaching.`,
      corePromise: `In ${duration} days, you'll ${outcomeYou} — with a daily plan, accountability from ${coachName}, and a group behind you.`,
    },

    landingPage: {
      headlineOptions: [
        `${outcomeCap} in ${duration} Days — a programme built for ${audienceShort}`,
        `Tired of Starting Over? The ${challengeTitle} gives you a plan that actually sticks`,
        `${duration} Days. A Clear Plan. ${coachName} in Your Corner.`,
      ],
      subheadline: `The ${challengeTitle} with ${coachName} gives ${audienceShort} a structured, supported ${duration} days to ${outcomeYou}. No overwhelm. No guesswork. Just consistent progress.`,
      bulletPoints: [
        `${firstInclusion} — so you always know exactly what to do each day`,
        `Weekly check-ins with ${coachName} — you're not doing this alone`,
        `${outcomeCap} — the one result this programme is built around`,
        `Fits around a full schedule — most days take under 30 minutes`,
        firstBonus ? `BONUS: ${firstBonus} — included from day one` : `Private group access — accountability from people going through it with you`,
        `Built for ${audienceShort} specifically — not a generic plan`,
      ],
      ctaText: ctaButton,
      sectionIdeas: [
        `Hero block: Lead with the strongest headline. Sub-headline sets up the offer. Single CTA button — "${ctaButton}". Keep it clean.`,
        `The Problem: Name ${firstStruggle} directly. Short paragraphs. Make them feel seen before you pitch anything.`,
        `What's Included: List each inclusion with a brief "so you can..." reason. Icons help. Keep the layout scannable.`,
        `Meet ${coachName}: One paragraph, one photo. Why they do this, who they've helped. Human, not corporate.`,
        `Results: Use testimonials and before/after if available. Real names, real outcomes. Numbers where possible.`,
        `FAQ: Address "${firstObjection}" and 2–3 other real objections from your audience. Honest, specific answers.`,
        `Final CTA block: Restate the core promise, add urgency (cohort size, start date), single "${ctaButton}" button.`,
      ],
      faqItems: [
        {
          question: `I've tried things like this before and stopped — what makes this different?`,
          answer: `Most programmes fail because there's no structure and no one checking in. This challenge gives you a daily plan and ${coachName} is actively involved throughout — you're not left to figure it out on your own.`,
        },
        {
          question: `How much time does it take each day?`,
          answer: `Most days require 20–30 minutes. The programme is designed around a busy schedule — not an idealised one.`,
        },
        {
          question: `${firstObjection.charAt(0).toUpperCase() + firstObjection.slice(1)} — is this still for me?`,
          answer: `Yes — and you're not alone in feeling that. ${coachName} has worked with plenty of people in exactly that situation. The challenge is built to work around real constraints, not ignore them.`,
        },
        {
          question: `What happens after the ${duration} days?`,
          answer: `You'll have a working routine, visible results, and a clear sense of what works for your body and schedule. ${coachName} will share options for continuing if you want to keep going.`,
        },
      ],
      urgencyIdeas: [
        `Cohort size: limit each intake to [X] people so ${coachName} can give proper attention. State the exact number available.`,
        `Start date: registrations close [DATE]. Build a countdown on the page in the final 48 hours.`,
        `Cost of waiting: staying stuck with ${firstStruggle} for another month costs more than ${price}. Name the real price of inaction.`,
      ],
    },

    optInForm: {
      recommendedFields: [
        "First name",
        "Email address",
        ...(ctaType === "booking" ? ["Phone number (for call booking)"] : []),
      ],
      formIntroText: `Enter your details below to ${isFree ? "join for free" : "secure your spot"} in the ${challengeTitle}. ${coachName} will be in touch within 24 hours.`,
      ctaButtonText: ctaButton,
    },

    thankYouPage: {
      confirmationMessage: `You're in, {first_name}. Welcome to the ${challengeTitle} — ${coachName} is genuinely glad you're here. You've made the right call.`,
      nextSteps: [
        `Check your inbox — a confirmation email from ${businessName} is on its way with everything you need`,
        ctaType === "booking"
          ? `Book your kickstart call using the link below — pick a time that works and it's done in 2 minutes`
          : `Join the private group using the link in your email — introduce yourself when you're in`,
        `Save the challenge start date to your calendar now, while you're thinking about it`,
      ],
      bookingEncouragement:
        ctaType === "booking"
          ? `Don't skip the call. Your kickstart session with ${coachName} is where you'll map out the ${duration} days around your actual schedule — it's 20 minutes that makes the whole programme land differently.`
          : `The private group is where the progress happens. People share daily check-ins, ${coachName} posts regularly, and it's a lot harder to fall off when others are watching. Get in there.`,
    },

    bookingPage: {
      shortIntro: `Good decision. This is a quick call with ${coachName} — 20 minutes, no hard sell. You'll leave with a clear picture of how the ${challengeTitle} fits your life before it starts.`,
      whyBook: [
        `${coachName} will map out the ${duration} days around your actual schedule and situation`,
        `You can ask any questions that are stopping you from committing fully`,
        `You'll start day one with a plan, not just a login`,
      ],
      expectationSetting: `The call is 20 minutes on Zoom. ${coachName} will ask a few questions about where you're at, walk you through the programme structure, and make sure you're set up to get the most out of it. No preparation needed — just show up.`,
    },

    smsSequence: {
      // All under 160 chars
      confirmation:           `Hey {name}, you're confirmed for the ${challengeTitle}! Check your email — everything you need is in there. — ${coachName}`.slice(0, 160),
      challengeReminder:      `{name} — the ${challengeTitle} kicks off tomorrow. ${ctaType === "booking" ? "Your call is booked" : "You're all set"}. See you in there — ${coachName}`.slice(0, 160),
      dayOneKickoff:          `It's Day 1, {name}! Head to the group now — your first session is live. Let's go. — ${coachName}`.slice(0, 160),
      midChallengeMotivation: `{name}, you're halfway through the ${challengeTitle}. That's huge. How's it going? Reply and let me know. — ${coachName}`.slice(0, 160),
      noShow:                 `Hey {name}, missed you at your call. No worries — reply YES and I'll send a new booking link. — ${coachName}`.slice(0, 160),
      challengeComplete:      `{name} — you did it. Day 30 complete! Reply with your biggest win. So proud of you. — ${coachName}`.slice(0, 160),
      reEngagement:           `{name} — you signed up a while back. Still interested? Just reply and I'll help you get started. — ${coachName}`.slice(0, 160),
    },

    emailSequence: {
      welcome: {
        subject: `You're in — here's what happens next`,
        body: `Hi {first_name},\n\nWelcome to the ${challengeTitle}. I'm ${coachName} and I'll be with you throughout the next ${duration} days.\n\nHere's what to do right now:\n\n${ctaType === "booking" ? "→ Book your kickstart call using the link below — don't skip this\n" : "→ Join the private group using the link below\n"}→ Save the start date to your calendar\n→ Read the welcome email coming right after this one\n\nI built ${businessName} because I know how frustrating ${firstStruggle} is — especially when you've already tried to fix it. This programme is designed around that reality.\n\nI'll be in touch soon.\n\n${coachName}`,
      },
      valueDelivery: {
        subject: `One thing to do today (takes 5 minutes)`,
        body: `Hi {first_name},\n\nBefore the challenge starts, here's something you can do right now that'll make Day 1 a lot smoother.\n\nTake 5 minutes and write down the #1 thing you want to feel different about in ${duration} days. Not a goal — a feeling. "I want to feel confident when I..." or "I want to stop feeling like..."\n\nThis one thing becomes your compass for the whole challenge. When it gets hard, it's what brings you back.\n\nKeep it somewhere you'll see it. I'll remind you to check it at the midpoint.\n\n${coachName}`,
      },
      socialProof: {
        subject: `How ${testimonials ? "one of our clients" : "someone just like you"} got ${outcomeLC}`,
        body: `Hi {first_name},\n\nI want to share a quick story with you.\n\nOne of the people who went through the ${challengeTitle} came in with exactly the same concern: ${firstStruggle}. They'd tried other things before and nothing had stuck. They weren't sure this would be any different.\n\nBy Day 30, they told me it was the first time they'd actually followed through on something like this — and that the results weren't just physical. Their confidence had shifted too.\n\nThat's what a structured programme with real accountability can do.\n\nI'm glad you're here.\n\n${coachName}`,
      },
      objectionHandling: {
        subject: `"${firstObjection}" — I hear this a lot`,
        body: `Hi {first_name},\n\nIf that's been on your mind, I'm glad you're still here.\n\n"${firstObjection}" is the most common thing I hear before someone joins — and almost always, it's the people who said that who end up getting the best results. Because they're the ones who actually needed a system, not just motivation.\n\nThe ${challengeTitle} is built to work around real life. Not the version of your life where everything goes perfectly — the actual one.\n\nIf you've got a specific question, just reply to this. I'll get back to you.\n\n${coachName}`,
      },
      lastChance: {
        subject: `Closing soon — last chance to join this round`,
        body: `Hi {first_name},\n\nRegistration for the ${challengeTitle} closes at the end of {closing_date}. After that, the next intake won't open for a while.\n\nIf you've been sitting on it: ${outcomeCap} isn't going to happen by waiting for the right moment. The right moment is usually just a decision.\n\n${isFree ? "It's free to join." : `The investment is ${price}.`} The cost of another month of ${firstStruggle} is higher.\n\n→ ${ctaButton}: [LINK]\n\n${coachName}`,
      },
      dayOneKickoff: {
        subject: `Day 1 is live — here's exactly what to do`,
        body: `Hi {first_name},\n\nToday's the day. The ${challengeTitle} is officially live.\n\nHere's your Day 1 action:\n\n→ ${ctaType === "booking" ? "Join your kickstart call — check your calendar for the link" : "Open the group and complete today's session"}\n\nDon't overthink it. Don't wait until you feel ready. Just do the first step.\n\nI'll check in with you at the halfway mark. Until then — I'm rooting for you.\n\n${coachName}`,
      },
      midChallenge: {
        subject: `Halfway there — this is the hardest part`,
        body: `Hi {first_name},\n\nDay 15. You're halfway through the ${challengeTitle}.\n\nI want to be honest with you: this is usually when it gets harder. The initial excitement has worn off and the finish line still feels far away. That's completely normal — and it's also exactly the moment that separates people who get results from people who don't.\n\nYou've already done ${Math.floor(duration / 2)} days. That's not nothing. That's real.\n\nGo back to what you wrote at the start — that feeling you wanted. Keep that in front of you for the next ${Math.ceil(duration / 2)} days.\n\nI'm here if you need anything.\n\n${coachName}`,
      },
      finalStretch: {
        subject: `2 days left — you're almost there`,
        body: `Hi {first_name},\n\nTwo days left in the ${challengeTitle}.\n\nThink about where you were on Day 1 and where you are now. That gap — however small or large it feels — is real change. You showed up when it was easy and when it wasn't.\n\nFinish strong. The last two days matter as much as the first two.\n\nI'll be in touch on Day 30 with something special for the people who complete it.\n\n${coachName}`,
      },
      challengeComplete: {
        subject: `You did it — here's what's next`,
        body: `Hi {first_name},\n\nDay 30. You finished.\n\nI don't say this lightly: completing a ${duration}-day challenge takes more than most people think. You showed up when you didn't feel like it. That matters.\n\nFor the people who want to keep going — ${ctaType === "booking" ? "I'd love to have a conversation about what's possible next" : "I'm running the next round soon"}. If you're ready to take what you've built and go further, reply to this email and let me know.\n\nEither way — I'm glad you were part of this.\n\n${coachName}`,
      },
      reEngagement: {
        subject: `Still interested, {first_name}?`,
        body: `Hi {first_name},\n\nYou signed up to hear about the ${challengeTitle} a while back — I just wanted to check in.\n\nNo pressure at all. If life got in the way, I understand completely. But if you're still thinking about ${outcomeLC}, I'd love to help.\n\nReply to this email and let me know where you're at. I'll take it from there.\n\n${coachName}`,
      },
    },

    adCopy: {
      hooks: [
        isFree
          ? `I'm running a free ${challengeLabel} for ${audienceShort} — here's what's included`
          : `${challengeTitle} for ${audienceShort} — ${price} and it starts soon`,
        `Still dealing with ${firstStruggle}? Here's what's actually worked for people in the same spot`,
        `${outcomeCap} — in ${duration} days. Here's how ${coachName} is making that happen`,
      ],
      primaryTexts: [
        // V1: context + inclusions + CTA
        `If ${firstStruggle} is something you've been dealing with for a while, you're not alone — and it doesn't mean you're doing it wrong.\n\nI'm ${coachName} from ${businessName}. I run the ${challengeTitle} for ${audienceShort}, and I've seen what happens when people finally have a proper structure around them.\n\nThe programme includes ${inclusions.split(",").slice(0, 3).map((s) => s.trim()).join(", ")}${firstBonus ? `, plus a ${firstBonus}` : ""}.\n\n${isFree ? "It's free to join." : `Investment: ${price}.`}\n\n→ Click below to ${ctaLabel}.`,
        // V2: social proof or storytelling
        testimonials
          ? `"${testimonials.split("\n")[0]?.replace(/^["']|["']$/g, "") ?? testimonials.slice(0, 120)}"\n\nThat's what's possible in ${duration} days.\n\n${coachName} is opening the ${challengeTitle} again for a new group of ${audienceShort}. Spots are limited to keep the programme personal.\n\n→ ${ctaLabel.charAt(0).toUpperCase() + ctaLabel.slice(1)} and get your place.`
          : `${duration} days. One clear goal: ${outcomeYou}.\n\nNo complicated plans. No guesswork. Just a structured programme with ${coachName} in your corner the whole way.\n\nIncludes: ${inclusions.split(",").slice(0, 2).map((s) => s.trim()).join(" and ")}.\n\n→ ${ctaLabel.charAt(0).toUpperCase() + ctaLabel.slice(1)} and get started.`,
        // V3: short and direct
        `${outcomeCap} in ${duration} days.\n\n${coachName} runs this for ${audienceShort} — ${isFree ? "free to join" : price}. Includes ${firstInclusion.toLowerCase()} and more.\n\n→ ${ctaButton}`,
      ],
      headlines: [
        `${challengeTitle} — ${isFree ? "Free" : price}`,
        `${outcomeCap} in ${duration} Days`,
        `${ctaButton} — ${businessName}`,
      ],
      descriptions: [
        `For ${audienceShort}. ${duration} days. Structured. Supported. ${isFree ? "Free to join." : price + "."}`,
        `${coachName} at ${businessName} — ${duration}-day programme with daily structure and check-ins.`,
        `${duration}-day challenge with ${coachName}. Real plan. Real accountability.`,
      ],
    },

    creativePrompts: {
      staticImageIdeas: [
        `Clean graphic on dark or white background. Large text: "${outcomeCap} in ${duration} Days." Smaller text below: "The ${challengeTitle} with ${coachName} — ${isFree ? "Free" : price}." Logo bottom right. No stock photos.`,
        `Photo of ${coachName} in a real coaching setting — gym floor, outdoor session, or working with a client. Text overlay: "${challengeTitle} — ${businessName}." Feels local and personal.`,
        `Text-only ad on brand colour background. Three lines: "Tired of ${firstStruggle}?" / "${duration} days. A real plan." / "${ctaButton}." Simple and fast to produce.`,
      ],
      talkingHeadPrompts: [
        `Film in a gym or outdoors, natural light. Opening line (word for word): "If you're a ${audienceShort.replace(/^busy /i, "").replace(/^(men|women|people)/i, (m) => m)} dealing with ${firstStruggle} — this is for you." Then: explain who you are (1 sentence), what the challenge includes (list 3 things), what someone gets at the end. Close with: "Link below to ${ctaLabel}." Target: 45–60 seconds.`,
        `Address the "${firstObjection}" objection directly. Opening: "I know what you're thinking — ${firstObjection.toLowerCase()}. I hear that before almost every single cohort." Then: reframe it honestly in 2–3 sentences. Close: "If that's you, click the link. Let's talk." Target: 30–45 seconds.`,
        `Short format — 15–20 seconds max. Opening: "Quick one — the ${challengeTitle} is open again." One sentence on who it's for. One sentence on what they get. Close: "${ctaButton} — link below." No filler.`,
      ],
      beforeAfterConcepts: [
        `Before: ${firstStruggle} — no structure, constantly restarting, low energy. After: a consistent routine, ${outcomeLC}, feeling in control. Show through a split graphic or two short video clips. Focus on the feeling, not just the physical change.`,
        `Before: the chaotic morning / evening with no plan. After: the same person with a clear routine and more energy. Lifestyle framing — avoids body-image issues while still showing a real transformation.`,
      ],
      ugcStylePrompts: [
        `Briefing a past client to film on their phone at home. Opening line: "Okay I wasn't sure about this challenge at first, but..." Then: one specific thing that surprised them, one result they can name, why they'd recommend it. Close: "If you're on the fence, just go for it." 30–45 seconds. Unscripted feeling — one take if possible.`,
        `Day-in-the-life format. Film: waking up, doing the daily workout (even just 30 seconds), eating something from the nutrition guide, quick end-of-day comment on how it went. 45–60 seconds total. Real setting, real person. Ends with: "Join the next round — link in bio."`,
      ],
    },

    campaignNaming: {
      campaignName: `${businessName.toLowerCase().replace(/\s+/g, "_")}_${resolvedType.toLowerCase().replace(/\s+/g, "_")}_${new Date().getFullYear()}`,
      adSetNamingConvention: `[platform]_[audience_type]_[age_range]_[placement] — e.g. fb_cold_interest_3045_feed`,
      adNamingConvention: `[creative_type]_[hook_variant]_[date] — e.g. video_hook1_${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getFullYear()).slice(2)}`,
      utmSource: (platforms.split(",")[0]?.trim().toLowerCase().replace(/\s+/g, "_")) ?? "facebook",
      utmMedium: trafficSources.some((s) => ["facebook", "instagram", "google"].includes(s.toLowerCase()))
        ? "paid_social"
        : "organic",
      utmCampaign: `${resolvedType.toLowerCase().replace(/\s+/g, "_")}_${duration}day_${new Date().getFullYear()}`,
      utmContent: `hook1_v1`,
    },
  };
}

/**
 * Mock data for the application funnel's 22-section registration/landing page.
 * Used as fallback when ANTHROPIC_API_KEY is absent or the AI call fails.
 */
export function buildMockApplicationLandingPage(inputs: WizardInputs): ApplicationLandingPage {
  const {
    coachName,
    businessName,
    targetAudience,
    desiredOutcome,
    biggestStruggle,
    inclusions,
  } = inputs;

  const programmeName = inputs.challengeName ?? inputs.challengeType ?? "Transformation Programme";
  const audienceShort = targetAudience.split(/,| and /i)[0].trim();
  const outcomeLC = desiredOutcome.charAt(0).toLowerCase() + desiredOutcome.slice(1);
  const firstInclusion = inclusions.split(",")[0]?.trim() ?? "personalised coaching";

  return {
    valuePropHeadline: `Join ${programmeName} and finally ${outcomeLC}, even if you've tried everything before`,
    valuePropSubheadline: `A structured, results-driven programme designed specifically for ${audienceShort} who are serious about lasting transformation.`,

    videoSectionHeading: `Watch This Before You Apply — ${coachName} Explains Exactly What to Expect`,
    videoSectionSubheading: `This short video will show you whether this programme is the right fit for you.`,

    heroCtaText: "Start Your Application Now",
    heroCtaSubtext: "Free strategy consultation included — no payment required to apply.",

    testimonialIntroHeading: `Here's What Clients Just Like You Are Saying...`,
    testimonialVideoQuote: `"I was sceptical at first — I'd tried so many things. But within the first few weeks I could already see and feel the difference. ${coachName} and the team genuinely care about your results."`,

    credentialItems: [
      { label: "Certified Coach", description: `${coachName} holds professional certifications and has helped hundreds of ${audienceShort} achieve lasting results.` },
      { label: "10+ Years Experience", description: `Over a decade of hands-on coaching experience in ${biggestStruggle} and transformation.` },
      { label: "500+ Clients Transformed", description: `A proven track record of client results across the ${businessName} community.` },
      { label: "Specialist Programme Design", description: `Every element of this programme has been refined through real client feedback and measurable outcomes.` },
    ],

    benefitBlocks: [
      {
        heading: `Stop Guessing — Get a Personalised Plan That Actually Works`,
        body: `You'll receive a fully tailored programme built around your specific goals, schedule, and starting point. No more one-size-fits-all approaches that never stick.`,
      },
      {
        heading: `Weekly Coaching Calls That Keep You on Track`,
        body: `Regular live sessions with ${coachName} mean you always have expert guidance when you need it. Real answers, real accountability, real results.`,
      },
      {
        heading: `${firstInclusion} — Everything You Need in One Place`,
        body: `Every tool, resource, and support structure has been carefully designed to remove the overwhelm and give you a clear path from where you are to where you want to be.`,
      },
      {
        heading: `A Community of Like-Minded People Cheering You On`,
        body: `You'll join a private group of ${audienceShort} on the same journey. Shared wins, shared challenges, and a support network that stays with you beyond the programme.`,
      },
      {
        heading: `Sustainable Results — Not Just a Short-Term Fix`,
        body: `Everything in this programme is designed to create habits and systems that last. You'll leave with the tools to maintain your results for life.`,
      },
    ],

    midCtaHeading: `Ready to Finally ${desiredOutcome}? Applications Are Open — But Spaces Are Limited`,
    midCtaText: "Secure Your Application Spot",

    dividerHeading: "Is This Programme Right For You?",

    faqItems: [
      { question: "How much time do I need to commit each week?", answer: `Most clients invest 3–5 hours per week into the programme, including coaching calls and implementation. ${coachName} has designed the programme to fit around a busy life — not the other way around.` },
      { question: "I've tried other programmes before and they haven't worked — what makes this different?", answer: `The difference is personalisation and ongoing support. Most programmes give you information but no accountability. This programme puts ${coachName} in your corner every step of the way, adapting the plan as you progress.` },
      { question: "What happens after I submit my application?", answer: `A member of the ${businessName} team will review your application and reach out within 24 hours to schedule your complimentary strategy consultation. No payment is required to apply.` },
      { question: "Is this suitable for beginners?", answer: `Absolutely. The programme is designed to meet you exactly where you are. Whether you're just starting out or have some experience, the plan is built around your current level and progresses at a pace that works for you.` },
      { question: "What investment is involved?", answer: `Investment details are discussed during your strategy consultation, where we'll ensure the programme is the right fit before any financial commitment is made. There is no pressure and no obligation to proceed after the call.` },
      { question: "How long is the programme?", answer: `Programme length varies based on your goals and will be discussed during your strategy consultation. Most clients see significant results within 8–12 weeks.` },
    ],

    galleryHeading: "Real Results From Real Clients",

    qualificationSectionHeading: "This Programme Is Designed For a Very Specific Type of Person",

    shouldNotApply: [
      "You're looking for a quick fix or overnight results without putting in the work",
      "You're not willing to follow a structured programme or take expert guidance",
      "You're not ready to invest time and energy into your own transformation",
      "You want information only — not coaching, accountability, or real support",
      "You're not open to changing the habits that have been holding you back",
    ],

    shouldApply: [
      `You're a ${audienceShort} who is serious about finally achieving ${outcomeLC}`,
      "You're coachable, open-minded, and ready to trust a proven system",
      "You're committed to showing up even when it's uncomfortable",
      "You understand that real results require real investment of time and effort",
      "You want personalised support — not just another generic online course",
      "You're ready to stop going it alone and get the expert guidance you deserve",
    ],

    textTestimonials: [
      {
        quote: `"I honestly didn't think it was possible at my age and with my schedule. But ${coachName} made everything so clear and manageable. I'm stronger, healthier, and more confident than I've been in years."`,
        attribution: "Sarah T., 44, Busy Mum of Three",
        result: "Lost 18kg and transformed her energy levels",
      },
      {
        quote: `"The accountability and structure were exactly what I needed. I'd been spinning my wheels for two years. Within weeks of joining I had more clarity and momentum than I'd had in ages."`,
        attribution: "Mark R., 52, Business Owner",
        result: "Down 3 dress sizes and off blood pressure medication",
      },
      {
        quote: `"What I appreciated most was that ${coachName} genuinely listened and adapted everything to my situation. It never felt generic — it felt personal. Best investment I've made in myself."`,
        attribution: "Lisa M., 38, Nurse",
        result: "Ran her first 10k and now coaches her colleagues",
      },
    ],

    whatYouGetHeading: `Everything You Get When You Join ${programmeName}`,
    whatYouGetItems: [
      `Fully personalised ${inputs.duration ?? "12"}-week programme built around your goals and lifestyle`,
      `Weekly 1-on-1 coaching sessions with ${coachName} — expert guidance every step of the way`,
      `${firstInclusion} — professionally designed and tailored to your needs`,
      "Private community access — connect, share wins, and get support between sessions",
      "Progress tracking and ongoing programme adjustments as you evolve",
      "Lifetime access to all programme materials and resources",
      "Direct messaging support for questions between coaching calls",
    ],

    transformationGalleryHeading: "The Proof Is In The Results",

    clientWinsHeading: "More Wins From Our Community",

    clientWins: [
      { name: "Emma R.", result: "Down 22kg and off medication after 16 weeks" },
      { name: "James K.", result: "First 5k run completed — said he'd never run before" },
      { name: "Claire S.", result: "Reversed pre-diabetes diagnosis through lifestyle change" },
      { name: "Tom H.", result: "Lost 15kg and gained confidence he hadn't felt in 10 years" },
      { name: "Ava M.", result: "Went from burnout to thriving in 12 weeks" },
      { name: "Dan P.", result: "Dropped 4 trouser sizes and beat his insomnia" },
    ],

    finalCtaText: "Submit Your Application Now",
    finalCtaSubtext: `No payment today. A member of the ${businessName} team will review your application and reach out within 24 hours to discuss whether this programme is the right fit for you.`,
  };
}
