const express = require('express');

const { login, register } = require('../controllers/auth.controller');
const { validateLogin, validateRegister } = require('../middleware/validation.middleware');

const router = express.Router();

// Login
router.post('/login', validateLogin, login);

// Register
router.post('/register', validateRegister, register);

module.exports = router;