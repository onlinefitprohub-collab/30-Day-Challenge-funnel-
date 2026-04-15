"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";
import type { ManyChatFlow } from "@/types/longform";

const MESSAGE_LABELS: Array<{
  key: keyof ManyChatFlow;
  label: string;
  description: string;
  isNote?: boolean;
}> = [
  { key: "welcomeMessage",      label: "Welcome Message",       description: "First message when someone DMs" },
  { key: "qualificationQ1",     label: "Qualifier 1",           description: "First qualifying question + quick replies" },
  { key: "qualificationQ2",     label: "Qualifier 2",           description: "Second qualifying question + quick replies" },
  { key: "challengeOverview",   label: "Challenge Overview",    description: "Brief challenge description (under 300 chars)" },
  { key: "signupCta",           label: "Sign-up CTA",           description: "Direct to sign-up link (use {{signup_link}})" },
  { key: "registrationConfirm", label: "Registration Confirm",  description: "Sent after they confirm registration" },
  { key: "dayOneReminder",      label: "Day 1 Reminder",        description: "Kick-off message on Day 1" },
  { key: "midpointCheckIn",     label: "Midpoint Check-in",     description: "Day 15 check-in message" },
  { key: "noShowFollowUp",      label: "No-show Follow-up",     description: "For leads who haven't started" },
  { key: "setupInstructions",   label: "Setup Instructions",    description: "Coach guidance for configuring in ManyChat", isNote: true },
];

function charBadge(text: string) {
  const count = text.length;
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${count > 300 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
      {count}/300
    </span>
  );
}

interface ManyChatFlowSectionProps {
  data: ManyChatFlow;
}

export function ManyChatFlowSection({ data }: ManyChatFlowSectionProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  async function handleCopyAll() {
    const lines: string[] = [];
    for (const meta of MESSAGE_LABELS) {
      const raw = data[meta.key];
      lines.push(`── ${meta.label.toUpperCase()} ──`);
      if (typeof raw === "string") {
        lines.push(raw);
      } else if (raw && typeof raw === "object" && "message" in raw) {
        const msg = raw as { message: string; quickReplies: string[] };
        lines.push(msg.message);
        lines.push(`Quick Replies: ${msg.quickReplies.join(" | ")}`);
      }
      lines.push("");
    }
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    toast({ title: "ManyChat flow copied!", description: "All messages copied as formatted text." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Facebook Messenger / Instagram DM flow — 9 messages + setup instructions. Paste directly into ManyChat.
        </p>
        <button
          onClick={handleCopyAll}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {copiedAll
            ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
            : <><Copy className="h-3.5 w-3.5" /> Copy all messages</>
          }
        </button>
      </div>

      {MESSAGE_LABELS.map((meta) => {
        const raw = data[meta.key];

        if (meta.isNote) {
          return (
            <div key={meta.key} className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-amber-900">{meta.label}</p>
                  <p className="text-xs text-amber-600">{meta.description}</p>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm text-amber-800">{String(raw)}</p>
            </div>
          );
        }

        if (typeof raw === "string") {
          return (
            <div key={meta.key} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{meta.label}</p>
                  <p className="text-xs text-gray-400">{meta.description}</p>
                </div>
                {charBadge(raw)}
              </div>
              <CopyableItem value={raw} />
            </div>
          );
        }

        // ManyChatMessage (qualificationQ1/Q2)
        if (raw && typeof raw === "object" && "message" in raw) {
          const msg = raw as { message: string; quickReplies: string[] };
          return (
            <div key={meta.key} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{meta.label}</p>
                  <p className="text-xs text-gray-400">{meta.description}</p>
                </div>
                {charBadge(msg.message)}
              </div>
              <CopyableItem value={msg.message} />
              {msg.quickReplies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.quickReplies.map((reply, i) => (
                    <span
                      key={i}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${reply.length > 20 ? "border-red-200 bg-red-50 text-red-700" : "border-gray-200 bg-gray-100 text-gray-700"}`}
                    >
                      {reply}
                      {reply.length > 20 && <span className="ml-1 text-red-500">({reply.length}/20)</span>}
                    </span>
                  ))}
                  <span className="text-xs text-gray-400 self-center">Quick Replies</span>
                </div>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
