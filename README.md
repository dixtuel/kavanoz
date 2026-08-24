# Sanal Kavanoz

Hesap gerektirmeyen bir zaman-kapsülü sitesi: bir not yaz, bir tarih seç; o tarih geldiğinde notu (kendine veya seçtiğin kişiye) mail olarak gönderiyoruz. İstersen anonim, istersen adınla; istersen tamamen özel, istersen "kavanoz duvarı"nda herkese açık.

## Mimari

- **Backend:** Node.js/Express, Turso (libSQL) veritabanı, parametreli sorgular.
- **Gecikmeli gönderim:** 7/24 çalışan bir servis yok — `worker/send-due.js`, systemd timer (`deploy/kavanoz-worker.timer`) tarafından her 10 dakikada bir tetiklenir; atomik "claim" + durum makinesi ile restart-safe çalışır.
- **Şifreleme:** Not metni ve e-posta adresi AES-256-GCM ile at-rest şifrelenir (`server/crypto.js`), anahtar yalnız ortam değişkeninde tutulur.
- **Moderasyon:** Yerel TR kara liste + NVIDIA NIM `llama-3.1-nemotron-safety-guard-8b-v3` (iki katmanlı, fail-closed).
- **Bot koruması:** hCaptcha.
- **E-posta doğrulama:** MX kaydı kontrolü + çift onay (double opt-in) — onaylanmayan kavanoz asla aktifleşmez, 48 saat içinde otomatik silinir.

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
