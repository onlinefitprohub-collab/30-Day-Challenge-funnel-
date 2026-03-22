import { ResultSection, CopyableItem } from "../result-section";
import type { CreativePrompts } from "@/types/generation";

export function CreativePromptsSection({ data }: { data: CreativePrompts }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Use these prompts to brief a designer, create your own content, or direct a videographer.
      </p>

      <ResultSection
        title="Static Image Ad Ideas"
        content={data.staticImageIdeas.join("\n")}
      >
        <div className="space-y-2">
          {data.staticImageIdeas.map((idea, i) => (
            <CopyableItem key={i} label={`Image ${i + 1}`} value={idea} />
          ))}
        </div>
      </ResultSection>

      <ResultSection
        title="Talking-Head Video Prompts"
        content={data.talkingHeadPrompts.join("\n\n")}
      >
        <div className="space-y-3">
          {data.talkingHeadPrompts.map((prompt, i) => (
            <CopyableItem key={i} label={`Video prompt ${i + 1}`} value={prompt} />
          ))}
        </div>
      </ResultSection>

      <ResultSection
        title="Before / After Concepts"
        content={data.beforeAfterConcepts.join("\n\n")}
      >
        <div className="space-y-3">
          {data.beforeAfterConcepts.map((concept, i) => (
            <CopyableItem key={i} label={`Concept ${i + 1}`} value={concept} />
          ))}
        </div>
      </ResultSection>

      <ResultSection
        title="UGC Style Prompts"
        content={data.ugcStylePrompts.join("\n\n")}
      >
        <div className="space-y-3">
          {data.ugcStylePrompts.map((prompt, i) => (
            <CopyableItem key={i} label={`UGC prompt ${i + 1}`} value={prompt} />
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          UGC = User Generated Content style — authentic, casual, shot on phone. Great for engagement.
        </p>
      </ResultSection>
    </div>
  );
}
