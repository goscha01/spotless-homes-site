// Blog post loader — reads every .md file under src/data/blog-posts/ at build time,
// parses simple frontmatter, returns posts sorted newest-first.

const modules = import.meta.glob("../data/blog-posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, content: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
    data[kv[1]] = value;
  }
  return { data, content: m[2] };
}

const ALL_POSTS = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    const filename = path.split("/").pop().replace(/\.md$/, "");
    return {
      slug: data.slug || filename.replace(/^\d{4}-\d{2}-\d{2}-/, ""),
      title: data.title || "",
      date: data.date || "",
      updated: data.updated || "",
      author: data.author || "Spotless Homes",
      description: data.description || "",
      heroImage: data.heroImage || "",
      wixOriginal: data.wixOriginal || "",
      content: content.replace(/^#\s+.+\n+/, ""), // strip the duplicated H1 — title is shown in the page chrome
    };
  })
  .filter((p) => p.title && p.slug)
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

export function getAllPosts() {
  return ALL_POSTS;
}

export function getPostBySlug(slug) {
  return ALL_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug, limit = 3) {
  const currentIdx = ALL_POSTS.findIndex((p) => p.slug === slug);
  if (currentIdx === -1) return ALL_POSTS.slice(0, limit);
  const others = ALL_POSTS.filter((p) => p.slug !== slug);
  // Prefer the next few chronologically adjacent posts so navigation feels coherent
  const start = Math.max(0, currentIdx - 1);
  return others.slice(start, start + limit);
}

export function formatPostDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Rough reading-time estimate: 220 wpm on text only
export function readingMinutes(content) {
  const words = content.replace(/[#*`>!\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
