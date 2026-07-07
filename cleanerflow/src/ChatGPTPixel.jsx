// src/ChatGPTPixel.jsx
//
// OpenAI/ChatGPT Ads conversion pixel. Loads via the same deferred pattern
// as GoogleTag.jsx so it doesn't compete with LCP: wait for first user
// interaction (pointer/scroll/keyboard) or a 2.5 s timeout, whichever comes
// first, then inject the SDK during idle time.

import { useEffect } from "react";

const PIXEL_ID = "AbUnpGiTzu8JiUtCHtNrex";
const DELAY_MS = 2500;

let bootstrapped = false;

// Install the oaiq queue stub immediately so events queued via
// window.oaiq(...) before the SDK loads are buffered on q.q and drained
// once the real SDK arrives. Called eagerly from the effect so mount-time
// events (landing_view, quote_started) aren't dropped.
function installStub() {
  if (typeof window === "undefined") return;
  if (window.oaiq) return;
  const q = function () { q.q.push(arguments); };
  q.q = [];
  window.oaiq = q;
}

function bootstrapPixel() {
  if (bootstrapped) return;
  bootstrapped = true;

  installStub();

  if (document.querySelector('script[src*="bzrcdn.openai.com/sdk/oaiq.min.js"]')) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://bzrcdn.openai.com/sdk/oaiq.min.js";
  const first = document.getElementsByTagName("script")[0];
  first.parentNode.insertBefore(s, first);

  window.oaiq("init", { pixelId: PIXEL_ID, debug: true });
}

const ChatGPTPixel = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.__PRERENDER__) return;

    // Stub goes in eagerly so events fired before defer (mount-time analytics,
    // e.g. landing_view) queue into oaiq.q instead of being dropped.
    installStub();

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

export default ChatGPTPixel;
