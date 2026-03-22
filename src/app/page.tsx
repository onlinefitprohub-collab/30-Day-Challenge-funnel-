import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Target, MessageSquare, BarChart3, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Target,
    title: "Landing Page Copy",
    description: "Headlines, bullets, CTAs, FAQ — everything your opt-in page needs.",
  },
  {
    icon: MessageSquare,
    title: "Email + SMS Sequences",
    description: "Welcome, reminders, objection handling, re-engagement — all written.",
  },
  {
    icon: Zap,
    title: "Facebook Ad Copy",
    description: "Hooks, primary text, headlines, descriptions — ready to run.",
  },
  {
    icon: BarChart3,
    title: "Campaign Naming + UTMs",
    description: "Clean naming conventions and tracking URLs, sorted in seconds.",
  },
];

const steps = [
  {
    number: "01",
    title: "Answer the wizard",
    description: "Tell us about your business, offer, and audience. Takes about 5 minutes.",
  },
  {
    number: "02",
    title: "We generate everything",
    description: "Our AI builds your full challenge funnel — copy, sequences, ads and all.",
  },
  {
    number: "03",
    title: "Copy, paste, launch",
    description: "Take your assets directly into your funnel builder, ad manager, or CRM.",
  },
];

const testimonials = [
  {
    quote: "I went from zero to a full launch-ready funnel in under 20 minutes. It even got the tone right.",
    name: "Sarah M.",
    role: "Online Fitness Coach",
  },
  {
    quote: "This is like having a copywriter and strategist on call. I've been doing this for years and still found new angles.",
    name: "James T.",
    role: "Personal Trainer, London",
  },
  {
    quote: "Finally something built for fitness people, not generic marketers. The SMS sequences alone are worth it.",
    name: "Priya K.",
    role: "Gym Owner",
  },
];

const included = [
  "Landing page copy (3 headline options)",
  "Opt-in form suggestions",
  "Thank-you page copy",
  "Booking page copy",
  "5-part SMS sequence",
  "5-part email sequence",
  "Facebook + Instagram ad copy",
  "Creative brief prompts",
  "Campaign naming + UTM suggestions",
  "Full offer positioning summary",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Challenge Funnel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                My funnels
              </Button>
            </Link>
            <Link href="/projects/new">
              <Button size="sm" variant="gradient">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white px-6 pb-20 pt-20 sm:pt-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-white to-white" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm text-brand-700">
            <Zap className="h-3.5 w-3.5" />
            <span>Built for fitness coaches who want leads fast</span>
          </div>
          <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Launch your{" "}
            <span className="gradient-text">30-day challenge funnel</span>
            {" "}in minutes, not days.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-gray-600">
            Answer a short wizard. Get a complete, launch-ready funnel — landing page,
            emails, SMS, ads, and more. Written for your audience, in your voice.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/projects/new">
              <Button size="xl" variant="gradient" className="w-full sm:w-auto">
                Generate my funnel free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-400">No credit card required</p>
          </div>

          {/* Social proof strip */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>Loved by coaches</span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <span>500+ funnels generated</span>
            <div className="h-4 w-px bg-gray-200" />
            <span>Ready in &lt;5 mins</span>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
                Everything in the box
              </p>
              <h2 className="text-4xl font-bold text-gray-900">
                One wizard. Ten funnel assets. Zero guesswork.
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Most coaches waste days trying to write funnel copy from scratch —
                or pay thousands for a copywriter. This gives you everything,
                tailored to your challenge, your audience, and your voice.
              </p>
              <ul className="mt-8 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                    <feature.icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
              How it works
            </p>
            <h2 className="text-4xl font-bold text-gray-900">
              From zero to launch-ready in three steps
            </h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100">
                  <span className="text-xl font-bold text-brand-700">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Coaches love it
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Ready to launch your challenge funnel?
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Join hundreds of fitness coaches who stopped guessing and started generating.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/projects/new">
              <Button size="xl" variant="gradient">
                Generate my funnel — it&apos;s free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            No card needed. Your first funnel is on us.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-gray-700">Challenge Funnel in a Box</span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Challenge Funnel in a Box. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
