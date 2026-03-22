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
    mainGoal,
    duration,
    price,
    ctaType,
    inclusions,
    bonuses,
    targetAudience,
    desiredOutcome,
    biggestStruggle,
    objections,
    toneOfVoice,
    trafficSources,
    testimonials,
  } = inputs;

  const isFree = price.toLowerCase().includes("free");
  const ctaLabel = ctaType === "booking" ? "book a free call" : "sign up now";
  const ctaButton = ctaType === "booking" ? "Book My Free Call" : "Join the Challenge";
  const challenge = `${duration}-Day ${challengeType} Challenge`;
  const platforms = trafficSources.join(", ");

  return {
    offerSummary: {
      challengeConcept: `The ${challenge} by ${businessName} is a structured ${duration}-day programme run by ${coachName}, designed specifically for ${targetAudience}. It gives participants a clear, step-by-step path to ${desiredOutcome} — without the overwhelm of figuring it out alone.`,
      targetAudienceSummary: `This challenge is for ${targetAudience}. They're tired of ${biggestStruggle} and are ready for a guided approach that actually fits their life.`,
      offerPositioning: `Unlike generic online programmes, this challenge is built around the real struggles of ${targetAudience}. It's specific, supported, and led by ${coachName} — someone who understands their world. The price point (${price}) and ${duration}-day structure make it an easy "yes" with a clear outcome.`,
      corePromise: `In ${duration} days, you'll ${desiredOutcome} — with ${coachName} guiding every step.`,
    },

    landingPage: {
      headlineOptions: [
        `The ${duration}-Day ${challengeType} Challenge That Actually Works For ${targetAudience.split(" ").slice(0, 4).join(" ")}`,
        `Finally — A ${challengeType} Challenge Designed Around Your Life`,
        `${desiredOutcome} in ${duration} Days — Without the Guesswork`,
      ],
      subheadline: `Join ${coachName} and a group of like-minded people for ${duration} days of simple, structured action. No fluff. No confusion. Just results.`,
      bulletPoints: [
        `${inclusions.split(",")[0]?.trim() ?? "Full daily guidance"} — so you always know what to do next`,
        `Beat ${biggestStruggle.split(".")[0].split(",")[0].trim()} for good`,
        `${desiredOutcome}`,
        `Community support so you don't have to do it alone`,
        bonuses ? `BONUS: ${bonuses.split(",")[0]?.trim()}` : `Direct access to ${coachName} throughout the challenge`,
        `Proven system built for ${targetAudience}`,
      ],
      ctaText: ctaButton,
      sectionIdeas: [
        `Hero: Big bold headline + subheadline + CTA button`,
        `The Problem: Call out ${biggestStruggle} — make them feel seen`,
        `What's Inside: List of inclusions with icons or checkmarks`,
        `Meet ${coachName}: Short bio + photo, builds trust`,
        `Results: Testimonials / before-after if available`,
        `FAQ: Address the top 3 objections head-on`,
        `Final CTA: Urgency block + ${ctaButton} button`,
      ],
      faqItems: [
        {
          question: `Is this suitable for complete beginners?`,
          answer: `Yes — this challenge is built for people at all starting points. ${coachName} has designed it to meet you exactly where you are.`,
        },
        {
          question: `How much time does it take each day?`,
          answer: `Most days require 20–40 minutes. It's built to fit around real life, not take it over.`,
        },
        {
          question: objections.split(".")[0].split(",")[0].trim().replace(/^I/, "What if I"),
          answer: `That's exactly why this challenge exists. ${coachName} has helped hundreds of people in your situation get results — the programme is designed specifically around those barriers.`,
        },
        {
          question: `What happens after the ${duration} days?`,
          answer: `You'll have built real habits, seen real results, and have a clear path forward. ${coachName} will share what's available to continue your progress.`,
        },
      ],
      urgencyIdeas: [
        `Spots are limited — only [X] places available in this round`,
        `Challenge starts [DATE] — registration closes 48 hours before`,
        `Early bird bonus: Sign up by [DATE] and get [BONUS] free`,
      ],
    },

    optInForm: {
      recommendedFields: ["First name", "Email address", ...(ctaType === "booking" ? ["Phone number"] : [])],
      formIntroText: `Enter your details below to ${isFree ? "join for free" : "secure your spot"} in the ${challenge}.`,
      ctaButtonText: ctaButton,
    },

    thankYouPage: {
      confirmationMessage: `You're in! Welcome to the ${challenge}, ${"{"}first_name{"}"}. ${coachName} is genuinely excited to work with you over the next ${duration} days.`,
      nextSteps: [
        `Check your inbox — a confirmation email is on its way from ${businessName}`,
        ctaType === "booking"
          ? `Book your kickstart call using the link below — it takes 2 minutes`
          : `Join the private group using the link in your email`,
        `Add the challenge start date to your calendar so you're ready`,
      ],
      bookingEncouragement:
        ctaType === "booking"
          ? `Don't skip this step — your kickstart call with ${coachName} is where you'll map out exactly how the challenge fits into your life. Takes 20 minutes and makes the whole thing stick.`
          : `The private community is where the magic happens. Introduce yourself and say hi — ${coachName} will be in there every day.`,
    },

    bookingPage: {
      shortIntro: `You're one step away from your ${challenge} kickstart call with ${coachName}. This is a short, focused call — no hard sell, just a chance to make sure the challenge is right for you and map out your ${duration} days.`,
      whyBook: [
        `Get ${coachName}'s eyes on your specific situation before the challenge begins`,
        `Leave with a clear plan tailored to your life and schedule`,
        `Get any last questions answered so you start with total confidence`,
      ],
      expectationSetting: `The call is 20 minutes via Zoom. ${coachName} will ask a few questions, walk you through what to expect, and make sure you're set up for success. There's no pressure — if it's not the right fit, that's fine too.`,
    },

    smsSequence: {
      confirmation: `Hey ${"{"}name{"}"}, you're confirmed for the ${challenge}! Check your email for everything you need. Excited to have you 🙌 — ${coachName}`,
      reminder: `Quick reminder ${"{"}name{"}"} — your ${challengeType} challenge starts tomorrow! Log in and check today's prep. See you in there — ${coachName}`,
      followUp: `Hey ${"{"}name{"}"}! Day 1 done — how did it go? Reply and let me know. I read every message. — ${coachName}`,
      noShow: `Hey ${"{"}name{"}"}, missed you at your call! Life happens — no worries. Reply YES and I'll send you a new booking link. — ${coachName}`,
      reEngagement: `${"{"}name{"}"}, just checking in — you joined the ${challenge} a little while back. Still interested? Reply and I'll get you back on track. — ${coachName}`,
    },

    emailSequence: {
      welcome: {
        subject: `You're in — here's everything you need for the ${challenge}`,
        body: `Hi ${"{"}first_name{"}"},\n\nWelcome to the ${challenge}! I'm ${coachName} and I'll be with you every step of the way over the next ${duration} days.\n\nHere's what happens next:\n\n${ctaType === "booking" ? "→ Book your kickstart call (link below) — this is important, don't skip it\n" : "→ Join the private community (link below)\n"}→ Save the challenge start date in your calendar\n→ Read the welcome guide in your inbox\n\nI started ${businessName} because I know how overwhelming ${biggestStruggle} can feel. This challenge is built to fix that — one day at a time.\n\nI'll be in touch before we begin.\n\n${coachName}\n${businessName}`,
      },
      reminder: {
        subject: `${"{"}first_name{"}"} — we start tomorrow. Here's your quick checklist`,
        body: `Hi ${"{"}first_name{"}"},\n\nTomorrow is day one of the ${challenge} and I'm excited for you.\n\nQuick checklist before we begin:\n\n✓ You've joined the community / confirmed your call\n✓ You've cleared 20–40 minutes in tomorrow's schedule\n✓ You know your starting point (take a photo / note a measurement if relevant)\n\nRemember why you signed up. ${desiredOutcome} — that's what we're working toward. In ${duration} days you'll look back and be glad you started.\n\nSee you tomorrow.\n\n${coachName}`,
      },
      objectionHandling: {
        subject: `"I'm not sure I have time for this" — let's talk`,
        body: `Hi ${"{"}first_name{"}"},\n\nIf you're having second thoughts — I get it.\n\n"${objections.split(".")[0].split(",")[0].trim()}" is something I hear all the time from people who go on to get incredible results.\n\nHere's the truth: you don't need perfect conditions. You need a system that works around your life. That's exactly what the ${challenge} is.\n\nMost participants spend 20–30 minutes a day. That's it.\n\nIf you're in, great — I'll see you in there. If you've got questions, just reply to this email. I read them all.\n\n${coachName}`,
      },
      lastChance: {
        subject: `Last chance — ${challenge} closes ${"{"}closing_date{"}"}`,
        body: `Hi ${"{"}first_name{"}"},\n\nJust a heads up — we're closing registration for this round of the ${challenge} at the end of ${"{"}closing_date{"}"}.\n\nAfter that, doors shut until the next intake.\n\nIf you've been on the fence: ${desiredOutcome} doesn't happen by accident. It happens because someone decided today was the day.\n\n${isFree ? "It's free to join." : `The investment is ${price}.`} The cost of staying stuck is much higher.\n\n→ ${ctaButton}: [LINK]\n\nSee you inside.\n${coachName}`,
      },
      reEngagement: {
        subject: `Still thinking about it, ${"{"}first_name{"}"}?`,
        body: `Hi ${"{"}first_name{"}"},\n\nYou signed up to hear about the ${challenge} a little while back but haven't joined yet.\n\nNo pressure — just wanted to check in.\n\nIf life got in the way, I understand completely. But if you're still thinking about ${desiredOutcome}, the door isn't fully closed.\n\nReply to this email and I'll see what I can do.\n\n${coachName}\n${businessName}`,
      },
    },

    adCopy: {
      hooks: [
        `Are you a ${targetAudience.split(" ").slice(0, 4).join(" ")} tired of ${biggestStruggle.split(".")[0].split(",")[0].toLowerCase().trim()}?`,
        `${desiredOutcome.charAt(0).toUpperCase() + desiredOutcome.slice(1)} in ${duration} days — here's how`,
        `I'm running a free ${duration}-day ${challengeType} challenge and I want you in it`,
      ],
      primaryTexts: [
        `If you're struggling with ${biggestStruggle.split(".")[0].split(",")[0].toLowerCase().trim()}, you're not alone — and it's not your fault.\n\nI'm ${coachName} and I've helped ${targetAudience} ${desiredOutcome} without [sacrifice].\n\nMy ${challenge} is starting soon and I'm looking for [X] people to join us.\n\n${isFree ? "It's completely free." : `Investment: ${price}.`} Includes: ${inclusions.split(",").slice(0, 3).join(", ")}.\n\n→ Click below to ${ctaLabel}.`,
        `${duration} days. One goal: ${desiredOutcome}.\n\nNo fluff. No overwhelm. Just a clear plan that fits around your life.\n\nThe ${challenge} with ${coachName} is open now${isFree ? " and it's free" : ""}.\n\nHere's what's included: ${inclusions.split(",").slice(0, 2).join(", ")} and more.\n\n→ Tap to ${ctaLabel}.`,
        testimonials
          ? `"${testimonials.split("\n")[0]?.replace(/^["']/, "").replace(/["']$/, "") ?? testimonials.slice(0, 100)}"\n\nResults like this happen inside the ${challenge}.\n\n${coachName} is opening doors again for a new group. Limited spots.\n\n→ ${ctaLabel.charAt(0).toUpperCase() + ctaLabel.slice(1)} and secure your place.`
          : `What would change if you woke up in ${duration} days having finally cracked ${challengeType}?\n\nThat's exactly what the ${challenge} is designed to do — for ${targetAudience}.\n\nRun by ${coachName} at ${businessName}. Starts soon.\n\n→ ${ctaButton}`,
      ],
      headlines: [
        `Join the ${duration}-Day ${challengeType} Challenge`,
        `${desiredOutcome.charAt(0).toUpperCase() + desiredOutcome.slice(1)} — in ${duration} Days`,
        `Free Challenge with ${coachName}`,
      ],
      descriptions: [
        `For ${targetAudience}. ${duration} days. Real results. ${isFree ? "Free to join." : price + "."}`,
        `${coachName} from ${businessName} — guided ${duration}-day programme. Starts soon.`,
        `Limited spots. Join ${duration}-day challenge and ${desiredOutcome.toLowerCase()}.`,
      ],
    },

    creativePrompts: {
      staticImageIdeas: [
        `Before/after style graphic with text overlay: "${desiredOutcome.charAt(0).toUpperCase() + desiredOutcome.slice(1)} in ${duration} Days" — clean, white background, brand colours`,
        `Photo of ${coachName} in a coaching setting (gym, studio, or outdoors) with text: "Join the ${duration}-Day ${challengeType} Challenge — starts [DATE]"`,
        `Bold typographic ad: large font reading "${duration} Days to ${challengeType}" with a CTA button graphic and the ${businessName} logo`,
      ],
      talkingHeadPrompts: [
        `"Hey — if you're a ${targetAudience.split(" ").slice(0, 5).join(" ")}, I want to talk to you. I'm ${coachName} from ${businessName}, and I'm running a free ${duration}-day challenge that's going to help you [result]. Here's what's included..." [hold up fingers as you list]. End with: "Link in bio to join."`,
        `Open with: "I used to struggle with [relate to ${biggestStruggle}] too — until I figured this out." Walk through the challenge structure. Close with: "This is the thing I wish I'd had when I was starting. And now you can have it — click the link below."`,
        `Testimonial-style: "Let me show you what happened to [client name/type] after just ${Math.floor(duration / 2)} days inside this challenge..." Share result. Then invite viewers to join before the next round closes.`,
      ],
      beforeAfterConcepts: [
        `Before: ${biggestStruggle.split(".")[0].split(",")[0].trim()} / After: ${desiredOutcome}. Use client results or a staged relatable concept. Keep it tasteful and outcome-focused, not body-shaming.`,
        `Before: overwhelmed, starting and stopping, no structure / After: confident, consistent, hitting goals. Lifestyle-focused — show the feeling, not just the physical result.`,
      ],
      ugcStylePrompts: [
        `Film on phone, casual setting. "Okay I have to be honest — I was sceptical about joining this ${duration}-day challenge. But [specific thing that surprised them]. If you're a ${targetAudience.split(" ").slice(0, 4).join(" ")}, this might actually be the thing." End with link.`,
        `Day-in-the-life format: show what a day in the challenge looks like. Keep it short (30–45 seconds). Real, unfiltered, relatable. End with: "Join the next round — link in bio."`,
      ],
    },

    campaignNaming: {
      campaignName: `${businessName.replace(/\s+/g, "_").toLowerCase()}_${challengeType.replace(/\s+/g, "_").toLowerCase()}_challenge`,
      adSetNamingConvention: `[platform]_[audience_type]_[age_range]_[placement] — e.g. fb_lookalike_3040_feed`,
      adNamingConvention: `[creative_type]_[hook_number]_[date] — e.g. video_hook1_jan25`,
      utmSource: platforms.split(",")[0]?.trim().toLowerCase().replace(/\s+/g, "_") ?? "facebook",
      utmMedium: trafficSources.some((s) => ["facebook", "instagram", "google"].includes(s)) ? "paid_social" : "organic",
      utmCampaign: `${challengeType.replace(/\s+/g, "-").toLowerCase()}-challenge-${duration}day`,
      utmContent: `hook1_v1`,
    },
  };
}
