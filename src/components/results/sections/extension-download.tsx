"use client";

import { Download, CheckCircle2, Puzzle } from "lucide-react";

export function ExtensionDownloadSection() {
  return (
    <div className="space-y-5">
      {/* Hero card */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
            <Puzzle className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">FitPro GHL Chrome Extension</h3>
            <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
              Clone your funnel pages directly into HighLevel in one click. The extension bridges FitPro and your GHL account — no copy-pasting, no reformatting.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/api/highlevel/extension-download"
                download
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" />
                Download Extension (.zip)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* What it does */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { title: "1-Click Funnel Clone", desc: "Copy any FitPro funnel page layout and inject it directly into your GHL funnel builder" },
          { title: "AI Project Library", desc: "Browse and load your FitPro-generated funnel pages straight into GHL without leaving the browser" },
          { title: "Page Inspector", desc: "Diagnose GHL page issues with built-in dev tools — live element inspection, style overrides, section mapping" },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-sm font-semibold text-gray-900">{f.title}</p>
            <p className="text-xs leading-relaxed text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Install steps */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">How to Install</p>
        <ol className="space-y-3">
          {[
            "Download the extension ZIP file using the button above",
            "Unzip the file to a permanent folder on your computer (do not delete it after installing)",
            "Open Chrome and navigate to chrome://extensions/",
            "Enable Developer mode using the toggle in the top-right corner",
            "Click Load unpacked and select the unzipped extension folder",
            "The FitPro icon will appear in your Chrome toolbar — pin it for easy access",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-xs text-amber-800">
          <span className="font-semibold">Keep the folder in place.</span>{" "}
          Chrome loads the extension directly from the folder — if you move or delete it, the extension will stop working. Re-install after any system clean-up.
        </p>
      </div>
    </div>
  );
}
