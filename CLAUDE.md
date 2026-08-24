# Sanal Kavanoz (repo) — Yönlendirme

Bu dosya yalnız yönlendirme içindir, hafıza/dokümantasyon DEĞİL. Ayrıntılı mimari, deploy prosedürü, kod haritası, ortam değişkenleri, tasarım tercihleri ve bilinen gotcha'lar için canonical doküman: **`/root/mikoshi-vds-docs/projects/kavanoz.md`**.

Bu dosya `CLAUDE.md`/`AGENTS.md`/`GEMINI.md` üçlüsünün bir parçasıdır (bkz. `/root/.claude/CLAUDE.md`), üçü birebir aynı tutulur.

## Hızlı Hatırlatıcılar (canonical dokümanın özeti değil, yalnız en kritik 2 kural)

- Bu dizin **repo**'dur (public, MIT, [dixtuel/kavanoz](https://github.com/dixtuel/kavanoz)) — kimlik bağlama (gerçek e-posta, gerçek secrets) verisi burada **olmamalı**. `.env`, `.gitignore`'da. Gerçek iletişim e-postası yerine `your-email@example.com` placeholder'ı kalır (`public/terms.html`, `public/privacy.html`, TR+EN).
- **Prod kopyası ayrı**: `/srv/mikoshi-vds/containers/kavanoz` — gerçek `.env`, gerçek iletişim e-postası orada. Kod değişince önce burada (repo) geliştir/test et, sonra AYNI değişikliği prod'a da uygula (identity-linked satırları koruyarak).

Herhangi bir değişiklik yapmadan önce `kavanoz.md`'yi oku; güncel değilse orayı güncelle — buraya değil.
