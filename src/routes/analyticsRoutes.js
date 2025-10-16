const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRoles');

router.get(
  '/:id',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  analyticsController.getExamAnalytics
);

module.exports = router;
