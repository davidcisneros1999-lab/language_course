-- Run this in Supabase SQL Editor if user_profiles already exists
-- but is missing trip columns (fixes: "Could not find the 'accommodation' column")

alter table public.user_profiles
  add column if not exists email text,
  add column if not exists language text,
  add column if not exists destination_id text,
  add column if not exists duration_weeks integer,
  add column if not exists course_type text,
  add column if not exists accommodation text,
  add column if not exists activities text[] not null default '{}',
  add column if not exists trip_saved_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Optional: keep duration in valid range when set
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_profiles_duration_weeks_check'
  ) then
    alter table public.user_profiles
      add constraint user_profiles_duration_weeks_check
      check (duration_weeks is null or duration_weeks between 1 and 4);
  end if;
end $$;

-- Make sure RLS policies exist
alter table public.user_profiles enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
  on public.user_profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
  on public.user_profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can delete own profile" on public.user_profiles;
create policy "Users can delete own profile"
  on public.user_profiles
  for delete
  using (auth.uid() = id);
