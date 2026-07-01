import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import SEO from "@/components/SEO";
import "./legal.css";

export default function PrivacyPolicy() {
  return (
    <SiteShell>
      <SEO
        title="Privacy Policy | Spotless Homes"
        description="How Spotless Homes collects, uses, and protects the information you share when you book a cleaning service."
      />
      <section className="legal-page">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Privacy Policy</span>
          </nav>
          <span className="effective">Effective June 25, 2026</span>
          <h1>Privacy <em>Policy</em>.</h1>
          <div className="prose">
            <p>Spotless Homes ("we," "us," "our") respects your privacy. This policy explains what information we collect, how we use it, and the choices you have. It applies to our website at <strong>spotless.homes</strong> and to bookings made by phone or in person.</p>

            <h2>1. Information we collect</h2>
            <p>We only collect what we need to quote, schedule, and clean.</p>
            <ul>
              <li><strong>You give us:</strong> name, email, phone number, service address, home details (size, rooms, condition, pets, access notes), and any preferences you share with our team.</li>
              <li><strong>Payment:</strong> when you pay, card details are entered directly into our PCI-compliant payment processor. We never store your full card number on our servers.</li>
              <li><strong>From your device:</strong> standard web analytics — pages visited, time on page, approximate location (city/state), device type, and how you arrived at our site.</li>
            </ul>

            <h2>2. How we use your information</h2>
            <ul>
              <li>Provide accurate quotes and schedule your cleans.</li>
              <li>Send confirmations, reminders, receipts, and follow-up messages.</li>
              <li>Improve our website, services, and team training.</li>
              <li>Respond to questions, feedback, or claims.</li>
              <li>Meet legal, tax, and insurance obligations.</li>
            </ul>
            <p>We do <strong>not</strong> sell your personal information. We do not share your information with advertisers for targeted marketing.</p>

            <h2>3. Third-party services we use</h2>
            <p>To run the business we rely on a small number of trusted vendors who process data on our behalf:</p>
            <ul>
              <li><strong>Google Analytics</strong> — site usage and traffic analysis.</li>
              <li><strong>Payment processor</strong> — secure card handling for service payments.</li>
              <li><strong>Email / SMS provider</strong> — booking confirmations and reminders.</li>
              <li><strong>Cloud hosting</strong> — storing booking records and website assets.</li>
            </ul>
            <p>These vendors are bound by their own privacy and security obligations and may only use your information to deliver the service we've asked them to provide.</p>

            <h2>4. Cookies and similar technology</h2>
            <p>Our site uses cookies and pixels for analytics and to remember your preferences (for example, your selected city). You can disable cookies in your browser, but some site features may not work correctly without them.</p>

            <h2>5. Your choices and rights</h2>
            <p>You can:</p>
            <ul>
              <li>Ask us what personal data we hold about you.</li>
              <li>Correct or update any inaccurate information.</li>
              <li>Ask us to delete your data (we may need to retain some records for tax, legal, or insurance reasons).</li>
              <li>Unsubscribe from marketing emails at any time using the link in the email footer. Service messages (booking confirmations, reminders, receipts) will continue while you are an active client.</li>
            </ul>
            <p>To make any of these requests, email <strong>info@spotless.homes</strong>. We'll respond within 30 days.</p>

            <h2>6. Data retention</h2>
            <p>We keep booking and customer records for as long as you are an active client and for a reasonable period afterward (typically up to 7 years) to meet tax, accounting, and insurance requirements. Marketing data is retained until you unsubscribe.</p>

            <h2>7. Security</h2>
            <p>We use industry-standard safeguards — HTTPS, access controls, encrypted backups, and limited employee access — to protect your information. No system is perfectly secure; please use a strong password for any account you create with us and let us know immediately if you suspect a problem.</p>

            <h2>8. Children's privacy</h2>
            <p>Our services are for adults. We do not knowingly collect information from children under 13. If you believe a child has provided us with personal information, contact us and we will delete it.</p>

            <h2>9. Florida residents</h2>
            <p>If you are a Florida resident, you may have additional rights under state law to access, correct, or delete your personal information. To exercise these rights, contact us at the email below.</p>

            <h2>10. Changes to this policy</h2>
            <p>We may update this Privacy Policy as our services or the law evolve. The "Effective" date at the top of this page reflects the most recent revision. Material changes will be highlighted on this page for 30 days.</p>

            <h2>11. Contact</h2>
            <p><strong>Spotless Homes · Privacy</strong><br/><a href="mailto:info@spotless.homes">info@spotless.homes</a><br/><a href="tel:+18139212100">813-921-2100</a><br/>Mon–Sat · 7am–7pm EST</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
