const Joi = require('joi');

const authValidation = {
  register: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Некорректный email',
        'any.required': 'Email обязателен',
      }),
      password: Joi.string().min(8).required().messages({
        'string.min': 'Пароль должен содержать минимум 8 символов',
        'any.required': 'Пароль обязателен',
      }),
      firstName: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Имя должно содержать минимум 2 символа',
        'string.max': 'Имя не должно превышать 50 символов',
        'any.required': 'Имя обязательно',
      }),
      lastName: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Фамилия должна содержать минимум 2 символа',
        'string.max': 'Фамилия не должна превышать 50 символов',
        'any.required': 'Фамилия обязательна',
      }),
      role: Joi.string().valid('ADMIN', 'TEACHER', 'STUDENT').default('STUDENT'),
    }),
  },

  login: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Некорректный email',
        'any.required': 'Email обязателен',
      }),
      password: Joi.string().required().messages({
        'any.required': 'Пароль обязателен',
      }),
    }),
  },

  verifyEmail: {
    params: Joi.object({
      token: Joi.string().required().messages({
        'any.required': 'Токен обязателен',
      }),
    }),
  },

  changePassword: {
    body: Joi.object({
      oldPassword: Joi.string().required().messages({
        'any.required': 'Старый пароль обязателен',
      }),
      newPassword: Joi.string().min(8).required().messages({
        'string.min': 'Новый пароль должен содержать минимум 8 символов',
        'any.required': 'Новый пароль обязателен',
      }),
    }),
  },

  forgotPassword: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Некорректный email',
        'any.required': 'Email обязателен',
      }),
    }),
  },

  resetPassword: {
    body: Joi.object({
      token: Joi.string().required().messages({
        'any.required': 'Токен обязателен',
      }),
      newPassword: Joi.string().min(8).required().messages({
        'string.min': 'Пароль должен содержать минимум 8 символов',
        'any.required': 'Пароль обязателен',
      }),
    }),
  },
};

module.exports = authValidation;
