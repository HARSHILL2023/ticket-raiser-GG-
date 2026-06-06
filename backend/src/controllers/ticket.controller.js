const asyncHandler = require('express-async-handler');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

/**
 * POST /api/tickets
 * Member only — raise a new ticket
 */
const createTicket = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!req.user.flatNumber) {
    throw ApiError.badRequest('Your account does not have a flat number assigned. Contact your admin.');
  }

  const ticket = await Ticket.create({
    title,
    description,
    category,
    flatNumber: req.user.flatNumber,
    raisedBy: req.user._id,
  });

  // Populate raisedBy for the response
  const populated = await ticket.populate('raisedBy', 'name email flatNumber');

  return ApiResponse.created(res, 'Ticket raised successfully.', populated);
});

/**
 * GET /api/tickets/my
 * Member only — get own tickets
 */
const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ raisedBy: req.user._id })
    .populate('raisedBy', 'name email flatNumber')
    .sort({ createdAt: -1 });

  return ApiResponse.ok(res, 'Tickets retrieved successfully.', tickets);
});

/**
 * GET /api/tickets
 * Manager + Admin — get all tickets
 */
const getAllTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({})
    .populate('raisedBy', 'name email flatNumber')
    .sort({ createdAt: -1 });

  return ApiResponse.ok(res, 'All tickets retrieved successfully.', tickets);
});

/**
 * PATCH /api/tickets/:id/status
 * Manager + Admin — update ticket status
 */
const updateTicketStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = await Ticket.findById(id);
  if (!ticket) throw ApiError.notFound('Ticket not found.');

  ticket.status = status;
  await ticket.save();

  const updated = await ticket.populate('raisedBy', 'name email flatNumber');

  return ApiResponse.ok(res, `Ticket status updated to '${status}'.`, updated);
});

module.exports = { createTicket, getMyTickets, getAllTickets, updateTicketStatus };
