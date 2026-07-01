// Image optimization pipeline.
//
// Source of truth:  public/assets/_originals/<dir>/<name>.<ext>
// Deployed output:  public/assets/<dir>/<name>.<ext>
//
// Workflow for adding a new image:
//   1. Drop the original into public/assets/_originals/<dir>/<name>.<ext>
//   2. Run `npm run optimize:images` (also runs as prebuild)
//   3. Reference /assets/<dir>/<name>.<ext> in JSX
//
// First-run migration: any file in public/assets/ that doesn't yet have a
// counterpart in _originals/ is moved into _originals/ before being optimized.
// After first run, you only ever touch _originals/.
//
// Per-directory rules below set max dimensions and quality. Falls back to
// DEFAULT_RULE for unrecognized paths. Format is always preserved so JSX
// references stay stable when a developer drops a new file in.
//
// Idempotency: a file is skipped if the output exists and is newer than the
// source (by mtime). Pass --force to override.

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(__dirname, '..', 'public', 'assets');
const ORIGINALS = path.join(ASSETS, '_originals');
const FORCE = process.argv.includes('--force');

// Files never touched by this pipeline.
// - og-default.png is produced by gen-og-card.mjs at the size it ships at.
const EXCLUDE = new Set(['og-default.png']);

// Per-directory rules. First match wins. Match against the path relative to
// the assets root (e.g. "icons/bath.png" or "before-after/foo.jpg").
//
// Rules tuned to actual display sizes measured by Lighthouse mobile audits.
// Rule of thumb: max dimension = display CSS pixels × ~1.8 (retina headroom,
// slightly under 2x to save bytes on the long tail of DPR-3 devices).
const RULES = [
  // Per-file overrides (root-level images with known display dimensions).
  { match: /^team\.jpg$/i,          maxW: 900,  maxH: 675,  quality: 78 },   // was 1100x822
  { match: /^logo-circle\.png$/i,   maxW: 220,  maxH: 220 },
  { match: /^hero-woman\.webp$/i,   maxW: 900,  maxH: 800,  quality: 78 },   // was 1252x1132 — LCP on Home
  { match: /^fridge\.jpg$/i,        maxW: 1200, maxH: 900,  quality: 78 },

  // Directory-level rules.
  { match: /^icons\//,              maxW: 200,  maxH: 200 },                 // was 320 — displayed at 155
  { match: /^cities\//,             maxW: 1200, maxH: 900,  quality: 78 },   // was 1920 — LCP on Location
  { match: /^before-after\//,       maxW: 900,  maxH: 1200, quality: 76 },   // was 1302x1736 — big saver
  { match: /^blog\//,               maxW: 1200, maxH: 900,  quality: 80 },
  { match: /^house\//,              maxW: 700,  maxH: 525,  quality: 78 },   // cards, small display
  { match: /^products\//,           maxW: 900,  maxH: 900,  quality: 80 },
  { match: /^airbnb\//,             maxW: 1200, maxH: 900,  quality: 80 },
  { match: /^about\//,              maxW: 1200, maxH: 900,  quality: 80 },
  { match: /^checklist\//,          maxW: 1200, maxH: 900,  quality: 80 },
  { match: /^office\//,             maxW: 1200, maxH: 900,  quality: 80 },
  { match: /^services\//,           maxW: 1200, maxH: 900,  quality: 80 },
];
const DEFAULT_RULE = { maxW: 1200, maxH: 900, quality: 78 };

function ruleFor(relPath) {
  const normalized = relPath.split(path.sep).join('/');
  for (const r of RULES) if (r.match.test(normalized)) return r;
  return DEFAULT_RULE;
}

// Walk a directory recursively, returning files relative to root.
async function walk(root, sub = '') {
  const out = [];
  const dir = path.join(root, sub);
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch { return out; }
  for (const e of entries) {
    if (e.name === '_originals') continue; // never descend into _originals
    const rel = sub ? path.join(sub, e.name) : e.name;
    if (e.isDirectory()) out.push(...await walk(root, rel));
    else if (e.isFile()) out.push(rel);
  }
  return out;
}

async function mtime(p) {
  try { return (await fs.stat(p)).mtimeMs; } catch { return 0; }
}

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

async function optimizeOne(relPath) {
  const srcInOriginals = path.join(ORIGINALS, relPath);
  const srcInAssets = path.join(ASSETS, relPath);
  const outPath = path.join(ASSETS, relPath);

  // Migration: if file lives in assets/ but not in _originals/, move it.
  let srcPath = srcInOriginals;
  try { await fs.access(srcInOriginals); }
  catch {
    try {
      await fs.access(srcInAssets);
      await fs.mkdir(path.dirname(srcInOriginals), { recursive: true });
      await fs.copyFile(srcInAssets, srcInOriginals);
      srcPath = srcInOriginals;
    } catch { return null; } // file gone from both
  }

  // Idempotency.
  if (!FORCE) {
    const [srcMt, outMt] = await Promise.all([mtime(srcPath), mtime(outPath)]);
    if (outMt > srcMt && outMt > 0 && srcMt > 0) {
      // Also require the output to be smaller than 95% of source — otherwise
      // it likely came from a prior run before we tightened rules.
      const [srcSize, outSize] = await Promise.all([
        fs.stat(srcPath).then(s => s.size),
        fs.stat(outPath).then(s => s.size),
      ]);
      if (outSize < srcSize * 0.95) return { relPath, skipped: true };
    }
  }

  const rule = ruleFor(relPath);
  const ext = path.extname(relPath).toLowerCase().slice(1);

  const srcSize = (await fs.stat(srcPath)).size;
  const buf = await fs.readFile(srcPath);

  // Resize with `fit: inside` so neither dimension exceeds max — preserves
  // the source aspect ratio. `withoutEnlargement` avoids upscaling tiny inputs.
  let pipeline = sharp(buf, { failOn: 'none' })
    .rotate() // honor EXIF
    .resize(rule.maxW, rule.maxH, { fit: 'inside', withoutEnlargement: true });

  // Format-specific encoder. We preserve the source extension so JSX refs are
  // stable; sharp picks the right encoder based on the target extension.
  if (ext === 'jpg' || ext === 'jpeg') {
    pipeline = pipeline.jpeg({ quality: rule.quality ?? 82, mozjpeg: true });
  } else if (ext === 'png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else if (ext === 'webp') {
    pipeline = pipeline.webp({ quality: rule.quality ?? 82 });
  } else if (ext === 'avif') {
    pipeline = pipeline.avif({ quality: rule.quality ?? 60 });
  } else {
    return { relPath, skipped: true, reason: 'unsupported ext' };
  }

  const out = await pipeline.toBuffer();

  // Only write if the new file is actually smaller — never make things worse.
  if (out.length >= srcSize && !FORCE) {
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.copyFile(srcPath, outPath);
    return { relPath, srcSize, outSize: srcSize, copied: true };
  }

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, out);
  return { relPath, srcSize, outSize: out.length };
}

async function main() {
  await fs.mkdir(ORIGINALS, { recursive: true });

  // Files come from both sources. _originals/ takes precedence, but we also
  // pick up legacy files still in assets/ (first-run migration).
  const fromOriginals = await walk(ORIGINALS);
  const fromAssets = (await walk(ASSETS)).filter(p => !EXCLUDE.has(p));
  const all = Array.from(new Set([...fromOriginals, ...fromAssets])).sort();

  console.log(`optimize-images: ${all.length} files to process${FORCE ? ' (--force)' : ''}`);

  let totalSrc = 0, totalOut = 0, skipped = 0, errors = 0;
  for (const rel of all) {
    if (EXCLUDE.has(rel)) continue;
    try {
      const r = await optimizeOne(rel);
      if (!r) continue;
      if (r.skipped) { skipped++; continue; }
      totalSrc += r.srcSize;
      totalOut += r.outSize;
      const saved = r.srcSize - r.outSize;
      const pct = r.srcSize ? Math.round((saved / r.srcSize) * 100) : 0;
      const tag = r.copied ? '(copied)' : `${pct}% smaller`;
      console.log(`  ${rel.padEnd(60)} ${fmtBytes(r.srcSize).padStart(8)} → ${fmtBytes(r.outSize).padStart(8)}  ${tag}`);
    } catch (e) {
      errors++;
      console.error(`  ${rel}: ${e.message}`);
    }
  }

  const saved = totalSrc - totalOut;
  console.log(`\nProcessed ${all.length - skipped - errors} files, skipped ${skipped}, errors ${errors}`);
  console.log(`Total: ${fmtBytes(totalSrc)} → ${fmtBytes(totalOut)} (saved ${fmtBytes(saved)})`);
}

main().catch(e => { console.error(e); process.exit(1); });
