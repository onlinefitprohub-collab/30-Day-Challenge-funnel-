"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";
import type { EmailSequence } from "@/types/generation";

const emailMeta: Record<
  keyof EmailSequence,
  { label: string; description: string }
> = {
  welcome:           { label: "Email 1: Welcome",             description: "Sent immediately after opt-in" },
  reminder:          { label: "Email 2: Reminder",            description: "Sent 24h before call/start" },
  objectionHandling: { label: "Email 3: Objection Handling",  description: "For hesitant leads" },
  lastChance:        { label: "Email 4: Last Chance",         description: "Final nudge before deadline" },
  reEngagement:      { label: "Email 5: Re-engagement",       description: "For cold/unresponsive leads" },
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
      return `${meta.label.toUpperCase()}\nSubject: ${email.subject}\n\n${email.body}`;
    }).join("\n\n---\n\n");

    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast({ title: "All emails copied!", description: "5 emails copied as formatted text." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          5-part email sequence. Click each email to expand and copy.
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

      {EMAIL_KEYS.map((key) => {
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
                <p className="font-semibold text-gray-900">{meta.label}</p>
                <p className="text-xs text-gray-400">{meta.description}</p>
                {!isOpen && email.subject && (
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
}
