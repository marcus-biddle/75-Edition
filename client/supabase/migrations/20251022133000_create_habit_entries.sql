-- Create habit_entries linking logs and habits with value
create table if not exists habit_entries (
  id uuid primary key default gen_random_uuid(),
  daily_log_id uuid references daily_logs(id) on delete cascade,
  habit_id uuid references habits(id) on delete cascade,
  value numeric,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null,
  constraint unique_log_habit unique(daily_log_id, habit_id)
);

alter table habit_entries enable row level security;
create policy "Allow user to select own habit entries" on habit_entries for select using (
  exists (select 1 from daily_logs where id = habit_entries.daily_log_id and user_id = auth.uid())
);
create policy "Allow user to modify own habit entries" on habit_entries for insert, update, delete using (
  exists (select 1 from daily_logs where id = habit_entries.daily_log_id and user_id = auth.uid())
);
