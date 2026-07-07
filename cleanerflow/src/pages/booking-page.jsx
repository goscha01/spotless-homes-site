import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Booking from "@/pages/booking";
import SEO from "@/components/SEO";
import { ratingLabel, ratingCount } from "@/data/reviews-stats";
import {
  trackLandingView,
  trackGetQuoteClick,
  trackCallClick,
  trackServiceSelected,
} from "@/lib/track";
import { captureUTMs } from "@/lib/utm";
import { resolveBookingContext, parseInlineBold } from "@/lib/booking-context";
import "./booking-page.css";

// Renders differently by viewport so /booking works as ONE URL for both paid
// and organic traffic (per CORRECTIONS.md #5):
//   - Mobile (< 720px): design landing (hero + trust + CTA + picker) with the
//     wizard embedded below, revealed on service pick.
//   - Desktop (>= 720px): the full <Booking /> wizard directly (own nav, SEO,
//     step 0 service picker). No design hero.
function useIsMobile(breakpoint = 720) {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return isMobile;
}

// The four cards in the mobile landing's service picker. Card display copy
// is intentionally not tied to booking-context.js SERVICE_MAP labels — those
// exist to feed the headline personalization, whereas these are the four
// canonical wizard flows. If a URL preselects a service, the picker section
// is not rendered at all.
const SERVICE_CARDS = [
  { id: "regular", nameHtml: <><em>Regular</em> cleaning</>,  desc: "Recurring upkeep to keep it tidy.",    from: 119 },
  { id: "deep",    nameHtml: <><em>Deep</em> cleaning</>,     desc: "Top-to-bottom seasonal reset.",        from: 149, badge: "Most booked" },
  { id: "move",    nameHtml: <>Move <em>in/out</em></>,       desc: "Empty-home, ready for keys.",          from: 149 },
  { id: "airbnb",  nameHtml: <><em>Airbnb</em> turnover</>,   desc: "Five-star, guest-ready every time.",   from: 129 },
];

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M6.5 3h3l1.5 4-2 1.2a11 11 0 0 0 5.3 5.3L15.5 15l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3 6.1 1.5 1.5 0 0 1 4.5 4.5"
      stroke="#0E0E0E" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z" fill="#E0B414" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M20 6L9 17l-5-5" stroke="#E0B414" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" stroke="#E0B414" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);
const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="8" r="3.5" stroke="#E0B414" strokeWidth="1.7" />
    <path d="M5 20a7 7 0 0 1 14 0" stroke="#E0B414" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

function Headline({ ctx }) {
  if (ctx.headlineOverride) return <h1 className="qp-h1">{ctx.headlineOverride}</h1>;
  const { prefix, accent, suffix } = ctx.headline;
  return (
    <h1 className="qp-h1">
      {prefix} <em><span className="qp-y-mark">{accent}</span></em>{suffix}
    </h1>
  );
}

function Subheadline({ text }) {
  const chunks = parseInlineBold(text);
  return (
    <p className="qp-lead">
      {chunks.map((c, i) => (c.bold ? <b key={i}>{c.text}</b> : <span key={i}>{c.text}</span>))}
    </p>
  );
}

const ICONS = { star: StarIcon, check: CheckIcon, shield: ShieldIcon, person: PersonIcon };

// Renders the trust-badge chip row from ctx.trustBadges — icon key resolves to
// an SVG component, and {rating}/{ratingCount} placeholders in text get filled
// with the live values from reviews-stats.js.
function TrustBadges({ badges, rating, ratingCount }) {
  return badges.map((b, i) => {
    const Icon = ICONS[b.icon] || StarIcon;
    const text = (b.text || "")
      .replace("{rating}", rating)
      .replace("{ratingCount}", String(ratingCount));
    return (
      <span key={i} className="qp-chip">
        <span className="qp-chip-ic"><Icon /></span>{text}
      </span>
    );
  });
}

export default function BookingPage() {
  const isMobile = useIsMobile();
  const [params] = useSearchParams();
  const ctx = useMemo(() => resolveBookingContext(params), [params]);

  const pickerRef = useRef(null);
  const wizardRef = useRef(null);
  const sentinelRef = useRef(null);

  const [dockVisible, setDockVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(ctx.service?.id || null);
  // hasActivated is BookingPage's own gate on when to show the wizard vs the
  // hero. It's independent of Booking's internal step so a preselected service
  // (e.g. ?service=deep) still shows the personalized hero — the wizard opens
  // only after user clicks the CTA or a service card.
  const [hasActivated, setHasActivated] = useState(false);
  const wizardActive = hasActivated;
  const hasPreselect = !!ctx.service;

  // Ensure city/service (and utm_*) are in sessionStorage the moment we land,
  // so the lead email + downstream events can attach them. GAListener also
  // calls this; double-capture is idempotent.
  useEffect(() => {
    captureUTMs();
    trackLandingView(isMobile ? "booking_mobile" : "booking_desktop");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sticky dock: show only after the hero primary CTA scrolls out of view.
  useEffect(() => {
    if (!isMobile || wizardActive) { setDockVisible(false); return; }
    const el = sentinelRef.current;
    if (!el) return;
    const sync = () => setDockVisible(el.getBoundingClientRect().top < 0);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [isMobile, wizardActive]);

  // When wizard activates, pull it into view so the (now-hidden) hero
  // doesn't leave dead space above.
  useEffect(() => {
    if (wizardActive && wizardRef.current) {
      wizardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [wizardActive]);

  const startWizardWith = (serviceId, source) => {
    if (serviceId !== selectedService) setSelectedService(serviceId);
    trackServiceSelected(serviceId);
    trackGetQuoteClick(source);
    setHasActivated(true);
  };

  const onPrimaryCTA = () => {
    if (hasPreselect) {
      // Preselected → skip picker, open wizard at Step 1 with that service.
      startWizardWith(ctx.service.id, "quote_hero");
      return;
    }
    trackGetQuoteClick("quote_hero");
    pickerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onDockCTA = () => {
    if (hasPreselect) {
      startWizardWith(ctx.service.id, "quote_dock");
      return;
    }
    trackGetQuoteClick("quote_dock");
    pickerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onServiceCard = (id) => () => startWizardWith(id, "quote_picker");
  const onCallClick = (source) => () => trackCallClick(source);

  // ─── Desktop layout ───────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div className="qp-root qp-root-desktop">
        <SEO
          title="Instant Estimate | House Cleaning Booking | Spotless Homes"
          description="See your exact cleaning price in under 2 minutes — no phone call, no credit card. Transparent pricing for deep cleaning, move-out, and recurring service across Florida."
        />

        <div className="qp-d-topbar">
          <div className="qp-d-topbar-inner">
            <div>Florida · Tampa · St. Pete · Clearwater · Jacksonville</div>
            <a href="/#reviews" className="qp-d-topbar-rating">
              <span className="qp-d-pill">★ {ratingLabel.replace("★", "")}/5</span> · {ratingCount}+ reviews on Google, Thumbtack &amp; Yelp · Insured &amp; Bonded
            </a>
          </div>
        </div>

        <nav className="qp-d-nav">
          <div className="qp-d-nav-inner">
            <a className="qp-d-logo" href="/">SPOTLESS<span className="qp-d-logo-dot"></span>HOMES</a>
            <div className="qp-d-nav-links">
              <a href="/cleaning-checklist">What's included</a>
              <a href="/airbnb-checklist">Airbnb</a>
              <a href="/cleaning-products">Products</a>
              <a href="/about">Our story</a>
            </div>
            <div className="qp-d-nav-cta">
              <a className="qp-d-nav-phone" href="tel:+18139212100" onClick={onCallClick("nav")}>813-921-2100</a>
              <button type="button" className="qp-d-btn qp-d-btn-primary qp-d-btn-nav" onClick={onPrimaryCTA}>{ctx.ctaText}</button>
            </div>
          </div>
        </nav>

        {wizardActive ? (
          <section ref={wizardRef} className="qp-estimator">
            <Booking key={selectedService || "none"} embedded initialService={selectedService} />
          </section>
        ) : (
          <>
            <section className="qp-d-hero">
              <div className="qp-d-hero-inner">
                <div className="qp-d-hero-copy">
                  <div className="qp-d-eyebrow"><span className="qp-d-eyebrow-line"></span>INSTANT ESTIMATE · BOOK IN 2 MINUTES</div>
                  <Headline ctx={ctx} />
                  <Subheadline text={ctx.subheadline} />
                  <div className="qp-d-hero-ctas">
                    <button type="button" className="qp-d-btn qp-d-btn-dark" onClick={onPrimaryCTA}>{ctx.ctaText} <span className="qp-d-arw">→</span></button>
                    <a className="qp-d-btn qp-d-btn-outline" href="tel:+18139212100" onClick={onCallClick("hero")}>
                      <PhoneIcon /> Call 813-921-2100
                    </a>
                  </div>
                  <p className="qp-d-fine-print">Free · No obligation · Takes ~2 minutes · Pay only after you're happy</p>
                  <div className="qp-d-trust">
                    <TrustBadges badges={ctx.trustBadges} rating={ratingLabel.replace("★", "")} ratingCount={ratingCount} />
                  </div>
                </div>
                <div className="qp-d-hero-visual">
                  <div className="qp-d-yellow-accent" aria-hidden></div>
                  <img src={ctx.heroImage} alt="A spotless, sunlit Florida living room" className="qp-d-hero-img" />
                  <div className="qp-d-testimonial">
                    <div className="qp-d-testimonial-q">"Their work holds true to their name — my house was truly spotless."</div>
                    <div className="qp-d-testimonial-who">Erica A. · Verified Google review</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="qp-d-how">
              <div className="qp-d-how-inner">
                <div className="qp-d-how-cell">
                  <div className="qp-d-how-num">01</div>
                  <div className="qp-d-how-t">Pick your rooms</div>
                  <div className="qp-d-how-s">Bedrooms, bathrooms, condition, and any add-ons.</div>
                </div>
                <div className="qp-d-how-cell">
                  <div className="qp-d-how-num">02</div>
                  <div className="qp-d-how-t">See your price</div>
                  <div className="qp-d-how-s">A live, upfront total — no surprises, no sales call.</div>
                </div>
                <div className="qp-d-how-cell">
                  <div className="qp-d-how-num">03</div>
                  <div className="qp-d-how-t">Book it in</div>
                  <div className="qp-d-how-s">Pick a date and time. Pay only after you're happy.</div>
                </div>
              </div>
            </section>

            {!hasPreselect && (
              <section ref={pickerRef} className="qp-d-picker">
                <div className="qp-d-picker-inner">
                  <div className="qp-d-eyebrow qp-d-eyebrow-center">INSTANT ESTIMATE · BOOK IN 2 MINUTES</div>
                  <h2 className="qp-d-picker-h2">Pick a <em>service</em> to get started.</h2>
                  <p className="qp-d-picker-p">Final price is locked in once you pick rooms, condition, and any add-ons. No card needed.</p>
                  <div className="qp-d-svc-grid">
                    {SERVICE_CARDS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`qp-d-svc${s.badge ? " qp-d-svc-featured" : ""}`}
                        onClick={onServiceCard(s.id)}
                      >
                        {s.badge && <span className="qp-d-svc-badge">{s.badge}</span>}
                        <div className={`qp-d-svc-thumb qp-d-svc-thumb-${s.id}`} />
                        <div className="qp-d-svc-body">
                          <div className="qp-d-svc-name">{s.nameHtml}</div>
                          <div className="qp-d-svc-desc">{s.desc}</div>
                        </div>
                        <div className="qp-d-svc-foot">
                          <span className="qp-d-svc-price">from <b>${s.from}</b></span>
                          <span className="qp-d-svc-go">Choose <span className="qp-d-svc-arw">→</span></span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    );
  }

  // ─── Mobile layout ────────────────────────────────────────────────────
  return (
    <div className="qp-root">
      <SEO
        title="Instant Estimate | House Cleaning Booking | Spotless Homes"
        description="See your exact cleaning price in under 2 minutes — no phone call, no credit card. Transparent pricing for deep cleaning, move-out, and recurring service across Florida."
      />

      <header className="qp-bar">
        <div className="qp-logo">SPOTLESS<span className="qp-dot"></span>HOMES</div>
        <a className="qp-call" href="tel:+18139212100" onClick={onCallClick("bar")}>
          <PhoneIcon />
          813-921-2100
        </a>
      </header>

      {!wizardActive && (
        <>
          <section className="qp-hero">
            <div className="qp-hero-photo">
              <span className="qp-kicker"><span className="qp-kicker-dot"></span>Tampa · St. Pete · Clearwater · JAX</span>
              <img src={ctx.heroImage} alt="A spotless, sunlit Florida living room" />
              <div className="qp-rating-chip">
                <span className="qp-rating-stars">★★★★★</span>
                <div>
                  <div className="qp-rating-n">{ratingLabel.replace("★", "")}<span className="qp-rating-slash">/5</span></div>
                  <div className="qp-rating-sub">{ratingCount}+ reviews</div>
                </div>
              </div>
            </div>
            <div className="qp-hero-body">
              <Headline ctx={ctx} />
              <Subheadline text={ctx.subheadline} />
            </div>
          </section>

          <div className="qp-trust">
            <TrustBadges badges={ctx.trustBadges} rating={ratingLabel.replace("★", "")} ratingCount={ratingCount} />
          </div>

          <div className="qp-cta-wrap">
            <button className="qp-btn qp-btn-primary" onClick={onPrimaryCTA}>
              {ctx.ctaText} <span className="qp-arw">→</span>
            </button>
            <a className="qp-btn qp-btn-outline" href="tel:+18139212100" onClick={onCallClick("hero")}>
              <PhoneIcon />
              Call Now
            </a>
            <p className="qp-cta-note">Free · No obligation · Takes ~2 minutes</p>
          </div>
          <div ref={sentinelRef} className="qp-dock-sentinel"></div>

          {!hasPreselect && (
            <section ref={pickerRef} className="qp-picker">
              <div className="qp-eyebrow">Instant estimate · Book in 2 minutes</div>
              <h2 className="qp-picker-h2">Pick a <em>service</em> to get started.</h2>
              <p className="qp-picker-p">Final price is locked in once you pick rooms, condition, and any add-ons. No card needed.</p>

              <div className="qp-svc-list">
                {SERVICE_CARDS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`qp-svc${s.badge ? " qp-svc-sel" : ""}`}
                    onClick={onServiceCard(s.id)}
                  >
                    <div className={`qp-svc-thumb qp-svc-thumb-${s.id}`} />
                    <div className="qp-svc-info">
                      {s.badge && <span className="qp-svc-badge">{s.badge}</span>}
                      <div className="qp-svc-name">{s.nameHtml}</div>
                      <div className="qp-svc-desc">{s.desc}</div>
                      <div className="qp-svc-foot">
                        <span className="qp-svc-price">from <b>${s.from}</b></span>
                        <span className="qp-svc-go">Choose <span className="qp-svc-arw">→</span></span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="qp-reassure">
            <div className="qp-quote">"Their work holds true to their name — my house was truly spotless."</div>
            <div className="qp-quote-stars">★★★★★</div>
            <div className="qp-quote-who">Erica A. · Verified Google review</div>
          </section>
        </>
      )}

      {wizardActive && (
        <section ref={wizardRef} className="qp-estimator">
          <Booking
            key={selectedService || "none"}
            embedded
            initialService={selectedService}
          />
        </section>
      )}

      {!wizardActive && (
        <div className={`qp-dock${dockVisible ? " qp-dock-show" : ""}`}>
          <div className="qp-dock-meta">
            <div className="qp-dock-l">Starting at</div>
            <div className="qp-dock-p">$119<small>/visit</small></div>
          </div>
          <button className="qp-btn qp-btn-primary qp-dock-btn" onClick={onDockCTA}>
            {ctx.ctaText} →
          </button>
        </div>
      )}
    </div>
  );
}
