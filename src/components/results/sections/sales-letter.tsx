"use client";

import { useState } from "react";
import { Copy, Check, Loader2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { ResultSection } from "../result-section";
import { toast } from "@/hooks/use-toast";
import type { LongFormSalesAssets } from "@/types/longform";

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function FormattedBlock({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i} className={`text-sm text-gray-700 leading-relaxed ${i > 0 ? "mt-3" : ""}`}>
          {renderBold(p)}
        </p>
      ))}
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────

interface LongFormPlaceholderProps {
  projectId: string;
  onGenerated: (assets: LongFormSalesAssets) => void;
  /** When true the parent is already generating — show a spinner instead of a button */
  generating?: boolean;
}

export function LongFormPlaceholder({ projectId, onGenerated, generating }: LongFormPlaceholderProps) {
  const [loading, setLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  async function handleGenerate() {
    if (loading) return;
    setGenError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate-longform", {
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
      const json = await res.json() as { longFormAssets: LongFormSalesAssets; isMock?: boolean };
      onGenerated(json.longFormAssets);
      if (json.isMock) {
        toast({ title: "Demo assets shown", description: "No API key found — showing a template. Add your Anthropic key for personalised output." });
      } else {
        toast({ title: "Sales letter + ManyChat flow generated!", description: "Your long-form assets are ready." });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      setGenError(msg);
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  const isGenerating = loading || generating;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
        {isGenerating ? (
          <Loader2 className="h-7 w-7 text-violet-600 animate-spin" />
        ) : (
          <FileText className="h-7 w-7 text-violet-600" />
        )}
      </div>
      {genError && (
        <div className="mb-4 flex w-full max-w-sm items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <span>{genError}</span>
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {isGenerating ? "Generating your long-form assets…" : "Generate Sales Letter + ManyChat Flow"}
      </h3>
      {isGenerating ? (
        <p className="mb-6 max-w-sm text-sm text-gray-500">
          This usually takes 1–2 minutes — your sales letter and ManyChat DM flow are being written.
        </p>
      ) : (
        <>
          <p className="mb-5 max-w-sm text-sm text-gray-500">
            A long-form direct-response sales letter and a ManyChat DM flow — both tailored to your challenge and audience.
          </p>
          <ul className="mb-6 w-full max-w-xs space-y-2 text-left">
            {[
              "3,000–5,000 word direct-response sales letter",
              "Hook → problem → mechanism → proof → offer → guarantee → close",
              "ManyChat DM flow for organic Instagram lead nurture",
              "Written in your selected copywriter's style",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                {item}
              </li>
            ))}
          </ul>
          <span className="mb-4 inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 border border-violet-200">
            ⏱ Takes 1–2 minutes
          </span>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition-colors"
          >
            <FileText className="h-4 w-4" /> {genError ? "Try again" : "Generate Sales Letter + ManyChat"}
          </button>
        </>
      )}
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
  const [confirming, setConfirming]     = useState(false);

  async function handleCopyAll() {
    const lines: string[] = [
      data.headline,
      data.subheadline,
      "",
      data.painPointHeadline,
      "",
      data.openingHook,
      "",
      data.problemAgitation,
      "",
      ...(data.problemBreakdown ?? []).flatMap((p) => [p.title, p.headline, p.body, ""]),
      data.bridgeToPossibility,
      "",
      data.coachCredentials,
      "",
      data.offerReveal,
      "",
      "WHAT YOU GET:",
      ...data.whatYouGet.map((item) => `• ${item.name}: ${item.description}`),
      "",
      ...(data.testimonialCaseStudies ?? []).flatMap((cs) => [
        cs.sectionHeadline, cs.clientHeadline, `"${cs.quote}"`, cs.result, "",
      ]),
      ...(data.testimonialQuotes ?? []).map((q) => `"${q}"`),
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
      {/* Context */}
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-sm text-violet-900">
          <span className="font-semibold">How to use:</span> This 3,000–5,000 word sales letter can be used as: (1) A long-form landing page, (2) A multi-part email sequence (split into 5–7 emails), or (3) A PDF download to send cold traffic. Load into your page builder, GHL, or send via email.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">Long-form direct-response sales letter. Copy each section into your page builder or email sequence.</p>
        <div className="flex shrink-0 gap-2">
          {confirming && !regenerating ? (
            <span className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Replace existing content?</span>
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
            {regenerating ? "Regenerating…" : "Regenerate all"}
          </button>
          )}
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

      {/* Pain Point Headline */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-500">Pain Point Banner Headline</p>
        <p className="text-base font-bold text-blue-800 leading-snug">{data.painPointHeadline}</p>
      </div>

      {/* Opening Hook */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Opening Hook</p>
        <FormattedBlock text={data.openingHook} />
      </div>

      {/* Problem Agitation */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Problem Agitation</p>
        <FormattedBlock text={data.problemAgitation} />
      </div>

      {/* Problem Breakdown */}
      {data.problemBreakdown?.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
            <h3 className="text-sm font-semibold text-gray-700">Problem Breakdown</h3>
            <p className="text-xs text-gray-400 mt-0.5">The real reasons your audience hasn&apos;t succeeded yet — audience-specific, not generic</p>
          </div>
          <div className="divide-y divide-gray-100 px-5">
            {data.problemBreakdown.map((prob, i) => (
              <div key={i} className="py-4 space-y-2">
                <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-bold uppercase text-red-700">{prob.title}</span>
                <p className="text-sm font-bold text-gray-900 uppercase leading-snug">{prob.headline}</p>
                <FormattedBlock text={prob.body} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bridge to Possibility */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Bridge to Possibility</p>
        <FormattedBlock text={data.bridgeToPossibility} />
      </div>

      {/* Coach Credentials */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Coach Credentials</p>
        <FormattedBlock text={data.coachCredentials} />
      </div>

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

      {/* Testimonial Case Studies */}
      {data.testimonialCaseStudies?.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
            <h3 className="text-sm font-semibold text-gray-700">Testimonial Case Studies</h3>
            <p className="text-xs text-gray-400 mt-0.5">Generated from your wizard social proof data</p>
          </div>
          <div className="divide-y divide-gray-100 px-5">
            {data.testimonialCaseStudies.map((cs, i) => (
              <div key={i} className="py-4 space-y-2">
                <div className="rounded bg-blue-600 px-3 py-1.5 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-white">{cs.sectionHeadline}</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{cs.clientHeadline}</p>
                <p className="text-sm text-gray-600 italic leading-relaxed">&ldquo;{cs.quote}&rdquo;</p>
                <span className="inline-block rounded bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">{cs.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonial Quotes Grid */}
      {data.testimonialQuotes?.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
            <h3 className="text-sm font-semibold text-gray-700">Testimonial Image Captions</h3>
            <p className="text-xs text-gray-400 mt-0.5">Short quotes for the before/after image grid — paste under each image in GHL</p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-5">
            {data.testimonialQuotes.map((quote, i) => (
              <div key={i} className="rounded-lg bg-blue-600 px-3 py-2 text-center">
                <p className="text-xs font-semibold text-white leading-snug">&ldquo;{quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Proof Framework */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Social Proof Framework</p>
        <FormattedBlock text={data.socialProofFramework} />
      </div>

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

      {/* Price Reveal */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Price Reveal</p>
        <FormattedBlock text={data.priceReveal} />
      </div>

      {/* Guarantee */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Guarantee</p>
        <FormattedBlock text={data.guarantee} />
      </div>

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

      {/* Urgency */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Urgency / Scarcity</p>
        <FormattedBlock text={data.urgencySection} />
      </div>

      {/* Final CTA */}
      <div className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-orange-500">Final CTA</p>
        <FormattedBlock text={data.finalCta} className="text-orange-900" />
      </div>
    </div>
  );
}
