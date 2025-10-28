import React, { useState, useEffect } from 'react';

interface LoginScreenProps {
  onSwitchToSignup: () => void;
  onLogin: (email: string, password: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitchToSignup, onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formValid, setFormValid] = useState<boolean>(false);

  // Simple email validation regex
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    const newErrors: typeof errors = {};
    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);

    setFormValid(
      email !== '' &&
      password !== '' &&
      Object.keys(newErrors).length === 0
    );
  }, [email, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValid) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <header className="mb-10 text-center">
        <h1 className="text-white text-4xl font-extrabold tracking-tight">75 Hard Tracker</h1>
      </header>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 rounded-2xl p-8 shadow-lg max-w-md w-full space-y-6 border border-gray-800"
        noValidate
      >
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`w-full rounded-xl px-4 py-3 bg-gray-800 border ${
              errors.email ? 'border-red-500' : 'border-gray-700'
            } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className={`w-full rounded-xl px-4 py-3 bg-gray-800 border ${
              errors.password ? 'border-red-500' : 'border-gray-700'
            } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        {/* Call to Action Button */}
        <button
          type="submit"
          disabled={!formValid}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            formValid
              ? 'bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/20 cursor-pointer'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
          aria-disabled={!formValid}
        >
          Log In
        </button>

        {/* Alternate Option */}
        <p className="text-center text-gray-500 text-sm">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-green-500 hover:text-green-400 font-semibold transition-colors"
          >
            Sign Up
          </button>
        </p>

        {/* Legal Text */}
        <p className="text-center text-gray-500 text-xs mt-4">
          By logging in, you agree to our{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-400">
            Privacy Policy
          </a>.
        </p>
      </form>
    </div>
  );
};

export default LoginScreen;
