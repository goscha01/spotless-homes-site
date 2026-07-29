// Sync AI-generated blog posts from the post-to S3 bucket into
// src/data/blog-posts/ so Vite's `import.meta.glob` picks them up at build.
//
// Runs as part of `npm run prebuild`. Also usable ad-hoc: `npm run sync:posts`
// (useful when you want to preview a newly-published article in `npm run dev`
// without going through a full build).
//
// Auth: uses the AWS CLI in-shell, so credentials come from whichever profile
// the environment provides (env vars, ~/.aws/credentials, or an EC2/CI role).
// The IAM user for this bucket is scoped read-only against
// post-to-blog-spotless-homes only — safe to keep locally.
//
// Idempotent: `aws s3 sync` only downloads new/changed files. Skips gracefully
// if AWS CLI is unavailable or the bucket is unreachable, so an offline dev
// can still build the site.

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUCKET = process.env.POST_TO_BLOG_BUCKET || 'post-to-blog-spotless-homes';
const REGION = process.env.POST_TO_BLOG_REGION || 'us-east-2';
const POSTS_PREFIX = process.env.POST_TO_BLOG_PREFIX || 'posts/';
// Hero images published from post-to land under this prefix. Sync into
// public/ so Vite bundles them into dist/ and serves them from the site
// root at /assets/blog/… — matches how Spotless's existing hero images
// (committed in git) are referenced.
const ASSETS_PREFIX = 'assets/';
const LOCAL_POSTS = join(__dirname, '..', 'src', 'data', 'blog-posts');
const LOCAL_ASSETS = join(__dirname, '..', 'public', 'assets');

if (!existsSync(LOCAL_POSTS)) mkdirSync(LOCAL_POSTS, { recursive: true });
if (!existsSync(LOCAL_ASSETS)) mkdirSync(LOCAL_ASSETS, { recursive: true });

// Skip in CI environments that explicitly opt out (useful for PR builds that
// shouldn't pull latest content mid-review).
if (process.env.SKIP_POST_SYNC === '1') {
  console.log('sync-posts: SKIP_POST_SYNC=1, skipping');
  process.exit(0);
}

function syncPrefix(prefix, localDir, extraArgs = '') {
  const src = `s3://${BUCKET}/${prefix}`;
  console.log(`sync-posts: aws s3 sync ${src} → ${localDir} (region=${REGION})`);
  try {
    execSync(
      `aws s3 sync "${src}" "${localDir}" --region "${REGION}" ${extraArgs} --no-progress`,
      { stdio: 'inherit' }
    );
  } catch (err) {
    // Don't fail the whole build if S3 is unreachable — the git-tracked
    // files are still there. Log and continue.
    console.warn(`sync-posts: ${prefix} sync failed — continuing with local files only`);
    console.warn(err.message);
  }
}

// Posts: markdown files. --exclude trigger.txt because our publisher writes
// a build-trigger sentinel that doesn't belong in the site's post source.
syncPrefix(POSTS_PREFIX, LOCAL_POSTS, '--exclude "trigger.txt"');

// Assets: hero images (assets/blog/*) uploaded from post-to. Synced into
// public/ so Vite copies them into dist/ and they end up served from the
// site root (e.g. /assets/blog/<slug>-hero.jpg — same shape as Spotless's
// existing hero images committed in git).
syncPrefix(ASSETS_PREFIX, LOCAL_ASSETS);

console.log('sync-posts: done');
