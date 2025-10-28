import React, { useEffect, useState, type ReactNode } from 'react';
import { Check, Flame, Calendar, Home, History, Settings, TrendingUp, Award, Menu, User, X, LogOut, LogOutIcon } from 'lucide-react';
import SettingsScreen from '../pages/SettingsScreen';
import ProgressCalendarView from '../pages/HistoryScreen';
import ProfileScreen from '../pages/ProfileScreen';
import LoginScreen from '../pages/LoginScreen';
import SignupScreen from '../pages/SignUpScreen';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

export const AuthContainer: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const { signup, login } = useAuth();

  const switchToLogin = () => setIsLoginView(true);
  const switchToSignup = () => setIsLoginView(false);

  const handleSignup = async (email: string, password: string) => {
    try {
      await signup(email, password);
      alert('User created! Please check your email for confirmation if required.');
      setIsLoginView(true);
    } catch (error: any) {
      alert(error.message || 'Signup failed');
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error: any) {
      alert(error.message || 'Login failed');
    }
  };

  return (
    <div>
      {isLoginView ? (
        <LoginScreen onSwitchToSignup={switchToSignup} onLogin={handleLogin} />
      ) : (
        <SignupScreen onSwitchToLogin={switchToLogin} onSignup={handleSignup} />
      )}
    </div>
  );
};

// Improved Navigation Component
export const Navigation = ({ children }: { children?: ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { user, loading, logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Handle tab changes and close mobile menu
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  if (loading) return <LoadingScreen />;
  if (!user) return <AuthContainer />;
  
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'settings':
        return <SettingsScreen onBack={() => handleTabChange('home')} />;
      case 'history':
        return <ProgressCalendarView onBack={() => handleTabChange('home')} />;
      case 'profile':
        return <ProfileScreen onBack={() => handleTabChange('home')} />;
      case 'home':
      default:
        return children;
    }
  };


  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-900 border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo/Brand */}
            <button 
              onClick={() => handleTabChange('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-linear-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">75</span>
              </div>
              <span className="text-white font-semibold text-lg hidden sm:block">75 Hard Tracker</span>
            </button>

            {/* Center - Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {false && navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
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
              {/* <button 
                onClick={() => handleTabChange('profile')} 
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-gray-800 text-green-500' 
                    : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-750'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Profile</span>
              </button> */}
              <button 
                onClick={() => logout()} 
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-gray-800 text-green-500' 
                    : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-750'
                }`}
              >
                <LogOutIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
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
              {false && navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
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
              <button 
                onClick={() => logout()}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all sm:hidden ${
                  activeTab === 'profile' 
                    ? 'bg-gray-800 text-green-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <LogOutIcon className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1">
        {renderActiveScreen()}
      </main>
    </div>
  );
};
