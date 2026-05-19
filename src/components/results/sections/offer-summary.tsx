import { ResultSection } from "../result-section";
import type { OfferSummary } from "@/types/generation";
import { PenLine } from "lucide-react";

const COPYWRITER_STYLE_LABELS: Record<string, string> = {
  "Russell Brunson": "Story-Driven",
  "Alex Hormozi":    "Bold & Proven",
  "Gary Halbert":    "Conversational",
  "David Ogilvy":    "Credibility-Led",
  "Eugene Schwartz": "Empathy-First",
  "Dan Kennedy":     "No-Nonsense",
};

interface OfferSummarySectionProps {
  data: OfferSummary;
  copywriterStyle?: string;
  funnelType?: "challenge" | "application";
}

export function OfferSummarySection({ data, copywriterStyle, funnelType }: OfferSummarySectionProps) {
  const isApplication = funnelType === "application";
  const styleName = copywriterStyle ? copywriterStyle.split(" — ")[0] : "";
  const styleLabel = COPYWRITER_STYLE_LABELS[styleName] ?? styleName;
  const styleTagline = copywriterStyle?.includes(" — ") ? copywriterStyle.split(" — ")[1] : "";
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Your {isApplication ? "programme" : "challenge"} concept and positioning at a glance.
      </p>
      {copywriterStyle && (
        <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-800">
          <PenLine className="h-4 w-4 shrink-0 text-violet-500" />
          <span>
            Written in <span className="font-semibold">{styleLabel}</span> style
            {styleTagline && (
              <> &mdash; <span className="text-violet-600">{styleTagline}</span></>
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
