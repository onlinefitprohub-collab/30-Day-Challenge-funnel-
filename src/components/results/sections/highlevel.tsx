"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Puzzle, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { GeneratedFunnelAssets } from "@/types/generation";

function HLCopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast({ title: "Copied!", description: label ? `${label} copied.` : "Copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : `Copy${label ? ` ${label}` : ""}`}
    </button>
  );
}

function HLField({ label, hlField, value }: { label: string; hlField: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-gray-700">{label}</span>
          <span className="ml-2 rounded bg-[#e8f0fe] px-1.5 py-0.5 text-[10px] font-medium text-[#1a56db]">
            HL: {hlField}
          </span>
        </div>
        <HLCopyButton value={value} label={label} />
      </div>
      <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function HLGroup({ step, title, hlPath, children }: {
  step: number; title: string; hlPath: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1a56db] text-xs font-bold text-white">
            {step}
          </span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{title}</p>
            <p className="text-xs text-gray-400">HighLevel → {hlPath}</p>
          </div>
        </div>
        <a
          href="https://app.gohighlevel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[#1a56db] hover:underline"
        >
          Open HL <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="p-5 space-y-3">{children}</div>
    </div>
  );
}

interface Props {
  data: GeneratedFunnelAssets;
  projectId: string;
  hlConnected: boolean;
}

export function HighLevelSection({ data, projectId: _projectId, hlConnected: _hlConnected }: Props) {
  const lp = data.landingPage;
  const form = data.optInForm;
  const ty = data.thankYouPage;
  const emails = data.emailSequence;
  const sms = data.smsSequence;
  const ads = data.adCopy;
  const campaign = data.campaignNaming;

  const emailKeys = ["welcome", "valueDelivery", "socialProof", "objectionHandling", "lastChance", "dayOneKickoff", "midChallenge", "finalStretch", "challengeComplete", "reEngagement"] as const;
  const emailLabels = ["Welcome", "Quick Win", "Social Proof", "Objection Handling", "Last Chance", "Day 1 Kickoff", "Midpoint Check-in", "Final Stretch", "Challenge Complete", "Re-engagement"];

  return (
    <div className="space-y-5">

      {/* Chrome Extension inject flow — PRIMARY */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a56db] text-white">
            <Puzzle className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Inject pages directly into HighLevel builder</p>
            <p className="text-xs text-gray-400">Uses the FitPro Launch Chrome extension — takes about 2 minutes to set up</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {[
            {
              n: "1",
              title: "Install the Chrome extension",
              body: "Install it in Chrome: open chrome://extensions, enable Developer mode, click Load unpacked, and select the unzipped folder.",
              extra: (
                <a
                  href="/api/highlevel/extension-download"
                  download="challenge-funnel-extension.zip"
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-md border border-[#1a56db] px-2.5 py-1 text-xs font-semibold text-[#1a56db] hover:bg-[#1a56db] hover:text-white transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Download extension (.zip)
                </a>
              ),
            },
            {
              n: "2",
              title: "Load a page from the extension popup",
              body: "Click the extension icon while on this results page. It auto-detects your project. Click Load next to the page you want (Landing, Opt-In, Thank You, Booking, or Sales Letter).",
            },
            {
              n: "3",
              title: "Open that page in the GHL page builder",
              body: "In HighLevel, go to Sites → Funnels → open your funnel → click Edit on the matching funnel step.",
            },
            {
              n: "4",
              title: "Click \"Paste into Page Builder\"",
              body: "The extension's orange panel appears in the bottom-right corner of the builder. Click Paste into Page Builder — native sections, columns, headings, and buttons are injected instantly using your existing HighLevel session.",
            },
            {
              n: "5",
              title: "The builder reloads with your content",
              body: "After the success message the builder refreshes automatically. Your funnel page content appears as fully editable native HighLevel elements.",
            },
          ].map(({ n, title, body, extra }) => (
            <div key={n} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a56db] text-[10px] font-bold text-white mt-0.5">{n}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                {body && <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{body}</p>}
                {extra}
              </div>
            </div>
          ))}
          <div className="mt-1 rounded-lg border border-green-100 bg-green-50 px-3 py-2.5 text-xs text-green-800">
            <strong>Repeat for each page.</strong> Load → open builder → Paste. Each funnel step gets its own content injected separately.
          </div>
        </div>
      </div>
    </div>
  );
}
