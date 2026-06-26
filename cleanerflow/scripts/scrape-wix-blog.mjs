// Scrape all published Wix blog posts into local markdown + assets.
// One-time backfill: pulls article HTML, converts body to markdown,
// downloads hero + inline images locally, writes a frontmatter .md per post.
//
// Run: node scripts/scrape-wix-blog.mjs

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import pLimit from "p-limit";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CF_ROOT = join(__dirname, "..");
const POSTS_DIR = join(CF_ROOT, "src/data/blog-posts");
const IMAGES_DIR = join(CF_ROOT, "public/assets/blog");

// 67 URLs from blog-posts-sitemap.xml minus the off-topic data-analysis article
const URLS = [
  "https://www.spotless.homes/post/how-long-does-a-full-house-clean-typically-take",
  "https://www.spotless.homes/post/what-is-the-20-rule-for-decluttering",
  "https://www.spotless.homes/post/what-is-the-average-hourly-rate-for-a-cleaning-lady-in-my-area",
  "https://www.spotless.homes/post/how-often-should-you-schedule-a-house-cleaner-for-optimal-cleanliness",
  "https://www.spotless.homes/post/the-ultimate-guide-to-how-often-you-should-wash-your-sheets",
  "https://www.spotless.homes/post/effective-tips-for-cleaning-baseboards-without-stress",
  "https://www.spotless.homes/post/common-bathroom-cleaning-mistakes-to-avoid-for-a-sparkling-finish",
  "https://www.spotless.homes/post/how-much-do-most-cleaning-services-charge",
  "https://www.spotless.homes/post/the-ultimate-guide-to-house-cleaning-frequency-you-need-to-know",
  "https://www.spotless.homes/post/the-ultimate-guide-to-cleaning-your-house-in-the-right-order",
  "https://www.spotless.homes/post/the-benefits-of-a-clean-home-for-your-mental-health",
  "https://www.spotless.homes/post/the-toilet-cleaning-golden-rule-clean-from-top-to-bottom",
  "https://www.spotless.homes/post/move-out-cleaning-why-it-matters-and-what-to-expect",
  "https://www.spotless.homes/post/what-is-the-best-day-to-clean-your-house-expert-tips-to-pick-the-right-time",
  "https://www.spotless.homes/post/why-regular-deep-cleaning-is-essential-for-your-home",
  "https://www.spotless.homes/post/essential-steps-what-to-clean-first-in-your-bathroom",
  "https://www.spotless.homes/post/how-do-professional-house-cleaning-services-clean-so-fast",
  "https://www.spotless.homes/post/what-will-a-cleaner-do-in-2-hours",
  "https://www.spotless.homes/post/quality-cleaning-services-for-vacation-homes-in-tampa",
  "https://www.spotless.homes/post/cleaning-appointment-mistakes",
  "https://www.spotless.homes/post/understanding-the-neighbor-cleaning-rule-and-its-importance-in-community-living",
  "https://www.spotless.homes/post/do-cleaners-provide-their-own-supplies-or-do-you-need-to-supply-them",
  "https://www.spotless.homes/post/mastering-the-20-minute-rule-for-efficient-cleaning-routines",
  "https://www.spotless.homes/post/the-value-of-hiring-a-cleaner-is-it-worth-the-investment",
  "https://www.spotless.homes/post/professional-apartment-cleaning-services-in-tampa-florida",
  "https://www.spotless.homes/post/understanding-the-30-minute-cleaning-rule-for-a-tidy-home",
  "https://www.spotless.homes/post/the-difference-between-deep-and-regular-cleaning-what-you-need-to-know",
  "https://www.spotless.homes/post/can-a-magic-eraser-safely-clean-your-walls",
  "https://www.spotless.homes/post/what-does-a-cleaner-do-in-3-hours",
  "https://www.spotless.homes/post/how-much-can-a-cleaner-do-in-1-hour",
  "https://www.spotless.homes/post/can-you-overclean-a-house-what-every-homeowner-should-know",
  "https://www.spotless.homes/post/how-often-should-a-house-cleaner-come",
  "https://www.spotless.homes/post/what-to-clean-walls-with",
  "https://www.spotless.homes/post/is-hiring-a-house-cleaning-pro-worth-it-or-just-a-splurge",
  "https://www.spotless.homes/post/how-much-should-you-pay-your-cleaner",
  "https://www.spotless.homes/post/blog-post-2-bedroom-home-cleaning-time",
  "https://www.spotless.homes/post/what-is-the-1-minute-rule-for-cleaning-a-simple-trick-for-a-cleaner-home",
  "https://www.spotless.homes/post/what-tasks-can-a-cleaner-accomplish-in-just-3-hours",
  "https://www.spotless.homes/post/maximizing-a-three-hour-house-cleaning-session-what-can-be-accomplished",
  "https://www.spotless.homes/post/top-10-cleaning-hacks-for-busy-women",
  "https://www.spotless.homes/post/is-tipping-house-cleaners-a-necessary-gesture-of-appreciation",
  "https://www.spotless.homes/post/should-you-tip-house-cleaners-a-guide-to-tipping-etiquette",
  "https://www.spotless.homes/post/what-is-expected-of-a-cleaning-lady",
  "https://www.spotless.homes/post/inspiring-cleaning-quotes-to-motivate-your-home-care-routine",
  "https://www.spotless.homes/post/what-is-the-golden-rule-while-cleaning",
  "https://www.spotless.homes/post/understanding-the-80-20-rule-for-effective-house-cleaning",
  "https://www.spotless.homes/post/do-you-stay-home-when-the-house-cleaner-comes",
  "https://www.spotless.homes/post/reliable-hotel-room-cleaning-service-in-tampa-fl",
  "https://www.spotless.homes/post/can-bleach-effectively-remove-toilet-bowl-stains",
  "https://www.spotless.homes/post/how-often-should-you-clean-your-cat-s-litter-box-for-optimal-hygiene",
  "https://www.spotless.homes/post/is-dawn-dish-soap-effective-for-cleaning-walls-naturally",
  "https://www.spotless.homes/post/should-you-avoid-cleaning-your-house-in-the-evening-here-s-why",
  "https://www.spotless.homes/post/the-real-impact-of-good-and-bad-customer-service-in-the-cleaning-industry",
  "https://www.spotless.homes/post/how-often-do-you-really-need-to-clean-your-house",
  "https://www.spotless.homes/post/how-long-should-it-take-a-cleaner-to-clean-a-bathroom",
  "https://www.spotless.homes/post/effortless-cleaning-tips-for-a-spotless-and-organized-home",
  "https://www.spotless.homes/post/what-is-not-included-in-a-deep-cleaning-service",
  "https://www.spotless.homes/post/the-essential-rules-for-effective-cleaning-you-should-know",
  "https://www.spotless.homes/post/how-long-should-it-take-one-person-to-clean-a-house",
  "https://www.spotless.homes/post/the-ultimate-guide-to-house-cleaning-codes-and-best-practices",
];

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// Drop Wix's tracking spans and empty elements
turndown.addRule("strip-empty-spans", {
  filter: (node) => node.nodeName === "SPAN" && !node.textContent.trim() && !node.querySelector("img"),
  replacement: () => "",
});

const slugFromUrl = (url) => url.replace(/\/$/, "").split("/").pop();

const yaml = (v) => {
  if (v === null || v === undefined) return '""';
  const s = String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${s}"`;
};

function extFromImageUrl(url) {
  try {
    const u = new URL(url);
    // Wix CDN sometimes encodes the filename in the path; pick the actual extension before any "/v1/..." transforms
    const pathBeforeTransform = u.pathname.split("/v1/")[0];
    const ext = extname(pathBeforeTransform).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"].includes(ext)) return ext;
    // Fall back to anything-looking-like-an-extension at the end of the path
    const tail = extname(u.pathname).toLowerCase().split("?")[0];
    if (tail.length >= 2 && tail.length <= 6) return tail;
  } catch {}
  return ".jpg";
}

async function downloadImage(url, baseName) {
  const ext = extFromImageUrl(url);
  const filename = `${baseName}${ext}`;
  const localPath = join(IMAGES_DIR, filename);
  const publicPath = `/assets/blog/${filename}`;
  if (existsSync(localPath)) return publicPath;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(localPath, buf);
  return publicPath;
}

async function scrapePost(url, idx) {
  const slug = slugFromUrl(url);
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Index fetch failed ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    slug;
  const description = $('meta[property="og:description"]').attr("content") || "";
  const author = $('meta[property="article:author"]').attr("content") || "Spotless Homes";
  const published = $('meta[property="article:published_time"]').attr("content");
  const modified = $('meta[property="article:modified_time"]').attr("content");
  const heroUrl = $('meta[property="og:image"]').attr("content");

  // Body: Wix uses data-hook="post-description"
  const $body = $('[data-hook="post-description"]');
  if (!$body.length) throw new Error("no post-description element");

  // Clean: drop scripts, styles, image expand buttons, share popovers, etc.
  $body.find("script, style, noscript, button, svg").remove();

  // Rewrite inline images: download + swap src.
  // Wix sets `src` to a tiny blurred LQIP placeholder (~74×42px, blur_2 transform).
  // The real full-res image URL is on `data-pin-media` (Wix populates this for
  // Pinterest sharing — happens to be ~888px at q_90). Prefer that.
  const imgEls = $body.find("img").toArray();
  for (let i = 0; i < imgEls.length; i++) {
    const $img = $(imgEls[i]);
    const src =
      $img.attr("data-pin-media") ||
      $img.attr("data-src") ||
      $img.attr("src");
    if (!src || !src.startsWith("http")) continue;
    try {
      const local = await downloadImage(src, `${slug}-${String(i + 1).padStart(2, "0")}`);
      $img.attr("src", local);
      // Strip the lazy-load attrs so turndown doesn't keep cdn URLs around
      $img.removeAttr("srcset");
      $img.removeAttr("data-src");
      $img.removeAttr("data-pin-media");
      $img.removeAttr("data-pin-url");
    } catch (e) {
      console.warn(`    [${slug}] inline img skip: ${src.slice(0, 80)}…  (${e.message})`);
    }
  }

  // Convert body HTML to markdown
  const bodyHtml = $.html($body);
  let bodyMd = turndown.turndown(bodyHtml).trim();

  // Strip Wix's "Recent Posts" / "Featured Posts" trailing widgets if Turndown picks any up
  bodyMd = bodyMd.replace(/\n{3,}/g, "\n\n");

  // Hero image
  let heroLocal = "";
  if (heroUrl) {
    try {
      heroLocal = await downloadImage(heroUrl, `${slug}-hero`);
    } catch (e) {
      console.warn(`    [${slug}] hero img failed: ${e.message}`);
    }
  }

  const date = published ? published.slice(0, 10) : "";
  const updated = modified ? modified.slice(0, 10) : "";

  const frontmatterLines = [
    "---",
    `title: ${yaml(title)}`,
    `slug: ${yaml(slug)}`,
    `date: ${yaml(date)}`,
    updated && updated !== date ? `updated: ${yaml(updated)}` : null,
    `author: ${yaml(author)}`,
    `description: ${yaml(description.slice(0, 300))}`,
    heroLocal ? `heroImage: ${yaml(heroLocal)}` : null,
    `wixOriginal: ${yaml(url)}`,
    "---",
  ].filter(Boolean);

  const out = `${frontmatterLines.join("\n")}\n\n# ${title}\n\n${bodyMd}\n`;

  // Date-prefix the filename so directory listing sorts chronologically
  const datePrefix = date || "0000-00-00";
  const filename = `${datePrefix}-${slug}.md`;
  await writeFile(join(POSTS_DIR, filename), out);

  return { slug, title, date, bodyChars: bodyMd.length, hero: !!heroLocal };
}

async function main() {
  await mkdir(POSTS_DIR, { recursive: true });
  await mkdir(IMAGES_DIR, { recursive: true });
  console.log(`Scraping ${URLS.length} posts → ${POSTS_DIR}\n`);

  const limit = pLimit(4);
  let done = 0;
  const results = await Promise.allSettled(
    URLS.map((url, i) =>
      limit(async () => {
        const r = await scrapePost(url, i);
        done++;
        console.log(`  ${String(done).padStart(2, "0")}/${URLS.length}  ${r.slug}  (${r.bodyChars} chars, hero:${r.hero ? "✓" : "✗"})`);
        return r;
      }),
    ),
  );

  const ok = results.filter((r) => r.status === "fulfilled");
  const failed = results.filter((r) => r.status === "rejected");
  console.log(`\n${ok.length}/${results.length} succeeded · ${failed.length} failed`);
  failed.forEach((r, i) => {
    const url = URLS[results.indexOf(r)];
    console.error(`  ✗ ${url}\n    ${r.reason?.message || r.reason}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
