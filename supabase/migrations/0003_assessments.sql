-- AI-powered recruitment assessments (40 questions / 30 minutes, Gemini
-- generated, deterministically scored). Run once in the Supabase SQL editor
-- after 0001/0002.
--
-- Security model: the questions column holds the full answer key and is only
-- ever read by the server through the service role - API routes strip
-- correctAnswers/explanation/evaluationCriteria before anything reaches the
-- browser. session_token_hash is the SHA-256 of the per-exam bearer token the
-- candidate's browser holds; the raw token is never stored.

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  role_id text not null,
  candidate_name text not null,
  candidate_email text not null,
  candidate_phone text,
  resume_url text,
  experience_years text,

  session_token_hash text not null,

  -- Full question set INCLUDING the answer key. Server-only.
  questions jsonb not null,
  -- Auto-saved after every interaction: { "<questionId>": answer }.
  answers jsonb not null default '{}'::jsonb,
  -- Every proctoring violation: [{ type, at, detail? }].
  violations jsonb not null default '[]'::jsonb,

  status text not null default 'in_progress'
    check (status in ('in_progress', 'submitted', 'scored', 'expired')),

  scores jsonb,          -- { technical, logic, communication, personality, overallPercent }
  per_question jsonb,    -- [{ questionId, type, topic, difficulty, earned, max, outcome }]
  overall_percent numeric,
  time_taken_seconds int,
  submit_reason text
    check (submit_reason in ('manual', 'timer', 'violations', 'auto_expired')),

  -- Webcam/mic recordings uploaded to Vercel Blob (multiple segments when the
  -- candidate's browser was refreshed mid-exam).
  recording_urls jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now(),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  submitted_at timestamptz
);

create index if not exists assessments_email_idx on assessments (candidate_email);
create index if not exists assessments_status_idx on assessments (status);
create index if not exists assessments_role_idx on assessments (role_id);
create index if not exists assessments_created_idx on assessments (created_at desc);

-- Server-only access (service role). No anon policies on purpose: candidates
-- and reviewers only ever go through the API routes.
alter table assessments enable row level security;
