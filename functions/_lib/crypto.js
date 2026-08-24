// node:crypto — Pages Functions'ta nodejs_compat bayrağıyla desteklenir.
// server/crypto.js ile BİREBİR aynı format (ayrı bir Web Crypto implementasyonu YAZMADIK
// kasıtlı olarak: iki taraf da aynı Turso DB'yi paylaşıyor, format sapması veri kaybına yol açar).
import crypto from "node:crypto";
import zlib from "node:zlib";

function loadKey(env) {
  const hex = env.KAVANOZ_ENC_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("KAVANOZ_ENC_KEY tanımlı değil veya 32 byte (64 hex karakter) uzunluğunda değil");
  }
  return Buffer.from(hex, "hex");
}

export function encrypt(env, plainText) {
  if (plainText === null || plainText === undefined) return null;
  const key = loadKey(env);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(String(plainText), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ["v1", iv.toString("base64"), tag.toString("base64"), ciphertext.toString("base64")].join(":");
}

export function decrypt(env, payload) {
  if (!payload) return null;
  const parts = payload.split(":");
  if (parts.length !== 4 || parts[0] !== "v1") {
    throw new Error("Bilinmeyen şifreleme formatı");
  }
  const [, ivB64, tagB64, dataB64] = parts;
  const key = loadKey(env);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const plain = Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]);
  return plain.toString("utf8");
}

export function generateManagementKey() {
  return crypto.randomBytes(15).toString("base64url");
}

export function hashManagementKey(key) {
  return crypto.createHash("sha256").update(key, "utf8").digest("hex");
}

export function compressText(raw) {
  if (!raw || typeof raw !== "string" || raw.length < 24) return raw;
  try {
    const payload = `z64:${zlib.deflateSync(Buffer.from(raw, "utf8")).toString("base64")}`;
    return payload.length < raw.length ? payload : raw;
  } catch {
    return raw;
  }
}

export function decompressText(stored) {
  if (!stored || typeof stored !== "string" || !stored.startsWith("z64:")) return stored;
  try {
    return zlib.inflateSync(Buffer.from(stored.slice(4), "base64")).toString("utf8");
  } catch {
    return stored;
  }
}
