-- Maestro 004 (2026-11-23): per-teacher preferences (dark mode, maps app) saved to the account,
-- so they follow the teacher across devices and private browsing. A teacher can change only
-- their own prefs, nothing else on their teacher row.
alter table teachers add column if not exists prefs jsonb not null default '{}'::jsonb;
drop policy if exists "edit own prefs" on teachers;
create policy "edit own prefs" on teachers for update to authenticated using (id = my_teacher_id()) with check (id = my_teacher_id());
grant update (prefs) on teachers to authenticated;
