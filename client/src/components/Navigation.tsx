import React, { useState, type ReactNode } from 'react';
import { Check, Flame, Calendar, Home, History, Settings, TrendingUp, Award, Menu, User, X } from 'lucide-react';
import SettingsScreen from '../pages/SettingsScreen';
import ProgressCalendarView from '../pages/HistoryScreen';
import ProfileScreen from '../pages/ProfileScreen';

// Reusable Navigation Component
export const Navigation = ({ children }: { children?: ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, onTabChange] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div>
      <nav className="bg-gray-900 border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo/Brand */}
            <button 
              onClick={() => onTabChange('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-linear-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">75</span>
              </div>
              <span className="text-white font-semibold text-lg hidden sm:block">75 Hard Tracker</span>
            </button>

            {/* Center - Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gray-800 text-green-500' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right - User Actions */}
            <div className="flex items-center gap-3">
              <button onClick={() => onTabChange('profile')} className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors text-gray-300 ${
                      activeTab === 'profile' 
                        ? 'bg-gray-800 text-green-500' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}>
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Profile</span>
              </button>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gray-800 text-green-500' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all sm:hidden">
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>
            </div>
          </div>
        )}
      </nav>
      <div>
        {activeTab === 'settings' 
        ? <SettingsScreen onBack={() => onTabChange('home')} /> : activeTab === 'history'
        ? <ProgressCalendarView onBack={() => onTabChange('home')} /> : activeTab === 'profile'
        ? <ProfileScreen onBack={() => onTabChange('home')} /> : children}
      </div>
    </div>
  );
};