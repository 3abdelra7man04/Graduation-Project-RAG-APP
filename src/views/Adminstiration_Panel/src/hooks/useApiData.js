// ── useApiData — shared KPI/data-fetch hook ────────────────────────────────
// Reconciles the two fetch styles that used to live side by side:
// Dashboard.js did async/await + `if (res.ok)` + one field extraction per
// call, Inbox.js did `.then()` chains with no `res.ok` check. This hook
// always does the `apiFetch` → ok-check → transform dance once, consistently,
// and callers keep 100% of their own field-extraction/formatting logic by
// passing it in as `transform`.
//
// `path` is a relative API path (e.g. `/api/v1/dashboard/...`), or a falsy
// value (null/""/false) to skip fetching entirely — handy for requests that
// depend on some other piece of state being set first (e.g. a selected id).
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../api";

export function useApiData(path, { transform, enabled = true } = {}) {
  const [state, setState] = useState({
    data: null,
    loading: Boolean(enabled && path),
    error: null,
  });

  // kept in a ref so an inline transform function doesn't retrigger the
  // effect (and therefore the fetch) on every render
  const transformRef = useRef(transform);
  transformRef.current = transform;

  useEffect(() => {
    if (!enabled || !path) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    apiFetch(path)
      .then(({ ok, status, data }) => {
        if (cancelled) return;
        if (!ok) {
          setState({ data: null, loading: false, error: new Error(`Request failed: ${status}`) });
          return;
        }
        const value = transformRef.current ? transformRef.current(data) : data;
        setState({ data: value, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`Error fetching ${path}:`, err);
        setState({ data: null, loading: false, error: err });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, enabled]);

  return state;
}
