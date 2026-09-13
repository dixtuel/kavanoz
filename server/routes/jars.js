const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/jars/active - aktif kavanoz özeti
router.get("/active", async (req, res) => {
  try {
    const summary = await db.getActiveJarSummary();
    res.json(summary);
  } catch (err) {
    console.error("[kavanoz] GET /api/jars/active hata:", err);
    res.status(500).json({ error: "server_error" });
  }
});

// GET /api/jars/shelf - arşivlenmiş kavanozlar
router.get("/shelf", async (req, res) => {
  try {
    const before = req.query.before ? Number(req.query.before) : null;
    const limit = Math.min(Number(req.query.limit) || 20, 200);
    if (before !== null && !Number.isInteger(before)) return res.status(400).json({ error: "invalid_before" });
    const [items, total] = await Promise.all([db.listShelf(before, limit), db.countShelf()]);
    res.json({ items, total });
  } catch (err) {
    console.error("[kavanoz] GET /api/jars/shelf hata:", err);
    res.status(500).json({ error: "server_error" });
  }
});

// GET /api/jars/:id/notes - kavanozun notları
router.get("/:id/notes", async (req, res) => {
  try {
    const jarId = Number(req.params.id);
    if (!Number.isInteger(jarId)) return res.status(400).json({ error: "invalid_jar_id" });
    const jar = await db.getJarMeta(jarId);
    if (!jar) return res.status(404).json({ error: "not_found" });
    const before = req.query.before ? Number(req.query.before) : null;
    const limit = Math.min(Number(req.query.limit) || 30, 60);
    const items = await db.listJarNotes(jarId, before, limit);
    res.json({ jar, items });
  } catch (err) {
    console.error(`[kavanoz] GET /api/jars/${req.params.id}/notes hata:`, err);
    res.status(500).json({ error: "server_error" });
  }
});

module.exports = router;
