import React, { useState, useEffect } from 'react';

interface SignupScreenProps {
  onSwitchToLogin: () => void;
  onSignup: (email: string, password: string) => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSwitchToLogin, onSignup }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [formValid, setFormValid] = useState<boolean>(false);

  // Simple email validation regex
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password strength checker (basic example)
  const evaluatePasswordStrength = (password: string): string => {
    if (password.length < 6) {
      return 'Weak';
    } else if (password.length < 10) {
      return 'Moderate';
    }
    return 'Strong';
  };

  useEffect(() => {
    const newErrors: typeof errors = {};
    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (confirmPassword && confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);

    // Form is valid if no errors, email and password present, and confirmPassword matches (if present)
    setFormValid(
      email !== '' &&
      password !== '' &&
      (confirmPassword === '' || confirmPassword === password) &&
      Object.keys(newErrors).length === 0
    );

    setPasswordStrength(evaluatePasswordStrength(password));
  }, [email, password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValid) {
      onSignup(email, password);
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
            placeholder="Enter a secure password"
            className={`w-full rounded-xl px-4 py-3 bg-gray-800 border ${
              errors.password ? 'border-red-500' : 'border-gray-700'
            } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby="password-strength"
          />
          <p id="password-strength" className="mt-1 text-xs text-gray-400">Strength: <span className={`font-semibold ${
            passwordStrength === 'Strong' ? 'text-green-400' 
            : passwordStrength === 'Moderate' ? 'text-yellow-400' 
            : 'text-red-400'
          }`}>{passwordStrength}</span></p>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            className={`w-full rounded-xl px-4 py-3 bg-gray-800 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
            } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-describedby="confirm-error"
          />
          {errors.confirmPassword && <p id="confirm-error" className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
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
          Sign Up
        </button>

        {/* Alternate Option */}
        <p className="text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-green-500 hover:text-green-400 font-semibold transition-colors"
          >
            Log In
          </button>
        </p>

        {/* Legal Text */}
        <p className="text-center text-gray-500 text-xs mt-4">
          By signing up, you agree to our{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-400">
            Privacy Policy
          </a>.
        </p>

        {/* Optional Social Login buttons example */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
            aria-label="Sign up with Google"
            onClick={() => alert('Google signup onClick placeholder')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21.805 10.023h-9.757v3.953h5.614c-.244 1.578-1.81 4.63-5.614 4.63-3.39 0-6.155-2.798-6.155-6.25 0-3.452 2.765-6.25 6.155-6.25 1.922 0 3.214.823 3.956 1.54l2.7-2.6c-1.587-1.476-3.63-2.375-6.657-2.375-5.464 0-9.889 4.456-9.889 9.922 0 5.467 4.425 9.922 9.89 9.922 5.71 0 9.487-3.983 9.487-9.618 0-.642-.072-1.104-.155-1.488z" fill="#4285F4"/>
            </svg>
            Google
          </button>
          {/* Add Apple, Facebook, etc similarly */}
        </div>
      </form>
    </div>
  );
};

export default SignupScreen;
