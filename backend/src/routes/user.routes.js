const express = require('express');
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const {
  validateCreateUser,
  validateUpdateUser,
} = require('../middleware/validation.middleware');

const router = express.Router();

// All user management routes require authentication + Admin role
router.use(protect, requireRole('Admin'));

router.get('/', getAllUsers);
router.post('/', validateCreateUser, createUser);
router.put('/:id', validateUpdateUser, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
