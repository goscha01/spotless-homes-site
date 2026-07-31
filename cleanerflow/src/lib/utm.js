// Attribution capture — the site's single source of truth for
// where a visitor came from. Read by tracking events (src/lib/track.js),
// the phone-source resolver (src/lib/phone.js), and the booking form
// hidden fields (src/pages/booking.jsx).
//
// Design notes:
//   * First-touch. Once we've persisted an attribution record with real
//     signal (a click identifier or any utm_*), we don't overwrite it on
//     later landings — Google Ads offline conversion imports need the
//     original gclid, and a returning visitor arriving via direct/organic
//     should not wipe the campaign that produced them.
//   * localStorage-primary, sessionStorage-fallback. localStorage keeps
//     gclid available across sessions for offline conversion imports.
//     If localStorage is unavailable (Safari private mode etc.), we drop
//     back to sessionStorage so at-least in-session attribution works.
//   * Site-specific enrichment (city, service, coupon, promo, ref) is
//     preserved alongside the canonical ad-platform identifiers so the
//     admin email + downstream events still surface them.

const STORAGE_KEY = "sh_attribution";

// Ad-platform click identifiers + UTM tags that we persist first-touch and
// forward to lead events. gbraid/wbraid are the iOS-14+ Google Ads
// SKAdNetwork-safe equivalents of gclid; fbclid is Meta; msclkid is
// Microsoft/Bing Ads. Keep this list in sync with the admin EmailJS
// template — any field added here also needs `{{fieldName}}` in the
// template to render in the lead email.
const AD_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "gclid", "gbraid", "wbraid",
  "fbclid",
  "msclkid",
];

// Site-specific query-string enrichment that shouldn't overwrite ad
// attribution but should still round-trip to the lead email + tracking.
const SITE_PARAMS = ["city", "service", "coupon", "promo", "ref"];

const ALL_PARAMS = [...AD_PARAMS, ...SITE_PARAMS];

function safeStorage() {
  if (typeof window === "undefined") return null;
  try {
    // Probe localStorage — throws in Safari private mode + when quota'd.
    const k = "__sh_probe__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return window.localStorage;
  } catch (e) {
    try { return window.sessionStorage; } catch (e2) { return null; }
  }
}

function readStored() {
  const store = safeStorage();
  if (!store) return null;
  try {
    const raw = store.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function writeStored(obj) {
  const store = safeStorage();
  if (!store) return;
  try { store.setItem(STORAGE_KEY, JSON.stringify(obj)); }
  catch (e) { /* quota — silently skip */ }
}

function detectDevice() {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent || "";
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
}

function hasAdSignal(obj) {
  if (!obj) return false;
  return AD_PARAMS.some((p) => obj[p]);
}

// Called from GAListener (route change) + the booking-page landing effect.
// Idempotent by design — first call with real ad signal wins for the
// lifetime of the storage record.
export function captureUTMs() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const found = {};
  let hasAny = false;
  for (const p of ALL_PARAMS) {
    const v = url.searchParams.get(p);
    if (v) { found[p] = v; hasAny = true; }
  }

  const existing = readStored();

  // First-touch guard: once we've captured a landing WITH ad signal, don't
  // let a subsequent direct/organic landing wipe it. Merge in any new
  // site-specific params (coupon codes revealed on a later page etc.).
  if (existing && hasAdSignal(existing)) {
    if (hasAny) {
      let mutated = false;
      const merged = { ...existing };
      for (const p of SITE_PARAMS) {
        if (found[p] && !merged[p]) { merged[p] = found[p]; mutated = true; }
      }
      if (mutated) writeStored(merged);
    }
    return;
  }

  // If we've never stored anything and this landing has no signal at all,
  // still record referrer/landing_page/device so the eventual lead has a
  // provenance record. But mark it as a "direct" landing.
  if (!existing && !hasAny) {
    writeStored({
      utm_source: "(direct)",
      utm_medium: "(none)",
      referrer: (typeof document !== "undefined" && document.referrer) || "",
      landing_page: url.pathname,
      entry_path:   url.pathname + url.search,
      first_visit_timestamp: new Date().toISOString(),
      landing_at: new Date().toISOString(),
      device: detectDevice(),
    });
    return;
  }

  // We have ad signal on this landing (or non-ad signal replacing a
  // previous direct-only record) — persist the full landing record.
  if (hasAny) {
    writeStored({
      ...found,
      referrer: (typeof document !== "undefined" && document.referrer) || "",
      landing_page: url.pathname,
      entry_path:   url.pathname + url.search,
      first_visit_timestamp: (existing && existing.first_visit_timestamp) || new Date().toISOString(),
      landing_at: new Date().toISOString(),
      device: detectDevice(),
    });
  }
}

export function getStoredUTMs() {
  return readStored() || {};
}

// Flat object suitable for spreading into a form payload (EmailJS,
// backend POST). Includes every ad-platform identifier + referrer/
// landing_page/device — keys always present (empty string when missing)
// so downstream templates don't have to guard against undefined.
export function getAttributionForForm() {
  const u = getStoredUTMs();
  const flat = {};
  for (const p of AD_PARAMS) flat[p] = u[p] || "";
  for (const p of SITE_PARAMS) flat[p] = u[p] || "";
  flat.referrer = u.referrer || "";
  flat.landing_page = u.landing_page || "";
  flat.first_visit_timestamp = u.first_visit_timestamp || "";
  flat.device = u.device || detectDevice();
  return flat;
}

export function summarizeUTMs(u) {
  if (!u) return "";
  const parts = [
    u.utm_source   && `Source: ${u.utm_source}`,
    u.utm_medium   && `Medium: ${u.utm_medium}`,
    u.utm_campaign && `Campaign: ${u.utm_campaign}`,
    u.utm_content  && `Content: ${u.utm_content}`,
    u.utm_term     && `Term: ${u.utm_term}`,
    u.gclid        && `gclid: ${u.gclid}`,
    u.gbraid       && `gbraid: ${u.gbraid}`,
    u.wbraid       && `wbraid: ${u.wbraid}`,
    u.fbclid       && `fbclid: ${u.fbclid}`,
    u.msclkid      && `msclkid: ${u.msclkid}`,
    u.city         && `City: ${u.city}`,
    u.service      && `Service: ${u.service}`,
    u.coupon       && `Coupon: ${u.coupon}`,
    u.promo        && `Promo: ${u.promo}`,
    u.ref          && `Ref: ${u.ref}`,
    u.landing_page && `Landing: ${u.landing_page}`,
    u.entry_path   && u.entry_path !== u.landing_page && `Entry: ${u.entry_path}`,
    u.referrer     && `Referrer: ${u.referrer}`,
    u.device       && `Device: ${u.device}`,
  ].filter(Boolean);
  return parts.join(" · ");
}
