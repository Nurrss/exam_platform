const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

router.post(
  '/join',
  authMiddleware,
  authorize(['STUDENT']),
  sessionController.joinExam
);

router.get(
  '/my',
  authMiddleware,
  authorize(['STUDENT']),
  sessionController.getMySessions
);

router.get('/:id', authMiddleware, sessionController.getSessionById);

router.post(
  '/:id/answer',
  authMiddleware,
  authorize(['STUDENT']),
  sessionController.submitAnswer
);

router.post(
  '/:id/finish',
  authMiddleware,
  authorize(['STUDENT']),
  sessionController.finishExam
);

router.get('/:id/result', authMiddleware, sessionController.getResult);

router.get(
  '/exam/:examId',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  sessionController.getExamSessions
);

module.exports = router;
