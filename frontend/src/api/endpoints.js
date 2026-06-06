import apiClient from './axios';

// ─────────────────────────────────────────────────────────────
// Normalize backend ticket shape → frontend shape
// Backend: { _id, raisedBy: { _id, name, flatNumber }, ... }
// Frontend: { id, residentName, flatNumber, ... }
// ─────────────────────────────────────────────────────────────
const normalizeTicket = (ticket) => ({
  ...ticket,
  id: ticket.id || ticket._id,
  residentName: ticket.raisedBy?.name || 'Unknown',
  flatNumber: ticket.flatNumber || ticket.raisedBy?.flatNumber || 'N/A',
  createdAt: ticket.createdAt,
});

// ─────────────────────────────────────────────────────────────
// Normalize backend user shape → frontend shape
// Backend: { _id → id via toJSON transform }
// ─────────────────────────────────────────────────────────────
const normalizeUser = (user) => ({
  ...user,
  id: user.id || user._id,
});

/* ══════════════════════════════════════════════
   Auth API
══════════════════════════════════════════════ */
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data.data; // { token, user }
  },
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data.data; // { token, user }
  },
};

/* ══════════════════════════════════════════════
   Ticket API
══════════════════════════════════════════════ */
export const ticketAPI = {
  getMyTickets: async () => {
    const response = await apiClient.get('/tickets/my');
    return (response.data.data || []).map(normalizeTicket);
  },

  createTicket: async (ticketData) => {
    const response = await apiClient.post('/tickets', ticketData);
    return normalizeTicket(response.data.data);
  },

  getAllTickets: async () => {
    const response = await apiClient.get('/tickets');
    return (response.data.data || []).map(normalizeTicket);
  },

  updateTicketStatus: async (ticketId, status) => {
    const response = await apiClient.patch(`/tickets/${ticketId}/status`, { status });
    return normalizeTicket(response.data.data);
  },
};

/* ══════════════════════════════════════════════
   Admin API
══════════════════════════════════════════════ */
export const adminAPI = {
  getAllUsers: async () => {
    const response = await apiClient.get('/users');
    return (response.data.data || []).map(normalizeUser);
  },

  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return normalizeUser(response.data.data);
  },

  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return normalizeUser(response.data.data);
  },

  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },

  getMetrics: async () => {
    const response = await apiClient.get('/admin/metrics');
    return response.data.data;
  },
};
