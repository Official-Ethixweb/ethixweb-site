// One-off local script: creates the single row for the standalone Google
// Ads assessment and prints the one-time link. There is no admin dashboard
// or invite API by design (see .env.example) - this script IS the
// provisioning step, run once by hand.
//
// Usage:
//   node --env-file=.env scripts/create-gads-invite.mjs --name "Full Name" --email someone@example.com
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment
// (--env-file=.env loads them from the project's .env file - see
// supabase/README.md for how those get set up).

import { randomBytes, createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const eq = arg.indexOf("=");
    if (eq !== -1) {
      out[arg.slice(2, eq)] = arg.slice(eq + 1);
    } else {
      out[arg.slice(2)] = argv[i + 1];
      i++;
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const candidateName = args.name?.trim();
const candidateEmail = args.email?.trim().toLowerCase();

if (!candidateName || !candidateEmail) {
  console.error(
    'Usage: node --env-file=.env scripts/create-gads-invite.mjs --name "Full Name" --email someone@example.com',
  );
  process.exit(1);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail)) {
  console.error(`"${candidateEmail}" doesn't look like a valid email address.`);
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see .env.example).");
  process.exit(1);
}

const siteUrl = process.env.VITE_SITE_URL || "http://localhost:3000";

// Same bearer-token pattern as src/lib/assessment-session.ts: the browser
// (via this one-time link) gets the raw token, the database stores only its
// SHA-256 hash.
const token = randomBytes(32).toString("hex");
const tokenHash = createHash("sha256").update(token).digest("hex");

// "Expires today at midnight, even if unused" - the deadline to BEGIN, not
// the exam's own countdown once started. Computed from server (UTC) time,
// same as Vercel serverless functions run in.
const now = new Date();
const linkExpiresAt = new Date(
  Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0),
);

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

const { data, error } = await supabase
  .from("google_ads_assessments")
  .insert({
    candidate_name: candidateName,
    candidate_email: candidateEmail,
    session_token_hash: tokenHash,
    link_expires_at: linkExpiresAt.toISOString(),
    status: "pending",
  })
  .select("id")
  .single();

if (error) {
  console.error("Could not create the invite row:", error);
  process.exit(1);
}

const link = `${siteUrl}/assessment/google-ads/${token}`;

console.log("");
console.log("Google Ads assessment invite created.");
console.log("");
console.log(`  Candidate: ${candidateName} <${candidateEmail}>`);
console.log(`  Row id:    ${data.id}`);
console.log(
  `  Expires:   ${linkExpiresAt.toISOString()} (must be started by then, even if unused)`,
);
console.log("");
console.log("  One-time link (send this to the candidate):");
console.log(`  ${link}`);
console.log("");
console.log(
  "  This link works exactly once: the exam begins on first access (after the name/email check",
);
console.log("  and camera/mic permission), and the link is permanently dead after submission.");
console.log("");
