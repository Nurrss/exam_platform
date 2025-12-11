const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const authValidation = require('../validations/authValidation');

router.post('/register', validate(authValidation.register), authController.register);
router.get('/verify-email/:token', validate(authValidation.verifyEmail), authController.verifyEmail);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authMiddleware, authController.logout);
router.post('/change-password', authMiddleware, validate(authValidation.changePassword), authController.changePassword);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;
