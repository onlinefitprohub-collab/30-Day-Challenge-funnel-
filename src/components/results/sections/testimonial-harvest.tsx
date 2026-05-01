"use client";

import { useState } from "react";
import { Copy, Check, Mail, MessageSquare } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";

interface TestimonialHarvestSequence {
  day31Email: { subject: string; body: string };
  day33Sms: string;
  day35Email: { subject: string; body: string };
  day38Sms: string;
  referralEmail: { subject: string; body: string };
}

type MessageType = "email" | "sms";

interface MessageCard {
  key: keyof TestimonialHarvestSequence;
  timing: string;
  label: string;
  type: MessageType;
  purpose: string;
}

const MESSAGE_CARDS: MessageCard[] = [
  {
    key:     "day31Email",
    timing:  "Day 31",
    label:   "Day 31 — Testimonial Request",
    type:    "email",
    purpose: "First touchpoint — ask for a fresh success story",
  },
  {
    key:     "day33Sms",
    timing:  "Day 33",
    label:   "Day 33 — Nudge",
    type:    "sms",
    purpose: "Quick reminder to share their result",
  },
  {
    key:     "day35Email",
    timing:  "Day 35",
    label:   "Day 35 — Follow-up",
    type:    "email",
    purpose: "Deeper follow-up — offer a testimonial template",
  },
  {
    key:     "day38Sms",
    timing:  "Day 38",
    label:   "Day 38 — Final Nudge",
    type:    "sms",
    purpose: "Last SMS push before sequence ends",
  },
  {
    key:     "referralEmail",
    timing:  "Day 40",
    label:   "Referral Email",
    type:    "email",
    purpose: "Convert happy clients into referral partners",
  },
];

const TIMING_BADGE_COLORS: Record<string, string> = {
  "Day 31": "bg-blue-50 text-blue-700",
  "Day 33": "bg-emerald-50 text-emerald-700",
  "Day 35": "bg-amber-50 text-amber-700",
  "Day 38": "bg-orange-50 text-orange-700",
  "Day 40": "bg-purple-50 text-purple-700",
};

export function TestimonialHarvestSection({ data }: { data: TestimonialHarvestSequence }) {
  const [openCards, setOpenCards] = useState<Set<string>>(new Set(["day31Email"]));
  const [copiedAll, setCopiedAll] = useState(false);

  function toggleCard(key: string) {
    setOpenCards((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function getMessageText(card: MessageCard): string {
    if (card.type === "sms") {
      return data[card.key] as string;
    }
    const email = data[card.key] as { subject: string; body: string };
    return `Subject: ${email.subject}\n\n${email.body}`;
  }

  async function handleCopyAll() {
    const text = MESSAGE_CARDS.map((card) => {
      const content = getMessageText(card);
      return `${card.label.toUpperCase()} (${card.type.toUpperCase()})\n${content}`;
    }).join("\n\n---\n\n");

    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast({ title: "Sequence copied!", description: "All 5 harvest messages copied as formatted text." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          5-message post-challenge sequence — collect testimonials and activate referrals.
        </p>
        <button
          onClick={handleCopyAll}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {copiedAll
            ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
            : <><Copy className="h-3.5 w-3.5" /> Copy all 5</>
          }
        </button>
      </div>

      {/* Timeline connector + cards */}
      <div className="relative space-y-3">
        {/* Vertical timeline line */}
        <div className="absolute left-[22px] top-6 bottom-6 w-px bg-gray-200 pointer-events-none" />

        {MESSAGE_CARDS.map((card, idx) => {
          const isOpen = openCards.has(card.key);
          const isEmail = card.type === "email";
          const timingClass = TIMING_BADGE_COLORS[card.timing] ?? "bg-gray-100 text-gray-700";

          return (
            <div key={card.key} className="relative pl-12">
              {/* Timeline dot */}
              <div className={`absolute left-3 top-4 h-4 w-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                isEmail ? "bg-brand-500" : "bg-emerald-500"
              }`}>
                {isEmail
                  ? <Mail className="h-2.5 w-2.5 text-white" />
                  : <MessageSquare className="h-2.5 w-2.5 text-white" />
                }
              </div>

              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                {/* Card header */}
                <button
                  onClick={() => toggleCard(card.key)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${timingClass}`}>
                        {card.timing}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isEmail ? "bg-brand-50 text-brand-700" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {isEmail ? "Email" : "SMS"}
                      </span>
                      <p className="font-semibold text-gray-900 text-sm">{card.label}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">{card.purpose}</p>
                    {!isOpen && isEmail && (
                      <p className="mt-0.5 truncate text-xs text-gray-400 italic max-w-sm">
                        {(data[card.key] as { subject: string }).subject}
                      </p>
                    )}
                  </div>
                  <div className="ml-3 shrink-0 text-sm text-gray-400">{isOpen ? "▲" : "▼"}</div>
                </button>

                {/* Card body */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                    {isEmail ? (
                      <>
                        <div>
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Subject Line</p>
                          <CopyableItem value={(data[card.key] as { subject: string; body: string }).subject} />
                        </div>
                        <div>
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Email Body</p>
                          <CopyableItem value={(data[card.key] as { subject: string; body: string }).body} />
                        </div>
                      </>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">SMS Text</p>
                          <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                            (data[card.key] as string).length > 160
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-600"
                          }`}>
                            {(data[card.key] as string).length}/160
                          </span>
                        </div>
                        <CopyableItem value={data[card.key] as string} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
