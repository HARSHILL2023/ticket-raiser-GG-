const ApiError = require('../utils/ApiError');
const { NODE_ENV } = require('../config/env');

/**
 * Global error handler middleware.
 * Must be registered LAST in express app (after all routes).
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // Mongoose Duplicate Key Error (e.g. unique email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `An account with ${field} '${value}' already exists.`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => e.message);
    message = 'Validation failed. Please check the provided data.';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please login again.';
  }

  const response = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler for unmatched routes.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found.`));
};

module.exports = { errorHandler, notFound };
