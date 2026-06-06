import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, TICKET_STATUS } from '../../utils/constants';
import { Play, Check, ChevronDown, ChevronUp, Calendar, Home, User } from 'lucide-react';

export const TicketCard = ({ ticket, onStatusUpdate }) => {
  const { user } = useAuth();
  const isManager = user?.role === ROLES.MANAGER;
  const [expanded, setExpanded] = useState(false);

  // Format timestamp nicely
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="glass-card p-5.5 border border-zinc-800/50 rounded-2xl flex flex-col justify-between space-y-4 hover:border-zinc-700/40 transition-all duration-300">
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={ticket.category} />
          <StatusBadge status={ticket.status} />
        </div>

        <div>
          <h4 className="text-base font-semibold text-zinc-100 line-clamp-1 leading-snug">
            {ticket.title}
          </h4>
          <span className="text-xs text-zinc-550 flex items-center gap-1.5 mt-2">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-zinc-650" />
            {formatDate(ticket.createdAt)}
          </span>
        </div>

        {/* Resident / Flat info if manager */}
        {isManager && (
          <div className="flex items-center gap-4 text-[11px] font-bold py-2 px-3 bg-zinc-950/65 border border-zinc-850/60 rounded-xl text-zinc-350">
            <span className="flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-zinc-500" />
              {ticket.flatNumber}
            </span>
            <span className="flex items-center gap-1 border-l border-zinc-800 pl-4">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              {ticket.residentName}
            </span>
          </div>
        )}

        {/* Description body */}
        <div className="space-y-1.5 pt-1">
          <p className={`text-zinc-350 text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {ticket.description || 'No description provided.'}
          </p>
          {ticket.description && ticket.description.length > 80 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-emerald-450 font-bold hover:text-emerald-350 flex items-center gap-0.5 focus:outline-none transition-colors"
            >
              {expanded ? (
                <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>Read More <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Action Footer for Managers */}
      {isManager && ticket.status !== TICKET_STATUS.RESOLVED && (
        <div className="pt-3 border-t border-zinc-800/30 flex justify-end">
          {ticket.status === TICKET_STATUS.PENDING && (
            <button
              onClick={() => onStatusUpdate(ticket.id, TICKET_STATUS.IN_PROGRESS)}
              className="btn-primary py-2 px-4 text-xs font-semibold w-full cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Acknowledge & Start</span>
            </button>
          )}
          {ticket.status === TICKET_STATUS.IN_PROGRESS && (
            <button
              onClick={() => onStatusUpdate(ticket.id, TICKET_STATUS.RESOLVED)}
              className="btn-success py-2 px-4 text-xs font-semibold w-full cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Resolved</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketCard;
