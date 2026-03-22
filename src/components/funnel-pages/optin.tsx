import type { GeneratedFunnelAssets } from "@/types/generation";

interface Props {
  data: GeneratedFunnelAssets;
  thankYouUrl?: string;
}

export function OptInPage({ data, thankYouUrl = "#" }: Props) {
  const form = data.optInForm;
  const concept = data.offerSummary.challengeConcept || "30-Day Challenge";

  return (
    <div className="font-sans antialiased min-h-screen" style={{ background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 100%)" }}>
      {/* Header */}
      <div className="text-center px-6 pt-12 pb-2">
        <span className="inline-block rounded-full bg-purple-500/20 border border-purple-400/30 px-4 py-1.5 text-sm font-semibold text-purple-300 mb-6">
          Step 1 of 2 — Claim Your Free Spot
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 max-w-lg mx-auto leading-tight">
          Join the {concept} for Free
        </h1>
        <p className="text-purple-200 max-w-md mx-auto leading-relaxed">{form.formIntroText}</p>
      </div>

      {/* Form card */}
      <div className="px-6 py-10">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8">
          <p className="text-base font-bold text-gray-900 mb-6 text-center">Enter your details below to get instant access</p>
          <div className="space-y-4">
            {form.recommendedFields.map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field}</label>
                <div className="w-full rounded-xl border-2 border-gray-200 focus-within:border-purple-400 bg-gray-50 px-4 py-3 text-gray-400 text-sm transition-colors">
                  Enter your {field.toLowerCase()}…
                </div>
              </div>
            ))}
          </div>

          <a
            href={thankYouUrl}
            className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-500 transition-colors py-4 text-base font-black text-white gap-2"
          >
            {form.ctaButtonText}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>

          <div className="mt-4 flex items-center justify-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-gray-400">100% secure — your info is never shared.</p>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="px-6 py-6">
        <div className="max-w-md mx-auto flex flex-wrap items-center justify-center gap-6">
          {["✓ 100% Free", "✓ Instant Access", "✓ Cancel Anytime"].map((item, i) => (
            <span key={i} className="text-sm text-purple-200 font-medium">{item}</span>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-6 pb-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-sm font-semibold text-purple-300 mb-6">What coaches are saying</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: "Sarah K.", quote: "Generated my entire funnel in under 5 minutes!" },
              { name: "Mike T.", quote: "Finally have a professional funnel without the agency cost." },
              { name: "Lisa M.", quote: "My opt-in rate went from 12% to 38% overnight." },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p className="text-yellow-400 text-xs mb-2">★★★★★</p>
                <p className="text-sm text-white/80 italic mb-2">&quot;{t.quote}&quot;</p>
                <p className="text-xs font-bold text-purple-200">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
