import type { WizardInputs } from "@/types/wizard";
import type {
  GeneratedFunnelAssets, ApplicationLandingPage,
  ContentCalendar, DeliveryPack, TestimonialHarvestSequence, PricingGuide,
} from "@/types/generation";

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
    biggestStruggle,
    objections,
    trafficSources,
    testimonials,
    mainGoal,
  } = inputs;
  const desiredOutcome = inputs.desiredOutcome ?? mainGoal;

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
          ? `I'm handing ${audienceShort} the exact system my paying clients use — and this round is completely free`
          : `Here's something the health industry doesn't want you to sit with for too long.`,
        `My client messaged me at 7am on day 3. Said she'd been trying for two years. Here's what changed.`,
        `${outcomeCap} in ${duration} days — and none of my clients gave up the things they love to get there.`,
      ],
      primaryTexts: [
        // V1: longer form, context + proof + CTA (120-180 words)
        `Here's something the health industry doesn't want you to sit with for too long.\n\nNinety-five percent of ${audienceShort} who start a new programme put the weight back on within 12 months. Not because they lacked discipline. But because the programme was never designed for the life they're actually living.\n\nI'm ${coachName} from ${businessName}. The ${challengeTitle} is structured around what actually works for ${audienceShort} — ${inclusions.split(",").slice(0, 2).map((s: string) => s.trim()).join(", ")}${firstBonus ? `, plus ${firstBonus}` : ""}.\n\nIn ${duration} days, you get a clear system, daily structure, and direct coaching support — not a PDF and a Facebook group nobody checks.\n\n${isFree ? "And it's completely free to join." : `Investment: ${price}. That's it.`}\n\n→ ${ctaButton}: [LINK]`,
        // V2: social proof / storytelling angle (80-120 words)
        testimonials
          ? `My client ${audienceShort.includes("women") ? "Sarah" : "James"} messaged me on day 14. Said it was the first time in three years something had actually clicked.\n\n"${testimonials.split("\n")[0]?.replace(/^["']|["']$/g, "") ?? "I finally feel like I know what I'm doing."}"\n\nThat's what happens when the structure fits your life instead of fighting it.\n\n${coachName} is opening the ${challengeTitle} again. Limited spots — kept small to stay personal.\n\n→ ${ctaButton}: [LINK]`
          : `My client messaged me at 7am on day 3 of the ${challengeTitle}. Said she'd been trying to ${outcomeLC} for two years. That this was the first time it had felt simple.\n\nThat's not luck. That's what a properly designed programme does.\n\n${coachName} at ${businessName}. ${duration} days. Real structure, real support.\n\n→ ${ctaButton}: [LINK]`,
        // V3: punchy and direct (50-80 words)
        `${outcomeCap} in ${duration} days.\n\nNot a crash plan. Not another PDF. A structured ${duration}-day programme with ${coachName} built specifically for ${audienceShort}.\n\nIncludes ${firstInclusion.toLowerCase()}${firstBonus ? ` + ${firstBonus}` : ""}. ${isFree ? "Free to join." : price + "."}\n\n→ ${ctaButton}: [LINK]`,
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
      campaignName: `${inputs.challengeName ?? resolvedType ?? businessName} | ${new Date().toLocaleString("en-GB", { month: "long", year: "numeric" })}`,
      adSetNamingConvention: `Weight Loss | Female | 30-50 | UK`,
      adNamingConvention: `Talking Head - Hook 1`,
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
    biggestStruggle,
    inclusions,
    mainGoal,
  } = inputs;
  const desiredOutcome = inputs.desiredOutcome ?? mainGoal;

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
    whatYouGetBodyCopy: `Your plan is fully tailored to your body, goals, preferences, and lifestyle — it's everything you need to finally ${outcomeLC} without the guesswork, confusion, or wasted effort. ${coachName} builds this around you, not around a generic template.\n\nEvery week you'll know exactly what to do, when to do it, and why. You'll have the accountability and expert guidance to stay on track even when life gets in the way — because it will. That's when the support structure makes all the difference.\n\nThe ultimate goal isn't just short-term results — it's building the habits and systems that keep you fit, energised, and confident for years to come. This is how you become the person you've always wanted to be.`,
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

    painPointHeading: `Are You ${audienceShort.charAt(0).toUpperCase() + audienceShort.slice(1)} Who's Sick And Tired Of Trying Everything And Still Not ${desiredOutcome}?`,

    clientStories: [
      {
        intro: `Meet James, a ${audienceShort} who had tried everything and was ready to give up.`,
        story: `"I'd been spinning my wheels for two years. I tried every programme out there — nothing seemed to work for someone in my situation.\n\nWhen I joined ${programmeName} everything clicked. Within 8 weeks I had more progress than I'd made in the previous two years combined. ${coachName} built everything around my life, not some generic template.\n\nIf you're on the fence, don't be. This changed everything for me."`,
      },
      {
        intro: `Meet Sarah, a 42-year-old who'd struggled with ${biggestStruggle} for years before finding ${programmeName}.`,
        story: `"I honestly didn't think change was possible at my stage of life. I'd accepted that this was just how things were going to be.\n\nBut ${coachName} showed me exactly what I'd been missing — and the results followed almost immediately. Down 3 dress sizes, more energy than I've had in a decade.\n\nThe support and accountability made the difference. I never felt alone in the process."`,
      },
      {
        intro: `Meet Mark, a busy professional who finally found a system that fit around his life.`,
        story: `"My schedule is insane — I travel constantly and thought there was no way I could commit to anything structured.\n\n${coachName} designed everything around my reality. Not what a programme expects of me, but what I could actually do. And the results were remarkable.\n\nI'm in the best shape of my adult life. Best decision I've made for myself in years."`,
      },
      {
        intro: `Meet Lisa, who went from frustrated and stuck to thriving in just 12 weeks.`,
        story: `"I'd tried every shortcut going. Nothing was working. I was frustrated, embarrassed, and genuinely starting to wonder if I was just one of those people who couldn't change.\n\n${programmeName} showed me I was wrong. Within weeks I started seeing and feeling the difference. By week 12 I barely recognised myself.\n\nIf you're where I was — please just take the leap. You won't regret it."`,
      },
    ],

    problemBreakdown: [
      {
        title: `PROBLEM #1 — THE WRONG APPROACH!`,
        headline: `GENERIC PROGRAMMES AREN'T BUILT FOR ${audienceShort.toUpperCase()} — AND THEY NEVER WILL BE`,
        body: `Most programmes assume you have unlimited time, a perfectly consistent schedule, and a body that responds like a textbook case. That's not you — and it's not most people.\n\nUntil you have a programme built specifically around your situation, you'll keep hitting the same wall. It's not a failure of willpower. It's a failure of fit.`,
      },
      {
        title: `PROBLEM #2 — NO ACCOUNTABILITY!`,
        headline: `GOING IT ALONE IS THE SINGLE BIGGEST REASON PEOPLE QUIT BEFORE THEY SEE RESULTS`,
        body: `Research consistently shows that people with structured accountability are significantly more likely to achieve their goals. Yet most programmes hand you a plan and wish you luck.\n\nAccountability isn't a nice-to-have. For most people, it's the entire difference between finishing and quitting — and between results that stick and results that fade.`,
      },
      {
        title: `PROBLEM #3 — INFORMATION OVERLOAD!`,
        headline: `TOO MUCH CONFLICTING ADVICE KEEPS YOU PARALYSED — NEVER KNOWING WHAT WILL ACTUALLY WORK`,
        body: `Eat this. Don't eat that. Do cardio. Don't do cardio. The amount of conflicting information online is overwhelming — and most of it is generic at best, damaging at worst.\n\nWhen you don't have a clear, personalised plan from someone who knows your situation, you end up trying everything and committing to nothing.`,
      },
      {
        title: `PROBLEM #4 — INCONSISTENCY!`,
        headline: `GREAT WEEKS AND TERRIBLE WEEKS WITH NO SYSTEM TO BRIDGE THE GAP MEANS YOU NEVER BUILD MOMENTUM`,
        body: `Motivation comes in waves. You feel unstoppable for two weeks, then life hits — a bad day, a missed session, a stressful week — and suddenly you've lost all momentum.\n\nReal results don't come from perfect weeks. They come from consistent ones. Without the right structure and support, consistency stays a goal rather than a habit.`,
      },
      {
        title: `PROBLEM #5 — ${biggestStruggle.toUpperCase().slice(0, 40)}!`,
        headline: `THE REAL REASON YOU'RE STILL STUCK IS THAT NOBODY HAS GIVEN YOU A PLAN BUILT FOR YOUR SPECIFIC SITUATION`,
        body: `Everything you've tried has been built for someone else's problem — not yours. The solution isn't to try harder. It's to find the right system.\n\nThat's exactly what ${programmeName} delivers. A proven framework, personalised to you, with the coaching and accountability to make it stick.`,
      },
    ],

    finalCtaText: "Submit Your Application Now",
    finalCtaSubtext: `No payment today. A member of the ${businessName} team will review your application and reach out within 24 hours to discuss whether this programme is the right fit for you.`,
  };
}

// ─── Mock coaching tools ─────────────────────────────────────────────────────

export function buildMockContentCalendar(inputs: WizardInputs): ContentCalendar {
  const { coachName, businessName, mainGoal, targetAudience, challengeName, inclusions, bonuses, desiredOutcome: desiredOutcomeRaw } = inputs;
  const goal = mainGoal ?? "achieve their goals";
  const audience = targetAudience ?? "your ideal clients";
  const desiredOutcome = desiredOutcomeRaw ?? mainGoal ?? goal;
  const firstBonus = bonuses?.split(",")[0]?.trim();
  const firstInclusion = inclusions?.split(",")[0]?.trim() ?? "daily guidance";
  const audienceShort = (targetAudience ?? audience)
    .split(/\s+(who|which|that|with|and)\s+|,/i)[0]
    .trim();
  const outcomeYou = desiredOutcome
    .replace(/\btheir\b/gi, "your")
    .replace(/\bthey\b/gi, "you")
    .replace(/\bthem\b/gi, "you")
    .replace(/\bthemselves\b/gi, "yourself");
  const outcomeCap = outcomeYou.charAt(0).toUpperCase() + outcomeYou.slice(1);
  const outcomeLC = outcomeYou.charAt(0).toLowerCase() + outcomeYou.slice(1);

  const themes = [
    "Pain call-out", "Authority intro", "Quick win tip", "Client result",
    "Myth bust", "Day-in-life", "Value list", "Social proof",
    "Behind the scenes", "Pain agitation", "Belief shift", "Transformation story",
    "Objection handle", "FAQ answer", "Process reveal", "Community moment",
    "Identity statement", "Mindset tip", "Progress check-in", "Success habit",
    "Urgency builder", "Offer reveal", "Testimonial spotlight", "Live Q&A tease",
    "Challenge preview", "Results gallery", "Coach story", "Final call-out",
    "Countdown", "Enrolment CTA",
  ];

  const formats = [
    "Talking head reel", "Text-on-screen reel", "Carousel post", "Talking head reel",
    "Before/after static", "Day-in-the-life reel", "Value list reel", "Carousel post",
    "Behind the scenes reel", "Talking head reel", "Text-on-screen reel", "Carousel post",
    "Talking head reel", "Text-on-screen reel", "Value list reel", "Talking head reel",
    "Carousel post", "Talking head reel", "Text-on-screen reel", "Value list reel",
    "Talking head reel", "Carousel post", "Before/after static", "Talking head reel",
    "Text-on-screen reel", "Carousel post", "Talking head reel", "Text-on-screen reel",
    "Value list reel", "Talking head reel",
  ];

  return {
    strategy: `A 30-day content arc that moves ${audience} from problem-aware to ready-to-join. Weeks 1–2 build authority and trust through education and empathy. Weeks 3–4 layer in social proof, objection handling, and a direct enrolment push for ${challengeName ?? "the challenge"}.`,
    posts: Array.from({ length: 30 }, (_, i) => ({
      day:     i + 1,
      theme:   themes[i],
      format:  formats[i],
      hook:    i < 7
        ? [`The reason you're not seeing results yet has nothing to do with willpower.`, `I used to think consistency was the problem. It wasn't.`, `What nobody tells you about getting started with ${goal}.`, `My client sent me a message at 7am. I wasn't expecting this.`, `Stop blaming yourself. Here's what's actually getting in the way.`, `The one shift that changed everything for women who want to ${goal}.`, `Why most people quit before the results show up — and what to do instead.`][i]
        : i < 14
        ? [`The #1 reason smart people fail to ${goal} — and it's not what you think.`, `I was wrong about this for years. Here's what actually works.`, `If you've tried everything and it still hasn't clicked, read this.`, `The mistake 9 out of 10 women make in week 2.`, `What I wish someone had told me before I started.`, `Three things that kill momentum — and how to protect yours.`, `Your environment is either working for you or against you. Which is it?`][i - 7]
        : i < 21
        ? [`She messaged me to say she nearly quit. Here's what happened next.`, `What my client discovered when she finally stopped starting over.`, `Real talk: the days it feels hard are the days that count most.`, `She lost 14 lbs. But that wasn't what she was most proud of.`, `The moment everything changed — and why it wasn't what she expected.`, `Two weeks left. Here's how to finish strong when you're tired.`, `This is what progress looks like when it's not on the scale.`][i - 14]
        : [`${challengeName ?? "The challenge"} opens soon. Here's everything you need to know.`, `Last time, spots filled in 48 hours. This is your heads up.`, `Still on the fence? Here's the honest answer.`, `What life looks like on the other side — from someone who's been there.`, `Every reason NOT to join — and why none of them held up.`, `One decision. One month. Here's what's possible.`, `Doors close tonight. Don't let this be the decision you regret.`, `This is it. Your sign to stop waiting and start.`, `The next cohort starts soon. Will you be in it?`][Math.min(i - 21, 8)],
      caption: (() => {
        const themeCaption: Record<string, string> = {
          "Pain call-out": `Most ${audienceShort} I speak to aren't struggling because they lack motivation. They're struggling because nobody's ever shown them a system that actually fits their life.\n\nThat changes when you stop trying to follow someone else's plan and start building your own.\n\nDouble tap if that hits home. And drop a comment — what's been the biggest obstacle for you lately?\n\n#fitness #coaching #${challengeName?.replace(/\s+/g, "").toLowerCase() ?? "challenge"}`,
          "Education":    `Here's something worth knowing: ${outcomeCap} isn't about going harder. It's about going consistently.\n\nMost people quit not because it gets too hard — but because it gets boring and they don't have a structure to fall back on.\n\nConsistency beats intensity every time.\n\nSave this if it resonates. 📌`,
          "Transformation story": `One of my clients told me she'd tried everything before joining the ${challengeName ?? "programme"}. Three different apps, two coaches, and more free guides than she could count.\n\nThe difference this time? She had a system that fit around her actual life — not an idealised version of it.\n\nIf you're in that place right now: the issue isn't you. It's the approach.\n\nComment "INFO" and I'll send you the details. 👇`,
          "Behind-the-scenes": `A look behind the scenes at what goes into each week of the ${challengeName ?? "programme"}.\n\nEvery session is designed to build on the last. Nothing random. Nothing filler.\n\nThis is what proper programming looks like — not just a list of exercises, but a system with a purpose.\n\nSave this for later. And drop any questions below! 👇`,
          "Social proof":  `Results from last cohort:\n\n✅ ${outcomeCap} achieved by 80% of participants\n✅ Average energy improvement: "Significant" (their word, not mine)\n✅ Most common comment after week 2: "I can't believe how simple this is"\n\nThese aren't outliers. This is what happens when people follow a system designed for real life.\n\nDM me "NEXT" if you want details on the upcoming round.`,
          "Objection handling": `"I don't have time."\n\nI hear this before almost every cohort. And I get it — ${audienceShort} are busy.\n\nBut here's what I've found: it's not a time problem. It's a priority problem. And that's not a criticism — it's just worth being honest about.\n\nWhen the structure is simple enough, it gets done. That's the whole point of the ${challengeName ?? "programme"}.\n\nSave this if it resonates. 📌`,
          "Call to action":   `Spots for the next round of the ${challengeName ?? "programme"} are open.\n\nIf you've been watching for a while and wondering if this is for you — this is your sign.\n\nHere's what you get: ${inclusions?.split(",").slice(0, 2).map((s: string) => s.trim()).join(", ") ?? firstInclusion}${firstBonus ? ` + ${firstBonus}` : ""}.\n\nLink in bio. DM me if you have questions. Let's go. 🔥`,
          "Value delivery":   `Quick tip for today: ${outcomeCap.toLowerCase()} starts with removing friction, not adding discipline.\n\nThe easier you make your environment to succeed in, the less willpower you need.\n\nConsistency beats intensity every time.\n\nSet up one thing today that makes tomorrow easier. That's it.\n\nWhat's one small thing you could set up tonight? Drop it below 👇`,
          "Engagement":       `Honest question:\n\nWhat's the ONE thing that's held you back from ${outcomeLC}?\n\nNo judgment — I ask because the patterns I hear from ${audienceShort} are remarkably consistent, and understanding them helps me build better programmes.\n\nDrop it in the comments. I read every single one. 👇`,
        };
        const caption = themeCaption[themes[i]] ?? themeCaption["Education"];
        return `${caption}`;
      })(),
      cta:     i >= 21 ? `Link in bio → join ${challengeName ?? "the challenge"} now` : `Drop a 🔥 if this resonates`,
    })),
  };
}

export function buildMockDeliveryPack(inputs: WizardInputs): DeliveryPack {
  const { coachName, businessName, challengeName, mainGoal } = inputs;
  const name = challengeName ?? "the challenge";
  const goal = mainGoal ?? "your goal";

  return {
    welcomeEmail: {
      subject: `You're in! Here's everything you need to know 🎉`,
      body:    `Welcome to ${name}!\n\nI'm ${coachName ?? "your coach"} and I am BEYOND excited to have you here.\n\nHere's what happens next:\n✅ Check your inbox for your welcome pack\n✅ Join the private community group (link below)\n✅ Block out 20–30 minutes each day for the challenge\n\nYour only job for today is to show up. That's it. We'll handle the rest together.\n\nLet's do this,\n${coachName ?? "Your Coach"}\n${businessName ?? ""}`,
    },
    welcomeSms:   `You're officially in! 🎉 Welcome to ${name}. Check your email for everything you need to get started. — ${coachName ?? "Your Coach"}`,
    weeklyEmails: [
      { week: 1, theme: "Foundation & momentum", subject: `Week 1: Let's build your foundation 💪`, body: `Hey!\n\nWelcome to Week 1 of ${name}.\n\nThis week is all about building the foundation. Don't try to be perfect — just be consistent. One day at a time.\n\nThis week's focus: ${goal}. Start small. Build momentum.\n\nQuestion for you: What's the ONE thing you're committed to doing every single day this week?\n\nReply and let me know — I read every message.\n\n${coachName ?? "Your Coach"}` },
      { week: 2, theme: "The messy middle",       subject: `Week 2: It's supposed to feel hard right now`, body: `Hey!\n\nWeek 2 is where most people quit. The initial excitement has worn off and the real work begins.\n\nBut here's the truth: the discomfort you feel right now? That's growth.\n\nHere's your midweek reality check: progress isn't always visible yet. But it IS happening. Trust the process.\n\nAsk yourself: am I showing up even when I don't feel like it? THAT is the transformation.\n\n${coachName ?? "Your Coach"}` },
      { week: 3, theme: "Belief and identity",    subject: `Week 3: You're becoming a different person`, body: `Hey!\n\nWe're 3 weeks in. Take a moment to notice how far you've come.\n\nThis week I want you to shift how you think about yourself. You're not someone trying to ${goal}. You ARE someone who ${goal.replace(/^to /, "")}s.\n\nIdentity drives behaviour. Start owning who you're becoming.\n\nThis week: celebrate every win, no matter how small. You're building evidence that you CAN do this.\n\n${coachName ?? "Your Coach"}` },
      { week: 4, theme: "Final push",              subject: `Week 4: The home stretch — finish strong 🏁`, body: `Hey!\n\nThis is it. The final week of ${name}.\n\nEverything you've built over the last 3 weeks has been leading to this. Don't slow down now.\n\nFinish strong. Not because you have to — but because future-you will thank present-you for not quitting at the final hurdle.\n\nAnd when you cross that finish line? I want to hear ALL about it. Reply to this email with your biggest win.\n\nProud of you,\n${coachName ?? "Your Coach"}` },
    ],
    dailySmsPrompts: Array.from({ length: 30 }, (_, i) => {
      const prompts = [
        `Day 1: Today is day ONE. The hardest step is starting — you just did it. Let's go! 💪`,
        `Day 2: Two days in. How are you feeling? Reply with one word. We're in this together.`,
        `Day 3: 3 days strong. You're already ahead of the person who quit on day 1. Keep going.`,
        `Day 4: Halfway through week 1! Small daily actions = big results. Stay consistent today.`,
        `Day 5: Day 5 check-in! What's your energy like today? Whatever your answer — show up anyway.`,
        `Day 6: Almost at the end of week 1. One more day. You've got this — don't stop now!`,
        `Day 7: ONE WEEK DONE. That's 7 days of showing up. Celebrate that. You earned it. 🎉`,
      ];
      const cycled = prompts[i % 7];
      const dayNum = i + 1;
      if (dayNum === 15) return `Day 15: Halfway through! You're stronger than you were 2 weeks ago. Feel that. Keep going.`;
      if (dayNum === 30) return `Day 30: THIS IS IT. Final day. Go give it everything you've got. So proud of you. 🏆`;
      return cycled.replace(/^Day \d+:/, `Day ${dayNum}:`);
    }),
    completionEmail: {
      subject: `You did it. 30 days. I'm so proud of you 🏆`,
      body:    `I want to take a moment to say something important:\n\nYOU. DID. IT.\n\n30 days of showing up. 30 days of choosing yourself. 30 days of doing the work even when it was hard.\n\nThat's not nothing. That's everything.\n\nI'd love to hear about your journey. Reply to this email and tell me:\n- What was your biggest win?\n- What surprised you most?\n- How do you feel compared to Day 1?\n\nAnd if you're ready to take this further — I want to talk. Reply "READY" and I'll share what's next.\n\nSo proud of you,\n${coachName ?? "Your Coach"}\n${businessName ?? ""}`,
    },
    completionSms: `DAY 30 DONE! 🏆 You should be so proud. Reply "WIN" and tell me your biggest result. — ${coachName ?? "Your Coach"}`,
  };
}

export function buildMockTestimonialHarvest(inputs: WizardInputs): TestimonialHarvestSequence {
  const { coachName, businessName, challengeName } = inputs;
  const name = challengeName ?? "the challenge";
  return {
    day31Email:   { subject: `How did it go? I'd love to hear your results 🎉`, body: `Hey!\n\nCongratulations again on completing ${name}!\n\nI'd love to hear how it went for you. Could you take 2 minutes to share:\n\n1. What results did you achieve? (Any numbers are great — weight, energy, fitness level, mindset)\n2. What was your biggest transformation — physical, mental, or both?\n3. How do you feel now vs. Day 1?\n\nYour story genuinely helps other people decide whether this is right for them — and it means the world to me personally.\n\nJust reply directly to this email. Can't wait to read it.\n\n${coachName ?? "Your Coach"}, ${businessName ?? ""}` },
    day33Sms:     `Hey! Did you catch my email? I'd love to hear your ${name} results — even just a sentence. It means a lot! 🙏`,
    day35Email:   { subject: `Could I share your story? (Quick ask)`, body: `Hey!\n\nI hope you're still feeling the benefits from ${name}.\n\nI have a quick favour to ask: would you be willing to share a short written testimonial and, if you're comfortable, a before/after photo?\n\nYour story could be exactly what someone else needs to hear to take the leap.\n\nAll you need to do is:\n✅ Write 3–5 sentences about your experience and result\n✅ Attach a before/after if you're happy to share\n✅ Hit reply\n\nI'll never share anything without your explicit permission.\n\nThank you so much,\n${coachName ?? "Your Coach"}` },
    day38Sms:     `Last nudge — would love to celebrate your ${name} win publicly! A sentence about your result + a photo if you're up for it. Reply here 📸`,
    referralEmail: { subject: `Know anyone who needs this?`, body: `Hey!\n\nI hope you're doing brilliantly after completing ${name}.\n\nI have one more ask — and this one could genuinely change someone's life.\n\nIs there anyone in your world who could benefit from what you've just been through? A friend, colleague, or family member who's been struggling with the same things you were?\n\nIf so, would you mind sharing my details with them? Even a simple "you should check this out" message could be the nudge they need.\n\n[Link to join/apply: INSERT YOUR LINK]\n\nThank you for trusting me with your journey. It genuinely means everything.\n\n${coachName ?? "Your Coach"}, ${businessName ?? ""}` },
  };
}

export function buildMockPricingGuide(inputs: WizardInputs): PricingGuide {
  const { coachName, challengeName, mainGoal, price, targetAudience } = inputs;
  const priceNum = parseInt((price ?? "").replace(/[^0-9]/g, "")) || 497;
  const currency = (price ?? "£").replace(/[0-9.,\s]/g, "").trim() || "£";

  return {
    recommendedPrice: `${currency}${priceNum}`,
    priceRange: { min: `${currency}${Math.round(priceNum * 0.6)}`, max: `${currency}${Math.round(priceNum * 1.5)}` },
    rationale:  `Based on the transformation you deliver (${mainGoal ?? "significant lifestyle change"}), a price of ${currency}${priceNum} positions you firmly in the mid-premium tier — affordable enough to attract committed clients while signalling genuine quality. ${targetAudience ? `Your audience of ${targetAudience} typically value investment-level coaching over budget options` : "Your audience is investing in outcomes, not just information"}. At this price, even one client covers your monthly outgoings and profit begins at client two.`,
    valueStack: [
      { item: challengeName ?? "30-Day Challenge Programme", perceivedValue: `${currency}${Math.round(priceNum * 0.6)}`, description: "The core structured programme with daily accountability and expert coaching." },
      { item: "1-on-1 onboarding call",                      perceivedValue: `${currency}150`,                           description: "A personalised strategy session to set the right targets from day one." },
      { item: "Custom nutrition or training plan",            perceivedValue: `${currency}200`,                           description: "Professionally designed and tailored specifically to the client's goals and lifestyle." },
      { item: "Private community access",                     perceivedValue: `${currency}97`,                            description: "Peer support, accountability, and community — proven to double completion rates." },
      { item: "Weekly check-in calls or messages",            perceivedValue: `${currency}300`,                           description: "Ongoing expert feedback and plan adjustments throughout the programme." },
      { item: "Lifetime resource library access",             perceivedValue: `${currency}147`,                           description: "Recipes, workouts, mindset tools — accessible long after the programme ends." },
    ],
    positioningStatement:  `The price reflects the value of the outcome, not just the time. When someone successfully achieves ${mainGoal ?? "their goal"} with ${coachName ?? "the coach"}'s support, the return on that investment — in health, confidence, and quality of life — is worth many multiples of ${currency}${priceNum}. This isn't an expense; it's an investment with a guaranteed focus on results.`,
    confidenceScript:      `"I completely understand — it's not a small number. But let me ask you this: how much have you already spent on things that didn't work? Gym memberships, programmes, meal plans that sat unopened? Most of my clients have spent more than this on things that got them nowhere. What I offer is different — you're not buying information, you're buying accountability, expertise, and a system that actually works. And if you don't show up and do the work, I'll be the one chasing you. That's the difference."`,
    objectionHandlers: [
      { objection: `"It's too expensive"`,      response: `"I hear you. The question isn't whether you can afford it — it's whether you can afford NOT to. Every month you don't fix this costs you in energy, confidence, and health. Let's talk about what's really holding you back — is it the money, or is it doubt that it will work?"` },
      { objection: `"I need to think about it"`, response: `"Of course — this is a real commitment and you should feel confident before you say yes. Can I ask what specifically you'd need to know to feel ready? Usually when someone needs to think, there's a specific concern underneath. Let's talk it through."` },
      { objection: `"I'll wait until after [event]"`, response: `"I used to think the right time would come too. It doesn't — it has to be created. The people who get the best results are the ones who start before they feel ready. What would it cost you to wait another 3 months?"` },
    ],
    nextSteps: [
      "Write out your full value stack and practise saying the price out loud until it feels normal",
      "Collect 3 specific client results (numbers, not adjectives) to use in your next sales conversation",
      `Create a simple 'results calculator': show a prospect what ${mainGoal ?? "their goal"} is worth to them over 1 year`,
      "Film a 60-second 'why this price' video to address the objection before it comes up",
      "Raise your price by 10% on the next enrolment — test the market and track conversion rate",
    ],
  };
}

export function buildMockCoachStory(inputs: WizardInputs): NonNullable<GeneratedFunnelAssets["coachStory"]> {
  const firstName = (inputs.coachName ?? "Your Coach").split(" ")[0];
  const audience  = inputs.targetAudience ?? "people like you";
  const goal      = inputs.mainGoal ?? "transform your life";
  const programme = inputs.challengeName ?? inputs.challengeType ?? "this programme";

  // Always generate full long-form copy. If wizard inputs are provided, incorporate them
  // as the opening paragraph then expand — never use verbatim short answers as the full section.
  const beforeOpener = inputs.coachBeforeState ? `${inputs.coachBeforeState}\n\n` : "";
  const part1 = `${beforeOpener}For years, I felt like I was doing everything right — and getting nowhere.\n\nMaking ${goal.toLowerCase()} a priority had been on my list for as long as I could remember. I'd set the goals, made the plans, started more times than I can count. But something always got in the way. Life got busy. I got tired. I'd tell myself I'd start again Monday, and Monday would come and go.\n\nI remember standing in the mirror one morning and feeling completely defeated. Not just frustrated — defeated. Like this was just who I was now. Like maybe I was the kind of person this just wasn't going to work for.\n\nThe low moments started piling up. Turning down invitations because I didn't want to be seen. Avoiding photos. Watching ${audience} around me seem to have it figured out and wondering what they knew that I didn't.\n\nI tried everything. Different plans, different approaches, different promises. Some things worked for a few weeks. Then they stopped. Or I did. And I'd be right back where I started — with one more failure to add to the list and a little less belief that things could actually change.`;

  const turningOpener = inputs.coachTurningPoint ? `${inputs.coachTurningPoint}\n\n` : "";
  const part2 = `${turningOpener}The shift didn't come from a new plan. It came from a completely different question.\n\nInstead of asking "what should I be doing?" I started asking "why isn't what I'm doing working?" That one reframe changed everything. I stopped following programmes built for someone else's life and started building something that actually fit mine — my schedule, my energy levels, my real-world constraints.\n\nThe results came faster than I expected. Not because I was doing more, but because I was finally doing the right things consistently. Within weeks, I saw changes I hadn't seen in years of trying. Within months, I barely recognised the person I was becoming — not just physically, but in how I felt, how I carried myself, how I showed up every single day.\n\nThe confidence that came back wasn't just about how I looked. It was about knowing I could do hard things. That I wasn't broken. That I hadn't been failing all those years because I lacked willpower — I'd just been using the wrong map.\n\nI documented everything. Every win, every adjustment, every moment where something clicked. Because I knew I wasn't the only one who'd been where I was.`;

  const resultOpener = inputs.coachPersonalResult ? `${inputs.coachPersonalResult}\n\n` : "";
  const whyBlock = inputs.coachWhyCoach ? `${inputs.coachWhyCoach}\n\n` : "";
  const part3 = `${resultOpener}${whyBlock}That's why I created ${programme} — and it's the only reason I do this work.\n\nI've now helped hundreds of ${audience} go through the same journey. I've seen the moment it clicks for them. The message that says "I can't believe I nearly didn't sign up." The photo sent three months in that says more than any words could. That's what drives me every single day.\n\nThe people I work with aren't looking for a quick fix. They've already tried those. They're looking for something that actually lasts — a way to ${goal.toLowerCase()} that fits their real life, not the life they're supposed to have.\n\nIf you've read this far and any of it sounds familiar — that's not a coincidence. You found this page for a reason. And I genuinely believe that if I could find a way through, so can you. I'd love to help you do it.`;

  return {
    part1,
    part2,
    part3,
    bridgeHeadline: `Still doing everything right — and still not getting there?`,
  };
}
