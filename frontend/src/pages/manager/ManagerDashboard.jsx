import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import SummaryCard from '../../components/dashboard/SummaryCard';
import TicketTable from '../../components/dashboard/TicketTable';
import { ticketAPI } from '../../api/endpoints';
import { TICKET_STATUS } from '../../utils/constants';
import { 
  Inbox, 
  Clock, 
  Activity, 
  CheckCircle2, 
  Search, 
  Filter, 
  RefreshCw 
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ManagerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Pending', 'In Progress', 'Resolved'

  const fetchAllTickets = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await ticketAPI.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching global tickets:', error);
      toast.error('Failed to reload global ticket feed');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  // Update Status Callback with Optimistic UI updates
  const handleStatusUpdate = async (ticketId, nextStatus) => {
    const originalTickets = [...tickets];
    
    // Optimistic Update: Modify locally in state first
    setTickets((prevTickets) =>
      prevTickets.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t))
    );
    
    const statusLabels = {
      [TICKET_STATUS.IN_PROGRESS]: 'Ticket marked In Progress',
      [TICKET_STATUS.RESOLVED]: 'Ticket marked Resolved'
    };
    
    toast.success(statusLabels[nextStatus] || 'Ticket status updated');

    try {
      await ticketAPI.updateTicketStatus(ticketId, nextStatus);
    } catch (error) {
      console.error('Failed updating ticket status:', error);
      toast.error('Server error. Reverting change.');
      // Rollback on error
      setTickets(originalTickets);
    }
  };

  // Compile global statistics counts
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === TICKET_STATUS.PENDING || t.status === TICKET_STATUS.IN_PROGRESS).length,
    pending: tickets.filter((t) => t.status === TICKET_STATUS.PENDING).length,
    resolved: tickets.filter((t) => t.status === TICKET_STATUS.RESOLVED).length
  };

  // Filter and Search Logic
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !searchLower ||
      ticket.title?.toLowerCase().includes(searchLower) ||
      ticket.flatNumber?.toLowerCase().includes(searchLower) ||
      ticket.residentName?.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Header
        title="Manager Maintenance Desk"
        description="Monitor complaints raised by residents, track active maintenance, and close resolved issues."
        action={
          <button
            onClick={() => fetchAllTickets(true)}
            className="btn-secondary py-2.5 px-4 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            title="Reload Tickets List"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Sync</span>
          </button>
        }
      />

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Complaints"
          value={stats.total}
          icon={Inbox}
          description="Cumulative tickets raised"
          variant="primary"
        />
        <SummaryCard
          title="Open Complaints"
          value={stats.open}
          icon={Activity}
          description="Pending & In-Progress tasks"
          variant="info"
        />
        <SummaryCard
          title="Pending Response"
          value={stats.pending}
          icon={Clock}
          description="Awaiting feedback"
          variant="warning"
        />
        <SummaryCard
          title="Closed/Resolved"
          value={stats.resolved}
          icon={CheckCircle2}
          description="Closed tickets"
          variant="success"
        />
      </div>

      {/* Feed Filters & Search Bar controls */}
      <div className="bg-zinc-950/30 border border-zinc-800/50 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search flat number, title, resident..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-zinc-200 placeholder-zinc-500 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-zinc-950 border border-zinc-850 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {['All', TICKET_STATUS.PENDING, TICKET_STATUS.IN_PROGRESS, TICKET_STATUS.RESOLVED].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-zinc-900 text-white border border-zinc-800/80 shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Ticket Grid Table */}
      <div className="pt-2">
        <TicketTable 
          tickets={filteredTickets} 
          onStatusUpdate={handleStatusUpdate} 
          loading={loading} 
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;
