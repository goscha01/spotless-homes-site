import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import "./careers.css";

export default function Careers() {
  return (
    <SiteShell>
      <section className="careers-hero">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Careers</span>
          </nav>
          <div className="careers-grid">
            <div>
              <span className="eyebrow"><span className="bar"></span>Professional cleaning work</span>
              <h1 className="h1">Apply to <em>Spotless Homes</em>.</h1>
              <p className="lead">Flexible part-time work with training, support, and growth.</p>
              <ul className="checks">
                <li>Independent contractor (1099)</li>
                <li>Weekday availability preferred</li>
                <li>Own basic cleaning tools required</li>
              </ul>
              <p className="post-checks">After applying, you'll receive access to our short orientation videos.</p>
              <div className="actions">
                <Link to="/careers/apply" className="btn btn-dark btn-lg">Apply &amp; Continue →</Link>
                <a href="tel:8139212100" className="btn btn-outline btn-lg">Call 813-921-2100</a>
              </div>
            </div>
            <div className="video-wrap">
              <div className="video-frame">
                <iframe
                  src="https://www.youtube.com/embed/q-_euSu6NTY"
                  title="A day at Spotless Homes — orientation preview"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="video-cap">Preview · what the work looks like</div>
            </div>
          </div>
        </div>
      </section>

      <section className="ctaband">
        <div className="container">
          <div className="row">
            <h2>Ready to <em>join the team</em>?</h2>
            <div className="ctaband-actions">
              <Link to="/careers/apply" className="btn btn-dark btn-lg">Apply now →</Link>
              <a className="phone" href="tel:+18139212100">813-921-2100</a>
              <div className="small">Mon–Sat · 7am–7pm EST</div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
