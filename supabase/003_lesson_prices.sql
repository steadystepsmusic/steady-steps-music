-- Maestro 003 (2026-11-23): price per lesson day from the tracker's package boxes
-- (a lesson in a $65 one-off box is $65, one in a $520 package of 4 is $130). Admin-only, same table.
alter table student_rates add column if not exists by_date jsonb;
