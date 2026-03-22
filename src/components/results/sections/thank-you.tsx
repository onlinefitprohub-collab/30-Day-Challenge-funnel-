import { ResultSection } from "../result-section";
import type { ThankYouPageCopy } from "@/types/generation";

export function ThankYouSection({ data }: { data: ThankYouPageCopy }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Turn opt-ins into booked calls with a high-converting thank you page.
      </p>

      <ResultSection title="Confirmation Message" content={data.confirmationMessage} />

      <ResultSection
        title="Next Steps"
        content={data.nextSteps.join("\n")}
      >
        <ol className="space-y-2">
          {data.nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </ResultSection>

      <ResultSection title="Booking Encouragement" content={data.bookingEncouragement} />
    </div>
  );
}
