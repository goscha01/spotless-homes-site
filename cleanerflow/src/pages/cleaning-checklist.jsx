import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import "./checklist.css";

export default function CleaningChecklist() {
  return (
    <SiteShell active="checklist">
      <section className="page-hero checklist-hero">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">What's included</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow"><span className="bar"></span>Deep & Standard cleaning</span>
              <h1 className="h1">What's included<br/>in our <em><span className="y-mark">cleaning</span></em>.</h1>
              <p className="lead">Our house deep cleaning service is designed to deliver exceptional results for every room in your home. This includes thorough housekeeping cleaning for bathrooms, kitchens, bedrooms, and living areas — covering everything from dusting and disinfecting to baseboard scrubbing and appliance detailing. Whether you're looking for deep cleaning services, ongoing residential house cleaning services, or a one-time refresh, we offer a cleaning service tailored to your needs.</p>
              <div className="quick-jump">
                <a href="#every">Every time</a>
                <a href="#rotating">On a rotating basis</a>
                <a href="#book">Book a clean</a>
              </div>
              <div className="badge-line">
                <div className="item"><strong>30+</strong> tasks every visit</div>
                <div className="item"><strong>3 rooms</strong> · bath · living · kitchen</div>
                <div className="item"><strong>Initial</strong> includes all rotating tasks</div>
              </div>
            </div>
            <div className="page-hero-photo">
              <div className="yellow-corner"></div>
              <img src="/assets/checklist/hero-dog.jpg" alt="Cozy living room with a puppy in a chair" />
            </div>
          </div>
        </div>
      </section>

      <section className="band-head" id="every">
        <div className="container">
          <span className="eyebrow"><span className="bar"></span>Every visit<span className="bar"></span></span>
          <h2><em>Every time</em> we clean.</h2>
          <p className="section-sub">The non-negotiables — every room, every visit. No surprises, no upsells.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="checklist-grid">
            <Card
              title="Room 01" name="Bathroom"
              items={[
                "Tile walls, bathtubs, and showers cleaned and disinfected",
                "Countertop / sink / faucets and drains cleaned and disinfected",
                "Built-up soap scum wiped down",
                "Mildew and mold removed",
                "Toilets cleaned and disinfected",
                "Wastebaskets emptied / disinfected / wiped down",
                "Window sills, ledges, and blinds dusted",
                "Mirrors and fixtures cleaned",
                "Towels changed / neatly hung / folded (if required)",
                "Doors and door frames spot cleaned",
                "Floors cleaned / carpets vacuumed",
              ]}
            />
            <Card
              dark
              title="Room 02" name="Living room / Bedrooms"
              items={[
                "Furniture and fixtures dusted / wiped",
                "Light fixtures / ceiling fans dusted",
                "Picture frames dusted",
                "Glass surfaces and mirrors cleaned",
                "Stairs and closet floors vacuumed",
                "Wastebaskets emptied / disinfected / wiped down",
                "Windowsills, blinds and ledges dusted",
                "Doors, door frames spot cleaned",
                "All readily accessible floors vacuumed and mopped",
                "Tidy surfaces (light organization)",
                "Beds made",
                "Linens changed (if required)",
              ]}
            />
            <Card
              title="Room 03" name="Kitchen"
              photo="/assets/services/regular.jpg"
              items={[
                "Countertops / sink / faucets and drains cleaned and sanitized",
                "Outside of range hood cleaned",
                "Drip pans or glass top surfaces wiped",
                "Fronts of all appliances cleaned",
                "Floors vacuumed and mopped",
                "Window sills, ledges, and blinds dusted",
                "Microwave wiped out / in",
                "Doors and door frames spot cleaned",
                "Wastebaskets emptied / disinfected / wiped down",
                "Load & run dishwasher (1 load) (if required)",
                "Empty dishwasher (if required)",
                "Stainless steel",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="band-head" id="rotating">
        <div className="container">
          <span className="eyebrow"><span className="bar"></span>Rotating tasks<span className="bar"></span></span>
          <h2>On a <em>rotating basis</em>.</h2>
          <p className="section-sub">In addition to the services provided every time, we provide these services on a rotating basis. Initial cleaning includes all these tasks.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="checklist-grid">
            <Card
              title="Rotating · Bathroom" name="Deep details"
              items={[
                "Tile grouting scrubbed",
                "Doors and door frames wiped",
                "Knickknacks individually cleaned",
                "Fronts of cabinets wiped",
                "Baseboards and window sills wiped",
                "Floors given extra attention",
                "Built-up soap scum removed",
              ]}
            />
            <Card
              title="Rotating · Living / Bedrooms" name="Deep details"
              items={[
                "Doorknobs and light switches wiped",
                "Doors and door frames wiped",
                "Window sills and ledges wiped",
                "Knickknacks individually cleaned",
                "Baseboards wiped",
                "Furniture and upholstery vacuumed",
                "Floors given extra attention",
                "Accessible areas under furniture vacuumed",
              ]}
            />
            <Card
              title="Rotating · Kitchen" name="Deep details"
              items={[
                "Inside of range hood cleaned",
                "Drip pans or glass top surfaces cleaned",
                "Doors and door frames wiped",
                "Knickknack areas cleaned",
                "Fronts of cabinets wiped",
                "Baseboards and window sills wiped",
                "Floors given extra attention",
                "All kitchen furniture wiped",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="ctaband" id="book">
        <div className="container">
          <div className="row">
            <h2>Ready to book a <em>spotless</em> clean?</h2>
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
