// src/GoogleTag.jsx
//
// Loads GA4 + Google Ads via gtag.js IMMEDIATELY on mount, so short/
// no-interaction ad-landing sessions still transmit their page_view and
// Google Ads config beacons. Prior to 2026-07-09 this was gated behind a
// 2.5s + first-interaction defer — that undercounted CPC sessions because
// the gtag stub buffered events into dataLayer that were never drained
// when gtag.js itself never loaded (bouncer left before the timer fired
// or before any interaction event). The measured symptom was Google Ads
// reporting ~380 clicks while GA4 saw only ~19 CPC sessions.
//
// GTM (~200 KB heavier container) IS still deferred behind the same
// 2.5s / interaction gate — it's not on the critical path for Ads/GA4
// attribution and its cost still hurts LCP.
//
// GTM co-existence: if VITE_GTM_ID is set, we load GTM AND configure GA4
// + Google Ads directly via gtag.js. That means if a GA4 tag also fires
// from within GTM, GA4 will double-count. To keep the direct config
// authoritative: DO NOT configure a GA4 config tag inside GTM. Use GTM
// only for tags that aren't already wired here (Meta Pixel, CallRail,
// LinkedIn Insight, etc.).

import { useEffect } from "react";

const GTAG_ID = "G-6ZB89H49SD";
const AW_ID   = "AW-17067419398";
const GTM_ID  = import.meta.env.VITE_GTM_ID || "";
const GTM_DELAY_MS = 2500;

let gtagBootstrapped = false;
let gtmBootstrapped = false;

function installStub() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
}

function bootstrapGtag() {
  if (gtagBootstrapped) return;
  gtagBootstrapped = true;

  installStub();

  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
    script.async = true;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  // send_page_view:false on BOTH configs because GAListener owns pageview
  // firing on route change (see App.jsx) and broadcasts to all destinations.
  // Without send_page_view:false on the Ads config, the Ads pixel would fire
  // its own auto-page-view AT config time plus the relayed page_view from
  // GAListener — 2× Page Views + 2× Remarketing hits per landing (confirmed
  // 2026-07-10 via Tag Assistant). Don't flip either or you'll double-count.
  window.gtag("config", GTAG_ID, { send_page_view: false });
  window.gtag("config", AW_ID,   { send_page_view: false });
}

function bootstrapGtm() {
  if (gtmBootstrapped) return;
  if (!GTM_ID) return;
  gtmBootstrapped = true;

  installStub();

  if (document.querySelector(`script[src*="googletagmanager.com/gtm.js"]`)) return;
  // Push the container-open marker like the standard GTM snippet — some
  // triggers depend on `gtm.start` being present in dataLayer.
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

const GoogleTag = () => {
  useEffect(() => {
    // During prerender (puppeteer), the __PRERENDER__ flag is set — skip
    // injection so the captured static HTML doesn't include analytics scripts.
    if (typeof window !== "undefined" && window.__PRERENDER__) return;

    // Load gtag.js immediately. Short/no-interaction landings must still
    // transmit their page_view + Ads config beacon.
    bootstrapGtag();

    // No GTM container configured — nothing left to defer.
    if (!GTM_ID) return;

    // GTM stays deferred until first interaction or 2.5 s, whichever comes
    // first. It's not on the Ads/GA4 attribution path, and its cost still
    // pressures LCP on mobile.
    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      cleanup();
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(bootstrapGtm, { timeout: 2000 });
      } else {
        bootstrapGtm();
      }
    };

    const events = ["pointerdown", "scroll", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, fire, { once: true, passive: true }));

    const timer = window.setTimeout(fire, GTM_DELAY_MS);

    function cleanup() {
      events.forEach((e) => window.removeEventListener(e, fire));
      window.clearTimeout(timer);
    }

    return cleanup;
  }, []);

  return null;
};

export default GoogleTag;
