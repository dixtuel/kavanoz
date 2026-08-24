import * as db from "../../_lib/db.js";
import { hashManagementKey } from "../../_lib/crypto.js";
import { moderateMessage } from "../../_lib/moderation.js";
import { hasMx } from "../../_lib/moderation.js";
import { jsonResponse, corsPreflight, isValidEmailSyntax, validateFutureDate, MAX_YEARS } from "../../_lib/response.js";

const MESSAGE_MAX = 2000;
const NAME_MAX = 60;

export async function onRequestOptions({ env }) {
  return corsPreflight(env);
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_key" }, 400, env);
  }

  const { managementKey, action } = body || {};
  if (typeof managementKey !== "string" || managementKey.length < 10) {
    return jsonResponse({ error: "invalid_key" }, 400, env);
  }

  const note = await db.findNoteByManagementKeyHash(env, hashManagementKey(managementKey));
  if (!note) return jsonResponse({ error: "not_found" }, 404, env);

  if (action === "get") {
    return jsonResponse({
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
    }, 200, env);
  }

  if (action === "delete") {
    await db.deleteNoteById(env, note.id, note.jarId);
    return jsonResponse({ ok: true, deleted: true }, 200, env);
  }

  if (action === "update") {
    const fields = {};
    const { message, displayName, email, mailSendAt, retentionMode, retentionUntil, visibility } = body || {};

    if (message !== undefined) {
      if (typeof message !== "string" || message.trim().length === 0 || message.length > MESSAGE_MAX) {
        return jsonResponse({ error: "invalid_message" }, 400, env);
      }
      fields.message = message;
    }
    if (displayName !== undefined) {
      if (displayName && (typeof displayName !== "string" || displayName.length > NAME_MAX)) {
        return jsonResponse({ error: "invalid_display_name" }, 400, env);
      }
      fields.displayName = displayName ? displayName.trim() : null;
    }
    if (email !== undefined) {
      if (email) {
        if (!isValidEmailSyntax(email)) return jsonResponse({ error: "invalid_email" }, 400, env);
        if (!(await hasMx(email))) return jsonResponse({ error: "email_unreachable" }, 400, env);
        fields.email = email;
      } else {
        fields.email = null;
      }
    }
    if (mailSendAt !== undefined) {
      if (mailSendAt) {
        const mailDate = validateFutureDate(mailSendAt);
        if (!mailDate) return jsonResponse({ error: "invalid_mail_send_at", maxYears: MAX_YEARS }, 400, env);
        fields.mailSendAt = mailDate.toISOString();
      } else {
        fields.mailSendAt = null;
      }
    }
    if (retentionMode !== undefined) {
      fields.retentionMode = retentionMode === "until_date" ? "until_date" : "admin";
      if (fields.retentionMode === "until_date") {
        const retDate = validateFutureDate(retentionUntil);
        if (!retDate) return jsonResponse({ error: "invalid_retention_until", maxYears: MAX_YEARS }, 400, env);
        fields.retentionUntil = retDate.toISOString();
      } else {
        fields.retentionUntil = null;
      }
    }
    if (visibility !== undefined) {
      fields.visibility = visibility === "private" ? "private" : "public";
    }

    if ((fields.message && fields.message !== note.message) || fields.displayName !== undefined) {
      const check = await moderateMessage(env, fields.message !== undefined ? fields.message : note.message);
      if (!check.safe) return jsonResponse({ error: "content_rejected" }, 422, env);
    }

    await db.updateNoteById(env, note.id, fields);
    return jsonResponse({ ok: true, updated: true }, 200, env);
  }

  return jsonResponse({ error: "invalid_action" }, 400, env);
}
