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
            <p className="text-xs text-gray-400">Uses the Challenge Funnel Chrome extension — takes about 2 minutes to set up</p>
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

      {/* Divider before copy/paste guide */}
      <div className="border-b border-gray-200 pb-1">
        <p className="text-sm font-semibold text-gray-900">Manual copy &amp; paste guide</p>
        <p className="mt-0.5 text-xs text-gray-500">
          Prefer to paste text manually? Use the copy buttons below — each field maps to a specific element in the HighLevel page builder or automation builder.
        </p>
      </div>

      {/* Step 1 – Landing Page */}
      <HLGroup step={1} title="Landing Page" hlPath="Funnels & Websites → Funnels → [Your Funnel] → Page Builder">
        <HLField label="Page Headline" hlField="Headline element" value={lp?.headlineOptions?.[0] ?? ""} />
        {lp?.headlineOptions?.slice(1).map((h, i) => (
          <HLField key={i} label={`Headline Variant ${i + 2}`} hlField="A/B test option" value={h} />
        ))}
        <HLField label="Subheadline" hlField="Sub-headline element" value={lp?.subheadline ?? ""} />
        <HLField label="Bullet Points (all)" hlField="Bullet list element" value={lp?.bulletPoints?.join("\n") ?? ""} />
        <HLField label="CTA Button Text" hlField="Button element → Text" value={lp?.ctaText ?? ""} />
      </HLGroup>

      {/* Step 2 – Opt-in Form */}
      <HLGroup step={2} title="Opt-in Form" hlPath="Funnels & Websites → Funnels → [Step] → Form element">
        <HLField label="Form Intro / Header" hlField="Form Headline" value={form?.formIntroText ?? ""} />
        <HLField label="Submit Button Text" hlField="Form Button Label" value={form?.ctaButtonText ?? ""} />
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="mb-1.5 text-xs font-semibold text-gray-700">Recommended Fields</p>
          <p className="text-xs text-gray-400 mb-2">Add these fields to your HL form</p>
          <div className="flex flex-wrap gap-2">
            {form?.recommendedFields?.map((field, i) => (
              <span key={i} className="rounded-full bg-[#e8f0fe] px-3 py-1 text-xs font-medium text-[#1a56db]">
                {field}
              </span>
            ))}
          </div>
        </div>
      </HLGroup>

      {/* Step 3 – Thank You Page */}
      <HLGroup step={3} title="Thank You Page" hlPath="Funnels & Websites → Funnels → Thank You step → Page Builder">
        {ty?.confirmationMessage && (
          <HLField label="Confirmation Message" hlField="Headline element" value={ty.confirmationMessage} />
        )}
        {ty?.nextSteps?.length > 0 && (
          <HLField label="Next Steps" hlField="Text / paragraph element" value={ty.nextSteps.join("\n")} />
        )}
        {ty?.bookingEncouragement && (
          <HLField label="Booking Encouragement" hlField="Sub-headline or CTA element" value={ty.bookingEncouragement} />
        )}
      </HLGroup>

      {/* Step 4 – Email Sequence */}
      <HLGroup step={4} title="Email Sequence (10 emails)" hlPath="Automation → Workflows → Add Action → Send Email">
        <p className="text-xs text-gray-400 -mt-1">
          Create a workflow triggered on "Contact Created" or "Form Submitted". Add Send Email actions with the timing shown below.
        </p>
        {emailKeys.map((key, i) => {
          const email = emails?.[key];
          const timings = ["Immediately", "Day 1", "Day 2", "Day 4", "24h before challenge", "Challenge Day 1", "Challenge Day 15", "Challenge Day 28", "Challenge Day 30", "Day 37 (no conversion)"];
          return (
            <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">Email {i + 1}: {emailLabels[i]}</span>
                <span className="text-xs text-gray-400">· Send: {timings[i]}</span>
              </div>
              <HLField label="Subject Line" hlField="Email → Subject" value={email?.subject ?? ""} />
              <HLField label="Email Body" hlField="Email → Body" value={email?.body ?? ""} />
            </div>
          );
        })}
      </HLGroup>

      {/* Step 5 – SMS Sequence */}
      <HLGroup step={5} title="SMS Sequence (7 messages)" hlPath="Automation → Workflows → Add Action → Send SMS">
        <p className="text-xs text-gray-400 -mt-1">
          Add Send SMS actions to the same workflow with the timing shown below.
        </p>
        {([
          { key: "confirmation"           as const, label: "SMS 1: Confirmation",         timing: "Immediately" },
          { key: "challengeReminder"      as const, label: "SMS 2: Challenge Reminder",   timing: "24h before challenge" },
          { key: "dayOneKickoff"          as const, label: "SMS 3: Day 1 Kickoff",        timing: "Challenge Day 1 morning" },
          { key: "midChallengeMotivation" as const, label: "SMS 4: Midpoint Motivation",  timing: "Challenge Day 15" },
          { key: "noShow"                 as const, label: "SMS 5: No-Show Follow-up",    timing: "Trigger: no Day 1 activity" },
          { key: "challengeComplete"      as const, label: "SMS 6: Challenge Complete",   timing: "Challenge Day 30" },
          { key: "reEngagement"           as const, label: "SMS 7: Re-engagement",        timing: "Day 37 (no conversion)" },
        ]).map(({ key, label, timing }) => {
          const msg = sms?.[key] ?? "";
          return (
            <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                  <span className="text-xs text-gray-400">· Send: {timing}</span>
                  <span className={`text-[10px] font-medium ${msg.length > 160 ? "text-red-500" : "text-green-600"}`}>
                    {msg.length}/160 chars
                  </span>
                </div>
                <HLCopyButton value={msg} label={label} />
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg}</p>
            </div>
          );
        })}
      </HLGroup>

      {/* Step 6 – Ad Copy */}
      <HLGroup step={6} title="Ad Copy" hlPath="Marketing → Ads → Create Ad → Ad Creative">
        <p className="text-xs text-gray-400 -mt-1">
          In HL Ads Manager, create a campaign and paste these into the Ad Creative fields.
        </p>
        {ads?.hooks?.map((hook, i) => (
          <HLField key={i} label={`Hook ${i + 1} (Primary Text — first line)`} hlField="Ad → Primary Text" value={hook} />
        ))}
        {ads?.primaryTexts?.map((text, i) => (
          <HLField key={i} label={`Ad Body ${i + 1}`} hlField="Ad → Primary Text (full)" value={text} />
        ))}
        {ads?.headlines?.map((h, i) => (
          <HLField key={i} label={`Headline ${i + 1}`} hlField="Ad → Headline" value={h} />
        ))}
        {ads?.descriptions?.map((d, i) => (
          <HLField key={i} label={`Description ${i + 1}`} hlField="Ad → Description" value={d} />
        ))}
      </HLGroup>

      {/* Step 7 – Campaign Naming / UTM */}
      <HLGroup step={7} title="Campaign Names & UTM" hlPath="Marketing → Ads → Campaign Settings">
        <HLField label="Campaign Name" hlField="Campaign → Name field" value={campaign?.campaignName ?? ""} />
        <HLField label="Ad Set Naming" hlField="Ad Set → Name field" value={campaign?.adSetNamingConvention ?? ""} />
        <HLField label="Ad Naming" hlField="Ad → Name field" value={campaign?.adNamingConvention ?? ""} />
        <div className="rounded-lg border border-[#1a56db]/20 bg-[#f0f4ff] p-3">
          <p className="mb-1 text-xs font-semibold text-[#1a56db]">Full UTM String</p>
          <p className="mb-2 text-xs text-gray-500">Append to your landing page URL in HL → Funnel Settings → Custom Domain</p>
          <HLField
            label="UTM string"
            hlField="Funnel URL → append this"
            value={`?utm_source=${campaign?.utmSource}&utm_medium=${campaign?.utmMedium}&utm_campaign=${campaign?.utmCampaign}&utm_content=${campaign?.utmContent}`}
          />
        </div>
      </HLGroup>
    </div>
  );
}
