import { getStoredUTMs } from "./utm";

const GTAG_ID = "G-6ZB89H49SD";

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
    landing_page: u.landing_page || "",
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

export function trackLead({ value }) {
  fireGa("generate_lead", {
    event_category: "Booking",
    event_label: "Booking Wizard Complete",
    value,
    currency: "USD",
  });
  fireGa("lead_created", { value, currency: "USD" });
  if (typeof window !== "undefined" && window.oaiq) {
    window.oaiq("measure", "lead_created", {
      type: "customer_action",
      amount: value,
      currency: "USD",
    });
  }
}

export function trackBookingCompleted({ value }) {
  fireGa("booking_completed", { value, currency: "USD" });
  fireOaiqCustom("booking_completed");
}

export function trackGetQuoteClick(location = "") {
  fireGa("get_quote_click", { event_category: "Engagement", event_label: location });
  if (typeof window !== "undefined" && window.oaiq) {
    window.oaiq("measure", "checkout_started", { type: "contents" });
  }
}

export function trackCallClick(location = "") {
  fireGa("call_click", { event_category: "Engagement", event_label: location });
  fireOaiqCustom("call_click");
}

export function trackLandingView(pageName) {
  fireGa("landing_view", { event_label: pageName });
  fireOaiqCustom("landing_view");
}

export function trackQuoteStarted(pageName = "") {
  fireGa("quote_started", { event_label: pageName });
  fireOaiqCustom("quote_started");
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
