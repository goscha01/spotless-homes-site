// Marketing Context System for /booking.
//
// One pure function `resolveBookingContext(searchParams)` returns a single
// object describing everything the page should personalize (hero copy, CTA,
// image, trust badges, tracking, coupons). The page renders from it — no ad
// hoc URL parsing lives in components.
//
// Configuration layers are merged in this order (later layers win):
//   DEFAULTS
//     → CITY_OVERRIDES[city]
//     → SERVICE_OVERRIDES[service]
//     → SOURCE_OVERRIDES[utm_source]
//     → CAMPAIGN_OVERRIDES[utm_campaign]
//     → explicit URL overrides (?headline= ?subheadline= ?cta= ?hero=)
//
// To ship a new campaign variant, add an entry to the relevant OVERRIDES
// table. No component changes required.

/* ─── Reference tables ─────────────────────────────────────────────────── */

const CITY_LABELS = {
  tampa: "Tampa",
  "st-petersburg": "St. Petersburg",
  "saint-petersburg": "St. Petersburg",
  stpete: "St. Petersburg",
  clearwater: "Clearwater",
  jacksonville: "Jacksonville",
  jax: "Jacksonville",
  orlando: "Orlando",
};

// Maps URL service token → internal wizard service id + headline display label.
// moveout/movein both drive the same wizard flow ("move") but produce
// distinct headline copy.
const SERVICE_MAP = {
  regular: { id: "regular", label: "Regular Cleaning" },
  deep:    { id: "deep",    label: "Deep Cleaning" },
  moveout: { id: "move",    label: "Move-Out Cleaning" },
  movein:  { id: "move",    label: "Move-In Cleaning" },
  move:    { id: "move",    label: "Move-Out Cleaning" },
  airbnb:  { id: "airbnb",  label: "Airbnb Turnover" },
};

/* ─── Defaults + override layers ───────────────────────────────────────── */

const DEFAULT_CTA = "Get My Instant Quote";
const DEFAULT_HERO_IMAGE = "/assets/hero-woman.webp";
const DEFAULT_SUBHEADLINE =
  "See your **exact price in under 2 minutes**. No phone call, no credit card — just pick your rooms and go.";
const DEFAULT_TRUST_BADGES = [
  { icon: "star",   text: "{rating}/5 Rating" },
  { icon: "check",  text: "{ratingCount}+ verified reviews" },
  { icon: "shield", text: "Licensed & Insured" },
  { icon: "person", text: "Background-Checked Cleaners" },
];

const DEFAULTS = {
  subheadline: DEFAULT_SUBHEADLINE,
  ctaText: DEFAULT_CTA,
  heroImage: DEFAULT_HERO_IMAGE,
  trustBadges: DEFAULT_TRUST_BADGES,
};

// Per-city overrides. Empty for now — add entries here to tweak copy or hero
// per city without touching the page.
const CITY_OVERRIDES = {
  // tampa: { subheadline: "...", heroImage: "/assets/tampa-hero.webp" },
};

// Per-service overrides.
const SERVICE_OVERRIDES = {
  // deep: { ctaText: "See My Deep Clean Price" },
};

// Per-utm_source overrides. All uniform for now — structure is what matters.
const SOURCE_OVERRIDES = {
  chatgpt:  {},
  google:   {},
  facebook: {},
  yelp:     {},
  email:    {},
};

// Per-utm_campaign overrides — most specific, wins over source.
const CAMPAIGN_OVERRIDES = {
  // tampa_deep_cleaning: { ctaText: "See My Deep-Clean Price" },
};

/* ─── Sanitizers ───────────────────────────────────────────────────────── */

function norm(v) {
  return (v || "").toString().toLowerCase().trim();
}

// Strip HTML tags + control chars, cap length. React auto-escapes on render,
// so this is defense in depth against a bad ?headline=/subheadline=/cta= value.
function sanitizeText(raw, maxLen = 120) {
  if (!raw) return null;
  const clean = String(raw)
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLen);
  return clean || null;
}

// Same-origin image path only — must start with "/" and cannot contain "://"
// (blocks data:, javascript:, //other.com paths).
function sanitizeImagePath(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s.startsWith("/") || s.includes("://") || s.startsWith("//")) return null;
  return s.slice(0, 200);
}

// Alphanumeric + dash + underscore, cap length — for coupon/promo/ref codes.
function sanitizeCode(raw) {
  if (!raw) return null;
  const s = String(raw).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  return s ? s.slice(0, 40) : null;
}

/* ─── Headline builder ─────────────────────────────────────────────────── */

// Structured headline so the page can style the accent word as yellow-mark
// italic while the rest stays plain. Sentence is:
//   "Get your instant [City]? [Service | 'house cleaning'] quote."
// where "quote" is the accent. Consumers with a headlineOverride skip this.
function buildHeadlineParts({ city, service }) {
  const before = ["Get your instant"];
  if (city) before.push(city.label);
  if (service) before.push(service.label);
  else before.push("house cleaning");
  return { prefix: before.join(" "), accent: "quote", suffix: "." };
}

/* ─── Resolver ─────────────────────────────────────────────────────────── */

export function resolveBookingContext(searchParams, opts = {}) {
  const get = (k) => (searchParams && searchParams.get ? searchParams.get(k) : null);

  // Structured params.
  const cityKey    = norm(get("city"));
  const serviceKey = norm(get("service"));
  const utmSource  = norm(get("utm_source"));
  const utmCampaign = norm(get("utm_campaign"));

  const city    = CITY_LABELS[cityKey] ? { key: cityKey, label: CITY_LABELS[cityKey] } : null;
  const service = SERVICE_MAP[serviceKey] || null;

  // Merge layers (later wins). Only overriding fields are copied.
  const layered = {
    ...DEFAULTS,
    ...(CITY_OVERRIDES[cityKey] || {}),
    ...(SERVICE_OVERRIDES[serviceKey] || {}),
    ...(SOURCE_OVERRIDES[utmSource] || {}),
    ...(CAMPAIGN_OVERRIDES[utmCampaign] || {}),
  };

  // Explicit URL overrides win over any config layer.
  const headlineOverride    = sanitizeText(get("headline"));
  const subheadlineOverride = sanitizeText(get("subheadline"), 300);
  const ctaOverride         = sanitizeText(get("cta"), 60);
  const heroOverride        = sanitizeImagePath(get("hero"));

  const finalSubheadline = subheadlineOverride || layered.subheadline;
  const finalCtaText     = ctaOverride         || layered.ctaText;
  const finalHeroImage   = heroOverride        || layered.heroImage;

  const headline = buildHeadlineParts({ city, service });

  return {
    // Primary structured fields.
    city,
    service,
    preselectedService: service?.id || null,

    // Copy.
    headline,
    headlineOverride,
    subheadline: finalSubheadline,
    subheadlineOverride,

    // CTA + visuals.
    ctaText: finalCtaText,
    heroImage: finalHeroImage,
    trustBadges: layered.trustBadges,

    // Campaign source resolution.
    campaignKey: SOURCE_OVERRIDES[utmSource] ? utmSource : "default",

    // Marketing params (flat for consumers that don't want to reach into .utm).
    utmSource,
    utmMedium:   norm(get("utm_medium")),
    utmCampaign,
    utmContent:  norm(get("utm_content")),
    utm: {
      source:   utmSource,
      medium:   norm(get("utm_medium")),
      campaign: utmCampaign,
      content:  norm(get("utm_content")),
      term:     norm(get("utm_term")),
    },

    // Referral / promotion.
    coupon: sanitizeCode(get("coupon")),
    promo:  sanitizeCode(get("promo")),
    ref:    sanitizeCode(get("ref")),

    // Landing metadata (safe to store with lead).
    landingPath: opts.landingPath || (typeof window !== "undefined" ? window.location.pathname : "/booking"),
    entryPath:   opts.entryPath   || (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/booking"),
  };
}

// Splits a "See your **exact price** in under 2 minutes." string into an
// array of {bold, text} chunks so the renderer can wrap bold segments in <b>.
export function parseInlineBold(text) {
  if (!text) return [];
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return { bold: true, text: chunk.slice(2, -2) };
    }
    return { bold: false, text: chunk };
  });
}
