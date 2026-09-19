// Turso (libSQL) HTTP Pipeline istemcisi — bağımsız (npm paketi yok), edge-native fetch.
// dilek-agaci/functions/api/wishes.js ile aynı desen (kanıtlanmış, production'da çalışıyor).

export async function tursoBatch(env, statements) {
  const dbUrl = env.TURSO_DATABASE_URL.replace(/^libsql:\/\//, "https://");
  const authToken = env.TURSO_AUTH_TOKEN;

  const requests = statements.map(({ sql, args = [] }) => ({
    type: "execute",
    stmt: {
      sql,
      args: args.map((arg) => {
        if (arg === null || arg === undefined) return { type: "null" };
        if (typeof arg === "number") return { type: "integer", value: String(arg) };
        return { type: "text", value: String(arg) };
      }),
    },
  }));
  requests.push({ type: "close" });

  const res = await fetch(`${dbUrl}/v2/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requests }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Turso HTTP hata ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return statements.map((_, i) => {
    const execResult = data.results?.[i];
    if (execResult?.type === "error") {
      throw new Error(`Turso sorgu hatası: ${execResult.error.message}`);
    }
    const response = execResult?.response?.result;
    if (!response) return { rows: [], affected_row_count: 0 };
    const cols = response.cols.map((c) => c.name);
    const rows = (response.rows || []).map((row) => {
      const obj = {};
      row.forEach((val, idx) => {
        obj[cols[idx]] = val.value;
      });
      return obj;
    });
    return { rows, affected_row_count: response.affected_row_count || 0 };
  });
}

export async function tursoQuery(env, sql, args = []) {
  const results = await tursoBatch(env, [{ sql, args }]);
  return results[0];
}

let tableInitialized = false;
export async function ensureTables(env) {
  if (tableInitialized) return;
  // Tek bir HTTP pipeline çağrısıyla tüm tablo ve indeksleri oluştur (5 roundtrip yerine 1)
  await tursoBatch(env, [
    {
      sql: `
        CREATE TABLE IF NOT EXISTS jars (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
          note_count INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
          archived_at TEXT
        );
      `,
    },
    {
      sql: `
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
      `,
    },
    { sql: "CREATE INDEX IF NOT EXISTS idx_notes_jar ON notes(jar_id, id);" },
    { sql: "CREATE INDEX IF NOT EXISTS idx_notes_mail ON notes(mail_status, mail_send_at, mail_next_attempt_at);" },
    { sql: "CREATE INDEX IF NOT EXISTS idx_notes_retention ON notes(retention_mode, retention_until);" },
    { sql: "CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_key ON notes(management_key_hash);" },
    { sql: "CREATE INDEX IF NOT EXISTS idx_jars_status ON jars(status, id);" },
  ]);
  tableInitialized = true;
}
