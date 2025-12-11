const Joi = require('joi');

const questionValidation = {
  createQuestion: {
    params: Joi.object({
      examId: Joi.number().integer().positive().required().messages({
        'number.base': 'ID экзамена должен быть числом',
        'number.positive': 'ID экзамена должен быть положительным числом',
        'any.required': 'ID экзамена обязателен',
      }),
    }),
    body: Joi.object({
      text: Joi.string().min(5).max(1000).required().messages({
        'string.min': 'Текст вопроса должен содержать минимум 5 символов',
        'string.max': 'Текст вопроса не должен превышать 1000 символов',
        'any.required': 'Текст вопроса обязателен',
      }),
      type: Joi.string().valid('MULTIPLE_CHOICE', 'TEXT', 'TRUE_FALSE').required().messages({
        'any.only': 'Тип должен быть MULTIPLE_CHOICE, TEXT или TRUE_FALSE',
        'any.required': 'Тип вопроса обязателен',
      }),
      options: Joi.alternatives().conditional('type', {
        is: 'MULTIPLE_CHOICE',
        then: Joi.array().items(Joi.string()).min(2).required().messages({
          'array.min': 'Для множественного выбора необходимо минимум 2 варианта',
          'any.required': 'Варианты ответа обязательны для множественного выбора',
        }),
        otherwise: Joi.any().allow(null),
      }),
      correct: Joi.any().required().messages({
        'any.required': 'Правильный ответ обязателен',
      }),
    }),
  },

  getQuestions: {
    params: Joi.object({
      examId: Joi.number().integer().positive().required().messages({
        'number.base': 'ID экзамена должен быть числом',
        'number.positive': 'ID экзамена должен быть положительным числом',
        'any.required': 'ID экзамена обязателен',
      }),
    }),
  },

  updateQuestion: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID вопроса должен быть числом',
        'number.positive': 'ID вопроса должен быть положительным числом',
        'any.required': 'ID вопроса обязателен',
      }),
    }),
    body: Joi.object({
      text: Joi.string().min(5).max(1000).messages({
        'string.min': 'Текст вопроса должен содержать минимум 5 символов',
        'string.max': 'Текст вопроса не должен превышать 1000 символов',
      }),
      type: Joi.string().valid('MULTIPLE_CHOICE', 'TEXT', 'TRUE_FALSE').messages({
        'any.only': 'Тип должен быть MULTIPLE_CHOICE, TEXT или TRUE_FALSE',
      }),
      options: Joi.any(),
      correct: Joi.any(),
    }).min(1).messages({
      'object.min': 'Необходимо указать хотя бы одно поле для обновления',
    }),
  },

  deleteQuestion: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID вопроса должен быть числом',
        'number.positive': 'ID вопроса должен быть положительным числом',
        'any.required': 'ID вопроса обязателен',
      }),
    }),
  },
};

module.exports = questionValidation;
