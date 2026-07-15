-- Durable record of every contact-form and job-application submission.
-- Email (Resend) is still sent for immediate notification, but it is no
-- longer the only copy: a bounced/filtered/deleted email must never mean a
-- lost lead. Written by the server (service role key) only - see
-- src/lib/leads.ts.

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text,
  timeline text,
  project_details text,
  notification_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_idx on contact_submissions (created_at desc);
create index if not exists contact_submissions_email_idx on contact_submissions (email);

alter table contact_submissions enable row level security;

create table if not exists career_applications (
  id uuid primary key default gen_random_uuid(),
  role_id text,
  job_title text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  linkedin text,
  portfolio text,
  github text,
  resume_url text,
  resume_name text,
  cover_letter text,
  experience text,
  current_company text,
  current_ctc text,
  expected_ctc text,
  notice_period text,
  availability text,
  notification_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists career_applications_created_idx on career_applications (created_at desc);
create index if not exists career_applications_email_idx on career_applications (email);
create index if not exists career_applications_role_idx on career_applications (role_id);

-- Row Level Security: same posture as screening_tests - only the server
-- (service role key) touches these tables. No anon/public policies are
-- defined, so RLS default-denies anon/authenticated access entirely.
alter table career_applications enable row level security;

-- Durable, cross-instance rate limiting (see src/lib/rate-limit.ts). The
-- in-memory limiter resets on every cold start and isn't shared across
-- serverless instances; this table + function give the screening endpoints
-- (which gate paid Anthropic calls) a real shared counter instead.
create table if not exists rate_limits (
  key text primary key,
  count int not null default 1,
  reset_at timestamptz not null
);

alter table rate_limits enable row level security;

-- Single atomic UPSERT: Postgres guarantees INSERT..ON CONFLICT..DO UPDATE
-- is applied as one atomic operation per row, so concurrent requests for the
-- same key can't race past each other the way a read-then-write check would.
create or replace function check_rate_limit(p_key text, p_limit int, p_window_ms int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_count int;
  v_reset timestamptz;
begin
  insert into rate_limits (key, count, reset_at)
  values (p_key, 1, v_now + (p_window_ms || ' milliseconds')::interval)
  on conflict (key) do update
    set count = case
        when rate_limits.reset_at < v_now then 1
        else rate_limits.count + 1
      end,
      reset_at = case
        when rate_limits.reset_at < v_now then v_now + (p_window_ms || ' milliseconds')::interval
        else rate_limits.reset_at
      end
  returning count, reset_at into v_count, v_reset;

  return v_count <= p_limit;
end;
$$;
