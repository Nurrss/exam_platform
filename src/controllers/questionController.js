const questionService = require('../services/questionService');
const catchAsync = require('../utils/catchAsync');

exports.addQuestion = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const { text, type, options, correct } = req.body;
  const teacherId = req.user.id;

  const question = await questionService.addQuestion(
    parseInt(examId),
    teacherId,
    text,
    type,
    options,
    correct
  );

  res.status(201).json({
    success: true,
    message: 'Вопрос успешно добавлен',
    data: question,
  });
});

exports.getQuestions = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const teacherId = req.user.id;

  const questions = await questionService.getQuestions(
    parseInt(examId),
    teacherId
  );

  res.json({
    success: true,
    message: 'Список вопросов для экзамена',
    data: questions,
  });
});

exports.updateQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  const updated = await questionService.updateQuestion(
    parseInt(id),
    teacherId,
    req.body
  );

  res.json({
    success: true,
    message: 'Вопрос успешно обновлён',
    data: updated,
  });
});

exports.deleteQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  await questionService.deleteQuestion(parseInt(id), teacherId);

  res.json({
    success: true,
    message: 'Вопрос успешно удалён',
  });
});
