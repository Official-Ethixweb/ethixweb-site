# Database

Migrations live in `supabase/migrations/`, applied in filename order. For a new
Supabase project, run each file once in the SQL editor (or via `supabase db push`
if you use the Supabase CLI), then set `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` in your environment (see `.env.example`).

Every table is written only by server-side API routes using the service role
key - Row Level Security is enabled on all of them with no anon/authenticated
policies, so RLS default-denies direct browser access regardless.

| Migration | Table(s) | Purpose |
| --- | --- | --- |
| `0001_screening_tests.sql` | `screening_tests` | AI candidate screening flow (start/submit/decision) |
| `0002_leads.sql` | `contact_submissions`, `career_applications`, `rate_limits` + `check_rate_limit()` | Durable record of every contact/application submission (independent of whether the notification email is delivered), plus a shared, cross-instance rate limiter for the screening endpoints |

When the schema needs to change, add a new numbered file rather than editing
an existing one - this keeps prod/staging in sync and gives every change a
rollback point.
