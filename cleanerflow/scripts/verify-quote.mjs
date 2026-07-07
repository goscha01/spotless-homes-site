import puppeteer from "puppeteer";

const base = "http://localhost:5173";

async function run(url, opts = {}) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 }); // iPhone 12 Pro
  const oaiq = [];
  const ga = [];

  await page.exposeFunction("__logO", (a) => oaiq.push(a));
  await page.exposeFunction("__logG", (a) => ga.push(a));
  await page.evaluateOnNewDocument(() => {
    const patch = () => {
      if (window.oaiq && !window.oaiq.__p) {
        const o = window.oaiq;
        window.oaiq = function () { window.__logO(Array.from(arguments)); return o.apply(this, arguments); };
        window.oaiq.__p = true;
      }
      if (window.gtag && !window.gtag.__p) {
        const o = window.gtag;
        window.gtag = function () { window.__logG(Array.from(arguments)); return o.apply(this, arguments); };
        window.gtag.__p = true;
      }
    };
    setInterval(patch, 50);
  });

  console.log(`\n════ ${opts.label || url} ════`);
  console.log("→ loading", url);
  await page.goto(url, { waitUntil: "networkidle2" });

  // Force pixel init by scrolling.
  await page.mouse.wheel({ deltaY: 100 });
  await new Promise((r) => setTimeout(r, 3000));

  if (opts.checks) await opts.checks(page, oaiq, ga);

  console.log("\n[all gtag event names]");
  ga.filter((c) => c[0] === "event").forEach((c) => console.log("  ", c[1]));

  console.log("\n[all oaiq calls]");
  oaiq.forEach((c) => console.log("  ", JSON.stringify(c)));

  await browser.close();
}

await run(`${base}/quote?utm_source=chatgpt&utm_medium=cpc&utm_campaign=verify`, {
  label: "/quote — plain (no ?service)",
  async checks(page, oaiq, ga) {
    const utms = await page.evaluate(() => JSON.parse(sessionStorage.getItem("sh_attribution") || "{}"));
    console.log("  UTMs:", JSON.stringify(utms));

    const h1 = await page.$eval(".qp-h1", (n) => n.textContent.trim());
    console.log("  H1:", h1);

    const ctaExists = await page.$(".qp-cta-primary");
    console.log("  CTA button present:", !!ctaExists);

    console.log("  Clicking hero CTA…");
    await page.click(".qp-cta-primary");
    await new Promise((r) => setTimeout(r, 500));

    const gqc = ga.some((c) => c[1] === "get_quote_click");
    const oqc = oaiq.some((c) => c[1] === "checkout_started");
    console.log("  gtag get_quote_click fired:", gqc);
    console.log("  oaiq checkout_started fired:", oqc);

    // Wizard should be showing Step0 (service picker) since no ?service param.
    const step0Visible = await page.evaluate(() => document.body.innerText.includes("Regular") && document.body.innerText.includes("Deep"));
    console.log("  Step0 (service picker) visible:", step0Visible);
  },
});

await run(`${base}/quote?service=deep&city=tampa&utm_source=chatgpt`, {
  label: "/quote?service=deep&city=tampa",
  async checks(page, oaiq, ga) {
    const h1 = await page.$eval(".qp-h1", (n) => n.textContent.trim());
    console.log("  H1:", h1);
    console.log("  H1 mentions Tampa:", h1.includes("Tampa"));

    // Because ?service=deep is present, wizard should start at Step1 (bedrooms/bathrooms)
    // and quote_started + service_selected should have fired on mount.
    const qs = ga.some((c) => c[1] === "quote_started");
    const ss = ga.some((c) => c[1] === "service_selected");
    console.log("  gtag quote_started fired on mount:", qs);
    console.log("  gtag service_selected fired on mount:", ss);

    const step1Visible = await page.evaluate(() => document.body.innerText.match(/Bedroom|Bathroom/i));
    console.log("  Step1 (bed/bath) visible:", !!step1Visible);
  },
});

await run(`${base}/booking`, {
  label: "/booking (regression — ensure standalone booking still works)",
  async checks(page, oaiq, ga) {
    const step0 = await page.evaluate(() => document.body.innerText.includes("Regular"));
    console.log("  Step0 visible on /booking:", step0);
    const hasNav = await page.evaluate(() => !!document.querySelector("nav.nav"));
    console.log("  Original nav still renders:", hasNav);
  },
});
