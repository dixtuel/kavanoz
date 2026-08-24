const { createClient } = require("@libsql/client");
const zlib = require("zlib");
const { encrypt, decrypt } = require("./crypto");

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const JAR_CAPACITY = Number(process.env.JAR_CAPACITY || 50);

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
    CREATE TABLE IF NOT EXISTS jars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
      note_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      archived_at TEXT
    );
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jar_id INTEGER NOT NULL REFERENCES jars(id),
      message_enc TEXT NOT NULL,
      display_name TEXT,
      lang TEXT NOT NULL DEFAULT 'tr',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      email_enc TEXT,
      mail_send_at TEXT,
      mail_status TEXT NOT NULL DEFAULT 'none' CHECK (mail_status IN ('none','pending','sending','sent','failed')),
      mail_attempts INTEGER NOT NULL DEFAULT 0,
      mail_next_attempt_at TEXT,
      retention_mode TEXT NOT NULL DEFAULT 'admin' CHECK (retention_mode IN ('admin','until_date')),
      retention_until TEXT,
      management_key_hash TEXT NOT NULL,
      visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','private'))
    );
  `);
  await client.execute(`ALTER TABLE notes ADD COLUMN visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','private'));`).catch(() => {});
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_notes_jar ON notes(jar_id, id);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_notes_mail ON notes(mail_status, mail_send_at, mail_next_attempt_at);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_notes_retention ON notes(retention_mode, retention_until);`);
  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_key ON notes(management_key_hash);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_jars_status ON jars(status, id);`);
}

async function getOrCreateActiveJar() {
  const existing = await client.execute(`SELECT id, note_count FROM jars WHERE status='active' ORDER BY id DESC LIMIT 1`);
  if (existing.rows[0]) {
    return { id: Number(existing.rows[0].id), noteCount: Number(existing.rows[0].note_count) };
  }
  const created = await client.execute(`INSERT INTO jars DEFAULT VALUES RETURNING id`);
  return { id: Number(created.rows[0].id), noteCount: 0 };
}

async function createNote({ message, displayName, email, mailSendAt, lang, retentionMode, retentionUntil, managementKeyHash, visibility }) {
  const jar = await getOrCreateActiveJar();

  const result = await client.execute({
    sql: `INSERT INTO notes (jar_id, message_enc, display_name, lang, email_enc, mail_send_at, mail_status, retention_mode, retention_until, management_key_hash, visibility)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    args: [
      jar.id,
      encrypt(compressText(message)),
      displayName || null,
      lang || "tr",
      email ? encrypt(email) : null,
      mailSendAt || null,
      email ? "pending" : "none",
      retentionMode,
      retentionUntil || null,
      managementKeyHash,
      visibility === "private" ? "private" : "public",
    ],
  });

  const newCount = jar.noteCount + 1;
  await client.execute({ sql: `UPDATE jars SET note_count = note_count + 1 WHERE id=?`, args: [jar.id] });
  if (newCount >= JAR_CAPACITY) {
    // Kavanoz ağzına kadar doldu: rafa kaldır. Bir sonraki not otomatik olarak yeni (boş) kavanozu bulur/oluşturur.
    await client.execute({
      sql: `UPDATE jars SET status='archived', archived_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=? AND status='active'`,
      args: [jar.id],
    });
  }

  return { id: Number(result.rows[0].id), jarId: jar.id, jarFilled: newCount >= JAR_CAPACITY };
}

function noteRowToPublic(row) {
  const sealed = row.visibility === "private";
  return {
    id: Number(row.id),
    jarId: Number(row.jar_id),
    displayName: row.display_name || null,
    sealed,
    message: sealed ? null : decompressText(decrypt(row.message_enc)),
    createdAt: row.created_at,
  };
}

async function listJarNotes(jarId, beforeId, limit) {
  const result = await client.execute({
    sql: `SELECT id, jar_id, display_name, message_enc, created_at, visibility FROM notes
          WHERE jar_id=? AND (? IS NULL OR id < ?) ORDER BY id DESC LIMIT ?`,
    args: [jarId, beforeId ?? null, beforeId ?? null, limit],
  });
  return result.rows.map(noteRowToPublic);
}

async function getNote(id) {
  const result = await client.execute({ sql: `SELECT id, jar_id, display_name, message_enc, created_at, visibility FROM notes WHERE id=?`, args: [id] });
  return result.rows[0] ? noteRowToPublic(result.rows[0]) : null;
}

async function getActiveJarSummary() {
  const jar = await getOrCreateActiveJar();
  return { id: jar.id, noteCount: jar.noteCount, capacity: JAR_CAPACITY };
}

async function listShelf(beforeId, limit) {
  const result = await client.execute({
    sql: `SELECT id, note_count, created_at, archived_at FROM jars
          WHERE status='archived' AND (? IS NULL OR id < ?) ORDER BY id DESC LIMIT ?`,
    args: [beforeId ?? null, beforeId ?? null, limit],
  });
  return result.rows.map((row) => ({
    id: Number(row.id),
    noteCount: Number(row.note_count),
    createdAt: row.created_at,
    archivedAt: row.archived_at,
  }));
}

async function countShelf() {
  const result = await client.execute(`SELECT COUNT(*) AS total FROM jars WHERE status='archived'`);
  return Number(result.rows[0].total);
}

async function getJarMeta(id) {
  const result = await client.execute({ sql: `SELECT id, status, note_count, created_at, archived_at FROM jars WHERE id=?`, args: [id] });
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return { id: Number(row.id), status: row.status, noteCount: Number(row.note_count), createdAt: row.created_at, archivedAt: row.archived_at };
}

async function findNoteByManagementKeyHash(hash) {
  const result = await client.execute({
    sql: `SELECT id, jar_id, message_enc, display_name, lang, email_enc, mail_send_at, mail_status, retention_mode, retention_until, created_at, visibility
          FROM notes WHERE management_key_hash=?`,
    args: [hash],
  });
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return {
    id: Number(row.id),
    jarId: Number(row.jar_id),
    message: decompressText(decrypt(row.message_enc)),
    displayName: row.display_name,
    lang: row.lang,
    email: row.email_enc ? decrypt(row.email_enc) : null,
    mailSendAt: row.mail_send_at,
    mailStatus: row.mail_status,
    retentionMode: row.retention_mode,
    retentionUntil: row.retention_until,
    createdAt: row.created_at,
    visibility: row.visibility,
  };
}

async function deleteNoteById(id, jarId) {
  await client.execute({ sql: `DELETE FROM notes WHERE id=?`, args: [id] });
  await client.execute({ sql: `UPDATE jars SET note_count = MAX(note_count - 1, 0) WHERE id=?`, args: [jarId] });
}

async function updateNoteById(id, fields) {
  const sets = [];
  const args = [];
  if (fields.message !== undefined) {
    sets.push("message_enc=?");
    args.push(encrypt(compressText(fields.message)));
  }
  if (fields.displayName !== undefined) {
    sets.push("display_name=?");
    args.push(fields.displayName || null);
  }
  if (fields.email !== undefined) {
    sets.push("email_enc=?", "mail_status=?");
    args.push(fields.email ? encrypt(fields.email) : null, fields.email ? "pending" : "none");
  }
  if (fields.mailSendAt !== undefined) {
    sets.push("mail_send_at=?", "mail_attempts=0", "mail_next_attempt_at=NULL");
    args.push(fields.mailSendAt || null);
  }
  if (fields.retentionMode !== undefined) {
    sets.push("retention_mode=?");
    args.push(fields.retentionMode);
  }
  if (fields.retentionUntil !== undefined) {
    sets.push("retention_until=?");
    args.push(fields.retentionUntil || null);
  }
  if (fields.visibility !== undefined) {
    sets.push("visibility=?");
    args.push(fields.visibility === "private" ? "private" : "public");
  }
  if (sets.length === 0) return;
  args.push(id);
  await client.execute({ sql: `UPDATE notes SET ${sets.join(", ")} WHERE id=?`, args });
}

// ---- Worker helpers ----

async function recoverStuckMail() {
  await client.execute(`UPDATE notes SET mail_status='pending' WHERE mail_status='sending';`);
}

async function claimDueMailIds(limit = 25) {
  const result = await client.execute({
    sql: `SELECT id FROM notes
          WHERE mail_status='pending' AND mail_send_at IS NOT NULL AND mail_send_at<=strftime('%Y-%m-%dT%H:%M:%fZ','now')
            AND (mail_next_attempt_at IS NULL OR mail_next_attempt_at<=strftime('%Y-%m-%dT%H:%M:%fZ','now'))
          ORDER BY mail_send_at ASC LIMIT ?`,
    args: [limit],
  });
  return result.rows.map((r) => Number(r.id));
}

async function claimNoteForMail(id) {
  const result = await client.execute({
    sql: `UPDATE notes SET mail_status='sending' WHERE id=? AND mail_status='pending' RETURNING id, message_enc, email_enc, display_name, lang`,
    args: [id],
  });
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return {
    id: Number(row.id),
    message: decompressText(decrypt(row.message_enc)),
    email: decrypt(row.email_enc),
    displayName: row.display_name,
    lang: row.lang,
  };
}

async function markMailSent(id) {
  // Teslimat amacına ulaştı — gizlilik politikası gereği e-posta adresi hemen silinir.
  await client.execute({ sql: `UPDATE notes SET mail_status='sent', email_enc=NULL WHERE id=?`, args: [id] });
}

const MAX_MAIL_ATTEMPTS = 6;

async function markMailFailed(id) {
  const result = await client.execute({
    sql: `UPDATE notes SET mail_attempts = mail_attempts + 1 WHERE id=? RETURNING mail_attempts`,
    args: [id],
  });
  const attempts = Number(result.rows[0].mail_attempts);
  if (attempts >= MAX_MAIL_ATTEMPTS) {
    await client.execute({ sql: `UPDATE notes SET mail_status='failed', email_enc=NULL WHERE id=?`, args: [id] });
    return { gaveUp: true, attempts };
  }
  const backoffMinutes = Math.min(60 * Math.pow(2, attempts - 1), 24 * 60);
  await client.execute({
    sql: `UPDATE notes SET mail_status='pending', mail_next_attempt_at=datetime('now', '+' || ? || ' minutes') WHERE id=?`,
    args: [backoffMinutes, id],
  });
  return { gaveUp: false, attempts, backoffMinutes };
}

// Gönderenin seçtiği saklama süresi dolan notları temizler (site yöneticisi takdirine bırakılanlar hiç silinmez).
async function purgeExpiredByRetention() {
  const dueJars = await client.execute(
    `SELECT id, jar_id FROM notes WHERE retention_mode='until_date' AND retention_until<=strftime('%Y-%m-%dT%H:%M:%fZ','now')`
  );
  for (const row of dueJars.rows) {
    await deleteNoteById(Number(row.id), Number(row.jar_id));
  }
  return dueJars.rows.length;
}

module.exports = {
  init,
  createNote,
  listJarNotes,
  getNote,
  getActiveJarSummary,
  listShelf,
  countShelf,
  getJarMeta,
  findNoteByManagementKeyHash,
  deleteNoteById,
  updateNoteById,
  recoverStuckMail,
  claimDueMailIds,
  claimNoteForMail,
  markMailSent,
  markMailFailed,
  purgeExpiredByRetention,
  JAR_CAPACITY,
};
