import { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "emailjs-com";
import SiteShell from "@/components/SiteShell";
import SEO from "@/components/SEO";
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

const ENGLISH_OPTS    = ["Beginner", "Enough for communication", "Fluent", "Native"];
const HOURS_OPTS      = ["10–20", "20–30", "30–40", "40+"];
const EXPERIENCE_OPTS = ["None", "Some", "Professional"];
const SUPPLIES_OPTS   = ["Yes", "No", "Can get"];
const SOURCE_OPTS     = ["Indeed", "Facebook", "Telegram", "Craigslist", "Instagram", "Referral"];

export default function CareersApply() {
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

  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [sendError, setSendError]   = useState(null);

  const validate = () => {
    const e = {};
    if (!name.trim())       e.name = "Please enter your name.";
    if (!email.trim())      e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
    if (!phone.trim())      e.phone = "Please enter your phone number.";
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

    const message = buildMessage();
    const payload = {
      // Standard EmailJS fields most templates use
      name,
      from_name: name,
      user_name: name,
      email,
      user_email: email,
      reply_to: email,
      phone,
      // Application-specific fields (available to a dedicated careers template)
      address,
      english_level: english,
      hours_per_week: hours,
      occupation,
      cleaning_experience: experience,
      has_supplies: supplies,
      heard_from: source,
      reason,
      // Fallback fields so the existing booking template still renders something useful
      serviceType: "Employment Application",
      streetAddress: address || "(applicant)",
      message,
      admin_email: ADMIN_EMAIL,
      subject: `New job application — ${name}`,
    };

    if (!SERVICE_ID || !USER_ID || !ADMIN_TEMPLATE_ID) {
      console.warn("emailjs env vars not set — application data:", payload);
      setSendError(<>Email is not configured. Please call <a href="tel:+18139212100">813-921-2100</a> to apply.</>);
      setSubmitting(false);
      return;
    }

    try {
      await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, payload, USER_ID);
      if (ADMIN_CC) {
        try {
          await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, { ...payload, admin_email: ADMIN_CC }, USER_ID);
        } catch (_) { /* CC is best-effort */ }
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("emailjs send failed:", err);
      setSendError(<>Sorry — something went wrong sending your application. Please try again, or call <a href="tel:+18139212100">813-921-2100</a>.</>);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SiteShell>
        {APPLY_SEO}
        <section className="apply-page">
          <div className="container">
            <div className="apply-success">
              <div className="check">✓</div>
              <h2>Thanks, {name.split(" ")[0]} — <em>application received</em>.</h2>
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

  return (
    <SiteShell>
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
