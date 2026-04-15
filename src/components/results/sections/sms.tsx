"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";
import type { SmsSequence } from "@/types/generation";

interface SmsMeta {
  label: string;
  timing: string;
  phase: "pre" | "during" | "post";
}

const smsLabels: Record<keyof SmsSequence, SmsMeta> = {
  // Pre-Challenge
  confirmation:           { label: "SMS 1: Confirmation",       timing: "Immediately after opt-in",    phase: "pre" },
  challengeReminder:      { label: "SMS 2: Challenge Reminder",  timing: "24h before challenge starts", phase: "pre" },
  // During Challenge
  dayOneKickoff:          { label: "SMS 3: Day 1 Kickoff",       timing: "Challenge Day 1 morning",     phase: "during" },
  midChallengeMotivation: { label: "SMS 4: Midpoint Motivation", timing: "Challenge Day 15",            phase: "during" },
  noShow:                 { label: "SMS 5: No-Show Follow-up",   timing: "Triggered — no Day 1 activity", phase: "during" },
  // Post-Challenge
  challengeComplete:      { label: "SMS 6: Challenge Complete",  timing: "Challenge Day 30",            phase: "post" },
  reEngagement:           { label: "SMS 7: Re-engagement",       timing: "Day 37 — no conversion",      phase: "post" },
};

const PHASE_LABELS: Record<"pre" | "during" | "post", string> = {
  pre:    "Pre-Challenge",
  during: "During Challenge",
  post:   "Post-Challenge",
};

const SMS_KEYS = Object.keys(smsLabels) as Array<keyof SmsSequence>;

export function SmsSection({ data }: { data: SmsSequence }) {
  const [copiedAll, setCopiedAll] = useState(false);

  async function handleCopyAll() {
    const text = SMS_KEYS.map((key) => {
      const meta = smsLabels[key];
      return `${meta.label.toUpperCase()} — Send: ${meta.timing}\n${data[key]}`;
    }).join("\n\n---\n\n");

    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast({ title: "All SMS copied!", description: "7 messages copied as formatted text." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  const phases: Array<"pre" | "during" | "post"> = ["pre", "during", "post"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          7-message lifecycle sequence — each under 160 characters. Copy directly into your CRM or automation.
        </p>
        <button
          onClick={handleCopyAll}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {copiedAll
            ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
            : <><Copy className="h-3.5 w-3.5" /> Copy all SMS</>
          }
        </button>
      </div>

      {phases.map((phase) => {
        const keysInPhase = SMS_KEYS.filter((k) => smsLabels[k].phase === phase);
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
              const meta = smsLabels[key];
              const text = data[key];
              const charCount = text?.length ?? 0;

              return (
                <div key={key} className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{meta.label}</p>
                      <p className="text-xs text-gray-400">Send: {meta.timing}</p>
                    </div>
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded-full ${
                        charCount > 160
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {charCount}/160
                    </span>
                  </div>
                  <CopyableItem value={text} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
