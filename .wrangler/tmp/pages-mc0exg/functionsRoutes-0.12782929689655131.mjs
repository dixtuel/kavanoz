import { onRequestGet as __api_jars__id__notes_js_onRequestGet } from "/opt/kavanoz/functions/api/jars/[id]/notes.js"
import { onRequestOptions as __api_jars__id__notes_js_onRequestOptions } from "/opt/kavanoz/functions/api/jars/[id]/notes.js"
import { onRequestGet as __api_jars_active_js_onRequestGet } from "/opt/kavanoz/functions/api/jars/active.js"
import { onRequestOptions as __api_jars_active_js_onRequestOptions } from "/opt/kavanoz/functions/api/jars/active.js"
import { onRequestGet as __api_jars_shelf_js_onRequestGet } from "/opt/kavanoz/functions/api/jars/shelf.js"
import { onRequestOptions as __api_jars_shelf_js_onRequestOptions } from "/opt/kavanoz/functions/api/jars/shelf.js"
import { onRequestOptions as __api_notes_manage_js_onRequestOptions } from "/opt/kavanoz/functions/api/notes/manage.js"
import { onRequestPost as __api_notes_manage_js_onRequestPost } from "/opt/kavanoz/functions/api/notes/manage.js"
import { onRequestGet as __api_notes__id__js_onRequestGet } from "/opt/kavanoz/functions/api/notes/[id].js"
import { onRequestOptions as __api_notes__id__js_onRequestOptions } from "/opt/kavanoz/functions/api/notes/[id].js"
import { onRequestOptions as __api_notes_index_js_onRequestOptions } from "/opt/kavanoz/functions/api/notes/index.js"
import { onRequestPost as __api_notes_index_js_onRequestPost } from "/opt/kavanoz/functions/api/notes/index.js"
import { onRequestGet as __health_js_onRequestGet } from "/opt/kavanoz/functions/health.js"

export const routes = [
    {
      routePath: "/api/jars/:id/notes",
      mountPath: "/api/jars/:id",
      method: "GET",
      middlewares: [],
      modules: [__api_jars__id__notes_js_onRequestGet],
    },
  {
      routePath: "/api/jars/:id/notes",
      mountPath: "/api/jars/:id",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_jars__id__notes_js_onRequestOptions],
    },
  {
      routePath: "/api/jars/active",
      mountPath: "/api/jars",
      method: "GET",
      middlewares: [],
      modules: [__api_jars_active_js_onRequestGet],
    },
  {
      routePath: "/api/jars/active",
      mountPath: "/api/jars",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_jars_active_js_onRequestOptions],
    },
  {
      routePath: "/api/jars/shelf",
      mountPath: "/api/jars",
      method: "GET",
      middlewares: [],
      modules: [__api_jars_shelf_js_onRequestGet],
    },
  {
      routePath: "/api/jars/shelf",
      mountPath: "/api/jars",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_jars_shelf_js_onRequestOptions],
    },
  {
      routePath: "/api/notes/manage",
      mountPath: "/api/notes",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_notes_manage_js_onRequestOptions],
    },
  {
      routePath: "/api/notes/manage",
      mountPath: "/api/notes",
      method: "POST",
      middlewares: [],
      modules: [__api_notes_manage_js_onRequestPost],
    },
  {
      routePath: "/api/notes/:id",
      mountPath: "/api/notes",
      method: "GET",
      middlewares: [],
      modules: [__api_notes__id__js_onRequestGet],
    },
  {
      routePath: "/api/notes/:id",
      mountPath: "/api/notes",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_notes__id__js_onRequestOptions],
    },
  {
      routePath: "/api/notes",
      mountPath: "/api/notes",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_notes_index_js_onRequestOptions],
    },
  {
      routePath: "/api/notes",
      mountPath: "/api/notes",
      method: "POST",
      middlewares: [],
      modules: [__api_notes_index_js_onRequestPost],
    },
  {
      routePath: "/health",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__health_js_onRequestGet],
    },
  ]