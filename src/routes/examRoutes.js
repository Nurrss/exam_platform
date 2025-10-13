const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

router.use(auth);

router.post('/', requireRole('TEACHER'), examController.createExam);
router.get('/my', requireRole('TEACHER'), examController.getExamsByTeacher);
router.get(
  '/:id',
  requireRole(['TEACHER', 'ADMIN']),
  examController.getExamById
);
router.patch('/:id', requireRole('TEACHER'), examController.updateExam);
router.delete('/:id', requireRole('TEACHER'), examController.deleteExam);

module.exports = router;
