import { ResultSection, CopyableItem } from "../result-section";
import type { OptInFormSuggestions } from "@/types/generation";

export function OptInFormSection({ data }: { data: OptInFormSuggestions }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Optimise your opt-in form for maximum conversions.
      </p>

      <ResultSection
        title="Recommended Form Fields"
        content={data.recommendedFields.join(", ")}
      >
        <div className="flex flex-wrap gap-2">
          {data.recommendedFields.map((field, i) => (
            <span
              key={i}
              className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm text-brand-700"
            >
              {field}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Tip: The fewer fields, the higher the conversion rate. Start with just name + email.
        </p>
      </ResultSection>

      <ResultSection title="Form Intro Text" content={data.formIntroText} />
      <ResultSection title="CTA Button Text" content={data.ctaButtonText}>
        <p className="inline-flex rounded-lg bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-2 text-sm font-semibold text-white">
          {data.ctaButtonText}
        </p>
      </ResultSection>
    </div>
  );
}
