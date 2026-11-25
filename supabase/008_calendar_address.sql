-- Maestro 008 (2026-11-24): the address on each student's newest Google Calendar invite, read
-- by the tracker and pushed every 15 minutes. Tracker-owned: teachers can't edit these (not in
-- the column grant). Maestro shows them only when the teacher hasn't typed a street/city, so a
-- typed address always wins, and a family that moves updates on the next invite.
alter table students add column if not exists calendar_street text;
alter table students add column if not exists calendar_city text;
