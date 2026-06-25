import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import "./about.css";

export default function About() {
  return (
    <SiteShell active="about">
      <section className="story-hero">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Our story</span>
          </nav>
          <div className="grid">
            <div className="photo"></div>
            <div className="yellow-card">
              <span className="num">Chapter 01 · The beginning</span>
              <h1>Frustration<br/>to <em>Clean Homes</em>.</h1>
              <p>I was a working professional with a busy daily schedule of work, meetings, deadlines, and bringing up children — all while trying to have a tidy and inviting home. Pets tore around the house, and there seemed to be a never-ending list of chores, so I found myself spending weekends vacuuming and cleaning instead of sleeping in or catching up on work.</p>
            </div>
          </div>
          <div style={{ height: 60 }} />
        </div>
      </section>

      <section className="chapter">
        <div className="container">
          <div className="grid">
            <div>
              <div className="num-big">02</div>
              <span className="label">Our story</span>
              <h2>The breaking <em>point</em>.</h2>
            </div>
            <div>
              <p>Each time I took a broom or mop, one thing went through my mind: "I could be spending this time more constructively — building my company, spending time with my family, or just getting ready for bed."</p>
              <p>But every cleaning company I employed left me underwhelmed. Some wouldn't show up on time. Others cut corners. Too many times, a new cleaner would arrive with no history, asking the same basic questions over and over again — disrupting my workflow and my confidence.</p>
              <div className="pull">"It was then that I decided I had had enough and started building."</div>
            </div>
          </div>
        </div>
      </section>

      <section className="chapter">
        <div className="container">
          <div className="grid">
            <div>
              <div className="num-big">03</div>
              <span className="label">The birth</span>
              <h2>The birth of <em>Spotless Homes</em>.</h2>
            </div>
            <div>
              <p>I began Spotless Homes to offer what other companies lacked — a local cleaning company that combined professionalism, dependability, and a client-focused philosophy. I envisioned more than another cleaning service — I envisioned a go-to home cleaning solution for busy professionals like me. A company that understands how much it can mean to have reliable, high-end home cleaning become a part of your routine.</p>
              <p>To protect our clients and team, we also carry full cleaning business insurance, providing peace of mind and demonstrating our commitment to safety and professionalism.</p>
              <p>From day one, our goal was simple: provide excellent service with ease. We help clients gain back their time while maintaining a clean, neat, and welcoming environment. You may be a telecommuter with a full workload or a parent with a thousand things to do; we've structured Spotless Homes to accommodate your life — not interrupt it.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pillars">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow" style={{ color: "var(--y)" }}><span className="bar"></span>Chapter 04</span>
              <h2>What sets us <em>apart</em>.</h2>
            </div>
            <div className="sub">Five things we built into Spotless from day one — because they were the things every other cleaner skipped.</div>
          </div>
          <div className="pillar-grid">
            <Pillar n="i."   h="Reliable residential cleaning" p="We specialize in regular and one-time occasion cleanings to suit your requirements and schedule." />
            <Pillar n="ii."  h="Professional & friendly staff" p="Our goal is to have the same highly trained, thoughtful home cleaners come back again for familiarity and reassurance." />
            <Pillar n="iii." h="Quick, friendly client support" p="We reply fast and easy, with respect for your time and convenience." />
            <Pillar n="iv."  h="Customized solutions"          p="No house is alike. That's why we offer customized solutions that go beyond cookie-cutter cleaning." />
            <Pillar n="v."   h="Respecting your time & space"  p="We show up on time, ready to clean efficiently with minimal intrusion." />
          </div>
        </div>
      </section>

      <section className="guarantee">
        <div className="container">
          <div className="grid">
            <div>
              <div className="num-big" style={{ color: "var(--k)" }}>05</div>
              <span className="label" style={{ color: "var(--k)" }}>Our guarantee</span>
              <h2>From Tampa to <em>Jacksonville</em>.</h2>
            </div>
            <div>
              <p>From Tampa to Jacksonville to St. Petersburg and Clearwater, Spotless Homes will be your trusted local cleaning company. We're here to make your home shine, so you can concentrate on what matters most — family time, career advancement, or just enjoying a clean environment.</p>
              <p>As a company committed to professionalism, we're proud to carry business insurance for cleaning company, so clients know they're protected from start to finish. Whether it's your first clean or a recurring service, we believe in delivering a stress-free experience backed by full business insurance for cleaning business coverage.</p>
              <div className="promise">Our <em>"We Clean, You Relax"</em> isn't a motto — it's a promise. Every sweep, every scrub, every sparkle brings you closer to a simpler, better life.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="ctaband ctaband-dark">
        <div className="container">
          <div className="row">
            <h2 style={{ color: "var(--w)" }}>Ready to <em style={{ color: "var(--y)" }}>relax</em>?</h2>
            <div className="ctaband-actions">
              <Link to="/booking" className="btn btn-primary btn-lg">Book online →</Link>
              <a className="phone" href="tel:+18139212100" style={{ color: "var(--y)" }}>813-921-2100</a>
              <div className="small" style={{ color: "rgba(255,255,255,.6)" }}>Mon–Sat · 7am–7pm EST</div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Pillar({ n, h, p }) {
  return (
    <div className="pillar">
      <div className="n">{n}</div>
      <h3>{h}</h3>
      <p>{p}</p>
    </div>
  );
}
