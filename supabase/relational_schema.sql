-- Relational schema for Horizons
-- Inspected existing project:
--   - public.user_profiles was legacy (now unused)
--   - public.destinations exists but empty
--   - public.trips exists but empty
--   - public.profiles does NOT exist yet
--
-- Run once in Supabase SQL Editor.

-- 1) profiles = WHO the user is (no trip details)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  firstname text,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Copy existing auth users into profiles (no dependency on legacy user_profiles)
insert into public.profiles (user_id, email, firstname)
select
  au.id,
  au.email,
  coalesce(au.raw_user_meta_data->>'firstname', null)
from auth.users au
on conflict (user_id) do update
  set email = excluded.email,
      firstname = coalesce(excluded.firstname, public.profiles.firstname),
      updated_at = now();

-- 2) destinations = WHICH cities the website offers (one row per city)
drop table if exists public.trips cascade;
drop table if exists public.destinations cascade;

create table public.destinations (
  destination_id text primary key,
  city text not null,
  country text not null,
  language text not null,
  description text,
  image text,
  weekly_course_price integer not null default 200,
  created_at timestamptz not null default now()
);

alter table public.destinations enable row level security;

drop policy if exists "Anyone can read destinations" on public.destinations;
create policy "Anyone can read destinations"
  on public.destinations for select
  using (true);

-- Seed destinations once (reuse these ids forever — never insert duplicates on save)
insert into public.destinations (destination_id, city, country, language, description, image, weekly_course_price) values
  ('london', 'London', 'United Kingdom', 'English', 'Study in the heart of the UK capital.', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80', 200),
  ('edinburgh', 'Edinburgh', 'United Kingdom', 'English', 'Castles, festivals, and Scottish English.', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80', 200),
  ('dublin', 'Dublin', 'Ireland', 'English', 'Friendly streets and Irish English.', 'https://images.unsplash.com/photo-1549918864-48aa873aa9c0?auto=format&fit=crop&w=1200&q=80', 200),
  ('new-york', 'New York', 'United States', 'English', 'Fast-paced American English.', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', 200),
  ('madrid', 'Madrid', 'Spain', 'Spanish', 'Sunlit plazas and Spanish immersion.', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80', 200),
  ('barcelona', 'Barcelona', 'Spain', 'Spanish', 'Architecture, beach life, Spanish practice.', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80', 200),
  ('seville', 'Seville', 'Spain', 'Spanish', 'Andalusian warmth and southern Spanish.', 'https://images.unsplash.com/photo-1558642084-fd27fae9a7f0?auto=format&fit=crop&w=1200&q=80', 200),
  ('buenos-aires', 'Buenos Aires', 'Argentina', 'Spanish', 'Latin American Spanish and café life.', 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1200&q=80', 200),
  ('paris', 'Paris', 'France', 'French', 'Cafés, galleries, everyday French.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', 200),
  ('lyon', 'Lyon', 'France', 'French', 'Food capital and clear French.', 'https://images.unsplash.com/photo-1524396309943-e03f5249f002?auto=format&fit=crop&w=1200&q=80', 200),
  ('bordeaux', 'Bordeaux', 'France', 'French', 'Wine country and southern French pace.', 'https://images.unsplash.com/photo-1588416499018-d8c621e7d2c2?auto=format&fit=crop&w=1200&q=80', 200),
  ('montreal', 'Montreal', 'Canada', 'French', 'North American French with bilingual life.', 'https://images.unsplash.com/photo-1519178614-68673b201f36?auto=format&fit=crop&w=1200&q=80', 200),
  ('berlin', 'Berlin', 'Germany', 'German', 'Creative capital for German practice.', 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80', 200),
  ('munich', 'Munich', 'Germany', 'German', 'Bavarian culture and professional German.', 'https://images.unsplash.com/photo-1528728329032-2972fddc2d67?auto=format&fit=crop&w=1200&q=80', 200),
  ('vienna', 'Vienna', 'Austria', 'German', 'Classical city and Austrian German.', 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80', 200),
  ('zurich', 'Zurich', 'Switzerland', 'German', 'Lake views and Swiss German exposure.', 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1200&q=80', 200)
on conflict (destination_id) do nothing;

-- 3) trips = WHICH personalized trips each user created (many per user)
create table public.trips (
  trip_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  destination_id text not null references public.destinations (destination_id),
  duration integer not null check (duration between 1 and 4),
  course_type text not null,
  accommodation text not null,
  activities text[] not null default '{}',
  total_price numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create index if not exists trips_user_id_idx on public.trips (user_id);
create index if not exists trips_total_price_idx on public.trips (total_price);

alter table public.trips enable row level security;

drop policy if exists "Users can read own trips" on public.trips;
create policy "Users can read own trips"
  on public.trips for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own trips" on public.trips;
create policy "Users can insert own trips"
  on public.trips for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own trips" on public.trips;
create policy "Users can update own trips"
  on public.trips for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own trips" on public.trips;
create policy "Users can delete own trips"
  on public.trips for delete
  using (auth.uid() = user_id);

-- Auto-create profiles row on auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, firstname)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'firstname', null)
  )
  on conflict (user_id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
