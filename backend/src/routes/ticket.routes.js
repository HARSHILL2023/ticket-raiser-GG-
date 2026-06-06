const express = require('express');
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
} = require('../controllers/ticket.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const {
  validateCreateTicket,
  validateUpdateStatus,
} = require('../middleware/validation.middleware');

const router = express.Router();

// All ticket routes require authentication
router.use(protect);

// Member: raise a ticket
router.post('/', requireRole('Member'), validateCreateTicket, createTicket);

// Member: get own tickets
router.get('/my', requireRole('Member'), getMyTickets);

// Manager + Admin: get all tickets
router.get('/', requireRole('Manager', 'Admin'), getAllTickets);

// Manager + Admin: update ticket status
router.patch('/:id/status', requireRole('Manager', 'Admin'), validateUpdateStatus, updateTicketStatus);

module.exports = router;
