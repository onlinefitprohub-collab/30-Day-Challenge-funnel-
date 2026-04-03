/**
 * Claude-powered group generation.
 *
 * Handles transient 529 overload errors with automatic retry (up to 3 attempts,
 * 2-second delay between each). Non-529 errors and exhausted retries return a
 * null result so the caller can fall back to mock data.
 *
 * Temperature: 0.72
 */

import { getAnthropicClient, CLAUDE_SYSTEM_PROMPT } from "./claude-client";
import { safeParse } from "./validators";

const MAX_RETRIES  = 3;
const RETRY_DELAY  = 2000; // ms

interface GroupResult<T> {
  data: T | null;
  error: string | null;
  usedFallback: boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function is529(err: unknown): boolean {
  if (err instanceof Error) {
    return err.message.includes("529") || err.message.toLowerCase().includes("overloaded");
  }
  return false;
}

export async function callClaudeGroup<T>(
  prompt: string,
  schema: Parameters<typeof safeParse<T>>[0],
  groupName: string,
  maxTokens: number,
  model = "claude-sonnet-4-6",
): Promise<GroupResult<T>> {
  const anthropic = getAnthropicClient();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        temperature: 0.72,
        system: [{ type: "text", text: CLAUDE_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: prompt }],
      });

      const block = response.content[0];
      const content = block?.type === "text" ? block.text : null;

      if (!content) {
        return { data: null, error: `${groupName}: empty response from Claude`, usedFallback: false };
      }

      // Claude sometimes wraps JSON in ```json fences despite instructions — strip them
      const fenceStripped = content
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/, "")
        .trim();

      // If fence stripping isn't enough (e.g. Claude added preamble prose), extract
      // the JSON object by finding the outermost { … } brackets.
      let cleaned = fenceStripped;
      {
        const first = fenceStripped.indexOf("{");
        const last  = fenceStripped.lastIndexOf("}");
        if (first !== -1 && last > first) {
          cleaned = fenceStripped.slice(first, last + 1);
        }
      }

      const parsed = safeParse(schema, cleaned, groupName);
      if (parsed.error) {
        console.error(
          `[claude-generate] ${parsed.error} | raw[0..300]: ${content.slice(0, 300).replace(/\n/g, " ")}`,
        );
        return { data: null, error: parsed.error, usedFallback: false };
      }

      return { data: parsed.data, error: null, usedFallback: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      if (is529(err) && attempt < MAX_RETRIES) {
        console.warn(
          `[claude-generate] ${groupName} overloaded (attempt ${attempt}/${MAX_RETRIES}) — retrying in ${RETRY_DELAY / 1000}s`,
        );
        await sleep(RETRY_DELAY);
        continue;
      }

      console.error(`[claude-generate] ${groupName} API call failed:`, message);
      return { data: null, error: `${groupName}: ${message}`, usedFallback: false };
    }
  }

  // Should never reach here, but TypeScript needs it
  return { data: null, error: `${groupName}: all retries exhausted`, usedFallback: false };
}
