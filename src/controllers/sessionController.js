const sessionService = require('../services/sessionService');
const catchAsync = require('../utils/catchAsync');
const examRepository = require('../repositories/examRepository');

exports.joinExam = catchAsync(async (req, res) => {
  const { examCode } = req.body;
  const session = await sessionService.joinExam(req.user.id, examCode);

  res.status(201).json({
    success: true,
    message: 'Сессия экзамена начата',
    data: session,
  });
});

exports.getSessionDetails = catchAsync(async (req, res) => {
  const session = await sessionService.getSessionDetails(
    parseInt(req.params.id),
    req.user.id
  );

  res.json({
    success: true,
    message: 'Детали сессии экзамена',
    data: session,
  });
});

exports.saveAnswer = catchAsync(async (req, res) => {
  const { questionId, response } = req.body;
  const answer = await sessionService.saveAnswer(
    parseInt(req.params.id),
    req.user.id,
    questionId,
    response
  );

  res.status(200).json({
    success: true,
    message: 'Ответ сохранён',
    data: answer,
  });
});

exports.finishSession = catchAsync(async (req, res) => {
  const result = await sessionService.finishSession(
    parseInt(req.params.id),
    req.user.id
  );

  res.json({
    success: true,
    message: 'Сессия завершена, результаты сохранены',
    data: result,
  });
});

exports.joinByCode = catchAsync(async (req, res) => {
  const { examCode } = req.params;
  const userId = req.user.id;

  const exam = await examRepository.findByCode(examCode);
  if (!exam)
    return res
      .status(404)
      .json({ success: false, message: 'Экзамен не найден' });

  const session = await sessionService.joinExam(userId, exam.examCode);

  res.json({
    success: true,
    message: 'Подключение к экзамену успешно',
    data: session,
  });
});
