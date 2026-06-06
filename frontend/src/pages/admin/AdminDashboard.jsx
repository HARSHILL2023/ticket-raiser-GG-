import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import SummaryCard from '../../components/dashboard/SummaryCard';
import CreateUserForm from '../../components/forms/CreateUserForm';
import { adminAPI } from '../../api/endpoints';
import { ROLES } from '../../utils/constants';
import { 
  Users, 
  ShieldAlert, 
  UserCog, 
  Plus, 
  X, 
  Trash2, 
  Edit2, 
  ShieldCheck,
  Building,
  AlertTriangle 
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({ unresolvedTickets: 0, activeMembers: 0, totalManagers: 0, resolvedTickets: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeUserToEdit, setActiveUserToEdit] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation modal states
  const [userToDelete, setUserToDelete] = useState(null);

  // Sync users and metrics from real API
  const syncDashboardData = async () => {
    setLoading(true);
    try {
      const [usersData, metricsData] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getMetrics()
      ]);
      setUsers(usersData);
      setMetrics({
        unresolvedTickets: metricsData.unresolvedTickets,
        activeMembers: metricsData.activeMembers,
        totalManagers: metricsData.totalManagers,
        resolvedTickets: metricsData.resolvedTickets,
      });
    } catch (error) {
      console.error('Failed syncing admin dashboard:', error);
      toast.error('Failed to sync system database logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncDashboardData();
  }, []);

  // Submit Handler: Creates or Updates user
  const handleUserFormSubmit = async (userData) => {
    setSubmitting(true);
    try {
      if (activeUserToEdit) {
        // Edit Mode
        const updatedUser = await adminAPI.updateUser(activeUserToEdit.id, userData);
        setUsers((prev) => prev.map((u) => (u.id === activeUserToEdit.id ? updatedUser : u)));
        // Refresh metrics after user update
        adminAPI.getMetrics().then((m) => setMetrics({ unresolvedTickets: m.unresolvedTickets, activeMembers: m.activeMembers, totalManagers: m.totalManagers, resolvedTickets: m.resolvedTickets })).catch(() => {});
        toast.success('User profile updated successfully!');
      } else {
        // Create Mode
        const newUser = await adminAPI.createUser(userData);
        setUsers((prev) => [...prev, newUser]);
        toast.success('User account registered successfully!');
        // Refresh metrics after new user
        adminAPI.getMetrics().then((m) => setMetrics({ unresolvedTickets: m.unresolvedTickets, activeMembers: m.activeMembers, totalManagers: m.totalManagers, resolvedTickets: m.resolvedTickets })).catch(() => {});
      }
      setIsModalOpen(false);
      setActiveUserToEdit(null);
    } catch (error) {
      console.error('User submission error:', error);
      const msg = error.response?.data?.message || error.message || 'Action failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete User Handler
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setSubmitting(true);
    try {
      await adminAPI.deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      toast.success('User account deleted successfully.');
      setUserToDelete(null);
      // Refresh metrics after deletion
      adminAPI.getMetrics().then((m) => setMetrics({ unresolvedTickets: m.unresolvedTickets, activeMembers: m.activeMembers, totalManagers: m.totalManagers, resolvedTickets: m.resolvedTickets })).catch(() => {});
    } catch (error) {
      console.error('Delete error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to delete user';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setActiveUserToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setActiveUserToEdit(user);
    setIsModalOpen(true);
  };

  // Stats come from the real metrics API
  const stats = metrics;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Header
        title="Admin Control Center"
        description="Register society members, configure manager access keys, and review community operations metrics."
        action={
          <button
            onClick={openCreateModal}
            className="btn-primary py-2.5 px-4 text-xs font-semibold cursor-pointer shadow-primary-500/15"
          >
            <Plus className="w-4 h-4" />
            <span>Add User Account</span>
          </button>
        }
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          title="Active Society Members"
          value={stats.activeMembers}
          icon={Users}
          description="Flat residents registered"
          variant="primary"
        />
        <SummaryCard
          title="Property Managers"
          value={stats.totalManagers}
          icon={UserCog}
          description="Assigned administrators"
          variant="info"
        />
        <SummaryCard
          title="Unresolved Complaints"
          value={stats.unresolvedTickets}
          icon={ShieldAlert}
          description="Pending & In Progress tickets"
          variant="warning"
        />
      </div>

      {/* User Listing Section */}
      <div className="pt-4">
        <div className="flex items-center space-x-2.5 text-zinc-100 font-bold mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-display font-semibold">Registered System Accounts</h2>
        </div>

        {loading ? (
          <div className="glass border border-zinc-800/40 rounded-2xl p-10 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-10 h-10 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-zinc-500 text-xs mt-4 font-bold tracking-wider uppercase animate-pulse">Syncing society directories...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="glass border border-zinc-800/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-zinc-300">No Accounts Found</h3>
            <p className="text-zinc-500 text-xs mt-2">There are no member or manager accounts registered in the database.</p>
          </div>
        ) : (
          <div className="glass border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-zinc-950/65 border-b border-zinc-850 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">System Role</th>
                    <th className="px-6 py-4">Flat Info</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60 text-zinc-350 text-sm font-medium">
                  {users.map((item) => (
                    <tr key={item.id} className="even:bg-zinc-950/15 hover:bg-zinc-900/25 transition-colors">
                      <td className="px-6 py-4 font-semibold text-zinc-200">{item.name}</td>
                      <td className="px-6 py-4 text-zinc-400">{item.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                          item.role === ROLES.ADMIN
                            ? 'bg-zinc-900 text-zinc-300 border-zinc-700'
                            : item.role === ROLES.MANAGER
                            ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/25'
                            : 'bg-zinc-900/50 text-zinc-400 border-zinc-800'
                        }`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.role === ROLES.MEMBER ? (
                          <span className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-zinc-550" />
                            <span className="font-bold text-zinc-300">{item.flatNumber || 'Not Assigned'}</span>
                          </span>
                        ) : (
                          <span className="text-zinc-550 italic text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.role === ROLES.ADMIN ? (
                          <span className="text-zinc-550 italic text-xs pr-4">Protected</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                              title="Edit User profile"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setUserToDelete(item)}
                              className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => {
              setIsModalOpen(false);
              setActiveUserToEdit(null);
            }}
            className="absolute inset-0 bg-[#0B0F0C]/80 backdrop-blur-sm transition-opacity"
          ></div>
          
          {/* Modal Content */}
          <div className="glass border border-zinc-800 rounded-3xl w-full max-w-md p-6.5 relative z-10 animate-scaleUp shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-850">
              <h3 className="text-lg font-bold font-display text-white">
                {activeUserToEdit ? 'Update User Details' : 'Register New Society User'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setActiveUserToEdit(null);
                }}
                className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CreateUserForm 
              onSubmit={handleUserFormSubmit} 
              onCancel={() => {
                setIsModalOpen(false);
                setActiveUserToEdit(null);
              }}
              initialData={activeUserToEdit}
              isSubmitting={submitting}
            />
          </div>
        </div>
      )}

      {/* Delete User Confirmation Dialog Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setUserToDelete(null)}
            className="absolute inset-0 bg-[#0B0F0C]/80 backdrop-blur-sm transition-opacity"
          ></div>
          
          <div className="glass border border-zinc-800 rounded-3xl w-full max-w-sm p-6 relative z-10 animate-scaleUp shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-zinc-900/50 border border-zinc-800 text-zinc-400 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-zinc-500" />
              </div>
              
              <div>
                <h3 className="text-lg font-bold font-display text-white">Confirm User Deletion</h3>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                  Are you sure you want to delete the account for <strong className="text-zinc-250 font-bold">{userToDelete.name}</strong> ({userToDelete.email})? This action is permanent.
                </p>
              </div>
              
              <div className="flex items-center gap-3 w-full pt-2">
                <button
                  onClick={() => setUserToDelete(null)}
                  disabled={submitting}
                  className="btn-secondary w-full text-xs font-semibold py-2.5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={submitting}
                  className="btn-danger w-full text-xs font-semibold py-2.5 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {submitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>Delete User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
