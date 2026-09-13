# Açık Kaynak Lisans ve Atıf Bildirimleri (Attribution)

Bu belge, **Sanal Kavanoz** projesinde doğrudan veya dolaylı olarak kullanılan açık kaynaklı yazılımları, kütüphaneleri, fontları, simgeleri ve mimari referansları listeler. Tüm bileşenlerin telif hakları ilgili hak sahiplerine aittir.

---

## 1. Doğrudan Bağımlılıklar ve Kütüphaneler

### [Matter.js](https://brm.io/matter-js/)
- **Kullanım:** Kavanoz içindeki 2D yerçekimi ve interaktif zarf fizik simülasyonu (`public/vendor/matter.min.js`, `public/jar-physics.js`).
- **Lisans:** MIT Lisansı
- **Telif Hakkı:** Copyright (c) Liam Brummitt and contributors
- **Web Sitesi:** https://github.com/liabru/matter-js

### [@libsql/client (Turso)](https://turso.tech)
- **Kullanım:** Bulut SQLite / libSQL veritabanı sürücüsü (`server/db.js`, `functions/_lib/turso.js`).
- **Lisans:** MIT Lisansı
- **Telif Hakkı:** Copyright (c) ChiselStrike, Inc.
- **Web Sitesi:** https://github.com/tursodatabase/libsql-client-ts

### [Express](https://expressjs.com/)
- **Kullanım:** Node.js HTTP sunucusu ve API yönlendirme katmanı (`server/server.js`).
- **Lisans:** MIT Lisansı
- **Telif Hakkı:** Copyright (c) StrongLoop, Inc., and other expressjs.com contributors
- **Web Sitesi:** https://github.com/expressjs/express

### [Nodemailer](https://nodemailer.com/)
- **Kullanım:** Gecikmeli zaman kapsülü e-postalarının SMTP/Postfix üzerinden gönderimi (`server/mailer.js`).
- **Lisans:** MIT Lisansı
- **Telif Hakkı:** Copyright (c) Andris Reinman
- **Web Sitesi:** https://github.com/nodemailer/nodemailer

### [dotenv](https://github.com/motdotla/dotenv)
- **Kullanım:** Ortam değişkenlerinin yönetimi.
- **Lisans:** BSD-2-Clause Lisansı
- **Telif Hakkı:** Copyright (c) 2015, Mot / Scott Motte

### [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)
- **Kullanım:** API uç noktaları için IP bazlı istek sınırlama.
- **Lisans:** MIT Lisansı
- **Telif Hakkı:** Copyright (c) Nathan Friedly

---

## 2. Dış Servisler ve API'lar

### [hCaptcha](https://www.hcaptcha.com/)
- **Kullanım:** Otomasyon ve istenmeyen bot kayıtlarını engelleme (`server/hcaptcha.js`, `functions/_lib/moderation.js`).
- **Telif Hakkı:** Intuition Machines, Inc.
- **Gizlilik:** [hCaptcha Gizlilik Politikası](https://www.hcaptcha.com/privacy)

### [NVIDIA NIM AI Safety Guard](https://build.nvidia.com/)
- **Kullanım:** Çoklu kategoride yapay zekâ destekli içerik denetimi (`llama-3.1-nemotron-safety-guard-8b-v3`).
- **Lisans:** NVIDIA AI Foundation Model License
- **Telif Hakkı:** NVIDIA Corporation

### [Cloudflare Pages & Functions](https://pages.cloudflare.com/)
- **Kullanım:** Sunucusuz Edge API ve statik CDN barındırma (`functions/`).
- **Telif Hakkı:** Cloudflare, Inc.

---

## 3. Tipografi ve Yazı Tipleri (Google Fonts)

### [Lora](https://fonts.google.com/specimen/Lora)
- **Kullanım:** Gövde ve editoryal başlık tipografisi.
- **Lisans:** SIL Open Font License 1.1
- **Telif Hakkı:** Copyright (c) 2011-2013, Cyreal (www.cyreal.org)

### [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Kullanım:** Arayüz metinleri, butonlar ve form elemanları.
- **Lisans:** SIL Open Font License 1.1
- **Telif Hakkı:** Copyright (c) 2020, Gumpita Rahayu (Tokotype)

### [Caveat](https://fonts.google.com/specimen/Caveat)
- **Kullanım:** Zarf üzeri el yazısı notları ve başlık vurguları.
- **Lisans:** SIL Open Font License 1.1
- **Telif Hakkı:** Copyright (c) 2014, Pablo Impallari (www.impallari.com)

### [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono)
- **Kullanım:** Yönetim anahtarı ve sistem etiketleri tipografisi.
- **Lisans:** SIL Open Font License 1.1
- **Telif Hakkı:** Copyright (c) 2017, IBM Corp. with Reserved Font Name "Plex"

---

## 4. Mimari ve Algoritmik İlham

### [TardigradeMail](https://github.com/TardigradeMail)
- **Kullanım:** `worker/send-due.js` içindeki atomik `UPDATE ... WHERE mail_status='pending'` claim deseni, exponential backoff ve kilit açma durum makinesi mekanizması için esin kaynağı olmuştur.
- **Lisans:** Açık Kaynak Referans

---

## 5. Lisans Bildirimi

Yukarıda listelenen bileşenlerin kendi lisans koşulları saklı kalmak kaydıyla, Sanal Kavanoz kaynak kodunun tamamı **[MIT Lisansı](LICENSE)** ile lisanslanmıştır.
