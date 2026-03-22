import type { GeneratedFunnelAssets } from "@/types/generation";

interface Props {
  data: GeneratedFunnelAssets;
  bookingUrl?: string;
}

export function ThankYouPage({ data, bookingUrl = "#" }: Props) {
  const ty = data.thankYouPage;
  const concept = data.offerSummary.challengeConcept || "30-Day Challenge";

  return (
    <div className="font-sans antialiased">
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #052e16 0%, #14532d 100%)" }} className="px-6 sm:px-10 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-green-400 bg-green-500/20 flex items-center justify-center">
                <svg className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="absolute -top-2 -right-2 text-3xl">🎉</span>
            </div>
          </div>
          <span className="inline-block rounded-full bg-green-500/20 border border-green-400/30 px-5 py-1.5 text-sm font-bold text-green-400 mb-6">
            You&apos;re In! Welcome to the {concept}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            {ty.confirmationMessage}
          </h1>
          <p className="text-lg text-green-200 max-w-lg mx-auto leading-relaxed">
            {ty.bookingEncouragement}
          </p>
        </div>
      </section>

      {/* Next steps */}
      <section className="bg-white px-6 sm:px-10 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-green-500 mb-2 text-center">What Happens Next</p>
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
            Here&apos;s your next steps
          </h2>
          <div className="space-y-5">
            {ty.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-black text-lg">
                  {i + 1}
                </div>
                <p className="text-gray-700 leading-relaxed pt-1.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 px-6 sm:px-10 py-16 sm:py-20 text-center">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-center mb-5">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            One more step — book your kick-off call
          </h2>
          <p className="text-green-100 mb-8 leading-relaxed">{ty.bookingEncouragement}</p>
          <a
            href={bookingUrl}
            className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-green-50 transition-colors px-8 py-4 text-base font-black text-green-600 shadow-lg"
          >
            Book My Free Call Now →
          </a>
          <p className="text-xs text-green-200 mt-4">30 minutes · No obligation · No sales pressure</p>
        </div>
      </section>

      <footer className="bg-[#052e16] px-6 py-8 text-center text-xs text-green-900 border-t border-white/5">
        <p>© {new Date().getFullYear()} {concept}. All rights reserved.</p>
      </footer>
    </div>
  );
}
