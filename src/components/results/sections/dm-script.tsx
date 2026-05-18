"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, MessageCircle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";
import type { InstagramDmScript, DmConversationScript } from "@/types/dm-script";

// ─── Path type badges ─────────────────────────────────────────────────────────

const PATH_COLOURS: Record<string, { label: string; badge: string }> = {
  coldOutreach:      { label: "Cold Outreach",       badge: "bg-slate-100 text-slate-700" },
  warmLead:          { label: "Warm Lead",            badge: "bg-emerald-50 text-emerald-700" },
  commentToDm:       { label: "Comment → DM",         badge: "bg-blue-50 text-blue-700" },
  applicationInquiry:{ label: "Application Enquiry",  badge: "bg-violet-50 text-violet-700" },
};

// ─── Conversation path card ───────────────────────────────────────────────────

function PathCard({ pathKey, script, defaultOpen }: {
  pathKey: string;
  script: DmConversationScript;
  defaultOpen?: boolean;
}) {
  const [open, setOpen]       = useState(defaultOpen ?? false);
  const [notesOpen, setNotes] = useState(false);
  const [copied, setCopied]   = useState(false);
  const meta = PATH_COLOURS[pathKey] ?? { label: pathKey, badge: "bg-gray-100 text-gray-700" };

  async function handleCopy() {
    const text = [
      `TRIGGER: ${script.trigger}`,
      "",
      `OPENER: ${script.opener}`,
      "",
      "FOLLOW-UPS:",
      ...script.followUps.map((f, i) => `${i + 1}. ${f}`),
      "",
      `BOOKING BRIDGE: ${script.bookingBridge}`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: `${meta.label} copied!` });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.badge}`}>
            {meta.label}
          </span>
          {!open && (
            <p className="truncate text-xs text-gray-400 italic">{script.trigger}</p>
          )}
        </div>
        <div className="ml-3 shrink-0 text-gray-400">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          {/* Trigger */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Trigger</p>
            <p className="text-sm text-gray-600 leading-relaxed">{script.trigger}</p>
          </div>

          {/* Opener */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Opener</p>
            <CopyableItem value={script.opener} />
          </div>

          {/* Follow-ups */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Follow-up Messages</p>
            <div className="space-y-2">
              {script.followUps.map((fu, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <CopyableItem value={fu} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking bridge */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Booking Bridge</p>
            <CopyableItem value={script.bookingBridge} />
          </div>

          {/* Coaching notes + copy row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setNotes((v) => !v)}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-600 hover:text-brand-700"
            >
              {notesOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              Coaching Notes
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {copied ? <><Check className="h-3 w-3 text-green-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy path</>}
            </button>
          </div>

          {notesOpen && (
            <div className="rounded-lg border border-brand-100 bg-brand-50 p-4">
              <p className="text-sm leading-relaxed text-brand-800">{script.coachingNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────

interface DmScriptPlaceholderProps {
  projectId: string;
  onGenerated: (script: InstagramDmScript) => void;
}

export function DmScriptPlaceholder({ projectId, onGenerated }: DmScriptPlaceholderProps) {
  const [loading, setLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  async function handleGenerate() {
    if (loading) return;
    setGenError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate-dm-script", {
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
      const json = await res.json() as { instagramDmScript: InstagramDmScript; isMock?: boolean };
      onGenerated(json.instagramDmScript);
      if (json.isMock) {
        toast({ title: "Demo scripts shown", description: "AI generation unavailable — displaying template scripts. Configure your API key for personalised output.", variant: "destructive" });
      } else {
        toast({ title: "DM scripts generated!", description: "Your Instagram conversation scripts are ready." });
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
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
        {loading ? (
          <Loader2 className="h-7 w-7 text-emerald-600 animate-spin" />
        ) : (
          <MessageCircle className="h-7 w-7 text-emerald-600" />
        )}
      </div>
      {genError && (
        <div className="mb-4 flex w-full max-w-sm items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <span>{genError}</span>
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {loading ? "Generating your DM scripts…" : "Generate Instagram DM Scripts"}
      </h3>
      {loading ? (
        <p className="mb-6 max-w-sm text-sm text-gray-500">
          This usually takes about 60 seconds — your personalised conversation scripts are being written.
        </p>
      ) : (
        <>
          <p className="mb-5 max-w-sm text-sm text-gray-500">
            Word-for-word Instagram conversation scripts for every lead type — personalised to your niche and offer.
          </p>
          <ul className="mb-6 w-full max-w-xs space-y-2 text-left">
            {[
              "4 complete conversation paths (cold, warm, comment-to-DM, inbound)",
              "Word-for-word scripts — not just templates",
              "Opener → follow-ups → booking bridge for each path",
              "Coaching notes + DM tips included",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
          <span className="mb-4 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
            ⏱ Takes ~60 seconds
          </span>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> {genError ? "Try again" : "Generate DM Scripts"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface DmScriptSectionProps {
  data: InstagramDmScript;
  projectId: string;
  onRegenerate: (script: InstagramDmScript) => void;
}

export function DmScriptSection({ data, projectId, onRegenerate }: DmScriptSectionProps) {
  const [regenerating, setRegenerating] = useState(false);
  const [confirming, setConfirming]     = useState(false);
  const [copiedAll, setCopiedAll]       = useState(false);
  const [copiedFollowUp, setCopiedFollowUp] = useState(false);

  const paths: Array<[string, DmConversationScript]> = [
    ["coldOutreach",       data.coldOutreach],
    ["warmLead",           data.warmLead],
    ["commentToDm",        data.commentToDm],
    ["applicationInquiry", data.applicationInquiry],
  ];

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/generate-dm-script", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { instagramDmScript } = await res.json() as { instagramDmScript: InstagramDmScript };
      onRegenerate(instagramDmScript);
      toast({ title: "DM scripts regenerated!", description: "Your updated scripts are ready." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Regeneration failed", description: msg, variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  }

  async function handleCopyAll() {
    const lines: string[] = [
      "=== INSTAGRAM DM SCRIPTS ===",
      "",
      data.overview,
      "",
    ];
    for (const [key, script] of paths) {
      const meta = PATH_COLOURS[key] ?? { label: key };
      lines.push(`=== ${meta.label.toUpperCase()} ===`);
      lines.push(`Trigger: ${script.trigger}`);
      lines.push("");
      lines.push(`Opener: ${script.opener}`);
      lines.push("");
      lines.push("Follow-ups:");
      script.followUps.forEach((f, i) => lines.push(`${i + 1}. ${f}`));
      lines.push("");
      lines.push(`Booking Bridge: ${script.bookingBridge}`);
      lines.push("");
      lines.push(`[Notes] ${script.coachingNotes}`);
      lines.push("");
    }
    lines.push("=== NO-RESPONSE FOLLOW-UP ===");
    lines.push(data.noResponseFollowUp);
    lines.push("");
    lines.push("=== DM TIPS ===");
    data.dmTips.forEach((tip, i) => lines.push(`${i + 1}. ${tip}`));
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    toast({ title: "All DM scripts copied!" });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  async function handleCopyFollowUp() {
    await navigator.clipboard.writeText(data.noResponseFollowUp);
    setCopiedFollowUp(true);
    toast({ title: "Follow-up message copied!" });
    setTimeout(() => setCopiedFollowUp(false), 2000);
  }

  return (
    <div className="space-y-5">

      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm text-gray-500">
          Four personalised Instagram DM conversation paths — from cold outreach to inbound enquiries — with word-for-word scripts, follow-ups, and booking bridges.
        </p>
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
            {regenerating ? "Regenerating…" : "Regenerate"}
          </button>
          )}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy all scripts</>
            }
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <MessageCircle className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-1">Strategy Overview</p>
            <p className="text-sm leading-relaxed text-emerald-900">{data.overview}</p>
          </div>
        </div>
      </div>

      {/* Conversation paths */}
      <div>
        <div className="flex items-center gap-2 pb-3">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700">
            Conversation Paths
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="space-y-2">
          {paths.map(([key, script], i) => (
            <PathCard key={key} pathKey={key} script={script} defaultOpen={i === 0} />
          ))}
        </div>
      </div>

      {/* No-response follow-up */}
      <div>
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700">
            No-Response Follow-Up
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <button
            onClick={handleCopyFollowUp}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedFollowUp
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy</>
            }
          </button>
        </div>
        <div className="mt-3">
          <CopyableItem value={data.noResponseFollowUp} />
        </div>
      </div>

      {/* DM Tips */}
      <div>
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700">
            DM Tips
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-5">
          <ul className="space-y-3">
            {data.dmTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-700">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
