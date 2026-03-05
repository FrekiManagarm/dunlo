import crypto from "crypto";
import { env } from "@dunlo/env/server";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;

function getEncryptionKey(): string {
  const key = env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "ENCRYPTION_KEY is not set in environment variables. Please generate a 32-byte hex key.",
    );
  }
  return key;
}

export function encrypt(text: string): string {
  if (!text) {
    throw new Error("Cannot encrypt empty text");
  }

  const key = getEncryptionKey();
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  const derivedKey = crypto.pbkdf2Sync(
    Buffer.from(key, "hex"),
    salt,
    100000,
    32,
    "sha512",
  );

  const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  return `${salt.toString("hex")}:${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) {
    throw new Error("Cannot decrypt empty text");
  }

  const key = getEncryptionKey();

  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 4) {
      throw new Error("Invalid encrypted text format");
    }

    const [saltHex, ivHex, authTagHex, encrypted] = parts;
    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const derivedKey = crypto.pbkdf2Sync(
      Buffer.from(key, "hex"),
      salt,
      100000,
      32,
      "sha512",
    );

    const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    throw new Error(
      `Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
