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

      // Step 1: parse the fence-stripped string directly
      let parsed = safeParse(schema, fenceStripped, groupName);

      // Step 2: if that fails, try extracting the outermost { … } — handles preamble
      // prose or trailing text Claude occasionally adds despite system prompt instructions
      if (parsed.error) {
        console.error(
          `[claude-generate] ${groupName} primary parse failed: ${parsed.error} | raw[0..300]: ${content.slice(0, 300).replace(/\n/g, " ")}`,
        );
        const first = fenceStripped.indexOf("{");
        const last  = fenceStripped.lastIndexOf("}");
        if (first !== -1 && last > first) {
          const bracketSlice = fenceStripped.slice(first, last + 1);
          const fallbackParsed = safeParse(schema, bracketSlice, groupName);
          if (!fallbackParsed.error) {
            parsed = fallbackParsed;
          } else {
            console.error(
              `[claude-generate] ${groupName} bracket-extraction fallback also failed: ${fallbackParsed.error}`,
            );
          }
        }
      }

      if (parsed.error) {
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
