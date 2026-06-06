import React from 'react';
import SignupForm from '../../components/forms/SignupForm';
import { Home } from 'lucide-react';

export const Signup = () => {
  return (
    <div className="glass border border-zinc-800/50 rounded-3xl shadow-2xl p-8 md:p-10 animate-fadeIn text-center mt-8 mb-8">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-5">
          <Home className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold font-display text-white tracking-tight leading-none mb-3">
          Join CTMS
        </h2>
        <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
          Create your account to access your community workspace.
        </p>
      </div>

      {/* Actual Form */}
      <SignupForm />
      
      {/* Small Footer */}
      <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
        <p className="text-xs text-zinc-500 font-medium">
          Already have an account?{' '}
          <a href="/login" className="text-emerald-500 hover:text-emerald-400 transition-colors">
            Sign in securely
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
