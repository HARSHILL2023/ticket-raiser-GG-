import React from 'react';
import { Clock, Loader, CheckCircle2 } from 'lucide-react';
import { TICKET_STATUS } from '../../utils/constants';

export const StatusBadge = ({ status }) => {
  const styles = {
    [TICKET_STATUS.PENDING]: {
      bg: 'bg-zinc-900 text-zinc-400 border-zinc-800',
      icon: Clock,
      label: 'Pending'
    },
    [TICKET_STATUS.IN_PROGRESS]: {
      bg: 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50',
      icon: Loader,
      label: 'In Progress'
    },
    [TICKET_STATUS.RESOLVED]: {
      bg: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
      icon: CheckCircle2,
      label: 'Resolved'
    }
  };

  const current = styles[status] || {
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/25',
    icon: Clock,
    label: status || 'Unknown'
  };

  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.bg}`}>
      <Icon className={`w-3.5 h-3.5 ${status === TICKET_STATUS.IN_PROGRESS ? 'animate-spin-slow' : ''}`} />
      <span>{current.label}</span>
    </span>
  );
};

export default StatusBadge;
