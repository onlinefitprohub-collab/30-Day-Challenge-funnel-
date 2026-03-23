/**
 * Claude-powered group generation — mirrors callGroup in generate.ts but
 * uses the Anthropic messages API with the extended CRO system prompt.
 *
 * Claude does not support response_format: json_object, so we rely on:
 * 1. An explicit system prompt instruction (OUTPUT FORMAT section)
 * 2. JSON.parse with try/catch
 * 3. The same safeParse validator used by the GPT-4o path
 *
 * Model: claude-3-5-sonnet-20241022
 * Temperature: 0.72 (matches GPT-4o path for comparable creative variation)
 */

import { getAnthropicClient, CLAUDE_SYSTEM_PROMPT } from "./claude-client";
import { safeParse } from "./validators";

interface GroupResult<T> {
  data: T | null;
  error: string | null;
  usedFallback: boolean;
}

export async function callClaudeGroup<T>(
  prompt: string,
  schema: Parameters<typeof safeParse<T>>[0],
  groupName: string,
  maxTokens: number,
): Promise<GroupResult<T>> {
  const anthropic = getAnthropicClient();

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: maxTokens,
      temperature: 0.72,
      system: CLAUDE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const block = response.content[0];
    const content = block?.type === "text" ? block.text : null;

    if (!content) {
      return { data: null, error: `${groupName}: empty response from Claude`, usedFallback: false };
    }

    // Claude sometimes wraps JSON in ```json fences despite instructions — strip them
    const cleaned = content
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();

    const parsed = safeParse(schema, cleaned, groupName);
    if (parsed.error) {
      console.error(`[claude-generate] ${parsed.error}`);
      return { data: null, error: parsed.error, usedFallback: false };
    }

    return { data: parsed.data, error: null, usedFallback: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[claude-generate] ${groupName} API call failed:`, message);
    return { data: null, error: `${groupName}: ${message}`, usedFallback: false };
  }
}
