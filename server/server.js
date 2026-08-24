require("dotenv").config();
const express = require("express");
const dns = require("dns").promises;
const path = require("path");
const rateLimit = require("express-rate-limit");

const db = require("./db");
const { verifyHcaptcha } = require("./hcaptcha");
const { moderateMessage } = require("./moderation");
const { sendConfirmationMail } = require("./mailer");
const { randomToken } = require("./crypto");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "8kb" }));

const PORT = process.env.PORT || 3030;
const MESSAGE_MAX = 2000;
const NAME_MAX = 60;
const MIN_DAYS = 7;
const MAX_DAYS = 5 * 365;
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

const createLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false });
const tokenLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

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

app.post("/api/letters", createLimiter, async (req, res) => {
  try {
    const { message, displayName, email, visibility, unlockAt, lang, hcaptchaToken } = req.body || {};

    if (typeof message !== "string" || message.trim().length === 0 || message.length > MESSAGE_MAX) {
      return res.status(400).json({ error: "invalid_message" });
    }
    if (displayName && (typeof displayName !== "string" || displayName.length > NAME_MAX)) {
      return res.status(400).json({ error: "invalid_display_name" });
    }
    if (!["public", "private"].includes(visibility)) {
      return res.status(400).json({ error: "invalid_visibility" });
    }
    if (!isValidEmailSyntax(email)) {
      return res.status(400).json({ error: "invalid_email" });
    }

    const unlockDate = new Date(unlockAt);
    const now = new Date();
    const minDate = new Date(now.getTime() + MIN_DAYS * 86400000);
    const maxDate = new Date(now.getTime() + MAX_DAYS * 86400000);
    if (Number.isNaN(unlockDate.getTime()) || unlockDate < minDate || unlockDate > maxDate) {
      return res.status(400).json({ error: "invalid_unlock_at", minDays: MIN_DAYS, maxDays: MAX_DAYS });
    }

    const safeLang = lang === "en" ? "en" : "tr";

    const okCaptcha = await verifyHcaptcha(hcaptchaToken, req.ip);
    if (!okCaptcha) {
      return res.status(400).json({ error: "captcha_failed" });
    }

    if (!(await hasMx(email))) {
      return res.status(400).json({ error: "email_unreachable" });
    }

    const moderation = await moderateMessage(message);
    if (!moderation.safe) {
      return res.status(422).json({ error: "content_rejected" });
    }

    const confirmToken = randomToken();
    const deleteToken = randomToken();
    const id = await db.createLetter({
      message,
      displayName: displayName ? displayName.trim() : null,
      ownerEmail: email,
      visibility,
      unlockAt: unlockDate.toISOString(),
      lang: safeLang,
      confirmToken,
      deleteToken,
    });

    await sendConfirmationMail(email, confirmToken, safeLang);

    res.status(201).json({ id, status: "pending_confirmation" });
  } catch (err) {
    console.error("[kavanoz] POST /api/letters hata:", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.get("/api/confirm/:token", tokenLimiter, async (req, res) => {
  const result = await db.confirmByToken(req.params.token);
  const lang = result?.lang === "en" ? "en" : "tr";
  const target = result ? `/${lang === "en" ? "en/" : ""}confirmed.html` : `/${lang === "en" ? "en/" : ""}confirm-error.html`;
  res.redirect(target);
});

app.get("/api/cancel/:token", tokenLimiter, async (req, res) => {
  const result = await db.cancelByDeleteToken(req.params.token);
  const lang = result?.lang === "en" ? "en" : "tr";
  const target = result ? `/${lang === "en" ? "en/" : ""}cancelled.html` : `/${lang === "en" ? "en/" : ""}confirm-error.html`;
  res.redirect(target);
});

app.get("/api/wall", async (req, res) => {
  const before = req.query.before ? Number(req.query.before) : null;
  const limit = Math.min(Number(req.query.limit) || 30, 60);
  if (before !== null && !Number.isInteger(before)) {
    return res.status(400).json({ error: "invalid_before" });
  }
  const items = await db.listWall(before, limit);
  res.json({ items });
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
