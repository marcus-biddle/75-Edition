// DashboardContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode
} from 'react';
import { useAuth } from './AuthContext';
import {
  DailyLogsTable,
  HabitEntriesTable,
  HabitsTable,
  type DailyLog,
  type Habit,
  type HabitEntry,
} from '../lib/supabaseOperations';
import { HABIT_CHOICES } from '../pages/GoalSetupScreen';

interface DashboardContextType {
  loading: boolean;
  dailyLog: DailyLog | null;
  habitEntries: HabitEntry[] | undefined;
  habits: Habit[] | undefined;
  activeHabits: Habit[] | undefined;
  streak: number | null;
  createHabits: () => Promise<Habit[] | undefined>;
  toggleActiveHabit: (habitId: string) => Promise<void>;
  fetchDailyLog: () => Promise<DailyLog | undefined>;
  fetchHabits: () => Promise<Habit[] | undefined>;
  fetchHabitEntries: () => Promise<HabitEntry[] | undefined>;
  createHabitEntries: () => Promise<HabitEntry[] | null | undefined>;
  createDailyLog: () => Promise<void>;
}


const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context)
    throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const { user } = useAuth();

  const [loading] = useState(false);
  // const [initialized, setInitialized] = useState(false);

  const [streak, setStreak] = useState<number | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[] | undefined>(undefined);

  const [habits, setHabits] = useState<Habit[] | undefined>(undefined);
  const activeHabits = useMemo(() => habits && habits.filter(h => h.is_active), [habits]);

  const fetchStreak = useCallback(async () => {
    if (!user) return;
    try {
      const logs = await DailyLogsTable.getDailyLogs(user.id);
      setStreak(logs.length);
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  }, [user]);

  const fetchDailyLog = useCallback(async () => {
    if (!user) return;

    const now = new Date();
    const date = now.toISOString().split('T')[0];

    try {
      const log = await DailyLogsTable.getDailyLog(user.id, date);
      setDailyLog(log);
      return log
    } catch (error) {
      console.error('Error fetching daily log:', error);
    }
  }, [user]);

  const createDailyLog = useCallback(async () => {
  if (!user) return;

  const foundLog = await fetchDailyLog();
  if (foundLog) return;

  const now = new Date();
  const date = now.toISOString().split('T')[0];

  try {
    const log = await DailyLogsTable.createDailyLog({user_id: user.id, date});
    setDailyLog(log);
  } catch (error) {
    console.error('Error creating daily log:', error);
  }
}, [user, setDailyLog]);

  const fetchHabitEntries = useCallback(async () => {
  if (!user?.id) return;
  if (habitEntries) return;

  try {
    const log = await fetchDailyLog()
    if (!log || !log.id) {
      setHabitEntries(undefined);
      return;
    }

    const habitEntries = await HabitEntriesTable.getHabitEntries(log.id);

    let activeEntries: HabitEntry[] | undefined = [];

    if (!habits) {
        const habitsData = await fetchHabits();
        activeEntries = habitsData && habitEntries.filter(e => habitsData.some(h => h.id === e.habit_id && h.is_active));
    } else {
        activeEntries = habitEntries.filter(e => habits.some(h => h.id === e.habit_id && h.is_active));
    }
    
    setHabitEntries(activeEntries && activeEntries.length > 0 ? activeEntries : undefined);
    return activeEntries && activeEntries.length > 0 ? activeEntries : undefined;
  } catch (error) {
    console.error('Error fetching habit entries:', error);
  }
}, [user?.id, setHabitEntries]);

const createHabitEntries = useCallback(async () => {
  if (!user?.id) return null;
  console.log('this is habit entiries', habitEntries)

  const foundHabitEntries = await fetchHabitEntries();
  console.log('foundHabitEntries', foundHabitEntries)
  if (foundHabitEntries) return;

  try {
    // Fetch or generate the current daily log for the user
    const log = await fetchDailyLog();
    if (!log || !log?.id) return;

    console.log('Does habits exist:', habits);
    const foundHabits = await fetchHabits();

    if (!foundHabits) return;

    // Prepare habit entries with required relational fields
    const habitEntriesToCreate = foundHabits.map(habit => ({
      id: habit.id,
    }));

    // Create all habit entries in bulk
    const habitEntries = await HabitEntriesTable.createHabitEntries(log.id, habitEntriesToCreate);
    if (!habitEntries) {
      console.error('No habit entries created.');
      return null;
    }

    console.log('fetched habitEntries', habitEntries);

    // Filter only active entries (habits still marked active)
    const activeEntries = habitEntries.filter(e =>
      foundHabits.some(h => h.id === e.habit_id && h.is_active)
    );

    setHabitEntries(activeEntries);
  } catch (error) {
    console.error('Error creating habit entries:', error);
    return null;
  }
}, [user?.id, habits, setHabitEntries]);

const fetchHabits = useCallback(async () => {
    if (!user?.id) return;

    try {
      const habits = await HabitsTable.getHabits(user.id);
      setHabits(habits)
      return habits.length === 0 ? undefined : habits;
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  }, [user, setHabits]);

const createHabits = useCallback(async () => {
  if (!user?.id)  return [];
  if (habits && habits.length > 0) return habits;

  const foundHabits = await fetchHabits();
  console.log('habits found...', foundHabits);
  if (foundHabits) return;

  const habitsToInsert = HABIT_CHOICES.map(habit => ({
    label: habit.label,
    unit: habit.unit,
    type: habit.type,
  }));

  console.log('habitsToInsert', habitsToInsert)

  const habitsData = await HabitsTable.createHabits(user.id, habitsToInsert);
  setHabits(habitsData);
  return habitsData;
}, [user?.id]);

// const initDashboard = useCallback(async () => {
//   if (!user || loading) return;

//   setLoading(true);

//   try {
//     await fetchDailyLog();

//     if (!dailyLog) await createDailyLog();

//     //   const newHabits: Habit[] = await createHabits();

//     //   createHabitEntries(newHabits);
//     //   fetchStreak()

//     console.log('New User Dashboard initialized...');
    
//   } catch (error) {
//     console.error('Error initializing dashboard:', error);
//   } finally {
//     setLoading(false);
//     setInitialized(true);
//   }
// }, [user, loading, fetchDailyLog, fetchHabits, fetchHabitEntries]);

// const refreshDashboard = useCallback(async () => {
//   if (!user || loading) return;

//   setLoading(true);

//   try {
//     // Fetch streak, habits, and habit entries in parallel with valid daily log id
//     await Promise.all([
//       fetchDailyLog(),
//       fetchHabits(),
//       fetchHabitEntries(),
//       fetchStreak()
//     ]);

//     console.log('Dashboard refreshed successfully');
    
//   } catch (error) {
//     console.error('Error refreshing dashboard:', error);
//   } finally {
//     setLoading(false);
//     setInitialized(true);
//   }
// }, [user, loading, fetchDailyLog, fetchHabits, fetchHabitEntries]);

  // Toggle habit active/inactive
  const toggleActiveHabit = useCallback(
    async (habitId: string) => {
      if (!user || !habits) return;

      try {
        const habit = habits && habits.find(h => h.id === habitId);
        if (!habit) {
          console.warn('Habit not found');
          return;
        }

        const updatedIsActive = !habit.is_active;
        const updatedHabit = await HabitsTable.updateHabit(habitId, {
          is_active: updatedIsActive
        });
        if (!updatedHabit) throw new Error('Failed to update habit');

        setHabits(prev =>
          prev && prev.map(h =>
            h.id === habitId ? { ...h, is_active: updatedIsActive } : h
          )
        );
      } catch (error) {
        console.error('Error toggling habit active state:', error);
      }
    },
    [user, habits]
  );

useEffect(() => {
    if (!user) return;
    if (dailyLog && habits && habitEntries) return;

    if (!dailyLog) {
      createDailyLog();
    }

    if (!habits || habits.length === 0) {
      console.log('creating habits...');
      createHabits();
    }

    if (!habitEntries || habitEntries.length === 0) {
      console.log('creating habit entries...');
      createHabitEntries();
    }

    if (!streak) {
      console.log('fetching streak....')
      fetchStreak();
    }
}, [user, dailyLog, habits, habitEntries]);

  // Memoized context value
  const value = useMemo(
  () => ({
    loading,
    habits,
    activeHabits,
    streak,
    dailyLog,
    habitEntries,
    createHabits,
    toggleActiveHabit,
    fetchDailyLog,
    fetchHabits,
    fetchHabitEntries,
    createHabitEntries,
    createDailyLog
  }),
  [
    loading,
    habits,
    activeHabits,
    streak,
    dailyLog,
    habitEntries,
    createHabits,
    toggleActiveHabit,
    fetchDailyLog,
    fetchHabits,
    fetchHabitEntries,
    createHabitEntries,
    createDailyLog       
  ]
);


  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
