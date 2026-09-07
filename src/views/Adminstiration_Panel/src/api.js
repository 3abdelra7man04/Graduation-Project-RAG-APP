// ── api.js — shared API client, env-driven base URL ────────────────────────
// Backend URL comes from VITE_API_URL (see .env.example); falls back to the
// same localhost:5000 every page used to hardcode.

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Thin fetch wrapper: builds the full URL from BASE_URL and always attempts
// to parse a JSON body (on both success and error responses, since several
// backend routes return an error payload alongside a non-2xx status).
// Returns { ok, status, data } — callers keep their existing
// `if (result.ok) { use result.data }` shape.
export async function apiFetch(path, opts) {
  const res = await fetch(`${BASE_URL}${path}`, opts);
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}
