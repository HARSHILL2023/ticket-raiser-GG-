const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe
} = require('../controllers/auth.controller');

const { protect } = require('../middleware/auth.middleware');

/* ───────────────────────────────
   AUTH ROUTES (FIXED)
   Base path: /api/auth
────────────────────────────── */

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Logout user (optional)
router.post('/logout', protect, logout);

// Get logged-in user
router.get('/me', protect, getMe);

module.exports = router;