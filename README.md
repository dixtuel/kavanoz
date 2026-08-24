# Sanal Kavanoz

Hesap gerektirmeyen, ortak ve herkese açık bir pano: herkes tek bir kavanoza not bırakır (anonim ya da adıyla), herkes tıklayıp okuyabilir. Kavanoz belirli bir not sayısına ulaşınca rafa kalkar, yeni bir kavanoz başlar. Mail adresi opsiyoneldir — yalnız notunu ileride mail olarak da almak istersen (en fazla 5 yıl sonrasına, onay gerekmeden) kullanılır. Her not, sahibine bir kez gösterilen bir "yönetim anahtarı" ile daha sonra silinebilir/düzenlenebilir.

## Mimari

- **Backend:** Node.js/Express, Turso (libSQL) veritabanı, parametreli sorgular.
- **Ortak kavanoz + raf:** `jars` tablosu — aktif kavanoz kapasiteye (`JAR_CAPACITY`) ulaşınca otomatik arşivlenir ("rafa kalkar"), yeni not otomatik yeni kavanoza düşer.
- **Yönetim anahtarı:** Not oluşturulunca istemciye bir kez gösterilir; sunucuda yalnız SHA-256 hash'i saklanır (`server/crypto.js`). Bu anahtarla silme/düzenleme yapılır (`POST /api/notes/manage`), hesap/e-posta gerekmez.
- **Gecikmeli gönderim (opsiyonel):** 7/24 çalışan bir servis yok — `worker/send-due.js`, systemd timer (`deploy/kavanoz-worker.timer`) tarafından her 10 dakikada bir tetiklenir; atomik "claim" + durum makinesi ile restart-safe çalışır. Aynı worker, gönderenin seçtiği saklama süresi dolan notları da temizler.
- **Şifreleme:** Not metni ve e-posta adresi AES-256-GCM ile at-rest şifrelenir, anahtar yalnız ortam değişkeninde tutulur.
- **Moderasyon:** Yerel TR kara liste + NVIDIA NIM `llama-3.1-nemotron-safety-guard-8b-v3` (iki katmanlı, fail-closed) — tüm notlar herkese açık olduğu için her kayıtta çalışır.
- **Bot koruması:** hCaptcha.
- **E-posta doğrulama:** yalnız MX kaydı kontrolü — çift onay (double opt-in) yok, kullanıcı tercihi gereği.

## Yerel geliştirme

```bash
cp .env.example .env   # değerleri doldur
npm install
npm start               # http://localhost:3030
npm run worker          # gecikmeli gönderimi manuel tetikle
```

## Dağıtım

Bu repo (public, MIT) kimlik-bağlama verisi içermez. Canlı ortamda `/srv/mikoshi-vds/containers/kavanoz` altına kopyalanır, gerçek `.env` ve varsa kimlik-bağlama verisi yalnız orada bulunur. Detaylar: `deploy/` dizini (Dockerfile, systemd unit'leri, docker-compose parçası) ve VDS canonical dokümanı `mikoshi-vds-docs/projects/kavanoz.md`.

## Lisans

MIT — Asrın Kılıç (dixtuel)
