import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import SummaryCard from '../../components/dashboard/SummaryCard';
import TicketTable from '../../components/dashboard/TicketTable';
import TicketForm from '../../components/forms/TicketForm';
import { ticketAPI } from '../../api/endpoints';
import { TICKET_STATUS } from '../../utils/constants';
import { 
  ClipboardList, 
  Clock, 
  Loader2, 
  CheckCircle, 
  Plus, 
  X, 
  LifeBuoy 
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MemberDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Member's personal tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketAPI.getMyTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching member tickets:', error);
      toast.error('Failed to sync ticket records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Submit ticket creation handler
  const handleCreateTicket = async (ticketData) => {
    setSubmitting(true);
    try {
      const newTicket = await ticketAPI.createTicket(ticketData);
      setTickets((prev) => [newTicket, ...prev]);
      toast.success('Ticket submitted successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  // Compile stats counts
  const stats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === TICKET_STATUS.PENDING).length,
    inProgress: tickets.filter((t) => t.status === TICKET_STATUS.IN_PROGRESS).length,
    resolved: tickets.filter((t) => t.status === TICKET_STATUS.RESOLVED).length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Header
        title="My Maintenance Panel"
        description="Raise society complaints, track ongoing fixes, and view resolved support tickets for your flat."
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-2.5 px-4 text-xs font-semibold cursor-pointer shadow-primary-500/15"
          >
            <Plus className="w-4 h-4" />
            <span>Raise Complaint</span>
          </button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Registered"
          value={stats.total}
          icon={ClipboardList}
          description="Total raised issues"
          variant="primary"
        />
        <SummaryCard
          title="Awaiting Review"
          value={stats.pending}
          icon={Clock}
          description="Pending management action"
          variant="warning"
        />
        <SummaryCard
          title="In Progress"
          value={stats.inProgress}
          icon={Loader2}
          description="Technician assigned"
          variant="info"
        />
        <SummaryCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle}
          description="Successfully completed issues"
          variant="success"
        />
      </div>

      {/* Ticket List Header */}
      <div className="pt-4">
        <div className="flex items-center space-x-2 text-slate-100 font-bold mb-4">
          <LifeBuoy className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-display">Active Complaint Feed</h2>
        </div>

        {/* Tickets Grid/Table */}
        <TicketTable tickets={tickets} loading={loading} />
      </div>

      {/* Raise Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-[#0B0F0C]/80 backdrop-blur-sm transition-opacity"
          ></div>
          
          {/* Modal Container */}
          <div className="glass border border-zinc-800 rounded-3xl w-full max-w-lg p-6.5 relative z-10 animate-scaleUp shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-850">
              <h3 className="text-lg font-bold font-display text-white">Raise New Society Ticket</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <TicketForm 
              onSubmit={handleCreateTicket} 
              onCancel={() => setIsModalOpen(false)}
              isSubmitting={submitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
