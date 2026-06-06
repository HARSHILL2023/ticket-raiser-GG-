const ApiError = require('../utils/ApiError');

/**
 * Role-based access control middleware factory.
 * Usage: requireRole('Admin', 'Manager')
 * @param {...string} roles - Allowed role names
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. This action requires one of these roles: ${roles.join(', ')}.`
        )
      );
    }

    next();
  };
};

module.exports = { requireRole };
