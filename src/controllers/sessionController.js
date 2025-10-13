const sessionService = require('../services/sessionService');
const catchAsync = require('../utils/catchAsync');
const examRepository = require('../repositories/examRepository');

exports.joinExam = catchAsync(async (req, res) => {
  const { examCode } = req.body;
  const session = await sessionService.joinExam(req.user.id, examCode);
  res.status(201).json(session);
});

exports.getSessionDetails = catchAsync(async (req, res) => {
  const session = await sessionService.getSessionDetails(
    parseInt(req.params.id),
    req.user.id
  );
  res.json(session);
});

exports.saveAnswer = catchAsync(async (req, res) => {
  const { questionId, response } = req.body;
  const answer = await sessionService.saveAnswer(
    parseInt(req.params.id),
    req.user.id,
    questionId,
    response
  );
  res.status(200).json(answer);
});

exports.finishSession = catchAsync(async (req, res) => {
  const result = await sessionService.finishSession(
    parseInt(req.params.id),
    req.user.id
  );
  res.json(result);
});

exports.joinByCode = catchAsync(async (req, res) => {
  const { examCode } = req.params;
  const userId = req.user.id;

  const exam = await examRepository.findByCode(examCode);
  if (!exam) return res.status(404).json({ error: 'Exam not found' });

  const session = await sessionService.joinExam(userId, exam.examCode);
  res.json({ message: 'Joined exam', session });
});
