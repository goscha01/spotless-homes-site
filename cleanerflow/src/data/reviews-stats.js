// `with { type: 'json' }` is required by Node ESM (used by gen-sitemap.mjs +
// prerender.mjs when they dynamic-import this module via locations.js).
// Vite 5+ supports the same syntax so it works in the bundler too.
import reviewsData from "./reviews.json" with { type: "json" };

const aggregate = reviewsData.aggregate ?? {};
const perPlace = Array.isArray(aggregate.perPlace) ? aggregate.perPlace : [];

// Weighted average across all locations. Trusts perPlace[].rating as the true
// Google-displayed decimal for each location — populated by fetch-reviews.mjs
// straight from the Business Profile API response (data.averageRating), not
// computed from individual integer review stars.
function computeWeighted() {
  if (perPlace.length === 0) return null;
  let num = 0, den = 0;
  for (const p of perPlace) {
    const count = Number(p.userRatingCount) || 0;
    const rating = Number(p.rating) || 0;
    if (count > 0 && rating > 0) {
      num += rating * count;
      den += count;
    }
  }
  if (den === 0) return null;
  // Round to one decimal (Google's own display precision).
  return Math.round((num / den) * 10) / 10;
}

const computedAvg = computeWeighted();
const avg = computedAvg ?? Number(aggregate.averageRating) ?? 4.5;
const count = Number(aggregate.totalRatingCount) || 150;

export const ratingValue = avg;
export const ratingCount = count;

// Display strings used across the UI (kept identical everywhere)
export const ratingLabel = `${avg.toFixed(1)}★`;
export const ratingCountShort = `${count}+`;
export const ratingCountLabel = `${count}+ verified reviews`;
export const ratingSummary = `${avg.toFixed(1)}★ across ${count}+ reviews`;

// Schema.org AggregateRating block — drop into any JSON-LD
export const aggregateRatingSchema = {
  "@type": "AggregateRating",
  ratingValue: avg.toFixed(1),
  reviewCount: String(count),
};
