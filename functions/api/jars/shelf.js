import * as db from "../../_lib/db.js";
import { jsonResponse, corsPreflight } from "../../_lib/response.js";

export async function onRequestOptions({ env }) {
  return corsPreflight(env);
}

// GET /api/jars/shelf — arşivlenmiş (artık değişmeyen) kavanoz listesi, uzun cache güvenli.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const before = url.searchParams.get("before") ? Number(url.searchParams.get("before")) : null;
  const limit = Math.min(Number(url.searchParams.get("limit")) || 20, 200);
  if (before !== null && !Number.isInteger(before)) return jsonResponse({ error: "invalid_before" }, 400, env);

  const [items, total] = await Promise.all([db.listShelf(env, before, limit), db.countShelf(env)]);
  return jsonResponse({ items, total }, 200, env, {
    "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
  });
}
