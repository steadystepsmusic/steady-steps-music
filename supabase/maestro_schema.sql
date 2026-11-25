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
-- Maestro 004 (2026-11-23): per-teacher preferences (dark mode, maps app) saved to the account,
-- so they follow the teacher across devices and private browsing. A teacher can change only
-- their own prefs, nothing else on their teacher row.
alter table teachers add column if not exists prefs jsonb not null default '{}'::jsonb;
drop policy if exists "edit own prefs" on teachers;
create policy "edit own prefs" on teachers for update to authenticated using (id = my_teacher_id()) with check (id = my_teacher_id());
grant update (prefs) on teachers to authenticated;
-- Maestro 005 (2026-11-23): whether the calendar event has any guests, so Home can flag
-- "No invite sent" (Sam's lesson had no guests and no Zoom link).
alter table lessons add column if not exists has_guests boolean;
-- Maestro 006 (2026-11-23): the admin's payouts, money in this month from Stripe via the tracker
-- (Nik is paid right away, so his Earnings headline is money in). Only an admin login can read it.
create table if not exists admin_money (
  id text primary key,
  month text,
  collected numeric(10,2),
  to_come numeric(10,2),
  last_month numeric(10,2),
  last_month_name text,
  payouts jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
alter table admin_money enable row level security;
drop policy if exists "admin reads" on admin_money;
create policy "admin reads" on admin_money for select to authenticated using (i_am_admin());
revoke insert, update, delete on admin_money from authenticated, anon;

-- Maestro 007 (2026-11-24): siblings who share a paying student's lesson block (tracker
-- family_names: Teller on Brock Anderson's, Colton on Ethan Mantle's). Students shows them
-- on the same card and counts them as students. Tracker-owned: teachers can't edit it (not
-- in the column grant).
alter table students add column if not exists family_names text[];

-- Maestro 008 (2026-11-24): the address on each student's newest Google Calendar invite, read
-- by the tracker and pushed every 15 minutes. Tracker-owned: teachers can't edit these (not in
-- the column grant). Maestro shows them only when the teacher hasn't typed a street/city, so a
-- typed address always wins, and a family that moves updates on the next invite.
alter table students add column if not exists calendar_street text;
alter table students add column if not exists calendar_city text;

-- Maestro 009 (2026-11-25): the Admin screen, and teachers never see family contact info.
-- Run AFTER the matching Maestro code is live (the old code reads students with select *,
-- which this script makes fail for signed-in users).
--
-- 1. The admin adds teachers and decides who teaches whom. Both go through admin-only
--    functions, so a teacher can never add a teacher or move a student.
create or replace function add_teacher(p_name text, p_email text) returns teachers
language plpgsql security definer set search_path = public as $$
declare t teachers;
begin
  if not i_am_admin() then raise exception 'Only an admin can add teachers'; end if;
  if coalesce(trim(p_name), '') = '' or coalesce(trim(p_email), '') !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'A teacher needs a name and an email';
  end if;
  insert into teachers (name, email) values (trim(p_name), lower(trim(p_email)))
  on conflict (email) do update set name = excluded.name
  returning * into t;
  return t;
end $$;
revoke execute on function add_teacher(text, text) from public, anon;
grant execute on function add_teacher(text, text) to authenticated;

create or replace function assign_student(p_student text, p_teacher uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not i_am_admin() then raise exception 'Only an admin can assign students'; end if;
  update students set teacher_id = p_teacher where id = p_student;
end $$;
revoke execute on function assign_student(text, uuid) from public, anon;
grant execute on function assign_student(text, uuid) to authenticated;

-- 2. No contact info for teachers (Nik, 2026-11-25: "it's asking for trouble"). Signed-in
--    users can read every students column except emails and phones; the admin gets those
--    through student_contacts(). A NEW students column must be added to this grant before
--    Maestro can read it.
revoke select on students from authenticated;
grant select (id, name, status, cadence_days, starts_on, inquiry_instrument, working_on, tracker_synced_at,
              teacher_id, instrument, level, age_group, format, default_minutes, street, city, arrival,
              contact_label, maestro_updated_at, family_names, calendar_street, calendar_city)
  on students to authenticated;

create or replace function student_contacts() returns table (id text, emails text[], phones text[])
language sql stable security definer set search_path = public as $$
  select s.id, s.emails, s.phones from students s where i_am_admin()
$$;
revoke execute on function student_contacts() from public, anon;
grant execute on function student_contacts() to authenticated;
