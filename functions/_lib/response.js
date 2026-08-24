export function jsonResponse(data, status = 200, env = null, extraHeaders = {}) {
  const origin = env?.CORS_ALLOWED_ORIGINS || "*";
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      "Vary": "Origin",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

export function corsPreflight(env) {
  const origin = env?.CORS_ALLOWED_ORIGINS || "*";
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export function isValidEmailSyntax(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

const MAX_YEARS = 5;
export function maxFutureDate() {
  return new Date(Date.now() + MAX_YEARS * 365 * 86400000);
}
export function validateFutureDate(value) {
  const d = new Date(value);
  const now = new Date();
  return !Number.isNaN(d.getTime()) && d > now && d <= maxFutureDate() ? d : null;
}
export { MAX_YEARS };
