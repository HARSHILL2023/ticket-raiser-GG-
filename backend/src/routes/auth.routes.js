const express = require('express');
const { login, register } = require('../controllers/auth.controller');
const { validateLogin, validateRegister } = require('../middleware/validation.middleware');

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateLogin, login);

// POST /api/auth/register
router.post('/register', validateRegister, register);

module.exports = router;
