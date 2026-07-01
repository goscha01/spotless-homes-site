// src/GoogleTag.jsx
//
// Google Tag Manager loads ~300 KB of JavaScript that Lighthouse blames for
// ~200 ms of forced reflows and blocks LCP on mobile. Delay injection until:
//   (a) the browser reports the page has finished the initial load, AND
//   (b) an extra 2.5 s has passed so paint/LCP can settle, OR
//   (c) the user shows intent (first pointer/scroll/keyboard event).
//
// End result: the first paint + LCP happen without GTM in the mix; analytics
// still capture the session because GTM initialises well before any real
// interaction (booking, phone-call, etc.). requestIdleCallback used where
// available so we never fight for the main thread with user interactions.

import { useEffect } from "react";

const GTAG_ID = "G-6ZB89H49SD";
const AW_ID   = "AW-17067419398";
const DELAY_MS = 2500;

let bootstrapped = false;

function bootstrapGtm() {
  if (bootstrapped) return;
  bootstrapped = true;

  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
    script.async = true;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GTAG_ID, { send_page_view: false });
  gtag("config", AW_ID);
}

const GoogleTag = () => {
  useEffect(() => {
    // During prerender (puppeteer), the __PRERENDER__ flag is set — skip GTM
    // injection so the captured static HTML doesn't include analytics scripts.
    if (typeof window !== "undefined" && window.__PRERENDER__) return;

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

    const timer = window.setTimeout(fire, DELAY_MS);

    function cleanup() {
      events.forEach((e) => window.removeEventListener(e, fire));
      window.clearTimeout(timer);
    }

    return cleanup;
  }, []);

  return null;
};

export default GoogleTag;
