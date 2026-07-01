const STORAGE_KEY = "sh_attribution";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid"];

export function captureUTMs() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const found = {};
  let any = false;
  for (const p of PARAMS) {
    const v = url.searchParams.get(p);
    if (v) { found[p] = v; any = true; }
  }
  if (!any) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...found,
      landing_page: url.pathname,
      landing_at: new Date().toISOString(),
    }));
  } catch (e) { /* private mode / quota — silently skip */ }
}

export function getStoredUTMs() {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

export function summarizeUTMs(u) {
  if (!u || !u.utm_source) return "";
  const parts = [
    `Source: ${u.utm_source}`,
    u.utm_medium && `Medium: ${u.utm_medium}`,
    u.utm_campaign && `Campaign: ${u.utm_campaign}`,
    u.utm_content && `Content: ${u.utm_content}`,
    u.utm_term && `Term: ${u.utm_term}`,
    u.gclid && `gclid: ${u.gclid}`,
    u.landing_page && `Landing: ${u.landing_page}`,
  ].filter(Boolean);
  return parts.join(" · ");
}
