// Generate public/sitemap.xml from locations + blog posts.
// Run before `vite build` (wired into package.json `build` script).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://www.spotless.homes";
const TODAY = new Date().toISOString().slice(0, 10);

// Static routes — title comes from each page's SEO component, this only lists URLs.
const STATIC_ROUTES = [
  { path: "/",                       priority: "1.0", changefreq: "weekly" },
  { path: "/about",                  priority: "0.7", changefreq: "monthly" },
  { path: "/cleaning-checklist",     priority: "0.8", changefreq: "monthly" },
  { path: "/airbnb-checklist",       priority: "0.8", changefreq: "monthly" },
  { path: "/office-checklist",       priority: "0.7", changefreq: "monthly" },
  { path: "/cleaning-products",      priority: "0.6", changefreq: "monthly" },
  { path: "/eco",                    priority: "0.7", changefreq: "monthly" },
  { path: "/booking",                priority: "0.9", changefreq: "monthly" },
  { path: "/blog",                   priority: "0.8", changefreq: "weekly" },
  { path: "/careers",                priority: "0.5", changefreq: "monthly" },
  { path: "/terms-and-conditions",   priority: "0.3", changefreq: "yearly" },
  { path: "/privacy-policy",         priority: "0.3", changefreq: "yearly" },
];

async function readLocations() {
  const mod = await import(pathToFileURL(path.join(ROOT, "src/data/locations.js")).href);
  const data = mod.LOCATIONS || {};
  return Object.values(data).map((c) => ({
    slug: c.slug,
    hoods: (c.hoods || []).map((h) => h.slug),
  }));
}

function readBlogPosts() {
  const dir = path.join(ROOT, "src/data/blog-posts");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".md"))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const fields = {};
      if (fm) {
        for (const line of fm[1].split(/\r?\n/)) {
          const kv = line.match(/^([A-Za-z_]+):\s*"?(.*?)"?$/);
          if (kv) fields[kv[1]] = kv[2];
        }
      }
      const slug = fields.slug || f.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
      const lastmod = fields.updated || fields.date || TODAY;
      return { slug, lastmod };
    });
}

function urlEntry(loc, lastmod, changefreq, priority) {
  // S3 website hosting serves nested paths at trailing-slash URLs.
  // Sitemap URLs match where content actually lives — saves crawlers a 302.
  const trailed = loc === "/" || loc.endsWith("/") ? loc : loc + "/";
  return `  <url>\n    <loc>${SITE}${trailed}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function build() {
  const lines = [];
  for (const r of STATIC_ROUTES) {
    lines.push(urlEntry(r.path, TODAY, r.changefreq, r.priority));
  }
  const cities = await readLocations();
  for (const c of cities) {
    lines.push(urlEntry(`/locations/${c.slug}`, TODAY, "monthly", "0.9"));
    for (const hood of c.hoods) {
      lines.push(urlEntry(`/locations/${c.slug}/${hood}`, TODAY, "monthly", "0.6"));
    }
  }
  const posts = readBlogPosts();
  for (const p of posts) {
    lines.push(urlEntry(`/blog/${p.slug}`, p.lastmod, "monthly", "0.6"));
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>\n`;
}

const xml = await build();
const out = path.join(ROOT, "public/sitemap.xml");
fs.writeFileSync(out, xml);
const count = (xml.match(/<url>/g) || []).length;
console.log(`sitemap.xml: wrote ${count} URLs to public/sitemap.xml`);
