require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

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

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res
    .status(500)
    .json({ error: 'Internal Server Error', details: err.message });
});

module.exports = app;
