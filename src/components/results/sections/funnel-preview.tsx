"use client";

import { ArrowRight, ArrowDown, Globe, Mail, MessageSquare } from "lucide-react";
import type { GeneratedFunnelAssets } from "@/types/generation";

interface Props {
  data: GeneratedFunnelAssets;
}

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2 rounded-t-lg">
      <div className="flex gap-1">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <div className="h-2 w-2 rounded-full bg-yellow-400" />
        <div className="h-2 w-2 rounded-full bg-green-400" />
      </div>
      <div className="flex flex-1 items-center gap-1 rounded bg-white border border-gray-200 px-2 py-0.5">
        <Globe className="h-2.5 w-2.5 text-gray-400 shrink-0" />
        <span className="text-[10px] text-gray-400 truncate">{url}</span>
      </div>
    </div>
  );
}

function PageCard({
  step,
  label,
  accent,
  url,
  children,
}: {
  step: number;
  label: string;
  accent: string;
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-w-[200px] max-w-[220px] shrink-0">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
          style={{ backgroundColor: accent }}
        >
          {step}
        </span>
        <span className="text-xs font-semibold text-gray-700">{label}</span>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex-1">
        <BrowserChrome url={url} />
        <div className="p-3 space-y-2 min-h-[140px]">{children}</div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex shrink-0 items-center self-center mt-7">
      <div className="h-px w-6 bg-gray-300" />
      <ArrowRight className="h-3.5 w-3.5 text-gray-400 -ml-0.5" />
    </div>
  );
}

function MobileConnector() {
  return (
    <div className="flex flex-col items-center my-1">
      <div className="w-px h-4 bg-gray-300" />
      <ArrowDown className="h-3.5 w-3.5 text-gray-400 -mt-0.5" />
    </div>
  );
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {children}
    </span>
  );
}

function CtaButton({ text, color }: { text: string; color: string }) {
  return (
    <div
      className="rounded text-center text-[10px] font-bold text-white px-2 py-1.5 mt-1"
      style={{ backgroundColor: color }}
    >
      {text}
    </div>
  );
}

function EmailCard({
  index,
  label,
  subject,
  preview,
  dayLabel,
}: {
  index: number;
  label: string;
  subject: string;
  preview: string;
  dayLabel: string;
}) {
  const colors = ["#1a56db", "#7e3af2", "#057a55", "#b45309", "#be185d"];
  const color = colors[index % colors.length];

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
          style={{ backgroundColor: color }}
        >
          {index + 1}
        </div>
        {index < 4 && <div className="w-px flex-1 bg-gray-200 mt-1" style={{ minHeight: 20 }} />}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-gray-800">{label}</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">{dayLabel}</span>
        </div>
        <p className="text-xs font-medium text-gray-700 mb-0.5">📧 {subject}</p>
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{preview}</p>
      </div>
    </div>
  );
}

function SmsCard({
  index,
  label,
  message,
  dayLabel,
}: {
  index: number;
  label: string;
  message: string;
  dayLabel: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-white text-[10px] font-bold">
          {index + 1}
        </div>
        {index < 4 && <div className="w-px flex-1 bg-gray-200 mt-1" style={{ minHeight: 16 }} />}
      </div>
      <div className="flex-1 pb-3">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-gray-800">{label}</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">{dayLabel}</span>
        </div>
        <div className="rounded-xl rounded-tl-none bg-green-50 border border-green-100 px-2.5 py-1.5">
          <p className="text-[11px] text-gray-700 leading-relaxed line-clamp-3">{message}</p>
        </div>
      </div>
    </div>
  );
}

const ACCENT_COLORS = {
  landing: "#1a56db",
  optin: "#7e3af2",
  thankyou: "#057a55",
  booking: "#b45309",
};

export function FunnelPreviewSection({ data }: Props) {
  const lp = data.landingPage;
  const form = data.optInForm;
  const ty = data.thankYouPage;
  const bk = data.bookingPage;
  const emails = data.emailSequence;
  const sms = data.smsSequence;
  const concept = data.offerSummary.challengeConcept || "30-Day Challenge";

  const emailItems = [
    { label: "Welcome", subject: emails.welcome.subject, preview: emails.welcome.body, dayLabel: "Day 1" },
    { label: "Reminder", subject: emails.reminder.subject, preview: emails.reminder.body, dayLabel: "Day 3" },
    { label: "Objection Handling", subject: emails.objectionHandling.subject, preview: emails.objectionHandling.body, dayLabel: "Day 5" },
    { label: "Last Chance", subject: emails.lastChance.subject, preview: emails.lastChance.body, dayLabel: "Day 7" },
    { label: "Re-engagement", subject: emails.reEngagement.subject, preview: emails.reEngagement.body, dayLabel: "Day 14" },
  ];

  const smsItems = [
    { label: "Confirmation", message: sms.confirmation, dayLabel: "Instant" },
    { label: "Reminder", message: sms.reminder, dayLabel: "Day 1" },
    { label: "Follow-up", message: sms.followUp, dayLabel: "Day 3" },
    { label: "No-show", message: sms.noShow, dayLabel: "Day 5" },
    { label: "Re-engagement", message: sms.reEngagement, dayLabel: "Day 14" },
  ];

  return (
    <div className="space-y-8">

      {/* Section header */}
      <div>
        <h2 className="text-base font-bold text-gray-900">Funnel Overview</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Visual map of your complete {concept} funnel — pages, emails, and SMS.
        </p>
      </div>

      {/* Funnel flow — desktop: horizontal row, mobile: vertical stack */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Funnel Pages</p>

        {/* Desktop horizontal */}
        <div className="hidden sm:flex items-start gap-0">
          {/* Landing Page */}
          <PageCard step={1} label="Landing Page" accent={ACCENT_COLORS.landing} url="yoursite.com/challenge">
            <Tag color={ACCENT_COLORS.landing}>Headline</Tag>
            <p className="text-[11px] font-semibold text-gray-800 leading-snug line-clamp-3 mt-1">
              {lp.headlineOptions[0]}
            </p>
            <p className="text-[10px] text-gray-500 line-clamp-2">{lp.subheadline}</p>
            <CtaButton text={lp.ctaText} color={ACCENT_COLORS.landing} />
          </PageCard>

          <Connector />

          {/* Opt-in Form */}
          <PageCard step={2} label="Opt-in Form" accent={ACCENT_COLORS.optin} url="yoursite.com/optin">
            <Tag color={ACCENT_COLORS.optin}>Form</Tag>
            <p className="text-[11px] text-gray-700 leading-snug mt-1 line-clamp-2">{form.formIntroText}</p>
            <div className="mt-1 space-y-1">
              {form.recommendedFields.slice(0, 3).map((f, i) => (
                <div key={i} className="rounded border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-400">
                  {f}
                </div>
              ))}
            </div>
            <CtaButton text={form.ctaButtonText} color={ACCENT_COLORS.optin} />
          </PageCard>

          <Connector />

          {/* Thank You */}
          <PageCard step={3} label="Thank You Page" accent={ACCENT_COLORS.thankyou} url="yoursite.com/thank-you">
            <Tag color={ACCENT_COLORS.thankyou}>Confirmation</Tag>
            <p className="text-[11px] font-semibold text-gray-800 leading-snug mt-1 line-clamp-2">
              {ty.confirmationMessage}
            </p>
            {ty.nextSteps.slice(0, 2).map((s, i) => (
              <div key={i} className="flex items-start gap-1 mt-1">
                <span className="text-green-500 text-[10px] mt-px">✓</span>
                <p className="text-[10px] text-gray-600 line-clamp-1">{s}</p>
              </div>
            ))}
            <CtaButton text="Book Your Call" color={ACCENT_COLORS.thankyou} />
          </PageCard>

          <Connector />

          {/* Booking */}
          <PageCard step={4} label="Booking Page" accent={ACCENT_COLORS.booking} url="yoursite.com/book">
            <Tag color={ACCENT_COLORS.booking}>Schedule</Tag>
            <p className="text-[11px] text-gray-700 leading-snug mt-1 line-clamp-3">{bk.shortIntro}</p>
            {bk.whyBook.slice(0, 2).map((w, i) => (
              <div key={i} className="flex items-start gap-1 mt-1">
                <span className="text-amber-500 text-[10px] mt-px">★</span>
                <p className="text-[10px] text-gray-600 line-clamp-1">{w}</p>
              </div>
            ))}
            <CtaButton text="Pick a Time" color={ACCENT_COLORS.booking} />
          </PageCard>
        </div>

        {/* Mobile vertical */}
        <div className="flex sm:hidden flex-col items-center">
          <PageCard step={1} label="Landing Page" accent={ACCENT_COLORS.landing} url="yoursite.com/challenge">
            <Tag color={ACCENT_COLORS.landing}>Headline</Tag>
            <p className="text-[11px] font-semibold text-gray-800 leading-snug line-clamp-3 mt-1">
              {lp.headlineOptions[0]}
            </p>
            <CtaButton text={lp.ctaText} color={ACCENT_COLORS.landing} />
          </PageCard>
          <MobileConnector />
          <PageCard step={2} label="Opt-in Form" accent={ACCENT_COLORS.optin} url="yoursite.com/optin">
            <Tag color={ACCENT_COLORS.optin}>Form</Tag>
            <p className="text-[11px] text-gray-700 leading-snug mt-1 line-clamp-2">{form.formIntroText}</p>
            <CtaButton text={form.ctaButtonText} color={ACCENT_COLORS.optin} />
          </PageCard>
          <MobileConnector />
          <PageCard step={3} label="Thank You Page" accent={ACCENT_COLORS.thankyou} url="yoursite.com/thank-you">
            <Tag color={ACCENT_COLORS.thankyou}>Confirmation</Tag>
            <p className="text-[11px] font-semibold text-gray-800 leading-snug mt-1 line-clamp-2">
              {ty.confirmationMessage}
            </p>
            <CtaButton text="Book Your Call" color={ACCENT_COLORS.thankyou} />
          </PageCard>
          <MobileConnector />
          <PageCard step={4} label="Booking Page" accent={ACCENT_COLORS.booking} url="yoursite.com/book">
            <Tag color={ACCENT_COLORS.booking}>Schedule</Tag>
            <p className="text-[11px] text-gray-700 leading-snug mt-1 line-clamp-3">{bk.shortIntro}</p>
            <CtaButton text="Pick a Time" color={ACCENT_COLORS.booking} />
          </PageCard>
        </div>
      </div>

      {/* Follow-up sequences */}
      <div className="grid gap-5 sm:grid-cols-2">

        {/* Email sequence */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a56db]/10">
              <Mail className="h-3.5 w-3.5 text-[#1a56db]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Email Sequence</p>
              <p className="text-[11px] text-gray-500">5-email nurture flow</p>
            </div>
          </div>
          <div>
            {emailItems.map((e, i) => (
              <EmailCard key={i} index={i} {...e} />
            ))}
          </div>
        </div>

        {/* SMS sequence */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50">
              <MessageSquare className="h-3.5 w-3.5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">SMS Sequence</p>
              <p className="text-[11px] text-gray-500">5-message text flow</p>
            </div>
          </div>
          <div>
            {smsItems.map((s, i) => (
              <SmsCard key={i} index={i} {...s} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
