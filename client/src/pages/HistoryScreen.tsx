import React, { useState } from 'react';
import { Award, Calendar } from 'lucide-react';

interface HabitDetail {
  name: string;
  unit?: string;
  completed: boolean;
  value?: number;
}

interface DayData {
  status: 'complete' | 'partial' | 'none';
  habits: HabitDetail[];
}

interface ProgressCalendarViewProps {
  onBack: () => void;
}

const ProgressCalendarView: React.FC<ProgressCalendarViewProps> = ({ onBack }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showDayDetail, setShowDayDetail] = useState<boolean>(false);

  // Mock data for demonstration
  const getDayData = (dayNum: number): DayData => {
    const statuses: DayData['status'][] = ['complete', 'partial', 'none'];
    const status = dayNum < 12 ? statuses[Math.floor(Math.random() * 2)] : 'none';

    const habits: HabitDetail[] = [
      { name: 'Water', unit: 'oz', completed: status === 'complete', value: status === 'complete' ? 128 : 80 },
      { name: 'Steps', unit: 'steps', completed: status === 'complete', value: status === 'complete' ? 10000 : 5000 },
      { name: 'Workout', completed: status !== 'none' },
      { name: 'Read', unit: 'min', completed: status === 'complete', value: status === 'complete' ? 30 : 15 },
      { name: 'Supplements', completed: status === 'complete' },
    ];

    return { status, habits };
  };

  const getDayColor = (dayNum: number): string => {
    const { status } = getDayData(dayNum);
    if (dayNum > 12) return 'bg-gray-800 text-gray-600';
    if (status === 'complete') return 'bg-green-500 text-black';
    if (status === 'partial') return 'bg-yellow-500 text-black';
    return 'bg-red-500/30 text-red-400';
  };

  const handleDayClick = (dayNum: number) => {
    if (dayNum <= 12) {
      setSelectedDay(dayNum);
      setShowDayDetail(true);
    }
  };

  const completedDays = Array.from({ length: 12 }, (_, i) => i + 1)
    .filter(day => getDayData(day).status === 'complete').length;

  const partialDays = Array.from({ length: 12 }, (_, i) => i + 1)
    .filter(day => getDayData(day).status === 'partial').length;

  const currentStreak = 11;
  const progressPercentage = (12 / 75) * 100;

  const selectedDayData = selectedDay ? getDayData(selectedDay) : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-800">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
        >
          <span className="text-xl">←</span>
          <span className="text-sm">Back to Dashboard</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Progress Calendar</h1>
        <p className="text-gray-400 text-sm">See your habit completion over the 75 days</p>
      </div>

      <div className="px-4 sm:px-6 pt-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Progress Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <div className="text-gray-400 text-xs mb-1">Days Completed</div>
              <div className="text-2xl font-bold text-green-500">{completedDays}</div>
              <div className="text-gray-500 text-xs">All habits</div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <div className="text-gray-400 text-xs mb-1">Partial Days</div>
              <div className="text-2xl font-bold text-yellow-500">{partialDays}</div>
              <div className="text-gray-500 text-xs">Some habits</div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <div className="text-gray-400 text-xs mb-1">Current Streak</div>
              <div className="text-2xl font-bold text-orange-500">{currentStreak}</div>
              <div className="text-gray-500 text-xs">Consecutive days</div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <div className="text-gray-400 text-xs mb-1">Progress</div>
              <div className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</div>
              <div className="text-gray-500 text-xs">12 of 75 days</div>
            </div>
          </div>

          {/* Milestone Indicators */}
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Milestones
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { day: 7, label: 'Week 1', unlocked: true },
                { day: 14, label: 'Week 2', unlocked: true },
                { day: 30, label: 'Month 1', unlocked: false },
                { day: 75, label: 'Complete', unlocked: false }
              ].map(milestone => (
                <div
                  key={milestone.day}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    milestone.unlocked
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-700 bg-gray-800'
                  }`}
                >
                  <div className={`text-lg font-bold ${milestone.unlocked ? 'text-yellow-500' : 'text-gray-500'}`}>
                    Day {milestone.day}
                  </div>
                  <div className={`text-xs ${milestone.unlocked ? 'text-yellow-400' : 'text-gray-600'}`}>
                    {milestone.unlocked ? '✓ ' : ''}{milestone.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Grid */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">75-Day Challenge</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-gray-400">Complete</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-gray-400">Partial</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 bg-gray-800 rounded"></div>
                      <span className="text-gray-400">Upcoming</span>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid - 15 rows x 5 columns = 75 days */}
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 75 }, (_, i) => i + 1).map(day => {
                    const isSelected = selectedDay === day;
                    const isPast = day <= 12;
                    const colorClass = getDayColor(day);

                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        disabled={!isPast}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-semibold transition-all ${colorClass} ${
                          isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : ''
                        } ${isPast ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}`}
                      >
                        <span>{day}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Day Detail Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 lg:sticky lg:top-24">
                {showDayDetail && selectedDayData ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Day {selectedDay}</h3>
                      <button
                        onClick={() => setShowDayDetail(false)}
                        className="text-gray-500 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div
                      className={`mb-4 p-3 rounded-xl ${
                        selectedDayData.status === 'complete'
                          ? 'bg-green-500/20 border border-green-500/30'
                          : selectedDayData.status === 'partial'
                            ? 'bg-yellow-500/20 border border-yellow-500/30'
                            : 'bg-red-500/20 border border-red-500/30'
                      }`}
                    >
                      <div
                        className={`text-sm font-semibold ${
                          selectedDayData.status === 'complete'
                            ? 'text-green-500'
                            : selectedDayData.status === 'partial'
                              ? 'text-yellow-500'
                              : 'text-red-400'
                        }`}
                      >
                        {selectedDayData.status === 'complete'
                          ? '✓ All Habits Completed'
                          : selectedDayData.status === 'partial'
                            ? '◐ Partially Completed'
                            : '✗ Not Completed'}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <h4 className="text-sm font-medium text-gray-400">Habit Details</h4>
                      {selectedDayData.habits.map((habit, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-white">{habit.name}</span>
                          <div className="flex items-center gap-2">
                            {habit.unit ? (
                              <span className={habit.completed ? 'text-green-500' : 'text-gray-500'}>
                                {habit.value} {habit.unit}
                              </span>
                            ) : (
                              <span className={habit.completed ? 'text-green-500' : 'text-gray-500'}>
                                {habit.completed ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl font-medium transition-colors">
                      View Full Log
                    </button>

                    {selectedDayData.status === 'complete' && (
                      <div className="mt-4 p-3 bg-linear-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                        <p className="text-xs text-yellow-500">🎉 Perfect day! Keep it up!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Select a day to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCalendarView;
