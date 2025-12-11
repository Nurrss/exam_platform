const Joi = require('joi');

const sessionValidation = {
  joinExam: {
    body: Joi.object({
      examCode: Joi.string().required().messages({
        'any.required': 'Код экзамена обязателен',
      }),
    }),
  },

  getSession: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID сессии должен быть числом',
        'number.positive': 'ID сессии должен быть положительным числом',
        'any.required': 'ID сессии обязателен',
      }),
    }),
  },

  submitAnswer: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID сессии должен быть числом',
        'number.positive': 'ID сессии должен быть положительным числом',
        'any.required': 'ID сессии обязателен',
      }),
    }),
    body: Joi.object({
      questionId: Joi.number().integer().positive().required().messages({
        'number.base': 'ID вопроса должен быть числом',
        'number.positive': 'ID вопроса должен быть положительным числом',
        'any.required': 'ID вопроса обязателен',
      }),
      response: Joi.any().required().messages({
        'any.required': 'Ответ обязателен',
      }),
    }),
  },

  finishExam: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID сессии должен быть числом',
        'number.positive': 'ID сессии должен быть положительным числом',
        'any.required': 'ID сессии обязателен',
      }),
    }),
  },

  getResult: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID сессии должен быть числом',
        'number.positive': 'ID сессии должен быть положительным числом',
        'any.required': 'ID сессии обязателен',
      }),
    }),
  },

  getSessionsByExam: {
    params: Joi.object({
      examId: Joi.number().integer().positive().required().messages({
        'number.base': 'ID экзамена должен быть числом',
        'number.positive': 'ID экзамена должен быть положительным числом',
        'any.required': 'ID экзамена обязателен',
      }),
    }),
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
      status: Joi.string().valid('PENDING', 'ACTIVE', 'BLOCKED_WAITING', 'LOCKED', 'COMPLETED', 'COMPLETED_BY_TEACHER').messages({
        'any.only': 'Некорректный статус сессии',
      }),
    }),
  },

  reportViolation: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID сессии должен быть числом',
        'number.positive': 'ID сессии должен быть положительным числом',
        'any.required': 'ID сессии обязателен',
      }),
    }),
    body: Joi.object({
      type: Joi.string().required().messages({
        'any.required': 'Тип нарушения обязателен',
      }),
      note: Joi.string().min(10).max(500).required().messages({
        'string.min': 'Описание нарушения должно содержать минимум 10 символов',
        'string.max': 'Описание нарушения не должно превышать 500 символов',
        'any.required': 'Описание нарушения обязательно',
      }),
    }),
  },

  approveViolation: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID сессии должен быть числом',
        'number.positive': 'ID сессии должен быть положительным числом',
        'any.required': 'ID сессии обязателен',
      }),
    }),
  },

  forceFinish: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID сессии должен быть числом',
        'number.positive': 'ID сессии должен быть положительным числом',
        'any.required': 'ID сессии обязателен',
      }),
    }),
  },
};

module.exports = sessionValidation;
