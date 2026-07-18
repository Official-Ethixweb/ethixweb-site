-- Standalone, single-candidate, single-use Google Ads assessment. Unlike
-- `assessments` (0003), there is no invite/admin system driving this table -
-- exactly one row is ever inserted, by a one-off local script
-- (scripts/create-gads-invite.mjs), before the link is handed to the
-- candidate. Run once in the Supabase SQL editor after 0001-0004.
--
-- Security model: `questions` holds the full answer key and is only ever
-- read by the server through the service role - API routes strip
-- correctAnswers/explanation/evaluationCriteria before anything reaches the
-- browser (see sanitizeGadsQuestion in src/lib/gads-types.ts).
-- `session_token_hash` is the SHA-256 of the one-time bearer token embedded
-- in the candidate's link; the raw token is never stored. Once `status`
-- leaves 'in_progress' the token is permanently dead - see
-- src/lib/gads-service.ts.

create table if not exists google_ads_assessments (
  id uuid primary key default gen_random_uuid(),

  -- Seeded by the invite script with the one invited candidate's details;
  -- candidate_name is overwritten with whatever the candidate actually
  -- types on the name/email gate (trimmed). candidate_email is the fixed
  -- address the gate compares every attempt against - it never changes.
  candidate_name text not null,
  candidate_email text not null,

  session_token_hash text not null,

  -- Deadline to BEGIN the exam (today at midnight server time, per the
  -- invite script), independent of the exam's own countdown once started.
  link_expires_at timestamptz not null,

  -- Full 40-question set INCLUDING the answer key, shuffled (question order
  -- + option order) once when the candidate clicks "Begin". Null while
  -- pending. Server-only.
  questions jsonb,

  -- Committed, timed answers: { "<questionId>": { value, elapsedSeconds,
  -- skipped } }. Only written when the forced per-question timer machine
  -- advances past that question - see advanceGadsQuestion in
  -- src/lib/gads-service.ts.
  answers jsonb not null default '{}'::jsonb,
  -- The current question's not-yet-committed pick, restored on a mid-
  -- question refresh without resetting current_index or the timer.
  draft_answer jsonb,

  -- Server-authoritative position in the forced, no-return sequence. Every
  -- advance/submit call must match this exactly (optimistic-concurrency
  -- guard - a stale index update is a no-op, not an overwrite).
  current_index int not null default 0,
  -- Stamped every time current_index moves forward. Lets the server compute
  -- this question's true remaining time independent of the client's local
  -- timer/clock - a refresh does not grant a fresh 30/60/240 seconds.
  current_question_started_at timestamptz,

  -- Every proctoring event: [{ type, at, detail? }].
  violations jsonb not null default '[]'::jsonb,
  -- Periodic mic RMS/level samples: [{ at, level, active }]. A sampled
  -- signal, never audio - the continuous recording (below) covers audio.
  mic_activity jsonb not null default '[]'::jsonb,
  -- Periodic webcam still JPEGs uploaded to Blob; only URLs land here:
  -- [{ url, at }].
  camera_snapshots jsonb not null default '[]'::jsonb,
  -- Continuous webcam/mic recording segment(s) uploaded to Blob.
  recording_urls jsonb not null default '[]'::jsonb,

  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'submitted', 'scored', 'expired')),

  scores jsonb,          -- { overallPercent, byCategory: { [category]: SectionScore } }
  per_question jsonb,    -- [{ questionId, mechanic, category, topic, difficulty, elapsedSeconds, skipped, earned, max, outcome }]
  overall_percent numeric,
  recommendation text
    check (recommendation in ('highly_recommended', 'recommended', 'borderline', 'not_recommended')),
  suspicious_activity_score numeric,
  time_taken_seconds int,
  submit_reason text
    check (submit_reason in ('manual', 'timer', 'violations', 'auto_expired')),

  candidate_confirmation_sent_at timestamptz,
  recruiter_report_sent_at timestamptz,

  created_at timestamptz not null default now(),
  started_at timestamptz,
  expires_at timestamptz,      -- exam's own ~44-minute deadline, set at begin
  submitted_at timestamptz
);

-- The candidate-facing route resolves a row by token alone - this index
-- makes that lookup O(1) and enforces one row per token as a side effect.
create unique index if not exists gads_token_hash_idx on google_ads_assessments (session_token_hash);
create index if not exists gads_status_idx on google_ads_assessments (status);

-- Server-only access (service role). No anon policies on purpose: the
-- candidate only ever goes through the API routes.
alter table google_ads_assessments enable row level security;
