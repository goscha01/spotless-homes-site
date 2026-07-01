import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import { ratingLabel, ratingCount } from "@/data/reviews-stats";
import "../styles/site.css";
import "../styles/mobile.css";

export function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div>Florida · Tampa · St. Pete · Clearwater · Jacksonville</div>
        <Link to="/#reviews" className="topbar-rating">
          <span className="pill">★ {ratingLabel.replace("★", "")}/5</span> · {ratingCount}+ reviews on Google, Thumbtack &amp; Yelp · Insured &amp; Bonded
        </Link>
      </div>
    </div>
  );
}

export function NavBar({ active }) {
  const isActive = (key) => (active === key ? "active" : undefined);
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link className="logo" to="/">SPOTLESS<span className="dot"></span>HOMES</Link>
        <div className="nav-links">
          <Link className={isActive("checklist")} to="/cleaning-checklist">What's included</Link>
          <Link className={isActive("airbnb")} to="/airbnb-checklist">Airbnb checklist</Link>
          <Link className={isActive("office")} to="/office-checklist">Office checklist</Link>
          <Link className={isActive("products")} to="/cleaning-products">Products</Link>
          <Link className={isActive("blog")} to="/blog">Blog</Link>
          <Link className={isActive("about")} to="/about">Our story</Link>
          <Link className={isActive("areas")} to="/#areas">Areas</Link>
        </div>
        <div className="nav-cta">
          <a className="nav-phone" href="tel:+18139212100">813-921-2100</a>
          <Link to="/booking" className="btn btn-primary">Get Quote</Link>
        </div>
        <a className="nav-call-mobile" href="tel:+18139212100" aria-label="Call Spotless Homes at 813-921-2100">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </a>
        <MobileMenu />
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div>
            <Link className="logo" style={{ color: "var(--w)" }} to="/">SPOTLESS<span className="dot"></span>HOMES</Link>
            <p className="brand-copy">Florida's trusted local house cleaning — family-run since 2018.</p>
            <p className="brand-copy" style={{ marginTop: 6 }}><a href="tel:+18139212100">813-921-2100</a> · <a href="mailto:info@spotless.homes">info@spotless.homes</a></p>
          </div>
          <div>
            <h3>Services</h3>
            <ul>
              <li><Link to="/cleaning-checklist">What's included</Link></li>
              <li><Link to="/airbnb-checklist">Airbnb checklist</Link></li>
              <li><Link to="/office-checklist">Office checklist</Link></li>
              <li><Link to="/cleaning-products">Products we use</Link></li>
              <li><Link to="/eco">Eco Cleaning</Link></li>
              <li><Link to="/booking">Move In / Out</Link></li>
            </ul>
          </div>
          <div>
            <h3>Areas</h3>
            <ul>
              <li><Link to="/locations/tampa">Tampa</Link></li>
              <li><Link to="/locations/saint-petersburg">Saint Petersburg</Link></li>
              <li><Link to="/locations/clearwater">Clearwater</Link></li>
              <li><Link to="/locations/jacksonville">Jacksonville</Link></li>
              <li><Link to="/locations/orlando">Orlando</Link></li>
              <li><Link to="/locations/fort-lauderdale">Fort Lauderdale</Link></li>
              <li><Link to="/locations/boca-raton">Boca Raton</Link></li>
              <li><Link to="/locations/fort-myers">Fort Myers</Link></li>
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li>FAQ</li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <div>© 2026 Spotless Homes. All rights reserved.</div>
          <div>Insured by Hiscox · Surety Bonded · Florida DBA</div>
        </div>
      </div>
    </footer>
  );
}

export default function SiteShell({ active, children }) {
  return (
    <div className="site-root">
      <TopBar />
      <NavBar active={active} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
