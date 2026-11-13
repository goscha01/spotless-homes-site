/**
 * Client-side candidate contact validators for the careers application
 * form. Mirrored from HireFunnel's src/lib/contact-validation.ts so this
 * form's validation is identical to the server-side guard that classifies
 * automation sends — a candidate who passes here will not be rejected
 * downstream as skipped_bad_contact.
 *
 * When HF's validator gets updated (e.g. new TLD typos), copy the changes
 * over here manually. Both repos ship their own vendored copy; there's
 * no shared package.
 */

// Permissive RFC-style check. Catches the failure modes we see in real
// candidate input: missing @, missing dot in domain, trailing characters
// after the TLD (`foo@gmail.comd`), spaces, double dots. TLD locked to
// 2–24 letters/digits — rejects trailing-typo cases without blocking
// legitimate longer TLDs (.photography etc.).
const EMAIL_RE = /^(?!.*\.\.)[A-Za-z0-9._%+\-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/

// Common TLD typos → suggested correct TLD. `.comj` (Jessica Clendenen
// 2026-09-07 case) and `.comd` (Daphney 2026-xx case) are the originating
// examples; the rest are extrapolated from frequent fat-finger patterns.
const TLD_TYPOS = {
  comd: 'com', comm: 'com', cmo: 'com', cm: 'com', coom: 'com',
  comj: 'com', con: 'com', vom: 'com', xom: 'com', dom: 'com', xon: 'com',
  ccom: 'com', cim: 'com', clm: 'com',
  nett: 'net', nte: 'net',
  orgg: 'org', ogr: 'org',
}

const E164 = /^\+[1-9]\d{6,14}$/

export function normalizeEmail(input) {
  return (input ?? '').trim().toLowerCase()
}

export function validateEmail(input) {
  const v = normalizeEmail(input)
  if (!v) return { ok: false, error: 'Please enter your email.' }
  if (!EMAIL_RE.test(v)) return { ok: false, error: 'Please enter a valid email address.' }
  const tldMatch = /\.([A-Za-z]+)$/.exec(v)
  const tld = tldMatch ? tldMatch[1].toLowerCase() : null
  if (tld && TLD_TYPOS[tld]) {
    const suggested = v.slice(0, -tld.length) + TLD_TYPOS[tld]
    return { ok: false, error: `Did you mean ${suggested}?` }
  }
  return { ok: true, value: v }
}

export function normalizeToE164(input) {
  if (!input) return null
  const trimmed = String(input).trim()
  if (E164.test(trimmed)) return trimmed
  // Explicit `+` inputs that fail the strict E.164 check are malformed —
  // do NOT infer a country code (would double-prefix `+1 352 206 342` as
  // `+11352206342` which Twilio rejects).
  const startsWithPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/\D/g, '')
  if (!startsWithPlus) {
    if (digits.length === 10) return `+1${digits}`
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  }
  return null
}

export function validatePhone(input) {
  const v = (input ?? '').trim()
  if (!v) return { ok: false, error: 'Please enter your phone number.' }
  const e164 = normalizeToE164(v)
  if (!e164) return { ok: false, error: 'Please enter a valid phone (e.g. +1 555 123 4567).' }
  return { ok: true, value: e164 }
}
