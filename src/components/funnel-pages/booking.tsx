import type { GeneratedFunnelAssets } from "@/types/generation";

interface Props {
  data: GeneratedFunnelAssets;
}

export function BookingPage({ data }: Props) {
  const bk = data.bookingPage;
  const concept = data.offerSummary.challengeConcept || "30-Day Challenge";

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = ["16", "17", "18", "19", "20", "21", "22"];
  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

  return (
    <div className="font-sans antialiased">
      {/* Header */}
      <section style={{ background: "linear-gradient(160deg, #1c0a00 0%, #431407 100%)" }} className="px-6 sm:px-10 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-orange-500/20 border border-orange-400/30 px-4 py-1.5 text-sm font-semibold text-orange-300 mb-6">
            Almost there — pick a time that works for you
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Book Your Free {concept} Strategy Call
          </h1>
          <p className="text-amber-200 max-w-lg mx-auto leading-relaxed">{bk.shortIntro}</p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-slate-50 px-6 sm:px-10 py-14">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-10">

          {/* Why book */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">Why Book a Call</p>
            <div className="space-y-4 mb-8">
              {bk.whyBook.map((reason, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 mt-0.5">
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 leading-snug">{reason}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
              <p className="text-sm font-semibold text-amber-900 mb-1">What to expect</p>
              <p className="text-sm text-amber-800 leading-relaxed">{bk.expectationSetting}</p>
            </div>

            {/* Reassurance */}
            <div className="mt-6 flex flex-col gap-2">
              {["Free 30-minute call", "No sales pressure", "100% confidential"].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6">
            <div className="flex items-center justify-between mb-5">
              <button className="text-gray-400 hover:text-gray-600 text-lg font-bold">‹</button>
              <span className="font-bold text-gray-900">March 2026</span>
              <button className="text-gray-400 hover:text-gray-600 text-lg font-bold">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {days.map((d) => (
                <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
              ))}
              {dates.map((dt, i) => (
                <button
                  key={dt}
                  className={`text-center text-sm rounded-xl py-2.5 font-medium transition-colors ${
                    i === 2
                      ? "bg-amber-500 text-white font-bold shadow-sm"
                      : "text-gray-700 hover:bg-amber-50"
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Available Times (EST)</p>
            <div className="grid grid-cols-2 gap-2">
              {times.map((t, i) => (
                <button
                  key={t}
                  className={`text-sm rounded-xl border-2 py-2.5 font-medium transition-colors ${
                    i === 2
                      ? "bg-amber-500 text-white border-amber-500 font-bold"
                      : "border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button className="mt-5 w-full rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors py-3.5 text-sm font-black text-white flex items-center justify-center gap-2">
              Confirm My Spot
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              You&apos;ll receive a confirmation email immediately after booking
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-[#0f172a] px-6 py-8 text-center text-xs text-slate-500 border-t border-white/5">
        <p>© {new Date().getFullYear()} {concept}. All rights reserved.</p>
      </footer>
    </div>
  );
}
