// Fail-fast lint: block any hardcoded rating/review-count number from
// sneaking into narrative copy or config outside the single source of truth
// (`src/data/reviews-stats.js`). Runs as part of `prebuild` so a bad build
// never ships. Also callable directly: `npm run check:reviews`.
//
// Rationale: we hit this in prod when three narrative strings still read
// "4.5★ across 150+ reviews" months after the reviews-stats centralization
// (real numbers had drifted to 5.0★ / 71). Everything numeric in a display
// context must import from reviews-stats.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Directories to scan (relative to ROOT). Skip node_modules/dist/etc.
const SCAN_DIRS = ["src", "public"];
const SCAN_EXTS = new Set([".jsx", ".js", ".mjs", ".ts", ".tsx", ".html", ".md", ".txt", ".json"]);

// Files that are ALLOWED to contain literal rating numbers.
// `reviews-stats.js` owns the numeric fallbacks; `reviews.json` is the data
// itself; this checker's own regex source obviously references the patterns.
const ALLOWLIST = new Set([
  "src/data/reviews-stats.js",
  "src/data/reviews.json",
  "scripts/check-review-consistency.mjs",
  // Generated from scripts/llms.txt.template — placeholders are substituted
  // from reviews-stats.js, so it can't drift.
  "public/llms.txt",
]);

// Patterns that indicate a rating/review claim in display copy.
// Each pattern is deliberately narrow to avoid false positives on SVG path
// data, JSON coordinates, or unrelated numbers.
const PATTERNS = [
  { re: /\d\.\d★/g,                        why: "star-suffixed rating (e.g. '4.5★')" },
  { re: /\b\d{2,}\+\s*(?:verified\s+)?reviews\b/gi, why: "review count claim (e.g. '150+ reviews', '71+ verified reviews')" },
  { re: /\b\d{2,}\s+reviews\b/gi,          why: "bare review count (e.g. '150 reviews')" },
  { re: /"ratingValue"\s*:\s*"?\d/g,        why: "hardcoded ratingValue in JSON-LD" },
  { re: /"reviewCount"\s*:\s*"?\d/g,        why: "hardcoded reviewCount in JSON-LD" },
  { re: /"averageRating"\s*:\s*"?\d/g,      why: "hardcoded averageRating" },
  { re: /"totalRatingCount"\s*:\s*"?\d/g,   why: "hardcoded totalRatingCount" },
];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (SCAN_EXTS.has(path.extname(entry.name))) yield full;
  }
}

const offenses = [];

for (const dir of SCAN_DIRS) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const file of walk(abs)) {
    const rel = path.relative(ROOT, file).replaceAll("\\", "/");
    if (ALLOWLIST.has(rel)) continue;
    const src = fs.readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);
    for (const { re, why } of PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(src)) !== null) {
        const before = src.slice(0, m.index);
        const lineNum = before.split(/\r?\n/).length;
        const line = lines[lineNum - 1] || "";
        offenses.push({ rel, lineNum, why, match: m[0], line: line.trim() });
      }
    }
  }
}

if (offenses.length === 0) {
  console.log("✓ check-review-consistency: no hardcoded rating/review numbers outside reviews-stats.js");
  process.exit(0);
}

console.error(`✗ check-review-consistency: found ${offenses.length} hardcoded rating/review number(s).`);
console.error("  Move each to `src/data/reviews-stats.js` and import ratingLabel /");
console.error("  ratingCount / ratingCountLabel / ratingSummary / aggregateRatingSchema.\n");
for (const o of offenses) {
  console.error(`  ${o.rel}:${o.lineNum}  [${o.why}]  matched "${o.match}"`);
  console.error(`      ${o.line.slice(0, 140)}${o.line.length > 140 ? "…" : ""}`);
}
process.exit(1);
