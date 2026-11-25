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
