const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const questionController = require('../controllers/questionController');

router.post(
  '/:examId',
  auth,
  authorizeRoles(['TEACHER']),
  questionController.addQuestion
);
router.get(
  '/:examId',
  auth,
  authorizeRoles(['TEACHER']),
  questionController.getQuestions
);
router.put(
  '/:id',
  auth,
  authorizeRoles(['TEACHER']),
  questionController.updateQuestion
);
router.delete(
  '/:id',
  auth,
  authorizeRoles(['TEACHER']),
  questionController.deleteQuestion
);

module.exports = router;
