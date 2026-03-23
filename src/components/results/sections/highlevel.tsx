"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink, Zap, Loader2, CheckCircle2, AlertCircle, Settings, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { GeneratedFunnelAssets } from "@/types/generation";
import type { HLImportResult } from "@/lib/highlevel/import";
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

function HLField({
  label,
  hlField,
  value,
}: {
  label: string;
  hlField: string;
  value: string;
}) {
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

function HLGroup({
  step,
  title,
  hlPath,
  children,
}: {
  step: number;
  title: string;
  hlPath: string;
  children: React.ReactNode;
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

/* ── GHL JSON Download Panel ── */
function GhlDownloadPanel({ data }: { data: GeneratedFunnelAssets }) {
  function handleDownload() {
    const importJson = generateGhlImportJson(data);
    const blob = new Blob([JSON.stringify(importJson, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${importJson.name.replace(/\s+/g, "-").toLowerCase()}-ghl-funnel.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded!", description: "Import the JSON file in HighLevel → Funnels → Import." });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white">
          <Download className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">Download Funnel JSON</p>
          <p className="mt-0.5 text-xs text-gray-500">
            Backup option — download the funnel as a GHL-compatible JSON file and import it manually
            via <span className="font-medium text-gray-700">Funnels &amp; Websites → Funnels → Import Funnel</span>.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download GHL Funnel JSON
            </button>
            <span className="text-xs text-gray-400">4 funnel pages · full HTML bodies</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type ImportState = "idle" | "importing" | "success" | "error";

const PROGRESS_STEPS = [
  "Connecting to HighLevel…",
  "Creating funnel…",
  "Building landing page…",
  "Building opt-in page…",
  "Building thank-you page…",
  "Building booking page…",
  "Writing native page elements…",
  "Wrapping up…",
];

interface Props {
  data: GeneratedFunnelAssets;
  projectId: string;
  hlConnected: boolean;
}

export function HighLevelSection({ data, projectId, hlConnected }: Props) {
  const lp = data.landingPage;
  const form = data.optInForm;
  const ty = data.thankYouPage;
  const emails = data.emailSequence;
  const sms = data.smsSequence;
  const ads = data.adCopy;
  const campaign = data.campaignNaming;

  const [importState, setImportState] = useState<ImportState>("idle");
  const [progressIdx, setProgressIdx] = useState(0);
  const [importResult, setImportResult] = useState<HLImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startProgressCycle() {
    setProgressIdx(0);
    progressIntervalRef.current = setInterval(() => {
      setProgressIdx((i) => (i + 1) % PROGRESS_STEPS.length);
    }, 1100);
  }

  function stopProgressCycle() {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }

  useEffect(() => {
    return () => stopProgressCycle();
  }, []);

  async function handleImport() {
    setImportState("importing");
    setImportError(null);
    setImportResult(null);
    startProgressCycle();

    try {
      const res = await fetch("/api/highlevel/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      stopProgressCycle();
      const json = (await res.json()) as HLImportResult & { error?: string };

      if (!res.ok) {
        setImportError(json.error ?? "Import failed. Please try again.");
        setImportState("error");
        return;
      }

      setImportResult(json);

      if (json.funnelId) {
        setImportState("success");
        const nativeCount = json.nativePages?.filter((p) => p.written).length ?? 0;
        toast({
          title: "Imported to HighLevel!",
          description: nativeCount > 0
            ? `Funnel created with ${nativeCount} native page${nativeCount !== 1 ? "s" : ""}.`
            : "Funnel created in HighLevel.",
        });
      } else if (json.errors.length > 0) {
        setImportError(json.errors[0]);
        setImportState("error");
      } else {
        setImportError("Nothing was imported. Check your HighLevel credentials.");
        setImportState("error");
      }
    } catch (err) {
      stopProgressCycle();
      setImportError(err instanceof Error ? err.message : "Network error. Please try again.");
      setImportState("error");
    }
  }

  const emailKeys = ["welcome", "reminder", "objectionHandling", "lastChance", "reEngagement"] as const;
  const emailLabels = ["Welcome", "Reminder", "Objection Handling", "Last Chance", "Re-engagement"];

  return (
    <div className="space-y-5">

      {/* One-click import banner */}
      <div className="rounded-xl border border-[#1a56db]/30 bg-gradient-to-br from-[#f0f4ff] to-[#e8f0fe] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a56db] text-white">
            <Zap className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#1a56db]">Push to HighLevel — Native Pages</p>
            <p className="mt-0.5 text-sm text-gray-600">
              Create your funnel and push all 4 pages as native editable elements directly into your HighLevel account. Connect your credentials in{" "}
              <Link href="/account" className="underline underline-offset-2 hover:text-[#1a56db]">
                Account Settings
              </Link>{" "}
              first.
            </p>

            <div className="mt-4">
              {/* Not connected */}
              {!hlConnected && importState === "idle" && (
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 rounded-lg bg-[#1a56db] px-4 py-2 text-sm font-medium text-white hover:bg-[#1245b5] transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Connect HighLevel first →
                  </Link>
                  <span className="text-xs text-gray-500">Then return here to import</span>
                </div>
              )}

              {/* Connected — idle */}
              {hlConnected && importState === "idle" && (
                <button
                  onClick={handleImport}
                  className="flex items-center gap-2 rounded-lg bg-[#1a56db] px-4 py-2 text-sm font-medium text-white hover:bg-[#1245b5] transition-colors"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Import to HighLevel
                </button>
              )}

              {/* Importing */}
              {importState === "importing" && (
                <div className="flex items-center gap-2 text-sm font-medium text-[#1a56db]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {PROGRESS_STEPS[progressIdx]}
                </div>
              )}

              {/* Success */}
              {importState === "success" && importResult && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Import complete!
                  </div>
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 space-y-2">
                    {importResult.funnelId && (
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold text-green-800">Funnel created</span>
                          <span className="text-green-600 font-mono">ID: {importResult.funnelId}</span>
                        </div>
                        {importResult.funnelSteps && importResult.funnelSteps.length > 0 && (
                          <ul className="space-y-0.5 mb-1.5">
                            {importResult.funnelSteps.map((s) => (
                              <li key={s.id} className="flex items-center gap-1.5 text-xs text-green-700">
                                <Check className="h-3 w-3 text-green-600 shrink-0" />
                                <span>{s.name}</span>
                                {s.nativePage && (
                                  <span className="ml-1 rounded bg-green-200 px-1.5 py-0.5 text-[10px] font-semibold text-green-800">
                                    native elements
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                        {importResult.nativePages && importResult.nativePages.some((p) => !p.written) && (
                          <p className="text-xs text-amber-600 mt-1">
                            ⚠ Some native page elements couldn&apos;t be written — download the JSON below as a fallback.
                          </p>
                        )}
                        {importResult.funnelUrl && (
                          <a
                            href={importResult.funnelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-medium text-[#1a56db] hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Open funnel in HighLevel
                          </a>
                        )}
                      </div>
                    )}
                    {importResult.errors.length > 0 && (
                      <div className={importResult.funnelId ? "pt-1 border-t border-green-200" : ""}>
                        <p className="text-xs text-amber-700 font-medium mb-1">Partial issues:</p>
                        {importResult.errors.map((e, i) => (
                          <p key={i} className="text-xs text-amber-600">{e}</p>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => { setImportState("idle"); setImportResult(null); }}
                    className="text-xs text-[#1a56db] underline underline-offset-2 hover:text-[#1245b5]"
                  >
                    Import again
                  </button>
                </div>
              )}

              {/* Error */}
              {importState === "error" && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                    <p className="text-sm text-red-700">{importError}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleImport}
                      className="text-xs font-medium text-[#1a56db] underline underline-offset-2 hover:text-[#1245b5]"
                    >
                      Try again
                    </button>
                    <span className="text-xs text-gray-400">·</span>
                    <Link
                      href="/account"
                      className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-700"
                    >
                      Check credentials
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* GHL Funnel JSON Download */}
      <GhlDownloadPanel data={data} />

      {/* Paste guide header */}
      <div className="rounded-xl border border-[#1a56db]/20 bg-[#f0f4ff] p-4">
        <p className="text-sm font-semibold text-[#1a56db]">HighLevel Paste Guide</p>
        <p className="mt-1 text-sm text-[#374151]">
          Each section below maps directly to a HighLevel area. Copy the content and paste it into the matching field.
          Use the step numbers to follow along in HL.
        </p>
      </div>

      {/* Step 1 – Funnel Builder / Landing Page */}
      <HLGroup step={1} title="Landing Page" hlPath="Funnels & Websites → Funnels → [Your Funnel] → Page Builder">
        <HLField
          label="Page Headline"
          hlField="Headline element"
          value={lp?.headlineOptions?.[0] ?? ""}
        />
        {lp?.headlineOptions?.slice(1).map((h, i) => (
          <HLField
            key={i}
            label={`Headline Variant ${i + 2}`}
            hlField="A/B test option"
            value={h}
          />
        ))}
        <HLField label="Subheadline" hlField="Sub-headline element" value={lp?.subheadline ?? ""} />
        <HLField
          label="Bullet Points (all)"
          hlField="Bullet list element"
          value={lp?.bulletPoints?.join("\n") ?? ""}
        />
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
          <HLField
            label="Next Steps"
            hlField="Text / paragraph element"
            value={ty.nextSteps.join("\n")}
          />
        )}
        {ty?.bookingEncouragement && (
          <HLField label="Booking Encouragement" hlField="Sub-headline or CTA element" value={ty.bookingEncouragement} />
        )}
      </HLGroup>

      {/* Step 4 – Email Automation */}
      <HLGroup step={4} title="Email Sequence (5 emails)" hlPath="Automation → Workflows → Add Action → Send Email">
        <p className="text-xs text-gray-400 -mt-1">
          Create a workflow triggered on "Contact Created" or "Form Submitted". Add 5 Send Email actions with the delays shown.
        </p>
        {emailKeys.map((key, i) => {
          const email = emails?.[key];
          const delays = ["Immediately", "After 24h", "After 48h", "After 72h", "After 7 days"];
          return (
            <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-700">Email {i + 1}: {emailLabels[i]}</span>
                  <span className="ml-2 text-xs text-gray-400">Send: {delays[i]}</span>
                </div>
              </div>
              <HLField label="Subject Line" hlField="Email → Subject" value={email?.subject ?? ""} />
              <HLField label="Email Body" hlField="Email → Body" value={email?.body ?? ""} />
            </div>
          );
        })}
      </HLGroup>

      {/* Step 5 – SMS Automation */}
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
                <div>
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                  <span className="ml-2 text-xs text-gray-400">Send: {delay}</span>
                  <span className={`ml-2 text-[10px] font-medium ${msg.length > 160 ? "text-red-500" : "text-green-600"}`}>
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

      {/* Step 6 – Ad Manager */}
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
