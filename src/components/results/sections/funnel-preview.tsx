"use client";

import { useState } from "react";
import {
  Globe, ChevronRight, Star, Check, Calendar, ArrowRight, Shield, Clock, Users,
} from "lucide-react";
import type { GeneratedFunnelAssets } from "@/types/generation";

interface Props {
  data: GeneratedFunnelAssets;
  projectId?: string;
}

const PAGES = [
  { id: "landing",  label: "Landing Page", color: "#f97316" },
  { id: "optin",    label: "Opt-in Form",  color: "#7c3aed" },
  { id: "thankyou", label: "Thank You",    color: "#059669" },
  { id: "booking",  label: "Booking Page", color: "#b45309" },
] as const;

type PageId = (typeof PAGES)[number]["id"];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Browser chrome wrapper                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 shadow-xl overflow-hidden bg-white">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-[#f0f0f0] px-4 py-2.5">
        <div className="flex gap-1.5 shrink-0">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex flex-1 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1">
          <Globe className="h-3 w-3 text-gray-400 shrink-0" />
          <span className="text-xs text-gray-500 truncate">{url}</span>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[640px] text-left bg-white">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Reusable design primitives                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
function NavBar({ cta, accentBg, logo }: { cta: string; accentBg: string; logo?: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-3.5 bg-[#0f172a] border-b border-white/5 sticky top-0 z-10">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
          <span className="text-white text-[10px] font-black">{(logo ?? "CF").slice(0, 2).toUpperCase()}</span>
        </div>
        <span className="text-white text-sm font-semibold tracking-tight">{logo ?? "Challenge Funnel"}</span>
      </div>
      <button
        className="rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
        style={{ backgroundColor: accentBg }}
      >
        {cta}
      </button>
    </div>
  );
}

function Eyebrow({ text, color = "#f97316" }: { text: string; color?: string }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color }}>
      {text}
    </p>
  );
}

function CtaButton({ text, bg = "#f97316", fg = "#fff", size = "md" }: {
  text: string; bg?: string; fg?: string; size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm:  "px-5 py-2 text-xs",
    md:  "px-7 py-3 text-sm",
    lg:  "px-9 py-4 text-base",
  };
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-full font-bold tracking-wide shadow-md transition-transform hover:scale-[1.02] ${sizes[size]}`}
      style={{ backgroundColor: bg, color: fg }}
    >
      {text}
      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
    </button>
  );
}

function CheckItem({ text, color = "#22c55e", textColor = "#374151" }: {
  text: string; color?: string; textColor?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <Check className="h-3 w-3 text-white" />
      </div>
      <span className="text-sm leading-snug" style={{ color: textColor }}>{text}</span>
    </div>
  );
}

function StarRow({ count = 5, label }: { count?: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(count)].map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  LANDING PAGE                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */
function LandingPagePreview({ data }: { data: GeneratedFunnelAssets }) {
  const lp = data.landingPage;
  const os = data.offerSummary;

  return (
    <div className="font-sans antialiased">
      <NavBar cta={lp.ctaText} accentBg="#f97316" />

      {/* ── Trust bar ── */}
      <div className="bg-[#1e293b] px-6 py-2.5">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <StarRow count={5} label="Rated 5 stars by coaches" />
          <span className="text-slate-600 text-xs hidden sm:block">|</span>
          <span className="text-xs text-slate-300">✓ {os.corePromise}</span>
          <span className="text-slate-600 text-xs hidden sm:block">|</span>
          <span className="text-xs text-slate-300">✓ No credit card required</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <div
        className="px-8 py-16 text-center"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%)" }}
      >
        <span className="inline-block rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1 text-xs font-semibold text-orange-400 mb-5">
          🔥 {lp.urgencyIdeas[0] ?? "Limited spots — challenge starts soon"}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-[1.08] mb-4 max-w-2xl mx-auto">
          {lp.headlineOptions[0] ?? `Join the Free ${os.challengeConcept}`}
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
          {lp.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
          <CtaButton text={lp.ctaText} bg="#f97316" size="lg" />
          <span className="text-xs text-slate-400">No credit card · Takes 60 seconds</span>
        </div>
        {/* Sub-headline variant as a proof point */}
        <div className="max-w-md mx-auto mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs text-slate-300 leading-relaxed">
          {os.offerPositioning}
        </div>
      </div>

      {/* ── Who this is for ── */}
      <div className="bg-white px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Eyebrow text="Is This For You?" color="#f97316" />
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {lp.headlineOptions[1] ?? "Built specifically for coaches like you"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
              <p className="text-sm font-bold text-orange-700 mb-3">This is for you if you…</p>
              <div className="space-y-2.5">
                {os.targetAudienceSummary.split(/[.;]/).filter(s => s.trim().length > 10).slice(0, 4).map((line, i) => (
                  <CheckItem key={i} text={line.trim()} color="#f97316" textColor="#6b3500" />
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <p className="text-sm font-bold text-slate-700 mb-3">What you&apos;ll walk away with</p>
              <div className="space-y-2.5">
                {lp.bulletPoints.slice(0, 4).map((point, i) => (
                  <CheckItem key={i} text={point} color="#22c55e" textColor="#374151" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── What's included grid ── */}
      <div className="px-8 py-12" style={{ backgroundColor: "#f8fafc" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Eyebrow text="What You'll Get" color="#f97316" />
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {lp.headlineOptions[2] ?? "Everything you need inside the challenge"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {lp.bulletPoints.slice(0, 6).map((point, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-black text-xs mt-0.5">
                  {i + 1}
                </div>
                <span className="text-sm text-gray-700 leading-snug">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works (sectionIdeas as steps) ── */}
      {lp.sectionIdeas.length >= 2 && (
        <div className="bg-[#0f172a] px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Eyebrow text="How It Works" color="#fb923c" />
              <h2 className="text-2xl font-black text-white leading-tight">Simple. Structured. Effective.</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {lp.sectionIdeas.slice(0, 3).map((idea, i) => {
                // sectionIdeas are detailed briefs — extract just the first clause
                const short = (idea.split("—")[0] ?? idea).trim().slice(0, 72);
                return (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white font-black text-base mx-auto mb-3">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-200 leading-snug">{short}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── FAQ ── */}
      {lp.faqItems.length > 0 && (
        <div className="bg-white px-8 py-12">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <Eyebrow text="Common Questions" color="#f97316" />
              <h2 className="text-2xl font-black text-gray-900">Frequently asked questions</h2>
            </div>
            <div className="space-y-3">
              {lp.faqItems.slice(0, 4).map((faq, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-bold text-gray-900 mb-1.5">{faq.question}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Final CTA ── */}
      <div className="px-8 py-14 text-center" style={{ background: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)" }}>
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-100 mb-3">Ready to join?</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
            {lp.urgencyIdeas[1] ?? "Claim your free spot before it fills up."}
          </h2>
          <p className="text-sm text-orange-100 mb-7 leading-relaxed">{os.corePromise}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <CtaButton text={lp.ctaText} bg="white" fg="#ea580c" size="lg" />
            <span className="text-xs text-orange-200">Free to join · No commitment required</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  OPT-IN PAGE                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
function OptInFormPreview({ data }: { data: GeneratedFunnelAssets }) {
  const form = data.optInForm;
  const lp   = data.landingPage;
  const os   = data.offerSummary;

  return (
    <div className="font-sans antialiased">
      <NavBar cta="Join Free" accentBg="#7c3aed" />

      {/* ── Progress indicator ── */}
      <div className="bg-[#1e1b4b] px-6 py-2.5">
        <div className="max-w-sm mx-auto flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white text-[10px] font-black shrink-0">1</div>
          <div className="flex-1 h-1 rounded-full bg-purple-500" />
          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-purple-400/40 text-purple-400 text-[10px] font-black shrink-0">2</div>
          <span className="text-xs text-purple-300 ml-1">Step 1 of 2 — Claim your spot</span>
        </div>
      </div>

      {/* ── Hero + form ── */}
      <div
        className="px-6 py-12"
        style={{ background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #1e1b4b 100%)" }}
      >
        <div className="max-w-md mx-auto text-center mb-7">
          <span className="inline-block rounded-full border border-purple-400/30 bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-300 mb-4">
            Free access · Starts immediately
          </span>
          <h1 className="text-2xl font-black text-white leading-tight mb-3">
            Join the {os.challengeConcept}
          </h1>
          <p className="text-sm text-purple-200 leading-relaxed">{form.formIntroText}</p>
        </div>

        {/* Form card */}
        <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-purple-600 px-6 py-3 text-center">
            <p className="text-sm font-bold text-white">Enter your details to get started</p>
          </div>
          <div className="p-5 space-y-3.5">
            {form.recommendedFields.slice(0, 4).map((field, i) => (
              <div key={i}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{field}</label>
                <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-400">
                  Enter your {field.toLowerCase()}…
                </div>
              </div>
            ))}
            <button className="w-full rounded-xl bg-purple-600 py-3 text-sm font-black text-white flex items-center justify-center gap-2 mt-1 hover:bg-purple-700 transition-colors">
              {form.ctaButtonText} <ArrowRight className="h-4 w-4" />
            </button>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <Shield className="h-3 w-3 text-gray-400" />
              <p className="text-[10px] text-gray-400">100% secure — your info is never shared or sold.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust strip ── */}
      <div className="bg-[#0d0b2b] px-6 py-4">
        <div className="max-w-lg mx-auto flex flex-wrap items-center justify-center gap-5">
          {[
            { icon: <Check className="h-3.5 w-3.5 text-green-400" />, label: "100% free to join" },
            { icon: <Shield className="h-3.5 w-3.5 text-green-400" />, label: "No credit card needed" },
            { icon: <Clock className="h-3.5 w-3.5 text-green-400" />, label: "Takes under 60 seconds" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {item.icon}
              <span className="text-xs text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── What they're getting ── */}
      <div className="bg-slate-50 px-6 py-10">
        <div className="max-w-md mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-5 text-center">
            Here&apos;s what you&apos;re getting
          </p>
          <div className="space-y-3">
            {lp.bulletPoints.slice(0, 5).map((point, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-3.5 shadow-sm">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-black text-[10px] mt-0.5">{i + 1}</div>
                <span className="text-sm text-gray-700 leading-snug">{point}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-gray-400 mt-5">{os.offerPositioning}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  THANK YOU PAGE                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
function ThankYouPreview({ data }: { data: GeneratedFunnelAssets }) {
  const ty = data.thankYouPage;
  const os = data.offerSummary;

  return (
    <div className="font-sans antialiased">
      <NavBar cta="Book Your Call" accentBg="#059669" />

      {/* ── Celebration hero ── */}
      <div
        className="px-8 py-14 text-center"
        style={{ background: "linear-gradient(160deg, #052e16 0%, #14532d 55%, #052e16 100%)" }}
      >
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-green-500/20 border-[3px] border-green-500 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <span className="absolute -top-1 -right-2 text-xl">🎉</span>
          </div>
        </div>
        <span className="inline-block rounded-full border border-green-500/40 bg-green-500/15 px-4 py-1 text-xs font-bold text-green-400 mb-4">
          You&apos;re officially in — Welcome to the {os.challengeConcept}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4 max-w-lg mx-auto">
          {ty.confirmationMessage}
        </h1>
        <p className="text-sm text-emerald-300 max-w-md mx-auto leading-relaxed">
          {ty.bookingEncouragement}
        </p>
      </div>

      {/* ── Next steps ── */}
      <div className="bg-white px-8 py-12">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <Eyebrow text="What Happens Next" color="#059669" />
            <h2 className="text-2xl font-black text-gray-900">Here&apos;s your next steps</h2>
          </div>
          <div className="space-y-3.5">
            {ty.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-green-50 border border-green-100 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-black text-sm">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Social proof moment ── */}
      <div className="bg-slate-50 px-8 py-8 border-y border-slate-200">
        <div className="max-w-lg mx-auto flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: <Users className="h-4 w-4 text-green-500" />, label: "You&apos;re in good company" },
            { icon: <Calendar className="h-4 w-4 text-green-500" />, label: "Challenge starts this week" },
            { icon: <Star className="h-4 w-4 text-amber-400 fill-amber-400" />, label: os.corePromise },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {item.icon}
              <span className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: item.label }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Booking CTA ── */}
      <div
        className="px-8 py-14 text-center"
        style={{ background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)" }}
      >
        <div className="max-w-lg mx-auto">
          <div className="flex justify-center mb-4">
            <Calendar className="h-8 w-8 text-white/70" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-green-100 mb-3">One more step</p>
          <h2 className="text-2xl font-black text-white mb-3 leading-tight">
            Book your free kick-off call to get the most from this challenge
          </h2>
          <p className="text-sm text-green-100 mb-7 leading-relaxed max-w-md mx-auto">
            {ty.bookingEncouragement}
          </p>
          <CtaButton text="Book My Free Call Now" bg="white" fg="#16a34a" size="lg" />
          <p className="text-xs text-green-200 mt-3">30 minutes · No obligation · You can reschedule anytime</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  BOOKING PAGE                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */
function BookingPagePreview({ data }: { data: GeneratedFunnelAssets }) {
  const bk = data.bookingPage;
  const os = data.offerSummary;

  const days  = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const dates = ["14", "15", "16", "17", "18"];
  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];

  return (
    <div className="font-sans antialiased">
      <NavBar cta="Schedule Now" accentBg="#b45309" />

      {/* ── Hero ── */}
      <div className="px-8 py-10 text-center" style={{ background: "linear-gradient(160deg, #1c0a00 0%, #431407 60%, #1c0a00 100%)" }}>
        <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/15 px-4 py-1 text-xs font-semibold text-orange-300 mb-4">
          Last step — almost there
        </span>
        <h1 className="text-2xl font-black text-white leading-tight mb-3 max-w-lg mx-auto">
          Book Your Free {os.challengeConcept} Strategy Call
        </h1>
        <p className="text-sm text-amber-200 max-w-md mx-auto leading-relaxed">{bk.shortIntro}</p>
      </div>

      {/* ── Main content: benefits + calendar ── */}
      <div className="bg-slate-50 px-6 py-10">
        <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-6">

          {/* Left: why book */}
          <div>
            <Eyebrow text="On This Call" color="#b45309" />
            <h3 className="text-lg font-black text-gray-900 mb-4 leading-tight">
              Here&apos;s what we&apos;ll cover together
            </h3>
            <div className="space-y-3 mb-5">
              {bk.whyBook.map((reason, i) => (
                <CheckItem key={i} text={reason} color="#d97706" textColor="#374151" />
              ))}
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold text-amber-800 mb-1.5">What to expect</p>
              <p className="text-xs text-amber-700 leading-relaxed">{bk.expectationSetting}</p>
            </div>
            <div className="mt-4 space-y-1.5">
              {[
                { icon: <Clock className="h-3.5 w-3.5 text-slate-400" />, text: "30 minutes, no longer" },
                { icon: <Shield className="h-3.5 w-3.5 text-slate-400" />, text: "No sales pressure, ever" },
                { icon: <Check className="h-3.5 w-3.5 text-slate-400" />, text: "100% confidential conversation" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-xs text-slate-500">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: calendar widget */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <button className="h-6 w-6 rounded-full bg-gray-100 text-gray-500 text-sm flex items-center justify-center hover:bg-gray-200">‹</button>
              <span className="text-sm font-bold text-gray-800">March 2026</span>
              <button className="h-6 w-6 rounded-full bg-gray-100 text-gray-500 text-sm flex items-center justify-center hover:bg-gray-200">›</button>
            </div>
            <div className="grid grid-cols-5 gap-1 mb-2">
              {days.map((d) => (
                <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
              ))}
              {dates.map((dt, i) => (
                <button
                  key={dt}
                  className={`text-center text-xs rounded-lg py-1.5 font-medium transition-colors ${
                    i === 2
                      ? "bg-amber-500 text-white font-bold shadow-sm"
                      : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>
            <p className="text-[11px] font-semibold text-gray-500 mb-2 mt-3">Available times (your timezone)</p>
            <div className="grid grid-cols-2 gap-1.5">
              {times.map((t, i) => (
                <button
                  key={t}
                  className={`text-[11px] rounded-lg border py-1.5 font-medium transition-colors ${
                    i === 1
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl bg-amber-500 py-2.5 text-xs font-black text-white flex items-center justify-center gap-1.5 shadow-md hover:bg-amber-600 transition-colors">
              Confirm My Spot <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              You&apos;ll receive a confirmation email immediately
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer trust strip ── */}
      <div className="bg-[#0f172a] px-6 py-5">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center mb-3">Why coaches book a call first</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {[
              { icon: <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />, label: "Get a custom challenge plan" },
              { icon: <Shield className="h-3.5 w-3.5 text-amber-400 shrink-0" />, label: "No obligation whatsoever" },
              { icon: <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />, label: "Results in 30 days or less" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {item.icon}
                <span className="text-xs text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MAIN EXPORT                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
export function FunnelPreviewSection({ data }: Props) {
  const [activePage, setActivePage] = useState<PageId>("landing");

  const activeMeta = PAGES.find((p) => p.id === activePage)!;

  const pageUrls: Record<PageId, string> = {
    landing:  "yourfunnel.com/challenge",
    optin:    "yourfunnel.com/optin",
    thankyou: "yourfunnel.com/thank-you",
    booking:  "yourfunnel.com/book",
  };

  const pageContent: Record<PageId, React.ReactNode> = {
    landing:  <LandingPagePreview  data={data} />,
    optin:    <OptInFormPreview    data={data} />,
    thankyou: <ThankYouPreview     data={data} />,
    booking:  <BookingPagePreview  data={data} />,
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-gray-900">Funnel Page Previews</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          A visual preview of each page using your AI-generated copy. Switch pages to review the full funnel flow.
        </p>
      </div>

      {/* Page selector */}
      <div className="flex flex-wrap gap-2">
        {PAGES.map((page) => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all border ${
              activePage === page.id
                ? "bg-[#0f172a] text-white border-[#0f172a] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: activePage === page.id ? "#fff" : page.color }}
            />
            {page.label}
          </button>
        ))}
      </div>

      {/* Browser preview */}
      <BrowserFrame url={pageUrls[activeMeta.id]}>
        {pageContent[activePage]}
      </BrowserFrame>
    </div>
  );
}
