const crypto = require("crypto");

// AES-256-GCM at-rest encryption for personal data (message text, e-mail address).
// KAVANOZ_ENC_KEY must be a 32-byte key, given as 64 hex chars — never stored in the DB.
function loadKey() {
  const hex = process.env.KAVANOZ_ENC_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("KAVANOZ_ENC_KEY tanımlı değil veya 32 byte (64 hex karakter) uzunluğunda değil");
  }
  return Buffer.from(hex, "hex");
}

function encrypt(plainText) {
  if (plainText === null || plainText === undefined) return null;
  const key = loadKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(String(plainText), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ["v1", iv.toString("base64"), tag.toString("base64"), ciphertext.toString("base64")].join(":");
}

function decrypt(payload) {
  if (!payload) return null;
  const parts = payload.split(":");
  if (parts.length !== 4 || parts[0] !== "v1") {
    throw new Error("Bilinmeyen şifreleme formatı");
  }
  const [, ivB64, tagB64, dataB64] = parts;
  const key = loadKey();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const plain = Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]);
  return plain.toString("utf8");
}

function randomToken() {
  return crypto.randomUUID();
}

// Yönetim anahtarı: kullanıcıya bir kez gösterilir, sunucuda yalnız hash'i saklanır.
// Zaten yüksek entropili rastgele bir değer olduğundan (parola gibi düşük entropili
// değil), yavaş/salted hash (bcrypt) yerine düz SHA-256 yeterli ve tutarlıdır.
function generateManagementKey() {
  return crypto.randomBytes(15).toString("base64url"); // ~20 karakter, URL-safe
}

function hashManagementKey(key) {
  return crypto.createHash("sha256").update(key, "utf8").digest("hex");
}

module.exports = { encrypt, decrypt, randomToken, generateManagementKey, hashManagementKey };
