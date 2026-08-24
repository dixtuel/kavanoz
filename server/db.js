const { createClient } = require("@libsql/client");
const zlib = require("zlib");
const { encrypt, decrypt } = require("./crypto");

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

function compressText(raw) {
  if (!raw || typeof raw !== "string" || raw.length < 24) return raw;
  try {
    const payload = `z64:${zlib.deflateSync(Buffer.from(raw, "utf8")).toString("base64")}`;
    return payload.length < raw.length ? payload : raw;
  } catch {
    return raw;
  }
}

function decompressText(stored) {
  if (!stored || typeof stored !== "string" || !stored.startsWith("z64:")) return stored;
  try {
    return zlib.inflateSync(Buffer.from(stored.slice(4), "base64")).toString("utf8");
  } catch {
    return stored;
  }
}

async function init() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message_enc TEXT NOT NULL,
      display_name TEXT,
      owner_email_enc TEXT,
      visibility TEXT NOT NULL CHECK (visibility IN ('public','private')),
      lang TEXT NOT NULL DEFAULT 'tr',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      unlock_at TEXT NOT NULL,
      confirm_status TEXT NOT NULL DEFAULT 'pending' CHECK (confirm_status IN ('pending','confirmed','cancelled')),
      confirm_token TEXT NOT NULL UNIQUE,
      confirm_token_used_at TEXT,
      delete_token TEXT NOT NULL UNIQUE,
      delete_token_used_at TEXT,
      reveal_status TEXT NOT NULL DEFAULT 'sealed' CHECK (reveal_status IN ('sealed','revealed')),
      mail_status TEXT NOT NULL DEFAULT 'pending' CHECK (mail_status IN ('pending','sending','sent','failed')),
      mail_attempts INTEGER NOT NULL DEFAULT 0,
      mail_next_attempt_at TEXT
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_letters_reveal ON letters(confirm_status, visibility, reveal_status, unlock_at);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_letters_mail ON letters(mail_status, confirm_status, unlock_at, mail_next_attempt_at);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_letters_pending_cleanup ON letters(confirm_status, created_at);`);
}

async function createLetter({ message, displayName, ownerEmail, visibility, unlockAt, lang, confirmToken, deleteToken }) {
  const result = await client.execute({
    sql: `INSERT INTO letters (message_enc, display_name, owner_email_enc, visibility, lang, unlock_at, confirm_token, delete_token)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    args: [
      encrypt(compressText(message)),
      displayName || null,
      encrypt(ownerEmail),
      visibility,
      lang || "tr",
      unlockAt,
      confirmToken,
      deleteToken,
    ],
  });
  return Number(result.rows[0].id);
}

async function confirmByToken(token) {
  const result = await client.execute({
    sql: `UPDATE letters SET confirm_status='confirmed', confirm_token_used_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')
          WHERE confirm_token=? AND confirm_status='pending' RETURNING id, lang`,
    args: [token],
  });
  return result.rows[0] ? { id: Number(result.rows[0].id), lang: result.rows[0].lang } : null;
}

async function cancelByDeleteToken(token) {
  const result = await client.execute({
    sql: `UPDATE letters SET confirm_status='cancelled', delete_token_used_at=strftime('%Y-%m-%dT%H:%M:%fZ','now'),
          message_enc='', display_name=NULL, owner_email_enc=NULL
          WHERE delete_token=? AND confirm_status IN ('pending','confirmed') AND delete_token_used_at IS NULL
          RETURNING id, lang`,
    args: [token],
  });
  return result.rows[0] ? { id: Number(result.rows[0].id), lang: result.rows[0].lang } : null;
}

// Data minimization: submissions never confirmed within 48h are purged of PII.
async function purgeAbandoned() {
  await client.execute(`
    UPDATE letters SET confirm_status='cancelled', message_enc='', display_name=NULL, owner_email_enc=NULL
    WHERE confirm_status='pending' AND created_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-48 hours');
  `);
}

async function revealDuePublicLetters() {
  await client.execute(`
    UPDATE letters SET reveal_status='revealed'
    WHERE confirm_status='confirmed' AND visibility='public' AND reveal_status='sealed' AND unlock_at<=strftime('%Y-%m-%dT%H:%M:%fZ','now');
  `);
}

async function recoverStuckMail() {
  await client.execute(`UPDATE letters SET mail_status='pending' WHERE mail_status='sending';`);
}

async function claimDueMailIds(limit = 25) {
  const result = await client.execute({
    sql: `SELECT id FROM letters
          WHERE mail_status='pending' AND confirm_status='confirmed' AND unlock_at<=strftime('%Y-%m-%dT%H:%M:%fZ','now')
            AND (mail_next_attempt_at IS NULL OR mail_next_attempt_at<=strftime('%Y-%m-%dT%H:%M:%fZ','now'))
          ORDER BY unlock_at ASC LIMIT ?`,
    args: [limit],
  });
  return result.rows.map((r) => Number(r.id));
}

async function claimLetter(id) {
  const result = await client.execute({
    sql: `UPDATE letters SET mail_status='sending' WHERE id=? AND mail_status='pending' RETURNING id, message_enc, owner_email_enc, display_name, visibility, lang`,
    args: [id],
  });
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return {
    id: Number(row.id),
    message: decompressText(decrypt(row.message_enc)),
    ownerEmail: decrypt(row.owner_email_enc),
    displayName: row.display_name,
    visibility: row.visibility,
    lang: row.lang,
  };
}

async function markMailSent(id) {
  await client.execute({
    sql: `UPDATE letters SET mail_status='sent', owner_email_enc=NULL WHERE id=?`,
    args: [id],
  });
}

const MAX_MAIL_ATTEMPTS = 6;

async function markMailFailed(id) {
  const result = await client.execute({
    sql: `UPDATE letters SET mail_attempts = mail_attempts + 1 WHERE id=? RETURNING mail_attempts`,
    args: [id],
  });
  const attempts = Number(result.rows[0].mail_attempts);
  if (attempts >= MAX_MAIL_ATTEMPTS) {
    await client.execute({ sql: `UPDATE letters SET mail_status='failed', owner_email_enc=NULL WHERE id=?`, args: [id] });
    return { gaveUp: true, attempts };
  }
  const backoffMinutes = Math.min(60 * Math.pow(2, attempts - 1), 24 * 60);
  await client.execute({
    sql: `UPDATE letters SET mail_status='pending', mail_next_attempt_at=datetime('now', '+' || ? || ' minutes') WHERE id=?`,
    args: [backoffMinutes, id],
  });
  return { gaveUp: false, attempts, backoffMinutes };
}

async function listWall(beforeId, limit) {
  const result = await client.execute({
    sql: `SELECT id, display_name, visibility, reveal_status, created_at, unlock_at, message_enc
          FROM letters
          WHERE confirm_status='confirmed' AND visibility='public' AND (? IS NULL OR id < ?)
          ORDER BY id DESC LIMIT ?`,
    args: [beforeId ?? null, beforeId ?? null, limit],
  });
  return result.rows.map((row) => ({
    id: Number(row.id),
    displayName: row.display_name || null,
    revealed: row.reveal_status === "revealed",
    createdAt: row.created_at,
    unlockAt: row.unlock_at,
    message: row.reveal_status === "revealed" ? decompressText(decrypt(row.message_enc)) : null,
  }));
}

async function countPending(email) {
  const result = await client.execute({
    sql: `SELECT COUNT(*) AS total FROM letters WHERE created_at > strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 hours')`,
  });
  return Number(result.rows[0].total);
}

module.exports = {
  init,
  createLetter,
  confirmByToken,
  cancelByDeleteToken,
  purgeAbandoned,
  revealDuePublicLetters,
  recoverStuckMail,
  claimDueMailIds,
  claimLetter,
  markMailSent,
  markMailFailed,
  listWall,
  countPending,
};
