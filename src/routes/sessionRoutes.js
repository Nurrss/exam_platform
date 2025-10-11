const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // все маршруты требуют JWT

router.post('/join', sessionController.join);
router.get('/:id', sessionController.getDetails);
router.post('/:id/answers', sessionController.saveAnswer);
router.post('/:id/finish', sessionController.finish);

module.exports = router;
