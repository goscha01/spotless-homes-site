import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import "./checklist.css";

export default function OfficeChecklist() {
  return (
    <SiteShell active="office">
      <section className="page-hero checklist-hero">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Office checklist</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow"><span className="bar"></span>Office & Commercial cleaning</span>
              <h1 className="h1">Professional office<br/>cleaning you can <em><span className="y-mark">rely on</span></em>.</h1>
              <p className="lead">Maintain a polished and productive workspace with Spotless Homes' commercial and office cleaning services. We specialize in cleaning offices, coworking spaces, clinics, and retail environments across Tampa, St. Pete, Clearwater, and Jacksonville. Our commercial cleaning professionals provide consistent, detail-oriented service — disinfecting high-touch surfaces, restocking essentials, vacuuming, mopping, trash removal, and more. Whether you need daily, weekly, or one-time cleaning, we tailor solutions to fit your schedule and business needs. A clean workplace boosts morale, impresses clients, and keeps your team healthy.</p>
              <div className="quick-jump">
                <a href="#every">Every visit</a>
                <a href="#final">Final check</a>
                <a href="#book">Request a quote</a>
              </div>
              <div className="badge-line">
                <div className="item"><strong>6 zones</strong> covered every visit</div>
                <div className="item"><strong>Flexible</strong> · daily · weekly · one-time</div>
                <div className="item"><strong>Insured</strong> & background-checked teams</div>
              </div>
            </div>
            <div className="page-hero-photo">
              <div className="yellow-corner"></div>
              <img src="/assets/office/hero.avif" alt="Clean modern office workspace" />
            </div>
          </div>
        </div>
      </section>

      <section className="band-head" id="every">
        <div className="container">
          <span className="eyebrow"><span className="bar"></span>Every visit<span className="bar"></span></span>
          <h2><em>Every time</em> we clean your office.</h2>
          <p className="section-sub">The non-negotiables — every zone, every visit. No surprises, no upsells.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="checklist-grid">
            <Card
              title="Zone 01" name="Restrooms"
              photo="/assets/office/restrooms.avif"
              items={[
                "Scrub and disinfect toilets, sinks, showers, and bathtubs (if applicable) for a fresh, hygienic space",
                "Replace paper towels, toilet paper, and toiletries with fresh supplies",
                "Ensure mirrors are streak-free and spotless",
                "Wipe down bathroom counters and all surfaces for cleanliness",
              ]}
            />
            <Card
              dark
              title="Zone 02" name="General office"
              photo="/assets/office/general-office.avif"
              items={[
                "Dust all surfaces, including desks, chairs, shelves, and decorations",
                "Vacuum carpets and rugs; mop hard floors to maintain cleanliness throughout the office",
                "Wipe down windowsills, blinds, and light fixtures to remove accumulated dust",
                "Empty trash bins and replace liners to ensure your office is always tidy",
                "Sanitize high-touch areas such as doorknobs, light switches, and phones",
              ]}
            />
            <Card
              title="Zone 03" name="Kitchen / Breakroom"
              photo="/assets/office/breakroom.avif"
              items={[
                "Clean and sanitize all countertops, sinks, and backsplashes in the kitchen or breakroom",
                "Wash dishes and utensils thoroughly (if applicable), or ensure they are neatly stored",
                "Clean and sanitize appliances, including microwaves, toasters, coffee makers, and refrigerators",
                "Empty trash bins and sanitize the area around the kitchen",
              ]}
            />
            <Card
              dark
              title="Zone 04" name="Desks & office equipment"
              photo="/assets/office/desks.avif"
              items={[
                "Sanitize desk surfaces, keyboards, phones, and office equipment to ensure hygiene",
                "Wipe down office furniture, including chairs, tables, and filing cabinets",
                "Organize any clutter, helping maintain a professional and efficient workspace",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="band-head" id="final">
        <div className="container">
          <span className="eyebrow"><span className="bar"></span>Closing out<span className="bar"></span></span>
          <h2>A thorough <em>final check</em>.</h2>
          <p className="section-sub">Before we lock up, every space gets a quality pass and a security sweep.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="checklist-grid">
            <Card
              title="Zone 05" name="Final check"
              photo="/assets/office/final-check.avif"
              items={[
                "Inspect all rooms for any missed spots or additional areas that need attention",
                "Replace any burned-out light bulbs and ensure that lighting is properly maintained",
                "Ensure office security by checking that windows are locked and doors are properly closed",
              ]}
            />
            <Card
              dark
              title="Zone 06" name="Additional considerations"
              photo="/assets/office/additional.avif"
              items={[
                "Adhere to local health and safety guidelines, including COVID-19 sanitation protocols, for enhanced cleanliness and peace of mind",
                "Document any damages or issues encountered during cleaning to keep your office in optimal condition",
              ]}
            />
            <Card
              title="On request" name="Tailored add-ons"
              items={[
                "Interior glass and partition cleaning",
                "Conference room setup and reset between meetings",
                "Carpet shampoo and hard-floor buffing",
                "Post-construction or post-event cleanup",
                "After-hours and weekend scheduling for minimal disruption",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="ctaband" id="book">
        <div className="container">
          <div className="row">
            <h2>Ready for a <em>spotless</em> office?</h2>
            <div className="ctaband-actions">
              <Link to="/booking" className="btn btn-dark btn-lg">Request a quote →</Link>
              <div className="phone">813-921-2100</div>
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
