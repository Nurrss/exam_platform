const Joi = require('joi');

const examValidation = {
  createExam: {
    body: Joi.object({
      title: Joi.string().min(3).max(200).required().messages({
        'string.min': 'Название должно содержать минимум 3 символа',
        'string.max': 'Название не должно превышать 200 символов',
        'any.required': 'Название обязательно',
      }),
      description: Joi.string().max(1000).allow('', null).messages({
        'string.max': 'Описание не должно превышать 1000 символов',
      }),
      status: Joi.string().valid('DRAFT', 'PUBLISHED', 'CLOSED').default('DRAFT').messages({
        'any.only': 'Статус должен быть DRAFT, PUBLISHED или CLOSED',
      }),
    }),
  },

  getExam: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID должен быть числом',
        'number.positive': 'ID должен быть положительным числом',
        'any.required': 'ID обязателен',
      }),
    }),
  },

  getExamByCode: {
    params: Joi.object({
      examCode: Joi.string().required().messages({
        'any.required': 'Код экзамена обязателен',
      }),
    }),
  },

  updateExam: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID должен быть числом',
        'number.positive': 'ID должен быть положительным числом',
        'any.required': 'ID обязателен',
      }),
    }),
    body: Joi.object({
      title: Joi.string().min(3).max(200).messages({
        'string.min': 'Название должно содержать минимум 3 символа',
        'string.max': 'Название не должно превышать 200 символов',
      }),
      description: Joi.string().max(1000).allow('', null).messages({
        'string.max': 'Описание не должно превышать 1000 символов',
      }),
      status: Joi.string().valid('DRAFT', 'PUBLISHED', 'CLOSED').messages({
        'any.only': 'Статус должен быть DRAFT, PUBLISHED или CLOSED',
      }),
    }).min(1).messages({
      'object.min': 'Необходимо указать хотя бы одно поле для обновления',
    }),
  },

  deleteExam: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID должен быть числом',
        'number.positive': 'ID должен быть положительным числом',
        'any.required': 'ID обязателен',
      }),
    }),
  },

  joinExam: {
    params: Joi.object({
      examCode: Joi.string().required().messages({
        'any.required': 'Код экзамена обязателен',
      }),
    }),
  },

  listExams: {
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
      status: Joi.string().valid('DRAFT', 'PUBLISHED', 'CLOSED').messages({
        'any.only': 'Статус должен быть DRAFT, PUBLISHED или CLOSED',
      }),
    }),
  },
};

module.exports = examValidation;
