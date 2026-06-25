import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/cleaning-checklist", label: "What's included" },
  { to: "/airbnb-checklist",   label: "Airbnb checklist" },
  { to: "/office-checklist",   label: "Office checklist" },
  { to: "/cleaning-products",  label: "Products" },
  { to: "/about",              label: "Our story" },
  { to: "/#areas",             label: "Areas" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close menu on route change.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll + toggle nav-open class while open.
  useEffect(() => {
    const nav = document.querySelector("nav.nav");
    if (open) {
      document.body.classList.add("menu-open");
      nav?.classList.add("nav-open");
    } else {
      document.body.classList.remove("menu-open");
      nav?.classList.remove("nav-open");
    }
    return () => {
      document.body.classList.remove("menu-open");
      nav?.classList.remove("nav-open");
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="hamburger"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span></span><span></span><span></span>
      </button>

      <div className={`mobile-menu${open ? " open" : ""}`} role="dialog" aria-modal="true">
        <button
          type="button"
          className="mm-close"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <div className="mm-logo">SPOTLESS<span className="dot"></span>HOMES</div>
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="mm-link" onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <div className="mm-foot">
          <a className="mm-phone" href="tel:+18139212100">813-921-2100</a>
          <Link to="/booking" className="mm-cta" onClick={() => setOpen(false)}>
            Get a Quote
          </Link>
        </div>
      </div>
    </>
  );
}
