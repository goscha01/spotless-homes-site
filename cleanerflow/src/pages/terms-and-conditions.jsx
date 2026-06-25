import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import "./legal.css";

export default function TermsAndConditions() {
  return (
    <SiteShell>
      <section className="legal-page">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Terms &amp; Conditions</span>
          </nav>
          <span className="effective">Effective June 25, 2026</span>
          <h1>Terms &amp; <em>Conditions</em>.</h1>
          <div className="prose">
            <p>These Terms govern your use of services provided by Spotless Homes ("we," "us," "our"), a Florida-based residential and commercial cleaning company. By booking a clean with us or using our website, you agree to these Terms.</p>

            <h2>1. Quotes and bookings</h2>
            <p>Quotes provided online, by phone, or by email are estimates based on the information you provide (home size, number of rooms, condition, scope, add-ons). The final price may be adjusted if conditions at the property differ materially from what was described. We will tell you about any change before starting the work.</p>

            <h2>2. Pricing and payment</h2>
            <p>Prices are in U.S. dollars and include the labor and supplies needed for the service you booked. Payment is due on the day of service unless we have agreed in writing to a different schedule. We accept major credit and debit cards through our payment processor.</p>
            <p>If payment cannot be collected, we may pause future cleans until the balance is settled and may charge a reasonable late fee.</p>

            <h2>3. Pay-after-satisfaction policy</h2>
            <p>For standard residential cleans, you only pay once you have walked the home and confirmed you are satisfied. If something is missed, tell our team before payment and we will return within 24 hours to make it right at no extra charge.</p>

            <h2>4. Scheduling, rescheduling, and cancellations</h2>
            <ul>
              <li>Please reschedule or cancel at least <strong>24 hours</strong> before your appointment so we can re-assign the team.</li>
              <li>Cancellations made less than 24 hours before the appointment may incur a fee of up to 50% of the booking total.</li>
              <li>If our team arrives and cannot access the property, the visit is treated as a same-day cancellation.</li>
            </ul>

            <h2>5. Access and keys</h2>
            <p>You are responsible for providing safe and lawful access to the property during your scheduled window. If you provide keys, codes, or smart-lock access, we store them securely and use them only to perform the cleans you have booked. You can revoke access at any time.</p>

            <h2>6. Pets, children, and home conditions</h2>
            <p>We love pets, but if a pet shows signs of aggression we may pause the clean for everyone's safety. We do not move heavy furniture, climb above two-step ladders, or handle biohazards (blood, bodily fluids, mold remediation, hoarding) unless we have agreed in writing to do so.</p>

            <h2>7. Damage and breakage</h2>
            <p>We are insured and bonded. If something is damaged or broken during a clean, tell us within 48 hours and we will work with you to repair, replace, or reimburse. We are not responsible for damage caused by pre-existing wear, items not properly secured, or improperly installed fixtures.</p>

            <h2>8. Items we do not clean or handle</h2>
            <ul>
              <li>Cash, jewelry, firearms, or other valuables — please store these securely before our visit.</li>
              <li>Antiques, fine art, and items of high sentimental value — let us know in advance so we can skip or take extra care.</li>
              <li>Outdoor areas, garages, basements with active water damage, or active construction zones unless arranged separately.</li>
            </ul>

            <h2>9. Subcontractors and team</h2>
            <p>All cleaners working under the Spotless Homes brand are vetted, background-checked, and either employees or trusted partner teams operating under our standards. We carry general liability insurance and a surety bond covering work performed in your home.</p>

            <h2>10. Limitation of liability</h2>
            <p>Our total liability for any claim arising from a clean is limited to the amount you paid for that specific visit, except where prohibited by Florida law. We are not liable for indirect, incidental, or consequential damages.</p>

            <h2>11. Governing law</h2>
            <p>These Terms are governed by the laws of the State of Florida, without regard to its conflict-of-laws rules. Any dispute will be resolved in the state or federal courts located in Hillsborough County, Florida.</p>

            <h2>12. Changes to these Terms</h2>
            <p>We may update these Terms from time to time. The "Effective" date at the top of this page reflects the most recent revision. Continued use of our services after a change means you accept the updated Terms.</p>

            <h2>13. Contact</h2>
            <p>Questions, complaints, or compliments are always welcome.</p>
            <p><strong>Spotless Homes</strong><br/>info@spotless.homes<br/>813-921-2100<br/>Mon–Sat · 7am–7pm EST</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
