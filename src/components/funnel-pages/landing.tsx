import type { GeneratedFunnelAssets } from "@/types/generation";

interface Props {
  data: GeneratedFunnelAssets;
  optinUrl?: string;
}

export function LandingPage({ data, optinUrl = "#" }: Props) {
  const lp = data.landingPage;
  const offer = data.offerSummary;
  const concept = offer.challengeConcept || "30-Day Challenge";

  return (
    <div className="font-sans antialiased">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4 bg-[#0f172a]/95 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-white text-xs font-black">CF</span>
          </div>
          <span className="text-white font-bold text-sm hidden sm:block">{concept}</span>
        </div>
        <a
          href={optinUrl}
          className="rounded-full bg-orange-500 hover:bg-orange-400 transition-colors px-5 py-2 text-sm font-bold text-white"
        >
          {lp.ctaText} →
        </a>
      </nav>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%)" }} className="px-6 sm:px-10 py-20 sm:py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm font-semibold text-orange-400 mb-8">
            🔥 Limited Spots Available
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
            {lp.headlineOptions[0]}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {lp.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href={optinUrl}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-400 transition-colors px-8 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/30"
            >
              {lp.ctaText} →
            </a>
            <span className="text-sm text-slate-400">No credit card required</span>
          </div>
          {lp.urgencyIdeas[0] && (
            <p className="text-sm text-red-400 font-medium">{lp.urgencyIdeas[0]}</p>
          )}
        </div>
      </section>

      {/* Social proof bar */}
      <div className="bg-[#1e293b] border-y border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300">
          <span className="flex items-center gap-2">
            <span className="text-yellow-400">★★★★★</span> 500+ coaches launched
          </span>
          <span className="text-slate-600 hidden sm:block">|</span>
          <span>🎯 {offer.targetAudienceSummary}</span>
          <span className="text-slate-600 hidden sm:block">|</span>
          <span>✓ {offer.corePromise}</span>
        </div>
      </div>

      {/* What you get */}
      <section className="bg-white px-6 sm:px-10 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2 text-center">What You'll Get</p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-12">
            Everything you need to succeed
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {lp.bulletPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 mt-0.5">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 leading-snug">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section ideas */}
      {lp.sectionIdeas.length > 0 && (
        <section className="bg-[#0f172a] px-6 sm:px-10 py-14">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Also included in this challenge</p>
            <div className="flex flex-wrap justify-center gap-3">
              {lp.sectionIdeas.map((idea, i) => (
                <span key={i} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  {idea}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {lp.faqItems.length > 0 && (
        <section className="bg-slate-50 px-6 sm:px-10 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {lp.faqItems.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <p className="font-bold text-gray-900 mb-2">{faq.question}</p>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 px-6 sm:px-10 py-16 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to transform your coaching?
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            {lp.urgencyIdeas[1] ?? "Spots are filling fast — claim yours before it's gone."}
          </p>
          <a
            href={optinUrl}
            className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-orange-50 transition-colors px-8 py-4 text-lg font-black text-orange-500 shadow-lg"
          >
            {lp.ctaText} →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] px-6 py-8 text-center text-xs text-slate-500 border-t border-white/10">
        <p>© {new Date().getFullYear()} {concept}. All rights reserved.</p>
        <p className="mt-1">Privacy Policy · Terms of Service</p>
      </footer>
    </div>
  );
}
