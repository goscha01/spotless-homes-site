import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import SEO from "@/components/SEO";
import "./products.css";

const ECO_PRODUCTS = [
  { tone: "mint",    num: "01 · ATTITUDE",                h: <>All Purpose <em>Cleaner</em></>,
    img: "/assets/products/eco/attitude.webp",
    url: "https://attitudeliving.com/products/all-purpose-cleaner",
    blurb: "ATTITUDE Nature+ Technology™ All Purpose Cleaner contains plant- and mineral-based ingredients like saponin, a natural cleansing agent. Your entire house, sparkling clean — without harsh chemistry." },
  { tone: "cream", flip: true, num: "02 · Naturally It's Clean", h: <>Floor <em>Cleaner</em></>,
    img: "/assets/products/eco/naturally-floor.webp",
    url: "https://naturallyitsclean.com/",
    items: [
      "Safe for any hard surface, including wood",
      "Plant-based enzymes — the science that makes this green formula work",
      "Safer Chemistry® · pH-neutral and non-corrosive",
      "No parabens · no artificial dyes · no alcohol or ammonia · no sulfates · no artificial fragrances · no phosphates · no petroleum · no SLS · no bleaching agents",
    ] },
  { tone: "blue",    num: "03 · ECOS",                    h: <>Window <em>Cleaner — Vinegar</em></>,
    img: "/assets/products/eco/ecos-window.png",
    url: "https://www.ecos.com/household-cleaners/window-cleaner-vinegar/",
    blurb: "Brighter glass, mirrors, and surfaces with our eco-conscious window cleaner. Instead of harsh ammonia, the formula uses plant-powered ingredients like vinegar for a streak-free clean — safer for people, pets, and homes." },
  { tone: "purple", flip: true, num: "04 · Ecover",       h: <>Power <em>Toilet Cleaner</em></>,
    img: "/assets/products/eco/ecover-toilet.webp",
    url: "https://www.ecoverdirect.com/products/power-toilet-cleaner/etoiletpower.aspx?productid=etoiletpower",
    items: [
      "Consciously chosen, biodegradable ingredients",
      "Tackles limescale and calcium deposits",
      "Works 10× faster than the standard Ecover formula",
      "Leaves your toilet sparkling clean with no harsh fumes",
    ] },
  { tone: "mint",    num: "05 · Gear Hugger",             h: <>Heavy-Duty <em>Degreaser</em></>,
    img: "/assets/products/eco/gearhugger-degreaser.webp",
    url: "https://www.gear-hugger.com/products/heavy-duty-degreaser-15oz",
    blurb: "Gear Hugger Heavy-Duty Degreaser is a water-based, plant-powered, non-toxic solution that's powerful and safe for people, pets, and the planet. Eliminates grease, grime, and dirt for a shiny finish with no residue." },
  { tone: "amber", flip: true, num: "06 · Puracy",        h: <>Stainless Steel <em>Cleaner</em></>,
    img: "/assets/products/eco/puracy-steel.webp",
    url: "https://puracy.com/products/stainless-steel-cleaner",
    blurb: "Puracy stainless steel cleaner is powered by a 96.8% plant-based, non-abrasive formula. Effective on everyday smudges and spills — appliances shine like brand new thanks to a brilliant formula powered by canola oil." },
  { tone: "cream",   num: "07 · Bon Ami",                 h: <>Powder <em>Cleanser</em></>,
    img: "/assets/products/eco/bonami-powder.png",
    url: "https://www.bonami.com/products/bon-ami-powder-cleanser/",
    blurb: "A household favorite since 1886. Bon Ami Powder Cleanser uses an effective formula with no harsh chemicals — confident around family and pets. Excels at cleaning dried-on food, scuff marks, and is gentle enough for most hard surfaces." },
  { tone: "pink", flip: true, num: "08 · CLR",            h: <>Calcium, Lime &amp; <em>Rust Remover</em></>,
    img: "/assets/products/eco/clr-calcium.png",
    url: "https://www.clrbrands.com/products/clr-household/clr-calcium-lime-and-rust-remover/",
    items: [
      "Quickly dissolves tough calcium and lime deposits",
      "Works on windows, siding, refrigerator shelves, ice makers, toilet tanks, tiles, faucet edges, sliding door channels, grout",
      "Part of the EPA's Safer Choice Program",
      "Contains no phosphates · septic-safe",
    ] },
];

export default function Eco() {
  return (
    <SiteShell active="eco">
      <SEO
        title="Eco Cleaning | Plant-Based, Pet & Kid-Safe Products | Spotless Homes"
        description="Eco-friendly house cleaning with plant-based, non-toxic products — safe for kids, pets, and allergy-sensitive homes. Premium service at +20% over standard pricing."
      />
      <section className="products-hero">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Eco-friendly cleaning</span>
          </nav>
          <div className="h-grid">
            <div>
              <span className="eyebrow"><span className="bar"></span>Green cleaning · plant-based</span>
              <h1>Eco cleaning,<br/>done <em><span style={{ background: "var(--y)", padding: "0 .12em" }}>right</span></em>.</h1>
            </div>
            <div>
              <p className="lead">At Spotless Homes, our eco-friendly house cleaning is designed to protect your home, your health, and the environment. We use plant-based, non-toxic products that deliver exceptional cleaning results without harsh chemicals or artificial fragrances. Whether you're booking a one-time deep clean or recurring residential service, our green supplies ensure every surface — from countertops to floors — is treated with care. Safe for children, pets, and allergy-prone households.</p>
              <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                <Link to="/booking" className="btn btn-dark btn-lg">Book Eco Clean →</Link>
                <a href="tel:8139212100" className="btn btn-outline btn-lg">Call 813-921-2100</a>
              </div>
            </div>
          </div>

          <div className="products-tabs" role="tablist" aria-label="Product line">
            <Link to="/cleaning-products/" className="tab">← Standard products</Link>
            <span className="tab active" aria-current="page">Eco-friendly products</span>
          </div>

          <aside className="eco-notice" aria-label="Eco cleaning pricing">
            <div className="eco-notice-head">
              <span className="eco-badge">+20% pricing</span>
              <h3>Eco cleaning is a <em>premium service</em></h3>
            </div>
            <p>Eco cleaning is priced <strong>20% above our standard rate</strong>. We're transparent about why:</p>
            <ul className="eco-why">
              <li><strong>It takes longer.</strong> Plant-based solutions need more contact time and elbow grease to match the cut-through power of harsh chemistry.</li>
              <li><strong>The products cost more.</strong> Certified eco-supplies (ATTITUDE, ECOS, Ecover, Puracy, Bon Ami, CLR Safer Choice, Naturally It's Clean, Gear Hugger) run 2–3× the unit cost of mainstream brands.</li>
              <li><strong>We assign a specialist.</strong> Eco cleans go to cleaners specifically trained in green workflows — different dwell times, different surface-product pairings, no cross-contamination from conventional sprays.</li>
            </ul>
            <p className="eco-promise">If a chemical-free clean for your kids, pets, or allergies matters to you, this is what it costs to do honestly. If it doesn't, our <Link to="/cleaning-products/">standard cleaning</Link> is excellent and 20% cheaper.</p>
          </aside>
        </div>
      </section>

      {ECO_PRODUCTS.map((p, i) => {
        const photo = (
          <div
            className="photo"
            style={p.img ? { backgroundImage: `url('${p.img}')` } : undefined}
          />
        );
        const copy = (
          <div className="copy">
            <span className="num">{p.num}</span>
            <h2>{p.h}</h2>
            {p.blurb && <p className="blurb">{p.blurb}</p>}
            {p.items && (
              <ul>{p.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
            )}
            {p.url && (
              <a className="read-more" href={p.url} target="_blank" rel="noopener noreferrer">
                Read more →
              </a>
            )}
          </div>
        );
        return (
          <section key={i} className={`product-row ${p.tone}${p.flip ? " flip" : ""}`}>
            {p.flip ? <>{copy}{photo}</> : <>{photo}{copy}</>}
          </section>
        );
      })}

      <section className="ctaband">
        <div className="container">
          <div className="row">
            <h2>Cleaner for your <em>home and the planet</em>.</h2>
            <div className="ctaband-actions">
              <Link to="/booking" className="btn btn-dark btn-lg">Book Eco Clean →</Link>
              <a className="phone" href="tel:+18139212100">813-921-2100</a>
              <div className="small">+20% over standard · Mon–Sat · 7am–7pm EST</div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
