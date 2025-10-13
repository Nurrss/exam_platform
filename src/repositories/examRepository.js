const examService = require('../services/examService');

exports.createExam = async (req, res, next) => {
  const { title, description } = req.body;
  const teacherId = req.user.id;
  const exam = await examService.createExam(title, description, teacherId);
  res.status(201).json(exam);
};

exports.getExamsByTeacher = async (req, res) => {
  const exams = await examService.getExamsByTeacher(req.user.id);
  res.json(exams);
};

exports.getExamById = async (req, res) => {
  const exam = await examService.getExamById(parseInt(req.params.id));
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  res.json(exam);
};

exports.updateExam = async (req, res) => {
  const user = req.user;
  const exam = await examService.updateExam(
    parseInt(req.params.id),
    user,
    req.body
  );
  res.json(exam);
};

exports.deleteExam = async (req, res) => {
  const user = req.user;
  await examService.deleteExam(parseInt(req.params.id), user);
  res.json({ message: 'Exam deleted successfully' });
};

exports.findByCode = async (examCode) => {
  return prisma.exam.findUnique({
    where: { examCode },
  });
};
