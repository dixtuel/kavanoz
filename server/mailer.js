const nodemailer = require("nodemailer");

const FROM = process.env.MAIL_FROM || "Sanal Kavanoz <no-reply@dxtl.com.tr>";

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
    subject: "Kavanozdan sana bir not geldi",
    body: (message) =>
      `Bir zaman önce Sanal Kavanoz'a bırakılan ve bu tarihte sana gönderilmesi istenen bir not var:\n\n` +
      `"${message}"\n\n` +
      `— Sanal Kavanoz (kavanoz.dxtl.com.tr)\n\n` +
      `Bu maili neden aldığını merak ediyorsan: birisi (belki sen, belki bir tanıdığın) sitede bir not yazıp bu adrese, seçtiği bir tarihte gönderilmesini istedi. Hesap gerektirmeyen bir sistem olduğu için gönderenin kimliğini biz de bilmiyoruz.`,
  },
  en: {
    subject: "A note from the jar has arrived for you",
    body: (message) =>
      `A note left on Virtual Jar a while ago was set to be delivered to this address today:\n\n` +
      `"${message}"\n\n` +
      `— Virtual Jar (kavanoz.dxtl.com.tr)\n\n` +
      `Wondering why you got this? Someone (maybe you, maybe someone who knows you) wrote a note on the site and asked for it to be sent to this address on a chosen date. Since the site doesn't use accounts, we don't know who the sender was either.`,
  },
};

async function sendDeliveryMail(id, email, message, lang) {
  const t = TEXT[lang] || TEXT.tr;
  await getTransporter().sendMail({
    from: FROM,
    to: email,
    subject: t.subject,
    text: t.body(message),
    // Deterministic Message-ID so an accidental double-trigger of the worker
    // is deduplicated by the receiving mail client instead of arriving twice.
    messageId: `<note-${id}@dxtl.com.tr>`,
  });
}

module.exports = { sendDeliveryMail };
