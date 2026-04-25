/**
 * Returns true if the given email should have admin access.
 * Set ADMIN_EMAIL (single) or ADMIN_EMAILS (comma-separated) in your environment.
 * If neither is configured, any authenticated user is treated as admin (open access).
 */
export function isAdmin(email: string): boolean {
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL;
  if (!raw) return true;
  return raw.split(",").map((e) => e.trim()).includes(email);
}
