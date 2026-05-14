import { ResultSection } from "../result-section";
import type { OfferSummary } from "@/types/generation";
import { PenLine } from "lucide-react";

interface OfferSummarySectionProps {
  data: OfferSummary;
  copywriterStyle?: string;
  funnelType?: "challenge" | "application";
}

export function OfferSummarySection({ data, copywriterStyle, funnelType }: OfferSummarySectionProps) {
  const isApplication = funnelType === "application";
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Your {isApplication ? "programme" : "challenge"} concept and positioning at a glance.
      </p>
      {copywriterStyle && (
        <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-800">
          <PenLine className="h-4 w-4 shrink-0 text-violet-500" />
          <span>
            Written in <span className="font-semibold">{copywriterStyle.split(" — ")[0]}</span> style
            {copywriterStyle.includes(" — ") && (
              <> &mdash; <span className="text-violet-600">{copywriterStyle.split(" — ")[1]}</span></>
            )}
          </span>
        </div>
      )}
      <ResultSection defaultCollapsed
        title={isApplication ? "Programme Concept" : "Challenge Concept"}
        content={data.challengeConcept}
      />
      <ResultSection defaultCollapsed
        title="Target Audience Summary"
        content={data.targetAudienceSummary}
      />
      <ResultSection defaultCollapsed
        title="Offer Positioning"
        content={data.offerPositioning}
      />
      <ResultSection defaultCollapsed
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
