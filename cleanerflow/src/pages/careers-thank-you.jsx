import { useLocation } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import SEO from "@/components/SEO";
import NextdoorPixel from "@/NextdoorPixel";
import "./careers-apply.css";

export default function CareersThankYou() {
  const location = useLocation();
  const name = location.state?.name || "";
  const firstName = name ? name.split(" ")[0] : "";

  return (
    <SiteShell>
      <NextdoorPixel />
      <SEO
        title="Application Received | Spotless Homes Careers"
        description="Thanks for applying to Spotless Homes. We'll be in touch within 1–2 business days."
        noindex
      />
      <section className="apply-page">
        <div className="container">
          <div className="apply-success">
            <div className="check">✓</div>
            <h2>
              {firstName ? <>Thanks, {firstName} — </> : <>Thanks — </>}
              <em>application received</em>.
            </h2>
            <p>We review every application personally. Expect a call or email from our team within 1–2 business days.</p>
            <div className="orientation">
              <div className="lbl">Watch · short orientation</div>
              <div className="video-frame">
                <iframe
                  src="https://www.youtube.com/embed/q-_euSu6NTY?autoplay=1"
                  title="Spotless Homes orientation"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
