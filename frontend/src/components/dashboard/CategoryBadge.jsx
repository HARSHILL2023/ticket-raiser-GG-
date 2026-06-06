import React from 'react';
import { 
  Droplet, 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';

export const CategoryBadge = ({ category }) => {
  const styles = {
    Plumbing: {
      bg: 'bg-zinc-900/40 text-emerald-400 border-emerald-900/20',
      icon: Droplet
    },
    Electrical: {
      bg: 'bg-zinc-900/40 text-emerald-300 border-emerald-900/20',
      icon: Zap
    },
    Security: {
      bg: 'bg-zinc-900/40 text-zinc-300 border-zinc-800/30',
      icon: ShieldAlert
    },
    Cleaning: {
      bg: 'bg-zinc-900/40 text-emerald-500 border-emerald-900/20',
      icon: Sparkles
    },
    Others: {
      bg: 'bg-zinc-900/40 text-zinc-400 border-zinc-800/30',
      icon: HelpCircle
    }
  };

  const current = styles[category] || styles.Others;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium border ${current.bg}`}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
