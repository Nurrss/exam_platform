const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRoles');
const validate = require('../middleware/validate');
const questionValidation = require('../validations/questionValidation');
const { upload, uploadDocument } = require('../config/multer');

// Image upload endpoint
router.post(
  '/upload/image',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  upload.single('image'),
  questionController.uploadImage
);

// Bulk import endpoint (CSV/JSON)
router.post(
  '/:examId/bulk-import',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  uploadDocument.single('file'),
  questionController.bulkImport
);

router.post(
  '/:examId',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  validate(questionValidation.createQuestion),
  questionController.createQuestion
);

router.get(
  '/:examId',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  validate(questionValidation.getQuestions),
  questionController.getQuestionsByExam
);

router.get(
  '/:examId/student',
  authMiddleware,
  authorize(['STUDENT']),
  validate(questionValidation.getQuestions),
  questionController.getQuestionsForStudent
);

router.put(
  '/:id',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  validate(questionValidation.updateQuestion),
  questionController.updateQuestion
);

router.delete(
  '/:id',
  authMiddleware,
  authorize(['TEACHER', 'ADMIN']),
  validate(questionValidation.deleteQuestion),
  questionController.deleteQuestion
);

module.exports = router;
