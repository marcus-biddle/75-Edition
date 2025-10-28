-- Create habit_entries table linking daily_logs and habits with value and completion status
CREATE TABLE IF NOT EXISTS habit_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  value NUMERIC,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  CONSTRAINT unique_log_habit UNIQUE(daily_log_id, habit_id)
);

-- Enable Row Level Security
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;

-- Policy for selecting own habit entries (user must own the daily_log)
CREATE POLICY "Allow user to select own habit entries" ON habit_entries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs WHERE id = habit_entries.daily_log_id AND user_id = auth.uid()
    )
  );

-- Policy for inserting habit entries (validate ownership on insert)
CREATE POLICY "Allow user to insert own habit entries" ON habit_entries
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_logs WHERE id = habit_entries.daily_log_id AND user_id = auth.uid()
    )
  );

-- Policy for updating habit entries (validate ownership on update)
CREATE POLICY "Allow user to update own habit entries" ON habit_entries
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs WHERE id = habit_entries.daily_log_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_logs WHERE id = habit_entries.daily_log_id AND user_id = auth.uid()
    )
  );

-- Policy for deleting habit entries (validate ownership on delete)
CREATE POLICY "Allow user to delete own habit entries" ON habit_entries
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs WHERE id = habit_entries.daily_log_id AND user_id = auth.uid()
    )
  );
