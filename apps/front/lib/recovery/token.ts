import crypto from "crypto";
import { env } from "@dunlo/env/server";

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

function getSecret(): string {
  return env.BETTER_AUTH_SECRET;
}

export function createCardUpdateToken(failedPaymentId: string): string {
  const expiry = Date.now() + TOKEN_TTL_MS;
  const payload = `${failedPaymentId}.${expiry}`;
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

export function verifyCardUpdateToken(
  token: string,
): { failedPaymentId: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const [failedPaymentId, expiryStr, signature] = decoded.split(".");
    if (!failedPaymentId || !expiryStr || !signature) return null;

    const expiry = parseInt(expiryStr, 10);
    if (Date.now() > expiry) return null;

    const payload = `${failedPaymentId}.${expiryStr}`;
    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");
    if (signature !== expected) return null;

    return { failedPaymentId };
  } catch {
    return null;
  }
}
