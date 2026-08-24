import { tursoQuery, ensureTables } from "./turso.js";
import { encrypt, decrypt, compressText, decompressText } from "./crypto.js";

function jarCapacity(env) {
  return Number(env.JAR_CAPACITY || 50);
}

async function getOrCreateActiveJar(env) {
  const existing = await tursoQuery(env, `SELECT id, note_count FROM jars WHERE status='active' ORDER BY id DESC LIMIT 1`);
  if (existing.rows[0]) {
    return { id: Number(existing.rows[0].id), noteCount: Number(existing.rows[0].note_count) };
  }
  const created = await tursoQuery(env, `INSERT INTO jars DEFAULT VALUES RETURNING id`);
  return { id: Number(created.rows[0].id), noteCount: 0 };
}

export async function createNote(env, { message, displayName, email, mailSendAt, lang, retentionMode, retentionUntil, managementKeyHash, visibility }) {
  await ensureTables(env);
  const jar = await getOrCreateActiveJar(env);

  const result = await tursoQuery(
    env,
    `INSERT INTO notes (jar_id, message_enc, display_name, lang, email_enc, mail_send_at, mail_status, retention_mode, retention_until, management_key_hash, visibility)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    [
      jar.id,
      encrypt(env, compressText(message)),
      displayName || null,
      lang || "tr",
      email ? encrypt(env, email) : null,
      mailSendAt || null,
      email ? "pending" : "none",
      retentionMode,
      retentionUntil || null,
      managementKeyHash,
      visibility === "private" ? "private" : "public",
    ]
  );

  const newCount = jar.noteCount + 1;
  await tursoQuery(env, `UPDATE jars SET note_count = note_count + 1 WHERE id=?`, [jar.id]);
  const capacity = jarCapacity(env);
  if (newCount >= capacity) {
    await tursoQuery(
      env,
      `UPDATE jars SET status='archived', archived_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=? AND status='active'`,
      [jar.id]
    );
  }

  return { id: Number(result.rows[0].id), jarId: jar.id, jarFilled: newCount >= capacity };
}

function noteRowToPublic(env, row) {
  const sealed = row.visibility === "private";
  return {
    id: Number(row.id),
    jarId: Number(row.jar_id),
    displayName: row.display_name || null,
    sealed,
    message: sealed ? null : decompressText(decrypt(env, row.message_enc)),
    createdAt: row.created_at,
  };
}

export async function listJarNotes(env, jarId, beforeId, limit) {
  await ensureTables(env);
  const result = await tursoQuery(
    env,
    `SELECT id, jar_id, display_name, message_enc, created_at, visibility FROM notes
     WHERE jar_id=? AND (? IS NULL OR id < ?) ORDER BY id DESC LIMIT ?`,
    [jarId, beforeId ?? null, beforeId ?? null, limit]
  );
  return result.rows.map((r) => noteRowToPublic(env, r));
}

export async function getNote(env, id) {
  await ensureTables(env);
  const result = await tursoQuery(env, `SELECT id, jar_id, display_name, message_enc, created_at, visibility FROM notes WHERE id=?`, [id]);
  return result.rows[0] ? noteRowToPublic(env, result.rows[0]) : null;
}

export async function getActiveJarSummary(env) {
  await ensureTables(env);
  const jar = await getOrCreateActiveJar(env);
  return { id: jar.id, noteCount: jar.noteCount, capacity: jarCapacity(env) };
}

export async function listShelf(env, beforeId, limit) {
  await ensureTables(env);
  const result = await tursoQuery(
    env,
    `SELECT id, note_count, created_at, archived_at FROM jars
     WHERE status='archived' AND (? IS NULL OR id < ?) ORDER BY id DESC LIMIT ?`,
    [beforeId ?? null, beforeId ?? null, limit]
  );
  return result.rows.map((row) => ({
    id: Number(row.id),
    noteCount: Number(row.note_count),
    createdAt: row.created_at,
    archivedAt: row.archived_at,
  }));
}

export async function countShelf(env) {
  await ensureTables(env);
  const result = await tursoQuery(env, `SELECT COUNT(*) AS total FROM jars WHERE status='archived'`);
  return Number(result.rows[0].total);
}

export async function getJarMeta(env, id) {
  await ensureTables(env);
  const result = await tursoQuery(env, `SELECT id, status, note_count, created_at, archived_at FROM jars WHERE id=?`, [id]);
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return { id: Number(row.id), status: row.status, noteCount: Number(row.note_count), createdAt: row.created_at, archivedAt: row.archived_at };
}

export async function findNoteByManagementKeyHash(env, hash) {
  await ensureTables(env);
  const result = await tursoQuery(
    env,
    `SELECT id, jar_id, message_enc, display_name, lang, email_enc, mail_send_at, mail_status, retention_mode, retention_until, created_at, visibility
     FROM notes WHERE management_key_hash=?`,
    [hash]
  );
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return {
    id: Number(row.id),
    jarId: Number(row.jar_id),
    message: decompressText(decrypt(env, row.message_enc)),
    displayName: row.display_name,
    lang: row.lang,
    email: row.email_enc ? decrypt(env, row.email_enc) : null,
    mailSendAt: row.mail_send_at,
    mailStatus: row.mail_status,
    retentionMode: row.retention_mode,
    retentionUntil: row.retention_until,
    createdAt: row.created_at,
    visibility: row.visibility,
  };
}

export async function deleteNoteById(env, id, jarId) {
  await tursoQuery(env, `DELETE FROM notes WHERE id=?`, [id]);
  await tursoQuery(env, `UPDATE jars SET note_count = MAX(note_count - 1, 0) WHERE id=?`, [jarId]);
}

export async function updateNoteById(env, id, fields) {
  const sets = [];
  const args = [];
  if (fields.message !== undefined) {
    sets.push("message_enc=?");
    args.push(encrypt(env, compressText(fields.message)));
  }
  if (fields.displayName !== undefined) {
    sets.push("display_name=?");
    args.push(fields.displayName || null);
  }
  if (fields.email !== undefined) {
    sets.push("email_enc=?", "mail_status=?");
    args.push(fields.email ? encrypt(env, fields.email) : null, fields.email ? "pending" : "none");
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
  await tursoQuery(env, `UPDATE notes SET ${sets.join(", ")} WHERE id=?`, args);
}
