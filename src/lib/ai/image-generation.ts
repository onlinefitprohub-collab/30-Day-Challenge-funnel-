/**
 * Facebook Ad Image Generation
 *
 * Generates 3 square (1024×1024) ad images via DALL-E 3 using OpenAI.
 * 1024×1024 is the native DALL-E 3 square format — same 1:1 aspect ratio as
 * the Facebook/Instagram 1080×1080 placement requirement.
 *
 * Images are saved to /public/generated-ads/{projectId}/ and served statically.
 * In production, swap the fs.writeFile calls for Supabase Storage uploads.
 *
 * Facebook compliance built into every prompt:
 * - No before/after body transformation imagery
 * - No text overlay promising specific outcomes
 * - No implied personal attributes or medical claims
 * - Lifestyle-focused visuals that pass policy review
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";
import type { WizardInputs } from "@/types/wizard";
import type { GeneratedAdImage } from "@/types/generation";

function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Build 3 Facebook-policy-compliant DALL-E 3 prompts from the coach's inputs.
 * Prompts are visual-brief style — describe exactly what to show in frame
 * without any text overlay requests (text in AI images is unreliable and
 * counts against the 20% text limit).
 */
function buildImagePrompts(inputs: WizardInputs): string[] {
  const { challengeName, coachName, targetAudience, challengeType, location } = inputs;

  const locationHint = location ? `, ${location}` : "";
  const audienceHint = targetAudience ?? "busy adults";
  const challengeLabel = challengeName ?? `${challengeType ?? "fitness"} challenge`;

  return [
    // Prompt 1: Lifestyle / aspiration — person in action
    `Professional Facebook ad photo, square format 1:1. A confident, energetic person (30-45 years old, realistic everyday appearance) doing a workout or active lifestyle activity relevant to a "${challengeLabel}" fitness programme. Natural light, candid feel, not a stock-photo pose. Clean background. Uplifting but grounded mood — no extreme body transformation imagery. No text in the image. High quality, editorial photography style. Colours: bright, warm, energising.`,

    // Prompt 2: Community / social proof feel
    `Professional Facebook ad photo, square format 1:1. A small group of real-looking people (2-4 individuals, diverse ages 25-55, casual athletic wear) working out together or checking in after a session. Gym or outdoor setting${locationHint}. Genuine smiles, authentic energy — not posed or overly polished. Sense of camaraderie and accountability. No before/after framing. No text in the image. Warm natural lighting, cinematic quality.`,

    // Prompt 3: Coach / authority — personal trainer aesthetic
    `Professional Facebook ad photo, square format 1:1. A personal trainer or fitness coach (${coachName ? `appearing like ${coachName}, ` : ""}approachable, professional, athletic build but realistic) standing in a clean gym or outdoor training space, looking directly at camera with a confident and friendly expression. Not overly polished — real and trustworthy. Subtle branding colours: dark navy and orange. No text overlay. High-end personal brand photography. Target audience hint: ${audienceHint}.`,
  ];
}

/**
 * Ensure the output directory exists.
 */
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Generate 3 square Facebook ad images using DALL-E 3 and save them locally.
 * Returns an array of GeneratedAdImage objects with public URLs.
 *
 * Runs all 3 requests in parallel to minimise total wall-clock time.
 * Individual failures are caught and excluded — partial results are returned.
 */
export async function generateAdImages(
  inputs: WizardInputs,
  projectId: string,
): Promise<GeneratedAdImage[]> {
  const openai = getOpenAI();
  const prompts = buildImagePrompts(inputs);

  const outputDir = path.join(process.cwd(), "public", "generated-ads", projectId);
  ensureDir(outputDir);

  const results = await Promise.allSettled(
    prompts.map(async (prompt, i): Promise<GeneratedAdImage> => {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "b64_json",
      });

      const b64 = response.data[0]?.b64_json;
      if (!b64) throw new Error(`No image data returned for prompt ${i + 1}`);

      const filename = `ad-${i + 1}.png`;
      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, Buffer.from(b64, "base64"));

      return {
        url: `/generated-ads/${projectId}/${filename}`,
        prompt,
        index: i + 1,
      };
    }),
  );

  const images: GeneratedAdImage[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      images.push(result.value);
    } else {
      console.warn("[image-generation] Image generation failed:", result.reason);
    }
  }

  return images;
}
