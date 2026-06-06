const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

/**
 * POST /api/auth/login
 * Public — authenticate user and return JWT
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user (include password field explicitly since select: false)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const token = generateToken(user);

  // Build a clean user payload (password excluded via toJSON transform)
  const userPayload = user.toJSON();

  return ApiResponse.ok(res, 'Login successful.', {
    token,
    user: userPayload,
  });
});

/**
 * POST /api/auth/register
 * Public — register a new Member user and return JWT
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, flatNumber } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    throw ApiError.badRequest('User with this email already exists.');
  }

  // Create user (role defaults to Member based on schema, but we can set it explicitly to be safe)
  const user = await User.create({
    name,
    email,
    password,
    flatNumber,
    role: 'Member'
  });

  const token = generateToken(user);

  // Build a clean user payload
  const userPayload = user.toJSON();

  return ApiResponse.created(res, 'Registration successful.', {
    token,
    user: userPayload,
  });
});
module.exports = {
  register,
  login
}
