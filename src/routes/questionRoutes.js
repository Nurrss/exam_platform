const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

router.post(
  '/:examId',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  questionController.createQuestion
);

router.get(
  '/:examId',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  questionController.getQuestionsByExam
);

router.get(
  '/:examId/student',
  authMiddleware,
  authorize(['STUDENT']),
  questionController.getQuestionsForStudent
);

router.put(
  '/:id',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  questionController.updateQuestion
);

router.delete(
  '/:id',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  questionController.deleteQuestion
);

module.exports = router;
