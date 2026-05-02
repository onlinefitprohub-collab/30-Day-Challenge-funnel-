import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Zap, Target, MessageSquare, BarChart3,
  Star, TrendingUp, Calendar, Clock, Rocket, Trophy, ChevronRight,
  Phone, FileText, Package, BadgeDollarSign, CalendarRange, Video,
  Users, Map, MessageCircle, XCircle, DollarSign, Flame, Play,
  Shield, Award, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "£2,800+", label: "Saved vs. hiring" },
  { value: "<5 min",  label: "Build time" },
  { value: "20+",     label: "Assets generated" },
  { value: "1 day",   label: "From idea to live funnel" },
];

const painPoints = [
  {
    pain: "You've been 'getting ready to launch' for months",
    truth: "Writing copy for a challenge funnel from scratch takes 40–60 hours. Most coaches quit before they publish.",
  },
  {
    pain: "You hired a copywriter and paid £1,500 for one landing page",
    truth: "That copywriter didn't understand fitness, took 3 weeks, and you still had to rewrite half of it.",
  },
  {
    pain: "You freeze on sales calls because you don't have a script",
    truth: "Without a structured call framework, most coaches close fewer than 1 in 5 conversations. The scripts exist — you just don't have them.",
  },
  {
    pain: "You post on Instagram every day and get zero DMs",
    truth: "Random posting without a strategy doesn't convert. You need hooks, captions, and CTAs built for your specific audience.",
  },
  {
    pain: "You launched a challenge once and it flopped",
    truth: "The challenge wasn't the problem. The copy, the sequence, and the sales process were. You didn't have the right tools.",
  },
];

const roiItems = [
  { item: "Landing page copywriter",          market: "£800–£1,500",  fitpro: "Included" },
  { item: "Email sequence writer (10 emails)", market: "£500–£1,200",  fitpro: "Included" },
  { item: "Facebook & Instagram ad copy",     market: "£400–£800",    fitpro: "Included" },
  { item: "Sales call script + training",     market: "£300–£700",    fitpro: "Included" },
  { item: "Content calendar strategist",      market: "£500–£800/mo", fitpro: "Included" },
  { item: "DM script + outreach system",      market: "£200–£400",    fitpro: "Included" },
  { item: "Challenge delivery pack",          market: "£300–£600",    fitpro: "Included" },
  { item: "Post-challenge upsell sequence",   market: "£300–£500",    fitpro: "Included" },
  { item: "Launch roadmap + strategy",        market: "£500–£1,000",  fitpro: "Included" },
];

const timelineSteps = [
  { time: "5 min",    label: "Complete the wizard",         desc: "Tell FitPro Launch your niche, audience, and offer. That's literally all it needs." },
  { time: "30 min",   label: "All 20+ assets generated",    desc: "Landing page, emails, SMS, ad copy, call script, DM scripts, delivery pack — done." },
  { time: "2–3 hrs",  label: "Funnel live in HighLevel",    desc: "Use the 1-click GHL push or paste copy into your page builder. Automations connected." },
  { time: "Evening",  label: "DM outreach begins",          desc: "Start working your warm list with your DM scripts. First conversations starting tonight." },
  { time: "24–48 hrs",label: "Discovery calls booked",      desc: "Warm leads are booking onto your calendar. Your call script is ready." },
  { time: "Week 1",   label: "First paid clients",          desc: "Run your calls using the 8-phase script. Close at 60–80%. Collect your first payments." },
];

const featureSystems = [
  {
    label: "The Funnel Kit",
    colour: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    iconColour: "text-blue-400 bg-blue-500/20 border-blue-500/30",
    features: [
      { icon: FileText,     title: "Landing Page",          desc: "Headline, bullets, FAQ, urgency, and CTA — all written for your specific challenge." },
      { icon: Target,       title: "Opt-in Form",           desc: "Recommended fields and intro copy that pre-frames the value before the click." },
      { icon: CheckCircle2, title: "Thank You Page",        desc: "Post-signup confirmation copy that reduces drop-off and primes for the booking." },
      { icon: Calendar,     title: "Booking Page",          desc: "Discovery call framing that makes booking feel like the obvious next step." },
    ],
  },
  {
    label: "The Sales Machine",
    colour: "from-violet-500/20 to-violet-600/10 border-violet-500/30",
    iconColour: "text-violet-400 bg-violet-500/20 border-violet-500/30",
    features: [
      { icon: Phone,          title: "Discovery Call Script",  desc: "8-phase word-for-word script: rapport, pain discovery, future pacing, offer, price reveal, close." },
      { icon: BadgeDollarSign,title: "Pricing & Offer Guide",  desc: "Recommended price, value stack, and confidence scripts for the money conversation." },
      { icon: MessageCircle,  title: "Instagram DM Scripts",   desc: "4 conversation paths — cold outreach, warm lead, comment-to-DM, inbound enquiry." },
      { icon: TrendingUp,     title: "Upsell Email Sequence",  desc: "5-email post-challenge sequence that converts completers into your next-tier offer." },
    ],
  },
  {
    label: "The Ad Engine",
    colour: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
    iconColour: "text-orange-400 bg-orange-500/20 border-orange-500/30",
    features: [
      { icon: Zap,        title: "Facebook & Instagram Ads", desc: "Scroll-stopping hooks, primary text, headlines, and descriptions ready to paste." },
      { icon: BarChart3,  title: "Creative Briefs",          desc: "Visual concepts for static ads, talking-head reels, before/afters, and UGC." },
      { icon: Target,     title: "Campaign Naming",          desc: "UTM-structured campaign, ad set, and ad naming conventions for clean attribution." },
      { icon: Video,      title: "VSL Script",               desc: "11-section video sales letter script for application funnels — hook to close." },
    ],
  },
  {
    label: "The Delivery System",
    colour: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
    iconColour: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
    features: [
      { icon: Package,    title: "Challenge Delivery Pack",  desc: "Welcome email, 30 daily SMS prompts, 4 weekly emails, and completion sequence." },
      { icon: MessageSquare, title: "Email + SMS Sequences", desc: "Pre-challenge, during-challenge, and post-challenge sequences — fully written." },
      { icon: Star,       title: "Testimonial Harvest",      desc: "5-message sequence timed to collect reviews at peak client satisfaction." },
      { icon: CalendarRange, title: "52-Week Nurture",       desc: "Year-long follow-up sequence that keeps warm leads engaged between launches." },
    ],
  },
  {
    label: "The Growth Engine",
    colour: "from-pink-500/20 to-pink-600/10 border-pink-500/30",
    iconColour: "text-pink-400 bg-pink-500/20 border-pink-500/30",
    features: [
      { icon: CalendarRange, title: "30-Day Content Calendar", desc: "Strategy-led month of Instagram content — hooks, captions, CTAs, all in your niche." },
      { icon: Calendar,   title: "Monthly Content Engine",   desc: "Pro: fresh 30-post plan every month, seasonally themed, with DM starters and story ideas." },
      { icon: Map,        title: "Launch Roadmap",           desc: "6-phase week-by-week plan tying every FitPro Launch asset to a specific task and deadline." },
      { icon: BookOpen,   title: "Workout Plan Generator",   desc: "A complete 4-week training programme for your challenge participants." },
    ],
  },
];

const included = [
  "Challenge funnel — landing page, opt-in, thank you, booking",
  "Application funnel — 22-section registration page",
  "5-part pre-challenge email sequence",
  "30-day SMS follow-up sequence",
  "52-week long-term nurture sequence",
  "Facebook + Instagram ad copy",
  "Ad creative briefs (4 formats)",
  "Campaign naming + UTM structure",
  "Long-form sales letter (3,000+ words)",
  "VSL script (11 sections)",
  "ManyChat DM flow",
  "Discovery call script (8 phases + objections)",
  "Pricing & offer guide with confidence scripts",
  "Instagram DM scripts (4 conversation paths)",
  "Upsell email sequence (5 emails)",
  "Launch roadmap (6 phases)",
  "30-day content calendar",
  "Challenge delivery pack (emails + 30 daily SMS)",
  "Testimonial harvest sequence",
  "Workout plan generator",
  "Full offer positioning summary",
  "HighLevel 1-click funnel push",
];

const testimonials = [
  {
    quote: "I launched my first 30-day challenge and filled 18 spots in 4 days. The landing page copy was more persuasive than anything I could have written myself — and I used to be a marketing manager.",
    name: "Sarah M.",
    role: "Online PT · London",
    result: "18 clients in 4 days",
    resultColor: "text-green-400",
    avatar: "SM",
  },
  {
    quote: "I used to spend 2 weeks writing the copy for every launch. Now I run a new challenge every 6 weeks and my calendar is consistently full. The time saving alone is worth 10x what I paid.",
    name: "James T.",
    role: "Personal Trainer · Manchester",
    result: "Fully booked, every cohort",
    resultColor: "text-orange-400",
    avatar: "JT",
  },
  {
    quote: "The discovery call script alone changed everything. I went from stumbling through sales calls to closing 4 out of 5 conversations. My close rate went from 20% to 80% in one month.",
    name: "Priya K.",
    role: "Online Fitness Coach · Birmingham",
    result: "80% close rate",
    resultColor: "text-blue-400",
    avatar: "PK",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0f172a]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">FitPro Launch</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25">
                Start free →
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0f172a] px-6 pb-28 pt-20 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute left-1/2 top-0 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[140px]" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[500px] rounded-full bg-violet-600/8 blur-[120px]" />
          <div className="absolute left-0 bottom-0 h-[300px] w-[400px] rounded-full bg-blue-600/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400">
            <Flame className="h-3.5 w-3.5" />
            The AI business kit built for online fitness coaches
          </div>

          <h1 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[72px]">
            Your first paid client.{" "}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
              This week.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-gray-400">
            Answer 5 questions. FitPro Launch generates 20+ professional assets —
            challenge funnels, sales scripts, ad copy, delivery packs, DM scripts, and more —
            in the time it takes to drink a coffee.
            <span className="text-gray-300 font-medium"> Everything a new online coach needs. Built in one afternoon.</span>
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button
                size="xl"
                className="group w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold shadow-2xl shadow-orange-500/30 sm:w-auto"
              >
                Build my coaching business free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <p className="text-sm text-gray-400 font-medium">No credit card · Ready in 5 minutes</p>
              <p className="text-xs text-gray-600">Replaces £2,800+ of copywriting and strategy</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 px-6 py-5 text-center">
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="mt-0.5 text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pain ───────────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest text-orange-500">
            <Target className="h-4 w-4" />
            The honest truth
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
            You&apos;re a great coach. The business side is killing you.
          </h2>
          <p className="mb-12 text-center text-gray-400 max-w-xl mx-auto">
            These aren&apos;t personal failures. They&apos;re the predictable result of trying to build
            a marketing machine from scratch without the right tools.
          </p>
          <div className="space-y-3">
            {painPoints.map((p, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/5 bg-white/5 px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
                  <div>
                    <p className="font-semibold text-white text-sm">{p.pain}</p>
                    <p className="mt-1 text-sm text-gray-400 leading-relaxed">{p.truth}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-7 text-center">
            <p className="text-xl font-bold text-white">
              None of this is your fault.
            </p>
            <p className="mt-3 text-gray-300 leading-relaxed max-w-lg mx-auto">
              You were never trained to be a marketer, copywriter, or sales strategist.
              You were trained to coach. FitPro Launch gives you everything else —
              so you can get back to the part you&apos;re actually brilliant at.
            </p>
          </div>
        </div>
      </section>

      {/* ── Timeline: Launch in 24 hours ───────────────────────────────────── */}
      <section className="bg-[#0f172a] px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
            The 24-hour launch
          </div>
          <h2 className="mb-4 text-center text-4xl font-bold text-white">
            From zero to first client in one day
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-gray-400 leading-relaxed">
            This isn&apos;t theory. This is exactly what happens when you build with FitPro Launch.
          </p>
          <div className="relative space-y-4">
            {/* vertical line */}
            <div className="absolute left-[28px] top-10 bottom-10 w-px bg-gradient-to-b from-orange-500/50 via-orange-500/20 to-transparent sm:left-[36px]" />
            {timelineSteps.map((step, i) => (
              <div key={i} className="relative flex items-start gap-5 sm:gap-6">
                <div className="relative z-10 flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-orange-600/10 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-orange-400">{step.time}</span>
                </div>
                <div className="flex-1 rounded-xl border border-white/8 bg-white/5 px-5 py-4">
                  <p className="font-bold text-white">{step.label}</p>
                  <p className="mt-0.5 text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI Calculator ─────────────────────────────────────────────────── */}
      <section className="bg-gray-950 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
            The ROI
          </div>
          <h2 className="mb-4 text-center text-4xl font-bold text-white">
            What you&apos;d normally pay. What you actually pay.
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-gray-400">
            Hiring professionals to produce everything FitPro Launch generates would cost
            between <span className="text-white font-semibold">£2,800 and £5,300</span> — and take weeks.
            FitPro Launch costs{" "}
            <span className="text-orange-400 font-semibold">£97 one-time</span> and takes an afternoon.
          </p>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            {/* Table header */}
            <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 px-5 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Asset</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Market rate</p>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-400 text-right">FitPro Launch</p>
            </div>
            {roiItems.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 px-5 py-3.5 ${i % 2 === 0 ? "bg-white/3" : "bg-transparent"} border-b border-white/5 last:border-0`}
              >
                <p className="text-sm text-gray-300">{row.item}</p>
                <p className="text-sm text-gray-400 text-right line-through">{row.market}</p>
                <p className="text-sm font-semibold text-emerald-400 text-right">{row.fitpro}</p>
              </div>
            ))}
            {/* Totals row */}
            <div className="grid grid-cols-3 border-t border-white/20 bg-white/8 px-5 py-4">
              <p className="font-bold text-white">Total</p>
              <p className="text-right font-bold text-gray-400 line-through">£2,800–£5,300+</p>
              <p className="text-right font-extrabold text-orange-400">£97</p>
            </div>
          </div>

          {/* Callout */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
              <p className="text-3xl font-extrabold text-emerald-400">£2,700+</p>
              <p className="mt-1 text-sm text-emerald-200">Saved vs. hiring professionals</p>
            </div>
            <div className="flex-1 rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 text-center">
              <p className="text-3xl font-extrabold text-blue-400">6–8 weeks</p>
              <p className="mt-1 text-sm text-blue-200">Faster than hiring a copywriter</p>
            </div>
            <div className="flex-1 rounded-xl border border-orange-500/30 bg-orange-500/10 p-5 text-center">
              <p className="text-3xl font-extrabold text-orange-400">1 client</p>
              <p className="mt-1 text-sm text-orange-200">Pays for it. Every client after is pure profit.</p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            If your challenge costs £200+, a single client from your first launch covers the entire cost.
            Everything else — every challenge, every sale, every upsell — is built on assets that cost you nothing more.
          </p>
        </div>
      </section>

      {/* ── Feature Systems ────────────────────────────────────────────────── */}
      <section className="bg-[#0f172a] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
            Everything you need
          </div>
          <h2 className="mb-4 text-center text-4xl font-bold text-white">
            Five complete systems. One 5-minute wizard.
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-400">
            FitPro Launch doesn&apos;t just write a landing page.
            It builds your entire business infrastructure — from first ad click to long-term client.
          </p>

          <div className="space-y-6">
            {featureSystems.map((system) => (
              <div key={system.label} className={`rounded-2xl border bg-gradient-to-br p-1 ${system.colour}`}>
                <div className="rounded-xl bg-[#0f172a]/80 p-6">
                  <p className={`mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest border ${system.colour.replace("from-", "bg-").split(" ")[0]} ${system.iconColour}`}>
                    {system.label}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {system.features.map((f) => (
                      <div key={f.title} className="rounded-xl border border-white/8 bg-white/5 p-4 hover:border-white/15 transition-colors">
                        <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg border ${system.iconColour}`}>
                          <f.icon className="h-4 w-4" />
                        </div>
                        <p className="font-semibold text-white text-sm">{f.title}</p>
                        <p className="mt-1 text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* HighLevel callout */}
          <div className="mt-6 rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-900/40 to-brand-800/20 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 border border-brand-500/30">
                <Zap className="h-5 w-5 text-brand-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-white">1-click HighLevel push</p>
                  <span className="rounded-full bg-brand-500/20 border border-brand-500/30 px-2.5 py-0.5 text-xs font-semibold text-brand-300">
                    Pairs with Online FitPro Hub CRM
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-gray-400 max-w-2xl">
                  Connect your GHL account and push all funnel pages, automations, and sequences directly into your HighLevel funnel.
                  No copy-paste. No reformatting. One click and your entire funnel is live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full asset list ─────────────────────────────────────────────────── */}
      <section className="bg-gray-950 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
            The complete kit
          </div>
          <h2 className="mb-4 text-center text-4xl font-bold text-white">
            22 assets generated in one run
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-gray-400 leading-relaxed">
            Every single asset is written specifically for your niche, your audience, and your offer —
            not a generic template with your name swapped in.
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {included.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 hover:bg-white/8 transition-colors">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500" />
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25"
              >
                Get all 22 assets free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-3 text-sm text-gray-600">No credit card required. Build your first funnel completely free.</p>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section className="bg-[#0f172a] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
            Real results
          </div>
          <h2 className="mb-12 text-center text-4xl font-bold text-white">
            Coaches who launched. Coaches who closed.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1">
                    <p className={`text-xs font-bold ${t.resultColor}`}>{t.result}</p>
                  </div>
                </div>
                <p className="flex-1 text-gray-300 leading-relaxed text-sm">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Monthly Content Engine callout ─────────────────────────────────── */}
      <section className="bg-gray-950 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-900/40 to-[#0f172a] p-8 sm:p-10">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-400">
                  <Award className="h-3 w-3" /> Pro Feature
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Never run out of content. Ever.
                </h3>
                <p className="mt-3 text-gray-400 leading-relaxed">
                  The Monthly Content Engine generates a fresh 30-post social media plan every month —
                  seasonally themed, personalised to your niche, with DM conversation starters and story ideas.
                  Every. Single. Month. For £39.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { v: "30 posts",      l: "every month" },
                    { v: "7 ideas",       l: "stories & reels" },
                    { v: "5 starters",    l: "DM openers" },
                  ].map(({ v, l }) => (
                    <div key={l} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
                      <p className="text-lg font-extrabold text-white">{v}</p>
                      <p className="text-xs text-gray-400">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-3 text-center">
                <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 px-8 py-5">
                  <p className="text-4xl font-extrabold text-white">£39</p>
                  <p className="text-sm text-brand-300">/month</p>
                  <p className="mt-2 text-xs text-gray-400">Cancel any time</p>
                </div>
                <Link href="/signup">
                  <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold">
                    Start Pro
                  </Button>
                </Link>
                <p className="text-xs text-gray-500">Funnel build sold separately (£97)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 px-6 py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,0,0,0.3)_0%,_transparent_70%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-3xl bg-white/20" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-bold text-white">
            <Trophy className="h-3.5 w-3.5" />
            Every week you wait is a cohort you didn&apos;t fill
          </div>
          <h2 className="text-balance text-4xl font-extrabold text-white sm:text-5xl lg:text-[56px]">
            Build your entire coaching business. Today.
          </h2>
          <p className="mt-5 text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            5 minutes. 22 assets. Your first paid challenge, live by tomorrow.
            The only thing standing between you and a full client calendar is the next button you click.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button
                size="xl"
                className="w-full bg-white text-orange-600 hover:bg-gray-50 font-bold shadow-2xl shadow-black/25 sm:w-auto text-base"
              >
                Build my coaching toolkit free
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Ready in under 5 minutes</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> 22 assets. One wizard.</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> 1-click HighLevel push</span>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#0f172a] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-300 tracking-tight">FitPro Launch</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <Link href="/login" className="hover:text-gray-400 transition-colors">Log in</Link>
              <Link href="/signup" className="hover:text-gray-400 transition-colors">Sign up</Link>
            </div>
            <p className="text-sm text-gray-600 text-center sm:text-right">
              © {new Date().getFullYear()} FitPro Launch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
