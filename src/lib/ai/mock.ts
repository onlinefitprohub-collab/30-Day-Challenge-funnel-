import type { WizardInputs } from "@/types/wizard";
import type { GeneratedFunnelAssets } from "@/types/generation";

/**
 * Mock generation — uses real wizard inputs to produce personalised placeholder output.
 * Shown when OPENAI_API_KEY is not set. Results page displays a banner indicating demo mode.
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

  // Build the challenge label without doubling duration if challengeType already starts with a number
  const challengeLabel = /^\d/.test(challengeType)
    ? `${challengeType} challenge`
    : `${duration}-day ${challengeType} challenge`;
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
      sectionLayoutVariants: {
        "hero":             "hero-two-col-video",
        "social-proof-bar": "social-proof-stars-bullets",
        "whats-included":   "included-three-col-checks",
        "faq":              "faq-single-col",
        "final-cta":        "cta-centered-color-bg",
      },
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
      confirmation: `Hey {name}, you're confirmed for the ${challengeTitle}! Check your email — everything you need is in there. Looking forward to it — ${coachName}`.slice(0, 160),
      reminder: `{name} — the ${challengeTitle} kicks off tomorrow. ${ctaType === "booking" ? "Your call is booked" : "You're all set"}. See you in there — ${coachName}`.slice(0, 160),
      followUp: `Hey {name}, day 1 done — how did it go? Reply and let me know. I read every reply. — ${coachName}`.slice(0, 160),
      noShow: `Hey {name}, missed you at your call. No worries — reply YES and I'll send a new booking link. — ${coachName}`.slice(0, 160),
      reEngagement: `{name} — you signed up a while back and I wanted to check in. Still interested? Just reply and I'll help you get started. — ${coachName}`.slice(0, 160),
    },

    emailSequence: {
      welcome: {
        subject: `You're in — here's what happens next`,
        body: `Hi {first_name},\n\nWelcome to the ${challengeTitle}. I'm ${coachName} and I'll be with you throughout the next ${duration} days.\n\nHere's what to do right now:\n\n${ctaType === "booking" ? "→ Book your kickstart call using the link below — don't skip this\n" : "→ Join the private group using the link below\n"}→ Save the start date to your calendar\n→ Read the welcome email coming right after this one\n\nI built ${businessName} because I know how frustrating ${firstStruggle} is — especially when you've already tried to fix it. This programme is designed around that reality.\n\nI'll be in touch soon.\n\n${coachName}`,
      },
      reminder: {
        subject: `We start tomorrow — quick checklist for you`,
        body: `Hi {first_name},\n\nDay one of the ${challengeTitle} is tomorrow. Here's all you need to do before then:\n\n✓ ${ctaType === "booking" ? "Your kickstart call is confirmed" : "You've joined the group"}\n✓ You've got 20–30 minutes free in tomorrow's schedule\n✓ You know why you signed up\n\nYou signed up to ${outcomeLC}. In ${duration} days, that's where we're heading.\n\nSee you tomorrow.\n\n${coachName}`,
      },
      objectionHandling: {
        subject: `"${firstObjection}" — I hear this a lot`,
        body: `Hi {first_name},\n\nIf that's been on your mind, I'm glad you're still here.\n\n"${firstObjection}" is the most common thing I hear before someone joins — and almost always, it's the people who said that who end up getting the best results. Because they're the ones who actually needed a system, not just motivation.\n\nThe ${challengeTitle} is built to work around real life. Not the version of your life where everything goes perfectly — the actual one.\n\nIf you've got a specific question, just reply to this. I'll get back to you.\n\n${coachName}`,
      },
      lastChance: {
        subject: `Closing soon — last chance to join this round`,
        body: `Hi {first_name},\n\nRegistration for the ${challengeTitle} closes at the end of {closing_date}. After that, the next intake won't open for a while.\n\nIf you've been sitting on it: ${outcomeCap} isn't going to happen by waiting for the right moment. The right moment is usually just a decision.\n\n${isFree ? "It's free to join." : `The investment is ${price}.`} The cost of another month of ${firstStruggle} is higher.\n\n→ ${ctaButton}: [LINK]\n\n${coachName}`,
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
      campaignName: `${businessName.toLowerCase().replace(/\s+/g, "_")}_${challengeType.toLowerCase().replace(/\s+/g, "_")}_${new Date().getFullYear()}`,
      adSetNamingConvention: `[platform]_[audience_type]_[age_range]_[placement] — e.g. fb_cold_interest_3045_feed`,
      adNamingConvention: `[creative_type]_[hook_variant]_[date] — e.g. video_hook1_${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getFullYear()).slice(2)}`,
      utmSource: (platforms.split(",")[0]?.trim().toLowerCase().replace(/\s+/g, "_")) ?? "facebook",
      utmMedium: trafficSources.some((s) => ["facebook", "instagram", "google"].includes(s.toLowerCase()))
        ? "paid_social"
        : "organic",
      utmCampaign: `${challengeType.toLowerCase().replace(/\s+/g, "_")}_${duration}day_${new Date().getFullYear()}`,
      utmContent: `hook1_v1`,
    },

    colourScheme: "navy-orange",

    qualificationSection: {
      shouldApply: [
        `You're ${audienceShort} who is serious about finally ${outcomeLC}`,
        `You're coachable, open-minded, and ready to follow a proven system`,
        `You're committed to showing up — even on the days it's uncomfortable`,
        `You understand that real results require consistent effort over ${duration} days`,
        `You want personalised support, not just another generic programme`,
        `You're ready to stop going it alone and get structured help`,
      ],
      shouldntApply: [
        `You're looking for a quick fix or overnight results without putting in the work`,
        `You're not willing to follow a structured plan or take expert guidance`,
        `You're not ready to invest the time and energy your transformation requires`,
        `You want information only — not real accountability or coaching support`,
        `You've already decided ${firstObjection.toLowerCase()} — and you're not open to working through it`,
      ],
    },

    coachBio: `I created the ${challengeTitle} because I kept seeing the same pattern — ${audienceShort} who were working hard but not getting anywhere, usually because they had no structure and no one in their corner. I've been coaching ${targetAudience} for years, and the one thing that changes everything is a clear daily plan combined with real accountability. In the past few rounds, clients have ${outcomeYou} without overhauling their whole life. That's what this programme is built around.`,

    testimonialCards: testimonials
      ? testimonials
          .split(/\n+/)
          .filter((line) => line.trim().length > 20)
          .slice(0, 3)
          .map((line) => {
            const match = line.match(/^["']?(.+?)["']?\s*[—–-]\s*(.+)$/);
            return match
              ? { quote: match[1].trim(), attribution: match[2].trim() }
              : { quote: line.replace(/^["']|["']$/g, "").trim(), attribution: audienceShort };
          })
      : [],
  };
}
