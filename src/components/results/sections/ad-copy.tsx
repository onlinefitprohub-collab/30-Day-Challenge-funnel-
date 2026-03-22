import { ResultSection, CopyableItem } from "../result-section";
import type { AdCopy } from "@/types/generation";

export function AdCopySection({ data }: { data: AdCopy }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Ready-to-use Facebook and Instagram ad copy. Mix and match for testing.
      </p>

      <ResultSection
        title="Ad Hooks (first line — stops the scroll)"
        content={data.hooks.join("\n\n")}
      >
        <div className="space-y-3">
          {data.hooks.map((hook, i) => (
            <CopyableItem key={i} label={`Hook ${i + 1}`} value={hook} />
          ))}
        </div>
      </ResultSection>

      <ResultSection
        title="Primary Text (body copy)"
        content={data.primaryTexts.join("\n\n---\n\n")}
      >
        <div className="space-y-4">
          {data.primaryTexts.map((text, i) => (
            <CopyableItem key={i} label={`Version ${i + 1}`} value={text} />
          ))}
        </div>
      </ResultSection>

      <ResultSection
        title="Headlines (shown below the image)"
        content={data.headlines.join("\n")}
      >
        <div className="space-y-2">
          {data.headlines.map((h, i) => (
            <CopyableItem key={i} label={`Headline ${i + 1}`} value={h} />
          ))}
        </div>
      </ResultSection>

      <ResultSection
        title="Descriptions (below headline)"
        content={data.descriptions.join("\n")}
      >
        <div className="space-y-2">
          {data.descriptions.map((d, i) => (
            <CopyableItem key={i} label={`Description ${i + 1}`} value={d} />
          ))}
        </div>
      </ResultSection>
    </div>
  );
}
