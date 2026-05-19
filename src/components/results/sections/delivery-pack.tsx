"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Mail, MessageSquare } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";

interface WeeklyEmail {
  week: number;
  theme: string;
  subject: string;
  body: string;
}

interface DeliveryPack {
  welcomeEmail: { subject: string; body: string };
  welcomeSms: string;
  weeklyEmails: WeeklyEmail[];
  dailySmsPrompts: string[];
  completionEmail: { subject: string; body: string };
  completionSms: string;
}

function SectionDivider({ label, color }: { label: string; color: "blue" | "emerald" | "purple" | "amber" }) {
  const classes: Record<string, string> = {
    blue:    "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    purple:  "bg-purple-50 text-purple-700",
    amber:   "bg-amber-50 text-amber-700",
  };
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes[color]}`}>
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function EmailCard({ label, timing, email }: { label: string; timing?: string; email: { subject: string; body: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400 shrink-0" />
            <p className="font-semibold text-gray-900">{label}</p>
          </div>
          {timing && <p className="text-xs text-gray-400 mt-0.5">Send: {timing}</p>}
          {!isOpen && email?.subject && (
            <p className="mt-0.5 truncate text-xs text-gray-400 italic max-w-sm">{email.subject}</p>
          )}
        </div>
        <div className="ml-3 shrink-0 text-sm text-gray-400">{isOpen ? "▲" : "▼"}</div>
      </button>
      {isOpen && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Subject Line</p>
            <CopyableItem value={email.subject} />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Email Body</p>
            <CopyableItem value={email.body} />
          </div>
        </div>
      )}
    </div>
  );
}

function SmsCard({ label, timing, text }: { label: string; timing?: string; text: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-gray-400 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900">{label}</p>
            {timing && <p className="text-xs text-gray-400">Send: {timing}</p>}
          </div>
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded-full ${
          text.length > 160 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
        }`}>
          {text.length}/160
        </span>
      </div>
      <CopyableItem value={text} />
    </div>
  );
}

export function DeliveryPackSection({ data }: { data: DeliveryPack }) {
  const [smsOpen, setSmsOpen] = useState(false);
  const [copiedAllSms, setCopiedAllSms] = useState(false);

  async function handleCopyAllSms() {
    const text = data.dailySmsPrompts
      .map((sms, i) => `Day ${i + 1}: ${sms}`)
      .join("\n\n");

    await navigator.clipboard.writeText(text);
    setCopiedAllSms(true);
    toast({ title: "Daily SMS copied!", description: "All 30 daily SMS prompts copied." });
    setTimeout(() => setCopiedAllSms(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">How to use:</span> Load the emails into your GHL automation → create a challenge campaign → set each email to send on the day specified. SMS can be sent manually via your SMS platform or integrated with GHL SMS. Copy all content as-is, or personalise with your name, links, and offers.
        </p>
      </div>

      {/* Welcome Section */}
      <SectionDivider label="Welcome" color="blue" />
      <EmailCard label="Welcome Email" timing="Immediately after purchase" email={data.welcomeEmail} />
      <SmsCard label="Welcome SMS" timing="Immediately after purchase" text={data.welcomeSms} />

      {/* Weekly Emails */}
      <SectionDivider label="Weekly Coaching Emails" color="emerald" />
      {data.weeklyEmails.map((email) => (
        <EmailCard
          key={`week-${email.week}`}
          label={`Week ${email.week} Email — ${email.theme}`}
          timing={`Start of Week ${email.week}`}
          email={{ subject: email.subject, body: email.body }}
        />
      ))}

      {/* Completion Section */}
      <SectionDivider label="Completion" color="purple" />
      <EmailCard label="Completion Email" timing="Challenge Day 30" email={data.completionEmail} />
      <SmsCard label="Completion SMS" timing="Challenge Day 30" text={data.completionSms} />

      {/* Daily SMS Prompts Accordion */}
      <SectionDivider label="Daily SMS Prompts" color="amber" />
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <button
            onClick={() => setSmsOpen((v) => !v)}
            className="flex flex-1 items-center gap-3 text-left"
          >
            {smsOpen
              ? <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
              : <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            }
            <div>
              <p className="font-semibold text-gray-900">Daily SMS Prompts</p>
              <p className="text-xs text-gray-400">{data.dailySmsPrompts.length} messages — one per day</p>
            </div>
          </button>
          <button
            onClick={handleCopyAllSms}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAllSms
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy all 30</>
            }
          </button>
        </div>

        {smsOpen && (
          <div className="border-t border-gray-100 divide-y divide-gray-100">
            {data.dailySmsPrompts.map((sms, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <CopyableItem value={sms} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
