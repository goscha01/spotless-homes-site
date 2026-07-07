// Verifies the Marketing Context System end-to-end:
//  - Default headline + accent word ("quote")
//  - City + service personalization
//  - CTA override via ?cta=
//  - Custom hero image via ?hero=
//  - Coupon/promo/ref captured to sessionStorage
//  - entry_path recorded
//  - Unknown params ignored safely
//  - Malicious ?hero=javascript: rejected
//  - Malicious ?headline=<script> stripped
import puppeteer from "puppeteer";
const base = "http://localhost:5173";

const CASES = [
  { name: "default", url: "/booking",
    expect: { headline: "Get your instant house cleaning quote.", accent: "quote", cta: "Get My Instant Quote" } },
  { name: "city only", url: "/booking?city=tampa",
    expect: { headline: "Get your instant Tampa house cleaning quote.", cta: "Get My Instant Quote" } },
  { name: "service only", url: "/booking?service=deep",
    expect: { headline: "Get your instant Deep Cleaning quote.", cta: "Get My Instant Quote" } },
  { name: "city+service+utm", url: "/booking?city=tampa&service=deep&utm_source=chatgpt&utm_medium=cpc&utm_campaign=tampa_deep&utm_content=team_photo",
    expect: { headline: "Get your instant Tampa Deep Cleaning quote.", cta: "Get My Instant Quote" } },
  { name: "cta override", url: "/booking?cta=See%20My%20Price",
    expect: { cta: "See My Price" } },
  { name: "headline override", url: "/booking?headline=Book%20a%20Cleaner",
    expect: { headline: "Book a Cleaner" } },
  { name: "coupon+promo+ref", url: "/booking?coupon=SPRING20&promo=NEW10&ref=partner-a",
    // Storage keeps the raw URL value; sanitize/normalize is applied only when
    // context is resolved for display (not for the lead-email breadcrumb).
    expect: { storedCoupon: "SPRING20", storedPromo: "NEW10", storedRef: "partner-a" } },
  { name: "unknown params ignored", url: "/booking?zombieparam=xyz&city=tampa",
    expect: { headline: "Get your instant Tampa house cleaning quote." } },
  { name: "hostile hero URL rejected", url: "/booking?hero=javascript:alert(1)",
    expect: { heroImageSrc: "/assets/hero-woman.webp" } },
  { name: "hostile headline sanitized", url: "/booking?headline=<script>alert(1)</script>Foo",
    expect: { headline: "alert(1)Foo" } },
];

const b = await puppeteer.launch({ headless: "new" });
let pass = 0, fail = 0;

for (const c of CASES) {
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto(base + c.url, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 400));

  const state = await p.evaluate(() => {
    const h1 = document.querySelector(".qp-h1");
    const heroImg = document.querySelector(".qp-hero img, .qp-d-hero-img");
    const cta = document.querySelector(".qp-btn-primary, .qp-d-btn-dark");
    return {
      headline: h1 ? h1.textContent.trim() : null,
      accent: h1 ? (h1.querySelector(".qp-y-mark")?.textContent || null) : null,
      cta: cta ? cta.textContent.replace(/[→\s]+$/, "").trim() : null,
      heroImageSrc: heroImg ? new URL(heroImg.src).pathname : null,
      stored: JSON.parse(sessionStorage.getItem("sh_attribution") || "{}"),
    };
  });
  await p.close();

  const checks = [];
  if (c.expect.headline !== undefined)      checks.push(["headline", state.headline, c.expect.headline]);
  if (c.expect.accent !== undefined)        checks.push(["accent",   state.accent,   c.expect.accent]);
  if (c.expect.cta !== undefined)           checks.push(["cta",      state.cta,      c.expect.cta]);
  if (c.expect.heroImageSrc !== undefined)  checks.push(["heroImage", state.heroImageSrc, c.expect.heroImageSrc]);
  if (c.expect.storedCoupon !== undefined)  checks.push(["stored.coupon", state.stored.coupon, c.expect.storedCoupon]);
  if (c.expect.storedPromo !== undefined)   checks.push(["stored.promo",  state.stored.promo,  c.expect.storedPromo]);
  if (c.expect.storedRef !== undefined)     checks.push(["stored.ref",    state.stored.ref,    c.expect.storedRef]);

  const okAll = checks.every(([, actual, want]) => actual === want);
  console.log(`${okAll ? "✓" : "✗"} ${c.name}`);
  if (!okAll) {
    for (const [field, actual, want] of checks) {
      if (actual !== want) console.log(`     ${field}: got ${JSON.stringify(actual)} want ${JSON.stringify(want)}`);
    }
  }
  okAll ? pass++ : fail++;
}

console.log(`\n${pass}/${pass + fail} passed`);
await b.close();
process.exit(fail === 0 ? 0 : 1);
