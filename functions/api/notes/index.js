import * as db from "../../_lib/db.js";
import { hashManagementKey, generateManagementKey } from "../../_lib/crypto.js";
import { moderateMessage, verifyHcaptcha, hasMx } from "../../_lib/moderation.js";
import { jsonResponse, corsPreflight, isValidEmailSyntax, validateFutureDate, MAX_YEARS } from "../../_lib/response.js";

const MESSAGE_MAX = 2000;
const NAME_MAX = 60;

export async function onRequestOptions({ env }) {
  return corsPreflight(env);
}

// POST /api/notes — yeni not oluştur
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_message" }, 400, env);
  }

  const { message, displayName, email, mailSendAt, lang, retentionMode, retentionUntil, hcaptchaToken, visibility } = body || {};

  if (typeof message !== "string" || message.trim().length === 0 || message.length > MESSAGE_MAX) {
    return jsonResponse({ error: "invalid_message" }, 400, env);
  }
  if (displayName && (typeof displayName !== "string" || displayName.length > NAME_MAX)) {
    return jsonResponse({ error: "invalid_display_name" }, 400, env);
  }

  const safeLang = lang === "en" ? "en" : "tr";

  let normalizedEmail = null;
  let normalizedMailSendAt = null;
  if (email) {
    if (!isValidEmailSyntax(email)) return jsonResponse({ error: "invalid_email" }, 400, env);
    const mailDate = validateFutureDate(mailSendAt);
    if (!mailDate) return jsonResponse({ error: "invalid_mail_send_at", maxYears: MAX_YEARS }, 400, env);
    if (!(await hasMx(email))) return jsonResponse({ error: "email_unreachable" }, 400, env);
    normalizedEmail = email;
    normalizedMailSendAt = mailDate.toISOString();
  }

  let normalizedRetentionMode = retentionMode === "until_date" ? "until_date" : "admin";
  let normalizedRetentionUntil = null;
  if (normalizedRetentionMode === "until_date") {
    const retDate = validateFutureDate(retentionUntil);
    if (!retDate) return jsonResponse({ error: "invalid_retention_until", maxYears: MAX_YEARS }, 400, env);
    normalizedRetentionUntil = retDate.toISOString();
  }

  const clientIp = request.headers.get("CF-Connecting-IP") || "";
  try {
    const okCaptcha = await verifyHcaptcha(env, hcaptchaToken, clientIp);
    if (!okCaptcha) return jsonResponse({ error: "captcha_failed" }, 400, env);
  } catch {
    return jsonResponse({ error: "captcha_failed" }, 400, env);
  }

  const moderation = await moderateMessage(env, message);
  if (!moderation.safe) return jsonResponse({ error: "content_rejected" }, 422, env);

  const normalizedVisibility = visibility === "private" ? "private" : "public";
  const managementKey = generateManagementKey();

  try {
    const created = await db.createNote(env, {
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
    return jsonResponse({ id: created.id, jarId: created.jarId, jarFilled: created.jarFilled, managementKey }, 201, env);
  } catch (err) {
    return jsonResponse({ error: "server_error", detail: err.message }, 500, env);
  }
}
