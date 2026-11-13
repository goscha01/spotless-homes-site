// src/MetaPixel.jsx
//
// Meta (Facebook) Pixel. Loads eagerly on mount — same reasoning as
// GoogleTag.jsx: short-landing CPC sessions must still transmit their
// first beacon, so this is NOT gated behind the 2.5s / interaction
// defer used for ChatGPTPixel / NextdoorPixel. If a user bounces before
// the SDK loads, their calls stay queued in fbq.queue; firing init
// immediately gives the SDK the longest window to drain.
//
// PageView firing is owned by GAListener in App.jsx (same pattern as
// gtag — see GoogleTag.jsx's send_page_view:false config) so SPA route
// changes each emit their own PageView without any double-fire on the
// initial landing.
//
// Scope: SITE-WIDE. Mounted once at App.jsx root so all future paid
// campaigns (hiring, booking, promos, …) share one pixel + attribution
// surface. Distinct conversion events (Lead for booking, SubmitApplication
// for hiring, …) separate campaign types without needing multiple pixels.

import { useEffect } from "react";

const PIXEL_ID = "1406103031693683";

let bootstrapped = false;

function installStub() {
  if (typeof window === "undefined") return;
  if (window.fbq) return;
  const n = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  window.fbq = n;
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
}

function bootstrapPixel() {
  if (bootstrapped) return;
  bootstrapped = true;

  installStub();

  if (document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]')) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  const first = document.getElementsByTagName("script")[0];
  if (first && first.parentNode) first.parentNode.insertBefore(s, first);
  else document.head.appendChild(s);

  window.fbq("init", PIXEL_ID);
}

const MetaPixel = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.__PRERENDER__) return;
    bootstrapPixel();
  }, []);
  return null;
};

export default MetaPixel;
