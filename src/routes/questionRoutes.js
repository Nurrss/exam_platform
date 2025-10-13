const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

router.use(auth);
router.use(requireRole('TEACHER'));

router.post('/:examId', questionController.addQuestion);
router.get('/:examId', questionController.getQuestions);
router.put('/update/:questionId', questionController.updateQuestion);
router.delete('/delete/:questionId', questionController.deleteQuestion);

module.exports = router;
