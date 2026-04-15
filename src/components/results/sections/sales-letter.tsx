"use client";

import { useState } from "react";
import { Copy, Check, Loader2, FileText } from "lucide-react";
import { ResultSection } from "../result-section";
import { toast } from "@/hooks/use-toast";
import type { LongFormSalesAssets } from "@/types/longform";

// ─── Placeholder ──────────────────────────────────────────────────────────────

interface LongFormPlaceholderProps {
  projectId: string;
  onGenerated: (assets: LongFormSalesAssets) => void;
}

export function LongFormPlaceholder({ projectId, onGenerated }: LongFormPlaceholderProps) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-longform", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { longFormAssets } = await res.json() as { longFormAssets: LongFormSalesAssets };
      onGenerated(longFormAssets);
      toast({ title: "Sales letter + ManyChat flow generated!", description: "Your long-form assets are ready." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
        <FileText className="h-7 w-7 text-violet-600" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Generate Sales Letter + ManyChat Flow</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">
        Create a long-form direct-response sales letter (3,000–5,000 words) and a complete ManyChat DM flow for organic lead nurture — both tailored to your challenge and audience.
      </p>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Generating… (this takes ~30 sec)</>
        ) : (
          <><FileText className="h-4 w-4" /> Generate Sales Letter + ManyChat</>
        )}
      </button>
    </div>
  );
}

// ─── Sales Letter Section ─────────────────────────────────────────────────────

interface SalesLetterSectionProps {
  data: LongFormSalesAssets["salesLetter"];
  projectId: string;
  onRegenerate: (assets: LongFormSalesAssets) => void;
}

export function SalesLetterSection({ data, projectId, onRegenerate }: SalesLetterSectionProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  async function handleCopyAll() {
    const lines: string[] = [
      data.headline,
      data.subheadline,
      "",
      data.openingHook,
      "",
      data.problemAgitation,
      "",
      data.bridgeToPossibility,
      "",
      data.coachCredentials,
      "",
      data.offerReveal,
      "",
      "WHAT YOU GET:",
      ...data.whatYouGet.map((item) => `• ${item.name}: ${item.description}`),
      "",
      data.socialProofFramework,
      "",
      "BONUSES:",
      ...data.bonusStack.map((b) => `• ${b.name} (${b.valueLabel}): ${b.description}`),
      "",
      data.priceReveal,
      "",
      "GUARANTEE:",
      data.guarantee,
      "",
      "FREQUENTLY ASKED QUESTIONS:",
      ...data.objectionHandling.map((qa) => `Q: ${qa.objection}\nA: ${qa.response}`),
      "",
      data.urgencySection,
      "",
      data.finalCta,
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    toast({ title: "Full sales letter copied!", description: "All sections copied as formatted text." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/generate-longform", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { longFormAssets } = await res.json() as { longFormAssets: LongFormSalesAssets };
      onRegenerate(longFormAssets);
      toast({ title: "Assets regenerated!", description: "Sales letter and ManyChat flow updated." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Regeneration failed", description: msg, variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Long-form direct-response sales letter. Copy each section into your page builder or email sequence.</p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {regenerating ? "Regenerating…" : "Regenerate all"}
          </button>
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy full letter</>
            }
          </button>
        </div>
      </div>

      <ResultSection title="Headline" content={data.headline} />
      <ResultSection title="Subheadline" content={data.subheadline} />
      <ResultSection title="Opening Hook" content={data.openingHook} />
      <ResultSection title="Problem Agitation" content={data.problemAgitation} />
      <ResultSection title="Bridge to Possibility" content={data.bridgeToPossibility} />
      <ResultSection title="Coach Credentials" content={data.coachCredentials} />
      <ResultSection title="Offer Reveal" content={data.offerReveal} />

      {/* What You Get */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <h3 className="text-sm font-semibold text-gray-700">What You Get</h3>
        </div>
        <div className="divide-y divide-gray-100 px-5">
          {data.whatYouGet.map((item, i) => (
            <div key={i} className="py-3">
              <p className="text-sm font-semibold text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <ResultSection title="Social Proof Framework" content={data.socialProofFramework} />

      {/* Bonus Stack */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <h3 className="text-sm font-semibold text-gray-700">Bonus Stack</h3>
        </div>
        <div className="divide-y divide-gray-100 px-5">
          {data.bonusStack.map((bonus, i) => (
            <div key={i} className="flex items-start justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{bonus.name}</p>
                <p className="text-sm text-gray-600">{bonus.description}</p>
              </div>
              <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                {bonus.valueLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ResultSection title="Price Reveal" content={data.priceReveal} />
      <ResultSection title="Guarantee" content={data.guarantee} />

      {/* Objection Handling */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <h3 className="text-sm font-semibold text-gray-700">Objection Handling (FAQ)</h3>
        </div>
        <div className="divide-y divide-gray-100 px-5">
          {data.objectionHandling.map((qa, i) => (
            <div key={i} className="py-3 space-y-1">
              <p className="text-sm font-semibold text-gray-900">Q: {qa.objection}</p>
              <p className="text-sm text-gray-600">A: {qa.response}</p>
            </div>
          ))}
        </div>
      </div>

      <ResultSection title="Urgency / Scarcity" content={data.urgencySection} />
      <ResultSection title="Final CTA" content={data.finalCta} />
    </div>
  );
}
