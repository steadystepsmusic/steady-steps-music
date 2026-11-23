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
