const asyncHandler = require('express-async-handler');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');

/**
 * GET /api/admin/metrics
 * Admin only — return key system metrics
 */
const getMetrics = asyncHandler(async (req, res) => {
  const [
    totalTickets,
    resolvedTickets,
    unresolvedTickets,
    activeMembers,
    totalManagers,
  ] = await Promise.all([
    Ticket.countDocuments({}),
    Ticket.countDocuments({ status: 'Resolved' }),
    Ticket.countDocuments({ status: { $in: ['Pending', 'In Progress'] } }),
    User.countDocuments({ role: 'Member' }),
    User.countDocuments({ role: 'Manager' }),
  ]);

  return ApiResponse.ok(res, 'Metrics retrieved successfully.', {
    totalTickets,
    resolvedTickets,
    unresolvedTickets,
    activeMembers,
    totalManagers,
  });
});

module.exports = { getMetrics };
