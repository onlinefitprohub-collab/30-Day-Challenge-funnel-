"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";
import type { SmsSequence } from "@/types/generation";

const smsLabels: Record<keyof SmsSequence, { label: string; description: string }> = {
  confirmation: { label: "SMS 1: Confirmation", description: "Sent immediately after opt-in" },
  reminder:     { label: "SMS 2: Reminder",     description: "Sent day before the call/event" },
  followUp:     { label: "SMS 3: Follow-up",    description: "Sent after the call or first session" },
  noShow:       { label: "SMS 4: No-show",      description: "For leads who didn't attend" },
  reEngagement: { label: "SMS 5: Re-engagement",description: "For cold leads after 7+ days" },
};

const SMS_KEYS = Object.keys(smsLabels) as Array<keyof SmsSequence>;

export function SmsSection({ data }: { data: SmsSequence }) {
  const [copiedAll, setCopiedAll] = useState(false);

  async function handleCopyAll() {
    const text = SMS_KEYS.map((key) => {
      const meta = smsLabels[key];
      return `${meta.label.toUpperCase()}\n${data[key]}`;
    }).join("\n\n---\n\n");

    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast({ title: "All SMS copied!", description: "5 messages copied as formatted text." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          5-part SMS sequence — each under 160 characters. Copy directly into your CRM or automation.
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

      {SMS_KEYS.map((key) => {
        const meta = smsLabels[key];
        const text = data[key];
        const charCount = text?.length ?? 0;

        return (
          <div key={key} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{meta.label}</p>
                <p className="text-xs text-gray-400">{meta.description}</p>
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
}
