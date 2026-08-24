import * as db from "../../_lib/db.js";
import { jsonResponse, corsPreflight } from "../../_lib/response.js";

export async function onRequestOptions({ env }) {
  return corsPreflight(env);
}

// GET /api/jars/active — sık yoklanan (polling) endpoint. Çok kısa edge cache
// (2-3sn) trafik patlamalarını Function invocation'a hiç düşürmeden emer.
export async function onRequestGet({ env }) {
  const summary = await db.getActiveJarSummary(env);
  return jsonResponse(summary, 200, env, {
    "Cache-Control": "public, max-age=3, s-maxage=6, stale-while-revalidate=30",
  });
}
