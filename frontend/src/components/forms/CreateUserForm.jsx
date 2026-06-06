import React, { useState, useEffect } from 'react';
import { ROLES } from '../../utils/constants';
import { UserPlus, UserCheck, Shield } from 'lucide-react';

export const CreateUserForm = ({ onSubmit, onCancel, initialData = null, isSubmitting = false }) => {
  const isEditMode = !!initialData;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.MEMBER);
  const [flatNumber, setFlatNumber] = useState('');
  const [error, setError] = useState('');

  // Prepopulate if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setRole(initialData.role || ROLES.MEMBER);
      setFlatNumber(initialData.flatNumber || '');
      setPassword(''); // Password stays empty unless changing
    }
  }, [initialData]);

  const validate = () => {
    if (!name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }
    if (!email.trim()) {
      setError('Email address is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password checks
    if (!isEditMode && !password) {
      setError('Password is required for new users');
      return false;
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Role-specific check
    if (role === ROLES.MEMBER && !flatNumber.trim()) {
      setError('Flat number is required for society members');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name,
      email,
      role,
      flatNumber: role === ROLES.MEMBER ? flatNumber : ''
    };

    if (password) {
      payload.password = password;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left text-zinc-250">
      {error && (
        <div className="bg-rose-950/20 border border-rose-900/30 text-rose-450 p-3.5 rounded-xl text-xs font-semibold animate-shake">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="user-name" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Full Name
        </label>
        <input
          id="user-name"
          type="text"
          placeholder="e.g. Eleanor Vance"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          className="input-field"
          required
        />
      </div>

      {/* Email Address */}
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="user-email" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Email Address
        </label>
        <input
          id="user-email"
          type="email"
          placeholder="e.g. eleanor@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="input-field"
          required
        />
      </div>

      {/* Password */}
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="user-pass" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          {isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}
        </label>
        <input
          id="user-pass"
          type="password"
          placeholder={isEditMode ? '••••••••' : 'Password (min 6 characters)'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          className="input-field"
          required={!isEditMode}
        />
      </div>

      {/* Role Picker */}
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="user-role" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Account Role
        </label>
        <select
          id="user-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isSubmitting}
          className="input-field bg-zinc-950 text-zinc-200"
          required
        >
          <option value={ROLES.MEMBER}>Flat Member (Resident)</option>
          <option value={ROLES.MANAGER}>Property Manager</option>
        </select>
      </div>

      {/* Conditionally Display Flat Number for Member */}
      {role === ROLES.MEMBER && (
        <div className="flex flex-col space-y-1.5 animate-fadeIn">
          <label htmlFor="user-flat" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            Flat Number
          </label>
          <input
            id="user-flat"
            type="text"
            placeholder="e.g. A-102, C-504"
            value={flatNumber}
            onChange={(e) => setFlatNumber(e.target.value)}
            disabled={isSubmitting}
            className="input-field"
            required
          />
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/35 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn-secondary py-2 px-4 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary py-2 px-5 text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : isEditMode ? (
            <>
              <UserCheck className="w-4 h-4" />
              <span>Update User</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create User</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;
