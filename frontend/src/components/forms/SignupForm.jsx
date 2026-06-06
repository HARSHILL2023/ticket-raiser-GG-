import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, User, Home as HomeIcon, UserPlus, Check, X } from 'lucide-react';

export const SignupForm = () => {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    flatNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Password Rules Validation
  const [passwordRules, setPasswordRules] = useState({
    min: false,
    upper: false,
    lower: false,
    num: false,
    special: false
  });

  useEffect(() => {
    const pwd = formData.password;
    setPasswordRules({
      min: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      num: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd)
    });
  }, [formData.password]);

  const allRulesMet = Object.values(passwordRules).every(Boolean);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Full Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email address';
    if (!formData.flatNumber.trim()) return 'Flat Number is required';
    if (!formData.password) return 'Password is required';
    if (!allRulesMet) return 'Please meet all password requirements';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        flatNumber: formData.flatNumber,
        password: formData.password
      });
      // AuthContext redirects on success
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alert Error Box */}
      {error && (
        <div className="bg-rose-950/20 border border-rose-900/30 text-rose-450 p-3.5 rounded-xl text-xs font-semibold leading-relaxed animate-shake">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="name" className="text-xs font-bold text-zinc-400 uppercase tracking-wider text-left">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            id="name"
            type="text"
            placeholder="John Smith"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full !pl-12 input-field text-sm"
            required
          />
        </div>
      </div>

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
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full !pl-12 input-field text-sm"
            required
          />
        </div>
      </div>

      {/* Flat Number */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="flatNumber" className="text-xs font-bold text-zinc-400 uppercase tracking-wider text-left">
          Flat Number
        </label>
        <div className="relative">
          <HomeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            id="flatNumber"
            type="text"
            placeholder="A-101"
            value={formData.flatNumber}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full !pl-12 input-field text-sm"
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="password" className="text-xs font-bold text-zinc-400 uppercase tracking-wider text-left">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a secure password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full !pl-12 !pr-12 input-field text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Password Strength Indicator */}
      <div className="bg-zinc-900/40 rounded-xl p-3 grid grid-cols-2 gap-2 mt-2">
        <div className={`flex items-center space-x-1.5 text-[10px] ${passwordRules.min ? 'text-emerald-500' : 'text-zinc-500'}`}>
          {passwordRules.min ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>8+ characters</span>
        </div>
        <div className={`flex items-center space-x-1.5 text-[10px] ${passwordRules.upper ? 'text-emerald-500' : 'text-zinc-500'}`}>
          {passwordRules.upper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>1 uppercase</span>
        </div>
        <div className={`flex items-center space-x-1.5 text-[10px] ${passwordRules.lower ? 'text-emerald-500' : 'text-zinc-500'}`}>
          {passwordRules.lower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>1 lowercase</span>
        </div>
        <div className={`flex items-center space-x-1.5 text-[10px] ${passwordRules.num ? 'text-emerald-500' : 'text-zinc-500'}`}>
          {passwordRules.num ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>1 number</span>
        </div>
        <div className={`flex items-center space-x-1.5 text-[10px] ${passwordRules.special ? 'text-emerald-500' : 'text-zinc-500'}`}>
          {passwordRules.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>1 special char</span>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="flex flex-col space-y-2 pt-2">
        <label htmlFor="confirmPassword" className="text-xs font-bold text-zinc-400 uppercase tracking-wider text-left">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your secure password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full !pl-12 !pr-12 input-field text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !allRulesMet || !formData.confirmPassword}
        className="w-full btn-primary py-3.5 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            <span>Create Secure Account</span>
          </>
        )}
      </button>
    </form>
  );
};

export default SignupForm;
