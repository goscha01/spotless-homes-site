// `with { type: 'json' }` is required by Node ESM (used by gen-sitemap.mjs +
// prerender.mjs when they dynamic-import this module via locations.js).
// Vite 5+ supports the same syntax so it works in the bundler too.
import reviewsData from "./reviews.json" with { type: "json" };

const aggregate = reviewsData.aggregate ?? {};

const avg = Number(aggregate.averageRating) || 4.5;
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
