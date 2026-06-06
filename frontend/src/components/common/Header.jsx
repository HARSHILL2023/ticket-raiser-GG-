import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const Header = ({ title, description, action }) => {
  const { user } = useAuth();
  
  // Custom greetings depending on time of day
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-6 border-b border-zinc-800/40 gap-4">
      <div>
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
          <span>{getGreeting()}</span>
          <span>•</span>
          <span className="text-zinc-500">{user?.name}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight leading-none mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex items-center flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default Header;
