-- Create the enum type for habit_type
CREATE TYPE habit_type AS ENUM ('boolean', 'numeric');

-- Create the habits table with habit_type column
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  unit TEXT,
  habit_type habit_type NOT NULL DEFAULT 'boolean',  -- Uses enum type here
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Policy for selecting own habits
CREATE POLICY "Allow user to select own habits" ON habits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for inserting own habits
CREATE POLICY "Allow user to insert own habits" ON habits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating own habits
CREATE POLICY "Allow user to update own habits" ON habits
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting own habits
CREATE POLICY "Allow user to delete own habits" ON habits
  FOR DELETE
  USING (auth.uid() = user_id);
