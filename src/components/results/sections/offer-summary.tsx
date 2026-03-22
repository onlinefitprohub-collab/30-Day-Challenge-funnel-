import { ResultSection, CopyableItem } from "../result-section";
import type { OfferSummary } from "@/types/generation";

export function OfferSummarySection({ data }: { data: OfferSummary }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Your challenge concept and positioning at a glance.
      </p>
      <ResultSection
        title="Challenge Concept"
        content={data.challengeConcept}
      />
      <ResultSection
        title="Target Audience Summary"
        content={data.targetAudienceSummary}
      />
      <ResultSection
        title="Offer Positioning"
        content={data.offerPositioning}
      />
      <ResultSection
        title="Core Promise"
        content={data.corePromise}
      >
        <p className="text-base font-semibold leading-relaxed text-gray-900">
          &ldquo;{data.corePromise}&rdquo;
        </p>
      </ResultSection>
    </div>
  );
}
