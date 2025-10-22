-- Create daily_logs with unique constrain for user + date
create table if not exists daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null,
  constraint unique_user_date unique(user_id, date)
);

alter table daily_logs enable row level security;
create policy "Allow user to select own logs" on daily_logs for select using (auth.uid() = user_id);
create policy "Allow user to modify own logs" on daily_logs for insert, update, delete using (auth.uid() = user_id);
