const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.use(auth);

router.post('/', role('TEACHER'), examController.createExam);
router.get('/', role('TEACHER'), examController.getExamsByTeacher);
router.get('/:id', role('TEACHER'), examController.getExamById);
router.put('/:id', role('TEACHER'), examController.updateExam);
router.delete('/:id', role('TEACHER'), examController.deleteExam);

module.exports = router;
