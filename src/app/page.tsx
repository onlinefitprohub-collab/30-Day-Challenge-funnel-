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
  Users,
  Calendar,
  Clock,
  Flame,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const painPoints = [
  "You post on Instagram every day but your DMs are still empty.",
  "You know you're a great trainer — but struggle to explain what you do in a way that makes people sign up.",
  "You've tried running challenges before, but the copy was cobbled together and barely converted.",
  "You're spending more time trying to figure out marketing than actually coaching.",
];

const features = [
  {
    icon: Target,
    title: "Landing Page Copy",
    description: "3 headline variants, subheadline, bullets, FAQ, and urgency hooks — all written for your specific challenge.",
  },
  {
    icon: MessageSquare,
    title: "Email + SMS Sequences",
    description: "5 emails and 5 texts that follow up, re-engage, and turn sign-ups into paying clients.",
  },
  {
    icon: Zap,
    title: "Facebook & Instagram Ads",
    description: "Scroll-stopping hooks, primary text, and headlines built for the fitness audience.",
  },
  {
    icon: BarChart3,
    title: "Campaign Setup + UTMs",
    description: "Clean naming conventions and tracking links so you know exactly what's working.",
  },
];

const steps = [
  {
    number: "01",
    icon: Clock,
    title: "5-minute intake wizard",
    description: "Tell us your challenge concept, who it's for, and what transformation you deliver. That's it.",
  },
  {
    number: "02",
    icon: Zap,
    title: "AI builds your full funnel",
    description: "Claude and GPT-4o generate every asset — copy, ads, emails, SMS — tailored to your niche and voice.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Launch and fill your calendar",
    description: "Copy assets into GHL, your funnel builder, or ad manager. One click pushes everything into HighLevel.",
  },
];

const testimonials = [
  {
    quote: "I launched my first 30-day challenge and filled 18 spots in 4 days. The landing page copy was better than anything I could have written myself.",
    name: "Sarah M.",
    role: "Online PT · London",
    result: "18 new clients",
    resultColor: "text-green-600",
  },
  {
    quote: "I used to dread the writing part of launching. Now I run a new challenge every 6 weeks and my calendar is consistently full.",
    name: "James T.",
    role: "Personal Trainer · Manchester",
    result: "Fully booked",
    resultColor: "text-orange-500",
  },
  {
    quote: "The email sequences alone are worth every penny. I had a 40% show rate on my calls — something that never happened before.",
    name: "Priya K.",
    role: "Gym Owner · Birmingham",
    result: "40% call show rate",
    resultColor: "text-blue-600",
  },
];

const included = [
  "Landing page copy (3 headline options)",
  "Opt-in form suggestions & field order",
  "Thank-you page copy",
  "Booking page copy",
  "5-part SMS follow-up sequence",
  "5-part email nurture sequence",
  "Facebook + Instagram ad copy",
  "Creative brief & video prompts",
  "Campaign naming + UTM tracking links",
  "Full offer positioning summary",
];

const stats = [
  { value: "500+", label: "Funnels generated" },
  { value: "<5 min", label: "Average build time" },
  { value: "30-day", label: "Challenges, perfected" },
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
              <Flame className="h-4 w-4 text-white" />
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
            <Flame className="h-3.5 w-3.5" />
            The fastest way for PTs to fill their calendar with paying clients
          </div>

          <h1 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[72px]">
            Your next 30-day challenge,{" "}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
              fully built in minutes.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-gray-400">
            Stop staring at a blank page. Answer 5 minutes of questions and get a complete, ready-to-launch challenge funnel —
            landing page, emails, SMS, Facebook ads, and more — written specifically for your audience.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button
                size="xl"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold shadow-2xl shadow-orange-500/30 sm:w-auto"
              >
                Build my funnel free
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
            You&apos;re a great trainer. But the marketing side?{" "}
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
              FitPro Launch does the copy, strategy, and sequencing for you — so you can focus on coaching.
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
            From blank page to full funnel in 3 steps
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
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

      {/* What's in the box */}
      <section className="bg-gray-950 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-start">
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-500">
                What&apos;s included
              </div>
              <h2 className="text-4xl font-bold text-white">
                One wizard.{" "}
                <span className="text-gray-400">Ten assets, fully ready.</span>
              </h2>
              <p className="mt-4 text-lg text-gray-400 leading-relaxed">
                A typical fitness funnel takes days to build and thousands to hire out.
                This gives you everything — in the time it takes to drink a coffee.
              </p>
              <ul className="mt-8 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-500" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/signup">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25">
                    Get all of this free →
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              {/* HighLevel badge */}
              <div className="col-span-full rounded-xl border border-brand-500/30 bg-gradient-to-br from-brand-900/40 to-brand-800/20 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/20 border border-brand-500/30">
                    <Zap className="h-5 w-5 text-brand-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Push directly into HighLevel</p>
                    <p className="mt-1 text-sm text-gray-400">
                      Connect your GHL account and push all 4 funnel pages as native elements with one click — no copy-paste needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-[#0f172a] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
            Real results
          </div>
          <h2 className="mb-12 text-center text-4xl font-bold text-white">
            PTs are filling their calendars
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
            Your calendar isn&apos;t going to fill itself
          </div>
          <h2 className="text-balance text-4xl font-extrabold text-white sm:text-5xl">
            Ready to run a challenge that actually converts?
          </h2>
          <p className="mt-4 text-xl text-white/80 leading-relaxed">
            Join hundreds of personal trainers who stopped guessing and started launching.
            Your first funnel is completely free.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button
                size="xl"
                className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-2xl shadow-black/20 sm:w-auto"
              >
                Build my free challenge funnel
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
              <Flame className="h-3.5 w-3.5 text-white" />
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
