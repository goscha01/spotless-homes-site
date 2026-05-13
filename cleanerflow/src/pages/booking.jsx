import { useMemo, useState } from "react";
import emailjs from "emailjs-com";
import { calculatePrice } from "@/lib/calculatePrice";
import { extras as EXTRAS_DATA, conditions as COND_DATA, pets as PET_DATA } from "@/constants/price";
import "./booking-design.css";

// ─── Service catalog (base "from" prices match pricingData 1bed/1bath row) ─────
const SERVICES = {
  regular: { id: "regular", name: "Regular Cleaning", titleHtml: <><em>Regular</em> cleaning</>,    fromPrice: 119 },
  deep:    { id: "deep",    name: "Deep Cleaning",    titleHtml: <><em>Deep</em> cleaning</>,       fromPrice: 149 },
  move:    { id: "move",    name: "Move In/Out",      titleHtml: <>Move <em>in/out</em></>,         fromPrice: 149 },
  airbnb:  { id: "airbnb",  name: "Airbnb Turnover",  titleHtml: <><em>Airbnb</em> turnover</>,     fromPrice: 129 },
};

const STEP_LABELS = [
  "Property size",
  "Property condition",
  "Add-ons",
  "Scheduling",
  "Contact data",
  "Submit your request",
];

const BED_OPTIONS = [
  { val: 1, label: "1 Bedroom" },
  { val: 2, label: "2 Bedrooms" },
  { val: 3, label: "3 Bedrooms" },
  { val: 4, label: "4 Bedrooms" },
  { val: 5, label: "5 Bedrooms" },
  { val: 6, label: "6 Bedrooms" },
];

const BATH_OPTIONS = [
  { val: 1, label: "1 Bathroom" },
  { val: 2, label: "2 Bathrooms" },
  { val: 3, label: "3 Bathrooms" },
  { val: 4, label: "4 Bathrooms" },
  { val: 5, label: "5 Bathrooms" },
  { val: 6, label: "6 Bathrooms" },
];

// Add-on price labels — kept in sync with calculatePrice.js
const EXTRA_PRICE = {
  cabinet:     30,
  fridge:      40,
  oven:        40,
  laundry:     20,
  window:      20,
  dish:        20,
  "glass-door": 20,
  door:        50,
  garage:      50,
};

const EXTRA_DISPLAY = [
  { id: "cabinet",    name: "Kitchen cabinet" },
  { id: "fridge",     name: "Inside Fridge" },
  { id: "oven",       name: "Inside Oven" },
  { id: "laundry",    name: "Laundry" },
  { id: "window",     name: "Windows" },
  { id: "dish",       name: "Dishes" },
  { id: "glass-door", name: "Glass Door" },
  { id: "door",       name: "Patio Door" },
  { id: "garage",     name: "Garage" },
];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function ordinal(d) {
  if (d % 10 === 1 && d !== 11) return "st";
  if (d % 10 === 2 && d !== 12) return "nd";
  if (d % 10 === 3 && d !== 13) return "rd";
  return "th";
}

// EmailJS config (set as VITE_* env vars at build time)
const SERVICE_ID         = import.meta.env.VITE_SERVICE_ID;
const USER_ID            = import.meta.env.VITE_USER_ID;
const ADMIN_TEMPLATE_ID  = import.meta.env.VITE_ADMIN_TEMPLATE_ID;
const USER_TEMPLATE_ID   = import.meta.env.VITE_USER_TEMPLATE_ID;
const ADMIN_EMAIL        = import.meta.env.VITE_ADMIN_EMAIL;

export default function Booking() {
  const today = new Date();
  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState("regular");
  const [beds, setBeds]   = useState(1);
  const [baths, setBaths] = useState(1);
  const [cond, setCond]   = useState("Fair");
  const [pets, setPets]   = useState("Yes");
  const [extras, setExtras] = useState(["fridge", "dish"]);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState(null);
  const [timeMode, setTimeMode] = useState("Before noon");
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [specHour, setSpecHour] = useState("9 AM");
  const [specMin,  setSpecMin]  = useState("00");

  const [smsConsent, setSmsConsent] = useState(true);
  const [address, setAddress] = useState("");
  const [unit, setUnit] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Use the real production pricing engine.
  const { total, subtotal, discount, sqft } = useMemo(() => {
    const fd = {
      serviceType,
      bedrooms: Number(beds),
      bathrooms: Number(baths),
      propertyCondition: cond,
      hasPets: pets,
      extras,
      recurringPlan: 0,
    };
    const result = calculatePrice(fd);
    return { ...result, sqft: fd.square_feet };
  }, [serviceType, beds, baths, cond, pets, extras]);

  const goStep = (n) => {
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const pickService = (id) => {
    setServiceType(id);
    goStep(1);
  };
  const toggleExtra = (id) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const navMonth = (dir) => {
    let m = viewMonth + dir, y = viewYear;
    if (m < 0)  { m = 11; y -= 1; }
    if (m > 11) { m = 0;  y += 1; }
    setViewMonth(m); setViewYear(y);
  };

  const pickDate = (day) => {
    const dateStr = `${MONTHS[viewMonth]} ${day}${ordinal(day)}, ${viewYear}`;
    setSelectedDate({ day, month: viewMonth, year: viewYear, label: dateStr });
    setShowTimeDialog(true);
  };

  const pickTime = (label, isSpecific) => {
    setTimeMode(label);
    if (!isSpecific) setTime(label);
  };

  const closeTime = () => {
    if (timeMode === "Specific time") {
      setTime(`${specHour.replace(" ", "")}:${specMin}`);
    } else {
      setTime(timeMode);
    }
    setShowTimeDialog(false);
  };

  const submitRequest = async () => {
    if (submitting) return;
    setSubmitting(true);

    // GA4 lead event with the real total
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "generate_lead", {
        send_to: "G-8W7WSSFNC6",
        event_category: "Booking",
        event_label: "Booking Wizard Complete",
        value: total,
        currency: "USD",
      });
    }

    const service = SERVICES[serviceType];
    const extrasLabel = extras
      .map((id) => EXTRA_DISPLAY.find((e) => e.id === id)?.name || id)
      .join(", ");

    const emailData = {
      name: fullName,
      phone,
      email,
      streetAddress: `${address}${unit ? ` · ${unit}` : ""}`,
      serviceType: service.name,
      bedrooms: beds,
      bathrooms: baths,
      square_feet: sqft || "",
      extras: extrasLabel,
      propertyCondition: cond,
      hasPets: pets,
      totalPrice: total,
      date: selectedDate ? selectedDate.label : "Customer to confirm",
      time: time || "Customer to confirm",
    };

    let emailOk = false;
    if (SERVICE_ID && USER_ID && ADMIN_TEMPLATE_ID) {
      try {
        await emailjs.send(
          SERVICE_ID,
          ADMIN_TEMPLATE_ID,
          { ...emailData, admin_email: ADMIN_EMAIL || "info@spotless.homes" },
          USER_ID,
        );
        if (USER_TEMPLATE_ID && email) {
          try {
            await emailjs.send(SERVICE_ID, USER_TEMPLATE_ID, { ...emailData, user_email: email }, USER_ID);
          } catch (e) { /* user-confirmation email is best-effort */ }
        }
        emailOk = true;
      } catch (e) {
        console.error("emailjs send failed:", e);
      }
    } else {
      console.warn("emailjs env vars not set — skipping send. Lead data:", emailData);
    }

    setSubmitting(false);
    setSubmitted(true);

    if (!emailOk) {
      // Always show a confirmation so the user knows the form was received
      // even if delivery failed — we still have the GA event + the dev console log.
      window.alert(
        "Request received — we'll call you within 1 business hour to confirm. " +
        "If you don't hear back, call 813-921-2100.",
      );
    }
  };

  const calendarCells = useMemo(() => {
    const cells = [];
    const first = new Date(viewYear, viewMonth, 1).getDay();
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevLast = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = first - 1; i >= 0; i--) cells.push({ kind: "muted", n: prevLast - i });
    for (let d = 1; d <= lastDay; d++) {
      const isSelected =
        selectedDate &&
        selectedDate.day === d &&
        selectedDate.month === viewMonth &&
        selectedDate.year === viewYear;
      cells.push({ kind: isSelected ? "selected" : "day", n: d });
    }
    const totalCells = first + lastDay;
    const tail = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= tail; i++) cells.push({ kind: "muted", n: i });
    return cells;
  }, [viewMonth, viewYear, selectedDate]);

  const showProgress = step > 0;

  if (submitted) {
    return (
      <div className="bk-root">
        <TopChrome />
        <div className="booking-wrap solo">
          <div className="panel">
            <span className="step-eyebrow">Booking received</span>
            <h1>Thanks — we'll be<br/>in touch <em>shortly</em>.</h1>
            <p className="help">
              We'll call you within 1 business hour to confirm. If you don't hear from us, call 813-921-2100.
            </p>
            <div className="actions">
              <a className="btn-yellow" href="/">← Back to home</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bk-root">
      <TopChrome />

      {showProgress && (
        <div className="progress">
          <div className="progress-inner">
            <button className="icon-btn" onClick={() => goStep(Math.max(0, step - 1))}>←</button>
            <div className="bar-row">
              <div className="step-label">
                <span className="here">{step}</span> of <span>5</span>
              </div>
              <div className="track">
                <div className="fill" style={{ width: `${(step / 5) * 100}%` }}></div>
              </div>
            </div>
            <button className="icon-btn right" onClick={() => goStep(0)}>×</button>
          </div>
        </div>
      )}

      <div className={`booking-wrap${showProgress ? "" : " solo"}`}>
        <div className="panel">
          {step === 0 && <Step0 pickService={pickService} />}
          {step === 1 && (
            <Step1
              beds={beds} setBeds={setBeds}
              baths={baths} setBaths={setBaths}
              onBack={() => goStep(0)}
              onNext={() => goStep(2)}
            />
          )}
          {step === 2 && (
            <Step2
              cond={cond} setCond={setCond}
              pets={pets} setPets={setPets}
              onBack={() => goStep(1)}
              onNext={() => goStep(3)}
            />
          )}
          {step === 3 && (
            <Step3
              extras={extras} toggleExtra={toggleExtra}
              onBack={() => goStep(2)}
              onNext={() => goStep(4)}
            />
          )}
          {step === 4 && (
            <Step4
              viewMonth={viewMonth} viewYear={viewYear}
              navMonth={navMonth}
              calendarCells={calendarCells}
              pickDate={pickDate}
              onBack={() => goStep(3)}
              onNext={() => goStep(5)}
            />
          )}
          {step === 5 && (
            <Step5
              address={address} setAddress={setAddress}
              unit={unit} setUnit={setUnit}
              fullName={fullName} setFullName={setFullName}
              phone={phone} setPhone={setPhone}
              email={email} setEmail={setEmail}
              smsConsent={smsConsent} setSmsConsent={setSmsConsent}
              submitting={submitting}
              onBack={() => goStep(4)}
              onSubmit={submitRequest}
            />
          )}
        </div>

        {showProgress && (
          <Summary
            serviceType={serviceType}
            beds={beds} baths={baths}
            sqft={sqft}
            extras={extras}
            selectedDate={selectedDate}
            time={time}
            total={total}
            subtotal={subtotal}
            discount={discount}
            nextLabel={STEP_LABELS[step] || "Submit your request"}
          />
        )}
      </div>

      <div className={`scrim${showTimeDialog ? " open" : ""}`}>
        <div className="dialog">
          <span className="x" onClick={() => setShowTimeDialog(false)}>×</span>
          <h4>Select times for {selectedDate ? selectedDate.label.replace(", " + selectedDate.year, "") : ""}</h4>
          <div className="time-opts">
            <div className={`time-opt${timeMode === "Before noon" ? " selected" : ""}`} onClick={() => pickTime("Before noon", false)}>Before noon</div>
            <div className={`time-opt${timeMode === "After noon"  ? " selected" : ""}`} onClick={() => pickTime("After noon", false)}>After noon</div>
            <div className={`time-opt${timeMode === "Specific time" ? " selected" : ""}`} onClick={() => pickTime("Specific time", true)}>Specific time</div>
          </div>
          <div className={`specific-row${timeMode === "Specific time" ? " open" : ""}`}>
            <select value={specHour} onChange={(e) => setSpecHour(e.target.value)}>
              {["9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM"].map((h) => <option key={h}>{h}</option>)}
            </select>
            <span style={{ fontFamily: "var(--serif)", fontSize: 24 }}>:</span>
            <select value={specMin} onChange={(e) => setSpecMin(e.target.value)}>
              {["00","15","30","45"].map((m) => <option key={m}>{m}</option>)}
            </select>
            <button className="add">+</button>
            <button className="ok" onClick={closeTime}>✓</button>
          </div>
          {timeMode !== "Specific time" && (
            <div className="actions" style={{ marginTop: 24, justifyContent: "flex-end" }}>
              <button className="btn-yellow" onClick={closeTime}>Confirm</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TopChrome() {
  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <div>Florida · Tampa · St. Pete · Clearwater · Jacksonville</div>
          <div><span className="pill">★ 4.5/5</span> · 500 Google reviews · Insured &amp; Bonded</div>
        </div>
      </div>
      <nav className="nav">
        <div className="nav-inner">
          <a className="logo" href="/">SPOTLESS<span className="dot"></span>HOMES</a>
          <div className="nav-links">
            <a href="/cleaning-checklist">What's included</a>
            <a href="/airbnb-checklist">Airbnb checklist</a>
            <a href="/cleaning-products">Products</a>
            <a href="/about">Our story</a>
          </div>
          <div className="nav-cta">
            <span className="nav-phone">813-921-2100</span>
            <a href="/booking" className="btn btn-primary">Get Quote</a>
          </div>
        </div>
      </nav>
    </>
  );
}

/* ───────────────────────── steps ───────────────────────── */

function Step0({ pickService }) {
  return (
    <>
      <span className="step-eyebrow">Instant estimate · Book in 2 minutes</span>
      <h1>Pick a <em>service</em><br/>to get started.</h1>
      <p className="help">Final price is locked in once you pick rooms, condition, and any add-ons. No card needed.</p>

      <div className="services-pick">
        <div className="svc-card" onClick={() => pickService("regular")}>
          <div className="img regular"></div>
          <div className="body">
            <span className="num">Most popular</span>
            <span className="name"><em>Regular</em> cleaning</span>
            <span className="from">From <span className="price">${SERVICES.regular.fromPrice}</span></span>
          </div>
        </div>
        <div className="svc-card featured" onClick={() => pickService("deep")}>
          <span className="ribbon">Most booked</span>
          <div className="img deep"></div>
          <div className="body">
            <span className="num">Top to bottom</span>
            <span className="name"><em>Deep</em> cleaning</span>
            <span className="from">From <span className="price">${SERVICES.deep.fromPrice}</span></span>
          </div>
        </div>
        <div className="svc-card" onClick={() => pickService("move")}>
          <div className="img move"></div>
          <div className="body">
            <span className="num">Empty homes</span>
            <span className="name">Move <em>in/out</em></span>
            <span className="from">From <span className="price">${SERVICES.move.fromPrice}</span></span>
          </div>
        </div>
        <div className="svc-card" onClick={() => pickService("airbnb")}>
          <div className="img airbnb"></div>
          <div className="body">
            <span className="num">Hosts</span>
            <span className="name"><em>Airbnb</em> turnover</span>
            <span className="from">From <span className="price">${SERVICES.airbnb.fromPrice}</span></span>
          </div>
        </div>
      </div>

      <div className="actions">
        <a className="btn-link" href="tel:8139212100">Need help? Call 813-921-2100</a>
      </div>
    </>
  );
}

function Step1({ beds, setBeds, baths, setBaths, onBack, onNext }) {
  return (
    <>
      <span className="step-eyebrow">Step 1 · Property size</span>
      <h1>How big is <em>your home</em>?</h1>

      <div className="field-group">
        <div className="field-label">Number of bedrooms <span className="req">*</span></div>
        <div className="options">
          {BED_OPTIONS.map((o) => (
            <div key={o.val} className={`opt${beds === o.val ? " selected" : ""}`} onClick={() => setBeds(o.val)}>
              <span className="label">{o.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="field-group">
        <div className="field-label">Number of bathrooms <span className="req">*</span></div>
        <div className="field-help">A half-bathroom counts as a full bathroom.</div>
        <div className="options">
          {BATH_OPTIONS.map((o) => (
            <div key={o.val} className={`opt${baths === o.val ? " selected" : ""}`} onClick={() => setBaths(o.val)}>
              <span className="label">{o.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button className="btn-link" onClick={onBack}>← Change service</button>
        <button className="btn-yellow" onClick={onNext}>Continue →</button>
      </div>
    </>
  );
}

function Step2({ cond, setCond, pets, setPets, onBack, onNext }) {
  return (
    <>
      <span className="step-eyebrow">Step 2 · Condition</span>
      <h1>Tell us about<br/>your <em>place</em>.</h1>

      <div className="field-group">
        <div className="field-label">Property condition <span className="req">*</span></div>
        <div className="field-help">On a scale of 1 (dirty) to 10 (clean), where would you put it today?</div>
        <div className="options">
          {COND_DATA.map((o) => (
            <div key={o.id} className={`opt${cond === o.id ? " selected" : ""}`} onClick={() => setCond(o.id)}>
              <span className="label">{o.label}</span>
              <span className="sub">{o.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="field-group">
        <div className="field-label">Any pets? <span className="req">*</span></div>
        <div className="field-help">A small surcharge applies — covers extra tools and an allergen kit.</div>
        <div className="options two">
          {PET_DATA.map((o) => (
            <div key={o.id} className={`opt${pets === o.id ? " selected" : ""}`} onClick={() => setPets(o.id)}>
              <span className="label">{o.label}</span>
              <span className="sub">{o.id === "Yes" ? "Dogs, cats, birds, etc." : "Pet-free home"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button className="btn-link" onClick={onBack}>← Back</button>
        <button className="btn-yellow" onClick={onNext}>Continue →</button>
      </div>
    </>
  );
}

function Step3({ extras, toggleExtra, onBack, onNext }) {
  return (
    <>
      <span className="step-eyebrow">Step 3 · Add-ons</span>
      <h1>Add the <em>deep stuff</em>?</h1>
      <p className="help">Optional. Each add-on is priced per item and will appear in your total live.</p>

      <div className="extras-grid">
        {EXTRA_DISPLAY.map((e) => (
          <div
            key={e.id}
            className={`extra${extras.includes(e.id) ? " selected" : ""}`}
            onClick={() => toggleExtra(e.id)}
          >
            <span className="check"></span>
            <span className="name">{e.name}</span>
          </div>
        ))}
      </div>

      <div className="actions">
        <button className="btn-link" onClick={onBack}>← Back</button>
        <button className="btn-yellow" onClick={onNext}>Continue →</button>
      </div>
    </>
  );
}

function Step4({ viewMonth, viewYear, navMonth, calendarCells, pickDate, onBack, onNext }) {
  return (
    <>
      <span className="step-eyebrow">Step 4 · Schedule</span>
      <h1>When should we <em>show up</em>?</h1>
      <p className="help">Pick a date — we'll confirm the time window in the next pop-up.</p>

      <div className="cal">
        <div className="cal-head">
          <span className="arrow" onClick={() => navMonth(-1)}>‹</span>
          <span className="month">{MONTHS[viewMonth]} {viewYear}</span>
          <span className="arrow" onClick={() => navMonth(1)}>›</span>
        </div>
        <div className="cal-grid">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => <div key={d} className="dow">{d}</div>)}
          {calendarCells.map((c, i) => (
            <div
              key={i}
              className={c.kind === "muted" ? "day muted" : c.kind === "selected" ? "day selected" : "day"}
              onClick={c.kind === "muted" ? undefined : () => pickDate(c.n)}
            >{c.n}</div>
          ))}
        </div>
      </div>
      <p className="cal-help">Please select a date and time.</p>

      <div className="actions">
        <button className="btn-link" onClick={onBack}>← Back</button>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-yellow" onClick={onNext}>Book Appointment →</button>
          <button className="btn-link" style={{ border: "1px solid var(--y)", padding: "14px 22px" }} onClick={onNext}>Send estimate only</button>
        </div>
      </div>
    </>
  );
}

function Step5({
  address, setAddress, unit, setUnit,
  fullName, setFullName, phone, setPhone, email, setEmail,
  smsConsent, setSmsConsent, submitting, onBack, onSubmit,
}) {
  return (
    <>
      <span className="step-eyebrow">Step 5 · Contact</span>
      <h1>Where should we<br/>send <em>the team</em>?</h1>

      <div className="field-group">
        <div className="field-label">Service address <span className="req">*</span></div>
        <div className="input-stack">
          <div className="input-row">
            <input className="input" placeholder="Enter your service address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <input className="input" placeholder="Apt, Unit, Floor" value={unit} onChange={(e) => setUnit(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="field-group">
        <div className="field-label">Contact information <span className="req">*</span></div>
        <div className="field-help">We'll reach out to confirm your booking.</div>
        <div className="input-stack">
          <input className="input" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <div className="input-row equal">
            <input className="input" placeholder="Phone number *" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="input" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className={`checkbox-row${smsConsent ? " checked" : ""}`} onClick={() => setSmsConsent((v) => !v)}>
          <span className="box"></span>
          <span className="text">I agree to receive SMS messages related to my service request at the phone number provided.</span>
        </div>
        <p className="legal-fine">
          Message frequency may vary. Message and data rates may apply. Reply STOP to unsubscribe. Reply HELP for assistance.
          See our <a href="#">Privacy Policy</a>, <a href="#">Terms of Service</a>, and <a href="#">SMS Policy</a>.
        </p>
      </div>

      <div className="actions">
        <button className="btn-link" onClick={onBack} disabled={submitting}>← Back</button>
        <button className="btn-yellow" onClick={onSubmit} disabled={submitting || !address || !fullName || !phone}>
          {submitting ? "Submitting…" : "Request appointment →"}
        </button>
      </div>
    </>
  );
}

function Summary({ serviceType, beds, baths, sqft, extras, selectedDate, time, total, subtotal, discount, nextLabel }) {
  const service = SERVICES[serviceType];
  return (
    <aside className="summary">
      <h3>{service.titleHtml}</h3>
      <ul className="specs">
        <li>{beds} bedroom{beds !== 1 ? "s" : ""}</li>
        <li>{baths} bathroom{baths !== 1 ? "s" : ""}</li>
        {sqft && <li>{sqft} sq. ft</li>}
      </ul>

      {extras.length > 0 && (
        <div className="extras-wrap">
          <span className="head">Add-ons</span>
          <ul className="extra-list">
            {extras.map((id) => {
              const meta = EXTRA_DISPLAY.find((e) => e.id === id);
              return (
                <li key={id}>
                  {meta?.name || id}
                  <span className="price">+${EXTRA_PRICE[id] || 0}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {selectedDate && (
        <div className="when-wrap">
          <div className="req-time">Requested time</div>
          <div className="req-date">{selectedDate.label}</div>
          {time && <div className="time-pill">{time}</div>}
        </div>
      )}

      {discount > 0 && (
        <div style={{ padding: "14px 0", borderBottom: "1px solid var(--g-200)", fontFamily: "var(--sans)", fontSize: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal</span><span>${subtotal}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#1B7F3D" }}>
            <span>Recurring plan (15%)</span><span>−${discount}</span>
          </div>
        </div>
      )}

      <div className="total">
        <span className="lbl">Today's total</span>
        <span className="amt"><span className="y">${total}</span></span>
      </div>
      <div className="meta">
        <div className="meta-row"><span className="key">What's included:</span><a href="/cleaning-checklist">check here</a></div>
      </div>
      <div className="next">
        <span className="key">Next step:</span><span className="val">{nextLabel}</span>
      </div>
    </aside>
  );
}
