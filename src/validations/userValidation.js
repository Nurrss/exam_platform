const Joi = require('joi');

const userValidation = {
  getUser: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID должен быть числом',
        'number.positive': 'ID должен быть положительным числом',
        'any.required': 'ID обязателен',
      }),
    }),
  },

  createUser: {
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
      role: Joi.string().valid('ADMIN', 'TEACHER', 'STUDENT').required().messages({
        'any.only': 'Роль должна быть ADMIN, TEACHER или STUDENT',
        'any.required': 'Роль обязательна',
      }),
    }),
  },

  updateUser: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID должен быть числом',
        'number.positive': 'ID должен быть положительным числом',
        'any.required': 'ID обязателен',
      }),
    }),
    body: Joi.object({
      email: Joi.string().email().messages({
        'string.email': 'Некорректный email',
      }),
      firstName: Joi.string().min(2).max(50).messages({
        'string.min': 'Имя должно содержать минимум 2 символа',
        'string.max': 'Имя не должно превышать 50 символов',
      }),
      lastName: Joi.string().min(2).max(50).messages({
        'string.min': 'Фамилия должна содержать минимум 2 символа',
        'string.max': 'Фамилия не должна превышать 50 символов',
      }),
      role: Joi.string().valid('ADMIN', 'TEACHER', 'STUDENT').messages({
        'any.only': 'Роль должна быть ADMIN, TEACHER или STUDENT',
      }),
    }).min(1).messages({
      'object.min': 'Необходимо указать хотя бы одно поле для обновления',
    }),
  },

  deleteUser: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID должен быть числом',
        'number.positive': 'ID должен быть положительным числом',
        'any.required': 'ID обязателен',
      }),
    }),
  },

  listUsers: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'Страница должна быть числом',
        'number.min': 'Страница должна быть больше 0',
      }),
      limit: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.base': 'Лимит должен быть числом',
        'number.min': 'Лимит должен быть больше 0',
        'number.max': 'Лимит не должен превышать 100',
      }),
      role: Joi.string().valid('ADMIN', 'TEACHER', 'STUDENT').messages({
        'any.only': 'Роль должна быть ADMIN, TEACHER или STUDENT',
      }),
    }),
  },
};

module.exports = userValidation;
