"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, TrendingUp, Loader2, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";
import type { UpsellSequence, UpsellEmail } from "@/types/upsell-sequence";

// ─── Email card ───────────────────────────────────────────────────────────────

function UpsellEmailCard({ email }: { email: UpsellEmail }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
            {email.day}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <p className="font-semibold text-gray-900 text-sm">{email.purpose}</p>
            </div>
            {!open && (
              <p className="mt-0.5 truncate text-xs text-gray-400 italic max-w-sm">{email.subject}</p>
            )}
          </div>
        </div>
        <div className="ml-3 shrink-0 text-gray-400">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Subject Line</p>
            <CopyableItem value={email.subject} />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Email Body</p>
            <CopyableItem value={email.body} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────

interface UpsellPlaceholderProps {
  projectId: string;
  onGenerated: (seq: UpsellSequence) => void;
}

export function UpsellPlaceholder({ projectId, onGenerated }: UpsellPlaceholderProps) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-upsell", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { upsellSequence } = await res.json() as { upsellSequence: UpsellSequence };
      onGenerated(upsellSequence);
      toast({ title: "Upsell sequence generated!", description: "Your post-challenge email sequence is ready." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
        {loading ? (
          <Loader2 className="h-7 w-7 text-orange-600 animate-spin" />
        ) : (
          <TrendingUp className="h-7 w-7 text-orange-600" />
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {loading ? "Generating your upsell sequence…" : "Generate Upsell Email Sequence"}
      </h3>
      {loading ? (
        <p className="mb-6 max-w-sm text-sm text-gray-500">
          This usually takes about 60 seconds — your post-challenge email sequence is being written.
        </p>
      ) : (
        <>
          <p className="mb-5 max-w-sm text-sm text-gray-500">
            Convert challenge completers into your next-tier offer with a post-challenge email sequence personalised to your programme.
          </p>
          <ul className="mb-6 w-full max-w-xs space-y-2 text-left">
            {[
              "5-email post-challenge sequence with subjects + full bodies",
              "Send-timing guide for each email",
              "SMS bump to recover non-openers",
              "Personalised to your next-tier offer and audience",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                {item}
              </li>
            ))}
          </ul>
          <span className="mb-4 inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 border border-orange-200">
            ⏱ Takes ~60 seconds
          </span>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
          >
            <TrendingUp className="h-4 w-4" /> Generate Upsell Sequence
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface UpsellSectionProps {
  data: UpsellSequence;
  projectId: string;
  onRegenerate: (seq: UpsellSequence) => void;
}

export function UpsellSection({ data, projectId, onRegenerate }: UpsellSectionProps) {
  const [regenerating, setRegenerating] = useState(false);
  const [copiedAll, setCopiedAll]       = useState(false);
  const [copiedSms, setCopiedSms]       = useState(false);

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/generate-upsell", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { upsellSequence } = await res.json() as { upsellSequence: UpsellSequence };
      onRegenerate(upsellSequence);
      toast({ title: "Upsell sequence regenerated!", description: "Your updated sequence is ready." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Regeneration failed", description: msg, variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  }

  async function handleCopyAll() {
    const lines: string[] = [
      "=== UPSELL EMAIL SEQUENCE ===",
      "",
      `Upsell Offer: ${data.targetOffer}`,
      "",
      data.overview,
      "",
    ];
    data.emails.forEach((email) => {
      lines.push(`=== DAY ${email.day} — ${email.purpose.toUpperCase()} ===`);
      lines.push(`Subject: ${email.subject}`);
      lines.push("");
      lines.push(email.body);
      lines.push("");
    });
    lines.push("=== SMS NUDGE ===");
    lines.push(data.smsNudge);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    toast({ title: "Upsell sequence copied!" });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  async function handleCopySms() {
    await navigator.clipboard.writeText(data.smsNudge);
    setCopiedSms(true);
    toast({ title: "SMS nudge copied!" });
    setTimeout(() => setCopiedSms(false), 2000);
  }

  return (
    <div className="space-y-5">

      {/* Top bar */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-gray-500">
          A 5-email post-challenge sequence sent over 14 days — designed to convert challenge completers into your next-tier offer at peak motivation.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {regenerating ? "Regenerating…" : "Regenerate"}
          </button>
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy all emails</>
            }
          </button>
        </div>
      </div>

      {/* Overview + target offer */}
      <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-orange-600 shrink-0" />
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Upsell Offer</p>
        </div>
        <p className="text-sm font-medium text-orange-900">{data.targetOffer}</p>
        <div className="h-px bg-orange-200" />
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Strategy</p>
        <p className="text-sm leading-relaxed text-orange-800">{data.overview}</p>
      </div>

      {/* Email sequence */}
      <div>
        <div className="flex items-center gap-2 pb-3">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-violet-50 text-violet-700">
            Email Sequence
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <p className="text-xs text-gray-400">5 emails · 14-day window</p>
        </div>
        <div className="space-y-2">
          {data.emails.map((email) => (
            <UpsellEmailCard key={email.day} email={email} />
          ))}
        </div>
      </div>

      {/* SMS nudge */}
      <div>
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700">
            SMS Nudge
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <button
            onClick={handleCopySms}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedSms
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy SMS</>
            }
          </button>
        </div>
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 mb-1">Send on Day 6 to non-email-openers</p>
              <p className="text-sm leading-relaxed text-gray-800">{data.smsNudge}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
