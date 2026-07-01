import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.spotless.homes";
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/og-default.png`;

export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  noindex = false,
  jsonLd,
  // LCP image path (e.g. "/assets/hero-woman.webp"). Emits a
  // `<link rel="preload" as="image" fetchpriority="high">` in the head so the
  // browser starts fetching the hero image alongside the CSS/JS bundle instead
  // of waiting for React to render the <img>. Big LCP win on mobile.
  preloadImage,
}) {
  const { pathname } = useLocation();
  // S3 website hosting 302-redirects /foo → /foo/ for any non-root nested path.
  // Match that by canonicalizing with a trailing slash so the canonical URL
  // is exactly where the content lives — no redirect hop for crawlers.
  const trailedPath = pathname === "/" || pathname.endsWith("/") ? pathname : pathname + "/";
  const url = canonical || `${SITE_URL}${trailedPath}`;
  const image = ogImage || DEFAULT_OG_IMAGE;
  const fullTitle = title || "House Cleaning Services | Spotless Homes — Florida's Trusted Maids";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {preloadImage && (
        <link rel="preload" as="image" href={preloadImage} fetchpriority="high" />
      )}

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Spotless Homes" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
