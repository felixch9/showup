-- SHOWUP production schema (run in Supabase SQL editor)
create extension if not exists "pgcrypto";

create table if not exists jobs (
  id text primary key,
  payload jsonb not null,
  status text,
  market text,
  crew_id text,
  updated_at timestamptz default now()
);

create table if not exists offers (
  id text primary key,
  job_id text,
  payload jsonb not null,
  expires_at timestamptz,
  updated_at timestamptz default now()
);

create table if not exists identity_apps (
  email text primary key,
  payload jsonb not null,
  background_status text,
  identity_status text,
  stripe_account_id text,
  updated_at timestamptz default now()
);

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  phone text,
  role text default 'customer',
  payload jsonb,
  created_at timestamptz default now()
);

create table if not exists payments (
  id text primary key,
  job_id text,
  stripe_session_id text,
  stripe_pi text,
  amount integer,
  status text,
  live boolean default false,
  created_at timestamptz default now()
);

create table if not exists deletion_requests (
  email text,
  created_at timestamptz default now()
);

alter table jobs enable row level security;
alter table offers enable row level security;
alter table identity_apps enable row level security;
alter table accounts enable row level security;
alter table payments enable row level security;

-- Launch: authenticated users can read/write their marketplace rows.
-- Tighten before national scale.
create policy "jobs_all_auth" on jobs for all to authenticated using (true) with check (true);
create policy "offers_all_auth" on offers for all to authenticated using (true) with check (true);
create policy "jobs_read_anon" on jobs for select to anon using (true);
create policy "offers_read_anon" on offers for select to anon using (true);

insert into storage.buckets (id, name, public)
values ('job-photos', 'job-photos', true)
on conflict (id) do nothing;
