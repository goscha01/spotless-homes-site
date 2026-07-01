// One-shot generator for the social-share OG card.
// Output: public/assets/og-default.png at 1200x630 (Facebook/Twitter/LinkedIn spec).
//
// Composition:
//   - Brand yellow background (#F2C31B)
//   - Long wordmark logo centered horizontally in the upper-middle
//   - Tagline + service-area line below, serif, in ink black

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const W = 1200;
const H = 630;
// Match the embedded logo PNG's background (sampled #FCC510) so the logo
// blends seamlessly — the site CSS brand yellow #F2C31B is close but not exact.
const YELLOW = "#FCC510";
const INK = "#0E0E0E";

const LOGO_PATH = path.join(ROOT, "public/logo/logo-long.png");
const OUT_PATH = path.join(ROOT, "public/assets/og-default.png");

// Resize the long logo (transparent PNG, 5000x785, ratio ~6.37) to fit cleanly.
// Target logo width ~880px (leaves margin); height auto.
const LOGO_TARGET_W = 880;

const logoBuf = await sharp(LOGO_PATH)
  .resize({ width: LOGO_TARGET_W })
  .png()
  .toBuffer();
const logoMeta = await sharp(logoBuf).metadata();

// Layout: vertically center the (logo + text block) inside the canvas.
const TEXT_GAP = 60;     // space between logo and tagline
const TAGLINE_SIZE = 44;
const SUBLINE_SIZE = 28;
const LINE_GAP = 16;
const textBlockH = TAGLINE_SIZE + LINE_GAP + SUBLINE_SIZE;
const totalH = logoMeta.height + TEXT_GAP + textBlockH;
const topOffset = Math.round((H - totalH) / 2);

const logoLeft = Math.round((W - logoMeta.width) / 2);
const logoTop = topOffset;
const textCenterY = logoTop + logoMeta.height + TEXT_GAP + TAGLINE_SIZE;
const sublineY = textCenterY + LINE_GAP + SUBLINE_SIZE;

// SVG overlay for the text. Using a system serif fallback chain so the script
// works on any machine; the look is close to Cormorant Garamond.
const textSvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .tag { font-family: 'Cormorant Garamond','Georgia','Times New Roman',serif; font-weight: 500; font-style: italic; fill: ${INK}; }
    .sub { font-family: 'Inter','Segoe UI','Arial',sans-serif; font-weight: 600; fill: ${INK}; letter-spacing: 0.04em; }
  </style>
  <text x="${W / 2}" y="${textCenterY}" class="tag" font-size="${TAGLINE_SIZE}" text-anchor="middle">Florida's Trusted Maids</text>
  <text x="${W / 2}" y="${sublineY}" class="sub" font-size="${SUBLINE_SIZE}" text-anchor="middle">TAMPA  ·  ST. PETE  ·  CLEARWATER  ·  JACKSONVILLE  ·  ORLANDO</text>
</svg>
`.trim();

await sharp({
  create: { width: W, height: H, channels: 4, background: YELLOW },
})
  .composite([
    { input: logoBuf, top: logoTop, left: logoLeft },
    { input: Buffer.from(textSvg), top: 0, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(OUT_PATH);

const outMeta = await sharp(OUT_PATH).metadata();
console.log(`og-default.png: ${outMeta.width}x${outMeta.height}, ${(fs.statSync(OUT_PATH).size / 1024).toFixed(1)} KB`);
