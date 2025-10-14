const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

router.post(
  '/',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  examController.createExam
);
router.get('/my', authMiddleware, examController.getMyExams);
router.get('/:id', authMiddleware, examController.getExamById);
router.put(
  '/:id',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  examController.updateExam
);
router.delete(
  '/:id',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  examController.deleteExam
);
router.post(
  '/join/:examCode',
  authMiddleware,
  authorize(['STUDENT']),
  examController.joinExam
);

router.get(
  '/',
  authMiddleware,
  authorize(['ADMIN']),
  examController.getAllExams
);

router.get('/code/:examCode', authMiddleware, examController.getExamByCode);

module.exports = router;
