import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  unit?: string;
  type: 'numeric' | 'boolean';
  value?: number;
  goal?: number;
  completed: boolean;
}

interface HabitLogScreenProps {
  habits: Habit[];
  onSave: (habits: Habit[]) => void;
  onBack: () => void;
  currentDate: string;
}

const HabitLogScreen: React.FC<HabitLogScreenProps> = ({ habits, onSave, onBack, currentDate }) => {
  const [localHabits, setLocalHabits] = useState<Habit[]>(habits);
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);

  const handleNumericChange = (habitId: string, value: string) => {
    const parsedValue = parseInt(value, 10) || 0;
    setLocalHabits(localHabits.map(h =>
      h.id === habitId
        ? { ...h, value: parsedValue, completed: parsedValue >= (h.goal ?? 0) }
        : h
    ));
  };

  const toggleBoolean = (habitId: string) => {
    setLocalHabits(localHabits.map(h =>
      h.id === habitId ? { ...h, completed: !h.completed } : h
    ));
  };

  const allHabitsValid = localHabits.every(h =>
    h.type === 'boolean' ? h.completed : (h.value ?? 0) >= (h.goal ?? 0)
  );

  const handleSave = () => {
    onSave(localHabits);
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
      onBack();
    }, 1500);
  };

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
          {localHabits.map(habit => (
            <div
              key={habit.id}
              className={`bg-gray-900 rounded-2xl p-5 border-2 transition-all ${
                habit.completed ? 'border-green-500/50' : 'border-gray-800'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <label htmlFor={habit.id} className="block font-semibold text-white mb-1">
                    {habit.name}
                    {habit.unit && <span className="text-gray-500 font-normal"> ({habit.unit})</span>}
                  </label>
                  {habit.type === 'numeric' && (
                    <p className="text-xs text-gray-500">Goal: {habit.goal} {habit.unit}</p>
                  )}
                </div>
                {habit.completed && (
                  <div className="bg-green-500 rounded-full p-2">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                )}
              </div>

              {habit.type === 'numeric' ? (
                <div className="space-y-2">
                  <input
                    id={habit.id}
                    type="number"
                    value={habit.value ?? ''}
                    onChange={e => handleNumericChange(habit.id, e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
                    min={0}
                  />
                  {habit.value !== undefined && habit.value > 0 && habit.value < (habit.goal ?? 0) && (
                    <p className="text-xs text-yellow-500 flex items-center gap-1">
                      <span>⚠</span>
                      {`${(habit.goal ?? 0) - habit.value} ${habit.unit} more to reach goal`}
                    </p>
                  )}
                  {habit.completed && (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Goal reached!
                    </p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => toggleBoolean(habit.id)}
                  className={`w-full py-4 rounded-xl font-medium text-lg transition-all ${
                    habit.completed
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-800 text-white hover:bg-gray-750 border-2 border-gray-700'
                  }`}
                >
                  {habit.completed ? '✓ Completed' : 'Mark as Complete'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent pt-6 px-4 sm:px-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleSave}
            disabled={!allHabitsValid}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              allHabitsValid
                ? 'bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/20'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {allHabitsValid ? "Save Today's Log" : 'Complete all habits to save'}
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
