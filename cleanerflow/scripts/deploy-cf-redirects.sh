#!/usr/bin/env bash
# Deploy scripts/cf-redirects.js as a CloudFront Function and attach it to the
# distribution's default cache behavior (viewer-request).
#
# Idempotent:
#   - On first run: creates the function, publishes it, attaches it to the
#     distribution.
#   - On subsequent runs: updates the function code, re-publishes, and re-points
#     the distribution's association at the new LIVE stage.
#
# Manual rollback: detach via `aws cloudfront update-distribution` with an
# empty FunctionAssociations.Items list (or delete the function entirely).

set -euo pipefail

FN_NAME="spotless-wix-redirects"
DIST_ID="E3SWXH3WZGUXU1"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$SCRIPT_DIR/cf-redirects.js"

# Git Bash on Windows reports paths as /c/Users/... which AWS CLI (Windows
# binary) can't open. Convert to a native Windows path when cygpath exists.
if command -v cygpath >/dev/null 2>&1; then
  SRC_NATIVE=$(cygpath -w "$SRC")
else
  SRC_NATIVE="$SRC"
fi

echo "→ Function source: $SRC_NATIVE"

# 1. Create or update the function.
EXISTING=$(aws cloudfront describe-function --name "$FN_NAME" --stage DEVELOPMENT 2>/dev/null || echo "")
if [ -z "$EXISTING" ]; then
  echo "→ Creating function $FN_NAME"
  aws cloudfront create-function \
    --name "$FN_NAME" \
    --function-config "Comment=Legacy Wix 301 redirects,Runtime=cloudfront-js-2.0" \
    --function-code "fileb://$SRC_NATIVE" >/dev/null
else
  echo "→ Updating function $FN_NAME"
  ETAG=$(aws cloudfront describe-function --name "$FN_NAME" --stage DEVELOPMENT \
    --query 'ETag' --output text)
  aws cloudfront update-function \
    --name "$FN_NAME" \
    --if-match "$ETAG" \
    --function-config "Comment=Legacy Wix 301 redirects,Runtime=cloudfront-js-2.0" \
    --function-code "fileb://$SRC_NATIVE" >/dev/null
fi

# 2. Publish DEVELOPMENT → LIVE.
PUB_ETAG=$(aws cloudfront describe-function --name "$FN_NAME" --stage DEVELOPMENT \
  --query 'ETag' --output text)
echo "→ Publishing function (etag $PUB_ETAG)"
aws cloudfront publish-function --name "$FN_NAME" --if-match "$PUB_ETAG" >/dev/null

# 3. Get the LIVE function ARN.
FN_ARN=$(aws cloudfront describe-function --name "$FN_NAME" --stage LIVE \
  --query 'FunctionSummary.FunctionMetadata.FunctionARN' --output text)
echo "→ Live function ARN: $FN_ARN"

# 4. Check whether the function is already attached. If so, nothing else to do.
CURRENT_ARN=$(aws cloudfront get-distribution-config --id "$DIST_ID" \
  --query 'DistributionConfig.DefaultCacheBehavior.FunctionAssociations.Items[?EventType==`viewer-request`].FunctionARN | [0]' \
  --output text 2>/dev/null || echo "None")

if [ "$CURRENT_ARN" = "$FN_ARN" ]; then
  echo "→ Distribution already points at this LIVE function. Done."
  exit 0
fi

# 5. Attach the function to the distribution's viewer-request event.
echo "→ Attaching to distribution $DIST_ID (viewer-request)"
# Use the script directory for temp files so paths are predictable across
# Git Bash and Windows-native node/AWS CLI.
TMP="$SCRIPT_DIR/.dist-config.json"
TMP_NEW="$SCRIPT_DIR/.dist-config.new.json"
aws cloudfront get-distribution-config --id "$DIST_ID" --output json > "$TMP"

if command -v cygpath >/dev/null 2>&1; then
  TMP_NATIVE=$(cygpath -w "$TMP")
  TMP_NEW_NATIVE=$(cygpath -w "$TMP_NEW")
else
  TMP_NATIVE="$TMP"
  TMP_NEW_NATIVE="$TMP_NEW"
fi

# Use node instead of jq (jq isn't installed on Windows by default; node is).
DIST_ETAG=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).ETag)" "$TMP_NATIVE")
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));
data.DistributionConfig.DefaultCacheBehavior.FunctionAssociations = {
  Quantity: 1,
  Items: [{ FunctionARN: process.argv[3], EventType: 'viewer-request' }]
};
fs.writeFileSync(process.argv[2], JSON.stringify(data.DistributionConfig, null, 2));
" "$TMP_NATIVE" "$TMP_NEW_NATIVE" "$FN_ARN"

aws cloudfront update-distribution \
  --id "$DIST_ID" \
  --if-match "$DIST_ETAG" \
  --distribution-config "file://$TMP_NEW_NATIVE" >/dev/null

rm -f "$TMP" "$TMP_NEW"

echo "→ Done. CloudFront will roll out in ~3 minutes."
echo "→ Test once propagated:"
echo "    curl -sI https://www.spotless.homes/post/some-old-slug   # should return 301"
echo "    curl -sI https://www.spotless.homes/tampa                # should return 301 → /locations/tampa/"
