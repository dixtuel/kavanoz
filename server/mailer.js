const nodemailer = require("nodemailer");

const BASE_URL = process.env.PUBLIC_BASE_URL || "https://kavanoz.dxtl.com.tr";
const FROM = process.env.MAIL_FROM || '"Sanal Kavanoz" <no-reply@dxtl.com.tr>';

let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      requireTLS: process.env.SMTP_REQUIRE_TLS !== "false",
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

const TEXT = {
  tr: {
    confirmSubject: "Kavanozunu onayla",
    confirmBody: (link) =>
      `Bir kavanoz bırakıldı ve bu adrese, süresi dolduğunda gönderilmesi isteniyor.\n\n` +
      `Bu kavanozu almayı kabul ediyorsan aşağıdaki linke tıkla:\n${link}\n\n` +
      `Bu maili sen istemediysen hiçbir şey yapmana gerek yok; onaylanmayan kavanozlar 48 saat içinde otomatik silinir.`,
    deliverySubject: "Kavanozun açıldı",
    deliveryBody: (message, deleteLink) =>
      `Bir süre önce bıraktığın kavanoz şimdi açıldı:\n\n"${message}"\n\n` +
      `— Sanal Kavanoz\n\nVerilerinin nasıl işlendiğiyle ilgili: ${deleteLink}`,
  },
  en: {
    confirmSubject: "Confirm your jar",
    confirmBody: (link) =>
      `Someone left a jar to be delivered to this address once its time is up.\n\n` +
      `If you accept receiving it, click the link below:\n${link}\n\n` +
      `If you didn't expect this, you can ignore it — unconfirmed jars are deleted automatically within 48 hours.`,
    deliverySubject: "Your jar has opened",
    deliveryBody: (message, deleteLink) =>
      `A jar you left a while ago has just opened:\n\n"${message}"\n\n` +
      `— Sanal Kavanoz\n\nAbout how your data is handled: ${deleteLink}`,
  },
};

async function sendConfirmationMail(email, token, lang) {
  const t = TEXT[lang] || TEXT.tr;
  const link = `${BASE_URL}${lang === "en" ? "/en" : ""}/api/confirm/${token}`;
  await getTransporter().sendMail({
    from: FROM,
    to: email,
    subject: t.confirmSubject,
    text: t.confirmBody(link),
  });
}

async function sendDeliveryMail(id, email, message, lang) {
  const t = TEXT[lang] || TEXT.tr;
  const deleteLink = `${BASE_URL}${lang === "en" ? "/en" : ""}/privacy.html`;
  await getTransporter().sendMail({
    from: FROM,
    to: email,
    subject: t.deliverySubject,
    text: t.deliveryBody(message, deleteLink),
    // Deterministic Message-ID so an accidental double-trigger of the worker
    // is deduplicated by the receiving mail client instead of arriving twice.
    messageId: `<letter-${id}@dxtl.com.tr>`,
  });
}

module.exports = { sendConfirmationMail, sendDeliveryMail };
