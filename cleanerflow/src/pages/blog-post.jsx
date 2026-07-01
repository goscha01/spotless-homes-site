import { Link, Navigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SiteShell from "@/components/SiteShell";
import SEO from "@/components/SEO";
import { getPostBySlug, getRelatedPosts, formatPostDate, readingMinutes } from "@/lib/blog";
import "./blog.css";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = getRelatedPosts(post.slug, 3);
  const minutes = readingMinutes(post.content);

  const description =
    post.description ||
    post.content.replace(/[#*_`>\[\]!()]/g, "").slice(0, 160).trim();
  const heroImage = post.heroImage
    ? post.heroImage.startsWith("http")
      ? post.heroImage
      : `https://www.spotless.homes${post.heroImage}`
    : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image: heroImage,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { "@type": "Person", name: post.author || "Spotless Homes" },
    publisher: {
      "@type": "Organization",
      name: "Spotless Homes",
      logo: { "@type": "ImageObject", url: "https://www.spotless.homes/logo/logo.png" },
    },
    mainEntityOfPage: `https://www.spotless.homes/blog/${post.slug}/`,
  };

  return (
    <SiteShell active="blog">
      <SEO
        title={`${post.title} | Spotless Homes`}
        description={description}
        ogType="article"
        ogImage={heroImage}
        jsonLd={articleJsonLd}
      />
      <article className={`post-page${post.heroImage ? "" : " no-hero"}`}>
        <section
          className="post-hero"
          style={post.heroImage ? { backgroundImage: `url(${post.heroImage})` } : undefined}
        >
          <div className="container">
            <nav className="crumbs">
              <Link to="/">Home</Link>
              <span className="sep">/</span>
              <Link to="/blog">Blog</Link>
              <span className="sep">/</span>
              <span className="here">{post.title}</span>
            </nav>
            <div style={{ marginTop: "auto" }}>
              <div className="post-meta">
                <span>{formatPostDate(post.date)}</span>
                <span className="dot">·</span>
                <span>{minutes} min read</span>
                {post.author && (
                  <>
                    <span className="dot">·</span>
                    <span>By {post.author}</span>
                  </>
                )}
              </div>
              <h1>{post.title}</h1>
            </div>
          </div>
        </section>

        <div className="post-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="post-actions">
          <Link to="/blog" className="back-link">← Back to all posts</Link>
          {post.updated && post.updated !== post.date && (
            <span className="meta-line">Updated {formatPostDate(post.updated)}</span>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="post-related">
          <div className="container">
            <div className="related-head">
              <span className="eyebrow"><span className="bar"></span>Keep reading<span className="bar"></span></span>
              <h2>More from <em>the Journal</em>.</h2>
            </div>
            <div className="blog-grid">
              {related.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="blog-card">
                  <div className="photo">
                    {p.heroImage && <img src={p.heroImage} alt={p.title} loading="lazy" />}
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
          </div>
        </section>
      )}
    </SiteShell>
  );
}
