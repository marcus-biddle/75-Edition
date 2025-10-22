-- Create users table with id, email, name, password hash, created_at
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text,
  name text,
  created_at timestamptz default timezone('utc', now()) not null
);

-- Enable Row Level Security (RLS) and policies
alter table users enable row level security;
create policy "Allow logged-in users to select their own data" on users for select using (auth.uid() = id);
create policy "Allow logged-in users to update their own data" on users for update using (auth.uid() = id);
