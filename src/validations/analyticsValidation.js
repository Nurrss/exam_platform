const Joi = require('joi');

const analyticsValidation = {
  getExamAnalytics: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID экзамена должен быть числом',
        'number.positive': 'ID экзамена должен быть положительным числом',
        'any.required': 'ID экзамена обязателен',
      }),
    }),
  },
};

module.exports = analyticsValidation;
