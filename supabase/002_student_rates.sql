-- Maestro 002 (2026-11-23): what each student pays per lesson, for the admin's Earnings view
-- at 100%. Teachers never see student rates (Nik's rule), so this lives in its own table that
-- only an admin login can read. Filled by the tracker sync (sync_maestro.py). The package rate is the rate: newest package amount / its lesson count.
create table if not exists student_rates (
  id text primary key references students(id) on delete cascade,  -- student id
  monthly_rate numeric(8,2),
  lessons_per_month numeric(5,2),
  lesson_rate numeric(8,2),
  source text,                                                     -- e.g. "package of 4"
  updated_at timestamptz not null default now()
);
alter table student_rates add column if not exists source text;  -- in case an earlier version ran
alter table student_rates enable row level security;
drop policy if exists "admin reads" on student_rates;
create policy "admin reads" on student_rates for select to authenticated using (i_am_admin());
revoke insert, update, delete on student_rates from authenticated, anon;
