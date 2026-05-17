import { NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store keyed by "userId:route"
// Works well for single-instance deployments; swap for Redis on multi-instance.
const store = new Map<string, RateLimitEntry>();

// Prune stale entries every 5 minutes to prevent unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Check whether a user has exceeded the rate limit for a given route.
 *
 * @param userId  - Supabase user ID
 * @param route   - A short descriptor like "generate-workout"
 * @param max     - Max requests allowed in the window (default 1)
 * @param windowMs - Window in milliseconds (default 30s)
 * @returns `null` if within limit, or a NextResponse(429) to return immediately
 */
export function checkRateLimit(
  userId: string,
  route: string,
  max = 1,
  windowMs = 30_000,
): NextResponse | null {
  const key = `${userId}:${route}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (entry.count >= max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      {
        error: "Too many requests — please wait before generating again.",
        retryAfter,
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      },
    );
  }

  entry.count += 1;
  return null;
}
