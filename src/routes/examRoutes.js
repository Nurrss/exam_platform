const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
const examController = require('../controllers/examController');

router.post('/', auth, authorizeRoles(['TEACHER']), examController.createExam);
router.get('/my', auth, authorizeRoles(['TEACHER']), examController.getMyExams);
router.get(
  '/:id',
  auth,
  authorizeRoles(['TEACHER', 'ADMIN']),
  examController.getExamById
);
router.put(
  '/:id',
  auth,
  authorizeRoles(['TEACHER']),
  examController.updateExam
);
router.delete(
  '/:id',
  auth,
  authorizeRoles(['TEACHER', 'ADMIN']),
  examController.deleteExam
);
router.post(
  '/join/:examCode',
  auth,
  authorizeRoles(['STUDENT']),
  sessionController.joinByCode
);

module.exports = router;
