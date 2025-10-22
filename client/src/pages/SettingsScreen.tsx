import React, { useState } from 'react';

interface Habit {
  id: string;
  name: string;
  active: boolean;
}

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(true);
  const [completionAlerts, setCompletionAlerts] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [autoBackup, setAutoBackup] = useState<boolean>(false);
  const [reminderTime, setReminderTime] = useState<string>('09:00');

  const [activeHabits, setActiveHabits] = useState<Habit[]>([
    { id: 'water', name: 'Drink water', active: true },
    { id: 'steps', name: 'Track daily steps', active: true },
    { id: 'workout', name: 'Complete workout', active: true },
    { id: 'read', name: 'Read', active: true },
    { id: 'supplements', name: 'Take supplements', active: true },
  ]);

  const toggleHabit = (habitId: string) => {
    setActiveHabits(activeHabits.map(h =>
      h.id === habitId ? { ...h, active: !h.active } : h
    ));
  };

  const handleExportData = () => {
    console.log('Exporting data...');
    alert('Data exported successfully!');
  };

  const handleImportData = () => {
    console.log('Importing data...');
    alert('Select a backup file to import');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      console.log('Logging out...');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-800">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
        >
          <span className="text-xl">←</span>
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400 text-sm">Customize your tracking experience</p>
      </div>

      <div className="px-4 sm:px-6 pt-6 pb-8 max-w-3xl mx-auto space-y-8">
        {/* Profile Settings */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-white">Profile Settings</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left">
              <div>
                <div className="font-medium text-white">Edit Name</div>
                <div className="text-sm text-gray-500">John Doe</div>
              </div>
              <span className="text-gray-500">→</span>
            </button>

            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left">
              <div>
                <div className="font-medium text-white">Edit Email</div>
                <div className="text-sm text-gray-500">john@example.com</div>
              </div>
              <span className="text-gray-500">→</span>
            </button>

            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left">
              <div className="font-medium text-white">Change Password</div>
              <span className="text-gray-500">→</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
            >
              <div className="font-medium text-red-500">Log Out</div>
              <span className="text-gray-500">→</span>
            </button>
          </div>
        </section>

        {/* Habit Goals */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-white">Manage Your Habits</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-4">
            {activeHabits.map(habit => (
              <div key={habit.id} className="flex items-center justify-between py-2">
                <span className="text-white font-medium">{habit.name}</span>
                <button
                  onClick={() => toggleHabit(habit.id)}
                  aria-pressed={habit.active}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    habit.active ? 'bg-green-500' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      habit.active ? 'transform translate-x-6' : ''
                    }`}
                  ></div>
                </button>
              </div>
            ))}

            <button className="w-full mt-4 py-3 bg-gray-800 hover:bg-gray-750 rounded-xl font-medium transition-colors">
              Edit Habits
            </button>
          </div>
        </section>

        {/* Notifications & Reminders */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-white">Notifications & Reminders</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Enable Reminders</div>
                <div className="text-sm text-gray-500">Daily habit notifications</div>
              </div>
              <button
                onClick={() => setRemindersEnabled(!remindersEnabled)}
                aria-pressed={remindersEnabled}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  remindersEnabled ? 'bg-green-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    remindersEnabled ? 'transform translate-x-6' : ''
                  }`}
                ></div>
              </button>
            </div>

            {remindersEnabled && (
              <div className="px-5 py-4">
                <label htmlFor="reminder-time" className="block font-medium text-white mb-2">
                  Reminder Time
                </label>
                <input
                  id="reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                />
              </div>
            )}

            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Completion Alerts</div>
                <div className="text-sm text-gray-500">Notify when habits are completed</div>
              </div>
              <button
                onClick={() => setCompletionAlerts(!completionAlerts)}
                aria-pressed={completionAlerts}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  completionAlerts ? 'bg-green-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    completionAlerts ? 'transform translate-x-6' : ''
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </section>

        {/* Display Preferences */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-white">Display Preferences</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Dark Mode</div>
                <div className="text-sm text-gray-500">Enable dark theme</div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                aria-pressed={darkMode}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-green-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    darkMode ? 'transform translate-x-6' : ''
                  }`}
                ></div>
              </button>
            </div>

            <div className="px-5 py-4">
              <label className="block font-medium text-white mb-3">Font Size</label>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`py-2 rounded-lg font-medium capitalize transition-all ${
                      fontSize === size
                        ? 'bg-green-500 text-black'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Data & Backup */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-white">Data & Backup</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
            <button
              onClick={handleExportData}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
            >
              <div>
                <div className="font-medium text-white">Export Data</div>
                <div className="text-sm text-gray-500">Download your habit data</div>
              </div>
              <span className="text-gray-500">→</span>
            </button>

            <button
              onClick={handleImportData}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
            >
              <div>
                <div className="font-medium text-white">Import Data</div>
                <div className="text-sm text-gray-500">Restore from backup</div>
              </div>
              <span className="text-gray-500">→</span>
            </button>

            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Auto-Backup</div>
                <div className="text-sm text-gray-500">Automatic daily backups</div>
              </div>
              <button
                onClick={() => setAutoBackup(!autoBackup)}
                aria-pressed={autoBackup}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  autoBackup ? 'bg-green-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    autoBackup ? 'transform translate-x-6' : ''
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </section>

        {/* App Info */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-white">App Info</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="font-medium text-white">Version</div>
              <div className="text-sm text-gray-500">1.0.0</div>
            </div>

            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left">
              <div className="font-medium text-white">Privacy Policy</div>
              <span className="text-gray-500">→</span>
            </button>

            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left">
              <div className="font-medium text-white">Terms of Service</div>
              <span className="text-gray-500">→</span>
            </button>

            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left">
              <div className="font-medium text-white">Support Contact</div>
              <span className="text-gray-500">→</span>
            </button>
          </div>
        </section>

        {/* Version Footer */}
        <div className="text-center text-gray-500 text-sm pt-4 pb-8">
          <p>75 Hard Tracker</p>
          <p className="mt-1">Made with ❤️ for habit builders</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
