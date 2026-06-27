#!/usr/bin/env node
// Fetches Google Business Profile reviews for all 3 Spotless Homes locations.
//
// Source of truth for OAuth refresh tokens: the post-to app's Supabase
// (users.business_profiles JSONB). Adding a new location for review fetching =
// connect it via post-to.app's UI; no changes here required.
//
// Each business_profile entry contributes one Google account; that account's
// locations are listed, filtered to titles containing "Spotless", and all their
// reviews are pulled via the Business Profile v4 API (which returns the full
// review history, unlike Places API which caps at 5).
//
// Reviews are merged into cleanerflow/src/data/reviews.json by stable review
// name (so historical reviews never disappear, even if Google would prune them).
// Manual seeded entries (manual:true) are preserved untouched.
//
// Env (read from cleanerflow/.env locally or GH Actions secrets in CI):
//   GOOGLE_CLIENT_ID
//   GOOGLE_CLIENT_SECRET
//   SUPABASE_URL                — e.g. https://igsaqmyosupikfvuuiux.supabase.co
//   SUPABASE_SECRET_KEY         — sb_secret_* or service_role JWT
//   MIN_RATING                  — optional, default 4 (cards filter)
//
// Usage:  node --env-file=cleanerflow/.env scripts/fetch-reviews.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, "..", "cleanerflow", "src", "data", "reviews.json");

const MIN_RATING = Number(process.env.MIN_RATING ?? 4);
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

if (!CLIENT_ID || !CLIENT_SECRET) die("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
if (!SUPABASE_URL || !SUPABASE_KEY) die("Missing SUPABASE_URL or SUPABASE_SECRET_KEY");

const STAR_TO_NUM = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

async function getAccessToken(refreshToken) {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const j = await r.json();
  if (!r.ok || !j.access_token) throw new Error(`token refresh failed: ${JSON.stringify(j)}`);
  return j.access_token;
}

async function fetchBusinessProfiles() {
  const url = `${SUPABASE_URL}/rest/v1/users?select=business_profiles`;
  const r = await fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  const rows = await r.json();
  const out = [];
  for (const row of rows) {
    for (const p of row.business_profiles ?? []) {
      if (p.refresh_token) out.push(p);
    }
  }
  return out;
}

async function listSpotlessLocations(accessToken) {
  const h = { Authorization: `Bearer ${accessToken}` };
  const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts?pageSize=100", { headers: h });
  if (!accountsRes.ok) throw new Error(`list accounts: ${accountsRes.status} ${await accountsRes.text()}`);
  const { accounts = [] } = await accountsRes.json();
  const out = [];
  for (const a of accounts) {
    const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${a.name}/locations?pageSize=100&readMask=name,title,storefrontAddress,serviceArea,metadata`;
    const r = await fetch(url, { headers: h });
    if (!r.ok) continue;
    const { locations = [] } = await r.json();
    for (const l of locations) {
      if (!/spotless/i.test(l.title || "")) continue;
      out.push({
        account: a.name,
        location: l.name,
        title: l.title,
        mapsUri: l.metadata?.mapsUri || null,
      });
    }
  }
  return out;
}

async function fetchAllReviews(accountName, locationName, accessToken) {
  // v4 API uses bare IDs after the "accounts/" / "locations/" prefix.
  const accId = accountName.replace(/^accounts\//, "");
  const locId = locationName.replace(/^locations\//, "");
  const all = [];
  let pageToken = "";
  while (true) {
    const url = new URL(`https://mybusiness.googleapis.com/v4/accounts/${accId}/locations/${locId}/reviews`);
    url.searchParams.set("pageSize", "50");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const r = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!r.ok) throw new Error(`reviews ${r.status}: ${await r.text()}`);
    const data = await r.json();
    for (const rv of data.reviews || []) all.push(rv);
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }
  return all;
}

function deriveLabel(title) {
  if (!title) return null;
  const stripped = title.replace(/^\s*spotless\s+homes\s*/i, "").trim();
  return stripped || null;
}

function normalize(rv, label, mapsUri) {
  const rating = STAR_TO_NUM[rv.starRating] || 0;
  return {
    id: `gmb:${rv.name}`,
    manual: false,
    rating,
    author: rv.reviewer?.displayName || "Google user",
    authorPhoto: rv.reviewer?.profilePhotoUrl || null,
    publishTime: rv.createTime || null,
    relativeTime: relativeFrom(rv.createTime),
    text: rv.comment || "",
    place: label,
    sourceUrl: mapsUri,
  };
}

function relativeFrom(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function loadExisting() {
  try {
    return JSON.parse(readFileSync(DATA_PATH, "utf8"));
  } catch {
    return { aggregate: { totalRatingCount: 0, averageRating: 0, lastUpdated: null, perPlace: [] }, reviews: [] };
  }
}

function mergeReviews(existing, incoming) {
  const byId = new Map();
  // Preserve prior entries: manual entries always, non-manual only if still pass the filter
  for (const r of existing) {
    if (r.manual) byId.set(r.id, r);
    else if ((r.rating ?? 0) >= MIN_RATING) byId.set(r.id, r);
  }
  // Incoming (already filtered) wins over prior non-manual
  for (const r of incoming) {
    const prior = byId.get(r.id);
    if (prior?.manual) continue;
    byId.set(r.id, r);
  }
  return [...byId.values()].sort((a, b) => {
    const ta = a.publishTime ? Date.parse(a.publishTime) : 0;
    const tb = b.publishTime ? Date.parse(b.publishTime) : 0;
    return tb - ta;
  });
}

function die(msg) {
  console.error(msg);
  process.exit(1);
}

async function main() {
  const profiles = await fetchBusinessProfiles();
  if (profiles.length === 0) die("No business_profiles found in Supabase users table.");

  const perPlace = [];
  const incoming = [];
  let allRatingsSum = 0;
  let allRatingsCount = 0;

  for (const p of profiles) {
    let accessToken;
    try {
      accessToken = await getAccessToken(p.refresh_token);
    } catch (e) {
      console.warn(`[skip] token refresh failed for ${p.business_email}: ${e.message}`);
      continue;
    }
    let locations;
    try {
      locations = await listSpotlessLocations(accessToken);
    } catch (e) {
      console.warn(`[skip] location list failed for ${p.business_email}: ${e.message}`);
      continue;
    }
    for (const loc of locations) {
      let reviews;
      try {
        reviews = await fetchAllReviews(loc.account, loc.location, accessToken);
      } catch (e) {
        console.warn(`[skip] reviews failed for ${loc.title}: ${e.message}`);
        continue;
      }
      const label = deriveLabel(loc.title);
      let placeCount = 0;
      let placeSum = 0;
      for (const rv of reviews) {
        const norm = normalize(rv, label, loc.mapsUri);
        if (norm.rating < MIN_RATING) continue;
        incoming.push(norm);
        placeSum += norm.rating;
        placeCount += 1;
      }
      perPlace.push({
        title: loc.title,
        label,
        accountId: loc.account,
        locationId: loc.location,
        userRatingCount: placeCount,
        rating: placeCount > 0 ? +(placeSum / placeCount).toFixed(2) : 0,
      });
      allRatingsSum += placeSum;
      allRatingsCount += placeCount;
      console.log(`  ${loc.title}: ${reviews.length} reviews fetched, ${placeCount} rated (avg ${perPlace.at(-1).rating}★)`);
    }
  }

  if (incoming.length === 0) die("No reviews fetched. Aborting write.");

  const existing = loadExisting();
  const merged = mergeReviews(existing.reviews || [], incoming);
  const aggregate = {
    totalRatingCount: allRatingsCount,
    averageRating: allRatingsCount > 0 ? +(allRatingsSum / allRatingsCount).toFixed(2) : 0,
    lastUpdated: new Date().toISOString(),
    perPlace,
  };

  writeFileSync(DATA_PATH, JSON.stringify({ aggregate, reviews: merged }, null, 2) + "\n", "utf8");

  const before = existing.reviews?.length ?? 0;
  console.log(
    `\nWrote ${DATA_PATH}: ${merged.length} total reviews (${merged.length - before >= 0 ? "+" : ""}${merged.length - before}), ` +
    `aggregate ${aggregate.averageRating}★ across ${aggregate.totalRatingCount} ratings.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
