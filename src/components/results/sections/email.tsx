"use client";

import { useState } from "react";
import { CopyableItem } from "../result-section";
import type { EmailSequence } from "@/types/generation";

const emailMeta: Record<
  keyof EmailSequence,
  { label: string; description: string }
> = {
  welcome: { label: "Email 1: Welcome", description: "Sent immediately after opt-in" },
  reminder: { label: "Email 2: Reminder", description: "Sent 24h before call/start" },
  objectionHandling: { label: "Email 3: Objection Handling", description: "For hesitant leads" },
  lastChance: { label: "Email 4: Last Chance", description: "Final nudge before deadline" },
  reEngagement: { label: "Email 5: Re-engagement", description: "For cold/unresponsive leads" },
};

export function EmailSection({ data }: { data: EmailSequence }) {
  const [openEmail, setOpenEmail] = useState<keyof EmailSequence>("welcome");

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        5-part email sequence. Click each email to expand and copy.
      </p>

      {(Object.keys(emailMeta) as Array<keyof EmailSequence>).map((key) => {
        const meta = emailMeta[key];
        const email = data[key];
        const isOpen = openEmail === key;

        return (
          <div key={key} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <button
              onClick={() => setOpenEmail(isOpen ? ("" as keyof EmailSequence) : key)}
              className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
            >
              <div>
                <p className="font-semibold text-gray-900">{meta.label}</p>
                <p className="text-xs text-gray-400">{meta.description}</p>
              </div>
              <div className="text-sm text-gray-400">
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
