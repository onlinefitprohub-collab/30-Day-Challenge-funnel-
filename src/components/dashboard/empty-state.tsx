import Link from "next/link";
import { Plus, Wand2, Download, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const HOW_IT_WORKS = [
  {
    icon: Wand2,
    title: "Answer a few questions",
    body: "Tell us about your niche, audience, and challenge concept — takes about 3 minutes.",
  },
  {
    icon: Download,
    title: "Get your full funnel",
    body: "We generate all 4 pages, email sequences, SMS messages, and ad copy instantly.",
  },
  {
    icon: Rocket,
    title: "Import straight into HighLevel",
    body: "Download the funnel JSON and import it — or clone pages directly with one click.",
  },
];

export function EmptyState() {
  return (
    <div className="space-y-6">
      {/* Hero empty card */}
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-8 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-md">
          <Plus className="h-7 w-7 text-white" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-gray-900">
          Your first funnel is one click away
        </h2>
        <p className="mt-2 max-w-xs text-gray-500 text-sm leading-relaxed">
          Answer a few questions about your challenge and we&apos;ll generate a complete,
          launch-ready funnel in minutes.
        </p>
        <Link href="/projects/new" className="mt-7">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold border-0 shadow-sm">
            <Plus className="h-4 w-4" />
            Create my first funnel
          </Button>
        </Link>
      </div>

      {/* How it works */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">How it works</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {HOW_IT_WORKS.map(({ icon: Icon, title, body }, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                  <Icon className="h-3.5 w-3.5 text-orange-500" />
                </div>
                <span className="text-xs font-bold text-gray-400">{i + 1}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
