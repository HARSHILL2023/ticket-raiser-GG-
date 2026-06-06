import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleBackRedirect = () => {
    if (isAuthenticated && user) {
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F0C] flex items-center justify-center p-6 animated-bg">
      <div className="glass border border-red-950/20 max-w-md w-full rounded-3xl shadow-2xl p-8 text-center space-y-6 animate-fadeIn">
        {/* Red Shield Alarm Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-red-950/15 border border-red-950/20 text-red-400 shadow-lg shadow-red-500/5 animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-display text-white tracking-tight">
            403 - Access Restrained
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            You do not have administrative clearance or matching roles to view this workspace. Please contact your property representative if you believe this is an error.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleBackRedirect}
          className="btn-secondary w-full py-3 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 border border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-455" />
          <span>{isAuthenticated ? 'Back to Dashboard' : 'Back to Login'}</span>
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
