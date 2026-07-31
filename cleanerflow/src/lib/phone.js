// Phone number abstraction — a single lookup layer so we can enable
// Dynamic Number Insertion (DNI) later without touching every page.
//
// Today: every call site imports `defaultPhone` / `phoneHref` and gets the
// house line. When DNI is turned on, the CONFIG map below gets per-source
// numbers filled in (either hard-coded, from a call-tracking provider,
// or via a build-time env var) and the same call sites pick up the
// swapped number automatically based on the stored attribution.
//
// Sources are canonical strings — the map from raw utm_source /
// referrer values happens in `resolveSource()` below. Adding a new
// provider means adding an entry to CONFIG and (if the source name
// isn't already utm_source-shaped) a case in resolveSource().

import { getStoredUTMs } from "./utm";

// Master default. Every location that today reads a hard-coded phone
// number should route through this file so DNI just works.
export const DEFAULT_PHONE = {
  display: "813-921-2100",
  e164:    "+18139212100",
  href:    "tel:+18139212100",
};

// Source → phone override. Populated later per source (Google Ads pool,
// GBP, Yelp, etc.). Anything not in the map falls back to DEFAULT_PHONE.
// Shape: { display: "...", e164: "+1...", href: "tel:+1..." }
const CONFIG = {
  google_ads:      null,
  google_business: null,
  yelp:            null,
  facebook:        null,
  instagram:       null,
  thumbtack:       null,
  organic:         null,
  direct:          null,
  referral:        null,
};

// Canonical source keys — exported so callers can dispatch on them if
// they need to (e.g. a header banner that says "You reached us via
// Google Ads" — hypothetical, we don't do this today).
export const SOURCES = Object.freeze({
  GOOGLE_ADS:      "google_ads",
  GOOGLE_BUSINESS: "google_business",
  YELP:            "yelp",
  FACEBOOK:        "facebook",
  INSTAGRAM:       "instagram",
  THUMBTACK:       "thumbtack",
  ORGANIC:         "organic",
  DIRECT:          "direct",
  REFERRAL:        "referral",
});

// Referrer hostname → source. Kept minimal — extend as we identify
// more partners.
const REFERRER_SOURCE = [
  { match: /(^|\.)google\.com$/i,     source: SOURCES.ORGANIC   },
  { match: /(^|\.)bing\.com$/i,       source: SOURCES.ORGANIC   },
  { match: /(^|\.)duckduckgo\.com$/i, source: SOURCES.ORGANIC   },
  { match: /(^|\.)yelp\.com$/i,       source: SOURCES.YELP      },
  { match: /(^|\.)thumbtack\.com$/i,  source: SOURCES.THUMBTACK },
  { match: /(^|\.)facebook\.com$/i,   source: SOURCES.FACEBOOK  },
  { match: /(^|\.)instagram\.com$/i,  source: SOURCES.INSTAGRAM },
];

// Map the stored attribution record to one of our canonical SOURCES.
// Priority: paid-click identifiers > utm_source > referrer > direct.
export function resolveSource(attribution) {
  const u = attribution || getStoredUTMs();

  // Paid clicks first — any Google click ID means Google Ads.
  if (u.gclid || u.gbraid || u.wbraid) return SOURCES.GOOGLE_ADS;
  if (u.fbclid)  return SOURCES.FACEBOOK;
  if (u.msclkid) return SOURCES.GOOGLE_ADS; // Bing/Microsoft Ads — no separate CONFIG entry today

  const src = (u.utm_source || "").toLowerCase();
  if (src) {
    if (/google.*ads|adwords|cpc/.test(src) || u.utm_medium === "cpc") return SOURCES.GOOGLE_ADS;
    if (src.includes("gbp") || src.includes("business_profile") || src.includes("gmb")) return SOURCES.GOOGLE_BUSINESS;
    if (src.includes("yelp"))      return SOURCES.YELP;
    if (src.includes("facebook"))  return SOURCES.FACEBOOK;
    if (src.includes("instagram")) return SOURCES.INSTAGRAM;
    if (src.includes("thumbtack")) return SOURCES.THUMBTACK;
    if (src === "google" && u.utm_medium === "organic") return SOURCES.ORGANIC;
    if (u.utm_medium === "referral") return SOURCES.REFERRAL;
  }

  const ref = u.referrer || "";
  if (ref) {
    try {
      const host = new URL(ref).hostname;
      for (const rule of REFERRER_SOURCE) {
        if (rule.match.test(host)) return rule.source;
      }
      return SOURCES.REFERRAL;
    } catch (e) { /* malformed referrer — fall through to direct */ }
  }

  return SOURCES.DIRECT;
}

// Primary API — return the phone number a call-tracking-safe way. Callers
// that need the DNI-swapped number use this instead of DEFAULT_PHONE.
export function getPhone(source) {
  const key = source || resolveSource();
  const override = CONFIG[key];
  if (override && override.e164 && override.display) return override;
  return DEFAULT_PHONE;
}

export function getDisplayPhone(source) { return getPhone(source).display; }
export function getPhoneHref(source)    { return getPhone(source).href;    }
export function getE164Phone(source)    { return getPhone(source).e164;    }

// Test seam / runtime hook — call from a bootstrap block if you want to
// wire DNI without editing this file (e.g. a provider that gives you
// numbers as JSON at runtime). Passing `null` clears the override.
export function setPhoneForSource(source, override) {
  if (!(source in CONFIG)) return;
  CONFIG[source] = override && override.e164 && override.display ? override : null;
}
