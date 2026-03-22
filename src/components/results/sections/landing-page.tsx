import { ResultSection, CopyableItem } from "../result-section";
import type { LandingPageCopy } from "@/types/generation";

export function LandingPageSection({ data }: { data: LandingPageCopy }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Everything you need to build your opt-in / landing page.
      </p>

      <ResultSection
        title="Headline Options (pick your favourite)"
        content={data.headlineOptions.join("\n\n")}
      >
        <div className="space-y-3">
          {data.headlineOptions.map((h, i) => (
            <CopyableItem key={i} label={`Option ${i + 1}`} value={h} />
          ))}
        </div>
      </ResultSection>

      <ResultSection title="Subheadline" content={data.subheadline} />

      <ResultSection
        title="Bullet Points"
        content={data.bulletPoints.join("\n")}
      >
        <ul className="space-y-2">
          {data.bulletPoints.map((bp, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {bp}
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-2 text-xs text-gray-400">
          Copy all bullets as text →{" "}
          <span className="font-mono">{data.bulletPoints.join(" | ")}</span>
        </div>
      </ResultSection>

      <ResultSection title="CTA Button Text" content={data.ctaText}>
        <p className="inline-flex rounded-lg bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-2 text-sm font-semibold text-white">
          {data.ctaText}
        </p>
      </ResultSection>

      <ResultSection
        title="Page Section Ideas"
        content={data.sectionIdeas.join("\n")}
      >
        <ol className="space-y-2">
          {data.sectionIdeas.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="font-semibold text-brand-600">{i + 1}.</span>
              {s}
            </li>
          ))}
        </ol>
      </ResultSection>

      <ResultSection
        title="FAQ Items"
        content={data.faqItems.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}
      >
        <div className="space-y-4">
          {data.faqItems.map((faq, i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-3">
              <p className="text-sm font-semibold text-gray-900">Q: {faq.question}</p>
              <p className="mt-1 text-sm text-gray-600">A: {faq.answer}</p>
            </div>
          ))}
        </div>
      </ResultSection>

      <ResultSection
        title="Urgency & Scarcity Ideas"
        content={data.urgencyIdeas.join("\n")}
      >
        <div className="space-y-2">
          {data.urgencyIdeas.map((u, i) => (
            <CopyableItem key={i} value={u} />
          ))}
        </div>
      </ResultSection>
    </div>
  );
}
