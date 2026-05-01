import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  MessageSquare,
  BarChart3,
  Star,
  TrendingUp,
  Calendar,
  Clock,
  Rocket,
  Trophy,
  ChevronRight,
  Phone,
  FileText,
  Package,
  BadgeDollarSign,
  CalendarRange,
  Video,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const painPoints = [
  "You post on Instagram every day but your DMs are still empty.",
  "You know you're a great coach — but struggle to explain what you do in a way that makes people sign up.",
  "You've tried running challenges before, but the copy was cobbled together and barely converted.",
  "You're spending more time trying to figure out marketing than actually coaching.",
  "You get on sales calls and freeze when it's time to close — because you don't have a script.",
];

const features = [
  {
    icon: Target,
    title: "Challenge Funnels",
    description: "Landing page, opt-in form, thank-you page, and booking page — all fully written for your specific challenge and audience.",
  },
  {
    icon: MessageSquare,
    title: "Email + SMS Sequences",
    description: "Complete pre-challenge, during-challenge, and post-challenge sequences that follow up, re-engage, and convert.",
  },
  {
    icon: Zap,
    title: "Facebook & Instagram Ads",
    description: "Scroll-stopping hooks, primary text, headlines, and creative briefs built for the fitness audience.",
  },
  {
    icon: FileText,
    title: "Sales Letter + VSL Script",
    description: "A full long-form sales letter (3,000+ words) and a video sales letter script for application funnels.",
  },
  {
    icon: Phone,
    title: "Discovery Call Script",
    description: "Word-for-word 8-phase enrolment call script with niche probe questions, objection handlers, and a post-call email.",
  },
  {
    icon: BadgeDollarSign,
    title: "Pricing & Offer Guide",
    description: "Recommended price point, value stack, confidence scripts, and objection handlers for the money conversation.",
  },
  {
    icon: Package,
    title: "Challenge Delivery Pack",
    description: "Welcome emails, 30 daily SMS prompts, weekly coaching emails, and a completion sequence — all ready to send.",
  },
  {
    icon: CalendarRange,
    title: "30-Day Content Calendar",
    description: "A full month of strategic Instagram content with hooks, captions, and CTAs — synced to your challenge launch.",
  },
];

const steps = [
  {
    number: "01",
    icon: Clock,
    title: "5-minute intake wizard",
    description: "Tell us your concept, who it's for, and what transformation you deliver. That's all we need.",
  },
  {
    number: "02",
    icon: Rocket,
    title: "AI builds your full business kit",
    description: "FitPro Launch generates 20+ assets — copy, ads, emails, call scripts, delivery packs — tailored to your niche and voice.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Launch and fill your calendar",
    description: "Copy assets into your funnel builder, ad manager, or CRM. One click pushes everything directly into HighLevel.",
  },
];

const testimonials = [
  {
    quote: "I launched my first 30-day challenge and filled 18 spots in 4 days. The landing page copy was better than anything I could have written myself.",
    name: "Sarah M.",
    role: "Online PT · London",
    result: "18 new clients",
    resultColor: "text-green-400",
  },
  {
    quote: "I used to dread the writing part of launching. Now I run a new challenge every 6 weeks and my calendar is consistently full.",
    name: "James T.",
    role: "Personal Trainer · Manchester",
    result: "Fully booked",
    resultColor: "text-orange-400",
  },
  {
    quote: "The discovery call script alone changed everything. I went from fumbling through sales calls to closing 4 out of 5 conversations.",
    name: "Priya K.",
    role: "Online Fitness Coach · Birmingham",
    result: "80% close rate",
    resultColor: "text-blue-400",
  },
];

const included = [
  "Challenge funnel — landing page, opt-in, thank you, booking",
  "Application funnel — 22-section registration page",
  "5-part pre-challenge email sequence",
  "5-part SMS follow-up sequence",
  "52-week long-term nurture sequence",
  "Facebook + Instagram ad copy & creative briefs",
  "Campaign naming + UTM tracking links",
  "Long-form sales letter (3,000+ words)",
  "VSL script (11 sections)",
  "ManyChat DM flow",
  "Discovery call script (8 phases + objections)",
  "Pricing & offer guide",
  "30-day content calendar",
  "Challenge delivery pack (emails + 30 daily SMS)",
  "Testimonial harvest sequence",
  "Workout plan generator",
  "Full offer positioning summary",
  "HighLevel 1-click funnel push",
];

const stats = [
  { value: "500+", label: "Funnels generated" },
  { value: "<5 min", label: "Average build time" },
  { value: "18+", label: "Assets per project" },
  { value: "1-click", label: "HighLevel push" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0f172a]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">FitPro Launch</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25">
                Start for free →
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0f172a] px-6 pb-24 pt-20 sm:pt-28">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-[300px] w-[400px] rounded-full bg-brand-600/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-400">
            <Rocket className="h-3.5 w-3.5" />
            The AI toolkit built specifically for online fitness coaches
          </div>

          <h1 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[72px]">
            Your entire coaching business,{" "}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
              built in minutes.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-gray-400">
            Answer 5 questions and FitPro Launch generates 18+ ready-to-use assets —
            challenge funnels, sales letters, call scripts, delivery packs, ad copy, and more —
            all written specifically for your audience and offer.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button
                size="xl"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold shadow-2xl shadow-orange-500/30 sm:w-auto"
              >
                Build my coaching toolkit free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500">No credit card · Ready in under 5 minutes</p>
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

      {/* Pain section */}
      <section className="bg-gray-950 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest text-orange-500">
            <Target className="h-4 w-4" />
            Sound familiar?
          </div>
          <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
            You&apos;re a great coach. But the business side?{" "}
            <span className="text-gray-400">That&apos;s another story.</span>
          </h2>
          <div className="space-y-4">
            {painPoints.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/5 px-5 py-4"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                  ✗
                </span>
                <p className="text-gray-300 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-6 text-center">
            <p className="text-lg font-semibold text-white">
              You don&apos;t need to be a marketer.{" "}
              <span className="text-orange-400">You just need the right tool.</span>
            </p>
            <p className="mt-2 text-gray-400">
              FitPro Launch handles the copy, strategy, scripts, and sequencing — so you can focus entirely on coaching.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#0f172a] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
            How it works
          </div>
          <h2 className="mb-16 text-center text-4xl font-bold text-white">
            From blank page to full business kit in 3 steps
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative">
                {idx < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-px w-8 translate-x-full bg-gradient-to-r from-orange-500/50 to-transparent md:block" />
                )}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20">
                    <step.icon className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-500/70">
                    Step {step.number}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="bg-gray-950 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
            Everything you need
          </div>
          <h2 className="mb-4 text-center text-4xl font-bold text-white">
            One wizard. Every asset you need to launch.
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-400 leading-relaxed">
            A typical fitness coaching business takes months to build from scratch.
            FitPro Launch gives you everything — in the time it takes to drink a coffee.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-orange-500/30 hover:bg-white/8"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15 border border-orange-500/20">
                  <feature.icon className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* HighLevel badge */}
          <div className="mt-4 rounded-xl border border-brand-500/30 bg-gradient-to-br from-brand-900/40 to-brand-800/20 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/20 border border-brand-500/30">
                <Zap className="h-5 w-5 text-brand-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Push directly into HighLevel</p>
                <p className="mt-1 text-sm text-gray-400">
                  Connect your GHL account and push all funnel pages as native elements with one click — no copy-paste needed. Pairs perfectly with the Online FitPro Hub CRM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's included full list */}
      <section className="bg-[#0f172a] px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
            What&apos;s included
          </div>
          <h2 className="mb-4 text-center text-4xl font-bold text-white">
            18+ assets generated in one run
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-gray-400">
            Every asset is specific to your offer, your audience, and your voice — not a generic template.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {included.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500" />
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/signup">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25">
                Get all of this free →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-gray-950 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
            Real results
          </div>
          <h2 className="mb-12 text-center text-4xl font-bold text-white">
            Coaches are launching and closing
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-3 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="flex-1 text-gray-300 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                    <div className="rounded-full bg-white/10 px-3 py-1">
                      <p className={`text-xs font-bold ${t.resultColor}`}>{t.result}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 px-6 py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,0,0,0.25)_0%,_transparent_70%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white">
            <Trophy className="h-3.5 w-3.5" />
            Your coaching business isn&apos;t going to build itself
          </div>
          <h2 className="text-balance text-4xl font-extrabold text-white sm:text-5xl">
            Ready to launch like a pro?
          </h2>
          <p className="mt-4 text-xl text-white/80 leading-relaxed">
            Join hundreds of fitness coaches who stopped guessing and started launching.
            Your first full toolkit is completely free.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button
                size="xl"
                className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-2xl shadow-black/20 sm:w-auto"
              >
                Build my free coaching toolkit
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Ready in under 5 minutes</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Works with HighLevel</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0f172a] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Rocket className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-gray-400">FitPro Launch</span>
          </div>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} FitPro Launch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
