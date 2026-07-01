// Generate public/llms.txt from scripts/llms.txt.template by substituting
// {{RATING_*}} placeholders with the live values from reviews-stats.js.
// Runs as part of `prebuild` so the values are always in sync with the
// aggregate rating on the rest of the site.
//
// If you need to edit llms.txt copy, edit `scripts/llms.txt.template` — the
// generated `public/llms.txt` is not committed (it's in .gitignore) and gets
// overwritten every build.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const stats = await import(pathToFileURL(path.join(ROOT, "src/data/reviews-stats.js")).href);

const template = fs.readFileSync(path.join(ROOT, "scripts/llms.txt.template"), "utf8");
const rendered = template
  .replaceAll("{{RATING_LABEL}}", stats.ratingLabel)
  .replaceAll("{{RATING_COUNT_SHORT}}", stats.ratingCountShort)
  .replaceAll("{{RATING_COUNT}}", String(stats.ratingCount));

const outPath = path.join(ROOT, "public/llms.txt");
fs.writeFileSync(outPath, rendered);
console.log(`llms.txt: wrote ${outPath.replace(ROOT + path.sep, "")}  [rating=${stats.ratingLabel} count=${stats.ratingCount}]`);
