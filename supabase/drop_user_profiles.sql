-- Safe to run: user_profiles is legacy and unused by the app.
-- Active table is public.profiles (used by sign up / log in).
-- trips.user_id references profiles.user_id, NOT user_profiles.

drop table if exists public.user_profiles cascade;
