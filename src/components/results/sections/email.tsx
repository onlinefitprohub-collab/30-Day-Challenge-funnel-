"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";
import type { EmailSequence } from "@/types/generation";

interface EmailMeta {
  label: string;
  timing: string;
  phase: "pre" | "during" | "post";
}

const emailMeta: Record<keyof EmailSequence, EmailMeta> = {
  // Pre-Challenge
  welcome:           { label: "Email 1: Welcome",            timing: "Immediately after opt-in",    phase: "pre" },
  valueDelivery:     { label: "Email 2: Quick Win",          timing: "Day 1",                       phase: "pre" },
  socialProof:       { label: "Email 3: Success Story",      timing: "Day 2",                       phase: "pre" },
  objectionHandling: { label: "Email 4: Objection Handling", timing: "Day 4",                       phase: "pre" },
  lastChance:        { label: "Email 5: Last Chance",        timing: "24h before challenge starts", phase: "pre" },
  // During Challenge
  dayOneKickoff:     { label: "Email 6: Day 1 Kickoff",      timing: "Challenge Day 1",             phase: "during" },
  midChallenge:      { label: "Email 7: Midpoint Check-in",  timing: "Challenge Day 15",            phase: "during" },
  finalStretch:      { label: "Email 8: Final Stretch",      timing: "Challenge Day 28",            phase: "during" },
  // Post-Challenge
  challengeComplete: { label: "Email 9: Challenge Complete", timing: "Challenge Day 30",            phase: "post" },
  reEngagement:      { label: "Email 10: Re-engagement",     timing: "Day 37 — no conversion",      phase: "post" },
};

const PHASE_LABELS: Record<"pre" | "during" | "post", string> = {
  pre:    "Pre-Challenge",
  during: "During Challenge",
  post:   "Post-Challenge",
};

const EMAIL_KEYS = Object.keys(emailMeta) as Array<keyof EmailSequence>;

export function EmailSection({ data }: { data: EmailSequence }) {
  const [openEmails, setOpenEmails] = useState<Set<keyof EmailSequence>>(
    new Set<keyof EmailSequence>(["welcome"])
  );
  const [copiedAll, setCopiedAll] = useState(false);

  function toggleEmail(key: keyof EmailSequence) {
    setOpenEmails((prev: Set<keyof EmailSequence>) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleExpandAll() {
    if (openEmails.size < EMAIL_KEYS.length) {
      setOpenEmails(new Set(EMAIL_KEYS));
    } else {
      setOpenEmails(new Set());
    }
  }

  async function handleCopyAll() {
    const text = EMAIL_KEYS.map((key) => {
      const meta = emailMeta[key];
      const email = data[key];
      return `${meta.label.toUpperCase()} — Send: ${meta.timing}\nSubject: ${email.subject}\n\n${email.body}`;
    }).join("\n\n---\n\n");

    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast({ title: "All emails copied!", description: "10 emails copied as formatted text." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  // Group keys by phase for section dividers
  const phases: Array<"pre" | "during" | "post"> = ["pre", "during", "post"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          10-email lifecycle sequence — pre-challenge, during, and post-challenge.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleExpandAll}
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            {openEmails.size < EMAIL_KEYS.length ? "Expand all" : "Collapse all"}
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

      {phases.map((phase) => {
        const keysInPhase = EMAIL_KEYS.filter((k) => emailMeta[k].phase === phase);
        return (
          <div key={phase} className="space-y-2">
            <div className="flex items-center gap-2 pt-1">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                phase === "pre"
                  ? "bg-blue-50 text-blue-700"
                  : phase === "during"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-purple-50 text-purple-700"
              }`}>
                {PHASE_LABELS[phase]}
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {keysInPhase.map((key) => {
              const meta = emailMeta[key];
              const email = data[key];
              const isOpen = openEmails.has(key);

              return (
                <div key={key} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <button
                    onClick={() => toggleEmail(key)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{meta.label}</p>
                        <span className="text-xs text-gray-400 hidden sm:block">·</span>
                        <span className="text-xs text-gray-400 hidden sm:block">Send: {meta.timing}</span>
                      </div>
                      <p className="text-xs text-gray-400 sm:hidden">Send: {meta.timing}</p>
                      {!isOpen && email?.subject && (
                        <p className="mt-0.5 truncate text-xs text-gray-400 italic max-w-sm">
                          {email.subject}
                        </p>
                      )}
                    </div>
                    <div className="ml-3 shrink-0 text-sm text-gray-400">
                      {isOpen ? "▲" : "▼"}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Subject Line
                        </p>
                        <CopyableItem value={email.subject} />
                      </div>
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Email Body
                        </p>
                        <CopyableItem value={email.body} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
