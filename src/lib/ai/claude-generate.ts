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

/**
 * Strip markdown code fences from an AI response.
 *
 * Handles all variants Claude produces despite system-prompt instructions:
 *   ```json\n{...}\n```          — standard json fence
 *   ```\n{...}\n```              — bare fence
 *   ```JSON\n{...}\n```          — uppercase language tag
 *   ```json\n{...}\n```\n prose  — fence with trailing commentary
 *   prose\n```json\n{...}\n```   — preamble before fence (pass-through; brace-counting handles it)
 */
function stripCodeFences(raw: string): string {
  const trimmed = raw.trim();

  // Fence wraps the entire response (most common case)
  const fullFence = trimmed.match(/^```[a-zA-Z0-9]*\s*\n([\s\S]*?)\n?```\s*$/);
  if (fullFence) return fullFence[1].trim();

  // Fence at start but trailing text after closing fence
  const openFence = trimmed.match(/^```[a-zA-Z0-9]*\s*\n([\s\S]*)/);
  if (openFence) {
    const body = openFence[1];
    const closingIdx = body.lastIndexOf("\n```");
    if (closingIdx !== -1) return body.slice(0, closingIdx).trim();
    // No closing fence — return body as-is (brace-counting will extract the object)
    return body.trim();
  }

  return trimmed;
}

/**
 * Extract the outermost JSON object from a string by counting brace depth.
 *
 * Unlike lastIndexOf("}"), this correctly handles:
 *   - Trailing commentary containing "}" characters
 *   - Nested objects and arrays
 *   - Escaped characters inside string values
 *
 * Returns null if the JSON is truncated (unclosed braces — hit max_tokens).
 */
function extractOutermostObject(content: string): string | null {
  const start = content.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < content.length; i++) {
    const ch = content[i];
    if (escape)          { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true;  continue; }
    if (ch === '"')      { inString = !inString;    continue; }
    if (inString)        continue;
    if (ch === "{")      depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return content.slice(start, i + 1);
    }
  }

  // depth > 0 means the JSON was cut off before closing — likely a max_tokens truncation
  return null;
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

      // Detect response truncated at max_tokens before attempting any extraction
      const stopReason = response.stop_reason;
      if (stopReason === "max_tokens") {
        console.warn(
          `[claude-generate] ${groupName} response hit max_tokens (${maxTokens}) — JSON may be truncated`,
        );
      }

      // Step 1: strip code fences, then try direct parse
      const fenceStripped = stripCodeFences(content);
      let parsed = safeParse(schema, fenceStripped, groupName);

      // Step 2: brace-counting extraction — handles preamble prose and trailing commentary
      if (parsed.error) {
        console.error(
          `[claude-generate] ${groupName} primary parse failed: ${parsed.error} | raw[0..300]: ${content.slice(0, 300).replace(/\n/g, " ")}`,
        );
        const jsonObj = extractOutermostObject(fenceStripped);
        if (jsonObj) {
          const fallbackParsed = safeParse(schema, jsonObj, groupName);
          if (!fallbackParsed.error) {
            parsed = fallbackParsed;
          } else {
            console.error(
              `[claude-generate] ${groupName} brace-extraction fallback also failed: ${fallbackParsed.error}`,
            );
          }
        } else {
          console.error(
            `[claude-generate] ${groupName} brace-extraction found no complete JSON object — response may be truncated (stop_reason: ${stopReason})`,
          );
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
