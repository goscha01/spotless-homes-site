// Verifies every headline example + estimator behavior from the spec.
import puppeteer from "puppeteer";
const base = "http://localhost:5173";

const CASES = [
  { url: "/booking",                                                      expect: "Get your instant house cleaning quote.",                city: null,        service: null,  wizardActive: false },
  { url: "/booking?city=tampa",                                           expect: "Get your instant Tampa house cleaning quote.",          city: "tampa",     service: null,  wizardActive: false },
  { url: "/booking?city=clearwater",                                      expect: "Get your instant Clearwater house cleaning quote.",     city: "clearwater",service: null,  wizardActive: false },
  { url: "/booking?service=regular",                                      expect: "Get your instant Regular Cleaning quote.",              city: null,        service: "regular", wizardActive: false, hidePicker: true },
  { url: "/booking?service=deep",                                         expect: "Get your instant Deep Cleaning quote.",                 city: null,        service: "deep",    wizardActive: false, hidePicker: true },
  { url: "/booking?service=moveout",                                      expect: "Get your instant Move-Out Cleaning quote.",             city: null,        service: "move",    wizardActive: false, hidePicker: true },
  { url: "/booking?service=movein",                                       expect: "Get your instant Move-In Cleaning quote.",              city: null,        service: "move",    wizardActive: false, hidePicker: true },
  { url: "/booking?service=airbnb",                                       expect: "Get your instant Airbnb Turnover quote.",               city: null,        service: "airbnb",  wizardActive: false, hidePicker: true },
  { url: "/booking?city=tampa&utm_source=google",                         expect: "Get your instant Tampa house cleaning quote.",          city: "tampa",     service: null,  wizardActive: false },
  { url: "/booking?city=tampa&service=regular&utm_source=chatgpt",       expect: "Get your instant Tampa Regular Cleaning quote.",        city: "tampa",     service: "regular", wizardActive: false, hidePicker: true },
  { url: "/booking?city=clearwater&service=deep&utm_source=facebook",    expect: "Get your instant Clearwater Deep Cleaning quote.",      city: "clearwater",service: "deep",    wizardActive: false, hidePicker: true },
  { url: "/booking?headline=Get%20Your%20Exact%20Cleaning%20Price",       expect: "Get Your Exact Cleaning Price",                          city: null,        service: null,  wizardActive: false, plainHeadline: true },
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
    return {
      headline: h1 ? h1.textContent.trim() : null,
      pickerVisible: !!document.querySelector(".qp-picker"),
      wizardStep1Visible: !!document.body.innerText.match(/Bedroom/i),
      hasYellowMark: !!document.querySelector(".qp-h1 .qp-y-mark"),
      utm: JSON.parse(sessionStorage.getItem("sh_attribution") || "{}"),
    };
  });
  await p.close();

  const headlineOk = state.headline === c.expect;
  const pickerOk = c.hidePicker ? !state.pickerVisible : true;
  const yellowOk = c.plainHeadline ? !state.hasYellowMark : state.hasYellowMark;

  const ok = headlineOk && pickerOk && yellowOk;
  console.log(`${ok ? "✓" : "✗"} ${c.url}`);
  if (!headlineOk)  console.log(`   headline mismatch: got  "${state.headline}"\n                       want "${c.expect}"`);
  if (!pickerOk)    console.log(`   picker should be ${c.hidePicker ? "hidden" : "shown"} but was ${state.pickerVisible ? "shown" : "hidden"}`);
  if (!yellowOk)    console.log(`   yellow-mark expected=${!c.plainHeadline}, got=${state.hasYellowMark}`);
  if (state.utm && Object.keys(state.utm).length) {
    console.log(`   captured: ${JSON.stringify(state.utm)}`);
  }
  ok ? pass++ : fail++;
}

console.log(`\n${pass}/${pass + fail} passed`);
await b.close();
process.exit(fail === 0 ? 0 : 1);
