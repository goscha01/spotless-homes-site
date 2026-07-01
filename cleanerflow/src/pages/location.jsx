import { Link, useParams, Navigate } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import SEO from "@/components/SEO";
import { getCity, getSubcity } from "@/data/locations";
import { ratingLabel, ratingCountLabel, aggregateRatingSchema } from "@/data/reviews-stats";
import "./saint-petersburg.css";

// Generate per-subcity intro / "why" copy. Uses real per-subcity data
// (ZIPs, county) so the content actually varies page-to-page rather than
// just swapping the city name — important to pass Google's doorway-page
// filter on the 30+ surrounding-area pages.
function makeSubcityCopy(subcity, city) {
  const zipStr = subcity.zips && subcity.zips.length ? subcity.zips.join(", ") : "";
  const countyStr = subcity.county ? `${subcity.county} County` : "the surrounding area";
  const zipPhrase = zipStr
    ? `Our vetted, insured cleaners cover ZIP codes ${zipStr} — `
    : "Our vetted, insured cleaners — ";

  const lead = subcity.isCity
    ? `Looking for a trusted house cleaning service in ${subcity.name}, ${city.state}? Spotless Homes brings our family-run cleaning standard from ${city.name} to ${subcity.name} (${countyStr}). ${zipPhrase}same team that's earned 4.5★ across 150+ reviews, now serving ${subcity.name} on the schedule that fits your week.`
    : `Looking for a reliable cleaning service in ${subcity.name}? Spotless Homes covers ${subcity.name} as part of our ${city.name} service area — same vetted team, same standard, scheduled around your week.`;

  const whyParas = subcity.isCity
    ? [
        `Our recurring house cleaning in ${subcity.name} is built for the way you actually live. Whether you're in a single-family home, a townhouse, or a condo — our ${city.name}-based cleaners follow the same checklist that powers every Spotless Homes visit: kitchens disinfected, baths reset, floors mopped, baseboards wiped, and the corners most teams skip.`,
        `Standard upkeep, deep resets, move-in/move-out, and Airbnb turnovers — all available in ${subcity.name}. We dispatch from ${city.name}, which means same-week availability for most of ${countyStr}. Book online in two minutes, or call ${city.phone} to confirm coverage of your specific ZIP.`,
      ]
    : null;

  return { lead, whyParas };
}

export default function LocationPage() {
  const { city: citySlug, subcity: subcitySlug } = useParams();
  const city = getCity(citySlug);
  if (!city) return <Navigate to="/" replace />;

  const subcity = subcitySlug ? getSubcity(citySlug, subcitySlug) : null;
  if (subcitySlug && !subcity) return <Navigate to={`/locations/${citySlug}`} replace />;

  const placeName = subcity ? subcity.name : city.name;
  const headlineLabel = subcity ? `${subcity.name}, ${city.name}` : city.name;

  // Title / description: surface ZIPs and county on distinct-city sub-pages
  // so the meta tags vary per page (Google reads <title> very heavily for local).
  let seoTitle, seoDesc;
  if (subcity?.isCity) {
    seoTitle = `${subcity.name} ${city.state} House Cleaning | Spotless Homes — ${subcity.county ? subcity.county + " County" : city.name}`;
    seoDesc = `Trusted house cleaning in ${subcity.name}, ${city.state}${subcity.zips ? ` (ZIPs ${subcity.zips.join(", ")})` : ""}. Recurring, deep cleaning, move-out, and Airbnb turnover — dispatched from our ${city.name} team. Insured, bonded, pay only when satisfied.`;
  } else if (subcity) {
    seoTitle = `${subcity.name} House Cleaning Service | Spotless Homes ${city.name}`;
    seoDesc = `Trusted house cleaning in ${subcity.name}, ${city.name}. Same vetted Spotless Homes team — recurring, deep, move-out, and Airbnb turnover. Insured, bonded, pay only when you're happy.`;
  } else {
    seoTitle = `Maid Service in ${city.name} ${city.state} | Spotless Homes — Local House Cleaners`;
    seoDesc = `Spotless Homes ${city.name} provides reliable house cleaning, deep cleaning, move-in/out, and Airbnb turnover. Locally owned, insured & bonded. Book a free quote in ${city.name} today.`;
  }

  // Prefer the sub-location's own photo (when we have a genuine one for it),
  // falling back to the parent city image.
  const heroPhoto = subcity?.heroPhoto || city.heroPhoto;
  const heroOg = heroPhoto && heroPhoto.startsWith("/")
    ? `https://www.spotless.homes${heroPhoto}`
    : heroPhoto;

  // Parent-city LocalBusiness schema
  const parentCityJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Spotless Homes — ${city.name}`,
    url: `https://www.spotless.homes/locations/${city.slug}/`,
    telephone: `+1-${city.phoneRaw}`,
    image: heroOg,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: city.address.split(",")[0],
      addressLocality: city.name,
      addressRegion: city.state,
      postalCode: city.zip,
      addressCountry: "US",
    },
    areaServed: city.hoods.map((h) => `${h.name}, ${city.name}, FL`),
    aggregateRating: aggregateRatingSchema,
  };

  // Sub-city LocalBusiness schema (only for distinct cities — not in-city
  // neighborhoods, which would duplicate the parent's schema).
  const subcityJsonLd = subcity?.isCity ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Spotless Homes — ${subcity.name}`,
    url: `https://www.spotless.homes/locations/${city.slug}/${subcity.slug}/`,
    telephone: `+1-${city.phoneRaw}`,
    image: heroOg,
    priceRange: "$$",
    // Dispatch address is the parent city; areaServed is the specific subcity.
    address: {
      "@type": "PostalAddress",
      streetAddress: city.address.split(",")[0],
      addressLocality: city.name,
      addressRegion: city.state,
      postalCode: city.zip,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: `${subcity.name}, ${city.state}`,
      ...(subcity.county && { containedInPlace: { "@type": "AdministrativeArea", name: `${subcity.county} County` } }),
    },
    aggregateRating: aggregateRatingSchema,
  } : null;

  const jsonLd = subcity ? subcityJsonLd : parentCityJsonLd;
  const { lead, whyParas } = subcity ? makeSubcityCopy(subcity, city) : { lead: city.intro, whyParas: city.whyParas };

  return (
    <SiteShell active="areas">
      <SEO
        title={seoTitle}
        description={seoDesc}
        ogImage={heroOg}
        jsonLd={jsonLd}
      />
      <section className="loc-hero">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <Link to="/#areas">Areas</Link>
            <span className="sep">/</span>
            {subcity ? (
              <>
                <Link to={`/locations/${city.slug}`}>{city.name}</Link>
                <span className="sep">/</span>
                <span className="here">{subcity.name}</span>
              </>
            ) : (
              <span className="here">{city.name}</span>
            )}
          </nav>

          <div className="hero-grid">
            <div>
              <span className="eyebrow"><span className="bar"></span>{city.eyebrow}</span>
              <h1 className="h1 loc-h1">
                House Cleaning<br/>
                in <em><span className="y-mark">{headlineLabel}</span></em>.
              </h1>
              <p className="lead">{lead}</p>
              <div className="hero-ctas">
                <Link to="/booking" className="btn btn-dark btn-lg">Book online →</Link>
                <a href={`tel:${city.phoneRaw}`} className="btn btn-outline btn-lg">Call {city.phone}</a>
              </div>
              <div className="hero-meta">
                <Link to="/#reviews" className="hero-stat hero-stat-link"><div className="num">{ratingLabel}</div><div className="lbl">{ratingCountLabel}</div></Link>
                <div className="hero-stat"><div className="num">{city.name.split(" ").slice(-1)[0]}</div><div className="lbl">Local team since 2018</div></div>
                <div className="hero-stat"><div className="num">7 days</div><div className="lbl">Booking lead-time</div></div>
              </div>
            </div>

            <div className="hero-photo loc-hero-photo">
              <div className="yellow-corner"></div>
              <img className="img-main" src={heroPhoto} alt={`${placeName} landmark`} fetchPriority="high" loading="eager" decoding="async" />
              <div className="city-stamp">
                <div className="pin">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M10 18.5s6-5.5 6-10A6 6 0 1 0 4 8.5c0 4.5 6 10 6 10z" stroke="#0E0E0E" strokeWidth="1.5" strokeLinejoin="round"/>
                    <circle cx="10" cy="8.5" r="2" stroke="#0E0E0E" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <div className="city">{placeName}, {city.state}</div>
                  <div className="sub">{city.address.replace(/, FL.*$/, "")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZIP coverage block — only on distinct-city subpages where we have real ZIPs.
          This is the single biggest local-SEO win: it's both visible content
          (matching "cleaner 33510" type searches) and unique data per page. */}
      {subcity?.isCity && subcity.zips && subcity.zips.length > 0 && (
        <section className="zip-coverage">
          <div className="container">
            <div className="zip-card">
              <div className="zip-meta">
                <span className="eyebrow"><span className="bar"></span>Service area</span>
                <h3>We cover <em>{subcity.name}</em></h3>
                {subcity.county && (
                  <p className="county">{subcity.county} County, {city.state} · dispatched from our {city.name} team</p>
                )}
              </div>
              <div className="zip-list">
                <div className="zip-label">ZIP codes served</div>
                <div className="zip-chips">
                  {subcity.zips.map((z) => <span key={z} className="zip">{z}</span>)}
                </div>
                <p className="zip-foot">Outside this list? Call <a href={`tel:${city.phoneRaw}`}>{city.phone}</a> — most {subcity.county || "nearby"} ZIPs are covered.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {whyParas && whyParas.length > 0 && (
        <section className="intro">
          <div className="container">
            <div className="intro-grid">
              <div>
                <span className="eyebrow"><span className="bar"></span>Why Spotless · {placeName}</span>
                <h2>Local cleaners,<br/><em>local standards</em>.</h2>
              </div>
              <div className="copy">
                {whyParas.map((p, i) => <p key={i}>{p}</p>)}
                <div className="actions">
                  <Link to="/booking" className="btn btn-dark btn-lg">Book online →</Link>
                  <a href={`tel:${city.phoneRaw}`} className="btn btn-outline btn-lg">Call {city.phone}</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!subcity && (
        <section className="hoods">
          <div className="container">
            <div className="hoods-head">
              <div>
                <span className="eyebrow"><span className="bar"></span>Neighborhoods &amp; service area</span>
                <h2>Where we <em>clean</em>.</h2>
              </div>
              <div className="blurb">{city.hoodsBlurb}</div>
            </div>
            <div className="hood-grid">
              {city.hoods.map((h) => (
                <Link key={h.slug} to={`/locations/${city.slug}/${h.slug}`} className="hood">
                  <span className="name">{h.name}</span>
                  <span className="arrow">→</span>
                </Link>
              ))}
            </div>
            {city.serviceZips && city.serviceZips.length > 0 && (
              <div className="city-zips">
                <span className="lbl">ZIPs covered in {city.name}:</span>
                <span className="zips">{city.serviceZips.join(" · ")}</span>
              </div>
            )}
            <div className="hood-foot">
              <div>Don't see your block? <strong>We almost certainly cover it.</strong></div>
              <div>Call <strong>{city.phone}</strong> to confirm — most {city.name} ZIPs included.</div>
            </div>
          </div>
        </section>
      )}

      {subcity && (
        <section className="hoods">
          <div className="container">
            <div className="hoods-head">
              <div>
                <span className="eyebrow"><span className="bar"></span>Also nearby</span>
                <h2>Other parts of <em>{city.name}</em>.</h2>
              </div>
              <div className="blurb">{city.hoodsBlurb}</div>
            </div>
            <div className="hood-grid">
              {city.hoods.filter((h) => h.slug !== subcity.slug).map((h) => (
                <Link key={h.slug} to={`/locations/${city.slug}/${h.slug}`} className="hood">
                  <span className="name">{h.name}</span>
                  <span className="arrow">→</span>
                </Link>
              ))}
              <Link to={`/locations/${city.slug}`} className="hood">
                <span className="name">All of {city.name}</span>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="proof">
        <div className="proof-grid">
          <div className="proof-photo" style={{ backgroundImage: `url('${city.proofPhoto}')` }}></div>
          <div className="proof-copy">
            <span className="eyebrow"><span className="bar"></span>Inside-the-fridge thorough</span>
            <h3>Detailed attention from <em>appliances to floors</em>.</h3>
            <p>Our {placeName} cleaners get into the corners most services skip — inside the fridge, behind the stove, the top of the cabinets. The transition into your space, smoother and cleaner than ever.</p>
            <div className="badges">
              <div className="b"><div className="num">8 yrs</div><div className="lbl">Family-run in FL</div></div>
              <div className="b"><div className="num">Insured</div><div className="lbl">& Bonded</div></div>
              <div className="b"><div className="num">100%</div><div className="lbl">Satisfaction promise</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact">
        <div className="container">
          <div className="contact-head">
            <span className="eyebrow"><span className="bar"></span>Contact us<span className="bar"></span></span>
            <h2>Get a quote in <em>{placeName}</em>.</h2>
            <p className="contact-sub">
              I'd like to be contacted to discuss my specific cleaning needs and receive a customized price estimate for a property located in {placeName}. Please reach out to me at your earliest convenience. Thank you!
            </p>
          </div>
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Visit · Call · Write</h3>
              <div className="addr">{city.address.split(",")[0]}<br/>{city.address.split(",").slice(1).join(",").trim()}</div>
              <div className="div"></div>
              <div className="row"><span className="lbl">Phone</span>{city.phone}</div>
              <div className="row"><span className="lbl">Email</span>info@spotless.homes</div>
              <div className="row"><span className="lbl">Hours</span>Mon–Sat · 7am–7pm EST</div>
              <div className="socials">
                {["in","f","Y","G+","IG"].map((s) => <div key={s} className="soc">{s}</div>)}
              </div>
            </div>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="row2">
                <div>
                  <label>Name</label>
                  <input type="text" placeholder="Your name" />
                </div>
                <div>
                  <label>Phone number</label>
                  <input type="tel" placeholder="(___) ___-____" />
                </div>
              </div>
              <label>Subject</label>
              <input type="text" defaultValue={`Cleaning request ${placeName}`} />
              <label>Message</label>
              <textarea defaultValue={`I'd like to be contacted to discuss my specific cleaning needs and receive a customized price estimate for a property located in ${placeName}. Please reach out to me at your earliest convenience. Thank you!`}></textarea>
              <button className="btn btn-dark submit">Submit →</button>
            </form>
          </div>
        </div>
      </section>

      <section className="ctaband">
        <div className="container">
          <div className="row">
            <h2>Ready for a <em>spotless</em><br/>{placeName} home?</h2>
            <div className="ctaband-actions">
              <Link to="/booking" className="btn btn-dark btn-lg">Book online →</Link>
              <div className="phone">{city.phone}</div>
              <div className="small">Mon–Sat · 7am–7pm EST</div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
