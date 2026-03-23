import { ResultSection, CopyableItem } from "../result-section";
import type { CreativePrompts, GeneratedAdImage } from "@/types/generation";

interface CreativePromptsSectionProps {
  data: CreativePrompts;
  generatedAdImages?: GeneratedAdImage[];
}

export function CreativePromptsSection({ data, generatedAdImages }: CreativePromptsSectionProps) {
  const hasImages = generatedAdImages && generatedAdImages.length > 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Use these prompts to brief a designer, create your own content, or direct a videographer.
        All concepts are Facebook ad policy compliant.
      </p>

      {hasImages && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-semibold text-orange-800">
              AI-Generated Ad Images (1024×1024 — Facebook Square Format)
            </span>
            <span className="rounded-full bg-orange-200 px-2 py-0.5 text-xs text-orange-700">
              {generatedAdImages.length} image{generatedAdImages.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="mb-4 text-xs text-orange-700">
            Generated to Facebook policy standards — no before/after body transformation imagery,
            no misleading claims. Download and use as inspiration or post directly.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {generatedAdImages.map((img) => (
              <div key={img.index} className="overflow-hidden rounded-lg border border-orange-200 bg-white shadow-sm">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                  <img
                    src={img.url}
                    alt={`Ad creative ${img.index}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="mb-2 text-xs font-medium text-gray-700">Ad Creative {img.index}</p>
                  <a
                    href={img.url}
                    download={`ad-creative-${img.index}.png`}
                    className="inline-flex w-full items-center justify-center rounded bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600"
                  >
                    Download PNG
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ResultSection
        title="Static Image Ad Ideas"
        content={data.staticImageIdeas.join("\n")}
      >
        <p className="mb-2 text-xs text-gray-400">
          Detailed briefs for your designer or content creator. Facebook-compliant — no body transformation imagery.
        </p>
        <div className="space-y-2">
          {data.staticImageIdeas.map((idea, i) => (
            <CopyableItem key={i} label={`Image concept ${i + 1}`} value={idea} />
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
        title="Lifestyle Contrast Concepts"
        content={data.beforeAfterConcepts.join("\n\n")}
      >
        <p className="mb-2 text-xs text-gray-400">
          Facebook restricts before/after body imagery — these contrast lifestyle states (habits, energy, routine) instead.
        </p>
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
