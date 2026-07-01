// src/GoogleTag.jsx
import { useEffect } from "react";

const GoogleTag = () => {
  useEffect(() => {
    // Prerender (Puppeteer) runs this effect and captures the injected <script>
    // tag into the static HTML. Guard against re-injecting on client hydration.
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script = document.createElement("script");
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-6ZB89H49SD";
      script.async = true;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", "G-6ZB89H49SD", { send_page_view: false });
    gtag("config", "AW-17067419398");
  }, []);

  return null;
};

export default GoogleTag;
