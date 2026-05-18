"use client";

import { Download, CheckCircle2, Puzzle } from "lucide-react";

export function ExtensionDownloadSection() {
  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-white/[0.07]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Puzzle className="h-4 w-4 text-zinc-400" />
        <h3 className="text-sm font-semibold text-zinc-200">GHL Chrome Extension</h3>
        <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
          Required for 1-click clone
        </span>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">
        The extension bridges FitPro and your GHL account — install it once to enable the Clone to GHL button above.
      </p>

      {/* What it does */}
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { title: "1-Click Funnel Clone", desc: "Inject any FitPro funnel page directly into your GHL funnel builder" },
          { title: "AI Project Library", desc: "Browse and load your generated pages straight into GHL without copy-pasting" },
          { title: "Page Inspector", desc: "Diagnose GHL page issues with built-in dev tools and live element inspection" },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <p className="mb-1 text-xs font-semibold text-zinc-200">{f.title}</p>
            <p className="text-xs leading-relaxed text-zinc-500">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Download + install steps side by side */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <a
          href="/api/highlevel/extension-download"
          download
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Download className="h-4 w-4" />
          Download Extension (.zip)
        </a>
        <ol className="space-y-1.5 text-xs text-zinc-400">
          {[
            "Unzip to a permanent folder — do not delete after installing",
            "Open Chrome → chrome://extensions/ → enable Developer mode",
            'Click "Load unpacked" and select the unzipped folder',
            "Pin the FitPro icon in your Chrome toolbar",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[10px] font-bold text-indigo-400">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p className="text-xs text-amber-300">
          <span className="font-semibold">Keep the folder in place.</span>{" "}
          Chrome loads the extension from that folder — if you move or delete it, re-install is needed.
        </p>
      </div>
    </div>
  );
}
