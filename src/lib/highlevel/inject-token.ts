import { createHmac } from "crypto";

/**
 * Derive a deterministic, server-signed access token for a project's inject endpoint.
 * The SUPABASE_SERVICE_ROLE_KEY acts as the HMAC secret — it never leaves the server.
 * Users obtain their token from the authenticated `/api/highlevel/inject-token` endpoint.
 */
export function deriveProjectToken(projectId: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createHmac("sha256", secret).update(projectId).digest("hex").slice(0, 32);
}
