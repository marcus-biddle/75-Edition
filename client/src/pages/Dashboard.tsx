import React, { useState } from 'react';
import { Check, Flame, Calendar, Home, History, Settings, TrendingUp, Award } from 'lucide-react';
import HabitLogScreen from './HabitLog';
import SettingsScreen from './SettingsScreen';

interface Habit {
  id: string;
  name: string;
  unit?: string;
  type: 'numeric' | 'boolean';
  value?: number;
  goal?: number;
  completed: boolean;
}

type DayStatus = 'completed' | 'current' | 'upcoming';

interface Day {
  day: number;
  status: DayStatus;
}

const Dashboard: React.FC = () => {
  const [currentDay] = useState<number>(12);
  const [streak] = useState<number>(11);
  const [showLogScreen, setShowLogScreen] = useState(false);

  const [habits, setHabits] = useState<Habit[]>([
    { id: 'water', name: 'Drink water', unit: 'oz', type: 'numeric', value: 0, goal: 128, completed: false },
    { id: 'steps', name: 'Track daily steps', unit: 'steps', type: 'numeric', value: 0, goal: 10000, completed: false },
    { id: 'workout', name: 'Complete workout', type: 'boolean', completed: false },
    { id: 'read', name: 'Read', unit: 'min', type: 'numeric', value: 0, goal: 30, completed: false },
    { id: 'supplements', name: 'Take supplements', type: 'boolean', completed: true },
  ]);

  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'settings'>('home');

  const completedHabits = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const progressPercentage = (completedHabits / totalHabits) * 100;

  const handleSaveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleNumericChange = (habitId: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setHabits(habits.map(h =>
      h.id === habitId ? { ...h, value: numValue } : h
    ));
  };

  const toggleBoolean = (habitId: string) => {
    setHabits(habits.map(h =>
      h.id === habitId ? { ...h, completed: !h.completed } : h
    ));
  };

  const markNumericComplete = (habitId: string) => {
    setHabits(habits.map(h =>
      h.id === habitId ? { ...h, completed: (h.value ?? 0) >= (h.goal ?? 0) } : h
    ));
  };

  const getDaysArray = (): Day[] => {
    const days: Day[] = [];
    for (let i = 1; i <= 75; i++) {
      days.push({
        day: i,
        status: i < currentDay ? 'completed' : i === currentDay ? 'current' : 'upcoming',
      });
    }
    return days;
  };

  const getMotivationalMessage = (): string => {
    if (completedHabits === totalHabits) {
      return "All habits completed today";
    } else if (completedHabits > 0) {
      const remaining = totalHabits - completedHabits;
      return `${remaining} habit${remaining > 1 ? 's' : ''} remaining`;
    } else {
      return "Ready to start your day";
    }
  };

  if (showLogScreen) {
    return (
      <HabitLogScreen 
        habits={habits}
        onSave={handleSaveHabits}
        onBack={() => setShowLogScreen(false)}
        currentDate={currentDate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">75 Hard</h1>
            <p className="text-gray-400 text-sm">Challenge Dashboard</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold">{streak} days</span>
          </div>
        </div>

        {/* Progress Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-900 rounded-2xl p-4">
            <div className="text-gray-400 text-xs mb-1">Day</div>
            <div className="text-2xl font-bold">{currentDay}</div>
            <div className="text-gray-500 text-xs">of 75</div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4">
            <div className="text-gray-400 text-xs mb-1">Streak</div>
            <div className="text-2xl font-bold text-orange-500">{streak}</div>
            <div className="text-gray-500 text-xs">consecutive</div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4">
            <div className="text-gray-400 text-xs mb-1">Today</div>
            <div className="text-2xl font-bold text-green-500">{completedHabits}/{totalHabits}</div>
            <div className="text-gray-500 text-xs">complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-900 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">Daily Progress</span>
            <span className="text-sm text-gray-400">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="relative w-full bg-gray-800 rounded-full h-2">
            <div
              className="absolute top-0 left-0 bg-linear-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-3">{getMotivationalMessage()}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Habits */}
          <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Today's Habits</h2>
                <TrendingUp className="w-5 h-5 text-gray-500" />
              </div>
              
              {habits.map(habit => (
                <button
                  key={habit.id}
                  onClick={() => setShowLogScreen(true)}
                  className={`w-full bg-gray-900 rounded-2xl p-4 sm:p-5 transition-all border text-left hover:border-gray-700 ${
                    habit.completed 
                      ? 'border-green-500/30' 
                      : 'border-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {habit.name}
                        {habit.unit && <span className="text-gray-500 font-normal"> ({habit.unit})</span>}
                      </h3>
                      <p className={`text-sm ${habit.completed ? 'text-green-500' : 'text-gray-500'}`}>
                        {habit.completed 
                          ? habit.type === 'numeric' 
                            ? `${habit.value} ${habit.unit}`
                            : '✓ Done'
                          : 'Not logged yet'
                        }
                      </p>
                    </div>
                    
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      habit.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-700'
                    }`}>
                      {habit.completed && (
                        <Check className="w-5 h-5 text-black" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

          {/* Sidebar - Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-5 sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Progress</h2>
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>

              <div className="grid grid-cols-7 gap-1.5 mb-6">
                {getDaysArray().slice(0, 35).map(day => (
                  <div
                    key={day.day}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                      day.status === 'completed'
                        ? 'bg-green-500 text-black'
                        : day.status === 'current'
                          ? 'bg-white text-black'
                          : 'bg-gray-800 text-gray-600'
                    }`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-400">Completed</span>
                  </div>
                  <span className="font-medium">{currentDay - 1}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded"></div>
                    <span className="text-gray-400">Current</span>
                  </div>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-800 rounded"></div>
                    <span className="text-gray-400">Remaining</span>
                  </div>
                  <span className="font-medium">{75 - currentDay}</span>
                </div>
              </div>

              {streak >= 7 && (
                <div className="mt-5 p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-yellow-500 text-sm">Milestone Unlocked</span>
                  </div>
                  <p className="text-gray-400 text-xs">7-day streak achieved</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
