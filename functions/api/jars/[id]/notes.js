import * as db from "../../../_lib/db.js";
import { jsonResponse, corsPreflight } from "../../../_lib/response.js";

export async function onRequestOptions({ env }) {
  return corsPreflight(env);
}

// GET /api/jars/:id/notes — bir kavanozun içindeki notlar.
// Aktif kavanoz sık değişir (kısa cache); arşivlenmiş kavanoz artık değişmez ama
// tek route'ta hangi durumda olduğunu bilmeden ayrım yapmıyoruz — orta uzunlukta
// güvenli bir cache süresi (dilek-agaci'daki "since=0" mantığının analogu).
export async function onRequestGet({ params, request, env }) {
  const jarId = Number(params.id);
  if (!Number.isInteger(jarId)) return jsonResponse({ error: "invalid_jar_id" }, 400, env);

  const jar = await db.getJarMeta(env, jarId);
  if (!jar) return jsonResponse({ error: "not_found" }, 404, env);

  const url = new URL(request.url);
  const before = url.searchParams.get("before") ? Number(url.searchParams.get("before")) : null;
  const limit = Math.min(Number(url.searchParams.get("limit")) || 30, 60);

  const items = await db.listJarNotes(env, jarId, before, limit);

  const cacheHeader = jar.status === "archived"
    ? "public, max-age=300, s-maxage=900, stale-while-revalidate=1800"
    : "public, max-age=5, s-maxage=10, stale-while-revalidate=30";

  return jsonResponse({ jar, items }, 200, env, { "Cache-Control": cacheHeader });
}
