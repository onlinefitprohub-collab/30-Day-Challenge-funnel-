import { CalendarDays, Zap, RefreshCw, Rocket, Map, MessageCircle, TrendingUp, Phone, Target } from "lucide-react";

const FEATURES = [
  { icon: Rocket,        label: "Unlimited funnel builds",    desc: "Build and rebuild challenge and application funnels as many times as you need" },
  { icon: CalendarDays,  label: "Monthly Content Engine",     desc: "Fresh 30-post plan every month, seasonally themed with DM starters and story ideas" },
  { icon: RefreshCw,     label: "Cohort refresh",             desc: "Regenerate ads, emails, and DM scripts for each new launch cycle" },
  { icon: Phone,         label: "Discovery Call Script",      desc: "8-phase word-for-word sales call script with objection handlers" },
  { icon: MessageCircle, label: "Instagram DM Scripts",       desc: "4 conversation paths for cold outreach, warm leads, and inbound enquiries" },
  { icon: TrendingUp,    label: "Upsell Email Sequence",      desc: "5-email post-challenge sequence to convert completers to your next-tier offer" },
  { icon: Map,           label: "Launch Roadmap",             desc: "6-phase week-by-week plan tied to every asset you've generated" },
  { icon: Target,        label: "All 20+ generation tools",   desc: "Every asset in the platform, on demand, any time" },
];

export function UpgradePrompt() {
  return (
    <div className="mx-auto max-w-2xl py-8 space-y-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-4 py-1.5 text-sm font-semibold text-brand-700">
          <Zap className="h-4 w-4" /> Subscription required
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Get full access to FitPro Launch</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Unlimited funnel builds, the Monthly Content Engine, and every generation tool in the platform.
        </p>
      </div>

      {/* Feature list */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Everything included</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 border border-brand-100">
                <Icon className="h-3.5 w-3.5 text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid gap-4 sm:grid-cols-2">

        {/* Main — $97/mo */}
        <div className="rounded-2xl border-2 border-brand-500 bg-brand-50 p-6 space-y-4 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
              Recommended
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Full Access</p>
            <div className="mt-1 flex items-end gap-1">
              <p className="text-4xl font-extrabold text-gray-900">$97</p>
              <p className="text-base text-gray-400 mb-1">/month</p>
            </div>
            <p className="text-sm text-brand-600 font-medium mt-1">All tools · Unlimited builds · Monthly content</p>
          </div>
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700 transition-colors"
          >
            Start for $97/month
          </a>
          <p className="text-xs text-gray-400 text-center">Cancel any time · No contracts</p>
        </div>

        {/* Downsell — $67/mo */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Starter</p>
            <div className="mt-1 flex items-end gap-1">
              <p className="text-4xl font-extrabold text-gray-900">$67</p>
              <p className="text-base text-gray-400 mb-1">/month</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">Same full access · Lower entry price</p>
          </div>
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors"
          >
            Start for $67/month
          </a>
          <p className="text-xs text-gray-400 text-center">Everything included · Cancel any time</p>
        </div>

      </div>

      <p className="text-center text-xs text-gray-400">
        Both plans include every feature. No upsells after signup.
      </p>

    </div>
  );
}
