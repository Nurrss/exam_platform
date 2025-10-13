const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

router.use(auth);
router.use(requireRole('STUDENT'));

router.post('/join', sessionController.join);
router.get('/:id', sessionController.getDetails);
router.post('/:id/answers', sessionController.saveAnswer);
router.post('/:id/finish', sessionController.finish);

module.exports = router;
