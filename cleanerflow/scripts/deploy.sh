#!/usr/bin/env bash
# Deploy dist/ to S3 + invalidate CloudFront.
# Run from cleanerflow/ root AFTER `npm run build`.
#
# Why several passes:
#   * HTML files (root + nested prerendered) → no-cache so new bundles ship instantly
#   * dist/assets/* → 1-year immutable (everything in there is content-hashed)
#   * robots.txt / sitemap.xml → 1-hour (crawlers refetch often, we want fresh)
#   * favicons → 1-day (rarely change, but not immutable)
#
# Legacy folders extras/, images/, logo/ are left untouched in the bucket
# (relics of the previous Wix-era site — not used by the React app).

set -euo pipefail

BUCKET=s3://www.spotless.homes
DIST_ID=E3SWXH3WZGUXU1

echo "→ Pass 1/4: hashed assets (1-year immutable)"
aws s3 sync dist/assets/ "$BUCKET/assets/" \
  --cache-control "public,max-age=31536000,immutable" \
  --no-progress

echo "→ Pass 2/4: HTML files (no-cache, recursive)"
aws s3 sync dist/ "$BUCKET/" \
  --exclude "*" --include "*.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html; charset=utf-8" \
  --no-progress

echo "→ Pass 3/4: robots.txt + sitemap.xml + llms.txt (1-hour)"
aws s3 cp dist/robots.txt   "$BUCKET/robots.txt"   --cache-control "public,max-age=3600" --content-type "text/plain"
aws s3 cp dist/sitemap.xml  "$BUCKET/sitemap.xml"  --cache-control "public,max-age=3600" --content-type "application/xml"
[ -f dist/llms.txt ] && aws s3 cp dist/llms.txt "$BUCKET/llms.txt" --cache-control "public,max-age=3600" --content-type "text/plain; charset=utf-8"
# Image-credits page (CC-BY-SA attribution for Wikimedia city photos)
[ -f dist/IMAGE-CREDITS.md ] && aws s3 cp dist/IMAGE-CREDITS.md "$BUCKET/IMAGE-CREDITS.md" --cache-control "public,max-age=3600" --content-type "text/markdown; charset=utf-8"

echo "→ Pass 4/4: favicons (1-day)"
for f in favicon.ico favicon-16x16.png favicon-32x32.png apple-touch-icon.png; do
  if [ -f "dist/$f" ]; then
    aws s3 cp "dist/$f" "$BUCKET/$f" --cache-control "public,max-age=86400"
  fi
done

echo "→ CloudFront invalidation"
INV_ID=$(aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*" \
  --query 'Invalidation.Id' --output text)
echo "  invalidation $INV_ID submitted"
echo "Deploy complete."
