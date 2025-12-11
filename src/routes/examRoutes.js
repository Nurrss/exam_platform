const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRoles');
const validate = require('../middleware/validate');
const examValidation = require('../validations/examValidation');

router.post(
  '/',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  validate(examValidation.createExam),
  examController.createExam
);
router.get('/my', authMiddleware, examController.getMyExams);
router.get('/:id', authMiddleware, validate(examValidation.getExam), examController.getExamById);
router.put(
  '/:id',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  validate(examValidation.updateExam),
  examController.updateExam
);
router.delete(
  '/:id',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  validate(examValidation.deleteExam),
  examController.deleteExam
);
router.post(
  '/join/:examCode',
  authMiddleware,
  authorize(['STUDENT']),
  validate(examValidation.joinExam),
  examController.joinExam
);

router.get(
  '/',
  authMiddleware,
  authorize(['ADMIN']),
  validate(examValidation.listExams),
  examController.getAllExams
);

router.get('/code/:examCode', authMiddleware, validate(examValidation.getExamByCode), examController.getExamByCode);

module.exports = router;
