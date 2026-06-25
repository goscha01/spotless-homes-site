import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import "./home.css";

export default function Home() {
  return (
    <SiteShell active="home">
      <Hero />
      <TrustStrip />
      <Services />
      <Magic />
      <HowItWorks />
      <Extras />
      <About />
      <Areas />
      <Reviews />
      <CtaBand />
    </SiteShell>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <span className="eyebrow"><span className="bar"></span>Florida's trusted house cleaners · Est. 2018</span>
            <h1 className="h1">A clean home,<br/>without<br/>the <em><span className="y-mark">weekend</span></em>.</h1>
            <p className="lead">Local, family-run cleaning across Tampa, St. Pete, Clearwater, and Jacksonville. Standard upkeep, deep resets, move-in/out, and Airbnb turnovers — booked in two minutes, paid only after you're happy.</p>
            <div className="hero-ctas">
              <Link to="/booking" className="btn btn-dark btn-lg">Get my instant quote →</Link>
              <a href="tel:8139212100" className="btn btn-outline btn-lg">Call 813-921-2100</a>
            </div>
            <div className="hero-meta">
              <div className="hero-stat"><div className="num">4.5★</div><div className="lbl">150+ verified reviews</div></div>
              <div className="hero-stat"><div className="num">$119</div><div className="lbl">Standard, from</div></div>
              <div className="hero-stat"><div className="num">8 yrs</div><div className="lbl">Family-run in FL</div></div>
            </div>
          </div>
          <div className="hero-photo">
            <div className="yellow-corner"></div>
            <img className="img-main" src="/assets/hero-woman.webp" alt="Spotless Homes client relaxing at home" />
            <img className="badge-award" src="/assets/logo-circle.png" alt="Spotless Homes" />
            <div className="float-stat">
              <div className="stars">★★★★★</div>
              <div>
                <div className="review-num">150+</div>
                <div className="review-lbl">verified reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="row">
        <div className="item">★ <span className="y">4.5/5 Google</span></div>
        <div className="item">Hiscox · <span className="y">General Liability</span></div>
        <div className="item">Surety <span className="y">Bonded</span></div>
        <div className="item">Florida <span className="y">DBA Registered</span></div>
        <div className="item">Pay <span className="y">After Satisfaction</span></div>
      </div>
    </div>
  );
}

function Services() {
  const items = [
    { img: "/assets/services/regular.jpg", name: "Standard Home Cleaning", desc: "Recurring upkeep — dust, vacuum, mop, sanitize kitchens & baths. The keep-it-tidy plan.", price: 119 },
    { img: "/assets/services/deep.jpg",    name: "Deep Home Cleaning",     desc: "Baseboards, fixtures, the corners that get skipped. The seasonal reset — perfect once or twice a year.", price: 149, featured: true, badge: "Most booked" },
    { img: "/assets/services/move.jpg",    name: "Move In / Out",          desc: "Inside appliances, cabinets, closets — top to bottom. Ready for the next chapter.", price: 149 },
    { img: "/assets/services/airbnb.jpg",  name: "Airbnb Turnover",        desc: "Linen change, laundry, glass, restock — between guests, on time, every time.", price: 129 },
  ];
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow"><span className="bar"></span>What we offer<span className="bar"></span></span>
          <h2 className="h2">Pick the cleaning that fits<br/><em>your week</em>.</h2>
          <p className="section-sub">Same vetted team, four flavors. Recurring discounts on weekly, biweekly, and monthly plans. Eco-friendly, plant-based supplies available on request.</p>
        </div>
        <div className="services-grid">
          {items.map((s) => (
            <div key={s.name} className={`service${s.featured ? " featured" : ""}`}>
              <div className="photo"><img src={s.img} alt={s.name} /></div>
              <div className="body">
                {s.badge && <span className="badge">{s.badge}</span>}
                <h3 className="name">{s.name}</h3>
                <p className="desc">{s.desc}</p>
                <div className="price"><span className="from">from</span><span className="num">${s.price}</span></div>
                <Link to="/booking" className="book">Book this <span>→</span></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const GALLERY = [
  { slug: "children-room",  label: "Child's Room",   beforeNote: "cluttered" },
  { slug: "living-room",    label: "Living Room",    beforeNote: "lived-in" },
  { slug: "bed-room",       label: "Bedroom",        beforeNote: "unmade" },
  { slug: "dining-room",    label: "Dining Room",    beforeNote: "after dinner" },
  { slug: "fridge",         label: "Refrigerator",   beforeNote: "grimy" },
  { slug: "stove",          label: "Stove",          beforeNote: "greasy" },
  { slug: "microwave",      label: "Microwave",      beforeNote: "splattered" },
  { slug: "microwave-door", label: "Microwave Door", beforeNote: "smudged" },
  { slug: "countertop",     label: "Countertop",     beforeNote: "crumbed" },
  { slug: "shower",         label: "Shower",         beforeNote: "soap-scummed" },
  { slug: "shower-glass",   label: "Shower Glass",   beforeNote: "hard-water" },
  { slug: "blinds",         label: "Blinds",         beforeNote: "dusty" },
  { slug: "lamp",           label: "Lamp",           beforeNote: "dusty" },
  { slug: "studio",         label: "Studio",         beforeNote: "lived-in" },
  { slug: "windows-sill",   label: "Window Sill",    beforeNote: "dusty" },
  { slug: "wood-floor",     label: "Wood Floor",     beforeNote: "scuffed" },
];

function Magic() {
  const baRef = useRef(null);
  const beforeRef = useRef(null);
  const divRef = useRef(null);
  const handleRef = useRef(null);
  const setPctRef = useRef(null);
  const [idx, setIdx] = useState(0);

  const current = GALLERY[idx];
  const next = () => setIdx((i) => (i + 1) % GALLERY.length);
  const prev = () => setIdx((i) => (i - 1 + GALLERY.length) % GALLERY.length);

  useEffect(() => {
    const ba = baRef.current;
    if (!ba) return;
    let dragging = false;
    const set = (p) => {
      const pct = Math.max(2, Math.min(98, p));
      if (beforeRef.current) beforeRef.current.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      if (divRef.current) divRef.current.style.left = pct + "%";
      if (handleRef.current) handleRef.current.style.left = pct + "%";
    };
    setPctRef.current = set;
    const fromEvent = (e) => {
      const r = ba.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      set((x / r.width) * 100);
    };
    const onMouseDown = (e) => { dragging = true; fromEvent(e); };
    const onMouseMove = (e) => { if (dragging) fromEvent(e); };
    const onMouseUp = () => { dragging = false; };
    const onTouch = (e) => fromEvent(e);

    ba.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    ba.addEventListener("touchstart", onTouch, { passive: true });
    ba.addEventListener("touchmove", onTouch, { passive: true });
    set(50);

    return () => {
      ba.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      ba.removeEventListener("touchstart", onTouch);
      ba.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useEffect(() => {
    if (setPctRef.current) setPctRef.current(50);
  }, [idx]);

  return (
    <section className="section magic" id="magic">
      <div className="container">
        <div className="grid">
          <div className="copy">
            <span className="eyebrow"><span className="bar"></span>Cleaning Magic</span>
            <h2 className="h2">See what 4 hours<br/><em>can do</em>.</h2>
            <p className="lead">Real client homes — drag the slider to compare. We don't stage and we don't tidy in advance. The room you walk into is the one we leave looking new.</p>
            <div className="quote">
              <p>"Everything was spotless and exceeded my expectations. Professional, reliable, and incredibly thorough."</p>
              <div className="who">— MILENA D. · VERIFIED · DEC 2025</div>
            </div>
          </div>
          <div className="ba-wrap">
            <div className="ba" ref={baRef}>
              <div className="pane pane-after">
                <img src={`/assets/before-after/${current.slug}-after.jpg`} alt={`${current.label} after professional cleaning by Spotless Homes`} />
                <span className="ph-text">After · {current.label.toLowerCase()} · clean</span>
              </div>
              <div className="pane pane-before" ref={beforeRef}>
                <img src={`/assets/before-after/${current.slug}-before.jpg`} alt={`${current.label} before cleaning, as found`} />
                <span className="ph-text">Before · {current.label.toLowerCase()} · {current.beforeNote}</span>
              </div>
              <span className="label label-before">Before</span>
              <span className="label label-after">After</span>
              <div className="divider" ref={divRef}></div>
              <div className="handle" ref={handleRef}>‹›</div>
            </div>
            <div className="ba-controls">
              <button type="button" className="ba-nav" onClick={prev} aria-label="Previous transformation">‹</button>
              <div className="ba-meta">
                <span className="ba-count">{String(idx + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}</span>
                <span className="ba-sep">·</span>
                <span className="ba-name">{current.label}</span>
              </div>
              <button type="button" className="ba-nav" onClick={next} aria-label="Next transformation">›</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", h: "Call or Request",   p: "Submit a request or call to connect with your local Spotless Homes team." },
    { n: "02", h: "Get a Quote",       p: "We confirm the details and send a personalized estimate — no surprise fees." },
    { n: "03", h: "Schedule a Clean",  p: "Pick the date and time that fits your life. We'll send a reminder the day before." },
    { n: "04", h: "Check & Pay",       p: "Walk through with us. Pay only once you're fully satisfied with the result." },
  ];
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow"><span className="bar"></span>How it works<span className="bar"></span></span>
          <h2 className="h2">Four steps to <em>a clean home</em>.</h2>
        </div>
        <div className="steps">
          {steps.map((s) => (
            <div key={s.n} className="step">
              <div className="num">{s.n}</div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Extras() {
  const items = [
    { src: "/assets/icons/oven.png", l: "Oven" },
    { src: "/assets/icons/fridge.png", l: "Fridge" },
    { src: "/assets/icons/window.png", l: "Windows" },
    { src: "/assets/icons/dishwasher.png", l: "Dishwasher" },
    { src: "/assets/icons/wash.png", l: "Laundry" },
    { src: "/assets/icons/bath.png", l: "Bathroom" },
    { src: "/assets/icons/patio.png", l: "Patio" },
    { src: "/assets/icons/pets.png", l: "Pet-safe" },
  ];
  return (
    <section className="section extras" id="extras">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow"><span className="bar"></span>Extra Services<span className="bar"></span></span>
          <h2 className="h2">Add-ons for <em>the deep stuff</em>.</h2>
          <p className="section-sub">Available with any cleaning. Just check the box during booking.</p>
        </div>
        <div className="extras-grid">
          {items.map((it) => (
            <div key={it.l} className="extra">
              <img src={it.src} alt="" />
              <div className="lbl">{it.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="grid">
          <div className="photo-wrap">
            <img src="/assets/team.jpg" alt="The Spotless Homes team" />
            <div className="y-block">
              <div className="big">7</div>
              <div className="lbl">Cleaners on the team</div>
            </div>
          </div>
          <div>
            <span className="eyebrow" style={{ color: "var(--y)" }}><span className="bar" style={{ background: "var(--y)" }}></span>About us</span>
            <h2 className="h2">A family business,<br/>cleaning <em>family homes</em>.</h2>
            <p className="lead">We started Spotless Homes in 2018 because we couldn't find a cleaning service we'd want for our own house. We hire carefully, train thoroughly, insure fully, and treat every home like the one we'd want to come home to.</p>
            <div className="signature">— "We Clean, You Relax." That's the whole job.</div>
            <Link to="/about" className="btn btn-primary btn-lg" style={{ marginTop: 30 }}>Read our story →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Areas() {
  const cities = [
    { name: "Tampa",           to: "/locations/tampa" },
    { name: "St. Petersburg",  to: "/locations/saint-petersburg" },
    { name: "Clearwater",      to: "/locations/clearwater" },
    { name: "Jacksonville",    to: "/locations/jacksonville" },
    { name: "Orlando",         to: "/locations/orlando" },
    { name: "Miami",           to: "/locations/miami" },
    { name: "Boca Raton",      to: "/locations/boca-raton" },
    { name: "Fort Myers",      to: "/locations/fort-myers" },
  ];
  return (
    <section className="areas" id="areas">
      <div className="container">
        <div className="grid">
          <div>
            <span className="eyebrow"><span className="bar"></span>Service areas</span>
            <h2 className="h2">All across <em>Florida</em>.</h2>
            <p className="section-sub" style={{ textAlign: "left", marginTop: 14 }}>Eight metros, one local team in each. Don't see your city? Call us — we're growing.</p>
            <Link to="/locations/saint-petersburg" className="btn btn-dark btn-lg" style={{ marginTop: 24 }}>See all areas →</Link>
          </div>
          <div className="city-list">
            {cities.map((c) => (
              <Link key={c.name} to={c.to} className="city">
                <span className="name">{c.name}</span>
                <span className="arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { av: "E", name: "Erica Avallone", date: "Feb 2026", text: '"Their work holds true to their name — my house was truly spotless after they finished. Super satisfied customer!"' },
    { av: "P", name: "Penny",          date: "Jan 2026", text: '"Attention to detail. Outstanding job on luxury vinyl floors with scuffs. Pleasant person, good communicator."' },
    { av: "Z", name: "Zach Nicolaou",  date: "Aug 2025", text: '"Corners, baseboards, and all the little things most cleaners overlook were taken care of perfectly. Felt like walking into a fresh, new home."' },
  ];
  return (
    <section className="section" id="reviews">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow"><span className="bar"></span>What clients say<span className="bar"></span></span>
          <h2 className="h2">4.5★ across <em>150+ reviews</em>.</h2>
        </div>
        <div className="reviews-grid">
          {reviews.map((r) => (
            <div key={r.name} className="review">
              <div className="stars">★★★★★</div>
              <p>{r.text}</p>
              <div className="who">
                <div className="av">{r.av}</div>
                <div>
                  <div className="name">{r.name}</div>
                  <div className="date">{r.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="ctaband">
      <div className="container">
        <div className="row">
          <h2>Ready for a spotless<br/>home this week?</h2>
          <div className="ctaband-actions">
            <Link to="/booking" className="btn btn-dark btn-lg">Get my instant quote →</Link>
            <div className="phone">813-921-2100</div>
            <div className="small">Mon–Sat · 7am–7pm EST</div>
          </div>
        </div>
      </div>
    </section>
  );
}
