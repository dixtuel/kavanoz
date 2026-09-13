const express = require("express");
const rateLimit = require("express-rate-limit");
const db = require("../db");
const { verifyHcaptcha } = require("../hcaptcha");
const { moderateMessage } = require("../moderation");
const { generateManagementKey, hashManagementKey } = require("../crypto");
const {
  MESSAGE_MAX,
  NAME_MAX,
  MAX_YEARS,
  isValidEmailSyntax,
  hasMx,
  validateFutureDate,
} = require("../validators");

const router = express.Router();

const createLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const manageLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });

// POST /api/notes - yeni not oluştur
router.post("/", createLimiter, async (req, res) => {
  try {
    const { message, displayName, email, mailSendAt, lang, retentionMode, retentionUntil, hcaptchaToken, visibility } = req.body || {};

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

    const normalizedVisibility = visibility === "private" ? "private" : "public";

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
      visibility: normalizedVisibility,
    });

    res.status(201).json({ id: created.id, jarId: created.jarId, jarFilled: created.jarFilled, managementKey });
  } catch (err) {
    console.error("[kavanoz] POST /api/notes hata:", err);
    res.status(500).json({ error: "server_error" });
  }
});

// GET /api/notes/:id - tekil not getir
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "invalid_id" });
  const note = await db.getNote(id);
  if (!note) return res.status(404).json({ error: "not_found" });
  res.json(note);
});

// POST /api/notes/manage - yönetim anahtarı ile silme/düzenleme/getirme
router.post("/manage", manageLimiter, async (req, res) => {
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
          visibility: note.visibility,
        },
      });
    }

    if (action === "delete") {
      await db.deleteNoteById(note.id, note.jarId);
      return res.json({ ok: true, deleted: true });
    }

    if (action === "update") {
      const fields = {};
      const { message, displayName, email, mailSendAt, retentionMode, retentionUntil, visibility } = req.body || {};

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

      if (visibility !== undefined) {
        fields.visibility = visibility === "private" ? "private" : "public";
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

module.exports = router;
