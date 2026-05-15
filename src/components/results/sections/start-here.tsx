"use client";

import { CheckCircle2, Circle, ChevronRight, Rocket, TrendingUp, Wrench } from "lucide-react";

interface Step {
  number: number;
  label: string;
  description: string;
  tabId: string;
  time: string;
}

interface Phase {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  colour: {
    border: string;
    bg: string;
    icon: string;
    badge: string;
    step: string;
    stepText: string;
    line: string;
  };
  steps: Step[];
}

const CHALLENGE_PHASES: Phase[] = [
  {
    id: "build",
    icon: Rocket,
    title: "Week 1 — Build Your Funnel",
    subtitle: "Get your pages live and connected to HighLevel",
    colour: {
      border: "border-orange-200",
      bg: "bg-orange-50",
      icon: "bg-orange-500 text-white",
      badge: "bg-orange-100 text-orange-700",
      step: "bg-orange-500",
      stepText: "text-white",
      line: "bg-orange-200",
    },
    steps: [
      { number: 1, label: "Review your offer",          description: "Check the AI-generated challenge concept, positioning, and core promise. Edit anything that doesn't sound like you.",           tabId: "offerSummary",   time: "10 min" },
      { number: 2, label: "Preview your funnel pages",  description: "See how your landing page, opt-in, thank-you, and booking pages look across all layout variants. Pick the one you want.",        tabId: "funnelPreview",  time: "5 min" },
      { number: 3, label: "Push pages to HighLevel",    description: "Use the one-click publish or Chrome Extension to inject all pages directly into your GHL funnel as native editable elements.",   tabId: "highlevel",      time: "15 min" },
    ],
  },
  {
    id: "ads",
    icon: TrendingUp,
    title: "Week 2 — Set Up Your Ads",
    subtitle: "Launch your Facebook and Instagram campaign",
    colour: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      icon: "bg-blue-500 text-white",
      badge: "bg-blue-100 text-blue-700",
      step: "bg-blue-500",
      stepText: "text-white",
      line: "bg-blue-200",
    },
    steps: [
      { number: 4, label: "Load your ad copy",          description: "Your hooks, primary text, headlines, and descriptions are ready. Copy each into Facebook Ads Manager as you build your campaign.", tabId: "adCopy",         time: "20 min" },
      { number: 5, label: "Plan your creatives",        description: "Use the creative direction prompts to brief a designer or shoot your own content. Static images, talking head reels, UGC-style ideas.", tabId: "creativePrompts", time: "15 min" },
      { number: 6, label: "Name your campaign",         description: "Copy the campaign name, ad set convention, ad naming convention, and UTM parameters directly into Ads Manager.",                   tabId: "campaignNaming", time: "10 min" },
    ],
  },
  {
    id: "delivery",
    icon: Wrench,
    title: "Week 3 — Prepare Delivery",
    subtitle: "Set up everything clients receive before and during the challenge",
    colour: {
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      icon: "bg-emerald-500 text-white",
      badge: "bg-emerald-100 text-emerald-700",
      step: "bg-emerald-500",
      stepText: "text-white",
      line: "bg-emerald-200",
    },
    steps: [
      { number: 7,  label: "Load your email sequence",  description: "10 emails covering pre-challenge, during, and post-challenge. Paste subjects and bodies into GHL or your email platform.",         tabId: "emailSequence",  time: "30 min" },
      { number: 8,  label: "Set up SMS messages",       description: "7 SMS messages for confirmation, kick-off, motivation, and completion. Load these into GHL automations.",                          tabId: "smsSequence",    time: "15 min" },
      { number: 9,  label: "Prepare your delivery pack",description: "Welcome email, 4 weekly check-in emails, 30 daily SMS prompts, and a completion email. These run automatically throughout the challenge.", tabId: "deliveryPack", time: "20 min" },
      { number: 10, label: "Generate your workout plan",description: "Create a personalised 4-week progressive programme tailored to your audience. Copy or export it as client-ready content.",          tabId: "workoutPlan",    time: "5 min" },
    ],
  },
];

const APPLICATION_PHASES: Phase[] = [
  {
    id: "build",
    icon: Rocket,
    title: "Week 1 — Build Your Funnel",
    subtitle: "Get your registration page and application form live in HighLevel",
    colour: {
      border: "border-violet-200",
      bg: "bg-violet-50",
      icon: "bg-violet-500 text-white",
      badge: "bg-violet-100 text-violet-700",
      step: "bg-violet-500",
      stepText: "text-white",
      line: "bg-violet-200",
    },
    steps: [
      { number: 1, label: "Review your offer summary",   description: "Check the programme concept, positioning, and core promise. Make sure it reflects your actual offer before touching anything else.",    tabId: "offerSummary",  time: "10 min" },
      { number: 2, label: "Review registration page copy",description: "All 13 sections of your application landing page — hero, benefits, qualifiers, testimonials, FAQ, CTAs. Edit anything that isn't right.", tabId: "appLanding",    time: "20 min" },
      { number: 3, label: "Preview your funnel pages",   description: "See how your registration page and application form look. Check the layout variant and make sure the design matches your brand.",           tabId: "funnelPreview", time: "5 min" },
      { number: 4, label: "Push to HighLevel",           description: "One-click publish or Chrome Extension. Injects your registration page and application form as native GHL elements.",                        tabId: "highlevel",     time: "15 min" },
    ],
  },
  {
    id: "ads",
    icon: TrendingUp,
    title: "Week 2 — Set Up Your Ads",
    subtitle: "Drive application traffic with targeted Facebook and Instagram campaigns",
    colour: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      icon: "bg-blue-500 text-white",
      badge: "bg-blue-100 text-blue-700",
      step: "bg-blue-500",
      stepText: "text-white",
      line: "bg-blue-200",
    },
    steps: [
      { number: 5, label: "Load your ad copy",          description: "Hooks and primary text written specifically for driving application-funnel traffic. High-intent language targeting qualified leads.",        tabId: "adCopy",         time: "20 min" },
      { number: 6, label: "Plan your creatives",        description: "Creative briefs tailored to the application audience — authority-driven statics, transformation stories, VSL teasers.",                     tabId: "creativePrompts", time: "15 min" },
      { number: 7, label: "Name your campaign",         description: "Campaign structure, ad set naming, and UTMs built for a high-ticket application funnel — correct from day one.",                            tabId: "campaignNaming", time: "10 min" },
    ],
  },
  {
    id: "delivery",
    icon: Wrench,
    title: "Week 3 — Prepare for Applications",
    subtitle: "Set up the systems that convert applicants into paying clients",
    colour: {
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      icon: "bg-emerald-500 text-white",
      badge: "bg-emerald-100 text-emerald-700",
      step: "bg-emerald-500",
      stepText: "text-white",
      line: "bg-emerald-200",
    },
    steps: [
      { number: 8,  label: "Load your email sequence",    description: "Nurture emails that move applicants from curious to booked. Load subjects and bodies into your GHL pipeline automations.",               tabId: "emailSequence",  time: "25 min" },
      { number: 9,  label: "Set up SMS follow-ups",       description: "Application confirmation, booking nudges, and re-engagement messages. Short, human, timed correctly.",                                    tabId: "smsSequence",    time: "15 min" },
      { number: 10, label: "Prepare your VSL script",     description: "Your 11-section video sales letter script is ready to record. This goes on the registration page and dramatically lifts conversions.",     tabId: "vslScript",      time: "10 min" },
      { number: 11, label: "Practise your discovery call",description: "Word-for-word script for booking calls — opening, pain discovery, future pacing, offer, objection handling, and close.",                  tabId: "discoveryCall",  time: "20 min" },
    ],
  },
];

const SCALE_STEPS: { label: string; description: string; tabId: string; phase: string }[] = [
  { label: "52-week nurture sequence",   description: "One email per week, forever. Keep cold leads warm until they're ready.",          tabId: "nurtureSequence",     phase: "After first 3 months" },
  { label: "DM outreach scripts",        description: "4 conversation templates for cold DMs, warm leads, comment replies, follow-ups.", tabId: "dmScript",            phase: "From week 1" },
  { label: "Content Engine",             description: "30-day organic social strategy — hooks, captions, CTAs for every post.",          tabId: "contentCalendar",     phase: "From week 1" },
  { label: "Testimonial harvest",        description: "Automated post-challenge sequence to collect social proof you can actually use.",  tabId: "testimonialHarvest",  phase: "After first challenge" },
  { label: "Upsell sequence",            description: "5-email + SMS sequence to convert completers into your next offer.",              tabId: "upsellSequence",      phase: "After first challenge" },
  { label: "Pricing guide",             description: "Recommended pricing, value stack, confidence script, objection handlers.",         tabId: "pricingGuide",        phase: "Before launch" },
  { label: "Launch roadmap",            description: "6-phase launch timeline with tasks and timing for your first campaign.",           tabId: "launchRoadmap",       phase: "Week 1" },
  { label: "Sales letter / long-form",  description: "Full long-form sales page for warm traffic and retargeting.",                     tabId: "salesLetter",         phase: "Month 2" },
];

interface Props {
  funnelType: "challenge" | "application";
  onNavigate: (tabId: string) => void;
}

function StepRow({ step, last, onNavigate, colour }: {
  step: Step;
  last: boolean;
  onNavigate: (id: string) => void;
  colour: Phase["colour"];
}) {
  return (
    <div className="flex gap-4">
      {/* Line + circle */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onNavigate(step.tabId)}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all hover:scale-110 ${colour.step} ${colour.stepText}`}
        >
          {step.number}
        </button>
        {!last && <div className={`w-0.5 flex-1 mt-1 ${colour.line}`} />}
      </div>

      {/* Content */}
      <div className={`pb-5 flex-1 ${last ? "" : ""}`}>
        <button
          onClick={() => onNavigate(step.tabId)}
          className="group flex items-start justify-between w-full text-left"
        >
          <div className="flex-1 pr-3">
            <p className="font-semibold text-gray-900 text-sm group-hover:text-gray-700 transition-colors">
              {step.label}
            </p>
            <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
              {step.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-0.5">
            <span className="text-[10px] text-gray-400 font-medium">{step.time}</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>
      </div>
    </div>
  );
}

function PhaseCard({ phase, onNavigate }: { phase: Phase; onNavigate: (id: string) => void }) {
  const Icon = phase.icon;
  return (
    <div className={`rounded-2xl border ${phase.colour.border} ${phase.colour.bg} p-5`}>
      {/* Phase header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${phase.colour.icon}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{phase.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{phase.subtitle}</p>
        </div>
      </div>

      {/* Steps */}
      <div>
        {phase.steps.map((step, i) => (
          <StepRow
            key={step.tabId}
            step={step}
            last={i === phase.steps.length - 1}
            onNavigate={onNavigate}
            colour={phase.colour}
          />
        ))}
      </div>
    </div>
  );
}

export function StartHereSection({ funnelType, onNavigate }: Props) {
  const phases = funnelType === "application" ? APPLICATION_PHASES : CHALLENGE_PHASES;
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Your launch sequence</h2>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              {totalSteps} steps across 3 weeks. Follow them in order — each one builds on the last.
              Click any step to open that section.
            </p>
          </div>
        </div>
      </div>

      {/* Phase cards */}
      {phases.map((phase) => (
        <PhaseCard key={phase.id} phase={phase} onNavigate={onNavigate} />
      ))}

      {/* Phase 2 — Scale */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-200">
            <TrendingUp className="h-3.5 w-3.5 text-gray-500" />
          </div>
          <p className="font-bold text-gray-500 text-sm">Phase 2 — Scale</p>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
            After your first challenge
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Everything below is ready and waiting. Come back to these once you've launched and have clients.
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          {SCALE_STEPS.filter(s =>
            funnelType === "application"
              ? s.tabId !== "salesLetter"
              : true
          ).map((s) => (
            <button
              key={s.tabId}
              onClick={() => onNavigate(s.tabId)}
              className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <Circle className="h-4 w-4 shrink-0 text-gray-300 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{s.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{s.description}</p>
                <span className="mt-1.5 inline-block text-[10px] font-semibold text-gray-400">{s.phase}</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300 group-hover:text-gray-500 mt-0.5 transition-colors" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
