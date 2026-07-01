// Prerender every static route to its own HTML file so social crawlers
// (Facebook, LinkedIn, Twitter, iMessage, Slack) and any non-JS-executing
// bot sees the right per-route <title>, description, OG tags, and JSON-LD.
//
// Flow:
//   1. Spin up a tiny static-file server with SPA fallback on dist/
//   2. Launch headless Chromium via puppeteer
//   3. Visit each route, wait for react-helmet-async to update <head>
//   4. Snapshot document.documentElement.outerHTML to dist/<route>/index.html
//
// CloudFront origin is the S3 *website* endpoint, which serves
// `/locations/tampa/index.html` when the URI is `/locations/tampa/` —
// so nested index.html files just work, no Lambda@Edge or CF Function needed.

// Fail loud rather than silently exit — helps debug when a route trips an
// unhandled rejection somewhere inside puppeteer/http.
process.on("unhandledRejection", (err) => {
  console.error("\nUNHANDLED REJECTION:", err?.stack || err);
  process.exit(2);
});
process.on("uncaughtException", (err) => {
  console.error("\nUNCAUGHT EXCEPTION:", err?.stack || err);
  process.exit(3);
});

import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import Beasties from "beasties";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
// Port 0 → OS picks any available ephemeral port. Prevents EADDRINUSE when
// a prior prerender run leaked a hung http server on a fixed port.
const PORT = 0;
let BASE = ""; // set after server binds

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".md": "text/plain",
};

function startServer(distDir, port) {
  // Snapshot the SPA shell into memory at startup. The prerender writes a
  // prerendered HTML to dist/index.html (the home route) midway through the
  // run; without this snapshot, every later route would inherit the home
  // page's helmet tags as if they were "defaults from index.html", and the
  // [data-default] strip wouldn't catch them.
  const spaShell = fs.readFileSync(path.join(distDir, "index.html"));
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let url = decodeURIComponent(req.url.split("?")[0]);
      if (url.endsWith("/")) url += "index.html";
      // For any HTML request — root or unknown route — always serve the
      // pristine in-memory shell.
      if (url === "/index.html" || !path.extname(url)) {
        res.setHeader("Content-Type", "text/html");
        res.end(spaShell);
        return;
      }
      const file = path.join(distDir, url);
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.setHeader("Content-Type", "text/html");
        res.end(spaShell);
        return;
      }
      res.setHeader("Content-Type", MIME[path.extname(file).toLowerCase()] || "application/octet-stream");
      fs.createReadStream(file).pipe(res);
    });
    server.listen(port, () => resolve(server));
  });
}

async function getRoutes() {
  const routes = [
    "/", "/about", "/cleaning-checklist", "/airbnb-checklist",
    "/office-checklist", "/cleaning-products", "/eco", "/booking", "/blog",
    "/careers", "/terms-and-conditions", "/privacy-policy",
  ];
  const locations = await import(pathToFileURL(path.join(ROOT, "src/data/locations.js")).href);
  for (const c of Object.values(locations.LOCATIONS || {})) {
    routes.push(`/locations/${c.slug}`);
    for (const h of c.hoods || []) routes.push(`/locations/${c.slug}/${h.slug}`);
  }
  const blogDir = path.join(ROOT, "src/data/blog-posts");
  if (fs.existsSync(blogDir)) {
    for (const f of fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"))) {
      const raw = fs.readFileSync(path.join(blogDir, f), "utf8");
      const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      let slug = f.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
      if (fm) {
        const m = fm[1].match(/^slug:\s*"?([^"\r\n]+)"?$/m);
        if (m) slug = m[1].trim().replace(/^"|"$/g, "");
      }
      routes.push(`/blog/${slug}`);
    }
  }
  return routes;
}

const routes = await getRoutes();
console.log(`Prerendering ${routes.length} routes...`);

const server = await startServer(DIST, PORT);
const actualPort = server.address().port;
BASE = `http://localhost:${actualPort}`;
console.log(`  static server bound on :${actualPort}`);
const browser = await puppeteer.launch({ headless: "new" });

// Critical-CSS inliner. For each prerendered HTML we extract the rules that
// actually match the page and inline them in <head>, then rewrite the full
// stylesheet's <link> to load asynchronously (won't block first paint).
// pruneSource:false because the source CSS file is shared across 128 routes —
// we read it many times, mustn't modify it. inlineFonts/preloadFonts:false
// because our fonts are self-hosted woff2 with their own loading strategy.
const beasties = new Beasties({
  path: DIST,
  publicPath: "/",
  preload: "swap",
  pruneSource: false,
  reduceInlineStyles: false,
  mergeStylesheets: true,
  inlineFonts: false,
  preloadFonts: false,
  logLevel: "silent",
});

// react-helmet-async appends its tags without removing the static ones from
// index.html. Everything in index.html that helmet might override is tagged
// `data-default`; we strip those at prerender time so only the helmet-injected
// per-route tags survive. Defaults still exist in the served index.html
// (so the SPA shell has a sensible title on first paint before React mounts).
function dedupeHead(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  $("head [data-default]").remove();
  return "<!doctype html>\n" + $.html();
}

// One fresh BrowserContext per route. Reusing a single page accumulates
// helmet-emitted tags from previous navigations — page.goto() doesn't
// fully reset helmet's internal "emit on every render" behaviour.
async function snapshotRoute(route) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  try {
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const u = req.url();
      if (
        u.includes("fonts.googleapis.com") || u.includes("fonts.gstatic.com") ||
        u.includes("google-analytics.com") || u.includes("googletagmanager.com")
      ) req.abort();
      else req.continue();
    });
    await page.evaluateOnNewDocument(() => { window.__PRERENDER__ = true; });
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0", timeout: 30000 });
    await page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    );
    return await page.evaluate(() => document.documentElement.outerHTML);
  } finally {
    await context.close();
  }
}

let ok = 0;
const failures = [];
for (const route of routes) {
  try {
    const rawHtml = await snapshotRoute(route);
    const dedupedHtml = dedupeHead(rawHtml);
    // Inline critical CSS. If beasties fails for any reason, fall back to the
    // non-inlined HTML so a single bad route can't break the whole prerender.
    let html;
    try {
      html = await beasties.process(dedupedHtml);
    } catch (e) {
      console.error(`\n  beasties failed for ${route}: ${e.message} — falling back to non-inlined`);
      html = dedupedHtml;
    }
    const outPath =
      route === "/"
        ? path.join(DIST, "index.html")
        : path.join(DIST, route.replace(/^\//, ""), "index.html");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
    ok++;
    if (process.env.PRERENDER_VERBOSE) console.log("  ok", route, "→", path.relative(DIST, outPath));
    else process.stdout.write(".");
  } catch (e) {
    failures.push({ route, error: e.message });
    if (process.env.PRERENDER_VERBOSE) console.log("  FAIL", route, "—", e.message);
    else process.stdout.write("F");
  }
}

await browser.close();
server.close();
console.log(`\nPrerendered ${ok}/${routes.length} routes`);
if (failures.length) {
  console.log("Failures:");
  for (const f of failures) console.log(`  ${f.route}: ${f.error}`);
  process.exit(1);
}
