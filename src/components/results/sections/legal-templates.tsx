"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Shield, Loader2, AlertCircle, CheckCircle2, FileText, FileWarning, FileCheck, BadgeDollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { LegalTemplates } from "@/types/generation";

// ─── Individual document card ─────────────────────────────────────────────────

function DocCard({
  title,
  description,
  icon: Icon,
  content,
  accentClass,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  content: string;
  accentClass: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast({ title: `${title} copied!` });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentClass}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{title}</p>
            {!open && <p className="mt-0.5 text-xs text-gray-400">{description}</p>}
          </div>
        </div>
        <div className="ml-3 shrink-0 text-gray-400">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">{description}</p>
            <button
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {copied
                ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
                : <><Copy className="h-3.5 w-3.5" /> Copy document</>
              }
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-100 max-h-96 overflow-y-auto font-mono">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────

interface LegalPlaceholderProps {
  projectId: string;
  onGenerated: (templates: LegalTemplates) => void;
}

export function LegalPlaceholder({ projectId, onGenerated }: LegalPlaceholderProps) {
  const [loading, setLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  async function handleGenerate() {
    if (loading) return;
    setGenError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate-legal", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string; retryAfter?: number };
        const msg = res.status === 429
          ? `Please wait ${err.retryAfter ?? 30}s before generating again.`
          : (err.error ?? `HTTP ${res.status}`);
        throw new Error(msg);
      }
      const json = await res.json() as { legalTemplates: LegalTemplates; isMock?: boolean };
      onGenerated(json.legalTemplates);
      if (json.isMock) {
        toast({ title: "Template kit generated", description: "No API key found — showing generic templates. Add your Anthropic key for personalised versions." });
      } else {
        toast({ title: "Legal kit generated!", description: "Your personalised legal documents are ready to review and customise." });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      setGenError(msg);
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        {loading
          ? <Loader2 className="h-7 w-7 text-slate-600 animate-spin" />
          : <Shield className="h-7 w-7 text-slate-600" />
        }
      </div>
      {genError && (
        <div className="mb-4 flex w-full max-w-sm items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <span>{genError}</span>
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {loading ? "Generating your legal kit…" : "Generate Legal Document Kit"}
      </h3>
      {loading ? (
        <p className="mb-6 max-w-sm text-sm text-gray-500">
          This takes about 60 seconds — your personalised legal documents are being drafted.
        </p>
      ) : (
        <>
          <p className="mb-5 max-w-sm text-sm text-gray-500">
            Four ready-to-use legal documents personalised to your business. Copy, customise, and have a solicitor review before use.
          </p>
          <ul className="mb-6 w-full max-w-xs space-y-2 text-left">
            {[
              "Service agreement — protect your coaching relationship",
              "Liability waiver — fitness & health disclaimer",
              "Challenge participation terms — community rules & IP",
              "Refund policy — clear, plain-English terms",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 max-w-sm text-left">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Important:</strong> These templates are a starting point, not legal advice. Have a qualified solicitor or attorney review before use.
            </p>
          </div>
          <span className="mb-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">
            ⏱ Takes ~60 seconds
          </span>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 rounded-xl bg-slate-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <Shield className="h-4 w-4" /> {genError ? "Try again" : "Generate Legal Kit"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface LegalSectionProps {
  data: LegalTemplates;
  projectId: string;
  onRegenerate: (templates: LegalTemplates) => void;
}

export function LegalSection({ data, projectId, onRegenerate }: LegalSectionProps) {
  const [regenerating, setRegenerating] = useState(false);
  const [confirming, setConfirming]     = useState(false);
  const [copiedAll, setCopiedAll]       = useState(false);

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/generate-legal", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { legalTemplates } = await res.json() as { legalTemplates: LegalTemplates };
      onRegenerate(legalTemplates);
      toast({ title: "Legal kit regenerated!" });
    } catch (err) {
      toast({ title: "Regeneration failed", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  }

  async function handleCopyAll() {
    const all = [
      "=== SERVICE AGREEMENT ===\n\n" + data.serviceAgreement,
      "\n\n=== LIABILITY WAIVER ===\n\n" + data.liabilityWaiver,
      "\n\n=== PARTICIPATION TERMS ===\n\n" + data.participationTerms,
      "\n\n=== REFUND POLICY ===\n\n" + data.refundPolicy,
    ].join("");
    await navigator.clipboard.writeText(all);
    setCopiedAll(true);
    toast({ title: "All legal documents copied!" });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  const docs = [
    {
      key: "serviceAgreement",
      title: "Service Agreement",
      description: "Coaching relationship, scope, payment, IP & confidentiality",
      icon: FileText,
      content: data.serviceAgreement,
      accentClass: "bg-slate-100 text-slate-700",
    },
    {
      key: "liabilityWaiver",
      title: "Liability Waiver",
      description: "Fitness & health disclaimer, assumption of risk, medical clearance",
      icon: FileWarning,
      content: data.liabilityWaiver,
      accentClass: "bg-amber-100 text-amber-700",
    },
    {
      key: "participationTerms",
      title: "Challenge Participation Terms",
      description: "Community rules, IP, privacy, photo permissions & conduct",
      icon: FileCheck,
      content: data.participationTerms,
      accentClass: "bg-emerald-100 text-emerald-700",
    },
    {
      key: "refundPolicy",
      title: "Refund Policy",
      description: "Clear, plain-English refund terms clients can actually understand",
      icon: BadgeDollarSign,
      content: data.refundPolicy,
      accentClass: "bg-blue-100 text-blue-700",
    },
  ];

  const jurisdictionLabel: Record<LegalTemplates["jurisdiction"], string> = {
    UK: "🇬🇧 UK-style language",
    US: "🇺🇸 US-style language",
    AU: "🇦🇺 AU-style language",
    generic: "🌍 Jurisdiction-neutral",
  };

  return (
    <div className="space-y-5">

      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-2">
            Four personalised legal documents for your coaching business. Copy each one, replace the [BRACKETED PLACEHOLDERS], and have a solicitor or attorney review before use.
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-700">
            {jurisdictionLabel[data.jurisdiction]}
          </span>
        </div>
        <div className="flex shrink-0 gap-2">
          {confirming && !regenerating ? (
            <span className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Replace existing documents?</span>
              <button onClick={() => { setConfirming(false); void handleRegenerate(); }} className="font-semibold text-red-600 hover:text-red-800">Yes</button>
              <span className="text-gray-300">·</span>
              <button onClick={() => setConfirming(false)} className="text-gray-400 hover:text-gray-600">No</button>
            </span>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              disabled={regenerating}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {regenerating ? "Regenerating…" : "Regenerate"}
            </button>
          )}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy all docs</>
            }
          </button>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-1">Important — not legal advice</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              These documents are AI-generated templates personalised to your business. They are a starting point only. Have a qualified solicitor (UK) or attorney (US/AU) review and approve them before use with clients.
            </p>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-2">
        {docs.map(({ key, ...doc }) => (
          <DocCard key={key} {...doc} />
        ))}
      </div>

    </div>
  );
}
