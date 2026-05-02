import { CalendarDays, Zap, RefreshCw, Infinity } from "lucide-react";

const PRO_FEATURES = [
  { icon: CalendarDays, label: "Monthly Content Engine", desc: "Fresh 30-post plan every month, seasonally themed" },
  { icon: RefreshCw,    label: "Cohort refresh",         desc: "New ad copy, emails and DMs for each launch cycle" },
  { icon: Infinity,     label: "Unlimited funnel builds", desc: "Build and rebuild as many funnels as you need" },
];

export function UpgradePrompt() {
  return (
    <div className="mx-auto max-w-2xl py-8 space-y-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-4 py-1.5 text-sm font-semibold text-brand-700">
          <Zap className="h-4 w-4" /> Pro feature
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Monthly Content Engine</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Get a fresh, seasonally-aware 30-post content plan every month — plus DM starters and story ideas — all personalised to your niche and offer.
        </p>
      </div>

      {/* Feature list */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">What Pro unlocks</p>
        <div className="space-y-4">
          {PRO_FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100">
                <Icon className="h-4 w-4 text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Pro monthly */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Pro</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">£39<span className="text-base font-normal text-gray-400">/mo</span></p>
            <p className="text-sm text-gray-500 mt-1">Cancel any time</p>
          </div>
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            Start Pro
          </a>
          <p className="text-xs text-gray-400 text-center">Content Engine access only — funnel build sold separately</p>
        </div>

        {/* Annual all-in */}
        <div className="rounded-2xl border-2 border-brand-500 bg-brand-50 p-6 space-y-4 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
              Best value
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Annual All-In</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">£397<span className="text-base font-normal text-gray-400">/yr</span></p>
            <p className="text-sm text-brand-600 font-medium mt-1">~£33/mo · save £71 · includes 1 funnel build</p>
          </div>
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            Get Annual All-In
          </a>
          <p className="text-xs text-brand-600 text-center">Includes one funnel build credit + all Pro features</p>
        </div>
      </div>

    </div>
  );
}
