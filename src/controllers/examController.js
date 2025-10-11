const examService = require('../services/examService');

exports.createExam = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const teacherId = req.user.id;

    const exam = await examService.createExam(title, description, teacherId);
    res.status(201).json(exam);
  } catch (err) {
    next(err);
  }
};

exports.getExamsByTeacher = async (req, res, next) => {
  try {
    const exams = await examService.getExamsByTeacher(req.user.id);
    res.json(exams);
  } catch (err) {
    next(err);
  }
};

exports.getExamById = async (req, res, next) => {
  try {
    const exam = await examService.getExamById(parseInt(req.params.id));
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    next(err);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const exam = await examService.updateExam(
      parseInt(req.params.id),
      req.body
    );
    res.json(exam);
  } catch (err) {
    next(err);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    await examService.deleteExam(parseInt(req.params.id));
    res.json({ message: 'Exam deleted successfully' });
  } catch (err) {
    next(err);
  }
};
