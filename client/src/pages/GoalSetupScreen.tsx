import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';

export const HABIT_CHOICES = [
  { id: 'diet', label: 'Follow diet plan', unit: 'daily completion', type: 'boolean', goal: 'true' },
  { id: 'water', label: 'Drink water', unit: 'ounces', type: 'numeric', goal: 128 },
  { id: 'workout1', label: 'Complete workout (outdoor)', unit: 'minutes', type: 'numeric', goal: 45},
  { id: 'workout2', label: 'Complete workout (any location)', unit: 'minutes', type: 'numeric', goal: 45},
  { id: 'read', label: 'Read nonfiction book', unit: 'pages', type: 'numeric', goal: 10 },
  { id: 'progress_photo', label: 'Take progress photo', unit: 'daily completion', type: 'boolean', goal: 'true' },
] as const;

// Screen only appears when no profile is made.
const GoalSetupScreen = () => {
    const { user, fetchProfile, createProfile } = useAuth();
    const { initDashboard, dailyLog } = useDashboard();
  const [selectedHabitIds, setSelectedHabitIds] = useState<(typeof HABIT_CHOICES[number])['id'][]>([]);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

const toggleHabit = (habitId: (typeof HABIT_CHOICES[number])['id']) => {
  setShowError(false);
  setSelectedHabitIds((prev) =>
    prev.includes(habitId)
      ? prev.filter((id) => id !== habitId)
      : [...prev, habitId]
  );
};

  const handleSubmit = async () => {
    if (selectedHabitIds.length === 0) {
      setShowError(true);
      return;
    }

    if (!user) {
      alert('User must be logged in to save goals');
      return;
    }
    
    await initDashboard();
    
    
    await fetchProfile(user.id);

    setShowSuccess(true);
  };

  const startBoard = async () => {
    if (!user) return;

    await createProfile({              
        email: user.email,
        name: user.email,       
    })
    await initDashboard()
};

  useEffect(() => {

  }, [])

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6 md:px-12">
        <div className="text-center rounded-3xl bg-linear-to-r from-green-600 to-green-500 p-10 shadow-lg max-w-sm mx-auto">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-900">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="mb-2 text-3xl font-extrabold text-white">
            Great, your goals are set!
          </h2>
          <p className="text-lg text-green-200">Time to start tracking.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black pt-12 pb-24 px-6 md:px-12 flex flex-col justify-center">
      <div className="mx-auto max-w-3xl rounded-3xl bg-gray-900 p-10 shadow-lg">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Set Your 75 Hard Challenge Goals {dailyLog?.id}
          </h1>
          <p className="text-lg text-gray-400">
            Choose the daily habits you want to track. You can adjust these later.
          </p>
        </header>

        {/* Habit Selection Section */}
        <section className="mb-6 rounded-2xl bg-gray-800 p-6 shadow-inner border border-gray-700">
          <p className="mb-6 text-sm text-gray-400">
            Select the habits you'll track daily in your challenge.
          </p>

          <div className="space-y-3">
            {HABIT_CHOICES.map((habit, i) => {
              const isSelected = selectedHabitIds.includes(habit.id);
              return (
                <label
                  key={habit.id}
                  className={`flex cursor-pointer items-start rounded-xl border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-900'
                      : 'border-transparent bg-gray-700 hover:border-gray-500'
                  } ${i < HABIT_CHOICES.length - 1 ? 'mb-2' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleHabit(habit.id)}
                    className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="ml-4 flex flex-col">
                    <span
                      className={`text-lg font-semibold ${
                        isSelected ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {habit.label}
                      {isSelected && <span className="ml-1 text-purple-400">*</span>}
                    </span>
                    <small
                      className={`text-sm ${
                        isSelected ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {habit.unit}
                    </small>
                  </div>
                </label>
              );
            })}
          </div>

          {showError && (
            <div className="mt-4 rounded-lg border border-red-600 bg-red-900 p-4">
              <p className="text-sm font-semibold text-red-400">
                Please select at least one habit to continue.
              </p>
            </div>
          )}
        </section>

        {/* Custom Habit Button */}
        {/* <button
          type="button"
          className="mb-6 w-full rounded-2xl border-2 border-dashed border-gray-600 bg-gray-900 py-3 text-gray-500 transition hover:border-purple-600 hover:text-purple-600"
        >
          + Add custom habit
        </button> */}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedHabitIds.length === 0}
          className={`w-full rounded-2xl py-4 text-lg font-bold transition ${
            selectedHabitIds.length === 0
              ? 'cursor-not-allowed bg-gray-700 text-gray-500'
              : 'bg-linear-to-r from-purple-700 to-blue-700 text-white hover:from-purple-800 hover:to-blue-800 shadow-lg hover:shadow-xl'
          }`}
          aria-disabled={selectedHabitIds.length === 0}
        >
          Let's go!
        </button>

        {selectedHabitIds.length === 0 && (
          <p className="mt-2 text-center text-sm text-gray-500">
            Select at least one habit to continue
          </p>
        )}
      </div>
    </section>
  );
};

export default GoalSetupScreen;
