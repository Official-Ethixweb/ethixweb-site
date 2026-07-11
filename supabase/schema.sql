-- AI-powered candidate screening: v1 scoped to a single role (seo-specialist).
-- Run this once in the Supabase SQL editor for a new project, then set
-- SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.

create table if not exists screening_tests (
  id uuid primary key default gen_random_uuid(),
  role_id text not null,
  candidate_name text not null,
  candidate_email text not null,
  candidate_phone text,
  resume_url text,

  -- Freshly generated per candidate - never a fixed bank.
  questions jsonb not null,
  answers jsonb,

  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'submitted', 'scored', 'approved', 'rejected', 'expired')),

  total_score numeric,
  max_score numeric,
  scoring jsonb, -- per-question { questionId, score, maxScore, reasoning }
  overall_reasoning text,

  -- Soft anti-cheat signal, surfaced next to the score, never a hard block.
  tab_switch_count int not null default 0,
  blur_count int not null default 0,

  reviewer_decision text check (reviewer_decision in ('approved', 'rejected')),
  reviewer_decided_at timestamptz,

  created_at timestamptz not null default now(),
  started_at timestamptz,
  submitted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '48 hours')
);

create index if not exists screening_tests_status_idx on screening_tests (status);
create index if not exists screening_tests_role_idx on screening_tests (role_id);

-- Row Level Security: only the server (service role key) touches this table.
-- No anon/public access - candidates and reviewers only ever go through the
-- API routes, never query Supabase directly from the browser.
alter table screening_tests enable row level security;
