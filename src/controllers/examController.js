const examService = require('../services/examService');
const catchAsync = require('../utils/catchAsync');

exports.createExam = catchAsync(async (req, res) => {
  const { title, description } = req.body;
  const teacherId = req.user.id;
  const exam = await examService.createExam(title, description, teacherId);
  res.status(201).json(exam);
});

exports.getExamsByTeacher = catchAsync(async (req, res) => {
  const exams = await examService.getExamsByTeacher(req.user.id);
  res.json(exams);
});

exports.getExamById = catchAsync(async (req, res) => {
  const exam = await examService.getExamById(parseInt(req.params.id));
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  res.json(exam);
});

exports.updateExam = catchAsync(async (req, res) => {
  const user = req.user;
  const exam = await examService.updateExam(
    parseInt(req.params.id),
    user,
    req.body
  );
  res.json(exam);
});

exports.deleteExam = catchAsync(async (req, res) => {
  const user = req.user;
  await examService.deleteExam(parseInt(req.params.id), user);
  res.json({ message: 'Exam deleted successfully' });
});
