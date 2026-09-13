require("dotenv").config();
const express = require("express");
const path = require("path");

const db = require("./db");
const notesRouter = require("./routes/notes");
const jarsRouter = require("./routes/jars");

const app = express();
app.disable("x-powered-by");

// Cloudflare Tunnel (cloudflared) her isteği tek bir hop olarak proxy'ler — X-Forwarded-For
// bu yüzden güvenilir, gerçek istemci IP'sini yansıtır (rate-limit doğruluğu için gerekli).
app.set("trust proxy", 1);
app.use(express.json({ limit: "8kb" }));

const PORT = process.env.PORT || 3030;
const CORS_ORIGIN = process.env.CORS_ALLOWED_ORIGINS || "";

// Güvenlik ve CORS başlıkları middleware
app.use((req, res, next) => {
  if (CORS_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Sağlık kontrolü
app.get("/health", (req, res) => res.json({ ok: true }));

// Modüler API Rotaları
app.use("/api/notes", notesRouter);
app.use("/api/jars", jarsRouter);

// Statik Dosyalar
app.use(
  express.static(path.join(__dirname, "..", "public"), {
    maxAge: "10m",
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      }
    },
  })
);

// Veritabanı başlatma ve dinleme
db.init()
  .then(() => {
    app.listen(PORT, () => console.log(`[kavanoz] dinleniyor: ${PORT}`));
  })
  .catch((err) => {
    console.error("[kavanoz] DB init hatası:", err);
    process.exit(1);
  });

module.exports = app;
