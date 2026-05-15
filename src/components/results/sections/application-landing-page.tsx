"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { ApplicationLandingPage } from "@/types/generation";

function CopyBtn({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast({ title: "Copied!", description: label ? `${label} copied.` : undefined });
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="flex shrink-0 items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-500 hover:bg-gray-50 transition-colors"
    >
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</span>
        <CopyBtn value={value} label={label} />
      </div>
      <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 p-5 space-y-3">{children}</div>}
    </div>
  );
}

interface Props {
  data: ApplicationLandingPage;
}

export function ApplicationLandingPageSection({ data: al }: Props) {
  return (
    <div className="space-y-4">

      {/* Hero */}
      <Section title="Hero Section">
        <Field label="Value Prop Headline" value={al.valuePropHeadline} />
        <Field label="Subheadline" value={al.valuePropSubheadline} />
        <Field label="CTA Button Text" value={al.heroCtaText} />
        <Field label="CTA Subtext" value={al.heroCtaSubtext} />
      </Section>

      {/* Video section */}
      <Section title="Video Section">
        <Field label="Heading" value={al.videoSectionHeading} />
        <Field label="Subheading" value={al.videoSectionSubheading} />
      </Section>

      {/* Credentials */}
      <Section title="Credentials Strip" defaultOpen={false}>
        {al.credentialItems.map((c, i) => (
          <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs font-semibold text-gray-700">{c.label}</p>
            <p className="mt-0.5 text-sm text-gray-600">{c.description}</p>
          </div>
        ))}
      </Section>

      {/* Benefit blocks */}
      <Section title="Benefit Blocks" defaultOpen={false}>
        {al.benefitBlocks.map((b, i) => (
          <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">{b.heading}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{b.body}</p>
          </div>
        ))}
      </Section>

      {/* Mid CTA */}
      <Section title="Mid-Page CTA" defaultOpen={false}>
        <Field label="Heading" value={al.midCtaHeading} />
        <Field label="Button Text" value={al.midCtaText} />
        {al.painPointHeading && <Field label="Pain Point Heading" value={al.painPointHeading} />}
        <Field label="Divider Heading" value={al.dividerHeading} />
      </Section>

      {/* What You Get */}
      <Section title="What You Get" defaultOpen={false}>
        <Field label="Section Heading" value={al.whatYouGetHeading} />
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Checklist Items</p>
          <ul className="space-y-1">
            {al.whatYouGetItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-0.5 text-emerald-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        {al.whatYouGetBodyCopy && <Field label="Body Copy" value={al.whatYouGetBodyCopy} />}
        {al.guaranteeBullets && al.guaranteeBullets.length > 0 && (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">You&apos;ll… Bullets</p>
            <ul className="space-y-1">
              {al.guaranteeBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-0.5 text-blue-400">→</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {/* Qualifiers */}
      <Section title="Who It&apos;s For / Not For" defaultOpen={false}>
        <Field label="Section Heading" value={al.qualificationSectionHeading} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-green-100 bg-green-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-green-600 mb-2">Should Apply</p>
            <ul className="space-y-1">
              {al.shouldApply.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="mt-0.5">✓</span>{q}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-500 mb-2">Not a Fit</p>
            <ul className="space-y-1">
              {al.shouldNotApply.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="mt-0.5">✗</span>{q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section title="Testimonials" defaultOpen={false}>
        <Field label="Section Intro Heading" value={al.testimonialIntroHeading} />
        <Field label="Video Testimonial Quote" value={al.testimonialVideoQuote} />
        <div className="space-y-2">
          {al.textTestimonials.map((t, i) => (
            <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-sm text-gray-800 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs font-semibold text-gray-600">{t.attribution}</p>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{t.result}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Client Wins */}
      <Section title="Client Wins" defaultOpen={false}>
        <Field label="Gallery Heading" value={al.galleryHeading} />
        <Field label="Transformation Gallery Heading" value={al.transformationGalleryHeading} />
        <Field label="Client Wins Heading" value={al.clientWinsHeading} />
        <div className="grid gap-2 sm:grid-cols-2">
          {al.clientWins.map((w, i) => (
            <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
              <p className="text-xs font-semibold text-gray-700">{w.name}</p>
              <p className="text-sm text-emerald-700 font-medium mt-0.5">{w.result}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Client Stories */}
      <Section title="Client Stories" defaultOpen={false}>
        <div className="space-y-3">
          {al.clientStories.map((s, i) => (
            <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{s.storyHeadline}</p>
              <p className="text-xs font-semibold text-gray-700">{s.intro}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{s.story}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Problem breakdown */}
      {al.problemBreakdown && al.problemBreakdown.length > 0 && (
        <Section title="Problem Breakdown" defaultOpen={false}>
          <div className="space-y-2">
            {al.problemBreakdown.map((pb, i) => (
              <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{pb.title}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{pb.headline}</p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{pb.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      <Section title="FAQ" defaultOpen={false}>
        <div className="space-y-2">
          {al.faqItems.map((faq, i) => (
            <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-sm font-semibold text-gray-800">{faq.question}</p>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section title="Final CTA" defaultOpen={false}>
        <Field label="Heading" value={al.finalCtaText} />
        <Field label="Subtext" value={al.finalCtaSubtext} />
      </Section>

    </div>
  );
}
