import { getStoredUTMs } from "./utm";
import { resolveSource } from "./phone";

const GTAG_ID = "G-6ZB89H49SD";
const AW_ID   = "AW-17067419398";
// Conversion label from Google Ads (Tools → Conversions → your action →
// Tag setup → Install manually → the string after the "/" in
// `send_to: 'AW-XXXX/YYYY'`). Set as VITE_AW_CONVERSION_LABEL at build time.
// When unset (dev / label not yet created) `trackAdsConversion` is a no-op.
const AW_CONVERSION_LABEL = import.meta.env.VITE_AW_CONVERSION_LABEL || "";

// Install queue stubs at module load so mount-time events (e.g. landing_view
// fired from a page's useEffect) buffer into dataLayer / oaiq.q instead of
// being dropped. The real SDKs (GTM, oaiq.min.js) drain these queues when
// they finish loading (see GoogleTag.jsx / ChatGPTPixel.jsx for defer logic).
if (typeof window !== "undefined" && !window.__PRERENDER__) {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
  if (!window.oaiq) {
    const q = function () { q.q.push(arguments); };
    q.q = [];
    window.oaiq = q;
  }
}

// Read GA4 client_id + session_id via the gtag `get` API. Both are
// resolved via callback, so we wrap each in a Promise with a hard
// timeout — if gtag never loaded (ad-block, network fail, tracking
// blocked) or if the property isn't initialised yet, we resolve to
// empty strings instead of hanging the lead submission.
//
// Called from booking.jsx submitRequest so every lead email carries the
// GA identifiers needed to join back to a GA4 session later.
export async function getGaIds({ timeoutMs = 1500 } = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return { ga_client_id: "", ga_session_id: "" };
  }
  const askOne = (field) => new Promise((resolve) => {
    let settled = false;
    const done = (val) => { if (!settled) { settled = true; resolve(val || ""); } };
    const timer = setTimeout(() => done(""), timeoutMs);
    try {
      window.gtag("get", GTAG_ID, field, (val) => { clearTimeout(timer); done(val); });
    } catch (e) {
      clearTimeout(timer);
      done("");
    }
  });
  const [ga_client_id, ga_session_id] = await Promise.all([
    askOne("client_id"),
    askOne("session_id"),
  ]);
  return { ga_client_id, ga_session_id };
}

// Attach the stored attribution + a coarse device label + wall-clock
// timestamp to every GA4 event we fire. GA4 already stashes gclid via
// the linker, but restating it as a custom event parameter means it's
// visible in every event export row without a join — useful when we
// eventually pipe events into BigQuery.
function gaParams(extra = {}) {
  const u = getStoredUTMs();
  return {
    send_to: GTAG_ID,
    utm_source: u.utm_source || "",
    utm_medium: u.utm_medium || "",
    utm_campaign: u.utm_campaign || "",
    utm_content: u.utm_content || "",
    utm_term: u.utm_term || "",
    gclid: u.gclid || "",
    gbraid: u.gbraid || "",
    wbraid: u.wbraid || "",
    fbclid: u.fbclid || "",
    msclkid: u.msclkid || "",
    landing_page: u.landing_page || "",
    referrer: u.referrer || "",
    device: u.device || "",
    source: resolveSource(u),
    event_time: new Date().toISOString(),
    ...extra,
  };
}

function fireGa(name, extra) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, gaParams(extra));
  }
}

function fireOaiqCustom(name) {
  if (typeof window !== "undefined" && window.oaiq) {
    window.oaiq("measure", "custom", { type: "custom" }, { custom_event_name: name });
  }
}

// ─── Google Ads Enhanced Conversions ──────────────────────────────────
//
// Google Ads accepts either raw or pre-hashed user data. We hash locally
// via SubtleCrypto so the unhashed values never leave the browser — a
// stronger privacy posture than relying on gtag.js to hash before send.
// Google requires: SHA-256, hex-encoded, lowercase; email trimmed +
// lowercased; phone in E.164 (+<country><digits>, digits only after +).

async function sha256Hex(input) {
  if (!input) return "";
  if (typeof crypto === "undefined" || !crypto.subtle) return "";
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

// US-first normalization. 10 digits → prepend +1; 11 digits leading in "1"
// → +<digits>; anything else → prepend + and hope the digits are already a
// full international number. Google discards clearly-malformed phone hashes.
function normalizePhoneE164(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

// Fires the Google Ads conversion event + attaches Enhanced Conversions
// user data (hashed email + phone). Awaitable — callers on the "thank you"
// screen can safely fire-and-forget since the page isn't navigating.
//
// Skips silently when VITE_AW_CONVERSION_LABEL is unset (dev + before the
// Google Ads conversion action has been created).
export async function trackAdsConversion({ value, transactionId, email, phone } = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  if (!AW_CONVERSION_LABEL) {
    if (typeof console !== "undefined") {
      console.warn(
        "[track] VITE_AW_CONVERSION_LABEL not set — Google Ads conversion NOT fired. " +
        "Create the conversion action in Google Ads and set the env var.",
      );
    }
    return;
  }

  // Enhanced Conversions: set user_data BEFORE the conversion event so the
  // hashed identifiers ride along with the conversion ping.
  const [emailHash, phoneHash] = await Promise.all([
    sha256Hex(normalizeEmail(email)),
    sha256Hex(normalizePhoneE164(phone)),
  ]);
  const userData = {};
  if (emailHash) userData.sha256_email_address = emailHash;
  if (phoneHash) userData.sha256_phone_number  = phoneHash;
  if (emailHash || phoneHash) {
    window.gtag("set", "user_data", userData);
  }

  const params = {
    send_to: `${AW_ID}/${AW_CONVERSION_LABEL}`,
    value: typeof value === "number" ? value : 0,
    currency: "USD",
  };
  // transaction_id lets Google Ads dedupe if a user re-submits or a network
  // retry double-fires. Any stable-ish string works.
  if (transactionId) params.transaction_id = transactionId;

  window.gtag("event", "conversion", params);
}

// ─── Conversion events ────────────────────────────────────────────────

// Fired when the wizard's contact-step form is actually submitted. Uses
// GA4's recommended `generate_lead` name so it shows up as a Conversion
// in GA4 without a custom event mapping. `contact_form_submit` is also
// fired for downstream tag setups that want a form-shaped name.
export function trackLead({ value }) {
  fireGa("generate_lead", {
    event_category: "Booking",
    event_label: "Booking Wizard Complete",
    value,
    currency: "USD",
  });
  fireGa("contact_form_submit", { value, currency: "USD" });
  fireGa("lead_created", { value, currency: "USD" });
  if (typeof window !== "undefined" && window.oaiq) {
    window.oaiq("measure", "lead_created", {
      type: "customer_action",
      amount: value,
      currency: "USD",
    });
  }
}

// Fired after the "thanks — we'll be in touch" screen shows.
export function trackBookingCompleted({ value }) {
  fireGa("booking_completed", { value, currency: "USD" });
  fireOaiqCustom("booking_completed");
}

// ─── Funnel-stage events ──────────────────────────────────────────────

// Fired when the estimate wizard opens for the first time. `quote_started`
// is kept for backwards compat with the funnel we already report on;
// `estimate_started` is emitted alongside for the standardised name.
export function trackQuoteStarted(pageName = "") {
  fireGa("quote_started",    { event_label: pageName });
  fireGa("estimate_started", { event_label: pageName });
  fireOaiqCustom("quote_started");
}

// Fired when the wizard reaches its last (contact-info) step — the user
// has seen their exact price and is now typing their name/phone. This
// mirrors the "estimate delivered" event most cleaning DNI trackers use.
export function trackEstimateCompleted({ value } = {}) {
  fireGa("estimate_completed", { value, currency: "USD" });
  fireOaiqCustom("estimate_completed");
}

// Fired the moment the user hits the Submit button on the contact step.
// Distinct from `generate_lead` (which only fires after the network call
// succeeds) so we can see fill-abandonment vs submission-failure in GA4.
export function trackBookingStarted({ value } = {}) {
  fireGa("booking_started", { value, currency: "USD" });
  fireOaiqCustom("booking_started");
}

// ─── Engagement events ────────────────────────────────────────────────

// `location` is a coarse label describing which CTA was clicked (e.g.
// "nav", "hero", "footer"). Kept as event_label for GA4 filter compat.
export function trackGetQuoteClick(location = "") {
  fireGa("get_quote_click", { event_category: "Engagement", event_label: location });
  if (typeof window !== "undefined" && window.oaiq) {
    window.oaiq("measure", "checkout_started", { type: "contents" });
  }
}

// GA4-recommended `phone_click` name. `call_click` is preserved as an
// alias so existing GA4 explorations don't go dark.
export function trackPhoneClick(location = "") {
  const params = { event_category: "Engagement", event_label: location, click_location: location };
  fireGa("phone_click", params);
  fireGa("call_click",  params);
  fireOaiqCustom("call_click");
}
// Legacy name kept because App.jsx + booking-page.jsx already call it.
export const trackCallClick = trackPhoneClick;

export function trackEmailClick(location = "") {
  fireGa("email_click", { event_category: "Engagement", event_label: location, click_location: location });
  fireOaiqCustom("email_click");
}

export function trackSMSClick(location = "") {
  fireGa("sms_click", { event_category: "Engagement", event_label: location, click_location: location });
  fireOaiqCustom("sms_click");
}

export function trackLandingView(pageName) {
  fireGa("landing_view", { event_label: pageName });
  fireOaiqCustom("landing_view");
}

export function trackServiceSelected(serviceId) {
  fireGa("service_selected", { event_label: serviceId });
  fireOaiqCustom("service_selected");
}

export function trackFunnelStep(stepName) {
  fireGa(stepName, { event_category: "BookingFunnel" });
  fireOaiqCustom(stepName);
}

export function trackContactStarted() {
  fireGa("contact_started", {});
  fireOaiqCustom("contact_started");
}
