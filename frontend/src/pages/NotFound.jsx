import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleBack = () => {
    if (isAuthenticated && user) {
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F0C] flex items-center justify-center p-6 animated-bg">
      <div className="glass border border-zinc-800/50 max-w-md w-full rounded-3xl shadow-2xl p-8 text-center space-y-6 animate-fadeIn">
        {/* Not Found Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/30 text-emerald-450 shadow-lg shadow-emerald-500/5">
            <MapPinOff className="w-10 h-10" />
          </div>
        </div>

        {/* Text details */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-display text-white tracking-tight">
            404 - Area Uncharted
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            The page you are looking for does not exist or has been relocated within the society portal database.
          </p>
        </div>

        {/* Return Button */}
        <button
          onClick={handleBack}
          className="btn-primary w-full py-3 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
          <span>{isAuthenticated ? 'Return to Dashboard' : 'Return to Login'}</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
