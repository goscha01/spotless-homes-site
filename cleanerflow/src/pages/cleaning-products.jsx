import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import "./products.css";

const PRODUCTS = [
  { tone: "purple",   num: "01 · Method",        h: <>All Purpose <em>Cleaner</em></>,
    items: [
      "Plant-based cleaning power cuts through grease + grime",
      "Cleans most non-porous surfaces including counters, tile, stone, wood and glass",
      "Made with plant-based wood cleaners",
      "Cruelty free. Tested by people, not on animals",
      "Bottle (minus nozzle) made from 100% recycled plastic (PCR)",
    ], placeholder: null },
  { tone: "blue", flip: true, num: "02 · Dawn",  h: <>Powerwash <em>Dish Spray</em></>,
    items: [
      "Get dishes done faster. Just spray, wipe, and rinse",
      "Cuts through grease 5× faster vs Dawn Non-Concentrated",
    ], placeholder: null },
  { tone: "cream",   num: "03 · Sprayway",       h: <>Glass <em>Cleaner</em></>,
    blurb: "Clean and polish any glass surface with this easy-to-use, fast-acting glass cleaner. Sprayway Glass Cleaner is ammonia-free, cleans thoroughly without leaving streaks, dries quickly and leaves a clean, fresh scent.",
    items: [
      "Ammonia free",
      "Foaming action",
      "Fresh scent · Streakless",
      "Removes fingerprints, dust, dirt and smoke film",
      "Can be used on all glass surfaces",
    ], placeholder: <>Sprayway<br/>Glass Cleaner</> },
  { tone: "charcoal", flip: true, num: "04 · Lysol", h: <>Power <em>Toilet Cleaner</em></>,
    items: [
      "Cleans and disinfects your entire toilet and removes tough stains and toilet bowl rings",
      "Thick gel coats above and below the water line",
      "Kills 99.9% of bacteria and viruses*",
      "The angled bottle targets hard-to-reach areas",
    ], placeholder: <>Lysol<br/>Power Toilet</> },
  { tone: "mint",    num: "05 · Easy-Off",       h: <>Oven <em>Cleaner</em></>,
    items: [
      "Perfect for spot-cleaning and everyday use",
      "Destroys tough burned-on grease and spills with no caustic fumes",
      "No protective gloves required",
      "Safe for self-cleaning ovens — just spray, wait, and wipe away",
      "Ideal for ovens / oven doors, broilers / broiler pans, and stainless-steel surfaces",
      "Lemon scent",
    ], placeholder: <>Easy-Off<br/>Oven Cleaner</>, placeholderDark: true },
  { tone: "amber", flip: true, num: "06 · Lime-A-Way®", h: <>Hard water <em>stain remover</em></>,
    items: [
      "The expert hard water stain remover",
      "Eliminates lime scale, rust and calcium stains",
      "Cleans small surfaces like basins, sinks, faucets, taps and fixtures",
      "Easy to use spray bottle",
    ], placeholder: <>Lime-A-Way</> },
  { tone: "charcoal", num: "07 · Clorox",        h: <>Clean-Up <em>Cleaner + Bleach</em></>,
    items: [
      "Kills COVID-19 virus in 30 seconds*",
      "Specially designed to clean a variety of surfaces",
      "Kills 99.9% of bacteria & viruses",
      "Removes allergens†",
    ], placeholder: <>Clorox<br/>Clean-Up + Bleach</> },
  { tone: "pink", flip: true, num: "08 · The Pink Stuff", h: <>Cleaning <em>Paste</em></>,
    blurb: "The Pink Stuff Miracle Cleaning Paste is perfect for cleaning dirt, grime and stains on saucepans, cooker tops, sinks, uPVC, barbecues, ceramic tiles, glass, showers, garden furniture, paintwork, boats and brass — the list is endless. Its natural formulation has been developed to provide high performance without the need for harsh chemicals.",
    items: null, placeholder: <>The Pink Stuff<br/>Miracle Paste</>, placeholderDark: true },
  { tone: "amber",   num: "09 · Orange Glo®",    h: <>Wood polish &amp; <em>conditioner</em></>,
    blurb: "Orange Glo® is a high quality wood conditioner, cleaner and polish made from the natural oils found in the peels of oranges. It contains no alcohol, wax or water. Orange Glo® removes grease, wax and accumulated dirt and revitalizes wood. Best of all it gives wood a brilliant luster that fills the air with the scent of fresh oranges. Easy to use plastic spray bottle — requires no aerosol propellants.",
    items: null, placeholder: <>Orange Glo®<br/>Wood Polish</> },
];

export default function CleaningProducts() {
  return (
    <SiteShell active="products">
      <section className="products-hero">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Products we use</span>
          </nav>
          <div className="h-grid">
            <div>
              <span className="eyebrow"><span className="bar"></span>Standard cleaning</span>
              <h1>Cleaning products<br/>we <em><span style={{ background: "var(--y)", padding: "0 .12em" }}>use</span></em>.</h1>
            </div>
            <div>
              <p className="lead">At Spotless Homes, we believe a great clean starts with great products. Our residential house cleaning staff uses excellent, effective, and in most cases environmentally friendly cleaning solutions in every house deep cleaning process and regular residential cleaning. These carefully selected supplies allow us to deliver better house cleaning services while ensuring your home and surfaces are protected. Whether it's washing grime away with our all-natural all-purpose cleaner or buffing glass and wood to a sparkling finish, all products are chosen to help with safe and thorough deep cleaning services.</p>
              <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                <Link to="/booking" className="btn btn-dark btn-lg">Book Now →</Link>
                <a href="tel:8139212100" className="btn btn-outline btn-lg">Call 813-921-2100</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {PRODUCTS.map((p, i) => (
        <section key={i} className={`product-row ${p.tone}${p.flip ? " flip" : ""}`}>
          {p.flip ? (
            <>
              <div className="copy">
                <span className="num">{p.num}</span>
                <h2>{p.h}</h2>
                {p.blurb && <p className="blurb">{p.blurb}</p>}
                {p.items && (
                  <ul>{p.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
                )}
                <a className="read-more">Read more →</a>
              </div>
              <div className="photo">
                {p.placeholder && (
                  <div className="placeholder-bottle" style={p.placeholderDark ? { color: "var(--k)" } : undefined}>
                    {p.placeholder}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="photo">
                {p.placeholder && (
                  <div className="placeholder-bottle" style={p.placeholderDark ? { color: "var(--k)" } : undefined}>
                    {p.placeholder}
                  </div>
                )}
              </div>
              <div className="copy">
                <span className="num">{p.num}</span>
                <h2>{p.h}</h2>
                {p.blurb && <p className="blurb">{p.blurb}</p>}
                {p.items && (
                  <ul>{p.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
                )}
                <a className="read-more">Read more →</a>
              </div>
            </>
          )}
        </section>
      ))}

      <section className="ctaband">
        <div className="container">
          <div className="row">
            <h2>Great clean starts with <em>great products</em>.</h2>
            <div className="ctaband-actions">
              <Link to="/booking" className="btn btn-dark btn-lg">Book online →</Link>
              <div className="phone">813-921-2100</div>
              <div className="small">Mon–Sat · 7am–7pm EST</div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
