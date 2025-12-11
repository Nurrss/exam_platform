const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRoles');
const validate = require('../middleware/validate');
const analyticsValidation = require('../validations/analyticsValidation');

router.get(
  '/:id',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  validate(analyticsValidation.getExamAnalytics),
  analyticsController.getExamAnalytics
);

module.exports = router;
