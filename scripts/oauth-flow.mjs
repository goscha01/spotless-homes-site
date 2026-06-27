#!/usr/bin/env node
// One-time OAuth consent flow for the Google Business Profile API.
// Run: node --env-file=cleanerflow/.env scripts/oauth-flow.mjs
//
// Requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT in .env.
// On success, prints the refresh token; you paste it into .env as GOOGLE_REFRESH_TOKEN
// (and later add it as a GitHub Actions secret).

import http from "node:http";
import { URL } from "node:url";
import { exec } from "node:child_process";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT = process.env.GOOGLE_OAUTH_REDIRECT || "http://localhost:3000/oauth/callback";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
  process.exit(1);
}

const SCOPE = "https://www.googleapis.com/auth/business.manage";
const STATE = Math.random().toString(36).slice(2);

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "select_account consent",
    state: STATE,
  }).toString();

const redirectUrl = new URL(REDIRECT);
const PORT = Number(redirectUrl.port) || 80;
const CALLBACK_PATH = redirectUrl.pathname;

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, REDIRECT);
  if (u.pathname !== CALLBACK_PATH) {
    res.writeHead(404).end();
    return;
  }
  const code = u.searchParams.get("code");
  const state = u.searchParams.get("state");
  if (!code || state !== STATE) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Missing code or bad state.");
    return;
  }
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(JSON.stringify(tokens));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<h1>Success!</h1><p>You can close this tab and return to the terminal.</p>`);
    console.log("\n=== TOKENS ===");
    console.log(JSON.stringify(tokens, null, 2));
    console.log("\n=== ACTION ===");
    if (tokens.refresh_token) {
      console.log("Paste this into cleanerflow/.env as GOOGLE_REFRESH_TOKEN:");
      console.log(tokens.refresh_token);
    } else {
      console.log("No refresh_token returned. Revoke prior access at https://myaccount.google.com/permissions and retry.");
    }
    setTimeout(() => server.close(() => process.exit(0)), 500);
  } catch (err) {
    console.error("Token exchange failed:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Token exchange failed; see terminal.");
    setTimeout(() => server.close(() => process.exit(1)), 500);
  }
});

server.listen(PORT, () => {
  console.log(`Listening on ${REDIRECT}`);
  console.log("Opening browser for consent...");
  console.log("If it doesn't open automatically, visit:\n  " + authUrl + "\n");
  const cmd = process.platform === "win32" ? `start "" "${authUrl}"` : process.platform === "darwin" ? `open "${authUrl}"` : `xdg-open "${authUrl}"`;
  exec(cmd, () => {});
});
