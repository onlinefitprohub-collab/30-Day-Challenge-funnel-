import { NextResponse } from "next/server";
import { generateFunnelAssets } from "@/lib/ai/generate";
import { generateMockAssets } from "@/lib/ai/mock";
import { wizardInputsSchema } from "@/types/wizard";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { inputs?: unknown };

    if (!body.inputs) {
      return NextResponse.json({ error: "Missing inputs" }, { status: 400 });
    }

    const validatedInputs = wizardInputsSchema.parse(body.inputs);

    const isMockMode = !process.env.OPENAI_API_KEY;
    const assets = isMockMode
      ? generateMockAssets(validatedInputs)
      : await generateFunnelAssets(validatedInputs);

    return NextResponse.json({
      outputs: { ...assets, _isMock: isMockMode },
      isMock: isMockMode,
    });
  } catch (error) {
    console.error("Generation error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
