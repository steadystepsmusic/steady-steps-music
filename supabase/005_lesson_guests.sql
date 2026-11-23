-- Maestro 005 (2026-11-23): whether the calendar event has any guests, so Home can flag
-- "No invite sent" (Sam's lesson had no guests and no Zoom link).
alter table lessons add column if not exists has_guests boolean;
