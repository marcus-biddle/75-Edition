-- Create habits table linked to users
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  unit text,
  is_active boolean default true,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

alter table habits enable row level security;
create policy "Allow user to select own habits" on habits for select using (auth.uid() = user_id);
create policy "Allow user to modify own habits" on habits for insert, update, delete using (auth.uid() = user_id);
