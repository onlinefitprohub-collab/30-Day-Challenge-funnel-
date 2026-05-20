import crypto from "crypto";

const KEY_HEX = process.env.ENCRYPTION_KEY ?? "";
const ALGO    = "aes-256-gcm";

function getKey(): Buffer {
  if (KEY_HEX.length === 64) return Buffer.from(KEY_HEX, "hex");
  // Fallback for dev: derive 32 bytes from whatever is set (or empty)
  return crypto.createHash("sha256").update(KEY_HEX || "dev-fallback-key").digest();
}

export function encrypt(plaintext: string): string {
  const iv  = crypto.randomBytes(12);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc  = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag  = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), enc.toString("hex")].join(":");
}

export function decrypt(ciphertext: string): string {
  const [ivHex, tagHex, encHex] = ciphertext.split(":");
  if (!ivHex || !tagHex || !encHex) return ciphertext; // not encrypted (legacy)
  const key    = getKey();
  const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return decipher.update(encHex, "hex", "utf8") + decipher.final("utf8");
}

export function isEncrypted(value: string): boolean {
  const parts = value.split(":");
  return parts.length === 3 && parts[0].length === 24; // 12-byte IV as hex = 24 chars
}
