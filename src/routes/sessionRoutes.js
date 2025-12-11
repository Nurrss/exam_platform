const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const securityController = require('../controllers/securityController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRoles');
const validate = require('../middleware/validate');
const sessionValidation = require('../validations/sessionValidation');

router.post(
  '/join',
  authMiddleware,
  authorize(['STUDENT']),
  validate(sessionValidation.joinExam),
  sessionController.joinExam
);

router.get(
  '/my',
  authMiddleware,
  authorize(['STUDENT']),
  sessionController.getMySessions
);

router.get('/:id', authMiddleware, validate(sessionValidation.getSession), sessionController.getSessionById);

router.post(
  '/:id/answer',
  authMiddleware,
  authorize(['STUDENT']),
  validate(sessionValidation.submitAnswer),
  sessionController.submitAnswer
);

router.post(
  '/:id/finish',
  authMiddleware,
  authorize(['STUDENT']),
  validate(sessionValidation.finishExam),
  sessionController.finishExam
);

router.get('/:id/result', authMiddleware, validate(sessionValidation.getResult), sessionController.getResult);

router.get(
  '/exam/:examId',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  validate(sessionValidation.getSessionsByExam),
  sessionController.getExamSessions
);

router.post(
  '/:id/violation',
  authMiddleware,
  authorize(['STUDENT']),
  validate(sessionValidation.reportViolation),
  securityController.reportViolation
);

router.post(
  '/:id/approve-violation',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  validate(sessionValidation.approveViolation),
  securityController.approveViolation
);

router.post(
  '/:id/force-finish',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  validate(sessionValidation.forceFinish),
  securityController.forceFinish
);

module.exports = router;
