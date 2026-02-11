-- Create a table for books
create table if not exists public.books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  isbn text unique,
  description text,
  cover_url text,
  total_copies int default 1,
  available_copies int default 1,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for reservations
create table if not exists public.reservations (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- Clerk User ID
  book_id uuid references public.books(id) on delete cascade,
  status text check (status in ('pending', 'active', 'overdue', 'returned')) default 'pending',
  reserved_date timestamp with time zone default timezone('utc'::text, now()) not null,
  due_date timestamp with time zone not null,
  returned_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for user profiles (to store custom data)
create table if not exists public.profiles (
  id text primary key, -- Clerk User ID
  full_name text,
  avatar_url text,
  fines decimal(10, 2) default 0.00,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for renewal requests
create table if not exists public.renewal_requests (
  id uuid default gen_random_uuid() primary key,
  reservation_id uuid references public.reservations(id) on delete cascade,
  user_id text not null, -- Clerk User ID
  user_name text not null,
  book_title text not null,
  request_date timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.books enable row level security;
alter table public.reservations enable row level security;
alter table public.profiles enable row level security;
alter table public.renewal_requests enable row level security;

-- Policies for Books (Everyone can read)
create policy "Books are viewable by everyone" on public.books
  for select using (true);

-- Policies for Reservations (Allow all operations since we use Clerk for auth)
create policy "Anyone can view reservations" on public.reservations
  for select using (true);

create policy "Anyone can insert reservations" on public.reservations
  for insert with check (true);

create policy "Anyone can update reservations" on public.reservations
  for update using (true);

-- Policies for Profiles (Allow all operations)
create policy "Anyone can view profiles" on public.profiles
  for select using (true);

create policy "Anyone can insert profiles" on public.profiles
  for insert with check (true);

create policy "Anyone can update profiles" on public.profiles
  for update using (true);

-- Admin Policies for Books (Allow all operations)
create policy "Anyone can insert books" on public.books
  for insert with check (true);

create policy "Anyone can delete books" on public.books
  for delete using (true);

create policy "Anyone can update books" on public.books
  for update using (true);
