require("dotenv").config();
const db = require("../server/db");
const { sendDeliveryMail } = require("../server/mailer");

// systemd timer tarafından her 10 dakikada bir tetiklenen oneshot iş.
// 7/24 dinleyen ayrı bir process yok — VDS boştayken sıfır kaynak tüketimi hedefi budur.
async function main() {
  await db.init();

  // Önceki çalıştırma reboot/crash ile yarım kaldıysa 'sending' kayıtlarını geri al.
  await db.recoverStuckMail();

  // Süresi dolan public kavanozları panoda aç (mail gönderiminden bağımsız, saf zaman kontrolü).
  await db.revealDuePublicLetters();

  // Onaylanmadan 48 saat bekleyen kayıtların kişisel verisini temizle.
  await db.purgeAbandoned();

  const ids = await db.claimDueMailIds(25);
  let sent = 0;
  let failed = 0;

  for (const id of ids) {
    const letter = await db.claimLetter(id);
    if (!letter) continue; // başka bir eşzamanlı çalıştırma zaten aldı

    if (!letter.ownerEmail) {
      // Onaysız/temizlenmiş kayıt sızmış olabilir — gönderilecek bir şey yok.
      await db.markMailSent(id);
      continue;
    }

    try {
      await sendDeliveryMail(letter.id, letter.ownerEmail, letter.message, letter.lang);
      await db.markMailSent(id);
      sent++;
    } catch (err) {
      const result = await db.markMailFailed(id);
      failed++;
      console.error(`[kavanoz-worker] mail #${id} gönderilemedi (deneme ${result.attempts}):`, err.message);
    }
  }

  console.log(`[kavanoz-worker] tamamlandı: ${sent} gönderildi, ${failed} başarısız, ${ids.length - sent - failed} atlandı`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[kavanoz-worker] beklenmeyen hata:", err);
    process.exit(1);
  });
