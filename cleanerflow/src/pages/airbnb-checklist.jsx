import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import SEO from "@/components/SEO";
import "./checklist.css";

export default function AirbnbChecklist() {
  return (
    <SiteShell active="airbnb">
      <SEO
        title="Airbnb & Vacation Rental Cleaning | Spotless Homes Florida"
        description="Fast, reliable Airbnb turnover and vacation rental cleaning across Tampa, St. Pete, Clearwater, and Jacksonville. Fresh linens, photo-checked staging, same-day turns."
      />
      <section className="page-hero checklist-hero">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Airbnb &amp; Vacation Rental</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow"><span className="bar"></span>Vacation Rental · Turnover</span>
              <h1 className="h1">Airbnb cleaning that<br/><em><span className="y-mark">impresses</span></em> every guest.</h1>
              <p className="lead">Keep your Airbnb or vacation rental guest-ready with professional turnover cleaning tailored for short-term stays. At Spotless Homes, we provide fast, reliable, and thorough cleanings between bookings — fresh linens, spotless bathrooms and kitchens, and detailed staging so your space always earns five-star reviews. Whether you manage one unit or twenty listings across Tampa, St. Pete, Jacksonville, or Clearwater, our trusted Airbnb cleaners ensure your home is clean, sanitized, and ready for the next guest on time, every time.</p>
              <div className="quick-jump">
                <a href="#every">Every turnover</a>
                <a href="#final">Final check</a>
                <a href="#book">Book a turnover</a>
              </div>
              <div className="badge-line">
                <div className="item"><strong>5 areas</strong> covered every turn</div>
                <div className="item"><strong>Same-day</strong> turnovers available</div>
                <div className="item"><strong>Fresh linens</strong> &amp; restocked basics</div>
              </div>
            </div>
            <div className="page-hero-photo">
              <div className="yellow-corner"></div>
              <img src="/assets/airbnb/hero.jpg" alt="Freshly made bed in a vacation rental" />
            </div>
          </div>
        </div>
      </section>

      <section className="band-head" id="every">
        <div className="container">
          <span className="eyebrow"><span className="bar"></span>Every turnover<span className="bar"></span></span>
          <h2><em>Every turn</em>, top to bottom.</h2>
          <p className="section-sub">The non-negotiables — every area, every turnover. Photo-checked staging, no surprises.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="checklist-grid">
            <Card
              title="Area 01" name="Bathroom"
              photo="/assets/airbnb/bathroom.avif"
              items={[
                "Scrub and disinfect toilets, sinks, showers, and bathtubs",
                "Replace towels and toiletries with fresh ones",
                "Ensure mirrors are clean and streak-free",
                "Wipe down counters and all surfaces for guest-ready shine",
              ]}
            />
            <Card
              dark
              title="Area 02" name="General cleaning"
              photo="/assets/airbnb/living-room.avif"
              items={[
                "Dust all surfaces, including furniture, shelves, and decorations",
                "Vacuum carpets and rugs; mop hard floors",
                "Wipe down windowsills, blinds, and light fixtures",
                "Empty trash bins and replace liners",
                "Sanitize high-touch areas like doorknobs, light switches, and remotes",
              ]}
            />
            <Card
              title="Area 03" name="Kitchen"
              photo="/assets/airbnb/kitchen.avif"
              items={[
                "Clean and sanitize all countertops, sinks, and backsplashes",
                "Wash dishes and utensils thoroughly",
                "Clean appliances: microwave, toaster, coffee maker, and more",
                "Empty and sanitize refrigerator and freezer",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="band-head" id="final">
        <div className="container">
          <span className="eyebrow"><span className="bar"></span>Closing out<span className="bar"></span></span>
          <h2>A thorough <em>final check</em>.</h2>
          <p className="section-sub">Before we hand over the keys, every space gets a quality pass and a security sweep.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="checklist-grid">
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
              dark
              title="Area 05" name="Final check"
              photo="/assets/airbnb/door-lock.avif"
              items={[
                "Inspect each room for missed spots or items left behind",
                "Replace any burned-out light bulbs",
                "Ensure the property is secure — windows locked, doors closed",
                "Confirm the unit is staged and photo-ready",
              ]}
            />
            <Card
              title="On request" name="Additional considerations"
              photo="/assets/airbnb/appliance.avif"
              items={[
                "Follow local health and safety guidelines, including sanitation protocols",
                "Document any damages or issues encountered during cleaning",
                "Restock toiletries, coffee, and welcome basics",
                "Coordinate same-day turnovers between back-to-back bookings",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="ctaband" id="book">
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
