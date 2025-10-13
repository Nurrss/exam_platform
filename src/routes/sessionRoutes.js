const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
const sessionController = require('../controllers/sessionController');

router.post(
  '/join',
  auth,
  authorizeRoles(['STUDENT']),
  sessionController.joinExam
);
router.get(
  '/:id',
  auth,
  authorizeRoles(['STUDENT']),
  sessionController.getSessionDetails
);
router.post(
  '/:id/answer',
  auth,
  authorizeRoles(['STUDENT']),
  sessionController.saveAnswer
);
router.post(
  '/:id/finish',
  auth,
  authorizeRoles(['STUDENT']),
  sessionController.finishSession
);

module.exports = router;
