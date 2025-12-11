const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRoles');

// Student dashboard - overview with statistics
router.get(
  '/dashboard',
  authMiddleware,
  authorize(['STUDENT']),
  studentController.getDashboard
);

// Detailed exam history with filtering and pagination
router.get(
  '/exam-history',
  authMiddleware,
  authorize(['STUDENT']),
  studentController.getExamHistory
);

// Performance trends over time
router.get(
  '/performance-trends',
  authMiddleware,
  authorize(['STUDENT']),
  studentController.getPerformanceTrends
);

module.exports = router;
