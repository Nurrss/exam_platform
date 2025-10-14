const examService = require('../services/examService');

exports.createExam = async (req, res, next) => {
  try {
    const exam = await examService.createExam(req.user.id, req.body);
    res.status(201).json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};

exports.getMyExams = async (req, res, next) => {
  try {
    const exams = await examService.getMyExams(req.user.id);
    res.json({ success: true, data: exams });
  } catch (err) {
    next(err);
  }
};

exports.getExamById = async (req, res, next) => {
  try {
    const exam = await examService.getExamById(req.params.id, req.user);
    res.json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const updated = await examService.updateExam(
      req.params.id,
      req.user,
      req.body
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    await examService.deleteExam(req.params.id, req.user);
    res.json({ success: true, message: 'Экзамен удалён' });
  } catch (err) {
    next(err);
  }
};

exports.joinExam = async (req, res, next) => {
  try {
    const session = await examService.joinExam(
      req.user.id,
      req.params.examCode
    );
    res.json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};

exports.getAllExams = async (req, res, next) => {
  try {
    const exams = await examService.getAllExams();
    res.json({ success: true, data: exams });
  } catch (err) {
    next(err);
  }
};

exports.getExamByCode = async (req, res, next) => {
  try {
    const exam = await examService.getExamByCode(req.params.examCode);
    res.json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};
