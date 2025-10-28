import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { HabitEntriesTable, type HabitEntry } from '../lib/supabaseOperations';
import { useDashboard } from '../context/DashboardContext';
import { HABIT_CHOICES } from './GoalSetupScreen';

interface HabitLogScreenProps {
  onBack: () => void;
  currentDate: string;
}

const HabitLogScreen: React.FC<HabitLogScreenProps> = ({ onBack, currentDate }) => {
  const { activeHabits, habitEntries, fetchHabitEntries } = useDashboard();

  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);
  const [tempEntries, setTempEntries] = useState<HabitEntry[] | undefined>(habitEntries);
  const [changed, hasChanged] = useState(false);

  const allHabitsValid = habitEntries && habitEntries.every(h =>
    h.is_completed
  );

  const handleNumericChange = (habitId: string, value: string, goal: number) => {
  const parsedValue = parseInt(value, 10) || 0;

  const updates = {
    value: parsedValue,
    is_completed: parsedValue >= goal,
  };

  setTempEntries(prev =>
    prev
      ? prev.map(entry =>
          entry.habit_id === habitId
            ? { ...entry, ...updates }
            : entry
        )
      : []
  );
};


  const toggleBoolean = async (habitId: string) => {
    setTempEntries(prev =>
      prev
        ? prev.map(entry =>
            entry.habit_id === habitId
              ? {
                  ...entry,
                  value: entry.value === 0 ? 1 : 0,
                  is_completed: !entry.is_completed,
                }
              : entry
          )
        : []
    );
  };

  const handleSave = async () => {
    console.log('starting save...')
  if (!tempEntries) return; // Guard if no entries

  try {
    // Prepare array of updates with id and changed fields
    const updates = tempEntries.map(entry => ({
      id: entry.id,
      changes: {
        value: entry.value,
        is_completed: entry.is_completed,
      },
    }));

    // Call your batch update function with this array
    const updatedEntries = await HabitEntriesTable.batchUpdateHabitEntries(updates);

    // Optionally update local state with updatedEntries from backend
    setTempEntries(updatedEntries);
    await fetchHabitEntries();

    // Show success message and go back after delay
    setShowSaveSuccess(true);
    onBack();

  } catch (error) {
    console.error('Failed to save habit entries in batch:', error);
    // Optionally show error UI
  }
};

const checkForChanges = () => {
  if (!tempEntries || !habitEntries) {
    if (changed !== false) hasChanged(false);
    return;
  }
  if (tempEntries.length !== habitEntries.length) {
    console.log('lengths are not same')
    if (changed !== true) hasChanged(true);
    return;
  }
  const isSame = tempEntries.every((obj, idx) => {
    const obj2 = habitEntries[idx];
    return (Object.keys(obj) as (keyof HabitEntry)[]).every(key => obj[key] === obj2[key]);
  });

  if (changed !== !isSame) hasChanged(!isSame);
};

useEffect(() => {
  checkForChanges();
}, [tempEntries]);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-800">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
        >
          <span className="text-xl">←</span>
          <span className="text-sm">Back to Dashboard</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Log Your Habits for Today</h1>
        <p className="text-gray-400 text-sm">{currentDate}</p>
      </div>

      {/* Habit Inputs List */}
      <div className="px-4 sm:px-6 pt-6 max-w-3xl mx-auto">
        <div className="space-y-4">
        {tempEntries && activeHabits && tempEntries
        .filter(e => activeHabits.some(h => e.habit_id === h.id))
        .map(entry => {
          const habitTable = activeHabits.find(h => h.id === entry.habit_id);
          const habitChoice = HABIT_CHOICES.find(c => c.label === habitTable?.name);
          
          return (
          <div
          key={entry.id}
          className={`bg-gray-900 rounded-2xl p-5 border-2 transition-all ${
          entry.is_completed ? 'border-green-500/50' : 'border-gray-800'
          }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
            <label htmlFor={entry.id} className="block font-semibold text-white mb-1">
            {habitTable?.name}
            {habitTable?.unit && (
            <span className="text-gray-500 font-normal"> ({habitTable.unit})</span>
            )}
            </label>
            <p className="text-xs text-gray-500">
            {habitTable?.habit_type === 'boolean'
            ? `Goal: ${habitTable?.unit}`
            : `Goal: ${habitChoice?.goal} ${habitTable?.unit}`}
            </p>
            </div>
            {entry.is_completed && entry.value && habitChoice && habitChoice.type !== 'boolean' && entry.value >= habitChoice.goal && (
              <div className="bg-green-500 rounded-full p-2">
              <Check className="w-4 h-4 text-black" />
              </div>
            )}
            </div>

            {/* Body */}
            {habitTable?.habit_type === 'numeric' && habitChoice && habitChoice.type !== 'boolean' ? (
            <div className="space-y-2">
              <input
              id={entry.id}
              type="number"
              value={entry.value && entry.value > 0 ? entry.value : ''}
              onChange={e => handleNumericChange(entry.habit_id, e.target.value, habitChoice?.goal)}
              placeholder="Enter amount"
              className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
              min={0}
              />
              {habitChoice && (entry.value ?? 0) < habitChoice.goal  && (
              <p className="text-xs text-yellow-500 flex items-center gap-1">
              <span>⚠</span>
              {`${(habitChoice?.goal ?? 0) - (entry.value ?? 0)} ${habitTable?.unit} more to reach goal`}
              </p>
              )}
              {entry.is_completed && (
              <p className="text-xs text-green-500 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Goal reached!
              </p>
              )}
            </div>
            ) : (
            <button
            onClick={() => toggleBoolean(entry.habit_id)}
            className={`w-full py-4 rounded-xl font-medium text-lg transition-all ${
            entry.is_completed
            ? 'bg-green-500 text-black'
            : 'bg-gray-800 text-white hover:bg-gray-750 border-2 border-gray-700'
            }`}
            >
            {entry.is_completed ? '✓ Completed' : 'Mark as Complete'}
            </button>
            )}
          </div>
          );
        })}

        </div>
      </div>

      {/* Save Button - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black via-black to-transparent pt-6 px-4 sm:px-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleSave}
            disabled={!changed}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              changed 
                ? 'bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/20'
                : 'bg-gray-800/40 text-gray-600 cursor-not-allowed'
            }`}
          >
            {changed ? "Update tasks" : 'No changes occurred.'}
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-black px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span className="font-semibold">Saved successfully!</span>
        </div>
      )}
    </div>
  );
};

export default HabitLogScreen;
