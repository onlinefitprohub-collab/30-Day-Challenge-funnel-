"use client";

import { useState } from "react";
import {
  Globe, ChevronRight, Star, Check, Calendar, ArrowRight,
  Copy, ExternalLink, LayoutTemplate,
} from "lucide-react";
import type { GeneratedFunnelAssets } from "@/types/generation";

interface Props {
  data: GeneratedFunnelAssets;
  projectId?: string;
}

const PAGES = [
  { id: "landing",   label: "Landing Page", slug: "landing",   color: "#f97316" },
  { id: "optin",     label: "Opt-in Form",  slug: "optin",     color: "#7c3aed" },
  { id: "thankyou",  label: "Thank You",    slug: "thank-you", color: "#059669" },
  { id: "booking",   label: "Booking Page", slug: "booking",   color: "#b45309" },
] as const;

type PageId = (typeof PAGES)[number]["id"];

/* ── Browser chrome wrapper ── */
function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 shadow-lg overflow-hidden bg-white">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-[#f5f5f5] px-4 py-2.5">
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
      <div className="overflow-y-auto max-h-[600px] text-left">{children}</div>
    </div>
  );
}

/* ── Reusable sub-elements ── */
function NavBar({ cta, accentBg }: { cta: string; accentBg: string }) {
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-[#0f172a]">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-orange-500 flex items-center justify-center">
          <span className="text-white text-xs font-black">CF</span>
        </div>
        <span className="text-white text-sm font-semibold">Challenge Funnel</span>
      </div>
      <button className="rounded-full px-4 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: accentBg }}>
        {cta}
      </button>
    </div>
  );
}

function SocialProofBar({ concept }: { concept: string }) {
  return (
    <div className="flex items-center justify-center gap-6 bg-[#1e293b] py-2.5 px-8 flex-wrap">
      <div className="flex items-center gap-1.5">
        <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}</div>
        <span className="text-[11px] text-gray-300">500+ coaches launched</span>
      </div>
      <span className="text-gray-600 text-xs hidden sm:block">•</span>
      <span className="text-[11px] text-gray-300">🔥 {concept}</span>
    </div>
  );
}

function CtaBtn({ text, color, textColor = "white", size = "md" }: { text: string; color: string; textColor?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "px-4 py-2 text-xs", md: "px-6 py-3 text-sm", lg: "px-8 py-4 text-base" };
  return (
    <button className={`rounded-full font-bold tracking-wide flex items-center gap-2 ${sizes[size]}`} style={{ backgroundColor: color, color: textColor }}>
      {text} <ArrowRight className="h-3.5 w-3.5" />
    </button>
  );
}

/* ── Landing Page Preview ── */
function LandingPagePreview({ data }: { data: GeneratedFunnelAssets }) {
  const lp = data.landingPage;
  const concept = data.offerSummary.challengeConcept || "30-Day Challenge";
  return (
    <div className="font-sans">
      <NavBar cta={lp.ctaText} accentBg="#f97316" />
      <SocialProofBar concept={concept} />
      <div className="px-8 py-16 text-center" style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)" }}>
        <span className="inline-block rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1 text-xs font-semibold text-orange-400 mb-5">🔥 Limited Spots Available — Act Now</span>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4 max-w-2xl mx-auto">{lp.headlineOptions[0]}</h1>
        <p className="text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">{lp.subheadline}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <CtaBtn text={lp.ctaText} color="#f97316" size="lg" />
          <span className="text-xs text-slate-400">No credit card required</span>
        </div>
        {lp.urgencyIdeas[0] && <p className="text-xs text-red-400 font-medium">{lp.urgencyIdeas[0]}</p>}
      </div>
      <div className="bg-white px-8 py-10">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2 text-center">What You&apos;ll Get</p>
        <h2 className="text-xl font-black text-gray-900 text-center mb-7">Everything you need to succeed</h2>
        <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {lp.bulletPoints.slice(0, 6).map((point, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 mt-0.5"><Check className="h-3 w-3 text-white" /></div>
              <span className="text-sm text-gray-700 leading-snug">{point}</span>
            </div>
          ))}
        </div>
      </div>
      {lp.sectionIdeas.length > 0 && (
        <div className="bg-[#0f172a] px-8 py-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Also Included</p>
          <div className="flex flex-wrap justify-center gap-2">
            {lp.sectionIdeas.slice(0, 4).map((idea, i) => (
              <span key={i} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300 border border-white/10">{idea}</span>
            ))}
          </div>
        </div>
      )}
      {lp.faqItems.length > 0 && (
        <div className="bg-slate-50 px-8 py-10">
          <h2 className="text-xl font-black text-gray-900 text-center mb-6">Frequently Asked Questions</h2>
          <div className="max-w-xl mx-auto space-y-3">
            {lp.faqItems.slice(0, 3).map((faq, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-bold text-gray-900 mb-1">{faq.question}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-8 py-12 text-center">
        <h2 className="text-2xl font-black text-white mb-3">Ready to transform your coaching?</h2>
        <p className="text-sm text-orange-100 mb-6">{lp.urgencyIdeas[1] ?? "Spots are filling up fast."}</p>
        <div className="flex justify-center"><CtaBtn text={lp.ctaText} color="white" textColor="#f97316" size="lg" /></div>
      </div>
    </div>
  );
}

/* ── Opt-in Form Preview ── */
function OptInFormPreview({ data }: { data: GeneratedFunnelAssets }) {
  const form = data.optInForm;
  const concept = data.offerSummary.challengeConcept || "30-Day Challenge";
  return (
    <div className="font-sans">
      <NavBar cta="Join Now" accentBg="#7c3aed" />
      <div className="px-6 py-12" style={{ background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 100%)" }}>
        <div className="max-w-md mx-auto text-center mb-8">
          <span className="inline-block rounded-full bg-purple-500/20 border border-purple-400/30 px-3 py-1 text-xs font-semibold text-purple-300 mb-4">Step 1 of 2 — Claim Your Spot</span>
          <h1 className="text-2xl font-black text-white mb-3 leading-tight">Join the {concept} for Free</h1>
          <p className="text-sm text-purple-200">{form.formIntroText}</p>
        </div>
        <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-2xl p-6">
          <p className="text-sm font-bold text-gray-900 mb-4 text-center">Enter your details below</p>
          <div className="space-y-3">
            {form.recommendedFields.slice(0, 4).map((field, i) => (
              <div key={i}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{field}</label>
                <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-400">Enter your {field.toLowerCase()}…</div>
              </div>
            ))}
          </div>
          <button className="mt-5 w-full rounded-xl bg-purple-600 py-3 text-sm font-black text-white tracking-wide flex items-center justify-center gap-2">
            {form.ctaButtonText} <ArrowRight className="h-4 w-4" />
          </button>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            <p className="text-[10px] text-gray-400">Your information is 100% secure &amp; never shared.</p>
          </div>
        </div>
      </div>
      <div className="bg-[#0f0e1f] px-8 py-5 flex flex-wrap items-center justify-center gap-6">
        {["500+ coaches joined", "100% free challenge", "Cancel anytime"].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-green-400 shrink-0" />
            <span className="text-xs text-gray-300">{item}</span>
          </div>
        ))}
      </div>
      <div className="bg-slate-50 px-8 py-10">
        <h3 className="text-base font-black text-gray-900 text-center mb-5">What coaches are saying</h3>
        <div className="grid sm:grid-cols-3 gap-3 max-w-xl mx-auto">
          {[
            { name: "Sarah K.", quote: "Generated my entire funnel in under 5 minutes!" },
            { name: "Mike T.", quote: "Finally have a professional funnel without the agency cost." },
            { name: "Lisa M.", quote: "My opt-in rate went from 12% to 38% overnight." },
          ].map((t, i) => (
            <div key={i} className="rounded-xl bg-white border border-gray-200 p-3">
              <div className="flex mb-1">{[...Array(5)].map((_, j) => <Star key={j} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />)}</div>
              <p className="text-[10px] text-gray-600 italic mb-2">&quot;{t.quote}&quot;</p>
              <p className="text-[10px] font-bold text-gray-800">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Thank You Page Preview ── */
function ThankYouPreview({ data }: { data: GeneratedFunnelAssets }) {
  const ty = data.thankYouPage;
  const concept = data.offerSummary.challengeConcept || "30-Day Challenge";
  return (
    <div className="font-sans">
      <NavBar cta="Book Your Call" accentBg="#059669" />
      <div className="text-center px-8 py-14 bg-gradient-to-br from-emerald-950 via-[#0f2a1e] to-[#0f172a]">
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center">
              <Check className="h-10 w-10 text-green-400" />
            </div>
            <div className="absolute -top-1 -right-1 text-2xl">🎉</div>
          </div>
        </div>
        <span className="inline-block rounded-full bg-green-500/20 border border-green-500/40 px-4 py-1 text-xs font-bold text-green-400 mb-4">You&apos;re In! Welcome to the {concept}</span>
        <h1 className="text-3xl font-black text-white mb-4 leading-tight max-w-lg mx-auto">{ty.confirmationMessage}</h1>
        <p className="text-sm text-emerald-300 max-w-md mx-auto">{ty.bookingEncouragement}</p>
      </div>
      <div className="bg-white px-8 py-10">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-green-500 mb-2 text-center">What Happens Next</p>
          <h2 className="text-xl font-black text-gray-900 text-center mb-7">Here&apos;s your next steps</h2>
          <div className="space-y-4">
            {ty.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-black text-sm">{i + 1}</div>
                <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 px-8 py-12 text-center">
        <div className="flex justify-center mb-4"><Calendar className="h-8 w-8 text-white/80" /></div>
        <h2 className="text-xl font-black text-white mb-2">One more step — book your kick-off call</h2>
        <p className="text-sm text-green-100 mb-6">{ty.bookingEncouragement}</p>
        <div className="flex justify-center"><CtaBtn text="Book My Free Call Now" color="white" textColor="#059669" size="lg" /></div>
        <p className="text-xs text-green-200 mt-3">Calls are 30 minutes • No obligation</p>
      </div>
    </div>
  );
}

/* ── Booking Page Preview ── */
function BookingPagePreview({ data }: { data: GeneratedFunnelAssets }) {
  const bk = data.bookingPage;
  const concept = data.offerSummary.challengeConcept || "30-Day Challenge";
  const dummyDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const dummyDates = ["14", "15", "16", "17", "18"];
  const dummyTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];
  return (
    <div className="font-sans">
      <NavBar cta="Schedule Now" accentBg="#b45309" />
      <div className="px-8 py-10 text-center" style={{ background: "linear-gradient(160deg, #1c0a00 0%, #431407 100%)" }}>
        <span className="inline-block rounded-full bg-orange-500/20 border border-orange-500/30 px-4 py-1 text-xs font-semibold text-orange-300 mb-4">Almost there — pick a time that works for you</span>
        <h1 className="text-2xl font-black text-white mb-3 max-w-lg mx-auto leading-tight">Book Your Free {concept} Strategy Call</h1>
        <p className="text-sm text-amber-200 max-w-md mx-auto">{bk.shortIntro}</p>
      </div>
      <div className="bg-slate-50 px-6 py-10">
        <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Why Book a Call</p>
            <div className="space-y-3">
              {bk.whyBook.map((reason, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 mt-0.5"><Check className="h-3 w-3 text-white" /></div>
                  <p className="text-sm text-gray-700 leading-snug">{reason}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs text-amber-800 leading-relaxed">{bk.expectationSetting}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <button className="text-gray-400 text-sm">‹</button>
              <span className="text-sm font-bold text-gray-800">March 2026</span>
              <button className="text-gray-400 text-sm">›</button>
            </div>
            <div className="grid grid-cols-5 gap-1 mb-3">
              {dummyDays.map((d) => <div key={d} className="text-center text-[10px] font-bold text-gray-400">{d}</div>)}
              {dummyDates.map((dt, i) => (
                <button key={dt} className={`text-center text-xs rounded-lg py-1.5 font-medium ${i === 2 ? "bg-amber-500 text-white font-bold" : "bg-gray-50 text-gray-700 hover:bg-amber-50"}`}>{dt}</button>
              ))}
            </div>
            <p className="text-[11px] font-semibold text-gray-600 mb-2">Available times (EST):</p>
            <div className="grid grid-cols-2 gap-1.5">
              {dummyTimes.map((t, i) => (
                <button key={t} className={`text-[11px] rounded-lg border py-1.5 font-medium ${i === 1 ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-600 hover:border-amber-400"}`}>{t}</button>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl bg-amber-500 py-2.5 text-xs font-black text-white flex items-center justify-center gap-1.5">
              Confirm My Spot <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-[#0f172a] px-8 py-6 flex flex-wrap items-center justify-center gap-6">
        {["Free 30-min call", "No sales pressure", "100% confidential"].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="text-xs text-gray-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Live Page URL Row ── */
function LivePageRow({
  label, slug, color, projectId, copiedSlug, onCopy,
}: {
  label: string; slug: string; color: string; projectId: string;
  copiedSlug: string | null; onCopy: (slug: string, url: string) => void;
}) {
  const url = `${window.location.origin}/funnel/${projectId}/${slug}`;
  const isCopied = copiedSlug === slug;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm font-semibold text-gray-700 w-28 shrink-0">{label}</span>
      <span className="flex-1 text-xs text-gray-400 font-mono truncate">/funnel/{projectId.slice(0, 8)}…/{slug}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onCopy(slug, url)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            isCopied
              ? "border-green-300 bg-green-50 text-green-600"
              : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
          }`}
        >
          {isCopied ? <><Check className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy URL</>}
        </button>
        <a
          href={`/funnel/${projectId}/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Open <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

/* ── Main export ── */
export function FunnelPreviewSection({ data, projectId }: Props) {
  const [activePage, setActivePage] = useState<PageId>("landing");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const activeMeta = PAGES.find((p) => p.id === activePage)!;

  const pageContent: Record<PageId, React.ReactNode> = {
    landing:  <LandingPagePreview  data={data} />,
    optin:    <OptInFormPreview    data={data} />,
    thankyou: <ThankYouPreview     data={data} />,
    booking:  <BookingPagePreview  data={data} />,
  };

  function handleCopy(slug: string, url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-gray-900">Funnel Pages</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Each page is live at a public URL. Preview below, then import the links into HighLevel.
        </p>
      </div>

      {/* Live URLs panel */}
      {projectId ? (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4 text-indigo-600 shrink-0" />
            <p className="text-sm font-bold text-indigo-900">Live Page URLs</p>
          </div>
          <div className="space-y-2">
            {PAGES.map((page) => (
              <LivePageRow
                key={page.id}
                label={page.label}
                slug={page.slug}
                color={page.color}
                projectId={projectId}
                copiedSlug={copiedSlug}
                onCopy={handleCopy}
              />
            ))}
          </div>

          {/* HL import guide */}
          <div className="rounded-xl border border-indigo-200 bg-white p-4">
            <p className="text-xs font-bold text-indigo-800 mb-2">How to import into HighLevel</p>
            <ol className="space-y-1.5 text-xs text-indigo-700">
              <li className="flex gap-2"><span className="font-black shrink-0">1.</span><span>In HighLevel, go to <strong>Funnels</strong> and open (or create) your challenge funnel.</span></li>
              <li className="flex gap-2"><span className="font-black shrink-0">2.</span><span>For each step, click <strong>Edit Step</strong> → choose <strong>External URL</strong> or <strong>Custom Page</strong>.</span></li>
              <li className="flex gap-2"><span className="font-black shrink-0">3.</span><span>Paste the corresponding page URL from above (Landing → Opt-in → Thank You → Booking).</span></li>
              <li className="flex gap-2"><span className="font-black shrink-0">4.</span><span>Save — your funnel steps now point to these fully designed, hosted pages.</span></li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
          Live page URLs will appear here once your project is saved.
        </div>
      )}

      {/* Page selector tabs */}
      <div className="flex flex-wrap gap-2">
        {PAGES.map((page) => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all border ${
              activePage === page.id
                ? "bg-[#0f172a] text-white border-[#0f172a] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* Browser frame preview */}
      <BrowserFrame url={`yourapp.com/funnel/.../` + activeMeta.slug}>
        {pageContent[activePage]}
      </BrowserFrame>
    </div>
  );
}
