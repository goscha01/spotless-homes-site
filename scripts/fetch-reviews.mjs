#!/usr/bin/env node
// Fetches Google reviews from Places API (New) for one or more business locations,
// filters to 4-5 stars, merges with the existing reviews.json (never deletes manual
// entries or previously-seen Google reviews), and writes the updated JSON.
//
// Env:
//   GOOGLE_PLACES_API_KEY   Google Maps Platform key with "Places API (New)" enabled
//   PLACE_IDS               Comma-separated list of "PLACE_ID:Label" pairs
//                           e.g. "ChIJxxx:Tampa,ChIJyyy:St. Pete,ChIJzzz:Jacksonville"
//                           The :Label part is optional; if omitted, no place tag is shown.
//   MIN_RATING              Optional, default 4
//
// Usage:  node scripts/fetch-reviews.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, "..", "cleanerflow", "src", "data", "reviews.json");
const MIN_RATING = Number(process.env.MIN_RATING ?? 4);
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_IDS_RAW = process.env.PLACE_IDS ?? "";

if (!API_KEY) {
  console.error("Missing GOOGLE_PLACES_API_KEY");
  process.exit(1);
}
if (!PLACE_IDS_RAW.trim()) {
  console.error("Missing PLACE_IDS (comma-separated PLACE_ID:Label pairs)");
  process.exit(1);
}

const places = PLACE_IDS_RAW.split(",").map((entry) => {
  const [id, ...labelParts] = entry.trim().split(":");
  return { id: id.trim(), label: labelParts.join(":").trim() || null };
}).filter((p) => p.id);

const FIELD_MASK = [
  "displayName",
  "rating",
  "userRatingCount",
  "reviews.name",
  "reviews.rating",
  "reviews.text",
  "reviews.originalText",
  "reviews.publishTime",
  "reviews.relativePublishTimeDescription",
  "reviews.authorAttribution",
].join(",");

async function fetchPlace({ id, label }) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Places API ${res.status} for ${id}: ${body}`);
  }
  const data = await res.json();
  return { id, label, data };
}

function normalizeReview(raw, label) {
  const text = raw.originalText?.text || raw.text?.text || "";
  return {
    id: raw.name,
    manual: false,
    rating: raw.rating,
    author: raw.authorAttribution?.displayName ?? "Google user",
    authorPhoto: raw.authorAttribution?.photoUri ?? null,
    publishTime: raw.publishTime ?? null,
    relativeTime: raw.relativePublishTimeDescription ?? null,
    text,
    place: label,
    sourceUrl: raw.authorAttribution?.uri ?? null,
  };
}

function loadExisting() {
  try {
    return JSON.parse(readFileSync(DATA_PATH, "utf8"));
  } catch {
    return { aggregate: { totalRatingCount: 0, averageRating: 0, lastUpdated: null, perPlace: [] }, reviews: [] };
  }
}

function mergeReviews(existing, incoming) {
  const byId = new Map(existing.map((r) => [r.id, r]));
  for (const r of incoming) {
    const prior = byId.get(r.id);
    // Preserve manual flag/text edits if someone edited an existing entry by hand.
    if (prior?.manual) continue;
    byId.set(r.id, r);
  }
  return [...byId.values()].sort((a, b) => {
    const ta = a.publishTime ? Date.parse(a.publishTime) : 0;
    const tb = b.publishTime ? Date.parse(b.publishTime) : 0;
    return tb - ta;
  });
}

function computeAggregate(perPlace) {
  const totalRatingCount = perPlace.reduce((s, p) => s + (p.userRatingCount || 0), 0);
  const weighted = perPlace.reduce((s, p) => s + (p.rating || 0) * (p.userRatingCount || 0), 0);
  const averageRating = totalRatingCount > 0 ? +(weighted / totalRatingCount).toFixed(2) : 0;
  return {
    totalRatingCount,
    averageRating,
    lastUpdated: new Date().toISOString(),
    perPlace,
  };
}

async function main() {
  const existing = loadExisting();
  const results = await Promise.all(places.map(fetchPlace));

  const perPlace = [];
  const fetchedReviews = [];

  for (const { id, label, data } of results) {
    perPlace.push({
      id,
      label,
      displayName: data.displayName?.text ?? null,
      rating: data.rating ?? null,
      userRatingCount: data.userRatingCount ?? 0,
    });
    for (const raw of data.reviews ?? []) {
      if ((raw.rating ?? 0) < MIN_RATING) continue;
      fetchedReviews.push(normalizeReview(raw, label));
    }
  }

  const merged = mergeReviews(existing.reviews ?? [], fetchedReviews);
  const aggregate = computeAggregate(perPlace);

  // If the API call somehow returned 0 places (shouldn't happen), keep prior aggregate.
  const out = {
    aggregate: perPlace.length > 0 ? aggregate : existing.aggregate,
    reviews: merged,
  };

  writeFileSync(DATA_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");

  const newCount = merged.length - (existing.reviews?.length ?? 0);
  console.log(
    `Updated ${DATA_PATH}: ${merged.length} total reviews (${newCount >= 0 ? "+" : ""}${newCount}), ` +
    `aggregate ${aggregate.averageRating}★ across ${aggregate.totalRatingCount} ratings.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
