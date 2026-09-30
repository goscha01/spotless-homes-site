// src/NextdoorPixel.jsx
//
// Nextdoor Ads conversion pixel. Loads via the same deferred pattern
// as ChatGPTPixel.jsx so it doesn't compete with LCP: wait for first user
// interaction (pointer/scroll/keyboard) or a 2.5 s timeout, whichever comes
// first, then inject the SDK during idle time. Mount only on pages where
// Nextdoor attribution is wanted (currently /careers and /careers/apply).

import { useEffect } from "react";

const PIXEL_ID = "e74c1edb-e5f3-4bd6-acb0-81548ad0e5f7";
const DELAY_MS = 2500;

let bootstrapped = false;

// Install the ndp queue stub immediately so events fired before the SDK
// loads are buffered and drained once the real script arrives.
function installStub() {
  if (typeof window === "undefined") return;
  if (window.ndp) return;
  const t = function () {
    t.handleRequest ? t.handleRequest.apply(t, arguments) : t.queue.push(arguments);
  };
  t.queue = [];
  t.v = 1;
  window.ndp = t;
}

function bootstrapPixel() {
  if (bootstrapped) return;
  bootstrapped = true;

  installStub();

  if (document.querySelector('script[src*="ads.nextdoor.com/public/pixel/ndp.js"]')) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://ads.nextdoor.com/public/pixel/ndp.js?id=${PIXEL_ID}`;
  const first = document.getElementsByTagName("script")[0];
  first.parentNode.insertBefore(s, first);

  window.ndp("init", PIXEL_ID, {});
  // NOTE: PAGE_VIEW is fired from the component effect (per-mount), not
  // here, so SPA route changes (/careers → /careers/apply/thank-you) each
  // emit their own beacon and URL-mapped conversions (Lead) can match.
}

const NextdoorPixel = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.__PRERENDER__) return;

    installStub();

    // Fire PAGE_VIEW on every mount — the stub queues it if the SDK hasn't
    // loaded yet, then the queue drains once bootstrapPixel completes. This
    // makes each SPA route change emit its own beacon so Nextdoor's URL
    // mapping (equals /careers/apply/thank-you → Lead) actually matches.
    window.ndp("track", "PAGE_VIEW");

    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      cleanup();
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(bootstrapPixel, { timeout: 2000 });
      } else {
        bootstrapPixel();
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

export default NextdoorPixel;
