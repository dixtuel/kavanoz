import * as db from "../../_lib/db.js";
import { jsonResponse, corsPreflight } from "../../_lib/response.js";

export async function onRequestOptions({ env }) {
  return corsPreflight(env);
}

// GET /api/notes/:id — tekil (paylaşım linki) not görüntüleme.
// Public içerik, kısa edge cache ile Function quota tüketimini azaltıyoruz.
export async function onRequestGet({ params, env }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return jsonResponse({ error: "invalid_id" }, 400, env);

  const note = await db.getNote(env, id);
  if (!note) return jsonResponse({ error: "not_found" }, 404, env);

  return jsonResponse(note, 200, env, {
    "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=300",
  });
}
