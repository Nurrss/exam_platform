const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/authorizeRoles');
const validate = require('../middleware/validate');
const userValidation = require('../validations/userValidation');

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validate(userValidation.listUsers),
  userController.getAllUsers
);

router.get('/:id', authMiddleware, validate(userValidation.getUser), userController.getUserById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validate(userValidation.createUser),
  userController.createUser
);

router.put('/:id', authMiddleware, validate(userValidation.updateUser), userController.updateUser);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validate(userValidation.deleteUser),
  userController.deleteUser
);

module.exports = router;
