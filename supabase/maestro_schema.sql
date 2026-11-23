-- Maestro v0 schema (2026-11-23). Paste the whole file into Supabase > SQL Editor > Run.
-- Safe to run again: it only creates what is missing.
--
-- Who owns what (so the tracker sync and Maestro never overwrite each other):
--   tracker (sync_maestro.py, service key): students identity columns, lessons, recaps, sync_status
--   Maestro (teacher login): students teaching-detail columns, lesson_reports
--
-- Security: row level security is on for every table. A signed-in person sees nothing unless
-- their email is in `teachers`. Admins see every student; a teacher sees only students assigned
-- to them (teacher_id). Today Nik is the only teacher and an admin.

create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists students (
  id text primary key,                      -- tracker slug, e.g. "brock-anderson"
  -- tracker-owned
  name text not null,
  status text not null default 'active',    -- active | paused | declined | ended
  cadence_days int,
  starts_on date,
  emails text[] not null default '{}',
  phones text[] not null default '{}',
  inquiry_instrument text,
  working_on jsonb,
  tracker_synced_at timestamptz,
  -- Maestro-owned (teacher edits these on the phone)
  teacher_id uuid references teachers(id),
  instrument text,
  level text,
  age_group text,
  format text,                              -- Zoom | In-home
  default_minutes int,
  street text,
  city text,
  arrival text,
  contact_label text,                       -- e.g. "Parent: Kelsey"
  maestro_updated_at timestamptz
);

create table if not exists lessons (
  id text primary key,                      -- "<calendar event id>:<student id>"
  student_id text not null references students(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  title text,
  is_intro boolean not null default false,
  zoom_url text,
  location text,
  cancelled boolean not null default false
);
create index if not exists lessons_starts_at on lessons(starts_at);

create table if not exists lesson_reports (
  lesson_id text primary key references lessons(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  lesson_starts_at timestamptz not null,
  outcome text not null check (outcome in ('taught', 'charge', 'waive')),
  notes text,
  minutes int not null,
  teacher_pay numeric(8,2) not null default 0,
  status text not null default 'submitted' check (status in ('submitted', 'approved')),
  submitted_by uuid references teachers(id),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists recaps (
  id text primary key,                      -- "<gmail message id>:<student id>"
  student_id text not null references students(id) on delete cascade,
  sent_at timestamptz not null,
  subject text,
  body text
);

create table if not exists sync_status (
  id text primary key,
  last_synced_at timestamptz
);

-- ---------- helpers ----------

create or replace function my_teacher_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from teachers where lower(email) = lower(auth.jwt() ->> 'email')
$$;

create or replace function i_am_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from teachers where lower(email) = lower(auth.jwt() ->> 'email')), false)
$$;

create or replace function can_see_student(sid text) returns boolean
language sql stable security definer set search_path = public as $$
  select i_am_admin() or exists (select 1 from students where id = sid and teacher_id = my_teacher_id())
$$;

-- ---------- row level security ----------

alter table teachers enable row level security;
alter table students enable row level security;
alter table lessons enable row level security;
alter table lesson_reports enable row level security;
alter table recaps enable row level security;
alter table sync_status enable row level security;

drop policy if exists "me" on teachers;
create policy "me" on teachers for select to authenticated using (id = my_teacher_id() or i_am_admin());

drop policy if exists "read" on students;
create policy "read" on students for select to authenticated using (can_see_student(id));
drop policy if exists "edit details" on students;
create policy "edit details" on students for update to authenticated using (can_see_student(id)) with check (can_see_student(id));

drop policy if exists "read" on lessons;
create policy "read" on lessons for select to authenticated using (can_see_student(student_id));

drop policy if exists "read" on recaps;
create policy "read" on recaps for select to authenticated using (can_see_student(student_id));

drop policy if exists "read" on lesson_reports;
create policy "read" on lesson_reports for select to authenticated using (can_see_student(student_id));
drop policy if exists "write" on lesson_reports;
create policy "write" on lesson_reports for insert to authenticated with check (can_see_student(student_id) and status = 'submitted');
drop policy if exists "change until approved" on lesson_reports;
create policy "change until approved" on lesson_reports for update to authenticated
  using (can_see_student(student_id) and status = 'submitted')
  with check (can_see_student(student_id) and (status = 'submitted' or i_am_admin()));

drop policy if exists "read" on sync_status;
create policy "read" on sync_status for select to authenticated using (my_teacher_id() is not null);

-- A teacher can only change the Maestro-owned columns on a student, never the roster facts
revoke update on students from authenticated;
grant update (instrument, level, age_group, format, default_minutes, street, city, arrival, contact_label, maestro_updated_at)
  on students to authenticated;
revoke insert, delete on students, lessons, recaps, sync_status, teachers from authenticated, anon;
revoke update on lessons, recaps, sync_status, teachers from authenticated, anon;
revoke delete on lesson_reports from authenticated, anon;

-- ---------- you ----------
-- The email you sign in to Maestro with. Change it here if you want a different one.
insert into teachers (email, name, is_admin) values ('steadystepsmusic@gmail.com', 'Nik', true)
on conflict (email) do nothing;
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
-- Maestro 003 (2026-11-23): price per lesson day from the tracker's package boxes
-- (a lesson in a $65 one-off box is $65, one in a $520 package of 4 is $130). Admin-only, same table.
alter table student_rates add column if not exists by_date jsonb;
