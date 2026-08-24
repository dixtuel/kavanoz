require("dotenv").config();
const db = require("../server/db");
const { sendDeliveryMail } = require("../server/mailer");

// systemd timer tarafından her 10 dakikada bir tetiklenen oneshot iş.
// 7/24 çalışan ayrı bir process yok — VDS boştayken sıfır kaynak tüketimi hedefi budur.
async function main() {
  await db.init();

  // Önceki çalıştırma reboot/crash ile yarım kaldıysa 'sending' kayıtlarını geri al.
  await db.recoverStuckMail();

  // Gönderenin seçtiği saklama süresi dolan notları temizle (yönetici takdirine bırakılanlar hiç silinmez).
  const purged = await db.purgeExpiredByRetention();

  const ids = await db.claimDueMailIds(25);
  let sent = 0;
  let failed = 0;

  for (const id of ids) {
    const note = await db.claimNoteForMail(id);
    if (!note) continue; // başka bir eşzamanlı çalıştırma zaten aldı

    try {
      await sendDeliveryMail(note.id, note.email, note.message, note.lang);
      await db.markMailSent(id);
      sent++;
    } catch (err) {
      const result = await db.markMailFailed(id);
      failed++;
      console.error(`[kavanoz-worker] mail #${id} gönderilemedi (deneme ${result.attempts}):`, err.message);
    }
  }

  console.log(`[kavanoz-worker] tamamlandı: ${sent} gönderildi, ${failed} başarısız, ${purged} saklama süresi dolan not silindi`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[kavanoz-worker] beklenmeyen hata:", err);
    process.exit(1);
  });
