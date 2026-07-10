const { Pool } = require("pg");
const crypto = require("crypto");

const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : null;

function ensureKey() {
  const raw = process.env.ENCRYPTION_KEY || "";
  // Expect base64-encoded 32 bytes (256 bits)
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error(
      "ENCRYPTION_KEY must be a base64-encoded 32-byte key (aes-256)",
    );
  }
  return key;
}

function encrypt(plainText) {
  const key = ensureKey();
  const iv = crypto.randomBytes(12); // recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(plainText), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  // store iv|tag|ciphertext
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

function decrypt(payloadB64) {
  const key = ensureKey();
  const data = Buffer.from(payloadB64, "base64");
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const ciphertext = data.slice(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

async function query(text, params) {
  if (!pool) throw new Error("DATABASE_URL not configured");
  return pool.query(text, params);
}

module.exports = { pool, query, encrypt, decrypt };
