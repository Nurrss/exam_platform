const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const securityController = require('../controllers/securityController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRoles');

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

router.post(
  '/:id/violation',
  authMiddleware,
  authorize(['STUDENT']),
  securityController.reportViolation
);

router.post(
  '/:id/approve-violation',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  securityController.approveViolation
);

router.post(
  '/:id/force-finish',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  securityController.forceFinish
);

module.exports = router;
