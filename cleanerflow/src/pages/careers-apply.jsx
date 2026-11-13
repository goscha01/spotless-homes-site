import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import SiteShell from "@/components/SiteShell";
import SEO from "@/components/SEO";
import NextdoorPixel from "@/NextdoorPixel";
import { LOCATIONS } from "@/data/locations";
import { validateEmail, validatePhone } from "@/lib/contact-validation";
import { trackCareersLead } from "@/lib/track";
import "./careers-apply.css";

const APPLY_SEO = (
  <SEO
    title="Job Application Form | Spotless Homes Careers"
    description="Apply to join Spotless Homes as a residential cleaner. Quick application — share your experience, availability, and English level, and we'll be in touch."
    noindex
  />
);

const SERVICE_ID         = import.meta.env.VITE_SERVICE_ID;
const USER_ID            = import.meta.env.VITE_USER_ID;
const ADMIN_TEMPLATE_ID  = import.meta.env.VITE_CAREERS_TEMPLATE_ID || import.meta.env.VITE_ADMIN_TEMPLATE_ID;
const ADMIN_EMAIL        = import.meta.env.VITE_ADMIN_EMAIL || "info@spotless.homes";
const ADMIN_CC           = import.meta.env.VITE_ADMIN_CC;

const HIRINGFLOW_SLUG = 'RvM3ERjKWr';
const HIRINGFLOW_ENDPOINT = 'https://www.hirefunnel.app/api/public/sessions';

const ENGLISH_OPTS    = ["Beginner", "Enough for communication", "Fluent", "Native"];
const HOURS_OPTS      = ["10–20", "20–30", "30–40", "40+"];
const EXPERIENCE_OPTS = ["None", "Some", "Professional"];
const SUPPLIES_OPTS   = ["Yes", "No", "Can get"];
const SOURCE_OPTS     = ["Indeed", "Facebook", "Nextdoor", "Telegram", "Craigslist", "Instagram", "Referral"];

// Areas where Spotless Homes hires — pulled from the site's service-area
// catalog (data/locations.js) so this list stays in sync with /locations/*.
// Miami is appended because we're launching hiring there before the
// customer-facing /locations/miami page exists.
const AREAS_OPTS = [
  ...Object.values(LOCATIONS).map((l) => l.name),
  "Miami",
  "Other / Not in this list",
];

export default function CareersApply() {
  const navigate = useNavigate();
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [address, setAddress]       = useState("");
  const [english, setEnglish]       = useState("");
  const [hours, setHours]           = useState("");
  const [occupation, setOccupation] = useState("");
  const [experience, setExperience] = useState("");
  const [reason, setReason]         = useState("");
  const [supplies, setSupplies]     = useState("");
  const [source, setSource]         = useState("");
  const [area, setArea]             = useState("");

  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError]   = useState(null);

  const validate = () => {
    const e = {};
    if (!name.trim())       e.name = "Please enter your name.";
    // Email + phone use shared validators that mirror HireFunnel's
    // server-side guard (TLD typo detection, strict E.164 normalization)
    // so anything that passes here won't be rejected downstream as
    // skipped_bad_contact.
    const emailCheck = validateEmail(email);
    if (!emailCheck.ok) e.email = emailCheck.error;
    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.ok) e.phone = phoneCheck.error;
    if (!area)              e.area = "Please choose the area you're applying for.";
    if (!english)           e.english = "Please choose an option.";
    if (!hours)             e.hours = "Please choose an option.";
    if (!occupation.trim()) e.occupation = "Please enter your current occupation.";
    if (!experience)        e.experience = "Please choose an option.";
    if (!reason.trim())     e.reason = "Please tell us why you're looking for a job.";
    if (!supplies)          e.supplies = "Please choose an option.";
    return e;
  };

  const buildMessage = () => `EMPLOYMENT APPLICATION

Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address || "(not provided)"}
Area applying for: ${area}

English level: ${english}
Desired hours per week: ${hours}
Current occupation: ${occupation}
Cleaning experience: ${experience}
Own vacuum & basic supplies: ${supplies}
Heard about the job via: ${source || "(not provided)"}

Why looking for a job:
${reason}`;

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (submitting) return;
    setSendError(null);

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const first = document.querySelector(`[data-field="${Object.keys(e)[0]}"]`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);

    // Lock in the normalized canonical forms so downstream (emailjs,
    // HireFunnel public API) all get the same canonical email (lowercased)
    // and E.164 phone — matches what HF's server guard would canonicalize to.
    const normalizedEmail = validateEmail(email).value || email.trim();
    const normalizedPhone = validatePhone(phone).value || phone.trim();

    const message = buildMessage();
    // Same template renders both the admin notification and the applicant
    // confirmation via {{#is_admin}} / {{#is_customer}} conditionals so the
    // free-tier 2-template cap covers both audiences with one template.
    const applicantData = {
      name,
      email: normalizedEmail,
      phone: normalizedPhone,
      address,
      area,
      english_level: english,
      hours_per_week: hours,
      occupation,
      cleaning_experience: experience,
      has_supplies: supplies,
      heard_from: source,
      reason,
      message,
    };
    const adminPayload = {
      ...applicantData,
      to_email: ADMIN_EMAIL,
      reply_to: normalizedEmail,
      email_subject: `New job application — ${name}`,
      is_admin: "1",
      is_customer: "",
    };
    const applicantPayload = {
      ...applicantData,
      to_email: normalizedEmail,
      reply_to: ADMIN_EMAIL,
      email_subject: `We received your application, ${name} — Spotless Homes`,
      is_admin: "",
      is_customer: "1",
    };

    if (!SERVICE_ID || !USER_ID || !ADMIN_TEMPLATE_ID) {
      console.warn("emailjs env vars not set — application data:", adminPayload);
      setSendError(<>Email is not configured. Please call <a href="tel:+18139212100">813-921-2100</a> to apply.</>);
      setSubmitting(false);
      return;
    }

    try {
      await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, adminPayload, USER_ID);
      if (ADMIN_CC) {
        try {
          await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, { ...adminPayload, to_email: ADMIN_CC }, USER_ID);
        } catch (_) { /* CC is best-effort */ }
      }
      if (normalizedEmail) {
        try {
          await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, applicantPayload, USER_ID);
        } catch (_) { /* applicant confirmation is best-effort */ }
      }
      // Fire-and-forget mirror to HireFunnel ATS so the application also appears on the hiring pipeline.
      fetch(HIRINGFLOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowSlug: HIRINGFLOW_SLUG,
          candidateName: name,
          candidateEmail: normalizedEmail,
          candidatePhone: normalizedPhone,
          source: "spotless-site",
          completed: true,
          formData: {
            "Address": address,
            "Area applying for": area,
            "English level": english,
            "Hours per week": hours,
            "Current occupation": occupation,
            "Cleaning experience": experience,
            "Own vacuum & supplies": supplies,
            "Heard about job via": source,
            "Why looking for a job": reason,
          },
        }),
      }).catch((err) => console.warn("hiringflow mirror failed:", err));
      // Meta `SubmitApplication` standard event (distinct from booking's
      // `Lead` so hiring and booking campaigns optimize independently in
      // Meta Ads Manager) + GA4 `careers_lead` event. email/phone are
      // hashed locally by trackCareersLead for Advanced Matching; the
      // returned eventID lets a future CAPI server event dedupe.
      trackCareersLead({ email: normalizedEmail, phone: normalizedPhone });
      navigate("/careers/apply/thank-you", { state: { name } });
    } catch (err) {
      console.error("emailjs send failed:", err);
      setSendError(<>Sorry — something went wrong sending your application. Please try again, or call <a href="tel:+18139212100">813-921-2100</a>.</>);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteShell>
      <NextdoorPixel />
      {APPLY_SEO}
      <section className="apply-page">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <Link to="/careers">Careers</Link>
            <span className="sep">/</span>
            <span className="here">Apply</span>
          </nav>
          <div className="apply-head">
            <span className="eyebrow"><span className="bar"></span>Apply to join the team</span>
            <h1>Employment <em>Application</em>.</h1>
            <p className="sub">Tell us a little about yourself. The form takes about two minutes, and a real person reads every submission.</p>
          </div>

          <form className="apply-form" onSubmit={handleSubmit} noValidate>
            {sendError && <div className="global-err">{sendError}</div>}

            <div className="field-row">
              <div className="field" data-field="name">
                <label className="lbl">Enter your name <span className="req">*</span></label>
                <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                {errors.name && <div className="err">{errors.name}</div>}
              </div>
              <div className="field" data-field="email">
                <label className="lbl">Enter your email <span className="req">*</span></label>
                <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                {errors.email && <div className="err">{errors.email}</div>}
              </div>
            </div>

            <div className="field-row">
              <div className="field" data-field="phone">
                <label className="lbl">Phone number <span className="req">*</span></label>
                <input type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 555-5555" />
                {errors.phone && <div className="err">{errors.phone}</div>}
              </div>
              <div className="field">
                <label className="lbl">Address</label>
                <input type="text" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, ZIP" />
              </div>
            </div>

            <OptionGroup
              field="area" label="Which area are you applying for?" required
              options={AREAS_OPTS} value={area} onChange={setArea} error={errors.area}
            />

            <OptionGroup
              field="english" label="Do you speak English?" required
              options={ENGLISH_OPTS} value={english} onChange={setEnglish} error={errors.english}
            />

            <OptionGroup
              field="hours" label="Desired working hours per week?" required
              options={HOURS_OPTS} value={hours} onChange={setHours} error={errors.hours}
            />

            <div className="field" data-field="occupation">
              <label className="lbl">What is your current occupation? <span className="req">*</span></label>
              <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. Server, student, stay-at-home parent" />
              {errors.occupation && <div className="err">{errors.occupation}</div>}
            </div>

            <OptionGroup
              field="experience" label="Cleaning experience" required
              options={EXPERIENCE_OPTS} value={experience} onChange={setExperience} error={errors.experience}
            />

            <div className="field" data-field="reason">
              <label className="lbl">Why are you looking for a job? <span className="req">*</span></label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="A sentence or two is fine." />
              {errors.reason && <div className="err">{errors.reason}</div>}
            </div>

            <OptionGroup
              field="supplies" label="Do you have your own vacuum & basic supplies?" required
              options={SUPPLIES_OPTS} value={supplies} onChange={setSupplies} error={errors.supplies}
            />

            <OptionGroup
              field="source" label="How did you hear about the job?"
              options={SOURCE_OPTS} value={source} onChange={setSource}
            />

            <div className="actions">
              <button type="submit" className="btn btn-dark btn-lg" disabled={submitting}>
                {submitting ? "Sending…" : "Submit application →"}
              </button>
              <span className="note">We'll be in touch within 1–2 business days.</span>
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}

function OptionGroup({ field, label, options, value, onChange, required, error }) {
  return (
    <div className="field" data-field={field}>
      <label className="lbl">{label} {required && <span className="req">*</span>}</label>
      <div className="options" role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <label key={opt} className={`opt${selected ? " selected" : ""}`}>
              <input
                type="radio"
                name={field}
                value={opt}
                checked={selected}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          );
        })}
      </div>
      {error && <div className="err">{error}</div>}
    </div>
  );
}
