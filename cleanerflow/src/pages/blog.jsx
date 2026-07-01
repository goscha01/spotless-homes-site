import { Link } from "react-router-dom";
import SiteShell from "@/components/SiteShell";
import SEO from "@/components/SEO";
import { getAllPosts, formatPostDate, readingMinutes } from "@/lib/blog";
import "./blog.css";

export default function Blog() {
  const posts = getAllPosts();

  return (
    <SiteShell active="blog">
      <SEO
        title="Cleaning Tips & Routines | The Spotless Journal"
        description="Discover expert cleaning tips, home maintenance advice, and field-tested routines from the Spotless Homes team — written for Florida homes."
      />
      <section className="blog-page">
        <div className="container">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Blog</span>
          </nav>

          <div className="blog-head">
            <span className="eyebrow"><span className="bar"></span>The Spotless Journal<span className="bar"></span></span>
            <h1>Cleaning tips, real-world <em>routines</em>.</h1>
            <p className="lead">Practical, time-saving advice from {posts.length > 0 ? `${posts.length} ` : ""}field-tested cleaning routines — written for Florida homes and the people who live in them.</p>
          </div>

          {posts.length === 0 ? (
            <div className="blog-empty">No posts yet — check back soon.</div>
          ) : (
            <div className="blog-grid">
              {posts.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="blog-card">
                  <div className="photo">
                    {p.heroImage ? (
                      <img src={p.heroImage} alt={p.title} loading="lazy" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "var(--g-100)" }} />
                    )}
                  </div>
                  <div className="body">
                    <div className="meta">
                      <span>{formatPostDate(p.date)}</span>
                      <span className="dot">·</span>
                      <span>{readingMinutes(p.content)} min read</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p className="excerpt">{p.description}</p>
                    <span className="read-more">Read article</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
