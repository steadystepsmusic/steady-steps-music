-- Maestro 007 (2026-11-24): siblings who share a paying student's lesson block (tracker
-- family_names: Teller on Brock Anderson's, Colton on Ethan Mantle's). Students shows them
-- on the same card and counts them as students. Tracker-owned: teachers can't edit it (not
-- in the column grant).
alter table students add column if not exists family_names text[];
