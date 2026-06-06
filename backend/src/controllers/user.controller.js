const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/users
 * Admin only — list all registered users
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  return ApiResponse.ok(res, 'Users retrieved successfully.', users);
});

/**
 * POST /api/users
 * Admin only — create a new user
 */
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, flatNumber } = req.body;

  // Check if email already exists
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw ApiError.conflict(`An account with email '${email}' already exists.`);
  }

  const userData = { name, email, password, role };
  if (role === 'Member') {
    if (!flatNumber) throw ApiError.badRequest('Flat number is required for Member accounts.');
    userData.flatNumber = flatNumber;
  }

  const user = await User.create(userData);

  return ApiResponse.created(res, 'User account created successfully.', user);
});

/**
 * PUT /api/users/:id
 * Admin only — update a user
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, flatNumber } = req.body;

  const user = await User.findById(id).select('+password');
  if (!user) throw ApiError.notFound('User not found.');

  // Prevent admin from editing their own account via this route (use profile endpoint)
  // Actually allow it unless you'd like to restrict — keep it flexible here

  // Check for email conflict if changing email
  if (email && email.toLowerCase() !== user.email) {
    const conflict = await User.findOne({ email: email.toLowerCase() });
    if (conflict) throw ApiError.conflict(`Email '${email}' is already registered.`);
    user.email = email;
  }

  if (name) user.name = name;
  if (role) user.role = role;
  if (password) user.password = password; // pre-save hook will hash it

  // Handle flatNumber based on role
  if (role === 'Member') {
    if (!flatNumber) throw ApiError.badRequest('Flat number is required for Member accounts.');
    user.flatNumber = flatNumber;
  } else {
    user.flatNumber = '';
  }

  await user.save();

  // Re-fetch without password for clean response
  const updated = await User.findById(user._id);
  return ApiResponse.ok(res, 'User updated successfully.', updated);
});

/**
 * DELETE /api/users/:id
 * Admin only — delete a user
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent self-deletion
  if (req.user._id.toString() === id) {
    throw ApiError.badRequest('You cannot delete your own account.');
  }

  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('User not found.');

  // Prevent deleting other Admin accounts
  if (user.role === 'Admin') {
    throw ApiError.forbidden('Admin accounts cannot be deleted via this endpoint.');
  }

  await User.findByIdAndDelete(id);

  return ApiResponse.ok(res, 'User account deleted successfully.', { id });
});

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
