// CloudFront Function — 301 redirects for legacy Wix URLs.
//
// Runs at viewer-request on every CloudFront request. Returns:
//   - a 301 response object when the request URI matches a legacy path
//   - the original request otherwise (continues normal cache/origin flow)
//
// Two layers of mappings:
//   1. Direct Wix URLs that were live at cutover (https://www.spotless.homes
//      Wayback CDX snapshot, 2026-03-15).
//   2. Wix's own internal redirects (the chain of redirects Wix already had
//      pointing old slugs at then-current slugs). Compressed here into one
//      hop so we don't 301 → 301 → 200, which Google penalises slightly.
//
// Source of truth: this file. Deploy with `bash scripts/deploy-cf-redirects.sh`.

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Normalize: strip trailing slash for matching (except root).
  var key = uri === '/' ? '/' : uri.replace(/\/+$/, '');

  // 1. Exact-match redirects.
  //    Old Wix path → final destination on the new site.
  var EXACT = {
    // ── City pages: Wix used /<city>-cleaning-service or /<city>
    '/clearwater':                          '/locations/clearwater/',
    '/tampa':                               '/locations/tampa/',
    '/tampa-cleaning-service':              '/locations/tampa/',
    '/saintpetersburg':                     '/locations/saint-petersburg/',
    '/saint-petersburg-cleaning-service':   '/locations/saint-petersburg/',
    '/jacksonville':                        '/locations/jacksonville/',
    '/jacksonville-cleaning-service':       '/locations/jacksonville/',
    // Miami goes to Fort Lauderdale (closest service area, owner's call).
    '/miami-cleaning-service':              '/locations/fort-lauderdale/',

    // ── Service pages: structure changed
    '/vacation-rental-cleaning':            '/airbnb-checklist/',
    '/airbnb':                              '/airbnb-checklist/',
    '/commercial':                          '/office-checklist/',
    '/estimate':                            '/booking/',
    '/job':                                 '/careers/',
    '/job-application':                     '/careers/',
    '/application':                         '/careers/apply/',
    '/training':                            '/careers/',
    '/products':                            '/cleaning-products/',
    '/standard':                            '/cleaning-products/',
    '/what-included':                       '/cleaning-checklist/',
    '/our-story':                           '/about/',
    '/about-6':                             '/about/',

    // ── Defunct Wix pages (offers, internal staff pages)
    '/3bed2bath':                           '/booking/',
    '/2bed2bath':                           '/booking/',
    '/ovencleaning':                        '/booking/',
    '/patio-door-cleaning-offer':           '/booking/',
    '/fridge-oven-cleaning-offer':          '/booking/',
    '/order':                               '/booking/',
    '/cleaner-onboarding-guide':            '/careers/',
    '/job-dispatcher':                      '/careers/',
    '/job-disputcher':                      '/careers/', // Wix typo
    '/video-interview':                     '/careers/apply/',
    '/copy-of-w9':                          '/careers/',
    '/staff':                               '/careers/',
    '/blank-1':                             '/',

    // Bare /post (no slug) — the prefix branch below only matches with a
    // trailing segment, so handle the empty case explicitly.
    '/post':                                '/blog/',
  };

  if (EXACT[key]) {
    return redirect301(EXACT[key]);
  }

  // 2. Prefix redirects.
  //    /post/<slug> → /blog/<slug>/ — high-value, these have inbound backlinks
  //    from Pinterest and other content sites.
  if (key.indexOf('/post/') === 0) {
    var slug = key.substring('/post/'.length);
    if (slug.length === 0) return redirect301('/blog/');
    return redirect301('/blog/' + slug + '/');
  }

  // Wix e-commerce/booking flow pages → booking
  if (key.indexOf('/product-page/') === 0 || key.indexOf('/pricing-plans/') === 0) {
    return redirect301('/booking/');
  }

  // Wix internal/community pages we don't have analogues for
  if (key.indexOf('/category/') === 0 ||
      key.indexOf('/challenge-page/') === 0 ||
      key.indexOf('/group/') === 0 ||
      key.indexOf('/videos/') === 0 ||
      key.indexOf('/portfolio/') === 0) {
    return redirect301('/');
  }

  // Wix blog category archives → blog index
  if (key.indexOf('/blog/categories/') === 0) {
    return redirect301('/blog/');
  }

  // No match — let the request continue to origin.
  return request;
}

function redirect301(location) {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      'location':      { value: location },
      // Cache the redirect for a day at the browser. Cheap to invalidate
      // via CloudFront if we ever need to.
      'cache-control': { value: 'max-age=86400' },
    },
  };
}
