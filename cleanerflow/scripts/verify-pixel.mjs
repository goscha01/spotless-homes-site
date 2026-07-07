import puppeteer from "puppeteer";

const URL = "http://localhost:5173/?utm_source=chatgpt&utm_medium=cpc&utm_campaign=verify_test&utm_content=team_photo";

const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();

const oaiqCalls = [];
const gtagCalls = [];
const outbound = { oaiq: [], gtm: [] };

page.on("console", (msg) => {
  const t = msg.text();
  if (t.includes("[verify]")) console.log("  ", t);
});

page.on("request", (req) => {
  const u = req.url();
  if (u.includes("openai.com")) outbound.oaiq.push({ method: req.method(), url: u });
  if (u.includes("googletagmanager.com") || u.includes("google-analytics.com") || u.includes("googleads")) {
    outbound.gtm.push({ method: req.method(), url: u.slice(0, 120) });
  }
});

await page.exposeFunction("__logOaiq", (args) => oaiqCalls.push(args));
await page.exposeFunction("__logGtag", (args) => gtagCalls.push(args));

await page.evaluateOnNewDocument(() => {
  const patch = () => {
    if (window.oaiq && !window.oaiq.__patched) {
      const orig = window.oaiq;
      window.oaiq = function () {
        window.__logOaiq(Array.from(arguments));
        return orig.apply(this, arguments);
      };
      window.oaiq.__patched = true;
    }
    if (window.gtag && !window.gtag.__patched) {
      const orig = window.gtag;
      window.gtag = function () {
        window.__logGtag(Array.from(arguments));
        return orig.apply(this, arguments);
      };
      window.gtag.__patched = true;
    }
  };
  setInterval(patch, 50);
});

console.log("→ loading", URL);
await page.goto(URL, { waitUntil: "networkidle2" });

console.log("\n[1] UTMs captured?");
const utms = await page.evaluate(() => JSON.parse(sessionStorage.getItem("sh_attribution") || "{}"));
console.log("   sh_attribution:", JSON.stringify(utms));

console.log("\n[2] Trigger interaction to boot pixel (scroll)…");
await page.mouse.wheel({ deltaY: 300 });
await new Promise((r) => setTimeout(r, 3500));

const oaiqExists = await page.evaluate(() => typeof window.oaiq === "function");
console.log("   window.oaiq loaded:", oaiqExists);
console.log("   oaiq calls so far:", JSON.stringify(oaiqCalls));

console.log("\n[3] Click a tel: link…");
const telLink = await page.$('a[href^="tel:"]');
if (telLink) {
  await page.evaluate((a) => a.click(), telLink);
  await new Promise((r) => setTimeout(r, 500));
  const callCall = oaiqCalls.find((c) => c[3] && c[3].custom_event_name === "call_click");
  const callGa = gtagCalls.find((c) => c[0] === "event" && c[1] === "call_click");
  console.log("   oaiq call_click fired:", !!callCall, callCall ? JSON.stringify(callCall) : "");
  console.log("   gtag call_click fired:", !!callGa);
} else {
  console.log("   ✗ no tel: link found on homepage");
}

console.log("\n[4] Click a Get-a-Quote link (/booking)…");
const bookLink = await page.$('a[href="/booking"], a[href^="/booking?"]');
if (bookLink) {
  await page.evaluate((a) => a.click(), bookLink);
  await new Promise((r) => setTimeout(r, 500));
  const qCall = oaiqCalls.find((c) => c[1] === "checkout_started");
  const qGa = gtagCalls.find((c) => c[0] === "event" && c[1] === "get_quote_click");
  console.log("   oaiq checkout_started fired:", !!qCall, qCall ? JSON.stringify(qCall) : "");
  console.log("   gtag get_quote_click fired:", !!qGa);
} else {
  console.log("   ✗ no /booking link found on homepage");
}

console.log("\n[5] Outbound network to ChatGPT/OpenAI:");
outbound.oaiq.forEach((r) => console.log("   ", r.method, r.url.slice(0, 120)));
if (!outbound.oaiq.length) console.log("    (none — pixel SDK may not have fetched yet)");

console.log("\n[6] All oaiq() calls captured:");
oaiqCalls.forEach((c, i) => console.log(`   [${i}]`, JSON.stringify(c)));

console.log("\n[7] All gtag() calls captured:");
gtagCalls.forEach((c, i) => console.log(`   [${i}]`, JSON.stringify(c)));

await browser.close();
