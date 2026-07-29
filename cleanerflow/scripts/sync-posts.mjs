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
const PREFIX = process.env.POST_TO_BLOG_PREFIX || 'posts/';
const LOCAL = join(__dirname, '..', 'src', 'data', 'blog-posts');

if (!existsSync(LOCAL)) mkdirSync(LOCAL, { recursive: true });

// Skip in CI environments that explicitly opt out (useful for PR builds that
// shouldn't pull latest content mid-review).
if (process.env.SKIP_POST_SYNC === '1') {
  console.log('sync-posts: SKIP_POST_SYNC=1, skipping');
  process.exit(0);
}

const src = `s3://${BUCKET}/${PREFIX}`;
console.log(`sync-posts: aws s3 sync ${src} → ${LOCAL} (region=${REGION})`);

try {
  // --exclude 'trigger.txt' because our publisher writes a trigger file for
  // build-event pipelines; it doesn't belong in the site's post source.
  // --size-only would miss identical-length edits — leave default (mtime+size)
  execSync(
    `aws s3 sync "${src}" "${LOCAL}" --region "${REGION}" --exclude "trigger.txt" --no-progress`,
    { stdio: 'inherit' }
  );
  console.log('sync-posts: done');
} catch (err) {
  // Don't fail the whole build if S3 is unreachable — the git-tracked
  // markdown files are still there. Log and continue.
  console.warn('sync-posts: aws s3 sync failed — continuing with local posts only');
  console.warn(err.message);
}
