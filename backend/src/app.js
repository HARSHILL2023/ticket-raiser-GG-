const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

// Load env first
require('./config/env');

const { errorHandler, notFound } = require('./middleware/error.middleware');

// Route modules
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const ticketRoutes = require('./routes/ticket.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

/* ──────────────────────────────────────────────
   Security Middleware
────────────────────────────────────────────── */
app.use(helmet());

// CORS — allow frontend origins (dev + production Vercel)
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  // Vercel production deployment
  'https://ticket-raiser-cmkuogwn1-harshilpatels-projects-e1a200a3.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, mobile apps, curl)
      if (!origin) return callback(null, true);
      // Allow any *.vercel.app preview deployment for this project
      const isVercelPreview = /^https:\/\/ticket-raiser-[\w-]+\.vercel\.app$/.test(origin);
      if (allowedOrigins.includes(origin) || isVercelPreview) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// Tighter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts, please try again in 15 minutes.' },
});

/* ──────────────────────────────────────────────
   Parsers & Sanitization
────────────────────────────────────────────── */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Prevent NoSQL injection attacks
app.use(mongoSanitize());

/* ──────────────────────────────────────────────
   Request Logging (development only)
────────────────────────────────────────────── */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* ──────────────────────────────────────────────
   Health Check
────────────────────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CTMS API is running.', timestamp: new Date().toISOString() });
});

/* ──────────────────────────────────────────────
   API Routes
────────────────────────────────────────────── */
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

/* ──────────────────────────────────────────────
   Error Handling (must be last)
────────────────────────────────────────────── */
app.use(notFound);
app.use(errorHandler);

module.exports = app;
