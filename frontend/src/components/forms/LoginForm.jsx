import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email) {
      setError('Email address is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    try {
      await login(email, password);
      // AuthContext handles redirecting upon successful session setting
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Alert Error Box */}
      {error && (
        <div className="bg-rose-950/20 border border-rose-900/30 text-rose-450 p-3.5 rounded-xl text-xs font-semibold leading-relaxed animate-shake">
          {error}
        </div>
      )}

      {/* Email Input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="text-xs font-bold text-zinc-400 uppercase tracking-wider text-left">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            disabled={isSubmitting}
            className="w-full !pl-12 input-field text-sm"
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Password
          </label>
          <a href="#" className="text-xs font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your secure password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            disabled={isSubmitting}
            className="w-full !pl-12 !pr-12 input-field text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-start space-x-2">
        <input 
          type="checkbox" 
          id="remember" 
          className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900 bg-zinc-900 accent-emerald-500 cursor-pointer"
        />
        <label htmlFor="remember" className="text-xs font-medium text-zinc-400 cursor-pointer select-none">
          Remember me for 30 days
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary py-3.5 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            <span>Secure Login</span>
          </>
        )}
      </button>

    </form>
  );
};

export default LoginForm;
