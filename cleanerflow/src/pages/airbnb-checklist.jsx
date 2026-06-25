import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import "./airbnb.css";

export default function AirbnbChecklist() {
  return (
    <SiteShell active="airbnb">
      <section className="airbnb-hero">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Airbnb &amp; Vacation Rental</span>
          </nav>
        </div>
        <div className="bg"></div>
      </section>

      <section className="airbnb-intro">
        <div className="container">
          <div className="airbnb-intro-grid">
            <div>
              <span className="eyebrow"><span className="bar"></span>Vacation Rental · Turnover</span>
              <h1>Airbnb &amp; Vacation Rental cleaning that <em>impresses every guest</em>.</h1>
              <div className="stars-row">
                <span className="stars">★★★★★</span>
                <span className="lbl">Five-star reviews, on time, every time</span>
              </div>
            </div>
            <div>
              <p>Keep your Airbnb or vacation rental property guest-ready with our professional cleaning services tailored for short-term stays. At Spotless Homes, we provide fast, reliable, and thorough turnover cleaning between bookings.</p>
              <p>Our vacation rental cleaning service includes fresh linens, spotless bathrooms and kitchens, and detailed staging so your space always earns five-star reviews. Whether you're managing one unit or multiple listings, our trusted Airbnb cleaners ensure your home is clean, sanitized, and ready for the next guest — on time, every time.</p>
              <p style={{ marginTop: 14 }}>Book your Airbnb cleaning service today in Tampa, St. Pete, Jacksonville, or Clearwater and experience the convenience of hosting without the hassle.</p>
              <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                <Link to="/booking" className="btn btn-dark btn-lg">Book turnover →</Link>
                <a href="tel:8139212100" className="btn btn-outline btn-lg">Call 813-921-2100</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <div className="container">
          <div className="row">
            <div className="item"><strong>Fresh linens</strong> on every turn</div>
            <div className="item"><strong>Same-day</strong> turnovers available</div>
            <div className="item"><strong>Restocked</strong> toiletries &amp; basics</div>
            <div className="item"><strong>Photo-checked</strong> staging</div>
            <div className="item"><strong>Damage</strong> reporting</div>
          </div>
        </div>
      </section>

      <section className="band-head" style={{ marginTop: 0 }}>
        <div className="container">
          <span className="eyebrow"><span className="bar"></span>The full checklist<span className="bar"></span></span>
          <h2>Every <em>turnover</em>, top to bottom.</h2>
          <p className="section-sub">Five focus areas, one obsessive process. Initial cleaning includes all these tasks.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="checklist-grid-5">
            <Card
              title="Area 01" name="Bathroom"
              photo="/assets/airbnb/bathroom.avif"
              items={[
                "Scrub and disinfect toilets, sinks, showers, and bathtubs",
                "Replace towels and toiletries with fresh ones",
                "Ensure mirrors are clean and streak-free",
              ]}
            />
            <Card
              dark title="Area 02" name="General cleaning"
              photo="/assets/airbnb/living-room.avif"
              items={[
                "Dust all surfaces, including furniture, shelves, and decorations",
                "Vacuum carpets and rugs; mop hard floors",
                "Wipe down windowsills, blinds, and light fixtures",
                "Empty trash bins and replace liners",
              ]}
            />
            <Card
              title="Area 03" name="Kitchen"
              photo="/assets/airbnb/kitchen.avif"
              items={[
                "Clean and sanitize all countertops, sinks, and backsplashes",
                "Wash dishes and utensils thoroughly",
                "Check and clean appliances: microwave, toaster, coffee maker, etc.",
                "Empty and sanitize refrigerator and freezer",
              ]}
            />
            <Card
              title="Area 04" name="Bedrooms"
              photo="/assets/airbnb/bedroom.avif"
              items={[
                "Strip and remake beds with fresh linens between guests",
                "Dust nightstands, dressers, and decorative items",
                "Wipe down window sills, blinds, and ledges",
                "Vacuum carpets and rugs; mop hard floors",
                "Tidy and stage the room for the next guest's arrival",
                "Check under furniture for any items left behind",
              ]}
            />
            <Card
              dark title="Area 05" name="Final check"
              photo="/assets/airbnb/door-lock.avif"
              items={[
                "Inspect each room for any missed spots or items left behind",
                "Replace any burned-out light bulbs",
                "Ensure the property is secure",
                "Windows locked, doors closed",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cl-card" style={{ maxWidth: 780, margin: "0 auto" }}>
            <div className="photo"><img src="/assets/airbnb/appliance.avif" alt="Appliance check during turnover" /></div>
            <div className="body">
              <h3>Additional considerations</h3>
              <p className="name">Beyond the standard turnover</p>
              <ul>
                <li>Follow local health and safety guidelines regarding COVID-19 or other relevant health concerns</li>
                <li>Document any damages or issues encountered during cleaning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="ctaband">
        <div className="container">
          <div className="row">
            <h2>One unit or twenty — <em>we've got the turn</em>.</h2>
            <div className="ctaband-actions">
              <Link to="/booking" className="btn btn-dark btn-lg">Book turnover →</Link>
              <a className="phone" href="tel:+18139212100">813-921-2100</a>
              <div className="small">Mon–Sat · 7am–7pm EST</div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Card({ title, name, items, dark, photo }) {
  return (
    <div className={`cl-card${dark ? " dark" : ""}`}>
      {photo && <div className="photo"><img src={photo} alt="" /></div>}
      <div className="body">
        <h3>{title}</h3>
        <p className="name">{name}</p>
        <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
      </div>
    </div>
  );
}
