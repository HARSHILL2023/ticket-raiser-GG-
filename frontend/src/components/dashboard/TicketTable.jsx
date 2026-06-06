import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, TICKET_STATUS } from '../../utils/constants';
import { Play, Check, ChevronDown, ChevronUp, AlertCircle, FileSpreadsheet } from 'lucide-react';

export const TicketTable = ({ tickets = [], onStatusUpdate, loading = false }) => {
  const { user } = useAuth();
  const isManager = user?.role === ROLES.MANAGER;
  
  // Keep track of which description is expanded
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  // Format timestamp nicely
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ' ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div className="glass border border-zinc-800/40 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-zinc-500 text-xs mt-4 font-bold tracking-wider uppercase animate-pulse">Syncing ticket records...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="glass border border-zinc-800/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-600 mb-4 shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold font-display text-zinc-200">No Tickets Found</h3>
        <p className="text-zinc-500 text-xs max-w-sm mt-2 leading-relaxed">
          There are no complaints registered matching the current filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="glass border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-zinc-950/65 border-b border-zinc-850 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
              {isManager && (
                <>
                  <th className="px-6 py-4">Flat No</th>
                  <th className="px-6 py-4">Resident</th>
                </>
              )}
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created Date</th>
              {isManager && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/60 text-zinc-350 text-sm font-medium">
            {tickets.map((ticket) => {
              const isExpanded = expandedTicketId === ticket.id;
              
              return (
                <React.Fragment key={ticket.id}>
                  {/* Main Row */}
                  <tr className="even:bg-zinc-950/15 hover:bg-zinc-900/25 transition-colors group">
                    {isManager && (
                      <>
                        <td className="px-6 py-4">
                          <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg text-xs font-bold">
                            {ticket.flatNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-200">{ticket.residentName}</td>
                      </>
                    )}
                    <td className="px-6 py-4 font-semibold text-slate-100">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => toggleExpand(ticket.id)}
                          className="text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <span className="truncate max-w-[200px] md:max-w-xs">{ticket.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <CategoryBadge category={ticket.category} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {formatDate(ticket.createdAt)}
                    </td>
                    
                    {/* Manager Status Toggle Action Buttons */}
                    {isManager && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {ticket.status === TICKET_STATUS.PENDING && (
                            <button
                              onClick={() => onStatusUpdate(ticket.id, TICKET_STATUS.IN_PROGRESS)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 hover:bg-emerald-900/35 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                              title="Start Work"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Work</span>
                            </button>
                          )}
                          {ticket.status === TICKET_STATUS.IN_PROGRESS && (
                            <button
                              onClick={() => onStatusUpdate(ticket.id, TICKET_STATUS.RESOLVED)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 border border-emerald-500 text-white hover:bg-emerald-500 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-500/10"
                              title="Resolve Ticket"
                            >
                              <Check className="w-3 h-3" />
                              <span>Resolve</span>
                            </button>
                          )}
                          {ticket.status === TICKET_STATUS.RESOLVED && (
                            <span className="text-xs text-zinc-650 italic pr-2">Resolved</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>

                  {/* Expanded Description Row */}
                  {isExpanded && (
                    <tr className="bg-zinc-950/35">
                      <td 
                        colSpan={isManager ? 8 : 5} 
                        className="px-8 py-4.5 border-l-2 border-emerald-500 text-zinc-400 text-sm leading-relaxed"
                      >
                        <div className="flex flex-col space-y-1.5">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                            Complaint Description:
                          </span>
                          <p className="whitespace-pre-line text-zinc-300 font-normal leading-relaxed">
                            {ticket.description || 'No detailed description provided.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;
