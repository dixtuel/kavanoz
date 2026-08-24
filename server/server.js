require("dotenv").config();
const express = require("express");
const dns = require("dns").promises;
const path = require("path");
const rateLimit = require("express-rate-limit");

const db = require("./db");
const { verifyHcaptcha } = require("./hcaptcha");
const { moderateMessage } = require("./moderation");
const { generateManagementKey, hashManagementKey } = require("./crypto");

const app = express();
app.disable("x-powered-by");
// Cloudflare Tunnel (cloudflared) her isteği tek bir hop olarak proxy'ler — X-Forwarded-For
// bu yüzden güvenilir, gerçek istemci IP'sini yansıtır (rate-limit doğruluğu için gerekli).
app.set("trust proxy", 1);
app.use(express.json({ limit: "8kb" }));

const PORT = process.env.PORT || 3030;
const MESSAGE_MAX = 2000;
const NAME_MAX = 60;
const MAX_YEARS = 5;
const CORS_ORIGIN = process.env.CORS_ALLOWED_ORIGINS || "";

app.use((req, res, next) => {
  if (CORS_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

const createLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const manageLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });

function isValidEmailSyntax(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

async function hasMx(email) {
  const domain = email.split("@")[1];
  try {
    const records = await dns.resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch {
    return false;
  }
}

function maxFutureDate() {
  return new Date(Date.now() + MAX_YEARS * 365 * 86400000);
}

function validateFutureDate(value) {
  const d = new Date(value);
  const now = new Date();
  return !Number.isNaN(d.getTime()) && d > now && d <= maxFutureDate() ? d : null;
}

app.post("/api/notes", createLimiter, async (req, res) => {
  try {
    const { message, displayName, email, mailSendAt, lang, retentionMode, retentionUntil, hcaptchaToken } = req.body || {};

    if (typeof message !== "string" || message.trim().length === 0 || message.length > MESSAGE_MAX) {
      return res.status(400).json({ error: "invalid_message" });
    }
    if (displayName && (typeof displayName !== "string" || displayName.length > NAME_MAX)) {
      return res.status(400).json({ error: "invalid_display_name" });
    }

    const safeLang = lang === "en" ? "en" : "tr";

    // E-posta tamamen opsiyonel — yalnız verildiyse gönderim tarihi zorunlu.
    let normalizedEmail = null;
    let normalizedMailSendAt = null;
    if (email) {
      if (!isValidEmailSyntax(email)) return res.status(400).json({ error: "invalid_email" });
      const mailDate = validateFutureDate(mailSendAt);
      if (!mailDate) return res.status(400).json({ error: "invalid_mail_send_at", maxYears: MAX_YEARS });
      if (!(await hasMx(email))) return res.status(400).json({ error: "email_unreachable" });
      normalizedEmail = email;
      normalizedMailSendAt = mailDate.toISOString();
    }

    let normalizedRetentionMode = retentionMode === "until_date" ? "until_date" : "admin";
    let normalizedRetentionUntil = null;
    if (normalizedRetentionMode === "until_date") {
      const retDate = validateFutureDate(retentionUntil);
      if (!retDate) return res.status(400).json({ error: "invalid_retention_until", maxYears: MAX_YEARS });
      normalizedRetentionUntil = retDate.toISOString();
    }

    const okCaptcha = await verifyHcaptcha(hcaptchaToken, req.ip);
    if (!okCaptcha) return res.status(400).json({ error: "captcha_failed" });

    const moderation = await moderateMessage(message);
    if (!moderation.safe) return res.status(422).json({ error: "content_rejected" });

    const managementKey = generateManagementKey();
    const created = await db.createNote({
      message,
      displayName: displayName ? displayName.trim() : null,
      email: normalizedEmail,
      mailSendAt: normalizedMailSendAt,
      lang: safeLang,
      retentionMode: normalizedRetentionMode,
      retentionUntil: normalizedRetentionUntil,
      managementKeyHash: hashManagementKey(managementKey),
    });

    res.status(201).json({ id: created.id, jarId: created.jarId, jarFilled: created.jarFilled, managementKey });
  } catch (err) {
    console.error("[kavanoz] POST /api/notes hata:", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.get("/api/jars/active", async (req, res) => {
  const summary = await db.getActiveJarSummary();
  res.json(summary);
});

app.get("/api/jars/shelf", async (req, res) => {
  const before = req.query.before ? Number(req.query.before) : null;
  const limit = Math.min(Number(req.query.limit) || 20, 40);
  if (before !== null && !Number.isInteger(before)) return res.status(400).json({ error: "invalid_before" });
  const items = await db.listShelf(before, limit);
  res.json({ items });
});

app.get("/api/jars/:id/notes", async (req, res) => {
  const jarId = Number(req.params.id);
  if (!Number.isInteger(jarId)) return res.status(400).json({ error: "invalid_jar_id" });
  const jar = await db.getJarMeta(jarId);
  if (!jar) return res.status(404).json({ error: "not_found" });
  const before = req.query.before ? Number(req.query.before) : null;
  const limit = Math.min(Number(req.query.limit) || 30, 60);
  const items = await db.listJarNotes(jarId, before, limit);
  res.json({ jar, items });
});

app.get("/api/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "invalid_id" });
  const note = await db.getNote(id);
  if (!note) return res.status(404).json({ error: "not_found" });
  res.json(note);
});

app.post("/api/notes/manage", manageLimiter, async (req, res) => {
  try {
    const { managementKey, action } = req.body || {};
    if (typeof managementKey !== "string" || managementKey.length < 10) {
      return res.status(400).json({ error: "invalid_key" });
    }
    const note = await db.findNoteByManagementKeyHash(hashManagementKey(managementKey));
    if (!note) return res.status(404).json({ error: "not_found" });

    if (action === "get") {
      return res.json({
        ok: true,
        note: {
          id: note.id,
          message: note.message,
          displayName: note.displayName,
          email: note.email,
          mailSendAt: note.mailSendAt,
          mailStatus: note.mailStatus,
          retentionMode: note.retentionMode,
          retentionUntil: note.retentionUntil,
          createdAt: note.createdAt,
        },
      });
    }

    if (action === "delete") {
      await db.deleteNoteById(note.id, note.jarId);
      return res.json({ ok: true, deleted: true });
    }

    if (action === "update") {
      const fields = {};
      const { message, displayName, email, mailSendAt, retentionMode, retentionUntil } = req.body || {};

      if (message !== undefined) {
        if (typeof message !== "string" || message.trim().length === 0 || message.length > MESSAGE_MAX) {
          return res.status(400).json({ error: "invalid_message" });
        }
        fields.message = message;
      }
      if (displayName !== undefined) {
        if (displayName && (typeof displayName !== "string" || displayName.length > NAME_MAX)) {
          return res.status(400).json({ error: "invalid_display_name" });
        }
        fields.displayName = displayName ? displayName.trim() : null;
      }
      if (email !== undefined) {
        if (email) {
          if (!isValidEmailSyntax(email)) return res.status(400).json({ error: "invalid_email" });
          if (!(await hasMx(email))) return res.status(400).json({ error: "email_unreachable" });
          fields.email = email;
        } else {
          fields.email = null;
        }
      }
      if (mailSendAt !== undefined) {
        if (mailSendAt) {
          const mailDate = validateFutureDate(mailSendAt);
          if (!mailDate) return res.status(400).json({ error: "invalid_mail_send_at", maxYears: MAX_YEARS });
          fields.mailSendAt = mailDate.toISOString();
        } else {
          fields.mailSendAt = null;
        }
      }
      if (retentionMode !== undefined) {
        fields.retentionMode = retentionMode === "until_date" ? "until_date" : "admin";
        if (fields.retentionMode === "until_date") {
          const retDate = validateFutureDate(retentionUntil);
          if (!retDate) return res.status(400).json({ error: "invalid_retention_until", maxYears: MAX_YEARS });
          fields.retentionUntil = retDate.toISOString();
        } else {
          fields.retentionUntil = null;
        }
      }

      if ((fields.message && fields.message !== note.message) || fields.displayName !== undefined) {
        const check = await moderateMessage(fields.message !== undefined ? fields.message : note.message);
        if (!check.safe) return res.status(422).json({ error: "content_rejected" });
      }

      await db.updateNoteById(note.id, fields);
      return res.json({ ok: true, updated: true });
    }

    return res.status(400).json({ error: "invalid_action" });
  } catch (err) {
    console.error("[kavanoz] POST /api/notes/manage hata:", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.use(express.static(path.join(__dirname, "..", "public"), {
  maxAge: "10m",
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    }
  },
}));

db.init()
  .then(() => {
    app.listen(PORT, () => console.log(`[kavanoz] dinleniyor: ${PORT}`));
  })
  .catch((err) => {
    console.error("[kavanoz] DB init hatası:", err);
    process.exit(1);
  });
