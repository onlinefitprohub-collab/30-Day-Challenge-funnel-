import { ResultSection } from "../result-section";
import type { BookingPageCopy } from "@/types/generation";

export function BookingSection({ data }: { data: BookingPageCopy }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Copy for your booking page to maximise call show-up rates.
      </p>

      <ResultSection title="Page Intro" content={data.shortIntro} />

      <ResultSection
        title="Why Book This Call"
        content={data.whyBook.join("\n")}
      >
        <ul className="space-y-2">
          {data.whyBook.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {reason}
            </li>
          ))}
        </ul>
      </ResultSection>

      <ResultSection title="What to Expect" content={data.expectationSetting} />
    </div>
  );
}
