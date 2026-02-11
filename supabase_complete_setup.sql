-- Complete Supabase Setup Script with Renewal Requests
-- Run this ENTIRE script in your Supabase SQL Editor

-- STEP 1: Clean up existing policies
DROP POLICY IF EXISTS "Books are viewable by everyone" ON public.books;
DROP POLICY IF EXISTS "allow_all_select_books" ON public.books;
DROP POLICY IF EXISTS "allow_all_insert_books" ON public.books;
DROP POLICY IF EXISTS "allow_all_update_books" ON public.books;
DROP POLICY IF EXISTS "allow_all_delete_books" ON public.books;
DROP POLICY IF EXISTS "allow_all_select_reservations" ON public.reservations;
DROP POLICY IF EXISTS "allow_all_insert_reservations" ON public.reservations;
DROP POLICY IF EXISTS "allow_all_update_reservations" ON public.reservations;
DROP POLICY IF EXISTS "allow_all_delete_reservations" ON public.reservations;
DROP POLICY IF EXISTS "allow_all_select_profiles" ON public.profiles;
DROP POLICY IF EXISTS "allow_all_insert_profiles" ON public.profiles;
DROP POLICY IF EXISTS "allow_all_update_profiles" ON public.profiles;
DROP POLICY IF EXISTS "allow_all_delete_profiles" ON public.profiles;

-- STEP 2: Create renewal_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.renewal_requests (
  id uuid default gen_random_uuid() primary key,
  reservation_id uuid references public.reservations(id) on delete cascade,
  user_id text not null,
  user_name text not null,
  book_title text not null,
  request_date timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure books table has author field (in case it was missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' AND column_name = 'author'
  ) THEN
    ALTER TABLE public.books ADD COLUMN author text;
  END IF;
END $$;

-- STEP 3: Enable RLS on all tables
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renewal_requests ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create permissive policies for all tables

-- Books policies
CREATE POLICY "allow_all_select_books" ON public.books FOR SELECT USING (true);
CREATE POLICY "allow_all_insert_books" ON public.books FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update_books" ON public.books FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete_books" ON public.books FOR DELETE USING (true);

-- Reservations policies
CREATE POLICY "allow_all_select_reservations" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "allow_all_insert_reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update_reservations" ON public.reservations FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete_reservations" ON public.reservations FOR DELETE USING (true);

-- Profiles policies
CREATE POLICY "allow_all_select_profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "allow_all_insert_profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update_profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete_profiles" ON public.profiles FOR DELETE USING (true);

-- Renewal requests policies
CREATE POLICY "allow_all_select_renewals" ON public.renewal_requests FOR SELECT USING (true);
CREATE POLICY "allow_all_insert_renewals" ON public.renewal_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update_renewals" ON public.renewal_requests FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete_renewals" ON public.renewal_requests FOR DELETE USING (true);
