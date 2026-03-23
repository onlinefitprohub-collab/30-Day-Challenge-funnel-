"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink, Download, LayoutTemplate } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { GeneratedFunnelAssets } from "@/types/generation";
import { generateGhlImportJson } from "@/lib/highlevel/ghl-export";

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

  const emailKeys = ["welcome", "reminder", "objectionHandling", "lastChance", "reEngagement"] as const;
  const emailLabels = ["Welcome", "Reminder", "Objection Handling", "Last Chance", "Re-engagement"];

  function handleDownload() {
    const importJson = generateGhlImportJson(data);
    const blob = new Blob([JSON.stringify(importJson, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${importJson.name.replace(/\s+/g, "-").toLowerCase()}-ghl-funnel.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Funnel downloaded!", description: "Import it in HighLevel — see the steps below." });
  }

  return (
    <div className="space-y-5">

      {/* Tip: use Funnel Preview to clone pages */}
      <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3.5">
        <LayoutTemplate className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
        <p className="text-sm text-indigo-800">
          <strong>Want to clone pages directly into HighLevel?</strong>{" "}
          Switch to the{" "}
          <button
            className="font-semibold underline underline-offset-2 hover:text-indigo-600"
            onClick={() => {
              const preview = document.querySelector<HTMLButtonElement>('[data-tab="funnelPreview"]');
              preview?.click();
            }}
          >
            Funnel Preview
          </button>{" "}
          tab to inject each page as native HighLevel elements with one click.
        </p>
      </div>

      {/* Import card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Download className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">Download &amp; import your funnel</p>
            <p className="mt-0.5 text-sm text-gray-500">
              Download the full funnel as a HighLevel-compatible file, then import it in under a minute.
              No API key required.
            </p>
            <button
              onClick={handleDownload}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Funnel JSON
            </button>
            <div className="mt-4 space-y-1.5">
              {[
                "Open HighLevel → Funnels & Websites → Funnels",
                "Click ⋯ in the top right → Import Funnel",
                "Select the JSON file you just downloaded",
                "All 4 pages appear — edit and publish",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-gray-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Paste guide header */}
      <div className="border-b border-gray-200 pb-1">
        <p className="text-sm font-semibold text-gray-900">Copy &amp; paste guide</p>
        <p className="mt-0.5 text-xs text-gray-500">
          Each section maps directly to a field inside HighLevel. Use the copy buttons to fill in content one field at a time.
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
      <HLGroup step={4} title="Email Sequence (5 emails)" hlPath="Automation → Workflows → Add Action → Send Email">
        <p className="text-xs text-gray-400 -mt-1">
          Create a workflow triggered on "Contact Created" or "Form Submitted". Add 5 Send Email actions with the delays shown.
        </p>
        {emailKeys.map((key, i) => {
          const email = emails?.[key];
          const delays = ["Immediately", "After 24h", "After 48h", "After 72h", "After 7 days"];
          return (
            <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">Email {i + 1}: {emailLabels[i]}</span>
                <span className="text-xs text-gray-400">· Send: {delays[i]}</span>
              </div>
              <HLField label="Subject Line" hlField="Email → Subject" value={email?.subject ?? ""} />
              <HLField label="Email Body" hlField="Email → Body" value={email?.body ?? ""} />
            </div>
          );
        })}
      </HLGroup>

      {/* Step 5 – SMS Sequence */}
      <HLGroup step={5} title="SMS Sequence (5 messages)" hlPath="Automation → Workflows → Add Action → Send SMS">
        <p className="text-xs text-gray-400 -mt-1">
          Add Send SMS actions to the same workflow, staggered with time delays.
        </p>
        {([
          { key: "confirmation",  label: "SMS 1: Confirmation",  delay: "Immediately" },
          { key: "reminder",      label: "SMS 2: Reminder",      delay: "Day 3" },
          { key: "followUp",      label: "SMS 3: Follow-up",     delay: "Day 7" },
          { key: "noShow",        label: "SMS 4: No-show",       delay: "Day 14" },
          { key: "reEngagement",  label: "SMS 5: Re-engagement", delay: "Day 21" },
        ] as const).map(({ key, label, delay }) => {
          const msg = sms?.[key] ?? "";
          return (
            <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                  <span className="text-xs text-gray-400">· Send: {delay}</span>
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
