import React, { useState } from 'react';
import { User, Check, Flame, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserStats {
  totalCompleted: number;
  currentStreak: number;
  bestStreak: number;
  overallProgress: number;
}

interface ProfileScreenProps {
  onBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const { logout, profile, updateUserName } = useAuth();

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(profile?.name ?? '');

  const userStats: UserStats = {
    totalCompleted: 11,
    currentStreak: 11,
    bestStreak: 11,
    overallProgress: 14.7
  };

  const handleSaveName = async () => {
    await updateUserName(tempName);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    if (!profile?.name) return;
    setTempName(profile?.name);
    setIsEditingName(false);
  };

  const handleLogout = async () => {
    try {
      await logout(); // this calls supabase.auth.signOut() and clears context user/session
      alert('Signed out successfully');
      // Optionally redirect user if you have routing, e.g. navigate to login page
    } catch (error: any) {
      alert(error.message || 'Sign out failed');
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-400 text-sm">Manage your account and personal information</p>
      </div>

      <div className="px-4 sm:px-6 pt-6 pb-8 max-w-3xl mx-auto space-y-8">
        {/* User Info Section */}
        <section>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex flex-col items-center text-center mb-6">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-linear-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-black" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors border-2 border-black">
                  <span className="text-black text-lg font-bold">+</span>
                </button>
              </div>

              {/* Name Section */}
              {isEditingName ? (
                <div className="w-full max-w-sm space-y-3">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white text-center focus:border-green-500 focus:outline-none"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveName}
                      className="flex-1 py-2 bg-green-500 text-black rounded-lg font-medium hover:bg-green-400 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-750 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{profile?.name?.split('').find(w => w === '@') ? 'Enter Name': profile?.name}</h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-gray-400 hover:text-green-500 transition-colors p-1"
                    aria-label="Edit name"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Email */}
              <div className="flex items-center gap-2 mt-2">
                <p className="text-gray-400">{profile?.email}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Snapshot */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-white">Your Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-400 text-sm">Completed</span>
              </div>
              <div className="text-2xl font-bold text-white">{userStats.totalCompleted}</div>
              <div className="text-xs text-gray-500">Total days</div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-gray-400 text-sm">Current Streak</span>
              </div>
              <div className="text-2xl font-bold text-orange-500">{userStats.currentStreak}</div>
              <div className="text-xs text-gray-500">Days in a row</div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-400 text-sm">Best Streak</span>
              </div>
              <div className="text-2xl font-bold text-yellow-500">{userStats.bestStreak}</div>
              <div className="text-xs text-gray-500">Personal best</div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-gray-400 text-sm">Progress</span>
              </div>
              <div className="text-2xl font-bold text-white">{userStats.overallProgress}%</div>
              <div className="text-xs text-gray-500">Of challenge</div>
            </div>
          </div>
        </section>

        {/* Account Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-white">Account Actions</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-white">Change Password</div>
                  <div className="text-sm text-gray-500">Update your security credentials</div>
                </div>
              </div>
              <span className="text-gray-500">→</span>
            </button>

            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-white">Manage Notifications</div>
                  <div className="text-sm text-gray-500">Control your reminders and alerts</div>
                </div>
              </div>
              <span className="text-gray-500">→</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-red-500">Log Out</div>
                  <div className="text-sm text-gray-500">Sign out of your account</div>
                </div>
              </div>
              <span className="text-gray-500">→</span>
            </button>
          </div>
        </section>

        {/* App Info */}
        {/* <section>
          <h2 className="text-lg font-semibold mb-4 text-white">App Info</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="font-medium text-white">Version</div>
              <div className="text-sm text-gray-400">1.0.0 (Build 100)</div>
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
              <div className="font-medium text-white">Contact Support</div>
              <span className="text-gray-500">→</span>
            </button>
          </div>
        </section> */}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pt-4 pb-8">
          <p>75 Hard Tracker</p>
          <p className="mt-1">Build better habits, one day at a time</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;