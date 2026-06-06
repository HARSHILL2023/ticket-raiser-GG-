import React from 'react';

export const SummaryCard = ({ title, value, icon: Icon, description, trend, variant = 'primary' }) => {
  const variantStyles = {
    primary: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5',
    secondary: 'text-zinc-400 bg-zinc-800/20 border-zinc-700/20 shadow-zinc-500/5',
    warning: 'text-emerald-300 bg-emerald-900/20 border-emerald-800/30 shadow-emerald-900/5',
    info: 'text-zinc-300 bg-zinc-900/50 border-zinc-800/50 shadow-zinc-900/5',
    success: 'text-emerald-500 bg-emerald-950/40 border-emerald-900/50 shadow-emerald-900/5',
    danger: 'text-zinc-400 bg-zinc-950/60 border-zinc-800/40 shadow-zinc-900/5'
  };

  const cardBorderVariant = {
    primary: 'hover:border-emerald-500/30',
    secondary: 'hover:border-zinc-700/30',
    warning: 'hover:border-emerald-700/30',
    info: 'hover:border-zinc-700/30',
    success: 'hover:border-emerald-600/30',
    danger: 'hover:border-zinc-600/30'
  };

  return (
    <div className={`glass-card p-6 flex flex-col justify-between h-full rounded-2xl md:rounded-3xl border border-zinc-850/80 ${cardBorderVariant[variant] || 'hover:border-emerald-500/30'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
            {title}
          </span>
          <span className="text-3xl font-extrabold font-display text-white tracking-tight">
            {value}
          </span>
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-2xl border ${variantStyles[variant] || variantStyles.primary}`}>
            <Icon className="w-6 h-6 flex-shrink-0" />
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="flex items-center space-x-2 pt-3 border-t border-zinc-800/40 mt-auto">
          {trend && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              trend.type === 'up' 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-zinc-800/30 text-zinc-400'
            }`}>
              {trend.value}
            </span>
          )}
          {description && (
            <span className="text-xs text-zinc-500 font-medium truncate">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
