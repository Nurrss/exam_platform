require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { logger } = require('./config/logger');
const requestLogger = require('./middleware/requestLogger');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Morgan logging in development only
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Winston request logging
app.use(requestLogger);

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов. Попробуйте позже.',
});
app.use('/api/auth', authLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Exam Platform API Docs',
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global error handler
app.use((err, req, res, next) => {
  // Log error with Winston
  logger.error('Global Error Handler', {
    error: err.message,
    errorCode: err.errorCode,
    stack: err.stack,
    url: req.originalUrl || req.url,
    method: req.method,
    userId: req.user?.id,
    body: req.body,
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Build error response
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR',
  };

  // Add validation errors if present
  if (err.fields && Array.isArray(err.fields)) {
    errorResponse.errors = err.fields;
  }

  // Don't expose stack trace in production
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
});

module.exports = app;
