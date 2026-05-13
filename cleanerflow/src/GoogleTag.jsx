// src/GoogleTag.jsx
import { useEffect } from "react";

const GoogleTag = () => {
  useEffect(() => {
    // Load gtag script
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-8W7WSSFNC6";
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());

    // ✅ GA4 with debug mode for DebugView
    gtag("config", "G-8W7WSSFNC6", {
      debug_mode: true,
    });

    // Optional: Google Ads
    gtag("config", "AW-17067419398");

  }, []);

  return null;
};

export default GoogleTag;
