import OpenAI from "openai";
import { buildFunnelPrompt } from "./prompts";
import type { WizardInputs } from "@/types/wizard";
import type { GeneratedFunnelAssets } from "@/types/generation";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({ apiKey });
}

export async function generateFunnelAssets(
  inputs: WizardInputs
): Promise<GeneratedFunnelAssets> {
  const openai = getOpenAIClient();
  const prompt = buildFunnelPrompt(inputs);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a world-class fitness marketing copywriter. You generate high-converting, specific, and persuasive funnel copy for fitness coaches. Always return valid JSON only — no markdown, no code blocks, just the raw JSON object.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.75,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from AI");
  }

  try {
    const parsed = JSON.parse(content) as GeneratedFunnelAssets;
    return parsed;
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }
}
