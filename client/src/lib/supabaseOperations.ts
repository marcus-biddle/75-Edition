import { supabase } from './supabaseClient';

export type Profile = {
  id: string;
  email: string;
  password_hash?: string | null;
  name?: string | null;
  created_at: string;
};

export type HabitType = 'boolean' | 'numeric';

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  unit?: string | null;
  habit_type: HabitType;
  is_active?: boolean | null;
  created_at: string;
  updated_at: string;
};

export type DailyLog = {
  id?: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  created_at?: string;
  updated_at?: string;
};

export type HabitEntry = {
  id: string;
  daily_log_id: string;
  habit_id: string;
  value?: number | null;
  is_completed?: boolean | null;
  created_at: string;
  updated_at: string;
};

// Users CRUD

export async function createUser(user: Omit<Profile, 'id' | 'created_at'>): Promise<Profile | null> {
  const { data, error } = await supabase.from('users').insert(user).single();
  if (error) throw error;
  return data;
}

export async function getUser(id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function updateUser(id: string, updates: Partial<Omit<Profile, 'id' | 'created_at'>>): Promise<Profile | null> {
  const { data, error } = await supabase.from('users').update(updates).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function deleteUser(id: string): Promise<boolean> {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// Habits CRUD

export async function createHabit(habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>): Promise<Habit | null> {
  const { data, error } = await supabase.from('habits').insert(habit).single();
  if (error) throw error;
  return data;
}

export async function getHabit(id: string): Promise<Habit | null> {
  const { data, error } = await supabase.from('habits').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data ?? null;
}


async function updateHabit(
  id: string,
  updates: Partial<Omit<Habit, 'id' | 'created_at' | 'updated_at'>>
): Promise<Habit | null> {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data ?? null;
}

async function createHabits(
  userId: string,
  habitsToInsert: Array<{
    label: string;
    unit?: string | null;
    type: 'boolean' | 'numeric';
  }>
): Promise<Habit[]> {
  // Prepare insert objects
  const insertData = habitsToInsert.map(habit => ({
    user_id: userId,
    name: habit.label,
    unit: habit.unit ?? null,
    habit_type: habit.type,
    is_active: true,
  }));

  // Insert habits and return inserted records
  const { data, error } = await supabase
    .from('habits')
    .insert(insertData) // must be an array
    .select(); // ensures Supabase returns the inserted rows

  if (error) {
    console.error('Error inserting habits:', error);
    return [];
  }

  console.log('Inserted habits:', data);
  return data ?? [];
}



export async function deleteHabit(id: string): Promise<boolean> {
  const { error } = await supabase.from('habits').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// DailyLogs CRUD

async function createDailyLog(
  log: Omit<DailyLog, 'id' | 'created_at' | 'updated_at'>
): Promise<DailyLog | null> {
  const { data, error } = await supabase
    .from('daily_logs')
    .insert([log])
    .select()
    .single();

  console.log('Inserted Daily Log:', data);

  if (error) {
    console.error('Error inserting daily log:', error);
    throw error;
  }

  return data ?? null;
}


export async function getDailyLog(userId: string, date: string): Promise<DailyLog> {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ?? null;
}

// Get all logs from user
export async function getDailyLogs(userId: string): Promise<DailyLog[]> {
  const { data, error } = await supabase.from('daily_logs').select('*').eq('user_id', userId);
  if (error) throw error;
  return data || [];
}

export async function updateDailyLog(id: string, updates: Partial<Omit<DailyLog, 'id' | 'created_at' | 'updated_at'>>): Promise<DailyLog | null> {
  const { data, error } = await supabase.from('daily_logs').update(updates).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function deleteDailyLog(id: string): Promise<boolean> {
  const { error } = await supabase.from('daily_logs').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// HabitEntries CRUD

export async function createHabitEntry(entry: Omit<HabitEntry, 'id' | 'created_at' | 'updated_at'>): Promise<HabitEntry | null> {
  const { data, error } = await supabase.from('habit_entries').insert(entry).single();
  if (error) throw error;
  return data;
}

async function createHabitEntries(
  dailyLogId: string,
  habitsToCreate: Array<{
    id: string;
    // other habit fields if needed
  }>
): Promise<HabitEntry[]> {
  if (!dailyLogId || habitsToCreate.length === 0) return [];

  // Prepare data for insertion
  const insertData = habitsToCreate.map(habit => ({
    daily_log_id: dailyLogId,
    habit_id: habit.id,
    value: 0,            // default habit value (numeric or boolean placeholder)
    is_completed: false, // default completion state
  }));

  // Insert records and return all inserted rows
  const { data, error } = await supabase
    .from('habit_entries')
    .insert(insertData)  // must be an array
    .select();           // ensures Supabase returns all inserted rows

  if (error) {
    console.error('Error inserting habit entries:', error);
    return [];
  }

  console.log('Inserted habit entries:', data);
  return data ?? null;
}

const batchUpdateHabitEntries = async (updates: { id: string; changes: Partial<HabitEntry> }[]) => {
  const promises = updates.map(({ id, changes }) =>
    supabase
      .from('habit_entries')
      .update(changes)
      .eq('id', id)
      .select()
      .single()
  );

  const results = await Promise.all(promises);
  return results.filter(r => !r.error).map(r => r.data);
};

export async function getHabitEntry(id: string): Promise<HabitEntry | null> {
  const { data, error } = await supabase.from('habit_entries').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getHabitEntries(dailyLogId: string): Promise<HabitEntry[] | []> {
  const { data, error } = await supabase
    .from('habit_entries')
    .select('*, daily_logs!inner(user_id)') // inner join to daily_logs for user_id filter
    .eq('daily_log_id', dailyLogId)

  if (error) throw error;
  return data ?? [];
}


export async function updateHabitEntry(id: string, updates: Partial<Omit<HabitEntry, 'id' | 'created_at' | 'updated_at'>>): Promise<HabitEntry | null> {
  const { data, error } = await supabase.from('habit_entries').update(updates).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function deleteHabitEntry(id: string): Promise<boolean> {
  const { error } = await supabase.from('habit_entries').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export const UserTable = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
}

export const HabitsTable = {
    createHabit,
    createHabits,
    updateHabit,
    deleteHabit,
    getHabit,
    getHabits
}

export const DailyLogsTable = {
    getDailyLog,
    getDailyLogs,
    createDailyLog,
    updateDailyLog,
    deleteDailyLog,
}

export const HabitEntriesTable = {
    getHabitEntry,
    getHabitEntries,
    createHabitEntry,
    createHabitEntries,
    batchUpdateHabitEntries,
    updateHabitEntry,
    deleteHabitEntry
}